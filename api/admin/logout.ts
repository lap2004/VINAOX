import { clearSessionCookie } from '../lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Set-Cookie', clearSessionCookie());
  return res.status(200).json({
    ok: true,
    message: 'Đã đăng xuất thành công'
  });
}
