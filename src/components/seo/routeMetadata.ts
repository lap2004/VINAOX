import { Language } from '../../i18n/LanguageContext';
import { SITE_CONFIG, normalizeCanonicalUrl } from '../../config/siteConfig';
import { COMPANY_INFO } from '../../data/company';
import { productsData, ProductItem } from '../../data/products';
import { getArticleBySlug } from '../../services/contentService';
import { toAbsoluteOgImage } from './seoUtils';

export interface ResolvedSeoMetadata {
  title: string;
  description: string;
  canonical: string | null;
  robots: string;
  ogType: 'website' | 'article' | 'product';
  ogUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogLocale: 'vi_VN' | 'en_US';
  ogLocaleAlternate: 'en_US' | 'vi_VN';
  twitterCard: 'summary_large_image';
  jsonLd: Record<string, unknown> | Array<Record<string, unknown>> | null;
}

function normalizePath(pathname: string): string {
  const clean = (pathname || '/').split('?')[0].split('#')[0];
  if (clean === '/' || clean === '') return '/';
  return `/${clean.replace(/^\/+|\/+$/g, '')}`;
}

function buildOrganizationSchema(lang: Language): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_INFO.legalNameVi,
    alternateName: COMPANY_INFO.legalNameEn,
    url: SITE_CONFIG.siteUrl,
    logo: SITE_CONFIG.logoUrl,
    taxID: COMPANY_INFO.taxCode,
    foundingDate: String(COMPANY_INFO.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: lang === 'vi' ? COMPANY_INFO.headquarters.addressVi : COMPANY_INFO.headquarters.addressEn,
      addressRegion: lang === 'vi' ? 'Đồng Tháp' : 'Dong Thap Province',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.contacts.hotline,
      contactType: 'sales',
      email: COMPANY_INFO.contacts.email,
      availableLanguage: ['Vietnamese', 'English'],
    },
  };
}

function buildWebsiteSchema(lang: Language): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    inLanguage: lang,
  };
}

function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: normalizeCanonicalUrl(item.path),
    })),
  };
}

function buildProductSchema(product: ProductItem, lang: Language, canonical: string): Record<string, unknown> {
  const isVi = lang === 'vi';
  const name = isVi ? product.nameVi : product.name;
  const description = isVi
    ? (product.descriptionVi || product.shortDescriptionVi || product.vi.desc)
    : (product.description || product.shortDescription || product.en.desc);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: toAbsoluteOgImage(product.imageWebp || product.image || product.imageJpg),
    sku: product.slug,
    category: isVi ? product.categoryLabelVi : product.categoryLabelEn,
    url: canonical,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    manufacturer: {
      '@type': 'Organization',
      name: isVi ? COMPANY_INFO.legalNameVi : COMPANY_INFO.legalNameEn,
      url: SITE_CONFIG.siteUrl,
    },
  };
}

function resolveAdminTitle(path: string): string {
  if (path === '/admin/login') return 'Đăng nhập Quản trị – VINAXO CMS';
  if (path === '/admin' || path === '/admin/dashboard') return 'Bảng điều khiển – VINAXO CMS';
  if (path === '/admin/news') return 'Quản lý Tin tức – VINAXO CMS';
  if (path === '/admin/news/new') return 'Soạn thảo Bài viết – VINAXO CMS';
  if (/^\/admin\/news\/[^/]+\/edit$/.test(path)) return 'Chỉnh sửa Bài viết – VINAXO CMS';
  if (path === '/admin/products') return 'Quản lý Sản phẩm – VINAXO CMS';
  if (path === '/admin/media') return 'Thư viện Hình ảnh – VINAXO CMS';
  if (path === '/admin/certificates') return 'Quản lý Chứng nhận – VINAXO CMS';
  if (path === '/admin/brochure') return 'Quản lý Brochure – VINAXO CMS';
  if (path === '/admin/settings') return 'Cài đặt Hệ thống – VINAXO CMS';
  return 'VINAXO Admin CMS';
}

export function resolveRouteSeo(pathname: string, language: Language): ResolvedSeoMetadata {
  const isVi = language === 'vi';
  const path = normalizePath(pathname);
  const ogLocale: 'vi_VN' | 'en_US' = isVi ? 'vi_VN' : 'en_US';
  const ogLocaleAlternate: 'en_US' | 'vi_VN' = isVi ? 'en_US' : 'vi_VN';

  // Admin portal routes — always noindex, nofollow, no canonical
  if (path === '/admin' || path.startsWith('/admin/')) {
    const title = resolveAdminTitle(path);
    const description = 'VINAXO Internal Content Management Portal.';
    return {
      title,
      description,
      canonical: null,
      robots: 'noindex, nofollow',
      ogType: 'website',
      ogUrl: normalizeCanonicalUrl(path),
      ogTitle: title,
      ogDescription: description,
      ogImage: SITE_CONFIG.defaultOgImage,
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: null,
    };
  }

  // Legacy .html aliases resolve via <Navigate> immediately, map them cleanly
  const effectivePath =
    path === '/index.html'
      ? '/'
      : path.endsWith('.html')
      ? path.replace(/\.html$/, '')
      : path;

  const homeLabel = isVi ? 'Trang chủ' : 'Home';

  if (effectivePath === '/') {
    const title = isVi
      ? 'VINAXO – Nhà sản xuất trái cây sấy nhiệt đới Việt Nam'
      : 'VINAXO – Tropical Dried Fruit Manufacturer & Exporter from Vietnam';
    const description = isVi
      ? 'CÔNG TY TNHH VINAXO — Chế biến và xuất khẩu trái cây sấy dẻo tự nhiên (xoài, mít, thanh long, dứa, chuối) từ Đồng bằng Sông Cửu Long. Đạt chuẩn BRCGS Grade B, OCOP 3 Sao, xuất khẩu Hoa Kỳ và Châu Âu.'
      : 'VINAXO COMPANY LIMITED — Processing and exporting 100% natural soft-dried tropical fruits from Vietnam’s Mekong Delta. BRCGS Grade B food safety certified, trusted across the US, EU, and global B2B markets.';
    const canonical = normalizeCanonicalUrl('/');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: SITE_CONFIG.defaultOgImage,
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: [buildOrganizationSchema(language), buildWebsiteSchema(language)],
    };
  }

  if (effectivePath === '/about') {
    const title = isVi ? 'Về chúng tôi – VINAXO' : 'About Us – VINAXO';
    const description = isVi
      ? 'Tìm hiểu về Công ty TNHH VINAXO tại Đồng Tháp: tổ hợp nhà máy 25.000 m², công suất 300 tấn thành phẩm/tháng, vùng trồng liên kết ĐBSCL và hành trình vươn ra thị trường quốc tế.'
      : 'Discover VINAXO Company Limited in Dong Thap, Vietnam: 25,000 m² processing complex, 300 MT/month output capacity, direct Mekong Delta sourcing, and international export milestones.';
    const canonical = normalizeCanonicalUrl('/about');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: toAbsoluteOgImage('/assets/images/about_vietnam.jpg'),
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: buildBreadcrumbSchema([
        { name: homeLabel, path: '/' },
        { name: isVi ? 'Về chúng tôi' : 'About Us', path: '/about' },
      ]),
    };
  }

  if (effectivePath === '/products') {
    const title = isVi
      ? 'Sản phẩm trái cây sấy và hạt dinh dưỡng – VINAXO'
      : 'Dried Fruits & Nuts Export Catalog – VINAXO';
    const description = isVi
      ? 'Danh mục trái cây sấy dẻo, trái cây sấy giòn và hạt dinh dưỡng xuất khẩu B2B của VINAXO: Xoài, Thanh long đỏ, Mít, Đu đủ, Chuối, Hạt điều, Mắc ca, Hạt sen và gia công OEM.'
      : 'Explore VINAXO’s B2B export catalog of soft-dried tropical fruits, crispy fruit chips, nuts, and private-label OEM manufacturing with full moisture, Brix, and packaging specs.';
    const canonical = normalizeCanonicalUrl('/products');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: toAbsoluteOgImage('/images/products/soft-dried-mango.jpg'),
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: canonical,
          inLanguage: language,
        },
        buildBreadcrumbSchema([
          { name: homeLabel, path: '/' },
          { name: isVi ? 'Sản phẩm' : 'Products', path: '/products' },
        ]),
      ],
    };
  }

  if (effectivePath.startsWith('/products/')) {
    const slug = effectivePath.slice('/products/'.length);
    const product = productsData.find(
      (p) => p.slug === slug || p.id === slug || p.aliases?.includes(slug)
    );
    if (product) {
      const productName = isVi ? product.nameVi : product.name;
      const title = `${productName} – VINAXO`;
      const description = isVi
        ? (product.descriptionVi || product.shortDescriptionVi || product.vi.desc)
        : (product.description || product.shortDescription || product.en.desc);
      const canonical = normalizeCanonicalUrl(`/products/${product.slug}`);
      const ogImage = toAbsoluteOgImage(product.imageWebp || product.image || product.imageJpg);
      return {
        title,
        description,
        canonical,
        robots: 'index, follow',
        ogType: 'product',
        ogUrl: canonical,
        ogTitle: title,
        ogDescription: description,
        ogImage,
        ogLocale,
        ogLocaleAlternate,
        twitterCard: SITE_CONFIG.twitterCard,
        jsonLd: [
          buildProductSchema(product, language, canonical),
          buildBreadcrumbSchema([
            { name: homeLabel, path: '/' },
            { name: isVi ? 'Sản phẩm' : 'Products', path: '/products' },
            { name: productName, path: `/products/${product.slug}` },
          ]),
        ],
      };
    }
  }

  if (effectivePath === '/quality') {
    const title = isVi
      ? 'Chất lượng và chứng nhận quốc tế – VINAXO'
      : 'Quality Assurance & International Certifications – VINAXO';
    const description = isVi
      ? 'Quy trình 6 bước kiểm soát chất lượng tại nhà máy VINAXO đạt chuẩn BRCGS Grade B, US FDA, ISO 22000:2018, Codex HACCP, Kosher OU và kiểm toán Sedex SMETA.'
      : 'Inside VINAXO’s 6-step quality control system and international compliance credentials: BRCGS Food Safety Grade B, US FDA Registration, ISO 22000:2018, HACCP, Kosher OU, and Sedex SMETA.';
    const canonical = normalizeCanonicalUrl('/quality');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: toAbsoluteOgImage('/assets/images/factory-2026/factory-featured.jpg'),
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: buildBreadcrumbSchema([
        { name: homeLabel, path: '/' },
        { name: isVi ? 'Chất lượng' : 'Our Quality', path: '/quality' },
      ]),
    };
  }

  if (effectivePath === '/markets') {
    const title = isVi
      ? 'Thị trường xuất khẩu – VINAXO'
      : 'Global Export Markets – VINAXO';
    const description = isVi
      ? 'Mạng lưới xuất khẩu nông sản sấy dẻo VINAXO tới Hoa Kỳ (~70%), Liên minh Châu Âu (~20%), Hàn Quốc, Nga và hệ thống vận tải container quốc tế qua cảng Cát Lái, Cái Mép.'
      : 'VINAXO’s global B2B export footprint serving the United States (~70%), European Union (~20%), East Asia, and CIS via international FCL/LCL and air freight corridors.';
    const canonical = normalizeCanonicalUrl('/markets');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: SITE_CONFIG.defaultOgImage,
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: buildBreadcrumbSchema([
        { name: homeLabel, path: '/' },
        { name: isVi ? 'Thị trường' : 'Global Markets', path: '/markets' },
      ]),
    };
  }

  if (effectivePath === '/news' || effectivePath === '/press-media') {
    const title = isVi
      ? 'Báo chí và Tin tức – VINAXO'
      : 'Press & Media Coverage – VINAXO';
    const description = isVi
      ? 'Tổng hợp bài viết báo chí chính thống (Người Lao Động, CafeF, 24H, SGGP, Báo Đồng Tháp) và tin tức hoạt động thu mua, chế biến, xuất khẩu của VINAXO.'
      : 'Verified national press features and corporate updates on VINAXO’s Mekong Delta fruit procurement, BRCGS food safety operations, and international export growth.';
    const canonical = normalizeCanonicalUrl('/news');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: toAbsoluteOgImage('/assets/images/news_export.jpg'),
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: buildBreadcrumbSchema([
        { name: homeLabel, path: '/' },
        { name: isVi ? 'Báo chí & Tin tức' : 'Press & Media', path: '/news' },
      ]),
    };
  }

  const articleMatch = effectivePath.match(/^\/(?:tin-tuc|news|press-media)\/([^/]+)$/);
  if (articleMatch) {
    const slug = decodeURIComponent(articleMatch[1]);
    const article = getArticleBySlug(slug);
    if (article) {
      const articleTitle = isVi
        ? (article.seo_title_vi || article.title_vi)
        : (article.seo_title_en || article.title_en || article.title_vi);
      const rawTitle = isVi ? article.title_vi : (article.title_en || article.title_vi);
      const description = isVi
        ? (article.seo_description_vi || article.excerpt_vi || article.body_vi || '')
        : (article.seo_description_en || article.excerpt_en || article.body_en || article.excerpt_vi || '');
      const title = articleTitle.includes(SITE_CONFIG.name)
        ? articleTitle
        : `${articleTitle} – VINAXO`;
      const canonical = normalizeCanonicalUrl(`/tin-tuc/${article.slug}`);
      const ogImage = toAbsoluteOgImage(article.cover_image);

      return {
        title,
        description: description.slice(0, 300),
        canonical,
        robots: 'index, follow',
        ogType: 'article',
        ogUrl: canonical,
        ogTitle: title,
        ogDescription: description.slice(0, 300),
        ogImage,
        ogLocale,
        ogLocaleAlternate,
        twitterCard: SITE_CONFIG.twitterCard,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: rawTitle,
            description: description.slice(0, 300),
            image: [ogImage],
            datePublished: article.published_at,
            dateModified: article.updated_at || article.published_at,
            inLanguage: language,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonical,
            },
            author: {
              '@type': 'Person',
              name: article.author || COMPANY_INFO.legalNameVi,
            },
            publisher: {
              '@type': 'Organization',
              name: isVi ? COMPANY_INFO.legalNameVi : COMPANY_INFO.legalNameEn,
              logo: {
                '@type': 'ImageObject',
                url: SITE_CONFIG.logoUrl,
              },
            },
          },
          buildBreadcrumbSchema([
            { name: homeLabel, path: '/' },
            { name: isVi ? 'Báo chí & Tin tức' : 'Press & Media', path: '/news' },
            { name: rawTitle, path: `/tin-tuc/${article.slug}` },
          ]),
        ],
      };
    }

    const notFoundTitle = isVi ? 'Bài viết không tồn tại – VINAXO' : 'Article Not Found – VINAXO';
    const notFoundDesc = isVi
      ? 'Bài viết bạn tìm kiếm không tồn tại hoặc đã được gỡ xuống.'
      : 'The requested article does not exist or is no longer available.';
    return {
      title: notFoundTitle,
      description: notFoundDesc,
      canonical: null,
      robots: 'noindex, nofollow',
      ogType: 'website',
      ogUrl: normalizeCanonicalUrl(effectivePath),
      ogTitle: notFoundTitle,
      ogDescription: notFoundDesc,
      ogImage: SITE_CONFIG.defaultOgImage,
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: null,
    };
  }

  if (effectivePath === '/brochure') {
    const title = isVi ? 'Catalogue & Brochure – VINAXO' : 'Company Profile & Brochure 2026 – VINAXO';
    const description = isVi
      ? 'Xem trực tuyến và tải xuống Hồ sơ năng lực & Brochure chính thức 2026 của Công ty TNHH VINAXO: danh mục sản phẩm, năng lực nhà máy và chứng nhận quốc tế.'
      : 'Read online or download the official VINAXO 2026 Company Profile & Brochure featuring our dried fruit collections, 25,000 m² facility specs, and global certifications.';
    const canonical = normalizeCanonicalUrl('/brochure');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: SITE_CONFIG.brochureOgImage,
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: buildBreadcrumbSchema([
        { name: homeLabel, path: '/' },
        { name: isVi ? 'Brochure Công Ty' : 'Company Brochure', path: '/brochure' },
      ]),
    };
  }

  if (effectivePath === '/contact') {
    const title = isVi
      ? 'Liên hệ và nhận báo giá – VINAXO'
      : 'Contact & Request B2B Quote – VINAXO';
    const description = isVi
      ? 'Liên hệ Công ty TNHH VINAXO (Đồng Tháp) để nhận báo giá CIF/FOB container, đăng ký mẫu thử nghiệm và tư vấn gia công OEM trái cây sấy xuất khẩu.'
      : 'Contact VINAXO Company Limited in Vietnam for wholesale CIF/FOB container pricing, commercial sample kits, and private-label OEM dried fruit partnerships.';
    const canonical = normalizeCanonicalUrl('/contact');
    return {
      title,
      description,
      canonical,
      robots: 'index, follow',
      ogType: 'website',
      ogUrl: canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: SITE_CONFIG.defaultOgImage,
      ogLocale,
      ogLocaleAlternate,
      twitterCard: SITE_CONFIG.twitterCard,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: title,
          description,
          url: canonical,
          inLanguage: language,
        },
        buildBreadcrumbSchema([
          { name: homeLabel, path: '/' },
          { name: isVi ? 'Liên hệ' : 'Contact', path: '/contact' },
        ]),
      ],
    };
  }

  // Fallback 404 Not Found
  const notFoundTitle = isVi ? '404 – Không tìm thấy trang – VINAXO' : '404 – Page Not Found – VINAXO';
  const notFoundDesc = isVi
    ? 'Trang bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới.'
    : 'The requested page could not be found on VINAXO.';
  return {
    title: notFoundTitle,
    description: notFoundDesc,
    canonical: null,
    robots: 'noindex, nofollow',
    ogType: 'website',
    ogUrl: normalizeCanonicalUrl(effectivePath),
    ogTitle: notFoundTitle,
    ogDescription: notFoundDesc,
    ogImage: SITE_CONFIG.defaultOgImage,
    ogLocale,
    ogLocaleAlternate,
    twitterCard: SITE_CONFIG.twitterCard,
    jsonLd: null,
  };
}
