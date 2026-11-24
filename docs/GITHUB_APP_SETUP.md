# HƯỚNG DẪN THIẾT LẬP KẾT NỐI GITHUB BACKEND (GITHUB STORAGE SETUP)

Hệ thống VINAXO Custom Admin sử dụng kho lưu trữ GitHub làm cơ sở dữ liệu lưu trữ nội dung (Content Data Lake). Nhân viên đăng nhập vào CMS bằng tài khoản nội bộ và **không bao giờ tương tác trực tiếp với GitHub**.

Mọi thao tác lưu bài viết, chỉnh sửa sản phẩm hoặc tải hình ảnh đều do các Vercel Serverless Function (`/api/admin/*`) thay mặt thực hiện thông qua GitHub REST API.

---

## 1. NGUYÊN TẮC BẢO MẬT GITHUB BACKEND

1. **Phân tách hoàn toàn (Complete Decoupling)**:
   - Trình duyệt và người dùng không có bất kỳ quyền truy cập nào vào token GitHub.
   - Token chỉ nằm trên môi trường Serverless Function của Vercel (`process.env.GITHUB_TOKEN`).
2. **Quyền hạn tối thiểu (Principle of Least Privilege)**:
   - Chỉ cấp quyền đọc và ghi nội dung (`Contents: Read and write`) trên duy nhất repository `lap2004/VINAOX`.
   - Không cấp quyền truy cập repository khác, không cấp quyền quản trị tổ chức (Organization/Admin) hoặc xóa repository.
3. **Danh sách đường dẫn cho phép nghiêm ngặt (Path Allowlist Enforcement)**:
   Hàm bảo vệ tại `api/lib/github.ts` từ chối mọi yêu cầu commit vào các file hệ thống (`src/`, `package.json`, `.env`, `api/`,...). Chỉ chấp nhận ghi vào 4 thư mục nội dung:
   - `content/news/` (Bài viết tin tức)
   - `content/products/` (Sản phẩm xuất khẩu)
   - `content/settings/` (Cấu hình công ty & brochure)
   - `public/uploads/` (Hình ảnh tối ưu WebP)

---

## 2. HƯỚNG DẪN TẠO GITHUB FINE-GRAINED ACCESS TOKEN

Chúng tôi khuyến nghị sử dụng loại token thế hệ mới **Fine-grained Personal Access Token** để đảm bảo an toàn tối đa:

### Bước 1: Mở trang cấu hình Token trên GitHub
1. Đăng nhập vào tài khoản GitHub quản lý repository `lap2004/VINAOX`.
2. Truy cập: [https://github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
3. Nhấp vào nút **Generate new token**.

### Bước 2: Thiết lập thông tin Token
- **Token name**: `VINAXO-CMS-Serverless-Storage`
- **Expiration**: Chọn thời hạn mong muốn (ví dụ: 90 ngày hoặc 1 năm, có thể làm mới định kỳ).
- **Description**: `Token dành riêng cho Vercel Serverless Function quản lý nội dung VINAXO CMS`.
- **Resource owner**: Chọn tài khoản sở hữu repository (`lap2004`).

### Bước 3: Giới hạn phạm vi kho lưu trữ (Repository Access)
- Chọn **Only select repositories**.
- Trong danh sách thả xuống, chọn duy nhất: **`lap2004/VINAOX`**.

### Bước 4: Thiết lập quyền hạn (Repository Permissions)
- Tìm mục **Contents**: Chọn quyền **Access: Read and write**.
  *(Quyền này cho phép API đọc file và tạo commit ghi lại thay đổi nội dung)*.
- Tất cả các mục quyền khác giữ nguyên ở mức **No access**.

### Bước 5: Sinh Token và sao chép
- Nhấp **Generate token**.
- Sao chép chuỗi token có dạng: `github_pat_11...` (Lưu ý: Bạn chỉ nhìn thấy token này một lần duy nhất).

---

## 3. CẤU HÌNH BIẾN MÔI TRƯỜNG TRÊN VERCEL

Truy cập **Vercel Project Dashboard** > **Settings** > **Environment Variables** và cấu hình 3 biến sau:

| Tên biến (Key) | Giá trị (Value) | Mô tả |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | `github_pat_11...` | Token vừa tạo ở Bước 5 |
| `GITHUB_REPO` | `lap2004/VINAOX` | Repository chứa mã nguồn và nội dung website |
| `GITHUB_BRANCH` | `feature/vinaxo-custom-admin` *(hoặc `main`)* | Nhánh Git mà CMS sẽ commit nội dung vào |

---

## 4. CƠ CHẾ HOẠT ĐỘNG KHI CMS COMMIT NỘI DUNG

Khi một bài viết được tạo hoặc chỉnh sửa trên CMS:
1. Serverless Function gọi GitHub REST API endpoint:
   `PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}`
2. Nội dung được mã hóa Base64 và ký commit với thông điệp:
   `cms(news): create "Tiêu đề bài viết"`
3. GitHub tiếp nhận commit và kích hoạt GitHub Webhook sang Vercel.
4. Vercel tự động tiến hành build và xuất bản nội dung mới ra mạng CDN toàn cầu trong vòng 40 - 60 giây.
5. Nếu trong quá trình phát triển cục bộ (Local Development) mà không có biến `GITHUB_TOKEN`, hệ thống sẽ tự động chuyển sang cơ chế ghi file trực tiếp vào ổ cứng cục bộ (`fs.writeFileSync`), đảm bảo lập trình viên kiểm thử mượt mà không cần mạng.
