# BẢO MẬT HỆ THỐNG CMS VINAXO
## CMS SECURITY SPECIFICATION & AUDIT

**Dự án**: VINAXO Corporate Web Platform  
**Tiêu chuẩn bảo mật**: Git-based Zero-Trust, OWASP Top 10 Web Application Security  

---

## 1. NGUYÊN TẮC BẢO MẬT ĐÃ THỰC THI

### 1.1. Cách ly Secret tuyệt đối (No Secret in Frontend)
- Toàn bộ secret của hệ thống xác thực (`GITHUB_CLIENT_SECRET`) chỉ được lưu trữ và đọc bên trong môi trường máy chủ bảo mật của Vercel (`process.env.GITHUB_CLIENT_SECRET`).
- Không có bất kỳ secret nào mang tiền tố `VITE_` nhằm ngăn chặn Vite đưa secret vào file JavaScript public.
- Quét mã nguồn và Git diff tự động xác nhận 0 API keys hoặc credentials nào bị commit vào kho lưu trữ.

### 1.2. Bảo vệ xác thực OAuth (Anti-CSRF & State Token)
- Endpoint `/api/auth.ts` sinh ngẫu nhiên mã cryptographic nonce 32 ký tự (`crypto.randomBytes(16).toString('hex')`) làm tham số `state`.
- Mã này được chuyển vào query parameter khi chuyển hướng sang GitHub và lưu tạm trong cookie trình duyệt có cờ `HttpOnly; SameSite=Lax; Secure`.
- Endpoint `/api/callback.ts` xác thực mã `state` trả về từ GitHub trước khi tiến hành trao đổi mã ủy quyền lấy access token.
- Cơ chế này loại bỏ hoàn toàn các cuộc tấn công CSRF (Cross-Site Request Forgery) và Open Redirect.

### 1.3. Phân tách Content Security Policy (CSP)
- Tuyến công khai `/(.*)`: Giữ nguyên chuẩn bảo mật cao nhất, chặn nạp script lạ (`connect-src 'self'`).
- Tuyến quản trị `/admin(.*)`: Định nghĩa CSP độc lập cho phép Decap CMS giao tiếp với `https://api.github.com` và tải script thư viện từ unpkg cố định phiên bản (`3.1.2`).
- Không sử dụng `unsafe-eval` trên các trang công cộng dành cho khách hàng.

### 1.4. Cơ chế kiểm soát quyền hạn (RBAC via GitHub ACL)
- Decap CMS không cho phép ai cũng có thể sửa dữ liệu:
  - Nếu một người không có quyền `write` trên repository GitHub cố gắng đăng nhập, GitHub API sẽ từ chối tất cả các yêu cầu tạo commit, sửa file hoặc tạo pull request.
  - Quyền truy cập được quản lý tập trung thông qua GitHub Collaborators. Việc thu hồi quyền có hiệu lực tức thì.

### 1.5. Chống tấn công XSS trong hiển thị nội dung
- Trình hiển thị nội dung bài viết [ArticleDetail.tsx](file:///e:/SONAI/VINAXO/src/pages/ArticleDetail.tsx) không sử dụng thuộc tính nguy hiểm `dangerouslySetInnerHTML`.
- Nội dung văn bản được phân tích và sinh ra các thẻ DOM React có kiểm soát (headings, paragraphs, blockquotes, lists), tự động thoát (escape) các chuỗi HTML độc hại.
