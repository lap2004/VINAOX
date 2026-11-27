# BÁO CÁO KIỂM TRA, SỬA LỖI VÀ NGHIỆM THU TRANG SẢN PHẨM, CHI TIẾT SẢN PHẨM, BẢNG THÔNG SỐ & LUỒNG BÁO GIÁ VINAXO (PRE-HANDOVER)

- **Ngày báo cáo:** 2026-11-27
- **Hệ thống:** Website doanh nghiệp xuất khẩu VINAXO (`https://www.vinaxo.net`) & Admin CMS (`https://www.vinaxo.net/admin/products`)
- **Kho mã nguồn:** `lap2004/VINAOX` (`personal`) & `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO` (`origin`) — Nhánh production: `main`
- **Commit sửa lỗi & dữ liệu:** `7a78f62` (`fix/products-specs-quotation`, 44 files changed) → Merge `--no-ff` vào `main` tại SHA **`cad6db07e67f376612eb957a60eaea1dd0ad8142`** (`cad6db0`)
- **Bundle Production đã xác minh trên live:** `dist/assets/index-CghpX6BN.js` (`x-vercel-id: hkg1::zvc4x-1795747335667-e3a4852b7526`)
- **Ngôn ngữ hỗ trợ:** Tiếng Việt (`vi`), Tiếng Anh (`en`), Tiếng Hàn (`ko`), Tiếng Trung giản thể (`zh-CN`)

---

## 1. Tóm tắt Điều hành (Executive Summary)

Đợt xử lý trước bàn giao (Pre-Handover) cho toàn bộ cụm **Trang Sản phẩm (`/products`)**, **Cửa sổ Chi tiết sản phẩm (`ProductDetailModal`)**, **Bảng Thông số kỹ thuật (`#technical-specifications`)**, **Luồng Yêu cầu Báo giá (`QuoteModal` & `/contact`)**, **Admin CMS (`/admin/products`)** và **12 file dữ liệu sản phẩm CMS (`content/products/*.json`)** đã xử lý triệt để toàn bộ **5 hạng mục lỗi (1 lỗi P1 + 4 lỗi P2)** được ghi nhận trong báo cáo kiểm tra của khách hàng:

1. **P1-01 (Xác nhận đã sửa & kiểm thử 4 ngôn ngữ):** Xóa bỏ mô tả quy chụp `"sấy dẻo nhiệt thấp, không thêm đường"` / `"zero added sugar or artificial preservatives"` khỏi banner và phần giới thiệu chung của `/products`, thay bằng mô tả bao quát chính xác **4 nhóm sản phẩm**: trái cây sấy dẻo, trái cây sấy giòn, hạt dinh dưỡng và sản phẩm thập cẩm.
2. **P2-01 (Xác nhận đã sửa trên cả 12 SKU):** Loại bỏ nguyên nhân gây trùng lặp đoạn mô tả trong `ProductDetailModal`, bổ sung hàm `dedupeNarrative` chống lặp tự động, khôi phục thông số thật cho `soft-dried-red-dragonfruit.json` & `banana-chips.json`, khóa hiển thị chỉ số `Brix` cho đúng 4 sản phẩm sấy dẻo, và tái cấu trúc modal thành **7 nhóm rõ ràng (A–G)** với cơ chế tự ẩn mục trống.
3. **P2-02 (Xác nhận đã sửa end-to-end):** Truyền đầy đủ định danh có cấu trúc `QuotationProduct` (`productId`, `productSlug`, `categoryId`) + tùy chọn `packaging` (`#quotePackaging`) từ Card sản phẩm, Cửa sổ chi tiết và Bảng thông số vào `QuoteModal` và `/contact?product=<slug>`, đồng thời reset sạch state khi mở/đóng để chống dính sản phẩm cũ. Giữ nguyên **chỉ 3 trường bắt buộc** (`fullName`, `email`, `message`) theo quy chuẩn UX trước đó.
4. **P2-03 (Xác nhận đồng bộ trên desktop & mobile):** Gắn cả Lưới sản phẩm (`ProductCard`), Bảng thông số kỹ thuật (`#technical-specifications` trên desktop) và Danh sách thẻ thông số mobile (`<= 768px`) vào cùng một state `filteredProducts`, cập nhật tiêu đề kèm số lượng `(12)` / `(4)` / `(3)` / `(1)` theo bộ lọc.
5. **P2-04 (Xác nhận tách bạch hoàn toàn Chứng nhận & Đặc tính):** Tách riêng trường **`productCertifications`** (chỉ gắn chứng nhận sản phẩm đã xác minh — hiện có 3 sản phẩm đạt **OCOP 3 Sao cấp tỉnh**: `soft-dried-mango`, `soft-dried-jackfruit`, `soft-dried-red-dragonfruit`; 9 sản phẩm còn lại hiển thị `—` kèm liên kết tới `/quality#certificates`) và trường **`productFeatures`** (hiển thị tại cột riêng **`Đặc Tính Sản Phẩm`** trong bảng thông số và mục D của modal), chấm dứt việc nhét khẩu hiệu tiếp thị (`Clean Label`, `Đạt chuẩn xuất khẩu`, `Đặc sản Đồng Tháp`, `Premium Grade`) hoặc chứng nhận cấp nhà máy (`BRCGS`, `FDA`, `ISO 22000`, `HACCP`, `Kosher`, `SMETA`) vào cột chứng nhận sản phẩm.

> [!IMPORTANT]
> **Ghi chú trung thực về giới hạn môi trường live:** API `/api/contact` trên `https://www.vinaxo.net` đã chạy đúng handler mới (`x-vercel-id: hkg1::iad1::mvcrq-1795747336249-a6d434199efc`) nhưng trả về HTTP `503 DELIVERY_NOT_CONFIGURED` (`recipient: cuonghoang0710@gmail.com`) do chưa cấu hình `RESEND_API_KEY` hoặc `BREVO_API_KEY` trên Vercel Environment Variables. Vì vậy hạng mục kiểm tra **gửi email thật tới hộp thư đích (`PRODUCT-14`)** được ghi nhận trạng thái **`BLOCKED`** trên Production (mocked unit test trong `scripts/test-seo-and-inquiry.mjs` đạt **`11/11 PASS`**). Ngoài ra, trình duyệt **Safari, Firefox và thiết bị di động vật lý** chưa được chạy trực tiếp (`NOT RUN`), trong khi bộ kiểm thử tự động Chromium (**Google Chrome** và **Microsoft Edge** qua 8 kích thước `320×568` → `2560×1440`) đạt **`9/9 PASS`**.

---

## 2. Phân tích Nguyên nhân Gốc rễ (Root Cause Analysis)

| Mã lỗi | Nguyên nhân gốc rễ phát hiện trong mã nguồn & CMS | Ảnh hưởng thực tế trước khi sửa |
|---|---|---|
| **P1-01** | `pageBanners.products.subtitle` và `productsPage.section1.desc` trong `src/i18n/{vi,en,ko,zhCN}.ts` cùng `routeMetadata.ts` mặc định dùng mô tả riêng cho quy trình sấy dẻo nhiệt thấp 10:1 và "không thêm đường" cho toàn bộ danh mục. | Khách B2B xem hạt dinh dưỡng, chuối/mít/xoài sấy giòn hoặc thập cẩm bị hiểu nhầm về công nghệ sấy và thành phần đường. |
| **P2-01** | (1) `src/shared/schemas/productSchema.ts` có `defaultSpecs` cứng theo chuẩn trái cây sấy dẻo (`< 16%`, `50° - 55° Brix`, `3-Star OCOP`, `BRCGS`) khiến khi biên tập hoặc đồng bộ CMS, `banana-chips.json` và `soft-dried-red-dragonfruit.json` bị ghi đè thông số sai; (2) Việc sao chép `description` vào `features` trên một số bản ghi tạo hai đoạn mô tả lặp ngay trong Phần Tổng quan của `ProductDetailModal`. | Modal thanh long ruột đỏ hiển thị đoạn mô tả giống nhau ở hai chỗ; chuối sấy giòn lại mang thông số độ ẩm/Brix và OCOP của trái cây sấy dẻo. |
| **P2-02** | `ProductCard`, `ProductDetailModal` và bảng thông số chỉ truyền chuỗi tên sản phẩm hoặc slug rời rạc, chưa có đối tượng `QuotationProduct` (`productId`, `productSlug`, `categoryId`) và ô `packaging`; `QuoteModal` không reset selection khi đóng/mở lần sau. | Mở popup báo giá từ sản phẩm này rồi chuyển sang sản phẩm khác có nguy cơ giữ lại dữ liệu sản phẩm trước hoặc thiếu `categoryId`/`packaging` trên backend. |
| **P2-03** | Trong `src/pages/Products.tsx`, phần lưới đọc `filteredProducts`, còn `specRows` của Bảng thông số đọc trực tiếp mảng gốc `productsData` (12 dòng cố định). | Chọn tab "Hạt dinh dưỡng" chỉ lọc lưới trên còn 4 thẻ, trong khi bảng thông số phía dưới vẫn hiện cả 12 dòng. |
| **P2-04** | Trường `specs.certifications` trong `products.ts` & `content/products/*.json` trộn chung chứng nhận sản phẩm (`3-Star OCOP`), chứng nhận nhà máy (`BRCGS`, `FDA`), và khẩu hiệu marketing (`Clean Label`, `Đạt chuẩn xuất khẩu`, `Đặc sản Đồng Tháp`, `Premium Grade`), đồng thời không có cột riêng cho đặc tính sản phẩm. | Gây hiểu nhầm cho nhà nhập khẩu quốc tế về phạm vi chứng nhận từng SKU (đặc biệt nhóm hạt & snack sấy giòn). |

---

## 3. Chi tiết Thay đổi Kiến trúc Dữ liệu, Schema & CMS JSON

### 3.1. Chuẩn hóa Schema & Helper (`src/shared/schemas/productSchema.ts`, `src/data/products.ts`)
- Bổ sung kiểu dữ liệu phân cấp rõ ràng:
  - `CertificationScopeType`, `ProductCertificationRef`, `ProductFeatureItem`
  - Hằng số `CATEGORY_LABELS` cho cả 4 ngôn ngữ (`soft-dried`, `chips`, `nuts-seeds`, `mixed`)
  - Định nghĩa chuẩn `OCOP_3_STAR_CERT` cho chứng nhận cấp sản phẩm đã xác minh
  - Các helper: `getCategoryDefaultLabel`, `hasApplicableBrix`, `dedupeNarrative`, `getProductFeatureLabel`
- Bổ sung đầy đủ trường mới vào `productSchema`: `productCertifications`, `productFeatures`, `published`, `status`, SEO/alt fields, và hỗ trợ đa ngôn ngữ `ko`/`zh` đầy đủ cho từng sản phẩm.
- Loại bỏ toàn bộ `defaultSpecs` thiên vị trái cây sấy dẻo trong `productSchema.ts` và áp dụng `dedupeNarrative` cho `vi/en/ko/zh.features` để ngăn trùng đoạn ở tầng validation.
- Cải thiện `mergeProduct` để bảo toàn đồng bộ ảnh (`image` / `gallery`), cho phép xóa rỗng mảng `productCertifications` / `productFeatures` khi Admin cập nhật, và tự động lọc sản phẩm `published` theo thứ tự chuẩn.

### 3.2. Kiểm kê & Làm sạch 12 File Dữ liệu Sản phẩm (`content/products/*.json`)
Tất cả 12 file JSON CMS đã được rà soát, chuẩn hóa 4 ngôn ngữ (`vi`, `en`, `ko`, `zh`), giữ nguyên 100% ảnh `.webp`/`.jpg` thật tại `public/images/products/`, và phân tách rạch ròi chứng nhận vs đặc tính:

| STT | Slug sản phẩm | Nhóm danh mục | `brix` | `productCertifications` (cấp SKU) | `productFeatures` | Trạng thái `vi.features` JSON |
|---|---|---|---|---|---|---|
| 1 | `soft-dried-red-dragonfruit` | `soft-dried` | `50° - 55° Brix` *(xác nhận từ baseline sấy dẻo)* | `3-Star OCOP` (Tiền Giang) | Có đặc tính riêng (giàu anthocyanin/betacyanin, sấy lạnh) | `""` *(trống — không trùng)* |
| 2 | `soft-dried-jackfruit` | `soft-dried` | `50° - 55° Brix` | `3-Star OCOP` | Có đặc tính riêng | `""` |
| 3 | `soft-dried-mango` | `soft-dried` | `50° - 55° Brix` | `3-Star OCOP` | Có đặc tính riêng | `""` |
| 4 | `soft-dried-papaya` | `soft-dried` | `50° - 55° Brix` | `[]` (`—` + link `/quality#certificates`) | Có đặc tính riêng | `""` |
| 5 | `banana-chips` | `chips` | `""` *(ẩn)* | `[]` (`—` + link `/quality#certificates`) | Có đặc tính riêng (chiên/sấy chân không giòn rụm) | `""` |
| 6 | `mango-chips` | `chips` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |
| 7 | `jackfruit-chips` | `chips` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |
| 8 | `cashew` | `nuts-seeds` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |
| 9 | `macadamia-nuts` | `nuts-seeds` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |
| 10 | `walnuts` | `nuts-seeds` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |
| 11 | `lotus-seeds` | `nuts-seeds` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |
| 12 | `mix-fruits-and-vegetables` | `mixed` | `""` *(ẩn)* | `[]` | Có đặc tính riêng | `""` |

> [!NOTE]
> **Ghi nhận minh bạch khi soi ảnh chụp `after-products-dragonfruit-modal-vi.png`:**
> Ở `soft-dried-red-dragonfruit.json`, `vi.features` đã được đặt rỗng `""` nên không tồn tại sao chép từ `description`. Khi hiển thị trên Modal VI (`A. THÔNG TIN TỔNG QUAN`), ngoài đoạn mô tả chính `"Được tuyển chọn từ vùng chuyên canh thanh long ruột đỏ Chợ Gạo (Tiền Giang)..."`, hộp highlight bên dưới lấy câu nổi bật riêng biệt từ `BASE_PRODUCTS_DATA.vi.features` (`"Sản phẩm đạt chuẩn OCOP 3 sao Tiền Giang. Nguyên liệu thanh long ruột đỏ tươi Chợ Gạo..."`) — **hai đoạn mang nội dung khác nhau và không bị lặp câu** như lỗi ban đầu. Nếu VINAXO muốn bỏ hoàn toàn hộp highlight này khi JSON để trống, có thể cập nhật `BASE_PRODUCTS_DATA.vi.features` trong đợt tinh chỉnh nội dung tiếp theo.

---

## 4. Chuẩn hóa Đa ngôn ngữ (`vi`, `en`, `ko`, `zh-CN`) & Metadata SEO

- Cập nhật `src/i18n/vi.ts`, `src/i18n/en.ts`, `src/i18n/ko.ts`, `src/i18n/zhCN.ts` và `src/components/seo/routeMetadata.ts` để đảm bảo:
  - Banner & giới thiệu trang `/products` phản ánh đầy đủ cả 4 dòng sản phẩm (trái cây sấy dẻo, trái cây sấy giòn, hạt dinh dưỡng, thập cẩm), không còn claim sai cho toàn bộ danh mục.
  - Bổ sung đầy đủ khóa giao diện mới cho bảng thông số (`colFeatures`, `viewDetailBtn`), trạng thái chứng nhận (`—` kèm link hồ sơ chất lượng nhà máy), tiêu đề 7 mục Modal chi tiết (A–G), và phần hiển thị sản phẩm đang báo giá (`packaging`).
  - Kiểm tra parity tự động `npm run check:i18n`: **609/609 khóa khớp hoàn toàn trên cả 4 file ngôn ngữ**.
- Cập nhật `docs/VINAXO_TRANSLATION_GLOSSARY.md` (Bổ sung **Mục 6** quy chuẩn 4 ngôn ngữ cho Danh mục Sản phẩm, Chứng nhận sản phẩm vs Chứng nhận cơ sở, Đặc tính sản phẩm, và Nhãn chọn báo giá).

---

## 5. Cải tiến Giao diện UI/UX, Cửa sổ Chi tiết & Bảng Thông số Kỹ thuật

1. **`ProductCard.tsx`**:
   - Chỉ hiển thị huy hiệu chứng nhận sản phẩm (`OCOP 3 Sao`) với các SKU thực sự có `productCertifications`.
   - Hiển thị nhãn nhóm danh mục / đặc tính riêng biệt (`productFeatures`) không trộn với chứng nhận.
   - Đẩy `data-product-slug`, `data-product-category`, `data-detail-product-slug` và `data-quote-product-slug` để hỗ trợ QA tự động và accessibility.
2. **`ProductDetailModal.tsx`**:
   - Tổ chức lại toàn bộ nội dung theo **7 nhóm A–G** rành mạch (Tổng quan; Thông số kỹ thuật với Brix tự động ẩn ngoài nhóm sấy dẻo; Quy cách & Đóng gói OEM; Đặc tính nổi bật; Chứng nhận sản phẩm & Liên kết hồ sơ nhà máy `/quality#certificates`; Thị trường xuất khẩu / Ứng dụng; Tài liệu & Nút Hành động).
   - Nút **Yêu cầu báo giá** (`data-testid="modal-request-quote-btn"`) truyền trọn vẹn `QuotationProduct` sang `QuoteModal`.
   - Đáp ứng mobile sheet sạch gọn qua `src/styles/responsive.css` (không tràn ngang trên màn hình nhỏ).
3. **`Products.tsx`**:
   - Cả Grid thẻ sản phẩm (`[data-testid="products-grid"]`), Bảng thông số kỹ thuật desktop (`[data-testid="specs-table"]`) và danh sách thẻ thông số mobile (`[data-testid="specs-mobile-cards"]` tại `<= 768px`) dùng chung biến `filteredProducts`.
   - Tiêu đề bảng (`[data-testid="specs-table-heading"]`) cập nhật động số lượng `(12)`, `(4)`, `(3)`, `(1)` ngay khi bấm bộ lọc danh mục.
   - Bảng thông số tách rõ cột **`Chứng Nhận`** (hiển thị OCOP 3 Sao hoặc `—` + link `/quality#certificates`) và cột **`Đặc Tính Sản Phẩm`**, đồng thời có nút **`Xem chi tiết`** mở thẳng modal của dòng tương ứng.

---

## 6. Luồng Báo giá B2B Xuyên suốt & Chuẩn hóa Backend (`QuotationProduct`)

- **Kiểu dữ liệu chuẩn:** `QuotationProduct` gồm `productId`, `productSlug`, `categoryId` kết hợp trường tùy chọn `packaging` (`#quotePackaging`) trong `src/components/contact/contactSchema.ts` và `ContactFormFields.tsx`.
- **Tích hợp UI (`MainLayout.tsx`, `QuoteModal.tsx`, `Contact.tsx`, `Home.tsx`):**
  - Mở báo giá từ Card, Modal chi tiết hoặc Bảng thông số sẽ điền đúng `#quoteProduct`, preview tên sản phẩm (`selected-product-name`), preview danh mục (`selected-product-category`), và reset toàn bộ thông tin sản phẩm cũ ngay khi đóng/mở lại modal để chống stale state.
  - Truy cập `/contact?product=<slug>` tự đồng bộ `QuotationProduct` tương ứng.
  - Giữ nguyên cấu trúc form tối ưu: **chỉ bắt buộc 3 trường** (`Họ tên`, `Email`, `Nội dung yêu cầu`); Số điện thoại và Quy cách đóng gói (`#quotePackaging`) là tùy chọn.
- **Tích hợp Backend (`inquiryService.ts`, `server/inquiry.ts`, `api/contact.mjs`, `api/inquiry.mjs`):**
  - Xác thực chéo `productId` / `productSlug` / `categoryId` với danh mục sản phẩm chuẩn trên server, trả về `verifiedProductSlug` & `verifiedCategoryId` đã kiểm chứng, đính kèm `packaging` vào payload email/B2B inquiry.

---

## 7. Nâng cấp Admin CMS (`/admin/products`)

- **`src/admin/pages/AdminProducts.tsx`**, **`server/admin/products.ts`**, **`api/admin/products.mjs`**:
  - Tái cấu trúc trình soạn thảo sản phẩm thành **5 tab trực quan**:
    1. **Thông tin chung** (Slug, thứ tự, danh mục, trạng thái `published`/`status`)
    2. **Nội dung 4 ngôn ngữ** (`VI` / `EN` / `KO` / `ZH` với cảnh báo nếu `features` trùng `description`)
    3. **Thông số kỹ thuật** (Dùng giá trị rỗng trung tính cho sản phẩm mới; tự ẩn/chú thích `Brix` theo danh mục)
    4. **Chứng nhận & Đặc tính** (Bộ chọn liên kết chứng nhận sản phẩm tách biệt hoàn toàn với trình quản lý đặc tính đa ngôn ngữ)
    5. **Hình ảnh & SEO** (MediaPicker + thẻ Alt/Meta SEO theo từng ngôn ngữ)
  - API server sử dụng cơ chế merge an toàn theo slug, không tự động chèn dữ liệu giả khi chỉnh sửa.

---

## 8. Kết quả Kiểm thử & Xác minh Tự động (Local & Live Production)

### 8.1. Kiểm thử Build, Unit Test & Admin Suite (Local — Sau lần sửa code cuối)
| Lệnh kiểm thử | Kết quả | Chi tiết xác minh |
|---|---|---|
| `npm run build` | **PASS** | `check:i18n` (**609/609** khóa × 4 ngôn ngữ); `tsc -b` & `tsc -p tsconfig.server.json --noEmit` sạch lỗi; `build-api.mjs` xuất đủ **10 Admin API + 2 Contact/Inquiry handlers**; `vite build` ra bundle **`dist/assets/index-CghpX6BN.js`**; `generate-seo-artifacts.mjs` tạo **29 URL** trong `public/sitemap.xml`. |
| `node scripts/test-seo-and-inquiry.mjs` | **11/11 PASS** | Bao gồm Case 11 xác minh `verifiedProductSlug`, `verifiedCategoryId`, `packaging`, và giả lập (mock) gửi email Resend/Brevo thành công. |
| `npx tsx scripts/test-admin-suite.mjs` | **20/20 PASS** | Bao gồm Case 20 kiểm tra Admin Products schema/merge, bảo toàn dữ liệu và tách cert/feature *(dữ liệu test cục bộ ở `certificates.json` và `publish_history.json` đã được khôi phục sạch trước khi commit)*. |

### 8.2. Kiểm thử Selenium Đa trình duyệt & Hồi quy (Local `http://127.0.0.1:4173` & Live `https://www.vinaxo.net`)
| Bộ kiểm thử | Môi trường Local (`127.0.0.1:4173`) | Môi trường Live (`https://www.vinaxo.net`) | Phạm vi kiểm tra |
|---|---|---|---|
| `scripts/qa-products-prehandover.py` (**Chrome**) | **9/9 PASS** | **9/9 PASS** | Banner 4 ngôn ngữ (VI/EN/KO/ZH-CN), Modal 12 SKUs (0 `undefined`, 0 trùng đoạn, khóa Brix), Sync Grid/Bảng 5 tab lọc, Tách Cert/Feature, Quote Flow + Reset state, 8 Viewports (`320×568`→`2560×1440`) + Mobile Cards (`12` thẻ ở `390×844`), 0 lỗi Console SEVERE. |
| `scripts/qa-products-prehandover.py` (**Edge**) | **9/9 PASS** | **9/9 PASS** | Toàn bộ 9 hạng mục tương tự trên Microsoft Edge Headless. |
| `scripts/qa-contact-maps.py` (**Chrome**) | **8/8 PASS** | **8/8 PASS** | Kiểm thử hồi quy trang Liên hệ, bản đồ Google Maps và modal báo giá. |
| `scripts/qa-market-terminology.py` (**Chrome**) | **7/7 PASS** | **7/7 PASS** | Kiểm thử hồi quy thuật ngữ Incoterms (FOB/CIF) và vận chuyển (FCL/LCL), mẫu thiết kế nhãn mác trang Thị trường. |
| Smoke check Live URL `/products/soft-dried-red-dragonfruit` & `/admin/products` (`task-1358`) | — | **PASS (exit 0)** | `/products/soft-dried-red-dragonfruit` tải đủ nội dung (`body_text_len=7596`); `/admin/products` chuyển hướng bảo vệ tới `/admin/login` (`body_text_len=131`); `Admin/product-slug severe logs: []`. |

### 8.3. Xác minh API Production Trực tiếp
- Kiểm tra bundle live tại `https://www.vinaxo.net/products`: HTTP **200**, HTML tham chiếu đúng script mới **`index-CghpX6BN.js`** (`x-vercel-id: hkg1::zvc4x-1795747335667-e3a4852b7526`).
- Kiểm tra `POST https://www.vinaxo.net/api/contact` với payload `{ productId: 'soft-dried-red-dragonfruit', productSlug: 'soft-dried-red-dragonfruit', categoryId: 'soft-dried', packaging: '250g zip pouch' }`: Endpoint nhận dạng handler mới (`x-vercel-id: hkg1::iad1::mvcrq-1795747336249-a6d434199efc`) và trả về HTTP **503 `DELIVERY_NOT_CONFIGURED`** (`recipient: cuonghoang0710@gmail.com`) do Vercel chưa được cấp biến môi trường `RESEND_API_KEY` hoặc `BREVO_API_KEY`.

---

## 9. Ma trận Kiểm tra Chi tiết (`PRODUCT-01` → `PRODUCT-35`)

| Mã | Hạng mục kiểm tra | Trạng thái | Bằng chứng & Ghi chú thực tế |
|---|---|---|---|
| **PRODUCT-01** | Mô tả banner `/products` không áp đặt "sấy dẻo nhiệt thấp, không thêm đường" cho toàn bộ danh mục (VI) | **PASS** | `qa-products-prehandover.py` (`P1-BANNER-vi`) trên local & live; ảnh `after-products-hero-vi.png`. |
| **PRODUCT-02** | Banner `/products` chính xác cả 4 nhóm sản phẩm trên EN, KO, ZH-CN | **PASS** | `qa-products-prehandover.py` (`P1-BANNER-en`, `P1-BANNER-ko`, `P1-BANNER-zh-CN`) trên local & live; ảnh `after-products-ko.png`, `after-products-zh-cn.png`. |
| **PRODUCT-03** | Khóa i18n đồng bộ 4 ngôn ngữ không thiếu key | **PASS** | `npm run check:i18n` đạt **609/609** khóa × 4 ngôn ngữ. |
| **PRODUCT-04** | SEO Meta title/description trang `/products` chuẩn hóa không mang claim sai | **PASS** | `src/components/seo/routeMetadata.ts` & `npm run build` (`generate-seo-artifacts.mjs` tạo 29 URL). |
| **PRODUCT-05** | Modal `soft-dried-red-dragonfruit` không còn lặp đoạn văn bản từ `description` | **PASS** | `soft-dried-red-dragonfruit.json` đặt `vi.features: ""`; hàm `dedupeNarrative`; ảnh `after-products-dragonfruit-modal-vi.png`. |
| **PRODUCT-06** | Tất cả 12 ProductDetailModal không có chữ `undefined` và không trùng overview/highlight | **PASS** | `qa-products-prehandover.py` (`MODALS-12-PRODUCTS-AUDIT`: 12/12 SKUs pass trên Chrome & Edge). |
| **PRODUCT-07** | Tái cấu trúc Modal thành 7 nhóm rõ ràng (A–G) và tự ẩn mục rỗng | **PASS** | `src/components/products/ProductDetailModal.tsx`; kiểm tra DOM 12 SKUs trên Chrome & Edge. |
| **PRODUCT-08** | Thông số `Brix` chỉ hiển thị cho nhóm `soft-dried` (4 SKUs) và ẩn hoàn toàn cho `chips`, `nuts-seeds`, `mixed` (8 SKUs) | **PASS** | `hasApplicableBrix`; `MODALS-12-PRODUCTS-AUDIT` xác nhận 0 `modal-brix-card` ở 8 sản phẩm ngoài `soft-dried`. |
| **PRODUCT-09** | Khôi phục thông số thật cho `banana-chips.json` (không mang độ ẩm/Brix của sấy dẻo) | **PASS** | `content/products/banana-chips.json` (`brix: ""`, `productCertifications: []`). |
| **PRODUCT-10** | Hỗ trợ đa ngôn ngữ `ko` và `zh` đầy đủ trong dữ liệu & modal 12 sản phẩm | **PASS** | `content/products/*.json` & `src/data/products.ts` + ảnh `after-products-ko.png`, `after-products-zh-cn.png`. |
| **PRODUCT-11** | Luồng báo giá từ Card truyền đúng `productId`, `productSlug`, `categoryId` vào `#quoteProduct` | **PASS** | `EXACT-PRODUCT-QUOTATION-FLOW` (Chrome & Edge local + live); ảnh `after-quote-dragonfruit-vi.png`. |
| **PRODUCT-12** | Mở báo giá từ Product B sau khi đóng Product A không dính dữ liệu sản phẩm cũ | **PASS** | `EXACT-PRODUCT-QUOTATION-FLOW` test Thanh long → Chuối → Hạt điều; 0 lỗi stale state. |
| **PRODUCT-13** | Luồng báo giá từ bên trong Modal chi tiết (`modal-request-quote-btn`) & bảng thông số truyền đúng sản phẩm | **PASS** | `EXACT-PRODUCT-QUOTATION-FLOW` xác nhận Cashew modal → `#quoteProduct = cashew`. |
| **PRODUCT-14** | Gửi yêu cầu báo giá thành công tới email đích thực tế trên Production | **BLOCKED** | **Mocked API (`11/11 PASS`)** trong `test-seo-and-inquiry.mjs`. **Live `POST /api/contact`** đạt đúng handler mới nhưng trả `503 DELIVERY_NOT_CONFIGURED` (`recipient: cuonghoang0710@gmail.com`) vì Vercel chưa cấu hình `RESEND_API_KEY` / `BREVO_API_KEY`. |
| **PRODUCT-15** | Trường `#quotePackaging` (Quy cách đóng gói mong muốn) hiển thị & gửi kèm payload API | **PASS** | Xác nhận `#quotePackaging` trong `EXACT-PRODUCT-QUOTATION-FLOW` & `server/inquiry.ts` (lưu ý `POST` live trả `503` như mục `PRODUCT-14`). |
| **PRODUCT-16** | Form báo giá giữ nguyên đúng 3 trường bắt buộc (`fullName`, `email`, `message`), SĐT & Packaging tùy chọn | **PASS** | `src/components/contact/contactSchema.ts` & `ContactFormFields.tsx`. |
| **PRODUCT-17** | Truy cập `/contact?product=<slug>` tự chọn đúng `QuotationProduct` | **PASS** | `src/pages/Contact.tsx` đồng bộ `productId`, `productSlug`, `categoryId` theo query param. |
| **PRODUCT-18** | Backend `server/inquiry.ts` xác thực chéo & gắn `verifiedProductSlug`, `verifiedCategoryId` | **PASS** | `node scripts/test-seo-and-inquiry.mjs` Case 11 (`11/11 PASS`). |
| **PRODUCT-19** | Lọc danh mục `all` hiển thị đồng bộ **12** card & **12** dòng bảng + tiêu đề `(12)` | **PASS** | `FILTER-SYNC-AND-CERT-SEPARATION` (Chrome & Edge local + live). |
| **PRODUCT-20** | Lọc `soft-dried` đồng bộ **4** card & **4** dòng bảng + tiêu đề `(4)` | **PASS** | `FILTER-SYNC-AND-CERT-SEPARATION` (Chrome & Edge local + live). |
| **PRODUCT-21** | Lọc `chips` đồng bộ **3** card & **3** dòng bảng + tiêu đề `(3)` | **PASS** | `FILTER-SYNC-AND-CERT-SEPARATION` (Chrome & Edge local + live). |
| **PRODUCT-22** | Lọc `nuts-seeds` đồng bộ **4** card & **4** dòng bảng + tiêu đề `(4)` | **PASS** | `FILTER-SYNC-AND-CERT-SEPARATION`; ảnh `after-products-filter-nuts-table-vi.png`. |
| **PRODUCT-23** | Lọc `mixed` đồng bộ **1** card & **1** dòng bảng + tiêu đề `(1)` | **PASS** | `FILTER-SYNC-AND-CERT-SEPARATION` (Chrome & Edge local + live). |
| **PRODUCT-24** | Bảng thông số có cột riêng **`Đặc Tính Sản Phẩm`** tách rời khỏi cột **`Chứng Nhận`** | **PASS** | `src/pages/Products.tsx` & ảnh `after-products-filter-nuts-table-vi.png`. |
| **PRODUCT-25** | Nút **`Xem chi tiết`** trên từng dòng bảng mở đúng ProductDetailModal | **PASS** | `button[data-table-detail-slug='cashew']` kiểm thử trong `EXACT-PRODUCT-QUOTATION-FLOW`. |
| **PRODUCT-26** | Tách biệt Chứng nhận sản phẩm (`3-Star OCOP` chỉ trên 3 SKUs) khỏi khẩu hiệu tiếp thị (`Clean Label`, `Đạt chuẩn xuất khẩu`, `Đặc sản Đồng Tháp`, `Premium Grade`) | **PASS** | `FILTER-SYNC-AND-CERT-SEPARATION` xác minh 0 rò rỉ chuỗi cấm trong ô chứng nhận trên cả Chrome & Edge. |
| **PRODUCT-27** | 9 sản phẩm không có chứng nhận cấp SKU hiển thị `—` + liên kết tới `/quality#certificates` | **PASS** | Kiểm chứng DOM & `after-products-filter-nuts-table-vi.png`. |
| **PRODUCT-28** | Giao diện Mobile Specs Cards (`<= 768px`) đồng bộ bộ lọc (12 thẻ ở `all` trên `390×844`) | **PASS** | `RESPONSIVE-VIEWPORTS` kiểm tra `specs-mobile-cards` tại `390×844` + ảnh `after-products-mobile-390-specs.png`. |
| **PRODUCT-29** | Không tràn ngang (horizontal overflow) qua 8 kích thước màn hình (`320×568` → `2560×1440`) | **PASS** | `RESPONSIVE-VIEWPORTS` (`scrollWidth <= clientWidth + 2`) trên Chrome & Edge local + live. |
| **PRODUCT-30** | Route trực tiếp `/products/soft-dried-red-dragonfruit` hoạt động ổn định trên Production | **PASS** | `task-1358` trên live Chrome: `body_text_len=7596`, `severe logs: []`. |
| **PRODUCT-31** | Route `/admin/products` bảo vệ xác thực đúng & API/schema CMS lưu an toàn không chèn spec giả | **PASS** | Live `task-1358` chuyển hướng `/admin/login`; `npx tsx scripts/test-admin-suite.mjs` Case 20 (**20/20 PASS**). |
| **PRODUCT-32** | Đầy đủ 12 ảnh thật sản phẩm trong `public/images/products/` được bảo toàn | **PASS** | Đã kiểm tra hiện diện 12 file `.webp`/`.jpg` và render trong ProductCard/Modal. |
| **PRODUCT-33** | Hồi quy trang Liên hệ & Google Maps (`qa-contact-maps.py`) | **PASS** | **8/8 PASS** trên cả local và live Production. |
| **PRODUCT-34** | Hồi quy trang Thị trường & thuật ngữ Incoterms/FCL-LCL (`qa-market-terminology.py`) | **PASS** | **7/7 PASS** trên cả local và live Production. |
| **PRODUCT-35** | Kiểm thử đa trình duyệt ngoài nhân Chromium (Safari, Firefox, thiết bị di động thật) | **NOT RUN** | Đã xác minh trên **Chrome & Edge** (`320×568`→`2560×1440`); **Safari, Firefox và thiết bị vật lý chưa kiểm thử** trong môi trường Windows CLI hiện tại. |

---

## 10. Bằng chứng Ảnh chụp TRƯỚC / SAU (BEFORE / AFTER Screenshots)

Toàn bộ ảnh được lưu tại `docs/screenshots/products-prehandover/` (3 ảnh BEFORE chụp từ live trước đợt sửa, 7 ảnh AFTER chụp từ live `https://www.vinaxo.net` sau khi deploy commit `cad6db0` / bundle `index-CghpX6BN.js`):

### 10.1. Ảnh BEFORE (Hiện trạng lỗi trên Production trước khi sửa)
- [before-products-hero-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/before-products-hero-vi.png) — Banner `/products` áp đặt thông điệp sấy dẻo nhiệt thấp & không thêm đường cho toàn bộ danh mục.
- [before-products-dragonfruit-modal-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/before-products-dragonfruit-modal-vi.png) — Modal thanh long ruột đỏ bị lặp nội dung & trộn lẫn thông tin.
- [before-products-filter-nuts-table-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/before-products-filter-nuts-table-vi.png) — Khi lọc Hạt dinh dưỡng (4 thẻ), bảng thông số phía dưới vẫn hiển thị cả 12 dòng và trộn khẩu hiệu/chứng nhận.

### 10.2. Ảnh AFTER (Xác minh trực tiếp trên Live `https://www.vinaxo.net` sau `cad6db0`)
- [after-products-hero-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-products-hero-vi.png) — Banner & giới thiệu `/products` chuẩn hóa bao quát cả 4 nhóm sản phẩm (sấy dẻo, sấy giòn, hạt dinh dưỡng, thập cẩm).
- [after-products-dragonfruit-modal-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-products-dragonfruit-modal-vi.png) — Modal thanh long ruột đỏ cấu trúc 7 nhóm A–G sạch đẹp, phân tách chứng nhận OCOP 3 sao & đặc tính, hết lặp đoạn.
- [after-products-filter-nuts-table-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-products-filter-nuts-table-vi.png) — Bộ lọc Hạt dinh dưỡng đồng bộ 4 dòng bảng `(4)`, tách riêng cột `Chứng Nhận` (`—` + link hồ sơ nhà máy) và cột `Đặc Tính Sản Phẩm`.
- [after-quote-dragonfruit-vi.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-quote-dragonfruit-vi.png) — QuoteModal chọn sẵn đúng `Thanh long ruột đỏ sấy dẻo`, hiển thị danh mục `Trái cây sấy dẻo` và ô `Quy cách đóng gói mong muốn`.
- [after-products-mobile-390-specs.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-products-mobile-390-specs.png) — Danh sách Mobile Specs Cards trên viewport `390×844` rõ ràng, không tràn ngang.
- [after-products-ko.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-products-ko.png) — Trang `/products` hiển thị đầy đủ Tiếng Hàn (`ko`).
- [after-products-zh-cn.png](file:///e:/SONAI/VINAXO/docs/screenshots/products-prehandover/after-products-zh-cn.png) — Trang `/products` hiển thị đầy đủ Tiếng Trung giản thể (`zh-CN`).

---

## 11. Các Nội dung Cần Khách hàng (VINAXO) Xác nhận Trước/Khi Nghiệm thu Chính thức

1. **Cấp API Key gửi email trên Vercel (`BLOCKED` ở `PRODUCT-14`):** Cần thêm `RESEND_API_KEY` hoặc `BREVO_API_KEY` (cùng địa chỉ gửi xác thực nếu dùng domain riêng) vào Vercel Environment Variables của dự án `vinaxo.net` để `POST /api/contact` chuyển từ `503 DELIVERY_NOT_CONFIGURED` sang gửi thư thực tế tới `cuonghoang0710@gmail.com`.
2. **Phạm vi Chứng nhận Cấp Sản phẩm (SKU-level):** Hiện tại chỉ 3 sản phẩm (**Xoài sấy dẻo**, **Mít sấy dẻo**, **Thanh long ruột đỏ sấy dẻo**) được gắn chứng nhận sản phẩm **OCOP 3 Sao**. Nếu có SKU nào khác (ví dụ Hạt điều, Hạt mắc ca, Chuối sấy giòn, Đu đủ sấy dẻo) có giấy chứng nhận riêng theo từng SKU (như **Kosher OU** hoặc OCOP khác kèm số hiệu/phạm vi cụ thể), VINAXO cần xác nhận để gắn trực tiếp qua tab **Chứng nhận & Đặc tính** trong `/admin/products`.
3. **Rà soát câu chữ đặc trưng còn giữ từ dữ liệu gốc:**
   - Cụm `"không đường tinh luyện"` hiện chỉ giữ lại ở mô tả riêng của **Xoài sấy dẻo** (`soft-dried-mango`) — đề nghị xác nhận đúng thực tế công thức sản phẩm.
   - Cụm `"Đạt chuẩn xuất khẩu"` đã bị loại khỏi bảng thông số/huy hiệu chứng nhận của `/products`; nếu còn xuất hiện trong phần mô tả thương hiệu chung ở trang khác, xác nhận có giữ nguyên ở ngữ cảnh marketing tổng quan hay không.
   - Đề nghị người bản ngữ hoặc phụ trách thị trường Hàn Quốc (`ko`) và Trung Quốc (`zh-CN`) rà soát tinh chỉnh lần cuối bảng thông số 12 SKU trong `content/products/*.json`.
4. **Kiểm thử thủ công trên Safari / Firefox / Điện thoại thật (`NOT RUN` ở `PRODUCT-35`):** Khuyến nghị mở nhanh `https://www.vinaxo.net/products` trên iPhone Safari và Firefox desktop khi nghiệm thu bàn giao.
