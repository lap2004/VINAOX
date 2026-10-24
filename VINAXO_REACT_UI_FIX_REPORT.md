# BÁO CÁO FIX LỖI UI/UX VÀ LANGUAGE DROPDOWN — VINAXO REACT

> **Dự án:** CÔNG TY TNHH VINAXO (React 18 + Vite + TypeScript)  
> **Phiên bản:** 2.0.1 (UI/UX Regression & Language Dropdown Fix)  
> **Mục tiêu:** Khắc phục triệt để lỗi Language Dropdown, căn chỉnh bố cục Hero, thiết kế lại Product Cards chống co/ngắt chữ, nâng cấp bản đồ xuất khẩu SVG chuẩn xác và kiểm thử đa thiết bị.  
> **Ngày hoàn thành:** 24/10/2026

---

## 1. NGUYÊN NHÂN GỐC & GIẢI PHÁP SỬA LANGUAGE DROPDOWN

### 1.1. Nguyên nhân gốc
1. **Xung đột giữa Hover và Click:** Sự kiện `onMouseEnter` mở state `isLangOpen(true)`. Khi người dùng click vào nút, handler `onClick={() => setIsLangOpen(!isLangOpen)}` lại đảo ngược state thành `false`, khiến menu bị đóng lại ngay lập tức.
2. **Khoảng hở vật lý (Dead Zone):** Dropdown menu ban đầu sử dụng thuộc tính `marginTop: 6px`. Khi con trỏ chuột di chuyển từ nút VI/EN xuống menu qua khoảng trống 6px này, sự kiện `onMouseLeave` kích hoạt khiến menu tự đóng trước khi người dùng kịp click lựa chọn.
3. **Outside Click & Keyboard:** Sự kiện click bên ngoài trước đây chỉ lắng nghe `click` thông thường, dễ bị bỏ sót trên thiết bị cảm ứng, và chưa hỗ trợ phím `Escape` để đóng menu.
4. **Layout Shift trên Header:** Nút VI/EN và nút "Nhận báo giá / Request a Quote" không có `min-width` cố định. Khi chuyển giữa VI ("VI" / "Nhận báo giá") và EN ("EN" / "Request a Quote"), kích thước nút thay đổi gây giật khung Header.

### 1.2. Cách đã khắc phục triệt để
- **Cầu nối vô hình (Invisible Bridge):** Bỏ `marginTop: 6px` và thay bằng container bọc có `paddingTop: 6px; top: 100%`. Khi di chuột từ nút trigger xuống menu, con trỏ luôn nằm trong phạm vi của thẻ cha, loại bỏ 100% tình trạng mất hover.
- **Grace Period Timer (180ms delay):** Tích hợp `langTimerRef` với khoảng trễ 180ms trên `onMouseLeave`. Bất kỳ chuyển động chuột nhanh hay momentary slip nào cũng không làm menu bị đóng đột ngột.
- **Hỗ trợ đồng thời 2 cơ chế (Dual-Mode):**
  - **Cách 1 (Hover):** Di chuột vào nút -> menu mở mượt mà -> rê chuột xuống -> click ngôn ngữ -> website đổi ngôn ngữ và menu đóng.
  - **Cách 2 (Click):** Click nút trigger -> menu toggle mở/đóng dứt khoát -> click chọn ngôn ngữ -> menu đóng.
- **Xử lý Outside Click & Escape:** Lắng nghe cả `mousedown`, `touchstart` và phím `Escape` để đóng dropdown tức thì khi người dùng tương tác ra ngoài.
- **Ổn định kích thước Header:** Khóa cứng `minWidth: '76px'` cho nút ngôn ngữ và `minWidth: '154px'` cho nút Báo giá (`flex-shrink: 0`, `white-space: nowrap`), ngăn chặn triệt để hiện tượng co giật Header khi đổi ngôn ngữ.

---

## 2. NHỮNG CẢI TIẾN TRÊN HERO TRANG CHỦ

1. **Khắc phục khoảng trống xanh nhạt `#E7EFE8` bên dưới ảnh:**
   - **Nguyên nhân:** Thẻ `<picture>` mặc định là `inline element` và không có kích thước bao bọc, khiến ảnh `img` không lấp đầy khung hình vuông tỷ lệ `1/1`, để lộ mảng màu nền trống rất lớn.
   - **Giải pháp:** Thiết lập `<picture style={{ display: 'block', width: '100%', height: '100%' }}>` kết hợp `img style={{ width: '100%', height: '100%', objectFit: 'cover' }}`.
2. **Cân đối tỷ lệ khung ảnh:**
   - Chuyển `aspectRatio` từ hình vuông `1/1` sang tỷ lệ chuẩn editorial `4/3` (tương thích hoàn hảo với ảnh đĩa trái cây sấy nằm ngang).
3. **Căn chỉnh Badge xoay & Caption:**
   - Thẻ con dấu xoay tròn `FROM VIETNAM TO THE WORLD` được điều chỉnh kích thước về `92px`, ghim tại tọa độ `top: -16px, right: -16px` với hiệu ứng đổ bóng mềm `drop-shadow(0 8px 20px rgba(16, 61, 42, 0.16))`, không còn bị cắt mép hay đè thô kệch.
   - Hộp thông tin `Good Fruits, Brighter Tomorrows` + `OCOP 3★` phía dưới ảnh sử dụng kính mờ cao cấp (`backdropFilter: blur(10px)`), viền mờ 1px và padding cân đối.

---

## 3. THIẾT KẾ LẠI PRODUCT CARDS & NÚT THAO TÁC

1. **Khắc phục lỗi co nút và ngắt chữ thành 3-4 dòng (Screenshot 2 & 4):**
   - **Nguyên nhân:** Ở độ phân giải 1100px-1366px, việc ép 5 card vào 1 hàng khiến bề rộng mỗi card chỉ còn ~200px. Khi đặt 2 nút nằm ngang cạnh nhau, mỗi nút chỉ có bề rộng ~70px, làm chữ "Xem thông số" và "Nhận báo giá" bị ép gãy vụn thành từng từ xếp dọc.
2. **Bố cục lưới Responsive Grid mới:**
   - Homepage: Áp dụng `display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;`.
   - Desktop rộng hiển thị 3-4 cột rộng rãi; laptop tự cân đối 3 cột; tablet 2 cột; mobile 1 cột (hoặc 2 cột nhỏ). Mỗi card luôn đảm bảo độ rộng tối thiểu **260px**.
3. **Tái cấu trúc nút thao tác dọc (Stacked Full-Width):**
   - **Nút chính (Primary Green):** `Nhận báo giá xuất khẩu / Request B2B Quote` — chiều cao 38px, bo góc pill, rộng 100% card, `white-space: nowrap`, kèm icon mũi tên.
   - **Nút phụ (Light Sage):** `Xem thông số kỹ thuật / View Specifications` — chiều cao 36px, bo góc pill, rộng 100% card, `white-space: nowrap`, kèm icon tài liệu.
   - **Kết quả:** Chữ hiển thị trọn vẹn trên 1 dòng duy nhất, không bao giờ bị ngắt dòng hay biến dạng thành hình tròn méo mó.
4. **Tinh chỉnh Card Badges & Specs:**
   - Badge OCOP 3 sao và Verified Line thu nhỏ tinh tế (`padding: 4px 9px`, icon 11px), đặt tại góc trên bên trái không che lấp sản phẩm.
   - Chỉ số độ ngọt Brix chuyển thành pill kính mờ sang trọng tại góc trên bên phải.
   - Thẻ thông số độ ẩm (`< 15%`) và HSD (`12 Tháng`) căn chỉnh đều đặn với đường ngăn cách mờ.

---

## 4. NÂNG CẤP BẢN ĐỒ XUẤT KHẨU SVG (WORLD MAP)

1. **Hình dáng châu lục chân thực (Authentic Landmasses):**
   - Thay thế các khối đa giác thô sơ (tam giác/lục giác) cũ bằng hệ đường cong SVG địa lý sắc nét, chân thực cho Bắc Mỹ (kèm Alaska & Greenland), Nam Mỹ, Châu Âu, Châu Phi (kèm Madagascar), Châu Á - Á Âu và Châu Úc.
2. **Các tuyến xuất khẩu Bezier mềm mại, không chồng chéo:**
   - **Tuyến 1 (Hoa Kỳ ~70%):** Hải trình vượt Thái Bình Dương vòng cung lớn từ Việt Nam `(748, 248)` đến Bờ Tây Hoa Kỳ `(195, 148)` (Cảng Long Beach / LA).
   - **Tuyến 2 (Châu Âu ~20%):** Tuyến hàng hải container qua Ấn Độ Dương và kênh đào Suez tới Tây Âu `(482, 108)` (Rotterdam / Hamburg).
   - **Tuyến 3 (Nga & CIS):** Tuyến hành lang phía Bắc đến `(620, 88)`.
   - **Tuyến 4 (Hàn Quốc & Đông Á):** Tuyến biển ngắn Đông Á tới Busan/Incheon `(812, 152)`.
   - 4 tuyến xuất khẩu tách biệt rõ ràng, chuyển động nét đứt mượt mà, không cắt ngang nhau một cách lộn xộn.
3. **Phân bố nhãn thị trường và Hub Việt Nam:**
   - Các nhãn `USA (~70%)`, `EU (~20%)`, `RUSSIA & CIS`, `KOREA & E. ASIA` được thiết kế dạng pill trắng trang nhã, đổ bóng nhẹ, định vị ngay trên/cạnh marker, không đè lên đường tuyến.
   - Hub VINAXO Tiền Giang có hiệu ứng sóng radar tỏa sáng 2 tầng cùng nhãn màu xanh đậm nổi bật.
   - Bản đồ có giới hạn `maxWidth: 1020px` căn giữa cân đối, khắc phục tình trạng bản đồ quá to choán hết màn hình trên trang `/markets`.

---

## 5. DANH SÁCH FILE ĐÃ THAY ĐỔI

| File | Thay đổi chính |
|---|---|
| `src/components/layout/Header.tsx` | Sửa dropdown VI/EN (dual-mode hover/click, bridge padding, timer 180ms, Escape key, layout lock chống giật). |
| `src/components/products/ProductCard.tsx` | Thiết kế lại 2 nút bấm full-width chống ngắt dòng, căn chỉnh badge OCOP & Brix, tỷ lệ ảnh 64%. |
| `src/components/markets/WorldMapSvg.tsx` | Thay toàn bộ vector châu lục chuẩn địa lý, 4 tuyến cong độc lập, nhãn pill tinh tế, giới hạn độ rộng cân đối. |
| `src/pages/Home.tsx` | Sửa Hero right-column (ảnh 4:3, thẻ picture display:block, căn chỉnh badge tròn, grid sản phẩm auto-fit 260px). |
| `src/styles/responsive.css` | Cập nhật quy tắc `.home-products-grid` và reflow di động cho Product Cards. |

---

## 6. KẾT QUẢ KIỂM THỬ THỰC TẾ TRÊN TRÌNH DUYỆT (BROWSER SUBAGENT)

- **Video ghi hình kiểm thử:** `vinaxo_fixes_demo_1792808239488.webp`
- **Ảnh chụp kiểm thử lưu tại:** `brain/00b4f1f7-b9bc-4d5d-9544-681e64d01dc7/`

### Chi tiết các ca kiểm thử đạt PASS 100%:
1. **Case 1 (Click mở ngôn ngữ):** Click nút VI/EN -> dropdown mở -> click "English" -> website chuyển sang tiếng Anh tức thì -> dropdown tự đóng.
2. **Case 2 (Hover mở ngôn ngữ):** Di chuột vào nút -> dropdown mở -> rê chuột xuống mục "Tiếng Việt" mà không bị đóng menu -> click chọn -> website chuyển về tiếng Việt.
3. **Case 3 (Đóng ngoài & Phím Escape):** Mở dropdown -> click ra ngoài hero background -> dropdown đóng. Mở dropdown -> nhấn phím `Escape` -> dropdown đóng.
4. **Case 4 (Product Cards & Buttons):**
   - 2 nút "Nhận báo giá xuất khẩu" và "Xem thông số kỹ thuật" hiển thị thẳng hàng, không ngắt dòng.
   - Bấm "Xem thông số kỹ thuật" mở modal Spec Sheet với độ ẩm <15%, Brix 65-70°, HSD 12 tháng.
   - Bấm "Nhận báo giá xuất khẩu" mở modal báo giá với sản phẩm được điền sẵn.
5. **Case 5 (Hero & World Map):**
   - Hero ảnh đĩa trái cây sấy khít viền khung, không có khoảng xám xanh thừa.
   - Bản đồ SVG thế giới thể hiện đúng các châu lục mềm mại, 4 đường bay thanh thoát, click vào marker mở bảng thông tin cảng biển.
6. **Case 6 (Kiểm thử Build Production):**
   - Lệnh `npm run build` chạy thành công 100% trong **4.08 giây**, không có lỗi TypeScript hay linter.
