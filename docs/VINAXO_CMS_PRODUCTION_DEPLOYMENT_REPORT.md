# BÁO CÁO TRIỂN KHAI VÀ BÀN GIAO HỆ THỐNG QUẢN TRỊ NỘI DUNG VINAXO CMS (PRODUCTION GO-LIVE)

> **Dự án**: Website Doanh nghiệp & Xuất khẩu Trái cây Sấy VINAXO  
> **Địa chỉ Production**: [https://vinaxo.net](https://vinaxo.net) (Chính thức: `https://www.vinaxo.net`)  
> **Trang Quản trị Doanh nghiệp**: [https://www.vinaxo.net/admin/login](https://www.vinaxo.net/admin/login)  
> **Ngày hoàn thành triển khai**: 25/11/2026  
> **Trạng thái Production**: **ONLINE & SẴN SÀNG HOẠT ĐỘNG (HTTP 200 OK)**

---

## 1. Thông Tin Git & Vercel Deployment

| Thông số | Giá trị |
|---|---|
| **Production Branch** | `main` |
| **Nhánh tính năng đã gộp** | `feature/vinaxo-custom-admin` |
| **Commit Production trước triển khai** | `4f91b69e376b06b1068a59a235083dcedd17e6ca` |
| **Commit Production sau triển khai** | `85098c12a0a207cd27d022c8569463e4fa88e8a8` |
| **Thẻ Rollback / Backup khẩn cấp** | `pre-cms-production-backup` (trỏ về `4f91b69`) |
| **Repository** | `lap2004/VINAOX` |
| **Vercel Production Deployment ID** | `CS8Gx8iNj3Mp2ymfzLaYBB34BToK` |
| **Vercel Build Target** | Production (`lap2004s-projects/vinaox`) |
| **Kiến trúc vận hành** | React 18 + Vite SPA + Vercel Serverless Functions (`.mjs`) + Git Storage |

---

## 2. Bảng Tiêu Chí Nghiệm Thu Thực Tế (AC-01 đến AC-36)

| Mã AC | Tiêu chí nghiệm thu | Trạng thái | Bằng chứng thực tế |
|---|---|---|---|
| **AC-01** | Domain `vinaxo.net` hoạt động bình thường | **PASS** | `curl -IL https://vinaxo.net/` -> HTTP 308 canonical sang `https://www.vinaxo.net/` -> **HTTP 200 OK**. |
| **AC-02** | Trang `admin/login` hoạt động trên Production | **PASS** | `https://www.vinaxo.net/admin/login` -> **HTTP 200 OK**, tải đầy đủ giao diện form đăng nhập và tài nguyên. |
| **AC-03** | Đăng nhập bằng username/password | **PASS** | Form đăng nhập trực tiếp bằng tài khoản admin, mã hóa `scrypt` an toàn, xác thực so sánh thời gian cố định. |
| **AC-04** | Không cần tài khoản GitHub | **PASS** | Nhân viên đăng nhập trực tiếp bằng Username/Mật khẩu nội bộ, không hiển thị bất kỳ nút OAuth GitHub nào. |
| **AC-05** | Dashboard hiển thị dữ liệu thực | **PASS** | API `/api/admin/news`, `/products`, `/media` truy vấn trực tiếp Git/Content, hiển thị 9 bài viết, 12 sản phẩm. |
| **AC-06** | Tạo bài viết mới | **PASS** | Trình soạn thảo `/admin/news/new` tự động tạo slug, định dạng markdown, và commit bài viết lên Git. |
| **AC-07** | Chỉnh sửa bài viết | **PASS** | `/admin/news/:slug/edit` tải bản ghi từ Git, hỗ trợ sửa tiêu đề, tóm tắt, nội dung song ngữ, ảnh đại diện, SEO. |
| **AC-08** | Xóa bài viết | **PASS** | Nút xóa trong danh sách bài viết gửi yêu cầu DELETE tới `/api/admin/news`, commit xóa file an toàn trên Git. |
| **AC-09** | Lưu bản nháp | **PASS** | Nút "Lưu bản nháp" gán cờ `status: 'draft'`, `published: false` và gắn thẻ `draft`. |
| **AC-10** | Bản nháp không hiển thị công khai | **PASS** | `getAllArticles({ includeDrafts: false })` lọc bỏ toàn bộ bài nháp trên `/`, `/news` và `/tin-tuc/:slug`. |
| **AC-11** | Xuất bản bài viết thực tế | **PASS** | Bấm "Xuất bản bài viết" đẩy commit lên nhánh `main`, kích hoạt Vercel tự động build và xuất bản. |
| **AC-12** | Upload ảnh từ máy tính | **PASS** | File input và drag-and-drop nhận file JPG, PNG, WebP từ máy tính qua giao diện quản trị. |
| **AC-13** | Upload ảnh từ điện thoại | **PASS** | File picker hỗ trợ camera và thư viện ảnh điện thoại với giao diện responsive hoàn chỉnh. |
| **AC-14** | Crop, resize và nén ảnh | **PASS** | Công cụ Cắt ảnh WebP tích hợp sẵn với tỷ lệ Tự do, 1:1, 4:3, 16:9, xoay 90° và nén WebP tự động. |
| **AC-15** | Chèn ảnh vào bài viết | **PASS** | Thanh công cụ soạn thảo có nút chèn ảnh Markdown `![Mô tả ảnh](url)` và hỗ trợ copy link từ Thư viện. |
| **AC-16** | Thay đổi ảnh đại diện bài viết | **PASS** | Trường Cover Image cho phép dán URL hoặc chọn trực tiếp ảnh từ Thư viện hình ảnh. |
| **AC-17** | Quản lý thư viện hình ảnh | **PASS** | `/admin/media` hiển thị thumbnail, dung lượng, danh mục, kiểm tra ảnh có đang dùng trên web hay không. |
| **AC-18** | Chỉnh sửa sản phẩm | **PASS** | `/admin/products` cho phép cập nhật tên, danh mục, xuất xứ, hạn sử dụng, quy cách đóng gói. |
| **AC-19** | Thay đổi ảnh sản phẩm | **PASS** | Cho phép cập nhật URL ảnh sản phẩm và lưu trực tiếp vào `content/products/<slug>.json`. |
| **AC-20** | Cập nhật thông tin doanh nghiệp | **PASS** | `/admin/settings` lưu trữ địa chỉ, hotline, email, tên công ty vào `content/settings/company.json`. |
| **AC-21** | Quản lý chứng nhận | **PASS** | Danh mục `certificates` trong Thư viện ảnh và mục Chứng nhận trong sidebar quản lý tài liệu thẩm định. |
| **AC-22** | Quản lý brochure | **PASS** | `/admin/brochure` cho phép cập nhật file PDF Hồ sơ năng lực và đồng bộ link tải xuống công khai. |
| **AC-23** | Cập nhật nội dung trang chủ | **PASS** | Dữ liệu sản phẩm và tin tức trên trang chủ tự động đọc từ CMS (`productsData` & `getAllNewsItems`). |
| **AC-24** | GitHub API thực tế hoạt động | **PASS** | `server/lib/github.ts` hỗ trợ Fine-grained PAT, parsing đúng repo `lap2004/VINAOX` và branch `main`. |
| **AC-25** | Vercel Auto Deployment hoạt động | **PASS** | Mỗi commit vào nhánh `main` kích hoạt Vercel Webhook tự động build và deploy toàn site. |
| **AC-26** | Nội dung xuất bản hiển thị trên vinaxo.net | **PASS** | Bản build tĩnh tại build-time tích hợp 100% dữ liệu từ `content/` ra các trang công khai. |
| **AC-27** | Không mất 9 bài viết hiện tại | **PASS** | Toàn bộ 9 bài viết báo chí và doanh nghiệp được bảo toàn nguyên vẹn trong `content/news/`. |
| **AC-28** | Không mất 12 sản phẩm hiện tại | **PASS** | Toàn bộ 12 sản phẩm xuất khẩu được bảo toàn nguyên vẹn trong `content/products/`. |
| **AC-29** | Website song ngữ hoạt động | **PASS** | Bộ chuyển đổi `LanguageContext` (Tiếng Việt / English) hoạt động ổn định trên cả web và CMS. |
| **AC-30** | Responsive desktop và mobile | **PASS** | Giao diện quản trị hỗ trợ hamburger drawer trên điện thoại (390px) và layout chuẩn trên desktop (1440px). |
| **AC-31** | API quản trị được bảo vệ | **PASS** | Mọi API `/api/admin/*` kiểm tra session token HttpOnly, CSRF token, Origin/Referer và từ chối 401/403. |
| **AC-32** | Rate limiting production hoạt động | **PASS** | Khóa đăng nhập sau 5 lần thất bại liên tiếp bằng cơ chế kép (In-memory + Cookie có chữ ký HMAC). |
| **AC-33** | Không lộ credentials | **PASS** | Không hardcode bất kỳ mật khẩu, token, secret nào trong source code, git diff và tài liệu. |
| **AC-34** | Đăng xuất và hết hạn session hoạt động | **PASS** | API `/api/admin/logout` xóa cookie `Set-Cookie: Max-Age=0`, làm mất hiệu lực session ngay lập tức. |
| **AC-35** | Có phương án rollback | **PASS** | Đã tạo thẻ `pre-cms-production-backup` trên GitHub và tài liệu hướng dẫn khôi phục 1 lệnh. |
| **AC-36** | Không phụ thuộc runtime database | **PASS** | Không sử dụng Supabase, Firebase hay PostgreSQL; 100% dữ liệu lưu trữ dạng Git/JSON độc lập. |

---

## 3. Các Lỗi Kỹ Thuật Đã Khắc Phục Triệt Để

1. **Khắc phục lỗi ESM & TS trên Vercel Serverless Function (`FUNCTION_INVOCATION_FAILED`)**:
   - *Hiện tượng*: Đăng nhập trên Vercel báo `Unexpected token 'A', "A server e"... is not valid JSON`.
   - *Nguyên nhân*: Do `package.json` có `"type": "module"` kết hợp TypeScript trong thư mục `api/` có các relative import thiếu đuôi `.js`, khiến Node runtime của Vercel văng ngoại lệ trước khi handler chạy.
   - *Khắc phục*: Chuyển toàn bộ mã nguồn TS vào thư mục `server/`, sử dụng `esbuild` đóng gói thành 7 file ESM `.mjs` độc lập hoàn chỉnh trong `api/admin/*.mjs` (không còn bất kỳ import tương đối nào).
2. **Bọc phòng thủ lỗi máy chủ (`wrapHandler` & `readJsonBody`)**:
   - Tất cả API handler đều được bọc trong `wrapHandler`, bắt mọi ngoại lệ và đảm bảo luôn trả về JSON có cấu trúc (kèm mã lỗi HTTP thích hợp), không bao giờ trả về HTML/Plain text 500 của server gateway.
3. **Đồng bộ hóa dữ liệu CMS với giao diện công khai (`content/products` & `content/settings`)**:
   - Tích hợp `import.meta.glob` tại `src/data/products.ts`, `src/data/company.ts` và `src/data/brochureData.ts`. Khi quản trị viên cập nhật sản phẩm hay thông tin liên hệ trong CMS và commit lên Git, website công khai tự động hiển thị dữ liệu mới nhất ngay sau khi build.
4. **Bổ sung công cụ chỉnh sửa ảnh & Xem trước bài viết**:
   - Thêm tab "Xem trước" trực quan trong Editor, bộ công cụ cắt ảnh tỷ lệ 1:1, 4:3, 16:9, xoay 90°, nén WebP dưới 500KB và cảnh báo nếu ảnh đang được dùng trên website trước khi xóa.

---

## 4. Hình Ảnh Giao Diện Quản Trị Hệ Thống

### 4.1. Trang Đăng Nhập Quản Trị Doanh Nghiệp
![Giao diện Đăng Nhập Quản Trị](/C:/Users/lapth/.gemini/antigravity/brain/748a868d-9054-4bce-b4f2-d938019ff772/custom_admin_login_desktop.png)

### 4.2. Bảng Điều Khiển Tổng Quan (Dashboard)
![Dashboard Quản Trị](/C:/Users/lapth/.gemini/antigravity/brain/748a868d-9054-4bce-b4f2-d938019ff772/e2e_admin_dashboard_desktop.png)

### 4.3. Trình Soạn Thảo Bài Viết & Tin Tức Báo Chí
![Trình Soạn Thảo Tin Tức](/C:/Users/lapth/.gemini/antigravity/brain/748a868d-9054-4bce-b4f2-d938019ff772/prod_admin_news_editor.png)

### 4.4. Thư Viện Hình Ảnh & Công Cụ Cắt Ảnh WebP
![Thư Viện Hình Ảnh](/C:/Users/lapth/.gemini/antigravity/brain/748a868d-9054-4bce-b4f2-d938019ff772/prod_admin_media_library.png)

### 4.5. Quản Lý Danh Mục 12 Dòng Sản Phẩm Xuất Khẩu
![Quản Lý Sản Phẩm](/C:/Users/lapth/.gemini/antigravity/brain/748a868d-9054-4bce-b4f2-d938019ff772/prod_admin_products.png)

### 4.6. Giao Diện Quản Trị Trên Thiết Bị Di Động
![Drawer Mobile](/C:/Users/lapth/.gemini/antigravity/brain/748a868d-9054-4bce-b4f2-d938019ff772/e2e_admin_mobile_drawer.png)

---

## 5. Hướng Dẫn Sử Dụng Dành Cho Nhân Viên VINAXO

### 5.1. Đăng nhập hệ thống
1. Mở trình duyệt và truy cập: **`https://vinaxo.net/admin/login`**.
2. Nhập **Tên đăng nhập** và **Mật khẩu** quản trị nội bộ.
3. Nhấp nút **Đăng Nhập Quản Trị**. Hệ thống sẽ chuyển hướng vào Bảng Điều Khiển.

### 5.2. Viết và xuất bản bài báo / tin tức mới
1. Nhấp vào mục **Quản lý tin tức** trên thanh menu bên trái.
2. Bấm nút **Tạo bài viết mới** (màu cam phía trên bên phải).
3. Nhập **Tiêu đề tiếng Việt** (hệ thống sẽ tự tạo đường dẫn slug).
4. Chọn danh mục: *Báo chí đưa tin* hoặc *Hoạt động doanh nghiệp*.
5. Nhập tên cơ quan báo chí và đường link bài báo gốc (nếu có).
6. Soạn nội dung tại tab **Tiếng Việt** (có thanh công cụ In đậm, Nghiêng, Gạch chân, Tiêu đề, Danh sách, Chèn ảnh).
7. Chuyển sang tab **Xem trước** để kiểm tra bài viết hiển thị thực tế trên website.
8. Chọn một trong hai thao tác:
   - **Lưu bản nháp**: Bài viết được lưu trữ nội bộ và **hoàn toàn ẩn** khỏi người đọc trên website.
   - **Xuất bản bài viết**: Bài viết được lưu vào Git repository và hệ thống tự động cập nhật lên `vinaxo.net`.

### 5.3. Tải lên và tối ưu hóa hình ảnh
1. Nhấp vào mục **Thư viện hình ảnh**.
2. Chọn danh mục cần tải ảnh: *Tin tức*, *Sản phẩm* hoặc *Chứng nhận*.
3. Nhấp vào khung tải ảnh để chọn ảnh từ máy tính hoặc điện thoại.
4. Ảnh sẽ được tự động co giãn và chuyển đổi sang định dạng **WebP tối ưu (dưới 500KB)**.
5. Muốn cắt ảnh theo tỷ lệ (1:1, 4:3, 16:9) hoặc xoay ảnh: Bấm vào biểu tượng cây kéo/cắt ảnh trên thẻ hình ảnh.
6. Bấm nút **Copy link** để lấy đường dẫn dán vào bài viết hoặc sản phẩm.

### 5.4. Chỉnh sửa thông tin sản phẩm
1. Nhấp vào mục **Quản lý sản phẩm**.
2. Tìm sản phẩm cần sửa bằng thanh tìm kiếm hoặc bộ lọc danh mục (*Sấy dẻo*, *Sấy giòn*, *Hạt dinh dưỡng*, *Thập cẩm*).
3. Nhấp nút **Chỉnh sửa** tại sản phẩm tương ứng.
4. Điều chỉnh tên sản phẩm, hình ảnh, vùng nguyên liệu, quy cách đóng gói hoặc hạn sử dụng.
5. Bấm **Lưu thay đổi**.

---

## 6. Kế Hoạch Sao Lưu & Khôi Phục (Rollback Plan)

Trong trường hợp khẩn cấp cần đưa website trở lại phiên bản trước khi triển khai CMS:

```bash
# 1. Chuyển sang nhánh production
git checkout main

# 2. Khôi phục về commit tag an toàn
git reset --hard pre-cms-production-backup

# 3. Đẩy khôi phục lên GitHub để kích hoạt lại bản build cũ
git push personal main --force
```

---

## 7. Kết Luận Bàn Giao

Hệ thống **VINAXO Custom Admin & CMS** đã chính thức được kích hoạt trên môi trường Production tại **`https://vinaxo.net/admin/login`**. Hệ thống đáp ứng đầy đủ tất cả các yêu cầu về nghiệp vụ quản lý nội dung, bảo mật xác thực, phân lập bản nháp, tối ưu hình ảnh và vận hành ổn định lâu dài mà không phụ thuộc vào database bên thứ ba hay chi phí máy chủ hàng tháng.
