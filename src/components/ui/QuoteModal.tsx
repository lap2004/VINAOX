import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Send, ShieldCheck, Mail, Copy, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { productsData } from '../../data/products';
import {
  InquiryPayload,
  buildInquiryPlainText,
  buildMailtoHref,
  submitInquiry,
} from '../../services/inquiryService';
import { Button } from './Button';

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

const VALUE_ADDED_VALUE = 'value-added-lines';
const OEM_VALUE = 'oem-private-label';

function resolveProductValue(raw?: string): string {
  if (!raw || !raw.trim()) return '';
  const needle = raw.trim().toLowerCase();
  const matched = productsData.find(
    (p) =>
      p.slug.toLowerCase() === needle ||
      p.id.toLowerCase() === needle ||
      p.name.toLowerCase() === needle ||
      p.nameVi.toLowerCase() === needle ||
      p.aliases?.some((a) => a.toLowerCase() === needle)
  );
  if (matched) return matched.slug;
  if (needle.includes('oem') || needle.includes('private label')) return OEM_VALUE;
  if (needle.includes('honey') || needle.includes('granola') || needle.includes('chocolate')) {
    return VALUE_ADDED_VALUE;
  }
  return raw.trim();
}

function formatProductForDispatch(value: string): string {
  if (!value) return 'General Catalog';
  if (value === VALUE_ADDED_VALUE) return 'Honey-Infused / Chocolate-Dipped / Fruit & Nut Balls / Granola';
  if (value === OEM_VALUE) return 'OEM / ODM & Private Label Project';
  const matched = productsData.find((p) => p.slug === value || p.id === value);
  return matched ? `${matched.nameVi} (${matched.name})` : value;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultProduct = '',
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: resolveProductValue(defaultProduct),
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fallbackPayload, setFallbackPayload] = useState<InquiryPayload | null>(null);
  const [fallbackRecipient, setFallbackRecipient] = useState('');
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product: resolveProductValue(defaultProduct),
    }));
  }, [defaultProduct]);

  // Body scroll lock & focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => closeBtnRef.current?.focus(), 20);
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
      setReferenceId('');
      setErrorMsg('');
      setFallbackPayload(null);
      setCopied(false);
      setHoneypot('');
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg('');
    setFallbackPayload(null);

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
        isVi
          ? 'Vui lòng điền họ tên, email và số điện thoại liên hệ.'
          : 'Please provide your full name, email address, and phone number.'
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg(
        isVi
          ? 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.'
          : 'Please provide a valid business email address (e.g. name@company.com).'
      );
      return;
    }

    const payload: InquiryPayload = {
      formType: 'quote',
      language,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      company: trimmedCompany,
      product: formatProductForDispatch(formData.product),
      message: trimmedMessage || 'Standard export CIF/FOB quotation requested.',
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : 'QuoteModal',
      hp_website: honeypot,
    };

    setIsSubmitting(true);
    const result = await submitInquiry(payload);
    setIsSubmitting(false);

    if (result.ok && result.delivered) {
      setReferenceId(result.referenceId || '');
      setIsSubmitted(true);
      return;
    }

    setErrorMsg(
      result.error ||
        (isVi
          ? 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu của bạn vẫn được giữ nguyên.'
          : 'Could not dispatch via server right now. Your form details are preserved.')
    );
    setFallbackPayload(payload);
    setFallbackRecipient(result.recipient || '');
  };

  const handleCopyFallback = async () => {
    if (!fallbackPayload) return;
    try {
      await navigator.clipboard.writeText(buildInquiryPlainText(fallbackPayload));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const hasKnownProductOption =
    !formData.product ||
    formData.product === VALUE_ADDED_VALUE ||
    formData.product === OEM_VALUE ||
    productsData.some((p) => p.slug === formData.product);

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
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={isVi ? 'Đóng hộp thoại báo giá' : 'Close modal'}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
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
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
        >
          <X size={17} />
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
                margin: '0 auto 14px',
              }}
            >
              {isVi
                ? 'Yêu cầu báo giá của bạn đã được chuyển tiếp đến Bộ phận Xuất khẩu VINAXO. Đội ngũ thương mại quốc tế sẽ phản hồi trong vòng 24 giờ làm việc.'
                : 'Your B2B quote inquiry has been forwarded to VINAXO Export Desk. Our team will review your specifications and contact you within 24 business hours.'}
            </p>
            {referenceId && (
              <div
                style={{
                  display: 'inline-block',
                  marginBottom: '20px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--cream-bg)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--dark-chocolate)',
                }}
              >
                {isVi ? `Mã tham chiếu: ${referenceId}` : `Reference ID: ${referenceId}`}
              </div>
            )}
            <div>
              <Button variant="primary" onClick={onClose}>
                {t('modal.closeBtn', 'Close Window')}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '18px', paddingRight: '36px' }}>
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
                role="alert"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  marginBottom: '12px',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontWeight: 600 }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{errorMsg}</span>
                </div>

                {fallbackPayload && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    <a
                      href={buildMailtoHref(fallbackPayload, fallbackRecipient)}
                      className="btn btn-primary"
                      style={{ padding: '7px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                    >
                      <Mail size={14} />
                      <span>{isVi ? 'Mở ứng dụng Email' : 'Open Email App'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyFallback}
                      className="btn btn-outline"
                      style={{ padding: '7px 12px', fontSize: '0.78rem' }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>
                        {copied
                          ? isVi
                            ? 'Đã sao chép'
                            : 'Copied'
                          : isVi
                          ? 'Sao chép nội dung'
                          : 'Copy Inquiry'}
                      </span>
                    </button>
                    <a
                      href="https://wa.me/84984815016"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '7px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Anti-bot honeypot field */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '12px',
                  marginBottom: '11px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteName" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.nameLabel', 'Full Name')} <span className="required">*</span>
                  </label>
                  <input
                    id="quoteName"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder={t('modal.namePlaceholder', 'John Doe / Nguyễn Văn A')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteEmail" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.emailLabel', 'Business Email')} <span className="required">*</span>
                  </label>
                  <input
                    id="quoteEmail"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={120}
                    placeholder={t('modal.emailPlaceholder', 'buyer@company.com')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '12px',
                  marginBottom: '11px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quotePhone" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.phoneLabel', 'Phone / WhatsApp')} <span className="required">*</span>
                  </label>
                  <input
                    id="quotePhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={30}
                    placeholder={t('modal.phonePlaceholder', '(+84) 984 815 016')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteCompany" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                    {t('modal.companyLabel', 'Company Name')}
                  </label>
                  <input
                    id="quoteCompany"
                    type="text"
                    autoComplete="organization"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t('modal.companyPlaceholder', 'Pacific Foods Import LLC')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                  />
                </div>
              </div>

              {/* Row 3: Product of Interest */}
              <div className="form-group" style={{ marginBottom: '11px' }}>
                <label htmlFor="quoteProduct" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                  {t('modal.productLabel', 'Product of Interest')}
                </label>
                <select
                  id="quoteProduct"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="form-select"
                  style={{ padding: '9px 12px', cursor: 'pointer' }}
                >
                  <option value="">
                    {isVi ? '-- Chọn sản phẩm hoặc dịch vụ quan tâm --' : '-- Select product of interest --'}
                  </option>
                  {productsData.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {isVi ? p.nameVi : p.name}
                    </option>
                  ))}
                  <option value={VALUE_ADDED_VALUE}>
                    {isVi
                      ? 'Trái cây sấy tẩm mật ong / Phủ Sô-cô-la / Granola'
                      : 'Honey-Infused & Chocolate-Dipped / Granola'}
                  </option>
                  <option value={OEM_VALUE}>
                    {isVi
                      ? 'Gia công OEM / ODM & Đóng gói Nhãn riêng (Private Label)'
                      : 'OEM / ODM & Private Label Project'}
                  </option>
                  {!hasKnownProductOption && (
                    <option value={formData.product}>{formData.product}</option>
                  )}
                </select>
              </div>

              {/* Row 4: Specifications & Requirements */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="quoteMessage" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '5px' }}>
                  {t('modal.messageLabel', 'Estimated Volume & Specific Requirements')}
                </label>
                <textarea
                  id="quoteMessage"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={2000}
                  placeholder={
                    isVi
                      ? 'Sản lượng dự kiến (VD: 1 cont 20ft), cảng đích, quy cách đóng gói OEM hoặc ghi chú...'
                      : 'Estimated volume (e.g. 1x20ft FCL), target destination, OEM packing or requirements...'
                  }
                  className="form-textarea"
                  style={{
                    minHeight: '66px',
                    padding: '9px 12px',
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
                    {isVi
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
                    ? isVi
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
