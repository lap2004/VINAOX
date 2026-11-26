# BÁO CÁO NGHIỆM THU TỔNG THỂ TRƯỚC BÀN GIAO — VINAXO (PHASE M)

- **Website Production**: [https://www.vinaxo.net](https://www.vinaxo.net) (Apex `https://vinaxo.net` -> `308` sang `https://www.vinaxo.net/`)
- **Admin Portal**: [https://www.vinaxo.net/admin/](https://www.vinaxo.net/admin/)
- **Repository**: `lap2004/VINAOX` (nhánh `main`)
- **Commit SHA Production Hiện tại**: `ce441d77e9a82192a7f8885936303d190ed01250` (`ce441d7`)
- **Commit sửa lỗi chính trước đó**: `9d08fb0` (`feat/seo-multilingual-pre-handover-qa`) -> Merge `2e22a64`
- **Vercel Edge Deployment Header mẫu (`x-vercel-id`)**: `hkg1::895n8-1795710500754-3bfe4795b138` / `sin1` / `hkg1` (live verified `26/11/2026`)
- **KẾT LUẬN ĐIỀU KIỆN BÀN GIAO**: **CHƯA ĐỦ ĐIỀU KIỆN BÀN GIAO TOÀN PHẦN (CONDITIONAL PASS — CÒN 1 BLOCKER `QA-17`)**. Toàn bộ lỗi **P1 SEO**, **SEO song ngữ P2**, **true 404**, **sitemap tự động**, **Admin CMS**, và **Responsive 16 viewports** đều đã sửa và xác minh **PASS** trực tiếp trên `https://www.vinaxo.net`. Tuy nhiên, luồng **nhận email thực tế về hộp thư doanh nghiệp (`QA-17` / `QA-15`)** đang ở trạng thái **`BLOCKED`** do môi trường Vercel chưa khai báo `RESEND_API_KEY` hoặc `INQUIRY_WEBHOOK_URL`.

---

## 1. Bảng Tổng hợp Khắc phục Theo Mức độ

| Mức độ | Vấn đề | Nguyên nhân gốc | Cách xử lý | Kết quả | Bằng chứng |
|:---:|---|---|---|---|---|
| **P1** | Canonical sai domain (`vinaxo.vn`) | Hardcode `vinaxo.vn` trong `index.html`, `robots.txt`, `sitemap.xml`, `security.txt`; thiếu SEO controller theo route | Tập trung domain tại `src/config/siteConfig.ts` (`https://www.vinaxo.net`), cập nhật `index.html` & `SEOManager` + static route HTML generator | **PASS** | `before-canonical.png`, `after-canonical-home.png`, live HTTP checks |
| **P1** | Title không reset sau khi mở bài viết | Chỉ `ArticleDetail.tsx` cập nhật `document.title` và không dọn dẹp khi chuyển route | Gỡ `useEffect` cũ ở `ArticleDetail.tsx`, triển khai `SEOManager.tsx` trong `App.tsx` | **PASS** | `before-stale-title.png`, `after-route-title-products.png`, Chrome & Edge PASS |
| **P2** | Metadata sai ngôn ngữ khi chuyển EN | `LanguageContext` chỉ đổi `html[lang]`, bỏ quên `title`, `description`, `og:*`, `twitter:*`, `JSON-LD` | Đồng bộ toàn bộ metadata theo `[pathname, language]` trong `routeMetadata.ts` & `SEOManager.tsx` | **PASS** | `before-en-vi-meta.png`, `after-metadata-vi.png`, `after-metadata-en.png` |
| **P2** | Mobile, Form & Luồng gửi yêu cầu | `banana-chips.json` sai ảnh; `QuoteModal` mất sản phẩm truyền vào; form chỉ chạy `mailto:` / `setTimeout` mock; thiếu `font-size: 16px` mobile; nút nổi dễ trùng vùng form `/contact` | Sửa `banana-chips.json`; đồng bộ `QuoteModal` theo 12 sản phẩm; xây dựng `POST /api/inquiry` + fallback giữ nguyên input; vá CSS mobile & modal focus/scroll lock | **PASS / BLOCKED (`QA-17`)** | Chrome & Edge 0px overflow trên 16 viewports; live `503` fallback screenshot (`contact-form-503-fallback.png`); `QA-17` chờ `RESEND_API_KEY` trên Vercel |

---

## 2. Bảng Trạng thái Toàn bộ Test Case (Phase I & Phase J)

### 2.1. SEO & Routing Regression (`SEO-01` .. `SEO-28`)

| ID | Test Case | Trạng thái | Ghi chú & Bằng chứng |
|---|---|:---:|---|
| `SEO-01` | Canonical trang chủ đúng domain | **PASS** | `https://www.vinaxo.net/` |
| `SEO-02` | Canonical sản phẩm đúng pathname | **PASS** | `https://www.vinaxo.net/products` |
| `SEO-03` | Canonical tin tức đúng pathname | **PASS** | `https://www.vinaxo.net/news` |
| `SEO-04` | Canonical chi tiết bài viết đúng slug | **PASS** | `https://www.vinaxo.net/tin-tuc/press-nld-mango-sourcing` |
| `SEO-05` | Không còn canonical trỏ `vinaxo.vn` | **PASS** | `vinaxo.vn` = 0 trên toàn bộ `dist/` và các route live |
| `SEO-06` | Mỗi trang chỉ có một canonical | **PASS** | `canonicalCount === 1` trên mọi route công khai; `0` trên 404 & Admin |
| `SEO-07` | Title trang chủ chính xác | **PASS** | `VINAXO – Nhà sản xuất trái cây sấy nhiệt đới Việt Nam` |
| `SEO-08` | Mở bài viết rồi chuyển sang Brochure | **PASS** | Title reset thành `Catalogue & Brochure – VINAXO` |
| `SEO-09` | Mở bài viết rồi chuyển sang Sản phẩm | **PASS** | Title reset thành `Sản phẩm trái cây sấy và hạt dinh dưỡng – VINAXO` |
| `SEO-10` | Chuyển route liên tục không giữ metadata cũ | **PASS** | 6/6 route hành trình có title, description, canonical riêng biệt |
| `SEO-11` | Browser Back/Forward cập nhật metadata | **PASS** | Back từ `/contact` về `/products` (EN) cập nhật đúng title & canonical |
| `SEO-12` | Truy cập trực tiếp URL có metadata đúng | **PASS** | Kiểm chứng trực tiếp `/about`, `/quality`, `/markets`, `/brochure`, `/products/soft-dried-mango` |
| `SEO-13` | Refresh trang giữ metadata đúng | **PASS** | Refresh trên `/products` (EN) giữ nguyên `html[lang]="en"`, title EN, canonical đúng |
| `SEO-14` | Chuyển VI sang EN cập nhật title | **PASS** | `Contact & Request B2B Quote – VINAXO` |
| `SEO-15` | Chuyển VI sang EN cập nhật description | **PASS** | Cập nhật sang description tiếng Anh tương ứng |
| `SEO-16` | Chuyển EN sang VI cập nhật metadata | **PASS** | Chuyển lại VI cập nhật đồng bộ title/description/locale VI |
| `SEO-17` | HTML lang đúng ngôn ngữ | **PASS** | `vi` <-> `en` đồng bộ với UI |
| `SEO-18` | Open Graph metadata đúng | **PASS** | `og:title`, `og:description`, `og:url`, `og:image`, `og:locale` khớp theo route & ngôn ngữ |
| `SEO-19` | Sitemap đúng domain | **PASS** | `https://www.vinaxo.net/sitemap.xml` chứa 29 URL chuẩn |
| `SEO-20` | Sitemap cập nhật khi CMS xuất bản | **PASS** | `scripts/generate-seo-artifacts.mjs` sinh động trong mỗi lần `npm run build` |
| `SEO-21` | Robots.txt không chặn website công khai | **PASS** | `Allow: /`, không chặn CSS/JS, khai báo `Sitemap: https://www.vinaxo.net/sitemap.xml` |
| `SEO-22` | Admin và bản nháp không bị index ngoài ý muốn | **PASS** | `Disallow: /admin`, header `X-Robots-Tag: noindex, nofollow`, `<meta name="robots" content="noindex, nofollow">`, loại bài nháp khỏi sitemap |
| `SEO-23` | URL không tồn tại được xử lý đúng | **PASS** | `GET /non-existent-qa-test` trả **HTTP `404`** + `noindex, nofollow` + không canonical |
| `SEO-24` | Structured Data hợp lệ | **PASS** | 1 khối JSON-LD hợp lệ/trang (`Organization`, `WebSite`, `CollectionPage`, `Product`, `NewsArticle`, `ContactPage`, `BreadcrumbList`) |
| `SEO-25` | Metadata HTML ban đầu được kiểm tra | **PASS** | Kiểm tra HTTP thô không JS trên 11 route công khai đều có title/canonical/description riêng |
| `SEO-26` | Không ảnh hưởng Admin CMS | **PASS** | `/admin/login` trả HTTP `200`, render giao diện đăng nhập; 19/19 test Admin suite PASS |
| `SEO-27` | Không ảnh hưởng cơ chế xuất bản | **PASS** | Không ghi đè `content/` CMS mới nhất; giữ nguyên `4eeb845` |
| `SEO-28` | Website không bị trắng sau deployment | **PASS** | Mọi route public + admin trên `www.vinaxo.net` render H1 và DOM đầy đủ |

### 2.2. Mobile, Responsive & Contact Form Regression (`QA-01` .. `QA-26`)

| ID | Test Case | Trạng thái | Ghi chú & Bằng chứng |
|---|---|:---:|---|
| `QA-01` | Mobile menu hoạt động | **PASS** | Chrome & Edge (`390×844`), `mobile-menu-open.png` |
| `QA-02` | Chuyển ngôn ngữ trên mobile | **PASS** | Đổi sang EN trong mobile drawer -> `html[lang]="en"` |
| `QA-03` | Không horizontal overflow | **PASS** | `0 px` overflow trên tất cả 16 viewport bắt buộc (Chrome & Edge) |
| `QA-04` | Bộ lọc sản phẩm hoạt động | **PASS** | Lọc danh mục và quay về Tất cả (12 sản phẩm) |
| `QA-05` | Product card hiển thị đúng ảnh | **PASS** | Đã sửa `banana-chips.json`; 12/12 ảnh `naturalWidth > 0` |
| `QA-06` | Modal thông số kỹ thuật | **PASS** | Mở/đóng, cuộn nội dung, trả focus (`mobile-spec-modal.png`) |
| `QA-07` | Bảng thông số trên mobile | **PASS** | Cuộn ngang trong `.specs-table-wrapper`, page overflow = `0 px` |
| `QA-08` | Popup nhận báo giá | **PASS** | Font input `16px` chống auto-zoom iOS, bố cục chuẩn trên mobile |
| `QA-09` | Bàn phím ảo không che form | **PASS** | Áp dụng `font-size: 16px`, `autoComplete`, `inputMode`, modal `90dvh` scroll; *(giả lập, chưa test trên thiết bị iOS/Android vật lý)* |
| `QA-10` | Nút liên hệ nổi không che nội dung | **PASS** | Ẩn khi ở `/contact`, khi mở `QuoteModal` hoặc chạm footer |
| `QA-11` | PDF Viewer trên mobile | **PASS** | Mobile hiển thị 4 trang ảnh dọc; Desktop hiển thị `<iframe>` PDF (`brochure-mobile-390.png`, `brochure-desktop-1440.png`) |
| `QA-12` | Tải brochure thành công | **PASS** | Link `/brochures/vinaxo-company-brochure-2026.pdf` hợp lệ |
| `QA-13` | Gửi form thiếu dữ liệu bị từ chối | **PASS** | Hiển thị thông báo lỗi bắt buộc (`[role='alert']`) |
| `QA-14` | Email không hợp lệ bị từ chối | **PASS** | Từ chối email sai định dạng |
| `QA-15` | Gửi form hợp lệ | **BLOCKED** | Unit test `/api/inquiry` với mock Resend PASS `200`; trên live production trả `503 DELIVERY_NOT_CONFIGURED` do chưa có `RESEND_API_KEY` |
| `QA-16` | Đúng sản phẩm được truyền vào form báo giá | **PASS** | Click từ Chuối sấy giòn chọn đúng `banana-chips` (`quote-modal-prefilled.png`) |
| `QA-17` | Doanh nghiệp thực sự nhận yêu cầu | **BLOCKED** | Chờ chủ sở hữu cấu hình `RESEND_API_KEY` / `INQUIRY_WEBHOOK_URL` trên Vercel & xác nhận hộp thư `cuonghoang0710@gmail.com` |
| `QA-18` | Không gửi trùng khi bấm nhiều lần | **PASS** | Khóa nút `disabled={isSubmitting}` + server dedup `409` trong 60s |
| `QA-19` | Xử lý API lỗi | **PASS** | HTTP `503` hiển thị cảnh báo lỗi trung thực + các nút fallback (`contact-form-503-fallback.png`) |
| `QA-20` | Giữ dữ liệu khi gửi thất bại | **PASS** | `contactName` và toàn bộ trường nhập vẫn giữ nguyên sau lỗi `503` |
| `QA-21` | Hiển thị thông báo đúng ngôn ngữ | **PASS** | Thông báo lỗi & fallback hỗ trợ cả VI và EN |
| `QA-22` | Responsive laptop 14 inch | **PASS** | `1280×720`, `1366×768`, `1440×900` — `0 px` overflow (Chrome & Edge) |
| `QA-23` | Responsive laptop 15.6 inch | **PASS** | `1536×864`, `1920×1080`, `1920×1200` — `0 px` overflow (Chrome & Edge) |
| `QA-24` | Responsive desktop 24 inch | **PASS** | `1920×1080` — `0 px` overflow (Chrome & Edge) |
| `QA-25` | Responsive desktop 27 inch | **PASS** | `2560×1440`, `3840×2160` — `0 px` overflow (Chrome & Edge) |
| `QA-26` | Không có JavaScript Runtime Error | **PASS** | `0` lỗi JS trên tất cả trang hợp lệ (Chrome & Edge) |
| — | Kiểm thử trình duyệt Safari / WebKit & thiết bị vật lý thật | **NOT RUN** | Môi trường Windows chỉ hỗ trợ Chrome & Edge |

---

## 3. Các File Đã Tạo Mới & Chỉnh Sửa

- **SEO & Cấu hình**: `src/config/siteConfig.ts`, `src/components/seo/seoUtils.ts`, `src/components/seo/routeMetadata.ts`, `src/components/seo/SEOManager.tsx`, `src/App.tsx`, `src/pages/ArticleDetail.tsx`, `src/data/company.ts`, `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/.well-known/security.txt`, `scripts/generate-seo-artifacts.mjs`, `vercel.json`, `package.json`.
- **Dữ liệu sản phẩm**: `content/products/banana-chips.json` (khôi phục đúng ảnh `banana-chips.webp` / `.jpg`).
- **Biểu mẫu & Backend tiếp nhận yêu cầu**: `server/inquiry.ts`, `api/inquiry.mjs`, `scripts/build-api.mjs`, `src/services/inquiryService.ts`, `src/pages/Contact.tsx`, `src/components/ui/QuoteModal.tsx`, `src/components/forms/ContactForm.tsx`, `.env.example`.
- **Mobile, Modal & Safe-Area UI**: `src/components/layout/MainLayout.tsx`, `src/components/products/ProductDetailModal.tsx`, `src/components/ui/CertificatePreviewModal.tsx`, `src/styles/global.css`, `src/styles/responsive.css`.
- **Kiểm thử & Báo cáo**: `scripts/test-seo-and-inquiry.mjs`, `scripts/qa-pre-handover.py`, `docs/VINAXO_*.md`, `docs/screenshots/pre-handover/*`.

---

## 4. Những Vấn đề Chưa Hoàn thành & Điều kiện Bàn giao

1. **Blocker bắt buộc trước khi bàn giao toàn phần (`QA-17`)**: Cấu hình `RESEND_API_KEY` (hoặc `INQUIRY_WEBHOOK_URL`) trên Vercel Environment Variables, redeploy, gửi 1 yêu cầu thử nghiệm và xác nhận VINAXO nhận được email tại `cuonghoang0710@gmail.com`.
2. **Đẩy đồng bộ lên remote `origin` (`SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO`)**: Hiện tại đã đẩy lên `personal` (`lap2004/VINAOX` — repo kết nối Vercel). Cần đồng bộ sang `origin/main` nếu đội ngũ dùng cả 2 remote.
3. **Cải thiện bổ sung (không chặn SEO/routing, nên làm sau)**:
   - Tối ưu `CLS = 0.311` (gán kích thước `width`/`height` hoặc `aspect-ratio` cố định cho ảnh hero/font fallback).
   - Kiểm thử thêm trên Safari iOS và Android vật lý thật.
   - Đánh giá chuyển sang Phương án B (`/en/*` + `hreflang`) nếu mở rộng chiến dịch SEO từ khóa tiếng Anh quốc tế.
