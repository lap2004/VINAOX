import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Eye,
  EyeOff,
  Home as HomeIcon,
  Image as ImageIcon,
  Languages,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { adminFetch } from '../lib/adminFetch';
import { MediaPicker } from '../components/MediaPicker';
import {
  HOMEPAGE_CONTENT,
  getHomepageLocalized,
} from '../../data/homepageContent';
import {
  ALLOWED_HOMEPAGE_LINK_TYPES,
  HomepageCategoryCard,
  HomepageContent,
  HomepageLinkType,
  HomepageSectionKey,
  mergeHomepageContent,
  validateHomepageContent,
} from '../../shared/schemas/homepageSchema';
import { EMPTY_LOCALIZED_TEXT } from '../../shared/schemas/aboutSchema';
import { LocalizedText, getMissingLocales } from '../../data/aboutContent';
import { productsData } from '../../data/products';
import { CATALOG_CATEGORIES } from '../../shared/catalogCategories';
import { Language } from '../../i18n/LanguageContext';

type AdminTab = 'sections' | 'categories' | 'featured' | 'qualityMarketsNews' | 'preview';
type LocaleKey = keyof LocalizedText;
type PublishState = 'idle' | 'publishing' | 'queued' | 'building' | 'ready' | 'error';

interface AdminProductSummary {
  slug: string;
  name_vi: string;
  name_en: string;
  category: string;
  image: string;
  published?: boolean;
  featured?: boolean;
}

const LOCALE_TABS: Array<{ key: LocaleKey; label: string; langCode: Language }> = [
  { key: 'vi', label: 'Tiếng Việt (VI)', langCode: 'vi' },
  { key: 'en', label: 'English (EN)', langCode: 'en' },
  { key: 'ko', label: '한국어 (KO)', langCode: 'ko' },
  { key: 'zh', label: '简体中文 (ZH-CN)', langCode: 'zh-CN' },
];

const SECTION_LABELS: Record<HomepageSectionKey, string> = {
  hero: '1. Hero Banner',
  about: '2. Giới thiệu ngắn VINAXO',
  categories: '3. 4 Danh mục & Dòng OEM riêng',
  featuredProducts: '4. Sản phẩm tiêu biểu (tối đa 4)',
  productionOem: '5. Năng lực Nhà máy & Gia công OEM',
  qualityCerts: '6. Chất lượng & Chứng nhận',
  exportMarkets: '7. Thị trường Xuất khẩu',
  news: '8. Báo chí & Tin tức',
  closingCta: '9. CTA Kết nối B2B',
};

const LINK_TYPE_LABELS: Record<HomepageLinkType, string> = {
  category: 'Danh mục /products?category=...',
  product: 'Sản phẩm /products?product=...',
  page: 'Trang nội bộ (/about, /brochure...)',
  contact: 'Liên hệ /contact?product=...',
  quote: 'Mở Form Báo Giá (QuoteModal)',
};

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
  const safeVal = value || EMPTY_LOCALIZED_TEXT;
  const missing = getMissingLocales(safeVal);
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
          value={safeVal[activeLocale] || ''}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...safeVal, [activeLocale]: e.target.value })}
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
          value={safeVal[activeLocale] || ''}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...safeVal, [activeLocale]: e.target.value })}
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

function createNewOemLineCard(nextOrder: number): HomepageCategoryCard {
  return {
    id: `oem-line-${Date.now()}`,
    linkType: 'quote',
    targetValue: 'oem-private-label',
    name: { ...EMPTY_LOCALIZED_TEXT, vi: 'Dòng gia công mới', en: 'Custom OEM Line' },
    description: { ...EMPTY_LOCALIZED_TEXT },
    badge: { ...EMPTY_LOCALIZED_TEXT, vi: 'Gia công OEM', en: 'OEM Custom' },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT, vi: 'Liên hệ tìm hiểu', en: 'Contact for Details', ko: '자세히 문의', zh: '联系咨询详情' },
    image: '/images/categories/value-added.webp',
    imageFallback: '/images/categories/value-added.jpg',
    visible: true,
    sortOrder: nextOrder,
  };
}

export const AdminHomepage: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>(HOMEPAGE_CONTENT);
  const [homepageSha, setHomepageSha] = useState<string | undefined>(undefined);
  const [availableProducts, setAvailableProducts] = useState<AdminProductSummary[]>(() =>
    productsData.map((p) => ({
      slug: p.slug,
      name_vi: p.nameVi,
      name_en: p.name,
      category: p.category,
      image: p.imageWebp || p.image,
      published: p.published !== false,
      featured: Boolean(p.featured),
    }))
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('sections');
  const [activeLocale, setActiveLocale] = useState<LocaleKey>('vi');
  const [previewLang, setPreviewLang] = useState<Language>('vi');

  const [mediaTarget, setMediaTarget] = useState<
    | null
    | { type: 'heroPrimary' }
    | { type: 'heroSecondary' }
    | { type: 'aboutImage' }
    | { type: 'productionOemImage' }
    | { type: 'catalogCard'; id: string }
    | { type: 'oemLine'; id: string }
  >(null);

  const [isDirty, setIsDirty] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>('idle');
  const [deployCommitSha, setDeployCommitSha] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hpRes, prodRes] = await Promise.all([
        adminFetch('/api/admin/settings?section=homepage'),
        adminFetch('/api/admin/products'),
      ]);

      if (hpRes.ok) {
        const payload = await hpRes.json();
        if (payload.sha) setHomepageSha(payload.sha);
        if (payload.data && typeof payload.data === 'object' && Object.keys(payload.data).length > 0) {
          setContent(mergeHomepageContent(HOMEPAGE_CONTENT, payload.data));
        }
      }

      if (prodRes.ok) {
        const prodPayload = await prodRes.json();
        if (Array.isArray(prodPayload.products) && prodPayload.products.length > 0) {
          setAvailableProducts(
            prodPayload.products.map((p: any) => ({
              slug: p.slug,
              name_vi: p.name_vi || p.nameVi || p.slug,
              name_en: p.name_en || p.name || p.slug,
              category: p.category || 'soft-dried',
              image: p.image || '/images/products/placeholder.webp',
              published: p.published !== false && p.status !== 'draft',
              featured: Boolean(p.featured),
            }))
          );
        }
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Không thể tải cấu hình Trang chủ từ máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
            text: `Vercel đã triển khai xong Trang chủ lên website vinaxo.net (${deployCommitSha.slice(0, 7)}).`,
          });
        } else if (state === 'failure') {
          setPublishState('error');
          setStatusMsg({
            type: 'error',
            text: data?.status?.description || 'Quá trình build/triển khai Vercel thất bại.',
          });
        } else if (state === 'pending' || state === 'queued') {
          setPublishState('building');
        }
      } catch {
        // retry next tick
      }
    };

    const timer = window.setInterval(poll, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [deployCommitSha, publishState]);

  const updateContent = (updater: (prev: HomepageContent) => HomepageContent) => {
    setContent((prev) => updater(prev));
    setIsDirty(true);
    setStatusMsg(null);
  };

  const validSlugs = useMemo(
    () => availableProducts.filter((p) => p.published !== false).map((p) => p.slug),
    [availableProducts]
  );

  const handleSave = async (): Promise<boolean> => {
    const check = validateHomepageContent(content, content, validSlugs);
    if (!check.valid) {
      setStatusMsg({ type: 'error', text: check.errors.join(' | ') });
      return false;
    }

    try {
      setIsSaving(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/settings?section=homepage', {
        method: 'POST',
        body: JSON.stringify({ ...check.data, sha: homepageSha }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.data) setContent(data.data);
        if (data.result?.sha) setHomepageSha(data.result.sha);
        setIsDirty(false);
        setHasUnpublishedChanges(true);
        setStatusMsg({
          type: 'success',
          text: 'Đã lưu cấu hình Trang chủ vào kho nội dung. Bấm "Cập nhật trang chủ lên website" để xuất bản.',
        });
        return true;
      }
      setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi lưu cấu hình Trang chủ.' });
      return false;
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi lưu Trang chủ.' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishHomepage = async () => {
    if (isDirty) {
      const ok = await handleSave();
      if (!ok) return;
    }

    if (!window.confirm('Xuất bản riêng cấu hình Trang chủ & 4 sản phẩm tiêu biểu lên vinaxo.net?')) {
      return;
    }

    try {
      setPublishState('publishing');
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'homepage' }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPublishState('queued');
        setDeployCommitSha(data.commitSha || null);
        if (data.commitSha === 'local-commit-sha') {
          setPublishState('ready');
          setHasUnpublishedChanges(false);
        }
        setStatusMsg({
          type: 'info',
          text: data.message || 'Đã kích hoạt xuất bản riêng Trang chủ lên vinaxo.net!',
        });
      } else {
        setPublishState('error');
        setStatusMsg({ type: 'error', text: data.error || 'Không thể kích hoạt xuất bản Trang chủ.' });
      }
    } catch {
      setPublishState('error');
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi kích hoạt xuất bản Trang chủ.' });
    }
  };

  const handleMoveSection = (key: HomepageSectionKey, dir: 'up' | 'down') => {
    const order = [...content.sectionOrder];
    const idx = order.indexOf(key);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= order.length) return;
    [order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
    updateContent((prev) => ({ ...prev, sectionOrder: order }));
  };

  const handleToggleFeaturedProduct = (slug: string) => {
    const current = [...content.featuredProductSlugs];
    if (current.includes(slug)) {
      updateContent((prev) => ({
        ...prev,
        featuredProductSlugs: current.filter((s) => s !== slug),
      }));
      return;
    }
    if (current.length >= 4) {
      setStatusMsg({
        type: 'error',
        text: 'Trang chủ chỉ cho phép chọn tối đa 4 sản phẩm tiêu biểu. Vui lòng bỏ chọn 1 sản phẩm trước.',
      });
      return;
    }
    updateContent((prev) => ({
      ...prev,
      featuredProductSlugs: [...current, slug],
    }));
  };

  const handleMoveFeatured = (slug: string, dir: 'up' | 'down') => {
    const list = [...content.featuredProductSlugs];
    const idx = list.indexOf(slug);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
    updateContent((prev) => ({ ...prev, featuredProductSlugs: list }));
  };

  const handleMoveCard = (group: 'catalogCategoryCards' | 'oemProductLines', id: string, dir: 'up' | 'down') => {
    const list = [...content[group]].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((c) => c.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
    const normalized = list.map((c, i) => ({ ...c, sortOrder: i + 1 }));
    updateContent((prev) => ({ ...prev, [group]: normalized }));
  };

  const updateCardInGroup = (
    group: 'catalogCategoryCards' | 'oemProductLines',
    id: string,
    patch: Partial<HomepageCategoryCard>
  ) => {
    updateContent((prev) => ({
      ...prev,
      [group]: prev[group].map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const handleMediaSelect = (url: string) => {
    if (!mediaTarget) return;
    const isAssets = (url.startsWith('/assets/') || url.startsWith('/images/')) && url.endsWith('.webp');
    const fallback = isAssets ? url.slice(0, -5) + '.jpg' : undefined;

    if (mediaTarget.type === 'heroPrimary') {
      updateContent((prev) => ({
        ...prev,
        hero: { ...prev.hero, primaryImage: url, primaryImageFallback: fallback },
      }));
    } else if (mediaTarget.type === 'heroSecondary') {
      updateContent((prev) => ({
        ...prev,
        hero: { ...prev.hero, secondaryImage: url, secondaryImageFallback: fallback },
      }));
    } else if (mediaTarget.type === 'aboutImage') {
      updateContent((prev) => ({
        ...prev,
        about: { ...prev.about, image: url, imageFallback: fallback },
      }));
    } else if (mediaTarget.type === 'productionOemImage') {
      updateContent((prev) => ({
        ...prev,
        productionOem: { ...prev.productionOem, image: url, imageFallback: fallback },
      }));
    } else if (mediaTarget.type === 'catalogCard') {
      updateCardInGroup('catalogCategoryCards', mediaTarget.id, { image: url, imageFallback: fallback });
    } else if (mediaTarget.type === 'oemLine') {
      updateCardInGroup('oemProductLines', mediaTarget.id, { image: url, imageFallback: fallback });
    }
    setMediaTarget(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#6E6259' }}>
        Đang tải cấu hình Trang chủ...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#3A251B', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HomeIcon size={22} color="#F4A83A" />
            <span>Quản lý Trang chủ (/)</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6E6259', margin: 0 }}>
            Quản lý 9 phân mục Trang chủ, 4 danh mục xuất khẩu, dòng OEM theo yêu cầu & tối đa 4 sản phẩm tiêu biểu (4 ngôn ngữ).
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #3A251B',
              backgroundColor: isDirty ? '#FEF3C7' : '#FFFFFF',
              color: '#3A251B',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: isSaving ? 'wait' : 'pointer',
            }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : isDirty ? 'Lưu nháp thay đổi*' : 'Lưu cấu hình'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublishHomepage}
            disabled={publishState === 'publishing' || publishState === 'queued' || publishState === 'building'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)',
            }}
          >
            <RefreshCw size={16} />
            <span>
              {publishState === 'publishing'
                ? 'Đang gửi lệnh xuất bản...'
                : publishState === 'building' || publishState === 'queued'
                ? 'Vercel đang build Trang chủ...'
                : 'Cập nhật trang chủ lên website'}
            </span>
          </button>
        </div>
      </div>

      {/* Dirty / Unpublished status alert */}
      {hasUnpublishedChanges && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', marginBottom: '14px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', fontSize: '0.84rem' }}>
          Nội dung Trang chủ đã được lưu vào Git và đang chờ xuất bản. Nhấn <strong>Cập nhật trang chủ lên website</strong> để áp dụng ra vinaxo.net.
        </div>
      )}

      {statusMsg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            backgroundColor:
              statusMsg.type === 'success' ? '#ECFDF5' : statusMsg.type === 'error' ? '#FEF2F2' : '#EFF6FF',
            color:
              statusMsg.type === 'success' ? '#065F46' : statusMsg.type === 'error' ? '#991B1B' : '#1E40AF',
            border: `1px solid ${
              statusMsg.type === 'success' ? '#A7F3D0' : statusMsg.type === 'error' ? '#FECACA' : '#BFDBFE'
            }`,
          }}
        >
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Tabs & Global Locale Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'sections' as AdminTab, label: 'Bố cục & Hero / OEM / CTA' },
            { key: 'categories' as AdminTab, label: '4 Danh mục & Dòng OEM riêng' },
            { key: 'featured' as AdminTab, label: `Sản phẩm tiêu biểu (${content.featuredProductSlugs.length}/4)` },
            { key: 'qualityMarketsNews' as AdminTab, label: 'Chất lượng, Thị trường & Tin tức' },
            { key: 'preview' as AdminTab, label: 'Xem trước' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === tab.key ? 700 : 500,
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Languages size={16} color="#8C7E74" />
          {LOCALE_TABS.map((loc) => (
            <button
              key={loc.key}
              type="button"
              onClick={() => setActiveLocale(loc.key)}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: activeLocale === loc.key ? 700 : 500,
                border: `1px solid ${activeLocale === loc.key ? '#3A251B' : '#EADCCE'}`,
                backgroundColor: activeLocale === loc.key ? '#3A251B' : '#FFFFFF',
                color: activeLocale === loc.key ? '#FFFFFF' : '#6E6259',
                cursor: 'pointer',
              }}
            >
              {loc.key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SECTIONS VISIBILITY, ORDER, HERO, ABOUT, PRODUCTION, CLOSING CTA */}
      {activeTab === 'sections' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Section Visibility & Order */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              Thứ tự & Bật/Tắt 9 Phân mục Trang chủ
            </h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              {content.sectionOrder.map((key, idx) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #F0E6DC',
                    backgroundColor: content.sections[key] ? '#FFFDF9' : '#F9FAFB',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.88rem', color: '#3A251B', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={content.sections[key] !== false}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          sections: { ...prev.sections, [key]: e.target.checked },
                        }))
                      }
                    />
                    <span>{SECTION_LABELS[key] || key}</span>
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => handleMoveSection(key, 'up')} disabled={idx === 0} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.35 : 1 }}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => handleMoveSection(key, 'down')} disabled={idx === content.sectionOrder.length - 1} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF', cursor: idx === content.sectionOrder.length - 1 ? 'default' : 'pointer', opacity: idx === content.sectionOrder.length - 1 ? 0.35 : 1 }}>
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Section Config */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 14px 0' }}>Hero Banner</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <LocalizedInputField label="Eyebrow" value={content.hero.eyebrow} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, eyebrow: v } }))} />
              <LocalizedInputField label="Tiêu đề dòng 1" value={content.hero.headlineLine1} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, headlineLine1: v } }))} />
              <LocalizedInputField label="Tiêu đề dòng 2" value={content.hero.headlineLine2} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, headlineLine2: v } }))} />
              <LocalizedInputField label="Tiêu đề nhấn mạnh" value={content.hero.headlineHighlight} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, headlineHighlight: v } }))} />
            </div>
            <LocalizedInputField label="Mô tả Hero" value={content.hero.description} activeLocale={activeLocale} multiline rows={3} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, description: v } }))} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <LocalizedInputField label="CTA Chính" value={content.hero.primaryCtaLabel} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, primaryCtaLabel: v } }))} />
              <LocalizedInputField label="CTA Phụ (Mở form báo giá)" value={content.hero.secondaryCtaLabel} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, hero: { ...p.hero, secondaryCtaLabel: v } }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '10px' }}>
              {[
                { key: 'heroPrimary' as const, label: 'Ảnh chính Hero', img: content.hero.primaryImage, alt: content.hero.primaryImageAlt, setAlt: (v: LocalizedText) => updateContent((p) => ({ ...p, hero: { ...p.hero, primaryImageAlt: v } })) },
                { key: 'heroSecondary' as const, label: 'Ảnh phụ Hero', img: content.hero.secondaryImage, alt: content.hero.secondaryImageAlt, setAlt: (v: LocalizedText) => updateContent((p) => ({ ...p, hero: { ...p.hero, secondaryImageAlt: v } })) },
              ].map((item) => (
                <div key={item.key} style={{ border: '1px solid #EADCCE', borderRadius: '10px', padding: '12px', backgroundColor: '#FFFDF9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '0.84rem', color: '#3A251B' }}>{item.label}</strong>
                    <button type="button" onClick={() => setMediaTarget({ type: item.key })} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #3A251B', background: '#FFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                      <ImageIcon size={13} /> Đổi ảnh
                    </button>
                  </div>
                  <img src={item.img} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                  <LocalizedInputField label="Alt ảnh" value={item.alt} activeLocale={activeLocale} onChange={item.setAlt} />
                </div>
              ))}
            </div>
          </div>

          {/* Short About & Production OEM & Closing CTA */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 14px 0' }}>Giới thiệu ngắn & Năng lực Nhà máy / OEM</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <LocalizedInputField label="About Label" value={content.about.label} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, about: { ...p.about, label: v } }))} />
              <LocalizedInputField label="About Tiêu đề 1" value={content.about.titleLine1} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, about: { ...p.about, titleLine1: v } }))} />
              <LocalizedInputField label="About Tiêu đề 2" value={content.about.titleLine2} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, about: { ...p.about, titleLine2: v } }))} />
              <LocalizedInputField label="About CTA" value={content.about.ctaLabel} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, about: { ...p.about, ctaLabel: v } }))} />
            </div>
            <LocalizedInputField label="About Mô tả" value={content.about.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, about: { ...p.about, description: v } }))} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <img src={content.about.image} alt="" style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE' }} />
              <button type="button" onClick={() => setMediaTarget({ type: 'aboutImage' })} style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #3A251B', background: '#FFF', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Đổi ảnh Giới thiệu
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F0E6DC', margin: '16px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <LocalizedInputField label="Production/OEM Label" value={content.productionOem.label} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, productionOem: { ...p.productionOem, label: v } }))} />
              <LocalizedInputField label="Production/OEM Tiêu đề" value={content.productionOem.title} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, productionOem: { ...p.productionOem, title: v } }))} />
            </div>
            <LocalizedInputField label="Production/OEM Mô tả" value={content.productionOem.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, productionOem: { ...p.productionOem, description: v } }))} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img src={content.productionOem.image} alt="" style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #EADCCE' }} />
              <button type="button" onClick={() => setMediaTarget({ type: 'productionOemImage' })} style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #3A251B', background: '#FFF', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Đổi ảnh Nhà máy / OEM
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <LocalizedInputField label="Closing CTA Eyebrow" value={content.closingCta.eyebrow} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, closingCta: { ...p.closingCta, eyebrow: v } }))} />
              <LocalizedInputField label="Closing CTA Tiêu đề" value={content.closingCta.title} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, closingCta: { ...p.closingCta, title: v } }))} />
            </div>
            <LocalizedInputField label="Closing CTA Mô tả" value={content.closingCta.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, closingCta: { ...p.closingCta, description: v } }))} />
          </div>
        </div>
      )}

      {/* TAB 2: 4 OFFICIAL CATALOG CATEGORIES + SEPARATE OEM CUSTOM LINES */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              Tiêu đề Khối Danh mục Chính thức & Dòng OEM
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <LocalizedInputField label="Tiêu đề 4 Danh mục" value={content.categoriesSection.title} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, categoriesSection: { ...p.categoriesSection, title: v } }))} />
              <LocalizedInputField label="Tiêu đề Khối OEM riêng" value={content.categoriesSection.oemLinesHeading} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, categoriesSection: { ...p.categoriesSection, oemLinesHeading: v } }))} />
            </div>
            <LocalizedInputField label="Mô tả 4 Danh mục" value={content.categoriesSection.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, categoriesSection: { ...p.categoriesSection, description: v } }))} />
            <LocalizedInputField label="Mô tả Khối OEM riêng" value={content.categoriesSection.oemLinesDesc} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, categoriesSection: { ...p.categoriesSection, oemLinesDesc: v } }))} />
          </div>

          {/* Official 4 Categories */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              4 Nhóm Danh Mục Xuất Khẩu Chính Thức
            </h3>
            <div style={{ display: 'grid', gap: '14px' }}>
              {content.catalogCategoryCards.map((card, idx) => (
                <div key={card.id} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #EADCCE', backgroundColor: '#FFFDF9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={card.image} alt="" style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#3A251B' }}>{card.name[activeLocale] || card.name.vi}</strong>
                        <div style={{ fontSize: '0.74rem', color: '#8C7E74', fontFamily: 'monospace' }}>
                          /products?category={card.targetValue}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button type="button" onClick={() => setMediaTarget({ type: 'catalogCard', id: card.id })} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF', fontSize: '0.78rem', cursor: 'pointer' }}>
                        Đổi ảnh
                      </button>
                      <button type="button" onClick={() => updateCardInGroup('catalogCategoryCards', card.id, { visible: !card.visible })} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #EADCCE', background: card.visible ? '#ECFDF5' : '#F3F4F6', fontSize: '0.78rem', cursor: 'pointer' }}>
                        {card.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button type="button" onClick={() => handleMoveCard('catalogCategoryCards', card.id, 'up')} disabled={idx === 0} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF' }}><ArrowUp size={13} /></button>
                      <button type="button" onClick={() => handleMoveCard('catalogCategoryCards', card.id, 'down')} disabled={idx === content.catalogCategoryCards.length - 1} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF' }}><ArrowDown size={13} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <LocalizedInputField label="Tên danh mục" value={card.name} activeLocale={activeLocale} onChange={(v) => updateCardInGroup('catalogCategoryCards', card.id, { name: v })} />
                    <LocalizedInputField label="Nhãn CTA" value={card.ctaLabel || EMPTY_LOCALIZED_TEXT} activeLocale={activeLocale} onChange={(v) => updateCardInGroup('catalogCategoryCards', card.id, { ctaLabel: v })} />
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3A251B', marginBottom: '4px' }}>Danh mục đích</label>
                      <select
                        value={card.targetValue}
                        onChange={(e) => updateCardInGroup('catalogCategoryCards', card.id, { linkType: 'category', targetValue: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1C7BD', fontSize: '0.84rem' }}
                      >
                        {CATALOG_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.name.vi} ({c.id})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <LocalizedInputField label="Mô tả danh mục" value={card.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateCardInGroup('catalogCategoryCards', card.id, { description: v })} />
                </div>
              ))}
            </div>
          </div>

          {/* Separate Bespoke OEM Inquiry Lines */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3A251B', margin: '0 0 4px 0' }}>
                  Dòng Gia Công OEM Theo Yêu Cầu (Granola, Viên Năng Lượng, Tẩm Mật Ong, Nhúng Sô-cô-la)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#92400E', margin: 0 }}>
                  Các dòng này mở thẳng hộp thoại Báo Giá OEM với đúng ID tư vấn; không trỏ sang danh mục Hạt dinh dưỡng.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateContent((p) => ({
                    ...p,
                    oemProductLines: [...p.oemProductLines, createNewOemLineCard(p.oemProductLines.length + 1)],
                  }))
                }
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#3A251B', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <Plus size={14} /> Thêm dòng OEM
              </button>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {content.oemProductLines.map((line, idx) => (
                <div key={line.id} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #EADCCE', backgroundColor: '#FFFDF9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={line.image} alt="" style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#3A251B' }}>{line.name[activeLocale] || line.name.vi}</strong>
                        <div style={{ fontSize: '0.74rem', color: '#B5650D', fontFamily: 'monospace' }}>
                          {line.linkType} → {line.targetValue}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button type="button" onClick={() => setMediaTarget({ type: 'oemLine', id: line.id })} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF', fontSize: '0.78rem', cursor: 'pointer' }}>
                        Đổi ảnh
                      </button>
                      <button type="button" onClick={() => updateCardInGroup('oemProductLines', line.id, { visible: !line.visible })} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #EADCCE', background: line.visible ? '#ECFDF5' : '#F3F4F6', fontSize: '0.78rem', cursor: 'pointer' }}>
                        {line.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button type="button" onClick={() => handleMoveCard('oemProductLines', line.id, 'up')} disabled={idx === 0} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF' }}><ArrowUp size={13} /></button>
                      <button type="button" onClick={() => handleMoveCard('oemProductLines', line.id, 'down')} disabled={idx === content.oemProductLines.length - 1} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF' }}><ArrowDown size={13} /></button>
                      <button
                        type="button"
                        onClick={() => updateContent((p) => ({ ...p, oemProductLines: p.oemProductLines.filter((c) => c.id !== line.id) }))}
                        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                    <LocalizedInputField label="Tên dòng OEM" value={line.name} activeLocale={activeLocale} onChange={(v) => updateCardInGroup('oemProductLines', line.id, { name: v })} />
                    <LocalizedInputField label="Nút CTA" value={line.ctaLabel || EMPTY_LOCALIZED_TEXT} activeLocale={activeLocale} onChange={(v) => updateCardInGroup('oemProductLines', line.id, { ctaLabel: v })} />
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3A251B', marginBottom: '4px' }}>Kiểu điều hướng</label>
                      <select
                        value={line.linkType}
                        onChange={(e) => updateCardInGroup('oemProductLines', line.id, { linkType: e.target.value as HomepageLinkType })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1C7BD', fontSize: '0.82rem' }}
                      >
                        {ALLOWED_HOMEPAGE_LINK_TYPES.map((lt) => (
                          <option key={lt} value={lt}>{LINK_TYPE_LABELS[lt]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3A251B', marginBottom: '4px' }}>ID / Target Value</label>
                      <input
                        type="text"
                        value={line.targetValue}
                        onChange={(e) => updateCardInGroup('oemProductLines', line.id, { targetValue: e.target.value })}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1C7BD', fontSize: '0.82rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <LocalizedInputField label="Mô tả dòng OEM" value={line.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateCardInGroup('oemProductLines', line.id, { description: v })} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED PRODUCTS (MAX 4) */}
      {activeTab === 'featured' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>
              4 Sản Phẩm Tiêu Biểu Trên Trang Chủ (Giới hạn tối đa 4 sản phẩm)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <LocalizedInputField label="Section Label" value={content.featuredProductsSection.label} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, featuredProductsSection: { ...p.featuredProductsSection, label: v } }))} />
              <LocalizedInputField label="Tiêu đề" value={content.featuredProductsSection.title} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, featuredProductsSection: { ...p.featuredProductsSection, title: v } }))} />
              <LocalizedInputField label="Nút Xem tất cả" value={content.featuredProductsSection.viewAllLabel} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, featuredProductsSection: { ...p.featuredProductsSection, viewAllLabel: v } }))} />
            </div>
            <LocalizedInputField label="Mô tả" value={content.featuredProductsSection.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, featuredProductsSection: { ...p.featuredProductsSection, description: v } }))} />

            {/* Selected ordered list */}
            <div style={{ marginTop: '14px', padding: '14px', borderRadius: '10px', backgroundColor: '#FFF8EC', border: '1px solid #F3D19B' }}>
              <strong style={{ display: 'block', fontSize: '0.88rem', color: '#3A251B', marginBottom: '10px' }}>
                Thứ tự hiển thị hiện tại ({content.featuredProductSlugs.length}/4):
              </strong>
              <div style={{ display: 'grid', gap: '8px' }}>
                {content.featuredProductSlugs.map((slug, idx) => {
                  const prod = availableProducts.find((p) => p.slug === slug);
                  return (
                    <div key={slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #EADCCE' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: '#D97706' }}>#{idx + 1}</span>
                        {prod && <img src={prod.image} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#3A251B' }}>{prod?.name_vi || slug}</div>
                          <div style={{ fontSize: '0.72rem', color: '#8C7E74', fontFamily: 'monospace' }}>{slug}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" onClick={() => handleMoveFeatured(slug, 'up')} disabled={idx === 0} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF' }}><ArrowUp size={13} /></button>
                        <button type="button" onClick={() => handleMoveFeatured(slug, 'down')} disabled={idx === content.featuredProductSlugs.length - 1} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #EADCCE', background: '#FFF' }}><ArrowDown size={13} /></button>
                        <button type="button" onClick={() => handleToggleFeaturedProduct(slug)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '0.76rem' }}>Bỏ</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Picker Grid */}
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#3A251B', margin: '18px 0 10px 0' }}>
              Chọn từ danh mục 12 sản phẩm thật ({content.featuredProductSlugs.length}/4 đã chọn)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
              {availableProducts.map((prod) => {
                const isSelected = content.featuredProductSlugs.includes(prod.slug);
                const disabled = !isSelected && content.featuredProductSlugs.length >= 4;
                return (
                  <button
                    key={prod.slug}
                    type="button"
                    onClick={() => handleToggleFeaturedProduct(prod.slug)}
                    disabled={disabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #F4A83A' : '1px solid #EADCCE',
                      backgroundColor: isSelected ? '#FFF8EC' : '#FFFFFF',
                      opacity: disabled ? 0.55 : 1,
                      textAlign: 'left',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <img src={prod.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#3A251B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isSelected ? '★ ' : ''}{prod.name_vi}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#8C7E74' }}>{prod.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUALITY, EXPORT MARKETS & NEWS */}
      {activeTab === 'qualityMarketsNews' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>Chất lượng & Chứng nhận</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <LocalizedInputField label="Label" value={content.qualityCerts.label} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, qualityCerts: { ...p.qualityCerts, label: v } }))} />
              <LocalizedInputField label="Tiêu đề" value={content.qualityCerts.title} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, qualityCerts: { ...p.qualityCerts, title: v } }))} />
              <LocalizedInputField label="Nút CTA" value={content.qualityCerts.ctaLabel} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, qualityCerts: { ...p.qualityCerts, ctaLabel: v } }))} />
            </div>
            <LocalizedInputField label="Mô tả" value={content.qualityCerts.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, qualityCerts: { ...p.qualityCerts, description: v } }))} />
            <LocalizedInputField label="Ghi chú phạm vi chứng nhận (Facility vs Product Scope Note)" value={content.qualityCerts.scopeNote} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, qualityCerts: { ...p.qualityCerts, scopeNote: v } }))} />
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0' }}>Thị trường Xuất khẩu & Tin tức</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <LocalizedInputField label="Markets Tiêu đề 1" value={content.exportMarkets.titleLine1} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, exportMarkets: { ...p.exportMarkets, titleLine1: v } }))} />
              <LocalizedInputField label="Markets Tiêu đề 2" value={content.exportMarkets.titleLine2} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, exportMarkets: { ...p.exportMarkets, titleLine2: v } }))} />
              <LocalizedInputField label="Markets CTA" value={content.exportMarkets.ctaLabel} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, exportMarkets: { ...p.exportMarkets, ctaLabel: v } }))} />
            </div>
            <LocalizedInputField label="Markets Mô tả" value={content.exportMarkets.description} activeLocale={activeLocale} multiline rows={2} onChange={(v) => updateContent((p) => ({ ...p, exportMarkets: { ...p.exportMarkets, description: v } }))} />
            <hr style={{ border: 'none', borderTop: '1px solid #F0E6DC', margin: '14px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <LocalizedInputField label="News Tiêu đề 1" value={content.newsSection.titleLine1} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, newsSection: { ...p.newsSection, titleLine1: v } }))} />
              <LocalizedInputField label="News Tiêu đề 2" value={content.newsSection.titleLine2} activeLocale={activeLocale} onChange={(v) => updateContent((p) => ({ ...p, newsSection: { ...p.newsSection, titleLine2: v } }))} />
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#3A251B', marginBottom: '4px' }}>Số tin hiển thị trên Trang chủ (1–3)</label>
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={content.newsSection.maxItems}
                  onChange={(e) => updateContent((p) => ({ ...p, newsSection: { ...p.newsSection, maxItems: Math.max(1, Math.min(3, Number(e.target.value) || 3)) } }))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D1C7BD', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EADCCE' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#F4A83A" /> Xem trước cấu hình Trang chủ
            </h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              {LOCALE_TABS.map((loc) => (
                <button key={loc.key} type="button" onClick={() => setPreviewLang(loc.langCode)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #EADCCE', backgroundColor: previewLang === loc.langCode ? '#3A251B' : '#FFF', color: previewLang === loc.langCode ? '#FFF' : '#3A251B', fontSize: '0.78rem', cursor: 'pointer' }}>
                  {loc.key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#FAF4EB', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8D5410' }}>{getHomepageLocalized(content.hero.eyebrow, previewLang)}</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3A251B', marginTop: '4px' }}>
              {getHomepageLocalized(content.hero.headlineLine1, previewLang)} {getHomepageLocalized(content.hero.headlineLine2, previewLang)} — {getHomepageLocalized(content.hero.headlineHighlight, previewLang)}
            </div>
            <p style={{ fontSize: '0.86rem', color: '#6E6259' }}>{getHomepageLocalized(content.hero.description, previewLang)}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #EADCCE' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: '#3A251B' }}>4 Danh mục chính thức</strong>
              {content.catalogCategoryCards.filter((c) => c.visible).map((c) => (
                <div key={c.id} style={{ fontSize: '0.84rem', padding: '4px 0', borderBottom: '1px solid #F5EFE6' }}>
                  • <strong>{getHomepageLocalized(c.name, previewLang)}</strong> → <code>/products?category={c.targetValue}</code>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #EADCCE' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: '#3A251B' }}>Dòng OEM riêng (QuoteModal)</strong>
              {content.oemProductLines.filter((c) => c.visible).map((c) => (
                <div key={c.id} style={{ fontSize: '0.84rem', padding: '4px 0', borderBottom: '1px solid #F5EFE6' }}>
                  • <strong>{getHomepageLocalized(c.name, previewLang)}</strong> → <code>{c.targetValue}</code>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #EADCCE' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: '#3A251B' }}>4 Sản phẩm tiêu biểu</strong>
              {content.featuredProductSlugs.map((slug, i) => (
                <div key={slug} style={{ fontSize: '0.84rem', padding: '4px 0', borderBottom: '1px solid #F5EFE6' }}>
                  {i + 1}. <code>{slug}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <MediaPicker
        isOpen={Boolean(mediaTarget)}
        onClose={() => setMediaTarget(null)}
        onSelect={handleMediaSelect}
        initialCategory="homepage"
        title="Chọn ảnh Trang chủ VINAXO"
      />
    </div>
  );
};

export default AdminHomepage;
