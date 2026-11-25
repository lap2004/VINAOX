import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hashPassword } from './generate-password-hash.mjs';
import loginHandler from '../api/admin/login.mjs';
import logoutHandler from '../api/admin/logout.mjs';
import sessionHandler from '../api/admin/session.mjs';
import newsHandler from '../api/admin/news.mjs';
import productsHandler from '../api/admin/products.mjs';
import mediaHandler from '../api/admin/media.mjs';
import settingsHandler from '../api/admin/settings.mjs';

const PORT = Number(process.env.E2E_PORT || 4174);
const TEST_PASS = process.env.E2E_ADMIN_PASS || 'VinaxoE2ETest_2026!';

// In-memory mock of lap2004/VINAOX GitHub repository contents (initialized from workspace disk)
const mockGitFiles = new Map();
const mockGitAuditLog = [];

function seedDir(dirRel) {
  const full = path.join(process.cwd(), dirRel);
  if (!fs.existsSync(full)) return;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = `${dirRel}/${entry.name}`;
    if (entry.isDirectory()) seedDir(rel);
    else if (!entry.name.startsWith('.')) {
      const buf = fs.readFileSync(path.join(process.cwd(), rel));
      mockGitFiles.set(rel, {
        base64: buf.toString('base64'),
        sha: crypto.createHash('sha1').update(buf).digest('hex'),
        size: buf.length
      });
    }
  }
}
seedDir('content');
seedDir('public/uploads');

// Intercept GitHub REST API calls cleanly while forwarding everything else
const origFetch = globalThis.fetch;
globalThis.fetch = async (url, init = {}) => {
  const urlStr = typeof url === 'string' ? url : url.toString();
  const ghPrefix = 'https://api.github.com/repos/lap2004/VINAOX/contents/';
  if (!urlStr.startsWith(ghPrefix)) {
    return origFetch(url, init);
  }

  const parsed = new URL(urlStr);
  const repoPath = decodeURIComponent(parsed.pathname.replace('/repos/lap2004/VINAOX/contents/', '').replace(/\/+$/, ''));
  const method = (init.method || 'GET').toUpperCase();

  if (method === 'GET') {
    const exact = mockGitFiles.get(repoPath);
    if (exact) {
      const accept = (init.headers && (init.headers['Accept'] || init.headers['accept'])) || '';
      if (String(accept).includes('raw')) {
        return new Response(Buffer.from(exact.base64, 'base64'), { status: 200 });
      }
      return new Response(JSON.stringify({
        name: path.basename(repoPath),
        path: repoPath,
        sha: exact.sha,
        size: exact.size,
        content: exact.base64
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Check directory entries
    const prefix = repoPath ? repoPath + '/' : '';
    const entries = [];
    for (const [k, v] of mockGitFiles.entries()) {
      if (k.startsWith(prefix)) {
        const rest = k.slice(prefix.length);
        if (!rest.includes('/')) {
          entries.push({ name: rest, path: k, sha: v.sha, size: v.size, type: 'file' });
        }
      }
    }
    if (entries.length > 0) {
      return new Response(JSON.stringify(entries), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 });
  }

  if (method === 'PUT') {
    const body = JSON.parse(init.body);
    const buf = Buffer.from(body.content, 'base64');
    const newSha = crypto.createHash('sha1').update(buf).digest('hex');
    const commitSha = crypto.randomBytes(20).toString('hex');
    mockGitFiles.set(repoPath, { base64: body.content, sha: newSha, size: buf.length });
    mockGitAuditLog.push({ method: 'PUT', path: repoPath, branch: body.branch, message: body.message, commitSha });
    return new Response(JSON.stringify({ content: { sha: newSha }, commit: { sha: commitSha } }), { status: 200 });
  }

  if (method === 'DELETE') {
    const body = JSON.parse(init.body);
    mockGitFiles.delete(repoPath);
    const commitSha = crypto.randomBytes(20).toString('hex');
    mockGitAuditLog.push({ method: 'DELETE', path: repoPath, branch: body.branch, message: body.message, commitSha });
    return new Response(JSON.stringify({ commit: { sha: commitSha } }), { status: 200 });
  }

  return new Response('Unsupported', { status: 400 });
};

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function wrapRes(nodeRes) {
  let statusCode = 200;
  return {
    setHeader(k, v) {
      nodeRes.setHeader(k, v);
    },
    getHeader(k) {
      return nodeRes.getHeader(k);
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      nodeRes.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
      nodeRes.end(JSON.stringify(data));
      return this;
    },
    send(buf) {
      nodeRes.writeHead(statusCode);
      nodeRes.end(buf);
      return this;
    }
  };
}

async function startServer() {
  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD_HASH = await hashPassword(TEST_PASS);
  process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.GITHUB_REPO = 'lap2004/VINAOX';
  process.env.GITHUB_BRANCH = 'feature/vinaxo-custom-admin';
  process.env.GITHUB_TOKEN = 'mock-e2e-github-token';

  const distDir = path.join(process.cwd(), 'dist');

  const server = http.createServer(async (nodeReq, nodeRes) => {
    const urlObj = new URL(nodeReq.url || '/', `http://localhost:${PORT}`);
    const pathname = urlObj.pathname;

    // Test introspection endpoint for E2E verification (only lists non-secret Git audit log)
    if (pathname === '/__e2e__/git-audit') {
      nodeRes.writeHead(200, { 'Content-Type': 'application/json' });
      nodeRes.end(JSON.stringify({ commits: mockGitAuditLog }));
      return;
    }

    // Route Vercel Serverless Admin APIs
    if (pathname.startsWith('/api/admin/')) {
      const apiHandlers = {
        '/api/admin/login': loginHandler,
        '/api/admin/logout': logoutHandler,
        '/api/admin/session': sessionHandler,
        '/api/admin/news': newsHandler,
        '/api/admin/products': productsHandler,
        '/api/admin/media': mediaHandler,
        '/api/admin/settings': settingsHandler
      };

      const fn = apiHandlers[pathname];
      if (!fn) {
        nodeRes.writeHead(404, { 'Content-Type': 'application/json' });
        nodeRes.end(JSON.stringify({ error: 'Not Found' }));
        return;
      }

      let body;
      try {
        body = await parseJsonBody(nodeReq);
      } catch {
        body = undefined;
      }

      const query = {};
      for (const [k, v] of urlObj.searchParams.entries()) {
        query[k] = v;
      }

      const vercelReq = {
        method: nodeReq.method,
        headers: nodeReq.headers,
        socket: nodeReq.socket,
        query,
        body
      };

      await fn(vercelReq, wrapRes(nodeRes));
      return;
    }

    // Static assets from dist/
    const safeRel = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
    let candidate = path.join(distDir, safeRel);
    if (safeRel && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      const ext = path.extname(candidate).toLowerCase();
      nodeRes.writeHead(200, { 'Content-Type': MIME_MAP[ext] || 'application/octet-stream' });
      fs.createReadStream(candidate).pipe(nodeRes);
      return;
    }

    // SPA rewrite fallback (matches vercel.json)
    const indexHtml = path.join(distDir, 'index.html');
    nodeRes.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexHtml).pipe(nodeRes);
  });

  server.listen(PORT, '127.0.0.1', () => {
    console.log(`E2E_SERVER_READY:${PORT}`);
  });
}

startServer();
