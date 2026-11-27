# VINAXO GLOBAL UI/UX REFINEMENT & CORPORATE EMAIL ARCHITECTURE – PRE-HANDOVER REPORT

- **Website Production:** `https://www.vinaxo.net`
- **Admin Portal:** `https://www.vinaxo.net/admin`
- **Repositories:** `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO` (`origin`) & `lap2004/VINAOX` (`personal`)
- **Feature Branch:** `fix/global-ui-refinement` (`ca4fa0e`) -> merged `--no-ff` to `main` (`c02d985`)
- **Live Bundle Verified:** `assets/index-Jv9JWn1o.js` (`HAS_4LANG_JSONLD=True`, `API_COUNT=12`)
- **Languages Supported:** `vi`, `en`, `ko`, `zh-CN` (`615/615` keys verified)

---

## 1. Executive Summary & Scope

This wave upgraded VINAXO's global visual architecture, typography hierarchy, navigation compactness, above-the-fold product discovery, copy naturalness, and corporate email management toward a **Modern Corporate Food Manufacturer** standard without breaking brand identity (Warm Cream `#FFF7EC`, Primary Brown `#3A251B`/`#3A2417`, Mango Gold `#F4A83A`) or `/admin/*` CMS functionality.

### Key Outcomes
1. **P2-01 (Typography Modernization):** Replaced heavy uppercase `Oswald` on hero, section headings, subpage banners, cards, buttons, and footer headings with clean `Be Vietnam Pro` / `Inter` (`var(--font-sans)`), natural casing (`text-transform: none`), and restrained weights (`600–700`; zero `800`/`900` weights in public page CSS/JSX). Preserved `Oswald` strictly on `.brand-name` logotype and enforced `text-transform: none; letter-spacing: 0.01em` across `ko` & `zh-CN` selectors.
2. **P2-02 (Compact Header, Subpage Banners & Above-the-Fold):** Reduced desktop/laptop header height from `82px` to `68px` (mobile `68px` -> `60px`), removed a legacy mobile `!important` rule (`padding: 96px 0 44px 0 !important`), compressed subpage `.page-banner` height by `50–54%` (`451px` -> `226px` on `/products`; `395px`/`351px` -> `180px` on Chrome / `179px` on Edge across `/about`, `/quality`, `/markets`, `/news`, `/brochure`, `/contact`), and eliminated the duplicate intro header above category filter pills on `/products`.
3. **P2-03 (Cleaner Copy & Reduced Marketing Noise):** Removed heavy pill `<PageHero badge>` overlays across subpages, replaced `"Nguồn xác thực"` with `"Nguồn bài viết"` (`Article Source`), shortened `ProductCard` CTA labels (`Nhận báo giá` / `Xem thông số`), stripped legacy `"Export Standard"` / `"Premium Grade"` fallback strings from `BASE_PRODUCTS_DATA`, and streamlined `content/settings/homepage.json` + `src/data/homepageContent.ts` copy across 4 languages.
4. **P2-04 (Corporate Email Single Source of Truth & Security):** Eliminated duplicated hardcoded Gmail/phone literals in `src/i18n/{vi,en,ko,zhCN}.ts`, `MainLayout.tsx`, and `Contact.tsx`; wired `Footer`, `/contact`, `mailto:`, `MainLayout` floating bar, and `scripts/generate-seo-artifacts.mjs` (`dist/index.html` Organization JSON-LD) directly to `content/settings/company.json`. Hardened `src/shared/schemas/settingsSchema.ts` (regex email validation, `sales_email`, forbidden secret-key blocking) and expanded `/admin/settings` (`AdminSettings.tsx`) with `sales_email`, 4-lang Footer `intro_*` fields, and an explicit separation notice for **Public Website Email** vs **Vercel Env Delivery (`CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`)**.
5. **Honest Governance on Official Domain Email (`UI-22` = `BLOCKED`):** Per strict rule against fabricating unverified mailboxes onto production, `cuonghoang0710@gmail.com` was retained in `content/settings/company.json` pending owner confirmation of the exact `@vinaxo.net` public mailbox and Vercel mail relay credentials (`RESEND_API_KEY` / `BREVO_API_KEY`).

---

## 2. Live Production BEFORE vs AFTER Quantitative Comparison

All measurements below were collected directly on live `https://www.vinaxo.net` (Chrome & Edge headless Selenium):

| Metric | BEFORE (Live Chrome) | AFTER (Live Chrome) | AFTER (Live Edge) | Delta / Notes |
| --- | --- | --- | --- | --- |
| Header Height (1440px / 1366px) | `82px` | `68px` | `68px` | `-14px (-17%)`, single-line nav |
| Header Height (Mobile 390px) | `68px` | `60px` | `60px` | `-8px (-12%)` |
| `/products` `.page-banner` Height | `451px` | `226px` | `226px` | `-225px (-50%)` |
| `/about`, `/quality`, `/markets`, `/news`, `/brochure` Banner | `395px` | `180px` | `179px` | `-215px (-54%)` |
| `/contact` `.page-banner` Height | `351px` | `180px` | `179px` | `-171px (-49%)` |
| Mobile `/products` Banner Height (390px) | `435px` | `207px` | `207px` | `-228px (-52%)` |
| `/products` Category Pills Top (1440px, `vh=748/760`) | `940px` (below fold) | `325px` | `325px` | `-615px` (now above fold) |
| `/products` First Card Top (1440px, `vh=748/760`) | `1027px` (below fold) | `413px` | `412px` | `-614px` (now above fold) |
| `/products` Category Pills Top (1366px, `vh=616/628`) | `921px` (below fold) | `320px` | `319px` | `-601px` (now above fold) |
| `/products` First Card Top (1366px, `vh=616/628`) | `1008px` (below fold) | `407px` | `407px` | `-601px` (now above fold) |
| Mobile `/products` Pills Top (390px) | `914px` (below fold) | `287px` | `287px` | `-627px` (visible on load) |
| Home `<h1>` Font / Size / Weight / Case | `Oswald / 53.6px / 800 / uppercase` | `Be Vietnam Pro / 46.926px / 700 / none` | `Be Vietnam Pro / 46.662px / 700 / none` | Clean modern corporate sans |
| Section Heading Font / Size / Weight / Case | `Oswald / 48px / 700 / uppercase` | `Be Vietnam Pro / 31.284px / 600 / none` | `Be Vietnam Pro / 31.108px / 600 / none` | Restrained readable hierarchy |
| Subpage `.page-banner-title` Font / Size / Case | `Oswald / 49.6px / 700 / uppercase` | `Be Vietnam Pro / 34.839px / 700 / none` | `Be Vietnam Pro / 34.643px / 700 / none` | Consistent across 7 subpages |
| Footer Legal Entity Duplication (EN) | Eliminated (`false`) | Eliminated (`false`) | Eliminated (`false`) | Verified in live DOM |
| Severe Browser Console Errors | `0` | `0` | `0` | Clean across all routes |

---

## 3. Automated Build, API & Test Results

| Verification Check | Scope & Target | Result |
| --- | --- | --- |
| `npm run build` (`check-i18n-completeness`, `tsc -b`, `tsc -p tsconfig.server.json`, `build-api`, `vite build`, `generate-seo-artifacts`) | Local production bundle `assets/index-Jv9JWn1o.js`, 9 core routes, 12 products, 9 news, `404.html`, `sitemap.xml` (29 URLs) | **PASS** (`615/615` i18n keys × 4 langs) |
| Vercel Hobby Serverless Function Cap | `(Get-ChildItem api -Recurse -File).Count` | **PASS** (`API_COUNT=12`) |
| `node scripts/test-seo-and-inquiry.mjs` | Inquiry API validation, honeypot, Resend/Brevo, SEO canonicals, Market/Product/Homepage contracts | **PASS** (`12/12`) |
| `npx tsx scripts/test-admin-suite.mjs` | Auth, CSRF, XSS/traversal, GitHub config, Media/News/Product/About/Homepage/Company Settings validation (Cases 1–23) | **PASS** (`23/23`) |
| `python scripts/qa-global-ui-refinement.py --url https://www.vinaxo.net --browser both --save-screenshots` | Header, 7 subpage banners, Typography, `/products` 1440/1366/390 above-the-fold, Footer/Contact email sync, 4 langs + CJK case, 39 responsive sweeps, `/admin/login` | **PASS** (Chrome + Edge, 0 console errors) |
| `python scripts/qa-homepage-prehandover.py --base-url https://www.vinaxo.net --browsers chrome,edge` | 9 homepage sections, 4 categories, 4 OEM lines, `granola`/`balls` routing, 23 images | **PASS** (`7/7` Chrome & `7/7` Edge) |
| `python scripts/qa-products-prehandover.py --base-url https://www.vinaxo.net --browsers chrome,edge` | 12 product modals, category filters, certification separation, quotation binding, 4 langs | **PASS** (`9/9` Chrome & `9/9` Edge) |
| `python scripts/qa-about-prehandover.py --base-url https://www.vinaxo.net --browsers chrome,edge` | 4-lang content, gallery filter, lightbox sync, 0 broken images, responsive | **PASS** (`9/9` Chrome & `9/9` Edge) |
| `python scripts/qa-contact-maps.py --base-url https://www.vinaxo.net --browsers chrome,edge` | B2B contact form, Maps pin & directions parity, links & URLs | **PASS** (`8/8` Chrome & `8/8` Edge) |
| `python scripts/qa-market-terminology.py --base-url https://www.vinaxo.net --browsers chrome,edge` | Incoterms (`FOB`/`CIF`) vs Shipping (`FCL`/`LCL`), clean B2B copy | **PASS** (`7/7` Chrome & `7/7` Edge) |

---

## 4. Verification Matrix (`UI-01` – `UI-41`)

| ID | Verification Criteria | Status | Observed Evidence |
| --- | --- | --- | --- |
| `UI-01` | Global typography shifted off heavy uppercase `Oswald` onto readable sans (`Be Vietnam Pro` / `Inter`) | **PASS** | `Home H1`, `.section-title`, `.page-banner-title` compute `"Be Vietnam Pro", Inter, ...` with `text-transform: none` in Chrome & Edge. |
| `UI-02` | Public page CSS & JSX contain zero `800`/`900` weights; heading weights restrained (`600–700`) | **PASS** | Verified via `Select-String` and live computed styles (`homeH1: 700`, `sectionTitle: 600`, `.page-banner-title: 700`). |
| `UI-03` | Brand logo wordmark `.brand-name` retains intentional display identity (`Oswald`) | **PASS** | Live DOM audit confirms `brandFont: Oswald, "Be Vietnam Pro", ...`. |
| `UI-04` | CJK (`ko`, `zh-CN`) titles/labels/buttons enforce `text-transform: none; letter-spacing: 0.01em` | **PASS** | `variables.css` reset + live `/products` `ko` & `zh-CN` checks (`titleTransform: "none"`, `btnUpper: false`). |
| `UI-05` | Header height compacted cleanly (`<=72px` laptop, `<=76px` desktop, `<=64px` mobile) | **PASS** | Live Chrome/Edge: `68px` @ `1440px` & `1366px`, `60px` @ `390px`. |
| `UI-06` | Desktop navigation links single-line without wrapping or right-edge CTA clipping | **PASS** | `wrappedLinks: 0`, `clippedLinks: 0`, `quoteRightOk: true` in Chrome & Edge. |
| `UI-07` | Subpage `.page-banner` compacted (`~150–230px` desktop) across all 7 subpages | **PASS** | Live `/products`: `226px`; `/about`, `/quality`, `/markets`, `/news`, `/brochure`, `/contact`: `180px` Chrome / `179px` Edge. |
| `UI-08` | Mobile `.page-banner` legacy `96px` top padding override removed | **PASS** | `responsive.css` fixed (`padding: 14px 0 18px 0 !important`); mobile `/products` banner `435px` -> `207px`. |
| `UI-09` | `/products` removes duplicate intro section and shortens banner description while keeping all 4 categories | **PASS** | Live `qa-products-prehandover.py` `9/9 PASS` across 4 languages + `bannerHeight: 226px`. |
| `UI-10` | `/products` category pills & first row of Product Cards visible above the fold at `1440×900` | **PASS** | `pillsTop: 325px`, `firstCardTop: 413px` within `viewportH: 748px` (`after-products-1440.png`). |
| `UI-11` | `/products` category pills & first row of Product Cards visible above the fold at laptop `1366×768` | **PASS** | `pillsTop: 320px`, `firstCardTop: 407px` within `viewportH: 616px` (`after-products-laptop-1366.png`). |
| `UI-12` | Mobile `/products` category pills visible immediately below banner without deep scroll | **PASS** | `pillsTop: 287px` @ `390×844` (`after-mobile-390.png`). |
| `UI-13` | Subpages (`/about`, `/quality`, `/markets`, `/news`, `/brochure`) drop redundant `<PageHero badge>` pills | **PASS** | Live DOM audit reports `heroBadgesCount: 0` across all 7 subpages. |
| `UI-14` | `ArticleDetail` uses editorial `"Nguồn bài viết"` / `"Article Source"` / `"기사 출처"` / `"文章来源"` | **PASS** | Updated in `src/pages/ArticleDetail.tsx` and verified in build. |
| `UI-15` | `ProductCard` uses non-uppercase origin label, sans `600` name, and concise CTA buttons | **PASS** | Updated in `src/components/products/ProductCard.tsx`, visually verified in 4 langs. |
| `UI-16` | Legacy `"Export Standard"` / `"Premium Grade"` fallback strings removed from `src/data/products.ts` | **PASS** | Cleaned in `BASE_PRODUCTS_DATA`; `qa-products` certification separation `PASS`. |
| `UI-17` | `homepage.json` & `FALLBACK_HOMEPAGE_CONTENT` copy streamlined without breaking homepage schema | **PASS** | `qa-homepage` `7/7 PASS`; live homepage `scrollHeight: 6911px` (Chrome) / `6845px` (Edge). |
| `UI-18` | Footer English legal name non-duplicated and balanced (`CÔNG TY TNHH VINAXO` / `VINAXO COMPANY LIMITED`) | **PASS** | `hasDupLegal: false`; visually verified in `after-footer-1440.png`. |
| `UI-19` | Single Source of Truth for email/hotline/WhatsApp/Zalo across `Footer`, `Contact`, `MainLayout`, & `generate-seo-artifacts` | **PASS** | `MainLayout.tsx`, `Contact.tsx`, `Footer.tsx`, `i18n`, & `dist/index.html` JSON-LD all synced to `company.json`. |
| `UI-20` | Footer & `/contact` `mailto:` hrefs match displayed address identically | **PASS** | `cuonghoang0710@gmail.com` identical across Footer, `/contact`, and `vinaxo-seo-jsonld`. |
| `UI-21` | `src/i18n/{vi,en,ko,zhCN}.ts` remove hardcoded email/phone literals while maintaining `615/615` keys | **PASS** | `check-i18n-completeness.mjs` passed `615/615` on all 4 locales. |
| `UI-22` | Production public email switched to confirmed official `@vinaxo.net` domain mailbox | **BLOCKED** | No verified `@vinaxo.net` mailbox exists in workspace or owner confirmation; `cuonghoang0710@gmail.com` retained to prevent broken live contact links. |
| `UI-23` | `validateCompanySettings` validates email & `sales_email` regex and blocks secret keys (`smtp_pass`, etc.) | **PASS** | Covered by Case 23 in `scripts/test-admin-suite.mjs` (`23/23 PASS`). |
| `UI-24` | `/admin/settings` exposes `sales_email`, 4-lang Footer `intro_*`, and public-vs-env-var security guidance | **PASS** | Implemented in `src/admin/pages/AdminSettings.tsx` and compiled cleanly via `tsc -b`. |
| `UI-25` | `dist/index.html` static JSON-LD syncs `company.json` contact fields dynamically at build time | **PASS** | `syncBaseHtmlCompanyJsonLd` verified in `dist/index.html` & live SSR HTML (`HAS_4LANG_JSONLD=True`). |
| `UI-26` | 4-language (`VI`, `EN`, `KO`, `ZH-CN`) UI switching works cleanly without horizontal overflow | **PASS** | Verified on live Chrome & Edge across `/` and `/products`, visually inspected in EN/KO/ZH screenshots. |
| `UI-27` | Desktop & laptop responsive sweep zero overflow (`1280×720`, `1366×768`, `1440×900`, `1536×864`, `1920×1080`, `2560×1440`) | **PASS** | Zero horizontal overflow across 39 route×viewport combinations in Chrome & Edge. |
| `UI-28` | Windows DPI scaling simulated viewports (`1024×576` @ 150%, `960×540` @ 200%) zero overflow | **PASS** | Included in `RESPONSIVE_VIEWPORTS` and verified `0` overflows on Chrome & Edge. |
| `UI-29` | Mobile responsive sweep (`320×568`, `375×812`, `390×844`, `768×1024`, `1024×768`) zero overflow | **PASS** | Zero document horizontal overflow across all mobile/tablet breakpoints. |
| `UI-30` | `/admin/login` & `/admin/*` UI styling unaffected by public CSS refinements | **PASS** | Live `/admin/login` smoke check `adminLoginOk: true`; Admin suite `23/23 PASS`. |
| `UI-31` | Chrome headless live E2E verification on `https://www.vinaxo.net` | **PASS** | `qa-global-ui-refinement` + all 5 regression suites `PASS`. |
| `UI-32` | Edge headless live E2E verification on `https://www.vinaxo.net` | **PASS** | `qa-global-ui-refinement` + all 5 regression suites `PASS`. |
| `UI-33` | Console severe error audit across all tested routes on live Chrome & Edge | **PASS** | `consoleSevereErrors: 0` on both browsers. |
| `UI-34` | Regression — Homepage (`qa-homepage-prehandover.py`) | **PASS** | `7/7` Chrome & `7/7` Edge on `https://www.vinaxo.net`. |
| `UI-35` | Regression — Products (`qa-products-prehandover.py`) | **PASS** | `9/9` Chrome & `9/9` Edge on `https://www.vinaxo.net`. |
| `UI-36` | Regression — About & Factory Gallery (`qa-about-prehandover.py`) | **PASS** | `9/9` Chrome & `9/9` Edge on `https://www.vinaxo.net`. |
| `UI-37` | Regression — Contact, B2B Inquiry & Maps (`qa-contact-maps.py`) | **PASS** | `8/8` Chrome & `8/8` Edge on `https://www.vinaxo.net`. |
| `UI-38` | Regression — Market Logistics Terminology (`qa-market-terminology.py`) | **PASS** | `7/7` Chrome & `7/7` Edge on `https://www.vinaxo.net`. |
| `UI-39` | Vercel Hobby serverless function limit compliance (`<= 12` files under `api/`) | **PASS** | Verified `API_COUNT=12` cleanly via PowerShell check. |
| `UI-40` | Visual screenshot audit (5 BEFORE + 9 AFTER screenshots inspected directly) | **PASS** | All 9 live AFTER screenshots in `docs/screenshots/global-ui-refinement/` visually inspected with zero layout regressions. |
| `UI-41` | Cross-browser/device parity on Safari/macOS, Firefox, and real mobile hardware | **NOT RUN** | Headless Chrome & Edge on Windows executed; Safari/macOS, Firefox, and physical handheld devices not available in environment. |

---

## 5. Screenshot Artifacts (`docs/screenshots/global-ui-refinement/`)

- **BEFORE (5):** `before-header-1440.png`, `before-products-1440.png`, `before-products-laptop-1366.png`, `before-footer-1440.png`, `before-mobile-390.png`
- **AFTER (9):** `after-header-1440.png`, `after-products-1440.png`, `after-products-laptop-1366.png`, `after-footer-1440.png`, `after-mobile-390.png`, `after-about-banner-1440.png`, `after-products-en.png`, `after-products-ko.png`, `after-products-zh.png`
