import { ArticleContent, PersonQuoted, SecondaryUrl } from '../../types/content.js';

export interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  data: T;
}

const ALLOWED_CATEGORIES = ['press', 'company'] as const;
const ALLOWED_BADGE_TYPES = ['quote', 'interview', 'operation', 'event'] as const;

/**
 * Sanitizes and validates a string slug (lowercase, alphanumeric and hyphens only).
 */
export function validateSlug(slug: unknown): { valid: boolean; slug: string } {
  if (typeof slug !== 'string') return { valid: false, slug: '' };
  const trimmed = slug.trim().toLowerCase();
  if (!trimmed || trimmed.length < 3 || trimmed.length > 120) {
    return { valid: false, slug: '' };
  }
  // Strictly allow lowercase letters, numbers, and single hyphens (no spaces, no symbols)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return { valid: false, slug: '' };
  }
  return { valid: true, slug: trimmed };
}

/**
 * Validates an ISO 8601 date string (YYYY-MM-DD).
 */
export function isValidDate(dateStr: unknown): boolean {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

/**
 * Validates a safe URL (http, https, or relative starting with /).
 */
export function isValidUrl(url: unknown, allowRelative = true): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  const trimmed = url.trim();
  if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return !trimmed.includes('..') && !/[<>"'\\|?*]/.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Validates an ArticleContent object against the VINAXO Data Contract.
 */
export function validateNewsArticle(input: unknown): ValidationResult<ArticleContent> {
  const errors: string[] = [];
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, any>;

  // 1. Slug & ID
  const slugCheck = validateSlug(raw.slug || raw.id);
  if (!slugCheck.valid) {
    errors.push('Slug bài viết không hợp lệ (yêu cầu từ 3-120 ký tự chữ thường, số và gạch nối).');
  }
  const slug = slugCheck.slug || 'bai-viet-moi';
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : slug;

  // 2. Titles (Tiếng Việt là bắt buộc)
  const title_vi = typeof raw.title_vi === 'string' ? raw.title_vi.trim() : '';
  if (!title_vi) {
    errors.push('Tiêu đề tiếng Việt là trường bắt buộc.');
  } else if (title_vi.length > 300) {
    errors.push('Tiêu đề tiếng Việt không được vượt quá 300 ký tự.');
  }

  const title_en = typeof raw.title_en === 'string' ? raw.title_en.trim() : title_vi;
  const title_ko = typeof raw.title_ko === 'string' ? raw.title_ko.trim() : '';
  const title_zh = typeof raw.title_zh === 'string' ? raw.title_zh.trim() : '';

  // 3. Excerpts & Body Content
  const excerpt_vi = typeof raw.excerpt_vi === 'string' ? raw.excerpt_vi.trim() : '';
  const excerpt_en = typeof raw.excerpt_en === 'string' ? raw.excerpt_en.trim() : excerpt_vi;
  const excerpt_ko = typeof raw.excerpt_ko === 'string' ? raw.excerpt_ko.trim() : '';
  const excerpt_zh = typeof raw.excerpt_zh === 'string' ? raw.excerpt_zh.trim() : '';
  const body_vi = typeof raw.body_vi === 'string' ? raw.body_vi.trim() : excerpt_vi;
  const body_en = typeof raw.body_en === 'string' ? raw.body_en.trim() : body_vi;
  const body_ko = typeof raw.body_ko === 'string' ? raw.body_ko.trim() : '';
  const body_zh = typeof raw.body_zh === 'string' ? raw.body_zh.trim() : '';

  if (body_vi.length > 150000) {
    errors.push('Nội dung bài viết tiếng Việt vượt quá giới hạn 150.000 ký tự.');
  }

  // 4. Cover Image
  let cover_image = typeof raw.cover_image === 'string' ? raw.cover_image.trim() : '';
  if (!cover_image || !isValidUrl(cover_image, true)) {
    cover_image = '/assets/images/news/dried-fruit-export.webp';
  }

  // 5. Category & BadgeType
  const category = ALLOWED_CATEGORIES.includes(raw.category) ? raw.category : 'press';
  const badgeType = ALLOWED_BADGE_TYPES.includes(raw.badgeType) ? raw.badgeType : (category === 'company' ? 'operation' : 'quote');

  const badgeTextVi = typeof raw.badgeTextVi === 'string' && raw.badgeTextVi.trim()
    ? raw.badgeTextVi.trim()
    : (category === 'company' ? 'Hoạt động doanh nghiệp' : 'Báo chí đưa tin');
  const badgeTextEn = typeof raw.badgeTextEn === 'string' && raw.badgeTextEn.trim()
    ? raw.badgeTextEn.trim()
    : (category === 'company' ? 'Company Operations' : 'Press Coverage');
  const badgeTextKo = typeof raw.badgeTextKo === 'string' && raw.badgeTextKo.trim()
    ? raw.badgeTextKo.trim()
    : (category === 'company' ? '기업 활동' : '언론 보도');
  const badgeTextZh = typeof raw.badgeTextZh === 'string' && raw.badgeTextZh.trim()
    ? raw.badgeTextZh.trim()
    : (category === 'company' ? '企业动态' : '媒体报道');

  // 6. Source & SourceUrl
  const source = typeof raw.source === 'string' && raw.source.trim() ? raw.source.trim() : 'VINAXO';
  const sourceUrl = typeof raw.sourceUrl === 'string' && isValidUrl(raw.sourceUrl, false) ? raw.sourceUrl.trim() : undefined;

  // 7. Secondary URLs
  let secondaryUrls: SecondaryUrl[] | undefined = undefined;
  if (Array.isArray(raw.secondaryUrls)) {
    const validSecs = raw.secondaryUrls
      .filter((s: any) => s && typeof s.name === 'string' && isValidUrl(s.url, false))
      .map((s: any) => ({ name: String(s.name).trim(), url: String(s.url).trim() }));
    if (validSecs.length > 0) secondaryUrls = validSecs;
  }

  // 8. Author & PersonQuoted
  const author = typeof raw.author === 'string' && raw.author.trim() ? raw.author.trim() : 'Ban Biên Tập VINAXO';
  let personQuoted: PersonQuoted | undefined = undefined;
  if (raw.personQuoted && typeof raw.personQuoted === 'object') {
    const pq = raw.personQuoted;
    if (typeof pq.name === 'string' && pq.name.trim()) {
      personQuoted = {
        name: pq.name.trim(),
        titleVi: typeof pq.titleVi === 'string' ? pq.titleVi.trim() : 'Đại diện VINAXO',
        titleEn: typeof pq.titleEn === 'string' ? pq.titleEn.trim() : 'VINAXO Representative',
        ...(typeof pq.titleKo === 'string' && pq.titleKo.trim() ? { titleKo: pq.titleKo.trim() } : {}),
        ...(typeof pq.titleZh === 'string' && pq.titleZh.trim() ? { titleZh: pq.titleZh.trim() } : {}),
      };
    }
  }

  // 9. Published Date
  let published_at = typeof raw.published_at === 'string' ? raw.published_at.trim() : '';
  if (!isValidDate(published_at)) {
    published_at = new Date().toISOString().split('T')[0];
  }

  const updated_at = typeof raw.updated_at === 'string' && isValidDate(raw.updated_at)
    ? raw.updated_at.trim()
    : new Date().toISOString().split('T')[0];

  const [y, m, d] = published_at.split('-');
  const dateVi = typeof raw.dateVi === 'string' && raw.dateVi.trim() ? raw.dateVi.trim() : `${d}/${m}/${y}`;
  const dateEn = typeof raw.dateEn === 'string' && raw.dateEn.trim() ? raw.dateEn.trim() : `${new Date(published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const dateKo = typeof raw.dateKo === 'string' && raw.dateKo.trim() ? raw.dateKo.trim() : `${y}.${m}.${d}`;
  const dateZh = typeof raw.dateZh === 'string' && raw.dateZh.trim() ? raw.dateZh.trim() : `${y}年${Number(m)}月${Number(d)}日`;

  // 10. Tags & Draft Status
  const tags: string[] = Array.isArray(raw.tags)
    ? raw.tags.filter((t: any) => typeof t === 'string' && t.trim()).map((t: string) => t.trim())
    : [category];

  const isDraft = raw.status === 'draft' || raw.published === false || tags.includes('draft');
  const normalizedTags = isDraft
    ? Array.from(new Set([...tags, 'draft']))
    : tags.filter((t) => t !== 'draft');

  // 11. Clean Article Object
  const article: ArticleContent = {
    id,
    slug,
    title_vi,
    title_en,
    ...(title_ko ? { title_ko } : {}),
    ...(title_zh ? { title_zh } : {}),
    excerpt_vi,
    excerpt_en,
    ...(excerpt_ko ? { excerpt_ko } : {}),
    ...(excerpt_zh ? { excerpt_zh } : {}),
    body_vi,
    body_en,
    ...(body_ko ? { body_ko } : {}),
    ...(body_zh ? { body_zh } : {}),
    cover_image,
    cover_image_alt_vi: typeof raw.cover_image_alt_vi === 'string' ? raw.cover_image_alt_vi.trim() : title_vi,
    cover_image_alt_en: typeof raw.cover_image_alt_en === 'string' ? raw.cover_image_alt_en.trim() : title_en,
    ...(typeof raw.cover_image_alt_ko === 'string' && raw.cover_image_alt_ko.trim() ? { cover_image_alt_ko: raw.cover_image_alt_ko.trim() } : {}),
    ...(typeof raw.cover_image_alt_zh === 'string' && raw.cover_image_alt_zh.trim() ? { cover_image_alt_zh: raw.cover_image_alt_zh.trim() } : {}),
    gallery: Array.isArray(raw.gallery) ? raw.gallery.filter((g: any) => typeof g === 'string' && isValidUrl(g, true)) : [],
    category,
    badgeType,
    badgeTextVi,
    badgeTextEn,
    badgeTextKo,
    badgeTextZh,
    source,
    sourceUrl,
    secondaryUrls,
    author,
    personQuoted,
    published_at,
    updated_at,
    dateVi,
    dateEn,
    dateKo,
    dateZh,
    featured: Boolean(raw.featured),
    tags: normalizedTags,
    status: isDraft ? 'draft' : 'published',
    published: !isDraft,
    verified: raw.verified !== undefined ? Boolean(raw.verified) : true,
    seo_title_vi: typeof raw.seo_title_vi === 'string' ? raw.seo_title_vi.trim() : title_vi,
    seo_title_en: typeof raw.seo_title_en === 'string' ? raw.seo_title_en.trim() : title_en,
    ...(typeof raw.seo_title_ko === 'string' && raw.seo_title_ko.trim() ? { seo_title_ko: raw.seo_title_ko.trim() } : {}),
    ...(typeof raw.seo_title_zh === 'string' && raw.seo_title_zh.trim() ? { seo_title_zh: raw.seo_title_zh.trim() } : {}),
    seo_description_vi: typeof raw.seo_description_vi === 'string' ? raw.seo_description_vi.trim() : excerpt_vi,
    seo_description_en: typeof raw.seo_description_en === 'string' ? raw.seo_description_en.trim() : excerpt_en,
    ...(typeof raw.seo_description_ko === 'string' && raw.seo_description_ko.trim() ? { seo_description_ko: raw.seo_description_ko.trim() } : {}),
    ...(typeof raw.seo_description_zh === 'string' && raw.seo_description_zh.trim() ? { seo_description_zh: raw.seo_description_zh.trim() } : {}),
  };

  return {
    valid: errors.length === 0,
    errors,
    data: article
  };
}

/**
 * Deep merges an incoming partial update with an existing article.
 * Guaranteed to preserve existing fields not provided in incoming update.
 */
export function mergeNewsArticle(
  existing: ArticleContent | Record<string, any> | undefined | null,
  incoming: Partial<ArticleContent> | Record<string, any>
): ArticleContent {
  const base: Record<string, any> = existing && typeof existing === 'object' ? { ...(existing as any) } : {};
  const update: Record<string, any> = incoming && typeof incoming === 'object' ? { ...(incoming as any) } : {};

  // Preserve non-empty existing values if update provided empty string / undefined
  const merged: Record<string, any> = { ...base };

  for (const [key, value] of Object.entries(update)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'string' && value.trim() === '' && base[key]) {
        // If updating with blank string, only overwrite if it's an optional secondary field
        if (key === 'sourceUrl' || key === 'excerpt_en' || key === 'title_en') {
          merged[key] = value;
        }
      } else {
        merged[key] = value;
      }
    }
  }

  // Preserve nested personQuoted if not explicitly modified
  if (!update.personQuoted && base.personQuoted) {
    merged.personQuoted = base.personQuoted;
  }
  // Preserve secondaryUrls if not explicitly updated
  if (!update.secondaryUrls && base.secondaryUrls) {
    merged.secondaryUrls = base.secondaryUrls;
  }
  // Preserve gallery if not explicitly updated
  if (!update.gallery && base.gallery) {
    merged.gallery = base.gallery;
  }

  // Validate and normalize merged object
  const result = validateNewsArticle(merged);
  return result.data;
}
