# BÁO CÁO KIỂM TRA, CHUẨN HÓA HÌNH ẢNH, THƯ VIỆN GALLERY & QUẢN TRỊ ADMIN CMS TRANG VỀ CHÚNG TÔI (`/about`)

- **Ngày báo cáo:** 2026-11-27
- **Website Production:** `https://www.vinaxo.net/about` | **Admin CMS:** `https://www.vinaxo.net/admin/about`
- **Kho lưu trữ:** `lap2004/VINAOX` (`personal`) & `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO` (`origin`) — Nhánh production: `main`
- **Các Commit đã triển khai lên `main`:**
  - Feature commit: `a6876e9` (`fix/about-images-gallery-cms`, 31 files) → Merge `--no-ff` vào `main` tại **`dadbb38`** (`dadbb382f6b3750ce669aca98098a6ab75ef4bc4`)
  - Commit tối ưu CSS khung ảnh 16:10 & lưới Gallery 3×2: **`7e447f5`** (`7e447f506f69b3aa7c2bd95119a4eeeee28c7595`)
- **Bundle Production đã xác minh trên live (`https://www.vinaxo.net/about`):**
  - JS: `dist/assets/index-aAOm7Ze-.js` | CSS: `dist/assets/index-DYVp4R-r.css`
  - `og:image`: `https://www.vinaxo.net/assets/images/factory-2026/factory-featured.jpg`
  - Header xác thực Vercel: `x-vercel-id: hkg1::55clk-1795749627536-3a1aa0e220b9` (trang công khai) & `hkg1::iad1::pxl8j-1795749389662-f1fadeb30013` (`GET /api/admin/settings?section=about` trả `401` khi chưa đăng nhập)
- **Ngôn ngữ hỗ trợ:** Tiếng Việt (`vi`), Tiếng Anh (`en`), Tiếng Hàn (`ko`), Tiếng Trung giản thể (`zh-CN`)

---

## 1. Tóm tắt Điều hành (Executive Summary)

Đợt kiểm tra và tối ưu trước bàn giao (Pre-Handover) đối với trang **Về chúng tôi (`/about`)**, **Thư viện ảnh nhà máy**, **Cửa sổ xem ảnh (Lightbox)** và **Admin CMS (`/admin/about`)** đã xử lý triệt để cả **2 hạng mục lỗi thực tế (P2-01, P2-02)** cùng toàn bộ điểm rò rỉ thuật ngữ và cấu trúc dữ liệu liên quan:

1. **P2-01 — Thay thế hình ảnh phong cảnh không phù hợp cho Vùng nguyên liệu:**
   - Gỡ bỏ hoàn toàn ảnh `/assets/images/about_vietnam.webp`/`.jpg` (chụp cảnh sông nước và núi đá vôi không phải vùng trồng ĐBSCL) khỏi trang `/about` và khỏi thẻ `og:image` trong SEO metadata.
   - Không dùng ảnh minh họa AI từ thư mục tin tức (`news/mango-procurement.jpg`, `news/agricultural-production.jpg`, `news/fruit-processing.jpg`, `cta_landscape.jpg`) để giả làm ảnh vườn trồng hay cơ sở VINAXO.
   - Thay thế ô ảnh nổi bật đầu trang bằng ảnh thật tại xưởng VINAXO (`/assets/images/factory/factory-quality-sorting.webp`) kèm nhãn trung thực **"Nhà máy VINAXO • Đồng Tháp / Chế biến chuẩn sạch, nâng tầm nông sản Việt"**. Riêng mục **Vùng nguyên liệu liên kết ĐBSCL (`#sourcing-regions`)** trình bày dữ liệu xác thực bằng 4 thẻ thông tin địa danh (Đồng Tháp, Tân Phước, Chợ Gạo, Hậu Giang) và ghi chú chờ bổ sung ảnh vườn trồng thật từ doanh nghiệp.
2. **P2-02 — Đồng bộ Nhãn, Tiêu đề, Mô tả, Alt Text & Sửa ánh xạ Thư viện ảnh:**
   - Sửa triệt để lỗi ghép nhầm nhãn `"XẾP KHAY & SẤY VÔ TRÙNG"` với tiêu đề `"Dây chuyền dò kim loại & Đóng gói màng ngăn ẩm"` (Card 2) và `"HỆ THỐNG KHAY SẤY & SƠ CHẾ"` với `"Thu mua bao tiêu xoài & Trái cây mùa vụ"` (Card 3).
   - Chuẩn hóa **6 mục ảnh thật của nhà máy VINAXO** bằng cấu trúc đối tượng hợp nhất `AboutGalleryItem` trong `content/settings/about.json` & `src/shared/schemas/aboutSchema.ts`, đảm bảo nhãn, tiêu đề, mô tả và `alt` mô tả chính xác công đoạn thể hiện trong ảnh trên cả 4 ngôn ngữ.
   - Chuẩn hóa thuật ngữ kỹ thuật trên `About.tsx`, `brochureData.ts`, `Quality.tsx` và các từ điển `i18n`: loại bỏ `"sấy vô trùng"`, `"đồng phục vô trùng"`, `"đóng gói vô trùng"` (thay bằng `"xếp lát trái cây lên khay chuẩn bị sấy"`, `"đồng phục bảo hộ vệ sinh"`, `"đóng gói vệ sinh khép kín"`).
3. **Bổ sung Lightbox đồng bộ & Quản trị `/admin/about`:**
   - Xây dựng `AboutGalleryLightbox.tsx` tìm ảnh theo `id` duy nhất, hỗ trợ nút Trước/Tiếp, phím mũi tên/ESC, vuốt chạm trên mobile, tự động đổi đồng bộ ảnh + nhãn + tiêu đề + mô tả.
   - Xây dựng module Admin `/admin/about` (5 tab biên tập 4 ngôn ngữ, tái sử dụng `MediaPicker` với nhóm mới `about`, nút **"Cập nhật trang Về chúng tôi lên website"** xuất bản riêng `module: 'about'` kèm theo dõi tiến trình Vercel) mà vẫn giữ nguyên **12 Vercel Serverless Functions** trong `api/` (nằm gọn trong giới hạn Vercel Hobby).

---

## 2. Bảng Kiểm tra Toàn bộ Hình ảnh Trang Về chúng tôi (Image Audit Table)

| ID / Vị trí | Đường dẫn ảnh TRƯỚC | Nội dung ảnh thực tế (đã mở kiểm tra trực quan) | Nhãn & Tiêu đề TRƯỚC | Vấn đề phát hiện | Đường dẫn ảnh SAU & Cách xử lý |
|---|---|---|---|---|---|
| `highlightVisual` (Section 1, Cột 2) & `og:image` `/about` | `/assets/images/about_vietnam.webp` (`.jpg`) | Ảnh phong cảnh sông nước giữa núi đá vôi (vùng đá vôi miền Bắc) | Nhãn: `"Nông sản ĐBSCL"` • Alt EN: `"Lush karst mountains and river valleys in Vietnam"` | Sai vùng địa lý ĐBSCL; ảnh phong cảnh không phản ánh vùng trồng hay nhà máy VINAXO | **Thay bằng ảnh thật nhà máy** `/assets/images/factory/factory-quality-sorting.webp` (`.jpg`); đổi nhãn sang `"Nhà máy VINAXO • Đồng Tháp"`; cập nhật `og:image` thành `/assets/images/factory-2026/factory-featured.jpg`. |
| `infrastructure.image` (Section 3) | `/assets/images/factory-2026/factory-sub-3.webp` (`.jpg`, bản cắt nén độ phân giải thấp) | Công nhân VINAXO mặc áo đỏ, mũ trùm tóc/khẩu trang/găng tay đang tách múi mít tươi trên bàn inox | `alt="VINAXO fresh processing line"` (chưa dịch đa ngôn ngữ) | Ảnh độ phân giải thấp, thiếu `alt` 4 ngôn ngữ | **Nâng cấp lên bản gốc sắc nét cùng cảnh** `/assets/images/factory/factory-fresh-prep.webp` (`.jpg`) + `alt` đầy đủ 4 ngôn ngữ. |
| `gallery[0]` (`factory-sorting-hall`) | `/assets/images/factory-2026/factory-featured.webp` (`.jpg`) | Toàn cảnh xưởng lớn công nhân mặc đồng phục đỏ, mũ bảo hộ đang phân loại xoài sấy vàng tại bàn | `"TỔ HỢP NHÀ MÁY 25.000 M²"` / `"Khuôn viên phòng sạch & Buồng sấy nhiệt thấp"` | Ảnh không thể hiện buồng sấy 60°C hay kho lạnh; khung `height: 220px` cắt mất bối cảnh | **Giữ ảnh thật** `factory-2026/factory-featured.webp`; sửa nhãn thành `"Nhà máy chế biến"`, tiêu đề `"Khu phân loại và chế biến quy mô lớn"`, khung 16:10 đồng bộ. |
| `gallery[1]` (`tray-racking-line`) | `/assets/images/factory-2026/factory-sub-1.webp` (`.jpg`, bản cắt mờ từ `factory-featured-drying`) | Công nhân áo đỏ VINAXO xếp lát xoài vào xe đẩy khay lưới nhựa trắng nhiều tầng | Nhãn: **`"XẾP KHAY & SẤY VÔ TRÙNG"`** • Tiêu đề: **`"Dây chuyền dò kim loại & Đóng gói màng ngăn ẩm"`** | **P2-02:** Nhãn và tiêu đề mâu thuẫn; không phải máy dò kim loại/đóng gói; khẳng định `"sấy vô trùng"` không có căn cứ; ảnh mờ | **Nâng cấp bản sắc nét** `/assets/images/factory/factory-featured-drying.webp`; đổi nhãn `"Chuẩn bị nguyên liệu"`, tiêu đề `"Xếp lát trái cây lên khay chuẩn bị sấy"`, bỏ cụm `"sấy vô trùng"` & `"dò kim loại"`. |
| `gallery[2]` (`drying-tray-racks`) | `/assets/images/factory-2026/factory-sub-2.webp` (`.jpg`) | Các dãy xe đẩy khay sấy nhựa trắng đa tầng đặt trên sàn sạch trong xưởng | Nhãn: **`"HỆ THỐNG KHAY SẤY & SƠ CHẾ"`** • Tiêu đề: **`"Thu mua bao tiêu xoài & Trái cây mùa vụ"`** | **P2-02:** Ảnh là xe khay sấy trong nhà máy nhưng tiêu đề và mô tả lại nói về thu mua xoài ngoài vườn | **Giữ ảnh thật** `factory-2026/factory-sub-2.webp`; đổi nhãn `"Hạ tầng khay sấy"`, tiêu đề `"Hệ thống xe đẩy khay sấy công nghiệp đa tầng"`, mô tả khớp 100% ảnh. |
| `gallery[3]` (`fresh-fruit-prep`) | *(Mới bổ sung vào Gallery)* | Công nhân VINAXO tách múi mít tươi trên bàn inox trong xưởng | — | Chưa có trong Gallery | `/assets/images/factory/factory-fresh-prep.webp` — Nhãn `"Sơ chế nguyên liệu"`, tiêu đề `"Sơ chế và tách múi trái cây tươi trên bàn inox"`. |
| `gallery[4]` (`quality-sorting-weighing`) | *(Mới bổ sung vào Gallery)* | Công nhân kiểm tra và cân định lượng lát xoài trên cân điện tử bàn inox | — | Chưa có trong Gallery | `/assets/images/factory/factory-quality-sorting.webp` — Nhãn `"Kiểm tra & định lượng"`, tiêu đề `"Kiểm tra cảm quan và cân định lượng thành phẩm sau sấy"`. |
| `gallery[5]` (`retail-pouch-packing`) | *(Mới bổ sung vào Gallery)* | Công nhân đóng gói mít sấy dẻo vào túi zipper đứng mang nhãn VINAXO | — | Chưa có trong Gallery | `/assets/images/factory/factory-retail-packing.webp` — Nhãn `"Đóng gói thành phẩm"`, tiêu đề `"Đóng gói túi zipper thành phẩm Mít sấy dẻo VINAXO"`. |
| Các ảnh AI bị từ chối | `public/assets/images/news/mango-procurement.jpg`, `agricultural-production.jpg`, `fruit-processing.jpg`, `vinaxo-company-story.jpg`, `cta_landscape.jpg` | Ảnh AI minh họa (chữ vẽ lỗi trên hũ/thùng/áo, ruộng bậc thang miền Bắc) | — | Ảnh AI không phải ảnh thực tế vùng trồng hay nhà máy VINAXO | **Không sử dụng** cho trang Về chúng tôi; ghi rõ nhu cầu bổ sung ảnh vườn trồng thật từ VINAXO. |

---

## 3. Nguyên nhân Nhãn & Tiêu đề Không Đồng nhất & Thuật ngữ Đã Chuẩn hóa

- **Nguyên nhân kỹ thuật trước đây:**
  - `src/pages/About.tsx` tự ghép `galleryItems` bằng các key `i18n` rời rạc (`card1Tag`..`card3Desc`) với danh sách ảnh cứng, nên khi thay hoặc hoán đổi bộ ảnh `factory-2026` trong đợt trước, `card2` nhận ảnh xếp khay (`factory-sub-1`) nhưng text `i18n` vẫn là dò kim loại/đóng gói, còn `card3` nhận ảnh xe khay sấy (`factory-sub-2`) nhưng text `i18n` là thu mua xoài.
  - Chuỗi `"XẾP KHAY & SẤY VÔ TRÙNG"` xuất hiện ở cả `About.tsx` và `brochureData.ts`, kèm `"đồng phục vô trùng"`, `"đóng gói vô trùng"` (`Quality.tsx`) và `"sterile moisture-barrier packaging"` (`en.ts`) không có hồ sơ tiệt trùng thương mại đi kèm.
- **Thuật ngữ đã chuẩn hóa (4 ngôn ngữ `vi`, `en`, `ko`, `zh-CN`):**
  - Cập nhật tại [VINAXO_TRANSLATION_GLOSSARY.md](file:///e:/SONAI/VINAXO/docs/VINAXO_TRANSLATION_GLOSSARY.md#L100) (Mục 7): thay `"Sấy vô trùng"` → `"Xếp lát trái cây lên khay chuẩn bị sấy"`; `"đồng phục vô trùng"` → `"đồng phục bảo hộ vệ sinh"` (`src/data/brochureData.ts`); `"đóng gói vô trùng"` → `"đóng gói vệ sinh khép kín"` (`src/pages/Quality.tsx`); `"sterile..."` → `"hygienic..."` / `"protective..."` (`src/i18n/en.ts`, `ko.ts`).

---

## 4. Thay đổi Kiến trúc Dữ liệu & Giao diện `/about`

1. **Schema hợp nhất (`src/shared/schemas/aboutSchema.ts`) & CMS JSON (`content/settings/about.json`):**
   - Mỗi ảnh thư viện là một object `AboutGalleryItem` độc lập (`id`, `image`, `imageFallback`, `category`, `label`, `title`, `description`, `alt`, `sortOrder`, `visible`).
   - `validateAboutContent` chặn giao thức nguy hiểm (`javascript:`, `data:`, `..`, `/api/...`), kiểm tra trùng `id`, kiểm tra URL ảnh; `mergeAboutContent` bảo toàn bản dịch các ngôn ngữ khác khi chỉ chỉnh sửa 1 ngôn ngữ (ví dụ chỉ sửa `vi` không làm mất `en`, `ko`, `zh`).
2. **Giao diện `/about` & Lightbox (`src/pages/About.tsx`, `src/components/about/AboutGalleryLightbox.tsx`, `src/styles/responsive.css`):**
   - Đọc dữ liệu động qua `src/data/aboutContent.ts` (`import.meta.glob('/content/settings/about.json')`), cập nhật tức thì khi Admin xuất bản.
   - Bổ sung bộ lọc nhóm (`Tất cả (6)`, `Nhà máy chế biến (1)`, `Chuẩn bị nguyên liệu (2)`, `Chế biến & Hạ tầng sấy (1)`, `Kiểm soát chất lượng (1)`, `Đóng gói thành phẩm (1)`), lưới cân đối **3×2** trên desktop / **2×3** trên tablet / **1 cột** trên mobile, khung ảnh `16:10` với `.about-gallery-thumb-btn picture { width: 100%; height: 100%; }` lấp đầy khung đều đẹp.
   - Lightbox định danh bằng `activeId` (`item.id`), hỗ trợ nút Trước/Tiếp, bàn phím (`ArrowLeft`, `ArrowRight`, `Escape`), vuốt chạm mobile (`>= 40px`), khóa cuộn nền, tự động đồng bộ ảnh + nhãn + tiêu đề + mô tả + `alt` + bộ đếm `2 / 6`.

---

## 5. Nâng cấp Hệ thống Quản trị Admin CMS (`/admin/about`)

- **Kiến trúc tối ưu giữ nguyên 12 Vercel Serverless Functions (giới hạn Vercel Hobby):**
  - Mở rộng `server/admin/settings.ts` hỗ trợ `?section=about` (đọc/ghi/validate/merge `content/settings/about.json` với commit `cms(about): update about page content & gallery`), tái sử dụng endpoint `api/admin/settings.mjs` mà không phát sinh file serverless thứ 13.
  - Mở rộng `server/admin/publish.ts` thêm phân hệ `'about'` (`Trang Về chúng tôi`) và thống kê `aboutGallery` (`total`, `visible`).
  - Mở rộng `server/admin/media.ts` & `src/admin/components/MediaPicker.tsx` thêm danh mục `'about'` (bao gồm thư mục tải lên `public/uploads/about/` và danh sách ảnh nhà máy VINAXO đã xác minh để chọn lại dễ dàng).
- **Module mới `src/admin/pages/AdminAbout.tsx` (Sidebar `"Về chúng tôi"` & Dashboard quick-publish):**
  - 5 tab: `Thư viện hình ảnh` (thêm/xóa/ẩn-hiện/đổi thứ tự lên xuống/chọn & upload qua `MediaPicker`/cảnh báo thiếu dịch/xem trước Lightbox), `Giới thiệu & Ảnh nổi bật`, `Nhà máy & Vùng nguyên liệu`, `Chỉ số & Lịch sử`, `Xem trước` (chuyển đổi 4 ngôn ngữ `VI`/`EN`/`KO`/`ZH-CN`).
  - Quy trình xuất bản riêng nhóm Về chúng tôi: **Lưu thay đổi → Xem trước → Bấm "Cập nhật trang Về chúng tôi lên website" → Theo dõi trạng thái `/api/admin/deployStatus` từ GitHub/Vercel**, không làm xuất bản nhầm bản nháp Tin tức hoặc Sản phẩm.

---

## 6. Kết quả Kiểm thử Build, Unit Test & Trình duyệt Thực tế (Local & Live Production)

### 6.1. Build & Automated Node Suites (Chạy sau lần chỉnh sửa code cuối cùng)
| Kiểm thử | Kết quả | Chi tiết xác minh |
|---|---|---|
| `npm run build` | **PASS** | `check:i18n`: **615/615** khóa trên cả 4 file (`vi`, `en`, `ko`, `zh-CN`); `tsc -b` & `tsc -p tsconfig.server.json --noEmit` 0 lỗi; `build-api.mjs`: **12 handlers** (`API_COUNT=12`); `vite build`: `index-aAOm7Ze-.js` & `index-DYVp4R-r.css`; `generate-seo-artifacts.mjs`: 29 URLs trong `public/sitemap.xml`. |
| `node scripts/test-seo-and-inquiry.mjs` | **11/11 PASS** | Bao gồm kiểm tra `og:image`, SEO schema 4 ngôn ngữ, inquiry & logistics/product regression. |
| `npx tsx scripts/test-admin-suite.mjs` | **21/21 PASS** | Bao gồm **Case 21**: kiểm tra từ chối URL `javascript:`, bảo toàn bản dịch `en`/`ko`/`zh` khi sửa từng phần `vi`, đổi thứ tự gallery bảo toàn metadata, auth `401`, CSRF và xuất bản `module: 'about'`. |

### 6.2. Kiểm thử Selenium Đa trình duyệt & Hồi quy
| Bộ kiểm thử | Local (`127.0.0.1:4173`) | Live (`https://www.vinaxo.net`) | Kết quả chi tiết |
|---|---|---|---|
| `scripts/qa-about-prehandover.py` (**Chrome**) | **9/9 PASS** | **9/9 PASS** | Kiểm tra 4 ngôn ngữ (0 `about_vietnam`, 0 `"sấy vô trùng"`, 0 `"dò kim loại"` sai), 0 ảnh 404, lọc danh mục (6 → 2 → 6), Lightbox sync & phím/nút Next/Prev/Escape, 10 viewports (`320×568`→`2560×1440`) 0 tràn ngang, `/admin/about -> /admin/login`, 0 lỗi Console SEVERE. |
| `scripts/qa-about-prehandover.py` (**Edge**) | **9/9 PASS** | **9/9 PASS** | Toàn bộ 9 hạng mục tương tự trên Microsoft Edge Headless. |
| `scripts/qa-products-prehandover.py` (**Chrome**) | **9/9 PASS** | **9/9 PASS** *(commit `dadbb38`)* | Hồi quy trang `/products`, modal 12 SKUs, đồng bộ bảng thông số & báo giá. |
| `scripts/qa-contact-maps.py` (**Chrome**) | **8/8 PASS** | **8/8 PASS** *(commit `dadbb38`)* | Hồi quy trang `/contact`, Google Maps & form. |
| `scripts/qa-market-terminology.py` (**Chrome**) | **7/7 PASS** | **7/7 PASS** *(commit `dadbb38`)* | Hồi quy trang `/global-market` & thuật ngữ FOB/CIF, FCL/LCL. |
| Live API guard check (`GET /api/admin/settings?section=about`) | — | **PASS (`401`)** | `hkg1::iad1::pxl8j-1795749389662-f1fadeb30013` trả `{"error":"Yêu cầu đăng nhập quản trị."}` khi chưa có cookie phiên. |

---

## 7. Ma trận Tiêu chí Nghiệm thu (`ABOUT-01` → `ABOUT-30`)

| ID | Tiêu chí nghiệm thu | Trạng thái | Bằng chứng & Ghi chú trung thực |
|---|---|---|---|
| **ABOUT-01** | Không còn sử dụng ảnh phong cảnh không phù hợp để đại diện vùng nguyên liệu | **PASS** | Đã gỡ hoàn toàn `about_vietnam.webp`/`.jpg`; `MULTILANG-CONTENT-*` xác nhận 0 ảnh `about_vietnam` trên live; cập nhật cả `og:image`. |
| **ABOUT-02** | Hình ảnh thay thế có nguồn gốc phù hợp | **PASS** | Dùng 6 ảnh thật tại phân xưởng nhà máy VINAXO (`public/assets/images/factory/*` & `factory-2026/*`, áo đồng phục & bao bì VINAXO rõ nét); chưa gắn ảnh vườn trồng vì doanh nghiệp chưa cung cấp ảnh vườn thật. |
| **ABOUT-03** | Không sử dụng ảnh giả làm ảnh VINAXO | **PASS** | Đã loại trừ toàn bộ ảnh AI từ thư mục tin tức và ảnh phong cảnh. |
| **ABOUT-04** | Nhãn và tiêu đề hình ảnh đồng nhất | **PASS** | Cả 6 thẻ trong `content/settings/about.json` & `About.tsx` được đồng bộ chính xác 1:1 qua 4 ngôn ngữ. |
| **ABOUT-05** | Mô tả phù hợp nội dung ảnh | **PASS** | Kiểm tra trực quan cả 6 ảnh và đối chiếu mô tả trên VI/EN/KO/ZH-CN. |
| **ABOUT-06** | Alt text chính xác | **PASS** | Đã thay `alt` mới cho Highlight Card, Infrastructure image và 6 ảnh Gallery qua 4 ngôn ngữ. |
| **ABOUT-07** | Không gán sai công đoạn sản xuất | **PASS** | Xóa bỏ hoàn toàn nhãn `"Dò kim loại & Đóng gói"` trên ảnh xếp khay và `"Thu mua xoài"` trên ảnh xe khay sấy. |
| **ABOUT-08** | Thuật ngữ kỹ thuật có căn cứ | **PASS** | Loại bỏ `"sấy vô trùng"`, `"đồng phục vô trùng"`, `"đóng gói vô trùng"`, `"sterile"` khỏi `About.tsx`, `brochureData.ts`, `Quality.tsx`, `i18n`, `about.json`. |
| **ABOUT-09** | Modal (Lightbox) mở đúng hình ảnh | **PASS** | `LIGHTBOX-SYNC-AND-NAVIGATION` mở card #2 (`tray-racking-line`) → hiển thị đúng ảnh, nhãn, tiêu đề & bộ đếm `2 / 6`. |
| **ABOUT-10** | Chuyển ảnh cập nhật đúng metadata | **PASS** | Bấm Next / phím Arrow cập nhật đồng thời `data-active-gallery-id`, `src` ảnh, nhãn, tiêu đề, mô tả & bộ đếm `3 / 6`. |
| **ABOUT-11** | Thay đổi thứ tự không gây sai mapping | **PASS** | Quản lý theo object hợp nhất `AboutGalleryItem` + React key `item.id` + xác minh reorder trong `test-admin-suite.mjs` Case 21. |
| **ABOUT-12** | Không có ảnh lỗi 404 | **PASS** | `IMAGES-NO-404` trên Chrome & Edge (local & live) xác nhận 100% ảnh `complete && naturalWidth > 0`. |
| **ABOUT-13** | Admin chỉnh sửa được nội dung trang | **PASS** | `AdminAbout.tsx` hỗ trợ sửa Hero, Story, Infrastructure, Sourcing, Metrics, Milestones + API `POST /api/admin/settings?section=about` (Case 21 PASS). |
| **ABOUT-14** | Admin thay thế được hình ảnh | **PASS** | Tích hợp `MediaPicker` (cả tab Thư viện & Upload nhóm `about`) cho Highlight, Infrastructure và Gallery; đã test API & component build. |
| **ABOUT-15** | Admin thêm và xóa bản ghi hình ảnh | **PASS** | `handleAddGalleryItem`, `handleDeleteGalleryItem` + validation server trong `AdminAbout.tsx` & `aboutSchema.ts`. |
| **ABOUT-16** | Admin chỉnh sửa nhãn, tiêu đề và mô tả | **PASS** | `LocalizedInputField` chỉnh sửa đầy đủ 4 ngôn ngữ kèm cảnh báo ô chưa dịch. |
| **ABOUT-17** | Admin lưu và xem trước được nội dung | **PASS** | Tab `Xem trước` hỗ trợ chuyển nhanh 4 ngôn ngữ + xem trước Lightbox; nút Lưu gọi `POST /api/admin/settings?section=about` (Case 21 PASS). |
| **ABOUT-18** | Có chức năng cập nhật riêng nhóm Về chúng tôi | **PASS** | Nút `"Cập nhật trang Về chúng tôi lên website"` & card dashboard gọi `POST /api/admin/publish` với `module: 'about'` + theo dõi `deployStatus`. |
| **ABOUT-19** | Nội dung mới hiển thị trên production | **PASS** | Đã xác minh live `https://www.vinaxo.net/about` chạy `index-aAOm7Ze-.js` / `index-DYVp4R-r.css` và qua 9/9 kiểm thử Chrome & Edge. |
| **ABOUT-20** | Không xuất bản nhầm dữ liệu module khác | **PASS** | `publish.ts` ghi nhận riêng `module: 'about'` tách biệt khỏi `products` và `news` (Case 21 PASS). *(Lưu ý: thao tác đăng nhập bấm xuất bản trực tiếp trên UI live không chạy vì không dùng tài khoản Admin production trong phiên QA tự động — đã kiểm chứng qua API/integration suite cục bộ và endpoint live trả `401` đúng chuẩn bảo vệ).* |
| **ABOUT-21** | Không làm mất bản dịch | **PASS** | `check:i18n` **615/615** × 4 ngôn ngữ; `mergeAboutContent` bảo toàn `en`/`ko`/`zh` khi chỉ sửa `vi` (Case 21 PASS). |
| **ABOUT-22** | Responsive mobile | **PASS** | `RESPONSIVE-10-VIEWPORTS` (`320×568`, `360×800`, `390×844`, `430×932`) 0 tràn ngang, Lightbox gọn trong `390×844`; xem trực quan `after-about-mobile-390.png`. |
| **ABOUT-23** | Responsive laptop 14 và 15.6 inch | **PASS** | Kiểm tra tự động tại `1366×768`, `1440×900`, `1920×1080` trên Chrome & Edge (0 tràn ngang). |
| **ABOUT-24** | Responsive desktop 24 và 27 inch | **PASS** | Kiểm tra tự động tại `1920×1080`, `2560×1440` trên Chrome & Edge (lưới 3×2 cân đối, 0 tràn ngang). *(Kiểm tra thủ công Windows Display Scaling 125%/150% và trình duyệt Safari / Firefox / điện thoại thật: **NOT RUN**).* |
| **ABOUT-25** | SEO metadata chính xác | **PASS** | `routeMetadata.ts` & `generate-seo-artifacts.mjs` cập nhật `og:image` sang `factory-featured.jpg`; xác minh HTML live trả đúng thẻ mới. |
| **ABOUT-26** | Production build thành công | **PASS** | `npm run build` hoàn tất sạch sẽ, tạo `12` API handlers và bundle mới nhất. |
| **ABOUT-27** | Không có lỗi JavaScript Runtime | **PASS** | `ADMIN-ROUTE-AND-CONSOLE-CLEAN` ghi nhận `severe=[]` trên Chrome & Edge (local & live). |
| **ABOUT-28** | Không ảnh hưởng các trang khác | **PASS** | Đã chạy hồi quy đầy đủ `qa-products-prehandover.py` (9/9), `qa-contact-maps.py` (8/8), `qa-market-terminology.py` (7/7), `test-seo-and-inquiry.mjs` (11/11). |
| **ABOUT-29** | Website không bị trắng sau deployment | **PASS** | Live `https://www.vinaxo.net/about` và các trang con render đầy đủ qua 4 ngôn ngữ. |
| **ABOUT-30** | Giữ nguyên dữ liệu CMS hiện tại | **PASS** | Giữ nguyên toàn bộ 12 JSON sản phẩm, 9 bài viết tin tức, 6 chứng nhận, cấu hình công ty & brochure. |

---

## 8. Bằng chứng Ảnh chụp TRƯỚC / SAU (BEFORE / AFTER Screenshots)

Tất cả 8 ảnh bằng chứng chụp trực tiếp từ Production `https://www.vinaxo.net/about` được lưu tại `docs/screenshots/about-prehandover/`:

### 8.1. Ảnh BEFORE (Hiện trạng lỗi trước đợt sửa)
- [before-about-visual-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/before-about-visual-vi.png) — Ô ảnh đầu trang dùng cảnh núi đá vôi (`about_vietnam.webp`) gắn nhãn `"NÔNG SẢN ĐBSCL"`.
- [before-about-gallery-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/before-about-gallery-vi.png) — Thẻ 2 gán `"XẾP KHAY & SẤY VÔ TRÙNG"` kèm tiêu đề `"Dây chuyền dò kim loại..."`; Thẻ 3 dùng ảnh xe khay sấy kèm tiêu đề `"Thu mua bao tiêu xoài..."`.

### 8.2. Ảnh AFTER (Xác minh trực tiếp trên Live sau `7e447f5`)
- [after-about-visual-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/after-about-visual-vi.png) — Ô ảnh đầu trang hiển thị ảnh thật công nhân nhà máy VINAXO cân xoài sấy với nhãn `"NHÀ MÁY VINAXO • ĐỒNG THÁP"`.
- [after-about-gallery-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/after-about-gallery-vi.png) — Bộ lọc nhóm & lưới 3×2 cân đối, 6 ảnh nhà máy thật lấp đầy khung 16:10, nhãn/tiêu đề/mô tả khớp 100% nội dung từng ảnh.
- [after-about-lightbox-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/after-about-lightbox-vi.png) — Lightbox mở ảnh #2 (`2 / 6`) với tỷ lệ ảnh gốc sắc nét, nhãn & tiêu đề đồng bộ `"Xếp lát trái cây lên khay chuẩn bị sấy"`.
- [after-about-mobile-390.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/after-about-mobile-390.png) — Giao diện mobile `390×844` gọn gàng, bộ lọc tự xuống dòng, ảnh tràn đều 16:10, 0 tràn ngang.
- [after-about-ko.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/after-about-ko.png) — Phiên bản Tiếng Hàn (`ko`) đầy đủ, font rõ ràng, đồng bộ từ nhãn đến nút bấm.
- [after-about-zh-cn.png](file:///e:/SONAI/VINAXO/docs/screenshots/about-prehandover/after-about-zh-cn.png) — Phiên bản Tiếng Trung giản thể (`zh-CN`) đầy đủ, đồng nhất.

---

## 9. Danh sách File Đã Tạo / Sửa Đổi

- **Schema, Dữ liệu & CMS JSON:** `src/shared/schemas/aboutSchema.ts`, `src/data/aboutContent.ts`, `content/settings/about.json`, `public/uploads/about/.gitkeep`
- **Public UI & Styles:** `src/pages/About.tsx`, `src/components/about/AboutGalleryLightbox.tsx`, `src/styles/responsive.css`, `src/pages/Quality.tsx`, `src/data/brochureData.ts`
- **Multilingual & SEO:** `src/i18n/vi.ts`, `src/i18n/en.ts`, `src/i18n/ko.ts`, `src/i18n/zhCN.ts`, `src/components/seo/routeMetadata.ts`, `scripts/generate-seo-artifacts.mjs`, `public/sitemap.xml`, `docs/VINAXO_TRANSLATION_GLOSSARY.md`
- **Admin CMS & Backend Serverless:** `src/admin/pages/AdminAbout.tsx`, `src/admin/pages/AdminDashboard.tsx`, `src/admin/components/AdminLayout.tsx`, `src/admin/components/MediaPicker.tsx`, `src/App.tsx`, `server/admin/settings.ts`, `server/admin/publish.ts`, `server/admin/media.ts`, và các bundle `api/admin/*.mjs` tương ứng (vẫn giữ đúng 12 Serverless Functions).
- **Kiểm thử & Tài liệu:** `scripts/test-admin-suite.mjs`, `scripts/qa-about-prehandover.py`, `docs/screenshots/about-prehandover/*`, `docs/VINAXO_ABOUT_PAGE_IMAGE_CONTENT_FIX_REPORT.md`

---

## 10. Hình ảnh Cần VINAXO Bổ sung & Thông tin Cần Xác nhận

1. **Hình ảnh cần VINAXO cung cấp thêm (tải lên trực tiếp qua `/admin/about` → Tab `Thư viện hình ảnh` → `Thêm ảnh`):**
   - Ảnh chụp thật **vườn xoài Cát Chu / Hòa Lộc (Đồng Tháp)**, **vườn thanh long Chợ Gạo (Tiền Giang)**, **vườn khóm Tân Phước / vườn mít** và **hoạt động thu mua / vận chuyển nguyên liệu tươi về nhà máy**.
   - Ảnh chụp thật **máy dò kim loại** và **dây chuyền buồng sấy nhiệt thấp (~60°C)** / **kho lạnh** (nếu doanh nghiệp muốn hiển thị riêng từng thiết bị với chú thích chính xác).
2. **Thông tin & nghiệm thu thủ công cần VINAXO xác nhận:**
   - **Tầm nhìn, Sứ mệnh & Giá trị cốt lõi (`visionMission`):** Hiện để tắt (`enabled: false`) vì không tự ý soạn nội dung chưa được phê duyệt; VINAXO có thể điền văn bản chính thức và bật hiển thị trong tab `Giới thiệu & Ảnh nổi bật` của `/admin/about`.
   - **Rà soát ngôn ngữ bản địa (`ko`, `zh-CN`):** Khuyến nghị bộ phận thị trường Hàn Quốc / Trung Quốc rà soát sắc thái câu chữ chuyên ngành của 6 thẻ Gallery và phần giới thiệu nhà máy.
   - **Kiểm thử đăng nhập `/admin/about` trên Production & thiết bị ngoài Chromium (`NOT RUN`):** Khuyến nghị quản trị viên đăng nhập `https://www.vinaxo.net/admin/about` lưu thử 1 bản nháp/xuất bản và mở nhanh `https://www.vinaxo.net/about` trên Safari iOS / Firefox desktop cùng Windows Scaling 125%–150%.
   - **Blocker liên thông từ hạng mục trước:** Biến môi trường `RESEND_API_KEY` / `BREVO_API_KEY` trên Vercel cho form gửi báo giá/liên hệ (`/api/contact`) vẫn cần VINAXO cấu hình để hoàn tất gửi email thực tế (`PRODUCT-14`).
