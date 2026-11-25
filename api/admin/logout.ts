import { clearSessionCookie, getAuthenticatedUser } from '../lib/auth.js';
import { applySecurityHeaders, validateCsrfAndOrigin } from '../lib/security.js';

export default async function handler(req: any, res: any) {
  applySecurityHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  const csrfCheck = validateCsrfAndOrigin(req, {
    sessionToken: user?.sessionToken,
    requireCsrfToken: Boolean(user)
  });
  if (!csrfCheck.ok) {
    return res.status(csrfCheck.status).json({ error: csrfCheck.error });
  }

  res.setHeader('Set-Cookie', clearSessionCookie(req));
  return res.status(200).json({
    ok: true,
    message: 'Đã đăng xuất thành công'
  });
}
