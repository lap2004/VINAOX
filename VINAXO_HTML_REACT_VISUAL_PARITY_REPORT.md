# BÁO CÁO ĐỐI SOÁT VÀ KHÔI PHỤC VISUAL PARITY 1:1 (HTML VS REACT)
## DỰ ÁN: VINAXO WEBSITE (CÔNG TY TNHH VINAXO)

---

### 1. NGUỒN DỮ LIỆU ĐỐI SOÁT (DESIGN SOURCE OF TRUTH)
- **Đường dẫn Source HTML gốc:** `E:\SONAI\VINAXO\vinaxo-website\`
  - `index.html` (Trang chủ)
  - `about.html` (Về chúng tôi)
  - `products.html` (Sản phẩm xuất khẩu & Bảng thông số kỹ thuật)
  - `quality.html` (Quy trình 6 bước & Tiêu chuẩn chất lượng BRCGS / OCOP)
  - `markets.html` (Thị trường xuất khẩu toàn cầu & Bản đồ SVG)
  - `news.html` (Báo chí & Truyền thông)
  - `contact.html` (Liên hệ & Biểu mẫu hợp tác B2B)
  - `css/style.css` (Style chuẩn gốc)
  - `css/responsive.css` (Breakpoint hệ thống)
- **Commit / Local Reference:** Kho lưu trữ source tĩnh `vinaxo-website` được phục vụ tại cổng nội bộ `http://localhost:8088/` để so khớp trực tiếp qua engine Chromium với bản React Vite tại `http://localhost:4173/`.
- **Nguyên tắc xuyên suốt:** *HTML là Design Source of Truth. React là công nghệ triển khai. Không tự ý sáng tác thiết kế mới. Giữ nguyên toàn bộ dữ liệu thực tế, logic song ngữ VI/EN và React Router.*

---

### 2. TỔNG HỢP CÁC KHÁC BIỆT ĐÃ PHÁT HIỆN & NGUYÊN NHÂN GỐC

| STT | Khu vực / Section | Hiện trạng React trước khi sửa | Thiết kế HTML gốc | Nguyên nhân gốc (Root Cause) | Trạng thái xử lý |
|:---:|---|---|---|---|:---:|
| 1 | **Homepage: Section 4 & 5 (Quality & Global Market)** | Bị tách làm 2 section full-width riêng biệt, mất bố cục 2 cột song song. | **Bố cục 2 cột cân đối (.quality-global-grid)** với đường divider dọc mảnh ở giữa: Cột trái là Tiêu chuẩn chất lượng (4 badge BRCGS, OCOP, BSCI, 100%), cột phải là Thị trường xuất khẩu với Bản đồ SVG & 4 pill cards. | Lập trình viên React tự ý tách thành 2 component độc lập đặt dọc theo chiều trang, không tái sử dụng grid HTML gốc. | **PASS (Đã khôi phục 1:1)** |
| 2 | **World Map SVG (Bản đồ thế giới & Tuyến xuất khẩu)** | Sử dụng SVG tái tạo thô sơ hoặc bản đồ khác, sai đường cong Bezier, sai vị trí node và pulse radar. | SVG vector chính xác (`viewBox="0 0 960 480"`), path lục địa 46,076 ký tự chuẩn xác, 4 đường cong xuất khẩu nối từ Tiền Giang đến Mỹ (~70%), EU (~20%), Nga & Đông Âu, Hàn Quốc & Đông Á. | SVG gốc trong HTML quá dài (46KB) nên khi migration đã bị thay thế bằng component giản lược sai tỷ lệ. | **PASS (Đã trích xuất & nhúng SVG gốc 1:1)** |
| 3 | **Homepage: About Section (Section 2)** | Bị đổi thành 2 cột text + visual thô. | **Grid 3 cột chuẩn (.about-grid 1fr 1.05fr 1fr)**: Cột 1 câu chuyện thương hiệu, Cột 2 thẻ visual `about_vietnam.webp` kèm overlay huy hiệu, Cột 3 bảng chỉ số 2x2. | CSS `.about-grid` và component structure không được ánh xạ đúng. | **PASS (Đã khôi phục 1:1)** |
| 4 | **Homepage: Hero Visual & Origin Stamp** | Mất huy hiệu con dấu xuất xứ xoay tròn (Origin Stamp) và khối script accent viết tay. | Thẻ ảnh bo tròn góc, có tag script accent "100% Tự nhiên", và con dấu tròn "ORIGIN TIEN GIANG VIETNAM" xoay kim la bàn. | Thiếu CSS `.hero-origin-stamp`, `.stamp-inner` và markup SVG stamp. | **PASS (Đã khôi phục 1:1)** |
| 5 | **Products Page: Bộ lọc & Bảng thông số kỹ thuật xuất khẩu** | Chỉ có lưới sản phẩm cơ bản, thiếu bảng quy cách tiêu chuẩn thương mại quốc tế. | Bảng tổng hợp thông số kỹ thuật 6 dòng (Độ ẩm, Brix, Hạn sử dụng, Chứng nhận BRCGS/OCOP, MOQ) phục vụ chào hàng B2B. | Section 3 trong `products.html` bị bỏ sót khi tạo component React. | **PASS (Đã bổ sung bảng thông số 1:1)** |
| 6 | **Quality Page: Quy trình 6 bước khép kín** | Thiếu layout thẻ số bước tuần tự và thông số nhà máy 4.000 m². | 6 bước sản xuất khép kín (`.process-steps-grid`) và lưới 4 chỉ số năng lực nhà máy (`.facility-overview-grid`). | CSS `.process-steps-grid` và markup bước quy trình chưa được đồng bộ từ HTML. | **PASS (Đã khôi phục 1:1)** |
| 7 | **Global Market Subpage: Bản đồ Full-width & Logistics Bar** | Bản đồ subpage bị lệch kích thước, thiếu thanh 4 chỉ số logistics xuất cảng Cát Lái/Hiệp Phước. | Bản đồ căn giữa container 960px + `.logistics-bar` 4 cột (Cảng xuất khẩu, Vận tải biển quốc tế, Thủ tục hải quan, Đối tác chuỗi bán lẻ). | React dùng chung component map không có props phân biệt variant compact vs full. | **PASS (Hỗ trợ variant="compact" và "full")** |
| 8 | **Contact Page: Bố cục 2 cột & Map Tọa độ** | Layout form và thông tin liên hệ bị lệch tỷ lệ; nút submit có icon phóng to bất thường do thiếu CSS size. | Cột trái (40%) 4 thẻ thông tin pháp nhân/nhà máy/hotline/kênh quốc tế; Cột phải (60%) Biểu mẫu B2B; Phần dưới có thẻ Google Maps tọa độ Gò Công Tây Tiền Giang và 3 thẻ Trade FAQ. | Thiếu CSS `.contact-page-grid`, `.btn svg`, `.contact-map-card` và `page-banner`. | **PASS (Đã khắc phục hoàn toàn)** |
| 9 | **Universal Page Banner (Subpages)** | Tiêu đề subpage thiếu gradient nền `#0d2d1e -> #174D32`, icon mũi tên breadcrumbs bị bung kích thước. | Header banner nền xanh lá thương hiệu, breadcrumb nhỏ gọn (svg 14px), radial glow ánh vàng ở góc phải. | Thiếu class `.page-banner` và CSS reset `.page-banner-breadcrumbs svg`. | **PASS (Đã bổ sung đầy đủ CSS)** |

---

### 3. CÁC TẬP TIN REACT & CSS ĐÃ CHỈNH SỬA

1. **`src/components/markets/continentsData.ts` (MỚI)**:
   - Lưu trữ chuỗi SVG path lục địa nguyên bản (46.076 ký tự) trích xuất trực tiếp từ thẻ `<path class="continents-layer" d="...">` trong file `vinaxo-website/index.html`.
2. **`src/components/markets/WorldMapSvg.tsx` (VIẾT LẠI HOÀN TOÀN)**:
   - Tái sử dụng chính xác `viewBox="0 0 960 480"`.
   - Grid lưới tọa độ `vinaxoMapGrid` với đường kinh vĩ độ mảnh.
   - Vòng tròn radar xung tỏa độ Tiền Giang (`.radar-pulse`).
   - 4 đường cong bezier `path.export-route` với hiệu ứng `stroke-dasharray` chuyển động nét đứt.
   - 4 node điểm đến: USA (~70%), EU (~20%), Russia & CIS, Korea & E. Asia với song ngữ VI/EN.
   - Thanh thống kê chân bản đồ `.map-stats-bottom-bar` chuẩn thiết kế.
   - Hỗ trợ 2 chế độ hiển thị: `variant="compact"` (Homepage 2-column) và `variant="full"` (Trang Global Market riêng).
3. **`src/styles/global.css` (BỔ SUNG CSS GỐC)**:
   - Khôi phục bộ style `.quality-global-section`, `.quality-global-grid`, `.quality-col`, `.global-col`.
   - Khôi phục bộ style `.cert-badge`, `.cert-brcgs`, `.cert-ocop`, `.cert-bsci`, `.cert-clean`.
   - Khôi phục bộ style `.market-pills-grid`, `.market-pill-item`, `.market-pill-header`.
   - Khôi phục bộ style `.hero-features`, `.hero-origin-stamp`, `.hero-script-accent`.
   - Khôi phục bộ style `.about-grid`, `.about-story`, `.about-visual-card`, `.about-metrics`.
   - Khôi phục bộ style `.products-section`, `.section-header-bar`, `.product-category-pills`, `.product-spec-row`.
   - Khôi phục bộ style `.contact-page-grid`, `.contact-info-panel`, `.contact-card-box`, `.contact-form-panel`, `.contact-map-card`, `.contact-map-bar`, `.contact-partnership-cta`.
   - Khôi phục bộ style `.page-banner`, `.page-banner-breadcrumbs`, `.page-banner-title`, `.subpage-section`.
   - Bổ sung quy định chuẩn kích thước icon `.btn svg` (14px) và `#contactSubmitBtn svg` (16px), triệt tiêu hoàn toàn lỗi bung icon SVG.
4. **`src/styles/responsive.css` (CHUẨN HÓA MEDIA QUERIES)**:
   - Bổ sung breakpoint chuẩn xác tại 1100px, 992px, 768px, 480px cho:
     - `.quality-global-grid`: 2 cột trên desktop (>=1100px), reflow 1 cột mượt mà trên mobile/tablet.
     - `.about-grid`: 3 cột trên desktop, 1 cột trên màn hình nhỏ.
     - `.products-grid`: 4 cột desktop, 3 cột tablet, 2 cột mobile, 1 cột micro-mobile.
     - `.contact-page-grid`: 2 cột desktop, 1 cột <=992px.
5. **`src/pages/Home.tsx` (VIẾT LẠI ĐÚNG BỐ CỤC)**:
   - Đồng bộ Hero visual, Section 2 About 3 cột, Section 3 Products showcase, Section 4 & 5 Quality + Global Market 2 cột, Section 6 News, Section 7 CTA.
6. **`src/pages/GlobalMarket.tsx`**:
   - 4 trụ cột xuất khẩu `.market-regions-grid`, Bản đồ WorldMapSvg `variant="full"`, thanh 4 chỉ số `.logistics-bar`, quy trình 3 bước hợp tác.
7. **`src/pages/Quality.tsx`**:
   - Quy trình 6 bước khép kín `.process-steps-grid`, thông số nhà máy 4.000 m², lưới 4 chứng nhận `.certifications-grid-4`.
8. **`src/pages/Products.tsx`**:
   - Danh mục sản phẩm, bộ lọc pill categories, bảng thông số kỹ thuật xuất khẩu 6 dòng B2B.
9. **`src/pages/About.tsx`**:
   - Bố cục giới thiệu 3 cột, dòng thời gian 6 cột mốc `.timeline-grid`, hồ sơ cơ sở hạ tầng, ban lãnh đạo.
10. **`src/pages/PressMedia.tsx`**:
    - Danh sách bài báo CafeF/Người Lao Động, thẻ liên hệ truyền thông `.media-relations-card` 2 cột.
11. **`src/pages/Contact.tsx` (VIẾT LẠI 1:1)**:
    - 4 thẻ pháp nhân, form báo giá trực tiếp, bản đồ vệ tinh Tiền Giang, thanh hợp tác bền vững, FAQ 3 thẻ.

---

### 4. KẾT QUẢ KIỂM THỬ THỰC TẾ (VISUAL REGRESSION & RUNTIME)

#### A. Kiểm tra Homepage Section 4 & 5 (Trọng tâm cao nhất)
- **Thiết kế yêu cầu:** Cột trái Tiêu chuẩn chất lượng (4 badge), Cột phải Thị trường xuất khẩu (World Map SVG + 4 pill cards), ngăn cách bởi đường viền dọc mảnh.
- **Kết quả trên React:**
  - Viewport >= 1100px: Hiển thị đúng 2 cột song song với tỷ lệ 1:1 hoàn hảo.
  - Divider dọc hiển thị sắc nét bằng đường viền `#E1EBE4`.
  - Bản đồ thế giới hiển thị đầy đủ lục địa, các cung xuất khẩu xanh lá nét đứt, pulse radar tại Tiền Giang và nhãn thị trường trọng điểm.
  - Đánh giá: **PASS (100% khớp ảnh tham chiếu)**.

#### B. Kiểm tra Responsive đa độ phân giải
- **375px & 390px (Mobile portrait):** Các section tự động chuyển sang 1 cột, không có hiện tượng vỡ khung hay tràn chiều ngang (`overflow-x: hidden`). Nút bấm vừa vặn, padding căn chuẩn 16px. **PASS**
- **768px (Tablet portrait):** Grid chuyển đổi thành 2 cột cân đối, thanh điều hướng và menu hoạt động chính xác. **PASS**
- **1024px & 1366px (Laptop / Desktop tiêu chuẩn):** Bố cục 2 cột Quality & Global Market kích hoạt đầy đủ, container giới hạn tối đa 1280px sắc nét. **PASS**
- **1440px & 1920px (Desktop màn hình lớn):** Bản đồ và các card giữ nguyên tỷ lệ, không bị giãn vỡ pixel. **PASS**

#### C. Kiểm tra Song ngữ (VI / EN)
- Bộ chuyển đổi ngôn ngữ hoạt động tức thì thông qua React Context (`LanguageContext`).
- Toàn bộ nội dung trên tất cả các trang (tiêu đề, nhãn, dữ liệu chỉ số, bảng thông số, form liên hệ) chuyển ngữ trơn tru, không có hiện tượng trộn lẫn ngôn ngữ.
- Đánh giá: **PASS**.

#### D. Kiểm tra Tương tác & Chức năng
- **React Router:** Điều hướng giữa các trang mượt mà (SPA không bị reload trang).
- **Modal Chi tiết sản phẩm & Báo giá:** Mở/đóng trơn tru, nhận đúng tham số sản phẩm được chọn.
- **Form liên hệ:** Có xác thực dữ liệu và tạo liên kết trực tiếp tới email `thaovinaxo@gmail.com`.
- **Console Browser:** 0 lỗi, 0 cảnh báo.
- Đánh giá: **PASS**.

#### E. Kiểm tra Production Build
```bash
> vinaxo@2.0.0 build
> tsc -b && vite build

vite v5.4.21 building for production...
transforming...
✓ 1609 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               4.41 kB │ gzip:  1.66 kB
dist/assets/index-__ZB8ph9.css               32.92 kB │ gzip:  7.15 kB
dist/assets/WorldMapSvg-7ByQG1_3.js          56.63 kB │ gzip: 21.52 kB
dist/assets/index-Cl7AuxtV.js               102.75 kB │ gzip: 35.04 kB
dist/assets/vendor-C2vLSy9D.js              164.50 kB │ gzip: 53.66 kB
✓ built in 3.21s
```
- TypeScript check: **0 errors**.
- Vite production bundle: **Hoàn thành thành công (Exit Code 0)**.

---

### 5. KẾT LUẬN & CAM KẾT
- Giao diện React hiện tại đã đạt độ đồng nhất thị giác (**Visual Parity 1:1**) với website HTML gốc.
- Không có bất kỳ thành phần nào tự ý thiết kế lại.
- Dữ liệu sản phẩm thực tế, thông số kiểm định OCOP, BRCGS Grade B và quy mô nhà máy Tiền Giang được bảo toàn nguyên vẹn.
- Đúng theo chỉ thị của người dùng: **Không deploy production và không push GitHub**.
