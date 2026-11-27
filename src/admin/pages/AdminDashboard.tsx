import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Newspaper, 
  Package, 
  Image, 
  Plus, 
  Edit3, 
  CheckCircle, 
  ArrowRight,
  FileText,
  GitBranch,
  Award,
  Building,
  Sparkles,
  RefreshCw,
  Clock,
  AlertCircle,
  Zap,
  Home,
  Info
} from 'lucide-react';
import { getAllArticles, isArticleDraft } from '../../services/contentService';
import { productsData } from '../../data/products';
import { ArticleContent } from '../../types/content';
import { adminFetch } from '../lib/adminFetch';
import { useAdminAuth } from '../context/AdminAuthContext';

interface PublishHistoryItem {
  id: string;
  module: string;
  moduleLabel: string;
  requestedBy: string;
  requestedAt: string;
  commitSha?: string;
  status: string;
  message: string;
}

export const AdminDashboard: React.FC = () => {
  const { repoMeta } = useAdminAuth();
  const [articles, setArticles] = useState<ArticleContent[]>(() => getAllArticles({ includeDrafts: true }));
  const [productsCount, setProductsCount] = useState<number>(productsData.length);
  const [mediaCount, setMediaCount] = useState<number>(0);
  const [certsCount, setCertsCount] = useState<number>(6);
  const [aboutGalleryStats, setAboutGalleryStats] = useState<{ total: number; visible: number }>({ total: 6, visible: 6 });
  
  const [publishingModule, setPublishingModule] = useState<string | null>(null);
  const [publishHistory, setPublishHistory] = useState<PublishHistoryItem[]>([]);
  const [deployStatus, setDeployStatus] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const publishedArticles = articles.filter(a => !isArticleDraft(a));
  const draftArticles = articles.filter(a => isArticleDraft(a));

  const loadData = async () => {
    try {
      const pubRes = await adminFetch('/api/admin/publish');
      if (pubRes.ok) {
        const pubData = await pubRes.json();
        if (pubData.ok) {
          if (Array.isArray(pubData.history)) setPublishHistory(pubData.history);
          if (pubData.latestDeployStatus) setDeployStatus(pubData.latestDeployStatus);
          if (pubData.stats?.certificates?.total) setCertsCount(pubData.stats.certificates.total);
          if (pubData.stats?.media?.total) setMediaCount(pubData.stats.media.total);
          if (pubData.stats?.aboutGallery) setAboutGalleryStats(pubData.stats.aboutGallery);
        }
      }
    } catch {}

    adminFetch('/api/admin/news')
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});

    adminFetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.products) && data.products.length > 0) {
          setProductsCount(data.products.length);
        }
      })
      .catch(() => {});

    adminFetch('/api/admin/media')
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.media)) {
          setMediaCount(data.media.length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePublish = async (moduleKey: string, moduleLabel: string) => {
    const confirmText = moduleKey === 'all' 
      ? 'Bạn có chắc chắn muốn xuất bản TOÀN BỘ website vinaxo.net?' 
      : `Bạn có muốn xuất bản cập nhật nhóm [${moduleLabel}] lên website?`;
    if (!window.confirm(confirmText)) return;

    try {
      setPublishingModule(moduleKey);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: moduleKey })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({
          type: 'success',
          text: data.message || `Đã kích hoạt xuất bản [${moduleLabel}] thành công!`
        });
        await loadData();
      } else {
        setStatusMsg({
          type: 'error',
          text: data.error || 'Không thể kích hoạt xuất bản.'
        });
      }
    } catch {
      setStatusMsg({
        type: 'error',
        text: 'Lỗi kết nối khi gửi yêu cầu xuất bản.'
      });
    } finally {
      setPublishingModule(null);
    }
  };

  const modulesList = [
    {
      key: 'homepage',
      name: 'Trang chủ & Danh mục',
      desc: 'Quản lý Hero, 4 Danh mục chính thức, Dòng OEM riêng & tối đa 4 Sản phẩm tiêu biểu',
      icon: <Home size={20} color="#D97706" />,
      bg: '#FFF8EC',
      link: '/admin/homepage',
      manageLabel: 'Quản lý trang chủ'
    },
    {
      key: 'news',
      name: 'Tin tức & Báo chí',
      desc: `${articles.length} bài viết (${publishedArticles.length} công khai, ${draftArticles.length} bản nháp)`,
      icon: <Newspaper size={20} color="#D97706" />,
      bg: '#FEF3C7',
      link: '/admin/news',
      manageLabel: 'Quản lý tin tức'
    },
    {
      key: 'about',
      name: 'Trang Về chúng tôi',
      desc: `${aboutGalleryStats.total} ảnh thư viện (${aboutGalleryStats.visible} hiển thị), nội dung & vùng nguyên liệu 4 ngôn ngữ`,
      icon: <Info size={20} color="#0D9488" />,
      bg: '#F0FDFA',
      link: '/admin/about',
      manageLabel: 'Quản lý Về chúng tôi'
    },
    {
      key: 'products',
      name: 'Danh mục Sản phẩm',
      desc: `${productsCount} sản phẩm nhiệt đới xuất khẩu`,
      icon: <Package size={20} color="#059669" />,
      bg: '#ECFDF5',
      link: '/admin/products',
      manageLabel: 'Quản lý sản phẩm'
    },
    {
      key: 'certificates',
      name: 'Chứng nhận Quốc tế',
      desc: `${certsCount} chứng nhận (BRCGS, FDA, ISO 22000, HACCP, Kosher, SMETA)`,
      icon: <Award size={20} color="#7C3AED" />,
      bg: '#F5F3FF',
      link: '/admin/certificates',
      manageLabel: 'Quản lý chứng nhận'
    },
    {
      key: 'media',
      name: 'Thư viện Hình ảnh',
      desc: `${mediaCount} hình ảnh đã tối ưu WebP/JPG trong hệ thống`,
      icon: <Image size={20} color="#2563EB" />,
      bg: '#EFF6FF',
      link: '/admin/media',
      manageLabel: 'Thư viện media'
    },
    {
      key: 'brochure',
      name: 'Hồ sơ năng lực Brochure',
      desc: 'Cấu hình file PDF và năm ấn bản hồ sơ xuất khẩu',
      icon: <FileText size={20} color="#EA580C" />,
      bg: '#FFF7ED',
      link: '/admin/brochure',
      manageLabel: 'Cấu hình brochure'
    },
    {
      key: 'company',
      name: 'Thông tin Doanh nghiệp',
      desc: 'Pháp nhân Công ty TNHH Vinaxo, MST, hotline, địa chỉ xưởng',
      icon: <Building size={20} color="#475569" />,
      bg: '#F1F5F9',
      link: '/admin/settings',
      manageLabel: 'Cài đặt chung'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Title & Greeting */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#3A251B', margin: '0 0 6px 0' }}>
            Tổng quan Quản trị VINAXO CMS
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#6E6259', margin: 0 }}>
            Hệ thống quản lý nội dung đa phân hệ (Module-based Publishing), lưu trữ Git bền vững và tự động triển khai Vercel.
          </p>
        </div>

        <button
          onClick={() => handlePublish('all', 'Toàn bộ website')}
          disabled={publishingModule !== null}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            border: 'none',
            cursor: publishingModule ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Zap size={18} />
          <span>{publishingModule === 'all' ? 'Đang cập nhật website...' : 'Cập nhật TOÀN BỘ website'}</span>
        </button>
      </div>

      {/* Status Feedback Alert */}
      {statusMsg && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
          border: `1.5px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Module Publishing Hub Grid */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
              Cập nhật Website theo từng Phân hệ (Module Publishing Hub)
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#6E6259', margin: '2px 0 0 0' }}>
              Xuất bản độc lập cho từng nhóm nội dung mà không ảnh hưởng tới các dữ liệu khác
            </p>
          </div>
          <button
            onClick={loadData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #D1C7BD',
              backgroundColor: '#FFFFFF',
              color: '#6E6259',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            <span>Làm mới</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '16px'
        }}>
          {modulesList.map((m) => (
            <div
              key={m.key}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                border: '1.5px solid #EADFCC',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: m.bg }}>
                      {m.icon}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#3A251B' }}>
                      {m.name}
                    </span>
                  </div>
                  <Link
                    to={m.link}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#F4A83A',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>{m.manageLabel}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#6E6259', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  {m.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F0EAE1' }}>
                <span style={{ fontSize: '0.78rem', color: '#8C827A', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <GitBranch size={13} />
                  <span>Git Branch: {repoMeta ? repoMeta.branch : 'main'}</span>
                </span>

                <button
                  type="button"
                  onClick={() => handlePublish(m.key, m.name)}
                  disabled={publishingModule !== null}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #10B981',
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: publishingModule ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Sparkles size={14} />
                  <span>{publishingModule === m.key ? 'Đang cập nhật...' : `Cập nhật ${m.name.split(' ')[0]} lên web`}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment & Publish History */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #EADFCC',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #EADFCC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#D97706" />
              <span>Lịch sử Xuất bản & Trạng thái Triển khai (Vercel)</span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#6E6259', margin: '2px 0 0 0' }}>
              Theo dõi lịch sử cập nhật phân hệ, mã commit Git và tiến trình build tự động
            </p>
          </div>

          {deployStatus && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: deployStatus.state === 'success' ? '#ECFDF5' : '#EFF6FF',
              color: deployStatus.state === 'success' ? '#047857' : '#1D4ED8',
              border: `1px solid ${deployStatus.state === 'success' ? '#A7F3D0' : '#BFDBFE'}`
            }}>
              <CheckCircle size={13} />
              <span>Vercel Deploy: {deployStatus.state?.toUpperCase()}</span>
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EADFCC', color: '#6E6259' }}>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Thời gian</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Phân hệ / Module</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Người xuất bản</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Mã Commit</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {publishHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '28px', textAlign: 'center', color: '#8C827A' }}>
                    Chưa có lịch sử xuất bản phân hệ nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                publishHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F0EAE1' }}>
                    <td style={{ padding: '12px 18px', color: '#6E6259' }}>
                      {new Date(item.requestedAt).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: '#3A251B' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#FFF7EC',
                        color: '#92400E',
                        border: '1px solid #FDE68A',
                        fontSize: '0.78rem'
                      }}>
                        {item.moduleLabel || item.module}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#6E6259' }}>
                      {item.requestedBy}
                    </td>
                    <td style={{ padding: '12px 18px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#2563EB' }}>
                      {item.commitSha ? item.commitSha.substring(0, 7) : 'Auto'}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#ECFDF5',
                        color: '#047857',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        <CheckCircle size={12} />
                        <span>Hoàn thành</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '32px'
      }}>
        <Link
          to="/admin/news/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F4A83A',
            color: '#3A251B',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
          }}
        >
          <Plus size={18} />
          <span>Viết bài báo / tin tức mới</span>
        </Link>

        <Link
          to="/admin/media"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            color: '#3A251B',
            border: '1.5px solid #D1C7BD',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          <Image size={18} />
          <span>Tải ảnh lên thư viện</span>
        </Link>

        <Link
          to="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            color: '#3A251B',
            border: '1.5px solid #D1C7BD',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          <Package size={18} />
          <span>Xem {productsCount} sản phẩm</span>
        </Link>

        <Link
          to="/admin/certificates"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            color: '#3A251B',
            border: '1.5px solid #D1C7BD',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          <Award size={18} />
          <span>Quản lý {certsCount} chứng nhận</span>
        </Link>
      </div>

      {/* Recent Articles Preview */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #EADFCC',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #EADFCC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
              Bài viết cập nhật gần đây
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#6E6259', margin: '2px 0 0 0' }}>
              Danh sách bài báo chí và tin tức doanh nghiệp đang lưu trữ trong hệ thống
            </p>
          </div>

          <Link
            to="/admin/news"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#F4A83A',
              textDecoration: 'none'
            }}
          >
            <span>Xem tất cả ({articles.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EADFCC', color: '#6E6259' }}>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Ảnh</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Tiêu đề tiếng Việt</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Trạng thái & Nguồn</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Ngày đăng</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {articles.slice(0, 5).map((a) => {
                const draft = isArticleDraft(a);
                return (
                  <tr key={a.slug || a.id} style={{ borderBottom: '1px solid #F0EAE1' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <img
                        src={a.cover_image}
                        alt={a.title_vi}
                        style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#EADFCC' }}
                      />
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: '#3A251B', maxWidth: '340px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.title_vi}
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#6E6259' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: draft ? '#F3F4F6' : '#ECFDF5',
                          color: draft ? '#4B5563' : '#047857',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {draft ? 'Bản nháp' : 'Công khai'}
                        </span>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {a.source}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#6E6259', fontSize: '0.82rem' }}>
                      {a.dateVi || a.published_at}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <Link
                        to={`/admin/news/${a.slug}/edit`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#FFF7EC',
                          color: '#3A251B',
                          border: '1px solid #EADFCC',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Sửa</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
