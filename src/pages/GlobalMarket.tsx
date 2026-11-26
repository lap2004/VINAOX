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
              vi: 'Yêu Cầu Báo Giá FCL/CIF',
              en: 'Request FCL/CIF Quotation',
              ko: 'FCL/CIF 수출 견적 요청',
              zh: '获取整柜 FCL / CIF 报价'
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
