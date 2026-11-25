export interface PersonQuoted {
  name: string;
  titleVi: string;
  titleEn: string;
}

export interface SecondaryUrl {
  name: string;
  url: string;
}

export interface ArticleContent {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  body_vi: string;
  body_en: string;
  cover_image: string;
  cover_image_alt_vi?: string;
  cover_image_alt_en?: string;
  gallery?: string[];
  category: 'press' | 'company';
  badgeType: 'quote' | 'interview' | 'operation' | 'event';
  badgeTextVi: string;
  badgeTextEn: string;
  source: string;
  sourceUrl?: string;
  secondaryUrls?: SecondaryUrl[];
  author: string;
  personQuoted?: PersonQuoted;
  published_at: string; // YYYY-MM-DD
  updated_at?: string;
  dateVi?: string;
  dateEn?: string;
  featured: boolean;
  tags?: string[];
  status?: 'published' | 'draft';
  published?: boolean;
  verified?: boolean;
  seo_title_vi?: string;
  seo_title_en?: string;
  seo_description_vi?: string;
  seo_description_en?: string;
}
