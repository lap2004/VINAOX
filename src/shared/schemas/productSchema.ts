import { ProductCategory, ProductItem, ProductSpecs } from '../../data/products.js';
import { isValidUrl, validateSlug } from './newsSchema.js';

export interface ProductValidationResult {
  valid: boolean;
  errors: string[];
  data: ProductItem;
}

const ALLOWED_CATEGORIES: ProductCategory[] = ['soft-dried', 'chips', 'nuts-seeds', 'mixed'];

export function validateProduct(input: unknown): ProductValidationResult {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  const slugCheck = validateSlug(raw.slug || raw.id);
  if (!slugCheck.valid) {
    errors.push('Slug sản phẩm không hợp lệ (yêu cầu từ 3-120 ký tự chữ thường, số và gạch nối).');
  }
  const slug = slugCheck.slug || 'san-pham-moi';
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : slug;

  const nameVi = typeof raw.nameVi === 'string' && raw.nameVi.trim() ? raw.nameVi.trim() : (typeof raw.name_vi === 'string' ? raw.name_vi.trim() : '');
  if (!nameVi) {
    errors.push('Tên sản phẩm tiếng Việt là trường bắt buộc.');
  }

  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : (typeof raw.name_en === 'string' ? raw.name_en.trim() : nameVi);
  const nameKo = typeof raw.name_ko === 'string' && raw.name_ko.trim()
    ? raw.name_ko.trim()
    : (typeof raw.nameKo === 'string' ? raw.nameKo.trim() : (typeof raw.ko?.name === 'string' ? raw.ko.name.trim() : ''));
  const nameZh = typeof raw.name_zh === 'string' && raw.name_zh.trim()
    ? raw.name_zh.trim()
    : (typeof raw.nameZh === 'string' ? raw.nameZh.trim() : (typeof raw.zh?.name === 'string' ? raw.zh.name.trim() : ''));

  const category: ProductCategory = ALLOWED_CATEGORIES.includes(raw.category) ? raw.category : 'soft-dried';

  let image = typeof raw.image === 'string' ? raw.image.trim() : (typeof raw.imageWebp === 'string' ? raw.imageWebp.trim() : '');
  if (!image || !isValidUrl(image, true)) {
    image = '/images/products/placeholder.webp';
  }

  // Derive WebP and JPG URLs consistently
  let imageWebp = typeof raw.imageWebp === 'string' && raw.imageWebp.trim() ? raw.imageWebp.trim() : image;
  let imageJpg = typeof raw.imageJpg === 'string' && raw.imageJpg.trim() ? raw.imageJpg.trim() : image;

  // If image was changed to a different WebP file, sync imageWebp and imageJpg
  if (image.endsWith('.webp')) {
    imageWebp = image;
    if (!raw.imageJpg || raw.imageJpg.includes('img_5608') || !raw.imageJpg.endsWith('.jpg')) {
      imageJpg = image.replace(/\.webp$/, '.jpg');
    }
  } else if (image.endsWith('.jpg') || image.endsWith('.jpeg')) {
    imageJpg = image;
    if (!raw.imageWebp || raw.imageWebp.includes('img_5608') || !raw.imageWebp.endsWith('.webp')) {
      imageWebp = image.replace(/\.jpe?g$/, '.webp');
    }
  }

  const shortDescriptionVi = typeof raw.shortDescriptionVi === 'string' ? raw.shortDescriptionVi.trim() : (typeof raw.description_vi === 'string' ? raw.description_vi.trim() : '');
  const shortDescription = typeof raw.shortDescription === 'string' ? raw.shortDescription.trim() : (typeof raw.description_en === 'string' ? raw.description_en.trim() : shortDescriptionVi);
  const descriptionVi = typeof raw.descriptionVi === 'string' ? raw.descriptionVi.trim() : (typeof raw.description_vi === 'string' ? raw.description_vi.trim() : shortDescriptionVi);
  const description = typeof raw.description === 'string' ? raw.description.trim() : (typeof raw.description_en === 'string' ? raw.description_en.trim() : shortDescription);
  const descriptionKo = typeof raw.description_ko === 'string' && raw.description_ko.trim()
    ? raw.description_ko.trim()
    : (typeof raw.descriptionKo === 'string' ? raw.descriptionKo.trim() : (typeof raw.ko?.desc === 'string' ? raw.ko.desc.trim() : ''));
  const descriptionZh = typeof raw.description_zh === 'string' && raw.description_zh.trim()
    ? raw.description_zh.trim()
    : (typeof raw.descriptionZh === 'string' ? raw.descriptionZh.trim() : (typeof raw.zh?.desc === 'string' ? raw.zh.desc.trim() : ''));
  const originKo = typeof raw.origin_ko === 'string' && raw.origin_ko.trim()
    ? raw.origin_ko.trim()
    : (typeof raw.originKo === 'string' ? raw.originKo.trim() : (typeof raw.ko?.origin === 'string' ? raw.ko.origin.trim() : ''));
  const originZh = typeof raw.origin_zh === 'string' && raw.origin_zh.trim()
    ? raw.origin_zh.trim()
    : (typeof raw.originZh === 'string' ? raw.originZh.trim() : (typeof raw.zh?.origin === 'string' ? raw.zh.origin.trim() : ''));

  const defaultSpecs: ProductSpecs = {
    moisture: '< 16%',
    brix: '50° - 55° Brix',
    shelfLifeEn: '12 Months',
    shelfLifeVi: '12 Tháng',
    storageEn: 'Cool, dry place (20 - 25°C)',
    storageVi: 'Nơi khô ráo, thoáng mát (20 - 25°C)',
    ingredientsEn: '100% Natural Vietnamese Fruits',
    ingredientsVi: '100% Trái cây Việt Nam tự nhiên',
    processEn: 'Low-temperature convective heat-pump drying',
    processVi: 'Sấy bơm nhiệt nhiệt độ thấp tuần hoàn',
    packagingEn: 'Zip pouch / Export carton',
    packagingVi: 'Túi zip / Thùng carton xuất khẩu',
    certificationsEn: 'BRCGS Facility, Clean Label',
    certificationsVi: 'Nhà máy chuẩn BRCGS, Clean Label'
  };

  const rawSpecs = typeof raw.specs === 'object' && raw.specs !== null ? raw.specs : {};
  const specs: ProductSpecs = { ...defaultSpecs, ...rawSpecs };

  const product: ProductItem = {
    id,
    slug,
    aliases: Array.isArray(raw.aliases) ? raw.aliases : [],
    name,
    nameVi,
    ...(nameKo ? { nameKo } : {}),
    ...(nameZh ? { nameZh } : {}),
    category,
    categoryLabelEn: typeof raw.categoryLabelEn === 'string' ? raw.categoryLabelEn : 'Tropical Dried Fruits',
    categoryLabelVi: typeof raw.categoryLabelVi === 'string' ? raw.categoryLabelVi : 'Trái cây sấy nhiệt đới',
    image,
    imageWebp,
    imageJpg,
    shortDescription,
    shortDescriptionVi,
    description: typeof raw.description === 'string' ? raw.description.trim() : shortDescription,
    descriptionVi: typeof raw.descriptionVi === 'string' ? raw.descriptionVi.trim() : shortDescriptionVi,
    ...(descriptionKo ? { descriptionKo, shortDescriptionKo: descriptionKo } : {}),
    ...(descriptionZh ? { descriptionZh, shortDescriptionZh: descriptionZh } : {}),
    origin: typeof raw.origin === 'string' ? raw.origin : 'Mekong Delta, Vietnam',
    originVi: typeof raw.originVi === 'string' ? raw.originVi : 'Đồng bằng Sông Cửu Long, Việt Nam',
    ...(originKo ? { originKo } : {}),
    ...(originZh ? { originZh } : {}),
    certifications: Array.isArray(raw.certifications) ? raw.certifications : ['BRCGS', 'Clean Label'],
    verified: raw.verified !== undefined ? Boolean(raw.verified) : true,
    ocop: typeof raw.ocop === 'string' ? raw.ocop : '3-Star OCOP',
    specs,
    en: {
      name,
      desc: shortDescription,
      origin: typeof raw.en?.origin === 'string' ? raw.en.origin : 'Mekong Delta, Vietnam',
      features: typeof raw.en?.features === 'string' ? raw.en.features : shortDescription
    },
    vi: {
      name: nameVi,
      desc: shortDescriptionVi,
      origin: typeof raw.vi?.origin === 'string' ? raw.vi.origin : 'Đồng bằng Sông Cửu Long, Việt Nam',
      features: typeof raw.vi?.features === 'string' ? raw.vi.features : shortDescriptionVi
    },
    ...(nameKo || descriptionKo ? {
      ko: {
        name: nameKo || name,
        desc: descriptionKo || description,
        origin: originKo || (typeof raw.origin === 'string' ? raw.origin : 'Vietnam'),
        features: typeof raw.ko?.features === 'string' ? raw.ko.features : (descriptionKo || description)
      }
    } : {}),
    ...(nameZh || descriptionZh ? {
      zh: {
        name: nameZh || name,
        desc: descriptionZh || description,
        origin: originZh || (typeof raw.origin === 'string' ? raw.origin : 'Vietnam'),
        features: typeof raw.zh?.features === 'string' ? raw.zh.features : (descriptionZh || description)
      }
    } : {}),
    // Compatibility fields
    name_vi: nameVi,
    name_en: name,
    ...(nameKo ? { name_ko: nameKo } : {}),
    ...(nameZh ? { name_zh: nameZh } : {}),
    description_vi: descriptionVi,
    description_en: description,
    ...(descriptionKo ? { description_ko: descriptionKo } : {}),
    ...(descriptionZh ? { description_zh: descriptionZh } : {}),
    origin_vi: typeof raw.originVi === 'string' ? raw.originVi : 'Đồng bằng Sông Cửu Long, Việt Nam',
    origin_en: typeof raw.origin === 'string' ? raw.origin : 'Mekong Delta, Vietnam',
    ...(originKo ? { origin_ko: originKo } : {}),
    ...(originZh ? { origin_zh: originZh } : {}),
    shelf_life: specs.shelfLifeVi,
    packaging: specs.packagingVi,
    order: Number(raw.order) || 999
  };

  return {
    valid: errors.length === 0,
    errors,
    data: product
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

  const merged: Record<string, any> = {
    ...base,
    specs: { ...(base.specs || {}), ...(update.specs || {}) },
    en: { ...(base.en || {}), ...(update.en || {}) },
    vi: { ...(base.vi || {}), ...(update.vi || {}) },
    ...(base.ko || update.ko ? { ko: { ...(base.ko || {}), ...(update.ko || {}) } } : {}),
    ...(base.zh || update.zh ? { zh: { ...(base.zh || {}), ...(update.zh || {}) } } : {}),
  };

  for (const [key, value] of Object.entries(update)) {
    if (key === 'specs' || key === 'en' || key === 'vi' || key === 'ko' || key === 'zh') continue;
    if (value !== undefined && value !== null) {
      if (typeof value === 'string' && value.trim() === '' && base[key]) {
        continue;
      }
      merged[key] = value;
    }
  }

  return validateProduct(merged).data;
}
