import { getProductLocalized, productsData, type ProductItem } from '../../data/products';
import { pickLocale, type Language } from '../../i18n/localize';

export type RequestType = 'contact' | 'quotation';

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
  productName?: string;
  product?: string;
  quantity?: string;
  volume?: string;
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

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const FIELD_LIMITS = {
  fullNameMin: 2,
  fullNameMax: 100,
  emailMax: 120,
  phoneMax: 30,
  companyMax: 150,
  countryMax: 100,
  quantityMax: 200,
  messageMin: 5,
  messageMax: 3000,
} as const;

export function resolveCanonicalProduct(raw?: string): {
  productId: string;
  customLabel: string;
  matchedProduct?: ProductItem;
} {
  if (!raw || !raw.trim()) {
    return { productId: '', customLabel: '' };
  }

  const needle = raw.trim().toLowerCase();
  const matched = productsData.find(
    (p) =>
      p.slug.toLowerCase() === needle ||
      p.id.toLowerCase() === needle ||
      p.name.toLowerCase() === needle ||
      p.nameVi.toLowerCase() === needle ||
      p.nameKo?.toLowerCase() === needle ||
      p.nameZh?.toLowerCase() === needle ||
      p.en?.name?.toLowerCase() === needle ||
      p.vi?.name?.toLowerCase() === needle ||
      p.ko?.name?.toLowerCase() === needle ||
      p.zh?.name?.toLowerCase() === needle ||
      p.aliases?.some((a) => a.toLowerCase() === needle)
  );

  if (matched) {
    return { productId: matched.slug, customLabel: '', matchedProduct: matched };
  }

  if (needle === OEM_PRODUCT_ID || needle.includes('oem') || needle.includes('private label')) {
    return { productId: OEM_PRODUCT_ID, customLabel: '' };
  }

  if (
    needle === VALUE_ADDED_PRODUCT_ID ||
    needle.includes('honey') ||
    needle.includes('granola') ||
    needle.includes('chocolate')
  ) {
    return { productId: VALUE_ADDED_PRODUCT_ID, customLabel: '' };
  }

  return { productId: '', customLabel: raw.trim() };
}

export function getLocalizedProductLabel(productId: string, customLabel: string, locale: Language): string {
  if (productId === VALUE_ADDED_PRODUCT_ID) {
    return pickLocale(locale, {
      vi: 'Trái cây sấy tẩm mật ong / Phủ Sô-cô-la / Granola',
      en: 'Honey-Infused & Chocolate-Dipped / Granola',
      ko: '천연 벌꿀 인퓨즈드 / 초콜릿 디핑 / 그래놀라',
      'zh-CN': '蜂蜜浸渍果干 / 巧克力蘸酱果干 / 格兰诺拉麦片',
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
