import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { resolveRouteSeo } from './routeMetadata';
import {
  setCanonicalLink,
  setJsonLd,
  setMetaName,
  setMetaProperty,
} from './seoUtils';

/**
 * Centralized SPA SEO & Multilingual Metadata Controller.
 * Synchronizes <title>, <html lang>, canonical, robots, Open Graph, Twitter Cards,
 * and JSON-LD immediately on every route change, slug transition, Back/Forward,
 * and VI/EN language switch without leaving stale metadata from previous views.
 */
export const SEOManager: React.FC = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const applyVersionRef = useRef(0);

  useLayoutEffect(() => {
    const version = ++applyVersionRef.current;
    const seo = resolveRouteSeo(pathname, language);

    // Guard against stale async ticks overwriting newer route transitions
    if (version !== applyVersionRef.current) return;

    document.documentElement.lang = language;
    document.title = seo.title;

    setMetaName('title', seo.title);
    setMetaName('description', seo.description);
    setMetaName('robots', seo.robots);

    setCanonicalLink(seo.canonical);

    setMetaProperty('og:type', seo.ogType);
    setMetaProperty('og:site_name', 'VINAXO');
    setMetaProperty('og:url', seo.ogUrl);
    setMetaProperty('og:title', seo.ogTitle);
    setMetaProperty('og:description', seo.ogDescription);
    setMetaProperty('og:image', seo.ogImage);
    setMetaProperty('og:locale', seo.ogLocale);
    setMetaProperty('og:locale:alternate', seo.ogLocaleAlternate);

    setMetaName('twitter:card', seo.twitterCard);
    setMetaName('twitter:url', seo.ogUrl);
    setMetaName('twitter:title', seo.ogTitle);
    setMetaName('twitter:description', seo.ogDescription);
    setMetaName('twitter:image', seo.ogImage);

    setJsonLd(seo.jsonLd);
  }, [pathname, language]);

  return null;
};

export default SEOManager;
