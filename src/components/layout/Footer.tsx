import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Award, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { COMPANY_INFO } from '../../data/company';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const isVi = language === 'vi';

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
              <Link to="/" style={{ display: 'inline-block' }}>
                <img
                  src="/assets/logo/vinaxo-logo.svg"
                  alt="VINAXO"
                  style={{
                    height: '40px',
                    width: 'auto',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
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
                <Globe
                  size={18}
                  style={{ color: '#A3E6B8', flexShrink: 0 }}
                />
                <a
                  href={COMPANY_INFO.contacts.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#A3E6B8' }}
                >
                  vinaxo.net
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Compliance & Developed by SONAI */}
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
              {isVi ? 'Tiêu Chuẩn & Phát Triển' : 'Standards & Engineering'}
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.85rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Award size={18} style={{ color: '#FCD34D' }} />
                <span>BRCGS Food Safety Grade B</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <ShieldCheck size={18} style={{ color: '#34D399' }} />
                <span>3-Star OCOP Certified Produce</span>
              </div>

              <div
                style={{
                  marginTop: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  ENGINEERED & POWERED BY
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '1px',
                  }}
                >
                  SONAI
                </div>
                <div
                  style={{
                    fontSize: '0.76rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginTop: '2px',
                  }}
                >
                  Advanced Enterprise Web Solutions
                </div>
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
