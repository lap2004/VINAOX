import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { pick } = useLanguage();

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      background: 'var(--cream-bg)'
    }}>
      <div style={{
        maxWidth: '560px',
        textAlign: 'center',
        padding: '3rem 2rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          fontSize: '5rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--vinaxo-red)',
          lineHeight: 1,
          marginBottom: '1rem'
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          fontSize: '2.1rem',
          fontWeight: 700,
          color: 'var(--dark-chocolate)',
          marginBottom: '1rem'
        }}>
          {pick({
            vi: 'Không tìm thấy trang',
            en: 'Page Not Found',
            ko: '페이지를 찾을 수 없습니다',
            zh: '未找到该页面'
          })}
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--muted-text)',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          {pick({
            vi: 'Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới. Vui lòng quay lại trang chủ hoặc kiểm tra danh mục sản phẩm VINAXO.',
            en: 'The page you requested does not exist or has been moved. Please return to the homepage or explore our verified export catalog.',
            ko: '요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다. 홈페이지로 돌아가거나 VINAXO 수출 제품 카탈로그를 확인해 주세요.',
            zh: '您访问的页面不存在或已迁移。请返回首页或浏览 VINAXO 出口产品目录。'
          })}
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="primary" icon={<Home size={18} />}>
              {pick({ vi: 'Trang chủ', en: 'Return Home', ko: '홈으로 돌아가기', zh: '返回首页' })}
            </Button>
          </Link>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              {pick({ vi: 'Xem sản phẩm', en: 'Our Products', ko: '제품 보기', zh: '浏览产品' })}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
