import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProduct = searchParams.get('product') || '';
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: '',
    product: initialProduct || 'Tất cả sản phẩm / Chưa xác định',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Anti-bot honeypot check: automated scrapers fill hidden inputs
    if (honeypot) {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedCompany = formData.company.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !formData.inquiryType || !trimmedMessage) {
      setFormError(isVi ? 'Vui lòng điền đầy đủ các trường bắt buộc (*)' : 'Please fill in all required fields (*)');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError(isVi ? 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.' : 'Invalid email format. Please check and try again.');
      return;
    }

    // Direct mailto generation for authentic B2B dispatch
    const subject = encodeURIComponent(`[VINAXO B2B Inquiry] ${formData.inquiryType} - ${trimmedName}`);
    const body = encodeURIComponent(
      `Họ và tên / Name: ${trimmedName}\n` +
      `Email: ${trimmedEmail}\n` +
      `Công ty / Company: ${trimmedCompany || 'N/A'}\n` +
      `Số điện thoại / Phone: ${trimmedPhone || 'N/A'}\n` +
      `Mục đích / Inquiry Type: ${formData.inquiryType}\n` +
      `Sản phẩm quan tâm / Product: ${formData.product}\n\n` +
      `Nội dung / Message:\n${trimmedMessage}`
    );

    window.location.href = `mailto:thaovinaxo@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="page-contact">
      <main id="main-content">
        {/* ========================================================================
             PAGE BANNER / HERO
             ======================================================================== */}
        <section className="page-banner">
          <div className="container page-banner-container">
            <div className="page-banner-breadcrumbs">
              <Link to="/">{t('pageBanners.contact.home') || (isVi ? 'Trang chủ' : 'Home')}</Link>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span>{t('pageBanners.contact.current') || (isVi ? 'Liên hệ' : 'Contact')}</span>
            </div>
            <h1 className="page-banner-title">
              {t('pageBanners.contact.title') || (isVi ? 'Liên Hệ & Kết Nối Hợp Tác B2B' : 'Contact & B2B Partnership Inquiries')}
            </h1>
            <p className="page-banner-desc">
              {t('pageBanners.contact.subtitle') || (isVi ? 'Đội ngũ xuất nhập khẩu và kinh doanh VINAXO sẵn sàng phản hồi chi tiết về quy cách sản phẩm, mẫu thử và bảng giá đơn hàng container trong vòng 24 giờ.' : 'VINAXO’s export and sales team is ready to respond in detail regarding specifications, sample kits, and container pricing within 24 hours.')}
            </p>
          </div>
        </section>

        {/* ========================================================================
             SECTION 2: COMPANY CONTACT & INQUIRY FORM (BALANCED 2-COLUMN LAYOUT)
             ======================================================================== */}
        <section className="subpage-section">
          <div className="container">
            <div className="contact-page-grid">
              {/* Left Column (40%): Verified Corporate Credentials & Direct Channels */}
              <div className="contact-info-panel">
                {/* Card 1: Legal Entity & Head Office */}
                <div className="contact-card-box">
                  <div className="contact-card-header">
                    <div className="contact-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <div className="contact-card-title">
                      {t('contactPage.cardLegalTitle') || (isVi ? 'Pháp Nhân & Trụ Sở Doanh Nghiệp' : 'Corporate Identity & Headquarters')}
                    </div>
                  </div>
                  <div className="contact-card-text">
                    <p><strong>{t('contactPage.cards.legalName') || 'CÔNG TY TNHH VINAXO'}</strong></p>
                    <p>
                      <strong>{t('contactPage.cards.taxLabel') || (isVi ? 'Mã số thuế:' : 'Tax Code:')}</strong>{' '}
                      <span>{t('contactPage.cards.taxVal') || (isVi ? '1201611681 do Sở KH&ĐT Tiền Giang cấp' : '1201611681 issued by DPI of Tien Giang Province')}</span>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.hqLabel') || (isVi ? 'Trụ sở:' : 'Headquarters:')}</strong>{' '}
                      <span>{t('contactPage.cards.hqVal') || (isVi ? 'Khu phố 5, Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang, Việt Nam' : 'Quarter 5, Vinh Binh Town, Go Cong Tay District, Tien Giang Province, Vietnam')}</span>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.repLabel') || (isVi ? 'Đại diện pháp luật:' : 'Legal Representative:')}</strong>{' '}
                      <span>{t('contactPage.cards.repVal') || (isVi ? 'Ông Nguyễn Anh Khoa (Giám đốc)' : 'Mr. Nguyen Anh Khoa (Director)')}</span>
                    </p>
                  </div>
                </div>

                {/* Card 2: Factory & Sourcing Hubs */}
                <div className="contact-card-box">
                  <div className="contact-card-header">
                    <div className="contact-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6.01" y2="6"></line>
                        <line x1="6" y1="18" x2="6.01" y2="18"></line>
                      </svg>
                    </div>
                    <div className="contact-card-title">
                      {t('contactPage.cardFacilityTitle') || (isVi ? 'Cơ Sở Sản Xuất & Vùng Chuyên Canh' : 'Processing Facility & Sourcing Hubs')}
                    </div>
                  </div>
                  <div className="contact-card-text">
                    <p>
                      <strong>{t('contactPage.cards.areaLabel') || (isVi ? 'Quy mô nhà máy:' : 'Factory Area:')}</strong>{' '}
                      <span>{t('contactPage.cards.areaVal') || (isVi ? '4.000 m² tại Huyện Gò Công Tây, Tiền Giang' : '4,000 m² in Go Cong Tay District, Tien Giang')}</span>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.capLabel') || (isVi ? 'Năng lực chế biến:' : 'Processing Capacity:')}</strong>{' '}
                      <span>{t('contactPage.cards.capVal') || (isVi ? '1.000+ tấn trái cây tươi/tháng' : '1,000+ metric tons of fresh fruit / month')}</span>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.hubLabel') || (isVi ? 'Vùng nguyên liệu Mekong:' : 'Mekong Sourcing Hubs:')}</strong>{' '}
                      <span>{t('contactPage.cards.hubVal') || (isVi ? 'Đồng Tháp (vùng xoài Cát Chu), Tiền Giang (thơm Tân Phước, thanh long Chợ Gạo), Vĩnh Long' : 'Dong Thap (Cat Chu mango), Tien Giang (Tan Phuoc pineapple, Cho Gao dragon fruit), Vinh Long')}</span>
                    </p>
                  </div>
                </div>

                {/* Card 3: Direct Hotline & Commercial Contacts */}
                <div className="contact-card-box">
                  <div className="contact-card-header">
                    <div className="contact-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="contact-card-title">
                      {t('contactPage.cardHotlineTitle') || (isVi ? 'Đường Dây Nóng & Liên Hệ Trực Tiếp' : 'Direct Hotline & Business Contacts')}
                    </div>
                  </div>
                  <div className="contact-card-text">
                    <p>
                      <strong>{t('contactPage.cards.hotlineLabel') || (isVi ? 'Hotline B2B:' : 'B2B Hotline:')}</strong>{' '}
                      <a href="tel:+84907494177" style={{ color: 'var(--forest-green)', fontWeight: 700 }}>
                        0907 494 177
                      </a>{' '}
                      (+84 907 494 177)
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.emailLabel') || (isVi ? 'Email chính thức:' : 'Official Email:')}</strong>{' '}
                      <a href="mailto:thaovinaxo@gmail.com" style={{ color: 'var(--forest-green)', fontWeight: 700 }}>
                        thaovinaxo@gmail.com
                      </a>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.webLabel') || (isVi ? 'Website:' : 'Website:')}</strong>{' '}
                      <a href="https://vinaxo.vn/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--forest-green)', fontWeight: 600 }}>
                        https://vinaxo.vn/
                      </a>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.hoursLabel') || (isVi ? 'Giờ làm việc:' : 'Working Hours:')}</strong>{' '}
                      <span>{t('contactPage.cards.hoursVal') || (isVi ? 'Thứ Hai – Thứ Bảy: 07:30 – 17:00 (GMT+7)' : 'Monday – Saturday: 07:30 – 17:00 (GMT+7)')}</span>
                    </p>
                  </div>
                </div>

                {/* Card 4: International Trade & Export Support */}
                <div className="contact-card-box">
                  <div className="contact-card-header">
                    <div className="contact-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                    </div>
                    <div className="contact-card-title">
                      {t('contactPage.cardExportTitle') || (isVi ? 'Kênh Xuất Khẩu & Hỗ Trợ Quốc Tế' : 'Export Desk & International Trade')}
                    </div>
                  </div>
                  <div className="contact-card-text">
                    <p>
                      <strong>{t('contactPage.cards.supportLabel') || (isVi ? 'Hỗ trợ trực tuyến:' : 'Instant Messaging:')}</strong>{' '}
                      WhatsApp / Zalo / WeChat (+84 907 494 177)
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.incotermsLabel') || (isVi ? 'Điều kiện thương mại:' : 'Trade Incoterms:')}</strong>{' '}
                      <span>{t('contactPage.cards.incotermsVal') || (isVi ? 'CIF, FOB, CFR các cảng Cát Lái, Hiệp Phước, Cái Mép' : 'CIF, FOB, CFR Cat Lai, Hiep Phuoc, Cai Mep ports')}</span>
                    </p>
                    <p>
                      <strong>{t('contactPage.cards.sampleLabel') || (isVi ? 'Chính sách mẫu thử:' : 'Sample Policy:')}</strong>{' '}
                      <span>{t('contactPage.cards.sampleVal') || (isVi ? 'Cung cấp mẫu miễn phí cho đối tác doanh nghiệp (chuyển phát nhanh DHL / FedEx)' : 'Free commercial sample kits for qualifying B2B partners via DHL / FedEx')}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (60%): Single Unified Contact & Quote Form */}
              <div className="contact-form-panel" id="quote-form">
                <div className="contact-form-header">
                  <span className="section-label">
                    {t('contactPage.directInquiryLabel') || 'DIRECT INQUIRY'}
                  </span>
                  <h2 className="font-serif contact-form-title">
                    {t('contactPage.panelTitle') || (isVi ? 'Biểu Mẫu Báo Giá & Hợp Tác B2B' : 'B2B Quotation & Partnership Form')}
                  </h2>
                  <p className="contact-form-sub">
                    {t('contactPage.panelDesc') || (isVi ? 'Quý đối tác vui lòng điền các thông tin dưới đây. Yêu cầu của bạn sẽ được chuyển thẳng đến bộ phận kinh doanh và xuất nhập khẩu của VINAXO.' : 'Please provide your requirements below. Your inquiry is routed directly to VINAXO’s executive export desk.')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Anti-spam honeypot field (hidden from real users, caught by automated bots) */}
                  <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="company_website_hp">Leave this field blank</label>
                    <input
                      type="text"
                      id="company_website_hp"
                      name="company_website_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Row 1: Name & Email */}
                  <div className="contact-form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactName">
                        {t('contactPage.nameLabel') || (isVi ? 'Họ và Tên *' : 'Full Name *')}
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="name"
                        className="form-input"
                        placeholder={isVi ? 'Nguyễn Văn A' : 'Johnathan Smith'}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactEmail">
                        {t('contactPage.emailLabel') || (isVi ? 'Email Doanh Nghiệp *' : 'Business Email *')}
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="email"
                        className="form-input"
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        maxLength={120}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Company & Phone */}
                  <div className="contact-form-grid-2" style={{ marginTop: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactCompany">
                        {t('contactPage.companyLabel') || (isVi ? 'Công Ty & Quốc Gia' : 'Company & Country')}
                      </label>
                      <input
                        type="text"
                        id="contactCompany"
                        name="company"
                        className="form-input"
                        placeholder={isVi ? 'Tên Công ty, Quốc gia' : 'Company Name, Country'}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        maxLength={150}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactPhone">
                        {t('contactPage.phoneLabel') || (isVi ? 'Số Điện Thoại / WhatsApp / Zalo' : 'Phone / WhatsApp / Zalo')}
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="phone"
                        className="form-input"
                        placeholder="+84 907 494 177"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        maxLength={30}
                      />
                    </div>
                  </div>

                  {/* Row 3: Inquiry Type & Product of Interest */}
                  <div className="contact-form-grid-2" style={{ marginTop: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactInquiryType">
                        {t('contactPage.inquiryTypeLabel') || (isVi ? 'Mục Đích Liên Hệ / Loại Yêu Cầu *' : 'Inquiry Purpose / Type *')}
                      </label>
                      <select
                        id="contactInquiryType"
                        name="inquiryType"
                        className="form-select"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        required
                      >
                        <option value="" disabled>
                          {t('contactPage.subjectDefault') || (isVi ? 'Chọn mục đích liên hệ...' : 'Select purpose...')}
                        </option>
                        <option value="Báo giá đơn hàng xuất khẩu container (FCL/LCL)">
                          {isVi ? 'Báo giá đơn hàng xuất khẩu container (FCL/LCL)' : 'Export container quotation (FCL/LCL)'}
                        </option>
                        <option value="Gia công nhãn riêng Private Label / OEM">
                          {isVi ? 'Gia công nhãn riêng Private Label / OEM' : 'Private Label OEM Processing'}
                        </option>
                        <option value="Thông tin sản phẩm & Thông số kỹ thuật">
                          {isVi ? 'Thông tin sản phẩm & Thông số kỹ thuật' : 'Product specifications & Laboratory COA'}
                        </option>
                        <option value="Yêu cầu gửi mẫu thử sản phẩm">
                          {isVi ? 'Yêu cầu gửi mẫu thử sản phẩm' : 'Request commercial sample kit'}
                        </option>
                        <option value="Hợp tác đại lý phân phối trong nước & quốc tế">
                          {isVi ? 'Hợp tác đại lý phân phối trong nước & quốc tế' : 'Domestic & International Distribution'}
                        </option>
                        <option value="Liên hệ chung / Hợp tác cung ứng nông sản">
                          {isVi ? 'Liên hệ chung / Hợp tác cung ứng nông sản' : 'General inquiry / Agricultural partnership'}
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contactProduct">
                        {t('contactPage.productLabel') || (isVi ? 'Sản Phẩm Quan Tâm' : 'Product of Interest')}
                      </label>
                      <select
                        id="contactProduct"
                        name="product"
                        className="form-select"
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      >
                        <option value="Tất cả sản phẩm / Chưa xác định">
                          {isVi ? 'Tất cả sản phẩm / Chưa xác định' : 'All Products / Undecided'}
                        </option>
                        <option value="Xoài sấy dẻo tự nhiên">
                          {isVi ? 'Xoài sấy dẻo tự nhiên' : 'Soft-Dried Mango'}
                        </option>
                        <option value="Mít sấy dẻo & sấy chân không">
                          {isVi ? 'Mít sấy dẻo & sấy chân không' : 'Soft-Dried & Vacuum Jackfruit'}
                        </option>
                        <option value="Thanh long sấy dẻo">
                          {isVi ? 'Thanh long sấy dẻo' : 'Soft-Dried Dragon Fruit'}
                        </option>
                        <option value="Thơm (Dứa) sấy dẻo tự nhiên">
                          {isVi ? 'Thơm (Dứa) sấy dẻo tự nhiên' : 'Soft-Dried Pineapple'}
                        </option>
                        <option value="Trái cây bọc sô-cô-la & Thanh năng lượng">
                          {isVi ? 'Trái cây bọc sô-cô-la & Thanh năng lượng' : 'Chocolate Fruit & Energy Bars'}
                        </option>
                        <option value="Gia công theo quy cách riêng (OEM)">
                          {isVi ? 'Gia công theo quy cách riêng (OEM)' : 'Custom OEM Specification'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Detailed Message */}
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label" htmlFor="contactMessage">
                      {t('contactPage.messageLabel') || (isVi ? 'Nội Dung Yêu Cầu Chi Tiết *' : 'Detailed Requirements *')}
                    </label>
                    <textarea
                      id="contactMessage"
                      name="message"
                      className="form-textarea"
                      placeholder={isVi ? 'Vui lòng cung cấp chi tiết: Sản phẩm quan tâm, sản lượng dự kiến (tấn), quy cách bao bì, cảng đích CIF/FOB...' : 'Please describe your requirement: estimated volume (MT), packaging specifications, target port CIF/FOB...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      maxLength={3000}
                      required
                      style={{ minHeight: '140px' }}
                    ></textarea>
                  </div>

                  {/* Error banner if validation fails */}
                  {formError && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: 'var(--radius-sm)',
                        color: '#B91C1C',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                      role="alert"
                    >
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div style={{ marginTop: '24px' }}>
                    <button
                      type="submit"
                      id="contactSubmitBtn"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '1rem' }}
                    >
                      <span>{t('contactPage.submitBtn') || (isVi ? 'Gửi Yêu Cầu Báo Giá Đến VINAXO' : 'Submit Quotation Request to VINAXO')}</span>
                      <Send size={16} style={{ marginLeft: '8px', flexShrink: 0 }} />
                    </button>
                  </div>

                  {/* Confirmation banner if clicked */}
                  {submitted && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        backgroundColor: 'var(--light-sage)',
                        border: '1px solid #A6C9AD',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--forest-green)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      ✓ {isVi ? 'Đang mở ứng dụng email của bạn để gửi yêu cầu đến thaovinaxo@gmail.com...' : 'Launching your mail client to dispatch your inquiry to thaovinaxo@gmail.com...'}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: '16px',
                      fontSize: '0.75rem',
                      color: '#76857D',
                      lineHeight: 1.5,
                      borderTop: '1px dashed #E2E8E4',
                      paddingTop: '12px',
                    }}
                  >
                    {isVi ? (
                      <>
                        <em>Kết nối thực tế:</em> Sau khi nhấn gửi, hệ thống sẽ mở ứng dụng email của bạn với tiêu đề và nội dung được tạo tự động để gửi trực tiếp tới <strong>thaovinaxo@gmail.com</strong>. Quý khách cũng có thể liên hệ trực tiếp qua Zalo/Hotline <strong>0907 494 177</strong> để nhận báo giá nhanh nhất.
                      </>
                    ) : (
                      <>
                        <em>Direct connection:</em> Upon submitting, your default email client opens with prefilled commercial details to <strong>thaovinaxo@gmail.com</strong>. You may also call directly via Hotline <strong>+84 907 494 177</strong>.
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
             SECTION 3: STANDALONE VERIFIED LOCATION MAP
             ======================================================================== */}
        <section className="subpage-section contact-map-section">
          <div className="container">
            <div className="subpage-intro-header text-center" style={{ marginBottom: '24px' }}>
              <span className="section-label">
                {t('contactPage.mapSectionLabel') || (isVi ? 'VỊ TRÍ ĐỊA LÝ' : 'GEOGRAPHIC LOCATION')}
              </span>
              <h2 className="section-title font-serif">
                {t('contactPage.mapSectionTitle') || (isVi ? 'Nhà Máy Chế Biến VINAXO Tiền Giang' : 'VINAXO Tien Giang Processing Facility')}
              </h2>
              <p className="section-desc mx-auto" style={{ maxWidth: '760px' }}>
                {t('contactPage.mapSectionDesc') || (isVi ? 'Vị trí thuận lợi tại trung tâm vùng nguyên liệu trái cây đồng bằng sông Cửu Long, kết nối nhanh chóng tới các cảng biển xuất khẩu quốc tế (Cát Lái, Hiệp Phước, Cái Mép).' : 'Strategically situated in the heart of Mekong Delta fruit orchards, connecting quickly to major container export terminals (Cat Lai, Hiep Phuoc, Cai Mep).')}
              </p>
            </div>

            <div className="contact-map-card">
              <div className="contact-map-bar">
                <div>
                  <div className="contact-map-coords">
                    {t('contactPage.mapCoords') || (isVi ? 'Tọa độ: 10.380295, 106.516139 • Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tiền Giang' : 'Coordinates: 10.380295, 106.516139 • Vinh Binh Town, Go Cong Tay District, Tien Giang')}
                  </div>
                  <div className="contact-map-address">
                    {t('contactPage.mapDistance') || (isVi ? 'Cách TP. Hồ Chí Minh ~65 km • Thuận tiện vận chuyển container xuất khẩu đường bộ và đường thủy' : '~65 km from Ho Chi Minh City • Seamless highway and waterway container logistics')}
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=V%C4%A9nh+B%C3%ACnh+G%C3%B2+C%C3%B4ng+T%C3%A2y+Ti%E1%BB%81n+Giang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
                >
                  <span>{t('contactPage.openMapBtn') || (isVi ? 'Mở Google Maps' : 'Open Google Maps')}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#EEF4F0' }}>
                {/* Fallback card underlay — rendered in DOM underneath the iframe.
                    If iframe is blocked by an ad-blocker or strict browser privacy shield,
                    this fallback provides full GPS details and an instant button to open Maps */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#F3F7F4'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#D7E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#1B5E39' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700, color: '#103D2A' }}>
                    {isVi ? 'Nhà Máy Chế Biến VINAXO Tiền Giang' : 'VINAXO Processing Plant Tien Giang'}
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: '#55635C', maxWidth: '480px' }}>
                    {isVi
                      ? 'Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang (Tọa độ: 10.380295, 106.516139)'
                      : 'Vinh Binh Town, Go Cong Tay District, Tien Giang Province (Coords: 10.380295, 106.516139)'}
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=V%C4%A9nh+B%C3%ACnh+G%C3%B2+C%C3%B4ng+T%C3%A2y+Ti%E1%BB%81n+Giang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                  >
                    <span>{isVi ? 'Mở Chỉ Đường Google Maps' : 'Open Directions in Google Maps'}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginLeft: '6px' }}>
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                </div>

                <iframe
                  className="contact-map-frame"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62744.15610052932!2d106.516139!3d10.380295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aa5b7a12a55ab%3A0xb35a098863f6a27e!2zVHAuIEfDsiBDw7RuZyBUw6J5LCBUaeG7gW4gR2lhbmcsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ chỉ đường đến nhà máy VINAXO Tiền Giang"
                  style={{ position: 'relative', zIndex: 1, width: '100%', height: '400px', border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
             SECTION 4: PARTNERSHIP CTA BAR
             ======================================================================== */}
        <section className="container" style={{ paddingBottom: '64px' }}>
          <div className="contact-partnership-cta">
            <div className="contact-partnership-content">
              <span className="section-label" style={{ color: '#A6C9AD', marginBottom: '6px', display: 'inline-block' }}>
                {t('contactPage.ctaLabel') || (isVi ? 'HỢP TÁC BỀN VỮNG' : 'SUSTAINABLE PARTNERSHIP')}
              </span>
              <h3 className="contact-partnership-title font-serif">
                {t('contactPage.ctaTitle') || (isVi ? 'Đồng Hành Phát Triển Cùng Nông Sản Việt' : 'Partnering with Vietnamese Agriculture')}
              </h3>
              <p className="contact-partnership-desc">
                {t('contactPage.ctaDesc') || (isVi ? 'VINAXO luôn sẵn sàng chào đón các đối tác nhập khẩu quốc tế, chuỗi bán lẻ, nhà phân phối và doanh nghiệp gia công OEM. Cam kết cung ứng ổn định, chất lượng đồng nhất và đồng hành dài hạn.' : 'VINAXO welcomes global importers, retail chains, distributors, and OEM private label partners. We guarantee reliable supply, consistent quality, and long-term commitment.')}
              </p>
            </div>
            <div className="contact-partnership-actions">
              <a
                href="#quote-form"
                className="btn btn-primary"
                style={{ backgroundColor: '#FFFFFF', color: 'var(--forest-green)', borderColor: '#FFFFFF' }}
              >
                <span>{t('contactPage.ctaQuoteBtn') || (isVi ? 'Nhận Báo Giá Ngay' : 'Request a Quote Now')}</span>
              </a>
              <a
                href="tel:+84907494177"
                className="btn btn-outline"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#FFFFFF' }}
              >
                <span>Hotline: 0907 494 177</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================
             SECTION 5: B2B TRADE FAQ
             ======================================================================== */}
        <section className="subpage-section" style={{ backgroundColor: 'var(--cream-bg)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <div className="subpage-intro-header text-center">
              <span className="section-label">
                {t('contactPage.faqLabel') || (isVi ? 'TRADE FAQ' : 'B2B TRADE FAQ')}
              </span>
              <h2 className="section-title font-serif">
                {t('contactPage.faqTitle') || (isVi ? 'Câu Hỏi Thường Gặp Về Giao Thương B2B' : 'Frequently Asked Questions About B2B Trade')}
              </h2>
              <p className="section-desc mx-auto" style={{ maxWidth: '760px' }}>
                {t('contactPage.faqDesc') || (isVi ? 'Giải đáp nhanh các thắc mắc về số lượng đặt hàng tối thiểu, mẫu thử và thủ tục thanh toán quốc tế.' : 'Quick answers regarding minimum order quantities, commercial samples, and international trade payment terms.')}
              </p>
            </div>

            <div className="cards-grid-3" style={{ marginTop: '48px' }}>
              <div className="subpage-feature-card">
                <h3 className="feature-card-title" style={{ fontSize: '1.0625rem' }}>
                  {t('contactPage.faqQ1') || (isVi ? 'Số lượng đặt hàng tối thiểu (MOQ) là bao nhiêu?' : 'What is the Minimum Order Quantity (MOQ)?')}
                </h3>
                <p className="feature-card-desc">
                  {t('contactPage.faqA1') || (isVi ? 'Đối với đơn hàng xuất khẩu nhãn riêng (OEM), MOQ tiêu chuẩn là 1 tấn cho mỗi loại sản phẩm. Với đơn hàng đóng thùng master carton xuất khẩu nguyên liệu, MOQ linh hoạt từ 500 kg.' : 'For OEM private label export orders, standard MOQ is 1 metric ton per SKU. For bulk raw material export in master cartons, MOQ is flexible from 500 kg.')}
                </p>
              </div>

              <div className="subpage-feature-card">
                <h3 className="feature-card-title" style={{ fontSize: '1.0625rem' }}>
                  {t('contactPage.faqQ2') || (isVi ? 'Thời gian gửi mẫu thử (Sample) mất bao lâu?' : 'How long does sample delivery take?')}
                </h3>
                <p className="feature-card-desc">
                  {t('contactPage.faqA2') || (isVi ? 'VINAXO cung cấp mẫu thử miễn phí cho đối tác doanh nghiệp. Mẫu được đóng gói và chuyển phát nhanh quốc tế qua DHL/FedEx, thông thường tới tay đối tác trong vòng 3 – 5 ngày làm việc.' : 'VINAXO provides free commercial sample kits for business partners via DHL/FedEx express delivery, typically arriving within 3 – 5 business days worldwide.')}
                </p>
              </div>

              <div className="subpage-feature-card">
                <h3 className="feature-card-title" style={{ fontSize: '1.0625rem' }}>
                  {t('contactPage.faqQ3') || (isVi ? 'Điều khoản thanh toán quốc tế áp dụng là gì?' : 'What payment terms are accepted?')}
                </h3>
                <p className="feature-card-desc">
                  {t('contactPage.faqA3') || (isVi ? 'VINAXO chấp nhận các phương thức thanh toán thương mại quốc tế thông dụng bao gồm T/T (Telegraphic Transfer) và L/C không hủy ngang mở tại ngân hàng uy tín hàng đầu.' : 'VINAXO accepts standard international trade instruments including T/T (Telegraphic Transfer) and irrevocable Letter of Credit (L/C at sight) opened at Tier-1 banks.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
