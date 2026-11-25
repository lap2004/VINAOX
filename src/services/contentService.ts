import { ArticleContent } from '../types/content';
import { NewsItem, newsData as fallbackNewsData } from '../data/news';
import { validateNewsArticle } from '../shared/schemas/newsSchema';

// Build-time static loading of all news articles in content/news/ with fault isolation
let articleModules: Record<string, any> = {};
try {
  if (typeof (import.meta as any)?.glob === 'function') {
    articleModules = (import.meta as any).glob('/content/news/*.json', { eager: true });
  }
} catch {
  articleModules = {};
}

// Convert imported modules into an array of ArticleContent with defensive validation
const loadedArticles: ArticleContent[] = [];
for (const [filePath, mod] of Object.entries(articleModules)) {
  try {
    const raw = (mod as any)?.default || mod;
    const validated = validateNewsArticle(raw);
    if (validated.data) {
      loadedArticles.push(validated.data);
    }
  } catch (err) {
    console.warn(`[VINAXO contentService] Malformed article at ${filePath} isolated, skipping:`, err);
  }
}

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

// Helper to convert ArticleContent to NewsItem for 100% backward compatibility with total fault tolerance
export function toNewsItem(article: ArticleContent): NewsItem {
  try {
    const safeSourceUrl = safeExternalUrl(article?.sourceUrl);
    const category = article?.category === 'company' ? 'company' : 'press';
    const badgeType = article?.badgeType || (category === 'company' ? 'operation' : 'quote');
    const source = article?.source || 'VINAXO';
    const titleVi = article?.title_vi || 'Tin tức VINAXO';
    const titleEn = article?.title_en || titleVi;
    const summaryVi = article?.excerpt_vi || article?.body_vi || '';
    const summaryEn = article?.excerpt_en || article?.body_en || summaryVi;
    const coverImage = article?.cover_image || '/assets/images/news/dried-fruit-export.webp';

    return {
      id: article?.id || article?.slug || 'bai-viet',
      category,
      badgeType,
      badgeTextVi: article?.badgeTextVi || (category === 'company' ? 'Hoạt động doanh nghiệp' : 'Báo chí đưa tin'),
      badgeTextEn: article?.badgeTextEn || (category === 'company' ? 'Company Operations' : 'Press Coverage'),
      source,
      sourceUrl: safeSourceUrl,
      secondaryUrls: Array.isArray(article?.secondaryUrls)
        ? article.secondaryUrls.filter((s) => Boolean(safeExternalUrl(s?.url)))
        : [],
      publishedAt: article?.published_at || new Date().toISOString().split('T')[0],
      dateEn: article?.dateEn || article?.published_at || 'May 2026',
      dateVi: article?.dateVi || article?.published_at || '05/2026',
      verified: article?.verified ?? true,
      personQuoted: article?.personQuoted || undefined,
      imageWebp: coverImage,
      imageJpg: coverImage,
      en: {
        title: titleEn,
        sourceBadge: `${source} • Press`,
        summary: summaryEn,
        readMore: safeSourceUrl ? 'Read Original Article' : 'Read Article'
      },
      vi: {
        title: titleVi,
        sourceBadge: `${source} • Tin tức`,
        summary: summaryVi,
        readMore: safeSourceUrl ? 'Đọc bài báo gốc' : 'Xem chi tiết'
      }
    };
  } catch (err) {
    console.error('[VINAXO toNewsItem] Error transforming article to NewsItem, using fallback:', err);
    return fallbackNewsData[0];
  }
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
    const dateA = a?.published_at ? Date.parse(a.published_at) || 0 : 0;
    const dateB = b?.published_at ? Date.parse(b.published_at) || 0 : 0;
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
