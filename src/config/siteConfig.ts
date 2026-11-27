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

  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    // Guard against bare domain strings accidentally prefixed with '/'
    if (/^\/(www\.)?vinaxo\.(net|vn)(\/|$)/i.test(trimmed)) {
      const rest = trimmed.replace(/^\/(www\.)?vinaxo\.(net|vn)/i, '') || '/';
      return `${base}${rest.startsWith('/') ? rest : `/${rest}`}`;
    }
    return `${base}${trimmed}`;
  }

  const candidate = /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(trimmed)
    ? `https://${trimmed}`
    : trimmed;

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'vinaxo.vn' ||
      host === 'www.vinaxo.vn' ||
      host === 'vinaxo.net' ||
      host === 'www.vinaxo.net'
    ) {
      return `${base}${parsed.pathname || '/'}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return `${base}/`;
  }
}

/**
 * Normalizes public corporate/social website URLs without corrupting mailto:, tel:,
 * or relative app paths starting with '/'.
 */
export function normalizeExternalWebsiteUrl(url?: string | null, fallback = `${SITE_CONFIG.siteUrl}/`): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed === '/') return '/';
  return normalizeSiteUrl(trimmed);
}

export function getWebsiteDisplayLabel(url?: string | null): string {
  const normalized = normalizeExternalWebsiteUrl(url);
  try {
    return new URL(normalized).hostname || 'www.vinaxo.net';
  } catch {
    return 'www.vinaxo.net';
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
