import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'vinaxo_admin_session';
const DEFAULT_SESSION_DURATION_HOURS = 24;

/**
 * Verifies a plaintext password against a stored scrypt hash string:
 * format: `scrypt:salt:derivedKeyHex`
 */
export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!storedHash || !storedHash.startsWith('scrypt:')) {
      return resolve(false);
    }

    const parts = storedHash.split(':');
    if (parts.length !== 3) {
      return resolve(false);
    }

    const salt = parts[1];
    const originalDerivedKey = Buffer.from(parts[2], 'hex');

    crypto.scrypt(password, salt, originalDerivedKey.length, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
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
  const secret = process.env.SESSION_SECRET || 'vinaxo-default-dev-session-secret-must-be-configured';
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + durationHours * 3600;

  const payload = `${username}.${issuedAt}.${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  return `${payload}.${signature}`;
}

/**
 * Verifies the validity and expiration of an HMAC-SHA256 signed session token.
 */
export function verifySessionToken(token: string | undefined): { valid: boolean; username?: string } {
  if (!token) return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 4) return { valid: false };

  const [username, issuedAtStr, expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  const now = Math.floor(Date.now() / 1000);

  // Check expiration
  if (isNaN(expiresAt) || now > expiresAt) {
    return { valid: false };
  }

  const secret = process.env.SESSION_SECRET || 'vinaxo-default-dev-session-secret-must-be-configured';
  const payload = `${username}.${issuedAtStr}.${expiresAtStr}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
    if (!isMatch) return { valid: false };
    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

/**
 * Parses cookies from HTTP request header.
 */
export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  });

  return cookies;
}

/**
 * Creates HttpOnly, Secure, SameSite=Lax Set-Cookie string.
 */
export function createSessionCookie(token: string, maxAgeHours = DEFAULT_SESSION_DURATION_HOURS): string {
  const maxAgeSeconds = maxAgeHours * 3600;
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}; ${isProd ? 'Secure;' : ''}`;
}

/**
 * Creates cookie string to clear session on logout.
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

/**
 * Returns authenticated user info from request, or null if unauthenticated.
 */
export function getAuthenticatedUser(req: any): { username: string } | null {
  const cookieHeader = req.headers?.cookie;
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  const { valid, username } = verifySessionToken(sessionToken);

  if (valid && username) {
    return { username };
  }

  return null;
}
