import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { adminFetch } from '../lib/adminFetch';

export interface MediaPickerItem {
  name: string;
  url: string;
  fallbackUrl?: string;
  size?: number;
  category: string;
}

export interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, item?: MediaPickerItem) => void;
  currentValue?: string;
  initialCategory?: 'all' | 'homepage' | 'about' | 'news' | 'products' | 'certificates' | 'banners';
  title?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentValue = '',
  initialCategory = 'all',
  title = 'Chọn hình ảnh'
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaList, setMediaList] = useState<MediaPickerItem[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>(currentValue);
  const [customUrl, setCustomUrl] = useState<string>(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentValue);
      setCustomUrl(currentValue);
      setSelectedCategory(initialCategory);
      setErrorMsg(null);
      loadMedia();
    }
  }, [isOpen, currentValue, initialCategory]);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await adminFetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.media)) {
          setMediaList(data.media);
        }
      } else {
        setErrorMsg('Không thể tải danh sách hình ảnh từ máy chủ.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối khi tải thư viện hình ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setErrorMsg('Chỉ hỗ trợ file ảnh định dạng WebP, PNG hoặc JPG.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh vượt quá 3MB. Vui lòng nén ảnh trước khi tải lên.');
      return;
    }

    try {
      setUploadProgress('Đang xử lý và tải ảnh lên...');
      setErrorMsg(null);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const targetCat = selectedCategory === 'all' ? 'products' : selectedCategory;

          const res = await adminFetch('/api/admin/media', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              base64Data,
              category: targetCat
            })
          });

          const data = await res.json();
          if (res.ok && data.ok) {
            setUploadProgress(null);
            const uploadedItem: MediaPickerItem = {
              name: file.name,
              url: data.url,
              fallbackUrl: data.fallbackUrl,
              size: file.size,
              category: targetCat
            };
            setMediaList(prev => [uploadedItem, ...prev]);
            setSelectedUrl(data.url);
            setActiveTab('gallery');
          } else {
            setErrorMsg(data.error || 'Tải ảnh lên thất bại.');
            setUploadProgress(null);
          }
        } catch {
          setErrorMsg('Lỗi mạng khi tải ảnh lên.');
          setUploadProgress(null);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('Không thể đọc file ảnh.');
      setUploadProgress(null);
    }
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleConfirmSelect = () => {
    if (activeTab === 'url') {
      if (customUrl.trim()) {
        onSelect(customUrl.trim());
        onClose();
      }
    } else {
      if (selectedUrl) {
        const item = mediaList.find(m => m.url === selectedUrl);
        onSelect(selectedUrl, item);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
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
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #EADCCE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAF6F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={20} color="#D97706" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6E6259' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #EADCCE',
          backgroundColor: '#FFFFFF',
          padding: '0 20px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'gallery' ? '2px solid #F4A83A' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'gallery' ? '#3A251B' : '#8C827A',
              fontWeight: activeTab === 'gallery' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Thư viện hình ảnh ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'upload' ? '2px solid #F4A83A' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'upload' ? '#3A251B' : '#8C827A',
              fontWeight: activeTab === 'upload' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Tải ảnh mới lên
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === 'url' ? '2px solid #F4A83A' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'url' ? '#3A251B' : '#8C827A',
              fontWeight: activeTab === 'url' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Nhập đường dẫn URL
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              {/* Filter & Search Bar */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C827A' }} />
                  <input
                    type="text"
                    placeholder="Tìm tên ảnh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '6px',
                      border: '1px solid #EADCCE',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'homepage', label: 'Trang chủ' },
                    { id: 'about', label: 'Về chúng tôi / Nhà máy' },
                    { id: 'products', label: 'Sản phẩm' },
                    { id: 'news', label: 'Tin tức' },
                    { id: 'certificates', label: 'Chứng nhận' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #EADCCE',
                        backgroundColor: selectedCategory === cat.id ? '#F4A83A' : '#FFFFFF',
                        color: selectedCategory === cat.id ? '#3A251B' : '#6E6259',
                        fontSize: '0.82rem',
                        fontWeight: selectedCategory === cat.id ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={loadMedia}
                    title="Làm mới thư viện"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #EADCCE',
                      backgroundColor: '#FFFFFF',
                      color: '#6E6259',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
                  </button>
                </div>
              </div>

              {/* Grid of Images */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8C827A' }}>
                  Đang tải danh sách ảnh...
                </div>
              ) : filteredMedia.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8C827A', border: '1px dashed #EADCCE', borderRadius: '8px' }}>
                  Không tìm thấy hình ảnh nào phù hợp.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {filteredMedia.map((m, idx) => {
                    const isSelected = selectedUrl === m.url || (selectedUrl && selectedUrl.endsWith(m.name));
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedUrl(m.url)}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: isSelected ? '3px solid #F4A83A' : '1px solid #EADCCE',
                          cursor: 'pointer',
                          backgroundColor: '#FAF6F0'
                        }}
                      >
                        <img
                          src={m.url}
                          alt={m.name}
                          loading="lazy"
                          onError={(e) => {
                            if (m.fallbackUrl && (e.target as HTMLImageElement).src !== m.fallbackUrl) {
                              (e.target as HTMLImageElement).src = m.fallbackUrl;
                            }
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            backgroundColor: '#F4A83A',
                            color: '#3A251B',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '4px 6px',
                          backgroundColor: 'rgba(58, 37, 27, 0.75)',
                          color: '#FFFFFF',
                          fontSize: '0.68rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {m.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'upload' && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{
                border: '2px dashed #EADCCE',
                borderRadius: '12px',
                padding: '40px 20px',
                backgroundColor: '#FAF6F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                  Kéo thả ảnh vào đây hoặc bấm để chọn tệp
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#8C827A', margin: 0, maxWidth: '400px' }}>
                  Hỗ trợ định dạng WebP, PNG, JPG (tối đa 3MB). Ảnh sẽ tự động được tối ưu và lưu vào thư mục danh mục được chọn.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#6E6259' }}>Phân loại vào:</span>
                  <select
                    value={selectedCategory === 'all' ? 'products' : selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #EADCCE',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="about">Về chúng tôi / Nhà máy (about)</option>
                    <option value="products">Sản phẩm (products)</option>
                    <option value="news">Tin tức & Báo chí (news)</option>
                    <option value="certificates">Chứng nhận & Kiểm định (certificates)</option>
                  </select>
                </div>

                <label style={{
                  marginTop: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#F4A83A',
                  color: '#3A251B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
                }}>
                  <Upload size={16} />
                  <span>Chọn tệp ảnh từ máy tính</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {uploadProgress && (
                  <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#D97706', fontWeight: 600 }}>
                    {uploadProgress}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === 'url' && (
            <div style={{ padding: '20px 0' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#3A251B', marginBottom: '8px' }}>
                Đường dẫn hình ảnh (URL tương đối hoặc tuyệt đối)
              </label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C827A' }} />
                <input
                  type="text"
                  placeholder="VD: /images/products/soft-dried-red-dragonfruit.webp"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setSelectedUrl(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #EADCCE',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {customUrl && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.82rem', color: '#8C827A', marginBottom: '8px' }}>
                    Xem trước hình ảnh từ đường dẫn:
                  </div>
                  <div style={{
                    display: 'inline-block',
                    maxWidth: '220px',
                    maxHeight: '220px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #EADCCE',
                    backgroundColor: '#FAF6F0'
                  }}>
                    <img
                      src={customUrl}
                      alt="Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = 'Không thể tải ảnh từ URL này';
                      }}
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #EADCCE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAF6F0'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#6E6259', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedUrl ? `Đã chọn: ${selectedUrl}` : 'Chưa chọn hình ảnh nào'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #EADCCE',
                backgroundColor: '#FFFFFF',
                color: '#6E6259',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmSelect}
              disabled={!selectedUrl && !customUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: (selectedUrl || customUrl) ? '#F4A83A' : '#EADCCE',
                color: '#3A251B',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: (selectedUrl || customUrl) ? 'pointer' : 'not-allowed',
                boxShadow: (selectedUrl || customUrl) ? '0 2px 6px rgba(244, 168, 58, 0.3)' : 'none'
              }}
            >
              <Check size={16} />
              <span>Xác nhận chọn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
