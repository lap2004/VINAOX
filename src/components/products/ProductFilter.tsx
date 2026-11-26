import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ProductFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { pick } = useLanguage();

  const filterTabs = [
    { id: 'all', label: pick({ vi: 'Tất cả sản phẩm', en: 'All Products', ko: '전체 제품', zh: '全部产品' }) },
    { id: 'mango', label: pick({ vi: 'Xoài sấy dẻo', en: 'Dried Mango', ko: '소프트 건망고', zh: '软烘芒果干' }) },
    { id: 'jackfruit', label: pick({ vi: 'Mít sấy dẻo', en: 'Dried Jackfruit', ko: '건잭프루트', zh: '菠萝蜜果干' }) },
    { id: 'dragon', label: pick({ vi: 'Thanh long sấy', en: 'Dragon Fruit', ko: '건적색 용과', zh: '红心火龙果干' }) },
    { id: 'pineapple', label: pick({ vi: 'Thơm (Dứa) sấy', en: 'Dried Pineapple', ko: '건파인애플', zh: '菠萝干' }) },
    { id: 'banana', label: pick({ vi: 'Chuối sấy dẻo', en: 'Dried Banana', ko: '바나나 스낵', zh: '香蕉果干' }) },
    { id: 'energy-bar', label: pick({ vi: 'Thanh năng lượng', en: 'Energy Bars', ko: '에너지 바', zh: '水果能量棒' }) },
  ];

  return (
    <div
      className="filter-tabs"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '36px',
      }}
    >
      {filterTabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCategory(tab.id)}
            className={`filter-pill ${isActive ? 'active' : ''}`}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.86rem',
              fontWeight: isActive ? 700 : 500,
              backgroundColor: isActive
                ? 'var(--primary-green)'
                : 'var(--cream-bg)',
              color: isActive ? '#FFFFFF' : 'var(--color-heading)',
              border: isActive
                ? '1px solid var(--primary-green)'
                : '1px solid var(--color-border)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 4px 12px rgba(23, 77, 50, 0.2)' : 'none',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
