import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Ship, Clock, Plane, Package } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PageHero } from '../components/ui/PageHero';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { CorporateCTA } from '../components/ui/CorporateCTA';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const GlobalMarket: React.FC = () => {
  const { t, pick } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();

  return (
    <div className="markets-page">
      {/* Page Hero */}
      <PageHero
        badge={pick({
          vi: 'MẠNG LƯỚI THỊ TRƯỜNG & XUẤT KHẨU TOÀN CẦU',
          en: 'GLOBAL EXPORT REACH & TRADE NETWORK',
          ko: '글로벌 수출 네트워크 및 시장 현황',
          zh: '全球出口网络与贸易版图'
        })}
        title={t('pageBanners.markets.title') || pick({
          vi: 'Mạng Lưới Thị Trường & Xuất Khẩu Toàn Cầu',
          en: 'Global Export Markets & Supply Chain',
          ko: '글로벌 수출 시장 및 공급망',
          zh: '全球出口市场与供应链布局'
        })}
        description={
          t('pageBanners.markets.subtitle') ||
          pick({
            vi: 'Cung ứng nông sản trái cây sấy dẻo nhiệt đới tới các thị trường khó tính nhất: Hoa Kỳ (~70%), Liên minh Châu Âu (~20%), Hàn Quốc và Nga.',
            en: 'Delivering world-class Vietnamese agricultural produce across the United States (~70%), the European Union (~20%), Russia, and East Asia.',
            ko: '미국(~70%), 유럽연합(~20%), 러시아 및 한국·동아시아 등 까다로운 국제 식품안전 기준을 요구하는 글로벌 시장에 베트남 열대 건조 과일을 공급합니다.',
            zh: '稳定向美国（约 70%）、欧盟（约 20%）、俄罗斯及日韩等东亚高标准国际市场出口优质越南热带果干产品。'
          })
        }
        breadcrumbCurrent={pick({
          vi: 'Thị Trường Xuất Khẩu',
          en: 'Global Markets',
          ko: '글로벌 수출 시장',
          zh: '全球出口市场'
        })}
      />

      {/* ========================================================================
          SECTION 1: OVERVIEW & 4 VERIFIED EXPORT PILLARS (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto 48px auto' }}>
            <span className="section-label">{t('marketsPage.section1.label')}</span>
            <h2 className="section-title">
              {t('marketsPage.section1.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('marketsPage.section1.desc')}
            </p>
          </div>

          {/* 4 Key Export Pillars Grid */}
          <div className="market-regions-grid">
            {/* Market: USA */}
            <div className="market-region-card">
              <div className="market-card-top-row">
                <span className="market-region-eyebrow">NORTH AMERICA</span>
                <div className="market-share-badge share-primary">
                  <span className="market-share-dot"></span>
                  <span>{t('marketsPage.pillars.usa.badge')}</span>
                </div>
              </div>
              <h3 className="market-region-title">{t('marketsPage.pillars.usa.title')}</h3>
              <p className="market-region-desc">{t('marketsPage.pillars.usa.desc')}</p>
              <div className="market-card-footer">
                <div className="market-source-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>{t('marketsPage.pillars.usa.source')}</span>
                </div>
              </div>
            </div>

            {/* Market: EU */}
            <div className="market-region-card">
              <div className="market-card-top-row">
                <span className="market-region-eyebrow">EUROPEAN UNION</span>
                <div className="market-share-badge share-eu">
                  <span className="market-share-dot"></span>
                  <span>{t('marketsPage.pillars.eu.badge')}</span>
                </div>
              </div>
              <h3 className="market-region-title">{t('marketsPage.pillars.eu.title')}</h3>
              <p className="market-region-desc">{t('marketsPage.pillars.eu.desc')}</p>
              <div className="market-card-footer">
                <div className="market-source-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>{t('marketsPage.pillars.eu.source')}</span>
                </div>
              </div>
            </div>

            {/* Market: Russia & CIS */}
            <div className="market-region-card">
              <div className="market-card-top-row">
                <span className="market-region-eyebrow">EASTERN EUROPE & CIS</span>
                <div className="market-share-badge share-russia">
                  <span className="market-share-dot"></span>
                  <span>{t('marketsPage.pillars.russia.badge')}</span>
                </div>
              </div>
              <h3 className="market-region-title">{t('marketsPage.pillars.russia.title')}</h3>
              <p className="market-region-desc">{t('marketsPage.pillars.russia.desc')}</p>
              <div className="market-card-footer">
                <div className="market-source-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>{t('marketsPage.pillars.russia.source')}</span>
                </div>
              </div>
            </div>

            {/* Market: East Asia */}
            <div className="market-region-card">
              <div className="market-card-top-row">
                <span className="market-region-eyebrow">EAST ASIA</span>
                <div className="market-share-badge share-asia">
                  <span className="market-share-dot"></span>
                  <span>{t('marketsPage.pillars.eastAsia.badge')}</span>
                </div>
              </div>
              <h3 className="market-region-title">{t('marketsPage.pillars.eastAsia.title')}</h3>
              <p className="market-region-desc">{t('marketsPage.pillars.eastAsia.desc')}</p>
              <div className="market-card-footer">
                <div className="market-source-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>{t('marketsPage.pillars.eastAsia.source')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: MAP VISUALIZATION & LOGISTICS INFRASTRUCTURE (MATCHING HTML 1:1)
          ======================================================================== */}
      <section
        className="subpage-section"
        style={{
          backgroundColor: 'var(--cream-bg)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 48px auto' }}>
            <span className="section-label">{t('marketsPage.section2.label')}</span>
            <h2 className="section-title">
              {t('marketsPage.section2.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('marketsPage.section2.desc')}
            </p>
          </div>

          {/* Full Variant SVG World Map */}
          <div style={{ maxWidth: '960px', margin: '0 auto 36px auto' }}>
            <WorldMapSvg variant="full" interactive={true} />
          </div>

          {/* 4-Column Logistics Executive Bar */}
          <div className="logistics-bar">
            <div className="logistics-item">
              <div className="logistics-item-icon-box" aria-hidden="true">
                <Ship size={20} />
              </div>
              <div className="logistics-item-title">{t('marketsPage.section2.portsTitle')}</div>
              <div className="logistics-item-val">{t('marketsPage.section2.portsDesc')}</div>
            </div>

            <div className="logistics-item">
              <div className="logistics-item-icon-box" aria-hidden="true">
                <Clock size={20} />
              </div>
              <div className="logistics-item-title">{t('marketsPage.section2.specTitle')}</div>
              <div className="logistics-item-val">{t('marketsPage.section2.specDesc')}</div>
            </div>

            <div className="logistics-item">
              <div className="logistics-item-icon-box" aria-hidden="true">
                <Plane size={20} />
              </div>
              <div className="logistics-item-title">{t('marketsPage.section2.airTitle')}</div>
              <div className="logistics-item-val">{t('marketsPage.section2.airDesc')}</div>
            </div>

            <div className="logistics-item">
              <div className="logistics-item-icon-box" aria-hidden="true">
                <Package size={20} />
              </div>
              <div className="logistics-item-title">{t('marketsPage.section2.containerTitle')}</div>
              <div className="logistics-item-val">{t('marketsPage.section2.containerDesc')}</div>
            </div>
          </div>

          {/* Explicit Separation: Trade Terms (Incoterms) vs Container Shipping Modes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '20px',
              marginTop: '28px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--soft-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--vinaxo-red)',
                  marginBottom: '6px',
                }}
              >
                {pick({
                  vi: 'NHÓM 1 · ĐIỀU KIỆN THƯƠNG MẠI (INCOTERMS)',
                  en: 'GROUP 1 · INTERNATIONAL TRADE TERMS (INCOTERMS)',
                  ko: '구분 1 · 국제 무역 조건 (INCOTERMS)',
                  zh: '类别 1 · 国际贸易条款 (INCOTERMS)',
                })}
              </div>
              <h3 style={{ fontSize: '1.12rem', color: 'var(--dark-chocolate)', margin: '0 0 8px 0', fontWeight: 700 }}>
                {pick({
                  vi: 'Điều kiện thương mại: FOB / CIF',
                  en: 'Trade Terms: FOB / CIF',
                  ko: '무역 조건: FOB / CIF',
                  zh: '贸易条款：FOB / CIF',
                })}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                {pick({
                  vi: 'Áp dụng cho vận tải biển & đường thủy nội địa gồm FOB (Free On Board – Giao hàng lên tàu tại cảng đi) và CIF (Cost, Insurance and Freight – Tiền hàng, bảo hiểm và cước phí tới cảng đến); điều kiện chi tiết được thống nhất phù hợp theo từng đơn hàng.',
                  en: 'Maritime and inland waterway Incoterms covering FOB (Free On Board) and CIF (Cost, Insurance and Freight), agreed flexibly with each B2B export order.',
                  ko: '해상 및 내수로 운송 기준 FOB(본선인도조건) 및 CIF(운임·보험료 포함 인도조건)를 지원하며, 세부 조건은 주문별 협의에 따라 확정됩니다.',
                  zh: '适用于海运及内河水运的国际贸易条款，涵盖 FOB（装运港船上交货）与 CIF（成本、保险费加运费），具体条款依据各笔出口订单协商确认。',
                })}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--soft-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--primary-green)',
                  marginBottom: '6px',
                }}
              >
                {pick({
                  vi: 'NHÓM 2 · HÌNH THỨC VẬN CHUYỂN CONTAINER',
                  en: 'GROUP 2 · CONTAINER SHIPPING OPTIONS',
                  ko: '구분 2 · 컨테이너 운송 방식',
                  zh: '类别 2 · 集装箱海运方式',
                })}
              </div>
              <h3 style={{ fontSize: '1.12rem', color: 'var(--dark-chocolate)', margin: '0 0 8px 0', fontWeight: 700 }}>
                {pick({
                  vi: 'Hình thức vận chuyển: FCL / LCL',
                  en: 'Shipping Options: FCL / LCL',
                  ko: '운송 방식: FCL / LCL',
                  zh: '运输方式：FCL / LCL',
                })}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                {pick({
                  vi: 'Hỗ trợ cả FCL (Full Container Load – Hàng nguyên container 20ft/40ft) và LCL (Less than Container Load – Hàng lẻ ghép container) đáp ứng linh hoạt quy mô nhập khẩu thực tế của đối tác.',
                  en: 'Supports both FCL (Full Container Load, 20ft/40ft) and LCL (Less than Container Load) cargo consolidation tailored to each importer’s order volume.',
                  ko: 'FCL(Full Container Load – 20ft/40ft 컨테이너 단위 화물) 및 LCL(Less than Container Load – 컨테이너 혼재 화물) 운송을 모두 지원하여 발주 규모에 맞춰 유연하게 대응합니다.',
                  zh: '支持 FCL（整箱运输，20尺/40尺柜）与 LCL（拼箱运输）两种集装箱配载模式，灵活匹配不同进口商的实际订货规模。',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: B2B COOPERATION STEPS (MATCHING HTML 1:1)
          ======================================================================== */}
      <section className="subpage-section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 48px auto' }}>
            <span className="section-label">{t('marketsPage.section3.label')}</span>
            <h2 className="section-title">
              {t('marketsPage.section3.title')}
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              {t('marketsPage.section3.desc')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--brand-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                border: '1px solid var(--soft-border)',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)', marginBottom: '8px', display: 'block' }}>
                {t('marketsPage.section3.step1Num')}
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-chocolate)', marginBottom: '8px' }}>
                {t('marketsPage.section3.step1Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('marketsPage.section3.step1Desc')}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--brand-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                border: '1px solid var(--soft-border)',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)', marginBottom: '8px', display: 'block' }}>
                {t('marketsPage.section3.step2Num')}
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-chocolate)', marginBottom: '8px' }}>
                {t('marketsPage.section3.step2Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('marketsPage.section3.step2Desc')}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--brand-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                border: '1px solid var(--soft-border)',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--vinaxo-red)', fontFamily: 'var(--font-display)', marginBottom: '8px', display: 'block' }}>
                {t('marketsPage.section3.step3Num')}
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-chocolate)', marginBottom: '8px' }}>
                {t('marketsPage.section3.step3Title')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {t('marketsPage.section3.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 4: CALL TO ACTION FOR IMPORTERS
          ======================================================================== */}
      {/* ========================================================================
          SECTION 4: EXPORT TRADE CTA
          ======================================================================== */}
      <section className="subpage-section subpage-cta-section">
        <div className="container">
          <CorporateCTA
            eyebrow={t('marketsPage.section4.label')}
            title={t('marketsPage.section4.title')}
            description={t('marketsPage.section4.desc')}
            primaryText={pick({
              vi: 'Nhận Báo Giá Theo Điều Kiện FOB/CIF',
              en: 'Request Export Quote (FOB/CIF)',
              ko: 'FOB/CIF 조건 수출 견적 요청',
              zh: '获取出口报价（FOB / CIF）',
            })}
            onPrimaryClick={() => onOpenQuote()}
            secondaryText={pick({
              vi: 'Liên Hệ Ban Lãnh Đạo',
              en: 'Contact Leadership Directly',
              ko: '수출 경영진 직접 문의',
              zh: '直接联系管理团队'
            })}
            secondaryLink="/contact"
          />
        </div>
      </section>
    </div>
  );
};

export default GlobalMarket;
