import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { Award, FileText, Package, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getCategoryDefaultLabel,
  getProductFeatureLabel,
  getProductLocalized,
  getProductSpecsLocalized,
  ProductCategory,
  ProductItem,
  productsData,
} from '../data/products';
import { PageHero } from '../components/ui/PageHero';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';
import { isValidCatalogCategory } from '../shared/catalogCategories';
import { OEM_PRODUCT_ID, resolveCanonicalProduct } from '../components/contact/contactSchema';

export const Products: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const { language, t, pick } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [invalidCategoryParam, setInvalidCategoryParam] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Check URL slug or ?product= or ?category= query param
  useEffect(() => {
    const targetCategory = (searchParams.get('category') || searchParams.get('cat') || '').trim();
    if (!targetCategory || targetCategory === 'all') {
      setActiveCategory('all');
      setInvalidCategoryParam('');
    } else if (isValidCatalogCategory(targetCategory)) {
      setActiveCategory(targetCategory);
      setInvalidCategoryParam('');
    } else {
      // Unknown or OEM-only inquiry parameter (e.g. ?category=granola): never map silently to another category
      setActiveCategory('all');
      setInvalidCategoryParam(targetCategory);
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

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setInvalidCategoryParam('');
    const next = new URLSearchParams(searchParams);
    next.delete('cat');
    if (key === 'all') {
      next.delete('category');
    } else {
      next.set('category', key);
    }
    setSearchParams(next, { replace: false });
  };

  const categories = [
    {
      key: 'all',
      label: pick({ vi: 'Tất cả sản phẩm', en: 'All Products', ko: '전체 제품', zh: '全部产品' }),
      count: productsData.length,
    },
    {
      key: 'soft-dried',
      label: getCategoryDefaultLabel('soft-dried', language),
      count: productsData.filter((p) => p.category === 'soft-dried').length,
    },
    {
      key: 'chips',
      label: getCategoryDefaultLabel('chips', language),
      count: productsData.filter((p) => p.category === 'chips').length,
    },
    {
      key: 'nuts-seeds',
      label: getCategoryDefaultLabel('nuts-seeds', language),
      count: productsData.filter((p) => p.category === 'nuts-seeds').length,
    },
    {
      key: 'mixed',
      label: getCategoryDefaultLabel('mixed', language),
      count: productsData.filter((p) => p.category === 'mixed').length,
    },
  ];

  // Shared filtered subset for Product Grid, Specs Table, counts, and dynamic heading
  const filteredProducts =
    activeCategory === 'all'
      ? productsData
      : productsData.filter((p) => p.category === activeCategory);

  const activeCategoryObj = categories.find((c) => c.key === activeCategory) || categories[0];

  const categoryNotes: Record<ProductCategory, string> = {
    'soft-dried': pick({
      vi: 'Nhóm trái cây sấy dẻo: Chế biến bằng công nghệ sấy bơm nhiệt nhiệt độ thấp, giữ kết cấu dẻo mềm đặc trưng cho từng loại quả.',
      en: 'Soft-Dried Fruits: Processed via low-temperature heat-pump drying to maintain a soft, chewy fruit texture.',
      ko: '소프트 건조 과일: 저온 히트펌프 건조로 각 과일 특유의 부드럽고 쫄깃한 식감을 구현합니다.',
      zh: '软烘干果系列：采用低温热泵循环软烘工艺，保持各类热带水果特有的柔韧口感。',
    }),
    chips: pick({
      vi: 'Nhóm trái cây sấy giòn: Sấy giòn chân không nhiệt độ thấp kết hợp ly tâm tách dầu, độ ẩm thấp (< 5%).',
      en: 'Crispy Dried Fruits: Vacuum crisping with centrifugal de-oiling and low moisture (< 5%).',
      ko: '크리스피 과일 칩: 저온 진공 건조 및 원심 탈유 공정으로 낮은 수분 함량(< 5%)과 바삭함을 유지합니다.',
      zh: '香脆果干片系列：采用低温真空脆化与离心脱油工艺，成品水分低于 5%。',
    }),
    'nuts-seeds': pick({
      vi: 'Nhóm hạt dinh dưỡng: Tuyển chọn theo vùng nguyên liệu (Bình Phước, Tây Nguyên, Đồng Tháp) với quy trình rang/sấy phù hợp từng loại hạt.',
      en: 'Nuts & Seeds: Sourced by regional origin (Binh Phuoc, Central Highlands, Dong Thap) and processed specifically for each kernel type.',
      ko: '견과류 및 연자육: 빈프억·중부 고원·동탑 산지별 원물에 맞춘 열풍 로스팅 또는 진공 건조 공정을 적용합니다.',
      zh: '坚果与莲子系列：依平福、西原、同塔核心产区严选原料，并针对不同果仁采用适配的烘焙或干燥工艺。',
    }),
    mixed: pick({
      vi: 'Nhóm sản phẩm thập cẩm: Phối trộn nhiều loại trái cây và củ quả Việt Nam sấy chân không giòn xốp.',
      en: 'Mixed Products: Vacuum-dried assortment blending tropical fruits and root vegetables.',
      ko: '모듬 제품: 열대 과일과 뿌리채소를 조합해 저온 진공 건조한 혼합 제품입니다.',
      zh: '综合产品系列：将多种越南热带水果与根茎蔬菜经真空干燥拼配而成。',
    }),
  };

  const specRows = filteredProducts.map((p) => {
    const loc = getProductLocalized(p, language);
    const specs = getProductSpecsLocalized(p.specs, language);
    const certNames = loc.productCertifications.map((c) =>
      language === 'vi'
        ? c.nameVi
        : language === 'ko'
        ? c.nameKo || c.nameEn
        : language === 'zh-CN'
        ? c.nameZh || c.nameEn
        : c.nameEn
    );
    const featureNames = loc.productFeatures
      .map((f) => getProductFeatureLabel(f, language))
      .filter(Boolean);

    return {
      product: p,
      id: p.id,
      slug: p.slug,
      category: p.category,
      name: loc.name,
      origin: loc.origin || '—',
      moisture: specs.moisture || '—',
      shelfLife: specs.shelfLife || '—',
      certNames,
      featureNames,
    };
  });

  const noProductCertHint = pick({
    vi: 'Chưa gán chứng nhận riêng cấp sản phẩm; xem chứng nhận nhà máy tại trang Chất lượng',
    en: 'No individual product certificate assigned; see facility certifications on the Quality page',
    ko: '개별 품목 인증 미지정 (공장 인증은 품질 페이지 참조)',
    zh: '未单独指定产品级认证（工厂认证请见品质页面）',
  });

  return (
    <div className="products-page">
      {/* Compact Page Hero Banner */}
      <PageHero
        title={
          t('pageBanners.products.title') ||
          pick({
            vi: 'Sản phẩm',
            en: 'Products',
            ko: '제품 소개',
            zh: '产品中心',
          })
        }
        description={
          t('pageBanners.products.subtitle') ||
          pick({
            vi: 'Danh mục trái cây sấy dẻo, trái cây sấy giòn, hạt dinh dưỡng và các sản phẩm thập cẩm phục vụ khách hàng và đối tác B2B, kèm thông số kỹ thuật riêng theo từng sản phẩm.',
            en: "VINAXO's product portfolio of soft-dried fruits, crispy dried fruits, nuts and mixed products, with specifications provided individually per SKU.",
            ko: '소프트 건조 과일, 크리스피 과일 칩, 견과류 및 모듬 제품 라인업과 품목별 기술 사양을 확인하세요.',
            zh: 'VINAXO 出口产品系列，涵盖软烘干果、香脆果干片、坚果及综合产品，各项技术参数均按单品列明。',
          })
        }
        breadcrumbCurrent={pick({ vi: 'Sản Phẩm', en: 'Products', ko: '제품 소개', zh: '产品中心' })}
      />

      {/* ========================================================================
          SECTION 1: PRODUCT CATALOG & SHARED CATEGORY FILTER (VISIBLE ABOVE FOLD)
          ======================================================================== */}
      <section className="subpage-section" style={{ paddingTop: 'clamp(20px, 2.2vw, 32px)' }}>
        <div className="container">
          {/* Product Category Filter Pills (Synchronized with Grid + Specs Table) */}
          <div className="product-category-pills" role="tablist" aria-label="Product categories">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`product-cat-pill ${activeCategory === cat.key ? 'active' : ''}`}
                data-category-key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                role="tab"
                aria-selected={activeCategory === cat.key}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Notice when URL requests an unlisted or OEM-only category (e.g. ?category=granola) */}
          {invalidCategoryParam && (
            <div
              data-testid="invalid-category-notice"
              role="status"
              style={{
                maxWidth: '860px',
                margin: '20px auto 0 auto',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFF8EC',
                border: '1px solid #F4A83A',
                color: 'var(--dark-chocolate)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ flex: '1 1 320px', fontSize: '0.88rem', lineHeight: 1.55 }}>
                <strong style={{ display: 'block', marginBottom: '2px' }}>
                  {pick({
                    vi: `Tham số danh mục "${invalidCategoryParam}" không thuộc 4 nhóm hàng tiêu chuẩn trên website.`,
                    en: `Category filter "${invalidCategoryParam}" is not one of the 4 standard catalog categories.`,
                    ko: `카테고리 필터 "${invalidCategoryParam}"는 4개 정규 카탈로그 분류에 해당하지 않습니다.`,
                    zh: `分类参数 "${invalidCategoryParam}" 不属于官网 4 大标准现货分类。`,
                  })}
                </strong>
                <span>
                  {pick({
                    vi: 'Hiện VINAXO không tự động gán nhóm này sang Hạt dinh dưỡng hoặc Trái cây sấy. Nếu bạn đang tìm dòng gia công OEM theo yêu cầu (như Granola, Viên năng lượng, Tẩm mật ong, Nhúng sô-cô-la), vui lòng gửi yêu cầu tư vấn riêng hoặc xem toàn bộ 12 sản phẩm bên dưới.',
                    en: 'We never auto-remap custom or unlisted terms to Nuts & Seeds or other groups. For made-to-order OEM lines (such as Granola, Fruit & Nut Balls, Honey-Infused, or Chocolate-Dipped), request a dedicated consultation or browse our 12 catalog products below.',
                    ko: 'VINAXO는 별도 OEM 품목(그래놀라, 에너지 볼 등)을 견과류 카테고리로 임의 매핑하지 않습니다. 맞춤 OEM 상담을 요청하거나 아래 12개 정규 제품을 확인해 주세요.',
                    zh: '系统不会将未列出或 OEM 定制品类自动映射至坚果或其他现货分组。如需咨询 OEM 定制线，请直接提交询盘或浏览下方 12 款标准产品。',
                  })}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                  onClick={() => {
                    const resolved = resolveCanonicalProduct(invalidCategoryParam);
                    onOpenQuote(resolved.productId || OEM_PRODUCT_ID);
                  }}
                >
                  {pick({
                    vi: 'Liên hệ tìm hiểu / Gia công OEM',
                    en: 'Contact for OEM Details',
                    ko: 'OEM 맞춤 상담 요청',
                    zh: '咨询 OEM 定制方案',
                  })}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                  onClick={() => handleCategoryChange('all')}
                >
                  {pick({
                    vi: 'Xem tất cả danh mục',
                    en: 'View All Categories',
                    ko: '전체 목록 보기',
                    zh: '查看全部分类',
                  })}
                </button>
              </div>
            </div>
          )}

          {/* Group-specific note when a single category tab is active */}
          {activeCategory !== 'all' && categoryNotes[activeCategory as ProductCategory] && (
            <div
              data-testid="active-category-note"
              style={{
                maxWidth: '820px',
                margin: '18px auto 0 auto',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--cream-bg)',
                border: '1px solid var(--color-border)',
                fontSize: '0.86rem',
                color: 'var(--dark-chocolate)',
                textAlign: 'center',
              }}
            >
              {categoryNotes[activeCategory as ProductCategory]}
            </div>
          )}

          {/* Dynamic Product Grid */}
          <div
            className="products-grid home-products-grid"
            data-testid="products-grid"
            style={{
              display: 'grid',
              marginTop: '24px',
            }}
          >
            {filteredProducts.map((p) => (
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

      {/* ========================================================================
          SECTION 2: OEM / PRIVATE LABEL PROCESSING CAPABILITIES
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
            <h2 className="section-title">{t('productsPage.section2.title')}</h2>
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
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-orange-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-chocolate)',
                  marginBottom: '16px',
                }}
              >
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
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-orange-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-chocolate)',
                  marginBottom: '16px',
                }}
              >
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
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-orange-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-chocolate)',
                  marginBottom: '16px',
                }}
              >
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
          SECTION 3: SYNCHRONIZED SPECIFICATIONS TABLE (SEPARATED CERTS & FEATURES)
          ======================================================================== */}
      <section className="subpage-section" id="technical-specifications">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '860px', margin: '0 auto 36px auto' }}>
            <span className="section-label">{t('productsPage.section3.label')}</span>
            <h2
              id="specs-table-heading"
              data-testid="specs-table-heading"
              className="section-title"
            >
              {t('productsPage.section3.title')} – {activeCategoryObj.label} ({filteredProducts.length})
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('productsPage.section3.desc')}
            </p>
          </div>

          {/* Desktop / Tablet Technical Table */}
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
            <table
              data-testid="specs-table"
              style={{ width: '100%', minWidth: '860px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--brand-orange-soft)', color: 'var(--dark-chocolate)', borderBottom: '2px solid var(--brand-orange)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colName')}
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colOrigin')}
                  </th>
                  <th style={{ padding: '14px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colMoisture')}
                  </th>
                  <th style={{ padding: '14px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colShelfLife')}
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colCert')}
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colFeatures') ||
                      pick({ vi: 'Đặc Tính Sản Phẩm', en: 'Product Features', ko: '제품 특성', zh: '产品特点' })}
                  </th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {t('productsPage.section3.colQuote')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {specRows.map((r, idx) => (
                  <tr
                    key={r.slug}
                    data-spec-row-slug={r.slug}
                    style={{
                      borderBottom: '1px solid var(--soft-border-subtle)',
                      backgroundColor: idx % 2 === 1 ? '#FFFBF4' : '#FFFFFF',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--dark-chocolate)' }}>
                      {r.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-body)' }}>
                      {r.origin}
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--vinaxo-red)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {r.moisture}
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--color-body)', whiteSpace: 'nowrap' }}>
                      {r.shelfLife}
                    </td>
                    <td
                      data-testid={`spec-cert-cell-${r.slug}`}
                      style={{ padding: '14px 16px' }}
                    >
                      {r.certNames.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {r.certNames.map((cn) => (
                            <span
                              key={cn}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                backgroundColor: '#FBEBC9',
                                color: '#3A2417',
                              }}
                            >
                              <Award size={11} aria-hidden="true" />
                              {cn}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span
                          title={noProductCertHint}
                          style={{ color: 'var(--color-muted)', fontWeight: 600 }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td
                      data-testid={`spec-feature-cell-${r.slug}`}
                      style={{ padding: '14px 16px' }}
                    >
                      {r.featureNames.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {r.featureNames.map((fn) => (
                            <span
                              key={fn}
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                backgroundColor: '#F3F7F2',
                                color: 'var(--forest-green)',
                                border: '1px solid #DCE7DA',
                              }}
                            >
                              {fn}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(r.product)}
                          className="btn btn-secondary"
                          data-table-detail-slug={r.slug}
                          style={{ padding: '6px 11px', fontSize: '0.75rem' }}
                        >
                          {t('productsPage.section3.viewDetailBtn') ||
                            pick({ vi: 'Chi Tiết', en: 'Details', ko: '상세', zh: '详情' })}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenQuote({
                              productId: r.id,
                              productSlug: r.slug,
                              categoryId: r.category,
                            })
                          }
                          className="btn btn-outline"
                          data-table-quote-slug={r.slug}
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          {t('productsPage.section3.quoteBtn')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Spec Cards (shown on <= 768px so table never causes horizontal overflow) */}
          <div className="specs-mobile-cards" data-testid="specs-mobile-cards">
            {specRows.map((r) => (
              <div
                key={r.slug}
                data-mobile-spec-slug={r.slug}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '16px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <h3 className="title-serif" style={{ fontSize: '1.05rem', margin: '0 0 2px 0', color: 'var(--dark-chocolate)' }}>
                      {r.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{r.origin}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: 'var(--vinaxo-red)',
                      backgroundColor: '#FFF5EC',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('productsPage.section3.colMoisture')}: {r.moisture}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--color-body)' }}>
                  <strong>{t('productsPage.section3.colShelfLife')}: </strong>
                  {r.shelfLife}
                </div>

                <div style={{ fontSize: '0.82rem' }}>
                  <strong style={{ color: 'var(--dark-chocolate)' }}>
                    {t('productsPage.section3.colCert')}:{' '}
                  </strong>
                  {r.certNames.length > 0 ? (
                    <span style={{ fontWeight: 700, color: '#3A2417' }}>{r.certNames.join(', ')}</span>
                  ) : (
                    <span style={{ color: 'var(--color-muted)' }}>—</span>
                  )}
                </div>

                {r.featureNames.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {r.featureNames.map((fn) => (
                      <span
                        key={fn}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          backgroundColor: '#F3F7F2',
                          color: 'var(--forest-green)',
                          border: '1px solid #DCE7DA',
                        }}
                      >
                        {fn}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(r.product)}
                    className="btn btn-secondary"
                    style={{ flex: '1 1 120px', fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    {t('productsPage.section3.viewDetailBtn') ||
                      pick({ vi: 'Chi Tiết', en: 'Details', ko: '상세', zh: '详情' })}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenQuote({
                        productId: r.id,
                        productSlug: r.slug,
                        categoryId: r.category,
                      })
                    }
                    className="btn btn-primary"
                    style={{ flex: '1 1 140px', fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    {t('productsPage.section3.quoteBtn')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: B2B CALL TO ACTION BANNER
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
        onRequestQuote={(target) => onOpenQuote(target)}
      />
    </div>
  );
};

export default Products;
