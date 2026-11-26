import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Anchor,
  Building2,
  Check,
  Clock,
  Copy,
  Factory,
  Globe,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Send,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getProductLocalized, productsData } from '../data/products';
import {
  COMPANY_INFO,
  getCompanyAddress,
  getCompanySourcingHub,
  getLegalCompanyName,
} from '../data/company';
import { BROCHURE_FAQS } from '../data/brochureData';
import {
  InquiryPayload,
  buildInquiryPlainText,
  buildMailtoHref,
  submitInquiry,
} from '../services/inquiryService';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawInitialProduct = searchParams.get('product') || '';
  const matchedInitial = rawInitialProduct
    ? productsData.find(
        (p) =>
          p.slug.toLowerCase() === rawInitialProduct.trim().toLowerCase() ||
          p.id.toLowerCase() === rawInitialProduct.trim().toLowerCase() ||
          p.name.toLowerCase() === rawInitialProduct.trim().toLowerCase() ||
          p.nameVi.toLowerCase() === rawInitialProduct.trim().toLowerCase()
      )
    : undefined;
  const { t, language, pick } = useLanguage();
  const legalName = getLegalCompanyName(language);
  const companyAddress = getCompanyAddress(language);
  const sourcingHub = getCompanySourcingHub(language);
  const defaultProductOption = pick({
    vi: 'Tất cả sản phẩm / Chưa xác định',
    en: 'All Products / Undecided',
    ko: '전체 제품 / 미정',
    zh: '全部产品 / 待定'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: '',
    product: matchedInitial
      ? getProductLocalized(matchedInitial, language).name
      : rawInitialProduct || defaultProductOption,
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [formError, setFormError] = useState('');
  const [fallbackPayload, setFallbackPayload] = useState<InquiryPayload | null>(null);
  const [fallbackRecipient, setFallbackRecipient] = useState('');
  const [copied, setCopied] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError('');
    setSubmitted(false);
    setFallbackPayload(null);

    if (honeypot) {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedCompany = formData.company.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !formData.inquiryType || !trimmedMessage) {
      setFormError(
        pick({
          vi: 'Vui lòng điền đầy đủ các trường bắt buộc (*)',
          en: 'Please fill in all required fields (*)',
          ko: '필수 입력 항목(*)을 모두 작성해 주세요.',
          zh: '请完整填写所有必填项（*）。'
        })
      );
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError(
        pick({
          vi: 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.',
          en: 'Invalid email format. Please check and try again.',
          ko: '이메일 형식이 올바르지 않습니다. 확인 후 다시 입력해 주세요.',
          zh: '电子邮箱格式无效，请核对后重试。'
        })
      );
      return;
    }

    const payload: InquiryPayload = {
      formType: 'contact',
      language,
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      phone: trimmedPhone,
      inquiryType: formData.inquiryType,
      product: formData.product,
      message: trimmedMessage,
      sourcePage: '/contact',
      hp_website: honeypot,
    };

    setIsSubmitting(true);
    const result = await submitInquiry(payload);
    setIsSubmitting(false);

    if (result.ok && result.delivered) {
      setReferenceId(result.referenceId || '');
      setSubmitted(true);
      return;
    }

    setFormError(
      result.error ||
        pick({
          vi: 'Không thể gửi yêu cầu qua máy chủ lúc này. Dữ liệu bạn đã nhập vẫn được giữ nguyên — vui lòng dùng kênh Email hoặc WhatsApp/Zalo bên dưới.',
          en: 'Could not dispatch via server right now. Your form input is preserved — please use the direct Email, WhatsApp, or Zalo option below.',
          ko: '현재 서버로 요청을 전송할 수 없습니다. 입력하신 내용은 보존되므로 아래의 이메일, WhatsApp 또는 Zalo를 이용해 주세요.',
          zh: '当前无法通过服务器提交，您填写的内容已安全保留，请使用下方的邮箱、WhatsApp 或 Zalo 联系我们。'
        })
    );
    setFallbackPayload(payload);
    setFallbackRecipient(result.recipient || COMPANY_INFO.contacts.email);
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

  return (
    <div className="page-contact">
      <main id="main-content">
        {/* ========================================================================
             PAGE BANNER / HERO
             ======================================================================== */}
        <section className="page-banner">
          <div className="container page-banner-container">
            <div className="page-banner-breadcrumbs">
              <Link to="/">{t('pageBanners.contact.home') || pick({ vi: 'Trang chủ', en: 'Home', ko: '홈', zh: '首页' })}</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span>{t('pageBanners.contact.current') || pick({ vi: 'Liên hệ', en: 'Contact', ko: '문의하기', zh: '联系我们' })}</span>
            </div>
            <h1 className="page-banner-title">
              {t('pageBanners.contact.title') || pick({
                vi: 'Liên Hệ & Kết Nối Hợp Tác B2B',
                en: 'Contact & B2B Partnership Inquiries',
                ko: '연락처 및 B2B 수출 파트너십 문의',
                zh: '联系我们与 B2B 出口合作咨询'
              })}
            </h1>
            <p className="page-banner-desc">
              {t('pageBanners.contact.subtitle') || pick({
                vi: 'Đội ngũ xuất nhập khẩu và kinh doanh VINAXO sẵn sàng phản hồi chi tiết về quy cách sản phẩm, mẫu thử và bảng giá đơn hàng container trong vòng 24 giờ.',
                en: 'VINAXO’s export and sales team is ready to respond in detail regarding specifications, sample kits, and container pricing within 24 hours.',
                ko: 'VINAXO 수출 영업팀이 제품 규격, 샘플 키트 및 컨테이너 견적 문의에 대해 24시간 이내에 상세히 회신드립니다.',
                zh: 'VINAXO 外贸出口与商务团队将在 24 小时内为您提供详细的产品规格、样品套装及整柜报价方案。'
              })}
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
              <aside className="contact-info-panel" aria-label={pick({
                vi: 'Thông tin doanh nghiệp và liên hệ VINAXO',
                en: 'VINAXO Corporate Profile & Direct Contacts',
                ko: 'VINAXO 기업 정보 및 직통 연락처',
                zh: 'VINAXO 企业档案与直接联系方式'
              })}>
                <div className="contact-panel-accent" aria-hidden="true" />

                {/* SECTION A — COMPANY & LEGAL INFORMATION */}
                <section className="contact-editorial-section">
                  <h2 className="contact-editorial-heading">
                    <Building2 size={18} className="contact-section-icon" aria-hidden="true" />
                    <span>{pick({
                      vi: 'Thông tin doanh nghiệp',
                      en: 'Company & Legal Information',
                      ko: '기업 및 법인 정보',
                      zh: '企业法人信息'
                    })}</span>
                  </h2>

                  <div className="contact-company-name">
                    {legalName}
                  </div>

                  <dl className="contact-detail-list">
                    <div className="contact-detail-row">
                      <dt>{pick({ vi: 'Mã số thuế', en: 'Tax ID', ko: '사업자등록번호 (Tax ID)', zh: '税号 (Tax ID)' })}</dt>
                      <dd>{COMPANY_INFO.taxCode}</dd>
                    </div>
                    <div className="contact-detail-row">
                      <dt>{pick({ vi: 'Trụ sở', en: 'Headquarters', ko: '본사 및 공장', zh: '公司总部与工厂' })}</dt>
                      <dd>{companyAddress}</dd>
                    </div>
                    <div className="contact-detail-row">
                      <dt>{pick({ vi: 'Đại diện pháp luật', en: 'Legal Representative', ko: '법정 대표자', zh: '法定代表' })}</dt>
                      <dd>{pick({
                        vi: 'Ông Hoàng Mạnh Cường (Jimmy)',
                        en: 'Mr. Hoang Manh Cuong (Jimmy)',
                        ko: 'Hoang Manh Cuong (Jimmy) 이사',
                        zh: 'Hoang Manh Cuong (Jimmy) 先生'
                      })}</dd>
                    </div>
                  </dl>
                </section>

                {/* SECTION B — FACTORY & PRODUCTION CAPACITY */}
                <section className="contact-editorial-section">
                  <h2 className="contact-editorial-heading">
                    <Factory size={18} className="contact-section-icon" aria-hidden="true" />
                    <span>{pick({
                      vi: 'Năng lực sản xuất',
                      en: 'Factory & Production Capacity',
                      ko: '공장 규모 및 생산 역량',
                      zh: '工厂规模与生产能力'
                    })}</span>
                  </h2>

                  <div className="contact-cap-pair">
                    <div className="contact-cap-stat">
                      <div className="contact-cap-value">25,000 m²</div>
                      <div className="contact-cap-label">
                        {pick({ vi: 'Quy mô nhà máy', en: 'Total factory area', ko: '총 공장 부지 면적', zh: '工厂总面积' })}
                      </div>
                    </div>

                    <div className="contact-cap-stat contact-cap-stat-divider">
                      <div className="contact-cap-value">
                        300 <span className="contact-cap-unit">{pick({ vi: 'tấn / tháng', en: 'tons / mo', ko: '톤 / 월', zh: '吨 / 月' })}</span>
                      </div>
                      <div className="contact-cap-label">
                        {pick({ vi: 'Năng lực chế biến thành phẩm', en: 'Finished output capacity', ko: '월간 완제품 생산 능력', zh: '月成品加工产能' })}
                      </div>
                    </div>
                  </div>

                  <dl className="contact-detail-list">
                    <div className="contact-detail-row">
                      <dt>{pick({ vi: 'Vùng nguyên liệu Mekong', en: 'Mekong Sourcing Region', ko: '메콩 델타 원료 산지', zh: '湄公河原料产区' })}</dt>
                      <dd>{sourcingHub}</dd>
                    </div>
                  </dl>
                </section>

                {/* SECTION C — DIRECT CONTACT & EXPORT SUPPORT */}
                <section className="contact-editorial-section contact-editorial-section-last">
                  <h2 className="contact-editorial-heading">
                    <Phone size={18} className="contact-section-icon" aria-hidden="true" />
                    <span>{pick({
                      vi: 'Liên hệ & Hỗ trợ xuất khẩu',
                      en: 'Direct Contact & Export Support',
                      ko: '직통 연락처 및 수출 지원',
                      zh: '直接联系与出口贸易支持'
                    })}</span>
                  </h2>

                  <div className="contact-direct-list">
                    <div className="contact-direct-item">
                      <Phone size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{pick({ vi: 'Hotline B2B:', en: 'B2B Hotline:', ko: 'B2B 핫라인:', zh: 'B2B 商务专线：' })}</span>{' '}
                        <a href={`tel:${COMPANY_INFO.contacts.hotline}`} className="contact-link-emphasis">
                          {COMPANY_INFO.contacts.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Mail size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{pick({ vi: 'Email chính thức:', en: 'Official Email:', ko: '공식 이메일:', zh: '官方邮箱：' })}</span>{' '}
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
                        <span className="contact-direct-label">{pick({ vi: 'Giờ làm việc:', en: 'Business Hours:', ko: '업무 시간:', zh: '办公时间：' })}</span>{' '}
                        <span>
                          {t('contactPage.cards.hoursVal') ||
                            pick({
                              vi: 'Thứ Hai – Thứ Bảy: 07:30 – 17:00 (GMT+7)',
                              en: 'Monday – Saturday: 07:30 – 17:00 (GMT+7)',
                              ko: '월요일 ~ 토요일: 07:30 – 17:00 (GMT+7)',
                              zh: '周一至周六：07:30 – 17:00 (GMT+7)'
                            })}
                        </span>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <MessageCircle size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{pick({ vi: 'Hỗ trợ trực tuyến:', en: 'Online Support:', ko: '실시간 상담:', zh: '在线即时通讯：' })}</span>{' '}
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
                        <span className="contact-direct-label">{pick({ vi: 'Điều kiện thương mại:', en: 'Trade Incoterms:', ko: '무역 조건 (Incoterms):', zh: '贸易术语：' })}</span>{' '}
                        <span>
                          {pick({
                            vi: 'CIF, FOB, CFR cảng Cát Lái, Hiệp Phước, Cái Mép',
                            en: 'CIF, FOB, CFR Cat Lai, Hiep Phuoc, Cai Mep Ports',
                            ko: 'CIF, FOB, CFR (깟라이·히엡프억·까이멥 항구)',
                            zh: 'CIF、FOB、CFR（吉莱港、协福港、盖梅港）'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="contact-direct-item">
                      <Package size={16} className="contact-line-icon" aria-hidden="true" />
                      <div className="contact-direct-body">
                        <span className="contact-direct-label">{pick({ vi: 'Chính sách mẫu thử:', en: 'Sample Policy:', ko: '샘플 지원 정책:', zh: '样品支持政策：' })}</span>{' '}
                        <span>
                          {t('contactPage.cards.sampleVal') ||
                            pick({
                              vi: 'Duyệt mẫu trước khi sản xuất đại trà (chuyển phát nhanh DHL / FedEx)',
                              en: 'Approved samples first (express courier DHL / FedEx)',
                              ko: '대량 생산 전 샘플 사전 승인 (DHL / FedEx 국제 특송)',
                              zh: '大货前提供标准样品确认（DHL / FedEx 国际快递）'
                            })}
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
                        alt={pick({
                          vi: 'Mã QR liên hệ trực tiếp Mạnh Cường (Jimmy)',
                          en: 'Mạnh Cường (Jimmy) direct contact QR code',
                          ko: 'Hoang Manh Cuong (Jimmy) 직통 연락처 QR 코드',
                          zh: 'Hoang Manh Cuong (Jimmy) 直连二维码'
                        })}
                        width={72}
                        height={72}
                        loading="lazy"
                      />
                    </picture>
                    <div className="contact-qr-meta">
                      <div className="contact-qr-name">Mạnh Cường (Jimmy)</div>
                      <div className="contact-qr-caption">
                        {pick({
                          vi: 'Quét mã QR để lưu danh bạ liên hệ xuất khẩu trực tiếp',
                          en: 'Scan QR code to save direct B2B export contact',
                          ko: 'QR 코드를 스캔하여 B2B 수출 담당자 연락처를 저장하세요',
                          zh: '扫码一键保存 B2B 出口负责人的直连名片'
                        })}
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
                    {t('contactPage.panelTitle') || pick({
                      vi: 'Biểu Mẫu Báo Giá & Hợp Tác B2B',
                      en: 'B2B Quotation & Partnership Form',
                      ko: 'B2B 수출 견적 및 파트너십 문의 양식',
                      zh: 'B2B 采购报价与合作申请表'
                    })}
                  </h2>
                  <p className="contact-form-sub">
                    {t('contactPage.panelDesc') || pick({
                      vi: 'Quý đối tác vui lòng điền các thông tin dưới đây. Yêu cầu của bạn sẽ được chuyển thẳng đến bộ phận kinh doanh và xuất nhập khẩu của VINAXO.',
                      en: 'Please provide your requirements below. Your inquiry is routed directly to VINAXO’s executive export desk.',
                      ko: '아래 요청 사항을 작성해 주시면 VINAXO 해외영업·수출 전담 부서로 직접 전달됩니다.',
                      zh: '请填写下方需求信息，您的询盘将直达 VINAXO 外贸出口业务团队。'
                    })}
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
                        {t('contactPage.nameLabel') || pick({ vi: 'Họ và Tên *', en: 'Full Name *', ko: '담당자 성함 *', zh: '联系人姓名 *' })}
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="name"
                        autoComplete="name"
                        className="form-input"
                        placeholder={pick({ vi: 'Nguyễn Văn A', en: 'Johnathan Smith', ko: '김민수 / Johnathan Smith', zh: '张伟 / Johnathan Smith' })}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactEmail">
                        {t('contactPage.emailLabel') || pick({ vi: 'Email Doanh Nghiệp *', en: 'Business Email *', ko: '기업 이메일 *', zh: '企业邮箱 *' })}
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
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
                        {t('contactPage.companyLabel') || pick({ vi: 'Công Ty & Quốc Gia', en: 'Company & Country', ko: '회사명 및 국가', zh: '公司名称及国家/地区' })}
                      </label>
                      <input
                        type="text"
                        autoComplete="organization"
                        id="contactCompany"
                        name="company"
                        className="form-input"
                        placeholder={pick({ vi: 'Tên Công ty, Quốc gia', en: 'Company Name, Country', ko: '회사명, 국가', zh: '公司名称、所在国家/地区' })}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        maxLength={150}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contactPhone">
                        {t('contactPage.phoneLabel') || pick({ vi: 'Số Điện Thoại / WhatsApp / Zalo', en: 'Phone / WhatsApp / Zalo', ko: '전화번호 / WhatsApp / Zalo', zh: '电话 / WhatsApp / Zalo' })}
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
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
                        {t('contactPage.inquiryTypeLabel') || pick({
                          vi: 'Mục Đích Liên Hệ / Loại Yêu Cầu *',
                          en: 'Inquiry Purpose / Type *',
                          ko: '문의 목적 / 유형 *',
                          zh: '咨询目的 / 需求类型 *'
                        })}
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
                          {t('contactPage.subjectDefault') || pick({
                            vi: 'Chọn mục đích liên hệ...',
                            en: 'Select purpose...',
                            ko: '문의 목적 선택...',
                            zh: '请选择咨询目的...'
                          })}
                        </option>
                        <option value="Export container quotation (FCL/LCL)">
                          {pick({
                            vi: 'Báo giá đơn hàng xuất khẩu container (FCL/LCL)',
                            en: 'Export container quotation (FCL/LCL)',
                            ko: '수출 컨테이너 견적 요청 (FCL/LCL)',
                            zh: '出口整柜/拼箱报价咨询（FCL/LCL）'
                          })}
                        </option>
                        <option value="Private Label OEM Processing">
                          {pick({
                            vi: 'Gia công nhãn riêng Private Label / OEM',
                            en: 'Private Label OEM Processing',
                            ko: '자체 브랜드(PB) 및 OEM/ODM 위탁 생산',
                            zh: '自有品牌贴牌 OEM / ODM 代工合作'
                          })}
                        </option>
                        <option value="Product specifications & Laboratory COA">
                          {pick({
                            vi: 'Thông tin sản phẩm & Thông số kỹ thuật',
                            en: 'Product specifications & Laboratory COA',
                            ko: '제품 사양서 및 품질 성적서(COA) 요청',
                            zh: '产品技术规格参数与第三方检测报告（COA）'
                          })}
                        </option>
                        <option value="Request commercial sample kit">
                          {pick({
                            vi: 'Yêu cầu gửi mẫu thử sản phẩm',
                            en: 'Request commercial sample kit',
                            ko: '평가용 무상 샘플 키트 요청',
                            zh: '申请邮寄产品评估样品套装'
                          })}
                        </option>
                        <option value="Domestic & International Distribution">
                          {pick({
                            vi: 'Hợp tác đại lý phân phối trong nước & quốc tế',
                            en: 'Domestic & International Distribution',
                            ko: '국내외 유통 파트너 및 총판 협력',
                            zh: '国内外经销商与渠道分销合作'
                          })}
                        </option>
                        <option value="General inquiry / Agricultural partnership">
                          {pick({
                            vi: 'Liên hệ chung / Hợp tác cung ứng nông sản',
                            en: 'General inquiry / Agricultural partnership',
                            ko: '일반 문의 / 원물 공급 및 가공 협력',
                            zh: '常规咨询 / 农产品供应链合作'
                          })}
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contactProduct">
                        {t('contactPage.productLabel') || pick({
                          vi: 'Sản Phẩm Quan Tâm',
                          en: 'Product of Interest',
                          ko: '관심 품목',
                          zh: '意向产品'
                        })}
                      </label>
                      <select
                        id="contactProduct"
                        name="product"
                        className="form-select"
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      >
                        <option value={defaultProductOption}>
                          {defaultProductOption}
                        </option>
                        {productsData.map((p) => {
                          const pName = getProductLocalized(p, language).name;
                          return (
                            <option key={p.id} value={pName}>
                              {pName}
                            </option>
                          );
                        })}
                        <option value="Honey-Infused & Chocolate-Dipped / Fruit & Nut Balls / Granola">
                          {pick({
                            vi: 'Trái cây mật ong / Phủ sô-cô-la / Granola & Viên hạt',
                            en: 'Honey-Infused / Chocolate-Dipped / Granola & Fruit Balls',
                            ko: '벌꿀 인퓨즈드 / 초콜릿 디핑 / 그래놀라 & 에너지 볼',
                            zh: '蜂蜜浸渍果干 / 巧克力蘸酱果干 / 格兰诺拉与能量球'
                          })}
                        </option>
                        <option value="Custom OEM / Private Label Project">
                          {pick({
                            vi: 'Gia công theo quy cách riêng (OEM / ODM)',
                            en: 'Custom OEM / Private Label Project',
                            ko: '맞춤형 OEM / PB 자체 브랜드 생산',
                            zh: 'OEM / ODM 专属贴牌定制项目'
                          })}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Detailed Message */}
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label" htmlFor="contactMessage">
                      {t('contactPage.messageLabel') || pick({
                        vi: 'Nội Dung Yêu Cầu Chi Tiết *',
                        en: 'Detailed Requirements *',
                        ko: '상세 문의 내용 *',
                        zh: '详细需求说明 *'
                      })}
                    </label>
                    <textarea
                      id="contactMessage"
                      name="message"
                      className="form-textarea"
                      placeholder={pick({
                        vi: 'Vui lòng cung cấp chi tiết: Sản phẩm quan tâm, sản lượng dự kiến (tấn), quy cách bao bì, cảng đích CIF/FOB...',
                        en: 'Please describe your requirement: estimated volume (MT), packaging specifications, target port CIF/FOB...',
                        ko: '관심 품목, 예상 물량(톤), 포장 규격, 도착항(CIF/FOB) 등 상세 내용을 입력해 주세요...',
                        zh: '请简要说明意向产品、预计采购量（吨）、包装规格及目的港（CIF/FOB）等信息...'
                      })}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      maxLength={3000}
                      required
                      style={{ minHeight: '140px' }}
                    ></textarea>
                  </div>

                  {/* Error banner if validation or server dispatch fails */}
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
                      <div>⚠️ {formError}</div>
                      {fallbackPayload && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                          <a
                            href={buildMailtoHref(fallbackPayload, fallbackRecipient)}
                            className="btn btn-primary"
                            style={{ padding: '8px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            <Mail size={14} />
                            <span>{pick({ vi: 'Mở ứng dụng Email', en: 'Open Email App', ko: '이메일 앱 열기', zh: '打开邮件客户端' })}</span>
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyFallback}
                            className="btn btn-outline"
                            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
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
                            style={{ padding: '8px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            WhatsApp
                          </a>
                          <a
                            href="https://zalo.me/0984815016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ padding: '8px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            Zalo
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div style={{ marginTop: '24px' }}>
                    <button
                      type="submit"
                      id="contactSubmitBtn"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '1rem' }}
                    >
                      <span>
                        {isSubmitting
                          ? pick({ vi: 'Đang gửi yêu cầu...', en: 'Sending inquiry...', ko: '요청 전송 중...', zh: '正在提交请求...' })
                          : t('contactPage.submitBtn') || pick({
                              vi: 'Gửi Yêu Cầu Báo Giá Đến VINAXO',
                              en: 'Submit Quotation Request to VINAXO',
                              ko: 'VINAXO에 견적 요청 보내기',
                              zh: '向 VINAXO 提交询盘报价申请'
                            })}
                      </span>
                      <Send size={16} style={{ marginLeft: '8px', flexShrink: 0 }} />
                    </button>
                  </div>

                  {/* Confirmation banner when server confirms delivery */}
                  {submitted && (
                    <div
                      role="status"
                      style={{
                        marginTop: '16px',
                        padding: '14px 16px',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #34D399',
                        borderRadius: 'var(--radius-sm)',
                        color: '#065F46',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      ✓{' '}
                      {pick({
                        vi: `Đã gửi yêu cầu thành công tới Bộ phận Xuất khẩu VINAXO (${COMPANY_INFO.contacts.email})${referenceId ? ` — Mã tham chiếu: ${referenceId}` : ''}. Chúng tôi sẽ phản hồi trong 24 giờ làm việc.`,
                        en: `Your inquiry has been delivered to VINAXO Export Desk (${COMPANY_INFO.contacts.email})${referenceId ? ` — Ref: ${referenceId}` : ''}. Our team will respond within 24 business hours.`,
                        ko: `문의가 VINAXO 수출팀(${COMPANY_INFO.contacts.email})에 정상 접수되었습니다${referenceId ? ` (접수 번호: ${referenceId})` : ''}. 영업일 기준 24시간 이내에 회신드리겠습니다.`,
                        zh: `您的询盘已成功发送至 VINAXO 出口部（${COMPANY_INFO.contacts.email}）${referenceId ? ` — 受理编号：${referenceId}` : ''}。我们将在 24 个工作小时内回复您。`
                      })}
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
                    {pick({
                      vi: (
                        <>
                          <em>Kết nối trực tiếp B2B:</em> Yêu cầu của bạn được gửi trực tiếp tới hộp thư xuất khẩu <strong>{COMPANY_INFO.contacts.email}</strong> (hoặc qua ứng dụng Email/WhatsApp/Zalo <strong>{COMPANY_INFO.contacts.phoneDisplay}</strong> nếu bạn cần trao đổi ngay).
                        </>
                      ),
                      en: (
                        <>
                          <em>Direct B2B dispatch:</em> Your inquiry is routed directly to our export desk at <strong>{COMPANY_INFO.contacts.email}</strong>, with direct Hotline/WhatsApp support at <strong>{COMPANY_INFO.contacts.phoneDisplay}</strong>.
                        </>
                      ),
                      ko: (
                        <>
                          <em>B2B 직통 접수:</em> 작성하신 문의는 수출 전담 이메일 <strong>{COMPANY_INFO.contacts.email}</strong>로 전달되며, 핫라인/WhatsApp <strong>{COMPANY_INFO.contacts.phoneDisplay}</strong>를 통해 즉시 상담하실 수 있습니다.
                        </>
                      ),
                      zh: (
                        <>
                          <em>B2B 直达对接：</em> 您的询盘将直达我司出口专线邮箱 <strong>{COMPANY_INFO.contacts.email}</strong>，如需即时沟通可拨打专线或添加 WhatsApp <strong>{COMPANY_INFO.contacts.phoneDisplay}</strong>。
                        </>
                      )
                    })}
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
                {t('contactPage.mapSectionLabel') || pick({ vi: 'VỊ TRÍ ĐỊA LÝ', en: 'GEOGRAPHIC LOCATION', ko: '공장 위치 안내', zh: '工厂地理位置' })}
              </span>
              <h2 className="section-title font-serif">
                {t('contactPage.mapSectionTitle') || pick({
                  vi: 'Nhà Máy Chế Biến VINAXO Tiền Giang',
                  en: 'VINAXO Processing Facility',
                  ko: 'VINAXO 메콩 델타 가공 공장',
                  zh: 'VINAXO 热带水果现代化加工厂'
                })}
              </h2>
              <p className="section-desc mx-auto" style={{ maxWidth: '760px' }}>
                {t('contactPage.mapSectionDesc') || pick({
                  vi: 'Vị trí thuận lợi tại trung tâm vùng nguyên liệu trái cây đồng bằng sông Cửu Long, kết nối nhanh chóng tới các cảng biển xuất khẩu quốc tế (Cát Lái, Hiệp Phước, Cái Mép).',
                  en: 'Strategically situated in the heart of Mekong Delta fruit orchards, connecting quickly to major container export terminals (Cat Lai, Hiep Phuoc, Cai Mep).',
                  ko: '메콩 델타 과수원 원료 산지 중심에 위치하여 주요 수출 컨테이너 항만(깟라이, 히엡프억, 까이멥)과 신속하게 연결됩니다.',
                  zh: '坐落于湄公河三角洲核心水果产区，高效直连吉莱港、协福港及盖梅国际深水集装箱码头。'
                })}
              </p>
            </div>

            <div className="contact-map-card">
              <div className="contact-map-bar">
                <div>
                  <div className="contact-map-coords">
                    {t('contactPage.mapCoords') || pick({
                      vi: 'Tọa độ: 10.380295, 106.516139 • Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp',
                      en: 'Coordinates: 10.380295, 106.516139 • Quarter 5, Vinh Binh Commune, Dong Thap Province',
                      ko: 'GPS 좌표: 10.380295, 106.516139 • 베트남 동탑성 빈빈 5구역',
                      zh: '经纬度坐标：10.380295, 106.516139 • 越南同塔省永平镇第5区'
                    })}
                  </div>
                  <div className="contact-map-address">
                    {t('contactPage.mapDistance') || pick({
                      vi: 'Cách TP. Hồ Chí Minh ~65 km • Thuận tiện vận chuyển container xuất khẩu đường bộ và đường thủy',
                      en: '~65 km from Ho Chi Minh City • Seamless highway and waterway container logistics',
                      ko: '호치민시에서 약 65km 거리 • 고속도로 및 수로 컨테이너 수출 물류 최적화',
                      zh: '距胡志明市约 65 公里 • 陆运与内河集装箱出口物流无缝衔接'
                    })}
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=V%C4%A9nh+B%C3%ACnh+G%C3%B2+C%C3%B4ng+T%C3%A2y+Ti%E1%BB%81n+Giang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
                >
                  <span>{t('contactPage.openMapBtn') || pick({ vi: 'Mở Google Maps', en: 'Open Google Maps', ko: 'Google 지도 열기', zh: '打开 Google 地图' })}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: 'var(--brand-bg)' }}>
                {/* Fallback card underlay */}
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
                    {pick({ vi: 'Nhà Máy Chế Biến VINAXO', en: 'VINAXO Processing Plant', ko: 'VINAXO 가공 공장', zh: 'VINAXO 加工生产基地' })}
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-body)', maxWidth: '480px' }}>
                    {companyAddress}
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=V%C4%A9nh+B%C3%ACnh+G%C3%B2+C%C3%B4ng+T%C3%A2y+Ti%E1%BB%81n+Giang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                  >
                    <span>{pick({ vi: 'Mở Chỉ Đường Google Maps', en: 'Open Directions in Google Maps', ko: 'Google 지도 길찾기', zh: '在 Google 地图中导航' })}</span>
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
                {t('contactPage.ctaLabel') || pick({ vi: 'HỢP TÁC BỀN VỮNG', en: 'SUSTAINABLE PARTNERSHIP', ko: '지속 가능한 파트너십', zh: '可持续长期合作' })}
              </span>
              <h3 className="contact-partnership-title font-serif">
                {t('contactPage.ctaTitle') || pick({
                  vi: 'Đồng Hành Phát Triển Cùng Nông Sản Việt',
                  en: 'Partnering with Vietnamese Agriculture',
                  ko: '베트남 프리미엄 농식품과 함께하는 비즈니스 성장',
                  zh: '携手深耕越南热带农产品供应链'
                })}
              </h3>
              <p className="contact-partnership-desc">
                {t('contactPage.ctaDesc') || pick({
                  vi: 'VINAXO luôn sẵn sàng chào đón các đối tác nhập khẩu quốc tế, chuỗi bán lẻ, nhà phân phối và doanh nghiệp gia công OEM. Cam kết cung ứng ổn định, chất lượng đồng nhất và đồng hành dài hạn.',
                  en: 'VINAXO welcomes global importers, retail chains, distributors, and OEM private label partners. We guarantee reliable supply, consistent quality, and long-term commitment.',
                  ko: 'VINAXO는 전 세계 수입사, 대형 유통 체인 및 OEM/PB 파트너사의 문의를 환영합니다. 안정적인 공급과 일관된 품질을 약속합니다.',
                  zh: 'VINAXO 诚邀全球进口商、连锁商超、分销商及 OEM 品牌商洽谈合作，承诺稳定货源、一贯品质与长期共赢。'
                })}
              </p>
            </div>
            <div className="contact-partnership-actions">
              <a
                href="#quote-form"
                className="btn btn-primary"
              >
                <span>{t('contactPage.ctaQuoteBtn') || pick({ vi: 'Nhận Báo Giá Ngay', en: 'Request a Quote Now', ko: '지금 견적 요청하기', zh: '立即申请报价' })}</span>
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
                {t('contactPage.faqLabel') || pick({ vi: 'CÂU HỎI THƯỜNG GẶP B2B', en: 'B2B TRADE FAQ', ko: 'B2B 무역 FAQ', zh: 'B2B 贸易常见问答' })}
              </span>
              <h2 className="section-title font-serif">
                {t('contactPage.faqTitle') || pick({
                  vi: 'Câu Hỏi Thường Gặp Về Giao Thương B2B',
                  en: 'Frequently Asked Questions About B2B Trade',
                  ko: 'B2B 수출 거래 자주 묻는 질문',
                  zh: 'B2B 国际贸易采购常见问题'
                })}
              </h2>
              <p className="section-desc mx-auto" style={{ maxWidth: '760px', margin: '0 auto' }}>
                {t('contactPage.faqDesc') || pick({
                  vi: 'Giải đáp nhanh các thắc mắc về số lượng đặt hàng tối thiểu, mẫu thử và thời gian giao hàng quốc tế.',
                  en: 'Quick answers regarding minimum order quantities, complimentary commercial samples, and typical production lead times.',
                  ko: '최소 주문 수량(MOQ), 무상 샘플 지원 및 국제 선적 리드타임에 대한 주요 안내입니다.',
                  zh: '为您快速解答最低起订量（MOQ）、免费评估样品及常规生产交付周期。'
                })}
              </p>
            </div>

            <div className="faq-grid-2" style={{ marginTop: '48px' }}>
              {BROCHURE_FAQS.map((faq) => (
                <div key={faq.id} className="subpage-feature-card">
                  <h3 className="feature-card-title" style={{ fontSize: '1.08rem', color: 'var(--vinaxo-red)' }}>
                    {pick({ vi: faq.qVi, en: faq.qEn, ko: faq.qKo, zh: faq.qZh })}
                  </h3>
                  <p className="feature-card-desc">
                    {pick({ vi: faq.aVi, en: faq.aEn, ko: faq.aKo, zh: faq.aZh })}
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
