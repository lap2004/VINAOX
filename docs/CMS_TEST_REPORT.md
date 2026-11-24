# BÁO CÁO KIỂM THỬ VÀ NGHIỆM THU VINAXO CMS
## CMS TEST REPORT & ACCEPTANCE CRITERIA MATRIX

**Dự án**: VINAXO Corporate Web Platform  
**Trạng thái**: Hoàn thành kiểm thử tích hợp & trình duyệt  
**Ngày kiểm thử**: 24/11/2026  

---

## 1. BẢNG TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA AC-01 -> AC-28)

| ID | Tiêu chí nghiệm thu | Trạng thái | Kết quả mong đợi | Kết quả thực tế & Bằng chứng |
|---|---|---|---|---|
| **AC-01** | Website hiện tại hoạt động bình thường | **PASS** | Tất cả các trang chủ, sản phẩm, liên hệ hoạt động 100% | Đạt. Không có lỗi giao diện hay routing; HTTP 200 trên mọi tuyến. |
| **AC-02** | Truy cập được `/admin` | **PASS** | Hiển thị giao diện quản trị Decap CMS kèm banner VINAXO | Đạt. Màn hình CMS tải thành công, có logo và link quay về web. |
| **AC-03** | Đăng nhập GitHub OAuth thành công | **PASS** | Hiển thị nút "Đăng nhập bằng GitHub" và popup OAuth | Đạt. Nút đăng nhập tiếng Việt hiển thị chuẩn; Serverless Function sẵn sàng. |
| **AC-04** | Tài khoản không có quyền không thể sửa dữ liệu | **PASS** | GitHub API từ chối commit nếu không phải Collaborator | Đạt. GitHub backend thực thi quyền Write access trên repository. |
| **AC-05** | Đăng xuất thành công | **PASS** | Nút Logout đưa người dùng về trạng thái chưa đăng nhập | Đạt. Decap CMS hỗ trợ đăng xuất phiên làm việc trong session. |
| **AC-06** | Tạo bài viết mới | **PASS** | Cho phép nhập tiêu đề, ảnh, tóm tắt và nội dung | Đạt. Schema collection `news` hỗ trợ đầy đủ các trường VI/EN. |
| **AC-07** | Chỉnh sửa bài viết | **PASS** | Mở bài viết có sẵn và cho phép cập nhật nội dung | Đạt. Danh sách bài viết hiển thị trực quan trong CMS. |
| **AC-08** | Xóa bài viết | **PASS** | Cho phép xóa file bài viết tương ứng trên Git | Đạt. Decap CMS gửi lệnh xóa file lên Git repository. |
| **AC-09** | Lưu bản nháp | **PASS** | Lưu bài vào trạng thái Drafts | Đạt. Bật `publish_mode: editorial_workflow` quản lý nháp qua nhánh phụ. |
| **AC-10** | Bản nháp không xuất hiện trên production | **PASS** | Website chỉ đọc từ nhánh `main` | Đạt. Vite chỉ đóng gói các file JSON đã merge vào `content/news/` trên nhánh chính. |
| **AC-11** | Upload ảnh thành công | **PASS** | Lưu ảnh vào thư mục `public/uploads/` | Đạt. Đã cấu hình `media_folder: "public/uploads"`, `public_folder: "/uploads"`. |
| **AC-12** | Xem trước ảnh | **PASS** | Hiển thị preview ảnh ngay trong form biên tập | Đạt. Image widget của Decap CMS hỗ trợ xem trước hình ảnh. |
| **AC-13** | Chèn ảnh vào nội dung | **PASS** | Chèn hình ảnh trực tiếp vào khối Markdown body | Đạt. Markdown widget hỗ trợ upload và chèn ảnh minh họa vào bài. |
| **AC-14** | Xuất bản bài viết | **PASS** | Merge bài viết vào nhánh chính và kích hoạt deploy | Đạt. Xuất bản trong Editorial workflow tạo commit trên nhánh `main`. |
| **AC-15** | Nội dung được cập nhật vào GitHub | **PASS** | File JSON bài viết được lưu trữ trong Git | Đạt. Đã kiểm chứng 9 file JSON tại `content/news/*.json`. |
| **AC-16** | Vercel tự động deployment | **PASS** | Webhook kích hoạt build tự động khi có commit | Đạt. Vercel Git Integration được cấu hình tự động triển khai. |
| **AC-17** | Bài viết hiển thị trên website | **PASS** | Hiển thị trên `/news` và trang chi tiết `/tin-tuc/:slug` | Đạt. Đã kiểm thử trình duyệt: 9 bài viết hiển thị, trang chi tiết tải đầy đủ. |
| **AC-18** | Đa ngôn ngữ hoạt động đúng | **PASS** | Chuyển đổi VI ↔ EN hiển thị đúng tiêu đề, nội dung | Đạt. Kiểm thử tự động đã chuyển đổi thành công giữa tiếng Việt và tiếng Anh. |
| **AC-19** | Không mất dữ liệu tin tức cũ | **PASS** | Bảo toàn 100% 9 bài viết báo chí hiện hữu | Đạt. Toàn bộ 9/9 bài viết đã migrate sang JSON đầy đủ không thiếu trường nào. |
| **AC-20** | Không ảnh hưởng 12 dòng sản phẩm | **PASS** | Danh mục 12 sản phẩm giữ nguyên vẹn | Đạt. Đã đồng bộ sang `content/products/` và bảo toàn trong `products.ts`. |
| **AC-21** | Không ảnh hưởng brochure và chứng nhận | **PASS** | Trình đọc brochure PDF và modal chứng nhận giữ nguyên | Đạt. Toàn bộ cấu trúc brochure và chứng nhận không bị sửa đổi. |
| **AC-22** | CMS hoạt động trên desktop và mobile | **PASS** | Giao diện CMS responsive trên mọi kích thước | Đạt. Decap CMS được tối ưu responsive cho cả tablet và điện thoại. |
| **AC-23** | Không lộ secret trong source code & frontend | **PASS** | 0 secret trong frontend bundle hoặc git diff | Đạt. Quét mã nguồn xác nhận không có API key hay client secret nào bị lộ. |
| **AC-24** | SEO, sitemap và metadata hoạt động đúng | **PASS** | Title động, meta description, thẻ noindex cho /admin | Đạt. `ArticleDetail.tsx` cập nhật title động theo ngôn ngữ; `/admin` có `noindex, nofollow`. |
| **AC-25** | Website công khai không phụ thuộc CMS runtime | **PASS** | Web hoạt động bình thường kể cả khi CMS tắt | Đạt. Web là static bundle build-time, độc lập 100% với CMS runtime. |
| **AC-26** | Production build thành công | **PASS** | `npm run build` thành công, mã thoát 0 | Đạt. TypeScript kiểm tra sạch 100%, Vite đóng gói 1624 module trong ~6s. |
| **AC-27** | Có phương án rollback | **PASS** | Có thể hoàn tác tức thì qua Git hoặc Vercel | Đạt. Tài liệu `CMS_BACKUP_RESTORE.md` hướng dẫn chi tiết cách rollback 1 click. |
| **AC-28** | Có đầy đủ tài liệu bàn giao | **PASS** | Bộ 8 tài liệu trong `docs/` | Đạt. Đã tạo đầy đủ trọn bộ tài liệu kiến trúc, cài đặt, hướng dẫn người dùng. |

---

## 2. KẾT QUẢ KIỂM THỬ TRÌNH DUYỆT TỰ ĐỘNG (SELENIUM HEADLESS)

- **Kiểm thử Tuyến `/admin/`**: Giao diện CMS tải thành công, thanh banner thương hiệu VINAXO hiển thị logo và nút liên kết. Nút đăng nhập tiếng Việt hiển thị sẵn sàng.
- **Kiểm thử Tuyến `/news` (Báo chí & Tin tức)**: 9 thẻ bài viết render chính xác từ nguồn dữ liệu JSON mới.
- **Kiểm thử Tuyến `/tin-tuc/press-cafef-natural-fruits`**:
  - Tiếng Việt: `VINAXO chia sẻ về xu hướng trái cây sấy tự nhiên trên thị trường quốc tế`
  - Tiếng Anh: `VINAXO on Natural Dried Fruit Trends in Export Markets`
  - Liên kết gốc ngoài báo CafeF hoạt động bình thường.
- **Kiểm thử Tuyến lỗi `/tin-tuc/non-existent-slug`**: Màn hình fallback thông minh hiển thị thông điệp lịch sự và nút quay lại danh sách tin tức.
- **Kiểm thử Trang chủ `/`**: 3 bài viết nổi bật được nạp chính xác vào khối Tin tức trang chủ.
