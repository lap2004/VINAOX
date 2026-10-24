import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { language } = useLanguage();

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
          fontWeight: 800,
          fontFamily: 'var(--font-serif)',
          color: 'var(--primary-green)',
          lineHeight: 1,
          marginBottom: '1rem'
        }}>
          404
        </div>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--forest-green)',
          marginBottom: '1rem'
        }}>
          {language === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found'}
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--muted-text)',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          {language === 'vi'
            ? 'Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới. Vui lòng quay lại trang chủ hoặc kiểm tra danh mục sản phẩm VINAXO.'
            : 'The page you requested does not exist or has been moved. Please return to the homepage or explore our verified export catalog.'}
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="primary" icon={<Home size={18} />}>
              {language === 'vi' ? 'Trang chủ' : 'Return Home'}
            </Button>
          </Link>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              {language === 'vi' ? 'Xem sản phẩm' : 'Our Products'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
