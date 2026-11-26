import { isValidUrl } from './newsSchema.js';

export interface CompanySettings {
  company_name_vi: string;
  company_name_en: string;
  tax_id: string;
  address_vi: string;
  address_en: string;
  address_ko?: string;
  address_zh?: string;
  legal_rep_vi?: string;
  intro_vi?: string;
  intro_en?: string;
  intro_ko?: string;
  intro_zh?: string;
  hotline: string;
  email: string;
  website: string;
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

export function validateCompanySettings(input: unknown): { valid: boolean; errors: string[]; data: CompanySettings } {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

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
  const email = typeof raw.email === 'string' && raw.email.trim() ? raw.email.trim() : 'cuonghoang0710@gmail.com';
  const website = typeof raw.website === 'string' && isValidUrl(raw.website, false) ? raw.website.trim() : 'https://www.vinaxo.net';

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
      ...(typeof raw.intro_vi === 'string' && raw.intro_vi.trim() ? { intro_vi: raw.intro_vi.trim() } : {}),
      ...(typeof raw.intro_en === 'string' && raw.intro_en.trim() ? { intro_en: raw.intro_en.trim() } : {}),
      ...(typeof raw.intro_ko === 'string' && raw.intro_ko.trim() ? { intro_ko: raw.intro_ko.trim() } : {}),
      ...(typeof raw.intro_zh === 'string' && raw.intro_zh.trim() ? { intro_zh: raw.intro_zh.trim() } : {}),
      hotline,
      email,
      website
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
