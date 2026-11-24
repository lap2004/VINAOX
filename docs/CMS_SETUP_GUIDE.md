# HƯỚNG DẪN CẤU HÌNH GITHUB OAUTH & VERCEL CHO VINAXO CMS
## CMS SETUP GUIDE

Tài liệu này hướng dẫn chi tiết từng bước tạo **GitHub OAuth Application** và cấu hình **Biến môi trường trên Vercel** để kích hoạt chức năng đăng nhập cho Quản trị viên.

---

## BƯỚC 1: TẠO GITHUB OAUTH APPLICATION

1. Đăng nhập vào tài khoản GitHub quản lý repository VINAXO.
2. Truy cập vào trang cài đặt Developer:
   👉 **Settings** (góc trên bên phải) > **Developer Settings** > **OAuth Apps**
   Hoặc truy cập trực tiếp: `https://github.com/settings/developers`
3. Bấm nút **New OAuth App** (Tạo ứng dụng OAuth mới).
4. Điền các thông tin chính xác như sau:
   - **Application name**: `VINAXO CMS Content Manager`
   - **Homepage URL**: `https://vinaxo.net` (hoặc `https://vinaxo.vercel.app`)
   - **Application description**: `Hệ thống quản trị nội dung website VINAXO`
   - **Authorization callback URL**:
     ```text
     https://vinaxo.net/api/callback
     ```
     *(Lưu ý: Nếu bạn đang kiểm thử trên domain Vercel, có thể điền `https://vinaxo.vercel.app/api/callback`)*
5. Bấm **Register application**.
6. Sau khi tạo xong, bạn sẽ thấy **Client ID**:
   - Sao chép chuỗi **Client ID** (ví dụ: `Iv1.xxxxxxxxxxxx`).
7. Tại mục **Client secrets**, bấm nút **Generate a new client secret**:
   - Nhập mật khẩu xác thực nếu được yêu cầu.
   - Sao chép ngay chuỗi **Client Secret** (ví dụ: `ghs_xxxxxxxxxxxxxxxxxxxx`).
   *(Lưu ý: Client Secret chỉ hiển thị 1 lần duy nhất, hãy lưu trữ an toàn).*

---

## BƯỚC 2: CẤU HÌNH BIẾN MÔI TRƯỜNG TRÊN VERCEL

1. Đăng nhập vào tài khoản [Vercel Dashboard](https://vercel.com/dashboard).
2. Chọn dự án **VINAXO** (hoặc `vinaox`).
3. Điều hướng đến: **Settings** > **Environment Variables**.
4. Thêm 2 biến môi trường sau:

| Tên biến (Key) | Giá trị (Value) | Môi trường áp dụng |
|---|---|---|
| `GITHUB_CLIENT_ID` | Dán Client ID lấy từ Bước 1 | Production, Preview, Development |
| `GITHUB_CLIENT_SECRET` | Dán Client Secret lấy từ Bước 1 | Production, Preview, Development |

*(Tùy chọn: Nếu muốn cố định domain callback, thêm biến `OAUTH_REDIRECT_URL` với giá trị `https://vinaxo.net/api/callback`).*

5. Bấm **Save** để lưu lại.
6. Sau khi lưu biến môi trường, vào tab **Deployments** trên Vercel và bấm **Redeploy** bản deploy mới nhất để Vercel nạp các biến môi trường này vào Serverless Function.

---

## BƯỚC 3: PHÂN QUYỀN TÀI KHOẢN NHÂN VIÊN

Decap CMS sử dụng quyền truy cập của GitHub để kiểm soát việc chỉnh sửa nội dung.

1. Để cấp quyền cho một nhân viên VINAXO:
   - Nhân viên chỉ cần có 1 tài khoản GitHub miễn phí.
   - Quản trị viên truy cập vào GitHub Repository VINAXO: **Settings** > **Collaborators** > Bấm **Add people**.
   - Nhập username hoặc email GitHub của nhân viên và cấp quyền **Write** (hoặc **Triage**).
2. Khi nhân viên truy cập `https://vinaxo.net/admin/` và bấm **"Đăng nhập bằng GitHub"**, họ sẽ được cấp quyền tạo bài, upload ảnh và lưu bản nháp.
3. Người ngoài hoặc tài khoản không có quyền trên repository sẽ **bị từ chối truy cập** và không thể thay đổi dữ liệu.
