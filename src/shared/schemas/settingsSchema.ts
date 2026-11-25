import { isValidUrl } from './newsSchema.js';

export interface CompanySettings {
  company_name_vi: string;
  company_name_en: string;
  tax_id: string;
  address_vi: string;
  address_en: string;
  hotline: string;
  email: string;
  website: string;
}

export interface BrochureSettings {
  pdf_file: string;
  year: string;
  title_vi: string;
  title_en: string;
}

export function validateCompanySettings(input: unknown): { valid: boolean; errors: string[]; data: CompanySettings } {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  const company_name_vi = typeof raw.company_name_vi === 'string' && raw.company_name_vi.trim()
    ? raw.company_name_vi.trim()
    : 'CÔNG TY TNHH VINAXO';
  const company_name_en = typeof raw.company_name_en === 'string' && raw.company_name_en.trim()
    ? raw.company_name_en.trim()
    : 'VINAXO COMPANY LIMITED';
  const tax_id = typeof raw.tax_id === 'string' ? raw.tax_id.trim() : '1402230784';
  const address_vi = typeof raw.address_vi === 'string' ? raw.address_vi.trim() : 'Tổ 24, Ấp Vĩnh Bình, Xã An Nhơn, Huyện Châu Thành, Tỉnh Đồng Tháp';
  const address_en = typeof raw.address_en === 'string' ? raw.address_en.trim() : 'Vinh Binh Hamlet, An Nhon Commune, Chau Thanh District, Dong Thap Province, Vietnam';
  const hotline = typeof raw.hotline === 'string' ? raw.hotline.trim() : '(+84) 922 222 247';
  const email = typeof raw.email === 'string' ? raw.email.trim() : 'cuonghoang0710@gmail.com';
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
      hotline,
      email,
      website
    }
  };
}

export function validateBrochureSettings(input: unknown): { valid: boolean; errors: string[]; data: BrochureSettings } {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  let pdf_file = typeof raw.pdf_file === 'string' ? raw.pdf_file.trim() : '';
  if (!pdf_file || !isValidUrl(pdf_file, true) || !pdf_file.toLowerCase().endsWith('.pdf')) {
    pdf_file = '/brochures/vinaxo-company-brochure-2026.pdf';
  }

  const year = typeof raw.year === 'string' && /^\d{4}$/.test(raw.year.trim()) ? raw.year.trim() : '2026';
  const title_vi = typeof raw.title_vi === 'string' ? raw.title_vi.trim() : 'Hồ Sơ Doanh Nghiệp & Năng Lực Sản Xuất VINAXO';
  const title_en = typeof raw.title_en === 'string' ? raw.title_en.trim() : 'VINAXO Corporate Profile & Manufacturing Capabilities';

  return {
    valid: errors.length === 0,
    errors,
    data: {
      pdf_file,
      year,
      title_vi,
      title_en
    }
  };
}
