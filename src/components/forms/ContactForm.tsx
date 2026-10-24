import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';

export interface ContactFormProps {
  initialProduct?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '' }) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const productOptions = isVi
    ? [
        '-- Chọn sản phẩm hoặc dịch vụ B2B --',
        'Xoài sấy dẻo tự nhiên (Dried Mango) - OCOP 3 Sao',
        'Mít sấy dẻo & sấy chân không (Dried Jackfruit) - OCOP 3 Sao',
        'Thanh long sấy dẻo ruột đỏ (Dried Dragon Fruit) - OCOP 3 Sao',
        'Thơm (Dứa) sấy dẻo Tân Phước (Dried Pineapple)',
        'Chuối sấy dẻo tự nhiên (Dried Banana)',
        'Trái cây nhúng Sô-cô-la & Thanh năng lượng xuất khẩu EU',
        'Gia công OEM nhãn riêng / Đóng gói xuất khẩu theo yêu cầu',
      ]
    : [
        '-- Select Product or B2B Requirement --',
        'Naturally Soft-Dried Mango (3-Star OCOP)',
        'Soft-Dried & Vacuum Jackfruit (3-Star OCOP)',
        'Naturally Soft-Dried Dragon Fruit (3-Star OCOP)',
        'Tan Phuoc Soft-Dried Pineapple',
        'Naturally Soft-Dried Banana',
        'Chocolate-Coated Fruit & EU Energy Bar',
        'OEM Private Label / Export Packaging Service',
      ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage(
        isVi
          ? 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Số điện thoại liên hệ.'
          : 'Please enter your Name, Business Email, and Phone number.'
      );
      return;
    }

    setIsSubmitting(true);

    // Reliable response simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
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
          className="title-serif"
          style={{
            fontSize: '1.8rem',
            color: 'var(--forest-green)',
            marginBottom: '12px',
          }}
        >
          {isVi
            ? 'Cảm Ơn Quý Doanh Nghiệp Đã Liên Hệ!'
            : 'Thank You for Your Partnership Inquiry!'}
        </h3>
        <p
          style={{
            color: 'var(--color-body)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 24px',
          }}
        >
          {isVi
            ? 'Yêu cầu báo giá và thông số kỹ thuật của bạn đã được chuyển tới Bộ phận Xuất khẩu & Thương mại B2B VINAXO. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.'
            : 'Your inquiry and specifications have been forwarded to the VINAXO B2B Export Desk. Our team will review your requirements and respond within 24 business hours.'}
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setIsSubmitted(false);
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
      className="card"
      style={{
        padding: 'clamp(24px, 4vw, 40px)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h3
          className="title-serif"
          style={{
            fontSize: '1.5rem',
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Company */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Họ và tên người liên hệ' : 'Full Name'}{' '}
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={isVi ? 'Ví dụ: Nguyễn Văn A' : 'e.g. Johnathan Smith'}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Tên công ty / Tổ chức' : 'Company / Enterprise'}
          </label>
          <input
            type="text"
            name="company"
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
            {isVi ? 'Email doanh nghiệp' : 'Business Email'}{' '}
            <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="procurement@company.com"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Điện thoại / WhatsApp' : 'Phone / WhatsApp'}{' '}
            <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+84 907 494 177"
            className="form-input"
            required
          />
        </div>
      </div>

      {/* Row 3: Country & Product */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Quốc gia / Thị trường' : 'Country / Target Market'}
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder={isVi ? 'Ví dụ: Hoa Kỳ, Đức, Hàn Quốc, Việt Nam' : 'e.g. United States, Germany, South Korea'}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {isVi ? 'Sản phẩm quan tâm' : 'Product Line'}
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
      </div>

      {/* Row 4: Volume & Destination */}
      <div className="form-group">
        <label className="form-label">
          {isVi
            ? 'Sản lượng dự kiến & Yêu cầu đóng gói'
            : 'Estimated Volume & Packaging Preference'}
        </label>
        <input
          type="text"
          name="volume"
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
        <label className="form-label">
          {isVi
            ? 'Nội dung trao đổi cụ thể'
            : 'Detailed Message / Technical Inquiries'}
        </label>
        <textarea
          name="message"
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
              ? 'Thông tin bảo mật • Nhà máy 4.000 m² tại TT. Vĩnh Bình, Gò Công Tây'
              : 'Direct from Factory • 4,000 m² facility in Go Cong Tay, Tien Giang'}
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          icon={<Send size={16} />}
        >
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
