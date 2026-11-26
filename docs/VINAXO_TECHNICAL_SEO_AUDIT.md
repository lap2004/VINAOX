# BÁO CÁO AUDIT KỸ THUẬT SEO TOÀN DIỆN — VINAXO (PHASE A & E)

- **Website Production**: [https://www.vinaxo.net](https://www.vinaxo.net) (Apex `https://vinaxo.net` -> HTTP `308` sang `https://www.vinaxo.net/`)
- **Repository**: `lap2004/VINAOX` (nhánh `main`)
- **Commit Baseline trước sửa**: `4eeb845` (CMS V4 Production)
- **Commit Sau sửa & Triển khai**: `ce441d7`
- **Ngày Audit & Nghiệm thu**: 26/11/2026

---

## 1. Tóm tắt Phát hiện Audit Ban đầu (Phase A — Trước khi sửa)

Qua rà soát toàn bộ mã nguồn (`index.html`, `src/App.tsx`, `src/pages/*`, `src/i18n/*`, `src/services/contentService.ts`, `public/*`, `vercel.json`) và kiểm tra trực tiếp trên production `https://www.vinaxo.net` trước thời điểm triển khai bản sửa, ghi nhận các lỗi và khoảng trống sau:

| Mức độ | Vấn đề phát hiện | Vị trí trong mã nguồn | Tác động thực tế |
|:---:|:---|:---|:---|
| **P1** | Canonical, `og:url`, `og:image`, `twitter:*`, `JSON-LD`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt` hardcode domain cũ `https://vinaxo.vn/` | `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/.well-known/security.txt` | Công cụ tìm kiếm nhận diện sai domain chính thức (`vinaxo.vn` thay vì `vinaxo.net`), toàn bộ trang con bị trỏ canonical về `https://vinaxo.vn/`. |
| **P1** | Chỉ `ArticleDetail.tsx` sửa `document.title` và không có cleanup/route manager | `src/pages/ArticleDetail.tsx` (dòng 26–33), thiếu SEO controller toàn cục | Khi mở bài viết rồi chuyển sang `/brochure` hoặc `/products`, tiêu đề tab giữ nguyên tên bài viết trước đó. |
| **P2** | Metadata (`title`, `description`, `og:*`, `twitter:*`, `JSON-LD`) không đồng bộ theo ngôn ngữ VI/EN | `src/i18n/LanguageContext.tsx` chỉ cập nhật `document.documentElement.lang` | Khi chuyển sang `EN`, giao diện sang tiếng Anh nhưng `<title>` và `<meta name="description">` vẫn là tiếng Việt. |
| **P2** | Soft 404 trên mọi đường dẫn không tồn tại | `vercel.json` rewrite `/* -> /index.html` trả HTTP `200` | Googlebot nhận diện các URL sai như trang hợp lệ (`200 OK`) với nội dung trang chủ trong HTML thô. |
| **P2** | Crawler không chạy JavaScript (Zalo, Facebook, LinkedIn, curl) nhận cùng một HTML gốc | Vite SPA chỉ có một file `dist/index.html` | Khi chia sẻ link bài viết `/tin-tuc/...`, `/products`, `/brochure`, crawler thấy title/ảnh/mô tả của trang chủ. |
| **P2** | `sitemap.xml` tĩnh thiếu `/brochure`, sản phẩm chi tiết, bài viết CMS và dùng `vinaxo.vn` | `public/sitemap.xml` | Không tự động cập nhật khi Admin xuất bản bài viết mới. |
| **P2** | `COMPANY_INFO.contacts.website` thiếu giao thức `https://` khi đọc từ CMS | `content/settings/company.json` (`"website": "www.vinaxo.net"`), `src/data/company.ts` | Link website trên trang `/contact` có nguy cơ tạo URL tương đối sai đường dẫn. |
| **P2** | Ảnh sản phẩm `banana-chips` trỏ nhầm sang ảnh thanh long ruột đỏ | `content/products/banana-chips.json` (`4eeb845`) | Card Chuối sấy giòn hiển thị sai hình ảnh thanh long ruột đỏ. |

---

## 2. Kiểm tra Hiện trạng Tên miền & Vercel Routing

- `https://vinaxo.net/` -> `HTTP 308 Permanent Redirect` -> `Location: https://www.vinaxo.net/` (cấu hình domain hiện hành của Vercel).
- `https://www.vinaxo.net/` -> `HTTP 200 OK`.
- **Quyết định chuẩn hóa**: Chọn **`https://www.vinaxo.net`** làm `SITE_CONFIG.siteUrl` chính thức cho Canonical, Sitemap, `robots.txt`, Open Graph và Structured Data vì đây là host HTTP 200 gốc trên Vercel (tránh việc canonical trỏ về URL 308 `https://vinaxo.net/` và không tự ý thay đổi DNS hay redirect `vinaxo.vn`).

---

## 3. Kiểm tra Technical SEO Sau khi Sửa (Verified Live trên `https://www.vinaxo.net`)

### 3.1. HTML Response ban đầu (Không chạy JavaScript)
Bổ sung script build-time `scripts/generate-seo-artifacts.mjs` kết hợp `cleanUrls: true` và `trailingSlash: false` trong `vercel.json`. Kết quả kiểm tra HTTP thực tế trên `https://www.vinaxo.net`:

| Đường dẫn kiểm tra | HTTP Status | Canonical trong HTML thô | Title trong HTML thô | Chứa `vinaxo.vn`? |
|---|---:|---|---|:---:|
| `/` | `200` | `https://www.vinaxo.net/` | `VINAXO – Nhà sản xuất trái cây sấy nhiệt đới Việt Nam` | Không |
| `/about` | `200` | `https://www.vinaxo.net/about` | `Về chúng tôi – VINAXO` | Không |
| `/products` | `200` | `https://www.vinaxo.net/products` | `Sản phẩm trái cây sấy và hạt dinh dưỡng – VINAXO` | Không |
| `/products/soft-dried-mango` | `200` | `https://www.vinaxo.net/products/soft-dried-mango` | `Xoài sấy dẻo – VINAXO` | Không |
| `/quality` | `200` | `https://www.vinaxo.net/quality` | `Chất lượng và chứng nhận quốc tế – VINAXO` | Không |
| `/markets` | `200` | `https://www.vinaxo.net/markets` | `Thị trường xuất khẩu – VINAXO` | Không |
| `/news` | `200` | `https://www.vinaxo.net/news` | `Báo chí và Tin tức – VINAXO` | Không |
| `/tin-tuc/press-nld-mango-sourcing` | `200` | `https://www.vinaxo.net/tin-tuc/press-nld-mango-sourcing` | `VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm` | Không |
| `/brochure` | `200` | `https://www.vinaxo.net/brochure` | `Catalogue & Brochure – VINAXO` | Không |
| `/contact` | `200` | `https://www.vinaxo.net/contact` | `Liên hệ và nhận báo giá – VINAXO` | Không |
| `/admin`, `/admin/login`, `/admin/dashboard` | `200` | *Không có canonical* (`noindex, nofollow`, header `X-Robots-Tag: noindex, nofollow`) | `VINAXO Admin CMS` | Không |
| `/non-existent-qa-test` | **`404`** | *Không có canonical* (`<meta name="robots" content="noindex, nofollow" />`) | `404 – Không tìm thấy trang – VINAXO` | Không |

### 3.2. `robots.txt` và `sitemap.xml`
- `GET https://www.vinaxo.net/robots.txt` -> HTTP `200`: Cho phép crawl toàn bộ trang công khai và CSS/JS, chặn `/admin`, `/admin/`, `/api/`, `/*.json$`, khai báo `Sitemap: https://www.vinaxo.net/sitemap.xml`.
- `GET https://www.vinaxo.net/sitemap.xml` -> HTTP `200`: Tự động sinh tại build-time với **29 URL** (`/` + 7 trang cốt lõi + 12 sản phẩm `/products/<slug>` + 9 bài viết đã xuất bản `/tin-tuc/<slug>`). Không chứa URL `/admin`, không chứa bản nháp, không chứa `vinaxo.vn`.

### 3.3. Structured Data JSON-LD & Heading Hierarchy
- Mỗi trang công khai chỉ có đúng **1 thẻ** `<script id="vinaxo-seo-jsonld" type="application/ld+json">` hợp lệ:
  - Trang chủ: `Organization` + `WebSite` (dùng dữ liệu thật từ `COMPANY_INFO`, không tự tạo giá, rating hay review).
  - Trang danh mục: `CollectionPage` + `BreadcrumbList`.
  - Chi tiết sản phẩm: `Product` + `BreadcrumbList`.
  - Chi tiết bài viết: `NewsArticle` (`datePublished`, `dateModified`, `author`, `publisher`, `inLanguage`) + `BreadcrumbList`.
  - Trang giới thiệu, chất lượng, thị trường, tin tức, brochure, liên hệ: `BreadcrumbList` (+ `ContactPage` tại `/contact`).
- Mỗi trang công khai có 1 thẻ `<h1>` phù hợp; không sử dụng dữ liệu bịa đặt.

---

## 4. Điểm Hiệu suất & Core Web Vitals (Lab Measurement)

> **Lưu ý minh bạch số liệu**: Các số liệu dưới đây được đo trong môi trường trình duyệt phòng lab (Headless Chrome `1440×900` tại `https://www.vinaxo.net`). Hệ thống chưa tích hợp Google CrUX field telemetry nên **chưa có dữ liệu thực tế người dùng (Field Data) cho chỉ số INP**.

| Chỉ số | Trước sửa (`4eeb845`) | Sau sửa (`ce441d7`) | Ghi chú |
|---|---:|---:|---|
| **TTFB** (Lab Chrome) | `54 ms` | `54 ms` (Chrome) / `52 ms` (Edge) | Phản hồi edge CDN Vercel ổn định |
| **FCP** (Lab Chrome) | `1580 ms` (cold) | `1300 ms` (cold) / `176 ms` (warm) | Đạt dưới ngưỡng 1.8s |
| **LCP** (Lab Chrome) | *Chưa đo trước sửa* | `1784 ms` | Đạt mục tiêu `<= 2500 ms` |
| **CLS** (Lab Chrome) | *Chưa đo trước sửa* | **`0.311`** | **Vượt ngưỡng khuyến nghị `<= 0.1`** — cần tối ưu kích thước ảnh hero/font fallback ở đợt bảo trì tiếp theo |
| **INP (Field Data)** | Không có dữ liệu trường | Không có dữ liệu trường | Cần theo dõi qua Google Search Console / PageSpeed CrUX khi có đủ traffic |
| **JS Transfer Size** | — | `121,443 bytes` (~118.6 KB) | Đã bật code-splitting theo route |
