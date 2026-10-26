import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COMPANY_INFO } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const milestones = [
    {
      badge: t('aboutPage.timeline.y2018Badge'),
      title: t('aboutPage.timeline.y2018Title'),
      desc: t('aboutPage.timeline.y2018Desc'),
    },
    {
      badge: t('aboutPage.timeline.y2019Badge'),
      title: t('aboutPage.timeline.y2019Title'),
      desc: t('aboutPage.timeline.y2019Desc'),
    },
    {
      badge: t('aboutPage.timeline.y2021Badge'),
      title: t('aboutPage.timeline.y2021Title'),
      desc: t('aboutPage.timeline.y2021Desc'),
    },
    {
      badge: t('aboutPage.timeline.y2023Badge'),
      title: t('aboutPage.timeline.y2023Title'),
      desc: t('aboutPage.timeline.y2023Desc'),
    },
    {
      badge: t('aboutPage.timeline.y2024Badge'),
      title: t('aboutPage.timeline.y2024Title'),
      desc: t('aboutPage.timeline.y2024Desc'),
    },
    {
      badge: t('aboutPage.timeline.presentBadge'),
      title: t('aboutPage.timeline.presentTitle'),
      desc: t('aboutPage.timeline.presentDesc'),
    },
  ];

  const galleryItems = [
    {
      tag: t('aboutPage.gallery.card1Tag'),
      title: t('aboutPage.gallery.card1Title'),
      desc: t('aboutPage.gallery.card1Desc'),
      img: '/assets/images/news/fruit-processing.webp',
      imgFallback: '/assets/images/news/fruit-processing.jpg',
    },
    {
      tag: t('aboutPage.gallery.card2Tag'),
      title: t('aboutPage.gallery.card2Title'),
      desc: t('aboutPage.gallery.card2Desc'),
      img: '/assets/images/news/tet-oem-production.webp',
      imgFallback: '/assets/images/news/tet-oem-production.jpg',
    },
    {
      tag: t('aboutPage.gallery.card3Tag'),
      title: t('aboutPage.gallery.card3Title'),
      desc: t('aboutPage.gallery.card3Desc'),
      img: '/assets/images/news/mango-procurement.webp',
      imgFallback: '/assets/images/news/mango-procurement.jpg',
    },
  ];

  return (
    <div className="about-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'HỒ SƠ DOANH NGHIỆP • CÔNG TY TNHH VINAXO' : 'CORPORATE PROFILE • VINAXO COMPANY LIMITED'}
        titleLine1={isVi ? 'Hành Trình Gắn Bó Nông Sản' : 'Rooted in Vietnam,'}
        titleLine2={isVi ? '& Sứ Mệnh Vươn Tầm Toàn Cầu' : 'Growing for a Healthier World'}
        description={t('about.description')}
        breadcrumbCurrent={isVi ? 'Giới Thiệu' : 'About Us'}
        theme="cream"
      />

      {/* ========================================================================
          SECTION 1: COMPANY STORY & CORE METRICS (MATCHING HTML 3-COLUMN GRID)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="about-grid">
            {/* Column 1: Story & Mission */}
            <div className="about-story">
              <span className="section-label">{t('about.label')}</span>
              <h2 className="section-title">
                <span>{t('about.titleLine1')}</span><br />
                <em>{t('about.titleLine2')}</em>
              </h2>
              <p>{t('about.description')}</p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/contact" className="btn btn-primary">
                  <span>{isVi ? 'Liên Hệ Phòng Xuất Khẩu' : 'Contact Export Dept'}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Column 2: Visual Card */}
            <div className="about-visual-card">
              <picture>
                <source srcSet="/assets/images/about_vietnam.webp" type="image/webp" />
                <img
                  src="/assets/images/about_vietnam.jpg"
                  alt={isVi ? "Vùng trồng nông sản Đồng bằng sông Cửu Long" : "Lush karst mountains and river valleys in Vietnam"}
                  loading="lazy"
                  width={512}
                  height={300}
                />
              </picture>
              <div className="about-visual-overlay">
                <span className="overlay-tag">{t('about.imageOverlay.tag')}</span>
                <h3 className="overlay-title">
                  <span>{t('about.imageOverlay.line1')}</span><br />
                  <em>{t('about.imageOverlay.line2')}</em>
                </h3>
                <div className="overlay-divider"></div>
              </div>
            </div>

            {/* Column 3: 4 Verified Metrics */}
            <div className="about-metrics">
              <div className="metric-item">
                <span className="metric-number">{t('aboutPage.metrics.m1Num')}</span>
                <span className="metric-label">{t('aboutPage.metrics.m1Label')}</span>
                <span className="metric-note">{t('aboutPage.metrics.m1Note')}</span>
                <span className="metric-source">{t('aboutPage.metrics.m1Source')}</span>
              </div>

              <div className="metric-item">
                <span className="metric-number">{t('aboutPage.metrics.m2Num')}</span>
                <span className="metric-label">{t('aboutPage.metrics.m2Label')}</span>
                <span className="metric-note">{t('aboutPage.metrics.m2Note')}</span>
                <span className="metric-source">{t('aboutPage.metrics.m2Source')}</span>
              </div>

              <div className="metric-item">
                <span className="metric-number">{t('aboutPage.metrics.m3Num')}</span>
                <span className="metric-label">{t('aboutPage.metrics.m3Label')}</span>
                <span className="metric-note">{t('aboutPage.metrics.m3Note')}</span>
                <span className="metric-source">{t('aboutPage.metrics.m3Source')}</span>
              </div>

              <div className="metric-item">
                <span className="metric-number">{t('aboutPage.metrics.m4Num')}</span>
                <span className="metric-label">{t('aboutPage.metrics.m4Label')}</span>
                <span className="metric-note">{t('aboutPage.metrics.m4Note')}</span>
                <span className="metric-source">{t('aboutPage.metrics.m4Source')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: MILESTONES & HISTORY TIMELINE (MATCHING HTML 1:1)
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
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
            <span className="section-label">{t('aboutPage.timeline.label')}</span>
            <h2 className="section-title">
              {t('aboutPage.timeline.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('aboutPage.timeline.desc')}
            </p>
          </div>

          <div className="timeline-grid">
            {milestones.map((m, idx) => (
              <div key={idx} className="timeline-card">
                <span className="timeline-badge">{m.badge}</span>
                <h3 className="timeline-title">{m.title}</h3>
                <p className="timeline-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: INFRASTRUCTURE & PROCESSING CAPACITY (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="facility-overview-grid">
            <div>
              <span className="section-label">{t('aboutPage.infrastructure.label')}</span>
              <h2 className="section-title font-serif">
                {t('aboutPage.infrastructure.title')}
              </h2>
              <p className="section-desc" style={{ marginTop: '16px', marginBottom: '24px' }}>
                {t('aboutPage.infrastructure.desc')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-heading)', fontSize: '0.95rem' }}>
                      {t('aboutPage.infrastructure.feature1Title')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
                      {t('aboutPage.infrastructure.feature1Desc')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-heading)', fontSize: '0.95rem' }}>
                      {t('aboutPage.infrastructure.feature2Title')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
                      {t('aboutPage.infrastructure.feature2Desc')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-heading)', fontSize: '0.95rem' }}>
                      {t('aboutPage.infrastructure.feature3Title')}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
                      {t('aboutPage.infrastructure.feature3Desc')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
                <img
                  src="/assets/images/about_vietnam.jpg"
                  alt="VINAXO Tien Giang facility"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: GALLERY OF ENTERPRISE PHOTOGRAPHY
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
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
            <span className="section-label">{t('aboutPage.gallery.label')}</span>
            <h2 className="section-title">
              {t('aboutPage.gallery.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('aboutPage.gallery.desc')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            {galleryItems.map((g, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <picture>
                    <source srcSet={g.img} type="image/webp" />
                    <img
                      src={g.imgFallback}
                      alt={g.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--primary-green)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {g.tag}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: '10px' }}>
                    {g.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 5: LEADERSHIP (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }} id="leadership">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
            <span className="section-label">{t('leadership.label')}</span>
            <h2 className="section-title">
              {t('leadership.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('leadership.subtitle')}
            </p>
          </div>

          <div className="leadership-grid">
            {/* Nguyễn Anh Khoa */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--light-sage)', color: 'var(--forest-green)', fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                K
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '4px' }}>
                {COMPANY_INFO.leadership[0]?.name || 'Nguyễn Anh Khoa'}
              </h3>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('leadership.khoa.role')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('leadership.khoa.desc')}
              </p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                  {t('leadership.khoa.stamp')}
                </span>
              </div>
            </div>

            {/* Hoàng Thị Thu Thảo */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--light-sage)', color: 'var(--forest-green)', fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                T
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '4px' }}>
                {COMPANY_INFO.leadership[1]?.name || 'Hoàng Thị Thu Thảo'}
              </h3>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('leadership.thao.role')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('leadership.thao.desc')}
              </p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                  {t('leadership.thao.stamp')}
                </span>
              </div>
            </div>

            {/* Hoàng Mạnh Cường */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--light-sage)', color: 'var(--forest-green)', fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                C
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '4px' }}>
                {COMPANY_INFO.leadership[2]?.name || 'Hoàng Mạnh Cường'}
              </h3>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('leadership.cuong.role')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('leadership.cuong.desc')}
              </p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                  {t('leadership.cuong.stamp')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 6: CTA BANNER
          ======================================================================== */}
      <section className="subpage-section subpage-cta-section">
        <div className="container">
          <CorporateCTA
            eyebrow={isVi ? 'KẾT NỐI HỢP TÁC B2B' : 'B2B PARTNERSHIP'}
            title={isVi ? 'Đồng Hành Cùng VINAXO Nâng Tầm Nông Sản Việt' : 'Partner with VINAXO for Global Agricultural Growth'}
            description={
              isVi
                ? 'Nhà máy chế biến 4.000 m² tại Tiền Giang sẵn sàng cung ứng sản phẩm sấy dẻo xuất khẩu chất lượng cao và gia công nhãn riêng OEM cho đối tác toàn cầu.'
                : 'Our 4,000 m² processing facility in Tien Giang is ready to deliver export-grade dried fruits and OEM private labeling for global partners.'
            }
            primaryText={isVi ? 'Yêu Cầu Báo Giá Ngay' : 'Request Quotation'}
            onPrimaryClick={() => onOpenQuote()}
            secondaryText={isVi ? 'Liên Hệ Ban Lãnh Đạo' : 'Contact Leadership'}
            secondaryLink="/contact"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
