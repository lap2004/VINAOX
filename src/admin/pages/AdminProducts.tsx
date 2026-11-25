import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Layers,
  Clock
} from 'lucide-react';
import { productsData } from '../../data/products';
import { adminFetch } from '../lib/adminFetch';

export interface ProductItemData {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  category: string;
  image: string;
  description_vi: string;
  description_en: string;
  origin_vi?: string;
  origin_en?: string;
  shelf_life?: string;
  packaging?: string;
  certifications?: string[];
  order?: number;
}

export function normalizeProductItem(raw: any, idx = 0): ProductItemData {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `prod-${idx}`,
      slug: `prod-${idx}`,
      name_vi: 'Sản phẩm VINAXO',
      name_en: 'VINAXO Product',
      category: 'soft-dried',
      image: '/images/products/placeholder.webp',
      description_vi: '',
      description_en: '',
      order: idx + 1
    };
  }

  const slug = String(raw.slug || raw.id || `product-${idx}`).trim();
  const id = String(raw.id || slug).trim();
  const name_vi = String(raw.name_vi || raw.nameVi || raw.vi?.name || slug).trim();
  const name_en = String(raw.name_en || raw.name || raw.nameEn || raw.en?.name || name_vi).trim();
  const category = String(raw.category || 'soft-dried').trim();
  const image = String(raw.image || raw.imageWebp || raw.imageJpg || '/images/products/placeholder.webp').trim();
  const description_vi = String(raw.description_vi || raw.descriptionVi || raw.shortDescriptionVi || raw.vi?.desc || '').trim();
  const description_en = String(raw.description_en || raw.description || raw.shortDescription || raw.en?.desc || description_vi).trim();
  const origin_vi = String(raw.origin_vi || raw.originVi || raw.vi?.origin || raw.origin || '').trim();
  const origin_en = String(raw.origin_en || raw.origin || raw.en?.origin || origin_vi || '').trim();
  const shelf_life = String(raw.shelf_life || raw.specs?.shelfLifeVi || raw.specs?.shelfLifeEn || '12 Tháng').trim();
  const packaging = String(raw.packaging || raw.specs?.packagingVi || raw.specs?.packagingEn || 'Túi zip / Thùng carton xuất khẩu').trim();
  const certifications = Array.isArray(raw.certifications) ? raw.certifications : [];
  const order = Number(raw.order) || idx + 1;

  return {
    id,
    slug,
    name_vi,
    name_en,
    category,
    image,
    description_vi,
    description_en,
    origin_vi,
    origin_en,
    shelf_life,
    packaging,
    certifications,
    order
  };
}

export const AdminProducts: React.FC = () => {
  const initialProducts: ProductItemData[] = productsData.map((p, idx) => normalizeProductItem(p, idx));

  const [products, setProducts] = useState<ProductItemData[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<ProductItemData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchServerProducts = async () => {
      try {
        const res = await adminFetch('/api/admin/products');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products.map((p: any, idx: number) => normalizeProductItem(p, idx)));
          }
        }
      } catch {
        // Keep fallback
      }
    };
    fetchServerProducts();
    return () => { isMounted = false; };
  }, []);

  const handleEditClick = (prod: ProductItemData) => {
    setEditingProduct({ ...prod });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsSaving(true);
      setStatusMsg(null);

      const res = await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(editingProduct)
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        const updated = normalizeProductItem(data.product || editingProduct, editingProduct.order || 0);
        setProducts(prev => prev.map(p => p.slug === editingProduct.slug ? updated : p));
        setStatusMsg({ type: 'success', text: `Cập nhật sản phẩm "${updated.name_vi}" thành công!` });
        setEditingProduct(null);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể lưu sản phẩm.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi thông tin cập nhật sản phẩm.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const sTerm = searchTerm.trim().toLowerCase();
    const nameVi = String(p.name_vi || (p as any).nameVi || '').toLowerCase();
    const nameEn = String(p.name_en || (p as any).name || '').toLowerCase();
    const slug = String(p.slug || p.id || '').toLowerCase();
    const matchesSearch = !sTerm || nameVi.includes(sTerm) || nameEn.includes(sTerm) || slug.includes(sTerm);
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3A251B', margin: '0 0 4px 0' }}>
            Quản lý Danh mục Sản phẩm
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6E6259', margin: 0 }}>
            {products.length} dòng sản phẩm xuất khẩu chất lượng cao của VINAXO
          </p>
        </div>
      </div>

      {/* Alert */}
      {statusMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${statusMsg.type === 'success' ? '#10B981' : '#EF4444'}`,
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B'
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{statusMsg.text}</span>
          <button
            onClick={() => setStatusMsg(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C7E74' }} />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm tiếng Việt hoặc tiếng Anh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #EADCCE',
              backgroundColor: '#FFFFFF',
              fontSize: '0.88rem',
              color: '#3A251B',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'soft-dried', label: 'Sấy dẻo' },
            { id: 'chips', label: 'Sấy giòn' },
            { id: 'nuts-seeds', label: 'Hạt dinh dưỡng' },
            { id: 'mixed', label: 'Hỗn hợp' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: selectedCategory === cat.id ? '#3A251B' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#6E6259',
                border: `1px solid ${selectedCategory === cat.id ? '#3A251B' : '#EADCCE'}`,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #EADCCE',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(58, 37, 27, 0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FFF9F2', borderBottom: '1px solid #EADCCE' }}>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B' }}>Hình ảnh & Tên sản phẩm</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B' }}>Tên quốc tế (EN)</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B' }}>Phân loại</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B' }}>Hạn sử dụng</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.slug} style={{ borderBottom: '1px solid #F0E5D8', transition: 'background-color 0.15s ease' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.image}
                        alt={p.name_vi}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #EADCCE' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/soft-dried-mango.webp';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#3A251B', fontSize: '0.92rem' }}>{p.name_vi}</div>
                        <div style={{ fontSize: '0.78rem', color: '#8C7E74' }}>slug: <code>{p.slug}</code></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.88rem', color: '#55473E', fontWeight: 500 }}>
                    {p.name_en}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: p.category.includes('soft') ? '#FFF5EA' : p.category.includes('nuts') ? '#F2F8F5' : '#FDF7EC',
                      color: p.category.includes('soft') ? '#D95D39' : p.category.includes('nuts') ? '#1B6A4C' : '#B87A14',
                      border: '1px solid #EADCCE'
                    }}>
                      <Layers size={12} />
                      <span>{p.category}</span>
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#6E6259' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#8C7E74" />
                      <span>{p.shelf_life || '12 Tháng'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleEditClick(p)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#FFF9F2',
                          border: '1px solid #EADCCE',
                          color: '#3A251B',
                          padding: '7px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Chỉnh sửa</span>
                      </button>
                      <a
                        href={`/products/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Xem trang sản phẩm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '7px 8px',
                          borderRadius: '6px',
                          border: '1px solid #EADCCE',
                          color: '#6E6259',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20, 10, 5, 0.65)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EADCCE', backgroundColor: '#FFF9F2' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#3A251B' }}>
                  Chỉnh sửa sản phẩm: {editingProduct.name_vi}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#6E6259' }}>slug: {editingProduct.slug}</span>
              </div>
              <button 
                onClick={() => setEditingProduct(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E6259' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên sản phẩm (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_vi}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_vi: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên tiếng Anh (International Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Phân loại danh mục
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    <option value="soft-dried">Trái cây sấy dẻo (soft-dried)</option>
                    <option value="chips">Trái cây sấy giòn (chips)</option>
                    <option value="nuts-seeds">Hạt dinh dưỡng (nuts-seeds)</option>
                    <option value="mixed">Hỗn hợp sấy (mixed)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Đường dẫn hình ảnh (URL)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                  Mô tả sản phẩm (Tiếng Việt)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description_vi}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description_vi: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                  Mô tả sản phẩm (Tiếng Anh)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description_en}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Hạn sử dụng
                  </label>
                  <input
                    type="text"
                    value={editingProduct.shelf_life || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shelf_life: e.target.value })}
                    placeholder="VD: 12 Tháng"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Quy cách đóng gói
                  </label>
                  <input
                    type="text"
                    value={editingProduct.packaging || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, packaging: e.target.value })}
                    placeholder="VD: Túi zip 100g, 250g, 500g / Thùng xuất khẩu"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #EADCCE' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '6px',
                    border: '1px solid #EADCCE',
                    backgroundColor: '#FFFFFF',
                    color: '#6E6259',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#F4A83A',
                    color: '#3A251B',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
