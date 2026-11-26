import { Language, pickLocale } from '../../i18n/localize';
import { SITE_CONFIG, normalizeCanonicalUrl } from '../../config/siteConfig';
import { COMPANY_INFO, getCompanyAddress, getLegalCompanyName } from '../../data/company';
import { getProductLocalized, productsData, ProductItem } from '../../data/products';
import { getArticleBySlug, getArticleLocalized } from '../../services/contentService';
import { toAbsoluteOgImage } from './seoUtils';

export type OgLocale = 'vi_VN' | 'en_US' | 'ko_KR' | 'zh_CN';

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
  ogLocale: OgLocale;
  ogLocaleAlternate: OgLocale;
  twitterCard: 'summary_large_image';
  jsonLd: Record<string, unknown> | Array<Record<string, unknown>> | null;
}

const OG_LOCALE_MAP: Record<Language, OgLocale> = {
  vi: 'vi_VN',
  en: 'en_US',
  ko: 'ko_KR',
  'zh-CN': 'zh_CN',
};

function normalizePath(pathname: string): string {
  const clean = (pathname || '/').split('?')[0].split('#')[0];
  if (clean === '/' || clean === '') return '/';
  return `/${clean.replace(/^\/+|\/+$/g, '')}`;
}

function buildOrganizationSchema(lang: Language): Record<string, unknown> {
  const legalName = getLegalCompanyName(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: legalName,
    alternateName: lang === 'vi' ? COMPANY_INFO.legalNameEn : COMPANY_INFO.legalNameVi,
    url: SITE_CONFIG.siteUrl,
    logo: SITE_CONFIG.logoUrl,
    taxID: COMPANY_INFO.taxCode,
    foundingDate: String(COMPANY_INFO.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: getCompanyAddress(lang),
      addressRegion: pickLocale(lang, {
        vi: 'Đồng Tháp',
        en: 'Dong Thap Province',
        ko: '동탑성',
        zh: '同塔省',
      }),
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.contacts.hotline,
      contactType: 'sales',
      email: COMPANY_INFO.contacts.email,
      availableLanguage: ['Vietnamese', 'English', 'Korean', 'Chinese'],
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
  const loc = getProductLocalized(product, lang);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: loc.name,
    description: loc.desc,
    image: toAbsoluteOgImage(product.imageWebp || product.image || product.imageJpg),
    sku: product.slug,
    category: loc.categoryLabel,
    url: canonical,
    inLanguage: lang,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    manufacturer: {
      '@type': 'Organization',
      name: getLegalCompanyName(lang),
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
  const path = normalizePath(pathname);
  const ogLocale: OgLocale = OG_LOCALE_MAP[language] || 'vi_VN';
  const ogLocaleAlternate: OgLocale = language === 'vi' ? 'en_US' : 'vi_VN';

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

  const homeLabel = pickLocale(language, {
    vi: 'Trang chủ',
    en: 'Home',
    ko: '홈',
    zh: '首页',
  });

  if (effectivePath === '/') {
    const title = pickLocale(language, {
      vi: 'VINAXO – Nhà sản xuất trái cây sấy nhiệt đới Việt Nam',
      en: 'VINAXO – Tropical Dried Fruit Manufacturer & Exporter from Vietnam',
      ko: 'VINAXO – 베트남 프리미엄 열대 건조 과일 제조 및 수출 기업',
      zh: 'VINAXO – 越南高端热带果干源头制造商与出口商',
    });
    const description = pickLocale(language, {
      vi: 'CÔNG TY TNHH VINAXO — Chế biến và xuất khẩu trái cây sấy dẻo tự nhiên (xoài, mít, thanh long, dứa, chuối) từ Đồng bằng Sông Cửu Long. Đạt chuẩn BRCGS Grade B, OCOP 3 Sao, xuất khẩu Hoa Kỳ và Châu Âu.',
      en: 'VINAXO COMPANY LIMITED — Processing and exporting 100% natural soft-dried tropical fruits from Vietnam’s Mekong Delta. BRCGS Grade B food safety certified, trusted across the US, EU, and global B2B markets.',
      ko: 'VINAXO COMPANY LIMITED — 베트남 메콩 델타산 100% 천연 소프트 건조 과일(망고, 잭프루트, 적색 용과, 바나나) 제조·수출 전문 기업. BRCGS Grade B 및 OCOP 3성급 인증 획득.',
      zh: 'VINAXO COMPANY LIMITED — 扎根越南湄公河三角洲，专业生产与出口 100% 天然软烘干果（芒果干、菠萝蜜干、红心火龙果干、香蕉片），通过 BRCGS B 级食品安全认证。',
    });
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
    const title = pickLocale(language, {
      vi: 'Về chúng tôi – VINAXO',
      en: 'About Us – VINAXO',
      ko: '회사 소개 – VINAXO',
      zh: '关于我们 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Tìm hiểu về Công ty TNHH VINAXO tại Đồng Tháp: tổ hợp nhà máy 25.000 m², công suất 300 tấn thành phẩm/tháng, vùng trồng liên kết ĐBSCL và hành trình vươn ra thị trường quốc tế.',
      en: 'Discover VINAXO COMPANY LIMITED in Dong Thap, Vietnam: 25,000 m² processing complex, 300 MT/month output capacity, direct Mekong Delta sourcing, and international export milestones.',
      ko: '베트남 동탑성 VINAXO COMPANY LIMITED 소개: 25,000 m² 규모의 현대식 가공 공장, 월 300톤 생산 능력, 메콩 델타 직영 산지 및 글로벌 수출 이정표.',
      zh: '探索位于越南同塔省的 VINAXO COMPANY LIMITED：25,000 平方米一体化工厂、月产 300 吨成品产能、湄公河三角洲直采果园及全球出口里程碑。',
    });
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
        { name: pickLocale(language, { vi: 'Về chúng tôi', en: 'About Us', ko: '회사 소개', zh: '关于我们' }), path: '/about' },
      ]),
    };
  }

  if (effectivePath === '/products') {
    const title = pickLocale(language, {
      vi: 'Sản phẩm trái cây sấy và hạt dinh dưỡng – VINAXO',
      en: 'Dried Fruits & Nuts Export Catalog – VINAXO',
      ko: '건조 과일 및 견과류 수출 제품 카탈로그 – VINAXO',
      zh: '热带果干与坚果出口产品目录 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Danh mục trái cây sấy dẻo, trái cây sấy giòn và hạt dinh dưỡng xuất khẩu B2B của VINAXO: Xoài, Thanh long đỏ, Mít, Đu đủ, Chuối, Hạt điều, Mắc ca, Hạt sen và gia công OEM.',
      en: 'Explore VINAXO’s B2B export catalog of soft-dried tropical fruits, crispy fruit chips, nuts, and private-label OEM manufacturing with full moisture, Brix, and packaging specs.',
      ko: 'VINAXO의 B2B 수출용 소프트 건조 과일, 크리스피 칩, 견과류(망고, 적색 용과, 잭프루트, 바나나, 캐슈넛, 마카다미아, 연자육) 및 OEM 생산 규격 카탈로그.',
      zh: '浏览 VINAXO B2B 出口产品目录：软烘干果、香脆果蔬片、坚果仁（芒果干、红心火龙果、菠萝蜜、香蕉、腰果、夏威夷果、莲子）及 OEM 贴牌规格参数。',
    });
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
          { name: pickLocale(language, { vi: 'Sản phẩm', en: 'Products', ko: '제품', zh: '产品' }), path: '/products' },
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
      const loc = getProductLocalized(product, language);
      const title = `${loc.name} – VINAXO`;
      const description = loc.desc;
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
            { name: pickLocale(language, { vi: 'Sản phẩm', en: 'Products', ko: '제품', zh: '产品' }), path: '/products' },
            { name: loc.name, path: `/products/${product.slug}` },
          ]),
        ],
      };
    }
  }

  if (effectivePath === '/quality') {
    const title = pickLocale(language, {
      vi: 'Chất lượng và chứng nhận quốc tế – VINAXO',
      en: 'Quality Assurance & International Certifications – VINAXO',
      ko: '품질 보증 및 국제 식품안전 인증 – VINAXO',
      zh: '质量体系保障与国际权威认证 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Quy trình 6 bước kiểm soát chất lượng tại nhà máy VINAXO đạt chuẩn BRCGS Grade B, US FDA, ISO 22000:2018, Codex HACCP, Kosher OU và kiểm toán Sedex SMETA.',
      en: 'Inside VINAXO’s 6-step quality control system and international compliance credentials: BRCGS Food Safety Grade B, US FDA Registration, ISO 22000:2018, HACCP, Kosher OU, and Sedex SMETA.',
      ko: 'BRCGS 식품안전 Grade B, 미국 FDA 시설 등록, ISO 22000:2018, Codex HACCP, 코셔 OU 인증 및 Sedex SMETA 윤리 감사를 준수하는 VINAXO 6단계 품질 관리 공정.',
      zh: '深入了解 VINAXO 六步品控流程及国际资质认证：BRCGS 食品安全 B 级、美国 FDA 注册、ISO 22000:2018、HACCP、Kosher OU 及 Sedex SMETA 审核。',
    });
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
        { name: pickLocale(language, { vi: 'Chất lượng', en: 'Our Quality', ko: '품질 보증', zh: '品质保证' }), path: '/quality' },
      ]),
    };
  }

  if (effectivePath === '/markets') {
    const title = pickLocale(language, {
      vi: 'Thị trường xuất khẩu – VINAXO',
      en: 'Global Export Markets – VINAXO',
      ko: '글로벌 수출 시장 – VINAXO',
      zh: '全球出口市场布局 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Mạng lưới xuất khẩu nông sản sấy dẻo VINAXO tới Hoa Kỳ (~70%), Liên minh Châu Âu (~20%), Hàn Quốc, Nga và hệ thống vận tải container quốc tế qua cảng Cát Lái, Cái Mép.',
      en: 'VINAXO’s global B2B export footprint serving the United States (~70%), European Union (~20%), East Asia, and CIS via international FCL/LCL and air freight corridors.',
      ko: '미국(~70%), 유럽연합(~20%), 한국·동아시아 및 러시아 시장을 아우르는 VINAXO의 글로벌 B2B FCL/LCL 및 항공 수출 물류 네트워크.',
      zh: '覆盖美国（约 70%）、欧盟（约 20%）、东亚及俄语区的 VINAXO 全球 B2B 出口网络，经由吉莱港、盖梅港提供整柜及空运高效物流。',
    });
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
        { name: pickLocale(language, { vi: 'Thị trường', en: 'Global Markets', ko: '수출 시장', zh: '全球市场' }), path: '/markets' },
      ]),
    };
  }

  if (effectivePath === '/news' || effectivePath === '/press-media') {
    const title = pickLocale(language, {
      vi: 'Báo chí và Tin tức – VINAXO',
      en: 'Press & Media Coverage – VINAXO',
      ko: '언론 보도 및 기업 뉴스 – VINAXO',
      zh: '媒体报道与企业新闻 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Tổng hợp bài viết báo chí chính thống (Người Lao Động, CafeF, 24H, SGGP, Báo Đồng Tháp) và tin tức hoạt động thu mua, chế biến, xuất khẩu của VINAXO.',
      en: 'Verified national press features and corporate updates on VINAXO’s Mekong Delta fruit procurement, BRCGS food safety operations, and international export growth.',
      ko: '메콩 델타 원물 수매, BRCGS 식품안전 가공 공장 및 VINAXO의 글로벌 수출 성과에 관한 주요 언론 보도 아카이브.',
      zh: '汇集各大权威媒体对 VINAXO 湄公河产区直采、BRCGS 食品安全加工及国际出口发展的深度报道与新闻资讯。',
    });
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
        { name: pickLocale(language, { vi: 'Báo chí & Tin tức', en: 'Press & Media', ko: '언론 및 뉴스', zh: '新闻与媒体' }), path: '/news' },
      ]),
    };
  }

  const articleMatch = effectivePath.match(/^\/(?:tin-tuc|news|press-media)\/([^/]+)$/);
  if (articleMatch) {
    const slug = decodeURIComponent(articleMatch[1]);
    const article = getArticleBySlug(slug);
    if (article) {
      const locArticle = getArticleLocalized(article, language);
      const articleTitle = locArticle.seoTitle || locArticle.title;
      const rawTitle = locArticle.title;
      const description = (locArticle.seoDescription || locArticle.excerpt || locArticle.body || '').slice(0, 300);
      const title = articleTitle.includes(SITE_CONFIG.name)
        ? articleTitle
        : `${articleTitle} – VINAXO`;
      const canonical = normalizeCanonicalUrl(`/tin-tuc/${article.slug}`);
      const ogImage = toAbsoluteOgImage(article.cover_image);

      return {
        title,
        description,
        canonical,
        robots: 'index, follow',
        ogType: 'article',
        ogUrl: canonical,
        ogTitle: title,
        ogDescription: description,
        ogImage,
        ogLocale,
        ogLocaleAlternate,
        twitterCard: SITE_CONFIG.twitterCard,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: rawTitle,
            description,
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
              name: article.author || getLegalCompanyName(language),
            },
            publisher: {
              '@type': 'Organization',
              name: getLegalCompanyName(language),
              logo: {
                '@type': 'ImageObject',
                url: SITE_CONFIG.logoUrl,
              },
            },
          },
          buildBreadcrumbSchema([
            { name: homeLabel, path: '/' },
            { name: pickLocale(language, { vi: 'Báo chí & Tin tức', en: 'Press & Media', ko: '언론 및 뉴스', zh: '新闻与媒体' }), path: '/news' },
            { name: rawTitle, path: `/tin-tuc/${article.slug}` },
          ]),
        ],
      };
    }

    const notFoundTitle = pickLocale(language, {
      vi: 'Bài viết không tồn tại – VINAXO',
      en: 'Article Not Found – VINAXO',
      ko: '기사를 찾을 수 없습니다 – VINAXO',
      zh: '未找到该文章 – VINAXO',
    });
    const notFoundDesc = pickLocale(language, {
      vi: 'Bài viết bạn tìm kiếm không tồn tại hoặc đã được gỡ xuống.',
      en: 'The requested article does not exist or is no longer available.',
      ko: '요청하신 기사가 존재하지 않거나 열람할 수 없습니다.',
      zh: '您请求的报道文章不存在或已下线。',
    });
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
    const title = pickLocale(language, {
      vi: 'Catalogue & Brochure – VINAXO',
      en: 'Company Profile & Brochure 2026 – VINAXO',
      ko: '기업 소개서 및 브로슈어 2026 – VINAXO',
      zh: '企业宣传册与产品手册 2026 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Xem trực tuyến và tải xuống Hồ sơ năng lực & Brochure chính thức 2026 của Công ty TNHH VINAXO: danh mục sản phẩm, năng lực nhà máy và chứng nhận quốc tế.',
      en: 'Read online or download the official VINAXO 2026 Company Profile & Brochure featuring our dried fruit collections, 25,000 m² facility specs, and global certifications.',
      ko: 'VINAXO 공식 2026 기업 소개서(브로슈어)를 온라인으로 열람하거나 PDF로 다운로드하여 제품 라인업, 25,000 m² 공장 역량 및 국제 인증 현황을 확인하세요.',
      zh: '在线浏览或下载 VINAXO 2026 官方企业与产品手册（PDF），全面了解六大果干系列、25,000 平方米工厂产能及国际资质认证。',
    });
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
        { name: pickLocale(language, { vi: 'Brochure Công Ty', en: 'Company Brochure', ko: '기업 브로슈어', zh: '企业产品手册' }), path: '/brochure' },
      ]),
    };
  }

  if (effectivePath === '/contact') {
    const title = pickLocale(language, {
      vi: 'Liên hệ và nhận báo giá – VINAXO',
      en: 'Contact & Request B2B Quote – VINAXO',
      ko: '문의 및 수출 견적 요청 – VINAXO',
      zh: '联系我们与获取 B2B 报价 – VINAXO',
    });
    const description = pickLocale(language, {
      vi: 'Liên hệ Công ty TNHH VINAXO (Đồng Tháp) để nhận báo giá CIF/FOB container, đăng ký mẫu thử nghiệm và tư vấn gia công OEM trái cây sấy xuất khẩu.',
      en: 'Contact VINAXO COMPANY LIMITED in Vietnam for wholesale CIF/FOB container pricing, commercial sample kits, and private-label OEM dried fruit partnerships.',
      ko: 'CIF/FOB 컨테이너 수출 견적, 평가용 무상 샘플 키트 및 PB·OEM 건조 과일 위탁 생산 상담을 위해 베트남 VINAXO COMPANY LIMITED에 문의하세요.',
      zh: '欢迎联系位于越南同塔省的 VINAXO COMPANY LIMITED，索取 CIF/FOB 整柜报价、免费评估样品套装或洽谈 OEM 果干贴牌代工合作。',
    });
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
          { name: pickLocale(language, { vi: 'Liên hệ', en: 'Contact', ko: '문의하기', zh: '联系我们' }), path: '/contact' },
        ]),
      ],
    };
  }

  // Fallback 404 Not Found
  const notFoundTitle = pickLocale(language, {
    vi: '404 – Không tìm thấy trang – VINAXO',
    en: '404 – Page Not Found – VINAXO',
    ko: '404 – 페이지를 찾을 수 없습니다 – VINAXO',
    zh: '404 – 未找到页面 – VINAXO',
  });
  const notFoundDesc = pickLocale(language, {
    vi: 'Trang bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới.',
    en: 'The requested page could not be found on VINAXO.',
    ko: '요청하신 페이지를 찾을 수 없거나 주소가 변경되었습니다.',
    zh: '您访问的页面不存在或已变更地址。',
  });
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
