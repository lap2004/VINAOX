import React, { useEffect, useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { BROCHURE_DOCUMENT, BROCHURE_PAGES } from '../data/brochureData';
import { PageHero } from '../components/ui/PageHero';

const MOBILE_READER_QUERY = '(max-width: 767px)';
const DESKTOP_PDF_EMBED_URL = `${BROCHURE_DOCUMENT.pdfUrl}#toolbar=1&navpanes=0&view=FitH`;

export const Brochure: React.FC = () => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [hasEmbedError, setHasEmbedError] = useState<boolean>(false);
  const [isMobileReader, setIsMobileReader] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_READER_QUERY).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_READER_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileReader(event.matches);
    };
    setIsMobileReader(mq.matches);
    mq.addEventListener('change', handleViewportChange);
    return () => mq.removeEventListener('change', handleViewportChange);
  }, []);

  const metadataItems = [
    {
      label: t('brochure.formatLabel', 'Format'),
      value: t('brochure.formatVal', BROCHURE_DOCUMENT.format),
    },
    {
      label: t('brochure.editionLabel', 'Edition'),
      value: t('brochure.editionVal', BROCHURE_DOCUMENT.edition),
    },
    {
      label: t('brochure.pagesLabel', 'Pages'),
      value: t('brochure.pagesVal', String(BROCHURE_DOCUMENT.totalPages)),
    },
    {
      label: t('brochure.languageLabel', 'Language'),
      value: t('brochure.languageVal', 'English'),
    },
  ];

  if (isMobileReader) {
    return (
      <div className="brochure-page brochure-mobile-mode">
        <div className="brochure-mobile-reader">
          {/* Compact Mobile Header (keeps Page 1 immediately visible) */}
          <header className="brochure-mobile-header">
            <span className="brochure-mobile-eyebrow">
              {t('brochure.mobileEyebrow', 'COMPANY PROFILE · 2026')}
            </span>
            <h1 className="brochure-mobile-title">
              {t('brochure.mobileHeading', 'VINAXO COMPANY BROCHURE')}
            </h1>
            <p className="brochure-mobile-desc">
              {t(
                'brochure.mobileDesc',
                'Explore our tropical dried fruit collections, manufacturing capabilities and quality standards.'
              )}
            </p>
          </header>

          {/* Continuous Vertical 4-Page Brochure Stream */}
          <div
            className="brochure-mobile-stream"
            aria-label={isVi ? 'Nội dung 4 trang Brochure Công ty VINAXO 2026' : 'VINAXO Company Brochure 2026 — 4 pages'}
          >
            {BROCHURE_PAGES.map((page, idx) => (
              <figure key={page.pageNumber} className="brochure-mobile-page">
                <picture>
                  <source srcSet={page.webp} type="image/webp" />
                  <img
                    src={page.jpg}
                    alt={isVi ? page.titleVi : page.titleEn}
                    width={page.width}
                    height={page.height}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="brochure-mobile-page-img"
                  />
                </picture>
              </figure>
            ))}
          </div>

          {/* Single Clean Bottom Download & Original PDF Action */}
          <div className="brochure-mobile-download-bar">
            <a
              href={BROCHURE_DOCUMENT.pdfUrl}
              download={BROCHURE_DOCUMENT.downloadFilename}
              className="brochure-action-download brochure-mobile-download-btn"
            >
              <Download size={17} aria-hidden="true" />
              <span>{t('brochure.mobileDownloadBtn', 'Download Brochure (PDF)')}</span>
            </a>
            <a
              href={BROCHURE_DOCUMENT.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brochure-mobile-open-link"
            >
              {t('brochure.mobileOpenOriginal', 'Open Original PDF')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brochure-page">
      <PageHero
        badge={t('brochure.eyebrow', 'VINAXO COMPANY PROFILE')}
        title={t('brochure.pageTitle', 'VINAXO BROCHURE 2026')}
        description={t(
          'brochure.pageDesc',
          'Explore our company, product collections, manufacturing capabilities and international quality standards.'
        )}
        breadcrumbCurrent={t('nav.brochure', 'Company Brochure')}
      />

      <section className="subpage-section brochure-reader-section">
        <div className="container brochure-reader-container">
          {/* Document Meta + Primary Actions */}
          <div className="brochure-meta-action-bar">
            <dl className="brochure-meta-list">
              {metadataItems.map((m) => (
                <div key={m.label} className="brochure-meta-item">
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="brochure-primary-actions">
              <a
                href={BROCHURE_DOCUMENT.pdfUrl}
                download={BROCHURE_DOCUMENT.downloadFilename}
                className="brochure-action-download"
              >
                <Download size={17} aria-hidden="true" />
                <span>
                  {t('brochure.downloadFull', 'Download Company Brochure (PDF)')}
                </span>
              </a>

              <a
                href={BROCHURE_DOCUMENT.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brochure-action-external"
              >
                <span>{t('brochure.openNewTab', 'Open PDF in New Tab')}</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Spacious Distraction-Free Native PDF Viewer (Desktop & Tablet >= 768px) */}
          <div className="brochure-viewer-shell">
            <div className="brochure-iframe-stage">
              <iframe
                src={DESKTOP_PDF_EMBED_URL}
                title={
                  isVi
                    ? 'Brochure Công ty TNHH VINAXO 2026 (PDF)'
                    : 'VINAXO Company Brochure 2026 (PDF)'
                }
                className="brochure-pdf-iframe"
                onLoad={() => setHasEmbedError(false)}
                onError={() => setHasEmbedError(true)}
              />
            </div>

            {hasEmbedError && (
              <div className="brochure-viewer-fallback-bar">
                <span>
                  {t(
                    'brochure.fallbackPrompt',
                    'Having trouble viewing the embedded PDF in this browser?'
                  )}
                </span>
                <div className="brochure-fallback-links">
                  <a
                    href={BROCHURE_DOCUMENT.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('brochure.openNewTab', 'Open PDF in New Tab')}
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={BROCHURE_DOCUMENT.pdfUrl}
                    download={BROCHURE_DOCUMENT.downloadFilename}
                  >
                    {t('brochure.downloadCta', 'Download PDF')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brochure;
