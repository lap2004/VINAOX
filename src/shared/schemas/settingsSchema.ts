import { isValidUrl } from './newsSchema.js';
import { normalizeExternalWebsiteUrl } from '../../config/siteConfig.js';

export interface CompanySettings {
  company_name_vi: string;
  company_name_en: string;
  tax_id: string;
  address_vi: string;
  address_en: string;
  address_ko?: string;
  address_zh?: string;
  legal_rep_vi?: string;
  factory_name_vi?: string;
  factory_name_en?: string;
  latitude?: number;
  longitude?: number;
  google_place_id?: string;
  intro_vi?: string;
  intro_en?: string;
  intro_ko?: string;
  intro_zh?: string;
  hotline: string;
  email: string;
  sales_email?: string;
  website: string;
  whatsapp?: string;
  zalo?: string;
}

export interface BrochureSettings {
  pdf_file: string;
  pdf_file_vi?: string;
  pdf_file_en?: string;
  pdf_file_ko?: string;
  pdf_file_zh?: string;
  year: string;
  title_vi: string;
  title_en: string;
  title_ko?: string;
  title_zh?: string;
  download_enabled?: boolean;
}

function sanitizeEnglishCompanyName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || /VINAXO\s+COMPANY\s+LIMITED\s*\(.*Vinaxo/i.test(trimmed)) {
    return 'VINAXO COMPANY LIMITED';
  }
  return trimmed;
}

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORBIDDEN_SECRET_KEYS = ['password', 'smtp_pass', 'smtp_password', 'api_key', 'resend_api_key', 'brevo_api_key', 'secret'];

export function validateCompanySettings(input: unknown): { valid: boolean; errors: string[]; data: CompanySettings } {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  for (const forbidden of FORBIDDEN_SECRET_KEYS) {
    if (Object.prototype.hasOwnProperty.call(raw, forbidden)) {
      errors.push(`Không được phép lưu trường nhạy cảm (${forbidden}) trong cấu hình công khai.`);
    }
  }

  const company_name_vi = typeof raw.company_name_vi === 'string' && raw.company_name_vi.trim()
    ? raw.company_name_vi.trim()
    : 'CÔNG TY TNHH VINAXO';
  const company_name_en = typeof raw.company_name_en === 'string' && raw.company_name_en.trim()
    ? sanitizeEnglishCompanyName(raw.company_name_en)
    : 'VINAXO COMPANY LIMITED';
  const tax_id = typeof raw.tax_id === 'string' && raw.tax_id.trim() ? raw.tax_id.trim() : '1201611681';
  const address_vi = typeof raw.address_vi === 'string' && raw.address_vi.trim()
    ? raw.address_vi.trim()
    : 'Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam';
  const address_en = typeof raw.address_en === 'string' && raw.address_en.trim()
    ? raw.address_en.trim()
    : 'Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam';
  const hotline = typeof raw.hotline === 'string' && raw.hotline.trim() ? raw.hotline.trim() : '(+84) 984 815 016';

  let email = 'cuonghoang0710@gmail.com';
  if (raw.email !== undefined && raw.email !== null) {
    const trimmedEmail = typeof raw.email === 'string' ? raw.email.trim() : '';
    if (!trimmedEmail || !EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
      errors.push('Email liên hệ công khai không đúng định dạng (ví dụ: sales@vinaxo.net).');
    } else {
      email = trimmedEmail;
    }
  }

  let sales_email: string | undefined = undefined;
  if (typeof raw.sales_email === 'string' && raw.sales_email.trim()) {
    const trimmedSales = raw.sales_email.trim();
    if (!EMAIL_FORMAT_REGEX.test(trimmedSales)) {
      errors.push('Email bộ phận kinh doanh (sales_email) không đúng định dạng.');
    } else {
      sales_email = trimmedSales;
    }
  }

  const website = normalizeExternalWebsiteUrl(
    typeof raw.website === 'string' ? raw.website : 'https://www.vinaxo.net/'
  );

  let latitude = 10.380295;
  if (raw.latitude !== undefined && raw.latitude !== null && String(raw.latitude).trim() !== '') {
    const parsedLat = Number(raw.latitude);
    if (!Number.isFinite(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      errors.push('Vĩ độ (latitude) không hợp lệ (yêu cầu số từ -90 đến 90).');
    } else {
      latitude = Number(parsedLat.toFixed(6));
    }
  }

  let longitude = 106.516139;
  if (raw.longitude !== undefined && raw.longitude !== null && String(raw.longitude).trim() !== '') {
    const parsedLng = Number(raw.longitude);
    if (!Number.isFinite(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      errors.push('Kinh độ (longitude) không hợp lệ (yêu cầu số từ -180 đến 180).');
    } else {
      longitude = Number(parsedLng.toFixed(6));
    }
  }

  const factory_name_vi = typeof raw.factory_name_vi === 'string' && raw.factory_name_vi.trim()
    ? raw.factory_name_vi.trim()
    : 'Nhà Máy Chế Biến VINAXO';
  const factory_name_en = typeof raw.factory_name_en === 'string' && raw.factory_name_en.trim()
    ? raw.factory_name_en.trim()
    : 'VINAXO Processing Plant';
  const google_place_id = typeof raw.google_place_id === 'string' ? raw.google_place_id.trim() : '';
  const whatsapp = typeof raw.whatsapp === 'string' && isValidUrl(raw.whatsapp, false)
    ? raw.whatsapp.trim()
    : 'https://wa.me/84984815016';
  const zalo = typeof raw.zalo === 'string' && isValidUrl(raw.zalo, false)
    ? raw.zalo.trim()
    : 'https://zalo.me/0984815016';

  return {
    valid: errors.length === 0,
    errors,
    data: {
      company_name_vi,
      company_name_en,
      tax_id,
      address_vi,
      address_en,
      ...(typeof raw.address_ko === 'string' && raw.address_ko.trim() ? { address_ko: raw.address_ko.trim() } : {}),
      ...(typeof raw.address_zh === 'string' && raw.address_zh.trim() ? { address_zh: raw.address_zh.trim() } : {}),
      ...(typeof raw.legal_rep_vi === 'string' && raw.legal_rep_vi.trim() ? { legal_rep_vi: raw.legal_rep_vi.trim() } : {}),
      factory_name_vi,
      factory_name_en,
      latitude,
      longitude,
      google_place_id,
      ...(typeof raw.intro_vi === 'string' && raw.intro_vi.trim() ? { intro_vi: raw.intro_vi.trim() } : {}),
      ...(typeof raw.intro_en === 'string' && raw.intro_en.trim() ? { intro_en: raw.intro_en.trim() } : {}),
      ...(typeof raw.intro_ko === 'string' && raw.intro_ko.trim() ? { intro_ko: raw.intro_ko.trim() } : {}),
      ...(typeof raw.intro_zh === 'string' && raw.intro_zh.trim() ? { intro_zh: raw.intro_zh.trim() } : {}),
      hotline,
      email,
      ...(sales_email ? { sales_email } : {}),
      website,
      whatsapp,
      zalo,
    }
  };
}

function sanitizePdfField(val: unknown): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  if (!trimmed || !isValidUrl(trimmed, true) || !trimmed.toLowerCase().endsWith('.pdf')) return undefined;
  return trimmed;
}

export function validateBrochureSettings(input: unknown): { valid: boolean; errors: string[]; data: BrochureSettings } {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  const pdf_file = sanitizePdfField(raw.pdf_file) || '/brochures/vinaxo-company-brochure-2026.pdf';
  const pdf_file_vi = sanitizePdfField(raw.pdf_file_vi);
  const pdf_file_en = sanitizePdfField(raw.pdf_file_en) || pdf_file;
  const pdf_file_ko = sanitizePdfField(raw.pdf_file_ko);
  const pdf_file_zh = sanitizePdfField(raw.pdf_file_zh);

  const year = typeof raw.year === 'string' && /^\d{4}$/.test(raw.year.trim()) ? raw.year.trim() : '2026';
  const title_vi = typeof raw.title_vi === 'string' && raw.title_vi.trim() ? raw.title_vi.trim() : 'Hồ Sơ Năng Lực & Brochure VINAXO 2026';
  const title_en = typeof raw.title_en === 'string' && raw.title_en.trim() ? raw.title_en.trim() : 'VINAXO Company Profile & Brochure 2026';
  const title_ko = typeof raw.title_ko === 'string' && raw.title_ko.trim() ? raw.title_ko.trim() : undefined;
  const title_zh = typeof raw.title_zh === 'string' && raw.title_zh.trim() ? raw.title_zh.trim() : undefined;

  return {
    valid: errors.length === 0,
    errors,
    data: {
      pdf_file,
      ...(pdf_file_vi ? { pdf_file_vi } : {}),
      pdf_file_en,
      ...(pdf_file_ko ? { pdf_file_ko } : {}),
      ...(pdf_file_zh ? { pdf_file_zh } : {}),
      year,
      title_vi,
      title_en,
      ...(title_ko ? { title_ko } : {}),
      ...(title_zh ? { title_zh } : {}),
      download_enabled: raw.download_enabled !== undefined ? Boolean(raw.download_enabled) : true,
    }
  };
}
