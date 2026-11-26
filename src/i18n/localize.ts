export type Language = 'vi' | 'en' | 'ko' | 'zh-CN';

export interface LanguageOption {
  code: Language;
  shortLabel: string;
  nativeLabel: string;
  htmlLang: string;
  ogLocale: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'vi', shortLabel: 'VI', nativeLabel: 'Tiếng Việt', htmlLang: 'vi', ogLocale: 'vi_VN' },
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  { code: 'ko', shortLabel: 'KO', nativeLabel: '한국어', htmlLang: 'ko', ogLocale: 'ko_KR' },
  { code: 'zh-CN', shortLabel: 'ZH', nativeLabel: '简体中文', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
] as const;

export function normalizeLanguage(raw: unknown): Language | null {
  if (typeof raw !== 'string') return null;
  const val = raw.trim().toLowerCase();
  if (val === 'vi' || val === 'vn') return 'vi';
  if (val === 'en') return 'en';
  if (val === 'ko' || val === 'kr') return 'ko';
  if (val === 'zh-cn' || val === 'zh_cn' || val === 'zh') return 'zh-CN';
  return null;
}

export interface LocaleVariants<T> {
  vi: T;
  en?: T;
  ko?: T;
  zh?: T;
  'zh-CN'?: T;
}

/**
 * Selects the localized value for the active language without ever returning undefined.
 * Fallback order:
 *   vi    -> vi -> en
 *   en    -> en -> vi
 *   ko    -> ko -> en -> vi
 *   zh-CN -> zh-CN/zh -> en -> vi
 */
export function pickLocale<T>(language: Language, variants: LocaleVariants<T>): T {
  const isFilled = (v: T | undefined): v is T => {
    if (v === undefined || v === null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    return true;
  };

  if (language === 'vi') {
    return isFilled(variants.vi) ? variants.vi : (variants.en as T);
  }
  if (language === 'en') {
    return isFilled(variants.en) ? variants.en : variants.vi;
  }
  if (language === 'ko') {
    if (isFilled(variants.ko)) return variants.ko;
    if (isFilled(variants.en)) return variants.en;
    return variants.vi;
  }
  const zhVal = variants['zh-CN'] !== undefined ? variants['zh-CN'] : variants.zh;
  if (isFilled(zhVal)) return zhVal;
  if (isFilled(variants.en)) return variants.en;
  return variants.vi;
}
