import type {
  CertificationScopeType,
  ProductCategory,
  ProductCertificationRef,
  ProductFeatureItem,
  ProductItem,
  ProductSpecs,
} from '../../data/products.js';
import { isValidUrl, validateSlug } from './newsSchema.js';

export interface ProductValidationResult {
  valid: boolean;
  errors: string[];
  data: ProductItem;
}

const ALLOWED_CATEGORIES: ProductCategory[] = ['soft-dried', 'chips', 'nuts-seeds', 'mixed'];
const ALLOWED_SCOPE_TYPES: CertificationScopeType[] = [
  'product',
  'facility',
  'management-system',
  'registration',
  'audit',
];

function cleanStr(val: unknown): string {
  return typeof val === 'string' ? val.trim() : '';
}

function normalizeProductCertifications(input: unknown): ProductCertificationRef[] {
  if (!Array.isArray(input)) return [];
  const result: ProductCertificationRef[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const raw = item as Record<string, any>;
    const certificateId = cleanStr(raw.certificateId || raw.id);
    const nameVi = cleanStr(raw.nameVi || raw.name_vi || raw.name);
    const nameEn = cleanStr(raw.nameEn || raw.name_en || raw.name) || nameVi;
    if (!certificateId && !nameVi && !nameEn) continue;
    const rawScopeType = cleanStr(raw.scopeType) as CertificationScopeType;
    const scopeType: CertificationScopeType = ALLOWED_SCOPE_TYPES.includes(rawScopeType)
      ? rawScopeType
      : 'product';
    result.push({
      certificateId: certificateId || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      nameVi: nameVi || nameEn,
      nameEn: nameEn || nameVi,
      ...(cleanStr(raw.nameKo) ? { nameKo: cleanStr(raw.nameKo) } : {}),
      ...(cleanStr(raw.nameZh) ? { nameZh: cleanStr(raw.nameZh) } : {}),
      scopeType,
      scopeVi: cleanStr(raw.scopeVi) || 'Chứng nhận đã xác minh',
      scopeEn: cleanStr(raw.scopeEn) || 'Verified Certification',
      ...(cleanStr(raw.scopeKo) ? { scopeKo: cleanStr(raw.scopeKo) } : {}),
      ...(cleanStr(raw.scopeZh) ? { scopeZh: cleanStr(raw.scopeZh) } : {}),
      ...(cleanStr(raw.documentUrl) && isValidUrl(cleanStr(raw.documentUrl), true)
        ? { documentUrl: cleanStr(raw.documentUrl) }
        : {}),
    });
  }
  return result;
}

function normalizeProductFeatures(input: unknown): ProductFeatureItem[] {
  if (!Array.isArray(input)) return [];
  const result: ProductFeatureItem[] = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (typeof item === 'string' && item.trim()) {
      result.push({
        id: `feature-${i + 1}`,
        label: { vi: item.trim(), en: item.trim() },
      });
      continue;
    }
    if (!item || typeof item !== 'object') continue;
    const raw = item as Record<string, any>;
    const lbl = raw.label && typeof raw.label === 'object' ? raw.label : raw;
    const vi = cleanStr(lbl.vi || raw.labelVi || raw.vi);
    const en = cleanStr(lbl.en || raw.labelEn || raw.en) || vi;
    const ko = cleanStr(lbl.ko || raw.labelKo || raw.ko);
    const zh = cleanStr(lbl.zh || raw.labelZh || raw.zh);
    if (!vi && !en) continue;
    result.push({
      id: cleanStr(raw.id) || `feature-${i + 1}`,
      label: {
        vi: vi || en,
        en: en || vi,
        ...(ko ? { ko } : {}),
        ...(zh ? { zh } : {}),
      },
    });
  }
  return result;
}

export function validateProduct(input: unknown): ProductValidationResult {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  const slugCheck = validateSlug(raw.slug || raw.id);
  if (!slugCheck.valid) {
    errors.push('Slug sản phẩm không hợp lệ (yêu cầu từ 3-120 ký tự chữ thường, số và gạch nối).');
  }
  const slug = slugCheck.slug || 'san-pham-moi';
  const id = cleanStr(raw.id) || slug;

  const nameVi = cleanStr(raw.nameVi) || cleanStr(raw.name_vi) || cleanStr(raw.vi?.name);
  if (!nameVi) {
    errors.push('Tên sản phẩm tiếng Việt là trường bắt buộc.');
  }

  const name = cleanStr(raw.name) || cleanStr(raw.name_en) || cleanStr(raw.en?.name) || nameVi;
  const nameKo = cleanStr(raw.name_ko) || cleanStr(raw.nameKo) || cleanStr(raw.ko?.name);
  const nameZh = cleanStr(raw.name_zh) || cleanStr(raw.nameZh) || cleanStr(raw.zh?.name);

  const category: ProductCategory = ALLOWED_CATEGORIES.includes(raw.category) ? raw.category : 'soft-dried';

  let image = cleanStr(raw.image) || cleanStr(raw.imageWebp);
  if (!image || !isValidUrl(image, true)) {
    image = '/images/products/placeholder.webp';
  }

  // Derive WebP and JPG URLs consistently
  let imageWebp = cleanStr(raw.imageWebp) || image;
  let imageJpg = cleanStr(raw.imageJpg) || image;

  // If image was changed to a different WebP file, sync imageWebp and imageJpg
  if (image.endsWith('.webp')) {
    imageWebp = image;
    if (!raw.imageJpg || String(raw.imageJpg).includes('img_5608') || !String(raw.imageJpg).endsWith('.jpg')) {
      imageJpg = image.replace(/\.webp$/, '.jpg');
    }
  } else if (image.endsWith('.jpg') || image.endsWith('.jpeg')) {
    imageJpg = image;
    if (!raw.imageWebp || String(raw.imageWebp).includes('img_5608') || !String(raw.imageWebp).endsWith('.webp')) {
      imageWebp = image.replace(/\.jpe?g$/, '.webp');
    }
  }

  // Keep short descriptions and full descriptions distinct (never synthesize duplicate fallback copy)
  const descriptionVi = cleanStr(raw.descriptionVi) || cleanStr(raw.description_vi) || cleanStr(raw.vi?.desc);
  const shortDescriptionVi = cleanStr(raw.shortDescriptionVi) || cleanStr(raw.short_description_vi) || descriptionVi;
  const description = cleanStr(raw.description) || cleanStr(raw.description_en) || cleanStr(raw.en?.desc);
  const shortDescription = cleanStr(raw.shortDescription) || cleanStr(raw.short_description_en) || description;
  const descriptionKo = cleanStr(raw.description_ko) || cleanStr(raw.descriptionKo) || cleanStr(raw.ko?.desc);
  const shortDescriptionKo = cleanStr(raw.shortDescriptionKo) || descriptionKo;
  const descriptionZh = cleanStr(raw.description_zh) || cleanStr(raw.descriptionZh) || cleanStr(raw.zh?.desc);
  const shortDescriptionZh = cleanStr(raw.shortDescriptionZh) || descriptionZh;

  const originVi = cleanStr(raw.originVi) || cleanStr(raw.origin_vi) || cleanStr(raw.vi?.origin);
  const origin = cleanStr(raw.origin) || cleanStr(raw.origin_en) || cleanStr(raw.en?.origin) || originVi;
  const originKo = cleanStr(raw.origin_ko) || cleanStr(raw.originKo) || cleanStr(raw.ko?.origin);
  const originZh = cleanStr(raw.origin_zh) || cleanStr(raw.originZh) || cleanStr(raw.zh?.origin);

  // Neutral empty spec defaults — never fabricate soft-dried defaults (e.g. Brix / heat-pump drying) on nuts or chips
  const emptySpecs: ProductSpecs = {
    moisture: '',
    brix: '',
    shelfLifeEn: '',
    shelfLifeVi: '',
    storageEn: '',
    storageVi: '',
    ingredientsEn: '',
    ingredientsVi: '',
    processEn: '',
    processVi: '',
    packagingEn: '',
    packagingVi: '',
    certificationsEn: '',
    certificationsVi: '',
  };

  const rawSpecs = typeof raw.specs === 'object' && raw.specs !== null ? raw.specs : {};
  const specs: ProductSpecs = {
    ...emptySpecs,
    ...rawSpecs,
    moisture: cleanStr(rawSpecs.moisture ?? raw.specs_moisture),
    brix: cleanStr(rawSpecs.brix ?? raw.specs_brix),
    ...(cleanStr(rawSpecs.sizeOrWeightVi) ? { sizeOrWeightVi: cleanStr(rawSpecs.sizeOrWeightVi) } : {}),
    ...(cleanStr(rawSpecs.sizeOrWeightEn) ? { sizeOrWeightEn: cleanStr(rawSpecs.sizeOrWeightEn) } : {}),
    ...(cleanStr(rawSpecs.sizeOrWeightKo) ? { sizeOrWeightKo: cleanStr(rawSpecs.sizeOrWeightKo) } : {}),
    ...(cleanStr(rawSpecs.sizeOrWeightZh) ? { sizeOrWeightZh: cleanStr(rawSpecs.sizeOrWeightZh) } : {}),
    shelfLifeVi: cleanStr(rawSpecs.shelfLifeVi || raw.shelf_life),
    shelfLifeEn: cleanStr(rawSpecs.shelfLifeEn),
    packagingVi: cleanStr(rawSpecs.packagingVi || raw.packaging),
    packagingEn: cleanStr(rawSpecs.packagingEn),
    ingredientsVi: cleanStr(rawSpecs.ingredientsVi || raw.specs_ingredients_vi),
    ingredientsEn: cleanStr(rawSpecs.ingredientsEn),
    processVi: cleanStr(rawSpecs.processVi || raw.specs_process_vi),
    processEn: cleanStr(rawSpecs.processEn),
    storageVi: cleanStr(rawSpecs.storageVi),
    storageEn: cleanStr(rawSpecs.storageEn),
    certificationsVi: cleanStr(rawSpecs.certificationsVi || raw.specs_cert_vi),
    certificationsEn: cleanStr(rawSpecs.certificationsEn),
  };

  const productCertifications = normalizeProductCertifications(raw.productCertifications);
  const productFeatures = normalizeProductFeatures(raw.productFeatures);
  const legacyCertStrings = Array.isArray(raw.certifications)
    ? raw.certifications.map((c: unknown) => cleanStr(c)).filter(Boolean)
    : [];

  const published = raw.published !== undefined ? Boolean(raw.published) : raw.status !== 'draft';
  const status: 'published' | 'draft' = published ? 'published' : 'draft';

  const featuresEn = cleanStr(raw.en?.features);
  const featuresVi = cleanStr(raw.vi?.features);
  const featuresKo = cleanStr(raw.ko?.features);
  const featuresZh = cleanStr(raw.zh?.features);

  const product: ProductItem = {
    id,
    slug,
    aliases: Array.isArray(raw.aliases) ? raw.aliases : [],
    name,
    nameVi,
    ...(nameKo ? { nameKo } : {}),
    ...(nameZh ? { nameZh } : {}),
    category,
    categoryLabelEn: cleanStr(raw.categoryLabelEn) || '',
    categoryLabelVi: cleanStr(raw.categoryLabelVi) || '',
    image,
    imageWebp,
    imageJpg,
    shortDescription,
    shortDescriptionVi,
    description: description || shortDescription,
    descriptionVi: descriptionVi || shortDescriptionVi,
    ...(shortDescriptionKo ? { shortDescriptionKo } : {}),
    ...(descriptionKo ? { descriptionKo } : {}),
    ...(shortDescriptionZh ? { shortDescriptionZh } : {}),
    ...(descriptionZh ? { descriptionZh } : {}),
    origin,
    originVi,
    ...(originKo ? { originKo } : {}),
    ...(originZh ? { originZh } : {}),
    certifications: legacyCertStrings,
    productCertifications,
    productFeatures,
    verified: raw.verified !== undefined ? Boolean(raw.verified) : true,
    ocop: cleanStr(raw.ocop),
    specs,
    en: {
      name,
      desc: shortDescription || description,
      origin,
      features: featuresEn,
    },
    vi: {
      name: nameVi,
      desc: shortDescriptionVi || descriptionVi,
      origin: originVi,
      features: featuresVi,
    },
    ...(nameKo || descriptionKo
      ? {
          ko: {
            name: nameKo || name,
            desc: descriptionKo || description,
            origin: originKo || origin,
            features: featuresKo,
          },
        }
      : {}),
    ...(nameZh || descriptionZh
      ? {
          zh: {
            name: nameZh || name,
            desc: descriptionZh || description,
            origin: originZh || origin,
            features: featuresZh,
          },
        }
      : {}),
    ...(cleanStr(raw.seoTitleVi) ? { seoTitleVi: cleanStr(raw.seoTitleVi) } : {}),
    ...(cleanStr(raw.seoTitleEn) ? { seoTitleEn: cleanStr(raw.seoTitleEn) } : {}),
    ...(cleanStr(raw.seoDescriptionVi) ? { seoDescriptionVi: cleanStr(raw.seoDescriptionVi) } : {}),
    ...(cleanStr(raw.seoDescriptionEn) ? { seoDescriptionEn: cleanStr(raw.seoDescriptionEn) } : {}),
    ...(cleanStr(raw.imageAltVi) ? { imageAltVi: cleanStr(raw.imageAltVi) } : {}),
    ...(cleanStr(raw.imageAltEn) ? { imageAltEn: cleanStr(raw.imageAltEn) } : {}),
    published,
    status,
    featured: raw.featured !== undefined ? Boolean(raw.featured) : false,
    ...(Number.isFinite(Number(raw.featuredOrder)) && Number(raw.featuredOrder) > 0
      ? { featuredOrder: Math.floor(Number(raw.featuredOrder)) }
      : {}),
    // Compatibility aliases
    name_vi: nameVi,
    name_en: name,
    ...(nameKo ? { name_ko: nameKo } : {}),
    ...(nameZh ? { name_zh: nameZh } : {}),
    description_vi: descriptionVi || shortDescriptionVi,
    description_en: description || shortDescription,
    ...(descriptionKo ? { description_ko: descriptionKo } : {}),
    ...(descriptionZh ? { description_zh: descriptionZh } : {}),
    origin_vi: originVi,
    origin_en: origin,
    ...(originKo ? { origin_ko: originKo } : {}),
    ...(originZh ? { origin_zh: originZh } : {}),
    shelf_life: specs.shelfLifeVi || cleanStr(raw.shelf_life),
    packaging: specs.packagingVi || cleanStr(raw.packaging),
    order: Number(raw.order) || 999,
  };

  return {
    valid: errors.length === 0,
    errors,
    data: product,
  };
}

export function mergeProduct(
  existing: ProductItem | Record<string, any> | undefined | null,
  incoming: Partial<ProductItem> | Record<string, any>
): ProductItem {
  const base: Record<string, any> = existing && typeof existing === 'object' ? { ...existing } : {};
  const update: Record<string, any> = incoming && typeof incoming === 'object' ? { ...incoming } : {};

  // If update specifies or changes image, ensure imageWebp and imageJpg match
  if (update.image) {
    if (!update.imageWebp) update.imageWebp = update.image;
    if (!update.imageJpg) {
      update.imageJpg = update.image.endsWith('.webp')
        ? update.image.replace(/\.webp$/, '.jpg')
        : update.image;
    }
  }

  const mergeLocalized = (baseObj: any, patchObj: any) => {
    const out: Record<string, any> = { ...(baseObj || {}) };
    for (const [k, v] of Object.entries(patchObj || {})) {
      if (typeof v === 'string' && v.trim() === '' && out[k]) continue;
      if (v !== undefined && v !== null) out[k] = v;
    }
    return out;
  };

  const mergedSpecs: Record<string, any> = { ...(base.specs || {}) };
  for (const [k, v] of Object.entries(update.specs || {})) {
    if (v !== undefined && v !== null) {
      if (typeof v === 'string' && v.trim() === '' && mergedSpecs[k] && k !== 'brix') continue;
      mergedSpecs[k] = v;
    }
  }

  const merged: Record<string, any> = {
    ...base,
    specs: mergedSpecs,
    en: mergeLocalized(base.en, update.en),
    vi: mergeLocalized(base.vi, update.vi),
    ...(base.ko || update.ko ? { ko: mergeLocalized(base.ko, update.ko) } : {}),
    ...(base.zh || update.zh ? { zh: mergeLocalized(base.zh, update.zh) } : {}),
  };

  // Explicit array replacements & boolean published/status take priority when provided
  const explicitArrayFields = new Set(['productCertifications', 'productFeatures', 'certifications', 'aliases']);

  for (const [key, value] of Object.entries(update)) {
    if (key === 'specs' || key === 'en' || key === 'vi' || key === 'ko' || key === 'zh') continue;
    if (value !== undefined && value !== null) {
      if (explicitArrayFields.has(key) && Array.isArray(value)) {
        merged[key] = value;
        continue;
      }
      if (typeof value === 'string' && value.trim() === '' && base[key] && key !== 'ocop') {
        continue;
      }
      merged[key] = value;
    }
  }

  return validateProduct(merged).data;
}
