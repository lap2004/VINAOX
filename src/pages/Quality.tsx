import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ZoomIn } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COMPLIANCE_ITEMS, QUALITY_PROMISE_CARDS, BROCHURE_FAQS, ComplianceBadge } from '../data/brochureData';
import { PageHero } from '../components/ui/PageHero';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { CertificatePreviewModal } from '../components/ui/CertificatePreviewModal';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Quality: React.FC = () => {
  const { language, t } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';
  const [previewCert, setPreviewCert] = useState<ComplianceBadge | null>(null);

  const processSteps = [
    {
      num: '01',
      title: t('qualityPage.section1.step1Title'),
      desc: t('qualityPage.section1.step1Desc'),
    },
    {
      num: '02',
      title: t('qualityPage.section1.step2Title'),
      desc: t('qualityPage.section1.step2Desc'),
    },
    {
      num: '03',
      title: t('qualityPage.section1.step3Title'),
      desc: t('qualityPage.section1.step3Desc'),
    },
    {
      num: '04',
      title: t('qualityPage.section1.step4Title'),
      desc: t('qualityPage.section1.step4Desc'),
    },
    {
      num: '05',
      title: t('qualityPage.section1.step5Title'),
      desc: t('qualityPage.section1.step5Desc'),
    },
    {
      num: '06',
      title: t('qualityPage.section1.step6Title'),
      desc: t('qualityPage.section1.step6Desc'),
    },
  ];

  return (
    <div className="quality-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'TIÊU CHUẨN CHẤT LƯỢNG • BRCGS • ISO 22000 • HACCP' : 'QUALITY ASSURANCE • BRCGS • ISO 22000 • FDA'}
        title={t('pageBanners.quality.title') || (isVi ? 'Tiêu Chuẩn Chất Lượng & Quy Trình Chế Biến' : 'Quality Assurance & Processing Standards')}
        description={
          t('pageBanners.quality.subtitle') ||
          (isVi
            ? 'Kiểm soát an toàn thực phẩm nghiêm ngặt từ vùng trồng đến đóng gói vô trùng theo chuẩn BRCGS, ISO 22000, HACCP, SMETA, Kosher và Halal.'
            : 'Strict food safety controls from orchard sourcing to sterile cleanroom packaging under BRCGS, ISO 22000, HACCP, US FDA registration, SMETA, Kosher, and Halal.')
        }
        breadcrumbCurrent={isVi ? 'Chất Lượng & Sản Xuất' : 'Quality & Production'}
      />

      {/* ========================================================================
          SECTION 1: 6-STEP PRODUCTION WORKFLOW
          ======================================================================== */}
      <section className="subpage-section section-white">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto 48px auto' }}>
            <span className="section-label">{t('qualityPage.section1.label')}</span>
            <h2 className="section-title">
              {t('qualityPage.section1.title')}
            </h2>
            <p className="section-desc section-desc-center">
              {t('qualityPage.section1.desc')}
            </p>
          </div>

          <div className="process-steps-grid">
            {processSteps.map((s, idx) => (
              <div key={idx} className="process-step-card">
                <span className="process-step-num">{s.num}</span>
                <h3 className="process-step-title">{s.title}</h3>
                <p className="process-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: BROCHURE QUALITY PROMISE PILLARS & INFRASTRUCTURE
          ======================================================================== */}
      <section
        className="subpage-section section-cream"
        style={{
          borderTop: '1px solid var(--soft-border)',
          borderBottom: '1px solid var(--soft-border)',
        }}
      >
        <div className="container">
          <div className="facility-overview-grid">
            <div>
              <span className="section-label">
                {isVi ? 'NĂNG LỰC TỔ HỢP NHÀ MÁY' : 'FACILITY INFRASTRUCTURE'}
              </span>
              <h2 className="section-title">
                {isVi
                  ? 'Tổ Hợp Nhà Máy 25.000 M² Đạt Chuẩn Quốc Tế'
                  : '25,000 m² Integrated Food Processing Complex'}
              </h2>
              <p className="section-desc" style={{ marginTop: '14px' }}>
                {isVi
                  ? 'Tổ hợp sản xuất của VINAXO vận hành công suất 300 tấn thành phẩm mỗi tháng với khu sấy nhiệt thấp (~60°C), chiên chân không tách dầu ly tâm, kho lạnh bảo quản mùa vụ và khu đóng gói nhãn riêng OEM.'
                  : 'Vinaxo’s 25,000 m² manufacturing site delivers 300 tons monthly output across heat-pump low-temperature dehydrators, vacuum-frying centrifuge lines, temperature-controlled warehousing, and dedicated retail OEM packing rooms.'}
              </p>

              <div className="facility-stats-grid">
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)' }}>
                    300 t
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {isVi ? 'Sản lượng thành phẩm / tháng' : 'Monthly export capacity'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)' }}>
                    25,000 m²
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {isVi ? 'Tổng quy mô tổ hợp nhà máy' : 'Total factory area'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)' }}>
                    200 kg
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {isVi ? 'MOQ khởi điểm (tùy mặt hàng)' : 'Starter MOQ (SKU dependent)'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)' }}>
                    2–4 wks
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {isVi ? 'Thời gian giao hàng tiêu chuẩn' : 'Typical production lead time'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid var(--white)' }}>
                <picture>
                  <source srcSet="/assets/images/factory-2026/factory-featured.webp" type="image/webp" />
                  <img
                    src="/assets/images/factory-2026/factory-featured.jpg"
                    alt={isVi ? 'Phân xưởng sấy trái cây VINAXO 25.000 m²' : 'VINAXO 25,000 m² processing facility floor'}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* 3 Quality Promise Pillars */}
          <div style={{ marginTop: '64px' }}>
            <div className="quality-promise-grid">
              {QUALITY_PROMISE_CARDS.map((card) => (
                <div key={card.number} className="quality-promise-card">
                  <div className="promise-number">{card.number}</div>
                  <h3 className="promise-title">{isVi ? card.titleVi : card.titleEn}</h3>
                  <p className="promise-desc">{isVi ? card.descVi : card.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: OFFICIAL BROCHURE 2026 CERTIFICATIONS & SCANNED AUDITS (PAGE 4)
          ======================================================================== */}
      <section id="certificates" className="subpage-section section-white">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <span className="section-label">
              {isVi ? 'CHỨNG NHẬN • ĐĂNG KÝ • KIỂM TOÁN' : 'QUALITY & COMPLIANCE'}
            </span>
            <h2 className="section-title">
              {isVi
                ? 'Hồ Sơ Chứng Nhận & Kiểm Toán Quốc Tế'
                : 'CERTIFICATIONS & AUDITED COMPLIANCE'}
            </h2>
            <p className="section-desc section-desc-center">
              {isVi
                ? 'Danh mục 8 tiêu chuẩn chính thức từ Vinaxo Brochure 2026 (bao gồm bản chụp chứng nhận thực tế và phạm vi kiểm toán minh bạch).'
                : 'Official 2026 compliance portfolio showcasing scanned certificates, facility registration, and independent audit verifications.'}
            </p>
          </div>

          <div className="certifications-grid-4">
            {COMPLIANCE_ITEMS.filter((item) => item.id !== 'costco').map((item) => {
              const kindClass =
                item.kindEn === 'Certification'
                  ? 'trust-kind-cert'
                  : item.kindEn === 'Registration'
                  ? 'trust-kind-reg'
                  : 'trust-kind-audit';
              return (
                <div key={item.id} className="cert-scan-card">
                  {item.certImageWebp ? (
                    <button
                      type="button"
                      onClick={() => setPreviewCert(item)}
                      className="cert-scan-thumb-wrap"
                      style={{ width: '100%', padding: 0, cursor: 'zoom-in' }}
                      aria-label={`Inspect ${item.name} certificate image`}
                    >
                      <picture style={{ width: '100%', height: '100%' }}>
                        <source srcSet={item.certImageWebp} type="image/webp" />
                        <img
                          src={item.certImageJpg}
                          alt={`${item.name} — VINAXO`}
                          loading="lazy"
                        />
                      </picture>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(58, 36, 23, 0.85)',
                          color: '#FFFFFF',
                          borderRadius: '999px',
                          padding: '4px 8px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ZoomIn size={12} />
                        {isVi ? 'Xem lớn' : 'Preview'}
                      </span>
                    </button>
                  ) : (
                    <div className="cert-scan-thumb-wrap" style={{ padding: '6px', backgroundColor: 'transparent', border: 'none' }}>
                      <div className="cert-halal-placeholder">
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.85rem',
                            fontWeight: 700,
                            color: '#2D4E32',
                            letterSpacing: '0.05em',
                          }}
                        >
                          HALAL
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#50433B', marginTop: '4px' }}>
                          {isVi ? 'Hồ sơ chứng nhận Halal' : 'Certificate copy on request'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className={`trust-badge-kind ${kindClass}`} style={{ alignSelf: 'flex-start', marginBottom: '6px' }}>
                      {isVi ? item.kindVi : item.kindEn}
                    </span>
                    <h3 className="cert-title" style={{ fontSize: '1.15rem', marginBottom: '4px' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.4, margin: 0 }}>
                      {isVi ? item.scopeVi : item.scopeEn}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Card 8: Brochure Page 4 "8 INTERNATIONAL STANDARDS" + Costco GMP Audit Dark Summary Card */}
            <div className="standards-summary-card">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: 'var(--brand-orange)',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {isVi ? '8 TIÊU CHUẨN QUỐC TẾ' : '8 INTERNATIONAL STANDARDS'}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 247, 236, 0.9)', lineHeight: 1.5, marginBottom: '12px' }}>
                {isVi
                  ? 'Bao gồm chứng nhận Costco GMP Audit và toàn bộ hồ sơ kiểm định chất lượng cung ứng cho các chuỗi siêu thị quốc tế.'
                  : 'Including Costco GMP Audit & verified supply-chain dossier. Full certificate copies available on request.'}
              </p>
              <button
                type="button"
                onClick={() => onOpenQuote('Full 8 International Standards Certificate Pack')}
                className="btn btn-primary btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
              >
                {isVi ? 'Yêu cầu trọn bộ bản sao' : 'Request Certificate Pack'}
              </button>
            </div>
          </div>

          {/* Transparency Compliance Note */}
          <div
            style={{
              marginTop: '40px',
              backgroundColor: 'var(--brand-bg)',
              border: '1px solid var(--soft-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
            }}
          >
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--dark-chocolate)', marginBottom: '8px' }}>
              {isVi ? 'Cam kết minh bạch hồ sơ kiểm định:' : 'Documentation & Audit Transparency:'}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
              {isVi
                ? 'Các giấy chứng nhận BRCGS Food Safety (SGS), ISO 22000:2018 (TQC), HACCP (TQC), đăng ký US FDA, Kosher (OU), chứng nhận Halal cùng báo cáo kiểm toán SMETA (Sedex v6.1) và Costco GMP Audit được cung cấp bản đầy đủ theo yêu cầu từng đối tác.'
                : 'Current scope certificates for BRCGS Food Safety (SGS), ISO 22000:2018 (TQC), HACCP (TQC), US FDA facility registration, Kosher (OU), Halal compliance, plus SMETA (Sedex v6.1) and Costco GMP audit documentation are available in full upon qualified buyer request.'}
            </p>
          </div>

          {/* Brochure Page 4 — Frequently Asked Questions */}
          <div style={{ marginTop: '72px', paddingTop: '56px', borderTop: '1px solid var(--soft-border)' }}>
            <span className="section-label">
              {isVi ? 'CÂU HỎI THƯỜNG GẶP' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h3
              className="title-display"
              style={{
                fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                color: 'var(--dark-chocolate)',
                textTransform: 'uppercase',
                marginBottom: '28px',
              }}
            >
              {isVi ? 'Giải Đáp Hợp Tác & Đặt Hàng B2B' : 'BROCHURE QUICK ANSWERS FOR BUYERS'}
            </h3>
            <div className="faq-grid-2">
              {BROCHURE_FAQS.map((faq) => (
                <div key={faq.id}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--vinaxo-red)', marginBottom: '6px' }}>
                    {isVi ? faq.qVi : faq.qEn}
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                    {isVi ? faq.aVi : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for High-Res Scanned Certificate Preview */}
      <CertificatePreviewModal
        certificate={previewCert}
        isVi={isVi}
        onClose={() => setPreviewCert(null)}
      />

      {/* ========================================================================
          SECTION 4: QUALITY CALL TO ACTION
          ======================================================================== */}
      <section className="subpage-section subpage-cta-section section-white">
        <div className="container">
          <CorporateCTA
            eyebrow={isVi ? 'ĐĂNG KÝ THAM QUAN NHÀ MÁY & GỬI MẪU' : 'FACILITY AUDIT & SAMPLE KIT'}
            title={t('qualityPage.section4.title')}
            description={t('qualityPage.section4.desc')}
            primaryText={t('qualityPage.section4.btnPrimary')}
            onPrimaryClick={() => onOpenQuote('Quality Dossier & Pre-Shipment Sample')}
            secondaryText={t('qualityPage.section4.btnSecondary')}
            secondaryLink="/contact"
          />
        </div>
      </section>
    </div>
  );
};

export default Quality;
