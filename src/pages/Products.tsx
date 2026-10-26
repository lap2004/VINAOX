import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { FileText, Package, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productsData, ProductItem } from '../data/products';
import { PageHero } from '../components/ui/PageHero';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Products: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const { language, t } = useLanguage();
  const isVi = language === 'vi';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Check URL slug or ?product= query param
  useEffect(() => {
    const targetSlug = slug || searchParams.get('product');
    if (targetSlug) {
      const match = productsData.find((p) => p.slug === targetSlug || p.id === targetSlug);
      if (match) {
        setSelectedProduct(match);
      }
    }
  }, [slug, searchParams]);

  // Filter products by category
  const filteredProducts =
    activeCategory === 'all'
      ? productsData
      : productsData.filter((p) => {
          if (activeCategory === 'ocop') return Boolean(p.ocop);
          return p.category === activeCategory;
        });

  const specRows = [
    {
      name: t('productsPage.section3.row1Name'),
      origin: t('productsPage.section3.row1Origin'),
      moisture: '< 15%',
      shelfLife: t('productsPage.section3.months12'),
      cert: t('productsPage.section3.certOcop'),
      certColor: '#92400E',
      certBg: '#FEF3C7',
      productQuery: 'dried-mango',
    },
    {
      name: t('productsPage.section3.row2Name'),
      origin: t('productsPage.section3.row2Origin'),
      moisture: '< 14%',
      shelfLife: t('productsPage.section3.months12'),
      cert: t('productsPage.section3.certOcop'),
      certColor: '#92400E',
      certBg: '#FEF3C7',
      productQuery: 'dried-jackfruit',
    },
    {
      name: t('productsPage.section3.row3Name'),
      origin: t('productsPage.section3.row3Origin'),
      moisture: '< 16%',
      shelfLife: t('productsPage.section3.months12'),
      cert: t('productsPage.section3.certOcop'),
      certColor: '#92400E',
      certBg: '#FEF3C7',
      productQuery: 'dried-dragon-fruit',
    },
    {
      name: t('productsPage.section3.row4Name'),
      origin: t('productsPage.section3.row4Origin'),
      moisture: '< 15%',
      shelfLife: t('productsPage.section3.months12'),
      cert: t('productsPage.section3.certNatural'),
      certColor: '#065F46',
      certBg: '#D1FAE5',
      productQuery: 'dried-pineapple',
    },
    {
      name: t('productsPage.section3.row5Name'),
      origin: t('productsPage.section3.row5Origin'),
      moisture: '< 18%',
      shelfLife: t('productsPage.section3.months12'),
      cert: t('productsPage.section3.certNatural'),
      certColor: '#065F46',
      certBg: '#D1FAE5',
      productQuery: 'dried-banana',
    },
    {
      name: t('productsPage.section3.row6Name'),
      origin: t('productsPage.section3.row6Origin'),
      moisture: '< 12%',
      shelfLife: t('productsPage.section3.months12'),
      cert: t('productsPage.section3.certEudr'),
      certColor: '#1E40AF',
      certBg: '#DBEAFE',
      productQuery: 'energy-bar',
    },
  ];

  return (
    <div className="products-page">
      {/* Page Hero Banner */}
      <PageHero
        badge={isVi ? 'DANH MỤC XUẤT KHẨU • B2B PRODUCT CATALOG' : 'EXPORT CATALOG • B2B DRIED FRUITS'}
        title={t('pageBanners.products.title') || (isVi ? 'Danh Mục Sản Phẩm Trái Cây Sấy VINAXO' : 'VINAXO Tropical Dried Fruit Catalog')}
        description={
          t('pageBanners.products.subtitle') ||
          (isVi
            ? '100% tự nhiên, sấy dẻo nhiệt thấp, không thêm đường, bảo toàn màu sắc và dưỡng chất tự nhiên từ các vùng chuyên canh ĐBSCL.'
            : '100% natural, gently low-temperature dehydrated, zero added sugar or artificial preservatives — bringing authentic tropical tastes to global consumers.')
        }
        breadcrumbCurrent={isVi ? 'Sản Phẩm' : 'Products'}
      />

      {/* ========================================================================
          SECTION 1: PRODUCT INTRO & SPEC HIGHLIGHTS (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <span className="section-label">{t('productsPage.section1.label') || (isVi ? 'NÔNG SẢN SẤY CAO CẤP' : 'PREMIUM DRIED FRUITS')}</span>
            <h2 className="section-title">
              {t('productsPage.section1.title') || (isVi ? 'Nông Sản Nhiệt Đới Chọn Lọc Từ Vùng Trồng Đạt Chuẩn' : 'Selected Tropical Fruits from Certified Mekong Orchards')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('productsPage.section1.desc')}
            </p>
          </div>

          {/* Product Category Filter Pills */}
          <div className="product-category-pills" role="tablist" aria-label="Product categories">
            <button
              className={`product-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              role="tab"
            >
              {t('productFilterTabs.all')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'mango' ? 'active' : ''}`}
              onClick={() => setActiveCategory('mango')}
              role="tab"
            >
              {t('productFilterTabs.mango')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'jackfruit' ? 'active' : ''}`}
              onClick={() => setActiveCategory('jackfruit')}
              role="tab"
            >
              {t('productFilterTabs.jackfruit')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'dragon' ? 'active' : ''}`}
              onClick={() => setActiveCategory('dragon')}
              role="tab"
            >
              {t('productFilterTabs.dragon')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'pineapple' ? 'active' : ''}`}
              onClick={() => setActiveCategory('pineapple')}
              role="tab"
            >
              {t('productFilterTabs.pineapple')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'banana' ? 'active' : ''}`}
              onClick={() => setActiveCategory('banana')}
              role="tab"
            >
              {t('productFilterTabs.banana')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'energy-bar' ? 'active' : ''}`}
              onClick={() => setActiveCategory('energy-bar')}
              role="tab"
            >
              {t('productFilterTabs.energyBar')}
            </button>
            <button
              className={`product-cat-pill ${activeCategory === 'ocop' ? 'active' : ''}`}
              onClick={() => setActiveCategory('ocop')}
              role="tab"
            >
              {t('productFilterTabs.ocop')}
            </button>
          </div>

          {/* Dynamic Product Grid */}
          <div
            className="products-grid home-products-grid"
            style={{
              display: 'grid',
              gap: '24px',
              marginTop: '40px',
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
          paddingTop: '80px',
          paddingBottom: '80px',
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
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--light-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', marginBottom: '16px' }}>
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
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--light-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', marginBottom: '16px' }}>
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
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--light-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', marginBottom: '16px' }}>
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
      <section className="subpage-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px auto' }}>
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
                <tr style={{ backgroundColor: 'var(--light-sage)', color: 'var(--forest-green)', borderBottom: '2px solid var(--color-border)' }}>
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
                      borderBottom: '1px solid #EEF2EE',
                      backgroundColor: idx % 2 === 1 ? '#FAFCFA' : '#FFFFFF',
                    }}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--color-heading)' }}>
                      {r.name}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--color-body)' }}>
                      {r.origin}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--forest-green)', fontWeight: 600 }}>
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
