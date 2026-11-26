import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MessageSquareQuote, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { NewsItem } from '../data/news';
import { getAllNewsItems, getNewsLocalized, getPersonQuotedTitle } from '../services/contentService';
import { COMPANY_INFO } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { NewsCard } from '../components/news/NewsCard';
import { NewsFilter } from '../components/news/NewsFilter';

export const PressMedia: React.FC = () => {
  const { t, language, pick } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const newsData = getAllNewsItems();

  // Filter news
  const filteredNews =
    activeCategory === 'all'
      ? newsData
      : newsData.filter((item) => item.category === activeCategory);

  // Featured article (safely handle empty newsData)
  const featuredArticle: NewsItem | undefined = newsData[0];
  const featuredInfo = featuredArticle ? getNewsLocalized(featuredArticle, language) : undefined;
  const featuredQuotedTitle = featuredArticle ? getPersonQuotedTitle(featuredArticle.personQuoted, language) : '';

  const countAll = newsData.length;
  const countPress = newsData.filter((i) => i.category === 'press').length;
  const countCompany = newsData.filter((i) => i.category === 'company').length;

  return (
    <div className="news-page">
      {/* Page Hero */}
      <PageHero
        badge={pick({
          vi: 'BÁO CHÍ & TRUYỀN THÔNG • PRESS ARCHIVE',
          en: 'PRESS ARCHIVE • VERIFIED COVERAGE',
          ko: '언론 보도 및 미디어 아카이브',
          zh: '官方媒体报道与新闻档案馆'
        })}
        title={t('pageBanners.news.title') || pick({
          vi: 'Báo Chí Nói Về VINAXO & Hoạt Động Doanh Nghiệp',
          en: 'VINAXO in the Press & Media',
          ko: '언론 속 VINAXO 및 기업 뉴스',
          zh: '媒体眼中的 VINAXO 与企业动态'
        })}
        description={
          t('pageBanners.news.subtitle') ||
          pick({
            vi: 'Tổng hợp các bài viết, phóng sự và trích dẫn từ các cơ quan báo chí chính thống về hoạt động chế biến, xuất khẩu nông sản của VINAXO.',
            en: 'Explore verified media coverage, executive interviews, and factory operation news published across Vietnam’s national press outlets.',
            ko: '베트남 주요 언론사가 보도한 VINAXO의 가공 공장, 수출 전략 및 경영진 인터뷰 소식을 확인하세요.',
            zh: '汇集各大权威媒体关于 VINAXO 深加工工厂、出口物流及管理层专访的真实报道与资讯。'
          })
        }
        breadcrumbCurrent={pick({
          vi: 'Báo Chí & Tin Tức',
          en: 'Press & Media',
          ko: '뉴스 및 언론 보도',
          zh: '新闻与媒体'
        })}
      />

      {/* ======================================================================
          FEATURED PRESS ARTICLE
          ====================================================================== */}
      {featuredArticle && featuredInfo && (
      <section className="section section-white" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <div
            className="card grid-mobile-1"
            style={{
              padding: 'clamp(28px, 4vw, 44px)',
              backgroundColor: 'var(--cream-bg)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--sage-border)',
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: 'clamp(28px, 4vw, 48px)',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="badge badge-blue">
                  <MessageSquareQuote size={13} />
                  {pick({ vi: 'Bài Báo Nổi Bật', en: 'Featured Coverage', ko: '주요 보도 기사', zh: '焦点专题报道' })}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  • {featuredArticle.source} ({featuredInfo.date})
                </span>
              </div>

              <h2
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                  fontWeight: 700,
                  color: 'var(--color-heading)',
                  lineHeight: 1.25,
                  marginBottom: '16px',
                }}
              >
                {featuredInfo.title}
              </h2>

              <p
                style={{
                  fontSize: '0.94rem',
                  color: 'var(--color-body)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                {featuredInfo.summary}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {featuredArticle.sourceUrl ? (
                  <a
                    href={featuredArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{featuredInfo.readMore}</span>
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <Link
                    to={`/tin-tuc/${featuredArticle.id}`}
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{featuredInfo.readMore}</span>
                    <ArrowRight size={15} />
                  </Link>
                )}

                {featuredArticle.personQuoted && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                    {pick({ vi: 'Phát ngôn: ', en: 'Quote: ', ko: '발언자: ', zh: '受访嘉宾：' })}
                    <strong>{featuredArticle.personQuoted.name}</strong>
                    {featuredQuotedTitle ? ` (${featuredQuotedTitle})` : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                aspectRatio: '16/10',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <picture>
                <source srcSet={featuredArticle.imageWebp} type="image/webp" />
                <img
                  src={featuredArticle.imageJpg}
                  alt={featuredInfo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </picture>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ======================================================================
          NEWS ARCHIVE WITH FILTER TABS
          ====================================================================== */}
      <section className="section section-white" style={{ paddingTop: '36px' }}>
        <div className="container">
          {/* Category Filter Tabs */}
          <NewsFilter
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            countAll={countAll}
            countPress={countPress}
            countCompany={countCompany}
          />

          {/* News Grid (3 Columns) */}
          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '28px',
              marginBottom: '56px',
            }}
          >
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {/* ========================================================================
              SECTION 2: MEDIA KIT & PRESS RELATIONS CONTACT BOX (MATCHING HTML 1:1)
              ======================================================================== */}
          <div className="media-relations-card" style={{ marginTop: '64px' }}>
            <div>
              <span className="section-label">{t('newsPage.mediaCard.label')}</span>
              <h2 className="title-serif" style={{ fontSize: '1.625rem', color: 'var(--forest-green)', marginBottom: '12px' }}>
                {t('newsPage.mediaCard.title')}
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-body)', lineHeight: 1.6, marginBottom: '20px' }}>
                {t('newsPage.mediaCard.desc')}
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${COMPANY_INFO.contacts.email}?subject=Press%20Inquiry%20-%20VINAXO`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Mail size={16} />
                  <span>{t('newsPage.mediaCard.btnInterview')}</span>
                </a>
                <Link to="/contact" className="btn btn-secondary">
                  <span>{t('newsPage.mediaCard.btnContact')}</span>
                </Link>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--brand-orange-soft)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 168, 58, 0.45)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-chocolate)', marginBottom: '12px' }}>
                {t('newsPage.mediaCard.boxTitle')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', marginBottom: '8px' }}>
                <strong>{t('newsPage.mediaCard.spokespersonLabel')} </strong>
                <span>{t('newsPage.mediaCard.spokespersonVal')}</span>
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', marginBottom: '8px' }}>
                <strong>{t('newsPage.mediaCard.emailLabel')} </strong>
                <span>{COMPANY_INFO.contacts.email}</span>
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', marginBottom: '8px' }}>
                <strong>{t('newsPage.mediaCard.hotlineLabel')} </strong>
                <span>{COMPANY_INFO.contacts.phoneDisplay}</span>
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-text)', marginTop: '12px', lineHeight: 1.5 }}>
                {t('newsPage.mediaCard.copyrightNote')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default PressMedia;
