# BÁO CÁO KIỂM THỬ RESPONSIVE, MOBILE & UI/UX — VINAXO (PHASE F & J)

- **URL Kiểm thử**: [https://www.vinaxo.net](https://www.vinaxo.net) (và bản preview cục bộ trước deploy)
- **Trình duyệt đã kiểm thử**: Google Chrome (`158.0`) và Microsoft Edge (Headless viewport emulation trên Windows)
- **Trình duyệt chưa kiểm thử**: Safari / WebKit (`NOT RUN` do môi trường chạy Windows)
- **Lưu ý thiết bị**: Kiểm thử sử dụng viewport giả lập trên Chrome/Edge DevTools/WebDriver, **không phải thiết bị vật lý thật**.

---

## 1. Các Lỗi Đã Phát hiện và Khắc phục Trong Pha Mobile & UI

1. **Product Card "Chuối sấy giòn" hiển thị nhầm ảnh Thanh long đỏ (`content/products/banana-chips.json`)**:
   - Nguyên nhân: Dữ liệu JSON sản phẩm còn sót đường dẫn thử nghiệm `soft-dried-red-dragonfruit.webp` từ commit cũ `7d5ccae`.
   - Khắc phục: Khôi phục đường dẫn `/images/products/banana-chips.webp` và `/images/products/banana-chips.jpg` (đã xác minh cả 12/12 ảnh sản phẩm hiển thị đúng và tải hoàn tất trên `/products`).
2. **Popup Báo giá (`QuoteModal.tsx`) làm rơi lựa chọn sản phẩm khi bấm từ Product Card**:
   - Nguyên nhân: `<select>` của `QuoteModal` chỉ có 6 nhóm chung chung thay vì 12 sản phẩm cụ thể, nên khi `ProductCard` truyền `defaultProduct="Chuối sấy giòn"`, dropdown không khớp được option nào.
   - Khắc phục: Tải danh sách 12 sản phẩm từ `productsData` với hàm `resolveProductValue()` khớp theo `slug`, `id`, `name`, `nameVi` và `aliases` (đã xác nhận chọn đúng `banana-chips` khi bấm từ card Chuối sấy giòn).
3. **Nút nổi Liên hệ B2B (`floating-b2b-speed-dial`) có nguy cơ che nút Gửi form trên `/contact` mobile**:
   - Phát hiện trong kiểm thử Selenium tại `390×844` khi nút gửi bị đẩy xuống gần mép dưới.
   - Khắc phục: Ẩn `floating-b2b-speed-dial` khi đang ở trang `/contact` hoặc khi mở `QuoteModal` (`src/components/layout/MainLayout.tsx`), bổ sung `env(safe-area-inset-bottom, 0px)` trong `src/styles/global.css`.
4. **Rủi ro tự phóng to (auto-zoom) trên iOS Safari khi chạm ô nhập liệu & lưới modal thông số**:
   - Khắc phục: Đặt `.form-input, .form-select, .form-textarea { font-size: 16px !important; }` trong `@media (max-width: 768px)`, bỏ inline `fontSize: '0.9rem'` trong `QuoteModal.tsx`, bổ sung `autoComplete` và `inputMode`, thêm `.product-modal-top-grid { grid-template-columns: 1fr !important; }` dưới `640px`, khóa scroll body cho `CertificatePreviewModal.tsx` và trả focus khi đóng modal.

---

## 2. Ma trận Kiểm thử Viewport Bắt buộc (Chrome & Edge — Live `https://www.vinaxo.net`)

Tất cả **16 kích thước màn hình** đều kiểm tra 4 tuyến chính (`/`, `/products`, `/brochure`, `/contact`) với điều kiện `document.documentElement.scrollWidth <= window.innerWidth`:

| Nhóm | Viewport (CSS px) | Tương ứng thiết bị / Windows Scaling | Chrome Overflow | Edge Overflow | Trạng thái |
|---|---|---|---:|---:|:---:|
| Mobile | `320×568` | iPhone SE / Micro Mobile | `0 px` | `0 px` | **PASS** |
| Mobile | `360×800` | Android phổ thông | `0 px` | `0 px` | **PASS** |
| Mobile | `390×844` | iPhone 13/14/15 | `0 px` | `0 px` | **PASS** |
| Mobile | `414×896` | iPhone XR/11 | `0 px` | `0 px` | **PASS** |
| Mobile | `430×932` | iPhone Pro Max | `0 px` | `0 px` | **PASS** |
| Tablet | `768×1024` | iPad dọc | `0 px` | `0 px` | **PASS** |
| Tablet | `1024×768` | iPad ngang | `0 px` | `0 px` | **PASS** |
| Laptop | `1280×720` | Laptop 14" / 15.6" (125%–150% scaling) | `0 px` | `0 px` | **PASS** |
| Laptop | `1366×768` | Laptop phổ thông 14" / 15.6" | `0 px` | `0 px` | **PASS** |
| Laptop | `1440×900` | Laptop 14" / MacBook | `0 px` | `0 px` | **PASS** |
| Laptop | `1536×864` | Laptop 15.6" FHD (125% scaling) | `0 px` | `0 px` | **PASS** |
| Laptop | `1920×1080` | Laptop FHD (100% scaling) | `0 px` | `0 px` | **PASS** |
| Laptop | `1920×1200` | Laptop 16:10 | `0 px` | `0 px` | **PASS** |
| Desktop | `1920×1080` | Màn hình 24" | `0 px` | `0 px` | **PASS** |
| Desktop | `2560×1440` | Màn hình 27" QHD | `0 px` | `0 px` | **PASS** |
| Desktop | `3840×2160` | Màn hình 4K UHD | `0 px` | `0 px` | **PASS** |

---

## 3. Kết quả Các Hạng mục Tương tác Mobile & Brochure

- **Mobile Menu (`QA-01`, `QA-02`)**: Drawer mở/đóng mượt, đổi ngôn ngữ VI/EN cập nhật `<html lang>` và nội dung tức thì (**PASS** trên Chrome & Edge).
- **Trang Sản phẩm & Bảng thông số (`QA-04`..`QA-07`)**: Bộ lọc danh mục hoạt động đúng (lọc từ 12 xuống từng nhóm và trở lại 12); 12/12 ảnh tải đủ (`naturalWidth > 0`); bảng thông số cuộn ngang độc lập trong `.specs-table-wrapper` không tràn trang (**PASS**).
- **Brochure & PDF Viewer (`QA-11`, `QA-12`)**:
  - Mobile (`< 768px`): Hiển thị luồng 4 trang ảnh chất lượng cao theo chiều dọc (`brochure-mobile-reader`), trang 1 tải đủ, nút tải PDF `/brochures/vinaxo-company-brochure-2026.pdf` hoạt động, không tràn ngang (`overflow = 0`).
  - Desktop (`>= 768px`): Hiển thị khung `<iframe>` PDF gốc kích thước đầy đủ.
  - *Lưu ý*: Hành vi mở PDF trực tiếp trên Safari iOS / Chrome Android vật lý chưa kiểm thử trên máy thật (`NOT RUN` trên thiết bị vật lý).
- **Runtime Console Errors (`QA-26`)**:
  - Trên toàn bộ các trang hợp lệ (`/`, `/about`, `/products`, `/quality`, `/markets`, `/news`, `/brochure`, `/contact`): **0 lỗi JS / Console SEVERE** (`VALID_ROUTES_SEVERE_LOGS: []`).
  - Trong suite tổng hợp có 1 log mạng `404` duy nhất do test `SEO-23` chủ động truy cập URL không tồn tại `/non-existent-qa-test` để xác minh HTTP 404 thật.

---

## 4. Bằng chứng Ảnh chụp Màn hình (`docs/screenshots/pre-handover/`)

- `mobile/`: `320x568-home.png`, `320x568-products.png`, `390x844-home.png`, `390x844-products.png`, `mobile-menu-open.png`, `mobile-product-cards.png`, `mobile-spec-modal.png`
- `tablet/`: `768x1024-home.png`
- `laptop/`: `1366x768-home.png`, `1920x1080-home.png`, `1920x1200-home.png`
- `desktop/`: `1920x1080-home.png`
- `brochure/`: `brochure-mobile-390.png`, `brochure-desktop-1440.png`
