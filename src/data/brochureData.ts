import type { Language } from '../i18n/localize';

/**
 * Shared immutable metadata and verified public URLs for the official 2026 Company Brochure PDF.
 */
let brochureCmsModules: Record<string, any> = {};
try {
  brochureCmsModules = (import.meta as any).glob('/content/settings/brochure.json', { eager: true });
} catch {
  brochureCmsModules = {};
}
const rawCmsBrochure = Object.values(brochureCmsModules)[0] as any;
const cmsBrochure = rawCmsBrochure?.default || rawCmsBrochure || {};

let certsCmsModules: Record<string, any> = {};
try {
  certsCmsModules = (import.meta as any).glob('/content/settings/certificates.json', { eager: true });
} catch {
  certsCmsModules = {};
}
const rawCmsCerts = Object.values(certsCmsModules)[0] as any;
const cmsCertsList = (rawCmsCerts?.default || rawCmsCerts) as ComplianceBadge[] | undefined;

export const BROCHURE_DOCUMENT = {
  pdfUrl: cmsBrochure.pdf_file || '/brochures/vinaxo-company-brochure-2026.pdf',
  pdfUrlByLang: {
    vi: cmsBrochure.pdf_file_vi || '',
    en: cmsBrochure.pdf_file_en || cmsBrochure.pdf_file || '/brochures/vinaxo-company-brochure-2026.pdf',
    ko: cmsBrochure.pdf_file_ko || '',
    'zh-CN': cmsBrochure.pdf_file_zh || '',
  },
  titleByLang: {
    vi: cmsBrochure.title_vi || 'Hồ Sơ Năng Lực & Brochure VINAXO 2026',
    en: cmsBrochure.title_en || 'VINAXO Company Profile & Brochure 2026',
    ko: cmsBrochure.title_ko || 'VINAXO 기업 소개서 및 브로슈어 2026',
    'zh-CN': cmsBrochure.title_zh || 'VINAXO 公司简介与产品手册 2026',
  },
  downloadFilename: 'Vinaxo-Company-Brochure-2026.pdf',
  coverWebp: '/assets/images/brochure-2026-cover.webp',
  coverJpg: '/assets/images/brochure-2026-cover.jpg',
  totalPages: 4,
  edition: cmsBrochure.year || '2026',
  format: 'PDF',
} as const;

export function resolveBrochureDocumentForLang(lang: Language) {
  const nativeUrl = BROCHURE_DOCUMENT.pdfUrlByLang[lang];
  const hasNativePdf = Boolean(nativeUrl && typeof nativeUrl === 'string' && nativeUrl.trim().length > 0);
  const pdfUrl = hasNativePdf ? nativeUrl : BROCHURE_DOCUMENT.pdfUrl;
  const title = BROCHURE_DOCUMENT.titleByLang[lang] || BROCHURE_DOCUMENT.titleByLang.en;

  const fallbackMeta: Record<Language, { badge: string; notice: string }> = {
    vi: {
      badge: 'Phiên bản PDF tiếng Anh (2026)',
      notice: 'Tài liệu Brochure PDF gốc phát hành song song cho đối tác xuất khẩu hiện sử dụng phiên bản tiếng Anh chính thức (2026); toàn bộ thông tin trên trang này được hiển thị đầy đủ bằng tiếng Việt.'
    },
    en: {
      badge: 'Official English PDF (2026)',
      notice: ''
    },
    ko: {
      badge: '영문 공식 PDF (2026년판)',
      notice: '다운로드 가능한 공식 PDF 브로슈어는 국제 바이어용 영문판(2026)으로 제공되며, 본 웹페이지에서 한국어 전체 안내를 확인하실 수 있습니다.'
    },
    'zh-CN': {
      badge: '英文官方 PDF 版（2026）',
      notice: '当前提供的可下载 PDF 手册为国际采购商通用英文版（2026）；本网页已为您完整呈现简体中文版企业与产品介绍。'
    }
  };

  return {
    pdfUrl,
    title,
    hasNativePdf,
    activePdfLanguage: hasNativePdf ? lang : ('en' as const),
    badgeLabel: hasNativePdf ? '' : fallbackMeta[lang].badge,
    noticeText: hasNativePdf ? '' : fallbackMeta[lang].notice,
    edition: BROCHURE_DOCUMENT.edition,
    totalPages: BROCHURE_DOCUMENT.totalPages
  };
}

export interface BrochurePageAsset {
  pageNumber: number;
  webp: string;
  jpg: string;
  width: number;
  height: number;
  titleEn: string;
  titleVi: string;
  titleKo: string;
  titleZh: string;
}

export const BROCHURE_PAGES: readonly BrochurePageAsset[] = [
  {
    pageNumber: 1,
    webp: '/brochures/pages/brochure-page-1.webp',
    jpg: '/brochures/pages/brochure-page-1.jpg',
    width: 1655,
    height: 2340,
    titleEn: 'Page 1 — Company Cover',
    titleVi: 'Trang 1 — Trang bìa giới thiệu',
    titleKo: '1페이지 — 기업 소개 표지',
    titleZh: '第 1 页 — 企业简介封面',
  },
  {
    pageNumber: 2,
    webp: '/brochures/pages/brochure-page-2.webp',
    jpg: '/brochures/pages/brochure-page-2.jpg',
    width: 1655,
    height: 2340,
    titleEn: 'Page 2 — Product Range',
    titleVi: 'Trang 2 — Danh mục sản phẩm',
    titleKo: '2페이지 — 주요 제품 라인업',
    titleZh: '第 2 页 — 核心产品系列',
  },
  {
    pageNumber: 3,
    webp: '/brochures/pages/brochure-page-3.webp',
    jpg: '/brochures/pages/brochure-page-3.jpg',
    width: 1655,
    height: 2340,
    titleEn: 'Page 3 — About VINAXO / Factory',
    titleVi: 'Trang 3 — Giới thiệu & Nhà máy',
    titleKo: '3페이지 — VINAXO 소개 및 공장 현황',
    titleZh: '第 3 页 — 关于 VINAXO 与工厂实力',
  },
  {
    pageNumber: 4,
    webp: '/brochures/pages/brochure-page-4.webp',
    jpg: '/brochures/pages/brochure-page-4.jpg',
    width: 1655,
    height: 2340,
    titleEn: 'Page 4 — Certifications / Contact',
    titleVi: 'Trang 4 — Chứng nhận & Liên hệ',
    titleKo: '4페이지 — 인증 현황 및 연락처',
    titleZh: '第 4 页 — 资质认证与联系方式',
  },
] as const;

export interface ComplianceBadge {
  id: string;
  pillLabel: string;
  name: string;
  nameVi?: string;
  nameEn?: string;
  nameKo?: string;
  nameZh?: string;
  kindEn: 'Certification' | 'Registration' | 'Audit';
  kindVi: 'Chứng nhận' | 'Đăng ký' | 'Kiểm toán';
  kindKo?: string;
  kindZh?: string;
  scopeEn: string;
  scopeVi: string;
  scopeKo?: string;
  scopeZh?: string;
  isFeaturedRed?: boolean;
  certImageWebp?: string;
  certImageJpg?: string;
  isHalalPlaceholder?: boolean;
}

/**
 * Official 8 compliance pillars & certificates from Vinaxo Brochure 2026 (Pages 1 & 4).
 * Distinguishes Certifications, Governmental Registrations, and Retail/Ethical Audits cleanly.
 */
const BASE_COMPLIANCE_ITEMS: ComplianceBadge[] = [
  {
    id: 'brcgs',
    pillLabel: 'BRCGS',
    name: 'BRCGS Food Safety',
    nameVi: 'Tiêu chuẩn An toàn Thực phẩm Toàn cầu BRCGS',
    nameEn: 'BRCGS Food Safety',
    nameKo: 'BRCGS 글로벌 식품안전 표준 (Grade B) 인증',
    nameZh: 'BRCGS 全球食品安全标准（B级）认证',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    kindKo: '인증',
    kindZh: '认证',
    scopeEn: 'SGS Global Standard Food Safety (Grade B)',
    scopeVi: 'Tiêu chuẩn An toàn Thực phẩm Toàn cầu SGS (Hạng B)',
    scopeKo: 'SGS 심사 글로벌 식품안전 표준 B등급(Grade B) 인증',
    scopeZh: 'SGS 审核通过的全球食品安全标准 B 级认证',
    isFeaturedRed: true,
    certImageWebp: '/assets/images/certs-2026/cert-brcgs.webp',
    certImageJpg: '/assets/images/certs-2026/cert-brcgs.jpg',
  },
  {
    id: 'fda',
    pillLabel: 'US FDA REGISTERED',
    name: 'US FDA Registered',
    nameVi: 'Đăng ký Cơ sở Thực phẩm FDA Hoa Kỳ',
    nameEn: 'US FDA Registered',
    nameKo: '미국 FDA 식품 시설 등록',
    nameZh: '美国 FDA 食品企业注册',
    kindEn: 'Registration',
    kindVi: 'Đăng ký',
    kindKo: '등록',
    kindZh: '注册',
    scopeEn: 'U.S. FDA Food Facility Registration',
    scopeVi: 'Đăng ký Cơ sở Thực phẩm với FDA Hoa Kỳ',
    scopeKo: '미국 FDA 수출용 식품 제조 시설 공식 등록',
    scopeZh: '美国 FDA 食品生产设施合规注册备案',
    certImageWebp: '/assets/images/certs-2026/cert-fda.webp',
    certImageJpg: '/assets/images/certs-2026/cert-fda.jpg',
  },
  {
    id: 'iso22000',
    pillLabel: 'ISO 22000',
    name: 'ISO 22000:2018',
    nameVi: 'Hệ thống Quản lý An toàn Thực phẩm ISO 22000:2018',
    nameEn: 'ISO 22000:2018',
    nameKo: 'ISO 22000:2018 식품안전경영시스템 인증',
    nameZh: 'ISO 22000:2018 食品安全管理体系认证',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    kindKo: '인증',
    kindZh: '认证',
    scopeEn: 'Food Safety Management System (TQC)',
    scopeVi: 'Hệ thống Quản lý An toàn Thực phẩm (TQC)',
    scopeKo: '식품안전경영시스템(TQC) 인증',
    scopeZh: '食品安全管理体系认证（TQC）',
    certImageWebp: '/assets/images/certs-2026/cert-iso22000.webp',
    certImageJpg: '/assets/images/certs-2026/cert-iso22000.jpg',
  },
  {
    id: 'haccp',
    pillLabel: 'HACCP',
    name: 'HACCP',
    nameVi: 'Hệ thống Phân tích Mối nguy & Điểm Kiểm soát Tới hạn HACCP',
    nameEn: 'HACCP',
    nameKo: 'HACCP 위해요소중점관리기준 인증',
    nameZh: 'HACCP 危害分析与关键控制点认证',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    kindKo: '인증',
    kindZh: '认证',
    scopeEn: 'Hazard Analysis & Critical Control Point (TQC)',
    scopeVi: 'Phân tích Mối nguy & Điểm Kiểm soát Tới hạn (TQC)',
    scopeKo: '위해요소중점관리기준(TQC) 인증',
    scopeZh: '危害分析与关键控制点认证（TQC）',
    certImageWebp: '/assets/images/certs-2026/cert-haccp.webp',
    certImageJpg: '/assets/images/certs-2026/cert-haccp.jpg',
  },
  {
    id: 'kosher',
    pillLabel: 'KOSHER OU',
    name: 'Kosher (OU)',
    nameVi: 'Chứng nhận Thực phẩm Kosher OU',
    nameEn: 'Kosher (OU)',
    nameKo: '코셔 OU(Orthodox Union) 인증',
    nameZh: '犹太洁食 Kosher OU 认证',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    kindKo: '인증',
    kindZh: '认证',
    scopeEn: 'Orthodox Union Kosher Certified',
    scopeVi: 'Chứng nhận Thực phẩm Kosher OU',
    scopeKo: 'Orthodox Union 코셔(Kosher) 인증',
    scopeZh: 'Orthodox Union 犹太洁食认证',
    certImageWebp: '/assets/images/certs-2026/cert-kosher-ou.webp',
    certImageJpg: '/assets/images/certs-2026/cert-kosher-ou.jpg',
  },
  {
    id: 'smeta',
    pillLabel: 'SMETA',
    name: 'SMETA Ethical Audit',
    nameVi: 'Kiểm toán Thương mại Đạo đức Sedex SMETA v6.1',
    nameEn: 'SMETA Ethical Audit',
    nameKo: 'Sedex SMETA 윤리적 무역 감사',
    nameZh: 'Sedex SMETA 商业道德审核',
    kindEn: 'Audit',
    kindVi: 'Kiểm toán',
    kindKo: '감사',
    kindZh: '审核',
    scopeEn: 'Sedex Members Ethical Trade Audit (v6.1)',
    scopeVi: 'Kiểm toán Thương mại Đạo đức Sedex SMETA v6.1',
    scopeKo: 'Sedex 회원사 윤리적 무역 감사(v6.1)',
    scopeZh: 'Sedex 商业道德贸易审核（v6.1）',
    certImageWebp: '/assets/images/certs-2026/cert-smeta.webp',
    certImageJpg: '/assets/images/certs-2026/cert-smeta.jpg',
  },
  {
    id: 'halal',
    pillLabel: 'HALAL',
    name: 'Halal Certified',
    nameVi: 'Chứng nhận Sản xuất Halal',
    nameEn: 'Halal Certified',
    nameKo: '할랄(Halal) 인증',
    nameZh: '清真 Halal 认证',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    kindKo: '인증',
    kindZh: '认证',
    scopeEn: 'Halal Production Compliance (Full copy on request)',
    scopeVi: 'Chứng nhận Sản xuất Halal (Bản sao cung cấp theo yêu cầu)',
    scopeKo: '할랄 생산 규격 준수 인증 (요청 시 사본 제공)',
    scopeZh: '符合清真生产规范认证（可应要求提供完整副本）',
    isHalalPlaceholder: true,
  },
  {
    id: 'costco',
    pillLabel: 'COSTCO GMP AUDIT',
    name: 'Costco GMP Audit',
    nameVi: 'Kiểm toán Thực hành Sản xuất Tốt Costco GMP',
    nameEn: 'Costco GMP Audit',
    nameKo: '코스트코(Costco) GMP 감사',
    nameZh: '开市客 Costco GMP 审核',
    kindEn: 'Audit',
    kindVi: 'Kiểm toán',
    kindKo: '감사',
    kindZh: '审核',
    scopeEn: 'Retail Supply Chain GMP Verification',
    scopeVi: 'Kiểm toán Thực hành Sản xuất Tốt Chuỗi Costco',
    scopeKo: '글로벌 유통망 우수제조관리기준(GMP) 감사 통과',
    scopeZh: '国际零售供应链 GMP 良好生产规范审核验证',
  },
];

const BASE_COMPLIANCE_MAP = new Map(BASE_COMPLIANCE_ITEMS.map((item) => [item.id, item]));

export const COMPLIANCE_ITEMS: ComplianceBadge[] = Array.isArray(cmsCertsList) && cmsCertsList.length > 0
  ? cmsCertsList.map((cmsItem) => {
      const base = BASE_COMPLIANCE_MAP.get(cmsItem.id);
      return { ...(base || {}), ...cmsItem };
    })
  : BASE_COMPLIANCE_ITEMS;

export function getComplianceLocalized(item: ComplianceBadge, lang: Language) {
  if (lang === 'vi') {
    return {
      name: item.nameVi || item.name,
      kind: item.kindVi,
      scope: item.scopeVi
    };
  }
  if (lang === 'ko') {
    return {
      name: item.nameKo || item.nameEn || item.name,
      kind: item.kindKo || (item.kindEn === 'Registration' ? '등록' : item.kindEn === 'Audit' ? '감사' : '인증'),
      scope: item.scopeKo || item.scopeEn
    };
  }
  if (lang === 'zh-CN') {
    return {
      name: item.nameZh || item.nameEn || item.name,
      kind: item.kindZh || (item.kindEn === 'Registration' ? '注册' : item.kindEn === 'Audit' ? '审核' : '认证'),
      scope: item.scopeZh || item.scopeEn
    };
  }
  return {
    name: item.nameEn || item.name,
    kind: item.kindEn,
    scope: item.scopeEn
  };
}

export interface BrochureCategory {
  id: string;
  imageWebp: string;
  imageJpg: string;
  titleEn: string;
  titleVi: string;
  titleKo?: string;
  titleZh?: string;
  summaryEn?: string;
  summaryVi?: string;
  descEn: string;
  descVi: string;
  descKo?: string;
  descZh?: string;
  noAddedSugarFlag?: boolean;
  varietiesEn?: string;
  varietiesVi?: string;
  varietiesKo?: string;
  varietiesZh?: string;
  highlightsEn: string[];
  highlightsVi: string[];
  highlightsKo?: string[];
  highlightsZh?: string[];
  catalogFilter?: 'soft-dried' | 'chips' | 'nuts-seeds' | 'mixed';
  isOemSpecialty?: boolean;
}

/**
 * Exact 6 Official Product Lines from Vinaxo Brochure 2026 (Page 2: OUR PRODUCT RANGE).
 * Uses verified high-resolution cohesive studio photography across all six families.
 */
export const BROCHURE_CATEGORIES: BrochureCategory[] = [
  {
    id: 'soft-dried-fruit',
    imageWebp: '/assets/images/hero_fruits.webp',
    imageJpg: '/assets/images/hero_fruits.jpg',
    titleEn: 'Soft Dried Fruit',
    titleVi: 'Trái Cây Sấy Dẻo',
    titleKo: '소프트 건조 과일',
    titleZh: '软烘干果系列',
    descEn: 'Gently air-dried for a tender, chewy bite and vivid natural colour.',
    descVi: 'Sấy nhẹ giữ nguyên cấu trúc dẻo mềm, vị ngọt thanh và màu sắc nhiệt đới rực rỡ tự nhiên.',
    descKo: '저온 순환 건조로 부드럽고 쫀득한 식감과 선명한 천연 색감을 살렸습니다.',
    descZh: '采用低温轻柔热风烘干，保留柔韧弹嫩口感与鲜亮天然热带色彩。',
    varietiesEn: 'Varieties: mango, jackfruit, pineapple, papaya, banana, guava, dragon fruit, passion fruit, young coconut.',
    varietiesVi: 'Các loại: xoài, mít, khóm (dứa), đu đủ, chuối, ổi, thanh long, chanh dây, dừa non.',
    varietiesKo: '취급 품목: 망고, 잭프루트, 파인애플, 파파야, 바나나, 구아바, 적색 용과, 패션프루트, 영 코코넛.',
    varietiesZh: '主要品种：芒果、菠萝蜜、菠萝、木瓜、香蕉、番石榴、红心火龙果、百香果、嫩椰子。',
    highlightsEn: ['Mango & Jackfruit', 'Pineapple & Papaya', 'Red Dragon Fruit', 'Passion Fruit & Coconut'],
    highlightsVi: ['Xoài & Mít', 'Thơm & Đu đủ', 'Thanh long đỏ', 'Chanh dây & Dừa non'],
    highlightsKo: ['망고 & 잭프루트', '파인애플 & 파파야', '적색 용과', '패션프루트 & 코코넛'],
    highlightsZh: ['芒果与菠萝蜜', '菠萝与木瓜', '红心火龙果', '百香果与嫩椰片'],
    catalogFilter: 'soft-dried',
  },
  {
    id: 'natural-dried-fruit',
    imageWebp: '/images/products/soft-dried-mango.webp',
    imageJpg: '/images/products/soft-dried-mango.jpg',
    titleEn: 'Natural Dried Fruit',
    titleVi: 'Trái Cây Sấy Tự Nhiên',
    titleKo: '내추럴 무가당 건조 과일',
    titleZh: '天然零加糖果干',
    noAddedSugarFlag: true,
    summaryEn: 'Ripe fruit dried in its own natural sweetness — nothing added, nothing taken away.',
    summaryVi: 'Trái cây chín tự nhiên được sấy nguyên bản — không thêm đường, không chất bảo quản.',
    descEn: 'Ripe fruit dried in its own natural sweetness — nothing added, nothing taken away. A clean-label choice for health-conscious shoppers.',
    descVi: 'Trái cây chín tự nhiên được sấy nguyên bản — không thêm đường, không phụ gia, lựa chọn nhãn sạch (Clean-Label) lý tưởng.',
    descKo: '잘 익은 과일 본연의 당도만으로 첨가물 없이 건조한 클린 라벨(Clean-Label) 건강 스낵입니다.',
    descZh: '严选自然熟鲜果原汁原味烘干，不添加蔗糖与任何辅料，契合清洁标签（Clean-Label）健康消费需求。',
    highlightsEn: ['100% Pure Fruit', 'Zero Added Sugar', 'Clean Label Choice', 'Chips & Natural Slices'],
    highlightsVi: ['100% Trái cây thuần', 'Không thêm đường', 'Chuẩn Nhãn Sạch', 'Sấy dẻo & giòn tự nhiên'],
    highlightsKo: ['100% 순수 원물 과일', '설탕 무첨가', '클린 라벨 규격', '칩 & 내추럴 슬라이스'],
    highlightsZh: ['100% 纯天然鲜果', '零额外加糖', '清洁标签优选', '脆片与原切果干'],
    catalogFilter: 'chips',
  },
  {
    id: 'honey-infused-dried-fruit',
    imageWebp: '/images/categories/honey-infused-fruit.webp',
    imageJpg: '/images/categories/honey-infused-fruit.jpg',
    titleEn: 'Honey-Infused Dried Fruit',
    titleVi: 'Trái Cây Sấy Tẩm Mật Ong',
    titleKo: '천연 벌꿀 인퓨즈드 건조 과일',
    titleZh: '天然蜂蜜浸渍果干',
    noAddedSugarFlag: true,
    descEn: 'Naturally dried fruit finished with pure honey for a gentle, well-rounded sweetness and a soft, glossy texture.',
    descVi: 'Trái cây sấy tự nhiên kết hợp cùng mật ong nguyên chất, tạo vị ngọt dịu thanh và độ bóng mềm hấp dẫn.',
    descKo: '자연 건조 과일에 순수 천연 벌꿀을 더해 은은한 단맛과 촉촉하고 윤기 있는 식감을 구현했습니다.',
    descZh: '天然果干搭配纯正蜂蜜工艺，呈现温润清甜风味与柔和亮泽质感。',
    highlightsEn: ['Pure Natural Honey', 'No Refined Sugar', 'Soft Glossy Finish', 'OEM Formulations'],
    highlightsVi: ['Mật ong nguyên chất', 'Không đường tinh luyện', 'Bề mặt dẻo óng mượt', 'Gia công OEM'],
    highlightsKo: ['순수 천연 벌꿀', '정제당 무첨가', '부드러운 글로시 식감', '맞춤형 OEM 배합'],
    highlightsZh: ['纯正天然蜂蜜', '零精制白糖', '柔润亮泽口感', '支持 OEM 定制配方'],
    isOemSpecialty: true,
  },
  {
    id: 'chocolate-dipped-dried-fruit',
    imageWebp: '/images/categories/chocolate-dipped-fruit.webp',
    imageJpg: '/images/categories/chocolate-dipped-fruit.jpg',
    titleEn: 'Chocolate-Dipped Dried Fruit',
    titleVi: 'Trái Cây Sấy Nhúng Sô-Cô-La',
    titleKo: '초콜릿 디핑 건조 과일',
    titleZh: '巧克力蘸酱热带果干',
    descEn: 'Tropical dried fruit half-dipped in smooth chocolate — an indulgent treat that pairs fruity tang with rich cocoa.',
    descVi: 'Lát trái cây nhiệt đới nhúng nửa sô-cô-la mịn màng — hòa quyện vị chua ngọt trái cây với hương ca cao đậm đà.',
    descKo: '부드러운 초콜릿에 절반을 디핑한 열대 건조 과일로 상큼한 과일 풍미와 진한 카카오가 조화를 이룹니다.',
    descZh: '热带果干半浸丝滑黑巧或牛奶巧克力，果酸清甜与醇厚可可风味交融。',
    highlightsEn: ['Half-Dipped Mango', 'Dark & Milk Cocoa', 'Retail Gift Packs', 'Private Label Ready'],
    highlightsVi: ['Xoài nhúng sô-cô-la', 'Cacao đen & sữa', 'Bao bì quà tặng', 'Gia công Nhãn riêng'],
    highlightsKo: ['하프 디핑 망고', '다크 & 밀크 카카오', '리테일 기프트 패키지', 'PB 자체 브랜드 생산'],
    highlightsZh: ['半蘸巧克力芒果干', '黑巧与牛奶可可', '零售礼盒包装', '支持自有品牌代工'],
    isOemSpecialty: true,
  },
  {
    id: 'fruit-and-nut-balls',
    imageWebp: '/images/categories/fruit-nut-balls.webp',
    imageJpg: '/images/categories/fruit-nut-balls.jpg',
    titleEn: 'Fruit & Nut Balls',
    titleVi: 'Viên Năng Lượng Trái Cây & Hạt',
    titleKo: '과일·견과류 에너지 볼',
    titleZh: '热带水果坚果能量球',
    descEn: 'Bite-sized balls of dried tropical fruit — available plain or blended with wholesome nuts for a satisfying, energy-rich snack.',
    descVi: 'Viên snack nhỏ gọn từ trái cây nhiệt đới sấy — phiên bản thuần vị hoặc phối trộn hạt dinh dưỡng giàu năng lượng.',
    descKo: '열대 건조 과일 단독 또는 영양이 풍부한 견과류를 배합해 한 입 크기로 만든 고에너지 스낵입니다.',
    descZh: '甄选热带果干打造一口式能量球，提供纯果味及混合坚果配方，饱腹营养便携。',
    highlightsEn: ['Bite-Sized Energy', 'Plain or Nut Blend', 'Cashew & Macadamia', 'Custom Portion Packs'],
    highlightsVi: ['Viên snack tiện lợi', 'Thuần vị hoặc mix hạt', 'Điều & Mắc ca', 'Đóng gói theo yêu cầu'],
    highlightsKo: ['한 입 크기 에너지 스낵', '플레인 또는 견과 배합', '캐슈넛 & 마카다미아', '맞춤 소포장 규격'],
    highlightsZh: ['一口式能量小食', '纯果味或坚果拼配', '腰果与夏威夷果', '支持定制定量分装'],
    catalogFilter: 'nuts-seeds',
  },
  {
    id: 'granola',
    imageWebp: '/images/categories/granola.webp',
    imageJpg: '/images/categories/granola.jpg',
    titleEn: 'Granola',
    titleVi: 'Granola Trái Cây & Hạt',
    titleKo: '열대 과일·견과 그래놀라',
    titleZh: '热带水果坚果格兰诺拉麦片',
    descEn: 'Crunchy clusters of oats, dried tropical fruit and nuts — ideal for breakfast bowls, yogurt toppings and snacking.',
    descVi: 'Yến mạch nướng giòn kết hợp cùng trái cây nhiệt đới sấy và các loại hạt — hoàn hảo cho bữa sáng và ăn vặt lành mạnh.',
    descKo: '바삭하게 구운 귀리 클러스터와 열대 건조 과일, 견과류를 블렌딩하여 아침 식사와 요거트 토핑에 적합합니다.',
    descZh: '酥脆烤燕麦块融合热带果干丁与香脆坚果，适合营养早餐、酸奶伴侣及健康轻食场景。',
    highlightsEn: ['Baked Oat Clusters', 'Tropical Fruit Cubes', 'Cashew, Walnut & Lotus', 'Retail & Bulk Packs'],
    highlightsVi: ['Yến mạch giòn xốp', 'Trái cây sấy hạt lựu', 'Điều, Óc chó & Hạt sen', 'Đóng gói bán lẻ & xá'],
    highlightsKo: ['오븐 로스팅 귀리 클러스터', '다이스 열대 과일', '캐슈넛·호두·연자육', '리테일 및 벌크 포장'],
    highlightsZh: ['烘焙酥脆燕麦块', '热带果干果粒', '腰果、核桃与莲子', '零售袋装与工业散装'],
    catalogFilter: 'nuts-seeds',
  },
];

export interface FactoryImageItem {
  id: string;
  imageWebp: string;
  imageJpg: string;
  captionEn: string;
  captionVi: string;
  captionKo?: string;
  captionZh?: string;
  tagEn: string;
  tagVi: string;
  tagKo?: string;
  tagZh?: string;
}

/**
 * Official 4 Factory Photographs extracted directly from Vinaxo Brochure 2026 (Page 3: INSIDE OUR FACTORY).
 */
export const FACTORY_GALLERY: FactoryImageItem[] = [
  {
    id: 'sorting-hall-main',
    imageWebp: '/assets/images/factory-2026/factory-featured.webp',
    imageJpg: '/assets/images/factory-2026/factory-featured.jpg',
    tagEn: 'INSIDE OUR FACTORY • 25,000 M² COMPLEX',
    tagVi: 'TRONG NHÀ MÁY VINAXO • 25.000 M²',
    tagKo: 'VINAXO 공장 내부 • 25,000 M² 규모',
    tagZh: 'VINAXO 工厂实景 • 25,000 平方米园区',
    captionEn: 'High-capacity tropical fruit sorting and preparation floor operated under unified cleanroom PPE and food safety zoning.',
    captionVi: 'Khu phân loại và chế biến quy mô lớn với quy trình kiểm soát đồng phục bảo hộ vệ sinh, phân vùng khép kín đạt chuẩn quốc tế.',
    captionKo: '위생복 착용과 구역 분리가 엄격히 적용된 대규모 열대 과일 선별 및 전처리 작업장입니다.',
    captionZh: '高产能热带水果分拣与预处理车间，全程执行统一洁净防护着装与食品安全分区管控。',
  },
  {
    id: 'processing-line-cleanroom',
    imageWebp: '/assets/images/factory/factory-featured-drying.webp',
    imageJpg: '/assets/images/factory/factory-featured-drying.jpg',
    tagEn: 'HYGIENIC TRAY RACKING',
    tagVi: 'XẾP KHAY CHUẨN BỊ SẤY',
    tagKo: '위생 트레이 적재 공정',
    tagZh: '洁净摆盘上架区',
    captionEn: 'Cleanroom staging line where calibrated slices are arranged onto ventilated drying racks for even dehydration.',
    captionVi: 'Khu vực sắp xếp lát trái cây lên dàn khay sấy tiêu chuẩn để đảm bảo nhiệt lượng đối lưu đồng đều.',
    captionKo: '균일한 열풍 건조를 위해 정밀 절단된 과일 슬라이스를 통풍형 스테인리스 건조 트레이에 배열하는 클린룸 라인입니다.',
    captionZh: '无尘预处理工段将均匀切片平铺至透气干燥网盘，确保热风对流受热一致。',
  },
  {
    id: 'dehydration-rack-corridor',
    imageWebp: '/assets/images/factory-2026/factory-sub-2.webp',
    imageJpg: '/assets/images/factory-2026/factory-sub-2.jpg',
    tagEn: 'DRYING INFRASTRUCTURE',
    tagVi: 'HỆ THỐNG KHAY SẤY CÔNG NGHIỆP',
    tagKo: '대용량 건조 설비 인프라',
    tagZh: '工业级多层烘干系统',
    captionEn: 'Sanitary floor stocked with food-grade multi-tier drying trolleys supporting 300 tons monthly export capacity.',
    captionVi: 'Hệ thống xe đẩy khay sấy đa tầng chuẩn thực phẩm phục vụ công suất 300 tấn thành phẩm mỗi tháng.',
    captionKo: '월 300톤 수출 생산 능력을 뒷받침하는 식품 등급 다단 건조 대차 및 위생 통로입니다.',
    captionZh: '配备食品级多层烘干推车的洁净车间，有力支撑每月 300 吨成品出口产能。',
  },
  {
    id: 'raw-washing-prep',
    imageWebp: '/assets/images/factory/factory-fresh-prep.webp',
    imageJpg: '/assets/images/factory/factory-fresh-prep.jpg',
    tagEn: 'WASHING & INITIAL PREP',
    tagVi: 'RỬA SẠCH & SƠ CHẾ ĐẦU VÀO',
    tagKo: '원물 세척 및 초기 손질',
    tagZh: '原料清洗与初加工工段',
    captionEn: 'Controlled pre-wash and hand-trimming stations safeguarding fresh tropical fruit purity prior to dehydration.',
    captionVi: 'Công đoạn rửa làm sạch và xử lý nguyên liệu tươi nghiêm ngặt trước khi đưa vào buồng sấy.',
    captionKo: '건조 챔버 투입 전 신선 과일의 청결도와 품질을 철저히 검사·세척하는 전처리 라인입니다.',
    captionZh: '入烘房前经过严格清洗与人工修整质检，确保每一批热带鲜果纯净优质。',
  },
];

/**
 * Exact 3 Quality Promise Pillars from Vinaxo Brochure 2026 (Page 3: OUR QUALITY PROMISE).
 */
export const QUALITY_PROMISE_CARDS = [
  {
    number: '01',
    titleEn: 'Approved samples first',
    titleVi: 'Mẫu chuẩn được duyệt trước',
    titleKo: '사전 샘플 승인 원칙',
    titleZh: '标准样品先行确认',
    descEn: 'A standard sample is submitted for approval before mass production and again before shipment.',
    descVi: 'Mẫu tiêu chuẩn được gửi để đối tác kiểm tra và phê duyệt trước khi sản xuất đại trà và đối chiếu lại trước khi xuất hàng.',
    descKo: '대량 생산 착수 전과 선적 전 두 차례에 걸쳐 고객 승인을 위한 표준 샘플을 제출·대조합니다.',
    descZh: '大货投产前及出货前均需提交标准留样经客户签批确认，确保批次高度一致。',
  },
  {
    number: '02',
    titleEn: 'Certified processes',
    titleVi: 'Quy trình đạt chứng nhận',
    titleKo: '국제 인증 공정 관리',
    titleZh: '国际认证体系管控',
    descEn: 'Every stage follows internationally recognised systems including BRCGS, ISO 22000 and HACCP.',
    descVi: 'Mọi công đoạn đều tuân thủ nghiêm ngặt các hệ thống quản lý chất lượng quốc tế bao gồm BRCGS, ISO 22000 và HACCP.',
    descKo: '모든 생산 공정이 BRCGS, ISO 22000, HACCP 등 국제 공인 식품안전 경영 시스템에 따라 관리됩니다.',
    descZh: '全生产环节严格遵循 BRCGS、ISO 22000 及 HACCP 等国际公认食品安全体系执行。',
  },
  {
    number: '03',
    titleEn: 'Open to inspection',
    titleVi: 'Sẵn sàng kiểm định độc lập',
    titleKo: '제3자 독립 검수 개방',
    titleZh: '全程欢迎第三方验货',
    descEn: 'Third-party inspection is welcome at any stage of production.',
    descVi: 'Chúng tôi luôn chào đón các đơn vị giám định độc lập kiểm tra tại bất kỳ công đoạn nào trong quá trình sản xuất.',
    descKo: '생산의 어느 단계에서든 바이어 지정 제3자 전문 검사 기관의 현장 검수 및 감사를 환영합니다.',
    descZh: '欢迎客户委托的第三方检验机构在生产及装柜任意阶段入厂审核或抽检。',
  },
];

export interface BrochureFaqItem {
  id: string;
  qEn: string;
  qVi: string;
  qKo?: string;
  qZh?: string;
  aEn: string;
  aVi: string;
  aKo?: string;
  aZh?: string;
}

/**
 * Exact 4 Frequently Asked Questions from Vinaxo Brochure 2026 (Page 4).
 */
export const BROCHURE_FAQS: BrochureFaqItem[] = [
  {
    id: 'moq',
    qEn: 'What is your minimum order quantity?',
    qVi: 'Số lượng đặt hàng tối thiểu (MOQ) là bao nhiêu?',
    qKo: '최소 주문 수량(MOQ)은 얼마인가요?',
    qZh: '贵司的最低起订量（MOQ）是多少？',
    aEn: 'MOQ varies by product, from 200 kg to 1 ton.',
    aVi: 'MOQ linh hoạt tùy theo từng dòng sản phẩm, khởi điểm từ 200 kg đến 1 tấn.',
    aKo: '최소 주문 수량(MOQ)은 품목에 따라 200kg에서 1톤까지 유연하게 적용됩니다.',
    aZh: '最低起订量（MOQ）视具体产品而定，一般为 200 公斤至 1 吨起订。',
  },
  {
    id: 'oem',
    qEn: 'Do you offer OEM / ODM services?',
    qVi: 'VINAXO có nhận gia công OEM / ODM nhãn riêng không?',
    qKo: 'OEM / ODM 자체 브랜드(PB) 생산 서비스를 제공하나요?',
    qZh: 'VINAXO 是否承接 OEM / ODM 贴牌代工服务？',
    aEn: 'Yes. Share your specifications with our sales team and we will tailor recipe, packaging and labelling to your needs.',
    aVi: 'Có. Quý đối tác chỉ cần chia sẻ yêu cầu cụ thể cho đội ngũ kinh doanh, chúng tôi sẽ tùy chỉnh công thức, quy cách đóng gói và nhãn mác theo đúng thương hiệu của bạn.',
    aKo: '네, 가능합니다. 영업팀에 원하시는 사양을 공유해 주시면 레시피, 포장 규격 및 라벨링을 브랜드 맞춤형으로 제작해 드립니다.',
    aZh: '是的。您只需向我们的销售团队提供具体要求，我们即可为您量身定制配方、包装规格及专属品牌标签。',
  },
  {
    id: 'samples',
    qEn: 'Can I request samples?',
    qVi: 'Tôi có thể yêu cầu gửi mẫu thử sản phẩm không?',
    qKo: '제품 평가용 샘플을 요청할 수 있나요?',
    qZh: '可以申请免费寄送试吃样品吗？',
    aEn: 'Certainly. Complimentary samples are available for your evaluation.',
    aVi: 'Hoàn toàn được. VINAXO luôn sẵn sàng cung cấp mẫu thử miễn phí để quý khách hàng trực tiếp đánh giá chất lượng.',
    aKo: '물론입니다. 품질 및 식감 평가를 위해 무료 샘플을 제공해 드리고 있습니다.',
    aZh: '当然可以。我们随时提供免费样品，供贵司采购及品控团队实地评估检测。',
  },
  {
    id: 'leadtime',
    qEn: 'What is your lead time?',
    qVi: 'Thời gian sản xuất và giao hàng (Lead time) mất bao lâu?',
    qKo: '생산 및 납품 리드타임(Lead time)은 얼마나 걸리나요?',
    qZh: '常规生产与交货周期（Lead Time）需要多久？',
    aEn: 'Typically 2 to 4 weeks, depending on order volume, packaging and any special requirements.',
    aVi: 'Thông thường từ 2 đến 4 tuần, tùy thuộc vào khối lượng đơn hàng, quy cách đóng gói và các yêu cầu đặc biệt khác.',
    aKo: '주문 물량, 포장 사양 및 특별 요청 사항에 따라 보통 2~4주가 소요됩니다.',
    aZh: '视订单数量、包装形式及特殊定制要求而定，通常交货周期为 2 至 4 周。',
  },
];
