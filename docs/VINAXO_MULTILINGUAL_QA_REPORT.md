# BÁO CÁO KIỂM THỬ CHẤT LƯỢNG ĐA NGÔN NGỮ (VI / EN / KO / ZH-CN) — VINAXO

- **Thời điểm thực thi kiểm thử live**: `2026-11-26T17:34:46Z` (UTC) — tức `2026-11-27 00:34:46` (GMT+7)
- **URL Production đã kiểm thử**: `https://www.vinaxo.net` (bundle mới xác nhận trực tiếp trong DOM: `assets/index-rCQKKEYp.js`, từ commit `main` `e5bc74b`)
- **Môi trường trình duyệt đã chạy tự động**: Headless **Google Chrome** & Headless **Microsoft Edge** qua Selenium (`scripts/qa-multilingual.py`)

---

## 1. Tổng hợp Kết quả Kiểm thử Tự động (Build, API, Bảo mật & SEO)

| Bộ kiểm thử / Lệnh thực thi | Phạm vi | Kết quả quan sát | Ghi chú |
|---|---|---|---|
| `node scripts/check-i18n-completeness.mjs` | Kiểm tra đầy đủ & không rỗng toàn bộ khóa dịch | **PASS (607/607 khóa × 4 ngôn ngữ)** | Tích hợp trực tiếp vào `npm run build` |
| `npm run build` | `check:i18n` + `tsc -b` + `tsc -p tsconfig.server.json --noEmit` + `build-api.mjs` + `vite build` + `generate-seo-artifacts.mjs` | **PASS (Exit code 0)** | Build 10 admin API handlers + inquiry handler, sinh 29 URL sitemap & static HTML |
| `node scripts/test-seo-and-inquiry.mjs` | Guards API `/api/inquiry` (405/415/400/503/mock Resend 200/409/429), KO/ZH-CN payload, canonical/sitemap `vinaxo.net`, `routeMetadata.ts` 4 ngôn ngữ, chuẩn hóa `VINAXO COMPANY LIMITED`, bảo toàn field `ko`/`zh` khi update một phần | **PASS (8/8 test cases)** | Gồm kiểm thử mock Resend và kiểm tra schema merge |
| `npx tsx scripts/test-admin-suite.mjs` | Auth, CSRF, path traversal, XSS, GitHub sync, Data Contract, Media safe delete, Certificates & Publish API | **PASS (19/19 test cases)** | Đã `git checkout` khôi phục mutation cục bộ ở `publish_history.json` trước khi commit |

---

## 2. Kết quả Kiểm thử Trình duyệt Đa ngôn ngữ (Cục bộ & Live `https://www.vinaxo.net`)

Kịch bản `scripts/qa-multilingual.py` kiểm tra cùng lúc **Chrome** và **Edge** trên bản build cục bộ (`http://127.0.0.1:4173`) lẫn **môi trường live (`https://www.vinaxo.net`)**:

| Hạng mục kiểm thử trong `scripts/qa-multilingual.py` | Chrome (Live) | Edge (Live) | Ghi chú |
|---|:---:|:---:|---|
| `SWITCH-{vi,en,ko,zh-CN}-SPA`: Đổi ngôn ngữ trên Header không reload trang (`spaMarker === 'alive'`), đồng bộ `html[lang]`, `localStorage('vinaxo_lang')`, `og:locale` (`vi_VN`, `en_US`, `ko_KR`, `zh_CN`) | **PASS (4/4)** | **PASS (4/4)** | Không reload toàn trang |
| `RELOAD-PERSIST-ZH`: Tải lại trang giữ nguyên ngôn ngữ `zh-CN` | **PASS** | **PASS** | Đồng bộ `htmlLang` & `localStorage` |
| `UNIQUE-META-TITLES-HOME`: 4 bộ `title` & `meta description` trang chủ khác biệt theo ngôn ngữ | **PASS** | **PASS** | 4/4 unique titles & descriptions |
| `FOOTER-LEGAL-{vi,en,ko,zh-CN}` & `CONTACT-LEGAL-{vi,en,ko,zh-CN}`: Hiển thị đúng tên pháp lý (`CÔNG TY TNHH VINAXO` cho `vi`; `VINAXO COMPANY LIMITED` cho `en`/`ko`/`zh-CN`) và **0 chuỗi lặp `Vinaxo Co., Ltd.`** | **PASS (8/8)** | **PASS (8/8)** | Đóng lỗi P2-01 triệt để |
| `ROUTE-{lang}-{route}`: 9 route công khai (`/`, `/about`, `/products`, `/quality`, `/markets`, `/news`, `/brochure`, `/contact`, `/tin-tuc/press-nld-mango-sourcing`) × 4 ngôn ngữ = 36 kiểm tra (1 canonical đúng route, `h1` không rỗng, 0 tên công ty lặp, 0 lộ key thô, 0 ảnh lỗi `naturalWidth === 0`) | **PASS (36/36)** | **PASS (36/36)** | Kiểm tra trên toàn bộ route công khai |
| `BROCHURE-{vi,en,ko,zh-CN}`: Có file `/brochures/vinaxo-company-brochure-2026.pdf`, hiển thị thông báo ấn bản PDF tiếng Anh 2026 trên `vi`, `ko`, `zh-CN` | **PASS (4/4)** | **PASS (4/4)** | Không bịa PDF giả |
| `PRODUCT-MODAL-{vi,en,ko,zh-CN}`: Mở modal chi tiết sản phẩm & render tiêu đề ở cả 4 ngôn ngữ | **PASS (4/4)** | **PASS (4/4)** | Kiểm tra tương tác DOM thực tế |
| `OVERFLOW-MATRIX-{vi,en,ko,zh-CN}`: Không tràn ngang (`scrollWidth <= innerWidth + 1`) qua **10 kích thước màn hình** (`320×568`, `360×800`, `390×844`, `430×932`, `768×1024`, `1024×768`, `1280×720`, `1366×768`, `1440×900`, `1920×1080`) trên `/`, `/products`, `/contact` | **PASS (4/4 ma trận)** | **PASS (4/4 ma trận)** | Tổng cộng 120 điểm đo/trình duyệt |
| `CONSOLE-NO-SEVERE`: Không có lỗi `SEVERE` trong Console trình duyệt | **PASS** | **PASS** | Clean console |
| **Tổng cộng live `https://www.vinaxo.net`** | **63/63 PASS** | **63/63 PASS** | 0 failures |

### Kiểm tra Endpoint Live bổ sung trên `https://www.vinaxo.net`
- `GET https://www.vinaxo.net/sitemap.xml`: HTTP `200`, 29 URL, `has vinaxo.vn: false`.
- `GET https://www.vinaxo.net/robots.txt`: HTTP `200`, chỉ định `Sitemap: https://www.vinaxo.net/sitemap.xml`.
- `POST https://www.vinaxo.net/api/inquiry` (`language: "ko"`, payload thiếu trường để kiểm tra phản hồi validation an toàn): HTTP `400 VALIDATION_ERROR` với đầy đủ thông báo tiếng Hàn (`"성함은 2자 이상 입력해 주세요."`, `"올바른 이메일 주소를 입력해 주세요."`, `"문의 목적을 선택하시고 상세 내용(5자 이상)을 입력해 주세요."`).

---

## 3. Hạng mục Chưa Hoàn tất / Giới hạn Kiểm thử (Báo cáo Trung thực)

| Mã / Hạng mục | Trạng thái | Nguyên nhân & Hành động tiếp theo |
|---|:---:|---|
| **`QA-17` — Xác nhận nhận email thực tế từ live `/api/inquiry` tại hộp thư `cuonghoang0710@gmail.com`** | **BLOCKED / CHƯA XÁC MINH LIVE** | Trước đó báo cáo `docs/VINAXO_CONTACT_FORM_TEST_REPORT.md` ghi nhận Vercel chưa cấu hình `RESEND_API_KEY` / `INQUIRY_WEBHOOK_URL` (`503 DELIVERY_NOT_CONFIGURED`). Trong đợt chạy live lần này, chúng tôi không gửi form hợp lệ để tránh spam hộp thư người nhận nếu biến môi trường đã/chưa bật và cũng không có quyền truy cập hộp thư `cuonghoang0710@gmail.com`. Cần quản trị viên kiểm tra biến `RESEND_API_KEY` trên Vercel và test 1 lượt gửi thật. |
| **Kiểm duyệt ngữ nghĩa bởi người bản ngữ (Native Korean & Simplified Chinese Review)** | **CHỜ DUYỆT BẢN NGỮ** | Toàn bộ nội dung `ko` và `zh-CN` đã vượt qua kiểm tra kỹ thuật, thuật ngữ B2B nhất quán và hiển thị UI; khuyến nghị người bản ngữ tiếng Hàn và tiếng Trung rà soát văn phong tiếp thị trước khi chạy quảng cáo địa phương. |
| **Safari (macOS/iOS), Firefox & Thiết bị di động vật lý (iPhone / Android thật)** | **NOT RUN** | Môi trường kiểm thử Windows chỉ chạy trực tiếp headless Chrome và Microsoft Edge qua giả lập kích thước viewport `320px`–`1920px`. |

---

## 4. Bằng chứng Ảnh chụp Màn hình Live (`docs/screenshots/multilingual/`)

Đã chụp tự động **32 ảnh** trực tiếp từ `https://www.vinaxo.net` trên Chrome (Desktop `1440×900` và Mobile `390×844` cho 4 trang `/`, `/products`, `/brochure`, `/contact` × 4 ngôn ngữ):
- `docs/screenshots/multilingual/vi/` (`desktop-*.png`, `mobile-*.png`)
- `docs/screenshots/multilingual/en/` (`desktop-*.png`, `mobile-*.png`)
- `docs/screenshots/multilingual/ko/` (`desktop-*.png`, `mobile-*.png`)
- `docs/screenshots/multilingual/zh-CN/` (`desktop-*.png`, `mobile-*.png`)
