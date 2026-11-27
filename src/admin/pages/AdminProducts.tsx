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
  Sparkles,
  Award,
  Tag,
} from 'lucide-react';
import {
  CertificationScopeType,
  OCOP_3_STAR_CERT,
  ProductCertificationRef,
  ProductFeatureItem,
  productsData,
  ProductSpecs,
} from '../../data/products';
import { adminFetch } from '../lib/adminFetch';
import { MediaPicker } from '../components/MediaPicker';

interface AvailableCertificateOption {
  certificateId: string;
  nameVi: string;
  nameEn: string;
  nameKo?: string;
  nameZh?: string;
  defaultScopeType: CertificationScopeType;
  defaultScopeVi: string;
  defaultScopeEn: string;
}

const DEFAULT_CERTIFICATE_OPTIONS: AvailableCertificateOption[] = [
  {
    certificateId: OCOP_3_STAR_CERT.certificateId,
    nameVi: OCOP_3_STAR_CERT.nameVi,
    nameEn: OCOP_3_STAR_CERT.nameEn,
    nameKo: OCOP_3_STAR_CERT.nameKo,
    nameZh: OCOP_3_STAR_CERT.nameZh,
    defaultScopeType: 'product',
    defaultScopeVi: OCOP_3_STAR_CERT.scopeVi,
    defaultScopeEn: OCOP_3_STAR_CERT.scopeEn,
  },
  {
    certificateId: 'brcgs',
    nameVi: 'Tiêu chuẩn An toàn Thực phẩm Toàn cầu BRCGS',
    nameEn: 'BRCGS Food Safety',
    defaultScopeType: 'facility',
    defaultScopeVi: 'Chứng nhận cơ sở sản xuất đạt chuẩn BRCGS Grade B',
    defaultScopeEn: 'Facility Certified BRCGS Food Safety Grade B',
  },
  {
    certificateId: 'iso22000',
    nameVi: 'Hệ thống Quản lý An toàn Thực phẩm ISO 22000:2018',
    nameEn: 'ISO 22000:2018',
    defaultScopeType: 'management-system',
    defaultScopeVi: 'Chứng nhận hệ thống quản lý an toàn thực phẩm',
    defaultScopeEn: 'Food Safety Management System',
  },
  {
    certificateId: 'haccp',
    nameVi: 'Hệ thống Phân tích Mối nguy & Kiểm soát Tới hạn HACCP',
    nameEn: 'HACCP Codex',
    defaultScopeType: 'management-system',
    defaultScopeVi: 'Chứng nhận kiểm soát mối nguy dây chuyền chế biến',
    defaultScopeEn: 'Hazard Analysis Critical Control Point',
  },
  {
    certificateId: 'kosher',
    nameVi: 'Chứng nhận Thực phẩm Kosher (OU)',
    nameEn: 'Kosher OU Certified',
    defaultScopeType: 'product',
    defaultScopeVi: 'Chứng nhận tuân thủ quy chuẩn Kosher OU',
    defaultScopeEn: 'Orthodox Union Kosher Certification',
  },
  {
    certificateId: 'fda',
    nameVi: 'Đăng ký Cơ sở Thực phẩm US FDA',
    nameEn: 'U.S. FDA Food Facility Registration',
    defaultScopeType: 'registration',
    defaultScopeVi: 'Đăng ký cơ sở chế biến xuất khẩu Hoa Kỳ (không phải chứng nhận sản phẩm)',
    defaultScopeEn: 'U.S. FDA Facility Registration (not product approval)',
  },
  {
    certificateId: 'smeta',
    nameVi: 'Kiểm toán Trách nhiệm Xã hội Sedex SMETA',
    nameEn: 'Sedex SMETA Audit',
    defaultScopeType: 'audit',
    defaultScopeVi: 'Đánh giá kiểm toán đạo đức & lao động cơ sở',
    defaultScopeEn: 'Ethical Trade & Social Responsibility Audit',
  },
];

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
  shortDescriptionVi?: string;
  shortDescription?: string;
  shortDescriptionKo?: string;
  shortDescriptionZh?: string;
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
  specs: ProductSpecs;
  productCertifications: ProductCertificationRef[];
  productFeatures: ProductFeatureItem[];
  certifications?: string[];
  seoTitleVi?: string;
  seoTitleEn?: string;
  seoDescriptionVi?: string;
  seoDescriptionEn?: string;
  imageAltVi?: string;
  imageAltEn?: string;
  order?: number;
  published?: boolean;
  status?: 'published' | 'draft';
}

const EMPTY_SPECS: ProductSpecs = {
  moisture: '',
  brix: '',
  sizeOrWeightVi: '',
  sizeOrWeightEn: '',
  shelfLifeEn: '',
  shelfLifeVi: '',
  storageEn: '',
  storageVi: '',
  ingredientsEn: '',
  ingredientsVi: '',
  processEn: '',
  processVi: '',
  packagingEn: '',
  packagingVi: '',
  certificationsEn: '',
  certificationsVi: '',
};

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
      shortDescriptionVi: '',
      shortDescription: '',
      shortDescriptionKo: '',
      shortDescriptionZh: '',
      description_vi: '',
      description_en: '',
      description_ko: '',
      description_zh: '',
      origin_vi: '',
      origin_en: '',
      origin_ko: '',
      origin_zh: '',
      shelf_life: '',
      packaging: '',
      specs: { ...EMPTY_SPECS },
      productCertifications: [],
      productFeatures: [],
      certifications: [],
      order: idx + 1,
      published: true,
      status: 'published',
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

  const description_vi = String(raw.description_vi || raw.descriptionVi || raw.vi?.desc || '').trim();
  const shortDescriptionVi = String(raw.shortDescriptionVi || raw.vi?.desc || description_vi).trim();
  const description_en = String(raw.description_en || raw.description || raw.en?.desc || description_vi).trim();
  const shortDescription = String(raw.shortDescription || raw.en?.desc || description_en).trim();
  const description_ko = String(raw.description_ko || raw.descriptionKo || raw.ko?.desc || '').trim();
  const shortDescriptionKo = String(raw.shortDescriptionKo || raw.ko?.desc || description_ko).trim();
  const description_zh = String(raw.description_zh || raw.descriptionZh || raw.zh?.desc || '').trim();
  const shortDescriptionZh = String(raw.shortDescriptionZh || raw.zh?.desc || description_zh).trim();

  const origin_vi = String(raw.origin_vi || raw.originVi || raw.vi?.origin || raw.origin || '').trim();
  const origin_en = String(raw.origin_en || raw.originEn || raw.en?.origin || raw.origin || origin_vi || '').trim();
  const origin_ko = String(raw.origin_ko || raw.originKo || raw.ko?.origin || '').trim();
  const origin_zh = String(raw.origin_zh || raw.originZh || raw.zh?.origin || '').trim();

  const rawSpecs = typeof raw.specs === 'object' && raw.specs !== null ? raw.specs : {};
  const specs: ProductSpecs = {
    ...EMPTY_SPECS,
    ...rawSpecs,
    shelfLifeVi: String(rawSpecs.shelfLifeVi || raw.shelf_life || '').trim(),
    packagingVi: String(rawSpecs.packagingVi || raw.packaging || '').trim(),
  };

  const productCertifications: ProductCertificationRef[] = Array.isArray(raw.productCertifications)
    ? raw.productCertifications
    : [];
  const productFeatures: ProductFeatureItem[] = Array.isArray(raw.productFeatures)
    ? raw.productFeatures
    : [];
  const certifications = productCertifications.map((c) => c.nameVi || c.nameEn);
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
    shortDescriptionVi,
    shortDescription,
    shortDescriptionKo,
    shortDescriptionZh,
    description_vi,
    description_en,
    description_ko,
    description_zh,
    origin_vi,
    origin_en,
    origin_ko,
    origin_zh,
    shelf_life: specs.shelfLifeVi || '',
    packaging: specs.packagingVi || '',
    specs,
    productCertifications,
    productFeatures,
    certifications,
    seoTitleVi: raw.seoTitleVi || '',
    seoTitleEn: raw.seoTitleEn || '',
    seoDescriptionVi: raw.seoDescriptionVi || '',
    seoDescriptionEn: raw.seoDescriptionEn || '',
    imageAltVi: raw.imageAltVi || '',
    imageAltEn: raw.imageAltEn || '',
    order,
    published,
    status,
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
  shortDescriptionVi: '',
  shortDescription: '',
  shortDescriptionKo: '',
  shortDescriptionZh: '',
  description_vi: '',
  description_en: '',
  description_ko: '',
  description_zh: '',
  origin_vi: '',
  origin_en: '',
  origin_ko: '',
  origin_zh: '',
  shelf_life: '',
  packaging: '',
  specs: { ...EMPTY_SPECS },
  productCertifications: [],
  productFeatures: [],
  certifications: [],
  seoTitleVi: '',
  seoTitleEn: '',
  seoDescriptionVi: '',
  seoDescriptionEn: '',
  imageAltVi: '',
  imageAltEn: '',
  order: 1,
  published: true,
  status: 'published',
};

type EditorTab = 'general' | 'content' | 'specs' | 'certs-features' | 'media-seo';

export const AdminProducts: React.FC = () => {
  const initialProducts: ProductItemData[] = productsData.map((p, idx) => normalizeProductItem(p, idx));

  const [products, setProducts] = useState<ProductItemData[]>(initialProducts);
  const [certOptions, setCertOptions] = useState<AvailableCertificateOption[]>(DEFAULT_CERTIFICATE_OPTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<ProductItemData | null>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('general');
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

  const fetchCertificatesModule = async () => {
    try {
      const res = await adminFetch('/api/admin/certificates');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.certificates) && data.certificates.length > 0) {
          const mapped: AvailableCertificateOption[] = data.certificates.map((c: any) => {
            const rawKind = String(c.kindEn || '').toLowerCase();
            const scopeType: CertificationScopeType = rawKind.includes('registration')
              ? 'registration'
              : rawKind.includes('audit')
              ? 'audit'
              : c.id === 'iso22000' || c.id === 'haccp'
              ? 'management-system'
              : c.id === 'brcgs'
              ? 'facility'
              : 'product';
            return {
              certificateId: String(c.id),
              nameVi: String(c.nameVi || c.name),
              nameEn: String(c.nameEn || c.name),
              nameKo: c.nameKo,
              nameZh: c.nameZh,
              defaultScopeType: scopeType,
              defaultScopeVi: String(c.scopeVi || ''),
              defaultScopeEn: String(c.scopeEn || ''),
            };
          });
          // Always include OCOP 3 Sao product cert if not present
          const hasOcop = mapped.some((m) => m.certificateId === 'ocop-3-star');
          setCertOptions(hasOcop ? mapped : [DEFAULT_CERTIFICATE_OPTIONS[0], ...mapped]);
        }
      }
    } catch {
      // Keep defaults
    }
  };

  useEffect(() => {
    fetchServerProducts();
    fetchCertificatesModule();
  }, []);

  // Save product (Add or Edit) using unified CMS payload preserving all fields & translations
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = editingProduct;
    if (!target) return;

    const payload = {
      ...target,
      id: target.id || target.slug,
      nameVi: target.name_vi,
      name: target.name_en,
      nameKo: target.name_ko,
      nameZh: target.name_zh,
      shortDescriptionVi: target.shortDescriptionVi,
      shortDescription: target.shortDescription,
      shortDescriptionKo: target.shortDescriptionKo,
      shortDescriptionZh: target.shortDescriptionZh,
      descriptionVi: target.description_vi,
      description: target.description_en,
      descriptionKo: target.description_ko,
      descriptionZh: target.description_zh,
      originVi: target.origin_vi,
      origin: target.origin_en,
      originKo: target.origin_ko,
      originZh: target.origin_zh,
      specs: {
        ...target.specs,
        shelfLifeVi: target.specs.shelfLifeVi || target.shelf_life || '',
        packagingVi: target.specs.packagingVi || target.packaging || '',
      },
      productCertifications: target.productCertifications,
      productFeatures: target.productFeatures,
      status: target.published === false ? 'draft' : 'published',
    };

    try {
      setIsSaving(true);
      setStatusMsg(null);

      const res = await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        const updated = normalizeProductItem(data.product || payload, target.order || 0);
        setProducts((prev) => {
          const exists = prev.some((p) => p.slug === updated.slug);
          if (exists) {
            return prev.map((p) => (p.slug === updated.slug ? updated : p));
          }
          return [updated, ...prev];
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
        body: JSON.stringify({ slug: productToDelete.slug }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setProducts((prev) => prev.filter((p) => p.slug !== productToDelete.slug));
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
      published: false,
    };
    setEditingProduct(duplicated);
    setActiveTab('general');
    setIsCreating(true);
  };

  // Move product display order
  const handleMoveOrder = async (prod: ProductItemData, direction: 'up' | 'down') => {
    const idx = products.findIndex((p) => p.slug === prod.slug);
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

    try {
      await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProducts[idx]),
      });
      await adminFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProducts[swapIdx]),
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
        body: JSON.stringify({ module: 'products' }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({
          type: 'success',
          text: `Đã kích hoạt xuất bản toàn bộ ${products.length} sản phẩm lên website!`,
        });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi kích hoạt xuất bản nhóm sản phẩm.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi xuất bản nhóm sản phẩm.' });
    } finally {
      setIsPublishingModule(false);
    }
  };

  const toggleProductCertificate = (opt: AvailableCertificateOption) => {
    if (!editingProduct) return;
    const exists = editingProduct.productCertifications.some(
      (c) => c.certificateId === opt.certificateId
    );
    const next = exists
      ? editingProduct.productCertifications.filter((c) => c.certificateId !== opt.certificateId)
      : [
          ...editingProduct.productCertifications,
          {
            certificateId: opt.certificateId,
            nameVi: opt.nameVi,
            nameEn: opt.nameEn,
            ...(opt.nameKo ? { nameKo: opt.nameKo } : {}),
            ...(opt.nameZh ? { nameZh: opt.nameZh } : {}),
            scopeType: opt.defaultScopeType,
            scopeVi: opt.defaultScopeVi,
            scopeEn: opt.defaultScopeEn,
          },
        ];
    setEditingProduct({ ...editingProduct, productCertifications: next });
  };

  const updateProductCertField = (
    certificateId: string,
    field: 'scopeType' | 'scopeVi' | 'scopeEn' | 'documentUrl',
    val: string
  ) => {
    if (!editingProduct) return;
    const next = editingProduct.productCertifications.map((c) =>
      c.certificateId === certificateId ? { ...c, [field]: val } : c
    );
    setEditingProduct({ ...editingProduct, productCertifications: next });
  };

  const addProductFeature = () => {
    if (!editingProduct) return;
    const next: ProductFeatureItem[] = [
      ...editingProduct.productFeatures,
      {
        id: `feature-${Date.now()}`,
        label: { vi: '', en: '', ko: '', zh: '' },
      },
    ];
    setEditingProduct({ ...editingProduct, productFeatures: next });
  };

  const updateProductFeatureField = (
    index: number,
    lang: 'vi' | 'en' | 'ko' | 'zh',
    val: string
  ) => {
    if (!editingProduct) return;
    const next = editingProduct.productFeatures.map((feat, idx) =>
      idx === index ? { ...feat, label: { ...feat.label, [lang]: val } } : feat
    );
    setEditingProduct({ ...editingProduct, productFeatures: next });
  };

  const removeProductFeature = (index: number) => {
    if (!editingProduct) return;
    const next = editingProduct.productFeatures.filter((_, idx) => idx !== index);
    setEditingProduct({ ...editingProduct, productFeatures: next });
  };

  const filteredProducts = products.filter((p) => {
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
            Hệ sinh thái {products.length} mặt hàng trái cây sấy dẻo, trái cây sấy giòn, hạt dinh dưỡng và sản phẩm thập cẩm.
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
              cursor: isPublishingModule ? 'not-allowed' : 'pointer',
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
              setActiveTab('general');
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
              boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)',
            }}
          >
            <Plus size={16} />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
            color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
            fontSize: '0.88rem',
          }}
        >
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          backgroundColor: '#FFFFFF',
          padding: '14px 18px',
          borderRadius: '10px',
          border: '1px solid #EADCCE',
        }}
      >
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
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'soft-dried', label: 'Trái cây sấy dẻo' },
            { id: 'chips', label: 'Trái cây sấy giòn' },
            { id: 'nuts-seeds', label: 'Hạt dinh dưỡng' },
            { id: 'mixed', label: 'Sản phẩm thập cẩm' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                border: `1px solid ${selectedCategory === cat.id ? '#3A251B' : '#EADCCE'}`,
                backgroundColor: selectedCategory === cat.id ? '#3A251B' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#6E6259',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EADCCE',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #EADCCE' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '50px' }}>Thứ tự</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '76px' }}>Hình ảnh</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Tên sản phẩm & Slug</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Danh mục</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Chứng nhận</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Đặc tính sản phẩm</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '108px' }}>Hiển thị</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', textAlign: 'right', width: '165px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr
                  key={p.slug || idx}
                  style={{
                    borderBottom: '1px solid #F5EFE6',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FFFDF9',
                  }}
                >
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

                  <td style={{ padding: '12px 14px' }}>
                    <img
                      src={p.image}
                      alt={p.name_vi}
                      style={{
                        width: '52px',
                        height: '52px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #EADCCE',
                        backgroundColor: '#F5EFE6',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/placeholder.webp';
                      }}
                    />
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#3A251B', marginBottom: '2px' }}>{p.name_vi}</div>
                    <div style={{ fontSize: '0.78rem', color: '#8C7E74', marginBottom: '2px' }}>{p.name_en}</div>
                    <div style={{ fontSize: '0.72rem', color: '#D97706', fontFamily: 'monospace' }}>/{p.slug}</div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: p.category === 'soft-dried' ? '#FEF3C7' : p.category === 'chips' ? '#E0F2FE' : p.category === 'nuts-seeds' ? '#F3E8FF' : '#ECFDF5',
                        color: p.category === 'soft-dried' ? '#92400E' : p.category === 'chips' ? '#075985' : p.category === 'nuts-seeds' ? '#6B21A8' : '#065F46',
                      }}
                    >
                      {p.category === 'soft-dried' ? 'Sấy dẻo' : p.category === 'chips' ? 'Sấy giòn' : p.category === 'nuts-seeds' ? 'Hạt dinh dưỡng' : 'Thập cẩm'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px', fontSize: '0.78rem' }}>
                    {p.productCertifications.length > 0 ? (
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FBEBC9', color: '#3A2417', fontWeight: 700 }}>
                        {p.productCertifications.map((c) => c.nameVi).join(', ')}
                      </span>
                    ) : (
                      <span style={{ color: '#8C7E74' }}>—</span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#1E4620' }}>
                    {p.productFeatures.length > 0
                      ? p.productFeatures.map((f) => f.label.vi).slice(0, 2).join(' • ')
                      : <span style={{ color: '#8C7E74' }}>—</span>}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        backgroundColor: p.published !== false ? '#ECFDF5' : '#F3F4F6',
                        color: p.published !== false ? '#065F46' : '#6B7280',
                      }}
                    >
                      {p.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.published !== false ? 'Công khai' : 'Bản nháp'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({ ...p });
                          setActiveTab('general');
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
                          gap: '4px',
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
                          cursor: 'pointer',
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
                          cursor: 'pointer',
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

      {/* Edit & Create Modal with 5 structured tabs matching public schema */}
      {editingProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(58, 37, 27, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #EADCCE', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                {isCreating ? 'Thêm sản phẩm mới' : `Chỉnh sửa: ${editingProduct.name_vi}`}
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

            {/* Modal Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              {(
                [
                  { key: 'general', label: '1. Thông tin chung' },
                  { key: 'content', label: '2. Nội dung 4 ngôn ngữ' },
                  { key: 'specs', label: '3. Thông số kỹ thuật' },
                  { key: 'certs-features', label: '4. Chứng nhận & Đặc tính' },
                  { key: 'media-seo', label: '5. Hình ảnh & SEO' },
                ] as Array<{ key: EditorTab; label: string }>
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: activeTab === tab.key ? 700 : 600,
                    border: `1px solid ${activeTab === tab.key ? '#F4A83A' : '#EADCCE'}`,
                    backgroundColor: activeTab === tab.key ? '#FFF6E8' : '#FFFFFF',
                    color: '#3A251B',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProduct}>
              {/* TAB 1: General Info */}
              {activeTab === 'general' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '14px' }}>
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
                          const slug = isCreating
                            ? name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
                            : editingProduct.slug;
                          setEditingProduct({ ...editingProduct, name_vi: name, slug: slug || editingProduct.slug });
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Tên sản phẩm (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name_en}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Tên tiếng Hàn (한국어)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name_ko || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name_ko: e.target.value })}
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
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Slug ổn định *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.slug}
                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Danh mục
                      </label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      >
                        <option value="soft-dried">Trái cây sấy dẻo (soft-dried)</option>
                        <option value="chips">Trái cây sấy giòn (chips)</option>
                        <option value="nuts-seeds">Hạt dinh dưỡng (nuts-seeds)</option>
                        <option value="mixed">Sản phẩm thập cẩm (mixed)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Thứ tự hiển thị
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editingProduct.order ?? 1}
                        onChange={(e) => setEditingProduct({ ...editingProduct, order: Number(e.target.value) || 1 })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Trạng thái hiển thị
                      </label>
                      <select
                        value={editingProduct.published === false ? 'draft' : 'published'}
                        onChange={(e) => {
                          const isPub = e.target.value === 'published';
                          setEditingProduct({ ...editingProduct, published: isPub, status: isPub ? 'published' : 'draft' });
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      >
                        <option value="published">Công khai (Published)</option>
                        <option value="draft">Ẩn / Nháp (Draft)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Vùng nguyên liệu / Xuất xứ (VI)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.origin_vi || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, origin_vi: e.target.value })}
                        placeholder="VD: Vùng trồng Chợ Gạo, Tiền Giang"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Vùng nguyên liệu / Xuất xứ (EN)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.origin_en || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, origin_en: e.target.value })}
                        placeholder="VD: Cho Gao, Tien Giang Orchards"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Vùng nguyên liệu (KO)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.origin_ko || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, origin_ko: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Vùng nguyên liệu (ZH-CN)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.origin_zh || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, origin_zh: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Content */}
              {activeTab === 'content' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Mô tả ngắn trên Card (Tiếng Việt)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.shortDescriptionVi || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescriptionVi: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Short Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.shortDescription || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                      Mô tả chi tiết (Tiếng Việt)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProduct.description_vi}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description_vi: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                      Full Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProduct.description_en}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Mô tả chi tiết (한국어)
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.description_ko || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description_ko: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Mô tả chi tiết (简体中文)
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.description_zh || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description_zh: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Specs */}
              {activeTab === 'specs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Độ ẩm tiêu chuẩn
                      </label>
                      <input
                        type="text"
                        placeholder="VD: < 16% hoặc < 5%"
                        value={editingProduct.specs.moisture}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, moisture: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Độ Brix (chỉ nhập nếu áp dụng)
                      </label>
                      <input
                        type="text"
                        placeholder="Để trống nếu không áp dụng"
                        value={editingProduct.specs.brix}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, brix: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Kích cỡ / Phân loại (VI)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: W240 / W320"
                        value={editingProduct.specs.sizeOrWeightVi || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, sizeOrWeightVi: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Thành phần (VI)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.ingredientsVi}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, ingredientsVi: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Ingredients (EN)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.ingredientsEn}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, ingredientsEn: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Công nghệ chế biến (VI)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.processVi}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, processVi: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Processing Method (EN)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.processEn}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, processEn: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Hạn sử dụng (VI / EN)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.shelfLifeVi || editingProduct.shelf_life || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            shelf_life: e.target.value,
                            specs: { ...editingProduct.specs, shelfLifeVi: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Điều kiện bảo quản (VI)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.storageVi}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, storageVi: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Quy cách đóng gói (VI)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.packagingVi || editingProduct.packaging || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            packaging: e.target.value,
                            specs: { ...editingProduct.specs, packagingVi: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Packaging Formats (EN)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.specs.packagingEn}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specs: { ...editingProduct.specs, packagingEn: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Certifications & Features (Strict separation) */}
              {activeTab === 'certs-features' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Verified Certifications Selector */}
                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#FAF6F0', border: '1px solid #EADCCE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#3A251B', marginBottom: '8px', fontSize: '0.9rem' }}>
                      <Award size={16} color="#D97706" />
                      <span>Chứng nhận áp dụng cho sản phẩm (tách riêng với Đặc tính sản phẩm)</span>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#6E6259' }}>
                      Chỉ chọn chứng nhận đã xác minh phạm vi áp dụng. Không tự gán chứng nhận cơ sở hoặc thông tin marketing (Clean Label, Đặc sản Đồng Tháp) làm chứng nhận sản phẩm.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {certOptions.map((opt) => {
                        const checked = editingProduct.productCertifications.some(
                          (c) => c.certificateId === opt.certificateId
                        );
                        return (
                          <label
                            key={opt.certificateId}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: `1px solid ${checked ? '#D97706' : '#EADCCE'}`,
                              backgroundColor: checked ? '#FFF6E8' : '#FFFFFF',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleProductCertificate(opt)}
                            />
                            <span>{opt.nameVi}</span>
                          </label>
                        );
                      })}
                    </div>

                    {editingProduct.productCertifications.map((cert) => (
                      <div
                        key={cert.certificateId}
                        style={{
                          padding: '10px 12px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid #EADCCE',
                          marginTop: '8px',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#3A251B', marginBottom: '6px' }}>
                          {cert.nameVi} ({cert.nameEn})
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                          <select
                            value={cert.scopeType}
                            onChange={(e) => updateProductCertField(cert.certificateId, 'scopeType', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          >
                            <option value="product">Chứng nhận sản phẩm</option>
                            <option value="facility">Chứng nhận cơ sở</option>
                            <option value="management-system">Chứng nhận hệ thống quản lý</option>
                            <option value="registration">Đăng ký cơ sở</option>
                            <option value="audit">Đánh giá kiểm toán</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Phạm vi áp dụng (VI)"
                            value={cert.scopeVi}
                            onChange={(e) => updateProductCertField(cert.certificateId, 'scopeVi', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          />
                          <input
                            type="text"
                            placeholder="Scope (EN)"
                            value={cert.scopeEn}
                            onChange={(e) => updateProductCertField(cert.certificateId, 'scopeEn', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Product Features Manager */}
                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#F3F7F2', border: '1px solid #DCE7DA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1E4620', fontSize: '0.9rem' }}>
                        <Tag size={16} />
                        <span>Đặc tính sản phẩm (VI / EN / KO / ZH-CN)</span>
                      </div>
                      <button
                        type="button"
                        onClick={addProductFeature}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #1E4620',
                          backgroundColor: '#FFFFFF',
                          color: '#1E4620',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={14} />
                        <span>Thêm đặc tính</span>
                      </button>
                    </div>

                    {editingProduct.productFeatures.length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#6E6259' }}>
                        Chưa có đặc tính nào. Bấm "Thêm đặc tính" để khai báo.
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {editingProduct.productFeatures.map((feat, fIdx) => (
                        <div
                          key={feat.id || fIdx}
                          style={{
                            padding: '10px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            border: '1px solid #DCE7DA',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Tiếng Việt"
                            value={feat.label.vi || ''}
                            onChange={(e) => updateProductFeatureField(fIdx, 'vi', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          />
                          <input
                            type="text"
                            placeholder="English"
                            value={feat.label.en || ''}
                            onChange={(e) => updateProductFeatureField(fIdx, 'en', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          />
                          <input
                            type="text"
                            placeholder="한국어"
                            value={feat.label.ko || ''}
                            onChange={(e) => updateProductFeatureField(fIdx, 'ko', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          />
                          <input
                            type="text"
                            placeholder="简体中文"
                            value={feat.label.zh || ''}
                            onChange={(e) => updateProductFeatureField(fIdx, 'zh', e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.8rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeProductFeature(fIdx)}
                            title="Xóa đặc tính"
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FECACA', backgroundColor: '#FFFFFF', color: '#DC2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Media & SEO */}
              {activeTab === 'media-seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#FAF6F0', border: '1px solid #EADCCE' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#3A251B', marginBottom: '8px' }}>
                      Hình ảnh sản phẩm đại diện (chọn từ Thư viện Media / Tải ảnh mới)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <img
                        src={editingProduct.image}
                        alt={editingProduct.imageAltVi || editingProduct.name_vi}
                        style={{ width: '78px', height: '78px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE', backgroundColor: '#FFFFFF' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/placeholder.webp';
                        }}
                      />
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#6E6259', marginBottom: '6px', wordBreak: 'break-all' }}>
                          Đường dẫn hiện tại: <code>{editingProduct.image}</code>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: '1px solid #EADCCE',
                            backgroundColor: '#FFFFFF',
                            color: '#3A251B',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          <ImageIcon size={14} color="#D97706" />
                          <span>Chọn hoặc tải ảnh từ Media Picker</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Alt Text Hình ảnh (Tiếng Việt)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.imageAltVi || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, imageAltVi: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        Image Alt Text (English)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.imageAltEn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, imageAltEn: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        SEO Title (Tiếng Việt)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.seoTitleVi || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoTitleVi: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        SEO Title (English)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.seoTitleEn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoTitleEn: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        SEO Description (Tiếng Việt)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.seoDescriptionVi || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoDescriptionVi: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                        SEO Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.seoDescriptionEn || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoDescriptionEn: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', marginTop: '18px', borderTop: '1px solid #EADCCE' }}>
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
                    cursor: 'pointer',
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
                    boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)',
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
            padding: '16px',
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
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
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
                  cursor: 'pointer',
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
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
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
              imageJpg: newUrl.endsWith('.webp') ? newUrl.replace(/\.webp$/, '.jpg') : newUrl,
            });
          }
        }}
        title="Chọn hình ảnh cho sản phẩm"
      />
    </div>
  );
};

export default AdminProducts;
