import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Info,
  Languages,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { adminFetch } from '../lib/adminFetch';
import { MediaPicker } from '../components/MediaPicker';
import {
  ABOUT_CONTENT,
  ABOUT_GALLERY_CATEGORIES,
  AboutGalleryCategory,
  AboutGalleryItem,
  AboutPageContent,
  GALLERY_CATEGORY_LABELS,
  LocalizedText,
  getMissingLocales,
  pickLocalized,
} from '../../data/aboutContent';
import {
  EMPTY_LOCALIZED_TEXT,
  mergeAboutContent,
  validateAboutContent,
} from '../../shared/schemas/aboutSchema';
import { Language } from '../../i18n/LanguageContext';

type AdminTab = 'intro' | 'gallery' | 'facility' | 'metrics' | 'preview';
type LocaleKey = keyof LocalizedText;
type PublishState = 'idle' | 'publishing' | 'queued' | 'building' | 'ready' | 'error';

const LOCALE_TABS: Array<{ key: LocaleKey; label: string; langCode: Language }> = [
  { key: 'vi', label: 'Tiếng Việt (VI)', langCode: 'vi' },
  { key: 'en', label: 'English (EN)', langCode: 'en' },
  { key: 'ko', label: '한국어 (KO)', langCode: 'ko' },
  { key: 'zh', label: '简体中文 (ZH-CN)', langCode: 'zh-CN' },
];

function createNewGalleryItem(nextOrder: number): AboutGalleryItem {
  return {
    id: `gallery-${Date.now()}`,
    image: '/assets/images/factory-2026/factory-featured.webp',
    imageFallback: '/assets/images/factory-2026/factory-featured.jpg',
    category: 'factory',
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    alt: { ...EMPTY_LOCALIZED_TEXT },
    sortOrder: nextOrder,
    visible: true,
  };
}

interface LocalizedInputFieldProps {
  label: string;
  value: LocalizedText;
  activeLocale: LocaleKey;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  onChange: (next: LocalizedText) => void;
}

const LocalizedInputField: React.FC<LocalizedInputFieldProps> = ({
  label,
  value,
  activeLocale,
  multiline = false,
  rows = 2,
  placeholder = '',
  onChange,
}) => {
  const missing = getMissingLocales(value);
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3A251B' }}>
          {label} ({activeLocale.toUpperCase()})
        </label>
        {missing.length > 0 && (
          <span style={{ fontSize: '0.72rem', color: '#B45309', backgroundColor: '#FEF3C7', padding: '1px 7px', borderRadius: '999px' }}>
            Chưa dịch: {missing.map((m) => m.toUpperCase()).join(', ')}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          rows={rows}
          value={value[activeLocale] || ''}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...value, [activeLocale]: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #D1C7BD',
            fontSize: '0.86rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <input
          type="text"
          value={value[activeLocale] || ''}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...value, [activeLocale]: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #D1C7BD',
            fontSize: '0.86rem',
            boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  );
};

export const AdminAbout: React.FC = () => {
  const [content, setContent] = useState<AboutPageContent>(ABOUT_CONTENT);
  const [aboutSha, setAboutSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [activeLocale, setActiveLocale] = useState<LocaleKey>('vi');
  const [previewLang, setPreviewLang] = useState<Language>('vi');

  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(
    ABOUT_CONTENT.gallery[0]?.id || null
  );
  const [mediaTarget, setMediaTarget] = useState<
    | null
    | { type: 'highlight' }
    | { type: 'infrastructure' }
    | { type: 'gallery'; id: string }
  >(null);
  const [previewLightboxId, setPreviewLightboxId] = useState<string | null>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>('idle');
  const [deployCommitSha, setDeployCommitSha] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      const res = await adminFetch('/api/admin/settings?section=about');
      if (res.ok) {
        const payload = await res.json();
        if (payload.sha) setAboutSha(payload.sha);
        if (payload.data && typeof payload.data === 'object' && Object.keys(payload.data).length > 0) {
          const merged = mergeAboutContent(ABOUT_CONTENT, payload.data);
          setContent(merged);
          setSelectedGalleryId((prev) =>
            prev && merged.gallery.some((g) => g.id === prev) ? prev : merged.gallery[0]?.id || null
          );
        }
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Không thể tải cấu hình trang Về chúng tôi từ máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
  }, []);

  // Live poll Vercel / GitHub deployment status after scoped publish
  useEffect(() => {
    if (!deployCommitSha || (publishState !== 'queued' && publishState !== 'building')) {
      return undefined;
    }

    if (deployCommitSha === 'local-commit-sha') {
      return undefined;
    }

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await adminFetch(`/api/admin/deployStatus?commitSha=${encodeURIComponent(deployCommitSha)}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const state = data?.status?.state;
        if (state === 'success') {
          setPublishState('ready');
          setHasUnpublishedChanges(false);
          setStatusMsg({
            type: 'success',
            text: `Vercel đã triển khai xong trang Về chúng tôi lên website vinaxo.net (${deployCommitSha.slice(0, 7)}).`,
          });
        } else if (state === 'failure') {
          setPublishState('error');
          setStatusMsg({
            type: 'error',
            text: data?.status?.description || 'Quá trình build/triển khai Vercel thất bại. Vui lòng kiểm tra log.',
          });
        } else if (state === 'pending' || state === 'queued') {
          setPublishState('building');
        }
      } catch {
        // Keep polling on transient network error
      }
    };

    const timer = window.setInterval(poll, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [deployCommitSha, publishState]);

  const updateContent = (updater: (prev: AboutPageContent) => AboutPageContent) => {
    setContent((prev) => updater(prev));
    setIsDirty(true);
    setStatusMsg(null);
  };

  const selectedGalleryItem = useMemo(
    () => content.gallery.find((item) => item.id === selectedGalleryId) || null,
    [content.gallery, selectedGalleryId]
  );

  const handleSave = async (): Promise<boolean> => {
    const check = validateAboutContent(content, content);
    if (!check.valid) {
      setStatusMsg({ type: 'error', text: check.errors.join(' | ') });
      return false;
    }

    try {
      setIsSaving(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/settings?section=about', {
        method: 'POST',
        body: JSON.stringify({ ...check.data, sha: aboutSha }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.data) setContent(data.data);
        if (data.result?.sha) setAboutSha(data.result.sha);
        setIsDirty(false);
        setHasUnpublishedChanges(true);
        setStatusMsg({
          type: 'success',
          text: 'Đã lưu thay đổi trang Về chúng tôi vào kho nội dung. Bấm "Cập nhật trang Về chúng tôi lên website" để xuất bản.',
        });
        return true;
      }
      setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi lưu dữ liệu trang Về chúng tôi.' });
      return false;
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi lưu trang Về chúng tôi.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishAbout = async () => {
    if (isDirty) {
      const savedOk = await handleSave();
      if (!savedOk) return;
    }

    if (!window.confirm('Xuất bản riêng nội dung & thư viện ảnh trang Về chúng tôi lên vinaxo.net? Các phân hệ khác (Sản phẩm, Tin tức) sẽ không bị xuất bản nhầm.')) {
      return;
    }

    try {
      setPublishState('publishing');
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'about' }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const sha = data.commitSha || null;
        setDeployCommitSha(sha);
        if (!sha || sha === 'local-commit-sha') {
          setPublishState('queued');
          setStatusMsg({
            type: 'info',
            text: 'Đã ghi nhận yêu cầu xuất bản nhóm [Trang Về chúng tôi] trong môi trường local (chưa kết nối GitHub/Vercel production).',
          });
        } else {
          setPublishState('queued');
          setStatusMsg({
            type: 'info',
            text: `Đã tạo commit [${sha.slice(0, 7)}] cho nhóm [Trang Về chúng tôi]. Đang theo dõi trạng thái build & triển khai trên Vercel...`,
          });
        }
      } else {
        setPublishState('error');
        setStatusMsg({ type: 'error', text: data.error || 'Không thể kích hoạt cập nhật trang Về chúng tôi.' });
      }
    } catch {
      setPublishState('error');
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi yêu cầu cập nhật trang Về chúng tôi.' });
    }
  };

  const handleUpdateGalleryItem = (id: string, patch: Partial<AboutGalleryItem>) => {
    updateContent((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const handleMoveGalleryItem = (id: string, dir: 'up' | 'down') => {
    updateContent((prev) => {
      const idx = prev.gallery.findIndex((g) => g.id === id);
      if (idx === -1) return prev;
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.gallery.length - 1) return prev;
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      const next = [...prev.gallery];
      const temp = next[idx];
      next[idx] = next[swapIdx];
      next[swapIdx] = temp;
      return {
        ...prev,
        gallery: next.map((item, i) => ({ ...item, sortOrder: i + 1 })),
      };
    });
  };

  const handleAddGalleryItem = () => {
    const newItem = createNewGalleryItem(content.gallery.length + 1);
    updateContent((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newItem],
    }));
    setSelectedGalleryId(newItem.id);
  };

  const handleDeleteGalleryItem = (id: string) => {
    const target = content.gallery.find((g) => g.id === id);
    if (!target) return;
    if (!window.confirm(`Xóa bản ghi hình ảnh "${target.title.vi || target.id}" khỏi thư viện Về chúng tôi?`)) {
      return;
    }
    updateContent((prev) => {
      const next = prev.gallery
        .filter((g) => g.id !== id)
        .map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
      return { ...prev, gallery: next };
    });
    if (selectedGalleryId === id) {
      const remaining = content.gallery.filter((g) => g.id !== id);
      setSelectedGalleryId(remaining[0]?.id || null);
    }
  };

  const renderPublishStatusBadge = () => {
    if (publishState === 'ready') {
      return (
        <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
          Website đã cập nhật
        </span>
      );
    }
    if (publishState === 'queued' || publishState === 'building' || publishState === 'publishing') {
      return (
        <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
          Đang triển khai lên website...
        </span>
      );
    }
    if (publishState === 'error') {
      return (
        <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
          Triển khai lỗi
        </span>
      );
    }
    if (isDirty) {
      return (
        <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>
          Có thay đổi chưa lưu
        </span>
      );
    }
    if (hasUnpublishedChanges) {
      return (
        <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
          Đã lưu — Chưa cập nhật lên website
        </span>
      );
    }
    return null;
  };

  const previewModalItem = previewLightboxId
    ? content.gallery.find((g) => g.id === previewLightboxId) || null
    : null;

  return (
    <div style={{ maxWidth: '1220px', margin: '0 auto' }}>
      {/* Page Header & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3A251B', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Info size={24} color="#0D9488" />
              <span>Quản lý Trang Về chúng tôi (/about)</span>
            </h1>
            {renderPublishStatusBadge()}
          </div>
          <p style={{ fontSize: '0.86rem', color: '#6E6259', margin: '4px 0 0 0' }}>
            Biên tập nội dung doanh nghiệp, vùng nguyên liệu, chỉ số, lịch sử và thư viện hình ảnh thực tế 4 ngôn ngữ (VI / EN / KO / ZH-CN).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={loadAboutData}
            disabled={loading || isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #D1C7BD',
              backgroundColor: '#FFFFFF',
              color: '#3A251B',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
            <span>Tải lại</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F4A83A',
              color: '#3A251B',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublishAbout}
            disabled={isSaving || publishState === 'publishing'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #059669',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: publishState === 'publishing' ? 'not-allowed' : 'pointer',
            }}
          >
            <Sparkles size={16} />
            <span>
              {publishState === 'publishing'
                ? 'Đang gửi xuất bản...'
                : 'Cập nhật trang Về chúng tôi lên website'}
            </span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusMsg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            backgroundColor:
              statusMsg.type === 'success'
                ? '#ECFDF5'
                : statusMsg.type === 'info'
                  ? '#EFF6FF'
                  : '#FEF2F2',
            color:
              statusMsg.type === 'success'
                ? '#065F46'
                : statusMsg.type === 'info'
                  ? '#1E40AF'
                  : '#991B1B',
            border: `1px solid ${
              statusMsg.type === 'success'
                ? '#A7F3D0'
                : statusMsg.type === 'info'
                  ? '#BFDBFE'
                  : '#FECACA'
            }`,
          }}
        >
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Editor Tabs & Locale Selector */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EADFCC',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'gallery' as AdminTab, label: `Thư viện hình ảnh (${content.gallery.length})` },
            { id: 'intro' as AdminTab, label: 'Giới thiệu & Ảnh nổi bật' },
            { id: 'facility' as AdminTab, label: 'Nhà máy & Vùng nguyên liệu' },
            { id: 'metrics' as AdminTab, label: 'Chỉ số & Lịch sử' },
            { id: 'preview' as AdminTab, label: 'Xem trước' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: activeTab === tab.id ? '1px solid #3A251B' : '1px solid #EADCCE',
                backgroundColor: activeTab === tab.id ? '#3A251B' : '#FAF7F2',
                color: activeTab === tab.id ? '#FFFFFF' : '#3A251B',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'preview' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Languages size={16} color="#6E6259" />
            {LOCALE_TABS.map((loc) => (
              <button
                key={loc.key}
                type="button"
                onClick={() => setActiveLocale(loc.key)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #EADCCE',
                  backgroundColor: activeLocale === loc.key ? '#F4A83A' : '#FFFFFF',
                  color: '#3A251B',
                  fontSize: '0.78rem',
                  fontWeight: activeLocale === loc.key ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB: GALLERY MANAGER */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.35fr)', gap: '20px', alignItems: 'start' }}>
          {/* Left: Gallery List + Reorder */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                Danh sách hình ảnh ({content.gallery.length})
              </h2>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>Thêm ảnh</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {content.gallery.map((item, idx) => {
                const isSelected = item.id === selectedGalleryId;
                const missingCount =
                  getMissingLocales(item.title).length +
                  getMissingLocales(item.label).length +
                  getMissingLocales(item.description).length;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedGalleryId(item.id)}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #F4A83A' : '1px solid #EADCCE',
                      backgroundColor: isSelected ? '#FFFBEB' : '#FFFFFF',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.imageFallback || item.image}
                      alt={item.alt.vi || item.title.vi}
                      style={{ width: '74px', height: '52px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, backgroundColor: '#F3ECE2' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                          #{item.sortOrder} • {item.label[activeLocale] || item.label.vi || 'Chưa có nhãn'}
                        </span>
                        {!item.visible && (
                          <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '999px', backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                            Đang ẩn
                          </span>
                        )}
                        {missingCount > 0 && (
                          <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '999px', backgroundColor: '#FEF3C7', color: '#92400E' }}>
                            Thiếu dịch ({missingCount})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#3A251B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title[activeLocale] || item.title.vi || item.id}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        title="Di chuyển lên"
                        disabled={idx === 0}
                        onClick={() => handleMoveGalleryItem(item.id, 'up')}
                        style={{ padding: '4px', border: '1px solid #EADCCE', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        title="Di chuyển xuống"
                        disabled={idx === content.gallery.length - 1}
                        onClick={() => handleMoveGalleryItem(item.id, 'down')}
                        style={{ padding: '4px', border: '1px solid #EADCCE', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: idx === content.gallery.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Gallery Item Editor */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
            {!selectedGalleryItem ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#6E6259' }}>
                Chọn một ảnh bên trái hoặc bấm "Thêm ảnh" để chỉnh sửa.
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #F0EAE1' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6E6259' }}>ID bản ghi: <code>{selectedGalleryItem.id}</code></div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '2px 0 0 0' }}>
                      {selectedGalleryItem.title[activeLocale] || selectedGalleryItem.title.vi || 'Chỉnh sửa ảnh'}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateGalleryItem(selectedGalleryItem.id, { visible: !selectedGalleryItem.visible })
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #D1C7BD',
                        backgroundColor: selectedGalleryItem.visible ? '#ECFDF5' : '#F3F4F6',
                        color: selectedGalleryItem.visible ? '#065F46' : '#4B5563',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {selectedGalleryItem.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{selectedGalleryItem.visible ? 'Đang hiển thị' : 'Đang ẩn'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewLightboxId(selectedGalleryItem.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #D1C7BD',
                        backgroundColor: '#FFFFFF',
                        color: '#3A251B',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={14} />
                      <span>Xem trước ảnh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(selectedGalleryItem.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #FECACA',
                        backgroundColor: '#FEF2F2',
                        color: '#B91C1C',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                {/* Image preview + MediaPicker trigger */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px', padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px' }}>
                  <img
                    src={selectedGalleryItem.imageFallback || selectedGalleryItem.image}
                    alt={selectedGalleryItem.alt.vi || selectedGalleryItem.title.vi}
                    style={{ width: '160px', height: '104px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE' }}
                  />
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.78rem', color: '#6E6259', marginBottom: '6px', wordBreak: 'break-all' }}>
                      <strong>Đường dẫn hiện tại:</strong> {selectedGalleryItem.image}
                    </div>
                    <button
                      type="button"
                      onClick={() => setMediaTarget({ type: 'gallery', id: selectedGalleryItem.id })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#3A251B',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <ImageIcon size={15} />
                      <span>Chọn / Tải ảnh thay thế từ Media Manager</span>
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#3A251B', marginBottom: '4px' }}>
                    Nhóm phân loại (Category)
                  </label>
                  <select
                    value={selectedGalleryItem.category}
                    onChange={(e) =>
                      handleUpdateGalleryItem(selectedGalleryItem.id, {
                        category: e.target.value as AboutGalleryCategory,
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1C7BD', fontSize: '0.86rem' }}
                  >
                    {ABOUT_GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {GALLERY_CATEGORY_LABELS[cat].vi} / {GALLERY_CATEGORY_LABELS[cat].en}
                      </option>
                    ))}
                  </select>
                </div>

                <LocalizedInputField
                  label="Nhãn hiển thị (Label)"
                  value={selectedGalleryItem.label}
                  activeLocale={activeLocale}
                  placeholder="VD: Chuẩn bị nguyên liệu"
                  onChange={(next) => handleUpdateGalleryItem(selectedGalleryItem.id, { label: next })}
                />

                <LocalizedInputField
                  label="Tiêu đề hình ảnh (Title)"
                  value={selectedGalleryItem.title}
                  activeLocale={activeLocale}
                  placeholder="VD: Xếp lát trái cây lên khay chuẩn bị sấy"
                  onChange={(next) => handleUpdateGalleryItem(selectedGalleryItem.id, { title: next })}
                />

                <LocalizedInputField
                  label="Mô tả chi tiết (Description)"
                  value={selectedGalleryItem.description}
                  activeLocale={activeLocale}
                  multiline
                  rows={3}
                  placeholder="Mô tả đúng công đoạn thể hiện trong ảnh..."
                  onChange={(next) => handleUpdateGalleryItem(selectedGalleryItem.id, { description: next })}
                />

                <LocalizedInputField
                  label="Văn bản thay thế SEO (Alt Text)"
                  value={selectedGalleryItem.alt}
                  activeLocale={activeLocale}
                  multiline
                  rows={2}
                  placeholder="Mô tả trung thực nội dung bức ảnh cho SEO và trình đọc màn hình..."
                  onChange={(next) => handleUpdateGalleryItem(selectedGalleryItem.id, { alt: next })}
                />
              </div>
            )}

            {/* Gallery Section Header editor */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EADFCC' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#3A251B', margin: '0 0 10px 0' }}>
                Tiêu đề mục Thư viện hình ảnh ({activeLocale.toUpperCase()})
              </h4>
              <LocalizedInputField
                label="Nhãn mục"
                value={content.gallerySection.label}
                activeLocale={activeLocale}
                onChange={(next) =>
                  updateContent((prev) => ({ ...prev, gallerySection: { ...prev.gallerySection, label: next } }))
                }
              />
              <LocalizedInputField
                label="Tiêu đề mục"
                value={content.gallerySection.title}
                activeLocale={activeLocale}
                onChange={(next) =>
                  updateContent((prev) => ({ ...prev, gallerySection: { ...prev.gallerySection, title: next } }))
                }
              />
              <LocalizedInputField
                label="Mô tả mục"
                value={content.gallerySection.desc}
                activeLocale={activeLocale}
                multiline
                onChange={(next) =>
                  updateContent((prev) => ({ ...prev, gallerySection: { ...prev.gallerySection, desc: next } }))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: INTRO & HIGHLIGHT VISUAL */}
      {activeTab === 'intro' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 14px 0' }}>
              Banner & Câu chuyện Doanh nghiệp ({activeLocale.toUpperCase()})
            </h2>
            <LocalizedInputField
              label="Hero Badge"
              value={content.hero.badge}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, hero: { ...p.hero, badge: next } }))}
            />
            <LocalizedInputField
              label="Tiêu đề trang"
              value={content.hero.title}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, hero: { ...p.hero, title: next } }))}
            />
            <LocalizedInputField
              label="Mô tả banner"
              value={content.hero.subtitle}
              activeLocale={activeLocale}
              multiline
              rows={3}
              onChange={(next) => updateContent((p) => ({ ...p, hero: { ...p.hero, subtitle: next } }))}
            />
            <LocalizedInputField
              label="Nhãn phần Giới thiệu"
              value={content.story.label}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, story: { ...p.story, label: next } }))}
            />
            <LocalizedInputField
              label="Tiêu đề dòng 1"
              value={content.story.titleLine1}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, story: { ...p.story, titleLine1: next } }))}
            />
            <LocalizedInputField
              label="Tiêu đề dòng 2 (nhấn mạnh)"
              value={content.story.titleLine2}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, story: { ...p.story, titleLine2: next } }))}
            />
            <LocalizedInputField
              label="Mô tả doanh nghiệp"
              value={content.story.description}
              activeLocale={activeLocale}
              multiline
              rows={4}
              onChange={(next) => updateContent((p) => ({ ...p, story: { ...p.story, description: next } }))}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
                Ảnh Nổi bật đầu trang (Highlight Visual Card)
              </h2>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                <img
                  src={content.highlightVisual.imageFallback || content.highlightVisual.image}
                  alt={content.highlightVisual.alt.vi}
                  style={{ width: '160px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#6E6259', marginBottom: '6px' }}>{content.highlightVisual.image}</div>
                  <button
                    type="button"
                    onClick={() => setMediaTarget({ type: 'highlight' })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#3A251B',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ImageIcon size={15} />
                    <span>Chọn / Thay ảnh nổi bật</span>
                  </button>
                </div>
              </div>
              <LocalizedInputField
                label="Nhãn góc trên overlay"
                value={content.highlightVisual.overlayTag}
                activeLocale={activeLocale}
                onChange={(next) => updateContent((p) => ({ ...p, highlightVisual: { ...p.highlightVisual, overlayTag: next } }))}
              />
              <LocalizedInputField
                label="Chữ lớn dòng 1"
                value={content.highlightVisual.overlayLine1}
                activeLocale={activeLocale}
                onChange={(next) => updateContent((p) => ({ ...p, highlightVisual: { ...p.highlightVisual, overlayLine1: next } }))}
              />
              <LocalizedInputField
                label="Chữ lớn dòng 2"
                value={content.highlightVisual.overlayLine2}
                activeLocale={activeLocale}
                onChange={(next) => updateContent((p) => ({ ...p, highlightVisual: { ...p.highlightVisual, overlayLine2: next } }))}
              />
              <LocalizedInputField
                label="Alt Text ảnh nổi bật"
                value={content.highlightVisual.alt}
                activeLocale={activeLocale}
                multiline
                onChange={(next) => updateContent((p) => ({ ...p, highlightVisual: { ...p.highlightVisual, alt: next } }))}
              />
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                  Tầm nhìn, Sứ mệnh & Giá trị cốt lõi
                </h2>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={content.visionMission.enabled}
                    onChange={(e) =>
                      updateContent((p) => ({ ...p, visionMission: { ...p.visionMission, enabled: e.target.checked } }))
                    }
                  />
                  <span>Hiển thị trên web</span>
                </label>
              </div>
              <LocalizedInputField
                label="Tầm nhìn (Nội dung)"
                value={content.visionMission.visionDesc}
                activeLocale={activeLocale}
                multiline
                placeholder="Chỉ điền nội dung khi doanh nghiệp đã phê duyệt chính thức..."
                onChange={(next) =>
                  updateContent((p) => ({ ...p, visionMission: { ...p.visionMission, visionDesc: next } }))
                }
              />
              <LocalizedInputField
                label="Sứ mệnh (Nội dung)"
                value={content.visionMission.missionDesc}
                activeLocale={activeLocale}
                multiline
                onChange={(next) =>
                  updateContent((p) => ({ ...p, visionMission: { ...p.visionMission, missionDesc: next } }))
                }
              />
              <LocalizedInputField
                label="Giá trị cốt lõi (Nội dung)"
                value={content.visionMission.coreValuesDesc}
                activeLocale={activeLocale}
                multiline
                onChange={(next) =>
                  updateContent((p) => ({ ...p, visionMission: { ...p.visionMission, coreValuesDesc: next } }))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: FACILITY & SOURCING */}
      {activeTab === 'facility' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              Cơ sở Hạ tầng & Năng lực Nhà máy ({activeLocale.toUpperCase()})
            </h2>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <img
                src={content.infrastructure.imageFallback || content.infrastructure.image}
                alt={content.infrastructure.imageAlt.vi}
                style={{ width: '150px', height: '98px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE' }}
              />
              <button
                type="button"
                onClick={() => setMediaTarget({ type: 'infrastructure' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#3A251B',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={15} />
                <span>Thay ảnh hạ tầng nhà máy</span>
              </button>
            </div>
            <LocalizedInputField
              label="Tiêu đề phần nhà máy"
              value={content.infrastructure.title}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, infrastructure: { ...p.infrastructure, title: next } }))}
            />
            <LocalizedInputField
              label="Mô tả phần nhà máy"
              value={content.infrastructure.desc}
              activeLocale={activeLocale}
              multiline
              onChange={(next) => updateContent((p) => ({ ...p, infrastructure: { ...p.infrastructure, desc: next } }))}
            />
            <LocalizedInputField
              label="Alt Text ảnh nhà máy"
              value={content.infrastructure.imageAlt}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, infrastructure: { ...p.infrastructure, imageAlt: next } }))}
            />
            {content.infrastructure.features.map((feat, idx) => (
              <div key={feat.id} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FAF7F2', marginBottom: '10px' }}>
                <LocalizedInputField
                  label={`Điểm mạnh #${idx + 1} - Tiêu đề`}
                  value={feat.title}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      infrastructure: {
                        ...p.infrastructure,
                        features: p.infrastructure.features.map((f) => (f.id === feat.id ? { ...f, title: next } : f)),
                      },
                    }))
                  }
                />
                <LocalizedInputField
                  label={`Điểm mạnh #${idx + 1} - Mô tả`}
                  value={feat.desc}
                  activeLocale={activeLocale}
                  multiline
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      infrastructure: {
                        ...p.infrastructure,
                        features: p.infrastructure.features.map((f) => (f.id === feat.id ? { ...f, desc: next } : f)),
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                Vùng nguyên liệu liên kết ĐBSCL ({activeLocale.toUpperCase()})
              </h2>
              <button
                type="button"
                onClick={() =>
                  updateContent((p) => ({
                    ...p,
                    sourcing: {
                      ...p.sourcing,
                      rows: [
                        ...p.sourcing.rows,
                        { id: `hub-${Date.now()}`, label: { ...EMPTY_LOCALIZED_TEXT }, value: { ...EMPTY_LOCALIZED_TEXT } },
                      ],
                    },
                  }))
                }
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <Plus size={14} />
                <span>Thêm vùng trồng</span>
              </button>
            </div>
            <LocalizedInputField
              label="Tiêu đề mục vùng nguyên liệu"
              value={content.sourcing.title}
              activeLocale={activeLocale}
              onChange={(next) => updateContent((p) => ({ ...p, sourcing: { ...p.sourcing, title: next } }))}
            />
            <LocalizedInputField
              label="Mô tả vùng nguyên liệu"
              value={content.sourcing.desc}
              activeLocale={activeLocale}
              multiline
              rows={3}
              onChange={(next) => updateContent((p) => ({ ...p, sourcing: { ...p.sourcing, desc: next } }))}
            />
            {content.sourcing.rows.map((row, idx) => (
              <div key={row.id} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FAF7F2', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#3A251B' }}>Vùng chuyên canh #{idx + 1}</strong>
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((p) => ({
                        ...p,
                        sourcing: { ...p.sourcing, rows: p.sourcing.rows.filter((r) => r.id !== row.id) },
                      }))
                    }
                    style={{ border: 'none', background: 'none', color: '#B91C1C', cursor: 'pointer', fontSize: '0.76rem' }}
                  >
                    Xóa
                  </button>
                </div>
                <LocalizedInputField
                  label="Tên vùng trồng"
                  value={row.label}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      sourcing: {
                        ...p.sourcing,
                        rows: p.sourcing.rows.map((r) => (r.id === row.id ? { ...r, label: next } : r)),
                      },
                    }))
                  }
                />
                <LocalizedInputField
                  label="Sản lượng / Đặc điểm nguyên liệu"
                  value={row.value}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      sourcing: {
                        ...p.sourcing,
                        rows: p.sourcing.rows.map((r) => (r.id === row.id ? { ...r, value: next } : r)),
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: METRICS & MILESTONES */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              4 Chỉ số Năng lực ({activeLocale.toUpperCase()})
            </h2>
            {content.metrics.map((metric, idx) => (
              <div key={metric.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FAF7F2', marginBottom: '12px' }}>
                <strong style={{ display: 'block', fontSize: '0.82rem', marginBottom: '8px', color: '#0D9488' }}>
                  Chỉ số #{idx + 1} ({metric.id})
                </strong>
                <LocalizedInputField
                  label="Giá trị (Số liệu)"
                  value={metric.num}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      metrics: p.metrics.map((m) => (m.id === metric.id ? { ...m, num: next } : m)),
                    }))
                  }
                />
                <LocalizedInputField
                  label="Nhãn chỉ số"
                  value={metric.label}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      metrics: p.metrics.map((m) => (m.id === metric.id ? { ...m, label: next } : m)),
                    }))
                  }
                />
                <LocalizedInputField
                  label="Ghi chú"
                  value={metric.note}
                  activeLocale={activeLocale}
                  multiline
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      metrics: p.metrics.map((m) => (m.id === metric.id ? { ...m, note: next } : m)),
                    }))
                  }
                />
                <LocalizedInputField
                  label="Nguồn xác thực"
                  value={metric.source}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      metrics: p.metrics.map((m) => (m.id === metric.id ? { ...m, source: next } : m)),
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              Các mốc Lịch sử Phát triển ({activeLocale.toUpperCase()})
            </h2>
            {content.milestones.map((ms, idx) => (
              <div key={ms.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FAF7F2', marginBottom: '12px' }}>
                <strong style={{ display: 'block', fontSize: '0.82rem', marginBottom: '8px', color: '#3A251B' }}>
                  Cột mốc #{idx + 1} ({ms.id})
                </strong>
                <LocalizedInputField
                  label="Mốc thời gian"
                  value={ms.badge}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      milestones: p.milestones.map((m) => (m.id === ms.id ? { ...m, badge: next } : m)),
                    }))
                  }
                />
                <LocalizedInputField
                  label="Tiêu đề cột mốc"
                  value={ms.title}
                  activeLocale={activeLocale}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      milestones: p.milestones.map((m) => (m.id === ms.id ? { ...m, title: next } : m)),
                    }))
                  }
                />
                <LocalizedInputField
                  label="Mô tả chi tiết"
                  value={ms.desc}
                  activeLocale={activeLocale}
                  multiline
                  rows={3}
                  onChange={(next) =>
                    updateContent((p) => ({
                      ...p,
                      milestones: p.milestones.map((m) => (m.id === ms.id ? { ...m, desc: next } : m)),
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EADFCC', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                Xem trước Giao diện Công khai (Live Draft Preview)
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6E6259', margin: '2px 0 0 0' }}>
                Kiểm tra đồng bộ ảnh, nhãn, tiêu đề và mô tả trước khi xuất bản lên vinaxo.net.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {LOCALE_TABS.map((loc) => (
                <button
                  key={loc.key}
                  type="button"
                  onClick={() => setPreviewLang(loc.langCode)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #EADCCE',
                    backgroundColor: previewLang === loc.langCode ? '#3A251B' : '#FFFFFF',
                    color: previewLang === loc.langCode ? '#FFFFFF' : '#3A251B',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '22px', padding: '14px', borderRadius: '10px', backgroundColor: '#FAF7F2', border: '1px solid #EADCCE' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#3A251B' }}>{pickLocalized(content.hero.title, previewLang)}</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#6E6259' }}>
              {pickLocalized(content.story.description, previewLang)}
            </p>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={content.highlightVisual.imageFallback || content.highlightVisual.image}
                alt={pickLocalized(content.highlightVisual.alt, previewLang)}
                style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                  {pickLocalized(content.highlightVisual.overlayTag, previewLang)}
                </div>
                <div style={{ fontWeight: 700, color: '#3A251B' }}>
                  {pickLocalized(content.highlightVisual.overlayLine1, previewLang)} {pickLocalized(content.highlightVisual.overlayLine2, previewLang)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6E6259', marginTop: '4px' }}>
                  Alt: {pickLocalized(content.highlightVisual.alt, previewLang)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {content.gallery
              .filter((g) => g.visible)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPreviewLightboxId(item.id)}
                  style={{ borderRadius: '10px', border: '1px solid #EADCCE', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                >
                  <img
                    src={item.imageFallback || item.image}
                    alt={pickLocalized(item.alt, previewLang)}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {pickLocalized(item.label, previewLang)}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                      {pickLocalized(item.title, previewLang)}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6E6259', lineHeight: 1.5 }}>
                      {pickLocalized(item.description, previewLang)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lightbox quick preview inside Admin */}
      {previewModalItem && (
        <div
          onClick={() => setPreviewLightboxId(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 12, 8, 0.8)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', maxWidth: '820px', width: '100%', overflow: 'hidden' }}
          >
            <div style={{ padding: '12px 16px', backgroundColor: '#FAF7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EADCCE' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>
                {pickLocalized(previewModalItem.label, previewLang)}
              </span>
              <button type="button" onClick={() => setPreviewLightboxId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ backgroundColor: '#1C120D', padding: '12px', textAlign: 'center' }}>
              <img
                src={previewModalItem.imageFallback || previewModalItem.image}
                alt={pickLocalized(previewModalItem.alt, previewLang)}
                style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3A251B' }}>{pickLocalized(previewModalItem.title, previewLang)}</h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#6E6259' }}>{pickLocalized(previewModalItem.description, previewLang)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Shared MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaTarget !== null}
        onClose={() => setMediaTarget(null)}
        initialCategory="about"
        currentValue={
          mediaTarget?.type === 'highlight'
            ? content.highlightVisual.image
            : mediaTarget?.type === 'infrastructure'
              ? content.infrastructure.image
              : mediaTarget?.type === 'gallery'
                ? content.gallery.find((g) => g.id === mediaTarget.id)?.image || ''
                : ''
        }
        onSelect={(url) => {
          const fallback =
            url.startsWith('/assets/') && url.toLowerCase().endsWith('.webp')
              ? url.slice(0, -5) + '.jpg'
              : undefined;
          if (mediaTarget?.type === 'highlight') {
            updateContent((p) => ({
              ...p,
              highlightVisual: { ...p.highlightVisual, image: url, imageFallback: fallback },
            }));
          } else if (mediaTarget?.type === 'infrastructure') {
            updateContent((p) => ({
              ...p,
              infrastructure: { ...p.infrastructure, image: url, imageFallback: fallback },
            }));
          } else if (mediaTarget?.type === 'gallery') {
            handleUpdateGalleryItem(mediaTarget.id, { image: url, imageFallback: fallback });
          }
          setMediaTarget(null);
        }}
      />
    </div>
  );
};

export default AdminAbout;
