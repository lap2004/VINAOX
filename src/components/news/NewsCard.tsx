import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, MessageSquareQuote, Newspaper, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { NewsItem } from '../../data/news';
import { useLanguage } from '../../i18n/LanguageContext';

export interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const info = isVi ? news.vi : news.en;
  const badgeText = isVi ? news.badgeTextVi : news.badgeTextEn;
  const dateText = isVi ? news.dateVi : news.dateEn;

  // Render badge by badgeType
  const renderBadge = () => {
    switch (news.badgeType) {
      case 'quote':
        return (
          <span className="badge badge-blue">
            <MessageSquareQuote size={12} />
            {badgeText}
          </span>
        );
      case 'interview':
        return (
          <span className="badge badge-gold">
            <Sparkles size={12} />
            {badgeText}
          </span>
        );
      case 'operation':
        return (
          <span className="badge badge-green">
            <Building2 size={12} />
            {badgeText}
          </span>
        );
      default:
        return (
          <span className="badge badge-sage">
            <Newspaper size={12} />
            {badgeText}
          </span>
        );
    }
  };

  return (
    <article
      className="card news-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Thumbnail Frame */}
      <div
        style={{
          position: 'relative',
          paddingTop: '58%',
          backgroundColor: 'var(--soft-beige)',
          overflow: 'hidden',
        }}
      >
        <Link to={`/tin-tuc/${news.id}`} aria-label={info.title} style={{ display: 'block', position: 'absolute', inset: 0 }}>
          <picture>
            <source srcSet={news.imageWebp} type="image/webp" />
            <img
              src={news.imageJpg}
              alt={info.title}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              className="news-card-img"
            />
          </picture>
        </Link>

        {/* Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
          }}
        >
          {renderBadge()}
        </div>

        {/* Source Outlet Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 2,
            backgroundColor: 'rgba(58, 37, 27, 0.9)',
            backdropFilter: 'blur(4px)',
            color: 'var(--brand-orange)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {news.source}
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Date Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            marginBottom: '10px',
          }}
        >
          <Calendar size={13} />
          <time dateTime={news.publishedAt}>{dateText}</time>
          {news.personQuoted && (
            <span>
              • {isVi ? news.personQuoted.titleVi : news.personQuoted.titleEn}
            </span>
          )}
        </div>

        {/* Article Title */}
        <h3
          className="title-serif"
          style={{
            fontSize: '1.18rem',
            fontWeight: 700,
            color: 'var(--color-heading)',
            lineHeight: 1.35,
            marginBottom: '12px',
          }}
        >
          <Link
            to={`/tin-tuc/${news.id}`}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--brand-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'inherit';
            }}
          >
            {info.title}
          </Link>
        </h3>

        {/* Summary Excerpt */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--color-body)',
            lineHeight: 1.65,
            marginBottom: '20px',
            flex: 1,
          }}
        >
          {info.summary}
        </p>

        {/* Card Links */}
        <div
          style={{
            paddingTop: '14px',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to={`/tin-tuc/${news.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--brand-orange)',
              textDecoration: 'none',
              transition: 'opacity 0.18s ease',
            }}
          >
            <span>{isVi ? 'Xem chi tiết' : 'View Article'}</span>
            <ArrowRight size={14} />
          </Link>

          {news.sourceUrl && (
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.80rem',
                fontWeight: 600,
                color: 'var(--color-muted)',
                transition: 'color 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-green)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-muted)';
              }}
            >
              <span>{info.readMore}</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
