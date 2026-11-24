# BÁO CÁO PHÂN TÍCH AN TOÀN BẢO MẬT HỆ THỐNG (ADMIN SECURITY ARCHITECTURE)

Hệ thống quản trị VINAXO Custom Admin được thiết kế theo mô hình **Zero-Trust Serverless**, tuân thủ các tiêu chuẩn bảo mật OWASP Top 10 và bảo vệ tối đa dữ liệu doanh nghiệp.

---

## 1. MÔ HÌNH NGUY CƠ & CHIẾN LƯỢC BẢO VỆ (THREAT MODELING)

| Nguy cơ bảo mật | Mức độ rủi ro | Cơ chế phòng vệ của VINAXO Custom Admin | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Lộ mật khẩu qua mã nguồn** | Cực kỳ nghiêm trọng | Mật khẩu gốc không bao giờ lưu trong Git. Chỉ lưu hash `scrypt` trên biến môi trường bí mật Vercel. | **ĐÃ TRIỆT TIÊU** |
| **Tấn công dò mật khẩu (Brute-force / Rainbow Tables)** | Cao | Sử dụng thuật toán `scrypt` tốn nhiều bộ nhớ và CPU, muối ngẫu nhiên 16 bytes (32 ký tự hex) cho từng lần băm. | **ĐÃ TRIỆT TIÊU** |
| **Đo thời gian phản hồi (Timing Attacks)** | Trung bình | Kiểm tra mật khẩu và chữ ký HMAC bằng `crypto.timingSafeEqual()`, đảm bảo thời gian so sánh là hằng số. | **ĐÃ TRIỆT TIÊU** |
| **Đánh cắp token phiên qua XSS** | Cao | Token phiên được lưu độc quyền trong Cookie có cờ `HttpOnly`. JavaScript trên trình duyệt bị cấm đọc. | **ĐÃ TRIỆT TIÊU** |
| **Giả mạo yêu cầu chéo trang (CSRF)** | Trung bình | Cookie thiết lập `SameSite=Lax`, tất cả các API thay đổi dữ liệu yêu cầu phương thức POST/DELETE và `Content-Type: application/json`. | **ĐÃ TRIỆT TIÊU** |
| **Ghi đè mã nguồn qua Path Traversal** | Nghiêm trọng | Hàm API kiểm tra nghiêm ngặt tiền tố đường dẫn (Allowlist), chỉ cho phép ghi vào `content/` và `public/uploads/`. | **ĐÃ TRIỆT TIÊU** |
| **Tấn công từ chối dịch vụ (Upload DoS)** | Trung bình | Tự động nén WebP tại client, kiểm tra kích thước tối đa 4.5MB tại Serverless Function. | **ĐÃ TRIỆT TIÊU** |

---

## 2. THUẬT TOÁN BĂM MẬT KHẨU (PASSWORD HASH SPECIFICATION)

### Chi tiết thuật toán:
Hệ thống sử dụng hàm dẫn xuất khóa `scrypt` tích hợp sẵn trong thư viện chuẩn `crypto` của Node.js:

$$\text{DerivedKey} = \text{scrypt}(\text{Password}, \text{Salt}, \text{keylen} = 64, N = 16384, r = 8, p = 1)$$

- **Salt**: 16 bytes ngẫu nhiên được sinh bằng bộ sinh số ngẫu nhiên an toàn mật mã (`crypto.randomBytes(16)`).
- **$N = 16384$**: Chi phí bộ nhớ và CPU tiêu chuẩn của IETF RFC 7914.
- **$r = 8$**: Kích thước khối tuần tự 1024 bytes.
- **$p = 1$**: Mức độ tính toán song song.
- **Định dạng lưu trữ**:
  `scrypt:<salt_hex>:<derived_key_hex>`

### Cơ chế so sánh:
Khi quản trị viên đăng nhập, serverless function băm lại mật khẩu nhập vào với `salt` đã lưu và so sánh hai vùng đệm bộ nhớ bằng hàm thời gian hằng số:

```typescript
const isMatch = crypto.timingSafeEqual(originalDerivedKey, calculatedDerivedKey);
```

---

## 3. QUẢN LÝ PHIÊN LÀM VIỆC (SESSION INTEGRITY)

### Cấu trúc Token:
Token phiên được ký bằng thuật toán HMAC-SHA256 với khóa bí mật `SESSION_SECRET` (tối thiểu 32 bytes):

$$\text{Token} = \text{username} \,.\, \text{issuedAt} \,.\, \text{expiresAt} \,.\, \text{HMAC-SHA256}(\text{payload}, \text{SESSION\_SECRET})$$

### Tính toàn vẹn:
Nếu kẻ tấn công cố ý sửa đổi `username` từ `admin` thành tài khoản khác hoặc sửa đổi `expiresAt` để kéo dài phiên, chữ ký HMAC sẽ không khớp và yêu cầu bị từ chối với mã lỗi `401 Unauthorized`.

### Cấu hình Cookie an toàn:
```http
Set-Cookie: session_token=<hmac_signed_token>; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure
```
- `HttpOnly`: Ngăn chặn mọi cuộc tấn công XSS lấy cắp token.
- `SameSite=Lax`: Trình duyệt không gửi cookie trong các yêu cầu chéo trang POST của bên thứ ba.
- `Secure`: Bắt buộc chỉ truyền qua giao thức HTTPS.

---

## 4. BẢO VỆ ĐƯỜNG DẪN TỆP TIN (PATH TRAVERSAL MITIGATION)

Tại `api/lib/github.ts`, mọi đường dẫn file đều phải vượt qua bộ lọc kiểm tra tiền tố an toàn:

```typescript
const ALLOWED_DIRECTORIES = [
  'content/news/',
  'content/products/',
  'content/settings/',
  'content/certificates/',
  'public/uploads/'
];

function isPathAllowed(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  // Chặn hoàn toàn ký tự lùi thư mục '..'
  if (normalized.includes('..')) return false;
  return ALLOWED_DIRECTORIES.some(prefix => normalized.startsWith(prefix));
}
```

Mọi yêu cầu cố ý ghi vào các đường dẫn nhạy cảm như `package.json`, `api/`, `src/App.tsx` hoặc `.env` sẽ lập tức bị chặn với ngoại lệ an toàn `Đường dẫn file không nằm trong danh mục cho phép`.

---

## 5. TIÊU CHUẨN HEADERS AN NINH HTTP (HTTP SECURITY HEADERS)

Cấu hình tại `vercel.json` áp dụng cho toàn bộ domain `vinaxo.net`:

- `X-Content-Type-Options: nosniff`: Ngăn chặn trình duyệt đoán định sai MIME-type để thực thi mã độc.
- `X-Frame-Options: SAMEORIGIN`: Chống tấn công Clickjacking bằng iframe lồng ghép.
- `Referrer-Policy: strict-origin-when-cross-origin`: Giới hạn rò rỉ URL nhạy cảm khi chuyển hướng ra trang ngoài.
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`: Ép buộc trình duyệt kết nối 100% bằng HTTPS.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Vô hiệu hóa quyền truy cập thiết bị phần cứng của người dùng.
