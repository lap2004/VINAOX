import { ArticleContent } from '../types/content';
import { NewsItem, newsData as fallbackNewsData } from '../data/news';

// Build-time static loading of all news articles in content/news/
const articleModules = import.meta.glob<ArticleContent>('/content/news/*.json', { eager: true });

// Convert imported modules into an array of ArticleContent
const loadedArticles: ArticleContent[] = Object.values(articleModules).map((mod: any) => {
  return mod.default || mod;
});

// Helper to convert ArticleContent to NewsItem for 100% backward compatibility
export function toNewsItem(article: ArticleContent): NewsItem {
  return {
    id: article.id,
    category: article.category,
    badgeType: article.badgeType,
    badgeTextVi: article.badgeTextVi,
    badgeTextEn: article.badgeTextEn,
    source: article.source,
    sourceUrl: article.sourceUrl || '',
    secondaryUrls: article.secondaryUrls,
    publishedAt: article.published_at,
    dateEn: article.dateEn || article.published_at,
    dateVi: article.dateVi || article.published_at,
    verified: article.verified ?? true,
    personQuoted: article.personQuoted || undefined,
    imageWebp: article.cover_image,
    imageJpg: article.cover_image,
    en: {
      title: article.title_en || article.title_vi,
      sourceBadge: `${article.source} • Press`,
      summary: article.excerpt_en || article.body_en || '',
      readMore: article.sourceUrl ? 'Read Original Article' : 'Read Article'
    },
    vi: {
      title: article.title_vi,
      sourceBadge: `${article.source} • Tin tức`,
      summary: article.excerpt_vi || article.body_vi || '',
      readMore: article.sourceUrl ? 'Đọc bài báo gốc' : 'Xem chi tiết'
    }
  };
}

/**
 * Returns all articles sorted by published date (newest first).
 * Falls back to hardcoded newsData if content folder is empty.
 */
export function getAllArticles(): ArticleContent[] {
  if (loadedArticles.length === 0) {
    // Graceful fallback to legacy hardcoded data
    return fallbackNewsData.map((item) => ({
      id: item.id,
      slug: item.id,
      title_vi: item.vi.title,
      title_en: item.en.title,
      excerpt_vi: item.vi.summary,
      excerpt_en: item.en.summary,
      body_vi: item.vi.summary,
      body_en: item.en.summary,
      cover_image: item.imageWebp || item.imageJpg,
      category: item.category,
      badgeType: item.badgeType,
      badgeTextVi: item.badgeTextVi,
      badgeTextEn: item.badgeTextEn,
      source: item.source,
      sourceUrl: item.sourceUrl,
      secondaryUrls: item.secondaryUrls,
      author: item.personQuoted?.name || 'VINAXO',
      personQuoted: item.personQuoted || undefined,
      published_at: item.publishedAt,
      dateVi: item.dateVi,
      dateEn: item.dateEn,
      featured: item.id === fallbackNewsData[0]?.id,
      verified: item.verified
    }));
  }

  return [...loadedArticles].sort((a, b) => {
    const dateA = new Date(a.published_at).getTime() || 0;
    const dateB = new Date(b.published_at).getTime() || 0;
    return dateB - dateA;
  });
}

/**
 * Returns all articles converted to NewsItem objects for components
 */
export function getAllNewsItems(): NewsItem[] {
  const articles = getAllArticles();
  return articles.map(toNewsItem);
}

/**
 * Finds a single article by its slug or ID
 */
export function getArticleBySlug(slug: string): ArticleContent | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug || a.id === slug);
}

/**
 * Returns the featured article
 */
export function getFeaturedArticle(): ArticleContent | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.featured) || articles[0];
}

/**
 * Filters articles by category ('press' | 'company' | 'all')
 */
export function getArticlesByCategory(category: string): ArticleContent[] {
  const articles = getAllArticles();
  if (!category || category === 'all') return articles;
  return articles.filter((a) => a.category === category);
}
