import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface PageHeroProps {
  badge?: string;
  titleLine1: string;
  titleLine2?: string;
  description: string;
  breadcrumbCurrent: string;
  children?: ReactNode;
  theme?: 'sage' | 'cream' | 'forest';
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  titleLine1,
  titleLine2,
  description,
  breadcrumbCurrent,
  children,
  theme = 'sage',
}) => {
  const { t } = useLanguage();

  const isForest = theme === 'forest';

  return (
    <div
      className={`page-hero ${
        isForest ? 'bg-forest text-white' : theme === 'cream' ? 'bg-cream' : 'bg-sage'
      }`}
      style={{
        paddingTop: 'clamp(56px, 8vw, 96px)',
        paddingBottom: 'clamp(48px, 6vw, 80px)',
        position: 'relative',
        borderBottom: isForest ? 'none' : '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            marginBottom: '20px',
            color: isForest ? 'rgba(255,255,255,0.7)' : 'var(--color-muted)',
          }}
        >
          <Link
            to="/"
            style={{
              color: isForest ? 'rgba(255,255,255,0.85)' : 'var(--color-body)',
              fontWeight: 500,
            }}
          >
            {t('nav.home', 'Home')}
          </Link>
          <ChevronRight size={14} />
          <span
            style={{
              color: isForest ? '#FFFFFF' : 'var(--primary-green)',
              fontWeight: 600,
            }}
          >
            {breadcrumbCurrent}
          </span>
        </nav>

        {/* Badge */}
        {badge && (
          <div style={{ marginBottom: '16px' }}>
            <span
              className={`section-eyebrow ${
                isForest ? 'section-eyebrow-light' : ''
              }`}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Main Title */}
        <h1
          className={`title-serif ${isForest ? 'text-white' : ''}`}
          style={{
            fontSize: 'clamp(2.2rem, 4.2vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '20px',
            maxWidth: '920px',
            color: isForest ? '#FFFFFF' : 'var(--color-heading)',
          }}
        >
          <span>{titleLine1}</span>
          {titleLine2 && (
            <>
              {' '}
              <em
                style={{
                  fontStyle: 'italic',
                  color: isForest ? '#A3E6B8' : 'var(--primary-green)',
                }}
              >
                {titleLine2}
              </em>
            </>
          )}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
            lineHeight: 1.7,
            maxWidth: '780px',
            color: isForest ? 'rgba(255,255,255,0.9)' : 'var(--color-body)',
            marginBottom: children ? '28px' : '0',
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {children && <div style={{ marginTop: '28px' }}>{children}</div>}
      </div>
    </div>
  );
};
