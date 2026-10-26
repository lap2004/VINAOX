# BÁO CÁO KIỂM TOÁN BẢO MẬT & GIA CỐ PRODUCTION
# VINAXO CORPORATE WEBSITE

- **Dự án:** VINAXO Corporate Website
- **Website Production:** [https://vinaxo.vn/](https://vinaxo.vn/)
- **Repository:** [https://github.com/SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO](https://github.com/SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO)
- **Công nghệ:** React 18, Vite 5, TypeScript 5, Vanilla CSS
- **Thời gian thực hiện:** 26/10/2026
- **Trạng thái tổng thể:** **SẴN SÀNG TRIỂN KHAI PRODUCTION (PRODUCTION READY)**

---

## 1. MỤC TIÊU & PHẠM VI KIỂM TOÁN

Báo cáo này ghi nhận toàn bộ quá trình rà soát, phát hiện nguy cơ và trực tiếp gia cố bảo mật cho website doanh nghiệp VINAXO trước khi phát hành chính thức lên tên miền `https://vinaxo.vn/`.

### Phạm vi kiểm toán:
1. **Source Code:** Quét mã độc, XSS, DOM-based XSS, HTML/URL Injection, `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, third-party scripts.
2. **Secrets & Configurations:** Rà soát `.env`, `vite.config.ts`, git log, `.gitignore`, build output, kiểm tra rò rỉ API secrets/credentials.
3. **Forms & User Inputs:** Kiểm tra form Liên hệ (`Contact.tsx`) và form Báo giá Wholesale B2B (`QuoteModal.tsx`), chống bot/spam, validation dữ liệu.
4. **HTTPS & Security Headers:** Thiết lập chính sách bảo mật HTTP Headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
5. **Cấu hình Hosting:** Chuẩn bị file cấu hình tối ưu và bảo mật cho cả Static Hosting (Cloudflare Pages, Vercel, Netlify) và VPS (Nginx).
6. **Kiểm thử hồi quy (Regression Testing):** Đảm bảo UI/UX, responsive mobile/desktop, song ngữ VI/EN và mọi chức năng hoạt động hoàn hảo 100%.

---

## 2. BẢNG TỔNG HỢP KIỂM TOÁN BẢO MẬT (SECURITY AUDIT MATRIX)

| Hạng mục | Mức độ | Phát hiện rủi ro | Biện pháp xử lý & Gia cố | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Source Code (XSS)** | **HIGH** | Phát hiện 9 vị trí sử dụng `dangerouslySetInnerHTML` trong `Home.tsx` (6 vị trí), `Contact.tsx` (1 vị trí), `PageHero.tsx` (1 vị trí), `SectionHeading.tsx` (1 vị trí). Tiềm ẩn nguy cơ DOM-based XSS nếu chuỗi nội dung bị can thiệp. | **Đã loại bỏ 100% `dangerouslySetInnerHTML`**. Thay thế bằng hàm render JSX thuần an toàn (`renderSafeText`) tách chuỗi bằng regex và render thẻ `<br />` trực tiếp. `PageHero` và `SectionHeading` render text trực tiếp. | **ĐÃ XỬ LÝ (RESOLVED)** |
| **Source Code (Links)** | **MEDIUM** | Nguy cơ Reverse Tabnabbing qua các liên kết `target="_blank"`. | Kiểm tra toàn bộ 7 thẻ `target="_blank"` trong toàn bộ source code. Tất cả đã có đầy đủ `rel="noopener noreferrer"`. | **ĐÃ KIỂM TRA (VERIFIED)** |
| **Source Code (Storage)** | **LOW** | Rủi ro lưu trữ token hoặc dữ liệu định danh trong `localStorage`. | Kiểm tra `localStorage`: chỉ lưu trữ duy nhất `vinaxo_lang` với runtime validation nghiêm ngặt chỉ chấp nhận `'vi'` hoặc `'en'`. Tuyệt đối không lưu dữ liệu nhạy cảm. | **ĐÃ KIỂM TRA (VERIFIED)** |
| **Dependencies** | **MEDIUM** | Nguy cơ thư viện lỗi thời, dependency bloat hoặc package không bảo trì. | Toàn bộ dự án chỉ sử dụng 5 runtime dependencies chính thống (`react`, `react-dom`, `react-router-dom`, `framer-motion`, `lucide-react`). Khóa phiên bản nghiêm ngặt trong `package-lock.json`. | **AN TOÀN (VERIFIED)** |
| **API & Forms (Spam/Bot)** | **HIGH** | Form liên hệ và báo giá không có cơ chế chặn spam tự động; thiếu giới hạn độ dài input dẫn đến nguy cơ gửi payload dung lượng lớn. | **Thêm cơ chế Anti-bot Honeypot** (trường ẩn bẫy bot crawler). **Thêm ràng buộc `maxLength`** trên 100% trường input (`100`, `120`, `150`, `3000` ký tự). | **ĐÃ XỬ LÝ (RESOLVED)** |
| **API & Forms (Validation)** | **HIGH** | Thiếu kiểm tra định dạng email theo chuẩn RFC; nguy cơ gửi email rác hoặc dữ liệu giả lập không kiểm soát. | **Thêm RFC-compliant email regex validation** (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`). Tự động `trim()` khoảng trắng trước khi xử lý. Hiển thị thông báo lỗi trực quan. | **ĐÃ XỬ LÝ (RESOLVED)** |
| **API & Forms (Credentials)** | **HIGH** | Nguy cơ để lộ SMTP password hoặc Email API private key trong mã nguồn frontend. Giả lập thành công ảo bằng `setTimeout` gây hiểu lầm cho người dùng. | **Tuyệt đối không lưu credentials trong frontend**. Chuyển đổi sang cơ chế tạo dispatch `mailto:` chuẩn hóa định dạng B2B RFP gửi trực tiếp đến `thaovinaxo@gmail.com`. Minh bạch trạng thái, không giả lập gửi ảo. | **ĐÃ XỬ LÝ (RESOLVED)** |
| **Secrets Exposure** | **CRITICAL** | Nguy cơ commit file `.env`, private key SSL hoặc source map chứa mã nguồn gốc lên server public. | Quét git history và source code: **0 secret bị lộ**. Cấu hình `sourcemap: false` trong `vite.config.ts`. Gia cố `.gitignore` chặn toàn bộ `.env*`, `*.pem`, `*.key`, `*.cert`, `*.sql`, `*.dump`. | **ĐÃ XỬ LÝ (RESOLVED)** |
| **Domain & Metadata** | **MEDIUM** | Metadata canonical, Open Graph, Twitter Card, sitemap.xml và robots.txt vẫn dùng domain cũ `vinaxo.net`. | **Đồng bộ hóa 100% sang `https://vinaxo.vn/`**. Cập nhật canonical, Open Graph, Twitter Card, JSON-LD Schema.org, `robots.txt` và `sitemap.xml`. | **ĐÃ XỬ LÝ (RESOLVED)** |
| **Security Headers** | **HIGH** | Thiếu cấu hình Security Headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). | Thêm security meta tags vào `index.html`. Tạo sẵn `public/_headers` (Cloudflare Pages/Netlify), `vercel.json` (Vercel) và `nginx.conf` (VPS) với đầy đủ CSP, HSTS, nosniff, SAMEORIGIN. | **ĐÃ THIẾT LẬP (CONFIGURED)** |
| **Hosting (Static & VPS)** | **MEDIUM** | Nguy cơ lộ cấu hình file ẩn, directory indexing hoặc chạy Vite dev server trên production. | Cung cấp file cấu hình production chuẩn hóa: `nginx.conf` tắt `server_tokens off`, tắt `autoindex off`, chặn truy cập `/\.`, giới hạn body size 5MB, rate limiting 20r/s và 3r/s cho form. | **ĐÃ THIẾT LẬP (CONFIGURED)** |
| **GitHub Repository** | **LOW** | Chưa cấu hình quy tắc bảo vệ branch và quét lỗ hổng tự động trên repository. | Đưa ra khuyến nghị thiết lập Branch Protection Rule, Secret Scanning, Dependabot và MFA cho tài khoản quản trị repo. | **ĐÃ HƯỚNG DẪN (GUIDED)** |

---

## 3. CHI TIẾT KẾT QUẢ RÀ SOÁT & GIA CỐ MÃ NGUỒN

### 3.1. Loại bỏ toàn bộ `dangerouslySetInnerHTML`
- **Trước kiểm toán:** Có 9 vị trí render HTML trực tiếp bằng `dangerouslySetInnerHTML`.
  - `src/pages/Home.tsx` (6 vị trí trong các Feature Cards của Hero).
  - `src/pages/Contact.tsx` (1 vị trí trong ghi chú cam kết liên hệ).
  - `src/components/ui/PageHero.tsx` (1 vị trí trong `description`).
  - `src/components/ui/SectionHeading.tsx` (1 vị trí trong `description`).
- **Sau gia cố:**
  - Viết hàm trợ giúp an toàn `renderSafeText(text: string)` trong `Home.tsx`: tách chuỗi bằng biểu thức chính quy `/<br\s*\/?>/gi`, render mảng JSX React với thẻ `<br />` chuẩn, không dùng bất kỳ cơ chế HTML injection nào.
  - Chuyển đổi `Contact.tsx` sang các thẻ `<strong>` và text node JSX chuẩn.
  - `PageHero.tsx` và `SectionHeading.tsx` render trực tiếp `{description}` an toàn.
  - **Kết quả rà soát lại toàn bộ dự án:** `0` vị trí `dangerouslySetInnerHTML`, `0` vị trí `innerHTML`, `0` hàm `eval()`.

### 3.2. Kiểm tra External Links & Reverse Tabnabbing
- Toàn bộ các liên kết mở tab mới (`target="_blank"`) trên website (Footer, Contact, Bản đồ Google Maps, v.v.) đều đã được trang bị thuộc tính `rel="noopener noreferrer"`.
- Ngăn chặn triệt để kỹ thuật tấn công `window.opener` redirection.

### 3.3. Bảo vệ LocalStorage
- Kiểm tra toàn bộ codebase: `localStorage` chỉ được truy xuất tại `src/i18n/LanguageContext.tsx`.
- Dữ liệu lưu trữ: chỉ lưu mã ngôn ngữ `vinaxo_lang`.
- Kiểm tra an toàn: Có kiểm tra điều kiện `saved === 'vi' || saved === 'en'` trước khi áp dụng. Nếu có giá trị bất thường sẽ tự động fallback về `'vi'`. Không có bất kỳ token, password hoặc PII (Personally Identifiable Information) nào trong trình duyệt.

---

## 4. BẢO VỆ API KEYS, SECRETS & MÃ NGUỒN

### 4.1. Rà soát biến môi trường và Credentials
- Đã quét toàn bộ cây thư mục dự án và git commit log:
  - Không có file `.env` chứa mật khẩu hay API key riêng tư nào được commit vào git.
  - Không có biến `VITE_*` chứa secret.
  - Không có thông tin nhạy cảm nào bị đưa vào mã nguồn hoặc log console.

### 4.2. Cấu hình bảo vệ Build Output (`vite.config.ts`)
- Đã cấu hình `build.sourcemap: false`.
- **Lợi ích bảo mật:** Trình duyệt production sẽ không tải về các file `.map`, ngăn chặn kẻ xấu đọc cấu trúc mã nguồn gốc TypeScript, tên biến nội bộ, logic thuật toán và các ghi chú phát triển.
- Tách chunk thông minh (`vendor`, `motion`, `icons`) giúp trình duyệt cache tối ưu và giảm tải tấn công dồn dập vào bundle chính.

### 4.3. Gia cố `.gitignore`
Đã cập nhật file `.gitignore` để ngăn chặn rủi ro vô tình commit các file nhạy cảm trong tương lai:
```gitignore
# Logs, Secrets & Environment
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.env
.env.*
!.env.example

# Certificates, Keys & Credentials
*.pem
*.key
*.cert
*.crt
*.pfx
*.p12
*.keystore
id_rsa*
*.sql
*.dump
```

---

## 5. BẢO VỆ BIỂU MẪU LIÊN HỆ & BÁO GIÁ (CONTACT & QUOTE MODAL)

Hai biểu mẫu chính tiếp nhận thông tin từ khách hàng đối tác quốc tế là:
1. `src/pages/Contact.tsx` (Form liên hệ hợp tác B2B).
2. `src/components/ui/QuoteModal.tsx` (Modal yêu cầu báo giá xuất khẩu).

### Các biện pháp gia cố đã áp dụng:

1. **Cơ chế Anti-bot Honeypot:**
   - Đặt một input ẩn vô hình với người dùng thật (`company_website_hp` và `quote_company_fax_hp`), nằm ngoài màn hình (`position: absolute; left: -9999px; display: none;`).
   - Các bot spam tự động quét form HTML sẽ tự động điền giá trị vào ô này.
   - Khi phát hiện ô honeypot có dữ liệu, mã nguồn sẽ ngay lập tức hủy gửi mà không thực hiện hành động nào, bảo vệ hộp thư doanh nghiệp khỏi hàng nghìn yêu cầu rác.

2. **Giới hạn độ dài dữ liệu (`maxLength`):**
   - Đã áp đặt `maxLength` cụ thể trên từng trường:
     - Họ tên: tối đa 100 ký tự.
     - Email: tối đa 120 ký tự.
     - Số điện thoại/WhatsApp: tối đa 30 ký tự.
     - Công ty/Tổ chức: tối đa 150 ký tự.
     - Sản lượng/Cảng đích: tối đa 80–120 ký tự.
     - Nội dung yêu cầu chi tiết: tối đa 3.000 ký tự.
   - Ngăn chặn nguy cơ tràn bộ nhớ trình duyệt hoặc cố tình gửi payload độc hại khổng lồ.

3. **Xác thực định dạng Email chuẩn RFC:**
   - Sử dụng regex kiểm tra cấu trúc email: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`.
   - Bắt buộc kiểm tra cả phía client trước khi xử lý. Nếu sai định dạng, hiển thị banner cảnh báo màu đỏ trực quan bằng song ngữ VI/EN.

4. **Trimming & Xử lý dữ liệu:**
   - Toàn bộ dữ liệu nhập vào đều được tự động `.trim()` loại bỏ khoảng trắng thừa đầu cuối, ngăn ngừa các kỹ thuật bypass đơn giản.

5. **Xử lý Dispatch minh bạch, không lưu secret frontend:**
   - **Thực trạng kiến trúc:** Website VINAXO là website tĩnh giới thiệu doanh nghiệp (Corporate Static Website), chưa có máy chủ backend riêng.
   - **Xử lý an toàn:** Thay vì tạo thông báo thành công giả tạo bằng `setTimeout` đơn thuần hoặc cố tình nhúng tài khoản SMTP vào frontend (cực kỳ nguy hiểm), hệ thống đóng gói toàn bộ thông tin đối tác nhập vào thành định dạng yêu cầu B2B xuất khẩu chuyên nghiệp và điều hướng người dùng xác nhận gửi qua email chính thức của VINAXO (`thaovinaxo@gmail.com`).
   - **Lộ trình nâng cấp nếu cần Backend:** Nếu sau này doanh nghiệp muốn tự động hóa gửi email ngầm vào hệ thống CRM, giải pháp tối ưu là sử dụng **Cloudflare Worker** hoặc **Vercel Serverless Function** kết hợp **Cloudflare Turnstile** (CAPTCHA miễn phí, không làm phiền người dùng), giữ Private API Key (như Resend/SendGrid) hoàn toàn ở serverless backend.

---

## 6. HTTPS & CHÍNH SÁCH BẢO MẬT (SECURITY HEADERS)

Đã thiết lập cấu hình Security Headers theo tiêu chuẩn CIS Benchmark và khuyến nghị của Mozilla Observatory:

### 6.1. Bảng chi tiết Security Headers

| Header | Giá trị thiết lập | Ý nghĩa bảo vệ |
| :--- | :--- | :--- |
| **X-Content-Type-Options** | `nosniff` | Ngăn chặn trình duyệt tự ý đoán định dạng MIME (MIME-sniffing), chặn thực thi file tải về dưới dạng script. |
| **X-Frame-Options** | `SAMEORIGIN` | Ngăn chặn website bị nhúng vào iframe trên các trang web lạ, chống tấn công Clickjacking. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Bảo vệ thông tin URL nội bộ khi người dùng click vào link chuyển tiếp sang trang khác. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()` | Vô hiệu hóa toàn bộ các quyền phần cứng nhạy cảm (camera, mic, vị trí) mà website doanh nghiệp không sử dụng. |
| **Strict-Transport-Security (HSTS)** | `max-age=31536000; includeSubDomains; preload` | Ép buộc mọi kết nối tới `vinaxo.vn` trong vòng 1 năm phải sử dụng giao thức HTTPS được mã hóa. |
| **Content-Security-Policy (CSP)** | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://images.unsplash.com blob:; connect-src 'self'; frame-ancestors 'self'; form-action 'self' mailto:; base-uri 'self'; object-src 'none';` | Kiểm soát chặt chẽ nguồn tài nguyên được phép tải. Chỉ cho phép font từ Google Fonts, ảnh từ domain nội bộ và Unsplash, chặn hoàn toàn các nguồn script lạ. |

### 6.2. Các file cấu hình đã được tạo sẵn trong dự án:

1. **`public/_headers`**: Tự động áp dụng khi triển khai trên **Cloudflare Pages** hoặc **Netlify**.
2. **`public/_redirects`**: Định tuyến SPA Fallback (`/* /index.html 200`).
3. **`vercel.json`**: Cấu hình Headers, Clean URLs và SPA Rewrites cho **Vercel**.
4. **`nginx.conf`**: Cấu hình production-grade hoàn chỉnh cho **VPS / Máy chủ riêng chạy Nginx**:
   - Tắt hiển thị phiên bản Nginx: `server_tokens off;`
   - Tắt duyệt thư mục: `autoindex off;`
   - Tự động chuyển HTTP sang HTTPS (301 Permanent Redirect).
   - Chuyển `www.vinaxo.vn` về apex domain `https://vinaxo.vn`.
   - Cấu hình SSL TLS 1.2 / TLS 1.3 với bộ Cipher hiện đại.
   - Bộ đệm và giới hạn upload: `client_max_body_size 5M;`
   - Rate limiting: 20 req/s cho traffic chung, 3 req/s cho các endpoint form.
   - Chặn truy cập file ẩn (`.git`, `.env`): `location ~ /\. { deny all; }`
   - Chặn truy cập file backup/dump (`.sql`, `.bak`, `.log`): `location ~* \.(bak|sql|dump|log|ini)$ { deny all; }`
   - Cache tĩnh tối đa cho thư mục `/assets/` (1 năm immutable).
5. **`public/.well-known/security.txt`**: Khai báo kênh liên hệ báo cáo lỗ hổng bảo mật theo chuẩn **RFC 9116**, trỏ về `thaovinaxo@gmail.com`.

---

## 7. ĐỒNG BỘ TÊN MIỀN & SEO AN TOÀN

- Đã thay thế toàn bộ địa chỉ thử nghiệm `vinaxo.net` bằng tên miền chính thức **`https://vinaxo.vn/`**:
  - `index.html`: Thẻ canonical, Open Graph URL & Image, Twitter Card URL & Image, JSON-LD Schema.org.
  - `public/robots.txt`: Khai báo URL sitemap `https://vinaxo.vn/sitemap.xml` và bổ sung lệnh cấm bot quét các thư mục nội bộ:
    ```txt
    User-agent: *
    Allow: /
    Disallow: /dist/
    Disallow: /node_modules/
    Disallow: /*.json$
    Sitemap: https://vinaxo.vn/sitemap.xml
    ```
  - `public/sitemap.xml`: Cập nhật 100% URL sang `https://vinaxo.vn/` với ngày cập nhật mới nhất.

---

## 8. BẢO MẬT GITHUB REPOSITORY & QUY TRÌNH DEPLOY

Nhằm đảm bảo an toàn cho mã nguồn trên GitHub (`SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO`), khuyến nghị thực hiện các bước sau trên giao diện quản trị GitHub:

1. **Bật Secret Scanning & Push Protection:**
   - Vào `Settings` -> `Code security and analysis`.
   - Bật **Secret scanning** và **Push protection** để GitHub tự động chặn đứng nếu lập trình viên lỡ tay commit API key hoặc token.
2. **Kích hoạt Dependabot Alerts:**
   - Bật **Dependabot alerts** và **Dependabot security updates** để nhận cảnh báo sớm nếu bất kỳ thư viện phụ thuộc nào có CVE mới.
3. **Bảo vệ nhánh chính (`main`):**
   - Vào `Settings` -> `Branches` -> Thêm Branch protection rule cho `main`.
   - Tích chọn: *Require a pull request before merging*, *Require status checks to pass before merging*.
4. **Bảo vệ tài khoản quản trị:**
   - Bắt buộc toàn bộ tài khoản có quyền truy cập repo phải bật xác thực 2 bước (**2FA/MFA**).
   - Không chia sẻ tài khoản chung. Cấp quyền theo nguyên tắc đặc quyền tối thiểu (Least Privilege).

---

## 9. KẾT QUẢ KIỂM THỬ THỰC TẾ & HỒI QUY (REGRESSION TESTING)

Toàn bộ các bài kiểm thử đã được chạy thực tế trên máy local và môi trường preview:

1. **Kiểm thử Production Build:**
   - Lệnh: `npm run build` (`tsc -b && vite build`)
   - Kết quả: **THÀNH CÔNG (Exit Code: 0)**
   - Thời gian build: **3.35s**
   - Không có bất kỳ lỗi TypeScript nào (`tsc -b` pass 100%).
   - Bundle sạch, tối ưu, không có file source map rò rỉ.
2. **Kiểm thử Trình duyệt tự động (Browser Subagent):**
   - **Console Errors:** Kiểm tra trang chủ và các trang con -> **0 lỗi console/runtime**.
   - **Chuyển đổi ngôn ngữ:** Chuyển đổi qua lại giữa tiếng Việt (`VI`) và tiếng Anh (`EN`) mượt mà, giữ nguyên trạng thái.
   - **Modal Báo giá:** Mở modal từ nút "Nhận báo giá / Request a Quote", đóng bằng phím `Escape` hoặc nút `X` hoạt động chính xác.
   - **Form Validation:** Thử nhập email không hợp lệ (`bademail`) trên trang liên hệ -> Hệ thống chặn gửi và hiển thị banner cảnh báo đỏ rõ ràng.
   - **Giao diện & Responsive:** Toàn bộ kích thước giao diện Mobile và Desktop, font chữ, màu sắc, hiệu ứng hover, layout Hero, CTA, Footer đều được giữ nguyên 100%, không bị xô lệch hay lỗi hình ảnh.

---

## 10. CHECKLIST TRIỂN KHAI PRODUCTION (DEPLOYMENT CHECKLIST)

Khi đưa website lên hosting thực tế, quản trị viên chỉ cần thực hiện theo checklist sau:

- [x] Mã nguồn đã xóa bỏ hoàn toàn `dangerouslySetInnerHTML`.
- [x] Biểu mẫu có Anti-bot honeypot và giới hạn độ dài ký tự `maxLength`.
- [x] Email được kiểm tra theo biểu thức chính quy chuẩn RFC.
- [x] Đã cấu hình `sourcemap: false` trong build output.
- [x] File `.gitignore` đã chặn tất cả `.env*` và certificate.
- [x] File `public/_headers` và `vercel.json` đã sẵn sàng cho Cloudflare Pages / Vercel.
- [x] File `nginx.conf` đã sẵn sàng nếu triển khai trên VPS.
- [x] File `public/.well-known/security.txt` đã được tạo.
- [x] File `robots.txt` và `sitemap.xml` đã trỏ về `https://vinaxo.vn/`.
- [x] Build `npm run build` thành công không có lỗi.
- [ ] Cài đặt chứng chỉ SSL/TLS miễn phí (Let's Encrypt hoặc Cloudflare Universal SSL) sau khi trỏ DNS `vinaxo.vn`.
- [ ] Bật "Always Use HTTPS" và "Automatic HTTPS Rewrites" trên Cloudflare/Hosting.
- [ ] Bật HTTP/2 hoặc HTTP/3 trên Web Server để tối ưu tốc độ tải trang.

---
*Báo cáo được lập bởi Đội ngũ Kỹ thuật & Bảo mật VINAXO — SONAI TECHNOLOGY COMPANY LIMITED.*
