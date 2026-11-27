import { getProductLocalized, productsData, type ProductCategory, type ProductItem } from '../../data/products';
import { pickLocale, type Language } from '../../i18n/localize';

export type RequestType = 'contact' | 'quotation';
export type TradeTerm = 'FOB' | 'CIF' | 'CONSULT';
export type ShippingMode = 'FCL' | 'LCL' | 'CONSULT';

export interface QuotationProduct {
  productId: string;
  productSlug: string;
  categoryId?: ProductCategory;
}

export interface ContactRequest {
  requestType: RequestType;
  formType?: 'contact' | 'quote';
  locale: Language;
  language?: Language;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  inquiryType?: string;
  productId?: string;
  productSlug?: string;
  categoryId?: ProductCategory | string;
  productName?: string;
  product?: string;
  quantity?: string;
  packaging?: string;
  volume?: string;
  tradeTerm?: TradeTerm;
  shippingMode?: ShippingMode;
  message: string;
  source: string;
  sourcePage?: string;
  hp_website?: string;
}

export interface ContactValidationResult {
  valid: boolean;
  fieldErrors: Partial<Record<'fullName' | 'email' | 'message', string>>;
  summaryError: string;
}

export const VALUE_ADDED_PRODUCT_ID = 'value-added-lines';
export const OEM_PRODUCT_ID = 'oem-private-label';

export const OEM_INQUIRY_LINE_IDS = [
  'granola',
  'fruit-and-nut-balls',
  'honey-infused-dried-fruit',
  'chocolate-dipped-dried-fruit',
] as const;

export type OemInquiryLineId = (typeof OEM_INQUIRY_LINE_IDS)[number];

export const OEM_INQUIRY_LINE_LABELS: Record<
  OemInquiryLineId,
  { vi: string; en: string; ko: string; 'zh-CN': string }
> = {
  granola: {
    vi: 'Gia công OEM: Granola Trái Cây & Hạt (Theo yêu cầu)',
    en: 'OEM Custom Line: Fruit & Nut Granola',
    ko: 'OEM 맞춤 라인: 과일 & 견과류 그래놀라',
    'zh-CN': 'OEM 定制线：水果坚果格兰诺拉麦片',
  },
  'fruit-and-nut-balls': {
    vi: 'Gia công OEM: Viên Năng Lượng Trái Cây & Hạt (Theo yêu cầu)',
    en: 'OEM Custom Line: Fruit & Nut Energy Balls',
    ko: 'OEM 맞춤 라인: 과일 & 견과류 에너지 볼',
    'zh-CN': 'OEM 定制线：水果坚果能量球',
  },
  'honey-infused-dried-fruit': {
    vi: 'Gia công OEM: Trái Cây Sấy Tẩm Mật Ong (Theo yêu cầu)',
    en: 'OEM Custom Line: Honey-Infused Dried Fruit',
    ko: 'OEM 맞춤 라인: 천연 벌꿀 인퓨즈드 건조 과일',
    'zh-CN': 'OEM 定制线：天然蜂蜜浸渍果干',
  },
  'chocolate-dipped-dried-fruit': {
    vi: 'Gia công OEM: Trái Cây Sấy Nhúng Sô-cô-la (Theo yêu cầu)',
    en: 'OEM Custom Line: Chocolate-Dipped Dried Fruit',
    ko: 'OEM 맞춤 라인: 다크 초콜릿 디핑 건조 과일',
    'zh-CN': 'OEM 定制线：黑巧克力蘸酱果干',
  },
};

export function isOemInquiryLineId(id?: string | null): id is OemInquiryLineId {
  return Boolean(id && (OEM_INQUIRY_LINE_IDS as readonly string[]).includes(id));
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const FIELD_LIMITS = {
  fullNameMin: 2,
  fullNameMax: 100,
  emailMax: 120,
  phoneMax: 30,
  companyMax: 150,
  countryMax: 100,
  quantityMax: 200,
  packagingMax: 200,
  messageMin: 5,
  messageMax: 3000,
} as const;

export function resolveCanonicalProduct(raw?: string | QuotationProduct | null): {
  productId: string;
  productSlug: string;
  categoryId: ProductCategory | '';
  customLabel: string;
  matchedProduct?: ProductItem;
} {
  if (!raw) {
    return { productId: '', productSlug: '', categoryId: '', customLabel: '' };
  }

  const rawString = typeof raw === 'string' ? raw : raw.productSlug || raw.productId || '';
  if (!rawString || !rawString.trim()) {
    return { productId: '', productSlug: '', categoryId: '', customLabel: '' };
  }

  const needle = rawString.trim().toLowerCase();
  const secondaryNeedle =
    typeof raw === 'object' && raw.productId ? raw.productId.trim().toLowerCase() : '';

  const matched = productsData.find((p) => {
    const candidates = [
      p.slug,
      p.id,
      p.name,
      p.nameVi,
      p.nameKo,
      p.nameZh,
      p.en?.name,
      p.vi?.name,
      p.ko?.name,
      p.zh?.name,
      ...(p.aliases || []),
    ]
      .filter((x): x is string => Boolean(x))
      .map((x) => x.toLowerCase());
    return candidates.includes(needle) || (secondaryNeedle ? candidates.includes(secondaryNeedle) : false);
  });

  if (matched) {
    return {
      productId: matched.slug,
      productSlug: matched.slug,
      categoryId: matched.category,
      customLabel: '',
      matchedProduct: matched,
    };
  }

  if (needle === 'granola' || needle.includes('granola') || needle.includes('그래놀라') || needle.includes('格兰诺拉')) {
    return { productId: 'granola', productSlug: '', categoryId: '', customLabel: '' };
  }

  if (
    needle === 'fruit-and-nut-balls' ||
    needle === 'fruit-nut-balls' ||
    needle.includes('viên năng lượng') ||
    needle.includes('energy ball') ||
    needle.includes('fruit & nut ball') ||
    needle.includes('fruit and nut ball') ||
    needle.includes('에너지 볼') ||
    needle.includes('能量球')
  ) {
    return { productId: 'fruit-and-nut-balls', productSlug: '', categoryId: '', customLabel: '' };
  }

  if (
    needle === 'honey-infused-dried-fruit' ||
    needle.includes('honey-infused') ||
    needle.includes('mật ong') ||
    needle.includes('벌꿀') ||
    needle.includes('蜂蜜')
  ) {
    return { productId: 'honey-infused-dried-fruit', productSlug: '', categoryId: '', customLabel: '' };
  }

  if (
    needle === 'chocolate-dipped-dried-fruit' ||
    needle.includes('chocolate') ||
    needle.includes('sô-cô-la') ||
    needle.includes('초콜릿') ||
    needle.includes('巧克力')
  ) {
    return { productId: 'chocolate-dipped-dried-fruit', productSlug: '', categoryId: '', customLabel: '' };
  }

  if (needle === OEM_PRODUCT_ID || needle.includes('oem') || needle.includes('private label')) {
    return { productId: OEM_PRODUCT_ID, productSlug: '', categoryId: '', customLabel: '' };
  }

  if (needle === VALUE_ADDED_PRODUCT_ID) {
    return { productId: VALUE_ADDED_PRODUCT_ID, productSlug: '', categoryId: '', customLabel: '' };
  }

  return { productId: '', productSlug: '', categoryId: '', customLabel: rawString.trim() };
}

export function getLocalizedProductLabel(productId: string, customLabel: string, locale: Language): string {
  if (isOemInquiryLineId(productId)) {
    return pickLocale(locale, OEM_INQUIRY_LINE_LABELS[productId]);
  }
  if (productId === VALUE_ADDED_PRODUCT_ID) {
    return pickLocale(locale, {
      vi: 'Trái cây sấy tẩm mật ong / Phủ Sô-cô-la / Granola (OEM)',
      en: 'Honey-Infused & Chocolate-Dipped / Granola (OEM)',
      ko: '천연 벌꿀 인퓨즈드 / 초콜릿 디핑 / 그래놀라 (OEM)',
      'zh-CN': '蜂蜜浸渍果干 / 巧克力蘸酱果干 / 格兰诺拉麦片 (OEM)',
    });
  }
  if (productId === OEM_PRODUCT_ID) {
    return pickLocale(locale, {
      vi: 'Gia công OEM / ODM & Đóng gói Nhãn riêng (Private Label)',
      en: 'OEM / ODM & Private Label Project',
      ko: 'OEM / ODM 자체 브랜드(PB) 위탁 생산',
      'zh-CN': 'OEM / ODM 自有品牌贴牌代工项目',
    });
  }
  if (productId) {
    const matched = productsData.find((p) => p.slug === productId || p.id === productId);
    if (matched) return getProductLocalized(matched, locale).name;
  }
  return customLabel || '';
}

export function validateContactForm(
  values: { fullName: string; email: string; message: string },
  locale: Language
): ContactValidationResult {
  const fieldErrors: ContactValidationResult['fieldErrors'] = {};
  const trimmedName = values.fullName.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < FIELD_LIMITS.fullNameMin) {
    fieldErrors.fullName = pickLocale(locale, {
      vi: 'Vui lòng nhập họ tên đầy đủ (tối thiểu 2 ký tự).',
      en: 'Please enter your full name (at least 2 characters).',
      ko: '성함을 2자 이상 입력해 주세요.',
      'zh-CN': '请输入您的姓名（至少 2 个字符）。',
    });
  }

  if (!EMAIL_REGEX.test(trimmedEmail) || /[\r\n]/.test(trimmedEmail)) {
    fieldErrors.email = pickLocale(locale, {
      vi: 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.',
      en: 'Please provide a valid business email address.',
      ko: '올바른 이메일 주소를 입력해 주세요.',
      'zh-CN': '请输入有效的企业电子邮箱地址。',
    });
  }

  if (trimmedMessage.length < FIELD_LIMITS.messageMin) {
    fieldErrors.message = pickLocale(locale, {
      vi: 'Vui lòng nhập nội dung yêu cầu (tối thiểu 5 ký tự).',
      en: 'Please provide your inquiry details (at least 5 characters).',
      ko: '문의 내용을 최소 5자 이상 입력해 주세요.',
      'zh-CN': '请填写至少 5 个字符的详细需求说明。',
    });
  }

  const ordered = [fieldErrors.fullName, fieldErrors.email, fieldErrors.message].filter(Boolean) as string[];
  return {
    valid: ordered.length === 0,
    fieldErrors,
    summaryError: ordered.join(' '),
  };
}
