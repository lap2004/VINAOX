import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Bold, 
  Italic, 
  Underline,
  Heading1, 
  Heading2, 
  List, 
  Quote, 
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { getArticleBySlug, isArticleDraft } from '../../services/contentService';
import { ArticleContent } from '../../types/content';
import { validateNewsArticle } from '../../shared/schemas/newsSchema';
import { adminFetch } from '../lib/adminFetch';

export const AdminNewsEditor: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const editIdentifier = id || slug;
  const isEditing = Boolean(editIdentifier);

  const [formData, setFormData] = useState<Partial<ArticleContent>>({
    id: '',
    slug: '',
    title_vi: '',
    title_en: '',
    excerpt_vi: '',
    excerpt_en: '',
    body_vi: '',
    body_en: '',
    cover_image: '/assets/images/news/dried-fruit-export.webp',
    cover_image_alt_vi: '',
    cover_image_alt_en: '',
    category: 'press',
    badgeType: 'quote',
    badgeTextVi: 'Tin tức',
    badgeTextEn: 'News',
    source: 'VINAXO',
    sourceUrl: '',
    author: 'Ban Biên Tập VINAXO',
    published_at: new Date().toISOString().split('T')[0],
    featured: false,
    tags: ['press'],
    status: 'published',
    published: true,
    verified: true,
    seo_title_vi: '',
    seo_description_vi: '',
    seo_title_en: '',
    seo_description_en: ''
  });

  const [fileSha, setFileSha] = useState<string | undefined>(undefined);
  const [slugLockedByUser, setSlugLockedByUser] = useState<boolean>(isEditing);
  const [activeTab, setActiveTab] = useState<'vi' | 'en' | 'seo' | 'preview'>('vi');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deployStatus, setDeployStatus] = useState<{
    active: boolean;
    state: 'queued' | 'pending' | 'success' | 'failure' | 'timeout';
    commitSha?: string;
    branch?: string;
    slug: string;
    description: string;
    secondsElapsed: number;
  } | null>(null);

  // Load existing article if editing (prefer live GitHub API, fallback build-time content)
  useEffect(() => {
    if (!editIdentifier) return;

    const existingLocal = getArticleBySlug(editIdentifier, { includeDrafts: true });
    if (existingLocal) {
      setFormData(existingLocal);
    }

    setIsLoadingArticle(true);
    adminFetch(`/api/admin/news?slug=${encodeURIComponent(editIdentifier)}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.article) {
          setFormData(data.article);
          if (data.sha) setFileSha(data.sha);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingArticle(false));
  }, [editIdentifier]);

  // Auto-generate slug from Vietnamese title if new and not manually overridden
  const handleTitleChange = (val: string) => {
    setFormData(prev => {
      const updated = { ...prev, title_vi: val };
      if (!isEditing && !slugLockedByUser) {
        const generatedSlug = val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        updated.slug = generatedSlug;
        updated.id = generatedSlug;
      }
      return updated;
    });
  };

  const insertMarkdown = (syntax: string) => {
    const currentBody = activeTab === 'en' ? (formData.body_en || '') : (formData.body_vi || '');
    let newBody = currentBody;

    if (syntax === 'b') newBody += ' **in đậm** ';
    else if (syntax === 'i') newBody += ' *in nghiêng* ';
    else if (syntax === 'u') newBody += ' <u>gạch chân</u> ';
    else if (syntax === 'h2') newBody += '\n## Tiêu đề đoạn\n';
    else if (syntax === 'h3') newBody += '\n### Tiêu đề phụ\n';
    else if (syntax === 'list') newBody += '\n- Mục danh sách 1\n- Mục danh sách 2\n';
    else if (syntax === 'quote') newBody += '\n> Trích dẫn quan trọng\n';
    else if (syntax === 'link') newBody += ' [Tên liên kết](https://...) ';
    else if (syntax === 'image') newBody += '\n![Mô tả hình ảnh](/assets/images/news/dried-fruit-export.webp)\n';
    else if (syntax === 'align-center') newBody += '\n<div align="center">\n\nNội dung căn giữa\n\n</div>\n';
    else if (syntax === 'align-left') newBody += '\n<div align="left">\n\nNội dung căn trái\n\n</div>\n';

    if (activeTab === 'en') {
      setFormData(prev => ({ ...prev, body_en: newBody }));
    } else {
      setFormData(prev => ({ ...prev, body_vi: newBody }));
    }
  };

  // Poll commit deployment status when article is published to Git
  useEffect(() => {
    if (!deployStatus || !deployStatus.active || !deployStatus.commitSha) return;
    if (deployStatus.state === 'success' || deployStatus.state === 'failure' || deployStatus.state === 'timeout') return;

    const commitSha = deployStatus.commitSha;
    const interval = setInterval(async () => {
      setDeployStatus(prev => {
        if (!prev) return null;
        const elapsed = prev.secondsElapsed + 3;
        if (elapsed > 75) {
          return {
            ...prev,
            state: 'timeout',
            secondsElapsed: elapsed,
            description: 'Đã lưu commit an toàn vào nhánh main. Quá trình build của Vercel thường mất 1-2 phút, bạn có thể kiểm tra trực tiếp trên web.'
          };
        }
        return { ...prev, secondsElapsed: elapsed };
      });

      try {
        const res = await adminFetch(`/api/admin/deployStatus?commitSha=${encodeURIComponent(commitSha)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.ok && json.status) {
            const { state, description, targetUrl } = json.status;
            if (state === 'success') {
              setDeployStatus(prev => prev ? {
                ...prev,
                state: 'success',
                description: description || 'Website https://vinaxo.net đã cập nhật nội dung mới!',
                targetUrl
              } : null);
            } else if (state === 'failure') {
              setDeployStatus(prev => prev ? {
                ...prev,
                state: 'failure',
                description: description || 'Triển khai Vercel thất bại.'
              } : null);
            } else if (state === 'pending') {
              setDeployStatus(prev => prev ? {
                ...prev,
                state: 'pending',
                description: 'Vercel đang biên dịch và cập nhật CDN edge...'
              } : null);
            }
          }
        }
      } catch {
        // Network hiccups tolerated during polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [deployStatus?.active, deployStatus?.commitSha, deployStatus?.state]);

  const handleSave = async (isDraft = false) => {
    if (!formData.title_vi?.trim() || !formData.slug?.trim()) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập Tiêu đề tiếng Việt và Đường dẫn (slug)!' });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      const targetSlug = formData.slug.trim();
      const articlePayload = {
        ...formData,
        sha: fileSha,
        status: isDraft ? 'draft' : 'published',
        published: !isDraft,
        tags: isDraft 
          ? Array.from(new Set([...(formData.tags || []), 'draft']))
          : (formData.tags || []).filter(t => t !== 'draft')
      };

      // Client-side Data Contract validation gate
      const validation = validateNewsArticle(articlePayload);
      if (!validation.valid) {
        setFeedback({ type: 'error', message: `Dữ liệu chưa hợp lệ: ${validation.errors.join('; ')}` });
        setIsSaving(false);
        return;
      }

      const res = await adminFetch('/api/admin/news', {
        method: 'POST',
        body: JSON.stringify(articlePayload)
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.result?.sha) setFileSha(data.result.sha);
        const commitSha = data.result?.commitSha;
        const branch = data.result?.branch || 'main';

        if (isDraft || !commitSha || commitSha === 'local-commit') {
          setFeedback({ 
            type: 'success', 
            message: isDraft 
              ? 'Đã lưu bản nháp thành công! (Bản nháp được lưu trong Git, ẩn khỏi web công khai)' 
              : 'Đã xuất bản bài viết thành công!' 
          });
          setTimeout(() => {
            navigate('/admin/news');
          }, 1200);
          return;
        }

        // Production publication: open deployment tracking dialog
        setDeployStatus({
          active: true,
          state: 'queued',
          commitSha,
          branch,
          slug: targetSlug,
          description: `Đã commit thành công vào nhánh ${branch}. Đang kết nối Vercel để triển khai lên website...`,
          secondsElapsed: 0
        });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Không thể lưu bài viết.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Lỗi mạng khi kết nối máy chủ.' });
    } finally {
      setIsSaving(false);
    }
  };

  const currentlyDraft = isArticleDraft(formData);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/admin/news"
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1C7BD',
              color: '#3A251B',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                {isEditing ? 'Chỉnh sửa bài viết' : 'Viết bài báo / tin tức mới'}
              </h1>
              {isEditing && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: currentlyDraft ? '#FEF3C7' : '#ECFDF5',
                  color: currentlyDraft ? '#B45309' : '#047857'
                }}>
                  {currentlyDraft ? 'Bản nháp' : 'Đã xuất bản'}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6E6259', margin: '2px 0 0 0' }}>
              {isLoadingArticle ? 'Đang tải phiên bản mới nhất từ Git...' : 'Nội dung lưu trực tiếp vào Git repository và cập nhật tự động lên website'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: '#FAF7F2',
              color: '#3A251B',
              border: '1.5px solid #D1C7BD',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            Lưu bản nháp
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              backgroundColor: '#F4A83A',
              color: '#3A251B',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
            }}
          >
            <Send size={15} />
            <span>{isSaving ? 'Đang lưu...' : 'Xuất bản bài viết'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          backgroundColor: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: feedback.type === 'success' ? '#065F46' : '#991B1B',
          border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}`
        }}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Form Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Card 1: Thông tin cơ bản & Phân loại */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1.5px solid #EADFCC' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 16px 0' }}>
            1. Thông tin chung & Nguồn bài viết
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Đường dẫn tĩnh (Slug) *
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                readOnly={isEditing}
                onChange={(e) => {
                  setSlugLockedByUser(true);
                  setFormData(prev => ({ ...prev, slug: e.target.value, id: e.target.value }));
                }}
                placeholder="vi-du-xoai-say-deo-vinaxo"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #D1C7BD',
                  fontSize: '0.88rem',
                  backgroundColor: isEditing ? '#F9FAFB' : '#FFFFFF'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Danh mục bài viết
              </label>
              <select
                value={formData.category || 'press'}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="press">Báo chí đưa tin (Press Coverage)</option>
                <option value="company">Hoạt động doanh nghiệp (Company Operations)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Tên nguồn báo chí / Cơ quan
              </label>
              <input
                type="text"
                value={formData.source || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="CafeF / Người Lao Động / VINAXO"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Link bài báo gốc (nếu có)
              </label>
              <input
                type="url"
                value={formData.sourceUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://cafef.vn/..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Ngày xuất bản
              </label>
              <input
                type="date"
                value={formData.published_at || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Tác giả / Nhân vật phát biểu
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Hoàng Mạnh Cường / Ban Biên Tập"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Hình ảnh đại diện */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1.5px solid #EADFCC' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 16px 0' }}>
            2. Hình ảnh đại diện (Cover Image)
          </h2>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={formData.cover_image || '/assets/images/news/dried-fruit-export.webp'}
              alt="Preview"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                const val = formData.cover_image || '';
                if (val.startsWith('/uploads/') && !el.dataset.triedFallback) {
                  el.dataset.triedFallback = '1';
                  el.src = `/api/admin/media?raw=${encodeURIComponent('public' + val)}`;
                }
              }}
              style={{ width: '140px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1.5px solid #EADFCC', backgroundColor: '#FAF7F2' }}
            />
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                Đường dẫn ảnh đại diện (URL)
              </label>
              <input
                type="text"
                value={formData.cover_image || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                placeholder="/uploads/news/anh-bai-viet.webp"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem', marginBottom: '8px' }}
              />
              <p style={{ fontSize: '0.78rem', color: '#6E6259', margin: 0 }}>
                💡 Gợi ý: Bạn có thể vào mục <Link to="/admin/media" target="_blank" style={{ color: '#F4A83A', fontWeight: 600 }}>Thư viện hình ảnh</Link> để tải ảnh từ điện thoại/máy tính lên rồi copy đường dẫn dán vào đây.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Soạn thảo nội dung Song ngữ (Tabs) */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1.5px solid #EADFCC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1.5px solid #EADFCC', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
              3. Nội dung bài viết song ngữ & SEO
            </h2>

            {/* Language Switch Tabs */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveTab('vi')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'vi' ? '#3A251B' : '#FAF7F2',
                  color: activeTab === 'vi' ? '#FFFFFF' : '#6E6259'
                }}
              >
                🇻🇳 Tiếng Việt
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('en')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'en' ? '#3A251B' : '#FAF7F2',
                  color: activeTab === 'en' ? '#FFFFFF' : '#6E6259'
                }}
              >
                🇬🇧 Tiếng Anh
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'seo' ? '#3A251B' : '#FAF7F2',
                  color: activeTab === 'seo' ? '#FFFFFF' : '#6E6259'
                }}
              >
                🔍 SEO & Hiển thị
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'preview' ? '#F4A83A' : '#FAF7F2',
                  color: '#3A251B'
                }}
              >
                👁️ Xem trước
              </button>
            </div>
          </div>

          {/* Tab 1: Tiếng Việt */}
          {activeTab === 'vi' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                  Tiêu đề tiếng Việt *
                </label>
                <input
                  type="text"
                  value={formData.title_vi || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết tiếng Việt..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '1rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                  Đoạn tóm tắt mở đầu (Excerpt)
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt_vi || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt_vi: e.target.value }))}
                  placeholder="Tóm tắt nội dung chính trong 2-3 câu..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.9rem', lineHeight: 1.5 }}
                />
              </div>

              {/* Rich Text Toolbar */}
              <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap', backgroundColor: '#FAF7F2', padding: '6px', borderRadius: '6px', border: '1px solid #D1C7BD' }}>
                <button type="button" onClick={() => insertMarkdown('b')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="In đậm">
                  <Bold size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('i')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="In nghiêng">
                  <Italic size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('u')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Gạch chân">
                  <Underline size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('h2')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Tiêu đề H2">
                  <Heading1 size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('h3')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Tiêu đề H3">
                  <Heading2 size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('list')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Danh sách">
                  <List size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('quote')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Trích dẫn">
                  <Quote size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('link')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Chèn link">
                  <Link2 size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('image')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Chèn ảnh vào nội dung">
                  <ImageIcon size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('align-center')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Căn giữa">
                  <AlignCenter size={14} />
                </button>
                <button type="button" onClick={() => insertMarkdown('align-left')} style={{ padding: '6px 8px', border: '1px solid #D1C7BD', borderRadius: '4px', background: '#fff', cursor: 'pointer' }} title="Căn trái">
                  <AlignLeft size={14} />
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                  Nội dung chi tiết bài viết (Hỗ trợ Markdown)
                </label>
                <textarea
                  rows={14}
                  value={formData.body_vi || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_vi: e.target.value }))}
                  placeholder="Soạn thảo toàn văn bài viết..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.92rem', lineHeight: 1.6, fontFamily: 'monospace' }}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Tiếng Anh */}
          {activeTab === 'en' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                  English Title (Tiêu đề tiếng Anh)
                </label>
                <input
                  type="text"
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder="Enter English article title..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '1rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                  English Excerpt (Tóm tắt tiếng Anh)
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                  placeholder="Short English summary..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.9rem', lineHeight: 1.5 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                  English Body Content
                </label>
                <textarea
                  rows={14}
                  value={formData.body_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_en: e.target.value }))}
                  placeholder="Full English body content..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.92rem', lineHeight: 1.6, fontFamily: 'monospace' }}
                />
              </div>
            </div>
          )}

          {/* Tab 3: SEO & Display */}
          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#3A251B', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <span>Đánh dấu là bài viết nổi bật</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                    SEO Title (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={formData.seo_title_vi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title_vi: e.target.value }))}
                    placeholder="Tiêu đề hiển thị trên Google Search..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                    SEO Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.seo_title_en || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title_en: e.target.value }))}
                    placeholder="SEO title for international search..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                    SEO Meta Description (Tiếng Việt)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.seo_description_vi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description_vi: e.target.value }))}
                    placeholder="Mô tả ngắn tối đa 160 ký tự..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#3A251B', marginBottom: '6px' }}>
                    SEO Meta Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.seo_description_en || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description_en: e.target.value }))}
                    placeholder="Short SEO meta description..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '6px', border: '1.5px solid #D1C7BD', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Live Visual Preview */}
          {activeTab === 'preview' && (
            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '8px', padding: '24px', border: '1px solid #D1C7BD' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #EADFCC', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#3A251B', color: '#FFF' }}>
                    {formData.category === 'press' ? 'Báo chí đưa tin' : 'Hoạt động doanh nghiệp'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#6E6259' }}>
                    {formData.published_at || new Date().toISOString().split('T')[0]} • {formData.source || 'VINAXO'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: isArticleDraft(formData) ? '#FEF3C7' : '#ECFDF5', color: isArticleDraft(formData) ? '#B45309' : '#047857' }}>
                  {isArticleDraft(formData) ? 'Bản nháp (Ẩn công khai)' : 'Xuất bản công khai'}
                </span>
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3A251B', lineHeight: 1.3, marginBottom: '12px' }}>
                {formData.title_vi || 'Chưa có tiêu đề bài viết'}
              </h1>

              {formData.cover_image && (
                <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #D1C7BD', maxHeight: '360px' }}>
                  <img src={formData.cover_image} alt="Preview Cover" style={{ width: '100%', height: 'auto', maxHeight: '360px', objectFit: 'cover' }} />
                </div>
              )}

              {formData.excerpt_vi && (
                <div style={{ padding: '14px 16px', backgroundColor: '#FFFFFF', borderLeft: '4px solid #F4A83A', borderRadius: '4px', fontStyle: 'italic', color: '#4A3B32', marginBottom: '20px', lineHeight: 1.6 }}>
                  {formData.excerpt_vi}
                </div>
              )}

              <div style={{ fontSize: '0.96rem', color: '#3A251B', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {formData.body_vi || 'Nội dung bài viết chưa được nhập.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Tracking Modal Overlay */}
      {deployStatus && deployStatus.active && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: '1.5px solid #EADFCC',
            textAlign: 'center'
          }}>
            {deployStatus.state === 'success' ? (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={36} />
              </div>
            ) : deployStatus.state === 'failure' ? (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertCircle size={36} />
              </div>
            ) : deployStatus.state === 'timeout' ? (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={36} />
              </div>
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FFF7ED', color: '#F4A83A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Loader2 size={36} className="animate-spin" />
              </div>
            )}

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3A251B', marginBottom: '8px' }}>
              {deployStatus.state === 'success'
                ? 'Website đã xuất bản thành công!'
                : deployStatus.state === 'failure'
                ? 'Lỗi triển khai máy chủ'
                : deployStatus.state === 'timeout'
                ? 'Đã lưu vào Git repository!'
                : 'Đang triển khai lên website vinaxo.net'}
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#6E6259', lineHeight: 1.6, marginBottom: '20px' }}>
              {deployStatus.description}
            </p>

            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '8px', padding: '12px 16px', fontSize: '0.82rem', color: '#786C60', textAlign: 'left', marginBottom: '24px' }}>
              <div><strong>Nhánh đích:</strong> <code>{deployStatus.branch || 'main'}</code></div>
              <div><strong>Commit Git:</strong> <code>{deployStatus.commitSha?.slice(0, 7)}</code></div>
              <div><strong>Thời gian xử lý:</strong> {deployStatus.secondsElapsed}s</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {deployStatus.state === 'success' ? (
                <>
                  <a
                    href={`/tin-tuc/${deployStatus.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#F4A83A',
                      color: '#3A251B',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={16} />
                    <span>Xem bài viết trên web</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/news')}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #D1C7BD',
                      color: '#3A251B',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Về danh sách bài viết
                  </button>
                </>
              ) : deployStatus.state === 'timeout' ? (
                <>
                  <a
                    href={`/tin-tuc/${deployStatus.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#F4A83A',
                      color: '#3A251B',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={16} />
                    <span>Mở trang bài viết</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/news')}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #D1C7BD',
                      color: '#3A251B',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Về danh sách bài viết
                  </button>
                </>
              ) : deployStatus.state === 'failure' ? (
                <button
                  type="button"
                  onClick={() => setDeployStatus(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#3A251B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Đóng
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/admin/news')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#8C827A',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Rời trang và tiếp tục xử lý nền
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsEditor;
