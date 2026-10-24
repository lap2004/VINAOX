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
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const filterTabs = [
    { id: 'all', label: isVi ? 'Tất cả sản phẩm' : 'All Products' },
    { id: 'mango', label: isVi ? 'Xoài sấy dẻo' : 'Dried Mango' },
    { id: 'jackfruit', label: isVi ? 'Mít sấy dẻo' : 'Dried Jackfruit' },
    { id: 'dragon', label: isVi ? 'Thanh long sấy' : 'Dragon Fruit' },
    { id: 'pineapple', label: isVi ? 'Thơm (Dứa) sấy' : 'Dried Pineapple' },
    { id: 'banana', label: isVi ? 'Chuối sấy dẻo' : 'Dried Banana' },
    { id: 'energy-bar', label: isVi ? 'Thanh năng lượng' : 'Energy Bars' },
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
