import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PageHero } from '../components/ui/PageHero';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Quality: React.FC = () => {
  const { language, t } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

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
        badge={isVi ? 'TIÊU CHUẨN CHẤT LƯỢNG • BRCGS & OCOP' : 'QUALITY ASSURANCE • BRCGS & OCOP'}
        titleLine1={isVi ? 'Tiêu Chuẩn Chất Lượng' : 'Quality Standards &'}
        titleLine2={isVi ? '& Quy Trình Sản Xuất' : 'Closed Manufacturing Process'}
        description={t('qualityPage.section1.desc')}
        breadcrumbCurrent={isVi ? 'Chất Lượng & Sản Xuất' : 'Quality & Production'}
        theme="cream"
      />

      {/* ========================================================================
          SECTION 1: 6-STEP PRODUCTION & QUALITY WORKFLOW (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <span className="section-label">{t('qualityPage.section1.label')}</span>
            <h2 className="section-title">
              {t('qualityPage.section1.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
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
          SECTION 2: FACILITY & PROCESSING INFRASTRUCTURE (MATCHING HTML 1:1)
          ======================================================================== */}
      <section
        className="subpage-section"
        style={{
          backgroundColor: 'var(--cream-bg)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div className="container">
          <div className="facility-overview-grid">
            <div>
              <span className="section-label">{t('qualityPage.section2.label')}</span>
              <h2 className="section-title font-serif">
                {t('qualityPage.section2.title')}
              </h2>
              <p className="section-desc" style={{ marginTop: '16px' }}>
                {t('qualityPage.section2.desc')}
              </p>

              <div className="facility-stats-grid">
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'var(--font-serif)' }}>
                    {t('qualityPage.section2.stat1Val')}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#55635C', marginTop: '4px' }}>
                    {t('qualityPage.section2.stat1Label')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--forest-green)', fontFamily: 'var(--font-serif)' }}>
                    {t('qualityPage.section2.stat2Val')}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#55635C', marginTop: '4px' }}>
                    {t('qualityPage.section2.stat2Label')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                    {t('qualityPage.section2.stat3Val')}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#55635C', marginTop: '4px' }}>
                    {t('qualityPage.section2.stat3Label')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                    {t('qualityPage.section2.stat4Val')}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#55635C', marginTop: '4px' }}>
                    {t('qualityPage.section2.stat4Label')}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#76857D', marginTop: '24px', fontStyle: 'italic' }}>
                {t('qualityPage.section2.sourceNote')}
              </p>
            </div>

            <div>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
                <img
                  src="/assets/images/about_vietnam.jpg"
                  alt={isVi ? "Cơ sở chế biến VINAXO và vùng nguyên liệu Tiền Giang" : "VINAXO Tien Giang facility and agricultural sourcing hubs"}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: VERIFIED CERTIFICATIONS & AUDITED STANDARDS (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px auto' }}>
            <span className="section-label">{t('qualityPage.section3.label')}</span>
            <h2 className="section-title font-serif">
              {t('qualityPage.section3.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('qualityPage.section3.desc')}
            </p>
          </div>

          <div className="certifications-grid-4">
            {/* BRCGS */}
            <div className="cert-card">
              <div className="cert-header-row">
                <div className="cert-status-badge">
                  <span className="badge-dot"></span>
                  <span>{t('qualityPage.section3.brcgsBadge')}</span>
                </div>
                <div className="cert-emblem-icon" aria-hidden="true">
                  <Award size={20} />
                </div>
              </div>
              <h3 className="cert-title font-serif">{t('qualityPage.section3.brcgsTitle')}</h3>
              <p className="cert-subtitle">{t('qualityPage.section3.brcgsSub')}</p>
              <p className="cert-desc">{t('qualityPage.section3.brcgsDesc')}</p>
              <div className="cert-footer-meta">
                <CheckCircle2 size={13} />
                <span>{isVi ? 'Phạm vi kiểm xưởng được công nhận' : 'Accredited Factory Audit Scope'}</span>
              </div>
            </div>

            {/* OCOP 3 Star */}
            <div className="cert-card">
              <div className="cert-header-row">
                <div className="cert-status-badge">
                  <span className="badge-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                  <span>{t('qualityPage.section3.ocopBadge')}</span>
                </div>
                <div className="cert-emblem-icon" aria-hidden="true">
                  <Sparkles size={20} color="#D4A373" />
                </div>
              </div>
              <h3 className="cert-title font-serif">{t('qualityPage.section3.ocopTitle')}</h3>
              <p className="cert-subtitle">{t('qualityPage.section3.ocopSub')}</p>
              <p className="cert-desc">{t('qualityPage.section3.ocopDesc')}</p>
              <div className="cert-footer-meta">
                <CheckCircle2 size={13} />
                <span>{isVi ? 'UBND Tỉnh Tiền Giang chứng nhận' : 'Tien Giang Provincial Recognition'}</span>
              </div>
            </div>

            {/* BSCI & ESG */}
            <div className="cert-card">
              <div className="cert-header-row">
                <div className="cert-status-badge">
                  <span className="badge-dot" style={{ backgroundColor: '#2563EB' }}></span>
                  <span>{t('qualityPage.section3.bsciBadge')}</span>
                </div>
                <div className="cert-emblem-icon" aria-hidden="true">
                  <ShieldCheck size={20} color="#2563EB" />
                </div>
              </div>
              <h3 className="cert-title font-serif">{t('qualityPage.section3.bsciTitle')}</h3>
              <p className="cert-subtitle">{t('qualityPage.section3.bsciSub')}</p>
              <p className="cert-desc">{t('qualityPage.section3.bsciDesc')}</p>
              <div className="cert-footer-meta">
                <CheckCircle2 size={13} />
                <span>{isVi ? 'Trách nhiệm xã hội & Thích ứng EUDR' : 'EUDR & Social Responsibility'}</span>
              </div>
            </div>

            {/* Clean Label 100% Natural */}
            <div className="cert-card">
              <div className="cert-header-row">
                <div className="cert-status-badge">
                  <span className="badge-dot"></span>
                  <span>{t('qualityPage.section3.cleanBadge')}</span>
                </div>
                <div className="cert-emblem-icon" aria-hidden="true">
                  <CheckCircle2 size={20} color="var(--primary-green)" />
                </div>
              </div>
              <h3 className="cert-title font-serif">{t('qualityPage.section3.cleanTitle')}</h3>
              <p className="cert-subtitle">{t('qualityPage.section3.cleanSub')}</p>
              <p className="cert-desc">{t('qualityPage.section3.cleanDesc')}</p>
              <div className="cert-footer-meta">
                <CheckCircle2 size={13} />
                <span>{isVi ? '100% Tự nhiên, không chất bảo quản' : '100% Natural, Preservative Free'}</span>
              </div>
            </div>
          </div>

          {/* Transparency Compliance Note */}
          <div
            style={{
              marginTop: '40px',
              backgroundColor: '#F6FAF7',
              border: '1px solid #DDE8E1',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
              {t('qualityPage.section3.transparencyTitle')}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#55665D', lineHeight: 1.6, margin: 0 }}>
              {t('qualityPage.section3.transparencyText')}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: QUALITY CALL TO ACTION
          ======================================================================== */}
      <section className="subpage-section subpage-cta-section">
        <div className="container">
          <CorporateCTA
            eyebrow={isVi ? 'ĐĂNG KÝ THAM QUAN NHÀ MÁY' : 'FACILITY AUDIT & SITE VISIT'}
            title={t('qualityPage.section4.title')}
            description={t('qualityPage.section4.desc')}
            primaryText={t('qualityPage.section4.btnPrimary')}
            onPrimaryClick={() => onOpenQuote()}
            secondaryText={t('qualityPage.section4.btnSecondary')}
            secondaryLink="/contact"
          />
        </div>
      </section>
    </div>
  );
};

export default Quality;
