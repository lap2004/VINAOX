import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import inquiryHandler from '../api/inquiry.mjs';

function createMockRes() {
  const headers = {};
  return {
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
    end(raw) {
      this.body = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return this;
    },
  };
}

function createReq({ method = 'POST', headers = {}, body = {}, ip = '198.51.100.10' } = {}) {
  return {
    method,
    headers: {
      host: 'www.vinaxo.net',
      origin: 'https://www.vinaxo.net',
      'content-type': 'application/json',
      ...headers,
    },
    body,
    socket: { remoteAddress: ip },
  };
}

async function main() {
  let passed = 0;
  let total = 0;

  async function testCase(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err);
      process.exitCode = 1;
    }
  }

  // 1. Method & Content-Type guards
  await testCase('Inquiry API: rejects non-POST (405) and non-JSON (415)', async () => {
    const resGet = createMockRes();
    await inquiryHandler(createReq({ method: 'GET' }), resGet);
    assert.strictEqual(resGet.statusCode, 405);

    const resCt = createMockRes();
    await inquiryHandler(createReq({ headers: { 'content-type': 'text/plain' } }), resCt);
    assert.strictEqual(resCt.statusCode, 415);
  });

  // 2. Validation guards
  await testCase('Inquiry API: rejects missing required fields and invalid email (400)', async () => {
    const resMissing = createMockRes();
    await inquiryHandler(
      createReq({ body: { formType: 'contact', language: 'vi', name: 'A', email: 'bad', message: 'hi' }, ip: '198.51.100.11' }),
      resMissing
    );
    assert.strictEqual(resMissing.statusCode, 400);
    assert.strictEqual(resMissing.body.delivered, false);
    assert.strictEqual(resMissing.body.code, 'VALIDATION_ERROR');
  });

  // 3. Honeypot
  await testCase('Inquiry API: silently traps bot honeypot without calling delivery', async () => {
    const resHp = createMockRes();
    await inquiryHandler(
      createReq({ body: { name: 'Bot', email: 'bot@example.com', hp_website: 'http://spam.test' }, ip: '198.51.100.12' }),
      resHp
    );
    assert.strictEqual(resHp.statusCode, 200);
    assert.strictEqual(resHp.body.filtered, true);
  });

  // 4. Honest 503 when server delivery is unconfigured
  await testCase('Inquiry API: returns 503 DELIVERY_NOT_CONFIGURED when no mail/webhook env is set', async () => {
    const prevKey = process.env.RESEND_API_KEY;
    const prevHook = process.env.INQUIRY_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.INQUIRY_WEBHOOK_URL;
    try {
      const resUnconf = createMockRes();
      await inquiryHandler(
        createReq({
          ip: '198.51.100.13',
          body: {
            formType: 'contact',
            language: 'vi',
            name: 'Nguyễn Văn QA',
            email: 'qa@vinaxo.test',
            inquiryType: 'Báo giá đơn hàng xuất khẩu container (FCL/LCL)',
            product: 'Xoài sấy dẻo',
            message: '[VINAXO QA TEST – PRE-HANDOVER] Kiểm tra gửi tiếng Việt UTF-8.',
          },
        }),
        resUnconf
      );
      assert.strictEqual(resUnconf.statusCode, 503);
      assert.strictEqual(resUnconf.body.delivered, false);
      assert.strictEqual(resUnconf.body.code, 'DELIVERY_NOT_CONFIGURED');
    } finally {
      if (prevKey !== undefined) process.env.RESEND_API_KEY = prevKey;
      if (prevHook !== undefined) process.env.INQUIRY_WEBHOOK_URL = prevHook;
    }
  });

  // 5. Real Resend HTTP delivery + duplicate protection + rate limit
  await testCase('Inquiry API: delivers via Resend API, blocks duplicates (409), and enforces rate limit (429)', async () => {
    const prevFetch = globalThis.fetch;
    const prevKey = process.env.RESEND_API_KEY;
    const capturedCalls = [];
    process.env.RESEND_API_KEY = 're_test_ephemeral_key';
    globalThis.fetch = async (url, init) => {
      capturedCalls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, status: 200, text: async () => '{"id":"msg_123"}' };
    };

    try {
      const payload = {
        formType: 'quote',
        language: 'vi',
        name: 'Trần Thị Kiểm Thử',
        email: 'buyer@pacificfoods.example',
        phone: '+84 984 815 016',
        company: 'Pacific Foods LLC',
        product: 'Chuối sấy giòn (Banana Chips)',
        message: '[VINAXO QA TEST – PRE-HANDOVER] 1x20ft FCL.',
      };

      const resOk = createMockRes();
      await inquiryHandler(createReq({ ip: '198.51.100.14', body: payload }), resOk);
      assert.strictEqual(resOk.statusCode, 200);
      assert.strictEqual(resOk.body.delivered, true);
      assert.strictEqual(resOk.body.channel, 'resend');
      assert(resOk.body.referenceId.startsWith('VNX-'));
      assert.strictEqual(capturedCalls.length, 1);
      assert(capturedCalls[0].body.text.includes('Trần Thị Kiểm Thử'));
      assert(capturedCalls[0].body.text.includes('Chuối sấy giòn'));

      // Duplicate submission within 60s -> 409
      const resDup = createMockRes();
      await inquiryHandler(createReq({ ip: '198.51.100.14', body: payload }), resDup);
      assert.strictEqual(resDup.statusCode, 409);
      assert.strictEqual(resDup.body.code, 'DUPLICATE_SUBMISSION');

      // Exceed rate limit (>5 requests from same IP; 1st + dup = 2 counted, so 3 more succeed -> 6th hits 429)
      for (let i = 0; i < 3; i++) {
        const resMore = createMockRes();
        await inquiryHandler(
          createReq({ ip: '198.51.100.14', body: { ...payload, message: `Unique msg ${i}` } }),
          resMore
        );
        assert.strictEqual(resMore.statusCode, 200);
      }
      const resRl = createMockRes();
      await inquiryHandler(
        createReq({ ip: '198.51.100.14', body: { ...payload, message: 'Trigger rate limit' } }),
        resRl
      );
      assert.strictEqual(resRl.statusCode, 429);
      assert.strictEqual(resRl.body.code, 'RATE_LIMITED');
    } finally {
      globalThis.fetch = prevFetch;
      if (prevKey === undefined) delete process.env.RESEND_API_KEY;
      else process.env.RESEND_API_KEY = prevKey;
    }
  });

  // 6. SEO artifacts validation (dist/sitemap.xml & dist/*.html)
  await testCase('Build SEO artifacts: sitemap.xml & static route HTML files have accurate canonicals and zero vinaxo.vn', async () => {
    const distDir = path.join(process.cwd(), 'dist');
    assert(fs.existsSync(path.join(distDir, 'sitemap.xml')), 'dist/sitemap.xml must exist');
    const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
    assert(!sitemap.includes('vinaxo.vn'), 'sitemap must not contain vinaxo.vn');
    assert(!sitemap.includes('/admin'), 'sitemap must not include /admin');
    assert(sitemap.includes('https://www.vinaxo.net/products'), 'sitemap must include /products');
    assert(sitemap.includes('https://www.vinaxo.net/brochure'), 'sitemap must include /brochure');
    assert(sitemap.includes('https://www.vinaxo.net/tin-tuc/press-nld-mango-sourcing'), 'sitemap must include published article');

    const checkHtml = (relPath, expectedCanon, expectedTitleSub) => {
      const html = fs.readFileSync(path.join(distDir, relPath), 'utf8');
      assert(!html.includes('vinaxo.vn'), `${relPath} must not contain vinaxo.vn`);
      const canonMatches = html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || [];
      if (expectedCanon) {
        assert.strictEqual(canonMatches.length, 1, `${relPath} must have exactly 1 canonical`);
        assert(canonMatches[0].includes(expectedCanon), `${relPath} canonical must be ${expectedCanon}`);
      } else {
        assert.strictEqual(canonMatches.length, 0, `${relPath} should have 0 canonicals`);
      }
      assert(html.includes(expectedTitleSub), `${relPath} title must include ${expectedTitleSub}`);
    };

    checkHtml('index.html', 'https://www.vinaxo.net/', 'VINAXO');
    checkHtml('products.html', 'https://www.vinaxo.net/products', 'Sản phẩm trái cây sấy');
    checkHtml('brochure.html', 'https://www.vinaxo.net/brochure', 'Catalogue &amp; Brochure');
    checkHtml('contact.html', 'https://www.vinaxo.net/contact', 'Liên hệ và nhận báo giá');
    checkHtml('tin-tuc/press-nld-mango-sourcing.html', 'https://www.vinaxo.net/tin-tuc/press-nld-mango-sourcing', 'VINAXO');
    checkHtml('404.html', null, '404');
  });

  // 7. Bundle & test routeMetadata.ts directly
  await testCase('SEO routeMetadata: VI/EN titles, descriptions, canonicals, and noindex guards resolve cleanly', async () => {
    const tmpOut = path.join(process.cwd(), 'dist', '.tmp-seo-test.mjs');
    await build({
      stdin: {
        contents: `
          export { resolveRouteSeo } from './src/components/seo/routeMetadata.ts';
          export { SITE_CONFIG, normalizeCanonicalUrl } from './src/config/siteConfig.ts';
        `,
        resolveDir: process.cwd(),
        loader: 'ts',
      },
      bundle: true,
      format: 'esm',
      platform: 'node',
      outfile: tmpOut,
      logLevel: 'silent',
    });

    try {
      const mod = await import('file:///' + tmpOut.replace(/\\/g, '/'));
      const homeVi = mod.resolveRouteSeo('/', 'vi');
      const homeEn = mod.resolveRouteSeo('/', 'en');
      assert.strictEqual(homeVi.canonical, 'https://www.vinaxo.net/');
      assert.strictEqual(homeEn.canonical, 'https://www.vinaxo.net/');
      assert.notStrictEqual(homeVi.title, homeEn.title);
      assert.notStrictEqual(homeVi.description, homeEn.description);
      assert.strictEqual(homeVi.ogLocale, 'vi_VN');
      assert.strictEqual(homeEn.ogLocale, 'en_US');

      const prodEn = mod.resolveRouteSeo('/products', 'en');
      assert.strictEqual(prodEn.canonical, 'https://www.vinaxo.net/products');
      assert(prodEn.description.includes('B2B export catalog'));

      const adminSeo = mod.resolveRouteSeo('/admin/dashboard', 'vi');
      assert.strictEqual(adminSeo.canonical, null);
      assert.strictEqual(adminSeo.robots, 'noindex, nofollow');

      const notFoundSeo = mod.resolveRouteSeo('/unknown-page-xyz', 'en');
      assert.strictEqual(notFoundSeo.canonical, null);
      assert.strictEqual(notFoundSeo.robots, 'noindex, nofollow');
    } finally {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    }
  });

  console.log(`\nSummary: ${passed}/${total} SEO & Inquiry test cases passed.`);
}

main();
