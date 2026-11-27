import React from 'react';
import { ArrowRight, Award, FileText } from 'lucide-react';
import {
  getProductLocalized,
  hasApplicableBrix,
  ProductItem,
} from '../../data/products';
import { type QuotationProduct } from '../contact/contactSchema';
import { useLanguage } from '../../i18n/LanguageContext';

export interface ProductCardProps {
  product: ProductItem;
  onViewDetails: (product: ProductItem) => void;
  onRequestQuote: (target: QuotationProduct | string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onRequestQuote,
}) => {
  const { language, pick } = useLanguage();
  const loc = getProductLocalized(product, language);
  const primaryCert = loc.productCertifications[0];
  const primaryCertName = primaryCert
    ? language === 'vi'
      ? primaryCert.nameVi
      : language === 'ko'
      ? primaryCert.nameKo || primaryCert.nameEn
      : language === 'zh-CN'
      ? primaryCert.nameZh || primaryCert.nameEn
      : primaryCert.nameEn
    : '';

  const topRightSpec = hasApplicableBrix(product.specs.brix)
    ? product.specs.brix
    : product.specs.moisture
    ? `${pick({ vi: 'Ẩm ', en: 'Moisture ', ko: '수분 ', zh: '水分 ' })}${product.specs.moisture}`
    : '';

  const handleQuote = () => {
    onRequestQuote({
      productId: product.id,
      productSlug: product.slug,
      categoryId: product.category,
    });
  };

  return (
    <div
      className="card product-card"
      data-product-slug={product.slug}
      data-product-category={product.category}
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
            alt={loc.imageAlt || loc.name}
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

        {/* Top Overlay Badges Bar: Certification badge ONLY for verified product certs; category badge otherwise */}
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
          {primaryCert ? (
            <span
              className="badge badge-gold"
              data-badge-kind="certification"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '4px 9px',
                gap: '5px',
              }}
            >
              <Award size={11} aria-hidden="true" />
              {primaryCertName}
            </span>
          ) : (
            <span
              className="badge"
              data-badge-kind="category"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                color: 'var(--dark-chocolate)',
                border: '1px solid rgba(58, 36, 23, 0.14)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '4px 9px',
              }}
            >
              {loc.categoryLabel}
            </span>
          )}

          {topRightSpec && (
            <span
              data-badge-kind="spec"
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
              {topRightSpec}
            </span>
          )}
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
        {loc.origin && (
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
            {loc.origin}
          </div>
        )}

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
          {loc.name}
        </h3>

        {/* Concise Short Description */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--color-body)',
            lineHeight: 1.55,
            marginBottom: '20px',
            flex: 1,
          }}
        >
          {loc.shortDesc || loc.desc}
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: 'auto',
          }}
        >
          <button
            type="button"
            onClick={handleQuote}
            data-quote-product-slug={product.slug}
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
            <span>
              {pick({
                vi: 'Nhận báo giá xuất khẩu',
                en: 'Request B2B Quote',
                ko: '수출 견적 요청',
                zh: '获取出口报价',
              })}
            </span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => onViewDetails(product)}
            data-detail-product-slug={product.slug}
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
            <span>
              {pick({
                vi: 'Xem thông số kỹ thuật',
                en: 'View Specifications',
                ko: '제품 규격 보기',
                zh: '查看技术规格',
              })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
