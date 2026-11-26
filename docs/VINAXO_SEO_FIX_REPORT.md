# BÁO CÁO KHẮC PHỤC LỖI SEO P1 & TECHNICAL SEO — VINAXO

- **Phạm vi**: Khắc phục lỗi P1 Canonical sai domain, lỗi P1 Tiêu đề tab trình duyệt không reset khi chuyển route, và triển khai SEO kỹ thuật HTML tĩnh + true 404.
- **Branch sửa lỗi**: `feat/seo-multilingual-pre-handover-qa` (`9d08fb0`) -> Merge vào `main` (`2e22a64`, bản vá Vercel `ce441d7`)
- **Production URL**: [https://www.vinaxo.net](https://www.vinaxo.net)

---

## 1. Giải đáp Câu hỏi Kỹ thuật Bắt buộc

### 1.1. Tại sao canonical trước đây trỏ về `vinaxo.vn`?
1. File `index.html` gốc (dòng 24), `public/robots.txt`, `public/sitemap.xml`, và `public/.well-known/security.txt` được khởi tạo từ giai đoạn đầu với domain `https://vinaxo.vn/` được gán cứng (hardcode).
2. Website không có bất kỳ thành phần React SEO Manager nào cập nhật thẻ `<link rel="canonical">` khi điều hướng giữa các route, nên mọi trang SPA đều kế thừa nguyên thẻ `<link rel="canonical" href="https://vinaxo.vn/" />` từ `index.html`.

### 1.2. Đã chuẩn hóa domain như thế nào?
- Tạo cấu hình tập trung tại `src/config/siteConfig.ts`:
  - `SITE_CONFIG.siteUrl = 'https://www.vinaxo.net'` (khớp với domain HTTP `200` chính thức trên Vercel; apex `https://vinaxo.net/` hiện trả `308 -> https://www.vinaxo.net/`).
  - Cung cấp hai hàm chuẩn hóa dùng chung `normalizeSiteUrl()` và `normalizeCanonicalUrl(pathname)` tự động loại bỏ query string, hash, chuẩn hóa trailing slash (giữ `/` ở trang chủ, bỏ `/` cuối ở các trang con) và chuyển đổi mọi tham chiếu cũ `vinaxo.vn` / `vinaxo.net` sang `https://www.vinaxo.net`.
- Đồng bộ toàn bộ: `index.html`, `src/data/company.ts`, `public/robots.txt`, `public/.well-known/security.txt`, `scripts/generate-seo-artifacts.mjs` (`sitemap.xml` & static HTML), và `SEOManager.tsx`.

### 1.3. Tại sao tiêu đề tab vẫn giữ tên bài viết cũ?
- Trước bản sửa, chỉ có duy nhất trang `src/pages/ArticleDetail.tsx` gọi `document.title = ...` trong `useEffect`, và không có hàm dọn dẹp (cleanup) khi unmount.
- Tất cả các trang khác (`Home`, `About`, `Products`, `Quality`, `GlobalMarket`, `PressMedia`, `Brochure`, `Contact`, `NotFound`) không hề cập nhật `document.title`. Vì đây là React SPA, trình duyệt không tải lại `index.html` khi chuyển route, nên giá trị `document.title` của bài viết cũ tồn tại vĩnh viễn trên tab cho tới khi người dùng F5 hoặc mở một bài viết khác.

### 1.4. Logic SEO metadata mới hoạt động như thế nào?
1. **Runtime SPA (`src/components/seo/SEOManager.tsx` + `routeMetadata.ts` + `seoUtils.ts`)**:
   - Được gắn trực tiếp ngay dưới `<AdminAuthProvider>` trong `src/App.tsx`, theo dõi `[pathname, language]` qua `useLayoutEffect`.
   - Khi người dùng chuyển trang, mở bài viết, đổi ngôn ngữ, bấm Back/Forward hoặc vào trang 404, `SEOManager` đồng bộ tức thì `<html lang>`, `document.title`, `meta[name="title"]`, `meta[name="description"]`, `meta[name="robots"]`, duy nhất 1 thẻ `<link rel="canonical">` (hoặc gỡ bỏ hoàn toàn trên trang `/admin/*` và `404`), đầy đủ thẻ `og:*`, `twitter:*` và cập nhật khối `<script id="vinaxo-seo-jsonld">` duy nhất (không tạo thẻ trùng).
   - Cơ chế `applyVersionRef` đảm bảo không bị ghi đè dữ liệu cũ khi chuyển route nhanh.
2. **Build-Time Static HTML (`scripts/generate-seo-artifacts.mjs` + `vercel.json`)**:
   - Sau `vite build`, script đọc `dist/index.html`, `content/news/*.json`, `content/products/*.json` và xuất bản HTML riêng cho từng URL công khai (`/about.html`, `/products.html`, `/products/<slug>.html`, `/quality.html`, `/markets.html`, `/news.html`, `/tin-tuc/<slug>.html`, `/brochure.html`, `/contact.html`), cộng thêm `admin.html` (`noindex`) và `404.html` (`noindex`, không canonical).
   - `vercel.json` bật `"cleanUrls": true` và `"trailingSlash": false` với các rewrite trỏ về clean URL (`/admin/:path* -> /admin`, `/products/:path* -> /products`, `/tin-tuc/:path* -> /news`). Nhờ đó:
     - Crawler không chạy JS vẫn đọc được đúng `title`, `description`, `canonical`, `og:*`, `JSON-LD` từ HTTP response ban đầu.
     - Đường dẫn không tồn tại nhận **HTTP 404 thật** từ Vercel kèm giao diện `NotFound` và thẻ `noindex, nofollow`.

---

## 2. Bảng Đối chiếu Kết quả Khắc phục P1

| Mức độ | Vấn đề | Nguyên nhân gốc | Cách xử lý | Kết quả | Bằng chứng |
|:---:|---|---|---|---|---|
| **P1** | Canonical sai domain (`vinaxo.vn`) | Hardcode `vinaxo.vn` trong `index.html`, `robots.txt`, `sitemap.xml` và không cập nhật theo route | Tạo `SITE_CONFIG` (`https://www.vinaxo.net`), `SEOManager`, cập nhật `index.html` & build-time generator | **PASS** | `docs/screenshots/pre-handover/seo/before-canonical.png` vs `after-canonical-home.png` + kiểm tra HTTP raw HTML |
| **P1** | Title không reset khi rời bài viết | Chỉ `ArticleDetail.tsx` đặt `document.title`, thiếu SEO controller toàn cục | Gỡ `useEffect` cục bộ trong `ArticleDetail.tsx`, triển khai `SEOManager.tsx` trong `App.tsx` | **PASS** | `before-stale-title.png` vs `after-route-title-products.png`, chuỗi hành trình Chrome & Edge 100% PASS |
| **P1** | Route `/admin/*` lỗi 404 sau khi bật `cleanUrls` (phát hiện khi deploy `2e22a64`) | Rewrite trong `vercel.json` trỏ tới `/index.html` bị xung đột với `cleanUrls: true` | Tạo `dist/admin.html` (`noindex`) và trỏ rewrite tới clean URL `/admin`, `/products`, `/news` (`ce441d7`) | **PASS** | `GET /admin`, `/admin/login`, `/admin/dashboard` trên `www.vinaxo.net` trả HTTP `200` + `X-Robots-Tag: noindex, nofollow` |
