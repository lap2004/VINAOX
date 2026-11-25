# BÁO CÁO ĐIỀU TRA NGUYÊN NHÂN GỐC RỄ & KHẮC PHỤC ĐỒNG BỘ NỘI DUNG VINAXO CMS TRÊN PRODUCTION

*Dự án:* Website Doanh Nghiệp VINAXO (https://vinaxo.net)  
*Hệ thống:* VINAXO Custom Admin & Serverless CMS  
*Ngày lập báo cáo:* 25/11/2026  
*Trạng thái:* ĐÃ ĐIỀU TRA RÕ NGUYÊN NHÂN GỐC RỄ & ĐÃ TRIỂN KHAI BẢN VÁ BẢO VỆ PRODUCTION  

---

## 1. Tóm tắt sự cố thực tế

### Trường hợp tái hiện
- **Trang quản trị:** `https://vinaxo.net/admin/news` -> Chỉnh sửa bài viết
- **Bài viết kiểm thử:** `press-nld-mango-sourcing`
- **Tiêu đề gốc trên production:**  
  `VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm`
- **Tiêu đề sau khi chỉnh sửa trong Admin:**  
  `VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm hehee` (và `hehee nè`)
- **Hiện tượng:**
  1. Giao diện Admin báo *"Đã xuất bản bài viết thành công!"* ngay lập tức.
  2. Tuy nhiên, khi truy cập `https://vinaxo.net/tin-tuc/press-nld-mango-sourcing`, tiêu đề vẫn giữ nguyên bản cũ, không hề xuất hiện chữ `"hehee"`.
  3. Góc trên bên phải Admin Dashboard trên domain chính thức `https://vinaxo.net` hiển thị huy hiệu:  
     `Git: feature/vinaxo-custom-admin`  
     trong khi Production Branch của Vercel là `main`.

---

## 2. Kết quả điều tra chi tiết & Bằng chứng kỹ thuật

### A. Điều tra Git Branch & Lịch sử Commit
Kiểm tra remote repository `lap2004/VINAOX`:
- Nhánh `personal/main`: Dừng ở commit `39671b4b1a45ce376b70c3ba59c63a6a9b4a441e` (tệp `content/news/press-nld-mango-sourcing.json` hoàn toàn nguyên bản, **không có** chữ "hehee").
- Nhánh `personal/feature/vinaxo-custom-admin`: Xuất hiện **2 commit mới** được tạo tự động bởi CMS qua GitHub API:
  - Commit `287436f`: `cms(news): update "VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm hehe"` (`"title_vi": "... hehee"`)
  - Commit `5270611`: `cms(news): update "VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm hehe"` (`"title_vi": "... hehee nè"`)

**Kết luận A1:** Hệ thống Admin CMS thực tế **đã ghi dữ liệu thành công lên GitHub**, nhưng ghi **nhầm nhánh** `feature/vinaxo-custom-admin` thay vì nhánh `main`.

### B. Nguyên nhân Admin trên Production ghi nhầm nhánh
Kiểm tra mã nguồn `server/lib/github.ts` trước khi vá:
```typescript
function getRepoConfig() {
  const vercelEnv = (process.env.VERCEL_ENV || 'development').trim();
  const gitRef = (process.env.VERCEL_GIT_COMMIT_REF || '').trim();
  const configuredBranchEnv = (process.env.GITHUB_BRANCH || '').trim();

  let branch = configuredBranchEnv || gitRef || 'main';
  if (vercelEnv === 'preview' && gitRef) {
    branch = gitRef;
  }
  // ...
}
```

**Nguyên nhân:**
1. Trong quá trình thiết lập ban đầu trên nhánh tính năng, biến môi trường `GITHUB_BRANCH` được đặt là `feature/vinaxo-custom-admin`.
2. Khi biến này được áp dụng cho môi trường Production trên Vercel, hàm `getRepoConfig()` ưu tiên lấy giá trị của `configuredBranchEnv` (`feature/vinaxo-custom-admin`).
3. Mã nguồn **thiếu cơ chế bảo vệ bắt buộc (Production Isolation Guard)**: Khi `process.env.VERCEL_ENV === 'production'`, hệ thống phải cưỡng chế target branch luôn luôn là `main`, tuyệt đối không cho phép ghi vào bất kỳ nhánh tính năng nào.

### C. Cơ chế Vercel Git Integration & Auto-Deploy
- Dự án Vercel `vinaox` được cấu hình Production Branch là `main`.
- Vercel Git Integration hoạt động theo nguyên tắc:
  - Khi có commit vào `main` -> Kích hoạt **Production Deployment** -> Cập nhật domain `vinaxo.net`.
  - Khi có commit vào nhánh khác (như `feature/vinaxo-custom-admin`) -> Vercel chỉ kích hoạt **Preview Deployment** (tạo URL tạm dạng `*.vercel.app`), hoàn toàn **không ảnh hưởng** đến domain chính `vinaxo.net`.
- Do CMS ghi commit vào `feature/vinaxo-custom-admin`, Vercel chỉ tạo bản Preview ngầm mà không deploy lên `vinaxo.net`.

### D. Nguyên nhân UI thông báo "Đã xuất bản thành công" gây hiểu lầm
1. Giao diện `AdminNewsEditor.tsx` gửi yêu cầu POST `/api/admin/news`.
2. Serverless Function gọi GitHub Contents API tạo commit thành công và trả về HTTP 200 kèm `commitSha`.
3. Giao diện nhận HTTP 200 liền kết luận "Đã xuất bản bài viết thành công!" và chuyển hướng sau 1.1 giây.
4. **Thực tế:** Trên kiến trúc JAMstack / Static Site Generation (SSG), sau khi Git nhận commit, Vercel cần **25 đến 45 giây** để biên dịch source code, rebuild trang HTML tĩnh và phân phối ra toàn cầu (CDN Edge). Giao diện trước đó không có bước theo dõi tiến độ build thực tế khiến người dùng lầm tưởng website đã cập nhật ngay lập tức.
5. Nút bấm mang nhãn *"Đồng bộ Git"* trong `AdminNewsList.tsx` thực chất chỉ là hàm tải lại danh sách bài viết từ bộ nhớ API, gây nhầm lẫn là nút kích hoạt build hoặc đồng bộ code.

---

## 3. Các giải pháp kỹ thuật đã triển khai (Triệt để & An toàn)

### 1. Khoá cứng Production Target Branch (`server/lib/github.ts`)
Áp dụng cơ chế **Strict Production Isolation**:
```typescript
let branch = 'main';
if (vercelEnv === 'production') {
  // Cưỡng chế tuyệt đối nhánh main trên Production, loại bỏ hoàn toàn khả năng ghi nhầm nhánh
  branch = 'main';
} else if (vercelEnv === 'preview') {
  branch = gitRef || configuredBranchEnv || 'main';
} else {
  branch = configuredBranchEnv || gitRef || 'main';
}
```
Đồng thời, hàm `commitFile`, `commitMediaFile`, và `deleteRepoFile` đều có lớp phòng thủ thứ hai đảm bảo nếu `vercelEnv === 'production'` thì nhánh thực thi luôn là `main`.

### 2. Xây dựng API kiểm tra tiến độ triển khai (`api/admin/deployStatus.mjs`)
- Tích hợp với GitHub Commit Status API (`/repos/:owner/:repo/commits/:sha/status`).
- Trả về trạng thái triển khai thời gian thực của Vercel:
  - `queued`: Đã nhận commit vào Git, đang đợi Vercel tạo bản build.
  - `pending`: Vercel đang biên dịch mã nguồn và cập nhật CDN.
  - `success`: Website đã hoàn tất cập nhật trực tiếp trên `vinaxo.net`.
  - `failure`: Báo cáo lỗi nếu quá trình build gặp sự cố.

### 3. Nâng cấp giao diện Soạn thảo với Modal Theo dõi Tiến độ (`AdminNewsEditor.tsx`)
- Khi người dùng bấm **Xuất bản bài viết**:
  - Giao diện hiển thị Modal theo dõi trực quan: commit SHA, nhánh đích (`main`), số giây đang xử lý.
  - Tự động thăm dò (polling) trạng thái Vercel mỗi 3 giây.
  - Khi hoàn tất (sau ~30s), hiển thị thông báo thành công kèm nút **"Xem bài viết trên web"** mở thẳng trang bài viết trên `vinaxo.net` để kiểm chứng.

### 4. Chuẩn hoá nhãn nút thao tác (`AdminNewsList.tsx`)
- Đổi tên nút từ *"Đồng bộ Git"* thành **"Làm mới danh sách"** (kèm tooltip rõ ràng) nhằm phản ánh đúng chức năng tải dữ liệu mới từ máy chủ.

### 5. Bảo toàn nội dung & Dữ liệu kiểm thử
- Dữ liệu 9 bài viết chính thức và 12 sản phẩm trên nhánh `main` được giữ nguyên vẹn 100%.
- Tệp `content/news/press-nld-mango-sourcing.json` trên nhánh `main` giữ nguyên tiêu đề chuẩn doanh nghiệp:
  `"title_vi": "VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm"`
- Hai commit chứa chữ `"hehee"` được lưu giữ nguyên trạng trên nhánh `feature/vinaxo-custom-admin` làm bằng chứng điều tra kỹ thuật.

---

## 4. Kết quả kiểm thử hệ thống

| Bộ kiểm thử | Kết quả | Chi tiết |
|---|---|---|
| **TypeScript Typecheck** | **PASS** | `tsc -b` & `tsc -p tsconfig.server.json --noEmit` đạt 0 lỗi |
| **ESM Bundler** | **PASS** | `scripts/build-api.mjs` đóng gói 8 handlers thành công vào `api/admin/*.mjs` |
| **Security & Unit Test Suite** | **11/11 PASS** | Vượt qua toàn bộ kiểm thử bảo mật scrypt, CSRF, Path Traversal, Production Isolation Guard & Deploy Status |
| **Production Build** | **PASS** | Vite v5 đóng gói production bundle thành công trong 4.83 giây |

---

## 5. Hướng dẫn thao tác khi gặp thông báo Passkey trên Vercel

Khi người dùng thao tác Redeploy trên Vercel và hoàn tất nhập mã xác thực 2 lớp (Authenticator 6 số), Vercel sẽ hiển thị cửa sổ gợi ý:
> *"Add a Passkey to Verify Faster"*

**Thao tác xử lý:**
- Nhấn vào liên kết **"Don't Ask Again"** (hoặc nút **"Remind Me in 7 Days"**) ở góc dưới hộp thoại để bỏ qua bước cài đặt Passkey.
- Ngay sau đó, Vercel sẽ tự động thực hiện tiến trình Redeploy cho nhánh `main`.
