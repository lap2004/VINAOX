import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface NewsFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  countAll: number;
  countPress: number;
  countCompany: number;
}

export const NewsFilter: React.FC<NewsFilterProps> = ({
  activeCategory,
  onSelectCategory,
  countAll,
  countPress,
  countCompany,
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const filterTabs = [
    {
      id: 'all',
      label: isVi ? 'Tất cả bài viết' : 'All Articles',
      count: countAll,
    },
    {
      id: 'press',
      label: isVi ? 'Báo chí nói về VINAXO' : 'VINAXO in the Press',
      count: countPress,
    },
    {
      id: 'company',
      label: isVi ? 'Sản xuất & Doanh nghiệp' : 'Company Operations',
      count: countCompany,
    },
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isActive ? '0 4px 12px rgba(23, 77, 50, 0.2)' : 'none',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: '0.74rem',
                padding: '2px 6px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: isActive
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'var(--light-sage)',
                color: isActive ? '#FFFFFF' : 'var(--forest-green)',
                fontWeight: 700,
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
