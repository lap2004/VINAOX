import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, FileText, X } from 'lucide-react';
import { useLanguage, pickLocale } from '../../i18n/LanguageContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuoteModal } from '../ui/QuoteModal';
import { type QuotationProduct } from '../contact/contactSchema';
import { ScrollToTop } from '../ui/ScrollToTop';

export interface MainLayoutContext {
  onOpenQuote: (product?: string | QuotationProduct) => void;
}

export const MainLayout: React.FC = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const isContactPage = pathname === '/contact' || pathname === '/contact.html';
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | QuotationProduct | undefined>(undefined);
  const [isQuickContactOpen, setIsQuickContactOpen] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  const handleOpenQuote = (product?: string | QuotationProduct) => {
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

      {/* Consolidated B2B Quick Contact Hub (auto-yields cleanly on footer, modal, or /contact form page) */}
      <div
        className={`floating-b2b-speed-dial${isFooterInView || isQuoteOpen || isContactPage ? ' is-footer-visible' : ''}${
          isQuickContactOpen ? ' is-open' : ''
        }`}
        aria-label={pickLocale(language, {
          vi: 'Liên hệ nhanh B2B',
          en: 'B2B Quick Contact',
          ko: 'B2B 빠른 문의',
          'zh-CN': 'B2B 快速联系',
        })}
        aria-hidden={isFooterInView || isQuoteOpen || isContactPage}
      >
        {isQuickContactOpen && (
          <div id="b2b-quick-contact-panel" className="floating-contact-menu" role="region">
            <button
              type="button"
              onClick={() => handleOpenQuote()}
              className="floating-menu-item floating-menu-quote"
            >
              <FileText size={16} aria-hidden="true" />
              <span>
                {pickLocale(language, {
                  vi: 'Yêu Cầu Báo Giá B2B',
                  en: 'Request B2B Quote',
                  ko: 'B2B 견적 요청',
                  'zh-CN': '申请 B2B 报价',
                })}
              </span>
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
              <span>
                {pickLocale(language, {
                  vi: 'Hotline: ',
                  en: 'Call: ',
                  ko: '전화: ',
                  'zh-CN': '热线: ',
                }) + '(+84) 984 815 016'}
              </span>
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
              ? pickLocale(language, {
                  vi: 'Đóng menu liên hệ nhanh',
                  en: 'Close quick contact menu',
                  ko: '빠른 문의 메뉴 닫기',
                  'zh-CN': '关闭快速联系菜单',
                })
              : pickLocale(language, {
                  vi: 'Mở liên hệ nhanh B2B',
                  en: 'Open B2B quick contact menu',
                  ko: 'B2B 빠른 문의 메뉴 열기',
                  'zh-CN': '打开 B2B 快速联系菜单',
                })
          }
          tabIndex={isFooterInView || isQuoteOpen || isContactPage ? -1 : 0}
          className="floating-contact-trigger"
        >
          {isQuickContactOpen ? <X size={18} aria-hidden="true" /> : <MessageCircle size={18} aria-hidden="true" />}
          <span className="floating-trigger-label">
            {pickLocale(language, {
              vi: 'Liên Hệ B2B',
              en: 'Quick Contact',
              ko: 'B2B 문의',
              'zh-CN': '快速联系',
            })}
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
