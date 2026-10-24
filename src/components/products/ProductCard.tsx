import React from 'react';
import { ArrowRight, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../../data/products';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ProductCardProps {
  product: ProductItem;
  onViewDetails: (product: ProductItem) => void;
  onRequestQuote: (productName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onRequestQuote,
}) => {
  const { language, t } = useLanguage();
  const info = language === 'vi' ? product.vi : product.en;

  return (
    <div
      className="card product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Product Image Frame */}
      <div
        style={{
          position: 'relative',
          paddingTop: '68%',
          backgroundColor: '#F7FAF7',
          overflow: 'hidden',
        }}
      >
        <picture>
          <source srcSet={product.imageWebp} type="image/webp" />
          <img
            src={product.imageJpg}
            alt={info.name}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            className="product-card-img"
          />
        </picture>

        {/* OCOP / Innovation Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
          }}
        >
          {product.ocop.includes('OCOP') ? (
            <span
              className="badge badge-gold"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontWeight: 800,
              }}
            >
              <Sparkles size={12} />
              {product.ocop}
            </span>
          ) : (
            <span
              className="badge badge-green"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={12} />
              {product.ocop}
            </span>
          )}
        </div>

        {/* Specs Pill Top Right */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--forest-green)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {product.specs.brix}
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Origin Hub */}
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            marginBottom: '6px',
          }}
        >
          {info.origin}
        </div>

        {/* Product Name */}
        <h3
          className="title-serif"
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-heading)',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}
        >
          {info.name}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--color-body)',
            lineHeight: 1.6,
            marginBottom: '16px',
            flex: 1,
          }}
        >
          {info.desc}
        </p>

        {/* Key Specs Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '20px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <span
            style={{
              fontSize: '0.74rem',
              backgroundColor: 'var(--cream-bg)',
              color: 'var(--color-body-dark)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-border)',
            }}
          >
            {language === 'vi' ? 'Độ ẩm: ' : 'Moisture: '}
            {product.specs.moisture}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              backgroundColor: 'var(--cream-bg)',
              color: 'var(--color-body-dark)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-border)',
            }}
          >
            {language === 'vi' ? 'HSD: ' : 'Shelf Life: '}
            {language === 'vi' ? product.specs.shelfLifeVi : product.specs.shelfLifeEn}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--sage-border)',
              backgroundColor: 'var(--light-sage)',
              color: 'var(--forest-green)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d8e7d8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--light-sage)';
            }}
          >
            <FileText size={14} />
            <span>{language === 'vi' ? 'Xem thông số' : 'Specs Sheet'}</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestQuote(info.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: 'var(--primary-green)',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--forest-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-green)';
            }}
          >
            <span>{t('nav.getQuote', 'Quote')}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
