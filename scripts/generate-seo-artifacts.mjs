import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONTENT_NEWS_DIR = path.join(ROOT, 'content', 'news');
const CONTENT_PRODUCTS_DIR = path.join(ROOT, 'content', 'products');
const COMPANY_SETTINGS_PATH = path.join(ROOT, 'content', 'settings', 'company.json');

const SITE_URL = 'https://www.vinaxo.net';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/hero_fruits.jpg`;
const BROCHURE_OG_IMAGE = `${SITE_URL}/assets/images/brochure-2026-cover.jpg`;
const LOGO_URL = `${SITE_URL}/assets/logo/vinaxo-logo.svg`;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/\s+/g, ' ').trim();
}

function normalizeUrl(input, fallback = DEFAULT_OG_IMAGE) {
  if (!input || typeof input !== 'string') return fallback;
  const trimmed = input.trim();
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return fallback;
  if (trimmed.startsWith('/')) return `${SITE_URL}${trimmed}`;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (['vinaxo.vn', 'www.vinaxo.vn', 'vinaxo.net', 'www.vinaxo.net'].includes(host)) {
      return `${SITE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return trimmed;
  } catch {
    return `${SITE_URL}/${trimmed.replace(/^\/+/, '')}`;
  }
}

function isArticleDraft(article) {
  if (!article) return true;
  if (article.status === 'draft') return true;
  if (article.published === false) return true;
  if (Array.isArray(article.tags) && article.tags.some((t) => String(t).toLowerCase() === 'draft')) {
    return true;
  }
  return false;
}

function readJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const fullPath = path.join(dirPath, file);
      try {
        const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const stat = fs.statSync(fullPath);
        return { file, fullPath, raw, mtime: stat.mtime.toISOString().split('T')[0] };
      } catch (err) {
        console.warn(`[generate-seo-artifacts] Skipping invalid JSON ${fullPath}:`, err.message);
        return null;
      }
    })
    .filter(Boolean);
}

function loadCompanyInfo() {
  const defaults = {
    company_name_vi: 'CÔNG TY TNHH VINAXO',
    company_name_en: 'VINAXO COMPANY LIMITED',
    tax_id: '1201611681',
    address_vi: 'Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam',
    hotline: '+84984815016',
    email: 'cuonghoang0710@gmail.com',
  };
  if (!fs.existsSync(COMPANY_SETTINGS_PATH)) return defaults;
  try {
    return { ...defaults, ...JSON.parse(fs.readFileSync(COMPANY_SETTINGS_PATH, 'utf8')) };
  } catch {
    return defaults;
  }
}

function formatDate(rawDate, fallback) {
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawDate.trim())) {
    return rawDate.trim().slice(0, 10);
  }
  return fallback;
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  };
}

function replaceOrInjectTag(html, regex, replacement, anchorRegex = /<\/head>/i) {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  return html.replace(anchorRegex, `  ${replacement}\n  </head>`);
}

function applySeoToHtml(templateHtml, seo) {
  let html = templateHtml;

  const title = escapeHtml(seo.title);
  const desc = escapeAttr(seo.description);
  const robots = escapeAttr(seo.robots);
  const ogType = escapeAttr(seo.ogType || 'website');
  const ogUrl = escapeAttr(seo.ogUrl);
  const ogTitle = escapeAttr(seo.title);
  const ogDesc = escapeAttr(seo.description);
  const ogImage = escapeAttr(seo.ogImage || DEFAULT_OG_IMAGE);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  html = replaceOrInjectTag(
    html,
    /<meta\s+name=["']title["'][^>]*>/i,
    `<meta name="title" content="${ogTitle}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+name=["']description["'][\s\S]*?\/>/i,
    `<meta name="description" content="${desc}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${robots}" />`
  );

  // Strictly one canonical or none (for 404 / noindex)
  html = html.replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, '\n    ');
  if (seo.canonical) {
    html = html.replace(
      /<\/head>/i,
      `  <link rel="canonical" href="${escapeAttr(seo.canonical)}" />\n  </head>`
    );
  }

  html = replaceOrInjectTag(
    html,
    /<meta\s+property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="${ogType}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${ogUrl}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+property=["']og:title["'][\s\S]*?\/>/i,
    `<meta property="og:title" content="${ogTitle}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+property=["']og:description["'][\s\S]*?\/>/i,
    `<meta property="og:description" content="${ogDesc}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${ogImage}" />`
  );

  html = replaceOrInjectTag(
    html,
    /<meta\s+(?:name|property)=["']twitter:url["'][^>]*>/i,
    `<meta name="twitter:url" content="${ogUrl}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+(?:name|property)=["']twitter:title["'][\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${ogTitle}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+(?:name|property)=["']twitter:description["'][\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${ogDesc}" />`
  );
  html = replaceOrInjectTag(
    html,
    /<meta\s+(?:name|property)=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${ogImage}" />`
  );

  html = html.replace(/\s*<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n    ');
  if (seo.jsonLd) {
    const safeJson = JSON.stringify(seo.jsonLd).replace(/<\/script>/gi, '<\\/script>');
    html = html.replace(
      /<\/head>/i,
      `  <script id="vinaxo-seo-jsonld" type="application/ld+json">${safeJson}</script>\n  </head>`
    );
  }

  return html;
}

function writeRouteHtml(relOutPath, htmlContent) {
  const fullOut = path.join(DIST_DIR, relOutPath);
  fs.mkdirSync(path.dirname(fullOut), { recursive: true });
  fs.writeFileSync(fullOut, htmlContent, 'utf8');
}

function main() {
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    throw new Error('Missing dist/index.html. Run vite build first.');
  }

  const templateHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  const today = new Date().toISOString().split('T')[0];
  const company = loadCompanyInfo();

  const newsFiles = readJsonFiles(CONTENT_NEWS_DIR);
  const publishedArticles = newsFiles
    .filter(({ raw }) => !isArticleDraft(raw) && raw.slug)
    .map(({ raw, mtime }) => ({ ...raw, _mtime: mtime }));

  const productFiles = readJsonFiles(CONTENT_PRODUCTS_DIR);
  const products = productFiles
    .filter(({ raw }) => raw && raw.slug)
    .map(({ raw, mtime }) => ({ ...raw, _mtime: mtime }));

  const staticRoutes = [
    {
      out: 'about.html',
      loc: `${SITE_URL}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      seo: {
        title: 'Về chúng tôi – VINAXO',
        description:
          'Tìm hiểu về Công ty TNHH VINAXO tại Đồng Tháp: tổ hợp nhà máy 25.000 m², công suất 300 tấn thành phẩm/tháng, vùng trồng liên kết ĐBSCL và hành trình vươn ra thị trường quốc tế.',
        canonical: `${SITE_URL}/about`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/about`,
        ogImage: `${SITE_URL}/assets/images/about_vietnam.jpg`,
        jsonLd: buildBreadcrumbSchema([
          { name: 'Trang chủ', path: '/' },
          { name: 'Về chúng tôi', path: '/about' },
        ]),
      },
    },
    {
      out: 'products.html',
      loc: `${SITE_URL}/products`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
      seo: {
        title: 'Sản phẩm trái cây sấy và hạt dinh dưỡng – VINAXO',
        description:
          'Danh mục trái cây sấy dẻo, trái cây sấy giòn và hạt dinh dưỡng xuất khẩu B2B của VINAXO: Xoài, Thanh long đỏ, Mít, Đu đủ, Chuối, Hạt điều, Mắc ca, Hạt sen và gia công OEM.',
        canonical: `${SITE_URL}/products`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/products`,
        ogImage: `${SITE_URL}/images/products/soft-dried-mango.jpg`,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Sản phẩm trái cây sấy và hạt dinh dưỡng – VINAXO',
            url: `${SITE_URL}/products`,
            inLanguage: 'vi',
          },
          buildBreadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Sản phẩm', path: '/products' },
          ]),
        ],
      },
    },
    {
      out: 'quality.html',
      loc: `${SITE_URL}/quality`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      seo: {
        title: 'Chất lượng và chứng nhận quốc tế – VINAXO',
        description:
          'Quy trình 6 bước kiểm soát chất lượng tại nhà máy VINAXO đạt chuẩn BRCGS Grade B, US FDA, ISO 22000:2018, Codex HACCP, Kosher OU và kiểm toán Sedex SMETA.',
        canonical: `${SITE_URL}/quality`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/quality`,
        ogImage: `${SITE_URL}/assets/images/factory-2026/factory-featured.jpg`,
        jsonLd: buildBreadcrumbSchema([
          { name: 'Trang chủ', path: '/' },
          { name: 'Chất lượng', path: '/quality' },
        ]),
      },
    },
    {
      out: 'markets.html',
      loc: `${SITE_URL}/markets`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      seo: {
        title: 'Thị trường xuất khẩu – VINAXO',
        description:
          'Mạng lưới xuất khẩu nông sản sấy dẻo VINAXO tới Hoa Kỳ (~70%), Liên minh Châu Âu (~20%), Hàn Quốc, Nga và hệ thống vận tải container quốc tế qua cảng Cát Lái, Cái Mép.',
        canonical: `${SITE_URL}/markets`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/markets`,
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: buildBreadcrumbSchema([
          { name: 'Trang chủ', path: '/' },
          { name: 'Thị trường', path: '/markets' },
        ]),
      },
    },
    {
      out: 'news.html',
      loc: `${SITE_URL}/news`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
      seo: {
        title: 'Báo chí và Tin tức – VINAXO',
        description:
          'Tổng hợp bài viết báo chí chính thống (Người Lao Động, CafeF, 24H, SGGP, Báo Đồng Tháp) và tin tức hoạt động thu mua, chế biến, xuất khẩu của VINAXO.',
        canonical: `${SITE_URL}/news`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/news`,
        ogImage: `${SITE_URL}/assets/images/news_export.jpg`,
        jsonLd: buildBreadcrumbSchema([
          { name: 'Trang chủ', path: '/' },
          { name: 'Báo chí & Tin tức', path: '/news' },
        ]),
      },
    },
    {
      out: 'brochure.html',
      loc: `${SITE_URL}/brochure`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      seo: {
        title: 'Catalogue & Brochure – VINAXO',
        description:
          'Xem trực tuyến và tải xuống Hồ sơ năng lực & Brochure chính thức 2026 của Công ty TNHH VINAXO: danh mục sản phẩm, năng lực nhà máy và chứng nhận quốc tế.',
        canonical: `${SITE_URL}/brochure`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/brochure`,
        ogImage: BROCHURE_OG_IMAGE,
        jsonLd: buildBreadcrumbSchema([
          { name: 'Trang chủ', path: '/' },
          { name: 'Brochure Công Ty', path: '/brochure' },
        ]),
      },
    },
    {
      out: 'contact.html',
      loc: `${SITE_URL}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      seo: {
        title: 'Liên hệ và nhận báo giá – VINAXO',
        description:
          'Liên hệ Công ty TNHH VINAXO (Đồng Tháp) để nhận báo giá CIF/FOB container, đăng ký mẫu thử nghiệm và tư vấn gia công OEM trái cây sấy xuất khẩu.',
        canonical: `${SITE_URL}/contact`,
        robots: 'index, follow',
        ogType: 'website',
        ogUrl: `${SITE_URL}/contact`,
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Liên hệ và nhận báo giá – VINAXO',
            url: `${SITE_URL}/contact`,
            inLanguage: 'vi',
          },
          buildBreadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Liên hệ', path: '/contact' },
          ]),
        ],
      },
    },
  ];

  // Generate static HTML files for top-level routes
  for (const route of staticRoutes) {
    writeRouteHtml(route.out, applySeoToHtml(templateHtml, route.seo));
  }

  // Alias /press-media canonicalizes cleanly to /news
  const newsSeo = staticRoutes.find((r) => r.out === 'news.html').seo;
  writeRouteHtml('press-media.html', applySeoToHtml(templateHtml, newsSeo));

  // Generate static HTML files for each product detail route
  for (const product of products) {
    const slug = product.slug;
    const nameVi = product.nameVi || product.name_vi || product.name || slug;
    const descVi =
      product.descriptionVi ||
      product.description_vi ||
      product.shortDescriptionVi ||
      `${nameVi} – Sản phẩm xuất khẩu B2B của ${company.company_name_vi}.`;
    const canonical = `${SITE_URL}/products/${slug}`;
    const ogImage = normalizeUrl(product.imageWebp || product.image || product.imageJpg);

    writeRouteHtml(
      path.join('products', `${slug}.html`),
      applySeoToHtml(templateHtml, {
        title: `${nameVi} – VINAXO`,
        description: descVi.slice(0, 300),
        canonical,
        robots: 'index, follow',
        ogType: 'product',
        ogUrl: canonical,
        ogImage,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: nameVi,
            description: descVi.slice(0, 300),
            image: ogImage,
            sku: slug,
            url: canonical,
            brand: { '@type': 'Brand', name: 'VINAXO' },
            manufacturer: {
              '@type': 'Organization',
              name: company.company_name_vi,
              url: SITE_URL,
            },
          },
          buildBreadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Sản phẩm', path: '/products' },
            { name: nameVi, path: `/products/${slug}` },
          ]),
        ],
      })
    );
  }

  // Generate static HTML files for each published news article
  for (const article of publishedArticles) {
    const slug = article.slug;
    const seoTitle = article.seo_title_vi || article.title_vi || slug;
    const title = seoTitle.includes('VINAXO') ? seoTitle : `${seoTitle} – VINAXO`;
    const desc = (article.seo_description_vi || article.excerpt_vi || article.body_vi || '').slice(0, 300);
    const canonical = `${SITE_URL}/tin-tuc/${slug}`;
    const ogImage = normalizeUrl(article.cover_image);

    writeRouteHtml(
      path.join('tin-tuc', `${slug}.html`),
      applySeoToHtml(templateHtml, {
        title,
        description: desc,
        canonical,
        robots: 'index, follow',
        ogType: 'article',
        ogUrl: canonical,
        ogImage,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title_vi,
            description: desc,
            image: [ogImage],
            datePublished: article.published_at,
            dateModified: article.updated_at || article.published_at,
            inLanguage: 'vi',
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
            author: { '@type': 'Person', name: article.author || company.company_name_vi },
            publisher: {
              '@type': 'Organization',
              name: company.company_name_vi,
              logo: { '@type': 'ImageObject', url: LOGO_URL },
            },
          },
          buildBreadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Báo chí & Tin tức', path: '/news' },
            { name: article.title_vi, path: `/tin-tuc/${slug}` },
          ]),
        ],
      })
    );
  }

  // Generate true HTTP 404 page with noindex & zero canonical
  writeRouteHtml(
    '404.html',
    applySeoToHtml(templateHtml, {
      title: '404 – Không tìm thấy trang – VINAXO',
      description: 'Trang bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới.',
      canonical: null,
      robots: 'noindex, nofollow',
      ogType: 'website',
      ogUrl: `${SITE_URL}/404`,
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: null,
    })
  );

  // Build sitemap.xml dynamically from published CMS content + static routes
  const sitemapEntries = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    ...staticRoutes.map((r) => ({
      loc: r.loc,
      lastmod: r.lastmod,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...products.map((p) => ({
      loc: `${SITE_URL}/products/${p.slug}`,
      lastmod: p._mtime || today,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...publishedArticles.map((a) => ({
      loc: `${SITE_URL}/tin-tuc/${a.slug}`,
      lastmod: formatDate(a.updated_at || a.published_at, a._mtime || today),
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const sitemapXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapEntries
      .map(
        (entry) =>
          `  <url>\n` +
          `    <loc>${escapeHtml(entry.loc)}</loc>\n` +
          `    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>\n` +
          `    <changefreq>${entry.changefreq}</changefreq>\n` +
          `    <priority>${entry.priority}</priority>\n` +
          `  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(
    `Generated SEO artifacts: ${staticRoutes.length + 2} core pages, ${products.length} product pages, ${publishedArticles.length} news articles, 404.html, and sitemap.xml (${sitemapEntries.length} URLs).`
  );
}

main();
