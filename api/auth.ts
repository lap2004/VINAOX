// Vercel Serverless Function: GitHub OAuth Authorization Entry Point for Decap CMS
import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

interface VercelRequest extends IncomingMessage {
  query?: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => void;
  send: (data: string) => void;
  setHeader: (name: string, value: string | string[]) => this;
}

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({
      error: 'GITHUB_CLIENT_ID is not configured in Vercel Environment Variables.',
      setup_guide: 'Vui lòng truy cập Vercel Project Settings > Environment Variables và thêm GITHUB_CLIENT_ID và GITHUB_CLIENT_SECRET.'
    });
  }

  // Generate secure random state token to prevent CSRF attacks
  const state = crypto.randomBytes(16).toString('hex');

  // Determine host and protocol
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'vinaxo.net';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = process.env.OAUTH_REDIRECT_URL || `${proto}://${host}/api/callback`;

  // Minimal necessary scope for Decap CMS Git operations
  // For public or private repositories, 'repo' scope is required by Decap CMS to create commits/PRs
  const scope = req.query?.scope || 'repo';

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);

  // Set secure HTTP-only state cookie for verification in callback
  res.setHeader('Set-Cookie', `decap_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600; ${proto === 'https' ? 'Secure;' : ''}`);
  res.setHeader('Location', authUrl.toString());
  return res.status(302).send('Redirecting to GitHub...');
}
