# BÁO CÁO SEO ĐA NGÔN NGỮ (VI / EN / KO / ZH-CN) — VINAXO

- **Domain chính thức**: `https://www.vinaxo.net` (`SITE_CONFIG` tập trung tại `src/config/siteConfig.ts`)
- **Hệ thống ngôn ngữ**: `LanguageContext` hỗ trợ 4 ngôn ngữ `vi`, `en`, `ko`, `zh-CN` (lưu `localStorage('vinaxo_lang')`, hỗ trợ `?lang=vi|en|ko|zh-CN`)
- **Kiến trúc URL**: Phương án A — dùng chung canonical URL cho các ngôn ngữ, đồng bộ động toàn bộ metadata DOM qua `SEOManager.tsx` & `src/components/seo/routeMetadata.ts`.

---

## 1. Đồng bộ Metadata & Structured Data cho 4 Ngôn ngữ

Khi chuyển đổi giữa **`VI`**, **`EN`**, **`KO`** và **`ZH-CN`** (trên Desktop Header hoặc Mobile Menu) hoặc điều hướng SPA, `SEOManager` cùng `resolveRouteSeo(pathname, language)` cập nhật đồng thời:

| Thành phần DOM / SEO | `vi` | `en` | `ko` | `zh-CN` |
|---|---|---|---|---|
| `<html lang>` | `vi` | `en` | `ko` | `zh-CN` |
| `<title>` & `meta[name="title"]` | Tiếng Việt theo từng route | Tiếng Anh theo từng route | Tiếng Hàn theo từng route | Tiếng Trung giản thể theo từng route |
| `meta[name="description"]` | Tiếng Việt theo từng route | Tiếng Anh theo từng route | Tiếng Hàn theo từng route | Tiếng Trung giản thể theo từng route |
| `meta[property="og:locale"]` | `vi_VN` | `en_US` | `ko_KR` | `zh_CN` |
| `link[rel="canonical"]` | `https://www.vinaxo.net<route>` | `https://www.vinaxo.net<route>` | `https://www.vinaxo.net<route>` | `https://www.vinaxo.net<route>` |
| JSON-LD `inLanguage` & Tên công ty | `vi`, `CÔNG TY TNHH VINAXO` | `en`, `VINAXO COMPANY LIMITED` | `ko`, `VINAXO COMPANY LIMITED` | `zh-CN`, `VINAXO COMPANY LIMITED` |
| `Organization.availableLanguage` | `['Vietnamese', 'English', 'Korean', 'Chinese']` | `['Vietnamese', 'English', 'Korean', 'Chinese']` | `['Vietnamese', 'English', 'Korean', 'Chinese']` | `['Vietnamese', 'English', 'Korean', 'Chinese']` |
| Tuyến nội bộ `/admin/*` & 404 | `robots: noindex, nofollow`, không xuất canonical | `robots: noindex, nofollow`, không xuất canonical | `robots: noindex, nofollow`, không xuất canonical | `robots: noindex, nofollow`, không xuất canonical |

### Chi tiết xử lý CMS Articles & Products
- Với trang chi tiết bài viết (`/tin-tuc/<slug>`), `resolveRouteSeo` ưu tiên `seo_title_{vi|en|ko|zh}` và `seo_description_{vi|en|ko|zh}`, tự fallback về `excerpt_{vi|en|ko|zh}` rồi `body_{vi|en|ko|zh}` theo đúng ngôn ngữ đang chọn.
- Với trang sản phẩm (`/products` và `/products/<slug>`), JSON-LD `Product` dùng `name`, `description` theo đúng ngôn ngữ đang chọn và thương hiệu chuẩn hóa `VINAXO COMPANY LIMITED` (quốc tế) / `CÔNG TY TNHH VINAXO` (tiếng Việt) — hoàn toàn không còn chuỗi lặp `Vinaxo Co., Ltd.`.

---

## 2. Tuân thủ `hreflang`, Canonical & Static SEO Artifacts

- **Không phát sinh `hreflang` giả**: Do website giữ kiến trúc Phương án A (không tách thư mục `/en/`, `/ko/`, `/zh-cn/`), hệ thống **không** chèn thẻ `<link rel="alternate" hreflang="...">` trỏ về URL không tồn tại, tránh gây lỗi canonical/alternate trên Google Search Console.
- **Static SEO Artifacts (`scripts/generate-seo-artifacts.mjs`)**:
  - Build gần nhất sinh ra **9 trang lõi, 12 trang sản phẩm, 9 bài viết tin tức, `404.html`, và `sitemap.xml` gồm 29 URL** đều trỏ `https://www.vinaxo.net/...`, không chứa `vinaxo.vn`.
  - Kiểm tra trực tiếp trên production (`https://www.vinaxo.net/sitemap.xml` và `https://www.vinaxo.net/robots.txt`) đều trả HTTP `200`, `sitemap.xml` có 29 `<loc>` và `has vinaxo.vn: false`, `robots.txt` trỏ đúng `Sitemap: https://www.vinaxo.net/sitemap.xml`.
- **Khuyến nghị nâng cấp SEO quốc tế giai đoạn tiếp theo (nếu doanh nghiệp mở rộng SEO organic riêng cho từng thị trường)**: Khi muốn Google index độc lập các URL tiếng Anh, tiếng Hàn và tiếng Trung (`/...`, `/en/...`, `/ko/...`, `/zh-cn/...`), cần triển khai định tuyến theo prefix ngôn ngữ + `hreflang` tương ứng (Phương án B) và giữ 301/canonical rõ ràng để tránh mất thứ hạng URL đã index.
