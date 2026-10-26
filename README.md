# VINAXO — Corporate Website (React + Vite + TypeScript)

> **Website chính thức:** [https://vinaxo.vn/](https://vinaxo.vn/)  
> **Doanh nghiệp:** CÔNG TY TNHH VINAXO (VINAXO Company Limited)  
> **Lĩnh vực:** Chế biến & Xuất khẩu Trái cây sấy dẻo tự nhiên (Mekong Delta, Việt Nam)  
> **Tiêu chuẩn chất lượng:** BRCGS Food Safety Grade B • OCOP 3 Sao • FDA Registered

---

## 1. Giới thiệu dự án

Website doanh nghiệp **VINAXO** được xây dựng trên nền tảng **React 18 + Vite 5 + TypeScript 5**, kết hợp hệ thống Design System thuần CSS (Vanilla CSS) hiệu năng cao, tối ưu hóa chuẩn SEO, bảo mật đa tầng và hỗ trợ trải nghiệm song ngữ toàn diện **Tiếng Việt (VI) & Tiếng Anh (EN)**.

### Tính năng nổi bật:
- **100% Client-Side Routing:** Điều hướng tức thì qua `react-router-dom` v6, hỗ trợ code-splitting lazy loading từng trang.
- **Scroll Restoration & Anchor Smart Navigation:** Tự động cuộn mượt lên đầu trang khi click menu, reset tức thì khi chuyển trang mới, và tự động bù trừ chiều cao Sticky Header khi điều hướng tới anchor link (như `#quote-form`).
- **Hệ thống Song ngữ VI / EN:** Chuyển đổi ngôn ngữ mượt mà trong thời gian thực, lưu trữ an toàn trong `localStorage` với cơ chế kiểm tra runtime.
- **Biểu mẫu B2B Tinh gọn & An toàn:** Form Liên hệ và Modal Báo giá được tinh giản, trang bị Anti-bot Honeypot, validation RFC Email, ràng buộc độ dài `maxLength` và định dạng yêu cầu RFP xuất khẩu chuyên nghiệp.
- **Bảo mật Production:** Loại bỏ 100% `dangerouslySetInnerHTML`, cấu hình `sourcemap: false`, tích hợp sẵn Security Headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- **Responsive Hoàn hảo:** Tối ưu hóa hiển thị trên mọi kích thước màn hình: Desktop lớn, Laptop, Tablet, Mobile (iPhone, Samsung, Pixel) tới màn hình siêu nhỏ (320px).

---

## 2. Cấu trúc thư mục dự án

```text
VINAXO/
├── public/                       # Static assets & cấu hình hosting public
│   ├── assets/                   # Hình ảnh sản phẩm, phong cảnh, logo SVG, icons
│   │   ├── icons/                # Con dấu chất lượng SVG
│   │   ├── images/               # Ảnh WebP/JPG trái cây sấy và tin tức xuất khẩu
│   │   └── logo/                 # Logo nhận diện thương hiệu VINAXO SVG
│   ├── .well-known/              # Kênh báo cáo bảo mật RFC 9116 (security.txt)
│   ├── _headers                  # Cấu hình Security Headers (Cloudflare Pages / Netlify)
│   ├── _redirects                # SPA routing rewrite rule
│   ├── robots.txt                # Cấu hình bot crawler & bảo vệ đường dẫn
│   └── sitemap.xml               # Sơ đồ website chuẩn SEO cho vinaxo.vn
├── src/                          # Toàn bộ mã nguồn ứng dụng React
│   ├── components/               # Các UI components tái sử dụng
│   │   ├── layout/               # Header, Footer, MainLayout
│   │   ├── markets/              # Bản đồ thế giới tương tác SVG (WorldMapSvg)
│   │   ├── news/                 # NewsCard, NewsFilter
│   │   ├── products/             # ProductDetailModal
│   │   └── ui/                   # Button, PageHero, SectionHeading, QuoteModal, ScrollToTop
│   ├── data/                     # Dữ liệu tĩnh: công ty, sản phẩm, tin tức
│   ├── i18n/                     # Hệ thống dịch thuật song ngữ (LanguageContext, vi.ts, en.ts)
│   ├── pages/                    # 7 trang cốt lõi (Home, About, Products, Quality, Markets, News, Contact, 404)
│   ├── styles/                   # Design Tokens (variables.css), Layout (global.css), Responsive (responsive.css)
│   ├── App.tsx                   # Khai báo các Routes & Code-splitting
│   └── main.tsx                  # Điểm khởi chạy React DOM & BrowserRouter
├── index.html                    # File HTML chính của Vite SPA với SEO & Meta Headers
├── nginx.conf                    # Mẫu cấu hình bảo mật máy chủ Nginx (cho VPS / Server riêng)
├── package.json                  # Scripts & danh sách dependencies
├── tsconfig.json                 # Cấu hình TypeScript compiler
├── vercel.json                   # Cấu hình 1-click deploy Vercel (Headers, Clean URLs, Rewrites)
└── vite.config.ts                # Cấu hình Vite build & Code chunking
```

---

## 3. Danh mục các trang

1. **Trang chủ (`/`):** Hero nghệ thuật, Câu chuyện thương hiệu, Khối sản phẩm chủ lực, Bản đồ xuất khẩu, Chứng nhận quốc tế, Tin tức mới nhất, Form kết nối hợp tác.
2. **Về VINAXO (`/about`):** Tầm nhìn, sứ mệnh, giá trị cốt lõi, đội ngũ và vùng trồng liên kết ĐBSCL.
3. **Sản phẩm & Thông số (`/products`):** Danh mục trái cây sấy dẻo tự nhiên (Xoài, Mít, Thanh long, Dứa, Chuối), thông số kỹ thuật CIF/FOB, Modal chi tiết sản phẩm.
4. **Chất lượng & Cơ sở vật chất (`/quality`):** Tiêu chuẩn BRCGS Grade B, OCOP 3 Sao, quy trình 6 bước kiểm soát an toàn thực phẩm.
5. **Thị trường Quốc tế (`/markets`):** Bản đồ tương tác các thị trường xuất khẩu trọng điểm (Mỹ, Châu Âu, Nhật Bản, Hàn Quốc, Úc, Trung Đông).
6. **Tin tức & Truyền thông (`/news`):** Hoạt động xuất khẩu, xúc tiến thương mại nông sản, chính sách nông nghiệp xanh.
7. **Liên hệ & Báo giá (`/contact`):** Thông tin pháp nhân, nhà máy, văn phòng đại diện, form liên hệ B2B và bản đồ số.
8. **404 Not Found (`*`):** Trang thông báo liên kết không tồn tại, tự động gợi ý quay về Trang chủ.

---

## 4. Hướng dẫn chạy và phát triển tại Local

### Yêu cầu hệ thống:
- **Node.js:** Phiên bản 18.x hoặc 20.x trở lên.
- **Trình quản lý gói:** `npm`, `pnpm` hoặc `yarn`.

### Cài đặt và khởi chạy:

```bash
# 1. Cài đặt các gói thư viện
npm install

# 2. Chạy môi trường phát triển (Development Server)
npm run dev
# Mở trình duyệt tại: http://localhost:5173/

# 3. Kiểm tra kiểu dữ liệu & Build bản đóng gói Production
npm run build

# 4. Xem trước bản build Production tại Local
npm run preview
# Mở trình duyệt tại: http://localhost:4173/
```

---

## 5. Hướng dẫn Triển khai Production (Deployment)

### Lựa chọn 1: Vercel (Khuyến nghị — Nhanh nhất & Tự động CI/CD)
1. Đăng nhập [Vercel Dashboard](https://vercel.com/) và chọn **Add New...** -> **Project**.
2. Nhập repository `lap2004/VINAOX` hoặc `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO`.
3. Vercel sẽ tự động phát hiện cấu hình từ file `vercel.json`:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Bấm **Deploy**. Vercel sẽ tự động xây dựng và cấp phát URL HTTPS trong vòng 1 phút.
5. Trỏ Custom Domain `vinaxo.vn` trong phần cài đặt **Domains** của Vercel.

### Lựa chọn 2: Cloudflare Pages
1. Tạo dự án mới trên Cloudflare Pages -> Connect Git.
2. Thiết lập:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Dự án tự động sử dụng file `public/_headers` và `public/_redirects` để áp dụng Security Headers và định tuyến SPA.

### Lựa chọn 3: VPS / Máy chủ riêng chạy Nginx
1. Chạy lệnh `npm run build` trên máy chủ hoặc CI/CD pipeline.
2. Sao chép nội dung thư mục `dist/` vào `/var/www/vinaxo/dist`.
3. Áp dụng file cấu hình bảo mật mẫu [`nginx.conf`](./nginx.conf):
   - Đã cấu hình sẵn: chuyển hướng HTTP sang HTTPS, SSL TLS 1.2/1.3, HSTS 1 năm, tắt hiển thị phiên bản `server_tokens off`, tắt duyệt thư mục `autoindex off`, chặn file ẩn và rate-limiting chống spam form.

---

## 6. Liên hệ Kỹ thuật & Bản quyền

- **Bản quyền:** © 2026 CÔNG TY TNHH VINAXO. All rights reserved.
- **Đơn vị phát triển & Bảo mật:** SONAI TECHNOLOGY COMPANY LIMITED ([https://sonai.vn/](https://sonai.vn/))
- **Email tiếp nhận thông tin B2B:** `thaovinaxo@gmail.com`
- **Tên miền sản xuất:** `https://vinaxo.vn/`
