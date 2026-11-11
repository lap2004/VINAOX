import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Anchor,
  Building2,
  Clock,
  Factory,
  Globe,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Send,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { productsData } from '../data/products';
import { COMPANY_INFO } from '../data/company';
import { BROCHURE_FAQS } from '../data/brochureData';

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

    window.location.href = `mailto:cuonghoang0710@gmail.com?subject=${subject}&body=${body}`;
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
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
              {/* Left Column (42%): Editorial Corporate Dossier (3 Clean Sections) */}
              <aside className="contact-info-panel" aria-label={isVi ? 'Thông tin doanh nghiệp và liên hệ VINAXO' : 'VINAXO Corporate Profile & Direct Contacts'}>
                <div className="contact-panel-accent" aria-hidden="true" />

                {/* SECTION A — COMPANY & LEGAL INFORMATION */}
                <section className="contact-editorial-section">
                  <h2 className="contact-editorial-heading">
                    <Building2 size={18} className="contact-section-icon" aria-hidden="true" />
                    <span>{isVi ? 'Thông tin doanh nghiệp' : 'Company & Legal Information'}</span>
                  </h2>

                  <div className="contact-company-name">
                    {isVi ? COMPANY_INFO.legalNameVi : `${COMPANY_INFO.legalNameEn} (${COMPANY_INFO.shortName})`}
                  </div>

                  <dl className="contact-detail-list">
                    <div className="contact-detail-row">
                      <dt>{isVi ? 'Mã số thuế' : 'Tax ID'}</dt>
                      <dd>{COMPANY_INFO.taxCode}</dd>
                    </div>
                    <div className="contact-detail-row">
                      <dt>{isVi ? 'Trụ sở' : 'Headquarters'}</dt>
                      <dd>{isVi ? COMPANY_INFO.headquarters.addressVi : COMPANY_INFO.headquarters.addressEn}</dd>
                    </div>
                    <div className="contact-detail-row">
                      <dt>{isVi ? 'Đại diện pháp luật' : 'Legal Representative'}</dt>
                      <dd>{isVi ? 'Ông Hoàng Mạnh Cường (Jimmy)' : 'Mr. Hoang Manh Cuong (Jimmy)'}</dd>
                    </div>
                  </dl>
                </section>

                {/* SECTION B — FACTORY & PRODUCTION CAPACITY */}
                <section className="contact-editorial-section">
                  <h2 className="contact-editorial-heading">
                    <Factory size={18} className="contact-section-icon" aria-hidden="true" />
                    <span>{isVi ? 'Năng lực sản xuất' : 'Factory & Production Capacity'}</span>
                  </h2>

                  <div className="contact-cap-pair">
                    <div className="contact-cap-stat">
                      <div className="contact-cap-value">25,000 m²</div>
                      <div className="contact-cap-label">
                        {isVi ? 'Quy mô nhà máy' : 'Total factory area'}
                      </div>
                    </div>

                    <div className="contact-cap-stat contact-cap-stat-divider">
                      <div className="contact-cap-value">
                        300 <span className="contact-cap-unit">{isVi ? 'tấn / tháng' : 'tons / mo'}</span>
                      </div>
                      <div className="contact-cap-label">
                        {isVi ? 'Năng lực chế biến thành phẩm' : 'Finished output capacity'}
                      </div>
                    </div>
                  </div>

                  <dl className="contact-detail-list">
                    <div className="contact-detail-row">
                      <dt>{isVi ? 'Vùng nguyên liệu Mekong' : 'Mekong Sourcing Region'}</dt>
                      <dd>{isVi ? COMPANY_INFO.headquarters.sourcingHubVi : COMPANY_INFO.headquarters.sourcingHubEn}</dd>
                    </div>
                  </dl>
                </section>

                {/* SECTION C — DIRECT CONTACT & EXPORT SUPPORT */}
                <section className="contact-editorial-section contact-editorial-section-last">
                  <h2 className="contact-editorial-heading">
                    <Phone size={18} className="contact-section-icon" aria-hidden="true" />
                    <span>{isVi ? 'Liên hệ & Hỗ trợ xuất khẩu' : 'Direct Contact & Export Support'}</span>
                  </h2>

                  <div className="contact-direct-list">
                    <div className="contact-direct-item">
                      <Phone size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{isVi ? 'Hotline B2B:' : 'B2B Hotline:'}</span>{' '}
                        <a href={`tel:${COMPANY_INFO.contacts.hotline}`} className="contact-link-emphasis">
                          {COMPANY_INFO.contacts.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Mail size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{isVi ? 'Email chính thức:' : 'Official Email:'}</span>{' '}
                        <a href={`mailto:${COMPANY_INFO.contacts.email}`} className="contact-link-emphasis">
                          {COMPANY_INFO.contacts.email}
                        </a>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Globe size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">Website:</span>{' '}
                        <a
                          href={COMPANY_INFO.contacts.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link-plain"
                        >
                          {COMPANY_INFO.contacts.websiteDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Clock size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{isVi ? 'Giờ làm việc:' : 'Business Hours:'}</span>{' '}
                        <span>
                          {t('contactPage.cards.hoursVal') ||
                            (isVi ? 'Thứ Hai – Thứ Bảy: 07:30 – 17:00 (GMT+7)' : 'Monday – Saturday: 07:30 – 17:00 (GMT+7)')}
                        </span>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <MessageCircle size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{isVi ? 'Hỗ trợ trực tuyến:' : 'Online Support:'}</span>{' '}
                        <a href="https://wa.me/84984815016" target="_blank" rel="noopener noreferrer" className="contact-link-plain">
                          WhatsApp (+84 984 815 016)
                        </a>
                        {' • '}
                        <a href="https://zalo.me/0984815016" target="_blank" rel="noopener noreferrer" className="contact-link-plain">
                          Zalo (0984 815 016)
                        </a>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Anchor size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{isVi ? 'Điều kiện thương mại:' : 'Trade Incoterms:'}</span>{' '}
                        <span>
                          {isVi ? 'CIF, FOB, CFR cảng Cát Lái, Hiệp Phước, Cái Mép' : 'CIF, FOB, CFR Cat Lai, Hiep Phuoc, Cai Mep Ports'}
                        </span>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Package size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{isVi ? 'Chính sách mẫu thử:' : 'Sample Policy:'}</span>{' '}
                        <span>
                          {t('contactPage.cards.sampleVal') ||
                            (isVi
                              ? 'Duyệt mẫu trước khi sản xuất đại trà (chuyển phát nhanh DHL / FedEx)'
                              : 'Approved samples first (express courier DHL / FedEx)')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Integrated Compact Scannable QR Sub-block */}
                  <div className="contact-qr-subblock">
                    <picture className="contact-qr-thumb">
                      <source srcSet="/assets/images/contact-qr-jimmy.webp" type="image/webp" />
                      <img
                        src="/assets/images/contact-qr-jimmy.jpg"
                        alt={isVi ? 'Mã QR liên hệ trực tiếp Mạnh Cường (Jimmy)' : 'Mạnh Cường (Jimmy) direct contact QR code'}
                        width={72}
                        height={72}
                        loading="lazy"
                      />
                    </picture>
                    <div className="contact-qr-meta">
                      <div className="contact-qr-name">Mạnh Cường (Jimmy)</div>
                      <div className="contact-qr-caption">
                        {isVi
                          ? 'Quét mã QR để lưu danh bạ liên hệ xuất khẩu trực tiếp'
                          : 'Scan QR code to save direct B2B export contact'}
                      </div>
                    </div>
                  </div>
                </section>
              </aside>

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
                        placeholder="(+84) 984 815 016"
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
                        {productsData.map((p) => (
                          <option key={p.id} value={isVi ? p.nameVi : p.name}>
                            {isVi ? p.nameVi : p.name}
                          </option>
                        ))}
                        <option value="Honey-Infused & Chocolate-Dipped / Fruit & Nut Balls / Granola">
                          {isVi
                            ? 'Trái cây mật ong / Phủ sô-cô-la / Granola & Viên hạt'
                            : 'Honey-Infused / Chocolate-Dipped / Granola & Fruit Balls'}
                        </option>
                        <option value="Gia công OEM / Đóng gói Nhãn riêng">
                          {isVi ? 'Gia công theo quy cách riêng (OEM / ODM)' : 'Custom OEM / Private Label Project'}
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
                        backgroundColor: 'var(--brand-orange-soft)',
                        border: '1px solid var(--brand-orange)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--dark-chocolate)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      ✓ {isVi ? `Đang mở ứng dụng email của bạn để gửi yêu cầu đến ${COMPANY_INFO.contacts.email}...` : `Launching your mail client to dispatch your inquiry to ${COMPANY_INFO.contacts.email}...`}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: '16px',
                      fontSize: '0.78rem',
                      color: 'var(--muted-text)',
                      lineHeight: 1.5,
                      borderTop: '1px dashed var(--soft-border)',
                      paddingTop: '12px',
                    }}
                  >
                    {isVi ? (
                      <>
                        <em>Kết nối thực tế:</em> Sau khi nhấn gửi, hệ thống sẽ mở ứng dụng email của bạn với tiêu đề và nội dung được tạo tự động để gửi trực tiếp tới <strong>{COMPANY_INFO.contacts.email}</strong>. Quý khách cũng có thể liên hệ trực tiếp qua WhatsApp/Zalo <strong>{COMPANY_INFO.contacts.phoneDisplay}</strong> để nhận báo giá nhanh nhất.
                      </>
                    ) : (
                      <>
                        <em>Direct connection:</em> Upon submitting, your default email client opens with prefilled commercial details to <strong>{COMPANY_INFO.contacts.email}</strong>. You may also call directly via Hotline <strong>{COMPANY_INFO.contacts.phoneDisplay}</strong>.
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
                    {t('contactPage.mapCoords') || (isVi ? 'Tọa độ: 10.380295, 106.516139 • Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp' : 'Coordinates: 10.380295, 106.516139 • Quarter 5, Vinh Binh Commune, Dong Thap Province')}
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
              <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: 'var(--brand-bg)' }}>
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
                    backgroundColor: 'var(--brand-bg)'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--brand-orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: 'var(--vinaxo-red)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700, color: 'var(--dark-chocolate)' }}>
                    {isVi ? 'Nhà Máy Chế Biến VINAXO' : 'VINAXO Processing Plant'}
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-body)', maxWidth: '480px' }}>
                    {isVi ? COMPANY_INFO.headquarters.addressVi : COMPANY_INFO.headquarters.addressEn}
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
                  title="Bản đồ chỉ đường đến nhà máy VINAXO"
                  style={{ position: 'relative', zIndex: 1, width: '100%', height: '400px', border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================
             SECTION 4: PARTNERSHIP CTA BAR
             ======================================================================== */}
        <section className="container" style={{ paddingBottom: 'var(--section-space)' }}>
          <div className="contact-partnership-cta">
            <div className="contact-partnership-content">
              <span className="section-label" style={{ color: 'var(--brand-orange)', marginBottom: '6px', display: 'inline-block' }}>
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
              >
                <span>{t('contactPage.ctaQuoteBtn') || (isVi ? 'Nhận Báo Giá Ngay' : 'Request a Quote Now')}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.contacts.hotline}`}
                className="btn btn-outline-white"
              >
                <span>Hotline: {COMPANY_INFO.contacts.phoneDisplay}</span>
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
              <p className="section-desc mx-auto" style={{ maxWidth: '760px', margin: '0 auto' }}>
                {t('contactPage.faqDesc') || (isVi ? 'Giải đáp nhanh các thắc mắc về số lượng đặt hàng tối thiểu, mẫu thử và thời gian giao hàng quốc tế.' : 'Quick answers regarding minimum order quantities, complimentary commercial samples, and typical production lead times.')}
              </p>
            </div>

            <div className="faq-grid-2" style={{ marginTop: '48px' }}>
              {BROCHURE_FAQS.map((faq) => (
                <div key={faq.id} className="subpage-feature-card">
                  <h3 className="feature-card-title" style={{ fontSize: '1.08rem', color: 'var(--vinaxo-red)' }}>
                    {isVi ? faq.qVi : faq.qEn}
                  </h3>
                  <p className="feature-card-desc">
                    {isVi ? faq.aVi : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
