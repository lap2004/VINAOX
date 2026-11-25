import {
  verifyPassword,
  verifyUsername,
  createSessionToken,
  createSessionCookie,
  createCsrfToken
} from '../lib/auth.js';
import { applySecurityHeaders, getClientIp, validateCsrfAndOrigin } from '../lib/security.js';
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearLoginRateLimit
} from '../lib/rateLimit.js';
import { getPublicRepoMeta } from '../lib/github.js';

export default async function handler(req: any, res: any) {
  applySecurityHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const csrfCheck = validateCsrfAndOrigin(req, { requireCsrfToken: false });
  if (!csrfCheck.ok) {
    return res.status(csrfCheck.status).json({ error: csrfCheck.error });
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkLoginRateLimit(req, clientIp);
  res.setHeader('X-RateLimit-Limit', String(rateLimit.limit));
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    const waitMinutes = Math.ceil(rateLimit.retryAfterSeconds / 60);
    return res.status(429).json({
      error: `Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${waitMinutes} phút.`
    });
  }

  try {
    const body = req.body || {};
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username.trim() || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
    }

    if (username.length > 100 || password.length > 200) {
      return res.status(400).json({ error: 'Thông tin đăng nhập vượt quá độ dài cho phép.' });
    }

    const expectedUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
    const storedHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();

    if (!storedHash) {
      return res.status(500).json({
        error: 'Hệ thống chưa được cấu hình ADMIN_PASSWORD_HASH trên máy chủ.'
      });
    }

    // Constant-time evaluation of both username and scrypt password hash
    const isUsernameMatch = verifyUsername(username, expectedUsername);
    const isPasswordValid = await verifyPassword(password, storedHash);

    if (!isUsernameMatch || !isPasswordValid) {
      const nextRl = recordFailedLoginAttempt(req, res, clientIp);
      res.setHeader('X-RateLimit-Remaining', String(nextRl.remaining));
      return res.status(401).json({
        error: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
      });
    }

    const normalizedUser = expectedUsername;
    const token = createSessionToken(normalizedUser);
    const csrfToken = createCsrfToken(token);
    const sessionCookie = createSessionCookie(token, undefined, req);
    const clearRlCookie = clearLoginRateLimit(req, clientIp);

    res.setHeader('Set-Cookie', [sessionCookie, clearRlCookie]);
    res.setHeader('X-RateLimit-Remaining', String(rateLimit.limit));

    return res.status(200).json({
      ok: true,
      message: 'Đăng nhập thành công',
      user: {
        username: normalizedUser,
        role: 'admin'
      },
      csrfToken,
      repo: getPublicRepoMeta()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Lỗi hệ thống khi xác thực.' });
  }
}
