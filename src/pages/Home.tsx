import React, { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Factory,
  FileText,
  Globe,
  MessageSquare,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  HOMEPAGE_CONTENT,
  HomepageCategoryCard,
  HomepageSectionKey,
  getHomepageLocalized,
  resolveCategoryCardHref,
  resolveHomepageFeaturedProducts,
} from '../data/homepageContent';
import { productsData, ProductItem } from '../data/products';
import {
  COMPLIANCE_ITEMS,
  ComplianceBadge,
  getComplianceLocalized,
} from '../data/brochureData';
import { getAllNewsItems } from '../services/contentService';
import { MainLayoutContext } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CertificatePreviewModal } from '../components/ui/CertificatePreviewModal';
import { NewsCard } from '../components/news/NewsCard';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { OEM_PRODUCT_ID } from '../components/contact/contactSchema';

export const Home: React.FC = () => {
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const { language, pick } = useLanguage();

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedCert, setSelectedCert] = useState<ComplianceBadge | null>(null);

  const hp = HOMEPAGE_CONTENT;

  const featuredProducts = useMemo(
    () => resolveHomepageFeaturedProducts(productsData, hp),
    [hp]
  );

  const visibleCatalogCategories = useMemo(
    () =>
      [...hp.catalogCategoryCards]
        .filter((c) => c.visible !== false)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)),
    [hp]
  );

  const visibleOemLines = useMemo(
    () =>
      [...hp.oemProductLines]
        .filter((c) => c.visible !== false)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)),
    [hp]
  );

  const latestNews = useMemo(() => {
    const maxNews = Math.max(1, Math.min(3, Number(hp.newsSection?.maxItems) || 3));
    return getAllNewsItems().slice(0, maxNews);
  }, [hp]);

  const orderedSections = useMemo(() => {
    const validKeys: HomepageSectionKey[] = [
      'hero',
      'about',
      'categories',
      'featuredProducts',
      'productionOem',
      'qualityCerts',
      'exportMarkets',
      'news',
      'closingCta',
    ];
    const fromCms = (hp.sectionOrder || []).filter((k): k is HomepageSectionKey =>
      validKeys.includes(k as HomepageSectionKey)
    );
    const missing = validKeys.filter((k) => !fromCms.includes(k));
    return [...fromCms, ...missing].filter((k) => hp.sections[k] !== false);
  }, [hp]);

  const handleOemLineInquiry = (card: HomepageCategoryCard) => {
    onOpenQuote({
      productId: card.targetValue || OEM_PRODUCT_ID,
      productSlug: '',
    });
  };

  const renderSection = (sectionKey: HomepageSectionKey) => {
    switch (sectionKey) {
      case 'hero':
        return (
          <section
            key="hero"
            data-home-section="hero"
            className="hero-section"
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF3E6 65%, #F6E9D5 100%)',
              borderBottom: '1px solid var(--soft-border)',
            }}
          >
            <div className="container">
              <div
                className="hero-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'clamp(28px, 4vw, 52px)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span
                    className="hero-eyebrow"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      backgroundColor: '#FFF4DF',
                      border: '1px solid #F3D19B',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#8D5410',
                      marginBottom: '18px',
                    }}
                  >
                    <Sparkles size={14} />
                    {getHomepageLocalized(hp.hero.eyebrow, language)}
                  </span>

                  <h1
                    className="hero-headline-condensed"
                    style={{
                      fontSize: 'clamp(2.15rem, 4.1vw, 3.35rem)',
                      lineHeight: 1.08,
                      fontWeight: 800,
                      color: 'var(--dark-chocolate)',
                      margin: '0 0 18px 0',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    <span style={{ display: 'block' }}>
                      {getHomepageLocalized(hp.hero.headlineLine1, language)}
                    </span>
                    <span style={{ display: 'block' }}>
                      {getHomepageLocalized(hp.hero.headlineLine2, language)}
                    </span>
                    <span style={{ display: 'block', color: 'var(--brand-orange)' }}>
                      {getHomepageLocalized(hp.hero.headlineHighlight, language)}
                    </span>
                  </h1>

                  <p
                    className="hero-desc"
                    style={{
                      fontSize: 'clamp(0.98rem, 1.35vw, 1.08rem)',
                      lineHeight: 1.65,
                      color: 'var(--color-body)',
                      marginBottom: '26px',
                      maxWidth: '560px',
                    }}
                  >
                    {getHomepageLocalized(hp.hero.description, language)}
                  </p>

                  <div
                    className="hero-actions"
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
                  >
                    <Link to={hp.hero.primaryCtaLink || '/products'} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="lg" icon={<ArrowRight size={17} />}>
                        {getHomepageLocalized(hp.hero.primaryCtaLabel, language)}
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => onOpenQuote()}
                      icon={<MessageSquare size={17} />}
                    >
                      {getHomepageLocalized(hp.hero.secondaryCtaLabel, language)}
                    </Button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '18px',
                      marginTop: '28px',
                      paddingTop: '20px',
                      borderTop: '1px solid var(--soft-border)',
                      fontSize: '0.84rem',
                      color: 'var(--dark-chocolate)',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Factory size={16} color="var(--brand-orange)" />
                      {pick({
                        vi: '25.000 m² · 300 Tấn/Tháng',
                        en: '25,000 m² · 300 Tons/Month',
                        ko: '25,000 m² · 월 300톤',
                        zh: '25,000 m² · 月产能 300 吨',
                      })}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} color="var(--brand-orange)" />
                      BRCGS Grade B · ISO 22000 · US FDA
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={16} color="var(--brand-orange)" />
                      {pick({
                        vi: 'US ~70% · EU ~20% · 15+ Quốc gia',
                        en: 'US ~70% · EU ~20% · 15+ Countries',
                        ko: '미국 ~70% · EU ~20% · 15개국+',
                        zh: '美国 ~70% · 欧盟 ~20% · 15+ 国家',
                      })}
                    </span>
                  </div>
                </div>

                {/* Clean 2-Image Verified Product Collage */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.15fr 0.85fr',
                    gap: '14px',
                    alignItems: 'stretch',
                  }}
                >
                  <div
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-md)',
                      aspectRatio: '4 / 5',
                      backgroundColor: '#FAF4EB',
                    }}
                  >
                    <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                      <source srcSet={hp.hero.primaryImage} type="image/webp" />
                      <img
                        src={hp.hero.primaryImageFallback || hp.hero.primaryImage}
                        alt={getHomepageLocalized(hp.hero.primaryImageAlt, language)}
                        loading="eager"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </picture>
                  </div>

                  <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '14px' }}>
                    <div
                      style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        minHeight: '220px',
                        backgroundColor: '#FAF4EB',
                      }}
                    >
                      <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                        <source srcSet={hp.hero.secondaryImage} type="image/webp" />
                        <img
                          src={hp.hero.secondaryImageFallback || hp.hero.secondaryImage}
                          alt={getHomepageLocalized(hp.hero.secondaryImageAlt, language)}
                          loading="eager"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </picture>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#3A251B',
                        color: '#FFFDF9',
                        borderRadius: '16px',
                        padding: '16px 18px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#F4A83A', fontWeight: 700, textTransform: 'uppercase' }}>
                        VINAXO · B2B EXPORT
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700, marginTop: '4px', lineHeight: 1.35 }}>
                        {pick({
                          vi: '4 Nhóm Hàng & Gia Công OEM',
                          en: '4 Categories & Private Label',
                          ko: '4대 제품군 & OEM 맞춤 생산',
                          zh: '四大主力分类与 OEM 定制',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section
            key="about"
            data-home-section="about"
            className="about-editorial-section"
            style={{ padding: 'clamp(36px, 4vw, 52px) 0', backgroundColor: '#FFFFFF' }}
          >
            <div className="container">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: 'clamp(24px, 4vw, 48px)',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    aspectRatio: '16 / 10',
                    backgroundColor: '#FAF4EB',
                  }}
                >
                  <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                    <source srcSet={hp.about.image} type="image/webp" />
                    <img
                      src={hp.about.imageFallback || hp.about.image}
                      alt={getHomepageLocalized(hp.about.imageAlt, language)}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </picture>
                </div>

                <div>
                  <span className="section-label">{getHomepageLocalized(hp.about.label, language)}</span>
                  <h2 className="section-title" style={{ marginBottom: '14px' }}>
                    {getHomepageLocalized(hp.about.titleLine1, language)}
                    <br />
                    <span style={{ color: 'var(--brand-orange)' }}>
                      {getHomepageLocalized(hp.about.titleLine2, language)}
                    </span>
                  </h2>
                  <p className="about-editorial-lead" style={{ marginBottom: '22px' }}>
                    {getHomepageLocalized(hp.about.description, language)}
                  </p>
                  <Link
                    to={hp.about.ctaLink || '/about'}
                    className="about-editorial-cta"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>{getHomepageLocalized(hp.about.ctaLabel, language)}</span>
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'categories':
        return (
          <section
            key="categories"
            data-home-section="categories"
            style={{
              padding: 'clamp(38px, 4.5vw, 56px) 0',
              backgroundColor: 'var(--cream-bg)',
              borderTop: '1px solid var(--soft-border)',
              borderBottom: '1px solid var(--soft-border)',
            }}
          >
            <div className="container">
              <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 36px auto' }}>
                <span className="section-label">
                  {getHomepageLocalized(hp.categoriesSection.label, language)}
                </span>
                <h2 className="section-title">
                  {getHomepageLocalized(hp.categoriesSection.title, language)}
                </h2>
                <p className="section-desc" style={{ margin: '0 auto' }}>
                  {getHomepageLocalized(hp.categoriesSection.description, language)}
                </p>
              </div>

              {/* 4 Official Export Product Categories */}
              <div className="home-categories-grid" data-testid="home-official-categories">
                {visibleCatalogCategories.map((card) => {
                  const href = resolveCategoryCardHref(card) || '/products';
                  const title = getHomepageLocalized(card.name, language);
                  const desc = getHomepageLocalized(card.description, language);
                  const badge = card.badge ? getHomepageLocalized(card.badge, language) : '';
                  const cta =
                    getHomepageLocalized(card.ctaLabel, language) ||
                    pick({ vi: 'Xem danh mục', en: 'Explore Category', ko: '카테고리 보기', zh: '查看分类' });

                  return (
                    <Link
                      key={card.id}
                      to={href}
                      data-category-card={card.id}
                      className="home-category-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        color: 'inherit',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      <div style={{ aspectRatio: '16 / 10', overflow: 'hidden', backgroundColor: '#FAF4EB' }}>
                        <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                          <source srcSet={card.image} type="image/webp" />
                          <img
                            src={card.imageFallback || card.image}
                            alt={title}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </picture>
                      </div>
                      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {badge && (
                          <span
                            style={{
                              alignSelf: 'flex-start',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: '#8D5410',
                              backgroundColor: '#FFF4DF',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              marginBottom: '8px',
                            }}
                          >
                            {badge}
                          </span>
                        )}
                        <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--dark-chocolate)', margin: '0 0 8px 0' }}>
                          {title}
                        </h3>
                        <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.55, margin: '0 0 14px 0', flex: 1 }}>
                          {desc}
                        </p>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: 'var(--brand-orange-dark, #B5650D)',
                          }}
                        >
                          {cta}
                          <ArrowRight size={15} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Separate Bespoke OEM Product Lines (NO nuts-seeds or product filter misdirection) */}
              {visibleOemLines.length > 0 && (
                <div
                  data-testid="home-oem-inquiry-lines"
                  style={{
                    marginTop: '42px',
                    padding: 'clamp(22px, 3vw, 32px)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1px solid #EBDAC6',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      gap: '14px',
                      marginBottom: '22px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #F3EAE0',
                    }}
                  >
                    <div style={{ maxWidth: '720px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          backgroundColor: '#FFF4DF',
                          border: '1px solid #F3D19B',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#8D5410',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          marginBottom: '8px',
                        }}
                      >
                        {pick({
                          vi: 'Dòng gia công OEM theo yêu cầu · Không thuộc 4 nhóm hàng có sẵn',
                          en: 'Custom OEM Lines · Separate from Standard 4 Catalog Categories',
                          ko: '맞춤형 OEM 라인 · 정규 4대 카탈로그와 별도 운영',
                          zh: 'OEM 定制加工线 · 独立于四大标准现货分类',
                        })}
                      </span>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--dark-chocolate)', margin: '0 0 6px 0' }}>
                        {getHomepageLocalized(hp.categoriesSection.oemLinesHeading, language)}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.55, margin: 0 }}>
                        {getHomepageLocalized(hp.categoriesSection.oemLinesDesc, language)}
                      </p>
                    </div>
                  </div>

                  <div className="home-oem-lines-grid">
                    {visibleOemLines.map((line) => {
                      const title = getHomepageLocalized(line.name, language);
                      const desc = getHomepageLocalized(line.description, language);
                      const badge = line.badge ? getHomepageLocalized(line.badge, language) : '';
                      const cta =
                        getHomepageLocalized(line.ctaLabel, language) ||
                        pick({ vi: 'Liên hệ tìm hiểu', en: 'Contact for Details', ko: '자세히 문의', zh: '联系咨询详情' });
                      const lineHref = line.linkType === 'quote' ? null : resolveCategoryCardHref(line);

                      return (
                        <div
                          key={line.id}
                          data-oem-line-card={line.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '14px',
                            border: '1px solid #EADCCE',
                            backgroundColor: '#FFFDF9',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ aspectRatio: '16 / 10', overflow: 'hidden', backgroundColor: '#FAF4EB' }}>
                            <picture>
                              <source srcSet={line.image} type="image/webp" />
                              <img
                                src={line.imageFallback || line.image}
                                alt={title}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            </picture>
                          </div>
                          <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {badge && (
                              <span
                                style={{
                                  alignSelf: 'flex-start',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: '#8D5410',
                                  backgroundColor: '#FFF4DF',
                                  padding: '2px 7px',
                                  borderRadius: '999px',
                                  marginBottom: '6px',
                                }}
                              >
                                {badge}
                              </span>
                            )}
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--dark-chocolate)', margin: '0 0 6px 0' }}>
                              {title}
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--color-body)', lineHeight: 1.5, margin: '0 0 12px 0', flex: 1 }}>
                              {desc}
                            </p>
                            {lineHref ? (
                              <Link
                                to={lineHref}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  width: '100%',
                                  padding: '9px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #3A251B',
                                  backgroundColor: '#FFFFFF',
                                  color: '#3A251B',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  boxSizing: 'border-box',
                                }}
                              >
                                {cta}
                                <ArrowRight size={14} />
                              </Link>
                            ) : (
                              <button
                                type="button"
                                data-oem-inquiry-btn={line.targetValue}
                                onClick={() => handleOemLineInquiry(line)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  width: '100%',
                                  padding: '9px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #3A251B',
                                  backgroundColor: '#FFFFFF',
                                  color: '#3A251B',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                {cta}
                                <ArrowRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        );

      case 'featuredProducts':
        return (
          <section
            key="featuredProducts"
            data-home-section="featuredProducts"
            style={{ padding: 'clamp(38px, 4.5vw, 56px) 0', backgroundColor: '#FFFFFF' }}
          >
            <div className="container">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                <div style={{ maxWidth: '680px' }}>
                  <span className="section-label">
                    {getHomepageLocalized(hp.featuredProductsSection.label, language)}
                  </span>
                  <h2 className="section-title" style={{ marginBottom: '8px' }}>
                    {getHomepageLocalized(hp.featuredProductsSection.title, language)}
                  </h2>
                  <p className="section-desc" style={{ margin: 0 }}>
                    {getHomepageLocalized(hp.featuredProductsSection.description, language)}
                  </p>
                </div>

                <Link to="/products" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="md" icon={<ArrowRight size={16} />}>
                    {getHomepageLocalized(hp.featuredProductsSection.viewAllLabel, language)}
                  </Button>
                </Link>
              </div>

              <div className="home-products-grid" data-testid="home-featured-products-grid">
                {featuredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onViewDetails={(item) => setSelectedProduct(item)}
                    onRequestQuote={(target) => onOpenQuote(target)}
                  />
                ))}
              </div>
            </div>
          </section>
        );

      case 'productionOem':
        return (
          <section
            key="productionOem"
            data-home-section="productionOem"
            className="oem-feature-panel"
            style={{ padding: 'clamp(38px, 4.5vw, 54px) 0' }}
          >
            <div className="container">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: 'clamp(24px, 4vw, 48px)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span
                    className="section-label"
                    style={{ color: '#F4A83A', display: 'inline-block', marginBottom: '8px' }}
                  >
                    {getHomepageLocalized(hp.productionOem.label, language)}
                  </span>
                  <h2
                    className="section-title"
                    style={{ color: '#FFFDF9', marginBottom: '14px' }}
                  >
                    {getHomepageLocalized(hp.productionOem.title, language)}
                  </h2>
                  <p style={{ fontSize: '0.96rem', lineHeight: 1.65, color: '#EAE0D5', marginBottom: '20px' }}>
                    {getHomepageLocalized(hp.productionOem.description, language)}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'grid', gap: '10px' }}>
                    {(hp.productionOem.bullets || []).map((bullet, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.9rem',
                          color: '#FAF4EB',
                          lineHeight: 1.5,
                        }}
                      >
                        <CheckCircle2 size={17} color="#F4A83A" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{getHomepageLocalized(bullet, language)}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <Button
                      variant="white"
                      size="md"
                      onClick={() => onOpenQuote(OEM_PRODUCT_ID)}
                      icon={<Package size={16} />}
                    >
                      {getHomepageLocalized(hp.productionOem.primaryCtaLabel, language)}
                    </Button>
                    <Link
                      to={hp.productionOem.secondaryCtaLink || '/about#factory-gallery'}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="outline-white" size="md" icon={<ArrowRight size={16} />}>
                        {getHomepageLocalized(hp.productionOem.secondaryCtaLabel, language)}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: 'var(--shadow-lg)',
                    aspectRatio: '16 / 10',
                    backgroundColor: '#2A1A12',
                  }}
                >
                  <picture>
                    <source srcSet={hp.productionOem.image} type="image/webp" />
                    <img
                      src={hp.productionOem.imageFallback || hp.productionOem.image}
                      alt={getHomepageLocalized(hp.productionOem.imageAlt, language)}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </picture>
                </div>
              </div>
            </div>
          </section>
        );

      case 'qualityCerts':
        return (
          <section
            key="qualityCerts"
            data-home-section="qualityCerts"
            style={{
              padding: 'clamp(38px, 4.5vw, 54px) 0',
              backgroundColor: 'var(--cream-bg)',
              borderBottom: '1px solid var(--soft-border)',
            }}
          >
            <div className="container">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: '16px',
                  marginBottom: '26px',
                }}
              >
                <div style={{ maxWidth: '700px' }}>
                  <span className="section-label">
                    {getHomepageLocalized(hp.qualityCerts.label, language)}
                  </span>
                  <h2 className="section-title" style={{ marginBottom: '8px' }}>
                    {getHomepageLocalized(hp.qualityCerts.title, language)}
                  </h2>
                  <p className="section-desc" style={{ margin: 0 }}>
                    {getHomepageLocalized(hp.qualityCerts.description, language)}
                  </p>
                </div>

                <Link to={hp.qualityCerts.ctaLink || '/quality#certificates'} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="md" icon={<Award size={16} />}>
                    {getHomepageLocalized(hp.qualityCerts.ctaLabel, language)}
                  </Button>
                </Link>
              </div>

              <div className="home-certs-compact-grid">
                {COMPLIANCE_ITEMS.slice(0, 6).map((cert) => {
                  const locCert = getComplianceLocalized(cert, language);
                  const canPreview = Boolean(cert.certImageWebp || cert.certImageJpg);

                  return (
                    <div
                      key={cert.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid var(--color-border)',
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '999px',
                              backgroundColor: '#FFF4DF',
                              color: '#8D5410',
                            }}
                          >
                            {cert.pillLabel}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#8C7E74', fontWeight: 600 }}>
                            {locCert.kind}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--dark-chocolate)', margin: '0 0 4px 0' }}>
                          {locCert.name}
                        </h3>
                        <p style={{ fontSize: '0.81rem', color: 'var(--color-body)', lineHeight: 1.45, margin: 0 }}>
                          {locCert.scope}
                        </p>
                      </div>

                      {canPreview && (
                        <button
                          type="button"
                          onClick={() => setSelectedCert(cert)}
                          style={{
                            alignSelf: 'flex-start',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: '#B5650D',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <FileText size={13} />
                          {pick({ vi: 'Xem chứng chỉ', en: 'Preview Document', ko: '인증서 보기', zh: '查看证书扫描件' })}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {getHomepageLocalized(hp.qualityCerts.scopeNote, language) && (
                <p
                  data-testid="home-cert-scope-note"
                  style={{
                    marginTop: '18px',
                    marginBottom: 0,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EADCCE',
                    fontSize: '0.82rem',
                    color: '#6E6259',
                    lineHeight: 1.5,
                  }}
                >
                  {getHomepageLocalized(hp.qualityCerts.scopeNote, language)}
                </p>
              )}
            </div>
          </section>
        );

      case 'exportMarkets':
        return (
          <section
            key="exportMarkets"
            data-home-section="exportMarkets"
            id="markets"
            style={{ padding: 'clamp(38px, 4.5vw, 54px) 0', backgroundColor: '#FFFFFF' }}
          >
            <div className="container">
              <div className="quality-global-grid">
                <div>
                  <span className="section-label">
                    {getHomepageLocalized(hp.exportMarkets.label, language)}
                  </span>
                  <h2 className="section-title" style={{ marginBottom: '12px' }}>
                    {getHomepageLocalized(hp.exportMarkets.titleLine1, language)}
                    <br />
                    <span style={{ color: 'var(--brand-orange)' }}>
                      {getHomepageLocalized(hp.exportMarkets.titleLine2, language)}
                    </span>
                  </h2>
                  <p className="section-desc" style={{ marginBottom: '22px' }}>
                    {getHomepageLocalized(hp.exportMarkets.description, language)}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '12px',
                      marginBottom: '24px',
                    }}
                  >
                    {[
                      { pct: '~70%', region: pick({ vi: 'Hoa Kỳ', en: 'United States', ko: '미국', zh: '美国' }) },
                      { pct: '~20%', region: pick({ vi: 'Châu Âu', en: 'European Union', ko: '유럽연합', zh: '欧盟' }) },
                      { pct: '~10%', region: pick({ vi: 'Châu Á & Khác', en: 'Asia & Others', ko: '아시아 외', zh: '亚洲及其他' }) },
                    ].map((stat) => (
                      <div
                        key={stat.region}
                        style={{
                          padding: '14px 12px',
                          borderRadius: '12px',
                          backgroundColor: '#FAF4EB',
                          border: '1px solid #EADCCE',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-orange)' }}>{stat.pct}</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--dark-chocolate)' }}>{stat.region}</div>
                      </div>
                    ))}
                  </div>

                  <Link to={hp.exportMarkets.ctaLink || '/markets'} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="md" icon={<ArrowRight size={16} />}>
                      {getHomepageLocalized(hp.exportMarkets.ctaLabel, language)}
                    </Button>
                  </Link>
                </div>

                <div className="global-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '540px' }}>
                    <WorldMapSvg />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'news':
        return (
          <section
            key="news"
            data-home-section="news"
            id="news"
            style={{
              padding: 'clamp(38px, 4.5vw, 54px) 0',
              backgroundColor: 'var(--cream-bg)',
              borderTop: '1px solid var(--soft-border)',
            }}
          >
            <div className="container">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                <div style={{ maxWidth: '660px' }}>
                  <span className="section-label">
                    {getHomepageLocalized(hp.newsSection.label, language)}
                  </span>
                  <h2 className="section-title" style={{ marginBottom: '6px' }}>
                    {getHomepageLocalized(hp.newsSection.titleLine1, language)}{' '}
                    <span style={{ color: 'var(--brand-orange)' }}>
                      {getHomepageLocalized(hp.newsSection.titleLine2, language)}
                    </span>
                  </h2>
                  <p className="section-desc" style={{ margin: 0 }}>
                    {getHomepageLocalized(hp.newsSection.description, language)}
                  </p>
                </div>

                <Link to="/news" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="md" icon={<ArrowRight size={16} />}>
                    {getHomepageLocalized(hp.newsSection.viewAllLabel, language)}
                  </Button>
                </Link>
              </div>

              <div className="grid-3">
                {latestNews.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </div>
          </section>
        );

      case 'closingCta':
        return (
          <section
            key="closingCta"
            data-home-section="closingCta"
            style={{ padding: 'clamp(40px, 5vw, 64px) 0', backgroundColor: '#FFFFFF' }}
          >
            <div className="container">
              <CorporateCTA
                eyebrow={getHomepageLocalized(hp.closingCta.eyebrow, language)}
                title={getHomepageLocalized(hp.closingCta.title, language)}
                description={
                  <>
                    <span>{getHomepageLocalized(hp.closingCta.description, language)}</span>
                    {hp.closingCta.brochureLink && (
                      <span style={{ display: 'inline-block', marginLeft: '10px' }}>
                        <Link
                          to={hp.closingCta.brochureLink}
                          style={{ color: '#FFE0A3', fontWeight: 700, textDecoration: 'underline' }}
                        >
                          {getHomepageLocalized(hp.closingCta.brochureLabel, language)} →
                        </Link>
                      </span>
                    )}
                  </>
                }
                primaryText={getHomepageLocalized(hp.closingCta.primaryLabel, language)}
                onPrimaryClick={() => onOpenQuote()}
                secondaryText={getHomepageLocalized(hp.closingCta.secondaryLabel, language)}
                secondaryLink={hp.closingCta.secondaryLink || '/contact'}
              />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-home">
      <main id="main-content">{orderedSections.map(renderSection)}</main>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestQuote={(target) => {
          setSelectedProduct(null);
          onOpenQuote(target);
        }}
      />

      <CertificatePreviewModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};

export default Home;
