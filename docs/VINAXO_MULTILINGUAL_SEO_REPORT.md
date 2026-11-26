# BÁO CÁO CHUẨN HÓA SEO SONG NGỮ VI / EN — VINAXO (PHASE D)

- **Hệ thống ngôn ngữ**: `LanguageContext` (`vi` / `en`) lưu trạng thái tại `localStorage('vinaxo_lang')` và hỗ trợ tham số `?lang=vi|en`.
- **Kiến trúc hiện tại**: Phương án A (dùng chung URL cho cả hai ngôn ngữ, đồng bộ nội dung và toàn bộ metadata trong DOM theo ngôn ngữ đang chọn).

---

## 1. Khắc phục Lỗi Metadata Không Đồng bộ Khi Đổi Ngôn Ngữ (P2)

- **Nguyên nhân trước khi sửa**: `LanguageContext.tsx` chỉ cập nhật `document.documentElement.lang = language`. Toàn bộ `document.title`, `meta[name="description"]`, `og:title`, `og:description`, `og:locale`, `twitter:title`, `twitter:description` và JSON-LD giữ nguyên tiếng Việt ngay cả khi người dùng chuyển sang `EN`.
- **Giải pháp đã triển khai (`src/components/seo/routeMetadata.ts` & `SEOManager.tsx`)**:
  - `SEOManager` theo dõi cả `pathname` và `language`. Ngay khi người dùng chuyển đổi `VI <-> EN` (trên desktop header hoặc mobile drawer), hệ thống cập nhật đồng thời:
    - `<html lang="vi">` <-> `<html lang="en">`
    - `document.title` và `meta[name="title"]` theo ngôn ngữ tương ứng
    - `meta[name="description"]` theo ngôn ngữ tương ứng
    - `og:title`, `og:description`, `og:locale` (`vi_VN` <-> `en_US`), `og:locale:alternate`
    - `twitter:title`, `twitter:description`
    - JSON-LD (`inLanguage`, tên công ty, địa chỉ, tên sản phẩm, tiêu đề bài viết)
- **Tích hợp trường SEO từ CMS (`content/news/*.json`)**:
  - Với bài viết, `resolveRouteSeo` ưu tiên `seo_title_vi`/`seo_title_en` và `seo_description_vi`/`seo_description_en`.
  - Khi ở chế độ tiếng Anh (`en`), nếu `seo_description_en` bỏ trống, hệ thống fallback sang `excerpt_en` hoặc `body_en` trước — **tuyệt đối không dùng mô tả tiếng Việt khi đã có dữ liệu tiếng Anh hợp lệ**.

---

## 2. Trả lời Câu hỏi Kiến trúc Đa ngôn ngữ

### 2.1. Metadata tiếng Việt và tiếng Anh đã đồng bộ chưa?
**Đã đồng bộ 100% ở phía Client DOM.** Khi chuyển VI -> EN hoặc EN -> VI trên bất kỳ route nào, toàn bộ `html[lang]`, `title`, `meta[name="description"]`, `og:*`, `twitter:*` và JSON-LD cập nhật tức thì (đã kiểm chứng trên Chrome & Edge tại `SEO-14`, `SEO-15`, `SEO-16`, `SEO-17` — xem ảnh `after-metadata-vi.png` và `after-metadata-en.png`).

### 2.2. Website có cần URL riêng theo từng ngôn ngữ không? (So sánh Phương án A vs B)

| Tiêu chí | Phương án A (Đang dùng — Cùng URL, đổi qua `LanguageContext`) | Phương án B (URL riêng `/products` & `/en/products` hoặc `/vi/...`, `/en/...`) |
|---|---|---|
| **Tác động tới URL đã index & CMS** | Không làm vỡ link cũ, giữ nguyên toàn bộ cấu trúc route và Admin CMS | Phải thêm route prefix `/en/*`, cập nhật toàn bộ `<Link>`, redirect & migration |
| **Lập chỉ mục Google cho cả 2 ngôn ngữ** | Googlebot mặc định không click nút đổi ngôn ngữ trong `localStorage`, nên chủ yếu index bản mặc định (Tiếng Việt) từ HTML ban đầu | Google & Bing index **độc lập** cả trang Tiếng Việt và trang Tiếng Anh với canonical + `hreflang` riêng |
| **Thẻ `hreflang`** | **Không được gắn `hreflang`** vì chưa có URL độc lập cho từng ngôn ngữ (gắn `hreflang` trỏ tới URL không tồn tại sẽ gây lỗi SEO) | Hỗ trợ đầy đủ `<link rel="alternate" hreflang="vi" />`, `hreflang="en"`, `hreflang="x-default"` và sitemap song ngữ |
| **Khuyến nghị** | Phù hợp giai đoạn bàn giao ngay để đảm bảo an toàn, không đứt gãy link | **Nên cân nhắc ở Phase nâng cấp SEO quốc tế** nếu doanh nghiệp muốn SEO từ khóa tiếng Anh (VD: *"Vietnam dried mango OEM supplier"*) lên top Google US/EU |

### 2.3. Google và social crawler có thể đọc metadata từ HTML ban đầu không?
- **Có (đối với bản mặc định Tiếng Việt)**: Nhờ `scripts/generate-seo-artifacts.mjs`, mỗi trang công khai (`/about`, `/products`, `/products/<slug>`, `/quality`, `/markets`, `/news`, `/tin-tuc/<slug>`, `/brochure`, `/contact`) đều có file HTML tĩnh riêng trong `dist/` chứa đầy đủ `<title>`, `<meta name="description">`, `<link rel="canonical">`, thẻ `og:*`, `twitter:*` và JSON-LD ngay trong HTTP response ban đầu mà không cần chờ JavaScript thực thi.
- **Lưu ý đối với bản Tiếng Anh**: Do vẫn dùng chung URL (Phương án A), HTML tĩnh ban đầu trả về ngôn ngữ mặc định Tiếng Việt; bản Tiếng Anh được cập nhật qua `SEOManager` ngay khi React hydrate ở phía trình duyệt.

### 2.4. Sitemap có tự cập nhật khi đăng bài không?
- **Có (tự động tại build-time)**. Mỗi khi Admin xuất bản bài viết hoặc sản phẩm qua CMS V4 (`/api/admin/publish` hoặc commit lên `main`), Vercel chạy `npm run build`, trong đó bước cuối `node scripts/generate-seo-artifacts.mjs` đọc toàn bộ `content/news/*.json` (tự động loại bài nháp `status === 'draft'` hoặc `published === false`) và `content/products/*.json` để sinh lại `dist/sitemap.xml` và các trang HTML tĩnh mới nhất mà không cần sửa tay.
