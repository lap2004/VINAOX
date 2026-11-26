import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, Mail, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { productsData } from '../../data/products';
import {
  InquiryPayload,
  buildInquiryPlainText,
  buildMailtoHref,
  submitInquiry,
} from '../../services/inquiryService';
import { Button } from '../ui/Button';

export interface ContactFormProps {
  initialProduct?: string;
  onSuccess?: () => void;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '', onSuccess }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    product: initialProduct,
    volume: '',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackPayload, setFallbackPayload] = useState<InquiryPayload | null>(null);
  const [fallbackRecipient, setFallbackRecipient] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setFallbackPayload(null);

    if (honeypot.trim()) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name || !email || !phone) {
      setErrorMessage(
        isVi
          ? 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Số điện thoại liên hệ.'
          : 'Please enter your Name, Business Email, and Phone number.'
      );
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage(
        isVi
          ? 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.'
          : 'Please enter a valid business email address.'
      );
      return;
    }

    const payload: InquiryPayload = {
      formType: 'quote',
      language,
      name,
      company: formData.company.trim(),
      email,
      phone,
      country: formData.country.trim(),
      product: formData.product || 'General Catalog',
      volume: formData.volume.trim(),
      message: formData.message.trim() || 'Standard B2B quotation inquiry.',
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : 'ContactForm',
      hp_website: honeypot,
    };

    setIsSubmitting(true);
    const result = await submitInquiry(payload);
    setIsSubmitting(false);

    if (result.ok && result.delivered) {
      setReferenceId(result.referenceId || '');
      setIsSubmitted(true);
      onSuccess?.();
      return;
    }

    setErrorMessage(
      result.error ||
        (isVi
          ? 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu của bạn vẫn được giữ nguyên.'
          : 'Unable to dispatch right now. Your entered form data is preserved.')
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

  if (isSubmitted) {
    return (
      <div
        className="card"
        style={{
          padding: 'clamp(32px, 5vw, 48px)',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--primary-green)',
        }}
      >
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
          <CheckCircle2 size={36} />
        </div>
        <h3
          className="title-display"
          style={{
            fontSize: '1.8rem',
            color: 'var(--dark-chocolate)',
            marginBottom: '12px',
          }}
        >
          {isVi ? 'Cảm Ơn Quý Doanh Nghiệp Đã Liên Hệ!' : 'Thank You for Your Partnership Inquiry!'}
        </h3>
        <p
          style={{
            color: 'var(--color-body)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 14px',
          }}
        >
          {isVi
            ? 'Yêu cầu báo giá và thông số kỹ thuật của bạn đã được chuyển tới Bộ phận Xuất khẩu & Thương mại B2B VINAXO. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.'
            : 'Your inquiry and specifications have been forwarded to the VINAXO B2B Export Desk. Our team will review your requirements and respond within 24 business hours.'}
        </p>
        {referenceId && (
          <div style={{ marginBottom: '20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>
            {isVi ? `Mã tham chiếu: ${referenceId}` : `Reference ID: ${referenceId}`}
          </div>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            setIsSubmitted(false);
            setReferenceId('');
            setFormData({
              name: '',
              company: '',
              email: '',
              phone: '',
              country: '',
              product: '',
              volume: '',
              message: '',
            });
          }}
        >
          {isVi ? 'Gửi Yêu Cầu Khác' : 'Submit Another Inquiry'}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card"
      style={{
        padding: 'clamp(24px, 4vw, 40px)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <input
          type="text"
          name="hp_website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3
          className="title-display"
          style={{
            fontSize: '1.55rem',
            color: 'var(--color-heading)',
            marginBottom: '8px',
          }}
        >
          {isVi
            ? 'Gửi Thư Liên Hệ & Yêu Cầu Báo Giá Xuất Khẩu'
            : 'Direct B2B Quote & Export Inquiry Form'}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-body)' }}>
          {isVi
            ? 'Điền thông tin doanh nghiệp và quy cách sản phẩm cần báo giá CIF/FOB. Nhà máy VINAXO cung cấp mẫu thử nghiệm và bảng kiểm nghiệm an toàn thực phẩm.'
            : 'Fill in your enterprise details for CIF/FOB quotations. VINAXO provides commercial sample kits and full laboratory safety COAs.'}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
          {fallbackPayload && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
              <a
                href={buildMailtoHref(fallbackPayload, fallbackRecipient)}
                className="btn btn-primary"
                style={{ padding: '7px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                <Mail size={14} />
                <span>{isVi ? 'Mở ứng dụng Email' : 'Open Email App'}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyFallback}
                className="btn btn-outline"
                style={{ padding: '7px 12px', fontSize: '0.8rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? (isVi ? 'Đã sao chép' : 'Copied') : isVi ? 'Sao chép nội dung' : 'Copy Inquiry'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Row 1: Name & Company */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Họ và tên người liên hệ' : 'Full Name'} <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
            placeholder={isVi ? 'Ví dụ: Nguyễn Văn A' : 'e.g. Johnathan Smith'}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">{isVi ? 'Tên công ty / Tổ chức' : 'Company / Enterprise'}</label>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            maxLength={150}
            value={formData.company}
            onChange={handleChange}
            placeholder={isVi ? 'Ví dụ: Pacific Export Trading Ltd' : 'e.g. Global Foods Trading Ltd'}
            className="form-input"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Email doanh nghiệp' : 'Business Email'} <span className="required">*</span>
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            name="email"
            maxLength={120}
            value={formData.email}
            onChange={handleChange}
            placeholder="procurement@company.com"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Điện thoại / WhatsApp' : 'Phone / WhatsApp'} <span className="required">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            name="phone"
            maxLength={30}
            value={formData.phone}
            onChange={handleChange}
            placeholder="(+84) 984 815 016"
            className="form-input"
            required
          />
        </div>
      </div>

      {/* Row 3: Country & Product */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">{isVi ? 'Quốc gia / Thị trường' : 'Country / Target Market'}</label>
          <input
            type="text"
            name="country"
            autoComplete="country-name"
            maxLength={100}
            value={formData.country}
            onChange={handleChange}
            placeholder={isVi ? 'Ví dụ: Hoa Kỳ, Đức, Hàn Quốc, Việt Nam' : 'e.g. United States, Germany, South Korea'}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{isVi ? 'Sản phẩm quan tâm' : 'Product Line'}</label>
          <select name="product" value={formData.product} onChange={handleChange} className="form-select">
            <option value="">
              {isVi ? '-- Chọn sản phẩm hoặc dịch vụ B2B --' : '-- Select Product or B2B Requirement --'}
            </option>
            {productsData.map((p) => (
              <option key={p.id} value={isVi ? p.nameVi : p.name}>
                {isVi ? p.nameVi : p.name}
              </option>
            ))}
            <option value="OEM / Private Label">
              {isVi
                ? 'Gia công OEM nhãn riêng / Đóng gói xuất khẩu (MOQ từ 200 kg)'
                : 'OEM / ODM Private Label Formulation & Packaging (MOQ from 200 kg)'}
            </option>
          </select>
        </div>
      </div>

      {/* Row 4: Volume & Destination */}
      <div className="form-group">
        <label className="form-label">
          {isVi ? 'Sản lượng dự kiến & Yêu cầu đóng gói' : 'Estimated Volume & Packaging Preference'}
        </label>
        <input
          type="text"
          name="volume"
          maxLength={200}
          value={formData.volume}
          onChange={handleChange}
          placeholder={
            isVi
              ? 'Ví dụ: 1 container 20ft (FCL) / Túi zip 250g / Thùng carton 10kg'
              : 'e.g. 1 FCL 20ft / 5 tons bulk / 250g retail pouch OEM'
          }
          className="form-input"
        />
      </div>

      {/* Row 5: Message */}
      <div className="form-group">
        <label className="form-label">{isVi ? 'Nội dung trao đổi cụ thể' : 'Detailed Message / Technical Inquiries'}</label>
        <textarea
          name="message"
          maxLength={3000}
          value={formData.message}
          onChange={handleChange}
          placeholder={
            isVi
              ? 'Ghi chú các tiêu chuẩn an toàn thực phẩm cần đáp ứng, yêu cầu chứng chỉ kiểm dịch, hoặc kế hoạch giao hàng...'
              : 'Specify target port, certification requirements (BRCGS, OCOP), custom formulation needs, or delivery schedule...'
          }
          className="form-textarea"
          style={{ minHeight: '110px' }}
        />
      </div>

      {/* Form Action & Assurance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
          }}
        >
          <ShieldCheck size={18} color="var(--primary-green)" />
          <span>
            {isVi
              ? 'Thông tin bảo mật • Tổ hợp nhà máy 25.000 m² tại Xã Vĩnh Bình, Tỉnh Đồng Tháp'
              : 'Direct from Factory • 25,000 m² facility in Vinh Binh Commune, Dong Thap Province'}
          </span>
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting} icon={<Send size={16} />}>
          {isSubmitting
            ? isVi
              ? 'Đang gửi...'
              : 'Sending...'
            : isVi
            ? 'Gửi Yêu Cầu Báo Giá'
            : 'Send Partnership Request'}
        </Button>
      </div>
    </form>
  );
};
