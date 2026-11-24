# VINAXO CONTENT MANAGEMENT SYSTEM (CMS)
## HỆ THỐNG KIẾN TRÚC KỸ THUẬT (CMS ARCHITECTURE)

**Dự án**: VINAXO Corporate Web Platform  
**Phiên bản CMS**: Decap CMS v3.1.2 (Git-based Serverless)  
**Tác giả**: Senior Full-stack Architect & Security Engineer  

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Website VINAXO áp dụng mô hình **Git-based Headless CMS**:

```text
+-------------------------------------------------------------------------+
|                          NGƯỜI DÙNG & BIÊN TẬP VIÊN                     |
+-------------------------------------------------------------------------+
       |                                              |
       | (Khách hàng truy cập)                        | (Nhân viên quản trị)
       v                                              v
https://vinaxo.net/                           https://vinaxo.net/admin/
(Trang chủ, Sản phẩm, Tin tức,...)            (Giao diện Decap CMS Tiếng Việt)
       |                                              |
       |                                              v (Đăng nhập GitHub OAuth)
       |                                      +-------------------------------+
       |                                      | Vercel Serverless OAuth Proxy |
       |                                      | - /api/auth.ts (Tạo CSRF)     |
       |                                      | - /api/callback.ts (Token)    |
       |                                      +-------------------------------+
       |                                              |
       |                                              v (GitHub API với Token)
       |                                      +-------------------------------+
       |                                      | GitHub Repository             |
       |                                      | - content/news/*.json         |
       |                                      | - content/products/*.json     |
       |                                      | - public/uploads/*            |
       |                                      +-------------------------------+
       |                                              |
       | (Trang web tĩnh siêu tốc)                     v (Tự động kích hoạt Webhook)
       |                                      +-------------------------------+
       +------------------------------------- | Vercel CI/CD Build Engine     |
                                              | npm run build                 |
                                              | (Vite nạp content build-time) |
                                              +-------------------------------+
```

---

## 2. NGUYÊN TẮC THIẾT KẾ CỐT LÕI

1. **Không phụ thuộc Database runtime**:
   - Dữ liệu được lưu trữ trực tiếp dưới dạng các file JSON có cấu trúc trong thư mục `content/`.
   - Không dùng database bên ngoài (Supabase/Firebase/MongoDB) nhằm loại bỏ hoàn toàn nguy cơ database bị tạm dừng (pause/sleep) do không có truy cập trong thời gian dài.
2. **Bảo mật Secret tuyệt đối**:
   - `GITHUB_CLIENT_SECRET` chỉ tồn tại duy nhất trên Vercel Serverless Function và được đọc qua `process.env.GITHUB_CLIENT_SECRET`.
   - Không thêm tiền tố `VITE_` vào các biến bí mật, bảo đảm secret không bao giờ bị lộ vào file bundle JavaScript của người dùng.
3. **Hiệu suất trang khách hàng (Zero Runtime Overhead)**:
   - Toàn bộ bài viết được biên dịch tĩnh tại thời điểm build (`import.meta.glob('/content/news/*.json', { eager: true })`).
   - Khách hàng không cần gọi GitHub API, tốc độ tải trang đạt mức tối đa và bảo vệ hạn ngạch API.
4. **Quy trình biên tập Editorial Workflow**:
   - Decap CMS hỗ trợ 3 trạng thái:
     - **Drafts (Bản nháp)**: Được lưu trữ trong nhánh riêng trên Git (`cms/drafts/...`), không xuất hiện trên website chính thức.
     - **In Review (Chờ duyệt)**: Biên tập viên kiểm tra bài viết.
     - **Published (Đã xuất bản)**: Merge vào nhánh chính (`main`), kích hoạt Vercel tự động build và xuất hiện trên web.

---

## 3. CƠ CHẾ NẠP DỮ LIỆU BUILD-TIME

Dịch vụ [contentService.ts](file:///e:/SONAI/VINAXO/src/services/contentService.ts) chịu trách nhiệm:
- Sử dụng tính năng `import.meta.glob` của Vite để quét và đóng gói tự động toàn bộ bài viết trong `content/news/*.json`.
- Tự động sắp xếp bài viết theo ngày xuất bản mới nhất (`published_at` DESC).
- Chuyển đổi định dạng `ArticleContent` thành `NewsItem` để tương thích 100% với các component giao diện hiện hữu ([NewsCard.tsx](file:///e:/SONAI/VINAXO/src/components/news/NewsCard.tsx), [PressMedia.tsx](file:///e:/SONAI/VINAXO/src/pages/PressMedia.tsx), [Home.tsx](file:///e:/SONAI/VINAXO/src/pages/Home.tsx)).
- Hỗ trợ cơ chế dự phòng an toàn (graceful fallback) khi thư mục content chưa có dữ liệu.

---

## 4. BẢO MẬT VÀ PHÂN TÁCH CONTENT SECURITY POLICY (CSP)

File [vercel.json](file:///e:/SONAI/VINAXO/vercel.json) thiết lập:
- Tuyến công khai `/(.*)`: Áp dụng CSP nghiêm ngặt không cho phép script bên ngoài hoặc iframe lạ.
- Tuyến quản trị `/admin(.*)`: Cho phép Decap CMS kết nối `https://api.github.com`, nạp style từ Google Fonts và thư viện Decap CMS cố định.
- Quy tắc rewrite: Tuyến `/((?!api/|admin|uploads/).*)` điều hướng về SPA `/index.html`, tách biệt hoàn toàn và bảo vệ các endpoint OAuth `/api/auth` và `/api/callback`.
