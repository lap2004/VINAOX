import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { Package, ShieldCheck, Truck, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productsData, ProductItem } from '../data/products';
import { PageHero } from '../components/ui/PageHero';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { ProductFilter } from '../components/products/ProductFilter';
import { Button } from '../components/ui/Button';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Products: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const { language } = useLanguage();
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
      : productsData.filter((p) => p.category === activeCategory);

  return (
    <div className="products-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'DANH MỤC XUẤT KHẨU • B2B PRODUCT CATALOG' : 'EXPORT CATALOG • B2B DRIED FRUITS'}
        titleLine1={isVi ? 'Trái Cây Sấy Tự Nhiên' : 'Naturally Pure Tropical Fruits'}
        titleLine2={isVi ? 'Tiêu Chuẩn Quốc Tế BRCGS & OCOP' : 'BRCGS Grade B & 3-Star OCOP'}
        description={
          isVi
            ? 'Danh mục 6 dòng trái cây sấy dẻo và sản phẩm chế biến sâu tiêu chuẩn xuất khẩu của CÔNG TY TNHH VINAXO. Không chất bảo quản, không thêm đường tinh luyện, giữ trọn vẹn màu sắc tự nhiên và vi lượng dinh dưỡng.'
            : 'Explore VINAXO’s export portfolio of 6 natural soft-dried tropical fruits and value-added lines. Free from added sugars and chemical preservatives, optimized for international retail supermarkets and OEM private labeling.'
        }
        breadcrumbCurrent={isVi ? 'Sản Phẩm' : 'Products'}
        theme="sage"
      />

      {/* Main Products Grid & Filter Section */}
      <section className="section section-white">
        <div className="container">
          {/* Category Filter Pills */}
          <ProductFilter
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />

          {/* Product Grid */}
          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
              marginBottom: '64px',
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

          {/* ======================================================================
              B2B PACKAGING & OEM CAPABILITIES SPECIFICATION SECTION
              ====================================================================== */}
          <div
            style={{
              marginTop: '64px',
              padding: 'clamp(28px, 4vw, 44px)',
              backgroundColor: 'var(--cream-bg)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ marginBottom: '28px' }}>
              <span className="section-eyebrow">
                {isVi ? 'QUY CÁCH ĐÓNG GÓI & NĂNG LỰC GIA CÔNG' : 'B2B PACKAGING & OEM CAPABILITIES'}
              </span>
              <h2
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  color: 'var(--color-heading)',
                  marginTop: '8px',
                }}
              >
                {isVi
                  ? 'Quy Cách Đóng Gói Xuất Khẩu & Nhãn Riêng OEM'
                  : 'Export Packing Standards & Private Labeling Services'}
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-body)', marginTop: '8px', maxWidth: '780px' }}>
                {isVi
                  ? 'VINAXO cung cấp đầy đủ các giải pháp đóng gói linh hoạt từ túi bán lẻ có zip, thùng carton chuyên dụng xuất khẩu đến đóng pallet theo tiêu chuẩn kiểm dịch quốc tế.'
                  : 'VINAXO provides versatile packaging formats ranging from consumer stand-up pouches to master export cartons and palletized shipments adhering to global phytosanitary rules.'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              {/* Packaging Format 1 */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Package size={22} color="var(--primary-green)" />
                  <strong style={{ color: 'var(--color-heading)', fontSize: '1rem' }}>
                    {isVi ? 'Bán Lẻ / Retail Pouches' : 'Retail Pouches'}
                  </strong>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.7 }}>
                  <li>{isVi ? 'Túi zip nhôm đáy đứng: 100g, 250g, 500g' : 'Stand-up foil pouches: 100g, 250g, 500g'}</li>
                  <li>{isVi ? 'Bơm khí Nitơ bảo quản hương vị tự nhiên' : 'Nitrogen flushing for shelf-life stability'}</li>
                  <li>{isVi ? 'In nhãn thương hiệu VINAXO hoặc OEM' : 'Branded or White-label packaging'}</li>
                </ul>
              </div>

              {/* Packaging Format 2 */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Layers size={22} color="var(--primary-green)" />
                  <strong style={{ color: 'var(--color-heading)', fontSize: '1rem' }}>
                    {isVi ? 'Thùng Carton Xuất Khẩu' : 'Master Export Cartons'}
                  </strong>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.7 }}>
                  <li>{isVi ? 'Thùng carton 5 lớp chống ẩm: 5kg, 10kg, 20kg' : '5-ply heavy-duty cartons: 5kg, 10kg, 20kg'}</li>
                  <li>{isVi ? 'Lớp lót túi PE thực phẩm vô trùng kép' : 'Double food-grade PE liner bags'}</li>
                  <li>{isVi ? 'Mã vạch và tem phụ đa ngôn ngữ EN/FR/DE' : 'Multilingual labeling and GS1 barcodes'}</li>
                </ul>
              </div>

              {/* Packaging Format 3 */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Truck size={22} color="var(--primary-green)" />
                  <strong style={{ color: 'var(--color-heading)', fontSize: '1rem' }}>
                    {isVi ? 'Đóng Pallet & Container' : 'Pallet & Container Load'}
                  </strong>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.7 }}>
                  <li>{isVi ? 'Pallet gỗ hun trùng chuẩn ISPM-15' : 'ISPM-15 heat-treated export pallets'}</li>
                  <li>{isVi ? '40 - 50 thùng / Pallet quấn màng co PE' : '40 - 50 cartons per shrink-wrapped pallet'}</li>
                  <li>{isVi ? 'Container 20ft (~10 tấn) / 40ft (~20 tấn)' : 'FCL 20ft (~10 MT) / 40ft (~20 MT)'}</li>
                </ul>
              </div>

              {/* Packaging Format 4 */}
              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <ShieldCheck size={22} color="var(--primary-green)" />
                  <strong style={{ color: 'var(--color-heading)', fontSize: '1rem' }}>
                    {isVi ? 'Hồ Sơ Kiểm Nghiệm B2B' : 'Quality Documentation'}
                  </strong>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.7 }}>
                  <li>{isVi ? 'Chứng nhận BRCGS Grade B & OCOP 3 sao' : 'BRCGS Grade B Certificate & OCOP proof'}</li>
                  <li>{isVi ? 'Phiếu kiểm nghiệm vi sinh COA từng lô hàng' : 'Batch-specific COA microbiology test report'}</li>
                  <li>{isVi ? 'Giấy chứng nhận kiểm dịch thực vật (Phyto)' : 'Official Phytosanitary Certificate issued'}</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--color-body-dark)' }}>
                <CheckCircle2 size={18} color="var(--primary-green)" />
                <span>
                  {isVi
                    ? 'Chính sách cung cấp bộ mẫu (Free Commercial Sample Kit) cho đối tác nhập khẩu uy tín.'
                    : 'Sample evaluation kits dispatched worldwide for accredited commercial distributors.'}
                </span>
              </div>

              <Button
                variant="primary"
                onClick={() => onOpenQuote()}
                icon={<ArrowRight size={15} />}
              >
                {isVi ? 'Yêu Cầu Báo Giá & Nhận Mẫu Thử' : 'Request Pricing & Sample Kit'}
              </Button>
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

export default Products;
