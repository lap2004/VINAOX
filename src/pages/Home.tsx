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
import { getLegalCompanyName } from '../data/company';
import { productsData, ProductItem } from '../data/products';
import {
  COMPLIANCE_ITEMS,
  BROCHURE_CATEGORIES,
  FACTORY_GALLERY,
  QUALITY_PROMISE_CARDS,
  BrochureCategory,
  ComplianceBadge,
  getComplianceLocalized,
} from '../data/brochureData';
import { getAllNewsItems } from '../services/contentService';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CertificatePreviewModal } from '../components/ui/CertificatePreviewModal';
import { NewsCard } from '../components/news/NewsCard';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Home: React.FC = () => {
  const { language, t, pick } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const legalName = getLegalCompanyName(language);

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedLine, setSelectedLine] = useState<BrochureCategory | null>(null);
  const [previewCert, setPreviewCert] = useState<ComplianceBadge | null>(null);

  const getComplianceClassLabel = (item: ComplianceBadge) => {
    if (item.id === 'fda') {
      return pick({ vi: 'Đăng ký Cơ sở FDA', en: 'Facility Registration', ko: 'FDA 시설 등록', zh: 'FDA 设施注册' });
    }
    if (item.id === 'smeta') {
      return pick({ vi: 'Kiểm toán Đạo đức', en: 'Ethical Trade Audit', ko: '윤리적 무역 감사', zh: '商业道德审核' });
    }
    if (item.id === 'costco') {
      return pick({ vi: 'Kiểm toán Nhà cung cấp', en: 'Retail Supplier Audit', ko: '유통사 공급망 감사', zh: '商超供应链审核' });
    }
    return pick({ vi: 'Chứng nhận', en: 'Certification', ko: '국제 인증', zh: '权威认证' });
  };

  const renderCollectionTile = (line: BrochureCategory, variant: 'featured' | 'standard') => {
    const title = pick({ vi: line.titleVi, en: line.titleEn, ko: line.titleKo, zh: line.titleZh });
    const summary = pick({
      vi: line.summaryVi || line.descVi,
      en: line.summaryEn || line.descEn,
      ko: line.descKo,
      zh: line.descZh
    });
    const linkLabel =
      variant === 'featured'
        ? pick({ vi: 'Khám phá bộ sưu tập', en: 'Explore Collection', ko: '제품 컬렉션 보기', zh: '探索产品系列' })
        : pick({ vi: 'Xem chi tiết dòng sản phẩm', en: 'Discover Products', ko: '세부 품목 보기', zh: '查看系列详情' });
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
  const newsData = getAllNewsItems();
  const featuredProducts = productsData.slice(0, 8);
  const featuredNews = newsData.slice(0, 3);

  const featuredFactory = FACTORY_GALLERY[0];
  const supportingFactory = FACTORY_GALLERY.slice(1, 4);

  const manufacturingCapabilities = [
    {
      value: pick({ vi: '300 tấn', en: '300 t', ko: '300톤', zh: '300 吨' }),
      label: pick({ vi: 'Sản lượng sản xuất mỗi tháng', en: 'Monthly production output', ko: '월간 생산량', zh: '月度成品产量' }),
      detail: pick({ vi: 'Tăng trưởng qua từng năm', en: 'Growing year on year', ko: '매년 지속 성장 중', zh: '逐年稳步增长' }),
    },
    {
      value: '200 kg',
      label: pick({ vi: 'Đơn hàng tối thiểu (MOQ)', en: 'Minimum order quantity', ko: '최소 주문 수량 (MOQ)', zh: '最低起订量 (MOQ)' }),
      detail: pick({ vi: 'Linh hoạt đến 1 tấn tùy mặt hàng', en: 'Varies by product up to 1 ton', ko: '품목별 200kg~1톤 유연 적용', zh: '视具体品项 200kg–1吨不等' }),
    },
    {
      value: pick({ vi: '2–4 tuần', en: '2–4 weeks', ko: '2~4주', zh: '2–4 周' }),
      label: pick({ vi: 'Thời gian sản xuất tiêu chuẩn', en: 'Typical lead time', ko: '표준 생산 리드타임', zh: '常规生产交货期' }),
      detail: pick({ vi: 'Tùy sản lượng và quy cách đóng gói', en: 'Depends on volume & packaging', ko: '주문 수량 및 포장 사양에 따라 상이', zh: '视订单数量与包装规格而定' }),
    },
    {
      value: pick({ vi: '25.000 m²', en: '25,000 m²', ko: '25,000 m²', zh: '25,000 平方米' }),
      label: pick({ vi: 'Tổng diện tích nhà máy', en: 'Total factory area', ko: '총 공장 부지 면적', zh: '工厂总占地面积' }),
      detail: pick({ vi: 'Tại tỉnh Đồng Tháp, Việt Nam', en: 'Dong Thap Province, Vietnam', ko: '베트남 동탑성 소재', zh: '位于越南同塔省' }),
    },
  ];

  const oemCapabilities = pick({
    vi: [
      'Tùy chỉnh công thức độ ẩm, độ ngọt Brix & hương vị theo thị trường',
      'Thiết kế & in ấn bao bì theo bộ nhận diện thương hiệu riêng (OEM/ODM)',
      'Đáp ứng đa dạng đóng gói từ túi bán lẻ (50g–500g) đến thùng xuất khẩu (5kg–20kg)',
      'Hỗ trợ mẫu thử chuẩn đánh giá chất lượng trước khi sản xuất đại trà',
      'Hồ sơ xuất khẩu đồng bộ cho chuỗi bán lẻ tại Mỹ, Châu Âu, Nga & Châu Á',
    ],
    en: [
      'Custom recipes tailored to regional sweetness, moisture, and texture preferences',
      'Custom retail & private-label packaging engineered to buyer artwork',
      'Bulk master cartons (5kg–20kg) and finished retail pouches (50g–500g)',
      'Complimentary evaluation sample kits & pre-shipment standard verification',
      'Proven international collaboration across US, European, and Asian retail channels',
    ],
    ko: [
      '시장별 선호 당도(Brix), 수분 함량 및 식감을 반영한 맞춤형 레시피 개발',
      '바이어 브랜드 아이덴티티(OEM/ODM)에 맞춘 리테일 패키지 디자인 및 인쇄',
      '소매용 지퍼 파우치(50g–500g)부터 수출용 벌크 마스터 카톤(5kg–20kg)까지 대응',
      '대량 생산 전 품질 평가용 무상 샘플 키트 및 선적 전 표준 검사 지원',
      '미국, 유럽, 러시아 및 아시아 주요 리테일 채널과의 검증된 수출 협력 실적',
    ],
    zh: [
      '可根据目标市场口感定制产品水分、甜度（Brix）及专属风味配方',
      '支持依据客户品牌视觉系统进行 OEM / ODM 贴牌包装设计与印制',
      '灵活提供零售自封袋（50g–500g）至大宗出口外箱（5kg–20kg）多种规格',
      '量产前免费提供评估样品套装及出货前标准留样核验服务',
      '成熟配合美国、欧洲、俄罗斯及亚洲商超渠道的全套出口合规单证',
    ],
  });

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
                  {pick({
                    vi: 'VINAXO · SẢN XUẤT TẠI VIỆT NAM',
                    en: 'VINAXO · MADE IN VIETNAM',
                    ko: 'VINAXO · 베트남 원산 제조',
                    zh: 'VINAXO · 越南源头工厂直供'
                  })}
                </span>
              </div>

              <h1 className="hero-headline-condensed">
                {pick({
                  vi: (
                    <>
                      <span className="hero-headline-line">TRÁI CÂY SẤY</span>
                      <span className="hero-headline-line">NHIỆT ĐỚI</span>
                      <span className="hero-headline-line hero-headline-highlight">
                        &amp; ĐỒ ĂN NHẸ CAO CẤP
                      </span>
                    </>
                  ),
                  en: (
                    <>
                      <span className="hero-headline-line">PREMIUM TROPICAL</span>
                      <span className="hero-headline-line">DRIED FRUIT</span>
                      <span className="hero-headline-line hero-headline-highlight">
                        &amp; HEALTHY SNACKS
                      </span>
                    </>
                  ),
                  ko: (
                    <>
                      <span className="hero-headline-line">프리미엄 열대</span>
                      <span className="hero-headline-line">건조 과일 &amp;</span>
                      <span className="hero-headline-line hero-headline-highlight">
                        건강한 내추럴 스낵
                      </span>
                    </>
                  ),
                  zh: (
                    <>
                      <span className="hero-headline-line">越南高端热带</span>
                      <span className="hero-headline-line">天然软烘干果与</span>
                      <span className="hero-headline-line hero-headline-highlight">
                        健康休闲零食制造商
                      </span>
                    </>
                  ),
                })}
              </h1>

              <p className="hero-desc">
                {pick({
                  vi: 'Tuyển chọn trái cây tươi ngon Việt Nam, sấy nhẹ giữ trọn vị ngon tự nhiên thành món ăn nhẹ lành mạnh — được các đối tác bán lẻ, dịch vụ ẩm thực và nhãn hàng riêng tại hơn 15 quốc gia tin tưởng.',
                  en: 'Carefully selected Vietnamese fruit, gently dried and crafted into wholesome snacks — trusted by retail, food-service and private-label partners in over 15 countries.',
                  ko: '엄선된 베트남산 생과일을 저온 건조하여 자연 본연의 풍미와 영양을 살린 건강한 스낵을 생산합니다. 전 세계 15개국 이상의 리테일·외식·PB 파트너가 신뢰하는 공급사입니다.',
                  zh: '严选越南优质热带鲜果，低温轻柔烘干制成保留原生果香的健康零食——深受全球超过 15 个国家和地区商超零售、餐饮及贴牌品牌信赖。'
                })}
              </p>

              {/* Primary Orange CTA & Secondary Dark Chocolate Outline CTA */}
              <div className="hero-actions">
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={<ArrowRight size={17} />}>
                    {pick({ vi: 'Khám Phá Sản Phẩm', en: 'Explore Products', ko: '제품 카탈로그 보기', zh: '探索出口产品' })}
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onOpenQuote()}
                >
                  {pick({ vi: 'Yêu Cầu Báo Giá', en: 'Request a Quote', ko: '견적 요청하기', zh: '获取 B2B 报价' })}
                </Button>
              </div>

              {/* 3 Key Highlights (Desktop) */}
              <div className="hero-features hero-features-desktop">
                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <Leaf size={16} />
                  </div>
                  <div className="feature-text">
                    {pick({
                      vi: '100% Trái Cây Chọn Lọc\nChế Biến Lành Mạnh',
                      en: 'Selected Vietnamese Fruit\nWholesome Craft',
                      ko: '엄선된 베트남 생과일\n무첨가 정밀 건조',
                      zh: '精选越南天然鲜果\n洁净标签健康工艺'
                    })}
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <MapPin size={16} />
                  </div>
                  <div className="feature-text">
                    {pick({
                      vi: 'Nhà Máy 25.000 m²\nVĩnh Bình, Đồng Tháp',
                      en: '25,000 m² Factory\nDong Thap, Vietnam',
                      ko: '25,000 m² 가공 공장\n베트남 동탑성 빈빈',
                      zh: '25,000 平方米直营工厂\n越南同塔省永平'
                    })}
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-circle">
                    <Globe size={16} />
                  </div>
                  <div className="feature-text">
                    {pick({
                      vi: 'Đối Tác Trên 15 Quốc Gia\nRetail • Food-Service • OEM',
                      en: '15+ Export Countries\nRetail • Food-Service • OEM',
                      ko: '15개국 이상 수출 실적\n리테일 • 외식 • OEM',
                      zh: '出口全球 15+ 国家\n商超零售 • 餐饮 • OEM 代工'
                    })}
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
                      alt={pick({
                        vi: 'Xoài sấy dẻo VINAXO vàng óng tự nhiên',
                        en: 'VINAXO golden soft-dried mango slices',
                        ko: '황금빛 천연 VINAXO 소프트 건망고 슬라이스',
                        zh: '天然金黄色 VINAXO 软烘芒果干片'
                      })}
                      width={1026}
                      height={869}
                    />
                  </picture>
                </div>

                <div className="hero-photo-tile">
                  <picture>
                    <source srcSet="/assets/images/hero-brochure-dragonfruit.webp" type="image/webp" />
                    <img
                      src="/assets/images/hero-brochure-dragonfruit.jpg"
                      alt={pick({
                        vi: 'Thanh long tươi và thanh long sấy tự nhiên VINAXO',
                        en: 'Vietnamese fresh dragon fruit paired with dehydrated slices',
                        ko: '베트남산 신선 용과와 VINAXO 건조 용과 슬라이스',
                        zh: '越南新鲜红心火龙果与 VINAXO 天然烘干果片'
                      })}
                      width={1026}
                      height={869}
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
                  {pick({
                    vi: '100% Trái Cây Chọn Lọc • Chế Biến Lành Mạnh',
                    en: 'Selected Vietnamese Fruit • Wholesome Craft',
                    ko: '엄선된 베트남 과일 • 건강한 무첨가 공법',
                    zh: '精选越南天然鲜果 • 健康洁净加工工艺'
                  })}
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <MapPin size={16} />
                </div>
                <div className="feature-text">
                  {pick({
                    vi: 'Nhà Máy 25.000 m² • Vĩnh Bình, Đồng Tháp',
                    en: '25,000 m² Complex • Vinh Binh, Dong Thap',
                    ko: '25,000 m² 가공 단지 • 동탑성 빈빈',
                    zh: '25,000 m² 一体化园区 • 越南同塔省永平'
                  })}
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-circle">
                  <Globe size={16} />
                </div>
                <div className="feature-text">
                  {pick({
                    vi: 'Đối Tác Hơn 15 Quốc Gia • Retail & OEM',
                    en: '15+ Countries • Retail, Food-Service & OEM',
                    ko: '15개국 이상 수출 • 리테일 · 외식 · OEM',
                    zh: '服务 15+ 国家 • 商超零售与 OEM 贴牌'
                  })}
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
        aria-label={pick({
          vi: 'Chứng nhận và tiêu chuẩn quốc tế',
          en: 'Certifications and international compliance',
          ko: '국제 식품안전 인증 및 준수 현황',
          zh: '国际认证与合规资质'
        })}
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
                {pick({
                  vi: 'CHẤT LƯỢNG & TUÂN THỦ QUỐC TẾ',
                  en: 'QUALITY & COMPLIANCE',
                  ko: '품질 보증 및 국제 규정 준수',
                  zh: '品质保障与国际合规'
                })}
              </span>
              <h2 className="cert-showcase-title">
                {pick({
                  vi: 'CHỨNG NHẬN & TIÊU CHUẨN QUỐC TẾ',
                  en: 'CERTIFICATIONS & INTERNATIONAL COMPLIANCE',
                  ko: '국제 식품안전 인증 및 컴플라이언스',
                  zh: '国际权威认证与出口合规标准'
                })}
              </h2>
              <div className="cert-heading-accent" aria-hidden="true" />
              <p className="cert-showcase-desc">
                {pick({
                  vi: 'Cam kết tuân thủ các hệ thống an toàn thực phẩm, quản lý chất lượng và đạo đức kinh doanh quốc tế, tạo nền tảng tin cậy cho đối tác toàn cầu.',
                  en: 'Committed to internationally recognised food safety, quality and ethical standards, supporting trusted partnerships across global markets.',
                  ko: '국제 공인 식품안전·품질 경영 및 윤리적 무역 기준을 철저히 준수하여 글로벌 바이어에게 신뢰할 수 있는 공급 기반을 제공합니다.',
                  zh: '严格遵循国际公认的食品安全、质量管理及商业道德审计体系，为全球采购伙伴筑牢品质信赖基石。'
                })}
              </p>
            </div>

            <Link to="/quality#certificates" className="arrow-link cert-showcase-cta">
              <span>{pick({
                vi: 'Xem Bản Chụp Chứng Nhận & Kiểm Toán',
                en: 'View Certificates & Audits',
                ko: '인증서 및 감사 보고서 보기',
                zh: '查看全部认证与审核档案'
              })}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cert-showcase-grid">
            {COMPLIANCE_ITEMS.map((item) => {
              const classLabel = getComplianceClassLabel(item);
              const locCert = getComplianceLocalized(item, language);
              const hasDocumentScan = Boolean(item.certImageWebp);
              const cardContent = (
                <>
                  <div className="cert-doc-frame">
                    {hasDocumentScan ? (
                      <picture>
                        <source srcSet={item.certImageWebp} type="image/webp" />
                        <img
                          src={item.certImageJpg}
                          alt={`${locCert.name} — VINAXO`}
                          className="cert-doc-img"
                          loading="lazy"
                        />
                      </picture>
                    ) : item.isHalalPlaceholder ? (
                      <div className="cert-typographic-mark is-halal" aria-hidden="true">
                        <span className="cert-mark-primary">HALAL</span>
                        <span className="cert-mark-sub">{pick({ vi: 'TIÊU CHUẨN', en: 'COMPLIANCE', ko: '인증 표준', zh: '清真标准' })}</span>
                      </div>
                    ) : (
                      <div className="cert-typographic-mark is-audit" aria-hidden="true">
                        <span className="cert-mark-kicker">COSTCO</span>
                        <span className="cert-mark-primary">GMP</span>
                        <span className="cert-mark-sub">{pick({ vi: 'KIỂM TOÁN', en: 'AUDIT', ko: '공급망 감사', zh: '合规审核' })}</span>
                      </div>
                    )}
                  </div>

                  <div className="cert-card-body">
                    <div>
                      <span className="cert-class-kicker">{classLabel}</span>
                      <h3 className="cert-card-name">{locCert.name}</h3>
                      <p className="cert-card-scope">{locCert.scope}</p>
                    </div>

                    {hasDocumentScan && (
                      <span className="cert-doc-action">
                        <span>{pick({ vi: 'Xem bản chụp', en: 'View document', ko: '원본 보기', zh: '查看扫描件' })}</span>
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
                    aria-label={pick({
                      vi: `Xem bản chụp ${locCert.name}`,
                      en: `Preview ${locCert.name} document`,
                      ko: `${locCert.name} 문서 미리보기`,
                      zh: `预览 ${locCert.name} 证书文件`
                    })}
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
        aria-label={pick({ vi: 'Bộ sưu tập sản phẩm VINAXO', en: 'VINAXO Product Range', ko: 'VINAXO 제품 라인업', zh: 'VINAXO 产品矩阵' })}
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
                {pick({ vi: 'BỘ SƯU TẬP VINAXO', en: 'VINAXO COLLECTION', ko: 'VINAXO 제품 컬렉션', zh: 'VINAXO 核心产品矩阵' })}
              </span>
              <h2 className="collection-title">
                {pick({
                  vi: (
                    <>
                      DÒNG SẢN PHẨM <em>CHỦ LỰC</em>
                    </>
                  ),
                  en: (
                    <>
                      OUR PRODUCT <em>RANGE</em>
                    </>
                  ),
                  ko: (
                    <>
                      주요 수출 <em>제품 라인업</em>
                    </>
                  ),
                  zh: (
                    <>
                      六大核心 <em>热带果干系列</em>
                    </>
                  ),
                })}
              </h2>
              <p className="collection-desc">
                {pick({
                  vi: 'Sáu dòng sản phẩm đặc trưng chế biến từ trái cây nhiệt đới thượng hạng Việt Nam phục vụ thị trường quốc tế.',
                  en: 'Six distinctive product lines, crafted from premium Vietnamese tropical fruit for international markets.',
                  ko: '엄선된 베트남 프리미엄 열대 과일로 가공한 글로벌 수출용 6대 특화 제품 라인업을 만나보세요.',
                  zh: '精选优质越南热带水果打造的六大特色出口产品线，全面适配国际商超及贴牌渠道需求。'
                })}
              </p>
            </div>

            <Link to="/products" className="arrow-link collection-header-cta">
              <span>{pick({
                vi: 'Khám Phá Toàn Bộ Danh Mục',
                en: 'Explore Full Product Catalog',
                ko: '전체 제품 카탈로그 보기',
                zh: '浏览完整产品目录'
              })}</span>
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
                {pick({
                  vi: 'GIA CÔNG OEM / ODM & NHÃN RIÊNG',
                  en: 'OEM / ODM & PRIVATE LABEL WELCOME',
                  ko: 'OEM / ODM 및 자체 브랜드(PB) 생산 환영',
                  zh: '承接 OEM / ODM 定制与自有品牌贴牌'
                })}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 247, 236, 0.9)', marginTop: '2px' }}>
                {pick({
                  vi: 'Tùy chỉnh công thức, quy cách đóng gói và thiết kế nhãn mác theo yêu cầu.',
                  en: 'Custom recipes, packaging and labelling on request.',
                  ko: '요청 사양에 맞춘 레시피 개발, 맞춤형 포장 및 라벨 인쇄를 지원합니다.',
                  zh: '可根据客户要求量身定制配方口感、包装形式及专属品牌标签。'
                })}
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenQuote(pick({
                vi: 'Gia công OEM / ODM & Nhãn riêng',
                en: 'OEM / ODM & Private Label Inquiry',
                ko: 'OEM / ODM 자체 브랜드(PB) 문의',
                zh: 'OEM / ODM 贴牌代工询价'
              }))}
              icon={<ArrowRight size={15} />}
            >
              {pick({ vi: 'Yêu Cầu Gia Công OEM', en: 'Request OEM Quote', ko: 'OEM 견적 요청', zh: '获取 OEM 代工报价' })}
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
                {pick({
                  vi: 'DANH MỤC 12 SẢN PHẨM XUẤT KHẨU',
                  en: 'EXPORT SKU CATALOG',
                  ko: '12대 핵심 수출 품목 (EXPORT SKUS)',
                  zh: '12 款核心出口标准品项'
                })}
              </span>
              <h2 className="section-title" style={{ marginBottom: '10px' }}>
                {pick({
                  vi: (
                    <>
                      SẢN PHẨM TIÊU BIỂU <em>CHUẨN B2B</em>
                    </>
                  ),
                  en: (
                    <>
                      FEATURED EXPORT <em>FRUIT &amp; NUT SKUS</em>
                    </>
                  ),
                  ko: (
                    <>
                      B2B 대표 수출 <em>건과일 및 견과류</em>
                    </>
                  ),
                  zh: (
                    <>
                      B2B 主力出口 <em>果干与坚果单品</em>
                    </>
                  ),
                })}
              </h2>
              <p className="section-desc">
                {pick({
                  vi: 'Các sản phẩm trái cây sấy dẻo, trái cây sấy giòn và hạt dinh dưỡng chủ lực trong danh mục 12 mặt hàng chính thức của VINAXO.',
                  en: 'Core soft-dried fruits, crunchy fruit chips, and premium nuts & seeds from our verified 12-product B2B export catalog.',
                  ko: 'VINAXO 공식 12종 수출 카탈로그의 주력 소프트 건조 과일, 크리스피 칩 및 프리미엄 견과류 라인업을 확인하세요.',
                  zh: '展示 VINAXO 官方 12 款出口目录中的主力软烘干果、香脆果蔬片及高端坚果单品。'
                })}
              </p>
            </div>
            <div>
              <Link to="/products" className="btn btn-chocolate btn-sm">
                <span>{pick({ vi: 'Xem toàn bộ 12 sản phẩm', en: 'View All 12 Products', ko: '12종 전체 제품 보기', zh: '查看全部 12 款产品' })}</span>
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
                onRequestQuote={(target) => onOpenQuote(target)}
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
                {pick({ vi: 'CHÚNG TÔI LÀ AI', en: 'WHO WE ARE', ko: '기업 소개 (WHO WE ARE)', zh: '关于我们' })}
              </span>

              <h2 className="about-editorial-heading">
                {pick({
                  vi: (
                    <>
                      BẮT NGUỒN TỪ VIỆT NAM.
                      <br />
                      <span className="about-heading-accent">VƯƠN TẦM THẾ GIỚI.</span>
                    </>
                  ),
                  en: (
                    <>
                      ROOTED IN VIETNAM.
                      <br />
                      <span className="about-heading-accent">CRAFTED FOR THE WORLD.</span>
                    </>
                  ),
                  ko: (
                    <>
                      베트남에서 시작된 정직한 원물.
                      <br />
                      <span className="about-heading-accent">세계 시장을 향한 장인정신.</span>
                    </>
                  ),
                  zh: (
                    <>
                      扎根越南热带沃土，
                      <br />
                      <span className="about-heading-accent">匠心打造全球品质。</span>
                    </>
                  ),
                })}
              </h2>

              <p className="about-editorial-lead">
                {pick({
                  vi: `${legalName} là nhà sản xuất trái cây sấy nhiệt đới và đồ ăn nhẹ lành mạnh tại Việt Nam. Chúng tôi kết hợp nguồn trái cây nhiệt đới tuyển chọn cùng các chuẩn mực sản xuất và an toàn thực phẩm quốc tế để đồng hành cùng đối tác bán lẻ, dịch vụ ẩm thực và nhãn hàng riêng toàn cầu.`,
                  en: `${legalName} is a Vietnamese manufacturer of premium dried tropical fruit and wholesome snacks. We combine carefully selected Vietnamese fruit with internationally recognised food safety and manufacturing standards to serve retail, food-service and private-label partners worldwide.`,
                  ko: `${legalName}는 베트남의 프리미엄 열대 건조 과일 및 건강한 내추럴 스낵 전문 제조 기업입니다. 엄선된 베트남 열대 과일과 국제 공인 식품안전·생산 기준을 결합해 전 세계 리테일, 외식 및 자체 브랜드(PB) 파트너와 협력하고 있습니다.`,
                  zh: `${legalName} 是越南专业的热带软烘干果与健康零食生产商。我们依托直采优质热带鲜果与国际认可的食品安全及生产管理体系，致力于为全球连锁零售、餐饮服务及自有品牌伙伴提供卓越产品。`
                })}
              </p>

              <Link to="/about" className="about-editorial-cta">
                <span>{pick({ vi: 'Tìm Hiểu Về Công Ty', en: 'Discover Our Company', ko: '회사 소개 자세히 보기', zh: '深入了解 VINAXO' })}</span>
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
                    alt={pick({
                      vi: 'Đội ngũ công nhân VINAXO kiểm tra chất lượng và định lượng xoài sấy trên bàn inox tại nhà máy ở Đồng Tháp',
                      en: 'Vinaxo production team weighing and inspecting dried tropical mango slices on stainless steel tables inside the Dong Thap factory',
                      ko: '동탑성 VINAXO 공장 내 스테인리스 작업대에서 건망고 품질을 검수·계량하는 생산팀',
                      zh: 'VINAXO 同塔省工厂员工在不锈钢操作台上对芒果干进行称重与品控分拣'
                    })}
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
            aria-label={pick({
              vi: 'Năng lực sản xuất nhà máy VINAXO',
              en: 'Vinaxo manufacturing capabilities',
              ko: 'VINAXO 공장 생산 역량 지표',
              zh: 'VINAXO 工厂生产实力指标'
            })}
          >
            <div className="about-capabilities-grid">
              {manufacturingCapabilities.map((item, idx) => (
                <div key={idx} className="about-capability-item">
                  <span className="capability-accent-rule" aria-hidden="true" />
                  <div className="capability-value">
                    {item.value}
                  </div>
                  <div className="capability-label">
                    {item.label}
                  </div>
                  <div className="capability-detail">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AREA C — Manufacturing Storytelling Transition */}
          <div className="about-story-bridge">
            <h3 className="about-story-heading">
              {pick({
                vi: 'CHẤT LƯỢNG BẮT ĐẦU TỪ NGUỒN NGUYÊN LIỆU',
                en: 'QUALITY BEGINS AT THE SOURCE',
                ko: '품질은 원재료 산지에서부터 시작됩니다',
                zh: '卓越品质，源自原产地严选'
              })}
            </h3>
            <p className="about-story-copy">
              {pick({
                vi: 'Từ khâu tuyển chọn trái cây tươi đạt chuẩn đến mẫu duyệt trước khi sản xuất và quy trình vận hành được chứng nhận quốc tế, chất lượng luôn dẫn dắt mọi công đoạn tại nhà máy VINAXO.',
                en: 'From carefully selected ingredients to approved production samples and certified processes, quality guides every stage of our manufacturing workflow.',
                ko: '엄선된 생과일 수매부터 양산 전 표준 샘플 승인, 국제 인증 생산 공정에 이르기까지 모든 제조 단계를 철저한 품질 기준으로 관리합니다.',
                zh: '从精选优质热带鲜果、量产前标准样品确认到国际认证级生产体系管控，品质始终引领 VINAXO 制造的每一道工序。'
              })}
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
                {pick({
                  vi: 'HÌNH ẢNH NHÀ MÁY THỰC TẾ',
                  en: 'MANUFACTURING CREDIBILITY',
                  ko: '실제 가동 공장 현장',
                  zh: '真实现代化工厂实景'
                })}
              </span>
              <h2 className="section-title" style={{ marginBottom: '10px' }}>
                {pick({
                  vi: (
                    <>
                      DÂY CHUYỀN CHẾ BIẾN &amp; <em>KIỂM SOÁT VỆ SINH</em>
                    </>
                  ),
                  en: (
                    <>
                      INSIDE THE VINAXO <em>PROCESSING FACILITY</em>
                    </>
                  ),
                  ko: (
                    <>
                      VINAXO 위생 가공 공장 <em>현장 라인</em>
                    </>
                  ),
                  zh: (
                    <>
                      走进 VINAXO <em>洁净加工生产车间</em>
                    </>
                  ),
                })}
              </h2>
              <p className="section-desc">
                {pick({
                  vi: 'Hình ảnh vận hành thực tế tại phân xưởng VINAXO với quy trình khép kín đạt chuẩn an toàn thực phẩm, khu sơ chế inox 304 và dây chuyền đóng gói nhãn riêng.',
                  en: 'Authentic photography from Vinaxo’s processing floors highlighting cleanroom hygiene uniforms, calibrated batch weighing, and export-ready retail pouch packing lines.',
                  ko: '클린룸 위생복 착용 규정, 정밀 배치 계량 및 수출용 리테일 파우치 포장 라인 등 VINAXO 가공 현장의 실제 모습을 확인하세요.',
                  zh: '真实记录 VINAXO 生产车间实景：统一洁净着装规范、304 不锈钢预处理工段及出口级零售贴牌包装产线。'
                })}
              </p>
            </div>
            <div>
              <Link to="/quality" className="arrow-link">
                <span>{pick({ vi: 'Xem quy trình sản xuất 6 bước', en: 'Explore 6-Step Process', ko: '6단계 위생 생산 공정 보기', zh: '查看 6 步标准化生产工艺' })}</span>
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
                  alt={pick({
                    vi: featuredFactory.captionVi,
                    en: featuredFactory.captionEn,
                    ko: featuredFactory.captionKo,
                    zh: featuredFactory.captionZh
                  })}
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
                  {pick({
                    vi: featuredFactory.tagVi,
                    en: featuredFactory.tagEn,
                    ko: featuredFactory.tagKo,
                    zh: featuredFactory.tagZh
                  })}
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
                  {pick({
                    vi: featuredFactory.captionVi,
                    en: featuredFactory.captionEn,
                    ko: featuredFactory.captionKo,
                    zh: featuredFactory.captionZh
                  })}
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
                        alt={pick({
                          vi: item.captionVi,
                          en: item.captionEn,
                          ko: item.captionKo,
                          zh: item.captionZh
                        })}
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
                      {pick({ vi: item.tagVi, en: item.tagEn, ko: item.tagKo, zh: item.tagZh })}
                    </span>
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--color-body)',
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {pick({ vi: item.captionVi, en: item.captionEn, ko: item.captionKo, zh: item.captionZh })}
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
              {pick({ vi: 'CAM KẾT CHẤT LƯỢNG B2B', en: 'QUALITY PROMISE', ko: 'B2B 품질 약속', zh: 'B2B 品质承诺' })}
            </span>
            <h2 className="section-title">
              {pick({
                vi: (
                  <>
                    3 NGUYÊN TẮC BẢO CHỨNG <em>UY TÍN XUẤT KHẨU</em>
                  </>
                ),
                en: (
                  <>
                    OUR THREE-PILLAR <em>QUALITY COMMITMENT</em>
                  </>
                ),
                ko: (
                  <>
                    신뢰할 수 있는 수출을 위한 <em>3대 품질 원칙</em>
                  </>
                ),
                zh: (
                  <>
                    保障国际交付信誉的 <em>三大质量承诺</em>
                  </>
                ),
              })}
            </h2>
            <p className="section-desc section-desc-center">
              {pick({
                vi: 'Mỗi đơn hàng xuất khẩu của VINAXO đều đi kèm quy trình kiểm soát nghiêm ngặt từ mẫu thử đầu tiên tới giám định độc lập trước khi xuất cảng.',
                en: 'Every export shipment follows a disciplined verification protocol built around buyer sign-off, international compliance, and third-party accountability.',
                ko: '모든 수출 물량은 사전 샘플 승인부터 국제 표준 준수, 선적 전 제3자 독립 검수까지 엄격한 검증 프로토콜을 따릅니다.',
                zh: 'VINAXO 每一笔出口订单均严格遵循买方样品签批、国际认证合规及装柜前第三方独立检验流程。'
              })}
            </p>
          </div>

          <div className="quality-promise-grid">
            {QUALITY_PROMISE_CARDS.map((card) => (
              <div key={card.number} className="quality-promise-card">
                <div className="promise-number">{card.number}</div>
                <h3 className="promise-title">
                  {pick({ vi: card.titleVi, en: card.titleEn, ko: card.titleKo, zh: card.titleZh })}
                </h3>
                <p className="promise-desc">
                  {pick({ vi: card.descVi, en: card.descEn, ko: card.descKo, zh: card.descZh })}
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
                  {pick({
                    vi: 'GIA CÔNG OEM / ODM & NHÃN RIÊNG',
                    en: 'OEM / ODM & PRIVATE LABEL',
                    ko: 'OEM / ODM 및 PB 자체 브랜드',
                    zh: 'OEM / ODM 定制与自有品牌代工'
                  })}
                </span>
                <h2
                  className="section-title section-title-light"
                  style={{ marginBottom: '14px' }}
                >
                  {pick({
                    vi: (
                      <>
                        ĐỐI TÁC SẢN XUẤT <em>NHÃN RIÊNG CHUYÊN NGHIỆP</em>
                      </>
                    ),
                    en: (
                      <>
                        CUSTOM PRIVATE LABEL{' '}
                        <span style={{ color: 'var(--brand-orange)' }}>
                          SOLUTIONS
                        </span>
                      </>
                    ),
                    ko: (
                      <>
                        글로벌 바이어 맞춤형{' '}
                        <span style={{ color: 'var(--brand-orange)' }}>
                          PB · OEM 솔루션
                        </span>
                      </>
                    ),
                    zh: (
                      <>
                        专业定制化{' '}
                        <span style={{ color: 'var(--brand-orange)' }}>
                          OEM 贴牌代工方案
                        </span>
                      </>
                    ),
                  })}
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
                  {pick({
                    vi: 'VINAXO đồng hành cùng các chuỗi siêu thị, nhà nhập khẩu và thương hiệu thực phẩm quốc tế từ khâu nghiên cứu công thức, thiết kế bao bì đến xuất khẩu container hoàn chỉnh.',
                    en: 'Partner with an experienced tropical fruit manufacturer equipped for custom flavor formulation, retail branding, flexible bulk-to-pouch formats, and long-term export supply.',
                    ko: '풍부한 경험을 갖춘 열대 과일 건조 제조 파트너로서 맛·식감 배합 개발부터 리테일 브랜딩, 소포장·벌크 포장 및 안정적 장기 수출까지 원스톱으로 지원합니다.',
                    zh: '携手经验丰富的热带果干源头制造商，为您提供风味配方研发、品牌视觉包装、灵活规格分装及长期稳定整柜出口一站式服务。'
                  })}
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
                        pick({
                          vi: 'Dự án gia công nhãn riêng OEM / ODM',
                          en: 'OEM / ODM Private Label Project',
                          ko: 'OEM / ODM 자체 브랜드(PB) 프로젝트',
                          zh: 'OEM / ODM 自有品牌贴牌项目'
                        })
                      )
                    }
                    icon={<ArrowRight size={17} />}
                  >
                    {pick({
                      vi: 'Thảo Luận Dự Án Nhãn Riêng',
                      en: 'Discuss Your Private Label Project',
                      ko: 'PB 브랜드 프로젝트 상담하기',
                      zh: '洽谈自有品牌贴牌合作'
                    })}
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline-white" size="lg">
                      {pick({ vi: 'Liên Hệ Bộ Phận Xuất Khẩu', en: 'Contact Export Desk', ko: '수출 사업부 문의', zh: '联系出口事业部' })}
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
                    {pick({ vi: 'Công Thức Riêng', en: 'Custom Recipes', ko: '맞춤형 레시피', zh: '定制口感配方' })}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {pick({
                      vi: 'Tùy chỉnh độ ẩm, lát cắt, tẩm mật ong hoặc phủ sô-cô-la.',
                      en: 'Tailored Brix sweetness, cut style, honey infusion, or cocoa dip.',
                      ko: '당도(Brix), 절단 규격, 벌꿀 인퓨즈드 또는 초콜릿 코팅 맞춤형 제조.',
                      zh: '灵活定制糖度、切片形态、蜂蜜浸渍或巧克力裹涂工艺。'
                    })}
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
                    {pick({ vi: 'Bao Bì Đóng Gói', en: 'Custom Packaging', ko: '맞춤형 패키지', zh: '多元化包装方案' })}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {pick({
                      vi: 'Túi zip bán lẻ, hộp quà hoặc thùng carton xá công nghiệp.',
                      en: 'Retail pouches, upright bags, canisters, and 5–20kg bulk cartons.',
                      ko: '리테일 지퍼 파우치, 스탠딩 백, 캔 용기 및 5~20kg 벌크 카톤.',
                      zh: '支持零售拉链袋、自立袋、罐装礼盒及 5–20kg 工业散装箱。'
                    })}
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
                    {pick({ vi: 'Nhãn Riêng OEM', en: 'Private Label', ko: '자체 브랜드(PB)', zh: 'OEM 自有品牌' })}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {pick({
                      vi: 'Sản xuất mang thương hiệu của chuỗi siêu thị và đối tác phân phối.',
                      en: 'Contract production ready for supermarket & global retail brands.',
                      ko: '대형마트 및 글로벌 리테일 브랜드 전용 위탁 계약 생산.',
                      zh: '专为国内外连锁商超及零售品牌提供标准化代工生产。'
                    })}
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
                    {pick({ vi: 'Hợp Tác Toàn Cầu', en: 'Global Export', ko: '글로벌 수출 공급', zh: '全球出口交付' })}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 247, 236, 0.78)', margin: 0 }}>
                    {pick({
                      vi: 'Giao thương minh bạch tới Mỹ (~70%), EU (~20%), Nga & Đông Á.',
                      en: 'Direct FCL/LCL export supply supporting US, EU, Russia & East Asia.',
                      ko: '미국(~70%), EU(~20%), 러시아 및 동아시아 FCL/LCL 직수출 지원.',
                      zh: '支持整柜及拼箱直供美国（约 70%）、欧盟（约 20%）、俄及东亚。'
                    })}
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
        onClose={() => setPreviewCert(null)}
      />

      {/* Brochure Product Line Detail Modal (for Honey-Infused & Chocolate-Dipped OEM lines) */}
      {selectedLine && (() => {
        const lineTitle = pick({ vi: selectedLine.titleVi, en: selectedLine.titleEn, ko: selectedLine.titleKo, zh: selectedLine.titleZh });
        const lineDesc = pick({ vi: selectedLine.descVi, en: selectedLine.descEn, ko: selectedLine.descKo, zh: selectedLine.descZh });
        const lineTags = pick({
          vi: selectedLine.highlightsVi,
          en: selectedLine.highlightsEn,
          ko: selectedLine.highlightsKo || selectedLine.highlightsEn,
          zh: selectedLine.highlightsZh || selectedLine.highlightsEn
        });
        return (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedLine(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lineTitle}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: 'var(--soft-beige)' }}>
              <img
                src={selectedLine.imageWebp}
                alt={lineTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '28px' }}>
              <span className="section-label" style={{ marginBottom: '6px' }}>
                {pick({
                  vi: 'DÒNG CHẾ BIẾN OEM / ODM',
                  en: 'VALUE-ADDED OEM / ODM LINE',
                  ko: '고부가가치 OEM / ODM 가공 라인',
                  zh: '高附加值 OEM / ODM 定制工艺线'
                })}
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
                {lineTitle}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-body)', lineHeight: 1.65, marginBottom: '16px' }}>
                {lineDesc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {lineTags.map((tag, i) => (
                  <span key={i} className="badge badge-gold">
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                <Button variant="secondary" size="sm" onClick={() => setSelectedLine(null)}>
                  {pick({ vi: 'Đóng', en: 'Close', ko: '닫기', zh: '关闭' })}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  onClick={() => {
                    setSelectedLine(null);
                    onOpenQuote(lineTitle);
                  }}
                >
                  {pick({
                    vi: 'Yêu Cầu Báo Giá & Mẫu Thử',
                    en: 'Request Line Samples & Quote',
                    ko: '샘플 및 견적 요청하기',
                    zh: '申请样品与系列报价'
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};

export default Home;
