import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';

interface MediaItem {
  name: string;
  url: string;
  size?: number;
  category: string;
}

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'news' | 'products' | 'certificates'>('news');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback initial list if API isn't populated
  const defaultMedia: MediaItem[] = [
    { name: 'soft-dried-mango.webp', url: '/images/products/soft-dried-mango.webp', category: 'products', size: 145000 },
    { name: 'jackfruit-chips.webp', url: '/images/products/jackfruit-chips.webp', category: 'products', size: 162000 },
    { name: 'cashew.webp', url: '/images/products/cashew.webp', category: 'products', size: 138000 },
    { name: 'lotus-seeds.webp', url: '/images/products/lotus-seeds.webp', category: 'products', size: 154000 },
    { name: 'macadamia-nuts.webp', url: '/images/products/macadamia-nuts.webp', category: 'products', size: 149000 },
    { name: 'banana-chips.webp', url: '/images/products/banana-chips.webp', category: 'products', size: 141000 },
    { name: 'cover-vtv1.webp', url: '/images/news/cover-vtv1.webp', category: 'news', size: 198000 },
    { name: 'cover-tuoitre.webp', url: '/images/news/cover-tuoitre.webp', category: 'news', size: 212000 },
    { name: 'cover-vnexpress.webp', url: '/images/news/cover-vnexpress.webp', category: 'news', size: 184000 }
  ];

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        if (data.media && data.media.length > 0) {
          setMediaList(data.media);
        } else {
          setMediaList(defaultMedia);
        }
      } else {
        setMediaList(defaultMedia);
      }
    } catch {
      setMediaList(defaultMedia);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Copy URL with clipboard API & visual feedback
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      // Fallback
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  // Client-side image resize via HTML5 Canvas before uploading
  const processAndUploadImage = async (file: File) => {
    try {
      setUploading(true);
      setStatusMsg(null);

      // Verify file type
      if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
        setStatusMsg({ type: 'error', text: 'Chỉ chấp nhận file hình ảnh định dạng JPG, PNG hoặc WebP.' });
        setUploading(false);
        return;
      }

      // Read file and downscale if max dimension > 1920px
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1920;
            const MAX_HEIGHT = 1920;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Output WebP with 0.85 quality for optimal compression
              const dataUrl = canvas.toDataURL('image/webp', 0.85);
              resolve(dataUrl);
            } else {
              resolve(e.target?.result as string);
            }
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Send to /api/admin/media
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          base64Data,
          category: uploadCategory
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Upload ảnh thành công: ${data.url}` });
        setMediaList(prev => [{
          name: file.name,
          url: data.url,
          category: uploadCategory,
          size: Math.round((base64Data.length * 3) / 4)
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

  // Filtered media
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
            Thư viện Hình ảnh & Media
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6E6259', margin: 0 }}>
            Quản lý và upload hình ảnh cho bài viết tin tức, sản phẩm và chứng nhận
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
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
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
        {filteredList.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #EADCCE',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 4px rgba(58, 37, 27, 0.04)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                }}
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
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#8C7E74' }}>
          <ImageIcon size={40} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Không tìm thấy hình ảnh phù hợp với tiêu chí lọc.</p>
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
    </div>
  );
};

export default AdminMedia;
