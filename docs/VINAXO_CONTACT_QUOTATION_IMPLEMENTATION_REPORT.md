# BÁO CÁO TRIỂN KHAI HỆ THỐNG LIÊN HỆ, BÁO GIÁ B2B & CHUẨN HÓA URL/BẢN ĐỒ — VINAXO

- **Website Production**: `https://www.vinaxo.net` (bundle live: `assets/index-BihNtaaY.js`)
- **Branch triển khai**: `fix/contact-quotation-maps` (`ae41037`) -> gộp `--no-ff` vào `main` (`ebbad60bad33222544a13157c1ff2922ab66ed10`)
- **Tổng hợp 18 câu hỏi bàn giao**: Xem đầy đủ đối chiếu trong tài liệu này và [VINAXO_CONTACT_FORM_QA_REPORT.md](VINAXO_CONTACT_FORM_QA_REPORT.md).

---

## 1. Kiến trúc Gửi Yêu cầu Trực tiếp (Xử lý P1-01 & P2-02)

### 1.1. Tại sao form trước đây mở ứng dụng email?
- Trước đợt nâng cấp Pre-Handover, các form trên `Contact.tsx` và `QuoteModal.tsx` dùng `window.location.href = "mailto:cuonghoang0710@gmail.com?..."` (còn `ContactForm.tsx` dùng `setTimeout` giả lập). Mặc dù đã có API `/api/inquiry`, các chuỗi `connectNote` trong `src/i18n/vi.ts` và `src/i18n/en.ts` vẫn mô tả việc mở email client, đồng thời `Contact.tsx` bắt buộc `inquiryType` trong khi `QuoteModal.tsx` / `ContactForm.tsx` lại bắt buộc `phone`.
- Hiện tại, toàn bộ luồng gửi yêu cầu đi qua kiến trúc **Serverless API trực tiếp trên website**:
  1. Khách hàng nhập thông tin trên `Contact.tsx`, `QuoteModal.tsx` hoặc `ContactForm.tsx`.
  2. Validation dùng chung tại `src/components/contact/contactSchema.ts` (`validateContactForm`).
  3. Gửi `POST /api/contact` (`server/contact.ts` -> `api/contact.mjs`, dùng chung handler với `/api/inquiry` tại `server/inquiry.ts`).
  4. Backend kiểm tra bảo mật, xác minh `productId` từ danh mục thật `productsData` (`src/data/products.ts`), và chuyển tiếp qua **Resend API** (`RESEND_API_KEY`), **Brevo API** (`BREVO_API_KEY`) hoặc **Webhook** (`INQUIRY_WEBHOOK_URL`).
  5. Trả phản hồi trung thực cho khách hàng: thành công (`HTTP 200` + `referenceId`) hoặc giữ nguyên toàn bộ input kèm nút **"Thử gửi lại"**, **"Sao chép nội dung"** và kênh **Hotline / WhatsApp / Zalo** khi máy chủ chưa bật dịch vụ gửi thư (`HTTP 503 DELIVERY_NOT_CONFIGURED`). Không bao giờ tự mở `mailto:` hay giả lập gửi thành công.

### 1.2. Thống nhất Trường Bắt buộc & Cấu trúc Dữ liệu (Phase C)
Tạo module dùng chung `src/components/contact/`:
- `src/components/contact/contactSchema.ts`: Chuẩn hóa schema `ContactRequest` (`requestType: 'contact' | 'quotation'`, `fullName`, `email`, `phone?`, `company?`, `country?`, `productId?`, `productName?`, `quantity?`, `inquiryType?`, `message`, `source`, `locale`), bộ giải mã sản phẩm đa ngôn ngữ `resolveCanonicalProduct()`, và hàm `validateContactForm()` thống nhất trên mọi form:
  - **Chỉ bắt buộc 3 trường**:
    1. **Họ và tên** (`fullName` >= 2 ký tự)
    2. **Email** (`email` đúng định dạng RFC, chặn `\r\n`)
    3. **Nội dung yêu cầu** (`message` >= 5 ký tự)
  - **Không bắt buộc**: Số điện thoại (`phone`), Tên công ty (`company`), Quốc gia (`country`), Mục đích liên hệ (`inquiryType`), Sản phẩm quan tâm (`productId`), Số lượng dự kiến (`quantity`).
- `src/components/contact/ContactFormFields.tsx`: Component `ContactHoneypotField`, `ContactPrivacyNotice` (4 ngôn ngữ), `SelectedProductPreview` (hiển thị ảnh thu nhỏ & tên sản phẩm đã chọn).
- `src/components/contact/ContactFormStatus.tsx`: Component hiển thị trạng thái thành công (`role="status"` + mã yêu cầu `VNX-...`) và lỗi (`role="alert"` + Retry + Copy + Hotline/WhatsApp/Zalo).

### 1.3. Khắc phục Stale State Sản phẩm & Đổi Ngôn ngữ Giữa Chừng
- `ProductCard.tsx` và `ProductDetailModal.tsx` truyền trực tiếp `product.slug` (canonical ID) vào `onRequestQuote(product.slug)` thay vì chuỗi tên dịch.
- `QuoteModal.tsx` đồng bộ `productId` và reset `isSubmitted` / `errorMsg` / `failedPayload` mỗi khi mở modal cho sản phẩm mới (`useEffect` theo `[isOpen, defaultProduct]`), loại bỏ triệt để tình trạng mở Chuối sấy giòn nhưng vẫn hiện Thanh long hoặc thông báo cũ.
- Khi chuyển đổi ngôn ngữ (`vi` / `en` / `ko` / `zh-CN`) lúc đang nhập biểu mẫu, cả `Contact.tsx` và `QuoteModal.tsx` giữ nguyên toàn bộ chữ đã nhập và giữ nguyên sản phẩm đang chọn.

---

## 2. Chuẩn hóa Website URL (`P1-02`) & Admin CMS (Phase H & J)

- **`src/config/siteConfig.ts`**:
  - Sửa `normalizeSiteUrl()` và bổ sung `normalizeExternalWebsiteUrl()`, `getWebsiteDisplayLabel()` để nhận diện chuỗi thiếu giao thức (`www.vinaxo.net`, `vinaxo.net`, `vinaxo.vn`, `/www.vinaxo.net`), chuẩn hóa tuyệt đối thành `https://www.vinaxo.net/` (không bao giờ phát sinh `https://vinaxo.net/www.vinaxo.net`), đồng thời không can thiệp `mailto:`, `tel:` hoặc đường dẫn nội bộ `/`.
- **`src/shared/schemas/settingsSchema.ts` & `src/admin/pages/AdminSettings.tsx`**:
  - Mở rộng schema `CompanySettings` quản lý công khai: `factory_name_vi`, `factory_name_en`, `latitude`, `longitude` (có kiểm tra biên hợp lệ `-90..90`, `-180..180`), `google_place_id`, `whatsapp`, `zalo`, và chuẩn hóa `website`.
  - Tách bạch rõ thông tin liên hệ công khai trên CMS với bí mật gửi email nội bộ phía server (`RESEND_API_KEY`, `BREVO_API_KEY`, `CONTACT_TO_EMAIL`) — **tuyệt đối không lưu credentials trong JSON công khai hoặc tiền tố `VITE_`**.
  - Bổ sung bản đồ xem trước trực tiếp + nút kiểm tra pin Google Maps & Chỉ đường ngay trong `/admin/settings`.

---

## 3. Bảo mật & Chống Spam (Phase G)

- **Server (`server/inquiry.ts`)**:
  - Chặn HTTP method ngoài `POST` (`405`), chặn `Content-Type` ngoài `application/json` (`415`), kiểm tra `Origin` / `sec-fetch-site` (`403`), giới hạn body `16 KB` (`413`).
  - Lọc Prototype Pollution (`stripUnsafeKeys`), lọc ký tự điều khiển & chặn Email Header Injection (`\r`, `\n`), escape HTML trong nội dung email.
  - **Không dùng email khách làm `From`**: `From` dùng địa chỉ xác thực hệ thống (`CONTACT_FROM_EMAIL`), `To` khóa cứng ở server (`CONTACT_TO_EMAIL` mặc định `cuonghoang0710@gmail.com`, client không thể ghi đè), `Reply-To` gán email khách hàng đã validate.
  - **Không ghi PII khách hàng vào console logs**: Chỉ log mã lỗi upstream & `referenceId`.
  - **Xác minh sản phẩm phía server**: Đối chiếu `productId`/`productName` với `productsData` từ `src/data/products.ts`.
  - **Honeypot & Deduplication & Rate Limit**: Bẫy bot ẩn (`hp_website`, `company_website_hp`, `quote_company_fax_hp`), chặn gửi trùng 60s (`409`), rate limit best-effort 5 lần/10 phút/IP (`429 + Retry-After`) trên warm instance Serverless (khuyến nghị bổ sung Cloudflare Turnstile hoặc Redis/KV nếu muốn rate limit phân tán toàn cục giữa nhiều Serverless container).

---

## 4. Danh sách File đã Chỉnh sửa / Tạo mới (Đợt Triển khai Này)

- Mới: `server/contact.ts`, `api/contact.mjs`, `src/components/contact/contactSchema.ts`, `src/components/contact/ContactFormFields.tsx`, `src/components/contact/ContactFormStatus.tsx`, `scripts/qa-contact-maps.py`
- Cập nhật: `server/inquiry.ts`, `api/inquiry.mjs`, `scripts/build-api.mjs`, `src/services/inquiryService.ts`, `src/pages/Contact.tsx`, `src/components/ui/QuoteModal.tsx`, `src/components/forms/ContactForm.tsx`, `src/components/products/ProductCard.tsx`, `src/components/products/ProductDetailModal.tsx`, `src/config/siteConfig.ts`, `src/data/company.ts`, `content/settings/company.json`, `src/shared/schemas/settingsSchema.ts`, `src/admin/pages/AdminSettings.tsx`, `src/styles/global.css`, `src/i18n/{vi,en,ko,zhCN}.ts`, `vercel.json`, `.env.example`, `scripts/test-seo-and-inquiry.mjs`
