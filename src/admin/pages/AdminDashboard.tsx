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
  TrendingUp,
  FileText,
  GitBranch
} from 'lucide-react';
import { getAllArticles, isArticleDraft } from '../../services/contentService';
import { productsData } from '../../data/products';
import { ArticleContent } from '../../types/content';
import { adminFetch } from '../lib/adminFetch';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminDashboard: React.FC = () => {
  const { repoMeta } = useAdminAuth();
  const [articles, setArticles] = useState<ArticleContent[]>(() => getAllArticles({ includeDrafts: true }));
  const [productsCount, setProductsCount] = useState<number>(productsData.length);
  const [mediaCount, setMediaCount] = useState<number>(0);

  const publishedArticles = articles.filter(a => !isArticleDraft(a));
  const draftArticles = articles.filter(a => isArticleDraft(a));

  useEffect(() => {
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
      .catch(() => setMediaCount(0));
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Title & Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#3A251B', margin: '0 0 6px 0' }}>
          Tổng quan Quản trị VINAXO
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6E6259', margin: 0 }}>
          Hệ thống quản lý nội dung số, cập nhật bài viết báo chí và danh mục {productsCount} sản phẩm xuất khẩu.
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Tin tức */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          border: '1.5px solid #EADFCC',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#6E6259' }}>Bài viết & Báo chí</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Newspaper size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
            {articles.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={13} />
              {publishedArticles.length} công khai
            </span>
            {draftArticles.length > 0 && (
              <span style={{ color: '#B45309' }}>• {draftArticles.length} bản nháp</span>
            )}
          </div>
        </div>

        {/* Card 2: Sản phẩm */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          border: '1.5px solid #EADFCC',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#6E6259' }}>Sản phẩm nhiệt đới</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
            {productsCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6E6259' }}>
            <span>Đạt chuẩn xuất khẩu BRCGS</span>
          </div>
        </div>

        {/* Card 3: Hình ảnh */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          border: '1.5px solid #EADFCC',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#6E6259' }}>Thư viện Media (Uploads)</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <Image size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
            {mediaCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6E6259' }}>
            <span>Tối ưu WebP / JPG / PNG</span>
          </div>
        </div>

        {/* Card 4: Cơ chế lưu trữ */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          border: '1.5px solid #EADFCC',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#6E6259' }}>Hạ tầng CMS</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
            Git-Based
          </div>
          <div style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GitBranch size={13} />
            <span>{repoMeta ? `${repoMeta.repo} (${repoMeta.branch})` : 'Không phụ thuộc runtime DB'}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
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
          to="/admin/brochure"
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
          <FileText size={18} />
          <span>Cấu hình Brochure</span>
        </Link>
      </div>

      {/* Recent Articles Table */}
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
