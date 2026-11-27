import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import inquiryHandler from '../api/inquiry.mjs';
import contactHandler from '../api/contact.mjs';

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
    const prevBrevo = process.env.BREVO_API_KEY;
    const prevHook = process.env.INQUIRY_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.BREVO_API_KEY;
    delete process.env.INQUIRY_WEBHOOK_URL;
    try {
      const resUnconf = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.13',
          body: {
            requestType: 'contact',
            locale: 'vi',
            fullName: 'Nguyễn Văn QA',
            email: 'qa@vinaxo.test',
            productId: 'soft-dried-mango',
            message: '[VINAXO QA TEST – CONTACT FORM] Kiểm tra gửi tiếng Việt UTF-8.',
          },
        }),
        resUnconf
      );
      assert.strictEqual(resUnconf.statusCode, 503);
      assert.strictEqual(resUnconf.body.delivered, false);
      assert.strictEqual(resUnconf.body.code, 'DELIVERY_NOT_CONFIGURED');
    } finally {
      if (prevKey !== undefined) process.env.RESEND_API_KEY = prevKey;
      if (prevBrevo !== undefined) process.env.BREVO_API_KEY = prevBrevo;
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

  // 7. Bundle & test routeMetadata.ts + 4-language SEO + partial-update schema preservation
  await testCase('SEO routeMetadata & schemas: VI/EN/KO/ZH-CN metadata, canonicals, noindex, company legal names & merge preservation', async () => {
    const tmpOut = path.join(process.cwd(), 'dist', '.tmp-seo-test.mjs');
    await build({
      stdin: {
        contents: `
          export { resolveRouteSeo } from './src/components/seo/routeMetadata.ts';
          export { SITE_CONFIG, normalizeCanonicalUrl } from './src/config/siteConfig.ts';
          export { getLegalCompanyName } from './src/data/company.ts';
          export { mergeNewsArticle } from './src/shared/schemas/newsSchema.ts';
          export { mergeProduct } from './src/shared/schemas/productSchema.ts';
          export { validateCompanySettings } from './src/shared/schemas/settingsSchema.ts';
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
      const homeKo = mod.resolveRouteSeo('/', 'ko');
      const homeZh = mod.resolveRouteSeo('/', 'zh-CN');

      assert.strictEqual(homeVi.canonical, 'https://www.vinaxo.net/');
      assert.strictEqual(homeEn.canonical, 'https://www.vinaxo.net/');
      assert.strictEqual(homeKo.canonical, 'https://www.vinaxo.net/');
      assert.strictEqual(homeZh.canonical, 'https://www.vinaxo.net/');
      assert.notStrictEqual(homeVi.title, homeEn.title);
      assert.notStrictEqual(homeKo.title, homeEn.title);
      assert.notStrictEqual(homeZh.title, homeEn.title);
      assert.notStrictEqual(homeVi.description, homeEn.description);
      assert.strictEqual(homeVi.ogLocale, 'vi_VN');
      assert.strictEqual(homeEn.ogLocale, 'en_US');
      assert.strictEqual(homeKo.ogLocale, 'ko_KR');
      assert.strictEqual(homeZh.ogLocale, 'zh_CN');

      // Legal name standardization (P2-01)
      assert.strictEqual(mod.getLegalCompanyName('vi'), 'CÔNG TY TNHH VINAXO');
      assert.strictEqual(mod.getLegalCompanyName('en'), 'VINAXO COMPANY LIMITED');
      assert.strictEqual(mod.getLegalCompanyName('ko'), 'VINAXO COMPANY LIMITED');
      assert.strictEqual(mod.getLegalCompanyName('zh-CN'), 'VINAXO COMPANY LIMITED');

      const jsonLdKoStr = JSON.stringify(homeKo.jsonLd);
      const jsonLdZhStr = JSON.stringify(homeZh.jsonLd);
      assert(jsonLdKoStr.includes('VINAXO COMPANY LIMITED'), 'KO JSON-LD must include VINAXO COMPANY LIMITED');
      assert(!jsonLdKoStr.includes('Vinaxo Co., Ltd.'), 'KO JSON-LD must not contain duplicated Vinaxo Co., Ltd.');
      assert(!jsonLdZhStr.includes('Vinaxo Co., Ltd.'), 'ZH-CN JSON-LD must not contain duplicated Vinaxo Co., Ltd.');

      // Schema partial-update preservation for KO/ZH fields
      const mergedNews = mod.mergeNewsArticle(
        {
          id: 'test-news',
          slug: 'test-news',
          title_vi: 'Tiêu đề gốc',
          title_en: 'Original Title',
          title_ko: '한국어 제목 보존',
          title_zh: '保留中文标题',
          excerpt_ko: '한국어 요약 보존',
          excerpt_zh: '保留中文摘要',
          body_ko: '한국어 본문',
          body_zh: '中文正文',
          seo_title_ko: 'KO SEO',
          seo_description_zh: 'ZH SEO DESC',
          personQuoted: { name: 'A', titleVi: 'GĐ', titleEn: 'Director', titleKo: '대표', titleZh: '总监' },
        },
        { slug: 'test-news', title_vi: 'Tiêu đề mới' }
      );
      assert.strictEqual(mergedNews.title_vi, 'Tiêu đề mới');
      assert.strictEqual(mergedNews.title_ko, '한국어 제목 보존');
      assert.strictEqual(mergedNews.title_zh, '保留中文标题');
      assert.strictEqual(mergedNews.seo_title_ko, 'KO SEO');
      assert.strictEqual(mergedNews.seo_description_zh, 'ZH SEO DESC');
      assert.strictEqual(mergedNews.personQuoted.titleKo, '대표');
      assert.strictEqual(mergedNews.personQuoted.titleZh, '总监');

      const mergedProd = mod.mergeProduct(
        {
          id: 'soft-dried-mango',
          slug: 'soft-dried-mango',
          name_vi: 'Xoài sấy dẻo',
          name_en: 'Soft-Dried Mango',
          name_ko: '소프트 건조 망고',
          name_zh: '软干芒果',
          description_ko: '망고 설명',
          description_zh: '芒果简介',
          ko: { name: '소프트 건조 망고', desc: '망고 설명', origin: '메콩 델타, 베트남' },
          zh: { name: '软干芒果', desc: '芒果简介', origin: '越南湄公河三角洲' },
        },
        { slug: 'soft-dried-mango', name_vi: 'Xoài sấy dẻo cập nhật' }
      );
      assert.strictEqual(mergedProd.name_vi, 'Xoài sấy dẻo cập nhật');
      assert.strictEqual(mergedProd.name_ko, '소프트 건조 망고');
      assert.strictEqual(mergedProd.name_zh, '软干芒果');
      assert.strictEqual(mergedProd.ko?.origin, '메콩 델타, 베트남');
      assert.strictEqual(mergedProd.zh?.origin, '越南湄公河三角洲');

      // Sanitize duplicate company name in Admin settings validator
      const settingsRes = mod.validateCompanySettings({
        company_name_vi: 'CÔNG TY TNHH VINAXO',
        company_name_en: 'Vinaxo Co., Ltd. (VINAXO COMPANY LIMITED (Vinaxo Co., Ltd.))',
      });
      assert.strictEqual(settingsRes.valid, true);
      assert.strictEqual(settingsRes.data.company_name_en, 'VINAXO COMPANY LIMITED');

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

  // 8. Inquiry API accepts KO and ZH-CN locales without 400 validation errors
  await testCase('Inquiry API: accepts language="ko" and language="zh-CN" payloads', async () => {
    const prevFetch = globalThis.fetch;
    const prevKey = process.env.RESEND_API_KEY;
    const prevHook = process.env.INQUIRY_WEBHOOK_URL;
    process.env.RESEND_API_KEY = 're_test_ephemeral_multilingual_key';
    delete process.env.INQUIRY_WEBHOOK_URL;
    const seenLanguages = [];
    globalThis.fetch = async (_url, init) => {
      const payload = JSON.parse(init.body);
      seenLanguages.push(payload.subject);
      return { ok: true, status: 200, text: async () => '{"id":"msg_ml_123"}' };
    };
    try {
      const resKo = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.31',
          body: {
            requestType: 'quotation',
            locale: 'ko',
            fullName: 'Kim Min-jun',
            email: 'buyer@seoulfoods.example',
            productId: 'soft-dried-red-dragonfruit',
            productName: 'SPOOFED NAME SHOULD BE IGNORED',
            message: 'Requesting FOB Ho Chi Minh CIF Busan quotation for 1x20ft container without phone.',
          },
        }),
        resKo
      );
      assert.strictEqual(resKo.statusCode, 200);
      assert.strictEqual(resKo.body.delivered, true);
      assert.strictEqual(resKo.body.providerMessageId, 'msg_ml_123');
      assert.strictEqual(resKo.body.verifiedProductId, 'soft-dried-red-dragonfruit');

      const resZh = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.32',
          body: {
            requestType: 'contact',
            locale: 'zh-CN',
            fullName: 'Wang Wei',
            email: 'sourcing@shanghaiimport.example',
            product: '软干芒果',
            message: 'Need BRCGS certificate copy without inquiryType.',
          },
        }),
        resZh
      );
      assert.strictEqual(resZh.statusCode, 200);
      assert.strictEqual(resZh.body.delivered, true);
      assert.strictEqual(seenLanguages.length, 2);
      assert(seenLanguages[0].includes('Soft Dried Red Dragonfruit'), 'Subject must use server-verified catalog product name');

      // Header injection rejection
      const resCrlf = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.33',
          body: {
            requestType: 'contact',
            locale: 'en',
            fullName: 'Attacker',
            email: 'bad@example.com\r\nBcc:victim@example.com',
            message: 'Testing CRLF injection guard.',
          },
        }),
        resCrlf
      );
      assert.strictEqual(resCrlf.statusCode, 400);
      assert.strictEqual(resCrlf.body.code, 'VALIDATION_ERROR');
    } finally {
      globalThis.fetch = prevFetch;
      if (prevKey !== undefined) process.env.RESEND_API_KEY = prevKey;
      else delete process.env.RESEND_API_KEY;
      if (prevHook !== undefined) process.env.INQUIRY_WEBHOOK_URL = prevHook;
    }
  });

  // 9. URL normalization & FactoryLocation Single Source of Truth + Brevo delivery
  await testCase('URL normalization, FactoryLocation Google Maps consistency, and Brevo relay support', async () => {
    const tmpOut = path.join(process.cwd(), 'dist', '.tmp-contact-maps-test.mjs');
    await build({
      stdin: {
        contents: `
          export { normalizeSiteUrl, normalizeExternalWebsiteUrl } from './src/config/siteConfig.ts';
          export { COMPANY_INFO, getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl, getGoogleMapsEmbedUrl } from './src/data/company.ts';
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
      assert.strictEqual(mod.normalizeSiteUrl('www.vinaxo.net'), 'https://www.vinaxo.net/');
      assert.strictEqual(mod.normalizeSiteUrl('/www.vinaxo.net'), 'https://www.vinaxo.net/');
      assert.strictEqual(mod.normalizeExternalWebsiteUrl('www.vinaxo.net'), 'https://www.vinaxo.net/');
      assert.strictEqual(mod.normalizeExternalWebsiteUrl('mailto:cuonghoang0710@gmail.com'), 'mailto:cuonghoang0710@gmail.com');

      const { latitude, longitude } = mod.COMPANY_INFO.location;
      const coordNeedle = encodeURIComponent(`${latitude},${longitude}`);
      const searchUrl = mod.getGoogleMapsSearchUrl();
      const dirUrl = mod.getGoogleMapsDirectionsUrl();
      const embedUrl = mod.getGoogleMapsEmbedUrl();
      assert(searchUrl.includes(coordNeedle), `Search URL must use ${latitude},${longitude}: ${searchUrl}`);
      assert(dirUrl.includes(coordNeedle), `Directions URL must use ${latitude},${longitude}: ${dirUrl}`);
      assert(embedUrl.includes(coordNeedle), `Embed URL must use ${latitude},${longitude}: ${embedUrl}`);
    } finally {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    }

    // Verify Brevo API path cleanly
    const prevFetch = globalThis.fetch;
    const prevResend = process.env.RESEND_API_KEY;
    const prevBrevo = process.env.BREVO_API_KEY;
    const prevHook = process.env.INQUIRY_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.INQUIRY_WEBHOOK_URL;
    process.env.BREVO_API_KEY = 'xkeysib-test-ephemeral';
    const brevoCalls = [];
    globalThis.fetch = async (url, init) => {
      brevoCalls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, status: 201, text: async () => '{"messageId":"<brevo-123@relay>"}' };
    };
    try {
      const resBrevo = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.39',
          body: {
            requestType: 'quotation',
            locale: 'en',
            fullName: 'Emma Watson',
            email: 'emma@buyer.example',
            productId: 'banana-chips',
            message: 'Quote for 1x20ft Banana Chips FOB Ho Chi Minh.',
          },
        }),
        resBrevo
      );
      assert.strictEqual(resBrevo.statusCode, 200);
      assert.strictEqual(resBrevo.body.channel, 'brevo');
      assert.strictEqual(resBrevo.body.providerMessageId, '<brevo-123@relay>');
      assert.strictEqual(brevoCalls[0].url, 'https://api.brevo.com/v3/smtp/email');
      assert.strictEqual(brevoCalls[0].body.replyTo.email, 'emma@buyer.example');
    } finally {
      globalThis.fetch = prevFetch;
      if (prevResend !== undefined) process.env.RESEND_API_KEY = prevResend;
      if (prevBrevo !== undefined) process.env.BREVO_API_KEY = prevBrevo;
      else delete process.env.BREVO_API_KEY;
      if (prevHook !== undefined) process.env.INQUIRY_WEBHOOK_URL = prevHook;
    }
  });

  // 10. Separated TradeTerm & ShippingMode validation + Export Logistics terminology audit
  await testCase('Market logistics terminology: separates tradeTerm (FOB/CIF) from shippingMode (FCL/LCL) and removes market nhãn mác', async () => {
    const prevFetch = globalThis.fetch;
    const prevKey = process.env.RESEND_API_KEY;
    const prevHook = process.env.INQUIRY_WEBHOOK_URL;
    process.env.RESEND_API_KEY = 're_test_ephemeral_terms_key';
    delete process.env.INQUIRY_WEBHOOK_URL;
    const sentEmails = [];
    globalThis.fetch = async (_url, init) => {
      sentEmails.push(JSON.parse(init.body));
      return { ok: true, status: 200, text: async () => '{"id":"msg_terms_1"}' };
    };
    try {
      const resValid = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.51',
          body: {
            requestType: 'quotation',
            locale: 'vi',
            fullName: 'Le Minh',
            email: 'minh@importer.example',
            tradeTerm: 'FOB',
            shippingMode: 'FCL',
            message: 'Quote for 1x20ft Soft-Dried Mango FOB Cat Lai.',
          },
        }),
        resValid
      );
      assert.strictEqual(resValid.statusCode, 200);
      assert(sentEmails[0].text.includes('Trade Term (Incoterms): FOB'));
      assert(sentEmails[0].text.includes('Shipping Mode (Container): FCL'));

      const resSwap1 = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.52',
          body: {
            requestType: 'quotation',
            locale: 'vi',
            fullName: 'Bad Input',
            email: 'bad@importer.example',
            tradeTerm: 'FCL',
            message: 'Should reject container mode inside tradeTerm.',
          },
        }),
        resSwap1
      );
      assert.strictEqual(resSwap1.statusCode, 400);
      assert.strictEqual(resSwap1.body.code, 'VALIDATION_ERROR');

      const resSwap2 = createMockRes();
      await contactHandler(
        createReq({
          ip: '198.51.100.53',
          body: {
            requestType: 'quotation',
            locale: 'en',
            fullName: 'Bad Input 2',
            email: 'bad2@importer.example',
            shippingMode: 'CIF',
            message: 'Should reject Incoterm inside shippingMode.',
          },
        }),
        resSwap2
      );
      assert.strictEqual(resSwap2.statusCode, 400);
      assert.strictEqual(resSwap2.body.code, 'VALIDATION_ERROR');
    } finally {
      globalThis.fetch = prevFetch;
      if (prevKey !== undefined) process.env.RESEND_API_KEY = prevKey;
      else delete process.env.RESEND_API_KEY;
      if (prevHook !== undefined) process.env.INQUIRY_WEBHOOK_URL = prevHook;
    }

    const auditedFiles = [
      'src/pages/GlobalMarket.tsx',
      'src/pages/Contact.tsx',
      'src/i18n/vi.ts',
      'src/i18n/en.ts',
      'src/i18n/ko.ts',
      'src/i18n/zhCN.ts',
    ];
    for (const rel of auditedFiles) {
      const content = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
      assert(!/FCL\s*\/\s*CIF|CIF\s*\/\s*FCL/i.test(content), `${rel} must not contain FCL/CIF`);
      assert(!/mark?et\s+nhãn\s+mác/i.test(content), `${rel} must not contain market nhãn mác`);
    }
  });

  console.log(`\nSummary: ${passed}/${total} SEO & Inquiry test cases passed.`);
}

main();
