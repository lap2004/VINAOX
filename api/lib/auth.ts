import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'vinaxo_admin_session';
export const DEFAULT_SESSION_DURATION_HOURS = 24;

const DEV_FALLBACK_SECRET = 'vinaxo-local-dev-only-session-secret-not-for-production-use-32bytes';

export function isProductionRuntime(): boolean {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

export function shouldUseSecureCookie(req?: any): boolean {
  const proto = req?.headers?.['x-forwarded-proto'];
  if (typeof proto === 'string' && proto.split(',')[0].trim() === 'https') {
    return true;
  }
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

export function getSessionSecret(): string {
  const configured = (process.env.SESSION_SECRET || '').trim();
  if (configured.length >= 32) {
    return configured;
  }

  if (isProductionRuntime()) {
    throw new Error('SESSION_SECRET chưa được cấu hình hợp lệ (yêu cầu tối thiểu 32 ký tự trên môi trường Production/Preview).');
  }

  return DEV_FALLBACK_SECRET;
}

/**
 * Constant-time username comparison via SHA-256 digests so timing never leaks valid usernames.
 */
export function verifyUsername(inputUsername: string, expectedUsername: string): boolean {
  const normalizedInput = (inputUsername || '').trim().toLowerCase();
  const normalizedExpected = (expectedUsername || '').trim().toLowerCase();
  if (!normalizedInput || !normalizedExpected) {
    return false;
  }

  const inputDigest = crypto.createHash('sha256').update(normalizedInput, 'utf8').digest();
  const expectedDigest = crypto.createHash('sha256').update(normalizedExpected, 'utf8').digest();
  return crypto.timingSafeEqual(inputDigest, expectedDigest);
}

/**
 * Verifies a plaintext password against a stored scrypt hash string.
 * Supports:
 * - `scrypt:<saltHex>:<derivedKeyHex>` (from generate-password-hash.mjs)
 * - `scrypt:N:r:p:<saltHex>:<derivedKeyHex>` (explicit parameter format)
 */
export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!password || !storedHash || typeof storedHash !== 'string') {
      return resolve(false);
    }

    const cleanHash = storedHash.trim();
    if (!cleanHash.startsWith('scrypt:')) {
      return resolve(false);
    }

    const parts = cleanHash.split(':');
    let salt = '';
    let keyHex = '';
    let N = 16384;
    let r = 8;
    let p = 1;

    if (parts.length === 3) {
      salt = parts[1];
      keyHex = parts[2];
    } else if (parts.length === 6) {
      const parsedN = parseInt(parts[1], 10);
      const parsedR = parseInt(parts[2], 10);
      const parsedP = parseInt(parts[3], 10);
      if (isNaN(parsedN) || isNaN(parsedR) || isNaN(parsedP) || parsedN < 16384 || parsedR < 1 || parsedP < 1) {
        return resolve(false);
      }
      N = parsedN;
      r = parsedR;
      p = parsedP;
      salt = parts[4];
      keyHex = parts[5];
    } else {
      return resolve(false);
    }

    if (!salt || !keyHex || !/^[0-9a-f]+$/i.test(keyHex) || keyHex.length < 64 || keyHex.length % 2 !== 0) {
      return resolve(false);
    }

    const originalDerivedKey = Buffer.from(keyHex, 'hex');

    crypto.scrypt(password, salt, originalDerivedKey.length, { N, r, p }, (err, derivedKey) => {
      if (err) return resolve(false);

      try {
        const matches = crypto.timingSafeEqual(originalDerivedKey, derivedKey);
        resolve(matches);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Creates an HMAC-SHA256 signed session token:
 * format: `username.issuedAt.expiresAt.signatureHex`
 */
export function createSessionToken(username: string, durationHours = DEFAULT_SESSION_DURATION_HOURS): string {
  const secret = getSessionSecret();
  const cleanUser = encodeURIComponent(username.trim());
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + durationHours * 3600;

  const payload = `${cleanUser}.${issuedAt}.${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  return `${payload}.${signature}`;
}

/**
 * Verifies the validity and expiration of an HMAC-SHA256 signed session token.
 */
export function verifySessionToken(token: string | undefined): { valid: boolean; username?: string } {
  if (!token || typeof token !== 'string' || token.length > 512) {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 4) return { valid: false };

  const [rawUser, issuedAtStr, expiresAtStr, signature] = parts;
  if (!rawUser || !/^[0-9]+$/.test(issuedAtStr) || !/^[0-9]+$/.test(expiresAtStr) || !/^[0-9a-f]{64}$/i.test(signature)) {
    return { valid: false };
  }

  const issuedAt = parseInt(issuedAtStr, 10);
  const expiresAt = parseInt(expiresAtStr, 10);
  const now = Math.floor(Date.now() / 1000);

  if (isNaN(issuedAt) || isNaN(expiresAt) || now > expiresAt || issuedAt > now + 60) {
    return { valid: false };
  }

  let secret = '';
  try {
    secret = getSessionSecret();
  } catch {
    return { valid: false };
  }

  const payload = `${rawUser}.${issuedAtStr}.${expiresAtStr}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
    if (!isMatch) return { valid: false };
    return { valid: true, username: decodeURIComponent(rawUser) };
  } catch {
    return { valid: false };
  }
}

/**
 * Derives an HMAC-SHA256 anti-CSRF token bound to the current verified session token.
 */
export function createCsrfToken(sessionToken: string): string {
  const secret = getSessionSecret();
  return crypto.createHmac('sha256', secret).update(`vinaxo-csrf:${sessionToken}`).digest('hex');
}

/**
 * Verifies the anti-CSRF token in constant time.
 */
export function verifyCsrfToken(sessionToken: string, providedCsrfToken: string | undefined): boolean {
  if (!sessionToken || !providedCsrfToken || !/^[0-9a-f]{64}$/i.test(providedCsrfToken)) {
    return false;
  }

  try {
    const expected = createCsrfToken(sessionToken);
    return crypto.timingSafeEqual(
      Buffer.from(providedCsrfToken.toLowerCase(), 'hex'),
      Buffer.from(expected.toLowerCase(), 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Parses cookies from HTTP request header safely.
 */
export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader || typeof cookieHeader !== 'string') return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const eqIndex = cookie.indexOf('=');
    if (eqIndex > 0) {
      const name = cookie.slice(0, eqIndex).trim();
      const val = cookie.slice(eqIndex + 1).trim();
      if (name) {
        try {
          cookies[name] = decodeURIComponent(val);
        } catch {
          cookies[name] = val;
        }
      }
    }
  });

  return cookies;
}

/**
 * Creates HttpOnly, Secure (in HTTPS/prod), SameSite=Lax Set-Cookie string.
 */
export function createSessionCookie(token: string, maxAgeHours = DEFAULT_SESSION_DURATION_HOURS, req?: any): string {
  const maxAgeSeconds = maxAgeHours * 3600;
  const isSecure = shouldUseSecureCookie(req);
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${isSecure ? '; Secure' : ''}`;
}

/**
 * Creates cookie string to clear session reliably on logout.
 */
export function clearSessionCookie(req?: any): string {
  const isSecure = shouldUseSecureCookie(req);
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${isSecure ? '; Secure' : ''}`;
}

/**
 * Returns authenticated user and raw session token from request, or null if unauthenticated.
 */
export function getAuthenticatedUser(req: any): { username: string; sessionToken: string } | null {
  const cookieHeader = req?.headers?.cookie;
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  const { valid, username } = verifySessionToken(sessionToken);

  if (valid && username && sessionToken) {
    return { username, sessionToken };
  }

  return null;
}
