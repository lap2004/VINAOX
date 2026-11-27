# BÁO CÁO CHUẨN HÓA GOOGLE MAPS & VỊ TRÍ NHÀ MÁY — VINAXO

- **Lỗi P2-01 trước khi sửa**: Trên trang `https://www.vinaxo.net/contact`, bản đồ iframe nhúng tọa độ `10.380295, 106.516139`, nhưng 2 nút **"Mở Google Maps"** và **"Mở Chỉ Đường Google Maps"** lại gắn URL tìm kiếm theo tên khu vực chung chung (`?api=1&query=V%C4%A9nh+B%C3%ACnh+G%C3%B2+C%C3%B4ng+T%C3%A2y+Ti%E1%BB%81n+Giang`), dễ dẫn khách đi nhầm trung tâm xã thay vì vị trí nhà máy thực tế.

---

## 1. Nguồn Dữ liệu Vị trí Duy nhất (Single Source of Truth)

Mọi cấu phần bản đồ, marker nhúng và nút chỉ đường hiện dùng chung cấu hình tại **`content/settings/company.json`** (được đọc bởi **`src/data/company.ts`** thông qua interface `FactoryLocation` và quản lý qua **`/admin/settings`**):

```json
"factory_name_vi": "Nhà Máy Chế Biến VINAXO",
"factory_name_en": "VINAXO Processing Plant",
"latitude": 10.380295,
"longitude": 106.516139,
"google_place_id": ""
```

Các hàm dùng chung tại `src/data/company.ts`:
- `getGoogleMapsSearchUrl()`: `https://www.google.com/maps/search/?api=1&query=10.380295%2C106.516139` *(kèm `&query_place_id=...` nếu Admin nhập Place ID)*
- `getGoogleMapsDirectionsUrl()`: `https://www.google.com/maps/dir/?api=1&destination=10.380295%2C106.516139` *(kèm `&destination_place_id=...` nếu Admin nhập Place ID)*
- `getGoogleMapsEmbedUrl()`: `https://maps.google.com/maps?q=10.380295%2C106.516139&hl={lang}&z=15&output=embed`

Tất cả 3 đầu ra (`iframe` bản đồ, nút **"Mở Google Maps"**, nút **"Chỉ đường đến nhà máy"** và thẻ dự phòng khi map không tải được) dùng **cùng một tọa độ `10.380295, 106.516139`**.

---

## 2. Xác minh Tọa độ Nhà máy (Lưu ý Bàn giao Cho Chủ sở hữu)

- Chúng tôi **giữ nguyên cặp tọa độ `10.380295, 106.516139`** đang tồn tại sẵn trong source code VINAXO trước đó (không tự ý suy đoán tọa độ khác).
- **Khuyến nghị xác nhận thực địa**: Chủ sở hữu VINAXO vui lòng mở link `https://www.google.com/maps/search/?api=1&query=10.380295%2C106.516139` đối chiếu với cổng thực tế của nhà máy tại **Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp**. Nếu cần điều chỉnh chính xác từng mét tới cổng nhà máy hoặc gắn **Google Place ID** chính thức của doanh nghiệp trên Google Business Profile, chỉ cần đăng nhập **`https://vinaxo.net/admin/settings`**, nhập lại Vĩ độ / Kinh độ / Place ID -> xem trước bản đồ -> bấm **Lưu** & **Cập nhật Doanh nghiệp lên website** (không cần sửa code).

---

## 3. Tối ưu Responsive Mobile & Fallback

- Khung bản đồ sử dụng class `.contact-map-stage` (`height: clamp(260px, 46vw, 400px)`) trong `src/styles/global.css` giúp bản đồ vừa vặn trên màn hình điện thoại (không chiếm hết viewport, không tràn ngang ở `320px`–`2560px`), có `loading="lazy"`, và luôn hiển thị thẻ địa chỉ kèm nút **"Mở Chỉ Đường Google Maps"** làm fallback ở lớp nền dưới iframe.
