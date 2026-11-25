import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  ExternalLink, 
  ArrowLeft, 
  Newspaper, 
  Building2, 
  MessageSquareQuote, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getArticleBySlug, getAllArticles, toNewsItem, safeExternalUrl } from '../services/contentService';
import { NewsCard } from '../components/news/NewsCard';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const article = slug ? getArticleBySlug(slug) : undefined;

  // Dynamic document title
  useEffect(() => {
    if (article) {
      const title = isVi ? article.title_vi : (article.title_en || article.title_vi);
      document.title = `${title} | VINAXO News`;
    } else {
      document.title = isVi ? 'Bài viết không tồn tại | VINAXO' : 'Article Not Found | VINAXO';
    }
  }, [article, isVi]);

  // Handle article not found
  if (!article) {
    return (
      <div className="article-not-found" style={{ minHeight: '60vh', padding: '80px 20px', background: 'var(--cream-bg)' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center', margin: '0 auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 168, 58, 0.15)',
            color: 'var(--brand-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Newspaper size={32} />
          </div>
          <h1 className="title-serif" style={{ fontSize: '1.8rem', color: 'var(--color-heading)', marginBottom: '16px' }}>
            {isVi ? 'Không tìm thấy bài viết' : 'Article Not Found'}
          </h1>
          <p style={{ color: 'var(--color-body)', lineHeight: 1.6, marginBottom: '32px' }}>
            {isVi 
              ? 'Bài viết bạn đang tìm kiếm có thể đã được cập nhật đường dẫn hoặc tạm thời gỡ xuống.' 
              : 'The article you are looking for may have been moved or is temporarily unavailable.'}
          </p>
          <Link
            to="/press-media"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--brand-orange)',
              color: 'var(--white)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} />
            <span>{isVi ? 'Quay lại Báo chí & Tin tức' : 'Back to Press & Media'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = isVi ? article.title_vi : (article.title_en || article.title_vi);
  const excerpt = isVi ? article.excerpt_vi : (article.excerpt_en || article.excerpt_vi);
  const body = isVi ? article.body_vi : (article.body_en || article.body_vi);
  const dateText = isVi ? (article.dateVi || article.published_at) : (article.dateEn || article.published_at);
  const badgeText = isVi ? article.badgeTextVi : article.badgeTextEn;

  // Related articles (exclude current)
  const relatedArticles = getAllArticles()
    .filter((a) => a.id !== article.id)
    .slice(0, 3)
    .map(toNewsItem);

  // Render badge by badgeType
  const renderBadge = () => {
    switch (article.badgeType) {
      case 'quote':
        return (
          <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquareQuote size={13} />
            {badgeText}
          </span>
        );
      case 'interview':
        return (
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} />
            {badgeText}
          </span>
        );
      case 'operation':
        return (
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={13} />
            {badgeText}
          </span>
        );
      default:
        return (
          <span className="badge badge-sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Newspaper size={13} />
            {badgeText}
          </span>
        );
    }
  };

  // Safe markdown/text paragraph renderer
  const renderBodyContent = (text: string) => {
    if (!text) return null;
    
    // Split text into paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Handle Headings (H2 / H3)
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} style={{ fontSize: '1.2rem', color: 'var(--color-heading)', margin: '24px 0 12px', fontWeight: 700 }}>
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={index} className="title-serif" style={{ fontSize: '1.45rem', color: 'var(--color-heading)', margin: '32px 0 16px', fontWeight: 700 }}>
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={index} className="title-serif" style={{ fontSize: '1.65rem', color: 'var(--color-heading)', margin: '36px 0 18px', fontWeight: 700 }}>
            {trimmed.replace('# ', '')}
          </h2>
        );
      }

      // Handle Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(line => line.replace(/^[-*]\s+/, ''));
        return (
          <ul key={index} style={{ paddingLeft: '24px', margin: '16px 0', lineHeight: 1.8, color: 'var(--color-body)' }}>
            {items.map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
        );
      }

      // Handle Blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote 
            key={index} 
            style={{
              borderLeft: '4px solid var(--brand-orange)',
              padding: '16px 20px',
              backgroundColor: 'rgba(244, 168, 58, 0.08)',
              borderRadius: '0 8px 8px 0',
              margin: '24px 0',
              fontStyle: 'italic',
              color: 'var(--color-heading)',
              lineHeight: 1.7
            }}
          >
            {trimmed.replace(/^>\s*/gm, '')}
          </blockquote>
        );
      }

      // Standard Paragraph
      return (
        <p key={index} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-body)', marginBottom: '20px' }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="article-detail-page" style={{ background: 'var(--cream-bg)', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Top Breadcrumb & Navigation Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--color-border)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--color-muted)' }}>
            <Link to="/" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>
              {isVi ? 'Trang chủ' : 'Home'}
            </Link>
            <span>/</span>
            <Link to="/press-media" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>
              {isVi ? 'Báo chí & Tin tức' : 'Press & Media'}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--brand-orange)', fontWeight: 600, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </span>
          </div>

          <Link
            to="/press-media"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--color-heading)',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={15} />
            <span>{isVi ? 'Tất cả bài viết' : 'All Articles'}</span>
          </Link>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="container" style={{ maxWidth: '860px', margin: '40px auto 0', padding: '0 20px' }}>
        {/* Article Header Card */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {renderBadge()}
            <span style={{ fontSize: '0.84rem', color: 'var(--brand-orange)', fontWeight: 700 }}>
              • {article.source}
            </span>
            {article.verified && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--primary-green)' }}>
                <CheckCircle2 size={13} />
                {isVi ? 'Nguồn xác thực' : 'Verified Coverage'}
              </span>
            )}
          </div>

          <h1 
            className="title-serif" 
            style={{ 
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', 
              lineHeight: 1.25, 
              color: 'var(--color-heading)', 
              fontWeight: 700, 
              marginBottom: '20px' 
            }}
          >
            {title}
          </h1>

          {/* Metadata bar */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '16px', 
              fontSize: '0.86rem', 
              color: 'var(--color-muted)',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} />
              <time dateTime={article.published_at}>{dateText}</time>
            </div>

            {article.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} />
                <span>{article.author}</span>
              </div>
            )}

            {article.personQuoted && (
              <div style={{ color: 'var(--color-body)' }}>
                <span>• {isVi ? article.personQuoted.titleVi : article.personQuoted.titleEn}</span>
              </div>
            )}
          </div>
        </header>

        {/* Lead Excerpt Highlight */}
        {excerpt && (
          <div 
            style={{ 
              padding: '24px 28px', 
              backgroundColor: 'var(--white)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid var(--sage-border)', 
              marginBottom: '36px',
              borderLeft: '5px solid var(--brand-orange)'
            }}
          >
            <p style={{ fontSize: '1.12rem', lineHeight: 1.7, color: 'var(--color-heading)', fontWeight: 500, margin: 0 }}>
              {excerpt}
            </p>
          </div>
        )}

        {/* Cover Image */}
        {article.cover_image && (
          <figure style={{ margin: '0 0 36px 0', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
            <img 
              src={article.cover_image} 
              alt={isVi ? (article.cover_image_alt_vi || title) : (article.cover_image_alt_en || title)}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
            />
            {article.cover_image_alt_vi && (
              <figcaption style={{ fontSize: '0.82rem', color: 'var(--color-muted)', padding: '10px 14px', background: 'var(--white)', textAlign: 'center' }}>
                {isVi ? article.cover_image_alt_vi : (article.cover_image_alt_en || article.cover_image_alt_vi)}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body Content */}
        <div 
          className="article-body-content" 
          style={{ 
            backgroundColor: 'var(--white)', 
            padding: 'clamp(24px, 4vw, 44px)', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--color-border)',
            marginBottom: '40px' 
          }}
        >
          {renderBodyContent(body)}

          {/* External Source Link Callout */}
          {safeExternalUrl(article.sourceUrl) && (
            <div 
              style={{ 
                marginTop: '36px', 
                padding: '20px', 
                backgroundColor: 'rgba(58, 37, 27, 0.04)', 
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-heading)', margin: '0 0 4px 0', fontSize: '0.94rem' }}>
                  {isVi ? `Bài viết gốc xuất bản trên ${article.source}` : `Original report published on ${article.source}`}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: 0 }}>
                  {isVi ? 'Quý đối tác và độc giả có thể tham khảo bài báo nguyên bản theo liên kết chính thức.' : 'Explore the full verified press report via the official editorial link.'}
                </p>
              </div>

              <a
                href={safeExternalUrl(article.sourceUrl)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'var(--brand-orange)',
                  color: 'var(--white)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>{isVi ? 'Xem bài viết gốc' : 'Read Original Press'}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Additional Secondary Links if any */}
          {article.secondaryUrls && article.secondaryUrls.length > 0 && (
            <div style={{ marginTop: '20px', fontSize: '0.84rem', color: 'var(--color-muted)' }}>
              <span>{isVi ? 'Đăng lại và trích dẫn trên các báo: ' : 'Also syndicated on: '}</span>
              {article.secondaryUrls
                .filter((s) => Boolean(safeExternalUrl(s.url)))
                .map((s, idx, arr) => (
                <span key={idx}>
                  <a href={safeExternalUrl(s.url)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-green)', textDecoration: 'underline' }}>
                    {s.name}
                  </a>
                  {idx < arr.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Article Footer & Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '60px' }}>
          <Link
            to="/press-media"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--white)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--color-heading)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>{isVi ? 'Quay lại danh sách tin tức' : 'Back to News List'}</span>
          </Link>

          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--brand-brown)',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--white)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            <span>{isVi ? 'Liên hệ Ban Biên Tập' : 'Contact Editorial Team'}</span>
          </Link>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section" style={{ borderTop: '1.5px solid var(--color-border)', paddingTop: '40px' }}>
            <h2 className="title-serif" style={{ fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '24px', fontWeight: 700 }}>
              {isVi ? 'Bài viết liên quan' : 'Related Articles'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {relatedArticles.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default ArticleDetail;
