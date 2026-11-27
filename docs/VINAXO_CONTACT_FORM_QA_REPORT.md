# BÁO CÁO KIỂM THỬ HỆ THỐNG LIÊN HỆ, BÁO GIÁ & BẢN ĐỒ (`CT-01` – `CT-38`) — VINAXO

- **Thời điểm kiểm thử live**: `2026-11-27T01:54:31Z` (UTC) — tức `2026-11-27 08:54:31` (GMT+7)
- **URL Production đã kiểm thử**: `https://www.vinaxo.net` (bundle live: `assets/index-BihNtaaY.js`, `x-vercel-id: hkg1::4mnb4-1795744406449-0c6370c34cb8`, commit `main`: `ebbad60bad33222544a13157c1ff2922ab66ed10`)

---

## 1. Bảng Kết quả Nghiệm thu `CT-01` – `CT-38` (Báo cáo Trung thực)

| ID | Tiêu chí nghiệm thu | Kết quả | Môi trường & Bằng chứng |
|---|---|:---:|---|
| `CT-01` | Form Liên hệ gửi trực tiếp qua hệ thống (`POST /api/contact`) | **BLOCKED (Server Env)** / **PASS (Flow & Mock)** | Trình duyệt gửi thẳng XHR `POST /api/contact` (`apiCalls=1` trên Chrome & Edge live); unit test `200 delivered: true` với mock Resend/Brevo đạt 9/9; **live Vercel trả `503 DELIVERY_NOT_CONFIGURED`** vì chưa cấu hình `RESEND_API_KEY` / `BREVO_API_KEY`. |
| `CT-02` | Không mở ứng dụng email khi bấm gửi form | **PASS** | Đã xóa bỏ logic mở `mailto:` khỏi hành vi submit và mọi chuỗi mô tả trong `vi.ts`/`en.ts`; xác nhận URL trình duyệt giữ nguyên `/contact` khi submit trên Chrome & Edge live. |
| `CT-03` | Popup nhận báo giá gửi thành công | **BLOCKED (Server Env)** / **PASS (Flow & Mock)** | Luồng `QuoteModal` gửi `POST /api/contact` (`requestType: 'quotation'`) vượt unit test Resend/Brevo mock; **chờ kích hoạt API key trên Vercel** để đạt `200 delivered: true` live. |
| `CT-04` | Nhận báo giá đúng sản phẩm (không stale state) | **PASS** | `CT-04-08-QUOTEMODAL-BINDING` live Chrome & Edge: bấm Thanh long đỏ -> `soft-dried-red-dragonfruit` + preview đúng ảnh/tên -> đóng -> bấm Chuối sấy giòn -> cập nhật `banana-chips`. Server xác minh `verifiedProductId` (`test-seo-and-inquiry.mjs`). |
| `CT-05` | Họ tên là trường bắt buộc | **PASS** | Live DOM `#contactName[required]`, `#quoteName[required]`, `POST /api/contact` trả `400 VALIDATION_ERROR` khi tên < 2 ký tự. |
| `CT-06` | Email là trường bắt buộc | **PASS** | Live DOM `#contactEmail[required]`, `type="email"`, `inputmode="email"`. |
| `CT-07` | Nội dung yêu cầu là trường bắt buộc | **PASS** | Live DOM `#contactMessage[required]`, `#quoteMessage[required]`; chặn submit khi thiếu nội dung trên cả `QuoteModal` và `Contact`. |
| `CT-08` | Số điện thoại không bắt buộc | **PASS** | Xác nhận `#contactPhone` và `#quotePhone` không có `required`; test `test-seo-and-inquiry.mjs` gửi quotation không kèm phone đạt `200` (mock). |
| `CT-09` | Tên doanh nghiệp không bắt buộc | **PASS** | Xác nhận `#contactCompany` và `#quoteCompany` không có `required`; submit thành công ở tầng validation khi bỏ trống. |
| `CT-10` | Email không hợp lệ bị từ chối | **PASS** | `CT-10-EMAIL-REJECT` live Chrome & Edge: nhập `invalid-email` hiển thị `[role="alert"]`; backend live trả `400 VALIDATION_ERROR`. |
| `CT-11` | Backend từ chối payload không hợp lệ | **PASS** | Probe live `https://www.vinaxo.net/api/contact` trả `HTTP 400`; `test-seo-and-inquiry.mjs` xác nhận `405`/`415`/`400` + chặn CRLF `\r\nBcc:`. |
| `CT-12` | Không gửi trùng khi bấm nhiều lần | **PASS** | Guard `if (isSubmitting) return;` ở client + server deduplication `60s` (`HTTP 409 DUPLICATE_SUBMISSION` pass trong `test-seo-and-inquiry.mjs`). |
| `CT-13` | Loading state chính xác | **PASS** | Nút submit chuyển disabled & hiển thị text đang gửi (`isSubmitting`) theo 4 ngôn ngữ trong lúc chờ `fetch('/api/contact')`. |
| `CT-14` | Thông báo thành công chính xác | **BLOCKED (Live E2E)** / **PASS (UI + Unit)** | UI `ContactFormStatus` hiển thị thông báo trung thực + mã `VNX-...` khi `delivered: true` (đã test logic; **chưa kích hoạt được trạng thái 200 thật trên live** do thiếu API key trên Vercel). |
| `CT-15` | Thông báo lỗi chính xác | **PASS** | Khi live `/api/contact` trả `503`, UI hiển thị `[role="alert"]` tiếng Việt rõ ràng, không lộ stack trace. |
| `CT-16` | Giữ dữ liệu khi gửi thất bại | **PASS** | `CT-01-02-08-09-16-DIRECT-DISPATCH` live Chrome & Edge: sau lỗi `503`, giá trị `#contactName` (`VINAXO QA Contact`) và `#contactMessage` giữ nguyên 100%, kèm nút Thử gửi lại & Sao chép. |
| `CT-17` | Cơ chế chống spam hoạt động | **PASS** | Honeypot fields (`hp_website`, `company_website_hp`, `quote_company_fax_hp`) + `409` dedup + Origin/Referer validation pass unit tests. |
| `CT-18` | Rate limiting hoạt động | **PASS (In-memory per-instance)** | Unit test `api/contact.mjs` đạt `429 RATE_LIMITED + Retry-After` sau 5 req/10 phút/IP. *Ghi chú*: Trên Vercel Serverless nhiều container, in-memory map chỉ giới hạn trên từng warm instance. |
| `CT-19` | Không lộ API key hoặc credentials | **PASS** | Quét toàn bộ `src/`, `server/`, `api/` không có biến `VITE_*KEY`, `VITE_*SECRET` hay API key thật. |
| `CT-20` | VINAXO thực sự nhận được email yêu cầu | **BLOCKED** | Chưa có `RESEND_API_KEY` / `BREVO_API_KEY` trên Vercel và không có quyền truy cập hộp thư `cuonghoang0710@gmail.com`. |
| `CT-21` | Reply-To đúng email khách hàng | **PASS (Unit Verified)** / **BLOCKED (Live)** | `test-seo-and-inquiry.mjs` xác minh `reply_to` (Resend) & `replyTo.email` (Brevo) = email khách hàng; chờ xác minh thư thật trên Vercel. |
| `CT-22` | Nội dung email không lỗi Unicode | **PASS (Unit Verified)** | Test với tên/nội dung tiếng Việt có dấu, tiếng Hàn & tiếng Trung giản thể qua `test-seo-and-inquiry.mjs` đạt 9/9. |
| `CT-23` | Website URL trong Footer chính xác | **PASS** | `CT-23-24-25-WEBSITE-URLS` live Chrome & Edge: tất cả link `vinaxo.net` bắt đầu bằng `https://www.vinaxo.net/` kèm `rel="noopener noreferrer"`. |
| `CT-24` | Website URL trong trang Liên hệ chính xác | **PASS** | `CT-23-24-25-WEBSITE-URLS` live Chrome & Edge: link website hiển thị `www.vinaxo.net`, `href="https://www.vinaxo.net/"`. |
| `CT-25` | Không còn URL tương đối sai (`/www.vinaxo.net`) | **PASS** | `badLinks=[]` trên Chrome & Edge live; `normalizeSiteUrl('www.vinaxo.net') === 'https://www.vinaxo.net/'` pass unit test. |
| `CT-26` | Google Maps hiển thị đúng vị trí nhà máy | **PASS** | `CT-26-27-28-GOOGLE-MAPS` live Chrome & Edge: `iframe` src dùng đúng `10.380295,106.516139`. *(Lưu ý chủ sở hữu xác nhận lại pin cổng thực tế của tọa độ này)*. |
| `CT-27` | Nút chỉ đường mở đúng vị trí | **PASS** | Nút chỉ đường dùng `https://www.google.com/maps/dir/?api=1&destination=10.380295%2C106.516139`, bỏ chuỗi tìm kiếm chung `Vĩnh Bình`. |
| `CT-28` | Marker và nút Maps sử dụng cùng dữ liệu | **PASS** | Iframe, nút Mở Google Maps và nút Chỉ đường đọc từ cùng `COMPANY_INFO.location` (`content/settings/company.json`). |
| `CT-29` | Company Settings đồng bộ với Footer | **PASS** | `src/data/company.ts` đọc trực tiếp `/content/settings/company.json` cho Footer, Contact và SEO. |
| `CT-30` | Form hoạt động trên mobile | **PASS** | Kiểm thử thực tế ở `320×568`, `360×800`, `390×844`, `430×932` trên Chrome & Edge live (`overflows=[]`). |
| `CT-31` | Popup không bị bàn phím che / vượt viewport | **PASS (Emulated Mobile)** | `.modal-backdrop` dùng `overflow-y: auto` + `safe-area-inset`; `.modal-content` giới hạn `90dvh` scrollable; chụp kiểm chứng tại `quote-modal-mobile-390.png`. Thiết bị vật lý thực `NOT RUN`. |
| `CT-32` | Nút liên hệ nổi không che form | **PASS** | `MainLayout.tsx` gán `.is-footer-visible` (`aria-hidden="true"`, ẩn hẳn) trên `/contact` và khi `QuoteModal` đang mở (`floatHidden: True`). |
| `CT-33` | Form hoạt động trên các laptop và desktop | **PASS** | Kiểm thử thực tế ở `1024×768`, `1366×768`, `1920×1080`, `2560×1440` + zoom `125%` và `150%` trên Chrome & Edge live (`overflows=[]`). |
| `CT-34` | Form hỗ trợ các ngôn ngữ đang triển khai (`vi`, `en`, `ko`, `zh-CN`) | **PASS** | `CT-34-MIDFORM-LOCALE-PRESERVE` live Chrome & Edge: chuyển từ `vi` -> `ko` giữa chừng giữ nguyên Name, Email, Message và `productId=soft-dried-red-dragonfruit`. |
| `CT-35` | Không ảnh hưởng hệ thống Admin | **PASS** | `npx tsx scripts/test-admin-suite.mjs` đạt **19/19 PASS** sau mọi thay đổi. |
| `CT-36` | Không ảnh hưởng cơ chế xuất bản CMS | **PASS** | `Certificates` / `Settings` / `Publish` APIs đạt 19/19; `AdminSettings.tsx` giữ nguyên quy trình lưu & publish lên GitHub/Vercel. |
| `CT-37` | Production build thành công | **PASS** | `npm run build` thoát code `0` (`check:i18n`, `tsc -b`, `tsc -p tsconfig.server.json --noEmit`, `build-api`, `vite build`, `generate-seo-artifacts`). |
| `CT-38` | Website không bị trắng sau deployment | **PASS** | `https://www.vinaxo.net` phục vụ `assets/index-BihNtaaY.js` HTTP 200; Chrome & Edge live đều vượt **8/8** check Contact/Maps. |

---

## 2. Trình duyệt / Thiết bị Chưa chạy (`NOT RUN`)

- **Safari (macOS / iOS)**, **Mozilla Firefox**, và **điện thoại vật lý (iPhone / Android thật)**: Chưa chạy kiểm thử trực tiếp trên máy thực (`NOT RUN`), chỉ xác minh bằng headless Google Chrome & Microsoft Edge trên Windows qua giả lập viewport `320px`–`2560px` và scale `125%`/`150%`.

---

## 3. Trả lời Tóm tắt 18 Câu hỏi Yêu cầu (Section 19)

1. **Tại sao form trước đây mở email app?** Vì frontend dùng `mailto:` trong bản đầu và còn sót chuỗi `connectNote` mô tả mở email app dù đã có `/api/inquiry`.
2. **Form mới gửi theo quy trình nào?** Nhập liệu -> `validateContactForm` (chỉ 3 trường bắt buộc) -> `POST /api/contact` -> Backend validate + xác minh `productId` -> Resend/Brevo/Webhook -> trả kết quả thực tế cho client.
3. **Chọn dịch vụ email nào?** Hỗ trợ chính **Resend** (`RESEND_API_KEY`) và tùy chọn dự phòng **Brevo** (`BREVO_API_KEY`) qua HTTPS REST API tương thích Vercel Serverless.
4. **Chi phí & giới hạn?** Đều có gói miễn phí phù hợp khởi động B2B *(khuyến nghị đối chiếu hạn mức hiện hành trực tiếp trên trang pricing chính thức của Resend/Brevo trước khi kích hoạt)*.
5. **Email nhận yêu cầu đã được xác nhận chưa?** Mặc định tạm trỏ `cuonghoang0710@gmail.com`; chủ sở hữu cần xác nhận lại qua biến `CONTACT_TO_EMAIL` trên Vercel.
6. **Biến môi trường cần cấu hình?** `RESEND_API_KEY` (hoặc `BREVO_API_KEY`), `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (tất cả phía server, không tiền tố `VITE_`).
7. **Có cần SPF/DKIM/DMARC không?** Có khi dùng địa chỉ `@vinaxo.net` / `@mail.vinaxo.net` (thêm TXT/CNAME theo hướng dẫn nhà cung cấp, **giữ nguyên bản ghi MX gốc**). Xem [VINAXO_EMAIL_SERVICE_SETUP.md](VINAXO_EMAIL_SERVICE_SETUP.md).
8. **Sửa URL sai ở đâu?** `src/config/siteConfig.ts` (`normalizeSiteUrl`, `normalizeExternalWebsiteUrl`), `src/data/company.ts`, `src/shared/schemas/settingsSchema.ts`, `src/admin/pages/AdminSettings.tsx`, `content/settings/company.json`.
9. **Tọa độ nhà máy đã được xác nhận chưa?** Giữ nguyên `10.380295, 106.516139` sẵn có; đề nghị chủ sở hữu đối chiếu pin cổng thực tế & có thể cập nhật trong `/admin/settings`.
10. **Marker và nút chỉ đường đã đồng nhất chưa?** Đã đồng nhất 100% cùng `10.380295, 106.516139` từ `COMPANY_INFO.location`.
11. **Trường bắt buộc đã chuẩn hóa chưa?** Đã chuẩn hóa trên cả `Contact`, `QuoteModal`, `ContactForm` và `server/inquiry.ts`: chỉ bắt buộc **Họ tên**, **Email**, **Nội dung yêu cầu**.
12. **Form hoạt động đúng trên mobile không?** Pass qua headless Chrome & Edge (`320`–`430px`); thiết bị di động vật lý `NOT RUN`.
13. **VINAXO đã nhận được yêu cầu thử nghiệm chưa?** **Chưa (`BLOCKED`)** — live trả `503 DELIVERY_NOT_CONFIGURED` do Vercel chưa có API key gửi email.
14. **Bảo mật xử lý thế nào?** Validate 2 tầng, chặn CRLF header injection, không tin client `productName`/`to`, không dùng email khách làm `From`, honeypot + 60s dedup + rate limit + không log PII.
15. **Các file đã chỉnh sửa?** Liệt kê đầy đủ tại Mục 4 của [VINAXO_CONTACT_QUOTATION_IMPLEMENTATION_REPORT.md](VINAXO_CONTACT_QUOTATION_IMPLEMENTATION_REPORT.md).
16. **Commit SHA & Deployment?** Commit tính năng `ae41037`, merge `main`: `ebbad60bad33222544a13157c1ff2922ab66ed10`, live `x-vercel-id`: `hkg1::iad1::zvc4x-1795744407174-2e742fea4daf`.
17. **Blocker còn tồn tại?** Thiếu `RESEND_API_KEY` (hoặc `BREVO_API_KEY`) & xác nhận inbox thật `CT-20`; khuyến nghị xác nhận tọa độ cổng nhà máy thực địa và test mobile vật lý.
18. **Thao tác chủ sở hữu cần làm?** Thêm 3 biến môi trường trên Vercel + Redeploy + test 1 lượt tại `/contact` theo [VINAXO_EMAIL_SERVICE_SETUP.md](VINAXO_EMAIL_SERVICE_SETUP.md).

---

## 4. Ảnh chụp Kiểm chứng Live (`docs/screenshots/contact-qa/`)

- `docs/screenshots/contact-qa/contact-desktop-1440.png`
- `docs/screenshots/contact-qa/maps-desktop-1440.png`
- `docs/screenshots/contact-qa/maps-mobile-390.png`
- `docs/screenshots/contact-qa/quote-modal-mobile-390.png`
