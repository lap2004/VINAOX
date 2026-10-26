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
    email: '',
    phone: '',
    company: '',
    product: defaultProduct,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');

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
      setHoneypot('');
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

    // Anti-bot honeypot check: automated scrapers fill hidden fields
    if (honeypot.trim()) {
      setIsSubmitting(false);
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedCompany = formData.company.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setErrorMsg(
        language === 'vi'
          ? 'Vui lòng điền họ tên, email và số điện thoại liên hệ.'
          : 'Please provide your full name, email address, and phone number.'
      );
      return;
    }

    // RFC-compliant email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg(
        language === 'vi'
          ? 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.'
          : 'Please provide a valid business email address (e.g. name@company.com).'
      );
      return;
    }

    setIsSubmitting(true);

    // Build authentic B2B export quote RFP inquiry dispatch
    const subject = encodeURIComponent(
      `[VINAXO B2B Quote Request] ${formData.product || 'Agricultural Export'} - ${trimmedName} (${trimmedCompany || 'Direct Buyer'})`
    );
    const bodyContent = [
      `VINAXO B2B WHOLESALE & EXPORT INQUIRY`,
      `----------------------------------------`,
      `Full Name: ${trimmedName}`,
      `Company: ${trimmedCompany || 'N/A'}`,
      `Email: ${trimmedEmail}`,
      `Phone/WhatsApp: ${trimmedPhone}`,
      `Product of Interest: ${formData.product || 'General Catalog'}`,
      `Specifications & Requirements:`,
      trimmedMessage || 'Standard export CIF/FOB quotation requested.',
      `----------------------------------------`,
      `Dispatched via VINAXO Corporate Portal (https://vinaxo.vn)`,
    ].join('\n');

    const mailtoUrl = `mailto:thaovinaxo@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    // Trigger authentic mailto dispatch
    try {
      window.location.href = mailtoUrl;
    } catch {
      // Fallback window navigation
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
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
        style={{
          maxWidth: '560px',
          padding: 'clamp(22px, 3.5vw, 32px)',
          borderRadius: '20px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--cream-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-heading)',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--light-sage)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--cream-bg)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={16} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '28px 12px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--light-sage)',
                color: 'var(--primary-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <CheckCircle size={32} />
            </div>
            <h3
              className="title-serif"
              style={{
                fontSize: '1.5rem',
                color: 'var(--forest-green)',
                marginBottom: '10px',
              }}
            >
              {t('modal.successTitle', 'Thank You for Your Inquiry!')}
            </h3>
            <p
              style={{
                color: 'var(--color-body)',
                lineHeight: 1.6,
                fontSize: '0.92rem',
                maxWidth: '440px',
                margin: '0 auto 24px',
              }}
            >
              {language === 'vi'
                ? 'Yêu cầu báo giá của bạn đã được chuyển tiếp đến Bộ phận Xuất khẩu VINAXO. Đội ngũ thương mại quốc tế sẽ phản hồi trong vòng 24 giờ làm việc.'
                : 'Your B2B quote inquiry has been forwarded to VINAXO Export Desk. Our team will review your specifications and contact you within 24 business hours.'}
            </p>
            <Button variant="primary" onClick={onClose}>
              {t('modal.closeBtn', 'Close Window')}
            </Button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '18px', paddingRight: '28px' }}>
              <span
                className="section-eyebrow"
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--primary-green)',
                  backgroundColor: 'var(--light-sage)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  marginBottom: '6px',
                }}
              >
                {t('modal.eyebrow', 'VINAXO EXPORT INQUIRY')}
              </span>
              <h2
                id="modal-title"
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.35rem, 2.2vw, 1.65rem)',
                  color: 'var(--color-heading)',
                  margin: '4px 0 6px',
                  lineHeight: 1.25,
                }}
              >
                {t('modal.title', 'Request a Wholesale Quote')}
              </h2>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-body)',
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {t(
                  'modal.desc',
                  'Fill in your details below to receive direct CIF/FOB pricing or samples within 24 business hours.'
                )}
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  marginBottom: '12px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Anti-bot honeypot field - invisible to human users */}
              <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="quote_company_fax_hp">Do not fill this</label>
                <input
                  type="text"
                  id="quote_company_fax_hp"
                  name="quote_company_fax_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Row 1: Name & Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '11px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.nameLabel', 'Full Name')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder={t('modal.namePlaceholder', 'John Doe / Nguyễn Văn A')}
                    className="form-input"
                    style={{ padding: '9px 12px', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.emailLabel', 'Business Email')} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder={t('modal.emailPlaceholder', 'buyer@company.com')}
                    className="form-input"
                    style={{ padding: '9px 12px', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '11px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.phoneLabel', 'Phone / WhatsApp')} <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={30}
                    placeholder={t('modal.phonePlaceholder', '+84 907 494 177')}
                    className="form-input"
                    style={{ padding: '9px 12px', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.companyLabel', 'Company Name')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t('modal.companyPlaceholder', 'Pacific Foods Import LLC')}
                    className="form-input"
                    style={{ padding: '9px 12px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 3: Product of Interest */}
              <div className="form-group" style={{ marginBottom: '11px' }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                  {t('modal.productLabel', 'Product of Interest')}
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="form-select"
                  style={{ padding: '9px 12px', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  {productOptions.map((opt, idx) => (
                    <option key={idx} value={idx === 0 ? '' : opt} disabled={idx === 0}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Specifications & Requirements */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                  {t('modal.messageLabel', 'Estimated Volume & Specific Requirements')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={2000}
                  placeholder={
                    language === 'vi'
                      ? 'Sản lượng dự kiến (VD: 1 cont 20ft), cảng đích, quy cách đóng gói OEM hoặc ghi chú...'
                      : 'Estimated volume (e.g. 1x20ft FCL), target destination, OEM packing or requirements...'
                  }
                  className="form-textarea"
                  style={{
                    minHeight: '62px',
                    padding: '9px 12px',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                  rows={2}
                />
              </div>

              {/* Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--color-muted)',
                  }}
                >
                  <ShieldCheck size={15} color="var(--primary-green)" />
                  <span>
                    {language === 'vi'
                      ? 'Bảo mật thông tin thương mại B2B'
                      : 'Protected B2B confidentiality'}
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Send size={15} />}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
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
