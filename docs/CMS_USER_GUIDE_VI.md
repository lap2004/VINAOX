# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG CMS CHO NHÂN VIÊN VINAXO
## CMS USER GUIDE (TIẾNG VIỆT)

Tài liệu này được biên soạn dành riêng cho nhân viên và ban biên tập nội dung của Công ty TNHH VINAXO. Bạn không cần phải có kiến thức lập trình vẫn có thể viết bài, tải ảnh và quản trị nội dung dễ dàng.

---

## 1. TRUY CẬP VÀ ĐĂNG NHẬP

1. Mở trình duyệt web (Chrome, Safari, Edge, Cốc Cốc) trên máy tính hoặc điện thoại.
2. Truy cập vào địa chỉ:
   👉 **`https://vinaxo.net/admin/`**
3. Trên màn hình sẽ xuất hiện nút màu đen: **"Đăng nhập bằng GitHub"** (Login with GitHub).
4. Bấm vào nút này:
   - Một cửa sổ nhỏ sẽ hiện lên yêu cầu bạn đăng nhập tài khoản GitHub đã được công ty cấp quyền.
   - Bấm **Authorize** để xác nhận đăng nhập.
5. Cửa sổ tự đóng lại và bạn sẽ được chuyển vào giao diện làm việc chính của VINAXO CMS.

---

## 2. CÁCH VIẾT BÀI VÀ ĐĂNG BÀI MỚI

1. Tại cột danh mục bên trái, chọn **"Tin tức & Báo chí"** (News).
2. Bấm vào nút màu xanh: **"Tạo bài viết mới"** (New Bài viết).
3. Điền các thông tin trong mẫu:
   - **Mã bài viết (ID)**: Viết liền không dấu, dùng dấu gạch nối (Ví dụ: `hoat-dong-tet-2027`).
   - **Đường dẫn bài viết (Slug)**: Đường dẫn hiển thị trên thanh địa chỉ web (Ví dụ: `hoat-dong-tet-2027`).
   - **Tiêu đề tiếng Việt**: Nhập tiêu đề bài viết bằng tiếng Việt.
   - **Tiêu đề tiếng Anh**: Nhập tiêu đề tiếng Anh (tùy chọn).
   - **Tóm tắt tiếng Việt**: Viết 2 - 3 câu tóm tắt nội dung chính để hiển thị ngoài trang chủ và danh sách tin tức.
   - **Danh mục**: Chọn *"Báo chí đưa tin"* hoặc *"Hoạt động doanh nghiệp"*.
   - **Ảnh đại diện (Cover Image)**: Bấm nút **Choose an image** > Bấm **Upload** để chọn ảnh từ máy tính hoặc điện thoại của bạn.
   - **Nội dung bài viết (Tiếng Việt)**:
     - Bạn có thể soạn thảo tự nhiên như dùng Word: in đậm (**B**), in nghiêng (*I*), chèn tiêu đề đoạn lớn/nhỏ (H1, H2, H3), danh sách gạch đầu dòng, chèn liên kết web hoặc chèn thêm ảnh trực tiếp vào bài.
4. **Lưu bản nháp hoặc Xuất bản**:
   - Nếu bài viết chưa hoàn thiện, bạn bấm nút **Save** để lưu bản nháp. Bài nháp sẽ được giữ riêng và **KHÔNG** xuất hiện trên website chính.
   - Khi bài viết đã sẵn sàng, tại thanh trạng thái phía trên, đổi trạng thái sang **Publish now** (Xuất bản ngay).
   - Sau khi bấm Xuất bản, hệ thống sẽ tự động đồng bộ và sau khoảng 1 - 2 phút bài viết mới sẽ chính thức xuất hiện trên website `https://vinaxo.net`!

---

## 3. CÁCH CHỈNH SỬA VÀ XÓA BÀI VIẾT

### Chỉnh sửa bài viết
1. Vào mục **"Tin tức & Báo chí"**.
2. Bấm vào tên bài viết bạn muốn sửa trong danh sách.
3. Thay đổi nội dung, tiêu đề hoặc ảnh tùy ý.
4. Bấm **Save** (Lưu) để hệ thống tự động cập nhật bài viết mới nhất lên web.

### Xóa bài viết
1. Mở bài viết bạn cần xóa.
2. Kéo xuống cuối trang hoặc bấm vào biểu tượng dấu 3 chấm góc trên bên phải, chọn **Delete** (Xóa bài viết).
3. Xác nhận xóa. Bài viết sẽ biến mất khỏi website trong lần cập nhật tiếp theo.

---

## 4. QUẢN LÝ SẢN PHẨM & CẤU HÌNH DOANH NGHIỆP

- **Mục "Sản phẩm VINAXO"**:
  - Cho phép xem và cập nhật mô tả, hình ảnh bao bì mới cho 12 dòng sản phẩm nhiệt đới của công ty.
- **Mục "Cấu hình chung"**:
  - Cập nhật số điện thoại Hotline B2B, email tiếp nhận báo giá, địa chỉ trụ sở nếu có thay đổi.
  - Cập nhật file Brochure năng lực công ty theo từng năm.

---

## 5. THÊM HOẶC BỎ QUYỀN NHÂN VIÊN

- **Để thêm người viết bài**:
  - Quản trị viên chỉ cần vào GitHub của dự án VINAXO > **Settings** > **Collaborators** > Nhập tài khoản GitHub của nhân viên đó và gửi lời mời.
- **Khi nhân viên nghỉ việc**:
  - Quản trị viên chỉ cần bấm **Remove** (Xóa) tài khoản của nhân viên đó khỏi danh sách Collaborators trên GitHub. Ngay lập tức người đó sẽ không còn quyền đăng nhập hay sửa đổi bất kỳ nội dung nào trên CMS.
