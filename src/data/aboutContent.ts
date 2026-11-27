import { Language } from '../i18n/LanguageContext';
import {
  ABOUT_GALLERY_CATEGORIES,
  AboutGalleryCategory,
  AboutGalleryItem,
  AboutPageContent,
  LocalizedText,
  mergeAboutContent,
} from '../shared/schemas/aboutSchema';

export type {
  AboutGalleryCategory,
  AboutGalleryItem,
  AboutPageContent,
  LocalizedText,
} from '../shared/schemas/aboutSchema';

export const GALLERY_CATEGORY_LABELS: Record<AboutGalleryCategory | 'all', LocalizedText> = {
  all: {
    vi: 'Tất cả hình ảnh',
    en: 'All Photos',
    ko: '전체 사진',
    zh: '全部实景',
  },
  'raw-material': {
    vi: 'Vùng nguyên liệu',
    en: 'Raw Material Regions',
    ko: '원료 산지',
    zh: '原料产区',
  },
  harvest: {
    vi: 'Thu hoạch & Thu mua',
    en: 'Harvest & Procurement',
    ko: '수확 및 수매',
    zh: '采收与直采',
  },
  factory: {
    vi: 'Nhà máy chế biến',
    en: 'Processing Facility',
    ko: '가공 공장',
    zh: '加工厂房',
  },
  preparation: {
    vi: 'Chuẩn bị nguyên liệu',
    en: 'Material Preparation',
    ko: '원료 준비 및 전처리',
    zh: '原料准备与预处理',
  },
  processing: {
    vi: 'Chế biến & Hạ tầng sấy',
    en: 'Processing & Drying',
    ko: '건조 및 가공',
    zh: '烘干与加工',
  },
  quality: {
    vi: 'Kiểm soát chất lượng',
    en: 'Quality Control',
    ko: '품질 관리',
    zh: '质量控制',
  },
  packaging: {
    vi: 'Đóng gói thành phẩm',
    en: 'Finished Packaging',
    ko: '완제품 포장',
    zh: '成品包装',
  },
  warehouse: {
    vi: 'Kho bãi & Lưu trữ',
    en: 'Cold Storage & Warehouse',
    ko: '보관 및 물류 창고',
    zh: '冷库与仓储',
  },
  team: {
    vi: 'Đội ngũ doanh nghiệp',
    en: 'VINAXO Team',
    ko: 'VINAXO 임직원',
    zh: '企业团队',
  },
  export: {
    vi: 'Hoạt động xuất khẩu',
    en: 'Export Operations',
    ko: '수출 및 물류',
    zh: '出口业务',
  },
};

export const FALLBACK_ABOUT_CONTENT: AboutPageContent = {
  hero: {
    badge: {
      vi: 'HỒ SƠ DOANH NGHIỆP • CÔNG TY TNHH VINAXO',
      en: 'CORPORATE PROFILE • VINAXO COMPANY LIMITED',
      ko: '기업 프로필 • VINAXO COMPANY LIMITED',
      zh: '企业简介 • VINAXO COMPANY LIMITED',
    },
    title: {
      vi: 'Về Công Ty TNHH VINAXO',
      en: 'About VINAXO COMPANY LIMITED',
      ko: 'VINAXO 기업 소개',
      zh: '关于 VINAXO',
    },
    subtitle: {
      vi: 'Doanh nghiệp chế biến và xuất khẩu trái cây sấy tự nhiên từ đồng bằng sông Cửu Long, nâng tầm nông sản Việt với tiêu chuẩn an toàn thực phẩm quốc tế.',
      en: 'Pioneering premium Vietnamese dried fruits from the fertile Mekong Delta to world tables, built upon direct farmer partnerships and BRCGS food safety excellence.',
      ko: '비옥한 메콩 델타산 열대 과일을 원료로 국제 BRCGS 식품안전 기준과 직영 농가 파트너십 기반의 프리미엄 건조 과일을 생산·수출하는 기업입니다.',
      zh: '扎根物产丰饶的湄公河三角洲，携手果农直采优质鲜果并遵循 BRCGS 国际食品安全标准，致力将越南天然热带果干推向全球餐桌。',
    },
  },
  story: {
    label: {
      vi: 'VỀ CÔNG TY TNHH VINAXO',
      en: 'ABOUT VINAXO',
      ko: 'VINAXO 회사 소개',
      zh: '关于 VINAXO',
    },
    titleLine1: {
      vi: 'Bắt nguồn từ phù sa miền Tây',
      en: 'Rooted in the Mekong Delta',
      ko: '메콩 델타의 비옥한 토양에서 시작해',
      zh: '植根湄公河三角洲沃土',
    },
    titleLine2: {
      vi: 'Nâng tầm giá trị nông sản Việt',
      en: 'Elevating Vietnamese Agricultural Value',
      ko: '베트남 농산물의 가치를 세계로',
      zh: '全面提升越南农产品价值',
    },
    description: {
      vi: 'Tọa lạc tại Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, VINAXO vận hành tổ hợp chế biến nông sản và trái cây sấy hiện đại quy mô 25.000 m² với công suất 300 tấn thành phẩm/tháng.',
      en: 'Based in Quarter 5, Vinh Binh Commune, Dong Thap Province, VINAXO operates an integrated 25,000 m² tropical dried fruit processing facility with 300 t monthly output capacity.',
      ko: '베트남 동탑성 빈빈면 5구역에 위치한 VINAXO는 25,000 m² 규모의 현대식 농산물·건조 과일 가공 단지를 운영하며 월 300톤의 완제품을 생산합니다.',
      zh: 'VINAXO 位于越南同塔省永平社第5区，运营 25,000 平方米现代化果蔬加工与烘干基地，成品月产能达 300 吨。',
    },
  },
  visionMission: {
    enabled: false,
    label: { vi: '', en: '', ko: '', zh: '' },
    visionTitle: { vi: 'Tầm nhìn', en: 'Vision', ko: '비전', zh: '企业愿景' },
    visionDesc: { vi: '', en: '', ko: '', zh: '' },
    missionTitle: { vi: 'Sứ mệnh', en: 'Mission', ko: '미션', zh: '企业使命' },
    missionDesc: { vi: '', en: '', ko: '', zh: '' },
    coreValuesTitle: { vi: 'Giá trị cốt lõi', en: 'Core Values', ko: '핵심 가치', zh: '核心价值' },
    coreValuesDesc: { vi: '', en: '', ko: '', zh: '' },
  },
  highlightVisual: {
    image: '/assets/images/factory/factory-quality-sorting.webp',
    imageFallback: '/assets/images/factory/factory-quality-sorting.jpg',
    overlayTag: {
      vi: 'Nhà máy VINAXO • Đồng Tháp',
      en: 'VINAXO Facility • Dong Thap',
      ko: 'VINAXO 동탑 가공 공장',
      zh: 'VINAXO 同塔加工厂',
    },
    overlayLine1: {
      vi: 'Chế biến chuẩn sạch,',
      en: 'Verified Processing,',
      ko: '체계적 위생 가공,',
      zh: '规范洁净加工，',
    },
    overlayLine2: {
      vi: 'Nâng tầm nông sản Việt',
      en: 'Vietnamese Agricultural Value',
      ko: '베트남 농산물의 가치',
      zh: '提升越南农产品价值',
    },
    alt: {
      vi: 'Đội ngũ công nhân VINAXO kiểm tra và cân định lượng xoài sấy trên bàn inox tại nhà máy Đồng Tháp',
      en: 'VINAXO production workers inspecting and weighing dried mango slices on stainless steel tables at the Dong Thap factory',
      ko: '동탑성 VINAXO 공장에서 위생복을 착용한 생산 인력이 건망고를 선별·계량하는 현장',
      zh: '同塔省 VINAXO 工厂员工在不锈钢台面上分拣并称量芒果干',
    },
  },
  metrics: [],
  milestones: [],
  infrastructure: {
    label: { vi: 'CƠ SỞ HẠ TẦNG VÀ CÔNG NGHỆ', en: 'INFRASTRUCTURE & TECHNOLOGY', ko: '설비 및 기술', zh: '基础设施与技术' },
    title: { vi: 'Tổ hợp nhà máy 25.000 m² tại Đồng Tháp', en: '25,000 m² Processing Complex in Dong Thap', ko: '동탑성 25,000 m² 종합 가공 단지', zh: '同塔省 25,000 m² 现代化加工综合体' },
    desc: { vi: '', en: '', ko: '', zh: '' },
    image: '/assets/images/factory/factory-fresh-prep.webp',
    imageFallback: '/assets/images/factory/factory-fresh-prep.jpg',
    imageAlt: {
      vi: 'Công nhân VINAXO mặc đồng phục bảo hộ sơ chế và tách múi trái cây tươi trên bàn inox trong phân xưởng sạch',
      en: 'VINAXO factory staff in hygienic uniforms trimming and preparing fresh tropical jackfruit on stainless steel tables',
      ko: '위생복을 착용한 VINAXO 직원이 스테인리스 작업대에서 신선한 잭프루트를 전처리하는 현장',
      zh: '身着卫生工装的 VINAXO 员工在不锈钢操作台上对新鲜菠萝蜜进行预处理',
    },
    features: [],
  },
  sourcing: {
    label: { vi: 'VÙNG NGUYÊN LIỆU ĐBSCL', en: 'MEKONG DELTA SOURCING HUBS', ko: '메콩 델타 계약 산지', zh: '湄公河三角洲产区' },
    title: { vi: 'Liên kết nông dân & Chuỗi cung ứng vùng chuyên canh', en: 'Direct Farmer Partnerships & Verified Growing Regions', ko: '농가 직거래 파트너십 및 청정 원료 산지', zh: '果农直采合作与可追溯洁净原料' },
    desc: { vi: '', en: '', ko: '', zh: '' },
    rows: [],
  },
  gallerySection: {
    label: { vi: 'HÌNH ẢNH THỰC TẾ TẠI NHÀ MÁY VINAXO', en: 'AUTHENTIC VINAXO FACTORY GALLERY', ko: 'VINAXO 실제 가동 공장 현장 갤러리', zh: 'VINAXO 工厂实景图库' },
    title: { vi: 'Hình Ảnh Hoạt Động Sản Xuất Thực Tế', en: 'Inside VINAXO Processing & Packaging Floors', ko: 'VINAXO 실제 생산·가공·포장 현장', zh: 'VINAXO 实际生产、分选与包装现场' },
    desc: { vi: '', en: '', ko: '', zh: '' },
  },
  gallery: [],
};

let aboutCmsModules: Record<string, any> = {};
try {
  aboutCmsModules = (import.meta as any).glob('/content/settings/about.json', { eager: true });
} catch {
  aboutCmsModules = {};
}

const rawAboutCmsModule = Object.values(aboutCmsModules)[0] as any;
const rawAboutJson = rawAboutCmsModule?.default || rawAboutCmsModule || {};

export const ABOUT_CONTENT: AboutPageContent = mergeAboutContent(FALLBACK_ABOUT_CONTENT, rawAboutJson);

export function getLocalizedKey(language: Language): keyof LocalizedText {
  if (language === 'vi') return 'vi';
  if (language === 'ko') return 'ko';
  if (language === 'zh-CN') return 'zh';
  return 'en';
}

export function pickLocalized(text: LocalizedText | undefined, language: Language, fallback = ''): string {
  if (!text) return fallback;
  const key = getLocalizedKey(language);
  const exact = typeof text[key] === 'string' ? text[key].trim() : '';
  if (exact) return exact;
  return (text.en || text.vi || fallback || '').trim();
}

export function getVisibleAboutGallery(content: AboutPageContent = ABOUT_CONTENT): AboutGalleryItem[] {
  return [...content.gallery]
    .filter((item) => item.visible !== false && Boolean(item.image))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryLabel(category: AboutGalleryCategory | 'all', language: Language): string {
  return pickLocalized(GALLERY_CATEGORY_LABELS[category] || GALLERY_CATEGORY_LABELS.factory, language);
}

export function getMissingLocales(text: LocalizedText | undefined): Array<keyof LocalizedText> {
  if (!text) return ['vi', 'en', 'ko', 'zh'];
  return (['vi', 'en', 'ko', 'zh'] as const).filter((loc) => !text[loc] || !text[loc].trim());
}

export { ABOUT_GALLERY_CATEGORIES };
