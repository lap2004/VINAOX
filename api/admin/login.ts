import { verifyPassword, createSessionToken, createSessionCookie } from '../lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const storedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!storedHash) {
      return res.status(500).json({
        error: 'ADMIN_PASSWORD_HASH chưa được thiết lập trên Vercel Environment Variables. Vui lòng chạy script generate-password-hash.mjs để cấu hình.'
      });
    }

    // Timing-safe user verification
    const isUsernameMatch = username.trim().toLowerCase() === expectedUsername.toLowerCase();
    const isPasswordValid = await verifyPassword(password, storedHash);

    if (!isUsernameMatch || !isPasswordValid) {
      // Intentionally generic error message to prevent account enumeration
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    // Success: Generate secure signed session token
    const token = createSessionToken(username);
    const cookie = createSessionCookie(token);

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      ok: true,
      message: 'Đăng nhập thành công',
      user: {
        username: username,
        role: 'admin'
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Lỗi hệ thống khi xác thực.' });
  }
}
