import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productsData, ProductItem } from '../data/products';
import { newsData } from '../data/news';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { NewsCard } from '../components/news/NewsCard';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Top 5 featured products for Homepage
  const featuredProducts = productsData.slice(0, 5);

  // Top 3 verified news articles for Homepage
  const featuredNews = newsData.slice(0, 3);

  // Safely render translated text with line breaks without dangerouslySetInnerHTML
  const renderSafeText = (text: string) => {
    return text.split(/<br\s*\/?>/i).map((part, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {part}
      </React.Fragment>
    ));
  };

  return (
    <div className="home-page">
      {/* ======================================================================
          SECTION 1 — HERO SECTION (MATCHING ORIGINAL HTML DESIGN 1:1)
          ====================================================================== */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          paddingTop: 'clamp(40px, 5vw, 68px)',
          paddingBottom: 'clamp(56px, 7vw, 88px)',
          backgroundColor: 'var(--cream-bg)',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: 'clamp(32px, 5vw, 56px)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Narrative, Actions & Features */}
            <div className="hero-copy">
              {/* Eyebrow Pill */}
              <div style={{ marginBottom: '14px' }}>
                <span className="section-label tag-pill">
                  {t('hero.eyebrow')}
                </span>
              </div>

              {/* Serif Title */}
              <h1 className="hero-title" style={{ marginBottom: '18px' }}>
                <span style={{ display: 'block', fontSize: 'clamp(1.75rem, 5.2vw, 3.6rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-heading)' }}>
                  {t('hero.titleLine1')}
                </span>
                <em style={{ display: 'block', fontSize: 'clamp(1.75rem, 5.2vw, 3.6rem)', fontStyle: 'italic', color: 'var(--primary-green)', fontWeight: 400, lineHeight: 1.2 }}>
                  {t('hero.titleLine2')}
                </em>
              </h1>

              {/* Subtitle / Description */}
              <p
                className="hero-desc"
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: '#55635C',
                  marginBottom: '28px',
                  maxWidth: '520px',
                }}
              >
                {t('hero.description')}
              </p>

              {/* Dual Actions */}
              <div className="hero-actions" style={{ marginBottom: '32px' }}>
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                    {t('hero.primaryCta')}
                  </Button>
                </Link>

                <Link to="/about">
                  <Button variant="secondary" size="lg">
                    {t('hero.secondaryCta')}
                  </Button>
                </Link>
              </div>

              {/* 3 Key Trust Features Row (Desktop: inside hero-copy) */}
              <div className="hero-features hero-features-desktop">
                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <Leaf size={15} />
                  </div>
                  <div className="feature-text">
                    {renderSafeText(t('hero.features.0.title'))}
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <MapPin size={15} />
                  </div>
                  <div className="feature-text">
                    {renderSafeText(t('hero.features.1.title'))}
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <Globe size={15} />
                  </div>
                  <div className="feature-text">
                    {renderSafeText(t('hero.features.2.title'))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Frame, Script Accent & Origin Stamp */}
            <div className="hero-visual-wrap">
              {/* Handwritten Script Accent Top Right */}
              <div className="hero-script-accent" aria-hidden="true">
                <p>
                  <span>{t('hero.scriptAccent.line1')}</span><br />
                  <span><span>{t('hero.scriptAccent.line2')}</span></span><br />
                  <span>{t('hero.scriptAccent.line3')}</span><br />
                  <span>{t('hero.scriptAccent.line4')}</span>
                </p>
              </div>

              {/* Main Wooden Platter Fruit Image */}
              <div className="hero-image-card">
                <picture>
                  <source srcSet="/assets/images/hero_fruits.webp" type="image/webp" />
                  <img
                    src="/assets/images/hero_fruits.jpg"
                    alt={isVi ? "Trái cây sấy dẻo VINAXO trên khay gỗ" : "Artisanal Vietnamese dried fruits on wooden platter"}
                    width={600}
                    height={440}
                  />
                </picture>
              </div>

              {/* Circular Origin Stamp Badge Bottom Right */}
              <div className="hero-origin-stamp" aria-label="From Vietnam to the World certification badge">
                <div className="stamp-inner">
                  <span className="stamp-from">{t('hero.badge.top')}</span>
                  <span className="stamp-country">{t('hero.badge.country')}</span>
                  <span className="stamp-world">{t('hero.badge.bottom')}</span>
                  <svg className="stamp-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3 Key Trust Features Row (Mobile: reflowed directly below hero-visual-wrap) */}
            <div className="hero-features hero-features-mobile">
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <Leaf size={15} />
                </div>
                <div className="feature-text">
                  {renderSafeText(t('hero.features.0.title'))}
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-circle">
                  <MapPin size={15} />
                </div>
                <div className="feature-text">
                  {renderSafeText(t('hero.features.1.title'))}
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-circle">
                  <Globe size={15} />
                </div>
                <div className="feature-text">
                  {renderSafeText(t('hero.features.2.title'))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 2 — ABOUT VINAXO (MATCHING ORIGINAL HTML 3-COLUMN GRID)
          ====================================================================== */}
      <section className="about-section" id="about">
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
              <Link to="/about" className="btn btn-primary">
                <span>{t('about.cta')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Column 2: Vietnamese Landscape Visual */}
            <div className="about-visual-card">
              <picture>
                <source srcSet="/assets/images/about_vietnam.webp" type="image/webp" />
                <img
                  src="/assets/images/about_vietnam.jpg"
                  alt={isVi ? "Vùng nguyên liệu nông sản sông nước Việt Nam" : "Lush karst mountains and river valleys in Vietnam"}
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

            {/* Column 3: 2x2 Corporate Metrics Grid (Verified) */}
            <div className="about-metrics">
              <div className="metric-item">
                <span className="metric-number">70%</span>
                <span className="metric-label">{t('about.stats.0.label')}</span>
                <span className="metric-note">{t('about.stats.0.note')}</span>
                <span className="metric-source">{t('about.stats.0.source')}</span>
              </div>

              <div className="metric-item">
                <span className="metric-number">20%</span>
                <span className="metric-label">{t('about.stats.1.label')}</span>
                <span className="metric-note">{t('about.stats.1.note')}</span>
                <span className="metric-source">{t('about.stats.1.source')}</span>
              </div>

              <div className="metric-item">
                <span className="metric-number">1,000+</span>
                <span className="metric-label">{t('about.stats.2.label')}</span>
                <span className="metric-note">{t('about.stats.2.note')}</span>
                <span className="metric-source">{t('about.stats.2.source')}</span>
              </div>

              <div className="metric-item">
                <span className="metric-number">BRCGS</span>
                <span className="metric-label">{t('about.stats.3.label')}</span>
                <span className="metric-note">{t('about.stats.3.note')}</span>
                <span className="metric-source">{t('about.stats.3.source')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 3 — FEATURED PRODUCTS SHOWCASE
          ====================================================================== */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="section-header-bar">
            <div>
              <span className="section-label">{t('productsSection.label')}</span>
              <h2 className="section-title">
                <span>{t('productsSection.titleLine1')}</span><br />
                <em>{t('productsSection.titleLine2')}</em>
              </h2>
              <p className="section-desc" style={{ maxWidth: '580px' }}>
                {t('productsSection.description')}
              </p>
            </div>
            <div>
              <Link to="/products" className="arrow-link">
                <span>{t('productsSection.viewAll')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 5 Dynamic Product Cards (Rendered 1:1) */}
          <div className="products-grid">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={(item) => setSelectedProduct(item)}
                onRequestQuote={(name) => onOpenQuote(name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4 & 5 — QUALITY & GLOBAL MARKET (ORIGINAL 2-COLUMN SECTION)
          ====================================================================== */}
      <section className="quality-global-section">
        <div className="container">
          <div className="quality-global-grid">
            {/* Left Column: Quality Assurance Standards */}
            <div className="quality-col" id="quality">
              <span className="section-label">{t('qualitySection.label')}</span>
              <h2 className="section-title">
                <span>{t('qualitySection.titleLine1')}</span><br />
                <span>{t('qualitySection.titleLine2')}</span>
              </h2>
              <p className="section-desc">{t('qualitySection.description')}</p>

              {/* Verified Certification Badges */}
              <div className="certifications-list">
                {/* BRCGS Grade B Badge */}
                <div className="cert-badge cert-brcgs" title="BRCGS Food Safety Grade B Certified Facility">
                  <span className="cert-main">BRCGS</span>
                  <span className="cert-sub">{t('qualitySection.certifications.0.subtitle')}</span>
                  <span className="cert-extra">{t('qualitySection.certifications.0.status')}</span>
                </div>

                {/* OCOP 3-Star Badge */}
                <div className="cert-badge cert-ocop" title="OCOP 3-Star Provincial Produce Certified">
                  <span className="cert-main">OCOP</span>
                  <span className="cert-sub">{t('qualitySection.certifications.1.subtitle')}</span>
                  <span className="cert-extra">{t('qualitySection.certifications.1.status')}</span>
                </div>

                {/* BSCI & ESG Social Compliance */}
                <div className="cert-badge cert-bsci" title="BSCI Social Compliance & ESG Sustainable Practices">
                  <span className="cert-main">BSCI / ESG</span>
                  <span className="cert-sub">{t('qualitySection.certifications.2.subtitle')}</span>
                  <span className="cert-sub" style={{ fontSize: '0.4375rem', color: '#2563EB' }}>
                    {t('qualitySection.certifications.2.status')}
                  </span>
                </div>

                {/* Clean Label 100% Natural Badge */}
                <div className="cert-badge cert-clean" title="100% Natural Tropical Dried Fruit - Clean Label">
                  <span className="cert-main">100%</span>
                  <span className="cert-sub">{t('qualitySection.certifications.3.subtitle')}</span>
                </div>
              </div>

              <p className="quality-notice-text">{t('qualitySection.notice')}</p>

              <div style={{ paddingTop: '8px' }}>
                <Link to="/quality" className="arrow-link">
                  <span>{t('qualitySection.cta')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Column: Global Market & SVG World Map */}
            <div className="global-col" id="markets">
              <span className="section-label">{t('globalSection.label')}</span>
              <h2 className="section-title">
                <span>{t('globalSection.titleLine1')}</span><br />
                <span>{t('globalSection.titleLine2')}</span>
              </h2>
              <p className="section-desc">{t('globalSection.description')}</p>

              {/* Scalable SVG World Map with radiating routes & stats badge */}
              <WorldMapSvg variant="compact" interactive={true} />

              {/* Verified Key Export Markets Grid (2x2) */}
              <div className="market-pills-grid">
                <div className="market-pill-item">
                  <div className="market-pill-header">
                    <span className="market-pill-name">{t('globalSection.markets.0.name')}</span>
                    <span className="market-pill-share">{t('globalSection.markets.0.share')}</span>
                  </div>
                  <p className="market-pill-desc">{t('globalSection.markets.0.desc')}</p>
                </div>

                <div className="market-pill-item">
                  <div className="market-pill-header">
                    <span className="market-pill-name">{t('globalSection.markets.1.name')}</span>
                    <span className="market-pill-share">{t('globalSection.markets.1.share')}</span>
                  </div>
                  <p className="market-pill-desc">{t('globalSection.markets.1.desc')}</p>
                </div>

                <div className="market-pill-item">
                  <div className="market-pill-header">
                    <span className="market-pill-name">{t('globalSection.markets.2.name')}</span>
                    <span className="market-pill-share">{t('globalSection.markets.2.share')}</span>
                  </div>
                  <p className="market-pill-desc">{t('globalSection.markets.2.desc')}</p>
                </div>

                <div className="market-pill-item">
                  <div className="market-pill-header">
                    <span className="market-pill-name">{t('globalSection.markets.3.name')}</span>
                    <span className="market-pill-share">{t('globalSection.markets.3.share')}</span>
                  </div>
                  <p className="market-pill-desc">{t('globalSection.markets.3.desc')}</p>
                </div>
              </div>

              <div style={{ paddingTop: '14px' }}>
                <Link to="/markets" className="arrow-link">
                  <span>{t('globalSection.cta')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 6 — LATEST VERIFIED PRESS & MEDIA
          ====================================================================== */}
      <section className="section section-white" id="news">
        <div className="container">
          <div className="section-header-bar">
            <div>
              <span className="section-label">{t('newsSection.label')}</span>
              <h2 className="section-title">
                <span>{t('newsSection.titleLine1')}</span><br />
                <em>{t('newsSection.titleLine2')}</em>
              </h2>
              <p className="section-desc" style={{ maxWidth: '580px' }}>
                {t('newsSection.description')}
              </p>
            </div>
            <div>
              <Link to="/news" className="arrow-link">
                <span>{t('newsSection.viewAll')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 3 Featured News Cards */}
          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {featuredNews.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 7 — CONTACT CTA BANNER
          ====================================================================== */}
      <section className="section" style={{ paddingTop: '20px', paddingBottom: 'var(--section-space)' }}>
        <div className="container">
          <div
            className="home-cta-card"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)',
              backgroundColor: 'var(--forest-green)',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-xl)',
              textAlign: 'center',
            }}
          >
            {/* Background Landscape Picture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.22,
                mixBlendMode: 'overlay',
              }}
            >
              <picture>
                <source srcSet="/assets/images/cta_landscape.webp" type="image/webp" />
                <img
                  src="/assets/images/cta_landscape.jpg"
                  alt="Mekong Delta Landscape"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </picture>
            </div>

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
              <span className="section-eyebrow section-eyebrow-light">
                {isVi ? 'HỢP TÁC XUẤT KHẨU & OEM B2B' : 'B2B PARTNERSHIP & EXPORT'}
              </span>

              <h2
                className="title-serif"
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginTop: '12px',
                  marginBottom: '18px',
                }}
              >
                <span>{isVi ? 'Đưa Tinh Hoa Nông Sản Việt' : "Let's Bring Vietnamese Goodness"}</span>
                <br />
                <em style={{ color: '#A3E6B8' }}>{isVi ? 'Vươn Tầm Thế Giới' : 'to the Global Market'}</em>
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '36px',
                }}
              >
                {isVi
                  ? 'Nhà máy chế biến 4.000 m² tại TT. Vĩnh Bình, H. Gò Công Tây, tỉnh Tiền Giang sẵn sàng cung ứng sản phẩm sấy dẻo xuất khẩu chất lượng cao và gia công nhãn riêng OEM cho đối tác toàn cầu.'
                  : 'Our 4,000 m² processing facility in Go Cong Tây, Tien Giang is primed to deliver export-grade dried fruits and OEM private labeling for global buyers.'}
              </p>

              <div
                className="home-cta-actions"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="white"
                  size="lg"
                  onClick={() => onOpenQuote()}
                  icon={<ArrowRight size={16} />}
                >
                  {isVi ? 'Yêu Cầu Báo Giá Ngay' : 'Request a Quote Now'}
                </Button>

                <Link to="/contact">
                  <Button variant="outline-white" size="lg">
                    {isVi ? 'Liên Hệ Ban Lãnh Đạo' : 'Contact Leadership'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestQuote={(productName) => onOpenQuote(productName)}
      />
    </div>
  );
};

export default Home;
