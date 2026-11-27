import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AboutGalleryItem, getCategoryLabel, pickLocalized } from '../../data/aboutContent';

export interface AboutGalleryLightboxProps {
  items: AboutGalleryItem[];
  activeId: string | null;
  onSelectId: (id: string) => void;
  onClose: () => void;
}

export const AboutGalleryLightbox: React.FC<AboutGalleryLightboxProps> = ({
  items,
  activeId,
  onSelectId,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const touchStartX = useRef<number | null>(null);

  const activeIndex = activeId ? items.findIndex((item) => item.id === activeId) : -1;
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;

  useEffect(() => {
    if (!activeItem) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && items.length > 1) {
        e.preventDefault();
        const nextIdx = (activeIndex + 1) % items.length;
        onSelectId(items[nextIdx].id);
      } else if (e.key === 'ArrowLeft' && items.length > 1) {
        e.preventDefault();
        const prevIdx = (activeIndex - 1 + items.length) % items.length;
        onSelectId(items[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeItem, activeIndex, items, onClose, onSelectId]);

  if (!activeItem) return null;

  const labelText = pickLocalized(activeItem.label, language);
  const titleText = pickLocalized(activeItem.title, language);
  const descText = pickLocalized(activeItem.description, language);
  const altText = pickLocalized(activeItem.alt, language) || titleText;
  const categoryText = getCategoryLabel(activeItem.category, language);

  const goPrev = () => {
    if (items.length <= 1) return;
    const prevIdx = (activeIndex - 1 + items.length) % items.length;
    onSelectId(items[prevIdx].id);
  };

  const goNext = () => {
    if (items.length <= 1) return;
    const nextIdx = (activeIndex + 1) % items.length;
    onSelectId(items[nextIdx].id);
  };

  return (
    <div
      className="modal-backdrop about-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-lightbox-title"
      data-testid="about-lightbox"
      data-active-gallery-id={activeItem.id}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || items.length <= 1) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) >= 40) {
          if (delta < 0) goNext();
          else goPrev();
        }
      }}
    >
      <div
        className="about-lightbox-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="about-lightbox-header">
          <div className="about-lightbox-meta-pills">
            <span className="about-lightbox-category-pill">{categoryText}</span>
            <span className="about-lightbox-label-pill" data-testid="lightbox-label">
              {labelText}
            </span>
          </div>

          <div className="about-lightbox-header-actions">
            <span className="about-lightbox-counter" data-testid="lightbox-counter">
              {activeIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              className="about-lightbox-close"
              aria-label={t('aboutPage.gallery.closeLightbox', 'Đóng cửa sổ xem ảnh')}
              data-testid="lightbox-close"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="about-lightbox-stage">
          {items.length > 1 && (
            <button
              type="button"
              className="about-lightbox-nav about-lightbox-prev"
              aria-label={t('aboutPage.gallery.prevImage', 'Ảnh trước')}
              data-testid="lightbox-prev"
              onClick={goPrev}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div className="about-lightbox-media-frame">
            <picture key={activeItem.id}>
              {activeItem.imageFallback && <source srcSet={activeItem.image} type="image/webp" />}
              <img
                src={activeItem.imageFallback || activeItem.image}
                alt={altText}
                data-testid="lightbox-image"
                className="about-lightbox-img"
              />
            </picture>
          </div>

          {items.length > 1 && (
            <button
              type="button"
              className="about-lightbox-nav about-lightbox-next"
              aria-label={t('aboutPage.gallery.nextImage', 'Ảnh tiếp theo')}
              data-testid="lightbox-next"
              onClick={goNext}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        <div className="about-lightbox-caption">
          <h3 id="about-lightbox-title" className="about-lightbox-title" data-testid="lightbox-title">
            {titleText}
          </h3>
          <p className="about-lightbox-desc" data-testid="lightbox-desc">
            {descText}
          </p>
        </div>
      </div>
    </div>
  );
};
