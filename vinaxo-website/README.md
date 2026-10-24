# VINAXO — Premium Agricultural Exporter Website

Homepage chính thức cho **Công ty TNHH VINAXO (VINAXO Co., Ltd.)**, doanh nghiệp chuyên chế biến và xuất khẩu nông sản & trái cây sấy cao cấp của Việt Nam vươn ra thị trường toàn cầu.

Giao diện được thiết kế và lập trình bám sát 100% bản mẫu thiết kế **VINAXO Mockup Reference**, đạt tiêu chuẩn mỹ thuật thẩm mỹ cao, tốc độ tải nhanh, thuần chuẩn Semantic HTML5, CSS3 hiện đại (Grid/Flexbox) và Vanilla JavaScript ES6+.

---

## 1. Cấu trúc thư mục dự án

```text
vinaxo-website/
├── index.html              # Trang chủ hoàn chỉnh chuẩn SEO & Accessibility
├── css/
│   ├── style.css           # Design system tokens, typography, component styles
│   └── responsive.css      # Media queries tối ưu cho Desktop, Tablet & Mobile
├── js/
│   ├── content.js          # Dữ liệu song ngữ EN/VI, cấu hình sản phẩm & tin tức
│   └── main.js             # Logic điều hướng, chuyển ngữ, sticky header, modal & validation
├── assets/
│   ├── images/             # Ảnh trái cây sấy, phong cảnh, tin tức (WebP + JPG fallback)
│   ├── icons/              # Vector stamp "From Vietnam to the World", icons SVG
│   └── logo/               # Logo nhận diện thương hiệu VINAXO SVG
└── README.md               # Tài liệu hướng dẫn sử dụng và bàn giao
```

---

## 2. Các Section giao diện (8 Sections hoàn chỉnh)

1. **Section 1 — Header & Navigation:**
   - Logo VINAXO với biểu tượng chiếc lá xanh thiên nhiên và tagline *"Natural Goodness | Global Reach"*.
   - Thanh menu 7 mục: `Home`, `About Us`, `Products`, `Our Quality`, `Global Market`, `News`, `Contact`.
   - Hiệu ứng **Active Dot** màu xanh lá tự động đánh dấu section đang cuộn tới (`IntersectionObserver`).
   - Sticky header với hiệu ứng thủy tinh mờ (`backdrop-filter: blur(12px)`) khi cuộn trang.
   - Nút chuyển đổi ngôn ngữ **EN / VI** hoạt động thực tế 100%, cập nhật toàn bộ nội dung mà không cần tải lại trang.
   - Nút CTA nổi bật *"Get a Quote →"* kích hoạt modal liên hệ/báo giá.
   - Menu responsive drawer cho màn hình di động và tablet.

2. **Section 2 — Hero Section:**
   - Huy hiệu `VIETNAM'S AGRICULTURAL EXPORTER`.
   - Tiêu đề Serif lớn Playfair Display: **Pure Fruits / Greater Possibilities** (dòng 2 in nghiêng thanh lịch).
   - Mô tả giá trị nông sản sấy Việt Nam tự nhiên, chuẩn mực quốc tế.
   - Bộ đôi CTA: *"Explore Our Products →"* và *"About VINAXO"*.
   - 3 biểu tượng bảo chứng: `100% Natural Ingredients`, `Premium Vietnamese Sourcing`, `Exported to 30+ Countries`.
   - Khung ảnh nghệ thuật khay gỗ chứa các loại trái cây sấy (xoài sấy, thơm sấy, thanh long sấy, chuối sấy) với viền trắng nổi khối.
   - Chữ viết tay nghệ thuật *"Good Fruits, Brighter Tomorrows"*.
   - Con dấu xoay nhẹ *"FROM VIETNAM TO THE WORLD"*.

3. **Section 3 — About VINAXO:**
   - Cột 1: Câu chuyện thương hiệu *"Rooted in Vietnam, Growing for a Healthier World"*.
   - Cột 2: Hình ảnh danh thắng thiên nhiên Việt Nam với lớp phủ chữ *"Vietnamese Fruits, Global Value"*.
   - Cột 3: Khối lưới 2×2 hiển thị các chỉ số doanh nghiệp (`10+ Years`, `100+ Partners`, `50+ Products`, `30+ Countries`).
   - *Ghi chú*: Toàn bộ số liệu minh họa được lưu trữ trong `content.js` và có ghi chú cần VINAXO xác nhận chính thức trước khi công bố ra thị trường.

4. **Section 4 — Product Showcase:**
   - 5 thẻ sản phẩm chủ lực trên một hàng ở desktop:
     1. **Dried Mango (Xoài sấy dẻo)**
     2. **Dried Pineapple (Thơm sấy dẻo)**
     3. **Dried Banana (Chuối sấy giòn)**
     4. **Dried Dragon Fruit (Thanh long sấy)**
     5. **Mixed Dried Fruits (Trái cây sấy thập cẩm)**
   - Thẻ hiển thị ảnh sắc nét dạng `<picture>` (WebP chất lượng cao + JPG fallback), tên sản phẩm, mô tả vị giác nhiệt đới và nút mũi tên tròn tương tác.
   - Hiệu ứng hover nổi bật: Card nhấc nhẹ (`translateY(-6px)`), hình ảnh zoom mượt mà, nút mũi tên đổi nền xanh lá đậm.
   - Dữ liệu render 100% từ mảng JavaScript trong `content.js`.

5. **Section 5 — Quality Assurance & Global Market:**
   - **Quality Assurance**: Cam kết tiêu chuẩn quốc tế với 4 huy hiệu chứng nhận:
     - `HACCP CERTIFIED` (Huy hiệu tròn xanh lá)
     - `ISO 22000` (Huy hiệu tròn xanh dương)
     - `BRCGS Food Safety` (Huy hiệu khung xanh ngọc)
     - `FDA REGISTERED` (Huy hiệu khung xanh dương)
   - **Global Market**:
     - Bản đồ thế giới đồ họa SVG màu xanh sage tinh tế.
     - Các tuyến đường xuất khẩu cong ngắt quãng (dashed arcs) tỏa từ trung tâm Việt Nam tới Bắc Mỹ, Châu Âu, Đông Á và Châu Đại Dương.
     - Điểm xuất phát Việt Nam với hiệu ứng radar ping chuyển động nhẹ nhàng.
     - Thẻ nổi `30+ Countries`.

6. **Section 6 — Latest News:**
   - 3 bài viết minh họa chuyên ngành:
     1. *Vietnam Dried Fruits Gaining Momentum in Global Markets*
     2. *Inside VINAXO's Quality Control Process*
     3. *Expanding to New Export Markets in 2025*
   - Hình ảnh cơ sở chế biến, vùng trồng và logistics xuất khẩu cảng biển.
   - Thẻ tag chú thích minh bạch: *"Illustrative Article / Bài viết minh họa"*.

7. **Section 7 — Contact CTA Banner:**
   - Khung banner lớn bo góc cong (`border-radius: 28px`), hình nền đồi núi mờ sương Việt Nam.
   - Lớp phủ gradient xanh rừng nhiệt đới sang trọng.
   - Tiêu đề: *"Let's Bring Vietnamese Goodness to the World"*.
   - Nút bấm *"Contact Us →"* mở form báo giá chuyên nghiệp.

8. **Section 8 — Footer:**
   - Logo VINAXO + định vị *"Natural Goodness | Global Reach"*.
   - Thanh liên kết nhanh đến từng section.
   - Kênh mạng xã hội quốc tế: LinkedIn, Facebook, YouTube, Instagram.
   - Bản quyền `© 2026 VINAXO. All rights reserved.` và dòng tuyên bố nguyên mẫu thiết kế.

9. **Interactive Quote & Contact Modal:**
   - Hộp thoại báo giá popup hiện đại với hiệu ứng kính mờ (glassmorphism backdrop).
   - Form kiểm tra dữ liệu thực tế (Name >= 2 ký tự, định dạng email chuẩn, chọn danh mục sản phẩm, nội dung yêu cầu >= 5 ký tự).
   - Phản hồi trực tiếp trên giao diện không dùng `alert()`.
   - Hỗ trợ đóng bằng phím `Escape`, nhấp ngoài vùng phủ hoặc nút đóng.

---

## 3. Hướng dẫn chạy thử nghiệm tại Local

Dự án sử dụng chuẩn HTML5 module, khuyến nghị chạy thông qua HTTP Server để trình duyệt tải các asset và ES Module trơn tru.

### Cách 1: Chạy bằng Python (tích hợp sẵn)

Mở terminal trong thư mục `vinaxo-website/` (hoặc thư mục gốc) và gõ:

```bash
# Nếu ở thư mục vinaxo-website:
python -m http.server 8000

# Sau đó mở trình duyệt tại:
http://localhost:8000
```

### Cách 2: Chạy bằng Node.js / npx

```bash
npx serve vinaxo-website -p 8000
```

### Cách 3: Mở trực tiếp trong VS Code / IDE

Sử dụng extension **Live Server** nhấp chuột phải vào `vinaxo-website/index.html` và chọn **Open with Live Server**.

---

## 4. Bảng màu & Typography chuẩn

| Thành phần | Mã màu Hex | Ý nghĩa |
|---|---|---|
| Primary Green | `#174D32` | Màu xanh lá thương hiệu chủ đạo, tươi mát tự nhiên |
| Forest Green | `#103D2A` | Màu xanh rừng nhiệt đới đậm, dùng cho nút bấm và điểm nhấn |
| Light Sage | `#E8F0E8` | Màu xanh lá cây xô thơm nhạt, làm nền tag và badge |
| Cream Background | `#FAFAF5` | Màu nền kem tự nhiên, tạo cảm giác cao cấp và dịu mắt |
| Soft Beige | `#F3F1E9` | Màu be nhạt cho các khối phụ |
| White | `#FFFFFF` | Nền thẻ card và header |
| Heading Text | `#18271F` | Màu chữ tiêu đề tương phản cao, dễ đọc |
| Body Text | `#66736C` | Màu xám tro tự nhiên cho nội dung mô tả |
| Border | `#E4EAE3` | Viền nhẹ nhàng tinh tế |

- **Font Tiêu đề:** `Playfair Display` (Serif cổ điển, sang trọng).
- **Font Nội dung:** `Plus Jakarta Sans` / `Inter` (Sans-serif hiện đại, tối ưu màn hình số).
- **Font Viết tay:** `Caveat` (Cursive thanh thoát cho dòng slogan hero).

---

## 5. Tuyên bố dữ liệu & Bàn giao doanh nghiệp

- Toàn bộ số liệu đối tác, năm hoạt động, danh sách thị trường và bài viết tin tức trong bản demo được tạo với mục đích minh họa trực quan bố cục website theo yêu cầu mockup.
- Khi triển khai sản xuất (Production), doanh nghiệp VINAXO chỉ cần mở file `js/content.js` để cập nhật số liệu kiểm toán thực tế và các bài báo chính thức mà không cần can thiệp vào cấu trúc code HTML/CSS.
