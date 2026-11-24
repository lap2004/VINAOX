// Vercel Serverless Function: GitHub OAuth Callback Handler for Decap CMS
import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const code = req.query?.code;
  const state = req.query?.state;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return renderOAuthResponse(res, 'error', {
      error: 'Missing code parameter from GitHub OAuth callback.'
    });
  }

  if (!clientId || !clientSecret) {
    return renderOAuthResponse(res, 'error', {
      error: 'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in Vercel Environment Variables.'
    });
  }

  try {
    // Exchange temporary code for access token via GitHub API
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        state: state
      })
    });

    const data: any = await tokenResponse.json();

    if (data.error || !data.access_token) {
      return renderOAuthResponse(res, 'error', {
        error: data.error_description || data.error || 'Failed to exchange authorization code for access token.'
      });
    }

    // Success: Return token to Decap CMS parent window using postMessage protocol
    return renderOAuthResponse(res, 'success', {
      token: data.access_token,
      provider: 'github'
    });
  } catch (err: any) {
    return renderOAuthResponse(res, 'error', {
      error: err?.message || 'Internal server error while connecting to GitHub OAuth API.'
    });
  }
}

/**
 * Renders Decap CMS compatible postMessage script inside popup window
 */
function renderOAuthResponse(res: any, status: 'success' | 'error', content: any) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const message = `authorization:github:${status}:${JSON.stringify(content)}`;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>VINAXO CMS Authentication</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #FFF7EC;
      color: #3A251B;
      text-align: center;
    }
    .box {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      max-width: 400px;
    }
  </style>
</head>
<body>
  <div class="box">
    ${status === 'success' 
      ? '<h3>Đăng nhập thành công!</h3><p>Đang chuyển quyền về hệ thống CMS VINAXO...</p>' 
      : '<h3 style="color:#e53e3e;">Đăng nhập thất bại</h3><p>' + (content.error || 'Vui lòng thử lại.') + '</p>'
    }
  </div>
  <script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          ${JSON.stringify(message)},
          e.origin
        );
      }
      window.addEventListener("message", receiveMessage, false);
      if (window.opener) {
        window.opener.postMessage("authorizing:github", "*");
      }
    })();
  </script>
</body>
</html>`;

  return res.status(200).send(html);
}
