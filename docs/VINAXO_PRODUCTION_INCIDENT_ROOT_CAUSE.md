# BÁO CÁO ĐIỀU TRA NGUYÊN NHÂN GỐC RỄ SỰ CỐ MÀN HÌNH TRẮNG VINAXO PRODUCTION
**Mã tài liệu:** `VINAXO_PRODUCTION_INCIDENT_ROOT_CAUSE`  
**Mức độ nghiêm trọng:** P0 – Critical Production Incident  
**Ngày báo cáo:** 25/11/2026  
**Hệ thống áp dụng:** https://vinaxo.net (Admin CMS: https://vinaxo.net/admin)  
**Tác giả:** Đội ngũ Kỹ thuật & Cố vấn Hệ thống VINAXO  

---

## 1. Tóm tắt sự cố (Executive Summary)

Sau khi người dùng đăng nhập vào hệ thống quản trị VINAXO Admin tại `https://vinaxo.net/admin`, tiến hành chỉnh sửa bài viết `press-nld-mango-sourcing` (thêm hậu tố `hehe` vào tiêu đề) và nhấn **"Xuất bản bài viết"**:
1. API ghi nhận thành công và tạo commit `c5e3a65` trên nhánh `main` của repository GitHub `lap2004/VINAOX`.
2. Vercel tiếp nhận webhook và tiến hành tự động build và deploy phiên bản mới lên production `https://vinaxo.net`.
3. Khi người dùng truy cập trang chủ `https://vinaxo.net`, website xuất hiện **màn hình trống hoàn toàn màu kem (`#FAF7F2`)**, không có header, navbar, nội dung bài viết hay footer.

---

## 2. Dòng thời gian sự cố (Incident Timeline)

| Thời gian | Sự kiện | Tình trạng |
|---|---|---|
| **14:50** | Người dùng chỉnh sửa bài viết `press-nld-mango-sourcing` trên Admin CMS, thêm chữ `hehe`. | Hoàn tất trên form |
| **14:51** | Nhấn "Xuất bản bài viết". API `/api/admin/news` gửi commit lên GitHub `lap2004/VINAOX` nhánh `main` (commit SHA `c5e3a65`). | Thành công |
| **14:52** | Vercel kích hoạt Production Build với commit `c5e3a65`. Quá trình build Vite tạo ra các chunk file mới với mã hash mới (vd: `Home-CgQjdbUr.js` thay vì `Home-CNOSVP42.js`). | Deployment Success |
| **14:53** | Người dùng đang mở session trên trình duyệt chuyển hướng từ `/admin` sang `/` (trang chủ). Trình duyệt cố tải chunk file hash cũ do cache/HTML manifest cũ chỉ định. | Gặp lỗi tải chunk |
| **14:54** | Vercel rewrite toàn bộ request không khớp sang `/index.html`. Trình duyệt nhận về mã HTML (HTTP 200) thay vì file script JavaScript, gây lỗi `SyntaxError: Unexpected token '<'`. | Crash Runtime |
| **14:55** | Do React App thiếu React Error Boundary cấp cao nhất, lỗi unhandled exception làm React unmount toàn bộ cây DOM, để lại màn hình nền màu kem trống trơn. | P0 Incident |

---

## 3. Điều tra nguyên nhân gốc rễ (Root Cause Analysis - 5 Whys)

### Nguyên nhân 1: Trôi mã băm Chunk động (Dynamic Chunk Drift) sau khi Deploy
- **Hiện tượng:** Khi Admin xuất bản thành công, Vercel build lại toàn bộ frontend. Quá trình bundling của Vite phân mảnh (code-splitting) các trang (`Home`, `NewsDetail`, `Products`) thành các file `.js` có hash mới trong tên file (vd: `assets/Home-[hash].js`).
- **Cơ chế lỗi:** Trình duyệt của client đã tải trang trước đó vẫn giữ tham chiếu tới các chunk hash cũ. Khi người dùng điều hướng sang trang khác, trình duyệt gửi HTTP request tìm chunk cũ.

### Nguyên nhân 2: Cấu hình Vercel Rewrite SPA nuốt lỗi 404 (SPA Fallback Trap)
- **Hiện tượng:** Trong `vercel.json` trước đây, cấu hình rewrite được viết:
  ```json
  {
    "source": "/((?!api/|uploads/).*)",
    "destination": "/index.html"
  }
  ```
- **Cơ chế lỗi:** Quy tắc trên chỉ loại trừ `/api/` và `/uploads/`, **hoàn toàn không loại trừ `/assets/`**. Khi trình duyệt yêu cầu tải một chunk không còn tồn tại trên server (vd: `/assets/Home-OLD_HASH.js`), thay vì trả về mã lỗi HTTP 404 để trình duyệt nhận biết lỗi tải tài nguyên, Vercel lại trả về HTTP 200 kèm theo nội dung file `index.html`.
- **Hậu quả:** Trình duyệt phân tích cú pháp HTML `<!doctype html>...` dưới dạng JavaScript, dẫn tới lỗi nghiêm trọng:
  ```text
  SyntaxError: Unexpected token '<' (at Home-OLD_HASH.js:1:1)
  ```

### Nguyên nhân 3: Thiếu React Error Boundary dẫn tới unmount toàn bộ giao diện
- **Hiện tượng:** Ứng dụng `src/App.tsx` và `src/main.tsx` chưa được bao bọc bởi React Error Boundary.
- **Cơ chế lỗi:** Theo nguyên lý thiết kế của React 16/17/18, một unhandled JavaScript error phát sinh trong bất kỳ component nào trong quá trình render hoặc lazy-loading sẽ khiến **toàn bộ React component tree bị unmount hoàn toàn**.
- Màu nền mặc định của thẻ `body` trong CSS là màu kem `#FAF7F2` (đặc trưng của giao diện VINAXO). Khi cây DOM bị gỡ bỏ, người dùng chỉ nhìn thấy duy nhất nền màu kem này.

### Nguyên nhân 4: Nguy cơ mất trường dữ liệu khi không Deep-Merge (Field Drop Risk)
- **Hiện tượng:** Khi form Admin News gửi payload lên `/api/admin/news`, nếu form không chứa đầy đủ tất cả các trường nâng cao (như `personQuoted`, `secondaryUrls`, `title_en`, `content_en`), code cũ sẽ ghi đè JSON thô lên GitHub, làm mất các trường mà form chưa hỗ trợ hiển thị.

---

## 4. Giải pháp khắc phục triệt để đã triển khai

1. **Sửa cấu hình `vercel.json`:**
   - Loại trừ rõ ràng thư mục `/assets/` khỏi fallback rewrite: `"/((?!api/|uploads/|assets/).*)" -> "/index.html"`. Nhờ đó, file chunk cũ trả về đúng HTTP 404, kích hoạt sự kiện lỗi thay vì parse nhầm HTML.
   - Bổ sung header `Cache-Control: public, max-age=0, must-revalidate` để trình duyệt luôn kiểm tra phiên bản HTML mới nhất.

2. **Triển khai Hệ thống Phân lập Lỗi (React Error Boundary 3 Cấp):**
   - Tạo component `src/components/common/ErrorBoundary.tsx` hỗ trợ 3 cấp độ: `root`, `route`, và `component`.
   - Cấp Root bọc ngoài toàn bộ ứng dụng: Khi có lỗi chunk hoặc crash, giao diện hiển thị thông báo thân thiện với nút "Tải lại trang" kèm cơ chế tự động khôi phục session.
   - Cấp Route bọc từng trang: Giữ nguyên Header, Navigation và Footer của VINAXO, chỉ hiển thị thông báo lỗi cục bộ nếu một bài viết cụ thể bị hỏng.

3. **Cơ chế Tự động Reload khi phát hiện Chunk Mới (Auto-Reload on Chunk Invalidation):**
   - Đăng ký listener `window.addEventListener('vite:preloadError')` và `unhandledrejection` tại `src/main.tsx`.
   - Khi phát hiện lỗi chunk dynamic import sau deployment mới, hệ thống tự động tải lại trang với cờ `sessionStorage` để bảo đảm không xảy ra lặp vô hạn.

4. **Ký kết Data Contract & Deep-Merge Trước Khi Commit:**
   - Tạo bộ schema chuẩn `src/shared/schemas/newsSchema.ts`, `productSchema.ts`, `settingsSchema.ts`.
   - Triển khai logic nạp file hiện tại từ GitHub, kiểm tra xung đột SHA (409 Conflict), deep-merge dữ liệu và validate nghiêm ngặt trước khi tạo commit trên GitHub.
