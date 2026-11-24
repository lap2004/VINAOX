# VINAXO CONTENT MANAGEMENT SYSTEM (CMS)
## IMPLEMENTATION PLAN & SYSTEM AUDIT

**Dự án**: VINAXO Corporate Website  
**Domain**: https://vinaxo.net (Vercel: https://vinaxo.vercel.app)  
**Kiến trúc CMS**: React + Vite + Decap CMS + GitHub OAuth + Vercel Serverless Functions  
**Baseline Git Commit**: `4f91b69e376b06b1068a59a235083dcedd17e6ca`  
**Nhánh triển khai**: `feature/vinaxo-decap-cms`  
**Ngày lập**: 24/11/2026  

---

## 1. KẾT QUẢ AUDIT SOURCE CODE HIỆN TẠI

### 1.1. Công nghệ & Dependencies
- **Frontend Core**: React 18.3.1, React DOM 18.3.1, React Router DOM 6.28.0, Framer Motion 11.11.17, Lucide React 0.460.0.
- **Build Tool**: Vite 5.4.11, TypeScript 5.6.3 (`tsc -b && vite build`).
- **Hosting & CI/CD**: Vercel liên kết với GitHub repository (`personal/main` tại `https://github.com/lap2004/VINAOX.git` và upstream `origin` tại `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO.git`).

### 1.2. Hiện trạng dữ liệu nội dung
- **Tin tức & Báo chí**: Toàn bộ 9 bài viết đang được hardcode tĩnh tại `src/data/news.ts` (`NewsItem[]`).
  - Bài báo CafeF (Xu hướng trái cây sấy tự nhiên)
  - Báo Người Lao Động (Chính sách xanh Châu Âu & BRCGS)
  - Báo Người Lao Động / CafeF / 24H (Thu mua mùa vụ & Dự trữ xoài)
  - Báo 24H (Đơn hàng Tết & OEM minh bạch)
  - Báo Đồng Tháp (Chị Hoàng Thị Thu Thảo)
  - Báo Thanh Niên (Quảng bá nông sản số)
  - Báo Sài Gòn Giải Phóng (Logistics xanh)
  - Báo Nông nghiệp & Môi trường (Cơ sở chế biến 4.000 m²)
  - Báo Đồng Tháp (Gương doanh nhân & OCOP)
- **Sản phẩm**: 12 dòng sản phẩm nhiệt đới VINAXO hardcode tại `src/data/products.ts`.
- **Thông tin công ty**: Cấu hình tại `src/data/company.ts`.
- **Brochure Viewer**: Quản lý tại `src/data/brochureData.ts` và `src/pages/Brochure.tsx`.
- **Đa ngôn ngữ**: Hệ thống i18n thủ công qua `src/i18n/LanguageContext.tsx`, `vi.ts` và `en.ts`.

### 1.3. Cấu hình Vercel & Bảo mật hiện tại
- File `vercel.json` định nghĩa Content Security Policy (CSP), Strict-Transport-Security (HSTS), và SPA rewrite `/:path* -> /index.html`.
- **Điểm cần lưu ý**:
  1. Header CSP hiện tại chặn kết nối bên ngoài (`connect-src 'self'`), do đó Decap CMS tải tại `/admin` cần CSP riêng để gọi `https://api.github.com` và nạp tài nguyên.
  2. SPA rewrite `/:path* -> /index.html` cần bảo đảm không bắt nhầm các route backend OAuth `/api/auth` và `/api/callback`, cũng như thư mục tĩnh `/admin/`.

---

## 2. KIẾN TRÚC HỆ THỐNG CMS ĐƯỢC CHỌN

```
                +---------------------------------------+
                |     Nhân viên / Biên tập viên         |
                +---------------------------------------+
                                    |
                                    v (Truy cập)
                        https://vinaxo.net/admin/
                                    |
             +----------------------+----------------------+
             |                                             |
             v                                             v
  +--------------------+                         +-------------------+
  | Decap CMS Frontend |                         | Vercel Serverless |
  | (public/admin/)    | <--- OAuth Token ------ | (api/auth.ts,     |
  +--------------------+                         |  api/callback.ts) |
             |                                   +-------------------+
             | (GitHub API với Token)                      ^
             v                                             | (Trao đổi code/secret)
  +--------------------+                         +-------------------+
  | GitHub Repository  | <---------------------- | GitHub OAuth App  |
  | (Lưu Git content & |                         +-------------------+
  |  Uploads hình ảnh) |
  +--------------------+
             |
             v (Webhook commit push)
  +---------------------------------------+
  | Vercel CI/CD Build Engine             |
  | (Vite đọc content build-time)         |
  +---------------------------------------+
             |
             v
  +---------------------------------------+
  | Website công khai VINAXO              |
  | (Siêu nhanh, bảo mật, 0 runtime DB)   |
  +---------------------------------------+
```

### Ưu điểm vượt trội:
1. **0đ chi phí vận hành**: Không tốn tiền duy trì database server.
2. **Không lo bị dừng dịch vụ**: Web hoạt động bình thường kể cả 6 tháng hay 1 năm không ai đăng nhập.
3. **Bảo mật tuyệt đối**: Dữ liệu nằm trong Git repository có versioning, lịch sử rollback chi tiết. Không lưu secret trong frontend bundle.
4. **Tốc độ tối đa**: Khách hàng đọc dữ liệu đã được Vite biên dịch tĩnh (SSG/Build-time manifest), không có độ trễ truy vấn database.

---

## 3. KẾ HOẠCH NÂNG CẤP & CÁC BƯỚC THỰC HIỆN

1. **Giai đoạn 1**: Phân tích hệ thống và tạo nhánh `feature/vinaxo-decap-cms` (Đã hoàn thành).
2. **Giai đoạn 2 & 7**: Migration dữ liệu tin tức từ `src/data/news.ts` sang các file JSON có cấu trúc trong `content/news/`, đảm bảo 9/9 bài viết giữ nguyên 100% dữ liệu VI/EN, slug, ảnh, tác giả và ngày đăng.
3. **Giai đoạn 3 & 8**: Xây dựng service nạp content (`src/services/contentService.ts`) sử dụng `import.meta.glob` build-time; cập nhật `PressMedia.tsx`, `Home.tsx` và tạo trang chi tiết bài viết `/tin-tuc/:slug` (với link hỗ trợ cả `/news/:slug`).
4. **Giai đoạn 4 & 5**: Cài đặt Decap CMS tại `public/admin/index.html` và `public/admin/config.yml` (phiên bản ghim cố định `3.1.2`, cấu hình giao diện tiếng Việt, Editorial Workflow, collection News, Products, Certificates, Brochure, Company Info).
5. **Giai đoạn 6**: Xây dựng Vercel Serverless OAuth Proxy (`api/auth.ts`, `api/callback.ts`), cấu hình chống CSRF bằng state token, tạo file `.env.example`.
6. **Giai đoạn 9 & 10**: Cập nhật `vercel.json` (tách header CSP an toàn cho `/admin/(.*)` và cấu hình rewrite không xung đột với `api/`), tối ưu SEO/sitemap.
7. **Giai đoạn 11 & 12**: Kiểm thử toàn diện 28 tiêu chí nghiệm thu (Acceptance Criteria AC-01 -> AC-28), kiểm tra typecheck và production build.
8. **Giai đoạn 13**: Hoàn thiện bộ 8 tài liệu bàn giao chuyên nghiệp trong thư mục `docs/`.

---

## 4. MA TRẬN RỦI RO & PHƯƠNG ÁN KIỂM SOÁT

| Rủi ro tiềm ẩn | Mức độ | Biện pháp kiểm soát |
|---|---|---|
| Lộ Client Secret của GitHub OAuth | Cao | Không sử dụng tiền tố `VITE_`. Secret chỉ được đọc trong Serverless Function trên server Vercel (`process.env.GITHUB_CLIENT_SECRET`). |
| Xung đột routing giữa SPA và Decap CMS | Trung bình | Khai báo route rõ ràng trong `vercel.json` và cấu hình Vite/Decap CMS base path chuẩn. |
| Mất dữ liệu bài viết cũ sau migration | Nghiêm trọng | Viết migration script tự động, kiểm tra khớp 100% field, giữ file `news.ts` làm lớp fallback nếu thiếu file content. |
| Người dùng không có quyền sửa nội dung | Cao | Decap CMS backend GitHub bắt buộc tài khoản GitHub phải có quyền Collaborator (Write/Admin) trên repository mới push commit được. |
| Lỗi CSP chặn nạp Decap CMS hoặc GitHub API | Trung bình | Cấu hình CSP riêng cho pattern `/admin/(.*)` cho phép kết nối `api.github.com` và tải script CMS ghim phiên bản. |

---
*Tài liệu được lập bởi Senior Full-stack Architect cho dự án VINAXO.*
