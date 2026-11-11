import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  MapPin,
  Globe,
  Award,
  CheckCircle2,
  PackageCheck,
  Sparkles,
  Factory,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productsData, ProductItem } from '../data/products';
import {
  COMPLIANCE_ITEMS,
  BROCHURE_CATEGORIES,
  FACTORY_GALLERY,
  QUALITY_PROMISE_CARDS,
  BrochureCategory,
  ComplianceBadge,
} from '../data/brochureData';
import { newsData } from '../data/news';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CertificatePreviewModal } from '../components/ui/CertificatePreviewModal';
import { NewsCard } from '../components/news/NewsCard';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedLine, setSelectedLine] = useState<BrochureCategory | null>(null);
  const [previewCert, setPreviewCert] = useState<ComplianceBadge | null>(null);

  const getComplianceClassLabel = (item: ComplianceBadge) => {
    if (item.id === 'fda') {
      return isVi ? 'Đăng ký Cơ sở FDA' : 'Facility Registration';
    }
    if (item.id === 'smeta') {
      return isVi ? 'Kiểm toán Đạo đức' : 'Ethical Trade Audit';
    }
    if (item.id === 'costco') {
      return isVi ? 'Kiểm toán Nhà cung cấp' : 'Retail Supplier Audit';
    }
    return isVi ? 'Chứng nhận' : 'Certification';
  };

  const renderCollectionTile = (line: BrochureCategory, variant: 'featured' | 'standard') => {
    const title = isVi ? line.titleVi : line.titleEn;
    const summary = isVi ? (line.summaryVi || line.descVi) : (line.summaryEn || line.descEn);
    const linkLabel =
      variant === 'featured'
        ? isVi
          ? 'Khám phá bộ sưu tập'
          : 'Explore Collection'
        : isVi
        ? 'Xem chi tiết dòng sản phẩm'
        : 'Discover Products';
    const mediaPosition = line.id === 'natural-dried-fruit' ? 'center 56%' : 'center 50%';

    const inner = (
      <>
        <div className="collection-media">
          <picture>
            <source srcSet={line.imageWebp} type="image/webp" />
            <img
              src={line.imageJpg}
              alt={title}
              className="collection-img"
              style={{ objectPosition: mediaPosition }}
              loading="lazy"
            />
          </picture>
        </div>

        <div className="collection-meta">
          <h3 className="collection-item-title">{title}</h3>
          <p className="collection-item-desc">{summary}</p>
          <span className="collection-item-link">
            <span>{linkLabel}</span>
            <ArrowRight size={15} />
          </span>
        </div>
      </>
    );

    if (line.catalogFilter) {
      return (
        <Link
          key={line.id}
          to={`/products?category=${line.catalogFilter}`}
          className={`collection-item collection-item-${variant}`}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        key={line.id}
        type="button"
        onClick={() => setSelectedLine(line)}
        className={`collection-item collection-item-${variant}`}
      >
        {inner}
      </button>
    );
  };

  // Preserve 8 featured products from the verified 12-item catalog in 2 full 4-column rows
  const featuredProducts = productsData.slice(0, 8);
  const featuredNews = newsData.slice(0, 3);

  const featuredFactory = FACTORY_GALLERY[0];
  const supportingFactory = FACTORY_GALLERY.slice(1, 4);

  const manufacturingCapabilities = [
    {
      valueEn: '300 t',
      valueVi: '300 tấn',
      labelEn: 'Monthly production output',
      labelVi: 'Sản lượng sản xuất mỗi tháng',
      detailEn: 'Growing year on year',
      detailVi: 'Tăng trưởng qua từng năm',
    },
    {
      valueEn: '200 kg',
      valueVi: '200 kg',
      labelEn: 'Minimum order quantity',
      labelVi: 'Đơn hàng tối thiểu (MOQ)',
      detailEn: 'Varies by product up to 1 ton',
      detailVi: 'Linh hoạt đến 1 tấn tùy mặt hàng',
    },
    {
      valueEn: '2–4 weeks',
      valueVi: '2–4 tuần',
      labelEn: 'Typical lead time',
      labelVi: 'Thời gian sản xuất tiêu chuẩn',
      detailEn: 'Depends on volume & packaging',
      detailVi: 'Tùy sản lượng và quy cách đóng gói',
    },
    {
      valueEn: '25,000 m²',
      valueVi: '25.000 m²',
      labelEn: 'Total factory area',
      labelVi: 'Tổng diện tích nhà máy',
      detailEn: 'Dong Thap Province, Vietnam',
      detailVi: 'Tại tỉnh Đồng Tháp, Việt Nam',
    },
  ];

  const oemCapabilities = isVi
    ? [
        'Tùy chỉnh công thức độ ẩm, độ ngọt Brix & hương vị theo thị trường',
        'Thiết kế & in ấn bao bì theo bộ nhận diện thương hiệu riêng (OEM/ODM)',
        'Đáp ứng đa dạng đóng gói từ túi bán lẻ (50g–500g) đến thùng xuất khẩu (5kg–20kg)',
        'Hỗ trợ mẫu thử chuẩn đánh giá chất lượng trước khi sản xuất đại trà',
        'Hồ sơ xuất khẩu đồng bộ cho chuỗi bán lẻ tại Mỹ, Châu Âu, Nga & Châu Á',
      ]
    : [
        'Custom recipes tailored to regional sweetness, moisture, and texture preferences',
        'Custom retail & private-label packaging engineered to buyer artwork',
        'Bulk master cartons (5kg–20kg) and finished retail pouches (50g–500g)',
        'Complimentary evaluation sample kits & pre-shipment standard verification',
        'Proven international collaboration across US, European, and Asian retail channels',
      ];

  return (
    <div className="home-page">
      {/* ======================================================================
          SECTION 4.2 — HERO SECTION (OFFICIAL BROCHURE 2026 PAGE 1 IDENTITY)
          ====================================================================== */}
      <section className="hero-section">
        {/* Subtle Botanical Fruit Illustrations extracted from Official Brochure 2026 */}
        <img
          src="/assets/illustrations-2026/pineapple-2026.webp"
          alt=""
          aria-hidden="true"
          className="tropical-deco"
          style={{
            top: '-18px',
            right: '-24px',
            width: '150px',
            transform: 'rotate(-14deg)',
            opacity: 0.22,
          }}
        />
        <img
          src="/assets/illustrations-2026/mango-leaf-2026.webp"
          alt=""
          aria-hidden="true"
          className="tropical-deco"
          style={{
            bottom: '-18px',
            left: '-14px',
            width: '130px',
            transform: 'rotate(10deg)',
            opacity: 0.24,
          }}
        />

        <div className="container">
          <div className="hero-grid">
            {/* Left Column: Brochure Page 1 Eyebrow, Display Headline, Intro & CTAs */}
            <div className="hero-copy">
              <div style={{ marginBottom: '18px' }}>
                <span className="section-label">
                  {isVi
                    ? 'VINAXO CO., LTD · SẢN XUẤT TẠI VIỆT NAM'
                    : 'VINAXO CO., LTD · MADE IN VIETNAM'}
                </span>
              </div>

              <h1 className="hero-headline-condensed">
                {isVi ? (
                  <>
                    <span className="hero-headline-line">TRÁI CÂY SẤY</span>
                    <span className="hero-headline-line">NHIỆT ĐỚI</span>
                    <span className="hero-headline-line hero-headline-highlight">
                      &amp; ĐỒ ĂN NHẸ CAO CẤP
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hero-headline-line">PREMIUM TROPICAL</span>
                    <span className="hero-headline-line">DRIED FRUIT</span>
                    <span className="hero-headline-line hero-headline-highlight">
                      &amp; HEALTHY SNACKS
                    </span>
                  </>
                )}
              </h1>

              <p className="hero-desc">
                {isVi
                  ? 'Tuyển chọn trái cây tươi ngon Việt Nam, sấy nhẹ giữ trọn vị ngon tự nhiên thành món ăn nhẹ lành mạnh — được các đối tác bán lẻ, dịch vụ ẩm thực và nhãn hàng riêng tại hơn 15 quốc gia tin tưởng.'
                  : 'Carefully selected Vietnamese fruit, gently dried and crafted into wholesome snacks — trusted by retail, food-service and private-label partners in over 15 countries.'}
              </p>

              {/* Primary Orange CTA & Secondary Dark Chocolate Outline CTA */}
              <div className="hero-actions">
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={<ArrowRight size={17} />}>
                    {isVi ? 'Khám Phá Sản Phẩm' : 'Explore Products'}
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onOpenQuote()}
                >
                  {isVi ? 'Yêu Cầu Báo Giá' : 'Request a Quote'}
                </Button>
              </div>

              {/* 3 Key Highlights (Desktop) */}
              <div className="hero-features hero-features-desktop">
                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <Leaf size={16} />
                  </div>
                  <div className="feature-text">
                    {isVi ? '100% Trái Cây Chọn Lọc\nChế Biến Lành Mạnh' : 'Selected Vietnamese Fruit\nWholesome Craft'}
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <MapPin size={16} />
                  </div>
                  <div className="feature-text">
                    {isVi ? 'Nhà Máy 25.000 m²\nVĩnh Bình, Đồng Tháp' : '25,000 m² Factory\nDong Thap, Vietnam'}
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <Globe size={16} />
                  </div>
                  <div className="feature-text">
                    {isVi ? 'Đối Tác Trên 15 Quốc Gia\nRetail • Food-Service • OEM' : '15+ Export Countries\nRetail • Food-Service • OEM'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Official Brochure Page 1 Dual Rounded Studio Visual Pair */}
            <div className="hero-visual-wrap">
              <div className="hero-dual-photos">
                <div className="hero-photo-tile">
                  <picture>
                    <source srcSet="/assets/images/hero-brochure-mango.webp" type="image/webp" />
                    <img
                      src="/assets/images/hero-brochure-mango.jpg"
                      alt={
                        isVi
                          ? 'Xoài sấy dẻo VINAXO vàng óng tự nhiên'
                          : 'VINAXO golden soft-dried mango slices'
                      }
                      style={{ objectPosition: '58% center' }}
                      width={400}
                      height={500}
                    />
                  </picture>
                </div>

                <div className="hero-photo-tile">
                  <picture>
                    <source srcSet="/assets/images/hero-brochure-dragonfruit.webp" type="image/webp" />
                    <img
                      src="/assets/images/hero-brochure-dragonfruit.jpg"
                      alt={
                        isVi
                          ? 'Thanh long tươi và thanh long sấy tự nhiên VINAXO'
                          : 'Vietnamese fresh dragon fruit paired with dehydrated slices'
                      }
                      style={{ objectPosition: 'center 42%' }}
                      width={400}
                      height={500}
                    />
                  </picture>
                </div>
              </div>
            </div>

            {/* Mobile Features Reflow */}
            <div className="hero-features hero-features-mobile">
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <Leaf size={16} />
                </div>
                <div className="feature-text">
                  {isVi ? '100% Trái Cây Chọn Lọc • Chế Biến Lành Mạnh' : 'Selected Vietnamese Fruit • Wholesome Craft'}
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <MapPin size={16} />
                </div>
                <div className="feature-text">
                  {isVi ? 'Nhà Máy 25.000 m² • Vĩnh Bình, Đồng Tháp' : '25,000 m² Complex • Vinh Binh, Dong Thap'}
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <Globe size={16} />
                </div>
                <div className="feature-text">
                  {isVi ? 'Đối Tác Hơn 15 Quốc Gia • Retail & OEM' : '15+ Countries • Retail, Food-Service & OEM'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4.3 — EDITORIAL CERTIFICATIONS & INTERNATIONAL COMPLIANCE (BROCHURE PAGE 4)
          ====================================================================== */}
      <section
        className="certifications-showcase-section"
        aria-label={isVi ? 'Chứng nhận và tiêu chuẩn quốc tế' : 'Certifications and international compliance'}
      >
        <img
          src="/assets/illustrations-2026/palm-frond-2026.webp"
          alt=""
          aria-hidden="true"
          className="tropical-deco cert-botanical-accent"
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="cert-showcase-header">
            <div className="cert-showcase-intro">
              <span className="section-label">
                {isVi ? 'CHẤT LƯỢNG & TUÂN THỦ QUỐC TẾ' : 'QUALITY & COMPLIANCE'}
              </span>
              <h2 className="cert-showcase-title">
                {isVi
                  ? 'CHỨNG NHẬN & TIÊU CHUẨN QUỐC TẾ'
                  : 'CERTIFICATIONS & INTERNATIONAL COMPLIANCE'}
              </h2>
              <div className="cert-heading-accent" aria-hidden="true" />
              <p className="cert-showcase-desc">
                {isVi
                  ? 'Cam kết tuân thủ các hệ thống an toàn thực phẩm, quản lý chất lượng và đạo đức kinh doanh quốc tế, tạo nền tảng tin cậy cho đối tác toàn cầu.'
                  : 'Committed to internationally recognised food safety, quality and ethical standards, supporting trusted partnerships across global markets.'}
              </p>
            </div>

            <Link to="/quality#certificates" className="arrow-link cert-showcase-cta">
              <span>{isVi ? 'Xem Bản Chụp Chứng Nhận & Kiểm Toán' : 'View Certificates & Audits'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cert-showcase-grid">
            {COMPLIANCE_ITEMS.map((item) => {
              const classLabel = getComplianceClassLabel(item);
              const hasDocumentScan = Boolean(item.certImageWebp);
              const cardContent = (
                <>
                  <div className="cert-doc-frame">
                    {hasDocumentScan ? (
                      <picture>
                        <source srcSet={item.certImageWebp} type="image/webp" />
                        <img
                          src={item.certImageJpg}
                          alt={`${item.name} — VINAXO`}
                          className="cert-doc-img"
                          loading="lazy"
                        />
                      </picture>
                    ) : item.isHalalPlaceholder ? (
                      <div className="cert-typographic-mark is-halal" aria-hidden="true">
                        <span className="cert-mark-primary">HALAL</span>
                        <span className="cert-mark-sub">{isVi ? 'TIÊU CHUẨN' : 'COMPLIANCE'}</span>
                      </div>
                    ) : (
                      <div className="cert-typographic-mark is-audit" aria-hidden="true">
                        <span className="cert-mark-kicker">COSTCO</span>
                        <span className="cert-mark-primary">GMP</span>
                        <span className="cert-mark-sub">{isVi ? 'KIỂM TOÁN' : 'AUDIT'}</span>
                      </div>
                    )}
                  </div>

                  <div className="cert-card-body">
                    <div>
                      <span className="cert-class-kicker">{classLabel}</span>
                      <h3 className="cert-card-name">{item.name}</h3>
                      <p className="cert-card-scope">{isVi ? item.scopeVi : item.scopeEn}</p>
                    </div>

                    {hasDocumentScan && (
                      <span className="cert-doc-action">
                        <span>{isVi ? 'Xem bản chụp' : 'View document'}</span>
                        <ArrowUpRight size={13} />
                      </span>
                    )}
                  </div>
                </>
              );

              if (hasDocumentScan) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreviewCert(item)}
                    className="cert-showcase-card is-interactive"
                    aria-label={isVi ? `Xem bản chụp ${item.name}` : `Preview ${item.name} document`}
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <div key={item.id} className="cert-showcase-card">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4.4A — EDITORIAL TROPICAL PRODUCT RANGE (BROCHURE PAGE 2)
          ====================================================================== */}
      <section
        className="product-range-showcase-section"
        aria-label={isVi ? 'Bộ sưu tập sản phẩm VINAXO' : 'VINAXO Product Range'}
      >
        <img
          src="/assets/illustrations-2026/guava-2026.webp"
          alt=""
          aria-hidden="true"
          className="tropical-deco"
          style={{ top: '28px', left: '-14px', width: '105px', opacity: 0.16 }}
        />
        <img
          src="/assets/illustrations-2026/jackfruit-2026.webp"
          alt=""
          aria-hidden="true"
          className="tropical-deco"
          style={{ bottom: '28px', right: '-24px', width: '126px', opacity: 0.16 }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="collection-header">
            <div className="collection-header-intro">
              <span className="section-label">
                {isVi ? 'BỘ SƯU TẬP VINAXO' : 'VINAXO COLLECTION'}
              </span>
              <h2 className="collection-title">
                {isVi ? (
                  <>
                    DÒNG SẢN PHẨM <em>CHỦ LỰC</em>
                  </>
                ) : (
                  <>
                    OUR PRODUCT <em>RANGE</em>
                  </>
                )}
              </h2>
              <p className="collection-desc">
                {isVi
                  ? 'Sáu dòng sản phẩm đặc trưng chế biến từ trái cây nhiệt đới thượng hạng Việt Nam phục vụ thị trường quốc tế.'
                  : 'Six distinctive product lines, crafted from premium Vietnamese tropical fruit for international markets.'}
              </p>
            </div>

            <Link to="/products" className="arrow-link collection-header-cta">
              <span>{isVi ? 'Khám Phá Toàn Bộ Danh Mục' : 'Explore Full Product Catalog'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Row 1: Two Featured Image-Led Collection Anchors */}
          <div className="collection-featured-grid">
            {BROCHURE_CATEGORIES.slice(0, 2).map((line) => renderCollectionTile(line, 'featured'))}
          </div>

          {/* Row 2: Four Supporting Export & Value-Added Collections */}
          <div className="collection-supporting-grid">
            {BROCHURE_CATEGORIES.slice(2, 6).map((line) => renderCollectionTile(line, 'standard'))}
          </div>

          {/* Official Brochure Page 2 Bottom OEM Bar */}
          <div className="oem-strip-banner">
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  color: 'var(--brand-orange)',
                  textTransform: 'uppercase',
                }}
              >
                {isVi ? 'GIA CÔNG OEM / ODM & NHÃN RIÊNG' : 'OEM / ODM & PRIVATE LABEL WELCOME'}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 247, 236, 0.9)', marginTop: '2px' }}>
                {isVi
                  ? 'Tùy chỉnh công thức, quy cách đóng gói và thiết kế nhãn mác theo yêu cầu.'
                  : 'Custom recipes, packaging and labelling on request.'}
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenQuote(isVi ? 'Gia công OEM / ODM & Nhãn riêng' : 'OEM / ODM & Private Label Inquiry')}
              icon={<ArrowRight size={15} />}
            >
              {isVi ? 'Yêu Cầu Gia Công OEM' : 'Request OEM Quote'}
            </Button>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4.4B — PRESERVED VERIFIED 12-PRODUCT EXPORT CATALOG PREVIEW
          ====================================================================== */}
      <section className="section section-white" style={{ borderTop: '1px solid var(--soft-border)' }}>
        <div className="container">
          <div className="section-header-bar">
            <div>
              <span className="section-label">
                {isVi ? 'DANH MỤC 12 SẢN PHẨM XUẤT KHẨU' : 'EXPORT SKU CATALOG'}
              </span>
              <h2 className="section-title" style={{ marginBottom: '10px' }}>
                {isVi ? (
                  <>
                    SẢN PHẨM TIÊU BIỂU <em>CHUẨN B2B</em>
                  </>
                ) : (
                  <>
                    FEATURED EXPORT <em>FRUIT &amp; NUT SKUS</em>
                  </>
                )}
              </h2>
              <p className="section-desc">
                {isVi
                  ? 'Các sản phẩm trái cây sấy dẻo, trái cây sấy giòn và hạt dinh dưỡng chủ lực trong danh mục 12 mặt hàng chính thức của VINAXO.'
                  : 'Core soft-dried fruits, crunchy fruit chips, and premium nuts & seeds from our verified 12-product B2B export catalog.'}
              </p>
            </div>
            <div>
              <Link to="/products" className="btn btn-chocolate btn-sm">
                <span>{isVi ? 'Xem toàn bộ 12 sản phẩm' : 'View All 12 Products'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

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
          SECTION 4.5 — ABOUT VINAXO EDITORIAL PROFILE & CAPABILITIES (BROCHURE PAGE 3)
          ====================================================================== */}
      <section className="about-editorial-section" id="about">
        <div className="container">
          {/* AREA A — Company Introduction & Authentic Factory Photo */}
          <div className="about-intro-grid">
            <div className="about-intro-copy">
              <span className="section-label">
                {isVi ? 'CHÚNG TÔI LÀ AI' : 'WHO WE ARE'}
              </span>

              <h2 className="about-editorial-heading">
                {isVi ? (
                  <>
                    BẮT NGUỒN TỪ VIỆT NAM.
                    <br />
                    <span className="about-heading-accent">VƯƠN TẦM THẾ GIỚI.</span>
                  </>
                ) : (
                  <>
                    ROOTED IN VIETNAM.
                    <br />
                    <span className="about-heading-accent">CRAFTED FOR THE WORLD.</span>
                  </>
                )}
              </h2>

              <p className="about-editorial-lead">
                {isVi
                  ? 'Công ty TNHH VINAXO là nhà sản xuất trái cây sấy nhiệt đới và đồ ăn nhẹ lành mạnh tại Việt Nam. Chúng tôi kết hợp nguồn trái cây nhiệt đới tuyển chọn cùng các chuẩn mực sản xuất và an toàn thực phẩm quốc tế để đồng hành cùng đối tác bán lẻ, dịch vụ ẩm thực và nhãn hàng riêng toàn cầu.'
                  : 'Vinaxo Co., Ltd. is a Vietnamese manufacturer of premium dried tropical fruit and wholesome snacks. We combine carefully selected Vietnamese fruit with internationally recognised food safety and manufacturing standards to serve retail, food-service and private-label partners worldwide.'}
              </p>

              <Link to="/about" className="about-editorial-cta">
                <span>{isVi ? 'Tìm Hiểu Về Công Ty' : 'Discover Our Company'}</span>
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="about-intro-media">
              <div className="about-factory-frame">
                <picture>
                  <source
                    srcSet="/assets/images/factory/factory-quality-sorting.webp"
                    type="image/webp"
                  />
                  <img
                    src="/assets/images/factory/factory-quality-sorting.jpg"
                    alt={
                      isVi
                        ? 'Đội ngũ công nhân VINAXO kiểm tra chất lượng và định lượng xoài sấy trên bàn inox tại nhà máy ở Đồng Tháp'
                        : 'Vinaxo production team weighing and inspecting dried tropical mango slices on stainless steel tables inside the Dong Thap factory'
                    }
                    className="about-factory-img"
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* AREA B — Minimalist Manufacturing Capabilities Strip */}
          <div
            className="about-capabilities-strip"
            aria-label={isVi ? 'Năng lực sản xuất nhà máy VINAXO' : 'Vinaxo manufacturing capabilities'}
          >
            <div className="about-capabilities-grid">
              {manufacturingCapabilities.map((item, idx) => (
                <div key={idx} className="about-capability-item">
                  <span className="capability-accent-rule" aria-hidden="true" />
                  <div className="capability-value">
                    {isVi ? item.valueVi : item.valueEn}
                  </div>
                  <div className="capability-label">
                    {isVi ? item.labelVi : item.labelEn}
                  </div>
                  <div className="capability-detail">
                    {isVi ? item.detailVi : item.detailEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AREA C — Manufacturing Storytelling Transition */}
          <div className="about-story-bridge">
            <h3 className="about-story-heading">
              {isVi ? 'CHẤT LƯỢNG BẮT ĐẦU TỪ NGUỒN NGUYÊN LIỆU' : 'QUALITY BEGINS AT THE SOURCE'}
            </h3>
            <p className="about-story-copy">
              {isVi
                ? 'Từ khâu tuyển chọn trái cây tươi đạt chuẩn đến mẫu duyệt trước khi sản xuất và quy trình vận hành được chứng nhận quốc tế, chất lượng luôn dẫn dắt mọi công đoạn tại nhà máy VINAXO.'
                : 'From carefully selected ingredients to approved production samples and certified processes, quality guides every stage of our manufacturing workflow.'}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4.6 — AUTHENTIC FACTORY SHOWCASE (1 FEATURED + 3 SUPPORTING)
          ====================================================================== */}
      <section className="section section-white" style={{ borderTop: '1px solid var(--soft-border)' }}>
        <div className="container">
          <div className="section-header-bar">
            <div>
              <span className="section-label">
                {isVi ? 'HÌNH ẢNH NHÀ MÁY THỰC TẾ' : 'MANUFACTURING CREDIBILITY'}
              </span>
              <h2 className="section-title" style={{ marginBottom: '10px' }}>
                {isVi ? (
                  <>
                    DÂY CHUYỀN CHẾ BIẾN &amp; <em>KIỂM SOÁT VỆ SINH</em>
                  </>
                ) : (
                  <>
                    INSIDE THE VINAXO <em>PROCESSING FACILITY</em>
                  </>
                )}
              </h2>
              <p className="section-desc">
                {isVi
                  ? 'Hình ảnh vận hành thực tế tại phân xưởng VINAXO với quy trình khép kín đạt chuẩn an toàn thực phẩm, khu sơ chế inox 304 và dây chuyền đóng gói nhãn riêng.'
                  : 'Authentic photography from Vinaxo’s processing floors highlighting cleanroom hygiene uniforms, calibrated batch weighing, and export-ready retail pouch packing lines.'}
              </p>
            </div>
            <div>
              <Link to="/quality" className="arrow-link">
                <span>{isVi ? 'Xem quy trình sản xuất 6 bước' : 'Explore 6-Step Process'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="factory-showcase-grid">
            {/* Large Featured Factory Image */}
            <div className="factory-featured-card">
              <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                <source srcSet={featuredFactory.imageWebp} type="image/webp" />
                <img
                  src={featuredFactory.imageJpg}
                  alt={isVi ? featuredFactory.captionVi : featuredFactory.captionEn}
                  loading="lazy"
                />
              </picture>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(41, 24, 16, 0.05) 35%, rgba(41, 24, 16, 0.88) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '28px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--dark-chocolate)',
                    backgroundColor: 'var(--brand-orange)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    marginBottom: '10px',
                  }}
                >
                  {isVi ? featuredFactory.tagVi : featuredFactory.tagEn}
                </span>
                <p
                  style={{
                    color: '#FFFFFF',
                    fontSize: '0.96rem',
                    lineHeight: 1.55,
                    margin: 0,
                    maxWidth: '520px',
                  }}
                >
                  {isVi ? featuredFactory.captionVi : featuredFactory.captionEn}
                </p>
              </div>
            </div>

            {/* 3 Supporting Factory Images */}
            <div className="factory-supporting-stack">
              {supportingFactory.map((item) => (
                <div key={item.id} className="factory-supporting-card">
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                      <source srcSet={item.imageWebp} type="image/webp" />
                      <img
                        src={item.imageJpg}
                        alt={isVi ? item.captionVi : item.captionEn}
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  <div
                    style={{
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'var(--vinaxo-red)',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      {isVi ? item.tagVi : item.tagEn}
                    </span>
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--color-body)',
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {isVi ? item.captionVi : item.captionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4.7 — QUALITY PROMISE (3 STRUCTURED CARDS — BROCHURE PAGE 3)
          ====================================================================== */}
      <section className="section section-cream" style={{ borderTop: '1px solid var(--soft-border)' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '760px', margin: '0 auto 44px auto' }}>
            <span className="section-label">
              {isVi ? 'CAM KẾT CHẤT LƯỢNG B2B' : 'QUALITY PROMISE'}
            </span>
            <h2 className="section-title">
              {isVi ? (
                <>
                  3 NGUYÊN TẮC BẢO CHỨNG <em>UY TÍN XUẤT KHẨU</em>
                </>
              ) : (
                <>
                  OUR THREE-PILLAR <em>QUALITY COMMITMENT</em>
                </>
              )}
            </h2>
            <p className="section-desc section-desc-center">
              {isVi
                ? 'Mỗi đơn hàng xuất khẩu của VINAXO đều đi kèm quy trình kiểm soát nghiêm ngặt từ mẫu thử đầu tiên tới giám định độc lập trước khi xuất cảng.'
                : 'Every export shipment follows a disciplined verification protocol built around buyer sign-off, international compliance, and third-party accountability.'}
            </p>
          </div>

          <div className="quality-promise-grid">
            {QUALITY_PROMISE_CARDS.map((card) => (
              <div key={card.number} className="quality-promise-card">
                <div className="promise-number">{card.number}</div>
                <h3 className="promise-title">
                  {isVi ? card.titleVi : card.titleEn}
                </h3>
                <p className="promise-desc">
                  {isVi ? card.descVi : card.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4.8 — OEM / ODM & PRIVATE LABEL DARK CHOCOLATE FEATURE PANEL
          ====================================================================== */}
      <section className="section section-white" style={{ borderTop: '1px solid var(--soft-border)' }}>
        <div className="container">
          <div className="oem-feature-panel">
            {/* Subtle accent glow */}
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-60px',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(244, 168, 58, 0.22) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '40px',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
              }}
              className="grid-mobile-1"
            >
              <div>
                <span className="section-eyebrow section-eyebrow-light">
                  {isVi ? 'GIA CÔNG OEM / ODM & NHÃN RIÊNG' : 'OEM / ODM & PRIVATE LABEL'}
                </span>
                <h2
                  className="section-title section-title-light"
                  style={{ marginBottom: '14px' }}
                >
                  {isVi ? (
                    <>
                      ĐỐI TÁC SẢN XUẤT <em>NHÃN RIÊNG CHUYÊN NGHIỆP</em>
                    </>
                  ) : (
                    <>
                      CUSTOM PRIVATE LABEL{' '}
                      <span style={{ color: 'var(--brand-orange)' }}>
                        SOLUTIONS
                      </span>
                    </>
                  )}
                </h2>
                <p
                  style={{
                    fontSize: '0.98rem',
                    color: 'rgba(255, 247, 236, 0.88)',
                    lineHeight: 1.65,
                    marginBottom: '24px',
                    maxWidth: '600px',
                  }}
                >
                  {isVi
                    ? 'VINAXO đồng hành cùng các chuỗi siêu thị, nhà nhập khẩu và thương hiệu thực phẩm quốc tế từ khâu nghiên cứu công thức, thiết kế bao bì đến xuất khẩu container hoàn chỉnh.'
                    : 'Partner with an experienced tropical fruit manufacturer equipped for custom flavor formulation, retail branding, flexible bulk-to-pouch formats, and long-term export supply.'}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 28px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {oemCapabilities.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '0.92rem',
                        color: 'rgba(255, 247, 236, 0.94)',
                      }}
                    >
                      <CheckCircle2
                        size={18}
                        style={{ color: 'var(--brand-orange)', flexShrink: 0, marginTop: '2px' }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      onOpenQuote(
                        isVi
                          ? 'Dự án gia công nhãn riêng OEM / ODM'
                          : 'OEM / ODM Private Label Project'
                      )
                    }
                    icon={<ArrowRight size={17} />}
                  >
                    {isVi
                      ? 'Thảo Luận Dự Án Nhãn Riêng'
                      : 'Discuss Your Private Label Project'}
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline-white" size="lg">
                      {isVi ? 'Liên Hệ Bộ Phận Xuất Khẩu' : 'Contact Export Desk'}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Packaging & Capabilities Card Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '18px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 247, 236, 0.08)',
                    border: '1px solid rgba(244, 168, 58, 0.28)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 18px',
                  }}
                >
                  <Sparkles size={22} color="#F4A83A" style={{ marginBottom: '10px' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '6px' }}>
                    {isVi ? 'Công Thức Riêng' : 'Custom Recipes'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {isVi
                      ? 'Tùy chỉnh độ ẩm, lát cắt, tẩm mật ong hoặc phủ sô-cô-la.'
                      : 'Tailored Brix sweetness, cut style, honey infusion, or cocoa dip.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 247, 236, 0.08)',
                    border: '1px solid rgba(244, 168, 58, 0.28)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 18px',
                  }}
                >
                  <PackageCheck size={22} color="#F4A83A" style={{ marginBottom: '10px' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '6px' }}>
                    {isVi ? 'Bao Bì Đóng Gói' : 'Custom Packaging'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {isVi
                      ? 'Túi zip bán lẻ, hộp quà hoặc thùng carton xá công nghiệp.'
                      : 'Retail pouches, upright bags, canisters, and 5–20kg bulk cartons.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 247, 236, 0.08)',
                    border: '1px solid rgba(244, 168, 58, 0.28)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 18px',
                  }}
                >
                  <Award size={22} color="#F4A83A" style={{ marginBottom: '10px' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '6px' }}>
                    {isVi ? 'Nhãn Riêng OEM' : 'Private Label'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {isVi
                      ? 'Sản xuất mang thương hiệu của chuỗi siêu thị và đối tác phân phối.'
                      : 'Contract production ready for supermarket & global retail brands.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 247, 236, 0.08)',
                    border: '1px solid rgba(244, 168, 58, 0.28)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 18px',
                  }}
                >
                  <Factory size={22} color="#F4A83A" style={{ marginBottom: '10px' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '6px' }}>
                    {isVi ? 'Hợp Tác Toàn Cầu' : 'Global Export'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {isVi
                      ? 'Giao thương minh bạch tới Mỹ (~70%), EU (~20%), Nga & Đông Á.'
                      : 'Direct FCL/LCL export supply supporting US, EU, Russia & East Asia.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          PRESERVED FEATURE: GLOBAL MARKET MAP & VERIFIED PRESS ARCHIVE
          ====================================================================== */}
      <section className="section section-cream" id="markets" style={{ borderTop: '1px solid var(--soft-border)' }}>
        <div className="container">
          <div className="quality-global-grid">
            {/* Left Column: Global Market Network Summary */}
            <div>
              <span className="section-label">{t('globalSection.label')}</span>
              <h2 className="section-title">
                <span>{t('globalSection.titleLine1')}</span>
                <br />
                <em>{t('globalSection.titleLine2')}</em>
              </h2>
              <p className="section-desc" style={{ marginBottom: '24px' }}>
                {t('globalSection.description')}
              </p>

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

              <div style={{ paddingTop: '20px' }}>
                <Link to="/markets" className="arrow-link">
                  <span>{t('globalSection.cta')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Column: Re-Themed Interactive SVG Export Map */}
            <div>
              <WorldMapSvg variant="compact" interactive={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Press & News Showcase */}
      <section className="section section-white" id="news" style={{ borderTop: '1px solid var(--soft-border)' }}>
        <div className="container">
          <div className="section-header-bar">
            <div>
              <span className="section-label">{t('newsSection.label')}</span>
              <h2 className="section-title" style={{ marginBottom: '10px' }}>
                <span>{t('newsSection.titleLine1')}</span>{' '}
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

          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            {featuredNews.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </div>
      </section>

      {/* Individual Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestQuote={(productName) => onOpenQuote(productName)}
      />

      {/* Scanned Certificate High-Res Document Preview */}
      <CertificatePreviewModal
        certificate={previewCert}
        isVi={isVi}
        onClose={() => setPreviewCert(null)}
      />

      {/* Brochure Product Line Detail Modal (for Honey-Infused & Chocolate-Dipped OEM lines) */}
      {selectedLine && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedLine(null)}
          role="dialog"
          aria-modal="true"
          aria-label={isVi ? selectedLine.titleVi : selectedLine.titleEn}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: 'var(--soft-beige)' }}>
              <img
                src={selectedLine.imageWebp}
                alt={isVi ? selectedLine.titleVi : selectedLine.titleEn}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '28px' }}>
              <span className="section-label" style={{ marginBottom: '6px' }}>
                {isVi ? 'DÒNG CHẾ BIẾN OEM / ODM' : 'VALUE-ADDED OEM / ODM LINE'}
              </span>
              <h3
                className="title-display"
                style={{
                  fontSize: '1.75rem',
                  color: 'var(--dark-chocolate)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {isVi ? selectedLine.titleVi : selectedLine.titleEn}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-body)', lineHeight: 1.65, marginBottom: '16px' }}>
                {isVi ? selectedLine.descVi : selectedLine.descEn}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {(isVi ? selectedLine.highlightsVi : selectedLine.highlightsEn).map((tag, i) => (
                  <span key={i} className="badge badge-gold">
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                <Button variant="secondary" size="sm" onClick={() => setSelectedLine(null)}>
                  {isVi ? 'Đóng' : 'Close'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  onClick={() => {
                    const lineTitle = isVi ? selectedLine.titleVi : selectedLine.titleEn;
                    setSelectedLine(null);
                    onOpenQuote(lineTitle);
                  }}
                >
                  {isVi ? 'Yêu Cầu Báo Giá & Mẫu Thử' : 'Request Line Samples & Quote'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
