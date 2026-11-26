export const SITE_CONFIG = {
  name: 'VINAXO',
  legalNameVi: 'CÔNG TY TNHH VINAXO',
  legalNameEn: 'VINAXO COMPANY LIMITED',
  siteUrl: 'https://www.vinaxo.net',
  apexUrl: 'https://vinaxo.net',
  defaultOgImage: 'https://www.vinaxo.net/assets/images/hero_fruits.jpg',
  brochureOgImage: 'https://www.vinaxo.net/assets/images/brochure-2026-cover.jpg',
  logoUrl: 'https://www.vinaxo.net/assets/logo/vinaxo-logo.svg',
  twitterCard: 'summary_large_image' as const,
};

/**
 * Normalizes legacy domain strings (e.g. vinaxo.vn or bare vinaxo.net) or relative
 * paths onto the canonical HTTPS primary host configured in SITE_CONFIG.siteUrl.
 */
export function normalizeSiteUrl(pathOrUrl?: string | null): string {
  const base = SITE_CONFIG.siteUrl.replace(/\/+$/, '');
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return `${base}/`;

  const trimmed = pathOrUrl.trim();
  if (!trimmed) return `${base}/`;

  if (trimmed.startsWith('/')) {
    return `${base}${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'vinaxo.vn' ||
      host === 'www.vinaxo.vn' ||
      host === 'vinaxo.net' ||
      host === 'www.vinaxo.net'
    ) {
      return `${base}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return trimmed;
  } catch {
    return `${base}/${trimmed.replace(/^\/+/, '')}`;
  }
}

/**
 * Produces a clean, query-free, hash-free, trailing-slash-normalized canonical URL.
 */
export function normalizeCanonicalUrl(pathname: string): string {
  const base = SITE_CONFIG.siteUrl.replace(/\/+$/, '');
  const rawPath = (pathname || '/').split('?')[0].split('#')[0];
  const cleanPath = rawPath === '/' ? '/' : `/${rawPath.replace(/^\/+|\/+$/g, '')}`;
  return `${base}${cleanPath}`;
}
