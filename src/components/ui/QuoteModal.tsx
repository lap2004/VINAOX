import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Send, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from './Button';

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultProduct = '',
}) => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: defaultProduct,
    quantity: '',
    destination: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (defaultProduct) {
      setFormData((prev) => ({ ...prev, product: defaultProduct }));
    }
  }, [defaultProduct]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
      setErrorMsg('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg(
        language === 'vi'
          ? 'Vui lòng điền đầy đủ họ tên, email và số điện thoại liên hệ.'
          : 'Please provide your full name, email address, and phone number.'
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const productOptions =
    language === 'vi'
      ? [
          '-- Chọn dòng sản phẩm quan tâm --',
          'Xoài sấy dẻo tự nhiên (Dried Mango)',
          'Mít sấy dẻo & sấy chân không (Dried Jackfruit)',
          'Thanh long sấy dẻo (Dried Dragon Fruit)',
          'Thơm (Dứa) sấy dẻo (Dried Pineapple)',
          'Chuối sấy dẻo tự nhiên (Dried Banana)',
          'Trái cây nhúng Sô-cô-la & Thanh năng lượng (Energy Bar)',
          'Gia công OEM / Đóng gói xuất khẩu theo yêu cầu',
        ]
      : [
          '-- Select product of interest --',
          'Naturally Soft-Dried Mango',
          'Soft-Dried & Vacuum Jackfruit',
          'Soft-Dried Dragon Fruit',
          'Naturally Soft-Dried Pineapple',
          'Naturally Soft-Dried Banana',
          'Chocolate-Coated Fruit & Energy Bar',
          'OEM Private Label / Custom Bulk Packaging',
        ];

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 'clamp(24px, 4vw, 40px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--cream-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-heading)',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--light-sage)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--cream-bg)';
          }}
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--light-sage)',
                color: 'var(--primary-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <CheckCircle size={36} />
            </div>
            <h3
              className="title-serif"
              style={{
                fontSize: '1.75rem',
                color: 'var(--forest-green)',
                marginBottom: '12px',
              }}
            >
              {t('modal.successTitle', 'Thank You for Your Inquiry!')}
            </h3>
            <p
              style={{
                color: 'var(--color-body)',
                lineHeight: 1.65,
                maxWidth: '480px',
                margin: '0 auto 28px',
              }}
            >
              {t(
                'modal.successMessage',
                'Your B2B quote request has been received. Our export trade team will review your specifications and contact you within 24 business hours.'
              )}
            </p>
            <Button variant="primary" onClick={onClose}>
              {t('modal.closeBtn', 'Close Window')}
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="section-eyebrow">
                {t('modal.eyebrow', 'VINAXO EXPORT INQUIRY')}
              </span>
              <h2
                id="modal-title"
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  color: 'var(--color-heading)',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}
              >
                {t('modal.title', 'Request a Wholesale Quote')}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-body)' }}>
                {t(
                  'modal.desc',
                  'Please fill in your company details and fruit specifications. Our B2B export desk will provide CIF/FOB pricing and technical spec sheets.'
                )}
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">
                    {t('modal.nameLabel', 'Your Full Name')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('modal.namePlaceholder', 'e.g. John Doe / Nguyễn Văn A')}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">
                    {t('modal.companyLabel', 'Company / Organization')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('modal.companyPlaceholder', 'e.g. Pacific Foods Import LLC')}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">
                    {t('modal.emailLabel', 'Business Email')} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('modal.emailPlaceholder', 'buyer@company.com')}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">
                    {t('modal.phoneLabel', 'Phone / WhatsApp')} <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('modal.phonePlaceholder', '+1 (555) 000-0000')}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  {t('modal.productLabel', 'Product of Interest')}
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="form-select"
                >
                  {productOptions.map((opt, idx) => (
                    <option key={idx} value={idx === 0 ? '' : opt} disabled={idx === 0}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">
                    {t('modal.quantityLabel', 'Estimated Volume')}
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t('modal.quantityPlaceholder', 'e.g. 1 FCL 20ft / 5 tons')}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">
                    {t('modal.destLabel', 'Destination Port / Country')}
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder={t('modal.destPlaceholder', 'e.g. Port of Long Beach, USA')}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  {t('modal.messageLabel', 'Specific Inquiries & Requirements')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t(
                    'modal.messagePlaceholder',
                    'Describe your packaging preferences (pouch size, retail or bulk), private labeling needs, or certifications required...'
                  )}
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--color-muted)',
                  }}
                >
                  <ShieldCheck size={16} color="var(--primary-green)" />
                  <span>
                    {t(
                      'modal.note',
                      'Direct factory supply • BRCGS Grade B & OCOP Certified'
                    )}
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Send size={16} />}
                >
                  {isSubmitting
                    ? language === 'vi'
                      ? 'Đang gửi...'
                      : 'Submitting...'
                    : t('modal.submitBtn', 'Submit Quote Request')}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
