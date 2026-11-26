import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COMPANY_INFO, getLegalCompanyName } from '../data/company';
import { BROCHURE_DOCUMENT, resolveBrochureDocumentForLang } from '../data/brochureData';
import { PageHero } from '../components/ui/PageHero';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const About: React.FC = () => {
  const { language, t, pick } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const legalName = getLegalCompanyName(language);
  const brochureInfo = resolveBrochureDocumentForLang(language);

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
      tag: pick({
        vi: 'TỔ HỢP NHÀ MÁY 25.000 M²',
        en: '25,000 M² FACILITY COMPLEX',
        ko: '25,000 m² 통합 가공 공장',
        zh: '25,000 平方米现代化工厂'
      }),
      title: t('aboutPage.gallery.card1Title'),
      desc: t('aboutPage.gallery.card1Desc'),
      img: '/assets/images/factory-2026/factory-featured.webp',
      imgFallback: '/assets/images/factory-2026/factory-featured.jpg',
    },
    {
      tag: pick({
        vi: 'XẾP KHAY & SẤY VÔ TRÙNG',
        en: 'HYGIENIC TRAY RACKING',
        ko: '위생 트레이 적재 및 저온 건조',
        zh: '无尘摆盘与卫生烘干工段'
      }),
      title: t('aboutPage.gallery.card2Title'),
      desc: t('aboutPage.gallery.card2Desc'),
      img: '/assets/images/factory-2026/factory-sub-1.webp',
      imgFallback: '/assets/images/factory-2026/factory-sub-1.jpg',
    },
    {
      tag: pick({
        vi: 'HỆ THỐNG KHAY SẤY & SƠ CHẾ',
        en: 'DRYING & WASHING INFRASTRUCTURE',
        ko: '산업용 건조 설비 및 원료 세척',
        zh: '多层烘干通道与鲜果清洗线'
      }),
      title: t('aboutPage.gallery.card3Title'),
      desc: t('aboutPage.gallery.card3Desc'),
      img: '/assets/images/factory-2026/factory-sub-2.webp',
      imgFallback: '/assets/images/factory-2026/factory-sub-2.jpg',
    },
  ];

  return (
    <div className="about-page">
      {/* Page Hero */}
      <PageHero
        badge={pick({
          vi: `HỒ SƠ DOANH NGHIỆP • ${legalName}`,
          en: `CORPORATE PROFILE • ${legalName}`,
          ko: `기업 프로필 • ${legalName}`,
          zh: `企业简介 • ${legalName}`
        })}
        title={t('pageBanners.about.title') || pick({
          vi: 'Về Công Ty TNHH VINAXO',
          en: `About ${legalName}`,
          ko: 'VINAXO 기업 소개',
          zh: '关于 VINAXO'
        })}
        description={
          t('pageBanners.about.subtitle') ||
          pick({
            vi: 'Doanh nghiệp chế biến và xuất khẩu trái cây sấy tự nhiên từ đồng bằng sông Cửu Long, nâng tầm nông sản Việt với tiêu chuẩn an toàn thực phẩm quốc tế.',
            en: 'Pioneering premium Vietnamese dried fruits from the fertile Mekong Delta to world tables, built upon direct farmer partnerships and BRCGS food safety excellence.',
            ko: '비옥한 메콩 델타산 열대 과일을 원료로 국제 BRCGS 식품안전 기준과 직영 농가 파트너십 기반의 프리미엄 건조 과일을 생산·수출하는 기업입니다.',
            zh: '扎根物产丰饶的湄公河三角洲，携手果农直采优质鲜果并遵循 BRCGS 国际食品安全标准，致力将越南天然热带果干推向全球餐桌。'
          })
        }
        breadcrumbCurrent={pick({ vi: 'Giới Thiệu', en: 'About Us', ko: '회사 소개', zh: '关于我们' })}
      />

      {/* ========================================================================
          SECTION 1: COMPANY STORY & CORE METRICS (MATCHING HTML 3-COLUMN GRID)
          ======================================================================== */}
      <section className="subpage-section">
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
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">
                  <span>{pick({ vi: 'Liên Hệ Phòng Xuất Khẩu', en: 'Contact Export Dept', ko: '수출 사업부 문의', zh: '联系出口事业部' })}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/brochure" className="btn btn-secondary">
                  <span>{t('nav.brochure', 'Company Brochure')}</span>
                </Link>
              </div>
            </div>

            {/* Column 2: Visual Card */}
            <div className="about-visual-card">
              <picture>
                <source srcSet="/assets/images/about_vietnam.webp" type="image/webp" />
                <img
                  src="/assets/images/about_vietnam.jpg"
                  alt={pick({
                    vi: 'Vùng trồng nông sản Đồng bằng sông Cửu Long',
                    en: 'Lush karst mountains and river valleys in Vietnam',
                    ko: '베트남 메콩 델타 농산물 재배 산지',
                    zh: '越南湄公河三角洲生态水果产区'
                  })}
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
          SECTION 1B: OFFICIAL 2026 COMPANY BROCHURE SHOWCASE
          ======================================================================== */}
      <section className="about-brochure-showcase-section" id="company-brochure">
        <div className="container">
          <div className="about-brochure-grid">
            <Link
              to="/brochure"
              className="about-brochure-cover-link"
              aria-label={t('brochure.viewCta', 'View Brochure')}
            >
              <div className="about-brochure-cover-frame">
                <picture>
                  <source srcSet={BROCHURE_DOCUMENT.coverWebp} type="image/webp" />
                  <img
                    src={BROCHURE_DOCUMENT.coverJpg}
                    alt={pick({
                      vi: 'Ảnh bìa Brochure Công ty TNHH VINAXO 2026',
                      en: 'Official VINAXO Company Brochure 2026 cover',
                      ko: 'VINAXO 기업 공식 브로슈어 2026 표지',
                      zh: 'VINAXO 2026 官方企业产品手册封面'
                    })}
                    className="about-brochure-cover-img"
                    loading="lazy"
                  />
                </picture>
              </div>
            </Link>

            <div className="about-brochure-content">
              <span className="section-label">
                {t('brochure.showcaseLabel', 'OFFICIAL COMPANY BROCHURE')}
              </span>
              <h2 className="about-brochure-heading">
                {t('brochure.showcaseHeading', 'EXPLORE OUR COMPANY BROCHURE')}
              </h2>
              <p className="about-brochure-desc">
                {t(
                  'brochure.showcaseDesc',
                  "Discover VINAXO's tropical dried fruit collections, manufacturing capabilities, international quality standards and private-label solutions."
                )}
              </p>

              <dl className="about-brochure-meta">
                <div className="about-brochure-meta-item">
                  <dt>{t('brochure.formatLabel', 'Format')}</dt>
                  <dd>{t('brochure.formatVal', BROCHURE_DOCUMENT.format)}</dd>
                </div>
                <div className="about-brochure-meta-item">
                  <dt>{t('brochure.editionLabel', 'Edition')}</dt>
                  <dd>{t('brochure.editionVal', BROCHURE_DOCUMENT.edition)}</dd>
                </div>
                <div className="about-brochure-meta-item">
                  <dt>{t('brochure.pagesLabel', 'Pages')}</dt>
                  <dd>{t('brochure.pagesVal', String(BROCHURE_DOCUMENT.totalPages))}</dd>
                </div>
                <div className="about-brochure-meta-item">
                  <dt>{t('brochure.languageLabel', 'Language')}</dt>
                  <dd>{brochureInfo.hasNativePdf ? t('brochure.languageVal', 'English') : brochureInfo.badgeLabel}</dd>
                </div>
              </dl>

              <div className="about-brochure-actions">
                <Link to="/brochure" className="brochure-view-btn">
                  <span>{t('brochure.viewCta', 'View Brochure')}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a
                  href={brochureInfo.pdfUrl}
                  download={BROCHURE_DOCUMENT.downloadFilename}
                  className="brochure-download-btn"
                >
                  <span>{t('brochure.downloadCta', 'Download PDF')}</span>
                  <Download size={16} aria-hidden="true" />
                </a>
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
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
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
      <section className="subpage-section">
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
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--soft-border)' }}>
                <picture>
                  <source srcSet="/assets/images/factory-2026/factory-sub-3.webp" type="image/webp" />
                  <img
                    src="/assets/images/factory-2026/factory-sub-3.jpg"
                    alt="VINAXO fresh processing line"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    loading="lazy"
                  />
                </picture>
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
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
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
      <section className="subpage-section" id="leadership">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
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
            <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--brand-orange-soft)', color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid var(--brand-orange)' }}>
                K
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-chocolate)', marginBottom: '4px' }}>
                {COMPANY_INFO.leadership[0]?.name || 'Nguyễn Anh Khoa'}
              </h3>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--vinaxo-red)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('leadership.khoa.role')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('leadership.khoa.desc')}
              </p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  {t('leadership.khoa.stamp')}
                </span>
              </div>
            </div>

            {/* Hoàng Thị Thu Thảo */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--brand-orange-soft)', color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid var(--brand-orange)' }}>
                T
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-chocolate)', marginBottom: '4px' }}>
                {COMPANY_INFO.leadership[1]?.name || 'Hoàng Thị Thu Thảo'}
              </h3>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--vinaxo-red)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('leadership.thao.role')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('leadership.thao.desc')}
              </p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  {t('leadership.thao.stamp')}
                </span>
              </div>
            </div>

            {/* Hoàng Mạnh Cường */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--soft-border)', borderRadius: 'var(--radius-md)', padding: '32px 24px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--brand-orange-soft)', color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid var(--brand-orange)' }}>
                C
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-chocolate)', marginBottom: '4px' }}>
                {COMPANY_INFO.leadership[2]?.name || 'Hoàng Mạnh Cường'}
              </h3>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--vinaxo-red)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('leadership.cuong.role')}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('leadership.cuong.desc')}
              </p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
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
            eyebrow={pick({ vi: 'KẾT NỐI HỢP TÁC B2B', en: 'B2B PARTNERSHIP', ko: 'B2B 파트너십', zh: 'B2B 战略合作' })}
            title={pick({
              vi: 'Đồng Hành Cùng VINAXO Nâng Tầm Nông Sản Việt',
              en: 'Partner with VINAXO for Global Agricultural Growth',
              ko: 'VINAXO와 함께 글로벌 농식품 시장을 선도하세요',
              zh: '携手 VINAXO 共拓全球热带果干市场'
            })}
            description={pick({
              vi: 'Tổ hợp nhà máy 25.000 m² tại Xã Vĩnh Bình, Đồng Tháp với sản lượng 300 tấn/tháng sẵn sàng đáp ứng đơn hàng xuất khẩu và gia công OEM (MOQ từ 200 kg).',
              en: 'Our 25,000 m² processing complex in Dong Thap Province (300 t monthly output) is ready for bulk export orders and OEM private labeling from 200 kg MOQ.',
              ko: '베트남 동탑성 빈빈 소재 25,000 m² 규모 공장(월 300톤 생산 능력)이 대량 수출 오더 및 MOQ 200kg부터 가능한 OEM/PB 맞춤 생산을 완벽히 지원합니다.',
              zh: '位于同塔省永平的 25,000 平方米一体化工厂（月产能 300 吨）竭诚为您承接整柜出口订单及 200 公斤起订的 OEM 贴牌代工。'
            })}
            primaryText={pick({ vi: 'Yêu Cầu Báo Giá Ngay', en: 'Request Quotation', ko: '견적 요청하기', zh: '立即获取报价' })}
            onPrimaryClick={() => onOpenQuote()}
            secondaryText={pick({ vi: 'Liên Hệ Ban Lãnh Đạo', en: 'Contact Leadership', ko: '경영진 및 수출팀 문의', zh: '联系管理层团队' })}
            secondaryLink="/contact"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
