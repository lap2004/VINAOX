import { getAuthenticatedUser, createCsrfToken } from '../lib/auth.js';
import { applySecurityHeaders } from '../lib/security.js';
import { getPublicRepoMeta, hasGitHubToken } from '../lib/github.js';

export default async function handler(req: any, res: any) {
  applySecurityHeaders(res);

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

  let csrfToken = '';
  try {
    csrfToken = createCsrfToken(user.sessionToken);
  } catch {
    return res.status(200).json({ authenticated: false, user: null });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      username: user.username,
      role: 'admin'
    },
    csrfToken,
    repo: getPublicRepoMeta(),
    githubConfigured: hasGitHubToken()
  });
}
