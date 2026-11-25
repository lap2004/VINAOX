import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Upload, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Image as ImageIcon, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  X,
  RefreshCw,
  Crop,
  RotateCw,
  Scissors,
  BookmarkCheck,
  ShieldCheck
} from 'lucide-react';
import { adminFetch } from '../lib/adminFetch';
import { productsData } from '../../data/products';
import { getAllArticles } from '../../services/contentService';
import { COMPLIANCE_ITEMS } from '../../data/brochureData';

interface MediaItem {
  name: string;
  url: string;
  fallbackUrl?: string;
  size?: number;
  category: string;
}

const SITE_ASSETS_MEDIA: MediaItem[] = [
  { name: 'dried-fruit-export.webp', url: '/assets/images/news/dried-fruit-export.webp', category: 'news', size: 105510 },
  { name: 'eu-green-policy.webp', url: '/assets/images/news/eu-green-policy.webp', category: 'news', size: 209414 },
  { name: 'fruit-processing.webp', url: '/assets/images/news/fruit-processing.webp', category: 'news', size: 138814 },
  { name: 'green-logistics.webp', url: '/assets/images/news/green-logistics.webp', category: 'news', size: 280392 },
  { name: 'mango-procurement.webp', url: '/assets/images/news/mango-procurement.webp', category: 'news', size: 364106 },
  { name: 'tet-oem-production.webp', url: '/assets/images/news/tet-oem-production.webp', category: 'news', size: 186932 },
  { name: 'vinaxo-company-story.webp', url: '/assets/images/news/vinaxo-company-story.webp', category: 'news', size: 102806 },
  { name: 'soft-dried-mango.webp', url: '/images/products/soft-dried-mango.webp', category: 'products', size: 611290 },
  { name: 'soft-dried-red-dragonfruit.webp', url: '/images/products/soft-dried-red-dragonfruit.webp', category: 'products', size: 656812 },
  { name: 'jackfruit-chips.webp', url: '/images/products/jackfruit-chips.webp', category: 'products', size: 781398 },
  { name: 'cashew.webp', url: '/images/products/cashew.webp', category: 'products', size: 1020798 },
  { name: 'lotus-seeds.webp', url: '/images/products/lotus-seeds.webp', category: 'products', size: 735030 },
  { name: 'macadamia-nuts.webp', url: '/images/products/macadamia-nuts.webp', category: 'products', size: 775360 },
  { name: 'cert-brcgs.webp', url: '/assets/images/certs-2026/cert-brcgs.webp', category: 'certificates', size: 21318 },
  { name: 'cert-fda.webp', url: '/assets/images/certs-2026/cert-fda.webp', category: 'certificates', size: 43114 },
  { name: 'cert-iso22000.webp', url: '/assets/images/certs-2026/cert-iso22000.webp', category: 'certificates', size: 22810 },
  { name: 'cert-haccp.webp', url: '/assets/images/certs-2026/cert-haccp.webp', category: 'certificates', size: 23588 },
  { name: 'cert-kosher-ou.webp', url: '/assets/images/certs-2026/cert-kosher-ou.webp', category: 'certificates', size: 17648 },
  { name: 'cert-smeta.webp', url: '/assets/images/certs-2026/cert-smeta.webp', category: 'certificates', size: 20034 }
];

export interface AdminMediaProps {
  initialCategory?: 'all' | 'news' | 'products' | 'certificates';
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ initialCategory }) => {
  const location = useLocation();
  const isCertificatesRoute = initialCategory === 'certificates' || location.pathname.includes('/certificates');
  const defaultCategory = isCertificatesRoute ? 'certificates' : (initialCategory || 'all');
  const defaultUploadCategory = isCertificatesRoute ? 'certificates' : (initialCategory && initialCategory !== 'all' ? initialCategory : 'news');

  const [mediaList, setMediaList] = useState<MediaItem[]>(SITE_ASSETS_MEDIA);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'news' | 'products' | 'certificates'>(defaultUploadCategory);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [cropAspectRatio, setCropAspectRatio] = useState<'free' | '1:1' | '4:3' | '16:9'>('free');
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [cropMaxDim, setCropMaxDim] = useState<number>(1920);
  const [isProcessingEdit, setIsProcessingEdit] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync category if URL pathname or prop changes
  useEffect(() => {
    if (isCertificatesRoute) {
      setSelectedCategory('certificates');
      setUploadCategory('certificates');
    }
  }, [isCertificatesRoute]);

  // Cross-reference checker for existing site content
  const getReferencingItems = (url: string): string[] => {
    const refs: string[] = [];
    productsData.forEach(p => {
      if (p.image === url || p.imageWebp === url || p.imageJpg === url) {
        refs.push(`Sản phẩm: ${p.nameVi}`);
      }
    });
    getAllArticles({ includeDrafts: true }).forEach(a => {
      if (a.cover_image === url) {
        refs.push(`Bài viết: ${a.title_vi}`);
      }
    });
    COMPLIANCE_ITEMS.forEach(c => {
      if (c.certImageWebp === url || c.certImageJpg === url) {
        refs.push(`Chứng nhận: ${c.name} (${c.kindVi})`);
      }
    });
    return refs;
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await adminFetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        const uploaded: MediaItem[] = Array.isArray(data.media) ? data.media : [];
        const existingUrls = new Set(uploaded.map(u => u.url));
        const merged = [...uploaded, ...SITE_ASSETS_MEDIA.filter(s => !existingUrls.has(s.url))];
        setMediaList(merged);
      }
    } catch {
      // Retain built-in asset list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Process crop, rotate, resize and save as optimized WebP directly to Git
  const handleApplyCropAndSave = async () => {
    if (!editingItem) return;
    try {
      setIsProcessingEdit(true);
      setStatusMsg(null);

      const targetUrl = editingItem.fallbackUrl || editingItem.url;
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Không thể tải ảnh để chỉnh sửa.'));
        img.src = targetUrl;
      });

      const canvas = document.createElement('canvas');
      let srcW = img.width;
      let srcH = img.height;

      // Calculate crop box if aspect ratio is set
      let cropX = 0;
      let cropY = 0;
      let cropW = srcW;
      let cropH = srcH;

      if (cropAspectRatio === '1:1') {
        const side = Math.min(srcW, srcH);
        cropX = Math.round((srcW - side) / 2);
        cropY = Math.round((srcH - side) / 2);
        cropW = side;
        cropH = side;
      } else if (cropAspectRatio === '4:3') {
        const targetRatio = 4 / 3;
        if (srcW / srcH > targetRatio) {
          cropW = Math.round(srcH * targetRatio);
          cropX = Math.round((srcW - cropW) / 2);
        } else {
          cropH = Math.round(srcW / targetRatio);
          cropY = Math.round((srcH - cropH) / 2);
        }
      } else if (cropAspectRatio === '16:9') {
        const targetRatio = 16 / 9;
        if (srcW / srcH > targetRatio) {
          cropW = Math.round(srcH * targetRatio);
          cropX = Math.round((srcW - cropW) / 2);
        } else {
          cropH = Math.round(srcW / targetRatio);
          cropY = Math.round((srcH - cropH) / 2);
        }
      }

      // Target scaled dimensions
      let outW = cropW;
      let outH = cropH;
      if (outW > cropMaxDim || outH > cropMaxDim) {
        if (outW > outH) {
          outH = Math.round((outH * cropMaxDim) / outW);
          outW = cropMaxDim;
        } else {
          outW = Math.round((outW * cropMaxDim) / outH);
          outH = cropMaxDim;
        }
      }

      const isRotated90 = cropRotation % 180 !== 0;
      canvas.width = isRotated90 ? outH : outW;
      canvas.height = isRotated90 ? outW : outH;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D');

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.drawImage(img, cropX, cropY, cropW, cropH, -outW / 2, -outH / 2, outW, outH);

      let quality = 0.85;
      let base64Data = canvas.toDataURL('image/webp', quality);
      while (base64Data.length > 700_000 && quality > 0.4) {
        quality -= 0.1;
        base64Data = canvas.toDataURL('image/webp', quality);
      }

      const cleanBaseName = editingItem.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9_-]/gi, '-');
      const filename = `${cleanBaseName}-edit-${cropAspectRatio}.webp`;

      const res = await adminFetch('/api/admin/media', {
        method: 'POST',
        body: JSON.stringify({
          filename,
          base64Data,
          category: editingItem.category
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Đã cắt & tối ưu ảnh WebP thành công: ${data.url}` });
        const uploadedName = data.url.split('/').pop() || filename;
        setMediaList(prev => [{
          name: uploadedName,
          url: data.url,
          fallbackUrl: data.fallbackUrl,
          category: editingItem.category,
          size: data.size || Math.round((base64Data.length * 3) / 4)
        }, ...prev]);
        setEditingItem(null);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi lưu ảnh đã cắt.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || 'Lỗi khi xử lý hình ảnh.' });
    } finally {
      setIsProcessingEdit(false);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCopyUrl = async (url: string) => {
    let success = false;
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.warn('Fallback copy failed:', err);
      }
    }

    setCopiedUrl(url);
    setStatusMsg({
      type: 'success',
      text: `Đã sao chép đường dẫn ảnh vào bộ nhớ tạm: ${fullUrl}`
    });
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2500);
  };

  // Client-side image scaling and WebP compression via HTML5 Canvas
  const processAndUploadImage = async (file: File) => {
    try {
      setUploading(true);
      setStatusMsg(null);

      if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
        setStatusMsg({ type: 'error', text: 'Chỉ chấp nhận file hình ảnh định dạng JPG, PNG hoặc WebP.' });
        setUploading(false);
        return;
      }

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 1920;
            let width = img.width;
            let height = img.height;

            if (width > height && width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else if (height >= width && height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(e.target?.result as string);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            let quality = 0.85;
            let dataUrl = canvas.toDataURL('image/webp', quality);
            // Adaptively step down quality if compressed output is still > 2MB base64
            while (dataUrl.length > 2_600_000 && quality > 0.45) {
              quality -= 0.1;
              dataUrl = canvas.toDataURL('image/webp', quality);
            }
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await adminFetch('/api/admin/media', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          base64Data,
          category: uploadCategory
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Upload ảnh thành công: ${data.url}` });
        const uploadedName = data.url.split('/').pop() || file.name;
        setMediaList(prev => [{
          name: uploadedName,
          url: data.url,
          fallbackUrl: data.fallbackUrl,
          category: uploadCategory,
          size: data.size || Math.round((base64Data.length * 3) / 4)
        }, ...prev]);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi upload ảnh.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || 'Lỗi kết nối khi gửi ảnh.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndUploadImage(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>, item: MediaItem) => {
    const imgEl = e.currentTarget;
    if (item.fallbackUrl && !imgEl.dataset.triedFallback) {
      imgEl.dataset.triedFallback = '1';
      imgEl.src = item.fallbackUrl;
      return;
    }
    imgEl.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
  };

  const filteredList = mediaList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3A251B', margin: '0 0 4px 0' }}>
            {isCertificatesRoute ? 'Quản lý Chứng nhận & Kiểm định' : 'Thư viện Hình ảnh & Media'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6E6259', margin: 0 }}>
            {isCertificatesRoute
              ? 'Hồ sơ và bản quét các chứng chỉ quốc tế (BRCGS, FDA, ISO 22000, HACCP, Kosher, SMETA) phục vụ trang Chất lượng và hồ sơ năng lực xuất khẩu.'
              : 'Quản lý và upload hình ảnh cho bài viết tin tức, sản phẩm và chứng nhận'}
          </p>
        </div>

        <button
          onClick={fetchMedia}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EADCCE',
            color: '#3A251B',
            padding: '8px 14px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Alert banner */}
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

      {/* Upload Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '2px dashed #E28D1B',
          padding: '28px 20px',
          textAlign: 'center',
          marginBottom: '28px',
          boxShadow: '0 2px 8px rgba(58, 37, 27, 0.04)'
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 168, 58, 0.15)',
          color: '#E28D1B',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <Upload size={28} />
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 6px 0' }}>
          Kéo thả hình ảnh vào đây hoặc nhấp để chọn file
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#6E6259', margin: '0 0 16px 0' }}>
          Hỗ trợ JPG, PNG, WebP. Tự động tối ưu hoá kích thước & nén WebP trước khi lưu vào Git repo.
        </p>

        {/* Upload Category Selector */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', background: '#FFF9F2', padding: '6px 14px', borderRadius: '8px', border: '1px solid #F0E5D8' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3A251B' }}>Phân loại lưu trữ:</span>
          {(['news', 'products', 'certificates'] as const).map(cat => (
            <label key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#55473E', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="uploadCategory" 
                value={cat} 
                checked={uploadCategory === cat}
                onChange={() => setUploadCategory(cat)}
              />
              {cat === 'news' ? 'Tin tức' : cat === 'products' ? 'Sản phẩm' : 'Chứng nhận'}
            </label>
          ))}
        </div>

        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileInputChange} 
            accept="image/png,image/jpeg,image/webp" 
            style={{ display: 'none' }} 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              backgroundColor: '#F4A83A',
              color: '#3A251B',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: uploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
            }}
          >
            {uploading ? 'Đang nén & tải lên...' : 'Chọn file từ máy tính'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C7E74' }} />
          <input
            type="text"
            placeholder="Tìm theo tên file hoặc đường dẫn..."
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

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={15} color="#8C7E74" />
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'news', label: 'Tin tức' },
            { id: 'products', label: 'Sản phẩm' },
            { id: 'certificates', label: 'Chứng nhận' }
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

      {/* Media Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {filteredList.map((item) => (
          <div
            key={item.url}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #EADCCE',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 4px rgba(58, 37, 27, 0.04)'
            }}
          >
            {/* Thumbnail */}
            <div 
              onClick={() => setPreviewItem(item)}
              style={{
                height: '140px',
                backgroundColor: '#FAF5EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img
                src={item.url}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => handleImgError(e, item)}
              />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: 'rgba(58, 37, 27, 0.75)',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {item.category}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div 
                title={item.name} 
                style={{ 
                  fontSize: '0.82rem', 
                  fontWeight: 600, 
                  color: '#3A251B', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  marginBottom: '4px'
                }}
              >
                {item.name}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#8C7E74', marginBottom: '10px' }}>
                {formatSize(item.size)}
              </div>

              {/* Referencing badge if used on website */}
              {(() => {
                const refs = getReferencingItems(item.url);
                if (refs.length > 0) {
                  return (
                    <div 
                      title={`Đang dùng trong: ${refs.join(', ')}`}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        fontSize: '0.7rem', 
                        color: '#065F46', 
                        backgroundColor: '#ECFDF5', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        marginBottom: '8px',
                        fontWeight: 600
                      }}
                    >
                      <BookmarkCheck size={11} />
                      <span>Đang dùng trên web ({refs.length})</span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Action buttons */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url)}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    backgroundColor: copiedUrl === item.url ? '#ECFDF5' : '#FFF9F2',
                    border: `1px solid ${copiedUrl === item.url ? '#10B981' : '#EADCCE'}`,
                    color: copiedUrl === item.url ? '#065F46' : '#3A251B',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {copiedUrl === item.url ? (
                    <>
                      <Check size={13} color="#10B981" />
                      <span>Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(item);
                    setCropAspectRatio('free');
                    setCropRotation(0);
                  }}
                  title="Cắt / Xoay / Đổi tỷ lệ ảnh"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EADCCE',
                    color: '#3A251B',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Crop size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewItem(item)}
                  title="Xem kích thước lớn"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EADCCE',
                    color: '#6E6259',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADCCE', margin: '20px 0' }}>
          {selectedCategory === 'certificates' ? (
            <>
              <ShieldCheck size={48} color="#D97706" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 8px 0' }}>
                Chưa có bản quét chứng nhận nào trong danh mục này
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6E6259', maxWidth: '460px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Bạn có thể tải lên bản quét chứng chỉ xuất khẩu (BRCGS, FDA, ISO, HACCP, Halal...) định dạng JPG, PNG hoặc WebP tại khung upload phía trên.
              </p>
              <button
                type="button"
                onClick={() => {
                  setUploadCategory('certificates');
                  fileInputRef.current?.click();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F4A83A',
                  color: '#3A251B',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <Upload size={16} />
                <span>Tải lên chứng nhận mới</span>
              </button>
            </>
          ) : (
            <>
              <ImageIcon size={40} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6E6259' }}>Không tìm thấy hình ảnh phù hợp với tiêu chí lọc.</p>
            </>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div 
          onClick={() => setPreviewItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 10, 5, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EADCCE' }}>
              <div style={{ fontWeight: 700, color: '#3A251B', fontSize: '0.95rem' }}>{previewItem.name}</div>
              <button onClick={() => setPreviewItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E6259' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#FAF5EE', maxHeight: '70vh', overflowY: 'auto' }}>
              <img 
                src={previewItem.url} 
                alt={previewItem.name} 
                onError={(e) => handleImgError(e, previewItem)}
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '6px' }} 
              />
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFDF9', borderTop: '1px solid #EADCCE' }}>
              <span style={{ fontSize: '0.82rem', color: '#6E6259' }}>Đường dẫn: <code>{previewItem.url}</code></span>
              <button
                onClick={() => handleCopyUrl(previewItem.url)}
                style={{
                  backgroundColor: '#F4A83A',
                  color: '#3A251B',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Copy đường dẫn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop & Image Editor Modal */}
      {editingItem && (
        <div 
          onClick={() => setEditingItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 10, 5, 0.8)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '840px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EADCCE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scissors size={18} color="#F4A83A" />
                <span style={{ fontWeight: 700, color: '#3A251B', fontSize: '1rem' }}>
                  Cắt, xoay & tối ưu ảnh WebP: {editingItem.name}
                </span>
              </div>
              <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E6259' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Controls bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', backgroundColor: '#FAF7F2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #EADCCE' }}>
                {/* Aspect ratio */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3A251B' }}>Tỷ lệ:</span>
                  {(['free', '1:1', '4:3', '16:9'] as const).map(ratio => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setCropAspectRatio(ratio)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: cropAspectRatio === ratio ? 700 : 500,
                        backgroundColor: cropAspectRatio === ratio ? '#3A251B' : '#FFFFFF',
                        color: cropAspectRatio === ratio ? '#FFFFFF' : '#6E6259',
                        border: `1px solid ${cropAspectRatio === ratio ? '#3A251B' : '#D1C7BD'}`,
                        cursor: 'pointer'
                      }}
                    >
                      {ratio === 'free' ? 'Tự do' : ratio}
                    </button>
                  ))}
                </div>

                {/* Rotate */}
                <button
                  type="button"
                  onClick={() => setCropRotation(r => (r + 90) % 360)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1C7BD',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#3A251B'
                  }}
                >
                  <RotateCw size={14} />
                  <span>Xoay 90° ({cropRotation}°)</span>
                </button>

                {/* Max Dim */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3A251B' }}>Kích thước:</span>
                  <select
                    value={cropMaxDim}
                    onChange={(e) => setCropMaxDim(Number(e.target.value))}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #D1C7BD',
                      fontSize: '0.8rem',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value={1920}>1920px (Full HD)</option>
                    <option value={1200}>1200px (Banner tiêu chuẩn)</option>
                    <option value={800}>800px (Sản phẩm / Bài viết)</option>
                  </select>
                </div>
              </div>

              {/* Visual preview */}
              <div style={{ textAlign: 'center', backgroundColor: '#F5EFE6', borderRadius: '8px', padding: '16px', maxHeight: '50vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={editingItem.url} 
                  alt={editingItem.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '45vh',
                    objectFit: 'contain',
                    transform: `rotate(${cropRotation}deg)`,
                    transition: 'transform 0.2s ease',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', color: '#6E6259', textAlign: 'center' }}>
                ⚡ Ảnh sẽ được cắt theo khung <strong>{cropAspectRatio === 'free' ? 'Gốc' : cropAspectRatio}</strong>, nén WebP dưới 500KB và tự động commit trực tiếp vào Git repository.
              </div>
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#FFFDF9', borderTop: '1px solid #EADCCE' }}>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D1C7BD',
                  backgroundColor: '#FFFFFF',
                  color: '#6E6259',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isProcessingEdit}
                onClick={handleApplyCropAndSave}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#F4A83A',
                  color: '#3A251B',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: isProcessingEdit ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessingEdit ? 'Đang nén & lưu Git...' : 'Lưu ảnh WebP mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
