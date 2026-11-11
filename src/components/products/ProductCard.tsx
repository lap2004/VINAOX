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
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const info = isVi ? product.vi : product.en;

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
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Product Image Frame */}
      <div
        style={{
          position: 'relative',
          paddingTop: '72%',
          backgroundColor: 'var(--soft-beige)',
          overflow: 'hidden',
        }}
      >
        <picture style={{ display: 'block', width: '100%', height: '100%' }}>
          <source srcSet={product.imageWebp} type="image/webp" />
          <img
            src={product.imageJpg}
            alt={isVi ? product.nameVi : product.name}
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

        {/* Top Overlay Badges Bar (Flex prevents overlap at any card width) */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '6px',
            flexWrap: 'wrap',
            pointerEvents: 'none',
          }}
        >
          {product.ocop.includes('OCOP') ? (
            <span
              className="badge badge-gold"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '4px 9px',
                gap: '5px',
              }}
            >
              <Sparkles size={11} />
              {product.ocop}
            </span>
          ) : (
            <span
              className="badge badge-green"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '4px 9px',
                gap: '5px',
              }}
            >
              <CheckCircle2 size={11} />
              {product.ocop}
            </span>
          )}

          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.70rem',
              fontWeight: 700,
              color: 'var(--forest-green)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              whiteSpace: 'nowrap',
            }}
          >
            {product.specs.brix.includes('Brix')
              ? product.specs.brix
              : isVi
              ? product.categoryLabelVi
              : product.categoryLabelEn}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div
        style={{
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Origin Label */}
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--primary-green)',
            marginBottom: '6px',
          }}
        >
          {isVi ? (product.originVi || info.origin) : info.origin}
        </div>

        {/* Product Name */}
        <h3
          className="title-serif"
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--color-heading)',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}
        >
          {isVi ? product.nameVi : product.name}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--color-body)',
            lineHeight: 1.55,
            marginBottom: '16px',
            flex: 1,
          }}
        >
          {isVi ? (product.shortDescriptionVi || info.desc) : (product.shortDescription || info.desc)}
        </p>

        {/* Key Specs Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '18px',
            paddingTop: '10px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              backgroundColor: 'var(--cream-bg)',
              color: 'var(--color-body-dark)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-border)',
              fontWeight: 500,
            }}
          >
            {isVi ? 'Độ ẩm: ' : 'Moisture: '}
            {product.specs.moisture}
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              backgroundColor: 'var(--cream-bg)',
              color: 'var(--color-body-dark)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-border)',
              fontWeight: 500,
            }}
          >
            {isVi ? 'HSD: ' : 'Shelf Life: '}
            {isVi ? product.specs.shelfLifeVi : product.specs.shelfLifeEn}
          </span>
        </div>

        {/* Action Buttons: Stacked Vertically with 100% Width to Prevent Text Squishing */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: 'auto',
          }}
        >
          {/* Primary Action: Request a Quote */}
          <button
            type="button"
            onClick={() => onRequestQuote(isVi ? product.nameVi : product.name)}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: '40px',
              padding: '0 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(244, 168, 58, 0.28)',
            }}
          >
            <span>{isVi ? 'Nhận báo giá xuất khẩu' : 'Request B2B Quote'}</span>
            <ArrowRight size={14} />
          </button>

          {/* Secondary Action: View Specs Modal */}
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--soft-border)',
              backgroundColor: 'var(--brand-bg)',
              color: 'var(--dark-chocolate)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-orange-soft)';
              e.currentTarget.style.borderColor = 'var(--brand-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-bg)';
              e.currentTarget.style.borderColor = 'var(--soft-border)';
            }}
          >
            <FileText size={13} />
            <span>{isVi ? 'Xem thông số kỹ thuật' : 'View Specifications'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
