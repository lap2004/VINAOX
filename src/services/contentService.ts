import { ArticleContent } from '../types/content';
import { NewsItem, newsData as fallbackNewsData } from '../data/news';

// Build-time static loading of all news articles in content/news/
const articleModules = import.meta.glob<ArticleContent>('/content/news/*.json', { eager: true });

// Convert imported modules into an array of ArticleContent
const loadedArticles: ArticleContent[] = Object.values(articleModules).map((mod: any) => {
  return mod.default || mod;
});

/**
 * Determines whether an article is a draft and must NOT appear on public pages.
 */
export function isArticleDraft(article: Partial<ArticleContent> | undefined | null): boolean {
  if (!article) return true;
  if (article.status === 'draft') return true;
  if (article.published === false) return true;
  if (Array.isArray(article.tags) && article.tags.some((t) => String(t).toLowerCase() === 'draft')) {
    return true;
  }
  return false;
}

/**
 * Returns only safe http/https URLs; blocks javascript:, data:, vbscript:, etc.
 */
export function safeExternalUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
  } catch {
    return '';
  }
  return '';
}

// Helper to convert ArticleContent to NewsItem for 100% backward compatibility
export function toNewsItem(article: ArticleContent): NewsItem {
  const safeSourceUrl = safeExternalUrl(article.sourceUrl);
  return {
    id: article.id || article.slug,
    category: article.category,
    badgeType: article.badgeType,
    badgeTextVi: article.badgeTextVi,
    badgeTextEn: article.badgeTextEn,
    source: article.source,
    sourceUrl: safeSourceUrl,
    secondaryUrls: article.secondaryUrls?.filter((s) => Boolean(safeExternalUrl(s.url))),
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
      readMore: safeSourceUrl ? 'Read Original Article' : 'Read Article'
    },
    vi: {
      title: article.title_vi,
      sourceBadge: `${article.source} • Tin tức`,
      summary: article.excerpt_vi || article.body_vi || '',
      readMore: safeSourceUrl ? 'Đọc bài báo gốc' : 'Xem chi tiết'
    }
  };
}

/**
 * Returns articles sorted by published date (newest first).
 * By default (`includeDrafts = false`), drafts are strictly excluded from public output.
 */
export function getAllArticles(options: { includeDrafts?: boolean } = {}): ArticleContent[] {
  const includeDrafts = Boolean(options.includeDrafts);

  const sourceList: ArticleContent[] =
    loadedArticles.length > 0
      ? loadedArticles
      : fallbackNewsData.map((item) => ({
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
          verified: item.verified,
          status: 'published',
          published: true
        }));

  const visible = includeDrafts ? sourceList : sourceList.filter((a) => !isArticleDraft(a));

  return [...visible].sort((a, b) => {
    const dateA = new Date(a.published_at).getTime() || 0;
    const dateB = new Date(b.published_at).getTime() || 0;
    return dateB - dateA;
  });
}

/**
 * Returns published articles converted to NewsItem objects for public components.
 */
export function getAllNewsItems(): NewsItem[] {
  const articles = getAllArticles({ includeDrafts: false });
  return articles.map(toNewsItem);
}

/**
 * Finds a single article by its slug or ID.
 * Excludes drafts unless `includeDrafts = true` is explicitly passed.
 */
export function getArticleBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): ArticleContent | undefined {
  const articles = getAllArticles({ includeDrafts: Boolean(options.includeDrafts) });
  return articles.find((a) => a.slug === slug || a.id === slug);
}

/**
 * Returns the featured published article.
 */
export function getFeaturedArticle(): ArticleContent | undefined {
  const articles = getAllArticles({ includeDrafts: false });
  return articles.find((a) => a.featured) || articles[0];
}

/**
 * Filters published articles by category ('press' | 'company' | 'all').
 */
export function getArticlesByCategory(category: string): ArticleContent[] {
  const articles = getAllArticles({ includeDrafts: false });
  if (!category || category === 'all') return articles;
  return articles.filter((a) => a.category === category);
}
