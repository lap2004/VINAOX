import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MessageSquareQuote, Mail } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { newsData, NewsItem } from '../data/news';
import { COMPANY_INFO } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { NewsCard } from '../components/news/NewsCard';
import { NewsFilter } from '../components/news/NewsFilter';

export const PressMedia: React.FC = () => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter news
  const filteredNews =
    activeCategory === 'all'
      ? newsData
      : newsData.filter((item) => item.category === activeCategory);

  // Featured article (First one: CafeF)
  const featuredArticle: NewsItem = newsData[0];
  const featuredInfo = isVi ? featuredArticle.vi : featuredArticle.en;

  const countAll = newsData.length;
  const countPress = newsData.filter((i) => i.category === 'press').length;
  const countCompany = newsData.filter((i) => i.category === 'company').length;

  return (
    <div className="news-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'BÁO CHÍ & TRUYỀN THÔNG • PRESS ARCHIVE' : 'PRESS ARCHIVE • VERIFIED COVERAGE'}
        title={t('pageBanners.news.title') || (isVi ? 'Báo Chí Nói Về VINAXO & Hoạt Động Doanh Nghiệp' : 'VINAXO in the Press & Media')}
        description={
          t('pageBanners.news.subtitle') ||
          (isVi
            ? 'Tổng hợp các bài viết, phóng sự và trích dẫn từ các cơ quan báo chí chính thống về hoạt động chế biến, xuất khẩu nông sản của VINAXO.'
            : 'Explore verified media coverage, executive interviews, and factory operation news published across Vietnam’s national press outlets.')
        }
        breadcrumbCurrent={isVi ? 'Báo Chí & Tin Tức' : 'Press & Media'}
      />

      {/* ======================================================================
          FEATURED PRESS ARTICLE
          ====================================================================== */}
      <section className="section section-white" style={{ paddingBottom: '32px' }}>
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
                  {isVi ? 'Bài Báo Nổi Bật' : 'Featured Coverage'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  • {featuredArticle.source} ({isVi ? featuredArticle.dateVi : featuredArticle.dateEn})
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

                {featuredArticle.personQuoted && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                    {isVi ? 'Phát ngôn: ' : 'Quote: '}
                    <strong>{featuredArticle.personQuoted.name}</strong> (
                    {isVi ? featuredArticle.personQuoted.titleVi : featuredArticle.personQuoted.titleEn})
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

      {/* ======================================================================
          NEWS ARCHIVE WITH FILTER TABS
          ====================================================================== */}
      <section className="section section-white" style={{ paddingTop: '24px' }}>
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
          <div className="media-relations-card" style={{ marginTop: '56px' }}>
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

            <div style={{ backgroundColor: 'var(--light-sage)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid #D5E2D9' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '12px' }}>
                {t('newsPage.mediaCard.boxTitle')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>
                <strong>{t('newsPage.mediaCard.spokespersonLabel')} </strong>
                <span>{t('newsPage.mediaCard.spokespersonVal')}</span>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>
                <strong>{t('newsPage.mediaCard.emailLabel')} </strong>
                <span>{COMPANY_INFO.contacts.email}</span>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>
                <strong>{t('newsPage.mediaCard.hotlineLabel')} </strong>
                <span>{COMPANY_INFO.contacts.hotline}</span>
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '12px', lineHeight: 1.5 }}>
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
