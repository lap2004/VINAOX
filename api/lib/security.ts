import { verifyCsrfToken } from './auth';

/**
 * Applies mandatory no-cache & anti-indexing security headers to all /api/admin/* responses.
 */
export function applySecurityHeaders(res: any): void {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

/**
 * Resolves best-effort client IP from Vercel / reverse-proxy headers.
 */
export function getClientIp(req: any): string {
  const forwarded = req?.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req?.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req?.socket?.remoteAddress || 'unknown';
}

function normalizeHost(hostHeader: string | undefined): string {
  if (!hostHeader || typeof hostHeader !== 'string') return '';
  return hostHeader.split(',')[0].trim().toLowerCase();
}

/**
 * Enforces multi-layered CSRF & Origin defense for state-changing requests (POST/PUT/PATCH/DELETE).
 */
export function validateCsrfAndOrigin(
  req: any,
  options: { sessionToken?: string; requireCsrfToken?: boolean } = {}
): { ok: boolean; status: number; error?: string } {
  const method = (req?.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return { ok: true, status: 200 };
  }

  // 1. Block cross-site browser requests explicitly marked by Fetch Metadata
  const secFetchSite = (req?.headers?.['sec-fetch-site'] || '').toLowerCase();
  if (secFetchSite === 'cross-site') {
    return { ok: false, status: 403, error: 'Yêu cầu cross-site bị từ chối vì lý do bảo mật (CSRF).' };
  }

  // 2. Require application/json content-type (blocks standard HTML <form> cross-origin POSTs)
  const contentType = (req?.headers?.['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return { ok: false, status: 415, error: 'Content-Type phải là application/json.' };
  }

  // 3. Enforce custom XMLHttpRequest header (triggers CORS preflight; blocked cross-origin)
  const requestedWith = (req?.headers?.['x-requested-with'] || '').trim();
  if (requestedWith !== 'XMLHttpRequest') {
    return { ok: false, status: 403, error: 'Thiếu header bảo mật xác thực nguồn gốc yêu cầu.' };
  }

  // 4. Verify Origin or Referer host matches the target Host
  const expectedHost = normalizeHost(req?.headers?.['x-forwarded-host'] || req?.headers?.host);
  const originHeader = req?.headers?.origin;
  const refererHeader = req?.headers?.referer;

  if (expectedHost) {
    if (originHeader && typeof originHeader === 'string') {
      try {
        const parsedOrigin = new URL(originHeader);
        if (parsedOrigin.host.toLowerCase() !== expectedHost) {
          return { ok: false, status: 403, error: 'Origin không hợp lệ (CSRF protection).' };
        }
      } catch {
        return { ok: false, status: 403, error: 'Header Origin không hợp lệ.' };
      }
    } else if (refererHeader && typeof refererHeader === 'string') {
      try {
        const parsedReferer = new URL(refererHeader);
        if (parsedReferer.host.toLowerCase() !== expectedHost) {
          return { ok: false, status: 403, error: 'Referer không hợp lệ (CSRF protection).' };
        }
      } catch {
        return { ok: false, status: 403, error: 'Header Referer không hợp lệ.' };
      }
    }
  }

  // 5. Verify session-bound HMAC CSRF token for authenticated mutating calls
  if (options.requireCsrfToken) {
    const providedCsrf = req?.headers?.['x-csrf-token'];
    if (!options.sessionToken || !verifyCsrfToken(options.sessionToken, providedCsrf)) {
      return { ok: false, status: 403, error: 'Phiên CSRF token không hợp lệ hoặc đã hết hạn. Vui lòng tải lại trang.' };
    }
  }

  return { ok: true, status: 200 };
}

/**
 * Validates and normalizes content slugs strictly (lowercase alphanumeric & hyphen).
 */
export function sanitizeSlug(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalized || normalized.length > 120 || !/^[a-z0-9][a-z0-9-]*$/.test(normalized)) {
    return null;
  }
  return normalized;
}

/**
 * Checks that URL is either http(s) or a safe site-relative path starting with a single slash.
 * Rejects javascript:, data:, vbscript:, file:, or protocol-relative //.
 */
export function sanitizeSafeUrl(raw: unknown, allowRelative = false): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
}

/**
 * Strips newlines and control characters from Git commit messages.
 */
export function sanitizeCommitText(text: unknown, maxLen = 100): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

/**
 * Clones an object while dropping prototype-pollution keys and transient metadata fields like `sha`.
 */
export function stripUnsafeKeys<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {};
  }

  const clean: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype' || key === 'sha' || key === '_sha') {
      continue;
    }
    clean[key] = obj[key];
  }
  return clean;
}
