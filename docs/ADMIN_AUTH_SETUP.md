# HƯỚNG DẪN THIẾT LẬP XÁC THỰC QUẢN TRỊ (ADMIN AUTH SETUP)

Tài liệu này hướng dẫn quản trị viên kỹ thuật của VINAXO cách khởi tạo, cấu hình và thay đổi tài khoản quản trị hệ thống CMS.

---

## 1. NGUYÊN TẮC BẢO MẬT XÁC THỰC

Hệ thống xác thực của VINAXO Custom Admin được xây dựng trên 4 nguyên tắc bảo mật khắt khe:

1. **Không lưu mật khẩu dạng thô (Zero Plaintext Passwords)**:
   Mật khẩu quản trị viên tuyệt đối không bao giờ xuất hiện trong source code, file cấu hình, Git repository hay bundle của trình duyệt.
2. **Thuật toán băm chuẩn công nghiệp Node.js Native `crypto.scrypt`**:
   - Sử dụng salt ngẫu nhiên 16 bytes (32 ký tự hex) cho mỗi lần sinh hash.
   - Thông số tính toán: `N = 16384` (CPU/memory cost), `r = 8` (block size), `p = 1` (parallelization), độ dài khóa kết quả `64 bytes` (128 ký tự hex).
   - Chống lại các cuộc tấn công dò mật khẩu bằng phần cứng ASIC, GPU hoặc Rainbow Tables.
3. **So sánh an toàn thời gian thực (`crypto.timingSafeEqual`)**:
   Ngăn chặn hoàn toàn tấn công kênh phụ đo thời gian phản hồi (Timing Attacks) khi kiểm tra tính hợp lệ của mật khẩu và chữ ký token.
4. **Phiên làm việc bảo vệ đa tầng (Hardened HttpOnly Cookie)**:
   - Cờ `HttpOnly`: Ngăn chặn hoàn toàn JavaScript và mã độc XSS truy cập vào token phiên.
   - Cờ `Secure`: Cookie chỉ được truyền tải qua kết nối mã hóa HTTPS (tự động bật trên môi trường Production).
   - Cờ `SameSite=Lax`: Ngăn chặn tấn công CSRF (Cross-Site Request Forgery).
   - Thời gian sống: 7 ngày (604,800 giây).

---

## 2. CÁCH KHỞI TẠO HASH MẬT KHẨU QUẢN TRỊ

Trên máy tính cá nhân của quản trị viên (yêu cầu Node.js v18 trở lên), thực hiện các bước sau:

### Bước 1: Mở Terminal tại thư mục dự án

```bash
cd E:\SONAI\VINAXO
```

### Bước 2: Chạy script tạo mã băm an toàn

Bạn có thể truyền trực tiếp mật khẩu muốn đặt:

```bash
node scripts/generate-password-hash.mjs "MatKhauQuanTriCuaBan@2026"
```

Hoặc chạy chế độ tương tác:

```bash
node scripts/generate-password-hash.mjs
```

### Bước 3: Nhận kết quả

Script sẽ sinh ra kết quả tương tự như sau:

```text
============================================================
✅ ĐÃ TẠO MÃ BĂM MẬT KHẨU AN TOÀN CHO VINAXO CMS
============================================================

Hãy sao chép 3 biến môi trường sau và dán vào Vercel Project Settings > Environment Variables:
------------------------------------------------------------
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:a3b98c...:f84e12...
SESSION_SECRET=e7418902d8471...
------------------------------------------------------------
```

---

## 3. CẤU HÌNH BIẾN MÔI TRƯỜNG TRÊN VERCEL

1. Truy cập vào trang quản trị Vercel Dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Chọn project **VINAXO**.
3. Vào tab **Settings** > chọn mục **Environment Variables** ở thanh bên trái.
4. Thêm 3 biến môi trường xác thực:

| Tên biến (Key) | Giá trị (Value) | Môi trường áp dụng |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | `admin` (hoặc tên đăng nhập tùy chọn của doanh nghiệp) | Production, Preview, Development |
| `ADMIN_PASSWORD_HASH` | Chuỗi `scrypt:16384:8:1:...` sinh ra từ Bước 2 | Production, Preview, Development |
| `SESSION_SECRET` | Chuỗi ngẫu nhiên tối thiểu 64 ký tự hex sinh ra từ Bước 2 | Production, Preview, Development |

> [!IMPORTANT]
> **Quy tắc bảo mật**: Tuyệt đối KHÔNG thêm tiền tố `VITE_` vào các biến trên. Tiền tố `VITE_` sẽ khiến Vite đưa biến vào bundle Javascript gửi về trình duyệt của khách hàng.

---

## 4. QUY TRÌNH THAY ĐỔI HOẶC ĐẶT LẠI MẬT KHẨU (PASSWORD ROTATION)

Khi cần thay đổi mật khẩu quản trị viên:

1. Chạy lại script trên máy cục bộ với mật khẩu mới:
   ```bash
   node scripts/generate-password-hash.mjs "MatKhauMoi2026!"
   ```
2. Truy cập Vercel Settings > Environment Variables.
3. Cập nhật lại giá trị của `ADMIN_PASSWORD_HASH`.
4. Bấm **Redeploy** trên Vercel để cập nhật phiên bản Serverless Function mới.
5. Mọi phiên đăng nhập cũ sẽ bị vô hiệu hóa khi đổi cả `SESSION_SECRET`. Quản trị viên chỉ cần đăng nhập lại bằng mật khẩu mới tại `/admin/login`.
