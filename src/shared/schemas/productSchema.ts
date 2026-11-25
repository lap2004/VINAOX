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

  const category: ProductCategory = ALLOWED_CATEGORIES.includes(raw.category) ? raw.category : 'soft-dried';

  let image = typeof raw.image === 'string' ? raw.image.trim() : (typeof raw.imageWebp === 'string' ? raw.imageWebp.trim() : '');
  if (!image || !isValidUrl(image, true)) {
    image = '/assets/images/products/placeholder.webp';
  }

  const shortDescriptionVi = typeof raw.shortDescriptionVi === 'string' ? raw.shortDescriptionVi.trim() : (typeof raw.description_vi === 'string' ? raw.description_vi.trim() : '');
  const shortDescription = typeof raw.shortDescription === 'string' ? raw.shortDescription.trim() : (typeof raw.description_en === 'string' ? raw.description_en.trim() : shortDescriptionVi);
  const descriptionVi = typeof raw.descriptionVi === 'string' ? raw.descriptionVi.trim() : (typeof raw.description_vi === 'string' ? raw.description_vi.trim() : shortDescriptionVi);
  const description = typeof raw.description === 'string' ? raw.description.trim() : (typeof raw.description_en === 'string' ? raw.description_en.trim() : shortDescription);

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
    category,
    categoryLabelEn: typeof raw.categoryLabelEn === 'string' ? raw.categoryLabelEn : 'Tropical Dried Fruits',
    categoryLabelVi: typeof raw.categoryLabelVi === 'string' ? raw.categoryLabelVi : 'Trái cây sấy nhiệt đới',
    image,
    imageWebp: image,
    imageJpg: typeof raw.imageJpg === 'string' ? raw.imageJpg : image,
    shortDescription,
    shortDescriptionVi,
    description: typeof raw.description === 'string' ? raw.description.trim() : shortDescription,
    descriptionVi: typeof raw.descriptionVi === 'string' ? raw.descriptionVi.trim() : shortDescriptionVi,
    origin: typeof raw.origin === 'string' ? raw.origin : 'Mekong Delta, Vietnam',
    originVi: typeof raw.originVi === 'string' ? raw.originVi : 'Đồng bằng Sông Cửu Long, Việt Nam',
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
    // Compatibility fields
    name_vi: nameVi,
    name_en: name,
    description_vi: descriptionVi,
    description_en: description,
    origin_vi: typeof raw.originVi === 'string' ? raw.originVi : 'Đồng bằng Sông Cửu Long, Việt Nam',
    origin_en: typeof raw.origin === 'string' ? raw.origin : 'Mekong Delta, Vietnam',
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
  const base = existing && typeof existing === 'object' ? { ...existing } : {};
  const update = incoming && typeof incoming === 'object' ? { ...incoming } : {};

  const merged = {
    ...base,
    ...update,
    specs: { ...(base.specs || {}), ...(update.specs || {}) },
    en: { ...(base.en || {}), ...(update.en || {}) },
    vi: { ...(base.vi || {}), ...(update.vi || {}) }
  };

  return validateProduct(merged).data;
}
