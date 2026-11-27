import {
  EMPTY_LOCALIZED_TEXT,
  LocalizedText,
  isSafeAboutImageUrl,
} from './aboutSchema.js';
import { VALID_CATALOG_CATEGORY_IDS } from '../catalogCategories.js';

export type HomepageLinkType = 'category' | 'product' | 'page' | 'contact' | 'quote';

export const ALLOWED_HOMEPAGE_LINK_TYPES: readonly HomepageLinkType[] = [
  'category',
  'product',
  'page',
  'contact',
  'quote',
];

export const DEFAULT_SECTION_ORDER = [
  'hero',
  'about',
  'categories',
  'featuredProducts',
  'productionOem',
  'qualityCerts',
  'exportMarkets',
  'news',
  'closingCta',
] as const;

export type HomepageSectionKey = typeof DEFAULT_SECTION_ORDER[number];

export interface HomepageSectionVisibility {
  hero: boolean;
  about: boolean;
  categories: boolean;
  featuredProducts: boolean;
  productionOem: boolean;
  qualityCerts: boolean;
  exportMarkets: boolean;
  news: boolean;
  closingCta: boolean;
}

export interface HomepageHeroConfig {
  eyebrow: LocalizedText;
  headlineLine1: LocalizedText;
  headlineLine2: LocalizedText;
  headlineHighlight: LocalizedText;
  description: LocalizedText;
  primaryCtaLabel: LocalizedText;
  primaryCtaLink: string;
  secondaryCtaLabel: LocalizedText;
  primaryImage: string;
  primaryImageFallback?: string;
  primaryImageAlt: LocalizedText;
  secondaryImage: string;
  secondaryImageFallback?: string;
  secondaryImageAlt: LocalizedText;
}

export interface HomepageAboutConfig {
  label: LocalizedText;
  titleLine1: LocalizedText;
  titleLine2: LocalizedText;
  description: LocalizedText;
  ctaLabel: LocalizedText;
  ctaLink: string;
  image: string;
  imageFallback?: string;
  imageAlt: LocalizedText;
}

export interface HomepageCategoryCard {
  id: string;
  linkType: HomepageLinkType;
  targetValue: string;
  name: LocalizedText;
  description: LocalizedText;
  badge?: LocalizedText;
  ctaLabel?: LocalizedText;
  image: string;
  imageFallback?: string;
  visible: boolean;
  sortOrder: number;
}

export interface HomepageCategoriesSectionConfig {
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  oemLinesHeading: LocalizedText;
  oemLinesDesc: LocalizedText;
}

export interface HomepageFeaturedSectionConfig {
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  viewAllLabel: LocalizedText;
  maxItems: number;
}

export interface HomepageProductionOemConfig {
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  bullets: LocalizedText[];
  image: string;
  imageFallback?: string;
  imageAlt: LocalizedText;
  primaryCtaLabel: LocalizedText;
  secondaryCtaLabel: LocalizedText;
  secondaryCtaLink: string;
}

export interface HomepageQualityCertsConfig {
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  scopeNote: LocalizedText;
  ctaLabel: LocalizedText;
  ctaLink: string;
}

export interface HomepageExportMarketsConfig {
  label: LocalizedText;
  titleLine1: LocalizedText;
  titleLine2: LocalizedText;
  description: LocalizedText;
  ctaLabel: LocalizedText;
  ctaLink: string;
}

export interface HomepageNewsSectionConfig {
  label: LocalizedText;
  titleLine1: LocalizedText;
  titleLine2: LocalizedText;
  description: LocalizedText;
  viewAllLabel: LocalizedText;
  maxItems: number;
}

export interface HomepageClosingCtaConfig {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  primaryLabel: LocalizedText;
  secondaryLabel: LocalizedText;
  secondaryLink: string;
  brochureLabel: LocalizedText;
  brochureLink: string;
}

export interface HomepageContent {
  sections: HomepageSectionVisibility;
  sectionOrder: HomepageSectionKey[];
  hero: HomepageHeroConfig;
  about: HomepageAboutConfig;
  categoriesSection: HomepageCategoriesSectionConfig;
  catalogCategoryCards: HomepageCategoryCard[];
  oemProductLines: HomepageCategoryCard[];
  featuredProductsSection: HomepageFeaturedSectionConfig;
  featuredProductSlugs: string[];
  productionOem: HomepageProductionOemConfig;
  qualityCerts: HomepageQualityCertsConfig;
  exportMarkets: HomepageExportMarketsConfig;
  newsSection: HomepageNewsSectionConfig;
  closingCta: HomepageClosingCtaConfig;
}

function mergeLoc(base: LocalizedText | undefined, incoming: unknown): LocalizedText {
  const prev = base || EMPTY_LOCALIZED_TEXT;
  if (typeof incoming === 'string') {
    return { ...prev, vi: incoming.trim() };
  }
  if (!incoming || typeof incoming !== 'object') {
    return { ...prev };
  }
  const src = incoming as Record<string, unknown>;
  return {
    vi: typeof src.vi === 'string' ? src.vi.trim() : prev.vi,
    en: typeof src.en === 'string' ? src.en.trim() : prev.en,
    ko: typeof src.ko === 'string' ? src.ko.trim() : prev.ko,
    zh: typeof src.zh === 'string' ? src.zh.trim() : prev.zh,
  };
}

function sanitizeInternalPath(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('..')) {
    return fallback;
  }
  return trimmed;
}

function sanitizeCardId(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string') return fallback;
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

function inferAssetsFallback(img: string, explicit?: unknown): string | undefined {
  if (typeof explicit === 'string' && isSafeAboutImageUrl(explicit)) {
    return explicit.trim();
  }
  if ((img.startsWith('/assets/') || img.startsWith('/images/')) && img.toLowerCase().endsWith('.webp')) {
    return img.slice(0, -5) + '.jpg';
  }
  return undefined;
}

function sanitizeCategoryCardList(
  rawList: unknown,
  fallbackList: HomepageCategoryCard[],
  defaultLinkType: HomepageLinkType
): HomepageCategoryCard[] {
  if (!Array.isArray(rawList)) {
    return fallbackList.map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
  }
  const usedIds = new Set<string>();
  return rawList
    .map((item: any, idx: number) => {
      const prev = fallbackList.find((f) => f.id === item?.id) || fallbackList[idx];
      let id = sanitizeCardId(item?.id, prev?.id || `cat-${idx + 1}`);
      while (usedIds.has(id)) {
        id = `${id}-${idx + 1}`;
      }
      usedIds.add(id);

      const rawImg = typeof item?.image === 'string' ? item.image.trim() : '';
      const image = isSafeAboutImageUrl(rawImg) ? rawImg : prev?.image || '';
      const imageFallback = image
        ? inferAssetsFallback(image, item?.imageFallback ?? (rawImg === prev?.image ? prev?.imageFallback : undefined))
        : undefined;

      const rawLinkType = typeof item?.linkType === 'string' ? item.linkType.trim() : '';
      const linkType: HomepageLinkType = (ALLOWED_HOMEPAGE_LINK_TYPES as readonly string[]).includes(rawLinkType)
        ? (rawLinkType as HomepageLinkType)
        : prev?.linkType || defaultLinkType;

      const targetValue =
        typeof item?.targetValue === 'string'
          ? item.targetValue.trim()
          : prev?.targetValue || id;

      const sortOrder = Number.isFinite(Number(item?.sortOrder)) ? Number(item.sortOrder) : idx + 1;
      return {
        id,
        linkType,
        targetValue,
        name: mergeLoc(prev?.name, item?.name),
        description: mergeLoc(prev?.description, item?.description),
        ...(prev?.badge || item?.badge ? { badge: mergeLoc(prev?.badge, item?.badge) } : {}),
        ...(prev?.ctaLabel || item?.ctaLabel ? { ctaLabel: mergeLoc(prev?.ctaLabel, item?.ctaLabel) } : {}),
        image,
        ...(imageFallback ? { imageFallback } : {}),
        visible: item?.visible !== undefined ? Boolean(item.visible) : prev?.visible ?? true,
        sortOrder,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
}

export const EMPTY_HOMEPAGE_BASE: HomepageContent = {
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
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hero: {
    eyebrow: { ...EMPTY_LOCALIZED_TEXT },
    headlineLine1: { ...EMPTY_LOCALIZED_TEXT },
    headlineLine2: { ...EMPTY_LOCALIZED_TEXT },
    headlineHighlight: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    primaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    primaryCtaLink: '/products',
    secondaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    primaryImage: '/assets/images/hero-brochure-mango.webp',
    primaryImageFallback: '/assets/images/hero-brochure-mango.jpg',
    primaryImageAlt: { ...EMPTY_LOCALIZED_TEXT },
    secondaryImage: '/assets/images/hero-brochure-dragonfruit.webp',
    secondaryImageFallback: '/assets/images/hero-brochure-dragonfruit.jpg',
    secondaryImageAlt: { ...EMPTY_LOCALIZED_TEXT },
  },
  about: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    titleLine1: { ...EMPTY_LOCALIZED_TEXT },
    titleLine2: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT },
    ctaLink: '/about',
    image: '/assets/images/factory/factory-quality-sorting.webp',
    imageFallback: '/assets/images/factory/factory-quality-sorting.jpg',
    imageAlt: { ...EMPTY_LOCALIZED_TEXT },
  },
  categoriesSection: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    oemLinesHeading: { ...EMPTY_LOCALIZED_TEXT },
    oemLinesDesc: { ...EMPTY_LOCALIZED_TEXT },
  },
  catalogCategoryCards: [],
  oemProductLines: [],
  featuredProductsSection: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    viewAllLabel: { ...EMPTY_LOCALIZED_TEXT },
    maxItems: 4,
  },
  featuredProductSlugs: [],
  productionOem: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    bullets: [],
    image: '/assets/images/factory-2026/factory-featured.webp',
    imageFallback: '/assets/images/factory-2026/factory-featured.jpg',
    imageAlt: { ...EMPTY_LOCALIZED_TEXT },
    primaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryCtaLink: '/about#factory-gallery',
  },
  qualityCerts: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    scopeNote: { ...EMPTY_LOCALIZED_TEXT },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT },
    ctaLink: '/quality#certificates',
  },
  exportMarkets: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    titleLine1: { ...EMPTY_LOCALIZED_TEXT },
    titleLine2: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT },
    ctaLink: '/markets',
  },
  newsSection: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    titleLine1: { ...EMPTY_LOCALIZED_TEXT },
    titleLine2: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    viewAllLabel: { ...EMPTY_LOCALIZED_TEXT },
    maxItems: 3,
  },
  closingCta: {
    eyebrow: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    primaryLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryLink: '/contact',
    brochureLabel: { ...EMPTY_LOCALIZED_TEXT },
    brochureLink: '/brochure',
  },
};

export function mergeHomepageContent(baseInput: HomepageContent | undefined, incoming: unknown): HomepageContent {
  const base = baseInput || EMPTY_HOMEPAGE_BASE;
  const raw = (incoming && typeof incoming === 'object' ? incoming : {}) as Record<string, any>;

  const rawSec = raw.sections && typeof raw.sections === 'object' ? raw.sections : {};
  const sections: HomepageSectionVisibility = {
    hero: typeof rawSec.hero === 'boolean' ? rawSec.hero : base.sections.hero,
    about: typeof rawSec.about === 'boolean' ? rawSec.about : base.sections.about,
    categories: typeof rawSec.categories === 'boolean' ? rawSec.categories : base.sections.categories,
    featuredProducts: typeof rawSec.featuredProducts === 'boolean' ? rawSec.featuredProducts : base.sections.featuredProducts,
    productionOem: typeof rawSec.productionOem === 'boolean' ? rawSec.productionOem : base.sections.productionOem,
    qualityCerts: typeof rawSec.qualityCerts === 'boolean' ? rawSec.qualityCerts : base.sections.qualityCerts,
    exportMarkets: typeof rawSec.exportMarkets === 'boolean' ? rawSec.exportMarkets : base.sections.exportMarkets,
    news: typeof rawSec.news === 'boolean' ? rawSec.news : base.sections.news,
    closingCta: typeof rawSec.closingCta === 'boolean' ? rawSec.closingCta : base.sections.closingCta,
  };

  let sectionOrder: HomepageSectionKey[] = [...base.sectionOrder];
  if (Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0) {
    const validSet = new Set<HomepageSectionKey>();
    for (const k of raw.sectionOrder) {
      if (typeof k === 'string' && (DEFAULT_SECTION_ORDER as readonly string[]).includes(k)) {
        validSet.add(k as HomepageSectionKey);
      }
    }
    for (const defKey of DEFAULT_SECTION_ORDER) {
      validSet.add(defKey);
    }
    sectionOrder = Array.from(validSet);
  }

  const hRaw = raw.hero && typeof raw.hero === 'object' ? raw.hero : {};
  const hPrimImg = typeof hRaw.primaryImage === 'string' && isSafeAboutImageUrl(hRaw.primaryImage)
    ? hRaw.primaryImage.trim()
    : base.hero.primaryImage;
  const hSecImg = typeof hRaw.secondaryImage === 'string' && isSafeAboutImageUrl(hRaw.secondaryImage)
    ? hRaw.secondaryImage.trim()
    : base.hero.secondaryImage;

  const hero: HomepageHeroConfig = {
    eyebrow: mergeLoc(base.hero.eyebrow, hRaw.eyebrow),
    headlineLine1: mergeLoc(base.hero.headlineLine1, hRaw.headlineLine1),
    headlineLine2: mergeLoc(base.hero.headlineLine2, hRaw.headlineLine2),
    headlineHighlight: mergeLoc(base.hero.headlineHighlight, hRaw.headlineHighlight),
    description: mergeLoc(base.hero.description, hRaw.description),
    primaryCtaLabel: mergeLoc(base.hero.primaryCtaLabel, hRaw.primaryCtaLabel),
    primaryCtaLink: sanitizeInternalPath(hRaw.primaryCtaLink, base.hero.primaryCtaLink),
    secondaryCtaLabel: mergeLoc(base.hero.secondaryCtaLabel, hRaw.secondaryCtaLabel),
    primaryImage: hPrimImg,
    primaryImageFallback: inferAssetsFallback(hPrimImg, hRaw.primaryImageFallback ?? base.hero.primaryImageFallback),
    primaryImageAlt: mergeLoc(base.hero.primaryImageAlt, hRaw.primaryImageAlt),
    secondaryImage: hSecImg,
    secondaryImageFallback: inferAssetsFallback(hSecImg, hRaw.secondaryImageFallback ?? base.hero.secondaryImageFallback),
    secondaryImageAlt: mergeLoc(base.hero.secondaryImageAlt, hRaw.secondaryImageAlt),
  };

  const aRaw = raw.about && typeof raw.about === 'object' ? raw.about : {};
  const aImg = typeof aRaw.image === 'string' && isSafeAboutImageUrl(aRaw.image)
    ? aRaw.image.trim()
    : base.about.image;
  const about: HomepageAboutConfig = {
    label: mergeLoc(base.about.label, aRaw.label),
    titleLine1: mergeLoc(base.about.titleLine1, aRaw.titleLine1),
    titleLine2: mergeLoc(base.about.titleLine2, aRaw.titleLine2),
    description: mergeLoc(base.about.description, aRaw.description),
    ctaLabel: mergeLoc(base.about.ctaLabel, aRaw.ctaLabel),
    ctaLink: sanitizeInternalPath(aRaw.ctaLink, base.about.ctaLink),
    image: aImg,
    imageFallback: inferAssetsFallback(aImg, aRaw.imageFallback ?? base.about.imageFallback),
    imageAlt: mergeLoc(base.about.imageAlt, aRaw.imageAlt),
  };

  const csRaw = raw.categoriesSection && typeof raw.categoriesSection === 'object' ? raw.categoriesSection : {};
  const categoriesSection: HomepageCategoriesSectionConfig = {
    label: mergeLoc(base.categoriesSection.label, csRaw.label),
    title: mergeLoc(base.categoriesSection.title, csRaw.title),
    description: mergeLoc(base.categoriesSection.description, csRaw.description),
    oemLinesHeading: mergeLoc(base.categoriesSection.oemLinesHeading, csRaw.oemLinesHeading),
    oemLinesDesc: mergeLoc(base.categoriesSection.oemLinesDesc, csRaw.oemLinesDesc),
  };

  const catalogCategoryCards = sanitizeCategoryCardList(
    raw.catalogCategoryCards,
    base.catalogCategoryCards,
    'category'
  );
  const oemProductLines = sanitizeCategoryCardList(
    raw.oemProductLines,
    base.oemProductLines,
    'quote'
  );

  const fpRaw = raw.featuredProductsSection && typeof raw.featuredProductsSection === 'object'
    ? raw.featuredProductsSection
    : {};
  const rawMaxFeat = Number(fpRaw.maxItems);
  const featuredMaxItems = Number.isFinite(rawMaxFeat)
    ? Math.max(1, Math.min(4, Math.floor(rawMaxFeat)))
    : base.featuredProductsSection.maxItems;
  const featuredProductsSection: HomepageFeaturedSectionConfig = {
    label: mergeLoc(base.featuredProductsSection.label, fpRaw.label),
    title: mergeLoc(base.featuredProductsSection.title, fpRaw.title),
    description: mergeLoc(base.featuredProductsSection.description, fpRaw.description),
    viewAllLabel: mergeLoc(base.featuredProductsSection.viewAllLabel, fpRaw.viewAllLabel),
    maxItems: featuredMaxItems,
  };

  let featuredProductSlugs: string[] = [...base.featuredProductSlugs].slice(0, 4);
  if (Array.isArray(raw.featuredProductSlugs)) {
    const deduped: string[] = [];
    for (const s of raw.featuredProductSlugs) {
      if (typeof s === 'string' && s.trim() && !deduped.includes(s.trim())) {
        deduped.push(s.trim());
      }
      if (deduped.length >= 4) break;
    }
    featuredProductSlugs = deduped;
  }

  const pRaw = raw.productionOem && typeof raw.productionOem === 'object' ? raw.productionOem : {};
  const pImg = typeof pRaw.image === 'string' && isSafeAboutImageUrl(pRaw.image)
    ? pRaw.image.trim()
    : base.productionOem.image;
  const bullets: LocalizedText[] = Array.isArray(pRaw.bullets) && pRaw.bullets.length > 0
    ? pRaw.bullets.map((b: unknown, idx: number) => mergeLoc(base.productionOem.bullets[idx], b))
    : base.productionOem.bullets.map((b) => ({ ...b }));

  const productionOem: HomepageProductionOemConfig = {
    label: mergeLoc(base.productionOem.label, pRaw.label),
    title: mergeLoc(base.productionOem.title, pRaw.title),
    description: mergeLoc(base.productionOem.description, pRaw.description),
    bullets,
    image: pImg,
    imageFallback: inferAssetsFallback(pImg, pRaw.imageFallback ?? base.productionOem.imageFallback),
    imageAlt: mergeLoc(base.productionOem.imageAlt, pRaw.imageAlt),
    primaryCtaLabel: mergeLoc(base.productionOem.primaryCtaLabel, pRaw.primaryCtaLabel),
    secondaryCtaLabel: mergeLoc(base.productionOem.secondaryCtaLabel, pRaw.secondaryCtaLabel),
    secondaryCtaLink: sanitizeInternalPath(pRaw.secondaryCtaLink, base.productionOem.secondaryCtaLink),
  };

  const qRaw = raw.qualityCerts && typeof raw.qualityCerts === 'object' ? raw.qualityCerts : {};
  const qualityCerts: HomepageQualityCertsConfig = {
    label: mergeLoc(base.qualityCerts.label, qRaw.label),
    title: mergeLoc(base.qualityCerts.title, qRaw.title),
    description: mergeLoc(base.qualityCerts.description, qRaw.description),
    scopeNote: mergeLoc(base.qualityCerts.scopeNote, qRaw.scopeNote),
    ctaLabel: mergeLoc(base.qualityCerts.ctaLabel, qRaw.ctaLabel),
    ctaLink: sanitizeInternalPath(qRaw.ctaLink, base.qualityCerts.ctaLink),
  };

  const eRaw = raw.exportMarkets && typeof raw.exportMarkets === 'object' ? raw.exportMarkets : {};
  const exportMarkets: HomepageExportMarketsConfig = {
    label: mergeLoc(base.exportMarkets.label, eRaw.label),
    titleLine1: mergeLoc(base.exportMarkets.titleLine1, eRaw.titleLine1),
    titleLine2: mergeLoc(base.exportMarkets.titleLine2, eRaw.titleLine2),
    description: mergeLoc(base.exportMarkets.description, eRaw.description),
    ctaLabel: mergeLoc(base.exportMarkets.ctaLabel, eRaw.ctaLabel),
    ctaLink: sanitizeInternalPath(eRaw.ctaLink, base.exportMarkets.ctaLink),
  };

  const nRaw = raw.newsSection && typeof raw.newsSection === 'object' ? raw.newsSection : {};
  const rawNewsMax = Number(nRaw.maxItems);
  const newsSection: HomepageNewsSectionConfig = {
    label: mergeLoc(base.newsSection.label, nRaw.label),
    titleLine1: mergeLoc(base.newsSection.titleLine1, nRaw.titleLine1),
    titleLine2: mergeLoc(base.newsSection.titleLine2, nRaw.titleLine2),
    description: mergeLoc(base.newsSection.description, nRaw.description),
    viewAllLabel: mergeLoc(base.newsSection.viewAllLabel, nRaw.viewAllLabel),
    maxItems: Number.isFinite(rawNewsMax) ? Math.max(1, Math.min(6, Math.floor(rawNewsMax))) : base.newsSection.maxItems,
  };

  const cRaw = raw.closingCta && typeof raw.closingCta === 'object' ? raw.closingCta : {};
  const closingCta: HomepageClosingCtaConfig = {
    eyebrow: mergeLoc(base.closingCta.eyebrow, cRaw.eyebrow),
    title: mergeLoc(base.closingCta.title, cRaw.title),
    description: mergeLoc(base.closingCta.description, cRaw.description),
    primaryLabel: mergeLoc(base.closingCta.primaryLabel, cRaw.primaryLabel),
    secondaryLabel: mergeLoc(base.closingCta.secondaryLabel, cRaw.secondaryLabel),
    secondaryLink: sanitizeInternalPath(cRaw.secondaryLink, base.closingCta.secondaryLink),
    brochureLabel: mergeLoc(base.closingCta.brochureLabel, cRaw.brochureLabel),
    brochureLink: sanitizeInternalPath(cRaw.brochureLink, base.closingCta.brochureLink),
  };

  return {
    sections,
    sectionOrder,
    hero,
    about,
    categoriesSection,
    catalogCategoryCards,
    oemProductLines,
    featuredProductsSection,
    featuredProductSlugs,
    productionOem,
    qualityCerts,
    exportMarkets,
    newsSection,
    closingCta,
  };
}

export function validateHomepageContent(
  input: unknown,
  existing?: HomepageContent,
  validProductSlugs?: string[]
): { valid: boolean; errors: string[]; data: HomepageContent } {
  const base = existing || EMPTY_HOMEPAGE_BASE;
  const errors: string[] = [];
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, any>;

  const imgFields: Array<[string, unknown]> = [
    ['hero.primaryImage', raw.hero?.primaryImage],
    ['hero.secondaryImage', raw.hero?.secondaryImage],
    ['about.image', raw.about?.image],
    ['productionOem.image', raw.productionOem?.image],
  ];
  for (const [label, val] of imgFields) {
    if (val !== undefined && !isSafeAboutImageUrl(val)) {
      errors.push(`Đường dẫn ảnh "${label}" không hợp lệ hoặc không an toàn.`);
    }
  }

  const checkCardGroup = (groupLabel: string, list: unknown) => {
    if (!Array.isArray(list)) return;
    const seenIds = new Set<string>();
    list.forEach((item: any, idx: number) => {
      const prefix = `${groupLabel} #${idx + 1}`;
      if (!item || typeof item !== 'object') {
        errors.push(`${prefix}: Định dạng không hợp lệ.`);
        return;
      }
      if (item.image !== undefined && !isSafeAboutImageUrl(item.image)) {
        errors.push(`${prefix}: Đường dẫn ảnh không hợp lệ.`);
      }
      const id = sanitizeCardId(item.id, '');
      if (!id) {
        errors.push(`${prefix}: Thiếu ID.`);
      } else if (seenIds.has(id)) {
        errors.push(`${prefix}: Trùng ID "${id}".`);
      } else {
        seenIds.add(id);
      }

      const lt = item.linkType;
      const tv = typeof item.targetValue === 'string' ? item.targetValue.trim() : '';
      if (lt !== undefined && !(ALLOWED_HOMEPAGE_LINK_TYPES as readonly string[]).includes(lt)) {
        errors.push(`${prefix}: Loại liên kết "${lt}" không hợp lệ.`);
      }
      if (lt === 'category' && !(VALID_CATALOG_CATEGORY_IDS as readonly string[]).includes(tv)) {
        errors.push(`${prefix}: Danh mục đích "${tv}" không tồn tại trong 4 danh mục chuẩn (${VALID_CATALOG_CATEGORY_IDS.join(', ')}).`);
      }
      if (lt === 'product' && validProductSlugs && validProductSlugs.length > 0 && !validProductSlugs.includes(tv)) {
        errors.push(`${prefix}: Sản phẩm đích "${tv}" không tồn tại hoặc chưa xuất bản.`);
      }
      if (lt === 'page' && (!tv.startsWith('/') || tv.startsWith('//') || tv.includes('..'))) {
        errors.push(`${prefix}: Đường dẫn trang đích "${tv}" phải bắt đầu bằng "/".`);
      }
    });
  };

  checkCardGroup('Danh mục sản phẩm', raw.catalogCategoryCards);
  checkCardGroup('Dòng OEM / Tư vấn', raw.oemProductLines);

  if (Array.isArray(raw.featuredProductSlugs)) {
    if (raw.featuredProductSlugs.length > 4) {
      errors.push('Trang chủ chỉ cho phép chọn tối đa 4 sản phẩm tiêu biểu.');
    }
    if (validProductSlugs && validProductSlugs.length > 0) {
      for (const s of raw.featuredProductSlugs) {
        if (typeof s === 'string' && s.trim() && !validProductSlugs.includes(s.trim())) {
          errors.push(`Sản phẩm tiêu biểu "${s}" không tồn tại trong danh mục sản phẩm công khai.`);
        }
      }
    }
  }

  const merged = mergeHomepageContent(base, raw);
  return {
    valid: errors.length === 0,
    errors,
    data: merged,
  };
}
