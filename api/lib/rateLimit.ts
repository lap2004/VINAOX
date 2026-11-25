import crypto from 'crypto';
import { getSessionSecret, parseCookies, shouldUseSecureCookie } from './auth';

const RL_COOKIE_NAME = 'vinaxo_login_rl';
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const API_MAX_MUTATIONS_PER_MIN = 45;
const API_WINDOW_MS = 60 * 1000;

interface RateEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateEntry>();

function pruneMemoryStore(now: number) {
  if (memoryStore.size > 500) {
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetAt) {
        memoryStore.delete(key);
      }
    }
  }
}

function signCookieState(count: number, resetAt: number): string {
  let secret = 'vinaxo-dev-rl-fallback';
  try {
    secret = getSessionSecret();
  } catch {
    // Wait: getSessionSecret only throws in prod if unconfigured, in which case login already fails
  }
  const payload = `${count}.${resetAt}`;
  const sig = crypto.createHmac('sha256', secret).update(`rl:${payload}`).digest('hex');
  return `${payload}.${sig}`;
}

function verifyCookieState(raw: string | undefined, now: number): RateEntry | null {
  if (!raw || typeof raw !== 'string') return null;
  const parts = raw.split('.');
  if (parts.length !== 3) return null;

  const [countStr, resetAtStr, sig] = parts;
  if (!/^[0-9]+$/.test(countStr) || !/^[0-9]+$/.test(resetAtStr) || !/^[0-9a-f]{64}$/i.test(sig)) {
    return null;
  }

  let secret = 'vinaxo-dev-rl-fallback';
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  const expectedSig = crypto.createHmac('sha256', secret).update(`rl:${countStr}.${resetAtStr}`).digest('hex');
  try {
    const valid = crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'));
    if (!valid) return null;
  } catch {
    return null;
  }

  const count = parseInt(countStr, 10);
  const resetAt = parseInt(resetAtStr, 10);
  if (now > resetAt) return null;
  return { count, resetAt };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  limit: number;
}

/**
 * Checks login rate limit across both in-memory IP window and signed HttpOnly cookie counter.
 */
export function checkLoginRateLimit(req: any, clientIp: string): RateLimitResult {
  const now = Date.now();
  pruneMemoryStore(now);

  const memKey = `login:${clientIp}`;
  const memEntry = memoryStore.get(memKey);
  const activeMem = memEntry && now < memEntry.resetAt ? memEntry : null;

  const cookies = parseCookies(req?.headers?.cookie);
  const cookieEntry = verifyCookieState(cookies[RL_COOKIE_NAME], now);

  const highestCount = Math.max(activeMem?.count || 0, cookieEntry?.count || 0);
  const resetAt = Math.max(activeMem?.resetAt || 0, cookieEntry?.resetAt || now + LOGIN_WINDOW_MS);

  if (highestCount >= LOGIN_MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      limit: LOGIN_MAX_ATTEMPTS
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - highestCount),
    retryAfterSeconds: 0,
    limit: LOGIN_MAX_ATTEMPTS
  };
}

/**
 * Records a failed login attempt in memory + returns Set-Cookie string for persistent defense.
 */
export function recordFailedLoginAttempt(req: any, res: any, clientIp: string): RateLimitResult {
  const now = Date.now();
  const memKey = `login:${clientIp}`;
  const currentMem = memoryStore.get(memKey);
  const cookies = parseCookies(req?.headers?.cookie);
  const cookieEntry = verifyCookieState(cookies[RL_COOKIE_NAME], now);

  let nextCount = 1;
  let resetAt = now + LOGIN_WINDOW_MS;

  if (currentMem && now < currentMem.resetAt) {
    nextCount = Math.max(nextCount, currentMem.count + 1);
    resetAt = currentMem.resetAt;
  }
  if (cookieEntry && now < cookieEntry.resetAt) {
    nextCount = Math.max(nextCount, cookieEntry.count + 1);
    resetAt = Math.max(resetAt, cookieEntry.resetAt);
  }

  memoryStore.set(memKey, { count: nextCount, resetAt });

  const isSecure = shouldUseSecureCookie(req);
  const maxAgeSeconds = Math.max(60, Math.ceil((resetAt - now) / 1000));
  const cookieVal = signCookieState(nextCount, resetAt);
  res.setHeader(
    'Set-Cookie',
    `${RL_COOKIE_NAME}=${encodeURIComponent(cookieVal)}; Path=/api/admin/login; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${isSecure ? '; Secure' : ''}`
  );

  return {
    allowed: nextCount < LOGIN_MAX_ATTEMPTS,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - nextCount),
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    limit: LOGIN_MAX_ATTEMPTS
  };
}

/**
 * Resets login rate-limit state upon successful authentication.
 */
export function clearLoginRateLimit(req: any, clientIp: string): string {
  memoryStore.delete(`login:${clientIp}`);
  const isSecure = shouldUseSecureCookie(req);
  return `${RL_COOKIE_NAME}=; Path=/api/admin/login; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${isSecure ? '; Secure' : ''}`;
}

/**
 * Protects authenticated mutating endpoints from high-frequency abuse.
 */
export function checkApiMutationRateLimit(clientKey: string): RateLimitResult {
  const now = Date.now();
  pruneMemoryStore(now);

  const memKey = `mut:${clientKey}`;
  const entry = memoryStore.get(memKey);

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(memKey, { count: 1, resetAt: now + API_WINDOW_MS });
    return {
      allowed: true,
      remaining: API_MAX_MUTATIONS_PER_MIN - 1,
      retryAfterSeconds: 0,
      limit: API_MAX_MUTATIONS_PER_MIN
    };
  }

  entry.count += 1;
  memoryStore.set(memKey, entry);

  if (entry.count > API_MAX_MUTATIONS_PER_MIN) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      limit: API_MAX_MUTATIONS_PER_MIN
    };
  }

  return {
    allowed: true,
    remaining: API_MAX_MUTATIONS_PER_MIN - entry.count,
    retryAfterSeconds: 0,
    limit: API_MAX_MUTATIONS_PER_MIN
  };
}
