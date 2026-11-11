import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Phone, MessageCircle, FileText, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuoteModal } from '../ui/QuoteModal';
import { ScrollToTop } from '../ui/ScrollToTop';

export interface MainLayoutContext {
  onOpenQuote: (product?: string) => void;
}

export const MainLayout: React.FC = () => {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
  const [isQuickContactOpen, setIsQuickContactOpen] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  const handleOpenQuote = (product?: string) => {
    setSelectedProduct(product);
    setIsQuickContactOpen(false);
    setIsQuoteOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteOpen(false);
    setSelectedProduct(undefined);
  };

  // Hide consolidated floating hub when the footer itself is in view so it never covers footer links or QR/legal content
  useEffect(() => {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setIsFooterInView(visible);
        if (visible) {
          setIsQuickContactOpen(false);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isQuickContactOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickContactOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isQuickContactOpen]);

  return (
    <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Header onOpenQuote={handleOpenQuote} />
      <main style={{ flex: 1 }}>
        <Outlet context={{ onOpenQuote: handleOpenQuote } satisfies MainLayoutContext} />
      </main>
      <Footer onOpenQuote={handleOpenQuote} />

      {/* Consolidated B2B Quick Contact Hub (auto-yields cleanly when footer is visible) */}
      <div
        className={`floating-b2b-speed-dial${isFooterInView ? ' is-footer-visible' : ''}${
          isQuickContactOpen ? ' is-open' : ''
        }`}
        aria-label={isVi ? 'Liên hệ nhanh B2B' : 'B2B Quick Contact'}
        aria-hidden={isFooterInView}
      >
        {isQuickContactOpen && (
          <div id="b2b-quick-contact-panel" className="floating-contact-menu" role="region">
            <button
              type="button"
              onClick={() => handleOpenQuote()}
              className="floating-menu-item floating-menu-quote"
            >
              <FileText size={16} aria-hidden="true" />
              <span>{isVi ? 'Yêu Cầu Báo Giá B2B' : 'Request B2B Quote'}</span>
            </button>

            <a
              href="https://wa.me/84984815016"
              target="_blank"
              rel="noopener noreferrer"
              className="floating-menu-item"
            >
              <MessageCircle size={16} aria-hidden="true" />
              <span>WhatsApp (+84 984 815 016)</span>
            </a>

            <a
              href="https://zalo.me/0984815016"
              target="_blank"
              rel="noopener noreferrer"
              className="floating-menu-item"
            >
              <span className="floating-zalo-mark" aria-hidden="true">
                Zalo
              </span>
              <span>Zalo Official (0984 815 016)</span>
            </a>

            <a href="tel:+84984815016" className="floating-menu-item">
              <Phone size={16} aria-hidden="true" />
              <span>{(isVi ? 'Hotline: ' : 'Call: ') + '(+84) 984 815 016'}</span>
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsQuickContactOpen((prev) => !prev)}
          aria-expanded={isQuickContactOpen}
          aria-controls="b2b-quick-contact-panel"
          aria-label={
            isQuickContactOpen
              ? isVi
                ? 'Đóng menu liên hệ nhanh'
                : 'Close quick contact menu'
              : isVi
              ? 'Mở liên hệ nhanh B2B'
              : 'Open B2B quick contact menu'
          }
          tabIndex={isFooterInView ? -1 : 0}
          className="floating-contact-trigger"
        >
          {isQuickContactOpen ? <X size={18} aria-hidden="true" /> : <MessageCircle size={18} aria-hidden="true" />}
          <span className="floating-trigger-label">
            {isVi ? 'Liên Hệ B2B' : 'Quick Contact'}
          </span>
        </button>
      </div>

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={handleCloseQuote}
        defaultProduct={selectedProduct}
      />
    </div>
  );
};
