import React, { useState } from 'react';
import { Newspaper, ExternalLink, MessageSquareQuote, Mail } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { newsData, NewsItem } from '../data/news';
import { COMPANY_INFO } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { NewsCard } from '../components/news/NewsCard';
import { NewsFilter } from '../components/news/NewsFilter';

export const PressMedia: React.FC = () => {
  const { language } = useLanguage();
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
        titleLine1={isVi ? 'Báo Chí & Tin Tức Doanh Nghiệp' : 'VINAXO in the Press'}
        titleLine2={isVi ? 'Xác Minh Từ Báo Giới Chính Luận' : '& Corporate Operational Updates'}
        description={
          isVi
            ? 'Tổng hợp 9 bài viết, bài phỏng vấn và trích dẫn phát biểu của Ban Lãnh đạo CÔNG TY TNHH VINAXO trên các cơ quan báo chí uy tín quốc gia và địa phương: CafeF, Báo Người Lao Động, Báo 24H, Báo Sài Gòn Giải Phóng, Báo Thanh Niên, Báo Đồng Tháp, Báo Nông Nghiệp & Môi Trường.'
            : 'Explore verified media coverage, executive interviews, and factory operation news published across Vietnam’s national press outlets. Direct links to original articles provided with complete transparency.'
        }
        breadcrumbCurrent={isVi ? 'Báo Chí & Tin Tức' : 'Press & Media'}
        theme="cream"
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

          {/* Media Relations Contact Card */}
          <div
            className="card"
            style={{
              padding: 'clamp(24px, 4vw, 36px)',
              backgroundColor: 'var(--light-sage)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--sage-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '6px' }}>
                <Newspaper size={20} />
                <span style={{ fontSize: '1.05rem' }}>
                  {isVi ? 'Liên Hệ Dành Cho Cơ Quan Báo Chí & Truyền Thông' : 'Media Relations & Press Inquiries'}
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-body-dark)', lineHeight: 1.6, maxWidth: '640px' }}>
                {isVi
                  ? 'Ban Truyền thông Công ty TNHH VINAXO sẵn sàng cung cấp hình ảnh tư liệu độ phân giải cao về cơ sở chế biến, thông số xuất khẩu và kết nối phỏng vấn Ban Giám đốc.'
                  : 'VINAXO’s Corporate Communications desk is available to provide high-resolution facility assets, trade statistics, and executive interviews.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href={`mailto:${COMPANY_INFO.contacts.email}?subject=Press%20Inquiry%20-%20VINAXO`}
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <Mail size={15} />
                <span>{isVi ? 'Gửi Email Phỏng Vấn' : 'Email Press Desk'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PressMedia;
