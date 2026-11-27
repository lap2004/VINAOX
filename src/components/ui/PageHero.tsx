import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface PageHeroProps {
  badge?: string;
  title?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  breadcrumbCurrent: string;
  children?: ReactNode;
  theme?: 'sage' | 'cream' | 'forest';
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  titleLine1,
  titleLine2,
  description,
  breadcrumbCurrent,
  children,
}) => {
  const { t } = useLanguage();

  return (
    <section className="page-banner">
      <div className="container page-banner-container">
        {/* Breadcrumb Navigation */}
        <div className="page-banner-breadcrumbs">
          <Link to="/">{t('nav.home', 'Trang chủ')}</Link>
          <ChevronRight size={14} />
          <span>{breadcrumbCurrent}</span>
        </div>

        {/* Optional Subtle Eyebrow Text */}
        {badge && (
          <div style={{ marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: '#F4A83A',
              }}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Banner Title */}
        <h1 className="page-banner-title">
          {title ? (
            title
          ) : (
            <>
              <span>{titleLine1}</span>
              {titleLine2 && (
                <>
                  {' '}
                  <span style={{ color: '#F4A83A', fontWeight: 700 }}>
                    {titleLine2}
                  </span>
                </>
              )}
            </>
          )}
        </h1>

        {/* Subtitle / Description */}
        {description && (
          <p className="page-banner-desc">
            {description}
          </p>
        )}

        {children && <div style={{ marginTop: '14px' }}>{children}</div>}
      </div>
    </section>
  );
};
