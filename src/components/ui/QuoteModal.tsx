import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Send, ShieldCheck, Mail, Copy, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getProductLocalized, productsData } from '../../data/products';
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
  const { t, language, pick } = useLanguage();

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
        pick({
          vi: 'Vui lòng điền họ tên, email và số điện thoại liên hệ.',
          en: 'Please provide your full name, email address, and phone number.',
          ko: '성함, 기업 이메일, 전화번호를 모두 입력해 주세요.',
          zh: '请填写您的姓名、企业邮箱和联系电话。'
        })
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg(
        pick({
          vi: 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.',
          en: 'Please provide a valid business email address (e.g. name@company.com).',
          ko: '올바른 기업 이메일 주소(예: name@company.com)를 입력해 주세요.',
          zh: '电子邮箱格式无效，请输入有效的企业邮箱（如 name@company.com）。'
        })
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
        pick({
          vi: 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu của bạn vẫn được giữ nguyên.',
          en: 'Could not dispatch via server right now. Your form details are preserved.',
          ko: '현재 서버를 통해 요청을 발송할 수 없습니다. 입력하신 정보는 그대로 유지됩니다.',
          zh: '暂时无法通过服务器提交，您填写的表单内容已安全保留。'
        })
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
          aria-label={pick({ vi: 'Đóng hộp thoại báo giá', en: 'Close modal', ko: '견적 창 닫기', zh: '关闭报价弹窗' })}
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
              {pick({
                vi: 'Yêu cầu báo giá của bạn đã được chuyển tiếp đến Bộ phận Xuất khẩu VINAXO. Đội ngũ thương mại quốc tế sẽ phản hồi trong vòng 24 giờ làm việc.',
                en: 'Your B2B quote inquiry has been forwarded to VINAXO Export Desk. Our team will review your specifications and contact you within 24 business hours.',
                ko: '견적 문의가 VINAXO 수출 사업부로 전달되었습니다. 해외 영업팀이 사양 검토 후 영업일 기준 24시간 이내에 회신드리겠습니다.',
                zh: '您的B2B报价请求已转交 VINAXO 出口部。我们的国际贸易团队将在 24 个工作小时内与您联系。'
              })}
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
                {pick({ vi: `Mã tham chiếu: ${referenceId}`, en: `Reference ID: ${referenceId}`, ko: `접수 번호: ${referenceId}`, zh: `受理编号：${referenceId}` })}
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
                      <span>{pick({ vi: 'Mở ứng dụng Email', en: 'Open Email App', ko: '이메일 앱 열기', zh: '打开邮件客户端' })}</span>
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
                          ? pick({ vi: 'Đã sao chép', en: 'Copied', ko: '복사됨', zh: '已复制' })
                          : pick({ vi: 'Sao chép nội dung', en: 'Copy Inquiry', ko: '문의 내용 복사', zh: '复制询盘内容' })}
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
                    {pick({
                      vi: '-- Chọn sản phẩm hoặc dịch vụ quan tâm --',
                      en: '-- Select product of interest --',
                      ko: '-- 관심 제품 또는 서비스 선택 --',
                      zh: '-- 请选择意向产品或代工服务 --'
                    })}
                  </option>
                  {productsData.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {getProductLocalized(p, language).name}
                    </option>
                  ))}
                  <option value={VALUE_ADDED_VALUE}>
                    {pick({
                      vi: 'Trái cây sấy tẩm mật ong / Phủ Sô-cô-la / Granola',
                      en: 'Honey-Infused & Chocolate-Dipped / Granola',
                      ko: '천연 벌꿀 인퓨즈드 / 초콜릿 디핑 / 그래놀라',
                      zh: '蜂蜜浸渍果干 / 巧克力蘸酱果干 / 格兰诺拉麦片'
                    })}
                  </option>
                  <option value={OEM_VALUE}>
                    {pick({
                      vi: 'Gia công OEM / ODM & Đóng gói Nhãn riêng (Private Label)',
                      en: 'OEM / ODM & Private Label Project',
                      ko: 'OEM / ODM 자체 브랜드(PB) 위탁 생산',
                      zh: 'OEM / ODM 自有品牌贴牌代工项目'
                    })}
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
                  placeholder={pick({
                    vi: 'Sản lượng dự kiến (VD: 1 cont 20ft), cảng đích, quy cách đóng gói OEM hoặc ghi chú...',
                    en: 'Estimated volume (e.g. 1x20ft FCL), target destination, OEM packing or requirements...',
                    ko: '예상 물량(예: 20ft FCL 1컨테이너), 도착항, OEM 포장 사양 등 기재...',
                    zh: '预计采购量（如 1×20尺整柜）、目的港、OEM 包装规格或特殊要求...'
                  })}
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
                    {pick({
                      vi: 'Bảo mật thông tin thương mại B2B',
                      en: 'Protected B2B confidentiality',
                      ko: 'B2B 기업 거래 정보 비밀 보장',
                      zh: '严格保护 B2B 商业询盘隐私'
                    })}
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
