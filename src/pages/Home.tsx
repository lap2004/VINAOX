import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, Globe, Sparkles, Award, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productsData, ProductItem } from '../data/products';
import { newsData } from '../data/news';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { NewsCard } from '../components/news/NewsCard';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Home: React.FC = () => {
  const { language } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Top 5 featured products for Homepage
  const featuredProducts = productsData.slice(0, 5);

  // Top 3 verified news articles for Homepage
  const featuredNews = newsData.slice(0, 3);

  const stats = [
    {
      value: '~70%',
      label: isVi ? 'Thị phần xuất khẩu Hoa Kỳ' : 'US Export Market Share',
      source: isVi ? 'Nguồn: Báo Người Lao Động' : 'Source: Người Lao Động',
      desc: isVi ? 'Thị trường trọng điểm lớn nhất' : 'Primary overseas destination',
    },
    {
      value: '~20%',
      label: isVi ? 'Kim ngạch xuất khẩu Châu Âu' : 'EU Export Market Sales',
      source: isVi ? 'Nguồn: Báo Người Lao Động' : 'Source: Người Lao Động',
      desc: isVi ? 'Đáp ứng chính sách xanh EU & ESG' : 'EU ESG & Green compliance',
    },
    {
      value: '1,000+',
      unit: isVi ? 'Tấn/tháng' : 'MT/Mo',
      label: isVi ? 'Công suất thu mua quả tươi' : 'Fresh Fruit Procurement',
      source: isVi ? 'Nguồn: Báo Đồng Tháp' : 'Source: Báo Đồng Tháp',
      desc: isVi ? 'Vựa xoài Đồng Tháp & Tiền Giang' : 'Mekong Delta farming network',
    },
    {
      value: 'BRCGS',
      unit: 'Grade B',
      label: isVi ? 'Tiêu chuẩn an toàn toàn cầu' : 'Global Food Safety Standard',
      source: isVi ? 'Nguồn: Báo Người Lao Động' : 'Source: Người Lao Động',
      desc: isVi ? 'Đủ điều kiện xuất siêu thị quốc tế' : 'Certified processing facility',
    },
  ];

  return (
    <div className="home-page">
      {/* ======================================================================
          SECTION 1 — HERO SECTION
          ====================================================================== */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(56px, 8vw, 96px)',
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
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Narrative & CTAs */}
            <div>
              {/* Eyebrow Badge */}
              <div style={{ marginBottom: '16px' }}>
                <span className="section-eyebrow">
                  <Leaf size={14} />
                  <span>
                    {isVi
                      ? 'CÔNG TY TNHH VINAXO • XUẤT KHẨU NÔNG SẢN VIỆT NAM'
                      : 'VINAXO COMPANY LIMITED • VIETNAM AGRICULTURAL EXPORTER'}
                  </span>
                </span>
              </div>

              {/* Serif Headline */}
              <h1
                className="title-serif"
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: 'var(--color-heading)',
                  marginBottom: '20px',
                }}
              >
                <span>{isVi ? 'Trái Cây Sấy Tự Nhiên' : 'Natural Dried Fruits'}</span>
                <br />
                <em style={{ color: 'var(--primary-green)' }}>
                  {isVi ? 'Vươn Tầm Toàn Cầu' : 'Global Market Reach'}
                </em>
              </h1>

              {/* Subtitle Description */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                  lineHeight: 1.7,
                  color: 'var(--color-body)',
                  marginBottom: '32px',
                  maxWidth: '580px',
                }}
              >
                {isVi
                  ? 'Chuyên chế biến và xuất khẩu trái cây sấy dẻo tự nhiên từ vùng Đồng bằng Sông Cửu Long (xoài, mít, thanh long, dứa, chuối) — 100% thuần tự nhiên, không thêm đường, đạt chứng nhận BRCGS Grade B và phục vụ thị trường Hoa Kỳ, EU và các đối tác B2B quốc tế.'
                  : 'Specializing in 100% natural soft-dried tropical fruits from the Mekong Delta — no added sugar, preservative-free. BRCGS Grade B food safety certified, trusted across the United States, Europe, and global wholesale markets.'}
              </p>

              {/* Double CTAs */}
              <div
                className="hero-ctas"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '40px',
                  flexWrap: 'wrap',
                }}
              >
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                    {isVi ? 'Khám Phá Sản Phẩm' : 'Explore Our Products'}
                  </Button>
                </Link>

                <Link to="/about">
                  <Button variant="secondary" size="lg">
                    {isVi ? 'Về VINAXO' : 'About VINAXO'}
                  </Button>
                </Link>
              </div>

              {/* 3 Trust Feature Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--sage-border)',
                }}
                className="grid-mobile-1"
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--light-sage)',
                      color: 'var(--primary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Leaf size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-heading)' }}>
                      {isVi ? '100% Tự Nhiên' : '100% Natural'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                      {isVi ? 'Không đường, không phẩm màu' : 'Zero added sugar'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--light-sage)',
                      color: 'var(--primary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-heading)' }}>
                      {isVi ? 'Vựa ĐBSCL' : 'Mekong Delta'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                      {isVi ? 'Đồng Tháp & Tiền Giang' : 'Direct farm sourcing'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--light-sage)',
                      color: 'var(--primary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Globe size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--color-heading)' }}>
                      {isVi ? '~70% Hoa Kỳ' : '~70% US Market'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                      {isVi ? '& ~20% Châu Âu' : '& ~20% EU share'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Art Showcase & Stamp */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '8px solid var(--white)',
                  boxShadow: 'var(--shadow-xl)',
                  aspectRatio: '4/3',
                  backgroundColor: '#F5F8F5',
                }}
              >
                <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                  <source srcSet="/assets/images/hero_fruits.webp" type="image/webp" />
                  <img
                    src="/assets/images/hero_fruits.jpg"
                    alt="VINAXO Dried Fruits Platter"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </picture>

                {/* Elegant overlay caption */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 24px rgba(16, 61, 42, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-script)',
                        fontSize: '1.45rem',
                        color: 'var(--forest-green)',
                        fontWeight: 700,
                        lineHeight: 1.15,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Good Fruits, Brighter Tomorrows
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-body)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {isVi
                        ? 'Trái cây sấy dẻo nhiệt thấp chuẩn xuất khẩu'
                        : 'Low-temperature export-grade dehydrated fruits'}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--forest-green)',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      letterSpacing: '0.04em',
                    }}
                  >
                    OCOP 3★
                  </div>
                </div>
              </div>

              {/* Floating Stamp: FROM VIETNAM TO THE WORLD */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  width: '92px',
                  height: '92px',
                  zIndex: 3,
                  filter: 'drop-shadow(0 8px 20px rgba(16, 61, 42, 0.16))',
                  animation: 'spinSlow 36s linear infinite',
                  pointerEvents: 'none',
                }}
                className="hero-floating-stamp"
              >
                <img
                  src="/assets/icons/stamp.svg"
                  alt="From Vietnam to the World"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 2 — ABOUT VINAXO PREVIEW & VERIFIED STATS
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <div
            className="about-preview-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: 'clamp(36px, 5vw, 64px)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Narrative */}
            <div>
              <SectionHeading
                eyebrow={isVi ? 'VỀ CÔNG TY TNHH VINAXO' : 'ABOUT VINAXO'}
                titleLine1={isVi ? 'Gốc Rễ Từ Đồng Bằng Sông Cửu Long' : 'Rooted in the Mekong Delta'}
                titleLine2={isVi ? 'Nâng Tầm Giá Trị Nông Sản Việt' : 'Elevating Vietnamese Agricultural Value'}
                description={
                  isVi
                    ? 'Thành lập từ năm 2018 tại huyện Gò Công Tây, tỉnh Tiền Giang với vùng nguyên liệu xoài tập trung tại Đồng Tháp, VINAXO vận hành nhà máy chế biến quy mô <strong>4.000 m²</strong> với vốn đầu tư hơn 15 tỷ đồng. Năng lực bao tiêu hơn <strong>1.000 tấn</strong> quả tươi mỗi tháng mùa vụ, ứng dụng công nghệ sấy dẻo nhiệt thấp tuần hoàn (~60°C) giữ trọn dinh dưỡng và hương vị tự nhiên.'
                    : 'Established in Go Cong Tay, Tien Giang with concentrated mango raw material sourcing in Dong Thap, VINAXO operates a modern <strong>4,000 m²</strong> processing facility. Sourcing over <strong>1,000 tons</strong> of fresh tropical fruits monthly directly from local farmers, we deploy high-tech low-temperature drying (~60°C) and vacuum frying to preserve authentic aromas and vital nutrients.'
                }
              />

              <div style={{ marginTop: '28px' }}>
                <Link to="/about">
                  <Button variant="secondary" icon={<ArrowRight size={16} />}>
                    {isVi ? 'Xem Hồ Sơ Doanh Nghiệp & Lãnh Đạo' : 'Our Leadership & Story'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Verified Corporate Metrics (2x2 Grid) */}
            <div
              className="stats-grid-2x2"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
              }}
            >
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cream-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      className="title-serif"
                      style={{
                        fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                        fontWeight: 700,
                        color: 'var(--forest-green)',
                        lineHeight: 1,
                        marginBottom: '6px',
                      }}
                    >
                      {s.value}{' '}
                      {s.unit && (
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-muted)' }}>
                          {s.unit}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: 'var(--color-heading)',
                        marginBottom: '6px',
                      }}
                    >
                      {s.label}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-body)', lineHeight: 1.5 }}>
                      {s.desc}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--color-muted)',
                      marginTop: '16px',
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    {s.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 3 — FEATURED PRODUCTS SHOWCASE
          ====================================================================== */}
      <section className="section section-cream" id="products">
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <SectionHeading
              eyebrow={isVi ? 'DANH MỤC SẢN PHẨM CHỦ LỰC' : 'OUR PRODUCTS'}
              titleLine1={isVi ? 'Trái Cây Sấy Tuyển Chọn' : 'Selected Tropical Dried Fruits'}
              titleLine2={isVi ? 'Đạt Tiêu Chuẩn Xuất Khẩu B2B' : "from Vietnam's Premier Orchards"}
              description={
                isVi
                  ? 'Tuyển chọn từ những giống xoài Cát Chu, mít Thái, thanh long Chợ Gạo và dứa Tân Phước chín tự nhiên, sấy dẻo nhiệt thấp giữ nguyên hương vị nhiệt đới đậm đà.'
                  : 'Carefully hand-selected at optimal ripeness and gently dehydrated using low-heat technology — VINAXO brings authentic, nutrient-rich Vietnamese flavors to the international stage.'
              }
              className="mb-0"
            />

            <Link to="/products">
              <Button variant="outline" icon={<ChevronRight size={16} />}>
                {isVi ? 'Xem Toàn Bộ Sản Phẩm' : 'View All Products & Specifications'}
              </Button>
            </Link>
          </div>

          {/* Featured Product Cards Grid */}
          <div
            className="home-products-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
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
          SECTION 4 — QUALITY & PRODUCTION COMMITMENT
          ====================================================================== */}
      <section className="section section-white" id="quality">
        <div className="container">
          <div
            className="quality-overview-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.25fr',
              gap: 'clamp(36px, 5vw, 64px)',
              alignItems: 'center',
            }}
          >
            <div>
              <SectionHeading
                eyebrow={isVi ? 'CHỨNG NHẬN & TIÊU CHUẨN' : 'QUALITY STANDARDS'}
                titleLine1={isVi ? 'Hệ Thống Chất Lượng' : 'Verified International Standards'}
                titleLine2={isVi ? 'Chuẩn BRCGS Grade B & OCOP' : 'for Global Food Safety'}
                description={
                  isVi
                    ? 'Nhà máy chế biến VINAXO tại Tiền Giang đạt tiêu chuẩn an toàn thực phẩm toàn cầu BRCGS Grade B. Chúng tôi tuân thủ quy trình khép kín, kiểm soát kim loại và giữ vững nguyên tắc 100% tự nhiên không phụ gia độc hại.'
                    : "VINAXO's processing facility operates under strict hygiene and temperature controls. Our gentle dehydration at ~60°C and centrifugal oil separation retain authentic colors, vitamins, and tropical flavors without artificial preservatives or refined sugars."
                }
              />

              <div style={{ marginTop: '24px' }}>
                <Link to="/quality">
                  <Button variant="primary" icon={<ArrowRight size={16} />}>
                    {isVi ? 'Chi Tiết Quy Trình 6 Bước' : 'Explore Manufacturing Process'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4 Verified Standards Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '18px',
              }}
              className="grid-mobile-1"
            >
              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--cream-bg)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Award size={24} color="var(--primary-green)" />
                  <span className="badge badge-green">VERIFIED STANDARD</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                  BRCGS Food Safety
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-green)', marginBottom: '8px' }}>
                  Grade B Global Standard
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                  {isVi
                    ? 'Tiêu chuẩn quốc tế phục vụ các chuỗi siêu thị bán lẻ tại Hoa Kỳ và Châu Âu.'
                    : 'Benchmarked food safety standard for world supermarkets export.'}
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--cream-bg)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Sparkles size={24} color="#D4A373" />
                  <span className="badge badge-gold">VERIFIED OCOP</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                  OCOP 3-Star Produce
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92541C', marginBottom: '8px' }}>
                  Tỉnh Đồng Tháp & Tiền Giang
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                  {isVi
                    ? 'Chứng nhận chính thức cho dòng sản phẩm Xoài sấy dẻo, Mít sấy dẻo và Thanh long sấy.'
                    : 'Official regional recognition for Dried Mango, Jackfruit & Dragon Fruit.'}
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--cream-bg)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <ShieldCheck size={24} color="#1D4ED8" />
                  <span className="badge badge-blue">ACTIVE PROGRAM</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                  BSCI & Green ESG
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '8px' }}>
                  Social & Environmental
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                  {isVi
                    ? 'Cam kết trách nhiệm xã hội, không lao động trẻ em và chuỗi cung ứng xanh chuẩn EUDR.'
                    : 'Full workplace responsibility, fair practices, and EUDR-aligned supply chain.'}
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--cream-bg)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <CheckCircle2 size={24} color="var(--primary-green)" />
                  <span className="badge badge-green">100% PURE</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                  Clean Label Commitment
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-green)', marginBottom: '8px' }}>
                  No Additives Guarantee
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.55 }}>
                  {isVi
                    ? 'Không chất bảo quản nhân tạo, không phẩm màu, lưu giữ trọn vẹn vị ngọt thanh mát.'
                    : 'Zero artificial preservatives, no added colorings, pure tropical taste.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 5 — GLOBAL MARKET & EXPORT MAP VISUALIZATION
          ====================================================================== */}
      <section className="section section-cream" id="markets">
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '36px',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <SectionHeading
              eyebrow={isVi ? 'THỊ TRƯỜNG XUẤT KHẨU TOÀN CẦU' : 'GLOBAL EXPORT MARKETS'}
              titleLine1={isVi ? 'Mạng Lưới Xuất Khẩu' : 'Trusted Supply Chain'}
              titleLine2={isVi ? 'Tới Hoa Kỳ, Châu Âu & Đông Á' : 'to the US, Europe & Asia'}
              description={
                isVi
                  ? 'Với gần <strong>70%</strong> sản lượng xuất khẩu sang thị trường Hoa Kỳ và khoảng <strong>20%</strong> phục vụ các đối tác Đức, Phần Lan cùng thị trường Hàn Quốc, Nga; VINAXO là đối tác B2B đáng tin cậy cho các nhà phân phối và chuỗi siêu thị.'
                  : 'With ~70% of export volume shipped to the United States and ~20% serving European partners (including Germany and Finland), VINAXO is a trusted B2B partner for wholesale distributors and supermarket chains worldwide.'
              }
              className="mb-0"
            />

            <Link to="/markets">
              <Button variant="outline" icon={<ArrowRight size={16} />}>
                {isVi ? 'Chi Tiết Logistics & Cảng Đến' : 'Explore Export Logistics'}
              </Button>
            </Link>
          </div>

          {/* Interactive World Map SVG */}
          <WorldMapSvg interactive={true} />
        </div>
      </section>

      {/* ======================================================================
          SECTION 6 — LATEST VERIFIED PRESS & MEDIA
          ====================================================================== */}
      <section className="section section-white" id="news">
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <SectionHeading
              eyebrow={isVi ? 'BÁO CHÍ & TRUYỀN THÔNG' : 'PRESS & MEDIA'}
              titleLine1={isVi ? 'Báo Chí Nói Về VINAXO' : 'VINAXO in the Press'}
              titleLine2={isVi ? '& Hoạt Động Doanh Nghiệp' : '& Corporate Milestones'}
              description={
                isVi
                  ? 'Những bài viết và trích dẫn phát biểu của Ban Lãnh đạo VINAXO trên các kênh báo chí chính luận: CafeF, Báo Người Lao Động, Báo 24H, Báo Sài Gòn Giải Phóng, Báo Đồng Tháp.'
                  : 'Verified coverage from leading Vietnamese news agencies on our export operations, raw material sourcing, and processing standards.'
              }
              className="mb-0"
            />

            <Link to="/news">
              <Button variant="outline" icon={<ChevronRight size={16} />}>
                {isVi ? 'Xem Toàn Bộ 9 Bài Báo' : 'Explore All 9 Articles'}
              </Button>
            </Link>
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
                  : 'Our 4,000 m² processing facility in Go Cong Tay, Tien Giang is primed to deliver export-grade dried fruits and OEM private labeling for global buyers.'}
              </p>

              <div
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
