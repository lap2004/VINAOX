export interface LocalizedText {
  vi: string;
  en: string;
  ko: string;
  zh: string;
}

export const ABOUT_GALLERY_CATEGORIES = [
  'raw-material',
  'harvest',
  'factory',
  'preparation',
  'processing',
  'quality',
  'packaging',
  'warehouse',
  'team',
  'export',
] as const;

export type AboutGalleryCategory = typeof ABOUT_GALLERY_CATEGORIES[number];

export interface AboutGalleryItem {
  id: string;
  image: string;
  imageFallback?: string;
  category: AboutGalleryCategory;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  alt: LocalizedText;
  sortOrder: number;
  visible: boolean;
}

export interface AboutHeroSection {
  badge: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
}

export interface AboutStorySection {
  label: LocalizedText;
  titleLine1: LocalizedText;
  titleLine2: LocalizedText;
  description: LocalizedText;
}

export interface AboutVisionMissionSection {
  enabled: boolean;
  label: LocalizedText;
  visionTitle: LocalizedText;
  visionDesc: LocalizedText;
  missionTitle: LocalizedText;
  missionDesc: LocalizedText;
  coreValuesTitle: LocalizedText;
  coreValuesDesc: LocalizedText;
}

export interface AboutHighlightVisual {
  image: string;
  imageFallback?: string;
  overlayTag: LocalizedText;
  overlayLine1: LocalizedText;
  overlayLine2: LocalizedText;
  alt: LocalizedText;
}

export interface AboutMetricItem {
  id: string;
  num: LocalizedText;
  label: LocalizedText;
  note: LocalizedText;
  source: LocalizedText;
}

export interface AboutMilestoneItem {
  id: string;
  badge: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
}

export interface AboutFeatureItem {
  id: string;
  title: LocalizedText;
  desc: LocalizedText;
}

export interface AboutInfrastructureSection {
  label: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  image: string;
  imageFallback?: string;
  imageAlt: LocalizedText;
  features: AboutFeatureItem[];
}

export interface AboutSourcingRow {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
}

export interface AboutSourcingSection {
  label: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  rows: AboutSourcingRow[];
}

export interface AboutGallerySectionHeader {
  label: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
}

export interface AboutPageContent {
  hero: AboutHeroSection;
  story: AboutStorySection;
  visionMission: AboutVisionMissionSection;
  highlightVisual: AboutHighlightVisual;
  metrics: AboutMetricItem[];
  milestones: AboutMilestoneItem[];
  infrastructure: AboutInfrastructureSection;
  sourcing: AboutSourcingSection;
  gallerySection: AboutGallerySectionHeader;
  gallery: AboutGalleryItem[];
}

export const EMPTY_LOCALIZED_TEXT: LocalizedText = {
  vi: '',
  en: '',
  ko: '',
  zh: '',
};

const SAFE_RELATIVE_IMAGE_PREFIXES = ['/assets/', '/uploads/', '/images/'];

export function isSafeAboutImageUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return false;
  }
  if (trimmed.includes('..') || /[<>"'\\|?*]/.test(trimmed)) {
    return false;
  }
  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//')) return false;
    return SAFE_RELATIVE_IMAGE_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizeId(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string') return fallback;
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

function mergeLocalized(existing: LocalizedText | undefined, incoming: unknown): LocalizedText {
  const base = existing || EMPTY_LOCALIZED_TEXT;
  if (typeof incoming === 'string') {
    const trimmed = incoming.trim();
    return {
      vi: trimmed,
      en: base.en,
      ko: base.ko,
      zh: base.zh,
    };
  }
  if (!incoming || typeof incoming !== 'object') {
    return { ...base };
  }
  const src = incoming as Record<string, unknown>;
  return {
    vi: typeof src.vi === 'string' ? src.vi.trim() : base.vi,
    en: typeof src.en === 'string' ? src.en.trim() : base.en,
    ko: typeof src.ko === 'string' ? src.ko.trim() : base.ko,
    zh: typeof src.zh === 'string' ? src.zh.trim() : base.zh,
  };
}

function sanitizeCategory(raw: unknown, fallback: AboutGalleryCategory = 'factory'): AboutGalleryCategory {
  if (typeof raw === 'string' && (ABOUT_GALLERY_CATEGORIES as readonly string[]).includes(raw.trim())) {
    return raw.trim() as AboutGalleryCategory;
  }
  return fallback;
}

function inferImageFallback(image: string, explicitFallback?: unknown): string | undefined {
  if (typeof explicitFallback === 'string' && isSafeAboutImageUrl(explicitFallback)) {
    return explicitFallback.trim();
  }
  if (image.startsWith('/assets/') && image.toLowerCase().endsWith('.webp')) {
    return image.slice(0, -5) + '.jpg';
  }
  return undefined;
}

export function mergeAboutContent(
  base: AboutPageContent,
  incoming: unknown
): AboutPageContent {
  const raw = (incoming && typeof incoming === 'object' ? incoming : {}) as Record<string, any>;

  const heroRaw = raw.hero && typeof raw.hero === 'object' ? raw.hero : {};
  const hero: AboutHeroSection = {
    badge: mergeLocalized(base.hero.badge, heroRaw.badge),
    title: mergeLocalized(base.hero.title, heroRaw.title),
    subtitle: mergeLocalized(base.hero.subtitle, heroRaw.subtitle),
  };

  const storyRaw = raw.story && typeof raw.story === 'object' ? raw.story : {};
  const story: AboutStorySection = {
    label: mergeLocalized(base.story.label, storyRaw.label),
    titleLine1: mergeLocalized(base.story.titleLine1, storyRaw.titleLine1),
    titleLine2: mergeLocalized(base.story.titleLine2, storyRaw.titleLine2),
    description: mergeLocalized(base.story.description, storyRaw.description),
  };

  const vmRaw = raw.visionMission && typeof raw.visionMission === 'object' ? raw.visionMission : {};
  const visionMission: AboutVisionMissionSection = {
    enabled: typeof vmRaw.enabled === 'boolean' ? vmRaw.enabled : base.visionMission.enabled,
    label: mergeLocalized(base.visionMission.label, vmRaw.label),
    visionTitle: mergeLocalized(base.visionMission.visionTitle, vmRaw.visionTitle),
    visionDesc: mergeLocalized(base.visionMission.visionDesc, vmRaw.visionDesc),
    missionTitle: mergeLocalized(base.visionMission.missionTitle, vmRaw.missionTitle),
    missionDesc: mergeLocalized(base.visionMission.missionDesc, vmRaw.missionDesc),
    coreValuesTitle: mergeLocalized(base.visionMission.coreValuesTitle, vmRaw.coreValuesTitle),
    coreValuesDesc: mergeLocalized(base.visionMission.coreValuesDesc, vmRaw.coreValuesDesc),
  };

  const hvRaw = raw.highlightVisual && typeof raw.highlightVisual === 'object' ? raw.highlightVisual : {};
  const hvImg = typeof hvRaw.image === 'string' && isSafeAboutImageUrl(hvRaw.image)
    ? hvRaw.image.trim()
    : base.highlightVisual.image;
  const highlightVisual: AboutHighlightVisual = {
    image: hvImg,
    imageFallback: inferImageFallback(hvImg, hvRaw.imageFallback ?? (hvRaw.image ? undefined : base.highlightVisual.imageFallback)),
    overlayTag: mergeLocalized(base.highlightVisual.overlayTag, hvRaw.overlayTag),
    overlayLine1: mergeLocalized(base.highlightVisual.overlayLine1, hvRaw.overlayLine1),
    overlayLine2: mergeLocalized(base.highlightVisual.overlayLine2, hvRaw.overlayLine2),
    alt: mergeLocalized(base.highlightVisual.alt, hvRaw.alt),
  };

  const metrics: AboutMetricItem[] = Array.isArray(raw.metrics) && raw.metrics.length > 0
    ? raw.metrics.map((m: any, idx: number) => {
        const prev = base.metrics.find((b) => b.id === m?.id) || base.metrics[idx];
        return {
          id: sanitizeId(m?.id, prev?.id || `metric-${idx + 1}`),
          num: mergeLocalized(prev?.num, m?.num),
          label: mergeLocalized(prev?.label, m?.label),
          note: mergeLocalized(prev?.note, m?.note),
          source: mergeLocalized(prev?.source, m?.source),
        };
      })
    : base.metrics.map((m) => ({ ...m }));

  const milestones: AboutMilestoneItem[] = Array.isArray(raw.milestones) && raw.milestones.length > 0
    ? raw.milestones.map((ms: any, idx: number) => {
        const prev = base.milestones.find((b) => b.id === ms?.id) || base.milestones[idx];
        return {
          id: sanitizeId(ms?.id, prev?.id || `milestone-${idx + 1}`),
          badge: mergeLocalized(prev?.badge, ms?.badge),
          title: mergeLocalized(prev?.title, ms?.title),
          desc: mergeLocalized(prev?.desc, ms?.desc),
        };
      })
    : base.milestones.map((ms) => ({ ...ms }));

  const infraRaw = raw.infrastructure && typeof raw.infrastructure === 'object' ? raw.infrastructure : {};
  const infraImg = typeof infraRaw.image === 'string' && isSafeAboutImageUrl(infraRaw.image)
    ? infraRaw.image.trim()
    : base.infrastructure.image;
  const infraFeatures: AboutFeatureItem[] = Array.isArray(infraRaw.features) && infraRaw.features.length > 0
    ? infraRaw.features.map((ft: any, idx: number) => {
        const prev = base.infrastructure.features.find((b) => b.id === ft?.id) || base.infrastructure.features[idx];
        return {
          id: sanitizeId(ft?.id, prev?.id || `feature-${idx + 1}`),
          title: mergeLocalized(prev?.title, ft?.title),
          desc: mergeLocalized(prev?.desc, ft?.desc),
        };
      })
    : base.infrastructure.features.map((ft) => ({ ...ft }));

  const infrastructure: AboutInfrastructureSection = {
    label: mergeLocalized(base.infrastructure.label, infraRaw.label),
    title: mergeLocalized(base.infrastructure.title, infraRaw.title),
    desc: mergeLocalized(base.infrastructure.desc, infraRaw.desc),
    image: infraImg,
    imageFallback: inferImageFallback(infraImg, infraRaw.imageFallback ?? (infraRaw.image ? undefined : base.infrastructure.imageFallback)),
    imageAlt: mergeLocalized(base.infrastructure.imageAlt, infraRaw.imageAlt),
    features: infraFeatures,
  };

  const srcRaw = raw.sourcing && typeof raw.sourcing === 'object' ? raw.sourcing : {};
  const sourcingRows: AboutSourcingRow[] = Array.isArray(srcRaw.rows)
    ? srcRaw.rows.map((row: any, idx: number) => {
        const prev = base.sourcing.rows.find((b) => b.id === row?.id) || base.sourcing.rows[idx];
        return {
          id: sanitizeId(row?.id, prev?.id || `sourcing-${idx + 1}`),
          label: mergeLocalized(prev?.label, row?.label),
          value: mergeLocalized(prev?.value, row?.value),
        };
      })
    : base.sourcing.rows.map((r) => ({ ...r }));

  const sourcing: AboutSourcingSection = {
    label: mergeLocalized(base.sourcing.label, srcRaw.label),
    title: mergeLocalized(base.sourcing.title, srcRaw.title),
    desc: mergeLocalized(base.sourcing.desc, srcRaw.desc),
    rows: sourcingRows,
  };

  const gsRaw = raw.gallerySection && typeof raw.gallerySection === 'object' ? raw.gallerySection : {};
  const gallerySection: AboutGallerySectionHeader = {
    label: mergeLocalized(base.gallerySection.label, gsRaw.label),
    title: mergeLocalized(base.gallerySection.title, gsRaw.title),
    desc: mergeLocalized(base.gallerySection.desc, gsRaw.desc),
  };

  let gallery: AboutGalleryItem[];
  if (Array.isArray(raw.gallery)) {
    const usedIds = new Set<string>();
    gallery = raw.gallery
      .map((item: any, idx: number) => {
        const prev = base.gallery.find((g) => g.id === item?.id);
        let id = sanitizeId(item?.id, `gallery-item-${idx + 1}`);
        while (usedIds.has(id)) {
          id = `${id}-${idx + 1}`;
        }
        usedIds.add(id);

        const rawImage = typeof item?.image === 'string' ? item.image.trim() : '';
        const image = isSafeAboutImageUrl(rawImage) ? rawImage : prev?.image || '';
        const explicitFallback = item?.imageFallback;
        const imageFallback = image
          ? inferImageFallback(image, explicitFallback ?? (rawImage && rawImage === prev?.image ? prev?.imageFallback : undefined))
          : undefined;

        const sortOrder = Number.isFinite(Number(item?.sortOrder)) ? Number(item.sortOrder) : idx + 1;
        return {
          id,
          image,
          ...(imageFallback ? { imageFallback } : {}),
          category: sanitizeCategory(item?.category, prev?.category || 'factory'),
          label: mergeLocalized(prev?.label, item?.label),
          title: mergeLocalized(prev?.title, item?.title),
          description: mergeLocalized(prev?.description, item?.description),
          alt: mergeLocalized(prev?.alt, item?.alt),
          sortOrder,
          visible: item?.visible !== undefined ? Boolean(item.visible) : true,
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
  } else {
    gallery = base.gallery.map((g, idx) => ({ ...g, sortOrder: idx + 1 }));
  }

  return {
    hero,
    story,
    visionMission,
    highlightVisual,
    metrics,
    milestones,
    infrastructure,
    sourcing,
    gallerySection,
    gallery,
  };
}

export function validateAboutContent(
  input: unknown,
  existing?: AboutPageContent
): { valid: boolean; errors: string[]; data: AboutPageContent } {
  const errors: string[] = [];
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, any>;

  if (raw.highlightVisual?.image !== undefined && !isSafeAboutImageUrl(raw.highlightVisual.image)) {
    errors.push('Đường dẫn ảnh nổi bật (highlightVisual.image) không hợp lệ hoặc chứa giao thức không an toàn.');
  }
  if (raw.infrastructure?.image !== undefined && !isSafeAboutImageUrl(raw.infrastructure.image)) {
    errors.push('Đường dẫn ảnh nhà máy (infrastructure.image) không hợp lệ hoặc chứa giao thức không an toàn.');
  }

  if (Array.isArray(raw.gallery)) {
    const seenIds = new Set<string>();
    raw.gallery.forEach((item: any, idx: number) => {
      const labelIdx = `Ảnh thư viện #${idx + 1}`;
      if (!item || typeof item !== 'object') {
        errors.push(`${labelIdx}: Định dạng bản ghi không hợp lệ.`);
        return;
      }
      if (!isSafeAboutImageUrl(item.image)) {
        errors.push(`${labelIdx}: Đường dẫn ảnh (image) không hợp lệ hoặc không được phép.`);
      }
      if (item.imageFallback && !isSafeAboutImageUrl(item.imageFallback)) {
        errors.push(`${labelIdx}: Đường dẫn ảnh dự phòng (imageFallback) không hợp lệ.`);
      }
      if (typeof item.category === 'string' && !(ABOUT_GALLERY_CATEGORIES as readonly string[]).includes(item.category.trim())) {
        errors.push(`${labelIdx}: Danh mục "${item.category}" không nằm trong danh sách cho phép.`);
      }
      const id = sanitizeId(item.id, '');
      if (!id) {
        errors.push(`${labelIdx}: Thiếu mã định danh (id).`);
      } else if (seenIds.has(id)) {
        errors.push(`${labelIdx}: Trùng mã định danh "${id}".`);
      } else {
        seenIds.add(id);
      }

      const titleVi = typeof item.title?.vi === 'string' ? item.title.vi.trim() : '';
      const titleEn = typeof item.title?.en === 'string' ? item.title.en.trim() : '';
      if (!titleVi && !titleEn) {
        errors.push(`${labelIdx}: Cần nhập ít nhất tiêu đề tiếng Việt hoặc tiếng Anh.`);
      }
      const labelVi = typeof item.label?.vi === 'string' ? item.label.vi.trim() : '';
      const labelEn = typeof item.label?.en === 'string' ? item.label.en.trim() : '';
      if (!labelVi && !labelEn) {
        errors.push(`${labelIdx}: Cần nhập ít nhất nhãn hiển thị tiếng Việt hoặc tiếng Anh.`);
      }
    });
  }

  const base = existing || ({
    hero: { badge: EMPTY_LOCALIZED_TEXT, title: EMPTY_LOCALIZED_TEXT, subtitle: EMPTY_LOCALIZED_TEXT },
    story: { label: EMPTY_LOCALIZED_TEXT, titleLine1: EMPTY_LOCALIZED_TEXT, titleLine2: EMPTY_LOCALIZED_TEXT, description: EMPTY_LOCALIZED_TEXT },
    visionMission: {
      enabled: false,
      label: EMPTY_LOCALIZED_TEXT,
      visionTitle: EMPTY_LOCALIZED_TEXT,
      visionDesc: EMPTY_LOCALIZED_TEXT,
      missionTitle: EMPTY_LOCALIZED_TEXT,
      missionDesc: EMPTY_LOCALIZED_TEXT,
      coreValuesTitle: EMPTY_LOCALIZED_TEXT,
      coreValuesDesc: EMPTY_LOCALIZED_TEXT,
    },
    highlightVisual: {
      image: '/assets/images/factory/factory-quality-sorting.webp',
      imageFallback: '/assets/images/factory/factory-quality-sorting.jpg',
      overlayTag: EMPTY_LOCALIZED_TEXT,
      overlayLine1: EMPTY_LOCALIZED_TEXT,
      overlayLine2: EMPTY_LOCALIZED_TEXT,
      alt: EMPTY_LOCALIZED_TEXT,
    },
    metrics: [],
    milestones: [],
    infrastructure: {
      label: EMPTY_LOCALIZED_TEXT,
      title: EMPTY_LOCALIZED_TEXT,
      desc: EMPTY_LOCALIZED_TEXT,
      image: '/assets/images/factory/factory-fresh-prep.webp',
      imageFallback: '/assets/images/factory/factory-fresh-prep.jpg',
      imageAlt: EMPTY_LOCALIZED_TEXT,
      features: [],
    },
    sourcing: { label: EMPTY_LOCALIZED_TEXT, title: EMPTY_LOCALIZED_TEXT, desc: EMPTY_LOCALIZED_TEXT, rows: [] },
    gallerySection: { label: EMPTY_LOCALIZED_TEXT, title: EMPTY_LOCALIZED_TEXT, desc: EMPTY_LOCALIZED_TEXT },
    gallery: [],
  } as AboutPageContent);

  const merged = mergeAboutContent(base, raw);
  return {
    valid: errors.length === 0,
    errors,
    data: merged,
  };
}
