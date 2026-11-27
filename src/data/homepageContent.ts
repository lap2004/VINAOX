import { Language } from '../i18n/LanguageContext';
import {
  HomepageCategoryCard,
  HomepageContent,
  mergeHomepageContent,
} from '../shared/schemas/homepageSchema';
import { ProductItem } from './products';
import { pickLocalized } from './aboutContent';

export type {
  HomepageCategoryCard,
  HomepageContent,
  HomepageLinkType,
  HomepageSectionKey,
  HomepageSectionVisibility,
} from '../shared/schemas/homepageSchema';

export const FALLBACK_HOMEPAGE_CONTENT: HomepageContent = {
  sections: {
    hero: true,
    about: true,
    categories: true,
    featuredProducts: true,
    productionOem: true,
    qualityCerts: true,
    exportMarkets: true,
    news: true,
    closingCta: true,
  },
  sectionOrder: [
    'hero',
    'about',
    'categories',
    'featuredProducts',
    'productionOem',
    'qualityCerts',
    'exportMarkets',
    'news',
    'closingCta',
  ],
  hero: {
    eyebrow: { vi: 'VINAXO · NHÀ SẢN XUẤT & XUẤT KHẨU', en: 'VINAXO · MANUFACTURER & EXPORTER', ko: 'VINAXO · 제조 및 수출 기업', zh: 'VINAXO · 源头出口制造商' },
    headlineLine1: { vi: 'TRÁI CÂY SẤY', en: 'TROPICAL DRIED', ko: '베트남 열대', zh: '越南热带果干' },
    headlineLine2: { vi: 'HẠT DINH DƯỠNG', en: 'FRUIT & NUTS', ko: '건조 과일 &', zh: '与精选坚果' },
    headlineHighlight: { vi: '& GIA CÔNG OEM B2B', en: 'FOR GLOBAL B2B SUPPLY', ko: 'B2B · OEM 수출 공급', zh: '全球 B2B 与 OEM 供应' },
    description: {
      vi: 'Cung ứng 4 nhóm danh mục xuất khẩu cùng giải pháp gia công OEM cho đối tác bán lẻ và dịch vụ ẩm thực tại hơn 15 quốc gia.',
      en: 'Supplying 4 verified export product categories alongside custom OEM solutions across 15+ countries.',
      ko: '4대 정식 수출 제품군과 맞춤형 OEM 솔루션을 전 세계 15개국 이상에 공급합니다.',
      zh: '面向全球 15+ 国家及地区稳定供应四大出口产品线与 OEM 定制方案。',
    },
    primaryCtaLabel: { vi: 'Khám Phá Sản Phẩm', en: 'Explore Products', ko: '제품 카탈로그 보기', zh: '浏览全部产品' },
    primaryCtaLink: '/products',
    secondaryCtaLabel: { vi: 'Yêu Cầu Báo Giá', en: 'Request a Quote', ko: 'B2B 견적 요청', zh: '获取 B2B 报价' },
    primaryImage: '/assets/images/hero-brochure-mango.webp',
    primaryImageFallback: '/assets/images/hero-brochure-mango.jpg',
    primaryImageAlt: { vi: 'Xoài sấy dẻo VINAXO', en: 'VINAXO soft-dried mango', ko: 'VINAXO 건망고', zh: 'VINAXO 软烘芒果干' },
    secondaryImage: '/assets/images/hero-brochure-dragonfruit.webp',
    secondaryImageFallback: '/assets/images/hero-brochure-dragonfruit.jpg',
    secondaryImageAlt: { vi: 'Thanh long sấy VINAXO', en: 'VINAXO dragon fruit', ko: 'VINAXO 건조 용과', zh: 'VINAXO 火龙果干' },
  },
  about: {
    label: { vi: 'GIỚI THIỆU NGẮN VỀ VINAXO', en: 'WHO WE ARE', ko: 'VINAXO 기업 소개', zh: '关于 VINAXO' },
    titleLine1: { vi: 'Bắt nguồn từ ĐBSCL.', en: 'Rooted in the Mekong Delta.', ko: '메콩 델타 산지 기반.', zh: '扎根湄公河三角洲，' },
    titleLine2: { vi: 'Nâng tầm nông sản Việt.', en: 'Crafted for global B2B tables.', ko: '글로벌 표준 공급.', zh: '服务全球 B2B 市场。' },
    description: {
      vi: 'VINAXO vận hành tổ hợp chế biến nông sản quy mô 25.000 m² tại Xã Vĩnh Bình, Đồng Tháp với sản lượng 300 tấn/tháng.',
      en: 'VINAXO operates a 25,000 m² processing complex in Dong Thap Province (300 t monthly output).',
      ko: 'VINAXO는 동탑성 25,000 m² 공장에서 월 300톤을 생산합니다.',
      zh: 'VINAXO 在同塔省运营 25,000 m² 加工厂，月产 300 吨。',
    },
    ctaLabel: { vi: 'Tìm hiểu về VINAXO', en: 'Discover About VINAXO', ko: '회사 소개 자세히 보기', zh: '深入了解 VINAXO' },
    ctaLink: '/about',
    image: '/assets/images/factory/factory-quality-sorting.webp',
    imageFallback: '/assets/images/factory/factory-quality-sorting.jpg',
    imageAlt: { vi: 'Nhà máy VINAXO Đồng Tháp', en: 'VINAXO Dong Thap factory', ko: 'VINAXO 동탑 공장', zh: 'VINAXO 同塔工厂' },
  },
  categoriesSection: {
    label: { vi: 'DANH MỤC SẢN PHẨM CHÍNH THỨC', en: 'OFFICIAL EXPORT CATEGORIES', ko: '정식 수출 제품 카테고리', zh: '官方出口产品分类' },
    title: { vi: '4 Nhóm Sản Phẩm Xuất Khẩu Chủ Lực', en: 'Four Core Export Product Categories', ko: '4대 정식 수출 제품 카테고리', zh: '四大核心出口产品系列' },
    description: { vi: '', en: '', ko: '', zh: '' },
    oemLinesHeading: { vi: 'Dòng Sản Phẩm Phát Triển & Gia Công OEM Theo Yêu Cầu', en: 'Bespoke OEM Product Lines & Consultation', ko: '맞춤형 OEM 가공 라인', zh: '定制 OEM 产品线' },
    oemLinesDesc: { vi: '', en: '', ko: '', zh: '' },
  },
  catalogCategoryCards: [],
  oemProductLines: [],
  featuredProductsSection: {
    label: { vi: 'SẢN PHẨM TIÊU BIỂU', en: 'FEATURED EXPORT PRODUCTS', ko: '대표 수출 품목', zh: '主力推荐产品' },
    title: { vi: '4 Mặt Hàng Xuất Khẩu Nổi Bật', en: '4 Featured Export Products', ko: '대표 수출 제품 4선', zh: '四款主力出口单品' },
    description: { vi: '', en: '', ko: '', zh: '' },
    viewAllLabel: { vi: 'Xem tất cả sản phẩm', en: 'View All Products', ko: '전체 제품 보기', zh: '查看全部产品' },
    maxItems: 4,
  },
  featuredProductSlugs: ['soft-dried-mango', 'soft-dried-red-dragonfruit', 'banana-chips', 'cashew'],
  productionOem: {
    label: { vi: 'NĂNG LỰC NHÀ MÁY & OEM', en: 'CAPACITY & OEM', ko: '공장 역량 & OEM', zh: '工厂实力与 OEM' },
    title: { vi: 'Nhà Máy 25.000 m² & Giải Pháp OEM', en: '25,000 m² Facility & OEM Solutions', ko: '25,000 m² 공장 및 OEM', zh: '25,000 m² 工厂与 OEM' },
    description: { vi: '', en: '', ko: '', zh: '' },
    bullets: [],
    image: '/assets/images/factory-2026/factory-featured.webp',
    imageFallback: '/assets/images/factory-2026/factory-featured.jpg',
    imageAlt: { vi: 'Phân xưởng nhà máy VINAXO', en: 'VINAXO factory floor', ko: 'VINAXO 공장 작업장', zh: 'VINAXO 工厂车间' },
    primaryCtaLabel: { vi: 'Yêu Cầu Gia Công OEM', en: 'Request OEM Quote', ko: 'OEM 견적 문의', zh: '咨询 OEM 报价' },
    secondaryCtaLabel: { vi: 'Xem hình ảnh nhà máy thực tế', en: 'View Factory Gallery', ko: '공장 현장 사진 보기', zh: '查看更多工厂实景' },
    secondaryCtaLink: '/about#factory-gallery',
  },
  qualityCerts: {
    label: { vi: 'CHẤT LƯỢNG & CHỨNG NHẬN', en: 'QUALITY & COMPLIANCE', ko: '품질 및 인증', zh: '品质与认证' },
    title: { vi: 'Hệ Thống Tiêu Chuẩn Cấp Nhà Máy', en: 'Audited Facility Standards', ko: '국제 공인 품질 체계', zh: '权威审核工厂标准' },
    description: { vi: '', en: '', ko: '', zh: '' },
    scopeNote: { vi: '', en: '', ko: '', zh: '' },
    ctaLabel: { vi: 'Xem hệ thống chất lượng và chứng nhận', en: 'View Quality System & Certificates', ko: '품질 시스템 및 인증서 보기', zh: '查看品质保障与证书档案' },
    ctaLink: '/quality#certificates',
  },
  exportMarkets: {
    label: { vi: 'THỊ TRƯỜNG XUẤT KHẨU', en: 'EXPORT MARKETS', ko: '수출 시장', zh: '出口市场' },
    titleLine1: { vi: 'Hơn 15 Quốc Gia', en: '15+ Countries Worldwide', ko: '15개국 이상 수출', zh: '远销 15+ 国家' },
    titleLine2: { vi: 'Mỹ • Châu Âu • Châu Á', en: 'US • Europe • Asia', ko: '미국 · 유럽 · 아시아', zh: '美国 · 欧盟 · 亚洲' },
    description: { vi: '', en: '', ko: '', zh: '' },
    ctaLabel: { vi: 'Khám phá thị trường xuất khẩu', en: 'Explore Export Markets', ko: '수출 시장 자세히 보기', zh: '探索全球出口市场' },
    ctaLink: '/markets',
  },
  newsSection: {
    label: { vi: 'TIN TỨC & BÁO CHÍ', en: 'NEWS & INSIGHTS', ko: '뉴스 및 보도', zh: '新闻动态' },
    titleLine1: { vi: 'Báo Chí &', en: 'Press &', ko: '언론 보도 및', zh: '新闻与' },
    titleLine2: { vi: 'Tin Tức Nổi Bật', en: 'Featured Stories', ko: '주요 소식', zh: '媒体报道' },
    description: { vi: '', en: '', ko: '', zh: '' },
    viewAllLabel: { vi: 'Xem tất cả tin tức', en: 'View All News', ko: '전체 뉴스 보기', zh: '查看全部新闻' },
    maxItems: 3,
  },
  closingCta: {
    eyebrow: { vi: 'KẾT NỐI HỢP TÁC B2B', en: 'B2B EXPORT INQUIRY', ko: 'B2B 수출 문의', zh: '开启 B2B 合作' },
    title: {
      vi: 'Bạn Đang Tìm Kiếm Đối Tác Cung Ứng Trái Cây Sấy & Hạt Dinh Dưỡng?',
      en: 'Looking for a Reliable Dried Fruit & Nut Manufacturing Partner?',
      ko: '열대 건조 과일·견과류 제조 파트너를 찾고 계신가요?',
      zh: '正在寻找可靠的热带果干与坚果制造合作伙伴？',
    },
    description: { vi: '', en: '', ko: '', zh: '' },
    primaryLabel: { vi: 'Nhận báo giá', en: 'Request a Quote', ko: '견적 요청하기', zh: '立即获取报价' },
    secondaryLabel: { vi: 'Liên hệ VINAXO', en: 'Contact VINAXO', ko: 'VINAXO 문의하기', zh: '联系 VINAXO' },
    secondaryLink: '/contact',
    brochureLabel: { vi: 'Xem Brochure', en: 'View Brochure', ko: '회사 브로슈어 보기', zh: '浏览企业画册' },
    brochureLink: '/brochure',
  },
};

let homepageCmsModules: Record<string, any> = {};
try {
  homepageCmsModules = (import.meta as any).glob('/content/settings/homepage.json', { eager: true });
} catch {
  homepageCmsModules = {};
}

const rawHomepageCmsModule = Object.values(homepageCmsModules)[0] as any;
const rawHomepageJson = rawHomepageCmsModule?.default || rawHomepageCmsModule || {};

export const HOMEPAGE_CONTENT: HomepageContent = mergeHomepageContent(
  FALLBACK_HOMEPAGE_CONTENT,
  rawHomepageJson
);

export function resolveHomepageFeaturedProducts(
  allProducts: ProductItem[],
  homepage: HomepageContent = HOMEPAGE_CONTENT
): ProductItem[] {
  const maxItems = Math.max(1, Math.min(4, Number(homepage.featuredProductsSection?.maxItems) || 4));
  const published = allProducts.filter((p) => p.published !== false && p.status !== 'draft');
  const selected: ProductItem[] = [];
  const usedSlugs = new Set<string>();

  for (const slug of homepage.featuredProductSlugs || []) {
    const match = published.find((p) => p.slug === slug || p.id === slug);
    if (match && !usedSlugs.has(match.slug)) {
      selected.push(match);
      usedSlugs.add(match.slug);
    }
    if (selected.length >= maxItems) return selected;
  }

  const flagged = published
    .filter((p) => p.featured && !usedSlugs.has(p.slug))
    .sort((a, b) => (Number(a.featuredOrder) || 999) - (Number(b.featuredOrder) || 999));

  for (const p of flagged) {
    selected.push(p);
    usedSlugs.add(p.slug);
    if (selected.length >= maxItems) return selected;
  }

  for (const p of published) {
    if (!usedSlugs.has(p.slug)) {
      selected.push(p);
      usedSlugs.add(p.slug);
    }
    if (selected.length >= maxItems) break;
  }

  return selected;
}

export function resolveCategoryCardHref(card: HomepageCategoryCard): string | null {
  if (card.linkType === 'category') return `/products?category=${encodeURIComponent(card.targetValue)}`;
  if (card.linkType === 'product') return `/products?product=${encodeURIComponent(card.targetValue)}`;
  if (card.linkType === 'page') return card.targetValue.startsWith('/') ? card.targetValue : `/${card.targetValue}`;
  if (card.linkType === 'contact') return card.targetValue ? `/contact?product=${encodeURIComponent(card.targetValue)}` : '/contact';
  return null;
}

export function getHomepageLocalized(val: { vi: string; en: string; ko: string; zh: string } | undefined, language: Language): string {
  return pickLocalized(val, language);
}
