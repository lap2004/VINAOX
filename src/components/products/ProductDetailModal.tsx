import React, { useEffect, useRef } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Thermometer, Clock, Droplets } from 'lucide-react';
import { getProductLocalized, getProductSpecsLocalized, ProductItem } from '../../data/products';
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
  const { language, pick } = useLanguage();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (product) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => closeBtnRef.current?.focus(), 20);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (product && previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
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

  const loc = getProductLocalized(product, language);
  const specs = getProductSpecsLocalized(product.specs, language);
  const name = loc.name;
  const origin = loc.origin;
  const desc = loc.desc;
  const fullDesc = loc.features || loc.desc;

  const handleQuoteClick = () => {
    onClose();
    onRequestQuote(name);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className={product.ocop.includes('OCOP') ? 'badge badge-gold' : 'badge badge-green'}>
              {product.ocop.includes('OCOP') ? <Sparkles size={13} /> : <Check size={13} />}
              {product.ocop}
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--color-border)',
                color: 'var(--forest-green)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {loc.categoryLabel}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              • {origin}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-heading)',
              flexShrink: 0,
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
              gridTemplateColumns: 'minmax(240px, 1fr) 1.35fr',
              gap: '24px',
              marginBottom: '28px',
            }}
            className="product-modal-top-grid"
          >
            {/* Image Frame */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--soft-border)',
                backgroundColor: 'var(--soft-beige)',
                aspectRatio: '1/1',
                maxHeight: '280px',
              }}
            >
              <picture>
                <source srcSet={product.imageWebp} type="image/webp" />
                <img
                  src={product.imageJpg}
                  alt={name}
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
                  fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)',
                  color: 'var(--color-heading)',
                  marginBottom: '10px',
                  lineHeight: 1.25,
                }}
              >
                {name}
              </h2>

              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: 'var(--color-body)',
                  marginBottom: '14px',
                }}
              >
                {desc}
              </p>

              <p
                style={{
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  color: 'var(--dark-chocolate)',
                  backgroundColor: 'var(--brand-orange-soft)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(244, 168, 58, 0.35)',
                }}
              >
                {fullDesc}
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
                {pick({
                  vi: 'Bảng Thông Số Kỹ Thuật B2B (Export Spec Sheet)',
                  en: 'B2B Technical Specifications & Quality Parameters',
                  ko: 'B2B 수출 기술 규격서 (Export Spec Sheet)',
                  zh: 'B2B 出口技术规格与品质参数表'
                })}
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
                  <span>{pick({ vi: 'Độ ẩm hoàn thiện', en: 'Moisture Content', ko: '완제품 수분 함량', zh: '成品水分含量' })}</span>
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
                  <span>{pick({ vi: 'Độ ngọt tự nhiên', en: 'Natural Brix Degree', ko: '천연 당도 (Brix)', zh: '天然糖度 (Brix)' })}</span>
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
                  <span>{pick({ vi: 'Hạn sử dụng', en: 'Shelf Life', ko: '유통기한', zh: '保质期' })}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  {specs.shelfLife}
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
                  <span>{pick({ vi: 'Nhiệt độ sấy', en: 'Drying Technology', ko: '건조 가공 공법', zh: '干燥工艺技术' })}</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-heading)' }}>
                  {specs.process}
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
                {pick({ vi: '• Thành phần nguyên liệu: ', en: '• Ingredients: ', ko: '• 원재료 구성: ', zh: '• 原料成分：' })}
              </strong>
              <span>{specs.ingredients}</span>
            </div>

            <div>
              <strong style={{ color: 'var(--forest-green)' }}>
                {pick({ vi: '• Quy cách đóng gói B2B & Xuất khẩu: ', en: '• Export & Bulk Packaging: ', ko: '• B2B 및 수출용 포장 규격: ', zh: '• B2B 及出口包装规格：' })}
              </strong>
              <span>{specs.packaging}</span>
            </div>

            <div>
              <strong style={{ color: 'var(--forest-green)' }}>
                {pick({ vi: '• Tiêu chuẩn & Chứng nhận: ', en: '• Standards & Certifications: ', ko: '• 국제 표준 및 인증: ', zh: '• 执行标准与认证：' })}
              </strong>
              <span>{specs.certifications}</span>
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
              {pick({
                vi: 'Nhận mẫu thử nghiệm (Sample Kit) cho đối tác B2B quốc tế.',
                en: 'Free evaluation sample kit available for qualified buyers.',
                ko: '해외 B2B 바이어 대상 무료 평가용 샘플 키트를 제공합니다.',
                zh: '面向全球 B2B 采购商提供免费试吃评估样品套装。'
              })}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={onClose} size="sm">
              {pick({ vi: 'Đóng', en: 'Close', ko: '닫기', zh: '关闭' })}
            </Button>
            <Button
              variant="primary"
              onClick={handleQuoteClick}
              size="sm"
              icon={<ArrowRight size={14} />}
            >
              {pick({ vi: 'Yêu cầu báo giá dòng này', en: 'Request Product Quote', ko: '이 제품 견적 요청', zh: '询价此系列产品' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
