import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Clock,
  Droplets,
  Package,
  Scale,
  ShieldCheck,
  Sparkles,
  Thermometer,
  X,
} from 'lucide-react';
import {
  CertificationScopeType,
  getProductFeatureLabel,
  getProductLocalized,
  getProductSpecsLocalized,
  ProductCertificationRef,
  ProductItem,
} from '../../data/products';
import { type QuotationProduct } from '../contact/contactSchema';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';

export interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onRequestQuote: (target: QuotationProduct | string) => void;
}

function getScopeLabel(
  scopeType: CertificationScopeType,
  pick: <T>(map: { vi: T; en: T; ko?: T; zh?: T }) => T
): string {
  if (scopeType === 'product') {
    return pick({
      vi: 'Chứng nhận sản phẩm',
      en: 'Product Certification',
      ko: '제품 인증',
      zh: '产品认证',
    });
  }
  if (scopeType === 'management-system') {
    return pick({
      vi: 'Chứng nhận hệ thống',
      en: 'Management System',
      ko: '경영시스템 인증',
      zh: '管理体系认证',
    });
  }
  if (scopeType === 'registration') {
    return pick({
      vi: 'Đăng ký cơ sở',
      en: 'Facility Registration',
      ko: '시설 등록',
      zh: '企业注册',
    });
  }
  if (scopeType === 'audit') {
    return pick({
      vi: 'Đánh giá kiểm toán',
      en: 'Independent Audit',
      ko: '제3자 감사',
      zh: '独立审核',
    });
  }
  return pick({
    vi: 'Chứng nhận cơ sở',
    en: 'Facility Certification',
    ko: '시설 인증',
    zh: '工厂认证',
  });
}

function getCertLocalizedFields(
  cert: ProductCertificationRef,
  lang: 'vi' | 'en' | 'ko' | 'zh-CN'
): { name: string; scope: string } {
  if (lang === 'vi') {
    return { name: cert.nameVi || cert.nameEn, scope: cert.scopeVi || cert.scopeEn };
  }
  if (lang === 'ko') {
    return { name: cert.nameKo || cert.nameEn, scope: cert.scopeKo || cert.scopeEn };
  }
  if (lang === 'zh-CN') {
    return { name: cert.nameZh || cert.nameEn, scope: cert.scopeZh || cert.scopeEn };
  }
  return { name: cert.nameEn || cert.nameVi, scope: cert.scopeEn || cert.scopeVi };
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
  const overviewNarrative = (loc.desc || loc.shortDesc || '').trim();
  const extraHighlight = (loc.highlight || '').trim();
  const featureItems = loc.productFeatures
    .map((f) => getProductFeatureLabel(f, language))
    .filter(Boolean);

  const hasIngredientsOrFeatures = Boolean(specs.ingredients || specs.process || featureItems.length > 0);
  const hasTechSpecs = Boolean(specs.moisture || specs.brix || specs.sizeOrWeight);
  const hasPackaging = Boolean(specs.packaging);
  const hasStorageOrShelfLife = Boolean(specs.shelfLife || specs.storage);

  const handleQuoteClick = () => {
    onClose();
    onRequestQuote({
      productId: product.id,
      productSlug: product.slug,
      categoryId: product.category,
    });
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
        className="modal-content product-detail-modal"
        data-product-slug={product.slug}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '840px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: 'var(--cream-bg)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--color-border)',
                color: 'var(--forest-green)',
                fontSize: '0.76rem',
                fontWeight: 700,
              }}
            >
              {loc.categoryLabel}
            </span>

            {loc.productCertifications.map((cert) => {
              const cf = getCertLocalizedFields(cert, language);
              return (
                <span key={cert.certificateId} className="badge badge-gold">
                  <Award size={12} aria-hidden="true" />
                  {cf.name}
                </span>
              );
            })}

            {loc.origin && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                • {loc.origin}
              </span>
            )}
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={pick({ vi: 'Đóng cửa sổ chi tiết', en: 'Close dialog', ko: '닫기', zh: '关闭' })}
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

        {/* Scrollable Modal Body */}
        <div
          className="product-detail-modal-body"
          style={{
            padding: 'clamp(18px, 3.2vw, 28px)',
            overflowY: 'auto',
            maxHeight: 'calc(86vh - 132px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
          {/* A. Thông tin tổng quan */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 1fr) 1.4fr',
              gap: '22px',
              alignItems: 'start',
            }}
            className="product-modal-top-grid"
          >
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--soft-border)',
                backgroundColor: 'var(--soft-beige)',
                aspectRatio: '1/1',
                maxHeight: '260px',
              }}
            >
              <picture>
                <source srcSet={product.imageWebp} type="image/webp" />
                <img
                  src={product.imageJpg}
                  alt={loc.imageAlt || loc.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </picture>
            </div>

            <div data-testid="modal-overview-section">
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--primary-green)',
                  marginBottom: '6px',
                }}
              >
                {pick({
                  vi: 'A. Thông tin tổng quan',
                  en: 'A. Product Overview',
                  ko: 'A. 제품 개요',
                  zh: 'A. 产品概览',
                })}
              </div>

              <h2
                id="product-modal-title"
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)',
                  color: 'var(--color-heading)',
                  marginBottom: '10px',
                  lineHeight: 1.25,
                }}
              >
                {loc.name}
              </h2>

              {overviewNarrative && (
                <p
                  data-testid="modal-overview-narrative"
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                    color: 'var(--color-body)',
                    marginBottom: extraHighlight ? '12px' : 0,
                  }}
                >
                  {overviewNarrative}
                </p>
              )}

              {extraHighlight && (
                <p
                  data-testid="modal-overview-highlight"
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.58,
                    color: 'var(--dark-chocolate)',
                    backgroundColor: 'var(--brand-orange-soft)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(244, 168, 58, 0.35)',
                    margin: 0,
                  }}
                >
                  {extraHighlight}
                </p>
              )}
            </div>
          </div>

          {/* B. Thành phần và đặc tính */}
          {hasIngredientsOrFeatures && (
            <section
              data-testid="modal-ingredients-features"
              style={{
                padding: '16px 18px',
                backgroundColor: '#FAFAF7',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <h3
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--forest-green)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {pick({
                  vi: 'B. Thành phần & Đặc tính sản phẩm',
                  en: 'B. Ingredients & Product Features',
                  ko: 'B. 원재료 및 제품 특성',
                  zh: 'B. 原料成分与产品特点',
                })}
              </h3>

              {specs.ingredients && (
                <div style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                  <strong style={{ color: 'var(--dark-chocolate)' }}>
                    {pick({ vi: 'Thành phần: ', en: 'Ingredients: ', ko: '원재료 구성: ', zh: '配料成分：' })}
                  </strong>
                  <span>{specs.ingredients}</span>
                </div>
              )}

              {specs.process && (
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--color-body)',
                    lineHeight: 1.55,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                  }}
                >
                  <Thermometer size={15} color="var(--primary-green)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--dark-chocolate)' }}>
                      {pick({ vi: 'Công nghệ chế biến: ', en: 'Processing Method: ', ko: '가공 공법: ', zh: '加工工艺：' })}
                    </strong>
                    <span>{specs.process}</span>
                  </div>
                </div>
              )}

              {featureItems.length > 0 && (
                <div style={{ marginTop: '2px' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--color-muted)',
                      marginBottom: '6px',
                    }}
                  >
                    {pick({
                      vi: 'Đặc tính sản phẩm (khác với chứng nhận):',
                      en: 'Product Attributes (separate from certifications):',
                      ko: '제품 특성 (인증과 구분):',
                      zh: '产品属性（与资质认证区分）：',
                    })}
                  </div>
                  <div
                    data-testid="modal-product-features"
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                  >
                    {featureItems.map((label, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--soft-border)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--dark-chocolate)',
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* C. Thông số kỹ thuật */}
          {hasTechSpecs && (
            <section data-testid="modal-tech-specs">
              <h3
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--forest-green)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <ShieldCheck size={16} />
                <span>
                  {pick({
                    vi: 'C. Thông số kỹ thuật (Spec Sheet)',
                    en: 'C. Technical Specifications',
                    ko: 'C. 기술 규격',
                    zh: 'C. 技术规格参数',
                  })}
                </span>
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '10px',
                }}
              >
                {specs.moisture && (
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
                      <span>{pick({ vi: 'Độ ẩm tiêu chuẩn', en: 'Moisture Content', ko: '수분 함량', zh: '水分含量' })}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                      {specs.moisture}
                    </div>
                  </div>
                )}

                {specs.brix && (
                  <div
                    data-testid="modal-brix-card"
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--cream-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                      <Sparkles size={14} color="var(--primary-green)" />
                      <span>{pick({ vi: 'Độ Brix', en: 'Brix Degree', ko: '당도 (Brix)', zh: '糖度 (Brix)' })}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                      {specs.brix}
                    </div>
                  </div>
                )}

                {specs.sizeOrWeight && (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--cream-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                      <Scale size={14} color="var(--primary-green)" />
                      <span>{pick({ vi: 'Kích thước / Phân cỡ', en: 'Size / Grading', ko: '규격 / 사이즈', zh: '尺寸 / 分级规格' })}</span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                      {specs.sizeOrWeight}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* D & E Grid: Packaging + Shelf life & Storage */}
          {(hasPackaging || hasStorageOrShelfLife) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {hasPackaging && (
                <section
                  data-testid="modal-packaging-section"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--forest-green)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Package size={14} />
                    <span>
                      {pick({
                        vi: 'D. Quy cách đóng gói',
                        en: 'D. Packaging Formats',
                        ko: 'D. 포장 규격',
                        zh: 'D. 包装规格',
                      })}
                    </span>
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                    {specs.packaging}
                  </p>
                </section>
              )}

              {hasStorageOrShelfLife && (
                <section
                  data-testid="modal-storage-section"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--forest-green)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Clock size={14} />
                    <span>
                      {pick({
                        vi: 'E. Bảo quản & Hạn sử dụng',
                        en: 'E. Storage & Shelf Life',
                        ko: 'E. 보관 및 유통기한',
                        zh: 'E. 储存条件与保质期',
                      })}
                    </span>
                  </h3>
                  {specs.shelfLife && (
                    <div style={{ fontSize: '0.86rem', color: 'var(--dark-chocolate)', fontWeight: 700, marginBottom: '4px' }}>
                      {pick({ vi: 'Hạn sử dụng: ', en: 'Shelf Life: ', ko: '유통기한: ', zh: '保质期：' })}
                      {specs.shelfLife}
                    </div>
                  )}
                  {specs.storage && (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.5 }}>
                      {specs.storage}
                    </p>
                  )}
                </section>
              )}
            </div>
          )}

          {/* F. Chứng nhận và tài liệu */}
          <section
            data-testid="modal-certifications"
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--cream-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--forest-green)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Award size={15} />
              <span>
                {pick({
                  vi: 'F. Chứng nhận sản phẩm & Tài liệu kỹ thuật',
                  en: 'F. Product Certifications & Compliance Dossiers',
                  ko: 'F. 제품 인증 및 품질 문서',
                  zh: 'F. 产品认证与合规资料',
                })}
              </span>
            </h3>

            {loc.productCertifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                {loc.productCertifications.map((cert) => {
                  const cf = getCertLocalizedFields(cert, language);
                  return (
                    <div
                      key={cert.certificateId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        flexWrap: 'wrap',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(244, 168, 58, 0.35)',
                      }}
                    >
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--dark-chocolate)' }}>
                        {cf.name}
                      </div>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#FBEBC9',
                          color: '#3A2417',
                        }}
                      >
                        {getScopeLabel(cert.scopeType, pick)} — {cf.scope}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ margin: '0 0 8px 0', fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                {pick({
                  vi: 'Chưa gán chứng nhận riêng cho sản phẩm này. Hồ sơ hệ thống an toàn thực phẩm của nhà máy và kiểm nghiệm lô hàng (COA) được cung cấp theo yêu cầu.',
                  en: 'No product-specific certification is currently assigned individually. Facility-level food safety dossiers and batch COA records are available upon request.',
                  ko: '개별 품목 인증은 별도 표기되어 있지 않으며, 제조 공장 식품안전 인증 및 로트별 COA 자료는 요청 시 제공됩니다.',
                  zh: '该单品暂无单独列示的产品认证，工厂级别食品安全体系资质及批次 COA 检测报告可按需提供。',
                })}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.82rem' }}>
              <Link
                to="/quality#certificates"
                onClick={onClose}
                style={{ color: 'var(--forest-green)', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ShieldCheck size={14} />
                {pick({
                  vi: 'Xem hồ sơ chứng nhận nhà máy & kiểm toán',
                  en: 'View Facility Certifications & Audits',
                  ko: '공장 인증 및 감사 현황 보기',
                  zh: '查看工厂体系认证与审核',
                })}
              </Link>
              <Link
                to="/brochure"
                onClick={onClose}
                style={{ color: 'var(--dark-chocolate)', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <BookOpen size={14} />
                {pick({
                  vi: 'Xem Brochure & Catalogue 2026',
                  en: 'View 2026 Company Brochure',
                  ko: '2026 기업 브로슈어 보기',
                  zh: '浏览 2026 企业画册',
                })}
              </Link>
            </div>
          </section>
        </div>

        {/* G. Hành động (Sticky Modal Footer) */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={15} color="var(--primary-green)" />
            <span>
              {pick({
                vi: 'Hỗ trợ mẫu thử B2B & COA theo từng lô.',
                en: 'B2B evaluation samples & lot COA available.',
                ko: 'B2B 샘플 및 로트별 COA 지원.',
                zh: '支持 B2B 样品申请及批次 COA 报告。',
              })}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={onClose} size="sm">
              {pick({ vi: 'Đóng', en: 'Close', ko: '닫기', zh: '关闭' })}
            </Button>
            <Link
              to={`/contact?product=${encodeURIComponent(product.slug)}`}
              onClick={onClose}
              className="btn btn-outline"
              style={{
                padding: '6px 14px',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-pill)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {pick({ vi: 'Liên hệ VINAXO', en: 'Contact VINAXO', ko: 'VINAXO 문의', zh: '联系 VINAXO' })}
            </Link>
            <Button
              variant="primary"
              onClick={handleQuoteClick}
              size="sm"
              data-testid="modal-request-quote-btn"
              icon={<ArrowRight size={14} />}
            >
              {pick({
                vi: 'Nhận báo giá sản phẩm này',
                en: 'Request Product Quote',
                ko: '이 제품 견적 요청',
                zh: '询价此产品',
              })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
