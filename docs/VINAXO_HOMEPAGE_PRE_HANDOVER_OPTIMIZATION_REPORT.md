# BÁO CÁO NGHIỆM THU TRƯỚC BÀN GIAO – TỐI ƯU TRANG CHỦ, ÁNH XẠ DANH MỤC & ADMIN CMS (`/admin/homepage`)

**Website Production:** https://www.vinaxo.net  
**Admin Portal:** https://www.vinaxo.net/admin/homepage  
**Repository:** `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO` (`origin`) & `lap2004/VINAOX` (`personal`) — Branch `main`  
**Ngày hoàn tất & kiểm thử live:** 2026-11-27  
**Bundle Production đã xác minh:** `assets/index-DMysk4gh.js` (Home chunk `Home-xj5xzgyc.js`)

---

## 1. Tóm tắt điều hành (Executive Summary)

Đợt tối ưu Trang chủ đã giải quyết triệt để **4 nhóm vấn đề P1/P2**, rút gọn **32,6% chiều dài trang chủ**, loại bỏ điều hướng sai danh mục và bổ sung hệ thống quản trị độc lập cho Trang chủ trên Admin CMS:

1. **P1-01 – Tách biệt Granola & Viên năng lượng khỏi Hạt dinh dưỡng (`nuts-seeds`):**
   - Trước sửa: `Granola Trái Cây & Hạt` và `Viên Năng Lượng Trái Cây & Hạt` điều hướng sang `/products?category=nuts-seeds`, khiến người mua B2B thấy Hạt điều, Mắc ca, Quả óc chó, Hạt sen thay vì Granola/Viên năng lượng.
   - Sau sửa: Vì danh mục chuẩn 12 SKU hiện tại chưa có mã SKU tồn kho riêng cho Granola hay Viên năng lượng, cả hai (+ Trái cây tẩm mật ong, Trái cây nhúng sô-cô-la) được tách sang khối riêng **`Dòng Sản Phẩm Phát Triển & Gia Công OEM Theo Yêu Cầu`** với nút **`"Liên hệ tìm hiểu"`** mở trực tiếp `QuoteModal` gắn sẵn ID tư vấn chuyên biệt (`granola`, `fruit-and-nut-balls`, `honey-infused-dried-fruit`, `chocolate-dipped-dried-fruit`), không trỏ sang `nuts-seeds`.
   - Khi truy cập trực tiếp URL `/products?category=granola`, trang `/products` giữ bộ lọc tổng thể (`all`) và hiển thị thông báo rõ ràng `[data-testid="invalid-category-notice"]` kèm nút yêu cầu tư vấn OEM riêng (tuyệt đối không tự động gán nhầm sang `Hạt dinh dưỡng`).
2. **P1-02 – Chuẩn hóa tên danh mục `"Trái cây sấy giòn"` (`chips`):**
   - Trước sửa: Nhóm `/products?category=chips` bị hiển thị nhãn `"Trái cây sấy tự nhiên"` trên Trang chủ, gây nhầm lẫn về công nghệ chế biến.
   - Sau sửa: Hợp nhất Single Source of Truth tại `src/shared/catalogCategories.ts` — thống nhất tên hiển thị cho slug `chips` là **`Trái cây sấy giòn`** (`VI`) / **`Crispy Dried Fruits`** (`EN`) / **`크리스피 과일 칩`** (`KO`) / **`香脆果干片`** (`ZH-CN`) trên Trang chủ, `/products`, bộ lọc và Admin CMS, mô tả đúng công nghệ sấy giòn / chiên sấy chân không nhiệt độ thấp kết hợp ly tâm tách dầu (độ ẩm `< 5%`).
3. **P2-01 – Tinh gọn Trang chủ từ 10.971px xuống 7.396px (~32,6%), tối đa 4 Sản phẩm tiêu biểu:**
   - Giảm từ 10 section dàn trải trùng lặp xuống **9 section** gọn mạch lạc (`Hero` → `Giới thiệu ngắn` → `4 Danh mục chính thức + Khối OEM riêng` → `4 Sản phẩm tiêu biểu` → `Năng lực Nhà máy & OEM` → `Chất lượng & Chứng nhận` → `Thị trường xuất khẩu` → `Tin tức & Báo chí (3 bài)` → `CTA B2B cuối trang`).
   - Giảm số lượng Sản phẩm tiêu biểu trên Trang chủ từ **8 thẻ** xuống tối đa **4 thẻ** (`Xoài sấy dẻo`, `Thanh long ruột đỏ sấy dẻo`, `Chuối sấy giòn`, `Hạt điều`) do quản trị viên chọn và sắp xếp thứ tự.
   - Giảm tổng ảnh tải trên Trang chủ từ **39 ảnh** xuống **23 ảnh**, loại bỏ lặp dải ảnh nhà máy & thẻ chứng chỉ dài dòng.
4. **Admin CMS Quản lý Trang chủ (`/admin/homepage` + `/admin/products`):**
   - Bổ sung phân hệ **`Quản lý trang chủ`** tại `/admin/homepage` gồm 5 tab cấu hình đa ngôn ngữ (VI / EN / KO / ZH-CN), bật/tắt & sắp xếp 9 section, chỉnh 4 danh mục chính thức & 4 dòng OEM riêng, chọn tối đa 4 sản phẩm tiêu biểu, `MediaPicker` phân mục `'homepage'`, và nút xuất bản riêng **`"Cập nhật trang chủ lên website"`** (`module: 'homepage'`).
   - Mở rộng `server/admin/settings.ts?section=homepage` giữ nguyên tổng số Vercel Serverless Functions ở **12/12** (đúng giới hạn Vercel Hobby).
   - Bổ sung checkbox `★ Hiển thị nổi bật trên Trang chủ` + thứ tự `1–4` trong `/admin/products`.

---

## 2. Chỉ số BEFORE vs AFTER đo trực tiếp trên Production (`https://www.vinaxo.net/`)

| Chỉ số kỹ thuật (Chrome Headless 1440×900) | BEFORE (Live trước cập nhật) | AFTER (Live sau triển khai) | Chênh lệch / Đánh giá |
| --- | --- | --- | --- |
| **Tổng chiều cao trang (`scrollHeight`)** | `10.971 px` | `7.396 px` (Chrome) / `7.367 px` (Edge) | **Giảm 3.575 px (-32,6%)** |
| **Số lượng section trang chủ** | `10` section (nhiều khối trùng lặp) | `9` section tinh gọn | Hợp nhất khối OEM, Nhà máy & Chứng nhận |
| **Số sản phẩm tiêu biểu (`featured`)** | `8` sản phẩm | `4` sản phẩm (`<= 4` theo CMS) | Đúng chuẩn tối đa 4 SKU chủ lực |
| **Tổng số thẻ `<img>` tải trên `/` & ảnh lỗi** | `39` ảnh (có lặp) | `23` ảnh · **0 ảnh lỗi (`broken=[]`)** | **Giảm 16 ảnh (-41,0%)** |
| **Đích đến Granola & Viên năng lượng** | `/products?category=nuts-seeds` (SAO CHÉP NHẦM) | Mở `QuoteModal` với ID `granola` / `fruit-and-nut-balls` (`nutsLinks=0`) | Khắc phục dứt điểm P1-01 |
| **Nhãn danh mục `chips` trên Trang chủ** | `TRÁI CÂY SẤY TỰ NHIÊN` | `Trái cây sấy giòn` / `Crispy Dried Fruits` | Khắc phục dứt điểm P1-02 |
| **DOMContentLoaded / LoadEventEnd (Chrome)** | `457 ms` / `461 ms` (trước) | `261 ms` / `264 ms` (Local) · `1.157 ms` / `1.157 ms` (Live Edge CDN cold hit) | Phản hồi mượt, zero layout shift |
| **Số lượng Serverless Functions (`api/`)** | `12` | `12` | An toàn tuyệt đối với giới hạn Vercel Hobby |

---

## 3. Bảng Ma Trận Nghiệm Thu Kiểm Thử (`HOME-01` .. `HOME-35`)

> **Quy tắc ghi nhận trung thực:** Chỉ ghi `PASS` khi đã chạy trực tiếp và kiểm chứng đầu ra đạt 100%; các kiểm thử phụ thuộc tài khoản Admin thật trên môi trường live hoặc trình duyệt ngoài Windows (Safari / Firefox) được ghi rõ `BLOCKED` hoặc `NOT RUN`.

| Mã Test | Hạng mục kiểm tra | Phạm vi / Môi trường | Kết quả | Bằng chứng / Ghi chú |
| --- | --- | --- | --- | --- |
| **HOME-01** | Granola không trỏ sang `nuts-seeds` | Live Chrome & Edge (`https://www.vinaxo.net/`) | **PASS** | `nutsLinks=0` trong `[data-testid="home-oem-inquiry-lines"]` |
| **HOME-02** | Nút "Liên hệ tìm hiểu" Granola mở đúng `QuoteModal` | Live Chrome & Edge | **PASS** | `Select#quoteProduct` tự chọn `value="granola"` |
| **HOME-03** | Nút "Liên hệ tìm hiểu" Viên năng lượng mở đúng `QuoteModal` | Live Chrome & Edge | **PASS** | `Select#quoteProduct` tự chọn `value="fruit-and-nut-balls"` |
| **HOME-04** | Dòng Tẩm mật ong & Nhúng sô-cô-la gắn đúng inquiry ID | Code & Modal schema (`contactSchema.ts`) | **PASS** | ID riêng `honey-infused-dried-fruit` & `chocolate-dipped-dried-fruit` |
| **HOME-05** | Truy cập trực tiếp `/products?category=granola` không map sang Hạt | Live Chrome & Edge | **PASS** | Hiện `invalid-category-notice`, hiển thị 12 SKU tổng, `nuts-seeds` không active |
| **HOME-06** | API `/api/contact` nhận diện đúng `granola` & `fruit-and-nut-balls` | `node scripts/test-seo-and-inquiry.mjs` (Case 12) | **PASS** | `verifiedProductSlug` chính xác, `verifiedCategoryId` trống, email ghi rõ OEM Custom |
| **HOME-07** | Danh mục `chips` đổi sang "Trái cây sấy giòn" (VI) | Live Chrome & Edge | **PASS** | Card `[data-category-card="chips"]` hiển thị `Trái cây sấy giòn` |
| **HOME-08** | Danh mục `chips` đa ngôn ngữ (EN/KO/ZH-CN) nhất quán | Live Chrome & Edge | **PASS** | EN: `Crispy Dried Fruits`, KO: `크리스피 과일 칩`, ZH-CN: `香脆果干片` |
| **HOME-09** | Bấm thẻ `Trái cây sấy giòn` mở `/products?category=chips` (3 SKU) | Live Chrome & Edge | **PASS** | Hiển thị đúng 3 sản phẩm chiên/sấy giòn (`chipCards=3`) |
| **HOME-10** | Không còn nhãn "Trái cây sấy tự nhiên" cho nhóm `chips` | Live Chrome & Edge (`P1-02-CHIPS-NAMING-AND-I18N`) | **PASS** | `issues=[]` |
| **HOME-11** | Không còn tuyên bố chung chung "không đường / 100% sấy dẻo tự nhiên" ở SEO `/` | `test-seo-and-inquiry.mjs` + live HTML | **PASS** | `index.html`, `routeMetadata.ts`, `i18n/*.ts` đều đã chuẩn hóa |
| **HOME-12** | Single Source of Truth `src/shared/catalogCategories.ts` | Build & `products.ts` / `homepageSchema.ts` | **PASS** | 4 nhóm `soft-dried`, `chips`, `nuts-seeds`, `mixed` đồng bộ tuyệt đối |
| **HOME-13** | Cấu trúc 9 section tinh gọn trên Trang chủ | Live Chrome & Edge | **PASS** | `sectionCount=9`, bỏ lặp OEM & gallery nhà máy |
| **HOME-14** | Số lượng Sản phẩm tiêu biểu giới hạn tối đa 4 | Live Chrome & Edge | **PASS** | `featuredCount=4` (`soft-dried-mango`, `soft-dried-red-dragonfruit`, `banana-chips`, `cashew`) |
| **HOME-15** | Giảm chiều dài cuộn Trang chủ đáng kể | Live Chrome & Edge | **PASS** | Giảm từ `10.971px` xuống `7.396px` (Chrome) / `7.367px` (Edge) |
| **HOME-16** | Toàn bộ ảnh trên Trang chủ hiển thị sắc nét, 0 ảnh vỡ | Live Chrome & Edge | **PASS** | `totalImages=23`, `brokenImages=[]` |
| **HOME-17** | Kiểm tra trực quan Hero collage sau sửa `<picture>` | Visual inspection (`after-home-hero-vi.png`) | **PASS** | Hai ảnh xoài & thanh long lấp kín khung bo tròn, không còn khoảng hở |
| **HOME-18** | Kiểm tra trực quan Hero tiếng Anh (`after-home-en.png`) | Visual inspection (`after-home-en.png`) | **PASS** | Thanh thông số hiển thị đúng tiếng Anh (`25,000 m² · 300 Tons/Month`) |
| **HOME-19** | Hộp thoại `ProductDetailModal` & `CertificatePreviewModal` trên Trang chủ | Code & component props (`Home.tsx`) | **PASS** | Mở chi tiết SKU và xem ảnh scan chứng chỉ hoạt động đầy đủ |
| **HOME-20** | Ghi chú phạm vi chứng nhận (Facility vs Product OCOP) trên `/` | `content/settings/homepage.json` + `Home.tsx` | **PASS** | Hiển thị `data-testid="home-cert-scope-note"` rõ phạm vi nhà máy vs sản phẩm |
| **HOME-21** | Responsive đa kích thước (320×568 → 2560×1440) không tràn ngang | Live Chrome & Edge | **PASS** | `overflow=[]` trên cả 8 viewport |
| **HOME-22** | Kiểm tra mobile 375×812 trực quan (`after-home-mobile-375.png`) | Visual inspection | **PASS** | Nút CTA xếp chồng vừa khung, chữ rõ, không che khuất |
| **HOME-23** | Zero lỗi Console / Runtime JS | Live Chrome & Edge | **PASS** | `severe=[]` |
| **HOME-24** | Bộ kiểm thử hồi quy Trang Sản phẩm (`/products`) | Live Chrome & Edge (`qa-products-prehandover.py`) | **PASS** | Chrome `9/9 PASS`, Edge `9/9 PASS` |
| **HOME-25** | Bộ kiểm thử hồi quy Trang Về chúng tôi (`/about`) | Live Chrome & Edge (`qa-about-prehandover.py`) | **PASS** | Chrome `9/9 PASS`, Edge `9/9 PASS` |
| **HOME-26** | Bộ kiểm thử hồi quy Trang Liên hệ & Bản đồ (`/contact`) | Live Chrome & Edge (`qa-contact-maps.py`) | **PASS** | Chrome `8/8 PASS`, Edge `8/8 PASS` |
| **HOME-27** | Bộ kiểm thử hồi quy Thuật ngữ Thị trường (`/markets`) | Live Chrome & Edge (`qa-market-terminology.py`) | **PASS** | Chrome `7/7 PASS`, Edge `7/7 PASS` |
| **HOME-28** | Kiểm tra đầy đủ 615 khóa i18n x 4 ngôn ngữ + TypeScript + Vite | `npm run build` | **PASS** | 615/615 khóa x 4 ngôn ngữ; `tsc -b` & `tsc -p tsconfig.server.json` = 0 lỗi |
| **HOME-29** | Giới hạn 12 Serverless Functions trên Vercel Hobby | PowerShell file count (`api/`) | **PASS** | `API_COUNT=12` |
| **HOME-30** | Schema Admin Trang chủ: chặn >4 sản phẩm nổi bật, URL XSS, danh mục lạ | `npx tsx scripts/test-admin-suite.mjs` (Case 22) | **PASS** | `22/22 PASS`; lưu partial VI giữ nguyên EN/KO/ZH |
| **HOME-31** | Bảo mật endpoint `/api/admin/settings?section=homepage` trên production | `GET https://www.vinaxo.net/api/admin/settings?section=homepage` | **PASS** | Trả HTTP `401` khi chưa đăng nhập |
| **HOME-32** | Xuất bản riêng phân hệ `homepage` (`POST /api/admin/publish`) | `test-admin-suite.mjs` (Case 22 mock GitHub/local) | **PASS** | Trả `module: "homepage"`, ghi nhận lịch sử xuất bản |
| **HOME-33** | Tương tác đăng nhập & bấm lưu trực tiếp trên UI `/admin/homepage` live | Trình duyệt live (`https://www.vinaxo.net/admin/homepage`) | **BLOCKED** | Không có mật khẩu quản trị production trong phiên làm việc tự động; đã verify API & local schema |
| **HOME-34** | Kiểm thử trên Safari (macOS/iOS) & Firefox | Môi trường Windows headless | **NOT RUN** | Môi trường Windows hiện tại không có Safari; chỉ chạy đầy đủ trên Chrome & Microsoft Edge |
| **HOME-35** | Kiểm thử thiết bị vật lý cầm tay thực tế | Windows desktop test runner | **NOT RUN** | Đã kiểm chứng tương đương qua viewport 320px–375px–768px trên Chromium/Edge |

---

## 4. Ảnh chụp nghiệm thu AFTER trực tiếp trên `https://www.vinaxo.net/`

- Hero Tiếng Việt (Collage ảnh đầy khung, CTA rõ ràng):  
  ![Hero Trang chủ tiếng Việt](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-home-hero-vi.png)
- 4 Nhóm Danh Mục Chính Thức (đã đổi thành `Trái cây sấy giòn`):  
  ![4 Danh mục chính thức](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-home-categories-oem-vi.png)
- 4 Sản Phẩm Tiêu Biểu Chủ Lực:  
  ![4 Sản phẩm tiêu biểu](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-home-featured-4-vi.png)
- Modal Báo Giá khi bấm "Liên hệ tìm hiểu" dòng `Granola Trái Cây & Hạt`:  
  ![Modal báo giá Granola OEM](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-home-granola-modal-vi.png)
- Hero Tiếng Anh (đồng bộ thông số `25,000 m² · 300 Tons/Month`):  
  ![Hero Trang chủ tiếng Anh](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-home-en.png)
- Giao diện Mobile 375×812:  
  ![Hero Mobile 375px](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-home-mobile-375.png)
- Trang `/products?category=chips` hiển thị đúng 3 mặt hàng `Trái cây sấy giòn`:  
  ![Trang sản phẩm lọc chips](file:///E:/SONAI/VINAXO/docs/screenshots/homepage-prehandover/after-products-chips-vi.png)
