import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { COMPANY_INFO } from '../../data/company';

interface FooterProps {
  onOpenQuote?: (product?: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isVi = language === 'vi';

  const navColumnA = [
    { to: '/', label: t('nav.home', 'Home') },
    { to: '/about', label: t('nav.about', 'About Us') },
    { to: '/products', label: t('nav.products', 'Products') },
    { to: '/quality', label: t('nav.quality', 'Our Quality') },
  ];

  const navColumnB = [
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
      {/* Subtle warm organic wave near lower boundary */}
      <svg
        className="footer-organic-curve"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 92C320 42 740 116 1120 72C1270 54 1370 38 1440 48"
          stroke="#EADFCC"
          strokeWidth="1.25"
        />
        <path
          d="M0 108C360 66 780 118 1180 86C1310 75 1385 64 1440 70"
          stroke="#F4A83A"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
      </svg>

      {/* Restrained botanical leaf near upper-right edge */}
      <img
        src="/assets/illustrations-2026/palm-frond-2026.webp"
        alt=""
        aria-hidden="true"
        className="footer-deco-leaf-top"
        loading="lazy"
      />

      {/* Restrained mango slice & leaf near lower-right edge */}
      <img
        src="/assets/illustrations-2026/mango-leaf-2026.webp"
        alt=""
        aria-hidden="true"
        className="footer-deco-mango-bottom"
        loading="lazy"
      />

      <div className="container footer-main-container">
        {/* Minimal 3-Region Composition: VINAXO Brand (32%) | Explore (32%) | Get in Touch (36%) */}
        <div className="footer-three-col-grid">
          {/* LEFT REGION — VINAXO BRAND */}
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

            {/* Verified direct contact/website icon links only (zero invented social URLs) */}
            <div
              className="footer-verified-icons"
              aria-label={isVi ? 'Kênh liên hệ trực tiếp VINAXO' : 'VINAXO verified contact links'}
            >
              <a
                href={COMPANY_INFO.contacts.website}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
                aria-label={isVi ? 'Website chính thức VINAXO' : 'VINAXO Official Website'}
                title={COMPANY_INFO.contacts.websiteDisplay}
              >
                <Globe size={17} aria-hidden="true" />
              </a>
              <a
                href={`mailto:${COMPANY_INFO.contacts.email}`}
                className="footer-icon-btn"
                aria-label={isVi ? 'Gửi email đến VINAXO' : 'Email VINAXO'}
                title={COMPANY_INFO.contacts.email}
              >
                <Mail size={17} aria-hidden="true" />
              </a>
              <a
                href={`tel:${COMPANY_INFO.contacts.hotline}`}
                className="footer-icon-btn"
                aria-label={isVi ? 'Gọi hotline VINAXO' : 'Call VINAXO Hotline'}
                title={COMPANY_INFO.contacts.phoneDisplay}
              >
                <Phone size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* CENTER REGION — EXPLORE NAVIGATION (Two Columns) */}
          <nav
            className="footer-col footer-col-nav"
            aria-label={isVi ? 'Khám phá VINAXO' : 'Explore VINAXO'}
          >
            <h2 className="footer-section-heading">
              {isVi ? 'KHÁM PHÁ' : 'EXPLORE'}
            </h2>

            <div className="footer-nav-columns">
              <ul className="footer-nav-col">
                {navColumnA.map((item) => (
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

              <ul className="footer-nav-col">
                {navColumnB.map((item) => (
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
            </div>
          </nav>

          {/* RIGHT REGION — GET IN TOUCH */}
          <div className="footer-col footer-col-contact">
            <h2 className="footer-section-heading">
              {isVi ? 'LIÊN HỆ' : 'GET IN TOUCH'}
            </h2>

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
          </div>
        </div>
      </div>

      {/* Full-Width Mango-Orange Copyright Strip */}
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
