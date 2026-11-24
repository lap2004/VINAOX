# HƯỚNG DẪN TRIỂN KHAI VÀ DEPLOY VINAXO CMS
## CMS DEPLOYMENT GUIDE

**Dự án**: VINAXO Corporate Web Platform  
**Nền tảng Hosting**: Vercel  
**Nền tảng Source Control**: GitHub  

---

## 1. QUY TRÌNH DEPLOY LÊN VERCEL

### Bước 1: Kiểm tra nhánh làm việc
Nhánh phát triển CMS hiện tại là:
```bash
git branch --show-current
# Kết quả: feature/vinaxo-decap-cms
```

### Bước 2: Kiểm tra bản build Production
Trước khi đưa code lên Vercel, hãy đảm bảo lệnh kiểm tra và build hoàn tất không có lỗi:
```bash
npm run build
```

### Bước 3: Đẩy nhánh lên GitHub
Đẩy nhánh tính năng lên GitHub repository:
```bash
git push personal feature/vinaxo-decap-cms
```

### Bước 4: Kiểm tra Vercel Preview Deployment
- Khi nhánh `feature/vinaxo-decap-cms` được đẩy lên GitHub, Vercel sẽ tự động tạo một **Preview Deployment** (ví dụ: `https://vinaox-git-feature-vinaxo-decap-cms-....vercel.app`).
- Bạn có thể truy cập URL preview này và thêm `/admin/` để kiểm tra trực tiếp giao diện quản trị trên môi trường đám mây của Vercel.

### Bước 5: Cấu hình biến môi trường trên Vercel
Vào **Project Settings** > **Environment Variables** trên Vercel và cấu hình:
- `GITHUB_CLIENT_ID`: Client ID từ GitHub OAuth App.
- `GITHUB_CLIENT_SECRET`: Client Secret từ GitHub OAuth App.

### Bước 6: Merge vào Production Branch (`main`)
Sau khi đã kiểm thử và cấu hình OAuth thành công trên Preview:
1. Tạo Pull Request từ nhánh `feature/vinaxo-decap-cms` vào nhánh `main`.
2. Kiểm tra lại diff và xác nhận merge.
3. Vercel sẽ tự động kích hoạt **Production Deployment** và cập nhật website chính thức tại `https://vinaxo.net` trong vòng ~1 phút.
