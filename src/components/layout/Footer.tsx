import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage, pickLocale } from '../../i18n/LanguageContext';
import {
  COMPANY_INFO,
  getCompanyAddress,
  getCompanyIntro,
  getLegalCompanyName,
} from '../../data/company';

interface FooterProps {
  onOpenQuote?: (product?: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const legalName = getLegalCompanyName(language);
  const companyAddress = getCompanyAddress(language);
  const companyIntro = getCompanyIntro(language);

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
                  {pickLocale(language, {
                    vi: 'NHÀ SẢN XUẤT TRÁI CÂY SẤY NHIỆT ĐỚI',
                    en: 'TROPICAL DRIED FRUIT MANUFACTURER',
                    ko: '열대 건조 과일 제조·수출 전문 기업',
                    'zh-CN': '热带果干生产与出口制造商',
                  })}
                </span>
              </div>
            </Link>

            <p className="footer-brand-desc">{companyIntro}</p>

            {/* Verified direct contact/website icon links only */}
            <div
              className="footer-verified-icons"
              aria-label={pickLocale(language, {
                vi: 'Kênh liên hệ trực tiếp VINAXO',
                en: 'VINAXO verified contact links',
                ko: 'VINAXO 공식 연락 채널',
                'zh-CN': 'VINAXO 官方直接联系渠道',
              })}
            >
              <a
                href={COMPANY_INFO.contacts.website}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
                aria-label={pickLocale(language, {
                  vi: 'Website chính thức VINAXO',
                  en: 'VINAXO Official Website',
                  ko: 'VINAXO 공식 웹사이트',
                  'zh-CN': 'VINAXO 官方网站',
                })}
                title={COMPANY_INFO.contacts.websiteDisplay}
              >
                <Globe size={17} aria-hidden="true" />
              </a>
              <a
                href={`mailto:${COMPANY_INFO.contacts.email}`}
                className="footer-icon-btn"
                aria-label={pickLocale(language, {
                  vi: 'Gửi email đến VINAXO',
                  en: 'Email VINAXO',
                  ko: 'VINAXO에 이메일 보내기',
                  'zh-CN': '发送邮件至 VINAXO',
                })}
                title={COMPANY_INFO.contacts.email}
              >
                <Mail size={17} aria-hidden="true" />
              </a>
              <a
                href={`tel:${COMPANY_INFO.contacts.hotline}`}
                className="footer-icon-btn"
                aria-label={pickLocale(language, {
                  vi: 'Gọi hotline VINAXO',
                  en: 'Call VINAXO Hotline',
                  ko: 'VINAXO 핫라인 전화',
                  'zh-CN': '拨打 VINAXO 热线',
                })}
                title={COMPANY_INFO.contacts.phoneDisplay}
              >
                <Phone size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* CENTER REGION — EXPLORE NAVIGATION (Two Columns) */}
          <nav
            className="footer-col footer-col-nav"
            aria-label={pickLocale(language, {
              vi: 'Khám phá VINAXO',
              en: 'Explore VINAXO',
              ko: 'VINAXO 바로가기',
              'zh-CN': '探索 VINAXO',
            })}
          >
            <h2 className="footer-section-heading">
              {pickLocale(language, {
                vi: 'KHÁM PHÁ',
                en: 'EXPLORE',
                ko: '바로가기',
                'zh-CN': '快速导航',
              })}
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
              {pickLocale(language, {
                vi: 'LIÊN HỆ',
                en: 'GET IN TOUCH',
                ko: '연락처 정보',
                'zh-CN': '联系信息',
              })}
            </h2>

            <div className="footer-contact-details">
              <div className="footer-contact-company">{legalName}</div>

              <div className="footer-contact-item">
                <MapPin size={17} className="footer-contact-icon" aria-hidden="true" />
                <span>{companyAddress}</span>
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

      {/* Full-Width Mango-Orange Copyright Strip — Single canonical legal entity name */}
      <div className="footer-bottom-strip">
        <div className="container footer-bottom-inner">
          <div className="footer-legal-line">
            © {currentYear}{' '}
            {pickLocale(language, {
              vi: `${legalName} · MST: ${COMPANY_INFO.taxCode} · Bảo lưu mọi quyền.`,
              en: `${legalName} · Tax ID: ${COMPANY_INFO.taxCode} · All rights reserved.`,
              ko: `${legalName} · 사업자등록번호: ${COMPANY_INFO.taxCode} · All rights reserved.`,
              'zh-CN': `${legalName} · 企业税号: ${COMPANY_INFO.taxCode} · All rights reserved.`,
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
