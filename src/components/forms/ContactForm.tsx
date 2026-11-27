import React, { useEffect, useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getProductLocalized, productsData } from '../../data/products';
import { submitInquiry } from '../../services/inquiryService';
import {
  type ContactRequest,
  FIELD_LIMITS,
  OEM_PRODUCT_ID,
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
import { Button } from '../ui/Button';

export interface ContactFormProps {
  initialProduct?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '', onSuccess }) => {
  const { language, pick } = useLanguage();
  const initialResolved = resolveCanonicalProduct(initialProduct);

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    productId: initialResolved.productId,
    customProductLabel: initialResolved.customLabel,
    quantity: '',
    message: '',
  });

  useEffect(() => {
    const next = resolveCanonicalProduct(initialProduct);
    setFormData((prev) => ({
      ...prev,
      productId: next.productId,
      customProductLabel: next.customLabel,
    }));
  }, [initialProduct]);

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [failedPayload, setFailedPayload] = useState<ContactRequest | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val || val === OEM_PRODUCT_ID || productsData.some((p) => p.slug === val)) {
      setFormData((prev) => ({ ...prev, productId: val, customProductLabel: '' }));
    } else {
      setFormData((prev) => ({ ...prev, productId: '', customProductLabel: val }));
    }
  };

  const dispatchPayload = async (payload: ContactRequest) => {
    setIsSubmitting(true);
    setErrorMessage('');
    const result = await submitInquiry(payload);
    setIsSubmitting(false);

    if (result.ok && result.delivered) {
      setReferenceId(result.referenceId || '');
      setFailedPayload(null);
      setIsSubmitted(true);
      onSuccess?.();
      return;
    }

    setErrorMessage(
      result.error ||
        pick({
          vi: 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu của bạn vẫn được giữ nguyên.',
          en: 'Unable to dispatch right now. Your entered form data is preserved.',
          ko: '현재 서버를 통해 문의를 발송할 수 없습니다. 입력하신 정보는 그대로 유지됩니다.',
          zh: '暂时无法通过服务器提交，您填写的表单内容已安全保留。',
        })
    );
    setFailedPayload(payload);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
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
      setErrorMessage(validation.summaryError);
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
      country: formData.country.trim() || undefined,
      productId: formData.productId || undefined,
      productName: resolvedName || 'General Catalog',
      quantity: formData.quantity.trim() || undefined,
      message: formData.message.trim(),
      source: typeof window !== 'undefined' ? window.location.pathname : 'ContactForm',
      hp_website: honeypot,
    };

    await dispatchPayload(payload);
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
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
          {pick({
            vi: 'Cảm Ơn Quý Doanh Nghiệp Đã Liên Hệ!',
            en: 'Thank You for Your Partnership Inquiry!',
            ko: 'B2B 파트너십 문의가 정상 접수되었습니다!',
            zh: '感谢贵司联系 VINAXO！',
          })}
        </h3>
        <p
          style={{
            color: 'var(--color-body)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 14px',
          }}
        >
          {pick({
            vi: 'Yêu cầu của bạn đã được hệ thống tiếp nhận. Đội ngũ VINAXO sẽ liên hệ lại trong thời gian sớm nhất.',
            en: 'Your request has been received by our system. The VINAXO team will get back to you as soon as possible.',
            ko: '요청이 시스템에 정상 접수되었습니다. VINAXO 팀이 검토 후 빠른 시일 내에 연락드리겠습니다.',
            zh: '您的请求已成功提交至系统，VINAXO 团队将尽快与您联系跟进。',
          })}
        </p>
        {referenceId && (
          <div style={{ marginBottom: '20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>
            {pick({
              vi: `Mã yêu cầu: ${referenceId}`,
              en: `Reference ID: ${referenceId}`,
              ko: `접수 번호: ${referenceId}`,
              zh: `受理编号：${referenceId}`,
            })}
          </div>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            setIsSubmitted(false);
            setReferenceId('');
            setFormData({
              fullName: '',
              company: '',
              email: '',
              phone: '',
              country: '',
              productId: '',
              customProductLabel: '',
              quantity: '',
              message: '',
            });
          }}
        >
          {pick({
            vi: 'Gửi Yêu Cầu Khác',
            en: 'Submit Another Inquiry',
            ko: '추가 문의 작성',
            zh: '提交其他询盘',
          })}
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
      <ContactHoneypotField id="cf_hp_website" name="hp_website" value={honeypot} onChange={setHoneypot} />

      <div style={{ marginBottom: '20px' }}>
        <h3
          className="title-display"
          style={{
            fontSize: '1.55rem',
            color: 'var(--color-heading)',
            marginBottom: '8px',
          }}
        >
          {pick({
            vi: 'Gửi Thư Liên Hệ & Yêu Cầu Báo Giá Xuất Khẩu',
            en: 'Direct B2B Quote & Export Inquiry Form',
            ko: '수출 견적 및 B2B 파트너십 직접 문의',
            zh: '发送出口询盘与 B2B 合作报价申请',
          })}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-body)' }}>
          {pick({
            vi: 'Điền thông tin bên dưới để gửi trực tiếp qua hệ thống tiếp nhận B2B của VINAXO.',
            en: 'Fill in your requirements below to submit directly through VINAXO’s B2B export desk.',
            ko: '아래 내용을 작성해 주시면 VINAXO B2B 수출 전담 시스템으로 직접 접수됩니다.',
            zh: '请填写下方需求信息并直接提交至 VINAXO B2B 出口业务系统。',
          })}
        </p>
      </div>

      <SelectedProductPreview productId={formData.productId} locale={language} />

      <ContactFormStatus
        locale={language}
        isSubmitted={false}
        errorMessage={errorMessage}
        failedPayload={failedPayload}
        onRetry={failedPayload ? () => dispatchPayload(failedPayload) : undefined}
        isSubmitting={isSubmitting}
      />

      {/* Row 1: Required Name & Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Họ và tên người liên hệ', en: 'Full Name', ko: '담당자 성함', zh: '联系人姓名' })} <span className="required">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            maxLength={FIELD_LIMITS.fullNameMax}
            value={formData.fullName}
            onChange={handleChange}
            placeholder={pick({ vi: 'Ví dụ: Nguyễn Văn A', en: 'e.g. Johnathan Smith', ko: '예: 김민수 / Johnathan Smith', zh: '例如：张伟 / Johnathan Smith' })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Email doanh nghiệp', en: 'Business Email', ko: '기업 이메일', zh: '企业邮箱' })} <span className="required">*</span>
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            name="email"
            maxLength={FIELD_LIMITS.emailMax}
            value={formData.email}
            onChange={handleChange}
            placeholder="procurement@company.com"
            className="form-input"
            required
          />
        </div>
      </div>

      {/* Row 2: Optional Company & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Tên công ty / Tổ chức (tùy chọn)', en: 'Company / Enterprise (optional)', ko: '회사명 / 법인명 (선택)', zh: '公司 / 机构名称（选填）' })}
          </label>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            maxLength={FIELD_LIMITS.companyMax}
            value={formData.company}
            onChange={handleChange}
            placeholder={pick({ vi: 'Ví dụ: Pacific Export Trading Ltd', en: 'e.g. Global Foods Trading Ltd', ko: '예: Pacific Export Trading Ltd', zh: '例如：环球食品贸易有限公司' })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Điện thoại / WhatsApp (tùy chọn)', en: 'Phone / WhatsApp (optional)', ko: '전화 / WhatsApp (선택)', zh: '电话 / WhatsApp（选填）' })}
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            name="phone"
            maxLength={FIELD_LIMITS.phoneMax}
            value={formData.phone}
            onChange={handleChange}
            placeholder="(+84) 984 815 016"
            className="form-input"
          />
        </div>
      </div>

      {/* Row 3: Optional Country & Product */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Quốc gia / Thị trường (tùy chọn)', en: 'Country / Target Market (optional)', ko: '국가 / 수출 시장 (선택)', zh: '国家 / 目标市场（选填）' })}
          </label>
          <input
            type="text"
            name="country"
            autoComplete="country-name"
            maxLength={FIELD_LIMITS.countryMax}
            value={formData.country}
            onChange={handleChange}
            placeholder={pick({ vi: 'Ví dụ: Hoa Kỳ, Đức, Hàn Quốc, Việt Nam', en: 'e.g. United States, Germany, South Korea', ko: '예: 한국, 미국, 독일, 일본', zh: '例如：中国、韩国、美国、德国' })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Sản phẩm quan tâm (tùy chọn)', en: 'Product Line (optional)', ko: '관심 품목 (선택)', zh: '意向产品系列（选填）' })}
          </label>
          <select name="productId" value={formData.productId || formData.customProductLabel} onChange={handleProductSelect} className="form-select">
            <option value="">
              {pick({
                vi: '-- Chọn sản phẩm hoặc dịch vụ B2B --',
                en: '-- Select Product or B2B Requirement --',
                ko: '-- 제품 또는 B2B 서비스 선택 --',
                zh: '-- 请选择产品或 B2B 合作项目 --',
              })}
            </option>
            {productsData.map((p) => (
              <option key={p.id} value={p.slug}>
                {getProductLocalized(p, language).name}
              </option>
            ))}
            <option value={OEM_PRODUCT_ID}>
              {pick({
                vi: 'Gia công OEM nhãn riêng / Đóng gói xuất khẩu (MOQ từ 200 kg)',
                en: 'OEM / ODM Private Label Formulation & Packaging (MOQ from 200 kg)',
                ko: 'OEM / ODM 자체 브랜드(PB) 위탁 생산 (MOQ 200kg~)',
                zh: 'OEM / ODM 自有品牌贴牌与出口包装（起订量 200 公斤起）',
              })}
            </option>
          </select>
        </div>
      </div>

      {/* Row 4: Optional Quantity */}
      <div className="form-group">
        <label className="form-label">
          {pick({
            vi: 'Sản lượng dự kiến & Yêu cầu đóng gói (tùy chọn)',
            en: 'Estimated Volume & Packaging Preference (optional)',
            ko: '예상 주문 수량 및 포장 사양 (선택)',
            zh: '预计采购量及包装规格要求（选填）',
          })}
        </label>
        <input
          type="text"
          name="quantity"
          maxLength={FIELD_LIMITS.quantityMax}
          value={formData.quantity}
          onChange={handleChange}
          placeholder={pick({
            vi: 'Ví dụ: 1 container 20ft (FCL) / Túi zip 250g / Thùng carton 10kg',
            en: 'e.g. 1 FCL 20ft / 5 tons bulk / 250g retail pouch OEM',
            ko: '예: 20ft 컨테이너 1대(FCL) / 250g 지퍼 파우치 / 10kg 벌크 카톤',
            zh: '例如：20尺整柜（FCL）/ 250g 自封袋 / 10kg 出口纸箱',
          })}
          className="form-input"
        />
      </div>

      {/* Row 5: Required Message */}
      <div className="form-group">
        <label className="form-label">
          {pick({
            vi: 'Nội dung yêu cầu chi tiết',
            en: 'Detailed Message / Technical Inquiries',
            ko: '상세 문의 내용 및 기술 요구사항',
            zh: '详细需求与技术咨询内容',
          })}{' '}
          <span className="required">*</span>
        </label>
        <textarea
          name="message"
          maxLength={FIELD_LIMITS.messageMax}
          value={formData.message}
          onChange={handleChange}
          placeholder={pick({
            vi: 'Ghi chú các tiêu chuẩn an toàn thực phẩm cần đáp ứng, yêu cầu chứng chỉ, hoặc kế hoạch giao hàng...',
            en: 'Specify target port, certification requirements (BRCGS, OCOP), custom formulation needs, or delivery schedule...',
            ko: '도착항(CIF/FOB), 필요 인증(BRCGS, FDA 등), 맞춤형 레시피 및 희망 납기 일정을 기재해 주세요...',
            zh: '请填写目的港、所需认证标准（BRCGS、FDA 等）、定制配方要求或预期交货时间...',
          })}
          className="form-textarea"
          style={{ minHeight: '110px' }}
          required
        />
      </div>

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
        <ContactPrivacyNotice locale={language} />

        <Button type="submit" variant="primary" disabled={isSubmitting} icon={<Send size={16} />}>
          {isSubmitting
            ? pick({ vi: 'Đang gửi...', en: 'Sending...', ko: '전송 중...', zh: '正在发送...' })
            : pick({ vi: 'Gửi Yêu Cầu Báo Giá', en: 'Send Partnership Request', ko: '견적 요청 보내기', zh: '发送询盘报价请求' })}
        </Button>
      </div>
    </form>
  );
};
