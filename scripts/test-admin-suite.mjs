import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { hashPassword } from './generate-password-hash.mjs';
import {
  verifyPassword,
  verifyUsername,
  createSessionToken,
  verifySessionToken,
  createCsrfToken,
  verifyCsrfToken,
  createSessionCookie,
  clearSessionCookie,
  parseCookies
} from '../server/lib/auth.ts';
import {
  validateCsrfAndOrigin,
  sanitizeSlug,
  sanitizeSafeUrl,
  sanitizeCommitText,
  stripUnsafeKeys
} from '../server/lib/security.ts';
import {
  validatePath,
  getPublicRepoMeta,
  commitFile,
  commitMediaFile
} from '../server/lib/github.ts';
import loginHandler from '../api/admin/login.mjs';
import logoutHandler from '../api/admin/logout.mjs';
import sessionHandler from '../api/admin/session.mjs';
import newsHandler from '../api/admin/news.mjs';
import productsHandler from '../api/admin/products.mjs';
import mediaHandler from '../api/admin/media.mjs';
import settingsHandler from '../api/admin/settings.mjs';
import deployStatusHandler from '../api/admin/deployStatus.mjs';
import { validateNewsArticle, mergeNewsArticle } from '../src/shared/schemas/newsSchema.ts';
import { validateProduct, mergeProduct } from '../src/shared/schemas/productSchema.ts';
import { validateCompanySettings, validateBrochureSettings } from '../src/shared/schemas/settingsSchema.ts';
import { validateMediaUpload } from '../src/shared/schemas/mediaSchema.ts';
import { getAllArticles, toNewsItem } from '../src/services/contentService.ts';

console.log('=== VINAXO CUSTOM ADMIN SECURITY & INTEGRATION TEST SUITE ===\n');

function createMockRes() {
  const headers = {};
  const res = {
    statusCode: 200,
    headers,
    body: null,
    setHeader(k, v) {
      headers[k.toLowerCase()] = v;
    },
    getHeader(k) {
      return headers[k.toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    send(buf) {
      this.body = buf;
      return this;
    }
  };
  return res;
}

async function runTests() {
  let passed = 0;
  let total = 0;

  async function runCase(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err);
    }
  }

  // Configure temporary ephemeral test environment variables (zero secrets saved)
  const testPassword = 'Test_Admin_Pass!_' + crypto.randomBytes(8).toString('hex');
  const testHash = await hashPassword(testPassword);
  const testSecret = crypto.randomBytes(32).toString('hex');

  process.env.ADMIN_USERNAME = 'admin';
  process.env.ADMIN_PASSWORD_HASH = testHash;
  process.env.SESSION_SECRET = testSecret;
  process.env.GITHUB_REPO = 'lap2004/VINAOX';
  process.env.GITHUB_BRANCH = 'feature/vinaxo-custom-admin';
  delete process.env.GITHUB_TOKEN;

  // 1. Auth & scrypt tests
  await runCase('Auth: scrypt password hashing + constant-time username verification', async () => {
    assert(await verifyPassword(testPassword, testHash), 'Correct password must verify');
    assert.strictEqual(await verifyPassword('WrongPass', testHash), false, 'Wrong password must fail');
    assert.strictEqual(verifyUsername(' ADMIN ', 'admin'), true, 'Normalized username should match');
    assert.strictEqual(verifyUsername('root', 'admin'), false, 'Invalid username must fail');
  });

  // 2. Production fail-closed SESSION_SECRET check
  await runCase('Auth: Fails closed in Production if SESSION_SECRET is missing or short', async () => {
    const prevEnv = process.env.NODE_ENV;
    const prevSecret = process.env.SESSION_SECRET;
    try {
      process.env.NODE_ENV = 'production';
      process.env.SESSION_SECRET = 'short';
      assert.throws(() => createSessionToken('admin'), /SESSION_SECRET/);
    } finally {
      process.env.NODE_ENV = prevEnv;
      process.env.SESSION_SECRET = prevSecret;
    }
  });

  // 3. Session & CSRF tokens
  await runCase('Session & CSRF: Signing, tamper detection, cookie clearing parity', async () => {
    const token = createSessionToken('admin', 24);
    assert.strictEqual(verifySessionToken(token).valid, true);
    const parts = token.split('.');
    parts[0] = 'attacker';
    assert.strictEqual(verifySessionToken(parts.join('.')).valid, false, 'Tampered token must be rejected');

    const csrf = createCsrfToken(token);
    assert.strictEqual(verifyCsrfToken(token, csrf), true);
    assert.strictEqual(verifyCsrfToken(token, '0'.repeat(64)), false);

    const setCookie = createSessionCookie(token, 24, { headers: { 'x-forwarded-proto': 'https' } });
    const clearCookie = clearSessionCookie({ headers: { 'x-forwarded-proto': 'https' } });
    assert(setCookie.includes('HttpOnly') && setCookie.includes('SameSite=Lax') && setCookie.includes('Secure'));
    assert(clearCookie.includes('HttpOnly') && clearCookie.includes('Max-Age=0') && clearCookie.includes('Secure'));
    assert.strictEqual(parseCookies('vinaxo_admin_session=' + encodeURIComponent(token)).vinaxo_admin_session, token);
  });

  // 4. CSRF & Origin middleware tests
  await runCase('Security: Blocks cross-site requests, mismatched Origin, missing headers, bad Content-Type', async () => {
    const sessionToken = createSessionToken('admin', 1);
    const csrfToken = createCsrfToken(sessionToken);

    // Cross-site blocked
    const r1 = validateCsrfAndOrigin({
      method: 'POST',
      headers: { 'sec-fetch-site': 'cross-site', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest' }
    });
    assert.strictEqual(r1.ok, false);
    assert.strictEqual(r1.status, 403);

    // Non-JSON form POST blocked
    const r2 = validateCsrfAndOrigin({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-requested-with': 'XMLHttpRequest' }
    });
    assert.strictEqual(r2.ok, false);
    assert.strictEqual(r2.status, 415);

    // Mismatched Origin blocked
    const r3 = validateCsrfAndOrigin({
      method: 'POST',
      headers: {
        host: 'vinaxo.net',
        origin: 'https://evil.com',
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-csrf-token': csrfToken
      }
    }, { sessionToken, requireCsrfToken: true });
    assert.strictEqual(r3.ok, false);
    assert.strictEqual(r3.status, 403);

    // Missing CSRF token blocked
    const r4 = validateCsrfAndOrigin({
      method: 'POST',
      headers: {
        host: 'vinaxo.net',
        origin: 'https://vinaxo.net',
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest'
      }
    }, { sessionToken, requireCsrfToken: true });
    assert.strictEqual(r4.ok, false);
    assert.strictEqual(r4.status, 403);

    // Valid request passes
    const r5 = validateCsrfAndOrigin({
      method: 'POST',
      headers: {
        host: 'vinaxo.net',
        origin: 'https://vinaxo.net',
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-csrf-token': csrfToken
      }
    }, { sessionToken, requireCsrfToken: true });
    assert.strictEqual(r5.ok, true);
  });

  // 5. Path allowlist, Slug & XSS sanitizers
  await runCase('Security: Path traversal, URL XSS, and prototype pollution blocked', async () => {
    assert.strictEqual(validatePath('content/news/test.json'), true);
    assert.strictEqual(validatePath('public/uploads/news/img.webp'), true);
    assert.strictEqual(validatePath('../.env'), false);
    assert.strictEqual(validatePath('content/news/../../package.json'), false);
    assert.strictEqual(validatePath('src/App.tsx'), false);
    assert.strictEqual(validatePath('api/lib/auth.ts'), false);
    assert.strictEqual(validatePath('.github/workflows/deploy.yml'), false);

    assert.strictEqual(sanitizeSlug('Valid-Slug-2026'), 'valid-slug-2026');
    assert.strictEqual(sanitizeSlug('../../etc/passwd'), 'etc-passwd');
    assert.strictEqual(sanitizeSlug(''), null);

    assert.strictEqual(sanitizeSafeUrl('javascript:alert(1)', true), '');
    assert.strictEqual(sanitizeSafeUrl('data:text/html,<script>', true), '');
    assert.strictEqual(sanitizeSafeUrl('//evil.com/phish', true), '');
    assert.strictEqual(sanitizeSafeUrl('/uploads/news/a.webp', true), '/uploads/news/a.webp');
    assert.strictEqual(sanitizeSafeUrl('https://cafef.vn/bai-viet.chn', false), 'https://cafef.vn/bai-viet.chn');

    const cleaned = stripUnsafeKeys({ title_vi: 'Test', sha: 'deadbeef', constructor: {}, prototype: {} });
    assert.strictEqual('sha' in cleaned, false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(cleaned, 'constructor'), false);
    assert.strictEqual(sanitizeCommitText('Hello\nInjected Header\r\n'), 'Hello Injected Header');
  });

  // 6. GitHub repo config & branch routing logic (fix for lap2004/VINAOX!)
  await runCase('GitHub Config: GITHUB_REPO="lap2004/VINAOX" parses owner/repo cleanly & respects env branch', async () => {
    const prevEnv = process.env.VERCEL_ENV;
    const prevRef = process.env.VERCEL_GIT_COMMIT_REF;
    try {
      process.env.GITHUB_REPO = 'lap2004/VINAOX';
      process.env.GITHUB_BRANCH = 'main';
      process.env.VERCEL_ENV = 'preview';
      process.env.VERCEL_GIT_COMMIT_REF = 'feature/vinaxo-custom-admin';
      const previewMeta = getPublicRepoMeta();
      assert.strictEqual(previewMeta.owner, 'lap2004');
      assert.strictEqual(previewMeta.repo, 'VINAOX');
      assert.strictEqual(previewMeta.branch, 'feature/vinaxo-custom-admin', 'Preview must isolate commits to preview branch');

      process.env.VERCEL_ENV = 'production';
      process.env.VERCEL_GIT_COMMIT_REF = 'main';
      const prodMeta = getPublicRepoMeta();
      assert.strictEqual(prodMeta.owner, 'lap2004');
      assert.strictEqual(prodMeta.repo, 'VINAOX');
      assert.strictEqual(prodMeta.branch, 'main', 'Production must commit to main');
    } finally {
      if (prevEnv === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = prevEnv;
      if (prevRef === undefined) delete process.env.VERCEL_GIT_COMMIT_REF;
      else process.env.VERCEL_GIT_COMMIT_REF = prevRef;
    }
  });

  // 7. Mock GitHub REST API call trace test (proves exact URL /repos/lap2004/VINAOX/...)
  await runCase('GitHub API: commitFile & commitMediaFile hit exact owner/repo URL without double owner', async () => {
    const originalFetch = globalThis.fetch;
    const calls = [];
    process.env.GITHUB_TOKEN = 'ghp_mock_test_token_only';
    globalThis.fetch = async (url, init) => {
      calls.push({ url, method: init?.method || 'GET', body: init?.body ? JSON.parse(init.body) : null });
      if ((init?.method || 'GET') === 'GET') {
        return new Response('', { status: 404 });
      }
      return new Response(JSON.stringify({ content: { sha: 'newsha123' }, commit: { sha: 'commitsha456' } }), { status: 200 });
    };
    try {
      const r = await commitFile('content/news/mock-test.json', '{"hello":"world"}', 'test commit');
      assert.strictEqual(r.commitSha, 'commitsha456');
      assert(calls[0].url.startsWith('https://api.github.com/repos/lap2004/VINAOX/contents/content/news/mock-test.json'), `Unexpected URL: ${calls[0].url}`);
      const m = await commitMediaFile('public/uploads/news/mock.webp', 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4', 'media upload');
      assert.strictEqual(m.publicUrl, '/uploads/news/mock.webp');
    } finally {
      globalThis.fetch = originalFetch;
      delete process.env.GITHUB_TOKEN;
    }
  });

  // 8. End-to-End Handler Lifecycle: Rate Limit -> Login -> Session -> News -> Media Security -> Logout
  await runCase('API Handlers: Brute-force Rate Limit (429), Login, News Draft/Delete, Binary Image Check, Logout', async () => {
    // 5 failed attempts -> 6th blocked with 429
    for (let i = 0; i < 5; i++) {
      const rFail = createMockRes();
      await loginHandler({
        method: 'POST',
        headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-forwarded-for': '203.0.113.99' },
        body: { username: 'admin', password: 'wrong-password' }
      }, rFail);
      assert.strictEqual(rFail.statusCode, 401);
    }
    const rBlocked = createMockRes();
    await loginHandler({
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-forwarded-for': '203.0.113.99' },
      body: { username: 'admin', password: testPassword }
    }, rBlocked);
    assert.strictEqual(rBlocked.statusCode, 429, '6th login attempt from blocked IP must return 429');
    assert(rBlocked.getHeader('retry-after'), '429 must include Retry-After header');

    // Valid login from different IP succeeds
    const rOk = createMockRes();
    await loginHandler({
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-forwarded-for': '198.51.100.10' },
      body: { username: 'admin', password: testPassword }
    }, rOk);
    assert.strictEqual(rOk.statusCode, 200);
    assert(rOk.body.csrfToken, 'Login must issue CSRF token');
    const cookiesHeader = rOk.getHeader('set-cookie');
    const sessionCookieStr = Array.isArray(cookiesHeader) ? cookiesHeader[0].split(';')[0] : cookiesHeader.split(';')[0];

    // Session GET
    const rSess = createMockRes();
    await sessionHandler({ method: 'GET', headers: { cookie: sessionCookieStr } }, rSess);
    assert.strictEqual(rSess.statusCode, 200);
    assert.strictEqual(rSess.body.authenticated, true);

    // News GET unauthenticated -> 401
    const rUnauth = createMockRes();
    await newsHandler({ method: 'GET', headers: {} }, rUnauth);
    assert.strictEqual(rUnauth.statusCode, 401);

    // News POST without CSRF token -> 403
    const rNoCsrf = createMockRes();
    await newsHandler({
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', cookie: sessionCookieStr },
      body: { slug: 'temp-test-slug', title_vi: 'Test' }
    }, rNoCsrf);
    assert.strictEqual(rNoCsrf.statusCode, 403);

    // News POST create draft -> succeeds, then delete
    const rDraft = createMockRes();
    await newsHandler({
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-csrf-token': rOk.body.csrfToken, cookie: sessionCookieStr },
      body: { slug: 'temp-unit-draft', title_vi: 'Bai nhap kiem thu', status: 'draft', published: false, tags: ['draft'] }
    }, rDraft);
    assert.strictEqual(rDraft.statusCode, 200);
    assert.strictEqual(rDraft.body.article.status, 'draft');
    assert.strictEqual(rDraft.body.article.published, false);

    const rDel = createMockRes();
    await newsHandler({
      method: 'DELETE',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-csrf-token': rOk.body.csrfToken, cookie: sessionCookieStr },
      body: { slug: 'temp-unit-draft' }
    }, rDel);
    assert.strictEqual(rDel.statusCode, 200);

    // Media POST rejects spoofed binary header
    const rBadImg = createMockRes();
    await mediaHandler({
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-csrf-token': rOk.body.csrfToken, cookie: sessionCookieStr },
      body: { filename: 'malware.webp', base64Data: 'data:image/webp;base64,' + Buffer.from('<script>alert(1)</script>').toString('base64'), category: 'news' }
    }, rBadImg);
    assert.strictEqual(rBadImg.statusCode, 400, 'Spoofed non-image magic bytes must be rejected');

    // Logout clears cookie
    const rOut = createMockRes();
    await logoutHandler({
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-csrf-token': rOk.body.csrfToken, cookie: sessionCookieStr },
      body: {}
    }, rOut);
    assert.strictEqual(rOut.statusCode, 200);
    assert(String(rOut.getHeader('set-cookie')).includes('Max-Age=0'));

    // Raw stream JSON body parsing + wrapHandler JSON error safety (never plain-text 500)
    const streamReq = {
      method: 'POST',
      headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-forwarded-for': '198.51.100.11' },
      async *[Symbol.asyncIterator]() {
        yield Buffer.from(JSON.stringify({ username: 'admin', password: testPassword }));
      }
    };
    const rStream = createMockRes();
    await loginHandler(streamReq, rStream);
    assert.strictEqual(rStream.statusCode, 200, 'Built .mjs handler must read unread JSON stream body');

    const prevVercel = process.env.VERCEL;
    const prevSecret = process.env.SESSION_SECRET;
    try {
      process.env.VERCEL = '1';
      delete process.env.SESSION_SECRET;
      const rMissingSecret = createMockRes();
      await loginHandler({
        method: 'POST',
        headers: { host: 'localhost:4174', origin: 'http://localhost:4174', 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest', 'x-forwarded-for': '198.51.100.12' },
        body: { username: 'admin', password: testPassword }
      }, rMissingSecret);
      assert.strictEqual(rMissingSecret.statusCode, 500);
      assert(typeof rMissingSecret.body?.error === 'string' && rMissingSecret.body.error.includes('SESSION_SECRET'), 'Missing SESSION_SECRET must return JSON 500 via wrapHandler');
    } finally {
      if (prevVercel === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = prevVercel;
      process.env.SESSION_SECRET = prevSecret;
    }
  });

  // 9. Data Integrity Check: 9 News Articles & 12 Products
  await runCase('Content Integrity: All 9 news articles (published) & 12 products intact', async () => {
    const newsFiles = fs.readdirSync(path.join(process.cwd(), 'content', 'news')).filter(f => f.endsWith('.json'));
    assert(newsFiles.length >= 9, `Expected >= 9 news files, found ${newsFiles.length}`);
    for (const f of newsFiles) {
      const d = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'news', f), 'utf-8'));
      assert(d.title_vi && d.slug, `Invalid news JSON ${f}`);
    }

    const prodFiles = fs.readdirSync(path.join(process.cwd(), 'content', 'products')).filter(f => f.endsWith('.json'));
    assert(prodFiles.length >= 12, `Expected >= 12 products, found ${prodFiles.length}`);
  });

  // 10. Production Branch Enforcement Guard
  await runCase('Production Isolation: Production environment strictly enforces branch "main"', async () => {
    const prevVercelEnv = process.env.VERCEL_ENV;
    const prevBranch = process.env.GITHUB_BRANCH;
    try {
      process.env.VERCEL_ENV = 'production';
      process.env.GITHUB_BRANCH = 'feature/vinaxo-custom-admin';
      const meta = getPublicRepoMeta();
      assert.strictEqual(meta.branch, 'main', 'Production must ALWAYS force branch "main" despite feature branch env var');

      process.env.VERCEL_ENV = 'preview';
      process.env.VERCEL_GIT_COMMIT_REF = 'feature/my-pr';
      const previewMeta = getPublicRepoMeta();
      assert.strictEqual(previewMeta.branch, 'feature/my-pr', 'Preview should respect preview git ref');
    } finally {
      if (prevVercelEnv === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = prevVercelEnv;
      if (prevBranch === undefined) delete process.env.GITHUB_BRANCH;
      else process.env.GITHUB_BRANCH = prevBranch;
      delete process.env.VERCEL_GIT_COMMIT_REF;
    }
  });

  // 11. Deployment Status Endpoint
  await runCase('Deploy Status: Handler returns status and handles missing commitSha / local fallback', async () => {
    const validToken = createSessionToken('admin', 1);
    const rMissingSha = createMockRes();
    await deployStatusHandler({
      method: 'GET',
      headers: { cookie: `vinaxo_admin_session=${validToken}` },
      query: {}
    }, rMissingSha);
    assert.strictEqual(rMissingSha.statusCode, 400, 'Missing commitSha must return 400');

    const rLocalSha = createMockRes();
    await deployStatusHandler({
      method: 'GET',
      headers: { cookie: `vinaxo_admin_session=${validToken}` },
      query: { commitSha: 'local-commit' }
    }, rLocalSha);
    assert.strictEqual(rLocalSha.statusCode, 200, 'Valid query must return 200');
    assert.strictEqual(rLocalSha.body?.status?.state, 'success', 'Local commit status should return success');
  });

  // 12. Shared Schema Validation
  await runCase('Data Contract: News, Product, Settings & Media validation guards', async () => {
    // Valid article passes
    const vValid = validateNewsArticle({
      slug: 'test-article-valid',
      title_vi: 'Tiêu đề kiểm thử hợp lệ',
      category: 'press',
      published_at: '2026-11-25'
    });
    assert.strictEqual(vValid.valid, true);
    assert.strictEqual(vValid.errors.length, 0);
    assert.strictEqual(vValid.data.slug, 'test-article-valid');

    // Invalid slug & missing title fails
    const vInvalid = validateNewsArticle({
      slug: 'bad slug with spaces!!',
      title_vi: ''
    });
    assert.strictEqual(vInvalid.valid, false);
    assert(vInvalid.errors.length >= 2, 'Should report both slug and title errors');

    // Product validation
    const pValid = validateProduct({
      slug: 'mango-soft-dried',
      name_vi: 'Xoài Sấy Dẻo',
      category: 'soft-dried'
    });
    assert.strictEqual(pValid.valid, true);

    // Media upload validation
    const mValid = validateMediaUpload('my-image.webp', 'data:image/webp;base64,AAAA', 'news');
    assert.strictEqual(mValid.valid, true);
    const mInvalid = validateMediaUpload('bad.exe', 'base64');
    assert.strictEqual(mInvalid.valid, false);
  });

  // 13. Field Preservation on Partial Updates (Root Cause Prevention)
  await runCase('Field Preservation: Updating title_vi never drops personQuoted, secondaryUrls or title_en', async () => {
    const existing = {
      id: 'press-nld-mango-sourcing',
      slug: 'press-nld-mango-sourcing',
      title_vi: 'Tiêu đề cũ',
      title_en: 'Old English Title',
      excerpt_vi: 'Tóm tắt cũ',
      personQuoted: { name: 'Hoàng Mạnh Cường', titleVi: 'GĐKD', titleEn: 'Commercial Director' },
      secondaryUrls: [{ name: 'CafeF', url: 'https://cafef.vn/test' }],
      published_at: '2026-05-24',
      dateVi: '24/05/2026',
      dateEn: 'May 24, 2026',
      featured: false,
      tags: ['company', 'operation']
    };

    // User only updates title_vi and adds "hehe"
    const incoming = {
      slug: 'press-nld-mango-sourcing',
      title_vi: 'Tiêu đề mới hehe'
    };

    const merged = mergeNewsArticle(existing, incoming);
    assert.strictEqual(merged.title_vi, 'Tiêu đề mới hehe');
    assert.strictEqual(merged.title_en, 'Old English Title', 'title_en must be preserved');
    assert.strictEqual(merged.personQuoted?.name, 'Hoàng Mạnh Cường', 'personQuoted must be preserved');
    assert.strictEqual(merged.secondaryUrls?.length, 1, 'secondaryUrls must be preserved');
    assert.strictEqual(merged.published_at, '2026-05-24', 'published_at must be preserved');
  });

  // 14. Server-Side Pre-Commit Validation Gate
  await runCase('Pre-Commit Gate: Rejects invalid article before Git commit', async () => {
    const validToken = createSessionToken('admin', 1);
    const csrfToken = createCsrfToken(validToken);

    const rBadArticle = createMockRes();
    await newsHandler({
      method: 'POST',
      headers: {
        cookie: `vinaxo_admin_session=${validToken}`,
        origin: 'http://localhost:4174',
        'x-requested-with': 'XMLHttpRequest',
        'x-csrf-token': csrfToken,
        'content-type': 'application/json'
      },
      body: {
        slug: 'bad slug',
        title_vi: ''
      }
    }, rBadArticle);

    assert.strictEqual(rBadArticle.statusCode, 400);
    assert(rBadArticle.body?.errors?.length > 0, 'Must return specific validation errors');
  });

  // 15. Content Service Fault Isolation
  await runCase('Fault Isolation: Content service gracefully tolerates corrupt records', async () => {
    const articles = getAllArticles({ includeDrafts: true });
    assert(Array.isArray(articles) && articles.length > 0, 'Articles array must be valid');

    // toNewsItem on malformed record should never throw
    const safeItem = toNewsItem({});
    assert(safeItem && typeof safeItem.vi?.title === 'string');
    assert(safeItem.category === 'press' || safeItem.category === 'company');
  });

  console.log(`\n========================================`);
  console.log(`SECURITY & UNIT SUITE RESULTS: ${passed}/${total} PASSED`);
  console.log(`========================================\n`);

  if (passed !== total) process.exit(1);
}

runTests();
