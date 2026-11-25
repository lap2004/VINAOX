import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Newspaper, 
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { getAllArticles, isArticleDraft } from '../../services/contentService';
import { ArticleContent } from '../../types/content';
import { adminFetch } from '../lib/adminFetch';

export const AdminNewsList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleContent[]>(() => getAllArticles({ includeDrafts: true }));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isPublishingNews, setIsPublishingNews] = useState(false);

  const handlePublishNewsModule = async () => {
    try {
      setIsPublishingNews(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'news' })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: 'Đã kích hoạt xuất bản toàn bộ tin tức lên website!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi kích hoạt xuất bản tin tức.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi xuất bản tin tức.' });
    } finally {
      setIsPublishingNews(false);
    }
  };

  const fetchLiveArticles = async () => {
    try {
      setIsLoadingList(true);
      const res = await adminFetch('/api/admin/news');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      }
    } catch {
      // Retain initial articles on offline fallback
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLiveArticles();
  }, []);

  // Filter articles
  const filteredArticles = articles.filter(item => {
    const sTerm = searchTerm.trim().toLowerCase();
    const titleVi = String(item.title_vi || '').toLowerCase();
    const source = String(item.source || '').toLowerCase();
    const titleEn = String(item.title_en || '').toLowerCase();
    const matchesSearch = !sTerm || titleVi.includes(sTerm) || source.includes(sTerm) || titleEn.includes(sTerm);
    const matchesCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'draft' ? isArticleDraft(item) : item.category === selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleDelete = async (slug: string) => {
    try {
      setIsDeleting(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/news', {
        method: 'DELETE',
        body: JSON.stringify({ slug })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setArticles(prev => prev.filter(a => a.slug !== slug));
        setStatusMsg({ type: 'success', text: `Đã xóa bài viết ${slug} thành công.` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể xóa bài viết.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi yêu cầu xóa bài.' });
    } finally {
      setIsDeleting(false);
      setDeletingSlug(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3A251B', margin: '0 0 4px 0' }}>
            Quản lý Bài viết & Báo chí
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6E6259', margin: 0 }}>
            Tổng số: {articles.length} bài viết ({articles.filter(a => isArticleDraft(a)).length} bản nháp) đã lưu trữ trong hệ thống Git
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchLiveArticles}
            disabled={isLoadingList}
            title="Tải lại danh sách bài viết mới nhất từ Git"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1C7BD',
              color: '#3A251B',
              padding: '10px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isLoadingList ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={15} />
            <span>{isLoadingList ? 'Đang tải...' : 'Làm mới danh sách'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublishNewsModule}
            disabled={isPublishingNews}
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
              cursor: isPublishingNews ? 'not-allowed' : 'pointer'
            }}
          >
            <Sparkles size={16} />
            <span>{isPublishingNews ? 'Đang cập nhật...' : 'Cập nhật tin tức lên website'}</span>
          </button>

          <Link
            to="/admin/news/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F4A83A',
              color: '#3A251B',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
            }}
          >
            <Plus size={18} />
            <span>Tạo bài viết mới</span>
          </Link>
        </div>
      </div>

      {/* Status Feedback Alert */}
      {statusMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
          border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        border: '1.5px solid #EADFCC',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8C827A' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, nguồn báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px 9px 38px',
              borderRadius: '8px',
              border: '1.5px solid #D1C7BD',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'press', label: 'Báo chí đưa tin' },
            { id: 'company', label: 'Hoạt động nội bộ' },
            { id: 'draft', label: 'Bản nháp (Ẩn)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat.id ? '#3A251B' : '#FAF7F2',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#6E6259',
                borderColor: selectedCategory === cat.id ? '#3A251B' : '#D1C7BD'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #EADFCC',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EADFCC', color: '#6E6259' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Ảnh</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Tiêu đề & Slug</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Trạng thái / Nguồn</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Ngày xuất bản</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: '#8C827A' }}>
                    <Newspaper size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    <p style={{ margin: 0 }}>Không tìm thấy bài viết nào phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((a) => {
                  const draft = isArticleDraft(a);
                  return (
                    <tr key={a.slug || a.id} style={{ borderBottom: '1px solid #F0EAE1' }}>
                      <td style={{ padding: '12px 18px', width: '60px' }}>
                        <img
                          src={a.cover_image}
                          alt={a.title_vi}
                          style={{ width: '54px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#EADFCC' }}
                        />
                      </td>
                      <td style={{ padding: '12px 18px', maxWidth: '380px' }}>
                        <div style={{ fontWeight: 600, color: '#3A251B', marginBottom: '2px', lineHeight: 1.35 }}>
                          {a.title_vi}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8C827A', fontFamily: 'monospace' }}>
                          /{a.slug}
                        </div>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: draft ? '#FEF3C7' : '#ECFDF5',
                              color: draft ? '#B45309' : '#047857',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              border: `1px solid ${draft ? '#FDE68A' : '#A7F3D0'}`
                            }}>
                              {draft ? 'Bản nháp (Ẩn công khai)' : 'Đã xuất bản'}
                            </span>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: a.category === 'press' ? '#EFF6FF' : '#F3F4F6',
                              color: a.category === 'press' ? '#1D4ED8' : '#374151',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}>
                              {a.category === 'press' ? 'Báo chí' : 'Doanh nghiệp'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#6E6259' }}>
                            Nguồn: {a.source}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 18px', color: '#6E6259', fontSize: '0.82rem' }}>
                        {a.dateVi || a.published_at}
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {draft ? (
                            <span
                              title="Bản nháp không hiển thị công khai trên website"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#F3F4F6',
                                color: '#9CA3AF',
                                border: '1px solid #E5E7EB',
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'not-allowed'
                              }}
                            >
                              <EyeOff size={14} />
                            </span>
                          ) : (
                            <Link
                              to={`/tin-tuc/${a.slug}`}
                              target="_blank"
                              title="Xem bài viết trên web"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#FAF7F2',
                                color: '#6E6259',
                                border: '1px solid #D1C7BD',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              <Eye size={14} />
                            </Link>
                          )}

                          <Link
                            to={`/admin/news/${a.slug}/edit`}
                            title="Chỉnh sửa bài viết"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#FFF7EC',
                              color: '#3A251B',
                              border: '1px solid #EADFCC',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={13} />
                            <span>Sửa</span>
                          </Link>

                          <button
                            onClick={() => setDeletingSlug(a.slug)}
                            title="Xóa bài viết"
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingSlug && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#DC2626', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} />
              <span>Xác nhận xóa bài viết?</span>
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#3A251B', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{deletingSlug}"</strong>? Thao tác này sẽ xóa file JSON tương ứng trong kho dữ liệu Git.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeletingSlug(null)}
                disabled={isDeleting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D1C7BD',
                  backgroundColor: '#FAF7F2',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.86rem'
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDelete(deletingSlug)}
                disabled={isDeleting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.86rem'
                }}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsList;
