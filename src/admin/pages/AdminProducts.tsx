import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { productsData } from '../../data/products';
import { adminFetch } from '../lib/adminFetch';
import { MediaPicker } from '../components/MediaPicker';

export interface ProductItemData {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  name_ko?: string;
  name_zh?: string;
  category: string;
  image: string;
  imageWebp?: string;
  imageJpg?: string;
  description_vi: string;
  description_en: string;
  description_ko?: string;
  description_zh?: string;
  origin_vi?: string;
  origin_en?: string;
  origin_ko?: string;
  origin_zh?: string;
  shelf_life?: string;
  packaging?: string;
  certifications?: string[];
  order?: number;
  published?: boolean;
  status?: 'published' | 'draft';
}

export function normalizeProductItem(raw: any, idx = 0): ProductItemData {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `prod-${idx}`,
      slug: `prod-${idx}`,
      name_vi: 'Sản phẩm VINAXO',
      name_en: 'VINAXO Product',
      name_ko: '',
      name_zh: '',
      category: 'soft-dried',
      image: '/images/products/placeholder.webp',
      description_vi: '',
      description_en: '',
      description_ko: '',
      description_zh: '',
      origin_ko: '',
      origin_zh: '',
      order: idx + 1,
      published: true,
      status: 'published'
    };
  }

  const slug = String(raw.slug || raw.id || `product-${idx}`).trim();
  const id = String(raw.id || slug).trim();
  const name_vi = String(raw.name_vi || raw.nameVi || raw.vi?.name || slug).trim();
  const name_en = String(raw.name_en || raw.name || raw.nameEn || raw.en?.name || name_vi).trim();
  const name_ko = String(raw.name_ko || raw.nameKo || raw.ko?.name || '').trim();
  const name_zh = String(raw.name_zh || raw.nameZh || raw.zh?.name || '').trim();
  const category = String(raw.category || 'soft-dried').trim();
  const image = String(raw.image || raw.imageWebp || raw.imageJpg || '/images/products/placeholder.webp').trim();
  const description_vi = String(raw.description_vi || raw.descriptionVi || raw.shortDescriptionVi || raw.vi?.desc || '').trim();
  const description_en = String(raw.description_en || raw.description || raw.shortDescription || raw.en?.desc || description_vi).trim();
  const description_ko = String(raw.description_ko || raw.descriptionKo || raw.shortDescriptionKo || raw.ko?.desc || '').trim();
  const description_zh = String(raw.description_zh || raw.descriptionZh || raw.shortDescriptionZh || raw.zh?.desc || '').trim();
  const origin_vi = String(raw.origin_vi || raw.originVi || raw.vi?.origin || raw.origin || '').trim();
  const origin_en = String(raw.origin_en || raw.originEn || raw.en?.origin || raw.origin || origin_vi || '').trim();
  const origin_ko = String(raw.origin_ko || raw.originKo || raw.ko?.origin || '').trim();
  const origin_zh = String(raw.origin_zh || raw.originZh || raw.zh?.origin || '').trim();
  const shelf_life = String(raw.shelf_life || raw.specs?.shelfLifeVi || raw.specs?.shelfLifeEn || '12 Tháng').trim();
  const packaging = String(raw.packaging || raw.specs?.packagingVi || raw.specs?.packagingEn || 'Túi zip / Thùng carton xuất khẩu').trim();
  const certifications = Array.isArray(raw.certifications) ? raw.certifications : [];
  const order = Number(raw.order) || idx + 1;
  const published = raw.published !== undefined ? Boolean(raw.published) : raw.status !== 'draft';
  const status = published ? 'published' : 'draft';

  return {
    id,
    slug,
    name_vi,
    name_en,
    name_ko,
    name_zh,
    category,
    image,
    imageWebp: raw.imageWebp || image,
    imageJpg: raw.imageJpg || image,
    description_vi,
    description_en,
    description_ko,
    description_zh,
    origin_vi,
    origin_en,
    origin_ko,
    origin_zh,
    shelf_life,
    packaging,
    certifications,
    order,
    published,
    status
  };
}

const EMPTY_PRODUCT: ProductItemData = {
  id: '',
  slug: '',
  name_vi: '',
  name_en: '',
  name_ko: '',
  name_zh: '',
  category: 'soft-dried',
  image: '/images/products/placeholder.webp',
  description_vi: '',
  description_en: '',
  description_ko: '',
  description_zh: '',
  origin_vi: 'Đồng bằng Sông Cửu Long, Việt Nam',
  origin_en: 'Mekong Delta, Vietnam',
  origin_ko: '메콩 델타, 베트남',
  origin_zh: '越南湄公河三角洲',
  shelf_life: '12 Tháng',
  packaging: 'Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu',
  certifications: ['BRCGS', 'Clean Label'],
  order: 1,
  published: true,
  status: 'published'
};

export const AdminProducts: React.FC = () => {
  const initialProducts: ProductItemData[] = productsData.map((p, idx) => normalizeProductItem(p, idx));

  const [products, setProducts] = useState<ProductItemData[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<ProductItemData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItemData | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishingModule, setIsPublishingModule] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchServerProducts = async () => {
    try {
      const res = await adminFetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products.map((p: any, idx: number) => normalizeProductItem(p, idx)));
        }
      }
    } catch {
      // Keep fallback
    }
  };

  useEffect(() => {
    fetchServerProducts();
  }, []);

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = editingProduct;
    if (!target) return;

    try {
      setIsSaving(true);
      setStatusMsg(null);

      const res = await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(target)
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        const updated = normalizeProductItem(data.product || target, target.order || 0);
        setProducts(prev => {
          const exists = prev.some(p => p.slug === updated.slug);
          if (exists) {
            return prev.map(p => p.slug === updated.slug ? updated : p);
          } else {
            return [updated, ...prev];
          }
        });
        setStatusMsg({ type: 'success', text: `Cập nhật sản phẩm "${updated.name_vi}" thành công!` });
        setEditingProduct(null);
        setIsCreating(false);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể lưu sản phẩm.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi thông tin cập nhật sản phẩm.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      const res = await adminFetch('/api/admin/products', {
        method: 'DELETE',
        body: JSON.stringify({ slug: productToDelete.slug })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setProducts(prev => prev.filter(p => p.slug !== productToDelete.slug));
        setStatusMsg({ type: 'success', text: `Đã xóa sản phẩm "${productToDelete.name_vi}" thành công!` });
        setProductToDelete(null);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể xóa sản phẩm.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi xóa sản phẩm.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Duplicate product
  const handleDuplicateProduct = (prod: ProductItemData) => {
    const copySlug = `${prod.slug}-copy`;
    const copyNameVi = `${prod.name_vi} (Bản sao)`;
    const copyNameEn = `${prod.name_en} (Copy)`;
    const duplicated: ProductItemData = {
      ...prod,
      id: copySlug,
      slug: copySlug,
      name_vi: copyNameVi,
      name_en: copyNameEn,
      name_ko: prod.name_ko ? `${prod.name_ko} (복사본)` : '',
      name_zh: prod.name_zh ? `${prod.name_zh}（副本）` : '',
      order: (prod.order || 0) + 1,
      status: 'draft',
      published: false
    };
    setEditingProduct(duplicated);
    setIsCreating(true);
  };

  // Move product display order
  const handleMoveOrder = async (prod: ProductItemData, direction: 'up' | 'down') => {
    const idx = products.findIndex(p => p.slug === prod.slug);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === products.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newProducts = [...products];
    const tempOrder = newProducts[idx].order || idx + 1;
    newProducts[idx].order = newProducts[swapIdx].order || swapIdx + 1;
    newProducts[swapIdx].order = tempOrder;

    const tempItem = newProducts[idx];
    newProducts[idx] = newProducts[swapIdx];
    newProducts[swapIdx] = tempItem;

    setProducts(newProducts);

    // Save updated item order
    try {
      await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProducts[idx])
      });
      await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProducts[swapIdx])
      });
    } catch {}
  };

  // Publish products module to website
  const handlePublishProductsModule = async () => {
    try {
      setIsPublishingModule(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'products' })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Đã kích hoạt xuất bản toàn bộ ${products.length} sản phẩm lên website!` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi kích hoạt xuất bản nhóm sản phẩm.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi xuất bản nhóm sản phẩm.' });
    } finally {
      setIsPublishingModule(false);
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
          <p style={{ fontSize: '0.86rem', color: '#6E6259', margin: 0 }}>
            Hệ sinh thái {products.length} dòng sản phẩm trái cây sấy dẻo, sấy giòn và hạt dinh dưỡng xuất khẩu.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePublishProductsModule}
            disabled={isPublishingModule}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #10B981',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: isPublishingModule ? 'not-allowed' : 'pointer'
            }}
          >
            <Sparkles size={16} />
            <span>{isPublishingModule ? 'Đang cập nhật...' : 'Cập nhật sản phẩm lên website'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextOrder = products.length + 1;
              setEditingProduct({ ...EMPTY_PRODUCT, order: nextOrder, slug: `san-pham-${nextOrder}` });
              setIsCreating(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F4A83A',
              color: '#3A251B',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        backgroundColor: '#FFFFFF',
        padding: '14px 18px',
        borderRadius: '10px',
        border: '1px solid #EADCCE'
      }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C7E74' }} />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '6px',
              border: '1px solid #EADCCE',
              fontSize: '0.88rem',
              color: '#3A251B',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                border: `1px solid ${selectedCategory === cat.id ? '#3A251B' : '#EADCCE'}`,
                backgroundColor: selectedCategory === cat.id ? '#3A251B' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#6E6259',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #EADCCE',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #EADCCE' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '50px' }}>Thứ tự</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '80px' }}>Hình ảnh</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Tên sản phẩm & Slug</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Phân loại</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Hạn dùng & Đóng gói</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '110px' }}>Trạng thái</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', textAlign: 'right', width: '180px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr
                  key={p.slug || idx}
                  style={{
                    borderBottom: '1px solid #F5EFE6',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FFFDF9'
                  }}
                >
                  {/* Order & Reorder */}
                  <td style={{ padding: '12px 14px', color: '#8C7E74', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{p.order || idx + 1}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(p, 'up')}
                          disabled={idx === 0}
                          style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', padding: 0, opacity: idx === 0 ? 0.3 : 1 }}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(p, 'down')}
                          disabled={idx === products.length - 1}
                          style={{ border: 'none', background: 'none', cursor: idx === products.length - 1 ? 'default' : 'pointer', padding: 0, opacity: idx === products.length - 1 ? 0.3 : 1 }}
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td style={{ padding: '12px 14px' }}>
                    <img
                      src={p.image}
                      alt={p.name_vi}
                      style={{
                        width: '54px',
                        height: '54px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #EADCCE',
                        backgroundColor: '#F5EFE6'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/placeholder.webp';
                      }}
                    />
                  </td>

                  {/* Name & Slug */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#3A251B', marginBottom: '2px' }}>
                      {p.name_vi}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#8C7E74', marginBottom: '2px' }}>
                      {p.name_en}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#D97706', fontFamily: 'monospace' }}>
                      /{p.slug}
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: p.category === 'soft-dried' ? '#FEF3C7' : p.category === 'chips' ? '#E0F2FE' : '#F3E8FF',
                      color: p.category === 'soft-dried' ? '#92400E' : p.category === 'chips' ? '#075985' : '#6B21A8'
                    }}>
                      {p.category === 'soft-dried' ? 'Sấy dẻo' : p.category === 'chips' ? 'Sấy giòn' : p.category === 'nuts-seeds' ? 'Hạt dinh dưỡng' : 'Hỗn hợp'}
                    </span>
                  </td>

                  {/* Shelf Life & Packaging */}
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#6E6259' }}>
                    <div>{p.shelf_life || '12 Tháng'}</div>
                    <div style={{ color: '#8C7E74', fontSize: '0.74rem' }}>{p.packaging || 'Túi zip / Thùng'}</div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      backgroundColor: p.published !== false ? '#ECFDF5' : '#F3F4F6',
                      color: p.published !== false ? '#065F46' : '#6B7280'
                    }}>
                      {p.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.published !== false ? 'Công khai' : 'Bản nháp'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({ ...p });
                          setIsCreating(false);
                        }}
                        title="Chỉnh sửa sản phẩm"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #EADCCE',
                          backgroundColor: '#FFFFFF',
                          color: '#3A251B',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateProduct(p)}
                        title="Nhân bản sản phẩm"
                        style={{
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #EADCCE',
                          backgroundColor: '#FFFFFF',
                          color: '#6E6259',
                          cursor: 'pointer'
                        }}
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductToDelete(p)}
                        title="Xóa sản phẩm"
                        style={{
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FFFFFF',
                          color: '#DC2626',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Create Modal */}
      {editingProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(58, 37, 27, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #EADCCE', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                {isCreating ? 'Thêm sản phẩm mới' : `Chỉnh sửa sản phẩm: ${editingProduct.name_vi}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreating(false);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E6259' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              {/* Name Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên sản phẩm (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_vi}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = isCreating ? name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : editingProduct.slug;
                      setEditingProduct({ ...editingProduct, name_vi: name, slug: slug || editingProduct.slug });
                    }}
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

              {/* Name Fields KO / ZH-CN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên tiếng Hàn (한국어)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name_ko || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ko: e.target.value })}
                    placeholder="VD: 소프트 건조 망고"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên tiếng Trung (简体中文)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name_zh || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_zh: e.target.value })}
                    placeholder="VD: 软干芒果"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Slug & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Đường dẫn tĩnh (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'monospace' }}
                  />
                </div>

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
              </div>

              {/* Image Picker Section */}
              <div style={{ marginBottom: '16px', padding: '14px', borderRadius: '8px', backgroundColor: '#FAF6F0', border: '1px solid #EADCCE' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#3A251B', marginBottom: '8px' }}>
                  Hình ảnh sản phẩm đại diện
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <img
                    src={editingProduct.image}
                    alt={editingProduct.name_vi}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE', backgroundColor: '#FFFFFF' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/placeholder.webp';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6E6259', marginBottom: '6px', wordBreak: 'break-all' }}>
                      Đường dẫn: <code>{editingProduct.image}</code>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          border: '1px solid #EADCCE',
                          backgroundColor: '#FFFFFF',
                          color: '#3A251B',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        <ImageIcon size={14} color="#D97706" />
                        <span>Chọn từ thư viện ảnh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Fields */}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Mô tả sản phẩm (한국어)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description_ko || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ko: e.target.value })}
                    placeholder="제품 설명 (한국어)..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Mô tả sản phẩm (简体中文)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description_zh || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_zh: e.target.value })}
                    placeholder="产品简介 (简体中文)..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Vùng nguyên liệu (한국어)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.origin_ko || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, origin_ko: e.target.value })}
                    placeholder="메콩 델타, 베트남"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Vùng nguyên liệu (简体中文)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.origin_zh || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, origin_zh: e.target.value })}
                    placeholder="越南湄公河三角洲"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Shelf Life & Packaging */}
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

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #EADCCE' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div
          onClick={() => !isDeleting && setProductToDelete(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 10, 5, 0.7)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#DC2626' }}>
              <AlertCircle size={22} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#3A251B' }}>
                Xác nhận xóa sản phẩm
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#6E6259', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Bạn có chắc chắn muốn xóa sản phẩm <strong>"{productToDelete.name_vi}"</strong> ({productToDelete.slug}) khỏi hệ thống? Thao tác này sẽ xóa tệp dữ liệu khỏi Git và website.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #EADCCE',
                  backgroundColor: '#FFFFFF',
                  color: '#6E6259',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared MediaPicker Component Integration */}
      <MediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        initialCategory="products"
        currentValue={editingProduct?.image || ''}
        onSelect={(newUrl) => {
          if (editingProduct) {
            setEditingProduct({
              ...editingProduct,
              image: newUrl,
              imageWebp: newUrl,
              imageJpg: newUrl.endsWith('.webp') ? newUrl.replace(/\.webp$/, '.jpg') : newUrl
            });
          }
        }}
        title="Chọn hình ảnh cho sản phẩm"
      />
    </div>
  );
};

export default AdminProducts;
