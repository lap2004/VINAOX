import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, ArrowRight, Check } from 'lucide-react';
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
  const langTimerRef = useRef<number | null>(null);
  const wasOpenedByClickRef = useRef<boolean>(false);

  // Monitor scroll for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown on outside click (mouse or touch)
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
        wasOpenedByClickRef.current = false;
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangOpen(false);
        wasOpenedByClickRef.current = false;
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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

  const handleMouseEnterLang = () => {
    if (langTimerRef.current) {
      window.clearTimeout(langTimerRef.current);
      langTimerRef.current = null;
    }
    setIsLangOpen(true);
  };

  const handleMouseLeaveLang = () => {
    // If opened by explicit click or tap, do not auto-close on mouse leave
    if (wasOpenedByClickRef.current) return;
    if (langTimerRef.current) {
      window.clearTimeout(langTimerRef.current);
    }
    // Grace delay prevents abrupt closing when moving between button and menu
    langTimerRef.current = window.setTimeout(() => {
      setIsLangOpen(false);
      langTimerRef.current = null;
    }, 250);
  };

  const handleToggleLangClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (langTimerRef.current) {
      window.clearTimeout(langTimerRef.current);
      langTimerRef.current = null;
    }
    setIsLangOpen((prev) => {
      const next = !prev;
      wasOpenedByClickRef.current = next;
      return next;
    });
  };

  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
    wasOpenedByClickRef.current = false;
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
        <div className="header-container">
          {/* Zone 1: Brand Logo Left */}
          <div className="header-logo-zone">
            <Link to="/" className="brand-logo" aria-label="VINAXO - Home">
              <div className="brand-icon">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 26C8 16 16 8 26 6C24 16 16 24 6 26Z" fill="#174D32" />
                  <path d="M12 20C14 14 18 10 24 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="brand-text-wrap">
                <span className="brand-name">VINAXO</span>
                <span className="brand-tagline">
                  {language === 'vi'
                    ? 'HƯƠNG VỊ TỰ NHIÊN | VƯƠN TẦM QUỐC TẾ'
                    : 'NATURAL GOODNESS | GLOBAL REACH'}
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Desktop Navigation Links Center */}
          <nav
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Header Action Controls Right */}
          <div className="header-actions">
            {/* Language Selector Dropdown */}
            <div
              ref={langRef}
              style={{ position: 'relative' }}
              onMouseEnter={handleMouseEnterLang}
              onMouseLeave={handleMouseLeaveLang}
            >
              <button
                type="button"
                onClick={handleToggleLangClick}
                aria-expanded={isLangOpen}
                aria-haspopup="true"
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
                  minWidth: '76px',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Globe size={14} color="var(--primary-green)" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown
                  size={13}
                  style={{
                    transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Dropdown Menu Container (paddingTop creates invisible bridge so mouse never exits parent) */}
              {isLangOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    paddingTop: '6px',
                    zIndex: 900,
                  }}
                  onMouseEnter={handleMouseEnterLang}
                  onMouseLeave={handleMouseLeaveLang}
                >
                  <div
                    role="menu"
                    style={{
                      minWidth: '84px',
                      width: '100%',
                      backgroundColor: 'var(--white)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
                      padding: '4px',
                      animation: 'dropdownFade 0.18s ease',
                    }}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectLang('vi')}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
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
                        fontWeight: language === 'vi' ? 700 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <span>VI</span>
                      {language === 'vi' && (
                        <Check size={13} strokeWidth={2.5} color="var(--forest-green)" />
                      )}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectLang('en')}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
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
                        fontWeight: language === 'en' ? 700 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <span>EN</span>
                      {language === 'en' && (
                        <Check size={13} strokeWidth={2.5} color="var(--forest-green)" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Request a Quote CTA Button - fixed minimum width prevents layout jitter */}
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="btn btn-primary btn-sm header-quote-btn"
              style={{
                padding: '9px 18px',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-pill)',
                minWidth: '172px',
                justifyContent: 'center',
                flexShrink: 0,
                whiteSpace: 'nowrap',
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
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="brand-logo"
                style={{ width: 'auto', minWidth: 'auto', textDecoration: 'none' }}
                aria-label="VINAXO - Home"
              >
                <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 26C8 16 16 8 26 6C24 16 16 24 6 26Z" fill="#174D32" />
                    <path d="M12 20C14 14 18 10 24 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="brand-text-wrap">
                  <span className="brand-name" style={{ fontSize: '1.25rem' }}>VINAXO</span>
                  <span className="brand-tagline" style={{ fontSize: '0.44rem' }}>
                    {language === 'vi'
                      ? 'HƯƠNG VỊ TỰ NHIÊN | VƯƠN TẦM QUỐC TẾ'
                      : 'NATURAL GOODNESS | GLOBAL REACH'}
                  </span>
                </div>
              </Link>
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
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border:
                      language === 'vi'
                        ? '1px solid var(--primary-green)'
                        : '1px solid var(--color-border)',
                    backgroundColor:
                      language === 'vi' ? 'var(--primary-green)' : 'transparent',
                    color: language === 'vi' ? '#FFFFFF' : 'var(--color-heading)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>VI</span>
                  {language === 'vi' && <Check size={15} strokeWidth={2.5} />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLang('en')}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border:
                      language === 'en'
                        ? '1px solid var(--primary-green)'
                        : '1px solid var(--color-border)',
                    backgroundColor:
                      language === 'en' ? 'var(--primary-green)' : 'transparent',
                    color: language === 'en' ? '#FFFFFF' : 'var(--color-heading)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>EN</span>
                  {language === 'en' && <Check size={15} strokeWidth={2.5} />}
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
