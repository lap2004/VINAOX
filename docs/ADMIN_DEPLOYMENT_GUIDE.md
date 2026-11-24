# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG QUẢN TRỊ (ADMIN DEPLOYMENT GUIDE)

Tài liệu này hướng dẫn chi tiết quy trình triển khai phiên bản VINAXO Custom Admin từ nhánh `feature/vinaxo-custom-admin` lên nền tảng đám mây Vercel.

---

## 1. DANH SÁCH BIẾN MÔI TRƯỜNG CẦN CẤU HÌNH TRÊN VERCEL

Trước khi triển khai hoặc kích hoạt deployment, bạn cần vào **Vercel Dashboard** > **Project Settings** > **Environment Variables** để cấu hình 6 biến sau:

| STT | Tên biến (Key) | Giá trị mẫu | Mục đích |
| :---: | :--- | :--- | :--- |
| 1 | `ADMIN_USERNAME` | `admin` | Tên đăng nhập của tài khoản quản trị |
| 2 | `ADMIN_PASSWORD_HASH` | `scrypt:16384:8:1:<salt>:<hash>` | Chuỗi hash tạo từ `scripts/generate-password-hash.mjs` |
| 3 | `SESSION_SECRET` | `64_hex_random_characters...` | Khóa bí mật ký token HMAC-SHA256 |
| 4 | `GITHUB_TOKEN` | `github_pat_11...` | Token Fine-grained PAT có quyền `Contents: Read and write` |
| 5 | `GITHUB_REPO` | `lap2004/VINAOX` | Repository chứa mã nguồn dự án |
| 6 | `GITHUB_BRANCH` | `feature/vinaxo-custom-admin` | Nhánh Git mà Serverless Function commit vào |

> [!NOTE]
> Khi sau này bạn merge nhánh vào `main`, chỉ cần đổi giá trị `GITHUB_BRANCH` thành `main`.

---

## 2. KIỂM TRA TRƯỚC KHI TRIỂN KHAI (PRE-FLIGHT CHECKLIST)

Trước khi đẩy commit lên GitHub, hãy đảm bảo các bước kiểm tra sau đã hoàn tất tại máy cục bộ:

```bash
# 1. Kiểm tra biên dịch TypeScript
npx tsc -b

# 2. Kiểm tra Production Build
npm run build

# 3. Chạy toàn bộ Unit Tests kiểm tra bảo mật
npx tsx scripts/test-admin-suite.mjs
```

Tất cả các lệnh trên phải kết thúc với mã thoát `0` (Success).

---

## 3. CÁC BƯỚC ĐẨY CODE VÀ KÍCH HOẠT DEPLOYMENT

### Bước 1: Kiểm tra trạng thái Git
```bash
git status
```
Đảm bảo bạn đang đứng tại nhánh: `feature/vinaxo-custom-admin`.

### Bước 2: Thêm các tệp tin mới và tạo Commit
```bash
git add .
git commit -m "feat(admin): implement custom username/password login and enterprise cms dashboard"
```

### Bước 3: Đẩy commit lên remote repository
```bash
git push -u personal feature/vinaxo-custom-admin
```

---

## 4. QUY TRÌNH KIỂM THỬ TRÊN VERCEL PREVIEW DEPLOYMENT

Khi commit được đẩy lên GitHub, Vercel sẽ tự động tạo một **Preview Deployment** độc lập (ví dụ: `https://vinaox-git-feature-vinaxo-custom-admin-....vercel.app`).

Các bước nghiệm thu trực tiếp trên Preview:
1. Mở URL Preview được Vercel cung cấp.
2. Kiểm tra trang chủ `https://.../` hoạt động bình thường, load nhanh.
3. Truy cập vào `https://.../admin`:
   - Xác nhận trang tự động chuyển hướng về `https://.../admin/login`.
   - Đăng nhập bằng tài khoản `admin` và mật khẩu đã cấu hình.
   - Xác nhận chuyển vào Dashboard thành công.
4. Kiểm tra trang Quản lý tin tức (`/admin/news`), Quản lý sản phẩm (`/admin/products`), Thư viện ảnh (`/admin/media`).
5. Thử nghiệm tải lên một hình ảnh và xác nhận commit mới xuất hiện trên GitHub repository.

---

## 5. QUY TRÌNH CHÍNH THỨC XUẤT BẢN LÊN DOMAIN CHÍNH (MERGE TO PRODUCTION)

Khi doanh nghiệp đã nghiệm thu đầy đủ trên môi trường Preview:

1. Tạo Pull Request trên GitHub từ nhánh `feature/vinaxo-custom-admin` vào nhánh `main`.
2. Kiểm tra không có xung đột (merge conflicts) và merge PR vào `main`.
3. Cập nhật biến môi trường `GITHUB_BRANCH=main` trên Vercel.
4. Vercel tự động build và xuất bản hệ thống quản trị lên domain chính thức:
   **`https://vinaxo.net/admin`**
   và trang đăng nhập:
   **`https://vinaxo.net/admin/login`**.

---

## 6. QUY TRÌNH ROLLBACK KHẨN CẤP (NẾU CẦN)

Nhờ kiến trúc Git-based không có cơ sở dữ liệu bên ngoài, việc rollback cực kỳ an toàn và có thể thực hiện trong vòng 30 giây:

- **Cách 1 (Qua Vercel Dashboard)**: Vào Vercel > Chọn tab **Deployments** > Tìm deployment trước đó của nhánh `main` > Nhấp vào dấu 3 chấm `...` > Chọn **Instant Rollback**.
- **Cách 2 (Qua Git)**: Revert commit merge trên nhánh `main` và đẩy lên GitHub. Vercel sẽ tự động kích hoạt build lại phiên bản trước đó.
