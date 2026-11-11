import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { COMPANY_INFO } from '../../data/company';

interface FooterProps {
  onOpenQuote?: (product?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote }) => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isVi = language === 'vi';

  const navItems = [
    { to: '/', label: t('nav.home', 'Home') },
    { to: '/about', label: t('nav.about', 'About Us') },
    { to: '/products', label: t('nav.products', 'Products') },
    { to: '/quality', label: t('nav.quality', 'Our Quality') },
    { to: '/markets', label: t('nav.globalMarket', 'Global Market') },
    { to: '/news', label: t('nav.news', 'Press & Media') },
    { to: '/brochure', label: t('nav.brochure', 'Company Brochure') },
    { to: '/contact', label: t('nav.contact', 'Contact') },
  ];

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
    <footer className="site-footer" id="site-footer">
      {/* Subtle organic curve accents near section edges */}
      <svg
        className="footer-organic-curve"
        viewBox="0 0 1440 160"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 120C280 54 640 164 1020 96C1220 60 1360 28 1440 48"
          stroke="#EADFCC"
          strokeWidth="1.5"
        />
        <path
          d="M0 144C340 88 720 158 1120 112C1270 95 1375 78 1440 86"
          stroke="#F4A83A"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
      </svg>

      {/* Restrained approved mango artwork near lower-left edge */}
      <img
        src="/assets/illustrations/mango-whole.webp"
        alt=""
        aria-hidden="true"
        className="footer-deco-mango"
        loading="lazy"
      />

      {/* Restrained tropical green leaf sprig near lower-right edge */}
      <svg
        className="footer-deco-leaves"
        viewBox="0 0 140 120"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M126 112C96 86 82 54 90 18C118 42 132 76 126 112Z"
          fill="#4B7851"
          fillOpacity="0.24"
        />
        <path
          d="M120 114C80 104 46 84 22 54C62 52 98 74 120 114Z"
          fill="#3E6743"
          fillOpacity="0.2"
        />
        <path
          d="M90 22C94 58 106 88 125 110"
          stroke="#FFF7EC"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
      </svg>

      <div className="container footer-main-container">
        {/* Approved 3-Column Editorial Grid: VINAXO Brand (33%) | Explore VINAXO (20%) | Let's Work Together (47%) */}
        <div className="footer-three-col-grid">
          {/* Column 1: Left — Prominent VINAXO Brand Identity */}
          <div className="footer-col footer-col-brand">
            <Link
              to="/"
              onClick={() => handleFooterLinkClick('/')}
              className="brand-logo footer-logo"
              aria-label="VINAXO - Home"
            >
              <div className="brand-icon footer-brand-mark">
                <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                  <source srcSet="/assets/logo/vinaxo-brochure-badge.webp" type="image/webp" />
                  <img
                    src="/assets/logo/vinaxo-brochure-badge.png"
                    alt="VINAXO official mark"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </picture>
              </div>
              <div className="brand-text-wrap">
                <span className="brand-name footer-brand-name">VINAXO</span>
                <span className="brand-tagline footer-brand-tagline">
                  {isVi
                    ? 'NHÀ SẢN XUẤT TRÁI CÂY SẤY NHIỆT ĐỚI'
                    : 'TROPICAL DRIED FRUIT MANUFACTURER'}
                </span>
              </div>
            </Link>

            <p className="footer-brand-desc">
              {isVi
                ? 'Trái cây sấy nhiệt đới và đồ ăn nhẹ lành mạnh chuẩn Việt Nam, chế biến cho đối tác bán lẻ, dịch vụ ẩm thực và nhãn hàng riêng toàn cầu.'
                : 'Premium Vietnamese tropical dried fruit and wholesome snacks, crafted for global retail, food-service and private-label partners.'}
            </p>

            <div className="footer-cta-row">
              {onOpenQuote ? (
                <button
                  type="button"
                  onClick={() => onOpenQuote()}
                  className="footer-primary-cta"
                >
                  <span>{isVi ? 'Yêu Cầu Báo Giá' : 'Request a Quote'}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ) : (
                <Link
                  to="/contact"
                  onClick={() => handleFooterLinkClick('/contact')}
                  className="footer-primary-cta"
                >
                  <span>{isVi ? 'Yêu Cầu Báo Giá' : 'Request a Quote'}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>

          {/* Column 2: Center — EXPLORE VINAXO Vertical Navigation */}
          <nav
            className="footer-col footer-col-nav"
            aria-label={isVi ? 'Khám phá VINAXO' : 'Explore VINAXO'}
          >
            <h2 className="footer-explore-heading">
              {isVi ? 'KHÁM PHÁ VINAXO' : 'EXPLORE VINAXO'}
            </h2>
            <ul className="footer-nav-vertical">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => handleFooterLinkClick(item.to)}
                    className="footer-nav-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Right — LET'S WORK TOGETHER + Contact Info & QR */}
          <div className="footer-col footer-col-contact">
            <h2 className="footer-contact-heading">
              {isVi ? 'HỢP TÁC CÙNG VINAXO' : "LET'S WORK TOGETHER"}
            </h2>
            <div className="footer-heading-rule" aria-hidden="true" />

            <div className="footer-contact-layout">
              <div className="footer-contact-details">
                <div className="footer-contact-company">
                  {isVi ? COMPANY_INFO.legalNameVi : COMPANY_INFO.shortName}
                </div>

                <div className="footer-contact-item">
                  <MapPin size={17} className="footer-contact-icon" aria-hidden="true" />
                  <span>
                    {isVi
                      ? COMPANY_INFO.headquarters.addressVi
                      : COMPANY_INFO.headquarters.addressEn}
                  </span>
                </div>

                <div className="footer-contact-item">
                  <Phone size={17} className="footer-contact-icon" aria-hidden="true" />
                  <a href={`tel:${COMPANY_INFO.contacts.hotline}`} className="footer-contact-link">
                    {COMPANY_INFO.contacts.phoneDisplay}
                  </a>
                </div>

                <div className="footer-contact-item">
                  <Mail size={17} className="footer-contact-icon" aria-hidden="true" />
                  <a href={`mailto:${COMPANY_INFO.contacts.email}`} className="footer-contact-link">
                    {COMPANY_INFO.contacts.email}
                  </a>
                </div>

                <div className="footer-contact-item">
                  <Globe size={17} className="footer-contact-icon" aria-hidden="true" />
                  <a
                    href={COMPANY_INFO.contacts.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-link"
                  >
                    {COMPANY_INFO.contacts.websiteDisplay}
                  </a>
                </div>
              </div>

              {/* Approved Scannable Contact QR Card */}
              <div className="footer-qr-card">
                <div className="footer-qr-frame">
                  <picture>
                    <source srcSet="/assets/images/contact-qr-jimmy.webp" type="image/webp" />
                    <img
                      src="/assets/images/contact-qr-jimmy.jpg"
                      alt={
                        isVi
                          ? 'Mã QR danh bạ kinh doanh Mạnh Cường (Jimmy)'
                          : 'Scan QR code for direct sales contact Mạnh Cường (Jimmy)'
                      }
                      width={104}
                      height={104}
                      className="footer-qr-img"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="footer-qr-caption">
                  <span className="footer-qr-name">Mạnh Cường (Jimmy)</span>
                  <span className="footer-qr-note">
                    {isVi ? 'Quét mã để lưu danh bạ' : 'Scan QR to save contact'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Mango-Orange Full-Width Copyright Strip */}
      <div className="footer-bottom-strip">
        <div className="container footer-bottom-inner">
          <div className="footer-legal-line">
            © {currentYear}{' '}
            {isVi
              ? `${COMPANY_INFO.legalNameVi} · MST: ${COMPANY_INFO.taxCode} · Bảo lưu mọi quyền.`
              : `${COMPANY_INFO.shortName} (${COMPANY_INFO.legalNameEn}) · Tax ID: ${COMPANY_INFO.taxCode} · All rights reserved.`}
          </div>
        </div>
      </div>
    </footer>
  );
};
