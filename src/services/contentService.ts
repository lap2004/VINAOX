import { ArticleContent } from '../types/content';
import { NewsItem, newsData as fallbackNewsData } from '../data/news';
import { validateNewsArticle } from '../shared/schemas/newsSchema';

// Build-time static loading of all news articles in content/news/ with fault isolation
let articleModules: Record<string, any> = {};
try {
  articleModules = (import.meta as any).glob('/content/news/*.json', { eager: true });
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
export function formatNewsDate(publishedAt: string | undefined, lang: 'vi' | 'en' | 'ko' | 'zh-CN', explicitDate?: string): string {
  if (explicitDate) return explicitDate;
  if (!publishedAt) {
    if (lang === 'vi') return '05/2026';
    if (lang === 'ko') return '2026.05';
    if (lang === 'zh-CN') return '2026年5月';
    return 'May 2026';
  }
  const m = publishedAt.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return publishedAt;
  const [, yyyy, mm, dd] = m;
  if (lang === 'vi') return `${dd}/${mm}/${yyyy}`;
  if (lang === 'ko') return `${yyyy}.${mm}.${dd}`;
  if (lang === 'zh-CN') return `${yyyy}年${Number(mm)}月${Number(dd)}日`;
  return publishedAt;
}

export function toNewsItem(article: ArticleContent): NewsItem {
  try {
    const safeSourceUrl = safeExternalUrl(article?.sourceUrl);
    const category = article?.category === 'company' ? 'company' : 'press';
    const badgeType = article?.badgeType || (category === 'company' ? 'operation' : 'quote');
    const source = article?.source || 'VINAXO';
    const titleVi = article?.title_vi || 'Tin tức VINAXO';
    const titleEn = article?.title_en || titleVi;
    const titleKo = article?.title_ko || titleEn;
    const titleZh = article?.title_zh || titleEn;
    const summaryVi = article?.excerpt_vi || article?.body_vi || '';
    const summaryEn = article?.excerpt_en || article?.body_en || summaryVi;
    const summaryKo = article?.excerpt_ko || article?.body_ko || summaryEn;
    const summaryZh = article?.excerpt_zh || article?.body_zh || summaryEn;
    const coverImage = article?.cover_image || '/assets/images/news/dried-fruit-export.webp';
    const publishedAt = article?.published_at || new Date().toISOString().split('T')[0];

    return {
      id: article?.id || article?.slug || 'bai-viet',
      category,
      badgeType,
      badgeTextVi: article?.badgeTextVi || (category === 'company' ? 'Hoạt động doanh nghiệp' : 'Báo chí đưa tin'),
      badgeTextEn: article?.badgeTextEn || (category === 'company' ? 'Company Operations' : 'Press Coverage'),
      badgeTextKo: article?.badgeTextKo || (category === 'company' ? '기업 활동' : '언론 보도'),
      badgeTextZh: article?.badgeTextZh || (category === 'company' ? '企业动态' : '媒体报道'),
      source,
      sourceUrl: safeSourceUrl,
      secondaryUrls: Array.isArray(article?.secondaryUrls)
        ? article.secondaryUrls.filter((s) => Boolean(safeExternalUrl(s?.url)))
        : [],
      publishedAt,
      dateEn: formatNewsDate(publishedAt, 'en', article?.dateEn),
      dateVi: formatNewsDate(publishedAt, 'vi', article?.dateVi),
      dateKo: formatNewsDate(publishedAt, 'ko', article?.dateKo),
      dateZh: formatNewsDate(publishedAt, 'zh-CN', article?.dateZh),
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
      },
      ko: {
        title: titleKo,
        sourceBadge: `${source} • 뉴스`,
        summary: summaryKo,
        readMore: safeSourceUrl ? '원문 기사 보기' : '상세 보기'
      },
      zh: {
        title: titleZh,
        sourceBadge: `${source} • 媒体报道`,
        summary: summaryZh,
        readMore: safeSourceUrl ? '阅读原文' : '查看详情'
      }
    };
  } catch (err) {
    console.error('[VINAXO toNewsItem] Error transforming article to NewsItem, using fallback:', err);
    return fallbackNewsData[0];
  }
}

export function getNewsLocalized(item: NewsItem, lang: 'vi' | 'en' | 'ko' | 'zh-CN') {
  if (lang === 'vi') {
    return {
      ...item.vi,
      badgeText: item.badgeTextVi,
      date: item.dateVi
    };
  }
  if (lang === 'ko') {
    return {
      ...(item.ko || item.en),
      badgeText: item.badgeTextKo || item.badgeTextEn,
      date: item.dateKo || formatNewsDate(item.publishedAt, 'ko')
    };
  }
  if (lang === 'zh-CN') {
    return {
      ...(item.zh || item.en),
      badgeText: item.badgeTextZh || item.badgeTextEn,
      date: item.dateZh || formatNewsDate(item.publishedAt, 'zh-CN')
    };
  }
  return {
    ...item.en,
    badgeText: item.badgeTextEn,
    date: item.dateEn
  };
}

export function getArticleLocalized(article: ArticleContent, lang: 'vi' | 'en' | 'ko' | 'zh-CN') {
  if (lang === 'vi') {
    return {
      title: article.title_vi,
      excerpt: article.excerpt_vi || article.body_vi,
      body: article.body_vi || article.excerpt_vi,
      coverAlt: article.cover_image_alt_vi || article.title_vi,
      badgeText: article.badgeTextVi,
      date: formatNewsDate(article.published_at, 'vi', article.dateVi),
      seoTitle: article.seo_title_vi || article.title_vi,
      seoDescription: article.seo_description_vi || article.excerpt_vi
    };
  }
  if (lang === 'ko') {
    return {
      title: article.title_ko || article.title_en,
      excerpt: article.excerpt_ko || article.excerpt_en || article.body_ko || article.body_en,
      body: article.body_ko || article.body_en || article.excerpt_ko || article.excerpt_en,
      coverAlt: article.cover_image_alt_ko || article.title_ko || article.title_en,
      badgeText: article.badgeTextKo || article.badgeTextEn,
      date: formatNewsDate(article.published_at, 'ko', article.dateKo),
      seoTitle: article.seo_title_ko || article.title_ko || article.title_en,
      seoDescription: article.seo_description_ko || article.excerpt_ko || article.excerpt_en
    };
  }
  if (lang === 'zh-CN') {
    return {
      title: article.title_zh || article.title_en,
      excerpt: article.excerpt_zh || article.excerpt_en || article.body_zh || article.body_en,
      body: article.body_zh || article.body_en || article.excerpt_zh || article.excerpt_en,
      coverAlt: article.cover_image_alt_zh || article.title_zh || article.title_en,
      badgeText: article.badgeTextZh || article.badgeTextEn,
      date: formatNewsDate(article.published_at, 'zh-CN', article.dateZh),
      seoTitle: article.seo_title_zh || article.title_zh || article.title_en,
      seoDescription: article.seo_description_zh || article.excerpt_zh || article.excerpt_en
    };
  }
  return {
    title: article.title_en || article.title_vi,
    excerpt: article.excerpt_en || article.body_en || article.excerpt_vi,
    body: article.body_en || article.excerpt_en || article.body_vi,
    coverAlt: article.cover_image_alt_en || article.title_en,
    badgeText: article.badgeTextEn,
    date: formatNewsDate(article.published_at, 'en', article.dateEn),
    seoTitle: article.seo_title_en || article.title_en,
    seoDescription: article.seo_description_en || article.excerpt_en
  };
}

export function getPersonQuotedTitle(
  personQuoted: { titleVi?: string; titleEn?: string; titleKo?: string; titleZh?: string } | undefined,
  lang: 'vi' | 'en' | 'ko' | 'zh-CN'
): string {
  if (!personQuoted) return '';
  if (lang === 'vi') return personQuoted.titleVi || personQuoted.titleEn || '';
  if (lang === 'ko') return personQuoted.titleKo || personQuoted.titleEn || personQuoted.titleVi || '';
  if (lang === 'zh-CN') return personQuoted.titleZh || personQuoted.titleEn || personQuoted.titleVi || '';
  return personQuoted.titleEn || personQuoted.titleVi || '';
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
