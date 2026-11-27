import React, { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Download, Expand, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COMPANY_INFO } from '../data/company';
import { BROCHURE_DOCUMENT, resolveBrochureDocumentForLang } from '../data/brochureData';
import {
  ABOUT_CONTENT,
  AboutGalleryCategory,
  getCategoryLabel,
  getVisibleAboutGallery,
  pickLocalized,
} from '../data/aboutContent';
import { PageHero } from '../components/ui/PageHero';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';
import { AboutGalleryLightbox } from '../components/about/AboutGalleryLightbox';

export const About: React.FC = () => {
  const { language, t, pick } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const brochureInfo = resolveBrochureDocumentForLang(language);

  const [selectedCategory, setSelectedCategory] = useState<'all' | AboutGalleryCategory>('all');
  const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);

  const visibleGallery = useMemo(() => getVisibleAboutGallery(ABOUT_CONTENT), []);

  const availableCategories = useMemo(() => {
    const seen = new Set<AboutGalleryCategory>();
    visibleGallery.forEach((item) => seen.add(item.category));
    return Array.from(seen);
  }, [visibleGallery]);

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'all') return visibleGallery;
    return visibleGallery.filter((item) => item.category === selectedCategory);
  }, [visibleGallery, selectedCategory]);

  const handleSelectCategory = (cat: 'all' | AboutGalleryCategory) => {
    setSelectedCategory(cat);
    setActiveGalleryId(null);
  };

  const hv = ABOUT_CONTENT.highlightVisual;
  const infra = ABOUT_CONTENT.infrastructure;
  const sourcing = ABOUT_CONTENT.sourcing;
  const vm = ABOUT_CONTENT.visionMission;
  const showVisionMission = Boolean(
    vm.enabled &&
      (pickLocalized(vm.visionDesc, language) ||
        pickLocalized(vm.missionDesc, language) ||
        pickLocalized(vm.coreValuesDesc, language))
  );

  return (
    <div className="about-page">
      {/* Page Hero */}
      <PageHero
        title={pickLocalized(ABOUT_CONTENT.hero.title, language) || 'VINAXO'}
        description={pickLocalized(ABOUT_CONTENT.hero.subtitle, language)}
        breadcrumbCurrent={pick({ vi: 'Giới thiệu', en: 'About Us', ko: '회사 소개', zh: '关于我们' })}
      />

      {/* ========================================================================
          SECTION 1: COMPANY STORY, AUTHENTIC FACILITY HIGHLIGHT & 4 METRICS
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: 'clamp(28px, 3vw, 44px)' }}>
        <div className="container">
          <div className="about-grid">
            {/* Column 1: Story */}
            <div className="about-story">
              <span className="section-label">{pickLocalized(ABOUT_CONTENT.story.label, language)}</span>
              <h2 className="section-title">
                <span>{pickLocalized(ABOUT_CONTENT.story.titleLine1, language)}</span><br />
                <em>{pickLocalized(ABOUT_CONTENT.story.titleLine2, language)}</em>
              </h2>
              <p>{pickLocalized(ABOUT_CONTENT.story.description, language)}</p>
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

            {/* Column 2: Authentic Facility Highlight Card */}
            <div className="about-visual-card" data-testid="about-highlight-visual">
              <picture>
                {hv.imageFallback && <source srcSet={hv.image} type="image/webp" />}
                <img
                  src={hv.imageFallback || hv.image}
                  alt={pickLocalized(hv.alt, language)}
                  loading="lazy"
                  width={512}
                  height={300}
                />
              </picture>
              <div className="about-visual-overlay">
                <span className="overlay-tag">{pickLocalized(hv.overlayTag, language)}</span>
                <h3 className="overlay-title">
                  <span>{pickLocalized(hv.overlayLine1, language)}</span><br />
                  <em>{pickLocalized(hv.overlayLine2, language)}</em>
                </h3>
                <div className="overlay-divider"></div>
              </div>
            </div>

            {/* Column 3: 4 Verified Metrics */}
            <div className="about-metrics">
              {ABOUT_CONTENT.metrics.map((metric) => (
                <div key={metric.id} className="metric-item">
                  <span className="metric-number">{pickLocalized(metric.num, language)}</span>
                  <span className="metric-label">{pickLocalized(metric.label, language)}</span>
                  <span className="metric-note">{pickLocalized(metric.note, language)}</span>
                  <span className="metric-source">{pickLocalized(metric.source, language)}</span>
                </div>
              ))}
            </div>
          </div>

          {showVisionMission && (
            <div className="about-vision-mission-wrap">
              <div className="about-vision-header">
                <span className="section-label">{pickLocalized(vm.label, language)}</span>
              </div>
              <div className="about-vision-grid">
                {[
                  { id: 'vision', title: pickLocalized(vm.visionTitle, language), desc: pickLocalized(vm.visionDesc, language) },
                  { id: 'mission', title: pickLocalized(vm.missionTitle, language), desc: pickLocalized(vm.missionDesc, language) },
                  { id: 'values', title: pickLocalized(vm.coreValuesTitle, language), desc: pickLocalized(vm.coreValuesDesc, language) },
                ]
                  .filter((card) => Boolean(card.desc))
                  .map((card) => (
                    <div key={card.id} className="about-vision-card">
                      <h3>{card.title}</h3>
                      <p>{card.desc}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
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
                      zh: 'VINAXO 2026 官方企业产品手册封面',
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
          SECTION 2: MILESTONES & HISTORY TIMELINE
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
            {ABOUT_CONTENT.milestones.map((m) => (
              <div key={m.id} className="timeline-card">
                <span className="timeline-badge">{pickLocalized(m.badge, language)}</span>
                <h3 className="timeline-title">{pickLocalized(m.title, language)}</h3>
                <p className="timeline-desc">{pickLocalized(m.desc, language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: INFRASTRUCTURE & PROCESSING CAPACITY
          ======================================================================== */}
      <section className="subpage-section">
        <div className="container">
          <div className="facility-overview-grid">
            <div>
              <span className="section-label">{pickLocalized(infra.label, language)}</span>
              <h2 className="section-title font-serif">
                {pickLocalized(infra.title, language)}
              </h2>
              <p className="section-desc" style={{ marginTop: '16px', marginBottom: '24px' }}>
                {pickLocalized(infra.desc, language)}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {infra.features.map((feat) => (
                  <div key={feat.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} color="var(--primary-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-heading)', fontSize: '0.95rem' }}>
                        {pickLocalized(feat.title, language)}
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
                        {pickLocalized(feat.desc, language)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--soft-border)' }}>
                <picture>
                  {infra.imageFallback && <source srcSet={infra.image} type="image/webp" />}
                  <img
                    src={infra.imageFallback || infra.image}
                    alt={pickLocalized(infra.imageAlt, language)}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* ========================================================================
              SECTION 3B: MEKONG DELTA SOURCING HUBS (VERIFIED FACTUAL DATA)
              ======================================================================== */}
          {sourcing.rows.length > 0 && (
            <div className="about-sourcing-block" id="sourcing-regions">
              <div className="about-sourcing-header">
                <span className="section-label">{pickLocalized(sourcing.label, language)}</span>
                <h2 className="section-title" style={{ marginBottom: '10px' }}>
                  {pickLocalized(sourcing.title, language)}
                </h2>
                <p className="section-desc" style={{ margin: '0 auto' }}>
                  {pickLocalized(sourcing.desc, language)}
                </p>
              </div>

              <div className="about-sourcing-grid">
                {sourcing.rows.map((row) => (
                  <div key={row.id} className="about-sourcing-card">
                    <div className="about-sourcing-icon" aria-hidden="true">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="about-sourcing-title">{pickLocalized(row.label, language)}</h3>
                      <p className="about-sourcing-val">{pickLocalized(row.value, language)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: AUTHENTIC ENTERPRISE GALLERY & LIGHTBOX
          ======================================================================== */}
      <section
        id="factory-gallery"
        className="subpage-section"
        style={{
          backgroundColor: 'var(--cream-bg)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 32px auto' }}>
            <span className="section-label">{pickLocalized(ABOUT_CONTENT.gallerySection.label, language)}</span>
            <h2 className="section-title">
              {pickLocalized(ABOUT_CONTENT.gallerySection.title, language)}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {pickLocalized(ABOUT_CONTENT.gallerySection.desc, language)}
            </p>
          </div>

          {availableCategories.length > 1 && (
            <div
              className="about-gallery-filter-bar"
              role="tablist"
              aria-label={pick({
                vi: 'Lọc nhóm hình ảnh nhà máy',
                en: 'Filter factory gallery categories',
                ko: '공장 갤러리 카테고리 필터',
                zh: '筛选工厂图库分类',
              })}
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                data-gallery-filter="all"
                onClick={() => handleSelectCategory('all')}
                className={`about-gallery-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                {getCategoryLabel('all', language)} ({visibleGallery.length})
              </button>
              {availableCategories.map((cat) => {
                const count = visibleGallery.filter((g) => g.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    data-gallery-filter={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`about-gallery-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {getCategoryLabel(cat, language)} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {filteredGallery.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-body)' }}>
              {t('aboutPage.gallery.emptyCategory', 'Chưa có hình ảnh công khai trong nhóm này.')}
            </div>
          ) : (
            <div className="about-gallery-grid" data-testid="about-gallery-grid">
              {filteredGallery.map((item) => {
                const labelText = pickLocalized(item.label, language);
                const titleText = pickLocalized(item.title, language);
                const descText = pickLocalized(item.description, language);
                const altText = pickLocalized(item.alt, language) || titleText;
                const categoryText = getCategoryLabel(item.category, language);

                return (
                  <article
                    key={item.id}
                    className="about-gallery-card"
                    data-gallery-card-id={item.id}
                    data-gallery-category={item.category}
                  >
                    <button
                      type="button"
                      className="about-gallery-thumb-btn"
                      onClick={() => setActiveGalleryId(item.id)}
                      aria-label={`${t('aboutPage.gallery.viewLarge', 'Xem ảnh lớn')}: ${titleText}`}
                    >
                      <picture>
                        {item.imageFallback && <source srcSet={item.image} type="image/webp" />}
                        <img
                          src={item.imageFallback || item.image}
                          alt={altText}
                          className="about-gallery-thumb-img"
                          loading="lazy"
                        />
                      </picture>
                      <span className="about-gallery-zoom-badge">
                        <Expand size={14} aria-hidden="true" />
                        <span>{t('aboutPage.gallery.viewLarge', 'Xem ảnh lớn')}</span>
                      </span>
                    </button>

                    <div className="about-gallery-card-body">
                      <div className="about-gallery-card-meta">
                        <span className="about-gallery-label" data-testid="gallery-card-label">
                          {labelText}
                        </span>
                        <span className="about-gallery-cat-chip">{categoryText}</span>
                      </div>

                      <h3 className="about-gallery-card-title" data-testid="gallery-card-title">
                        {titleText}
                      </h3>

                      <p className="about-gallery-card-desc" data-testid="gallery-card-desc">
                        {descText}
                      </p>

                      <div className="about-gallery-card-footer">
                        <button
                          type="button"
                          className="about-gallery-open-btn"
                          data-gallery-open-id={item.id}
                          onClick={() => setActiveGalleryId(item.id)}
                        >
                          <Expand size={15} aria-hidden="true" />
                          <span>{t('aboutPage.gallery.viewLarge', 'Xem ảnh lớn')}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================
          SECTION 5: LEADERSHIP
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
              zh: '携手 VINAXO 共拓全球热带果干市场',
            })}
            description={pick({
              vi: 'Tổ hợp nhà máy 25.000 m² tại Xã Vĩnh Bình, Đồng Tháp với sản lượng 300 tấn/tháng sẵn sàng đáp ứng đơn hàng xuất khẩu và gia công OEM (MOQ từ 200 kg).',
              en: 'Our 25,000 m² processing complex in Dong Thap Province (300 t monthly output) is ready for bulk export orders and OEM private labeling from 200 kg MOQ.',
              ko: '베트남 동탑성 빈빈 소재 25,000 m² 규모 공장(월 300톤 생산 능력)이 대량 수출 오더 및 MOQ 200kg부터 가능한 OEM/PB 맞춤 생산을 완벽히 지원합니다.',
              zh: '位于同塔省永平的 25,000 平方米一体化工厂（月产能 300 吨）竭诚为您承接整柜出口订单及 200 公斤起订的 OEM 贴牌代工。',
            })}
            primaryText={pick({ vi: 'Yêu Cầu Báo Giá Ngay', en: 'Request Quotation', ko: '견적 요청하기', zh: '立即获取报价' })}
            onPrimaryClick={() => onOpenQuote()}
            secondaryText={pick({ vi: 'Liên Hệ Ban Lãnh Đạo', en: 'Contact Leadership', ko: '경영진 및 수출팀 문의', zh: '联系管理层团队' })}
            secondaryLink="/contact"
          />
        </div>
      </section>

      {/* Interactive Synchronized Gallery Lightbox */}
      <AboutGalleryLightbox
        items={filteredGallery}
        activeId={activeGalleryId}
        onSelectId={setActiveGalleryId}
        onClose={() => setActiveGalleryId(null)}
      />
    </div>
  );
};

export default About;
