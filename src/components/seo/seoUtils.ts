import { SITE_CONFIG, normalizeSiteUrl } from '../../config/siteConfig';

export function setMetaName(name: string, content: string): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll<HTMLMetaElement>(`meta[name="${name}"]`);
  let tag = existing[0];
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
  for (let i = 1; i < existing.length; i++) {
    existing[i].remove();
  }
}

export function setMetaProperty(property: string, content: string): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll<HTMLMetaElement>(`meta[property="${property}"]`);
  let tag = existing[0];
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
  for (let i = 1; i < existing.length; i++) {
    existing[i].remove();
  }
}

/**
 * Ensures strictly ONE <link rel="canonical"> exists when canonicalUrl is provided,
 * and removes all canonical links when canonicalUrl is null (e.g. 404 or noindex routes).
 */
export function setCanonicalLink(canonicalUrl: string | null): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalUrl) {
    existing.forEach((el) => el.remove());
    return;
  }
  let link = existing[0];
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', canonicalUrl);
  for (let i = 1; i < existing.length; i++) {
    existing[i].remove();
  }
}

const JSON_LD_SCRIPT_ID = 'vinaxo-seo-jsonld';

/**
 * Maintains a single authoritative JSON-LD <script> element in <head>,
 * preventing duplicate schemas across SPA route transitions.
 */
export function setJsonLd(payload: Record<string, unknown> | Array<Record<string, unknown>> | null): void {
  if (typeof document === 'undefined') return;
  const allScripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
  let target = document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;

  for (const script of allScripts) {
    if (script.id !== JSON_LD_SCRIPT_ID) {
      script.remove();
    }
  }

  if (!payload) {
    target?.remove();
    return;
  }

  if (!target) {
    target = document.createElement('script');
    target.type = 'application/ld+json';
    target.id = JSON_LD_SCRIPT_ID;
    document.head.appendChild(target);
  }

  target.textContent = JSON.stringify(payload);
}

/**
 * Resolves any relative or legacy-domain image path into an absolute public HTTPS URL
 * on SITE_CONFIG.siteUrl for Open Graph & Twitter crawlers.
 */
export function toAbsoluteOgImage(imagePath?: string | null): string {
  if (!imagePath || typeof imagePath !== 'string') {
    return SITE_CONFIG.defaultOgImage;
  }
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return SITE_CONFIG.defaultOgImage;
  }
  return normalizeSiteUrl(trimmed);
}
