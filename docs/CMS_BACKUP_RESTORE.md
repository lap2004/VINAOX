# HƯỚNG DẪN SAO LƯU VÀ KHÔI PHỤC DỮ LIỆU CMS
## CMS BACKUP & RESTORE GUIDE

**Dự án**: VINAXO Corporate Web Platform  
**Đặc tính**: Git-based Content Storage với cơ chế Versioning tự động  

---

## 1. CƠ CHẾ SAO LƯU TỰ ĐỘNG (AUTOMATIC BACKUP)

Do website VINAXO áp dụng kiến trúc **Git-based CMS**:
- Mọi thao tác thêm bài viết, chỉnh sửa văn bản, thay đổi hình ảnh hay xóa bài trong CMS thực chất đều là một **Git Commit** được ghi nhận trên GitHub repository.
- Toàn bộ lịch sử nội dung từ trước đến nay đều được bảo toàn 100% trong Git History. Bạn không cần phải thiết lập database backup hàng tuần hay lo sợ mất điện/hỏng máy chủ.

---

## 2. CÁCH KHÔI PHỤC MỘT BÀI VIẾT BỊ XÓA NHẦM

Nếu một nhân viên lỡ tay bấm xóa bài viết trong CMS:

1. Mở GitHub Repository của dự án trên trình duyệt.
2. Điều hướng vào thư mục: `content/news/`.
3. Bấm vào nút **History** (Lịch sử commit) góc trên bên phải.
4. Tìm commit có nội dung xóa bài viết (ví dụ: `Delete news "..."`).
5. Bấm vào commit đó:
   - Bạn sẽ thấy nội dung file JSON của bài viết trước khi bị xóa.
   - Bấm vào biểu tượng xem file và khôi phục (Revert commit hoặc copy lại file JSON vào thư mục `content/news/`).
6. Khi file JSON xuất hiện lại trong repository, Vercel sẽ tự động build lại và bài viết sẽ quay trở lại website ngay lập tức.

---

## 3. CÁCH ROLLBACK WEBSITE TRÊN VERCEL (1-CLICK ROLLBACK)

Nếu bản build hoặc cập nhật mới gặp sự cố ngoài mong muốn:

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
2. Vào dự án **VINAXO** > Tab **Deployments**.
3. Tìm bản Deploy gần nhất hoạt động ổn định (có biểu tượng dấu tick xanh).
4. Bấm vào nút ba chấm (`...`) ở bên phải bản deploy đó.
5. Chọn **Instant Rollback** (hoặc **Promote to Production**).
6. Trong vòng **2 giây**, toàn bộ website trên toàn cầu sẽ ngay lập tức được khôi phục về phiên bản trước đó mà không cần phải chờ đợi quá trình build lại mã nguồn!

---

## 4. KHÔI PHỤC NHANH BẰNG DÒNG LỆNH GIT

Nếu bạn là lập trình viên và muốn khôi phục về commit baseline trước khi triển khai CMS:
```bash
# Xem commit baseline
git log -n 5 --oneline

# Hoàn tác về commit baseline 4f91b69
git checkout main
git reset --hard 4f91b69e376b06b1068a59a235083dcedd17e6ca
```
Toàn bộ mã nguồn sẽ quay về trạng thái sạch ban đầu của dự án.
