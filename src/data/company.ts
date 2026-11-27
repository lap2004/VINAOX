import {
  getWebsiteDisplayLabel,
  normalizeExternalWebsiteUrl,
  SITE_CONFIG,
} from '../config/siteConfig.js';
import { Language, pickLocale } from '../i18n/localize.js';

export interface FactoryLocation {
  nameVi: string;
  nameEn: string;
  addressVi: string;
  addressEn: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface LeadershipMember {
  name: string;
  titleVi: string;
  titleEn: string;
  titleKo?: string;
  titleZh?: string;
  honorVi?: string;
  spokespersonFor?: string;
}

export interface CompanyInfo {
  legalNameVi: string;
  legalNameEn: string;
  shortName: string;
  brandName: string;
  taxCode: string;
  foundingYear: number;
  incorporatedDate: string;
  headquarters: {
    addressVi: string;
    addressEn: string;
    addressKo: string;
    addressZh: string;
    sourcingHubVi: string;
    sourcingHubEn: string;
    sourcingHubKo: string;
    sourcingHubZh: string;
  };
  intro: {
    vi: string;
    en: string;
    ko: string;
    zh: string;
  };
  facility: {
    area: string;
    investment: string;
    capacityMonthlyRaw: string;
    capacityMonthlyFinished: string;
    monthlyOutput: string;
    moq: string;
    leadTime: string;
    ratio: string;
    technology: string;
  };
  leadership: LeadershipMember[];
  contacts: {
    hotline: string;
    phoneDisplay: string;
    secondaryHotline: string;
    email: string;
    secondaryEmail: string;
    website: string;
    websiteDisplay: string;
    whatsapp: string;
    zalo: string;
  };
  location: FactoryLocation;
  auditStatus: {
    lastAudited: string;
    verifiedBy: string;
    reportFile: string;
  };
}

/**
 * Strips accidental parenthetical duplication such as "VINAXO COMPANY LIMITED (Vinaxo Co., Ltd.)"
 * so legal entity names remain clean and canonical across Footer, Contact, and SEO schemas.
 */
export function sanitizeEnglishLegalName(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return 'VINAXO COMPANY LIMITED';
  const cleaned = raw
    .replace(/\s*\(Vinaxo Co\.,?\s*Ltd\.?\)\s*/gi, '')
    .trim();
  return cleaned || 'VINAXO COMPANY LIMITED';
}

const BASE_COMPANY_INFO: CompanyInfo = {
  legalNameVi: 'CÔNG TY TNHH VINAXO',
  legalNameEn: 'VINAXO COMPANY LIMITED',
  shortName: 'Vinaxo Co., Ltd.',
  brandName: 'VINAXO',
  taxCode: '1201611681',
  foundingYear: 2018,
  incorporatedDate: '27/08/2019',
  headquarters: {
    addressVi: 'Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam',
    addressEn: 'Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam',
    addressKo: '베트남 동탑성 빈빈면 5구역 (Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam)',
    addressZh: '越南同塔省永平社第5区 (Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam)',
    sourcingHubVi: 'Đồng Tháp, Tiền Giang, Vĩnh Long (Đồng bằng Sông Cửu Long)',
    sourcingHubEn: 'Dong Thap, Tien Giang, Vinh Long (Mekong Delta Hub)',
    sourcingHubKo: '동탑성, 띠엔장성, 빈롱성 (메콩 델타 원료 허브)',
    sourcingHubZh: '同塔省、前江省、永隆省（湄公河三角洲核心产区）',
  },
  intro: {
    vi: 'Công ty TNHH VINAXO hoạt động trong lĩnh vực chế biến trái cây sấy và nông sản Việt Nam, cung cấp sản phẩm cho thị trường trong nước và quốc tế, hướng đến chất lượng và hợp tác bền vững.',
    en: 'VINAXO COMPANY LIMITED specializes in processed Vietnamese agricultural products and tropical dried fruits, serving domestic and international B2B markets with strict food safety and long-term partnerships.',
    ko: 'VINAXO COMPANY LIMITED는 베트남 열대 건조 과일 및 농산물 가공·수출 전문 기업으로, 글로벌 기준의 식품 안전과 지속 가능한 B2B 파트너십을 제공합니다.',
    zh: 'VINAXO COMPANY LIMITED 专注于越南热带果干及农产品加工与出口，严守国际食品安全标准，为全球客户提供稳定供应与长期B2B合作。',
  },
  facility: {
    area: '25,000 m²',
    investment: '15 tỷ VNĐ (giai đoạn đầu)',
    capacityMonthlyRaw: '1,000+ tấn trái cây tươi / tháng',
    capacityMonthlyFinished: '300 tấn thành phẩm / tháng',
    monthlyOutput: '300 t',
    moq: '200 kg',
    leadTime: '2–4 weeks',
    ratio: '10 kg trái cây tươi qua sấy cho ra 1 kg thành phẩm sấy dẻo hảo hạng',
    technology: 'Sấy dẻo nhiệt thấp (~60°C), sấy thăng hoa, chiên sấy chân không & máy ly tâm tách dầu',
  },
  leadership: [
    {
      name: 'Nguyễn Anh Khoa',
      titleVi: 'Giám đốc điều hành & Đại diện pháp luật',
      titleEn: 'Managing Director & Legal Representative',
      titleKo: '대표이사 및 법적 대표자',
      titleZh: '董事总经理兼法定代表人',
      honorVi: "Danh hiệu 'Nông dân sản xuất, kinh doanh giỏi' cấp tỉnh (UBND tỉnh trao tặng)",
    },
    {
      name: 'Hoàng Thị Thu Thảo',
      titleVi: 'Đồng sáng lập & Phó Giám đốc / Tổng Giám đốc',
      titleEn: 'Co-Founder & Deputy / General Director',
      titleKo: '공동 창업자 및 부사장 / 총괄 디렉터',
      titleZh: '联合创始人兼副总经理',
      honorVi: "Giải Nhì cuộc thi 'Ý tưởng sáng tạo khởi nghiệp cấp tỉnh' (Hội LHPN tỉnh trao tặng)",
    },
    {
      name: 'Hoàng Mạnh Cường',
      titleVi: 'Giám đốc kinh doanh',
      titleEn: 'Commercial & Business Director',
      titleKo: '영업 및 수출 총괄 이사',
      titleZh: '商务与出口总监',
      spokespersonFor: 'Đại diện phát ngôn trên Báo Người Lao Động, CafeF, 24H, SGGP',
    },
  ],
  contacts: {
    hotline: '+84984815016',
    phoneDisplay: '(+84) 984 815 016',
    secondaryHotline: '+84 907 494 177',
    email: 'cuonghoang0710@gmail.com',
    secondaryEmail: 'thaovinaxo@gmail.com',
    website: `${SITE_CONFIG.siteUrl}/`,
    websiteDisplay: 'www.vinaxo.net',
    whatsapp: 'https://wa.me/84984815016',
    zalo: 'https://zalo.me/0984815016',
  },
  location: {
    nameVi: 'Nhà Máy Chế Biến VINAXO',
    nameEn: 'VINAXO Processing Plant',
    addressVi: 'Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam',
    addressEn: 'Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam',
    latitude: 10.380295,
    longitude: 106.516139,
    placeId: '',
  },
  auditStatus: {
    lastAudited: '2026-11-26',
    verifiedBy: 'Vinaxo Brochure 2026 & Corporate Verification',
    reportFile: 'VINAXO_CONTENT_AUDIT.md',
  },
};

let companyCmsModules: Record<string, any> = {};
try {
  companyCmsModules = (import.meta as any).glob('/content/settings/company.json', { eager: true });
} catch {
  companyCmsModules = {};
}
const rawCmsCompany = Object.values(companyCmsModules)[0] as any;
const cmsComp = rawCmsCompany?.default || rawCmsCompany || {};

export const COMPANY_INFO: CompanyInfo = {
  ...BASE_COMPANY_INFO,
  legalNameVi: (typeof cmsComp.company_name_vi === 'string' && cmsComp.company_name_vi.trim()) || BASE_COMPANY_INFO.legalNameVi,
  legalNameEn: sanitizeEnglishLegalName(cmsComp.company_name_en || BASE_COMPANY_INFO.legalNameEn),
  taxCode: cmsComp.tax_id || BASE_COMPANY_INFO.taxCode,
  headquarters: {
    ...BASE_COMPANY_INFO.headquarters,
    addressVi: cmsComp.address_vi || BASE_COMPANY_INFO.headquarters.addressVi,
    addressEn: cmsComp.address_en || BASE_COMPANY_INFO.headquarters.addressEn,
    addressKo: cmsComp.address_ko || BASE_COMPANY_INFO.headquarters.addressKo,
    addressZh: cmsComp.address_zh || BASE_COMPANY_INFO.headquarters.addressZh,
  },
  intro: {
    vi: cmsComp.intro_vi || BASE_COMPANY_INFO.intro.vi,
    en: cmsComp.intro_en || BASE_COMPANY_INFO.intro.en,
    ko: cmsComp.intro_ko || BASE_COMPANY_INFO.intro.ko,
    zh: cmsComp.intro_zh || BASE_COMPANY_INFO.intro.zh,
  },
  contacts: {
    ...BASE_COMPANY_INFO.contacts,
    hotline: cmsComp.hotline || BASE_COMPANY_INFO.contacts.hotline,
    phoneDisplay: cmsComp.hotline || BASE_COMPANY_INFO.contacts.phoneDisplay,
    email: cmsComp.email || BASE_COMPANY_INFO.contacts.email,
    secondaryEmail: cmsComp.sales_email || BASE_COMPANY_INFO.contacts.secondaryEmail,
    website: normalizeExternalWebsiteUrl(cmsComp.website || BASE_COMPANY_INFO.contacts.website),
    websiteDisplay: getWebsiteDisplayLabel(cmsComp.website || BASE_COMPANY_INFO.contacts.website),
    whatsapp: normalizeExternalWebsiteUrl(cmsComp.whatsapp || BASE_COMPANY_INFO.contacts.whatsapp, BASE_COMPANY_INFO.contacts.whatsapp),
    zalo: normalizeExternalWebsiteUrl(cmsComp.zalo || BASE_COMPANY_INFO.contacts.zalo, BASE_COMPANY_INFO.contacts.zalo),
  },
  location: {
    nameVi: cmsComp.factory_name_vi || BASE_COMPANY_INFO.location.nameVi,
    nameEn: cmsComp.factory_name_en || BASE_COMPANY_INFO.location.nameEn,
    addressVi: cmsComp.address_vi || BASE_COMPANY_INFO.headquarters.addressVi,
    addressEn: cmsComp.address_en || BASE_COMPANY_INFO.headquarters.addressEn,
    latitude: Number.isFinite(Number(cmsComp.latitude)) ? Number(cmsComp.latitude) : BASE_COMPANY_INFO.location.latitude,
    longitude: Number.isFinite(Number(cmsComp.longitude)) ? Number(cmsComp.longitude) : BASE_COMPANY_INFO.location.longitude,
    placeId: typeof cmsComp.google_place_id === 'string' ? cmsComp.google_place_id.trim() : BASE_COMPANY_INFO.location.placeId,
  },
};

export function getFactoryName(language: Language, loc: FactoryLocation = COMPANY_INFO.location): string {
  return language === 'vi' ? loc.nameVi : loc.nameEn;
}

export function getGoogleMapsSearchUrl(loc: FactoryLocation = COMPANY_INFO.location): string {
  const coords = `${loc.latitude},${loc.longitude}`;
  const base = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`;
  return loc.placeId ? `${base}&query_place_id=${encodeURIComponent(loc.placeId)}` : base;
}

export function getGoogleMapsDirectionsUrl(loc: FactoryLocation = COMPANY_INFO.location): string {
  const coords = `${loc.latitude},${loc.longitude}`;
  const base = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coords)}`;
  return loc.placeId ? `${base}&destination_place_id=${encodeURIComponent(loc.placeId)}` : base;
}

export function getGoogleMapsEmbedUrl(
  loc: FactoryLocation = COMPANY_INFO.location,
  language: Language = 'vi'
): string {
  const hl = language === 'vi' ? 'vi' : language === 'ko' ? 'ko' : language === 'zh-CN' ? 'zh-CN' : 'en';
  const coords = `${loc.latitude},${loc.longitude}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(coords)}&hl=${encodeURIComponent(hl)}&z=15&output=embed`;
}

/**
 * Returns the single canonical corporate legal name for the active language.
 * Keeps official VINAXO COMPANY LIMITED for EN, KO, and ZH-CN to avoid unapproved translations or repetition.
 */
export function getLegalCompanyName(language: Language): string {
  return language === 'vi' ? COMPANY_INFO.legalNameVi : COMPANY_INFO.legalNameEn;
}

export function getCompanyAddress(language: Language): string {
  return pickLocale(language, {
    vi: COMPANY_INFO.headquarters.addressVi,
    en: COMPANY_INFO.headquarters.addressEn,
    ko: COMPANY_INFO.headquarters.addressKo,
    'zh-CN': COMPANY_INFO.headquarters.addressZh,
  });
}

export function getCompanySourcingHub(language: Language): string {
  return pickLocale(language, {
    vi: COMPANY_INFO.headquarters.sourcingHubVi,
    en: COMPANY_INFO.headquarters.sourcingHubEn,
    ko: COMPANY_INFO.headquarters.sourcingHubKo,
    'zh-CN': COMPANY_INFO.headquarters.sourcingHubZh,
  });
}

export function getCompanyIntro(language: Language): string {
  return pickLocale(language, {
    vi: COMPANY_INFO.intro.vi,
    en: COMPANY_INFO.intro.en,
    ko: COMPANY_INFO.intro.ko,
    'zh-CN': COMPANY_INFO.intro.zh,
  });
}
