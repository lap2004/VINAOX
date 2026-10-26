import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Heart } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { COMPANY_INFO } from '../../data/company';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isVi = language === 'vi';

  const handleFooterLinkClick = (to: string) => {
    const isCurrentPage =
      location.pathname === to ||
      (to === '/' && (location.pathname === '' || location.pathname === '/'));

    if (isCurrentPage) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      const htmlEl = document.documentElement;
      const originalBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = 'auto';

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      htmlEl.scrollTop = 0;
      document.body.scrollTop = 0;

      requestAnimationFrame(() => {
        htmlEl.style.scrollBehavior = originalBehavior;
      });
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--forest-green)',
        color: 'rgba(255, 255, 255, 0.85)',
        paddingTop: 'clamp(56px, 7vw, 84px)',
        paddingBottom: '36px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container">
        {/* 4-Column Corporate Grid */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.9fr 1.3fr 1fr',
            gap: 'clamp(28px, 4vw, 56px)',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand & Legal */}
          <div>
            <div style={{ marginBottom: '18px' }}>
              <Link
                to="/"
                onClick={() => handleFooterLinkClick('/')}
                className="brand-logo footer-logo"
                aria-label="VINAXO - Home"
                style={{ display: 'flex', width: 'auto', minWidth: 0, textDecoration: 'none' }}
              >
                <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 26C8 16 16 8 26 6C24 16 16 24 6 26Z" fill="#FFFFFF" />
                    <path d="M12 20C14 14 18 10 24 8" stroke="#174D32" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="brand-text-wrap">
                  <span className="brand-name" style={{ color: '#FFFFFF' }}>VINAXO</span>
                  <span className="brand-tagline" style={{ color: '#A6C9AD' }}>
                    {language === 'vi'
                      ? 'HƯƠNG VỊ TỰ NHIÊN | VƯƠN TẦM QUỐC TẾ'
                      : 'NATURAL GOODNESS | GLOBAL REACH'}
                  </span>
                </div>
              </Link>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '16px',
              }}
            >
              {isVi
                ? 'Công ty TNHH VINAXO — Doanh nghiệp chế biến và xuất khẩu trái cây sấy dẻo tự nhiên hàng đầu từ vùng đồng bằng sông Cửu Long. Đáp ứng chuẩn quốc tế BRCGS và OCOP 3 sao.'
                : 'VINAXO Company Limited — Leading processor and exporter of naturally pure soft-dried tropical fruits from the Mekong Delta, certified under BRCGS Grade B and 3-Star OCOP standards.'}
            </p>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div>
                <strong style={{ color: '#FFFFFF' }}>
                  {isVi ? 'Pháp nhân:' : 'Entity:'}
                </strong>{' '}
                {isVi ? COMPANY_INFO.legalNameVi : COMPANY_INFO.legalNameEn}
              </div>
              <div>
                <strong style={{ color: '#FFFFFF' }}>
                  {isVi ? 'Mã số thuế:' : 'Tax ID:'}
                </strong>{' '}
                <span style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                  {COMPANY_INFO.taxCode}
                </span>{' '}
                ({isVi ? 'Sở KH&ĐT Tiền Giang cấp' : 'Tien Giang DPI'})
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {t('nav.about', 'Quick Links')}
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '0.88rem',
              }}
            >
              <li>
                <Link
                  to="/"
                  onClick={() => handleFooterLinkClick('/')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.home', 'Home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => handleFooterLinkClick('/about')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.about', 'About Us')}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  onClick={() => handleFooterLinkClick('/products')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.products', 'Products & Specifications')}
                </Link>
              </li>
              <li>
                <Link
                  to="/quality"
                  onClick={() => handleFooterLinkClick('/quality')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.quality', 'Our Quality & Facility')}
                </Link>
              </li>
              <li>
                <Link
                  to="/markets"
                  onClick={() => handleFooterLinkClick('/markets')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.globalMarket', 'Global Export Markets')}
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  onClick={() => handleFooterLinkClick('/news')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.news', 'Press & Media')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => handleFooterLinkClick('/contact')}
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')
                  }
                >
                  {t('nav.contact', 'Contact & Quotes')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Facility */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {isVi ? 'Liên Hệ & Nhà Máy' : 'Contact & Facility'}
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '0.88rem',
              }}
            >
              <div
                className="footer-contact-item"
                style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
              >
                <MapPin
                  size={18}
                  style={{ color: '#A3E6B8', flexShrink: 0, marginTop: '2px' }}
                />
                <span>
                  {isVi
                    ? COMPANY_INFO.headquarters.addressVi
                    : COMPANY_INFO.headquarters.addressEn}
                </span>
              </div>
              <div
                className="footer-contact-item"
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <Phone
                  size={18}
                  style={{ color: '#A3E6B8', flexShrink: 0 }}
                />
                <a
                  href={`tel:${COMPANY_INFO.contacts.hotline}`}
                  style={{ color: '#FFFFFF', fontWeight: 600 }}
                >
                  {COMPANY_INFO.contacts.phoneDisplay}
                </a>
              </div>
              <div
                className="footer-contact-item"
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <Mail
                  size={18}
                  style={{ color: '#A3E6B8', flexShrink: 0 }}
                />
                <a
                  href={`mailto:${COMPANY_INFO.contacts.email}`}
                  style={{ color: '#FFFFFF' }}
                >
                  {COMPANY_INFO.contacts.email}
                </a>
              </div>
              <div
                className="footer-contact-item"
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <a
                  href="https://vinaxo.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#A3E6B8',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#A3E6B8')
                  }
                >
                  <Globe
                    size={18}
                    style={{ flexShrink: 0 }}
                  />
                  <span>vinaxo.vn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Developed by SONAI */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {isVi ? 'Phát Triển Bởi' : 'Developed By'}
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  lineHeight: 1.2,
                }}
              >
                SONAI
              </div>

              <div
                style={{
                  fontSize: '0.88rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {isVi
                  ? 'Công Nghệ Trí Tuệ Nhân Tạo'
                  : 'Artificial Intelligence Technology'}
              </div>

              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.5,
                  margin: '2px 0 6px 0',
                }}
              >
                Website Designed & Developed by SONAI.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '2px',
                }}
              >
                <a
                  href="https://sonai.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#A3E6B8',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#FFFFFF')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = '#A3E6B8')
                  }
                >
                  <Globe size={15} style={{ flexShrink: 0 }} />
                  <span>sonai.vn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Verified Statement */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          <div>
            © {currentYear} {COMPANY_INFO.legalNameEn}.{' '}
            {isVi ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>
              {isVi
                ? 'Dữ liệu doanh nghiệp & chứng nhận đã được kiểm toán xác minh.'
                : 'Audited & verified enterprise information.'}
            </span>
            <Heart size={13} color="#F87171" style={{ display: 'inline' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
