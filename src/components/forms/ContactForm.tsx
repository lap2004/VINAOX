import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, Mail, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getProductLocalized, productsData } from '../../data/products';
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
  const { language, pick } = useLanguage();

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
        pick({
          vi: 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Số điện thoại liên hệ.',
          en: 'Please enter your Name, Business Email, and Phone number.',
          ko: '담당자 성함, 기업 이메일, 전화번호를 모두 입력해 주세요.',
          zh: '请完整填写联系人姓名、企业邮箱及联系电话。'
        })
      );
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage(
        pick({
          vi: 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.',
          en: 'Please enter a valid business email address.',
          ko: '올바른 기업 이메일 형식이 아닙니다. 다시 확인해 주세요.',
          zh: '电子邮箱格式不正确，请核对后重试。'
        })
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
        pick({
          vi: 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu của bạn vẫn được giữ nguyên.',
          en: 'Unable to dispatch right now. Your entered form data is preserved.',
          ko: '현재 서버를 통해 문의를 발송할 수 없습니다. 입력하신 정보는 그대로 유지됩니다.',
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
          {pick({
            vi: 'Cảm Ơn Quý Doanh Nghiệp Đã Liên Hệ!',
            en: 'Thank You for Your Partnership Inquiry!',
            ko: 'B2B 파트너십 문의가 정상 접수되었습니다!',
            zh: '感谢贵司联系 VINAXO！'
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
            vi: 'Yêu cầu báo giá và thông số kỹ thuật của bạn đã được chuyển tới Bộ phận Xuất khẩu & Thương mại B2B VINAXO. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
            en: 'Your inquiry and specifications have been forwarded to the VINAXO B2B Export Desk. Our team will review your requirements and respond within 24 business hours.',
            ko: '견적 및 사양 문의가 VINAXO B2B 수출팀에 전달되었습니다. 영업일 기준 24시간 이내에 상세 검토 후 회신드리겠습니다.',
            zh: '您的报价与规格需求已转交 VINAXO B2B 出口事业部。我们的外贸团队将在 24 个工作小时内与您对接。'
          })}
        </p>
        {referenceId && (
          <div style={{ marginBottom: '20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>
            {pick({
              vi: `Mã tham chiếu: ${referenceId}`,
              en: `Reference ID: ${referenceId}`,
              ko: `접수 번호: ${referenceId}`,
              zh: `受理编号：${referenceId}`
            })}
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
          {pick({
            vi: 'Gửi Yêu Cầu Khác',
            en: 'Submit Another Inquiry',
            ko: '추가 문의 작성',
            zh: '提交其他询盘'
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
          {pick({
            vi: 'Gửi Thư Liên Hệ & Yêu Cầu Báo Giá Xuất Khẩu',
            en: 'Direct B2B Quote & Export Inquiry Form',
            ko: '수출 견적 및 B2B 파트너십 직접 문의',
            zh: '发送出口询盘与 B2B 合作报价申请'
          })}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-body)' }}>
          {pick({
            vi: 'Điền thông tin doanh nghiệp và quy cách sản phẩm cần báo giá CIF/FOB. Nhà máy VINAXO cung cấp mẫu thử nghiệm và bảng kiểm nghiệm an toàn thực phẩm.',
            en: 'Fill in your enterprise details for CIF/FOB quotations. VINAXO provides commercial sample kits and full laboratory safety COAs.',
            ko: '기업 정보 및 CIF/FOB 견적 희망 품목을 입력해 주세요. VINAXO 공장은 무상 샘플 키트와 식품안전 시험성적서(COA)를 제공합니다.',
            zh: '请填写贵司信息及所需 CIF/FOB 报价产品规格。VINAXO 工厂提供试吃样品套装及完整第三方食品安全检测报告（COA）。'
          })}
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
                <span>{pick({ vi: 'Mở ứng dụng Email', en: 'Open Email App', ko: '이메일 앱 열기', zh: '打开邮件客户端' })}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyFallback}
                className="btn btn-outline"
                style={{ padding: '7px 12px', fontSize: '0.8rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>
                  {copied
                    ? pick({ vi: 'Đã sao chép', en: 'Copied', ko: '복사됨', zh: '已复制' })
                    : pick({ vi: 'Sao chép nội dung', en: 'Copy Inquiry', ko: '문의 내용 복사', zh: '复制询盘内容' })}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Row 1: Name & Company */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Họ và tên người liên hệ', en: 'Full Name', ko: '담당자 성함', zh: '联系人姓名' })} <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            autoComplete="name"
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
            placeholder={pick({ vi: 'Ví dụ: Nguyễn Văn A', en: 'e.g. Johnathan Smith', ko: '예: 김민수 / Johnathan Smith', zh: '例如：张伟 / Johnathan Smith' })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Tên công ty / Tổ chức', en: 'Company / Enterprise', ko: '회사명 / 법인명', zh: '公司 / 机构名称' })}
          </label>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            maxLength={150}
            value={formData.company}
            onChange={handleChange}
            placeholder={pick({ vi: 'Ví dụ: Pacific Export Trading Ltd', en: 'e.g. Global Foods Trading Ltd', ko: '예: Pacific Export Trading Ltd', zh: '例如：环球食品贸易有限公司' })}
            className="form-input"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-mobile-1">
        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Email doanh nghiệp', en: 'Business Email', ko: '기업 이메일', zh: '企业邮箱' })} <span className="required">*</span>
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
            {pick({ vi: 'Điện thoại / WhatsApp', en: 'Phone / WhatsApp', ko: '전화 / WhatsApp', zh: '电话 / WhatsApp' })} <span className="required">*</span>
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
          <label className="form-label">
            {pick({ vi: 'Quốc gia / Thị trường', en: 'Country / Target Market', ko: '국가 / 목표 수출 시장', zh: '国家 / 目标市场' })}
          </label>
          <input
            type="text"
            name="country"
            autoComplete="country-name"
            maxLength={100}
            value={formData.country}
            onChange={handleChange}
            placeholder={pick({ vi: 'Ví dụ: Hoa Kỳ, Đức, Hàn Quốc, Việt Nam', en: 'e.g. United States, Germany, South Korea', ko: '예: 한국, 미국, 독일, 일본', zh: '例如：中国、韩国、美国、德国' })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {pick({ vi: 'Sản phẩm quan tâm', en: 'Product Line', ko: '관심 품목', zh: '意向产品系列' })}
          </label>
          <select name="product" value={formData.product} onChange={handleChange} className="form-select">
            <option value="">
              {pick({
                vi: '-- Chọn sản phẩm hoặc dịch vụ B2B --',
                en: '-- Select Product or B2B Requirement --',
                ko: '-- 제품 또는 B2B 서비스 선택 --',
                zh: '-- 请选择产品或 B2B 合作项目 --'
              })}
            </option>
            {productsData.map((p) => {
              const pName = getProductLocalized(p, language).name;
              return (
                <option key={p.id} value={pName}>
                  {pName}
                </option>
              );
            })}
            <option value="OEM / Private Label">
              {pick({
                vi: 'Gia công OEM nhãn riêng / Đóng gói xuất khẩu (MOQ từ 200 kg)',
                en: 'OEM / ODM Private Label Formulation & Packaging (MOQ from 200 kg)',
                ko: 'OEM / ODM 자체 브랜드(PB) 위탁 생산 (MOQ 200kg~)',
                zh: 'OEM / ODM 自有品牌贴牌与出口包装（起订量 200 公斤起）'
              })}
            </option>
          </select>
        </div>
      </div>

      {/* Row 4: Volume & Destination */}
      <div className="form-group">
        <label className="form-label">
          {pick({
            vi: 'Sản lượng dự kiến & Yêu cầu đóng gói',
            en: 'Estimated Volume & Packaging Preference',
            ko: '예상 주문 수량 및 포장 사양',
            zh: '预计采购量及包装规格要求'
          })}
        </label>
        <input
          type="text"
          name="volume"
          maxLength={200}
          value={formData.volume}
          onChange={handleChange}
          placeholder={pick({
            vi: 'Ví dụ: 1 container 20ft (FCL) / Túi zip 250g / Thùng carton 10kg',
            en: 'e.g. 1 FCL 20ft / 5 tons bulk / 250g retail pouch OEM',
            ko: '예: 20ft 컨테이너 1대(FCL) / 250g 지퍼 파우치 / 10kg 벌크 카톤',
            zh: '例如：20尺整柜（FCL）/ 250g 自封袋 / 10kg 出口纸箱'
          })}
          className="form-input"
        />
      </div>

      {/* Row 5: Message */}
      <div className="form-group">
        <label className="form-label">
          {pick({
            vi: 'Nội dung trao đổi cụ thể',
            en: 'Detailed Message / Technical Inquiries',
            ko: '세부 요청 사항 및 기술 문의',
            zh: '具体需求与技术咨询内容'
          })}
        </label>
        <textarea
          name="message"
          maxLength={3000}
          value={formData.message}
          onChange={handleChange}
          placeholder={pick({
            vi: 'Ghi chú các tiêu chuẩn an toàn thực phẩm cần đáp ứng, yêu cầu chứng chỉ kiểm dịch, hoặc kế hoạch giao hàng...',
            en: 'Specify target port, certification requirements (BRCGS, OCOP), custom formulation needs, or delivery schedule...',
            ko: '도착항(CIF/FOB), 필요 인증(BRCGS, FDA 등), 맞춤형 레시피 및 희망 납기 일정을 기재해 주세요...',
            zh: '请填写目的港、所需认证标准（BRCGS、FDA 等）、定制配方要求或预期交货时间...'
          })}
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
            {pick({
              vi: 'Thông tin bảo mật • Tổ hợp nhà máy 25.000 m² tại Xã Vĩnh Bình, Tỉnh Đồng Tháp',
              en: 'Direct from Factory • 25,000 m² facility in Vinh Binh Commune, Dong Thap Province',
              ko: '기업 정보 비밀 보장 • 동탑성 빈빈 25,000 m² 직영 공장 출고',
              zh: '商业信息严格保密 • 越南同塔省永平 25,000 m² 直属现代化工厂直供'
            })}
          </span>
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting} icon={<Send size={16} />}>
          {isSubmitting
            ? pick({ vi: 'Đang gửi...', en: 'Sending...', ko: '전송 중...', zh: '正在发送...' })
            : pick({ vi: 'Gửi Yêu Cầu Báo Giá', en: 'Send Partnership Request', ko: '견적 요청 보내기', zh: '发送询盘报价请求' })}
        </Button>
      </div>
    </form>
  );
};
