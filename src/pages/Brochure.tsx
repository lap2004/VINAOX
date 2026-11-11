import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { BROCHURE_DOCUMENT } from '../data/brochureData';
import { PageHero } from '../components/ui/PageHero';

type ZoomSetting = 'fit' | 75 | 100 | 125 | 150;
const ZOOM_STEPS: ZoomSetting[] = ['fit', 75, 100, 125, 150];

export const Brochure: React.FC = () => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomIndex, setZoomIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInlineOnMobile, setShowInlineOnMobile] = useState<boolean>(false);
  const viewerShellRef = useRef<HTMLDivElement | null>(null);

  const zoomValue = ZOOM_STEPS[zoomIndex];
  const zoomHash = zoomValue === 'fit' ? 'view=FitH' : `zoom=${zoomValue}`;
  const pdfEmbedUrl = `${BROCHURE_DOCUMENT.pdfUrl}#page=${currentPage}&${zoomHash}`;

  const goToPage = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(BROCHURE_DOCUMENT.totalPages, nextPage));
    setCurrentPage(clamped);
  };

  const handleZoomOut = () => setZoomIndex((idx) => Math.max(0, idx - 1));
  const handleZoomIn = () =>
    setZoomIndex((idx) => Math.min(ZOOM_STEPS.length - 1, idx + 1));
  const handleZoomReset = () => setZoomIndex(0);

  const toggleFullscreen = async () => {
    const el = viewerShellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: browser blocked fullscreen request
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const zoomDisplayLabel =
    zoomValue === 'fit' ? t('brochure.zoomFit', 'Fit width') : `${zoomValue}%`;

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
          {/* Document Meta + Immediate Direct Actions */}
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

          {/* Mobile Friendly Cover + Action Card (mobile screens where native inline PDF iframes lack multi-page scroll) */}
          <div className="brochure-mobile-card">
            <div className="brochure-mobile-cover-wrap">
              <picture>
                <source srcSet={BROCHURE_DOCUMENT.coverWebp} type="image/webp" />
                <img
                  src={BROCHURE_DOCUMENT.coverJpg}
                  alt={
                    isVi
                      ? 'Ảnh bìa Brochure Công ty TNHH VINAXO 2026'
                      : 'VINAXO Company Brochure 2026 cover preview'
                  }
                  className="brochure-mobile-cover-img"
                />
              </picture>
            </div>
            <p className="brochure-mobile-notice">
              {t(
                'brochure.mobilePrompt',
                'For optimal multi-page reading on mobile screens, open the original PDF directly or download a copy below.'
              )}
            </p>
            <div className="brochure-mobile-actions">
              <a
                href={BROCHURE_DOCUMENT.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brochure-action-download"
              >
                <span>{t('brochure.openNewTab', 'Open PDF in New Tab')}</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
              <a
                href={BROCHURE_DOCUMENT.pdfUrl}
                download={BROCHURE_DOCUMENT.downloadFilename}
                className="brochure-action-external"
              >
                <Download size={16} aria-hidden="true" />
                <span>{t('brochure.downloadCta', 'Download PDF')}</span>
              </a>
            </div>
            <button
              type="button"
              onClick={() => setShowInlineOnMobile((prev) => !prev)}
              className="brochure-inline-toggle"
            >
              {showInlineOnMobile
                ? t('brochure.hideInlineMobile', 'Hide inline PDF viewer')
                : t('brochure.showInlineMobile', 'Load inline PDF viewer')}
            </button>
          </div>

          {/* Embedded PDF Viewer Shell (Always active on >= 768px desktop/tablet, optional toggle on mobile) */}
          <div
            ref={viewerShellRef}
            className={`brochure-viewer-shell${showInlineOnMobile ? ' is-mobile-visible' : ''}${
              isFullscreen ? ' is-fullscreen' : ''
            }`}
          >
            {/* Interactive Toolbar */}
            <div
              className="brochure-viewer-toolbar"
              role="toolbar"
              aria-label={isVi ? 'Thanh điều khiển Brochure PDF' : 'PDF Viewer Controls'}
            >
              {/* Page Controls */}
              <div className="brochure-toolbar-group">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  aria-label={t('brochure.prevPage', 'Previous page')}
                  className="viewer-tool-btn"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>

                <div className="brochure-page-pills" role="group" aria-label={t('brochure.pageWord', 'Page')}>
                  {[1, 2, 3, 4].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      aria-current={currentPage === p ? 'page' : undefined}
                      className={`viewer-page-pill${currentPage === p ? ' is-active' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <span className="viewer-page-readout" aria-live="polite">
                  {t('brochure.pageWord', 'Page')} {currentPage}{' '}
                  {t('brochure.ofWord', 'of')} {BROCHURE_DOCUMENT.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= BROCHURE_DOCUMENT.totalPages}
                  aria-label={t('brochure.nextPage', 'Next page')}
                  className="viewer-tool-btn"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Zoom & Fullscreen Controls */}
              <div className="brochure-toolbar-group">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomIndex <= 0}
                  aria-label={t('brochure.zoomOut', 'Zoom out')}
                  className="viewer-tool-btn"
                >
                  <ZoomOut size={16} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleZoomReset}
                  title={t('brochure.zoomFit', 'Fit width')}
                  className="viewer-zoom-readout"
                >
                  <span>{zoomDisplayLabel}</span>
                  {zoomIndex !== 0 && <RotateCcw size={12} aria-hidden="true" />}
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomIndex >= ZOOM_STEPS.length - 1}
                  aria-label={t('brochure.zoomIn', 'Zoom in')}
                  className="viewer-tool-btn"
                >
                  <ZoomIn size={16} aria-hidden="true" />
                </button>

                <span className="viewer-tool-divider" aria-hidden="true" />

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={
                    isFullscreen
                      ? t('brochure.fullscreenExit', 'Exit Fullscreen')
                      : t('brochure.fullscreenEnter', 'Fullscreen')
                  }
                  aria-pressed={isFullscreen}
                  className="viewer-tool-btn viewer-tool-btn-labeled"
                >
                  {isFullscreen ? (
                    <Minimize2 size={15} aria-hidden="true" />
                  ) : (
                    <Maximize2 size={15} aria-hidden="true" />
                  )}
                  <span className="viewer-btn-label">
                    {isFullscreen
                      ? t('brochure.fullscreenExit', 'Exit Fullscreen')
                      : t('brochure.fullscreenEnter', 'Fullscreen')}
                  </span>
                </button>
              </div>
            </div>

            {/* Embedded Native PDF Frame */}
            <div className="brochure-iframe-stage">
              <iframe
                key={pdfEmbedUrl}
                src={pdfEmbedUrl}
                title={
                  isVi
                    ? `Brochure Công ty TNHH VINAXO 2026 - Trang ${currentPage}`
                    : `VINAXO Company Brochure 2026 PDF - Page ${currentPage}`
                }
                className="brochure-pdf-iframe"
                loading="lazy"
              />
            </div>

            {/* Universal Accessible Fallback Strip */}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brochure;

