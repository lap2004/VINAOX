import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getProductLocalized, productsData } from '../../data/products';
import { submitInquiry } from '../../services/inquiryService';
import {
  type ContactRequest,
  FIELD_LIMITS,
  OEM_PRODUCT_ID,
  VALUE_ADDED_PRODUCT_ID,
  getLocalizedProductLabel,
  resolveCanonicalProduct,
  validateContactForm,
} from '../contact/contactSchema';
import {
  ContactHoneypotField,
  ContactPrivacyNotice,
  SelectedProductPreview,
} from '../contact/ContactFormFields';
import { ContactFormStatus } from '../contact/ContactFormStatus';
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
  const { t, language, pick } = useLanguage();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const initialResolved = resolveCanonicalProduct(defaultProduct);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    productId: initialResolved.productId,
    customProductLabel: initialResolved.customLabel,
    quantity: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [failedPayload, setFailedPayload] = useState<ContactRequest | null>(null);
  const [honeypot, setHoneypot] = useState('');

  // Reset product selection cleanly whenever the modal opens or target product changes (prevents stale state)
  useEffect(() => {
    if (!isOpen) return;
    const resolved = resolveCanonicalProduct(defaultProduct);
    setFormData((prev) => ({
      ...prev,
      productId: resolved.productId,
      customProductLabel: resolved.customLabel,
    }));
    setIsSubmitted(false);
    setReferenceId('');
    setErrorMsg('');
    setFailedPayload(null);
  }, [isOpen, defaultProduct]);

  // Body scroll lock & focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => closeBtnRef.current?.focus(), 20);
    } else {
      document.body.style.overflow = '';
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (
      !val ||
      val === VALUE_ADDED_PRODUCT_ID ||
      val === OEM_PRODUCT_ID ||
      productsData.some((p) => p.slug === val)
    ) {
      setFormData((prev) => ({ ...prev, productId: val, customProductLabel: '' }));
    } else {
      setFormData((prev) => ({ ...prev, productId: '', customProductLabel: val }));
    }
  };

  const dispatchPayload = async (payload: ContactRequest) => {
    setIsSubmitting(true);
    setErrorMsg('');
    const result = await submitInquiry(payload);
    setIsSubmitting(false);

    if (result.ok && result.delivered) {
      setReferenceId(result.referenceId || '');
      setFailedPayload(null);
      setIsSubmitted(true);
      return;
    }

    setErrorMsg(
      result.error ||
        pick({
          vi: 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu của bạn vẫn được giữ nguyên.',
          en: 'Could not dispatch via server right now. Your form details are preserved.',
          ko: '현재 서버를 통해 요청을 발송할 수 없습니다. 입력하신 정보는 그대로 유지됩니다.',
          zh: '暂时无法通过服务器提交，您填写的表单内容已安全保留。',
        })
    );
    setFailedPayload(payload);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg('');
    setFailedPayload(null);

    if (honeypot.trim()) {
      return;
    }

    const validation = validateContactForm(
      {
        fullName: formData.fullName,
        email: formData.email,
        message: formData.message,
      },
      language
    );

    if (!validation.valid) {
      setErrorMsg(validation.summaryError);
      return;
    }

    const resolvedName = getLocalizedProductLabel(
      formData.productId,
      formData.customProductLabel,
      language
    );

    const payload: ContactRequest = {
      requestType: 'quotation',
      locale: language,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      company: formData.company.trim() || undefined,
      productId: formData.productId || undefined,
      productName: resolvedName || 'General Catalog',
      quantity: formData.quantity.trim() || undefined,
      message: formData.message.trim(),
      source: typeof window !== 'undefined' ? window.location.pathname : 'QuoteModal',
      hp_website: honeypot,
    };

    await dispatchPayload(payload);
  };

  const selectValue = formData.productId || formData.customProductLabel || '';

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
          maxWidth: '580px',
          padding: 'clamp(20px, 3.5vw, 30px)',
          borderRadius: '20px',
        }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={pick({ vi: 'Đóng hộp thoại báo giá', en: 'Close modal', ko: '견적 창 닫기', zh: '关闭报价弹窗' })}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
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
          <div style={{ textAlign: 'center', padding: '24px 10px' }} role="status">
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
                marginBottom: '14px',
              }}
            >
              <CheckCircle size={32} />
            </div>
            <h3
              className="title-serif"
              style={{
                fontSize: '1.45rem',
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
              {pick({
                vi: 'Yêu cầu của bạn đã được hệ thống tiếp nhận. Đội ngũ VINAXO sẽ liên hệ lại trong thời gian sớm nhất.',
                en: 'Your request has been received by our system. The VINAXO team will get back to you as soon as possible.',
                ko: '견적 요청이 시스템에 정상 접수되었습니다. VINAXO 팀이 검토 후 빠른 시일 내에 연락드리겠습니다.',
                zh: '您的报价请求已成功提交至系统，VINAXO 团队将尽快与您联系跟进。',
              })}
            </p>
            {referenceId && (
              <div
                style={{
                  display: 'inline-block',
                  marginBottom: '18px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--cream-bg)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--dark-chocolate)',
                }}
              >
                {pick({ vi: `Mã yêu cầu: ${referenceId}`, en: `Reference ID: ${referenceId}`, ko: `접수 번호: ${referenceId}`, zh: `受理编号：${referenceId}` })}
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
            <div style={{ marginBottom: '14px', paddingRight: '36px' }}>
              <span
                className="section-eyebrow"
                style={{
                  display: 'inline-block',
                  fontSize: '0.74rem',
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
                  fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)',
                  color: 'var(--color-heading)',
                  margin: '4px 0 6px',
                  lineHeight: 1.25,
                }}
              >
                {t('modal.title', 'Request a Wholesale Quote')}
              </h2>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--color-body)',
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {pick({
                  vi: 'Điền họ tên, email và nội dung yêu cầu trực tiếp trên hệ thống — đội ngũ VINAXO sẽ tiếp nhận và phản hồi.',
                  en: 'Submit your name, email, and requirements directly through our system for B2B export quotation.',
                  ko: '성함, 이메일 및 문의 내용을 입력해 주시면 시스템으로 직접 접수되어 수출 견적을 안내해 드립니다.',
                  zh: '请填写您的姓名、邮箱及具体需求并直接提交，系统将直达 VINAXO 出口业务团队。',
                })}
              </p>
            </div>

            <SelectedProductPreview productId={formData.productId} locale={language} />

            <ContactFormStatus
              locale={language}
              isSubmitted={false}
              errorMessage={errorMsg}
              failedPayload={failedPayload}
              onRetry={failedPayload ? () => dispatchPayload(failedPayload) : undefined}
              isSubmitting={isSubmitting}
            />

            <form onSubmit={handleSubmit} noValidate>
              <ContactHoneypotField
                id="quote_company_fax_hp"
                name="quote_company_fax_hp"
                value={honeypot}
                onChange={setHoneypot}
              />

              {/* Row 1: Required Name & Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteName" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
                    {t('modal.nameLabel', 'Full Name')} <span className="required">*</span>
                  </label>
                  <input
                    id="quoteName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.fullNameMax}
                    placeholder={t('modal.namePlaceholder', 'John Doe / Nguyễn Văn A')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteEmail" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
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
                    maxLength={FIELD_LIMITS.emailMax}
                    placeholder={t('modal.emailPlaceholder', 'buyer@company.com')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Optional Phone & Company */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quotePhone" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
                    {pick({ vi: 'Số điện thoại / WhatsApp (tùy chọn)', en: 'Phone / WhatsApp (optional)', ko: '전화번호 / WhatsApp (선택)', zh: '电话 / WhatsApp（选填）' })}
                  </label>
                  <input
                    id="quotePhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.phoneMax}
                    placeholder={t('modal.phonePlaceholder', '(+84) 984 815 016')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteCompany" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
                    {pick({ vi: 'Tên doanh nghiệp (tùy chọn)', en: 'Company Name (optional)', ko: '회사명 (선택)', zh: '公司名称（选填）' })}
                  </label>
                  <input
                    id="quoteCompany"
                    type="text"
                    autoComplete="organization"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.companyMax}
                    placeholder={t('modal.companyPlaceholder', 'Pacific Foods Import LLC')}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                  />
                </div>
              </div>

              {/* Row 3: Optional Product & Quantity */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteProduct" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
                    {t('modal.productLabel', 'Product of Interest')}
                  </label>
                  <select
                    id="quoteProduct"
                    name="productId"
                    value={selectValue}
                    onChange={handleProductSelect}
                    className="form-select"
                    style={{ padding: '9px 12px', cursor: 'pointer' }}
                  >
                    <option value="">
                      {pick({
                        vi: '-- Chọn sản phẩm hoặc dịch vụ --',
                        en: '-- Select product or service --',
                        ko: '-- 관심 품목 선택 --',
                        zh: '-- 请选择意向产品 --',
                      })}
                    </option>
                    {productsData.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {getProductLocalized(p, language).name}
                      </option>
                    ))}
                    <option value={VALUE_ADDED_PRODUCT_ID}>
                      {pick({
                        vi: 'Trái cây sấy tẩm mật ong / Phủ Sô-cô-la / Granola',
                        en: 'Honey-Infused & Chocolate-Dipped / Granola',
                        ko: '천연 벌꿀 인퓨즈드 / 초콜릿 디핑 / 그래놀라',
                        zh: '蜂蜜浸渍果干 / 巧克力蘸酱果干 / 格兰诺拉麦片',
                      })}
                    </option>
                    <option value={OEM_PRODUCT_ID}>
                      {pick({
                        vi: 'Gia công OEM / ODM & Nhãn riêng (Private Label)',
                        en: 'OEM / ODM & Private Label Project',
                        ko: 'OEM / ODM 자체 브랜드(PB) 생산',
                        zh: 'OEM / ODM 自有品牌贴牌项目',
                      })}
                    </option>
                    {formData.customProductLabel && (
                      <option value={formData.customProductLabel}>{formData.customProductLabel}</option>
                    )}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="quoteQuantity" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
                    {pick({ vi: 'Số lượng dự kiến (tùy chọn)', en: 'Estimated Quantity (optional)', ko: '예상 주문 수량 (선택)', zh: '预计采购量（选填）' })}
                  </label>
                  <input
                    id="quoteQuantity"
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    maxLength={FIELD_LIMITS.quantityMax}
                    placeholder={pick({
                      vi: 'VD: 1 cont 20ft / 500 kg OEM',
                      en: 'e.g. 1x20ft FCL / 500 kg',
                      ko: '예: 20ft FCL 1대 / 500kg',
                      zh: '如：1×20尺整柜 / 500 公斤',
                    })}
                    className="form-input"
                    style={{ padding: '9px 12px' }}
                  />
                </div>
              </div>

              {/* Row 4: Required Message */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label htmlFor="quoteMessage" className="form-label" style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
                  {pick({
                    vi: 'Nội dung yêu cầu chi tiết',
                    en: 'Requirements & Inquiry Details',
                    ko: '상세 문의 내용',
                    zh: '详细需求说明',
                  })}{' '}
                  <span className="required">*</span>
                </label>
                <textarea
                  id="quoteMessage"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={FIELD_LIMITS.messageMax}
                  placeholder={pick({
                    vi: 'Cảng đích CIF/FOB, quy cách bao bì, yêu cầu chứng nhận hoặc câu hỏi kỹ thuật...',
                    en: 'Target port CIF/FOB, packaging specification, certification needs, or sample request...',
                    ko: '도착항(CIF/FOB), 포장 규격, 필요 인증 또는 샘플 요청 사항을 입력해 주세요...',
                    zh: '请填写目的港（CIF/FOB）、包装规格、认证要求或样品申请说明...',
                  })}
                  className="form-textarea"
                  style={{
                    minHeight: '76px',
                    padding: '9px 12px',
                    resize: 'vertical',
                  }}
                  rows={3}
                  required
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <ContactPrivacyNotice locale={language} compact />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={<Send size={15} />}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  {isSubmitting
                    ? pick({ vi: 'Đang gửi...', en: 'Submitting...', ko: '전송 중...', zh: '正在提交...' })
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
