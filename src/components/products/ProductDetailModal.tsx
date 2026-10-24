import React, { useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Thermometer, Clock, Droplets } from 'lucide-react';
import { ProductItem } from '../../data/products';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';

export interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onRequestQuote: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestQuote,
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const isVi = language === 'vi';
  const info = isVi ? product.vi : product.en;
  const specs = product.specs;

  const handleQuoteClick = () => {
    onClose();
    onRequestQuote(info.name);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--cream-bg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-gold">
              <Sparkles size={13} />
              {product.ocop}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              • {info.origin}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-heading)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: 'clamp(20px, 3.5vw, 32px)',
            overflowY: 'auto',
            maxHeight: 'calc(85vh - 130px)',
          }}
        >
          {/* Top Info Grid: Image + Description */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 1fr) 1.25fr',
              gap: '28px',
              marginBottom: '28px',
            }}
            className="product-modal-top-grid"
          >
            {/* Image Frame */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                backgroundColor: '#F8FAF8',
                aspectRatio: '4/3',
              }}
            >
              <picture>
                <source srcSet={product.imageWebp} type="image/webp" />
                <img
                  src={product.imageJpg}
                  alt={info.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </picture>
            </div>

            {/* Title & Narrative */}
            <div>
              <h2
                id="product-modal-title"
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                  color: 'var(--color-heading)',
                  marginBottom: '10px',
                  lineHeight: 1.25,
                }}
              >
                {info.name}
              </h2>

              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: 'var(--color-body)',
                  marginBottom: '16px',
                }}
              >
                {info.desc}
              </p>

              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'var(--color-body-dark)',
                  backgroundColor: 'var(--light-sage)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                {info.features}
              </p>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--forest-green)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} />
              <span>
                {isVi
                  ? 'Bảng Thông Số Kỹ Thuật B2B (Export Spec Sheet)'
                  : 'B2B Technical Specifications & Quality Parameters'}
              </span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {/* Moisture */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--cream-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  <Droplets size={14} color="var(--primary-green)" />
                  <span>{isVi ? 'Độ ẩm hoàn thiện' : 'Moisture Content'}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  {specs.moisture}
                </div>
              </div>

              {/* Natural Sweetness Brix */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--cream-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  <Sparkles size={14} color="var(--primary-green)" />
                  <span>{isVi ? 'Độ ngọt tự nhiên' : 'Natural Brix Degree'}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  {specs.brix}
                </div>
              </div>

              {/* Shelf Life */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--cream-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  <Clock size={14} color="var(--primary-green)" />
                  <span>{isVi ? 'Hạn sử dụng' : 'Shelf Life'}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  {isVi ? specs.shelfLifeVi : specs.shelfLifeEn}
                </div>
              </div>

              {/* Drying Tech */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--cream-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  <Thermometer size={14} color="var(--primary-green)" />
                  <span>{isVi ? 'Nhiệt độ sấy' : 'Drying Technology'}</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-heading)' }}>
                  {isVi ? specs.processVi : specs.processEn}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Ingredients & Packaging */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#FAFAF7',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.86rem',
            }}
          >
            <div>
              <strong style={{ color: 'var(--forest-green)' }}>
                {isVi ? '• Thành phần nguyên liệu: ' : '• Ingredients: '}
              </strong>
              <span>{isVi ? specs.ingredientsVi : specs.ingredientsEn}</span>
            </div>

            <div>
              <strong style={{ color: 'var(--forest-green)' }}>
                {isVi ? '• Quy cách đóng gói B2B & Xuất khẩu: ' : '• Export & Bulk Packaging: '}
              </strong>
              <span>{isVi ? specs.packagingVi : specs.packagingEn}</span>
            </div>

            <div>
              <strong style={{ color: 'var(--forest-green)' }}>
                {isVi ? '• Tiêu chuẩn & Chứng nhận: ' : '• Standards & Certifications: '}
              </strong>
              <span>{isVi ? specs.certificationsVi : specs.certificationsEn}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} color="var(--primary-green)" />
            <span>
              {isVi
                ? 'Nhận mẫu thử nghiệm (Sample Kit) cho đối tác B2B quốc tế.'
                : 'Free evaluation sample kit available for qualified buyers.'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={onClose} size="sm">
              {isVi ? 'Đóng' : 'Close'}
            </Button>
            <Button
              variant="primary"
              onClick={handleQuoteClick}
              size="sm"
              icon={<ArrowRight size={14} />}
            >
              {isVi ? 'Yêu cầu báo giá dòng này' : 'Request Product Quote'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
