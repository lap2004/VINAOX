import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage, Language } from '../../i18n/LanguageContext';

export interface HeaderProps {
  onOpenQuote: (product?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { to: '/', label: t('nav.home', 'Home') },
    { to: '/about', label: t('nav.about', 'About Us') },
    { to: '/products', label: t('nav.products', 'Products') },
    { to: '/quality', label: t('nav.quality', 'Our Quality') },
    { to: '/markets', label: t('nav.globalMarket', 'Global Market') },
    { to: '/news', label: t('nav.news', 'Press & Media') },
    { to: '/contact', label: t('nav.contact', 'Contact') },
  ];

  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <>
      <header
        className={`site-header ${isScrolled ? 'is-sticky' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--header-height)',
          zIndex: 800,
          backgroundColor: isScrolled
            ? 'rgba(255, 255, 255, 0.94)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: isScrolled
            ? '1px solid var(--sage-border)'
            : '1px solid var(--color-border-subtle)',
          boxShadow: isScrolled
            ? '0 4px 20px rgba(16, 61, 42, 0.06)'
            : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo Brand */}
          <Link
            to="/"
            aria-label="VINAXO Homepage"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/logo/vinaxo-logo.svg"
              alt="VINAXO - Natural Goodness | Global Reach"
              style={{
                height: '42px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="desktop-nav"
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? 'var(--primary-green)'
                    : 'var(--color-heading)',
                  backgroundColor: isActive
                    ? 'rgba(45, 106, 79, 0.08)'
                    : 'transparent',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Action Controls */}
          <div
            className="header-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Language Selector Dropdown */}
            <div
              ref={langRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsLangOpen(true)}
              onMouseLeave={() => setIsLangOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-expanded={isLangOpen}
                aria-label="Change language"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: isLangOpen
                    ? 'var(--light-sage)'
                    : 'transparent',
                  color: 'var(--color-heading)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  minWidth: '68px',
                  justifyContent: 'center',
                }}
              >
                <Globe size={14} color="var(--primary-green)" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown size={13} />
              </button>

              {/* Dropdown Menu */}
              {isLangOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '6px',
                    width: '136px',
                    backgroundColor: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-md)',
                    padding: '6px',
                    zIndex: 900,
                    animation: 'dropdownFade 0.18s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectLang('vi')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor:
                        language === 'vi'
                          ? 'var(--light-sage)'
                          : 'transparent',
                      color:
                        language === 'vi'
                          ? 'var(--forest-green)'
                          : 'var(--color-heading)',
                      fontWeight: language === 'vi' ? 700 : 500,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>Tiếng Việt</span>
                    {language === 'vi' && (
                      <span style={{ fontSize: '0.75rem' }}>✓</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectLang('en')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor:
                        language === 'en'
                          ? 'var(--light-sage)'
                          : 'transparent',
                      color:
                        language === 'en'
                          ? 'var(--forest-green)'
                          : 'var(--color-heading)',
                      fontWeight: language === 'en' ? 700 : 500,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>English</span>
                    {language === 'en' && (
                      <span style={{ fontSize: '0.75rem' }}>✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Request a Quote CTA Button */}
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="btn btn-primary btn-sm header-quote-btn"
              style={{
                padding: '9px 18px',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <span>{t('nav.getQuote', 'Request a Quote')}</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                color: 'var(--color-heading)',
                cursor: 'pointer',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(12, 39, 23, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 850,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: 'var(--white)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)',
              overflowY: 'auto',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '20px',
              }}
            >
              <img
                src="/assets/logo/vinaxo-logo.svg"
                alt="VINAXO"
                style={{ height: '32px', width: 'auto' }}
              />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-heading)',
                  padding: '4px',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1,
              }}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? 'var(--forest-green)'
                      : 'var(--color-heading)',
                    backgroundColor: isActive
                      ? 'var(--light-sage)'
                      : 'transparent',
                    textDecoration: 'none',
                    display: 'block',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Drawer Language & Action */}
            <div
              style={{
                paddingTop: '20px',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleSelectLang('vi')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor:
                      language === 'vi' ? 'var(--primary-green)' : 'transparent',
                    color: language === 'vi' ? '#FFFFFF' : 'var(--color-heading)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang('en')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor:
                      language === 'en' ? 'var(--primary-green)' : 'transparent',
                    color: language === 'en' ? '#FFFFFF' : 'var(--color-heading)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  English
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{t('nav.getQuote', 'Request a Quote')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
