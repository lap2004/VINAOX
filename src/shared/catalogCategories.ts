import type { Language } from '../i18n/localize.js';
import type { LocalizedText } from './schemas/aboutSchema.js';

export type CatalogCategoryId = 'soft-dried' | 'chips' | 'nuts-seeds' | 'mixed';

export interface CatalogCategoryDefinition {
  id: CatalogCategoryId;
  slug: CatalogCategoryId;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  imageFallback?: string;
  visible: boolean;
  sortOrder: number;
}

export const CATALOG_CATEGORIES: CatalogCategoryDefinition[] = [
  {
    id: 'soft-dried',
    slug: 'soft-dried',
    name: {
      vi: 'Trái cây sấy dẻo',
      en: 'Soft-Dried Fruits',
      ko: '소프트 건조 과일',
      zh: '软烘干果',
    },
    description: {
      vi: 'Chế biến bằng công nghệ sấy bơm nhiệt nhiệt độ thấp giúp giữ kết cấu dẻo mềm và hương vị đặc trưng của từng loại trái cây.',
      en: 'Processed via low-temperature heat-pump dehydration to preserve soft, chewy fruit texture and tropical aroma by SKU.',
      ko: '저온 히트펌프 건조로 품목별 부드럽고 쫄깃한 식감과 열대 과일 풍미를 유지합니다.',
      zh: '采用低温热泵循环烘干工艺，依据各果品特点保留柔韧口感与浓郁果香。',
    },
    image: '/assets/images/hero_fruits.webp',
    imageFallback: '/assets/images/hero_fruits.jpg',
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'chips',
    slug: 'chips',
    name: {
      vi: 'Trái cây sấy giòn',
      en: 'Crispy Dried Fruits',
      ko: '크리스피 과일 칩',
      zh: '香脆果干片',
    },
    description: {
      vi: 'Các dòng lát trái cây sấy giòn và chiên sấy chân không nhiệt độ thấp kết hợp ly tâm tách dầu, độ ẩm thấp dưới 5%.',
      en: 'Crispy fruit chips processed via low-temperature vacuum crisping and centrifugal de-oiling with moisture below 5%.',
      ko: '저온 진공 건조 및 원심 탈유 공정을 적용해 수분 5% 미만의 바삭한 식감을 구현한 과일 칩 제품군입니다.',
      zh: '采用低温真空脆化与离心脱油工艺制成的水果脆片系列，成品水分含量低于 5%。',
    },
    image: '/images/products/banana-chips.webp',
    imageFallback: '/images/products/banana-chips.jpg',
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'nuts-seeds',
    slug: 'nuts-seeds',
    name: {
      vi: 'Hạt dinh dưỡng',
      en: 'Nuts & Seeds',
      ko: '견과류 및 연자육',
      zh: '坚果与莲子',
    },
    description: {
      vi: 'Hạt điều, mắc ca, óc chó và hạt sen được tuyển chọn theo vùng nguyên liệu và rang/sấy phù hợp từng loại hạt.',
      en: 'Cashew, macadamia, walnuts, and lotus seeds sourced by regional origin with roasting or drying tailored to each kernel.',
      ko: '산지별로 엄선한 캐슈넛·마카다미아·호두·연자육을 원물 특성에 맞게 로스팅·건조하여 공급합니다.',
      zh: '严选优质产区腰果、夏威夷果、核桃与莲子，按不同坚果特性匹配烘焙或干燥工艺。',
    },
    image: '/images/products/cashew.webp',
    imageFallback: '/images/products/cashew.jpg',
    visible: true,
    sortOrder: 3,
  },
  {
    id: 'mixed',
    slug: 'mixed',
    name: {
      vi: 'Sản phẩm thập cẩm',
      en: 'Mixed Products',
      ko: '모듬 제품',
      zh: '综合产品',
    },
    description: {
      vi: 'Phối trộn đa dạng trái cây và rau củ Việt Nam sấy giòn chân không phục vụ kênh bán lẻ, food-service và OEM.',
      en: 'Vacuum-dried blends of Vietnamese tropical fruits and vegetables tailored for retail, food-service, and OEM.',
      ko: '다양한 베트남 열대 과일과 뿌리채소를 저온 진공 건조로 블렌딩한 모듬 제품군입니다.',
      zh: '精选多种越南热带水果与根茎蔬菜经真空脆化拼配，广泛适配商超及 OEM 渠道。',
    },
    image: '/images/products/mix-fruits-and-vegetables.webp',
    imageFallback: '/images/products/mix-fruits-and-vegetables.jpg',
    visible: true,
    sortOrder: 4,
  },
];

export const VALID_CATALOG_CATEGORY_IDS: readonly CatalogCategoryId[] = CATALOG_CATEGORIES.map((c) => c.id);

export function isValidCatalogCategory(slug: unknown): slug is CatalogCategoryId {
  return typeof slug === 'string' && VALID_CATALOG_CATEGORY_IDS.includes(slug as CatalogCategoryId);
}

export function getCatalogCategory(id: CatalogCategoryId): CatalogCategoryDefinition {
  return CATALOG_CATEGORIES.find((c) => c.id === id) || CATALOG_CATEGORIES[0];
}

export function getCatalogCategoryName(id: CatalogCategoryId, lang: Language): string {
  const cat = getCatalogCategory(id);
  if (lang === 'vi') return cat.name.vi;
  if (lang === 'ko') return cat.name.ko || cat.name.en;
  if (lang === 'zh-CN') return cat.name.zh || cat.name.en;
  return cat.name.en;
}
