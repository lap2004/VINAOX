# BÁO CÁO KIỂM THỬ LUỒNG GỬI YÊU CẦU KHÁCH HÀNG B2B — VINAXO (PHASE G)

- **Endpoint mới**: `POST /api/inquiry` (`server/inquiry.ts` -> `api/inquiry.mjs`)
- **Client Service**: `src/services/inquiryService.ts`
- **Các form được rà soát & nâng cấp**:
  1. `src/pages/Contact.tsx` (Form liên hệ & báo giá B2B chính tại `/contact`)
  2. `src/components/ui/QuoteModal.tsx` (Popup Nhận báo giá toàn site)
  3. `src/components/forms/ContactForm.tsx` (Component form dùng lại)

---

## 1. Phát hiện Hiện trạng Trước Khi Sửa (Truy vết Luồng Dữ liệu)

Trước bản sửa, cả 3 form trên website đều **không có backend nhận yêu cầu**:
- `Contact.tsx` và `QuoteModal.tsx` chỉ chạy `window.location.href = "mailto:cuonghoang0710@gmail.com?..."` rồi lập tức hiển thị thông báo đã chuyển tiếp yêu cầu (dù người dùng không hề cài ứng dụng email trên máy hoặc hủy gửi mail).
- `ContactForm.tsx` dùng `setTimeout(..., 700)` giả lập thành công ở frontend mà không gửi dữ liệu đi đâu.
- `QuoteModal.tsx` dùng 6 nhóm chung chung trong `<select>` nên `defaultProduct` truyền từ card sản phẩm cụ thể bị bỏ qua.

---

## 2. Kiến trúc Luồng Gửi Yêu cầu Mới

```text
Người dùng nhập form (Contact / QuoteModal / ContactForm)
  -> Frontend validation (required fields, RFC email, độ dài, double-submit lock)
  -> POST /api/inquiry (JSON + X-Requested-With + timeout 15s)
  -> Server-side security & validation:
       * Chặn non-POST (405), non-JSON (415), cross-origin (403), body > 16KB (413)
       * Honeypot trap (hp_website / company_website_hp / quote_company_fax_hp)
       * Rate Limit 5 yêu cầu / 10 phút / IP (429 + Retry-After)
       * Chống gửi trùng trong 60 giây (409 DUPLICATE_SUBMISSION)
       * Kiểm tra trường bắt buộc, định dạng email, khử ký tự điều khiển
  -> Kiểm tra kênh gửi thực tế:
       * Nếu có RESEND_API_KEY -> Gửi email UTF-8 HTML + text tới INQUIRY_TO_EMAIL (mặc định: cuonghoang0710@gmail.com)
       * Nếu có INQUIRY_WEBHOOK_URL -> Gửi JSON tới webhook CRM / Google Apps Script / Slack
       * Nếu CHƯA cấu hình cả hai -> Trả HTTP 503 (DELIVERY_NOT_CONFIGURED), TUYỆT ĐỐI KHÔNG giả lập 200 thành công!
  -> Giao diện Client:
       * Thành công (200 delivered: true) -> Hiện thông báo xanh kèm mã tham chiếu VNX-YYYYMMDD-XXXXXX
       * Thất bại / 503 / Mạng lỗi -> Giữ nguyên toàn bộ dữ liệu khách đã nhập, báo lỗi trung thực và hiện nút Mở ứng dụng Email (mailto:), Sao chép nội dung, WhatsApp & Zalo.
```

---

## 3. Trả lời Câu hỏi Bắt buộc

### 3.1. Form liên hệ và nhận báo giá thực tế gửi dữ liệu đến đâu?
- Yêu cầu gửi qua `POST /api/inquiry`, đích nhận cấu hình tại `process.env.INQUIRY_TO_EMAIL` (mặc định **`cuonghoang0710@gmail.com`**) thông qua dịch vụ gửi email Resend API (`RESEND_API_KEY`) và/hoặc Webhook (`INQUIRY_WEBHOOK_URL`).
- **Tình trạng cấu hình trên Vercel Production hiện tại (`26/11/2026`)**: Máy chủ Vercel **chưa khai báo `RESEND_API_KEY` hoặc `INQUIRY_WEBHOOK_URL`**, do đó khi gửi thử thực tế trên `https://www.vinaxo.net/api/inquiry`, API trả về trung thực:
  - **HTTP `503`**: `{ "ok": false, "delivered": false, "code": "DELIVERY_NOT_CONFIGURED", "recipient": "cuonghoang0710@gmail.com" }`
  - Trên UI (`docs/screenshots/pre-handover/contact-form/contact-form-503-fallback.png`), form giữ nguyên thông tin người dùng đã nhập (`VINAXO QA Test`), thông báo trung thực máy chủ chưa cấu hình gửi email tự động và cung cấp sẵn nút mở Email app (`mailto:`), Sao chép nội dung, WhatsApp và Zalo.

### 3.2. VINAXO đã xác nhận nhận được yêu cầu chưa?
- **CHƯA (`BLOCKED`)**. Vì `RESEND_API_KEY` / `INQUIRY_WEBHOOK_URL` chưa được thiết lập trong Vercel Environment Variables và chúng tôi không có quyền truy cập hộp thư `cuonghoang0710@gmail.com`, test case **`QA-17` được đánh dấu `BLOCKED`**.

---

## 4. Kết quả Kiểm thử Form & API

| Hạng mục kiểm thử | Môi trường kiểm thử | Kết quả |
|---|---|:---:|
| Unit test `api/inquiry.mjs` (405, 415, 400 validation, honeypot, 503 khi thiếu env, mocked Resend 200 UTF-8, 409 chống trùng, 429 rate-limit) | Node (`scripts/test-seo-and-inquiry.mjs`) | **PASS (5/5 API cases)** |
| Validation thiếu trường bắt buộc (`QA-13`) & sai định dạng email (`QA-14`) trên mobile `390×844` | Live Chrome & Edge (`www.vinaxo.net/contact`) | **PASS** |
| Truyền đúng sản phẩm từ Product Card vào `QuoteModal` (`QA-16`) | Live Chrome & Edge (`www.vinaxo.net/products`) | **PASS (`banana-chips`)** |
| Xử lý API trả `503` trung thực, giữ nguyên input (`QA-19`, `QA-20`, `QA-21`) | Live Chrome (`www.vinaxo.net/contact`) | **PASS** |
| Gửi form hợp lệ có `200 delivered: true` từ máy chủ production (`QA-15`) | Live `www.vinaxo.net/api/inquiry` | **BLOCKED** (chờ cấu hình `RESEND_API_KEY` trên Vercel; đã pass ở unit test với mock Resend) |
| Doanh nghiệp VINAXO xác nhận nhận email thực tế trong hộp thư (`QA-17`) | Hộp thư `cuonghoang0710@gmail.com` | **BLOCKED** |
| Chống gửi trùng khi bấm nhiều lần (`QA-18`) | Unit test `api/inquiry.mjs` + `isSubmitting` lock | **PASS** |

---

## 5. Hướng dẫn Mở khóa `QA-17` Trước Khi Bàn giao Chính thức

Chủ sở hữu dự án cần thực hiện **2 bước** sau trong Vercel Dashboard:
1. Vào **Vercel Project Settings -> Environment Variables** (Production & Preview), thêm:
   - `RESEND_API_KEY` = API key từ tài khoản Resend (đã xác minh domain gửi hoặc `onboarding@resend.dev` để test)
   - `INQUIRY_FROM_EMAIL` = địa chỉ gửi hợp lệ trên Resend (ví dụ `VINAXO B2B <no-reply@vinaxo.net>`)
   - `INQUIRY_TO_EMAIL` = `cuonghoang0710@gmail.com`
   - *(Hoặc cấu hình `INQUIRY_WEBHOOK_URL` nếu tiếp nhận qua Google Apps Script / CRM)*
2. Redeploy lại trên Vercel, gửi 1 yêu cầu thử nghiệm `[VINAXO QA TEST – PRE-HANDOVER]` tại `/contact` và xác nhận email hiển thị đầy đủ tiếng Việt UTF-8 trong hộp thư `cuonghoang0710@gmail.com`.
