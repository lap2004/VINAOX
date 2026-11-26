import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { FileText, Package, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getProductLocalized, getProductSpecsLocalized, productsData, ProductItem } from '../data/products';
import { PageHero } from '../components/ui/PageHero';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Products: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const { language, t, pick } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Check URL slug or ?product= or ?category= query param
  useEffect(() => {
    const targetCategory = searchParams.get('category') || searchParams.get('cat');
    if (targetCategory && ['all', 'soft-dried', 'chips', 'nuts-seeds', 'mixed'].includes(targetCategory)) {
      setActiveCategory(targetCategory);
    }
    const targetSlug = slug || searchParams.get('product');
    if (targetSlug) {
      const match = productsData.find(
        (p) => p.slug === targetSlug || p.id === targetSlug || p.aliases?.includes(targetSlug)
      );
      if (match) {
        setSelectedProduct(match);
      }
    }
  }, [slug, searchParams]);

  const categories = [
    {
      key: 'all',
      label: pick({ vi: 'Tất cả sản phẩm', en: 'All Products', ko: '전체 제품', zh: '全部产品' }),
      count: productsData.length,
    },
    {
      key: 'soft-dried',
      label: pick({ vi: 'Trái cây sấy dẻo', en: 'Soft-Dried Fruits', ko: '소프트 건조 과일', zh: '软烘干果' }),
      count: productsData.filter((p) => p.category === 'soft-dried').length,
    },
    {
      key: 'chips',
      label: pick({ vi: 'Trái cây sấy giòn', en: 'Fruit Chips', ko: '크리스피 과일 칩', zh: '香脆果干片' }),
      count: productsData.filter((p) => p.category === 'chips').length,
    },
    {
      key: 'nuts-seeds',
      label: pick({ vi: 'Hạt dinh dưỡng', en: 'Nuts & Seeds', ko: '견과류 및 연자육', zh: '坚果与莲子' }),
      count: productsData.filter((p) => p.category === 'nuts-seeds').length,
    },
    {
      key: 'mixed',
      label: pick({ vi: 'Sản phẩm thập cẩm', en: 'Mixed Products', ko: '모듬 과일·채소', zh: '综合果蔬' }),
      count: productsData.filter((p) => p.category === 'mixed').length,
    },
  ];

  // Filter products by category
  const filteredProducts =
    activeCategory === 'all'
      ? productsData
      : productsData.filter((p) => p.category === activeCategory);

  const specRows = productsData.map((p) => {
    const loc = getProductLocalized(p, language);
    const specs = getProductSpecsLocalized(p.specs, language);
    return {
      name: loc.name,
      origin: loc.origin,
      moisture: specs.moisture,
      shelfLife: specs.shelfLife,
      cert: specs.certifications,
      certColor: p.ocop.includes('OCOP') ? '#3A2417' : '#2D4E32',
      certBg: p.ocop.includes('OCOP') ? '#FBEBC9' : '#E7F3DF',
      productQuery: p.slug,
    };
  });

  return (
    <div className="products-page">
      {/* Page Hero Banner */}
      <PageHero
        badge={pick({
          vi: 'DANH MỤC XUẤT KHẨU • B2B PRODUCT CATALOG',
          en: 'EXPORT CATALOG • B2B DRIED FRUITS',
          ko: '수출용 제품 카탈로그 • B2B DRIED FRUITS',
          zh: '出口产品目录 • B2B 热带果干系列'
        })}
        title={t('pageBanners.products.title') || pick({
          vi: 'Danh Mục Sản Phẩm Trái Cây Sấy VINAXO',
          en: 'VINAXO Tropical Dried Fruit Catalog',
          ko: 'VINAXO 열대 건조 과일 제품 카탈로그',
          zh: 'VINAXO 热带果干出口产品目录'
        })}
        description={
          t('pageBanners.products.subtitle') ||
          pick({
            vi: '100% tự nhiên, sấy dẻo nhiệt thấp, không thêm đường, bảo toàn màu sắc và dưỡng chất tự nhiên từ các vùng chuyên canh ĐBSCL.',
            en: '100% natural, gently low-temperature dehydrated, zero added sugar or artificial preservatives — bringing authentic tropical tastes to global consumers.',
            ko: '100% 자연산 원물로 저온 건조 가공하여 설탕·방부제 첨가 없이 메콩 델타 과일 고유의 색감과 영양을 그대로 전합니다.',
            zh: '100% 天然鲜果低温烘干，零额外蔗糖与防腐剂，完整保留湄公河三角洲热带鲜果原色与营养。'
          })
        }
        breadcrumbCurrent={pick({ vi: 'Sản Phẩm', en: 'Products', ko: '제품 소개', zh: '产品中心' })}
      />

      {/* ========================================================================
          SECTION 1: PRODUCT INTRO & SPEC HIGHLIGHTS (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto 48px auto' }}>
            <span className="section-label">
              {t('productsPage.section1.label') || pick({
                vi: 'NÔNG SẢN SẤY CAO CẤP',
                en: 'PREMIUM DRIED FRUITS',
                ko: '프리미엄 열대 건조 과일',
                zh: '高端出口热带果干'
              })}
            </span>
            <h2 className="section-title">
              {t('productsPage.section1.title') || pick({
                vi: 'Nông Sản Nhiệt Đới Chọn Lọc Từ Vùng Trồng Đạt Chuẩn',
                en: 'Selected Tropical Fruits from Certified Mekong Orchards',
                ko: '인증된 메콩 델타 산지에서 엄선한 열대 과일 원물',
                zh: '严选认证湄公河三角洲优质果园热带鲜果'
              })}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('productsPage.section1.desc')}
            </p>
          </div>

          {/* Product Category Filter Pills */}
          <div className="product-category-pills" role="tablist" aria-label="Product categories">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`product-cat-pill ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                role="tab"
                aria-selected={activeCategory === cat.key}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Dynamic Product Grid */}
          <div
            className="products-grid home-products-grid"
            style={{
              display: 'grid',
              marginTop: '48px',
            }}
          >
            {filteredProducts.map((p) => (
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

      {/* ========================================================================
          SECTION 2: OEM / PRIVATE LABEL PROCESSING CAPABILITIES (MATCHING HTML 1:1)
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
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <span className="section-label">{t('productsPage.section2.label')}</span>
            <h2 className="section-title">
              {t('productsPage.section2.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('productsPage.section2.desc')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 30px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-chocolate)', marginBottom: '16px' }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '10px' }}>
                {t('productsPage.section2.card1Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {t('productsPage.section2.card1Desc')}
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 30px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-chocolate)', marginBottom: '16px' }}>
                <Package size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '10px' }}>
                {t('productsPage.section2.card2Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {t('productsPage.section2.card2Desc')}
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 30px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--brand-orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-chocolate)', marginBottom: '16px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '10px' }}>
                {t('productsPage.section2.card3Title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {t('productsPage.section2.card3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: SPECIFICATIONS COMPARISON TABLE (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <span className="section-label">{t('productsPage.section3.label')}</span>
            <h2 className="section-title">
              {t('productsPage.section3.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('productsPage.section3.desc')}
            </p>
          </div>

          <div
            className="specs-table-wrapper"
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--brand-orange-soft)', color: 'var(--dark-chocolate)', borderBottom: '2px solid var(--brand-orange)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('productsPage.section3.colName')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('productsPage.section3.colOrigin')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('productsPage.section3.colMoisture')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('productsPage.section3.colShelfLife')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('productsPage.section3.colCert')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'right' }}>{t('productsPage.section3.colQuote')}</th>
                </tr>
              </thead>
              <tbody>
                {specRows.map((r, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--soft-border-subtle)',
                      backgroundColor: idx % 2 === 1 ? '#FFFBF4' : '#FFFFFF',
                    }}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--dark-chocolate)' }}>
                      {r.name}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--color-body)' }}>
                      {r.origin}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--vinaxo-red)', fontWeight: 700 }}>
                      {r.moisture}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--color-body)' }}>
                      {r.shelfLife}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: r.certBg,
                          color: r.certColor,
                        }}
                      >
                        {r.cert}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenQuote(r.name)}
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      >
                        {t('productsPage.section3.quoteBtn')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: B2B CALL TO ACTION BANNER (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section subpage-cta-section">
        <div className="container">
          <CorporateCTA
            eyebrow={t('productsPage.section4.label')}
            title={t('productsPage.section4.title')}
            description={t('productsPage.section4.desc')}
            primaryText={t('productsPage.section4.btnPrimary')}
            onPrimaryClick={() => onOpenQuote()}
            secondaryText={t('productsPage.section4.btnSecondary')}
            secondaryLink="/contact"
          />
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

export default Products;
