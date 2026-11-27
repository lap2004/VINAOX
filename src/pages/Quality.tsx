import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ZoomIn } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COMPLIANCE_ITEMS,
  QUALITY_PROMISE_CARDS,
  BROCHURE_FAQS,
  ComplianceBadge,
  getComplianceLocalized,
} from '../data/brochureData';
import { PageHero } from '../components/ui/PageHero';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { CertificatePreviewModal } from '../components/ui/CertificatePreviewModal';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Quality: React.FC = () => {
  const { language, t, pick } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const [previewCert, setPreviewCert] = useState<ComplianceBadge | null>(null);

  const processSteps = [
    {
      num: '01',
      title: t('qualityPage.section1.step1Title'),
      desc: t('qualityPage.section1.step1Desc'),
    },
    {
      num: '02',
      title: t('qualityPage.section1.step2Title'),
      desc: t('qualityPage.section1.step2Desc'),
    },
    {
      num: '03',
      title: t('qualityPage.section1.step3Title'),
      desc: t('qualityPage.section1.step3Desc'),
    },
    {
      num: '04',
      title: t('qualityPage.section1.step4Title'),
      desc: t('qualityPage.section1.step4Desc'),
    },
    {
      num: '05',
      title: t('qualityPage.section1.step5Title'),
      desc: t('qualityPage.section1.step5Desc'),
    },
    {
      num: '06',
      title: t('qualityPage.section1.step6Title'),
      desc: t('qualityPage.section1.step6Desc'),
    },
  ];

  return (
    <div className="quality-page">
      {/* Page Hero */}
      <PageHero
        title={t('pageBanners.quality.title') || pick({
          vi: 'Chất lượng và chứng nhận',
          en: 'Quality & Certifications',
          ko: '품질 및 인증',
          zh: '品质与认证',
        })}
        description={
          t('pageBanners.quality.subtitle') ||
          pick({
            vi: 'Kiểm soát an toàn thực phẩm khép kín từ vùng trồng đến đóng gói theo chuẩn BRCGS, ISO 22000, HACCP, US FDA và SMETA.',
            en: 'End-to-end food safety controls from orchard sourcing to cleanroom packaging under BRCGS, ISO 22000, HACCP, US FDA, and SMETA.',
            ko: '산지 수확부터 위생 포장까지 BRCGS, ISO 22000, HACCP, 미국 FDA 및 SMETA 기준을 준수합니다.',
            zh: '严格执行从果园采购到洁净包装的全链路品控，符合 BRCGS、ISO 22000、HACCP、美国 FDA 与 SMETA 标准。'
          })
        }
        breadcrumbCurrent={pick({
          vi: 'Chất lượng & Sản xuất',
          en: 'Quality & Production',
          ko: '품질 및 생산 공정',
          zh: '品质控制与生产'
        })}
      />

      {/* ========================================================================
          SECTION 1: 6-STEP PRODUCTION WORKFLOW
          ======================================================================== */}
      <section className="subpage-section section-white" style={{ paddingTop: 'clamp(28px, 3vw, 44px)' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 28px auto' }}>
            <span className="section-label">{t('qualityPage.section1.label')}</span>
            <h2 className="section-title">
              {t('qualityPage.section1.title')}
            </h2>
            <p className="section-desc section-desc-center">
              {t('qualityPage.section1.desc')}
            </p>
          </div>

          <div className="process-steps-grid">
            {processSteps.map((s, idx) => (
              <div key={idx} className="process-step-card">
                <span className="process-step-num">{s.num}</span>
                <h3 className="process-step-title">{s.title}</h3>
                <p className="process-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: BROCHURE QUALITY PROMISE PILLARS & INFRASTRUCTURE
          ======================================================================== */}
      <section
        className="subpage-section section-cream"
        style={{
          borderTop: '1px solid var(--soft-border)',
          borderBottom: '1px solid var(--soft-border)',
        }}
      >
        <div className="container">
          <div className="facility-overview-grid">
            <div>
              <span className="section-label">
                {pick({
                  vi: 'NĂNG LỰC TỔ HỢP NHÀ MÁY',
                  en: 'FACILITY INFRASTRUCTURE',
                  ko: '생산 공장 인프라 역량',
                  zh: '现代化工厂基础设施'
                })}
              </span>
              <h2 className="section-title">
                {pick({
                  vi: 'Tổ Hợp Nhà Máy 25.000 M² Đạt Chuẩn Quốc Tế',
                  en: '25,000 m² Integrated Food Processing Complex',
                  ko: '국제 표준 25,000 m² 통합 식품 가공 단지',
                  zh: '国际高标准 25,000 平方米一体化食品加工园'
                })}
              </h2>
              <p className="section-desc" style={{ marginTop: '14px' }}>
                {pick({
                  vi: 'Tổ hợp sản xuất của VINAXO vận hành công suất 300 tấn thành phẩm mỗi tháng với khu sấy nhiệt thấp (~60°C), chiên chân không tách dầu ly tâm, kho lạnh bảo quản mùa vụ và khu đóng gói nhãn riêng OEM.',
                  en: 'Vinaxo’s 25,000 m² manufacturing site delivers 300 tons monthly output across heat-pump low-temperature dehydrators, vacuum-frying centrifuge lines, temperature-controlled warehousing, and dedicated retail OEM packing rooms.',
                  ko: 'VINAXO의 25,000 m² 공장은 저온 히트펌프 건조기(~60°C), 진공 원심 탈유 라인, 계절별 저온 저장 창고 및 전용 OEM 포장실을 통해 월 300톤의 완제품을 생산합니다.',
                  zh: 'VINAXO 25,000 平方米生产园区月成品产能达 300 吨，配备低温热泵干燥车间（~60°C）、真空离心脱油产线、恒温冷链原料库及独立 OEM 贴牌包装车间。'
                })}
              </p>

              <div className="facility-stats-grid">
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)' }}>
                    {pick({ vi: '300 tấn', en: '300 t', ko: '300톤', zh: '300 吨' })}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {pick({
                      vi: 'Sản lượng thành phẩm / tháng',
                      en: 'Monthly export capacity',
                      ko: '월간 완제품 수출 생산량',
                      zh: '月均成品出口产能'
                    })}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)' }}>
                    25,000 m²
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {pick({
                      vi: 'Tổng quy mô tổ hợp nhà máy',
                      en: 'Total factory area',
                      ko: '총 공장 부지 면적',
                      zh: '工厂园区总面积'
                    })}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)' }}>
                    200 kg
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {pick({
                      vi: 'MOQ khởi điểm (tùy mặt hàng)',
                      en: 'Starter MOQ (SKU dependent)',
                      ko: '최소 주문 수량 (품목별 상이)',
                      zh: '起步最低起订量（视品类而定）'
                    })}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--soft-border)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dark-chocolate)', fontFamily: 'var(--font-display)' }}>
                    {pick({ vi: '2–4 tuần', en: '2–4 wks', ko: '2~4주', zh: '2–4 周' })}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body)', marginTop: '4px', fontWeight: 600 }}>
                    {pick({
                      vi: 'Thời gian giao hàng tiêu chuẩn',
                      en: 'Typical production lead time',
                      ko: '표준 생산 및 납품 리드타임',
                      zh: '标准生产交货周期'
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid var(--white)' }}>
                <picture>
                  <source srcSet="/assets/images/factory-2026/factory-featured.webp" type="image/webp" />
                  <img
                    src="/assets/images/factory-2026/factory-featured.jpg"
                    alt={pick({
                      vi: 'Phân xưởng sấy trái cây VINAXO 25.000 m²',
                      en: 'VINAXO 25,000 m² processing facility floor',
                      ko: 'VINAXO 25,000 m² 건조 과일 가공 작업장',
                      zh: 'VINAXO 25,000 平方米现代化果干加工车间'
                    })}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* 3 Quality Promise Pillars */}
          <div style={{ marginTop: '64px' }}>
            <div className="quality-promise-grid">
              {QUALITY_PROMISE_CARDS.map((card) => (
                <div key={card.number} className="quality-promise-card">
                  <div className="promise-number">{card.number}</div>
                  <h3 className="promise-title">
                    {pick({ vi: card.titleVi, en: card.titleEn, ko: card.titleKo, zh: card.titleZh })}
                  </h3>
                  <p className="promise-desc">
                    {pick({ vi: card.descVi, en: card.descEn, ko: card.descKo, zh: card.descZh })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: OFFICIAL BROCHURE 2026 CERTIFICATIONS & SCANNED AUDITS (PAGE 4)
          ======================================================================== */}
      <section id="certificates" className="subpage-section section-white">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <span className="section-label">
              {pick({
                vi: 'CHỨNG NHẬN • ĐĂNG KÝ • KIỂM TOÁN',
                en: 'QUALITY & COMPLIANCE',
                ko: '인증 • 등록 • 윤리 감사',
                zh: '资质认证 • 官方注册 • 合规审核'
              })}
            </span>
            <h2 className="section-title">
              {pick({
                vi: 'Hồ Sơ Chứng Nhận & Kiểm Toán Quốc Tế',
                en: 'CERTIFICATIONS & AUDITED COMPLIANCE',
                ko: '국제 식품안전 인증 및 감사 현황',
                zh: '国际认证资质与第三方审计档案'
              })}
            </h2>
            <p className="section-desc section-desc-center">
              {pick({
                vi: 'Danh mục 8 tiêu chuẩn chính thức từ Vinaxo Brochure 2026 (bao gồm bản chụp chứng nhận thực tế và phạm vi kiểm toán minh bạch).',
                en: 'Official 2026 compliance portfolio showcasing scanned certificates, facility registration, and independent audit verifications.',
                ko: '2026 공식 브로슈어에 수록된 8대 국제 표준 목록과 실제 인증서 스캔본 및 투명한 감사 범위를 확인하실 수 있습니다.',
                zh: '汇集 2026 官方手册 8 项国际标准清单，公开真实证书扫描件及独立审核范围说明。'
              })}
            </p>
          </div>

          <div className="certifications-grid-4">
            {COMPLIANCE_ITEMS.filter((item) => item.id !== 'costco').map((item) => {
              const locCert = getComplianceLocalized(item, language);
              const kindClass =
                item.kindEn === 'Certification'
                  ? 'trust-kind-cert'
                  : item.kindEn === 'Registration'
                  ? 'trust-kind-reg'
                  : 'trust-kind-audit';
              return (
                <div key={item.id} className="cert-scan-card">
                  {item.certImageWebp ? (
                    <button
                      type="button"
                      onClick={() => setPreviewCert(item)}
                      className="cert-scan-thumb-wrap"
                      style={{ width: '100%', padding: 0, cursor: 'zoom-in' }}
                      aria-label={pick({
                        vi: `Xem lớn ảnh chứng nhận ${locCert.name}`,
                        en: `Inspect ${locCert.name} certificate image`,
                        ko: `${locCert.name} 인증서 이미지 확대 보기`,
                        zh: `放大查看 ${locCert.name} 证书扫描件`
                      })}
                    >
                      <picture style={{ width: '100%', height: '100%' }}>
                        <source srcSet={item.certImageWebp} type="image/webp" />
                        <img
                          src={item.certImageJpg}
                          alt={`${locCert.name} — VINAXO`}
                          loading="lazy"
                        />
                      </picture>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(58, 36, 23, 0.85)',
                          color: '#FFFFFF',
                          borderRadius: '999px',
                          padding: '4px 8px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ZoomIn size={12} />
                        {pick({ vi: 'Xem lớn', en: 'Preview', ko: '확대 보기', zh: '查看大图' })}
                      </span>
                    </button>
                  ) : (
                    <div className="cert-scan-thumb-wrap" style={{ padding: '6px', backgroundColor: 'transparent', border: 'none' }}>
                      <div className="cert-halal-placeholder">
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.85rem',
                            fontWeight: 700,
                            color: '#2D4E32',
                            letterSpacing: '0.05em',
                          }}
                        >
                          HALAL
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#50433B', marginTop: '4px' }}>
                          {pick({
                            vi: 'Hồ sơ chứng nhận Halal',
                            en: 'Certificate copy on request',
                            ko: '요청 시 할랄 인증서 사본 제공',
                            zh: '可应要求提供清真认证副本'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className={`trust-badge-kind ${kindClass}`} style={{ alignSelf: 'flex-start', marginBottom: '6px' }}>
                      {locCert.kind}
                    </span>
                    <h3 className="cert-title" style={{ fontSize: '1.15rem', marginBottom: '4px' }}>{locCert.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.4, margin: 0 }}>
                      {locCert.scope}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Card 8: Brochure Page 4 "8 INTERNATIONAL STANDARDS" + Costco GMP Audit Dark Summary Card */}
            <div className="standards-summary-card">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: 'var(--brand-orange)',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {pick({
                  vi: '8 TIÊU CHUẨN QUỐC TẾ',
                  en: '8 INTERNATIONAL STANDARDS',
                  ko: '8대 국제 표준 보유',
                  zh: '8 项国际权威合规标准'
                })}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 247, 236, 0.9)', lineHeight: 1.5, marginBottom: '12px' }}>
                {pick({
                  vi: 'Bao gồm chứng nhận Costco GMP Audit và toàn bộ hồ sơ kiểm định chất lượng cung ứng cho các chuỗi siêu thị quốc tế.',
                  en: 'Including Costco GMP Audit & verified supply-chain dossier. Full certificate copies available on request.',
                  ko: '코스트코(Costco) GMP 감사 보고서를 비롯한 글로벌 리테일 공급망 품질 검증 서류 일체를 요청 시 제공합니다.',
                  zh: '包含 Costco GMP 审核报告及面向全球商超供应链的完整品质文件，可随时联系索取完整副本。'
                })}
              </p>
              <button
                type="button"
                onClick={() => onOpenQuote('Full 8 International Standards Certificate Pack')}
                className="btn btn-primary btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
              >
                {pick({
                  vi: 'Yêu cầu trọn bộ bản sao',
                  en: 'Request Certificate Pack',
                  ko: '전체 인증 사본 패키지 요청',
                  zh: '申请全套资质证书副本'
                })}
              </button>
            </div>
          </div>

          {/* Transparency Compliance Note */}
          <div
            style={{
              marginTop: '40px',
              backgroundColor: 'var(--brand-bg)',
              border: '1px solid var(--soft-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
            }}
          >
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--dark-chocolate)', marginBottom: '8px' }}>
              {pick({
                vi: 'Cam kết minh bạch hồ sơ kiểm định:',
                en: 'Documentation & Audit Transparency:',
                ko: '인증 서류 및 감사 투명성 원칙:',
                zh: '检测文档与审计透明承诺：'
              })}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
              {pick({
                vi: 'Các giấy chứng nhận BRCGS Food Safety (SGS), ISO 22000:2018 (TQC), HACCP (TQC), đăng ký US FDA, Kosher (OU), chứng nhận Halal cùng báo cáo kiểm toán SMETA (Sedex v6.1) và Costco GMP Audit được cung cấp bản đầy đủ theo yêu cầu từng đối tác.',
                en: 'Current scope certificates for BRCGS Food Safety (SGS), ISO 22000:2018 (TQC), HACCP (TQC), US FDA facility registration, Kosher (OU), Halal compliance, plus SMETA (Sedex v6.1) and Costco GMP audit documentation are available in full upon qualified buyer request.',
                ko: 'BRCGS 식품안전(SGS), ISO 22000:2018(TQC), HACCP(TQC) 인증서, 미국 FDA 시설 등록증, 코셔(OU), 할랄 인증 및 Sedex SMETA(v6.1)·코스트코 GMP 감사 서류 원본 사본은 바이어 요청 시 전체 열람 및 제공이 가능합니다.',
                zh: '我司可应合规采购商要求提供 BRCGS 食品安全（SGS）、ISO 22000:2018（TQC）、HACCP（TQC）认证、美国 FDA 设施注册、Kosher（OU）、Halal 认证及 Sedex SMETA（v6.1）、Costco GMP 审核报告完整文件。'
              })}
            </p>
          </div>

          {/* Brochure Page 4 — Frequently Asked Questions */}
          <div style={{ marginTop: '72px', paddingTop: '56px', borderTop: '1px solid var(--soft-border)' }}>
            <span className="section-label">
              {pick({
                vi: 'CÂU HỎI THƯỜNG GẶP',
                en: 'FREQUENTLY ASKED QUESTIONS',
                ko: '자주 묻는 질문 (FAQ)',
                zh: '常见问题解答'
              })}
            </span>
            <h3
              className="title-display"
              style={{
                fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                color: 'var(--dark-chocolate)',
                textTransform: 'uppercase',
                marginBottom: '28px',
              }}
            >
              {pick({
                vi: 'Giải Đáp Hợp Tác & Đặt Hàng B2B',
                en: 'BROCHURE QUICK ANSWERS FOR BUYERS',
                ko: '글로벌 B2B 바이어 핵심 안내',
                zh: 'B2B 合作与采购常见问题'
              })}
            </h3>
            <div className="faq-grid-2">
              {BROCHURE_FAQS.map((faq) => (
                <div key={faq.id}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--vinaxo-red)', marginBottom: '6px' }}>
                    {pick({ vi: faq.qVi, en: faq.qEn, ko: faq.qKo, zh: faq.qZh })}
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                    {pick({ vi: faq.aVi, en: faq.aEn, ko: faq.aKo, zh: faq.aZh })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for High-Res Scanned Certificate Preview */}
      <CertificatePreviewModal
        certificate={previewCert}
        onClose={() => setPreviewCert(null)}
      />

      {/* ========================================================================
          SECTION 4: QUALITY CALL TO ACTION
          ======================================================================== */}
      <section className="subpage-section subpage-cta-section section-white">
        <div className="container">
          <CorporateCTA
            eyebrow={pick({
              vi: 'ĐĂNG KÝ THAM QUAN NHÀ MÁY & GỬI MẪU',
              en: 'FACILITY AUDIT & SAMPLE KIT',
              ko: '공장 현장 실사 및 샘플 키트 신청',
              zh: '预约工厂审厂与免费寄样'
            })}
            title={t('qualityPage.section4.title')}
            description={t('qualityPage.section4.desc')}
            primaryText={t('qualityPage.section4.btnPrimary')}
            onPrimaryClick={() => onOpenQuote('Quality Dossier & Pre-Shipment Sample')}
            secondaryText={t('qualityPage.section4.btnSecondary')}
            secondaryLink="/contact"
          />
        </div>
      </section>
    </div>
  );
};

export default Quality;
