# QUY TRÌNH XUẤT BẢN DỮ LIỆU AN TOÀN (SAFE PUBLISHING PIPELINE)
**Mã tài liệu:** `VINAXO_SAFE_PUBLISHING_PIPELINE`  
**Phiên bản:** 1.0.0  
**Hệ thống:** VINAXO Git-backed Headless Serverless CMS  
**Kiến trúc:** React SPA + Vercel Serverless Functions + GitHub Git REST API  

---

## 1. Sơ đồ Luồng Hoạt động (Publishing Pipeline Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as Admin CMS Editor (React)
    participant API as Vercel Serverless API (/api/admin/*)
    participant GH as GitHub REST API (lap2004/VINAOX)
    participant VC as Vercel Build & Deploy Engine
    participant Client as Public Website (Trình duyệt Người dùng)

    Admin->>UI: Chỉnh sửa nội dung & bấm "Xuất bản bài viết"
    Note over UI: Bước 1: Client-Side Pre-validation Guard
    UI->>UI: Kiểm tra tính hợp lệ (Slug, Tiêu đề, Ngày, URL ảnh)
    alt Lỗi Validation tại Client
        UI-->>Admin: Hiển thị lỗi form trực quan, chặn gửi request
    end

    UI->>API: POST /api/admin/news (Session Cookie + Payload)
    Note over API: Bước 2: Serverless Authentication & Security Gate
    API->>API: Xác thực chữ ký Session Cookie (HMAC-SHA256)
    alt Không hợp lệ
        API-->>UI: Trả về HTTP 401 Unauthorized
    end

    Note over API: Bước 3: Đọc file gốc & Kiểm soát xung đột SHA
    API->>GH: GET /repos/lap2004/VINAOX/contents/{path}?ref=main
    GH-->>API: Trả về SHA hiện tại + Base64 content cũ
    API->>API: Kiểm tra concurrent SHA (Optimistic Concurrency Control)

    Note over API: Bước 4: Deep-Merge & Strict Schema Validation
    API->>API: mergeNewsArticle(existingData, requestData)
    API->>API: validateNewsArticle(mergedData)
    alt Dữ liệu vi phạm Contract
        API-->>UI: HTTP 422 Unprocessable Entity (Chi tiết lỗi)
    end

    Note over API: Bước 5: Nguyên tử hóa Commit lên GitHub
    API->>GH: PUT /repos/lap2004/VINAOX/contents/{path} (Message, Base64, SHA)
    GH-->>API: HTTP 200 OK (Commit SHA mới tạo trên nhánh main)
    API-->>UI: HTTP 200 OK ({ success: true, commitSha, slug })
    UI-->>Admin: Thông báo "Xuất bản thành công! Hệ thống đang cập nhật."

    Note over GH,VC: Bước 6: Tự động hóa CI/CD Deployment
    GH->>VC: GitHub Webhook kích hoạt Production Deployment
    VC->>VC: Chạy `npm run build` (tsc, build-api, vite build)
    VC->>VC: Triển khai Static Assets mới lên Vercel CDN

    Note over Client: Bước 7: Phân lập Lỗi & Tự Động Phục Hồi Cache
    Client->>Client: Người dùng duyệt web -> Nếu gặp Chunk Hash lệch
    Client->>Client: Bắt sự kiện vite:preloadError / unhandledrejection
    Client->>Client: Tự động Reload trang một lần an toàn
    Client-->>Client: Hiển thị nội dung mới nhất, không crash giao diện!
```

---

## 2. Các Lớp Bảo Vệ Chi Tiết (Defense-in-Depth Gates)

### Gate 1: Client-Side Pre-Validation Guard
- Thực hiện kiểm tra đồng bộ ngay khi người dùng bấm nút "Xuất bản".
- Bắt lỗi tiêu đề quá ngắn, slug sai chuẩn SEO, định dạng ngày tháng không hợp lệ trước khi gửi bất kỳ byte dữ liệu nào qua mạng.

### Gate 2: Xác thực & Phân quyền Serverless
- Kiểm tra session cookie ký bằng scrypt/HMAC-SHA256 bí mật.
- Ngăn chặn triệt để mọi hành vi sửa đổi dữ liệu từ bên ngoài mà không có phiên đăng nhập hợp lệ.

### Gate 3: Kiểm soát Xung đột Đồng thời (Optimistic Concurrency Control)
- Khi nạp bài viết từ GitHub, API lưu giữ mã file SHA của phiên bản hiện tại.
- Khi người dùng gửi lệnh lưu, API so sánh SHA: Nếu có ai khác đã chỉnh sửa file trên GitHub trong thời gian này, API từ chối ghi đè và trả về HTTP 409 Conflict, yêu cầu người dùng nạp lại dữ liệu mới nhất để tránh mất bài viết.

### Gate 4: Deep-Merge & Schema Validation Gate
- API tiến hành hợp nhất dữ liệu mới với dữ liệu cũ đã nạp từ GitHub.
- Các trường bổ sung như trích dẫn báo chí (`personQuoted`), link phụ (`secondaryUrls`), hoặc nội dung tiếng Anh (`content_en`) được bảo toàn tuyệt đối.
- Toàn bộ dữ liệu sau hợp nhất phải vượt qua kiểm tra của `validateNewsArticle` hoặc `validateProduct`. Nếu không đạt, hủy bỏ giao dịch commit.

### Gate 5: Cam kết Nguyên tử (Atomic Git Commit)
- API sử dụng GitHub Contents API để tạo commit trực tiếp trên nhánh production `main`.
- Nội dung commit rõ ràng: `CMS: update news article '{slug}' [skip ci] / production sync`.
- Không phụ thuộc vào môi trường local của người dùng.

### Gate 6: Bảo vệ Tải Chunk & Phục hồi Trình duyệt (Runtime Chunk Healing)
- Cấu hình `vercel.json` định tuyến chuẩn: file assets thiếu trả về 404 thay vì HTML 200.
- `src/main.tsx` bắt lỗi `vite:preloadError` tự động làm mới trang.
- `ErrorBoundary` đa tầng bảo đảm nếu 1 bài viết có hình ảnh lỗi hoặc cấu trúc sai, chỉ bài viết đó hiển thị hộp cảnh báo, toàn bộ khung website VINAXO vẫn hoạt động hoàn hảo.
