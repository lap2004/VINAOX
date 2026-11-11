import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ComplianceBadge } from '../../data/brochureData';

export interface CertificatePreviewModalProps {
  certificate: ComplianceBadge | null;
  isVi: boolean;
  onClose: () => void;
}

/**
 * Shared high-resolution document lightbox modal for scanned 2026 brochure certificates.
 */
export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  isVi,
  onClose,
}) => {
  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, onClose]);

  if (!certificate || !certificate.certImageWebp) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={certificate.name}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '24px', backgroundColor: 'var(--white)' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--dark-chocolate)' }}>
              {certificate.name}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--muted-text)' }}>
              {isVi ? certificate.scopeVi : certificate.scopeEn}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isVi ? 'Đóng bản xem trước' : 'Close preview'}
            style={{
              border: '1px solid var(--soft-border)',
              backgroundColor: 'var(--brand-bg)',
              color: 'var(--dark-chocolate)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--soft-border)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <picture>
            <source srcSet={certificate.certImageWebp} type="image/webp" />
            <img
              src={certificate.certImageJpg}
              alt={certificate.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '72vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </picture>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;

