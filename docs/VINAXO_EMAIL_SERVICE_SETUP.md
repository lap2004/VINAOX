# HƯỚNG DẪN CẤU HÌNH DỊCH VỤ GỬI EMAIL & BIẾN MÔI TRƯỜNG — VINAXO

> **Tình trạng hiện tại trên Vercel Production (`27/11/2026`)**: Máy chủ Vercel **chưa khai báo `RESEND_API_KEY` hoặc `BREVO_API_KEY`**. Khi kiểm thử live `POST https://www.vinaxo.net/api/contact`, hệ thống hoạt động chuẩn xác và trả về trung thực `HTTP 503` (`DELIVERY_NOT_CONFIGURED`) hướng về địa chỉ nhận mặc định `cuonghoang0710@gmail.com`. **Website sẽ chưa thể gửi email thực tế cho đến khi chủ sở hữu hoàn tất bước cấu hình dưới đây.**

---

## 1. So sánh & Lựa chọn Dịch vụ Transactional Email

Backend (`server/inquiry.ts` / `api/contact.mjs`) hỗ trợ sẵn **Resend** (khuyến nghị số 1 cho Vercel Serverless) và **Brevo** (tùy chọn dự phòng):

| Tiêu chí | **Resend** (`RESEND_API_KEY` — Khuyến nghị) | **Brevo** (`BREVO_API_KEY` — Tùy chọn) |
|---|---|---|
| Tương thích Vercel Serverless | REST API HTTPS thuần (`api.resend.com`), không cần SMTP persistent socket | REST API HTTPS thuần (`api.brevo.com/v3/smtp/email`) |
| Hỗ trợ UTF-8 & Reply-To | Hỗ trợ đầy đủ Tiếng Việt, Tiếng Anh, Tiếng Hàn, Tiếng Trung & trường `reply_to` | Hỗ trợ đầy đủ UTF-8 & `replyTo` |
| Gói miễn phí & Chi phí *(tham khảo)* | Thường có gói Free cho khối lượng gửi nhỏ (phù hợp giai đoạn khởi động; vui lòng đối chiếu bảng giá/hạn mức hiện hành trên `resend.com/pricing` trước khi đăng ký) | Thường có gói Free theo ngày (vui lòng đối chiếu bảng giá/hạn mức hiện hành trên `brevo.com/pricing` trước khi đăng ký) |

*Lưu ý*: Chúng tôi **không tự ý đăng ký** tài khoản trả phí/miễn phí bằng thông tin doanh nghiệp và **không hardcode secret** vào mã nguồn.

---

## 2. Email Nhận Yêu cầu (`CONTACT_TO_EMAIL`)

- Hiện mã nguồn sử dụng giá trị mặc định dự phòng **`cuonghoang0710@gmail.com`** (trùng với email công khai trong `content/settings/company.json`).
- Khách hàng **không thể tự quyết định hay ghi đè địa chỉ `To`** từ request payload.
- Chủ sở hữu **vui lòng xác nhận lại** xem hộp thư `cuonghoang0710@gmail.com` hay một địa chỉ email nội bộ khác (ví dụ `sales@vinaxo.net`) sẽ là đầu mối nhận báo giá chính thức bằng cách gán giá trị tương ứng vào biến môi trường **`CONTACT_TO_EMAIL`** trên Vercel.

---

## 3. Các Biến Môi trường Cần Cấu hình trên Vercel Dashboard

Vào **Vercel Dashboard -> Project VINAXO -> Settings -> Environment Variables** (bật cho **Production**; không nên dùng khóa Production cho Preview hoặc nên trỏ `CONTACT_TO_EMAIL` trên Preview về hộp thư test nội bộ):

```env
# 1. Chọn MỘT nhà cung cấp email (khuyến nghị Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
# Hoặc nếu dùng Brevo thay thế Resend:
# BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxx

# 2. Địa chỉ From đã xác thực (xem mục 4 bên dưới)
CONTACT_FROM_EMAIL=VINAXO B2B Portal <no-reply@vinaxo.net>

# 3. Email doanh nghiệp nhận yêu cầu từ khách hàng (server-only)
CONTACT_TO_EMAIL=cuonghoang0710@gmail.com

# 4. (Tùy chọn) Webhook nhận bản sao qua Slack / Google Apps Script / CRM
INQUIRY_WEBHOOK_URL=
```

*Tuyệt đối không thêm tiền tố `VITE_` vào bất kỳ biến nào ở trên.* Mẫu biến không chứa giá trị thật đã được cập nhật sẵn trong [.env.example](../.env.example).

---

## 4. Xác thực Domain Gửi Email (SPF, DKIM, DMARC) — An toàn cho MX Hiện tại

- Nếu chỉ thử nghiệm nhanh với Resend bằng địa chỉ mặc định `VINAXO B2B Portal <onboarding@resend.dev>`, Resend chỉ cho phép gửi tới chính email chủ tài khoản Resend và dễ vào Spam khi gửi cho người khác.
- Để gửi ổn định lâu dài tới hộp thư doanh nghiệp và khách hàng với địa chỉ `no-reply@vinaxo.net` (hoặc subdomain `mail.vinaxo.net` — **khuyên dùng subdomain để cô lập uy tín domain chính**):
  1. Đăng nhập nhà cung cấp Resend (hoặc Brevo) -> **Add Domain** (`mail.vinaxo.net` hoặc `vinaxo.net`).
  2. Hệ thống sẽ cung cấp các bản ghi DNS dạng:
     - **DKIM**: 1–3 bản ghi `TXT` (hoặc `CNAME`)
     - **SPF (trên subdomain gửi)**: bản ghi `TXT` / `MX` cho bounce domain mà Resend chỉ định
     - **DMARC** (nếu root domain chưa có): `_dmarc.vinaxo.net` TXT `v=DMARC1; p=none; rua=mailto:...` (chỉ thêm mới nếu chưa tồn tại, theo dõi trước khi nâng lên `p=quarantine`)
  3. **NGUYÊN TẮC BẮT BUỘC**: **KHÔNG ĐƯỢC XÓA HOẶC THAY ĐỔI BẢN GHI `MX` GỐC** đang phục vụ hộp thư doanh nghiệp của `@vinaxo.net`. Nếu tên miền gốc `@vinaxo.net` đã có bản ghi `TXT` `v=spf1 ...`, chỉ gộp thêm `include:...` theo hướng dẫn của nhà cung cấp email vào đúng bản ghi SPF hiện có (không tạo hai bản ghi SPF cùng tên miền).
  4. Bấm **Verify DNS** trên Resend/Brevo -> sau khi xác thực xong mới đặt `CONTACT_FROM_EMAIL=VINAXO B2B Portal <no-reply@mail.vinaxo.net>`.

---

## 5. Các Bước Kích hoạt & Nghiệm thu Sau Cùng (Mở khóa `CT-20`)

1. Tạo tài khoản miễn phí trên [Resend](https://resend.com) (hoặc Brevo) -> tạo API Key có quyền gửi email (`Sending access`).
2. Thêm `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` vào **Vercel Environment Variables (Production)**.
3. Thực hiện **Redeploy** bản Production mới nhất trên Vercel (chỉ 1 click, không cần sửa code).
4. Truy cập `https://www.vinaxo.net/contact`, điền 1 yêu cầu thử nghiệm với nội dung `[VINAXO QA TEST – CONTACT FORM]` rồi bấm gửi -> xác nhận UI hiện banner xanh thành công kèm mã `VNX-...`.
5. Mở hộp thư `CONTACT_TO_EMAIL` (kiểm tra cả Inbox và Spam), xác nhận thấy email hiển thị đầy đủ dấu tiếng Việt/Anh/Hàn/Trung và bấm **Reply** kiểm tra địa chỉ trả lời có trỏ đúng email khách hàng hay không.
