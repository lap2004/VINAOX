import { getAuthenticatedUser } from '../lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);

  if (!user) {
    return res.status(200).json({
      authenticated: false,
      user: null
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      username: user.username,
      role: 'admin'
    }
  });
}
