# Báo Cáo Chuẩn Hóa Thuật Ngữ Thị Trường, Incoterms & Logistics Xuất Khẩu – VINAXO

- **Website Production**: `https://www.vinaxo.net`
- **Repository**: `lap2004/VINAOX` (`personal`) & `SONAI-TECHNOLOGY-COMPANY-LIMITED/VINAXO` (`origin`)
- **Production Branch**: `main`
- **Feature Commit**: `8a7b8ae` (`fix/market-logistics-terminology`)
- **Main Merge Commit**: `376c2a26073a992f4421b5fd4892074b20bf2790`
- **Production Bundle Verified Live**: `assets/index-DZwu-A3g.js`
- **Thời điểm hoàn tất kiểm thử Live**: `2026-11-27T02:07:49.871316+00:00`

---

## 1. Tóm Tắt Vấn Đề Trước Khi Sửa (Audit Baseline)

Qua rà soát toàn bộ mã nguồn (`src/`, `server/`, `content/`, `src/i18n/`), các lỗi thuộc phạm vi nhiệm vụ tập trung tại hai nhóm P2 và được xử lý đồng bộ cả UI, từ điển 4 ngôn ngữ (`vi`, `en`, `ko`, `zh-CN`) và luồng tiếp nhận báo giá B2B:

| Mã lỗi | Mô tả hiện trạng trước khi sửa | Vị trí phát hiện chính xác | Nguyên nhân gốc |
| :--- | :--- | :--- | :--- |
| **P2-01** | Ghép cặp sai bản chất nghiệp vụ `"FCL/CIF"` làm một lựa chọn báo giá tương đương | `src/pages/GlobalMarket.tsx:321-326` (`vi: 'Yêu Cầu Báo Giá FCL/CIF'`, `en: 'Request FCL/CIF Quotation'`, `ko: 'FCL/CIF 수출 견적 요청'`, `zh: '获取整柜 FCL / CIF 报价'`); đồng thời form `/contact` chưa tách riêng trường **Điều kiện thương mại (Incoterms)** và **Hình thức vận chuyển container** | Nhầm lẫn giữa **Incoterms** (`FOB` / `CIF` – điều kiện giao hàng & phân chia trách nhiệm/chi phí/rủi ro) với **Container Shipping Mode** (`FCL` / `LCL` – phương thức đóng hàng container) |
| **P2-02** | Sai chính tả thuật ngữ ngành in ấn/thiết kế bao bì: `"market nhãn mác"` | `src/i18n/vi.ts:495` (`"Thống nhất quy cách bao bì, market nhãn mác (nếu làm Private Label), thời hạn giao hàng và điều khoản thanh toán quốc tế (L/C, T/T)."`) | Viết sai chính tả tiếng Việt từ **"ma-két / mẫu thiết kế"** thành `"market"`; chưa có bảng thuật ngữ chuẩn 4 ngôn ngữ cho quy trình OEM/Private Label |

> **Kiểm tra dữ liệu CMS**: Quét toàn bộ `content/**/*.json` cho kết quả **0** chuỗi chứa `FCL/CIF` hoặc `market nhãn mác`. Không ghi đè bất kỳ tệp dữ liệu CMS nào.

---

## 2. Chi Tiết Thay Đổi Đã Triển Khai

### 2.1. Tách Nhóm Điều Kiện Thương Mại (Incoterms) & Hình Thức Vận Chuyển Container (P2-01)

1. **Trang Thị Trường (`src/pages/GlobalMarket.tsx`)**:
   - Bổ sung khối phân loại 2 nhóm cân đối ngay dưới `.logistics-bar`:
     - **Nhóm 1 · Điều kiện thương mại (Incoterms)**: `FOB` (Free On Board) / `CIF` (Cost, Insurance and Freight).
     - **Nhóm 2 · Hình thức vận chuyển container**: `FCL` (Full Container Load) / `LCL` (Less than Container Load).
   - Chuẩn hóa nút CTA chính ở cuối trang Thị trường qua 4 ngôn ngữ (xóa bỏ `"FCL/CIF"`):
     - **VI**: `"Nhận Báo Giá Theo Điều Kiện FOB/CIF"`
     - **EN**: `"Request Export Quote (FOB/CIF)"`
     - **KO**: `"FOB/CIF 조건 수출 견적 요청"`
     - **ZH-CN**: `"获取出口报价（FOB / CIF）"`

2. **Form Liên Hệ & Schema B2B (`src/components/contact/contactSchema.ts`, `src/pages/Contact.tsx`)**:
   - Xuất khẩu các kiểu dữ liệu chuẩn hóa:
     - `TradeTerm = 'FOB' | 'CIF' | 'CONSULT'`
     - `ShippingMode = 'FCL' | 'LCL' | 'CONSULT'`
   - Bổ sung 2 trường tùy chọn (`optional`) dạng lưới 2 cột trên trang Liên hệ (`#contactTradeTerm` và `#contactShippingMode`), giữ nguyên 3 trường bắt buộc thống nhất (`fullName`, `email`, `message`) và giữ nguyên form gọn của `QuoteModal`.

3. **Dịch vụ & Backend Serverless (`src/services/inquiryService.ts`, `server/inquiry.ts`, rebuild `api/contact.mjs` & `api/inquiry.mjs`)**:
   - Đưa riêng 2 mục `Trade Term (Incoterms)` và `Shipping Mode (Container)` vào email văn bản thuần, email HTML và payload webhook.
   - Bổ sung kiểm tra whitelist nghiêm ngặt ở phía server:
     - `ALLOWED_TRADE_TERMS = ['FOB', 'CIF', 'CONSULT']`
     - `ALLOWED_SHIPPING_MODES = ['FCL', 'LCL', 'CONSULT']`
   - Từ chối ngay với mã **HTTP `400 VALIDATION_ERROR`** nếu client gửi sai nhóm (ví dụ gán nhầm `tradeTerm: 'FCL'` hoặc `shippingMode: 'CIF'`).

### 2.2. Chuẩn Hóa Thuật Ngữ OEM/Bao Bì & Bộ Từ Điển 4 Ngôn Ngữ (P2-02)

- Sửa `src/i18n/vi.ts`: `"market nhãn mác"` $\rightarrow$ **`"mẫu thiết kế nhãn mác"`**.
- Đồng bộ `marketsPage.section3.step2Desc`, `marketsPage.section4.desc`, `marketsPage.section4.btnPrimary` và nhãn dropdown `contactPage.form` trong cả 4 tệp:
  - `src/i18n/vi.ts`
  - `src/i18n/en.ts` (`label design mockup`)
  - `src/i18n/ko.ts` (`라벨 디자인 시안`)
  - `src/i18n/zhCN.ts` (`标签设计样稿`)
- Cập nhật chuẩn thuật ngữ xuất khẩu vào **Mục 5** của [VINAXO_TRANSLATION_GLOSSARY.md](file:///e:/SONAI/VINAXO/docs/VINAXO_TRANSLATION_GLOSSARY.md).

### 2.3. Bảng Thuật Ngữ Chuẩn Hóa 4 Ngôn Ngữ (Trích Yếu)

| Khái niệm nghiệp vụ | Tiếng Việt (VI) | English (EN) | 한국어 (KO) | 简体中文 (ZH-CN) |
| :--- | :--- | :--- | :--- | :--- |
| Nhóm 1: Điều kiện thương mại (Incoterms) | `FOB` / `CIF` (Incoterms) | `FOB` / `CIF` (Incoterms) | `FOB` / `CIF` (인코텀즈) | `FOB` / `CIF`（国际贸易术语） |
| Nhóm 2: Hình thức vận chuyển container | `FCL` / `LCL` | `FCL` / `LCL` | `FCL` / `LCL` | `FCL` / `LCL` |
| Mẫu thiết kế nhãn mác (Private Label) | `mẫu thiết kế nhãn mác` | `label design mockup` | `라벨 디자인 시안` | `标签设计样稿` |
| CTA báo giá xuất khẩu | `Nhận Báo Giá Theo Điều Kiện FOB/CIF` | `Request Export Quote (FOB/CIF)` | `FOB/CIF 조건 수출 견적 요청` | `获取出口报价（FOB / CIF）` |

---

## 3. Ma Trận Kiểm Thử & Bàn Giao (MARKET-01 đến MARKET-20)

| Mã kiểm thử | Hạng mục kiểm tra | Phạm vi / Môi trường | Trạng thái | Ghi chú & Bằng chứng thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **MARKET-01** | Xóa bỏ hoàn toàn chuỗi `"FCL/CIF"` trên trang `/markets` (4 ngôn ngữ) | Repo + Live `https://www.vinaxo.net` | **PASS** | `node scripts/test-seo-and-inquiry.mjs` (10/10 PASS) & Playwright live 4 locale |
| **MARKET-02** | Xóa bỏ `"market nhãn mác"`, thay bằng `"mẫu thiết kế nhãn mác"` | `src/i18n/vi.ts` + Live `/markets` | **PASS** | Xác nhận trên DOM live VI & ảnh `after-markets-step2-vi.png` |
| **MARKET-03** | Tách rõ Nhóm 1 (`FOB`/`CIF`) & Nhóm 2 (`FCL`/`LCL`) trên `/markets` | Local `4173` + Live `vinaxo.net` | **PASS** | 2 card phân loại dưới `.logistics-bar`; `after-markets-logistics-vi.png` |
| **MARKET-04** | CTA cuối trang `/markets` hiển thị đúng cho `vi`, `en`, `ko`, `zh-CN` | Live `vinaxo.net` (Chrome + Edge) | **PASS** | `MARKET-TERMS-vi/en/ko/zh-CN` PASS trên cả Chrome & Edge |
| **MARKET-05** | Kiểm tra đa ngôn ngữ KO/ZH không vỡ chữ, không tràn khung | Live `vinaxo.net` | **PASS (kỹ thuật)** | `after-markets-ko.png`, `after-markets-zh-cn.png`; cần khách xác nhận văn phong bản ngữ |
| **MARKET-06** | Bảng thuật ngữ chuẩn hóa 4 ngôn ngữ trong tài liệu dự án | `docs/VINAXO_TRANSLATION_GLOSSARY.md` | **PASS** | Đã bổ sung Section 5 |
| **MARKET-07** | Tách 2 trường `tradeTerm` và `shippingMode` trên `/contact` | Live `vinaxo.net/contact` | **PASS** | `#contactTradeTerm` & `#contactShippingMode` hoạt động độc lập; `after-contact-trade-shipping-vi.png` |
| **MARKET-08** | Giữ nguyên 3 trường bắt buộc thống nhất (`fullName`, `email`, `message`) | `/contact` & `QuoteModal` | **PASS** | `tradeTerm` và `shippingMode` đều tùy chọn (`optional`) |
| **MARKET-09** | Xác thực `QuoteModal` không chứa cặp sai `FCL/CIF` | `src/components/ui/QuoteModal.tsx` | **PASS** | Chỉ có gợi ý `Cảng đích CIF/FOB` (cùng nhóm Incoterms) |
| **MARKET-10** | Quét toàn bộ `content/**/*.json` không có thuật ngữ sai | Repo (`content/`) | **PASS** | 0 kết quả khớp `FCL/CIF` hoặc `market nhãn mác` |
| **MARKET-11** | Backend `/api/contact` từ chối gán nhầm nhóm (`tradeTerm: 'FCL'`, `shippingMode: 'CIF'`) | Live `POST https://www.vinaxo.net/api/contact` | **PASS** | HTTP `400 VALIDATION_ERROR` (`x-vercel-id: hkg1::iad1::2xpth-1795745199734-23e7d576c25b`) |
| **MARKET-12** | Gửi email thật tới hộp thư doanh nghiệp kèm `tradeTerm`/`shippingMode` | Vercel Production Email Delivery | **BLOCKED (Production) / PASS (Mock Unit)** | Mocked Resend/Brevo trong Test 10 PASS (10/10); Live Vercel trả `503 DELIVERY_NOT_CONFIGURED` cho tới khi cấu hình `RESEND_API_KEY` / `BREVO_API_KEY` |
| **MARKET-13** | Kiểm tra i18n keys parity (607/607 keys × 4 ngôn ngữ) & TypeScript strict build | `npm run build` | **PASS** | `check:i18n`, `tsc -b`, `tsc -p tsconfig.server.json --noEmit`, `build-api.mjs`, `vite build`, SEO 29 URLs |
| **MARKET-14** | Hồi quy luồng Contact Form & Google Maps (`qa-contact-maps.py`) | Local `4173` + Live `vinaxo.net` | **PASS** | **8/8 PASS** (Chrome local & live) |
| **MARKET-15** | Responsive đa kích thước (320px đến 2560px) không tràn ngang | Chrome & Edge (`qa-market-terminology.py`) | **PASS (Chrome/Edge)** | `MARKET-RESPONSIVE-VIEWPORTS` PASS trên cả Chrome & Edge |
| **MARKET-16** | Kiểm thử trên Safari / Firefox / thiết bị di động vật lý | Safari, Firefox, Physical Mobile | **NOT RUN** | Chưa chạy trên thiết bị/trình duyệt ngoài Chromium |
| **MARKET-17** | Không phát sinh lỗi Console / PageError / Failed Asset trên `/markets` & `/contact` | Live Chrome + Edge | **PASS** | `MARKET-CONSOLE-CLEAN` PASS |
| **MARKET-18** | Hồi quy Admin CMS & Suite quản trị (`test-admin-suite.mjs`) | Local Node/TSX Suite | **PASS** | **19/19 PASS** |
| **MARKET-19** | Bảo toàn toàn bộ nội dung CMS JSON và nhận diện thương hiệu | Git diff & Live Render | **PASS** | Giữ nguyên layout, bảng màu, chứng nhận & dữ liệu CMS |
| **MARKET-20** | Xác minh Deploy Vercel Live phục vụ đúng bundle mới nhất | `https://www.vinaxo.net` | **PASS** | Live HTML tải `assets/index-DZwu-A3g.js` (`x-vercel-id: hkg1::bgqvr-1795745198964-f1962080621d`) |

---

## 4. Bằng Chứng Hình Ảnh BEFORE / AFTER

Tất cả ảnh chụp lưu tại `docs/screenshots/market-terminology/`:

### Trước khi sửa (BEFORE – chụp trực tiếp từ Production cũ)
- `before-markets-step2-vi.png` (108,309 bytes): Hiển thị lỗi `"market nhãn mác"` tại Bước 2.
- `before-markets-cta-vi.png` (221,561 bytes): Hiển thị nút `"Yêu Cầu Báo Giá FCL/CIF"`.

### Sau khi sửa (AFTER – chụp trực tiếp từ `https://www.vinaxo.net` sau deploy)
- `after-markets-step2-vi.png` (102,181 bytes): Đã sửa thành `"mẫu thiết kế nhãn mác"`.
- `after-markets-logistics-vi.png` (127,712 bytes): Khối 2 nhóm **Nhóm 1: Điều kiện thương mại (FOB/CIF)** và **Nhóm 2: Hình thức vận chuyển container (FCL/LCL)**.
- `after-markets-cta-vi.png` (232,743 bytes): Nút CTA chuẩn `"Nhận Báo Giá Theo Điều Kiện FOB/CIF"`.
- `after-markets-ko.png` (166,925 bytes): Giao diện `/markets` tiếng Hàn (`KO`).
- `after-markets-zh-cn.png` (191,947 bytes): Giao diện `/markets` tiếng Trung giản thể (`ZH-CN`).
- `after-contact-trade-shipping-vi.png` (170,887 bytes): Dropdown `#contactTradeTerm` và `#contactShippingMode` trên `/contact`.

---

## 5. Danh Sách Tệp Đã Tạo / Chỉnh Sửa

### Trong commit `8a7b8ae` (`fix/market-logistics-terminology` $\rightarrow$ `376c2a26073a992f4421b5fd4892074b20bf2790`)
- `src/pages/GlobalMarket.tsx`
- `src/i18n/vi.ts`, `src/i18n/en.ts`, `src/i18n/ko.ts`, `src/i18n/zhCN.ts`
- `src/components/contact/contactSchema.ts`
- `src/pages/Contact.tsx`
- `src/services/inquiryService.ts`
- `server/inquiry.ts`
- `api/contact.mjs`, `api/inquiry.mjs`
- `docs/VINAXO_TRANSLATION_GLOSSARY.md`
- `scripts/test-seo-and-inquiry.mjs`, `scripts/qa-market-terminology.py`
- `docs/screenshots/market-terminology/before-markets-step2-vi.png`, `before-markets-cta-vi.png`

### Bổ sung hậu kiểm live
- `docs/screenshots/market-terminology/after-*.png` (6 tệp ảnh AFTER live)
- `docs/VINAXO_MARKET_LOGISTICS_TERMINOLOGY_FIX_REPORT.md` (báo cáo này)

---

## 6. Các Điểm Cần Khách Hàng Xác Nhận & Điểm Chặn Còn Lại

1. **Cấu hình gửi email Production (`RESEND_API_KEY` / `BREVO_API_KEY`)**:
   - Hiện endpoint `POST https://www.vinaxo.net/api/contact` đã kiểm tra chặt `tradeTerm` / `shippingMode` (HTTP `400` khi gửi sai nhóm), nhưng việc chuyển thư thực tế vào hộp thư doanh nghiệp vẫn **BLOCKED** ở môi trường Production (`503 DELIVERY_NOT_CONFIGURED`) cho đến khi bổ sung `RESEND_API_KEY` hoặc `BREVO_API_KEY` trên Vercel Environment Variables.
2. **Xác nhận nghiệp vụ xuất khẩu hiện có trên `/contact`**:
   - Dropdown `inquiryType` (`src/pages/Contact.tsx:572` và 4 tệp `src/i18n/*`) hiện có mục `"Báo giá đơn hàng xuất khẩu container (FCL/LCL)"` (đúng cặp FCL/LCL, không còn FCL/CIF).
   - Mục thông tin giao nhận (`src/pages/Contact.tsx:378`) hiện liệt kê `"CIF, FOB, CFR cảng Cát Lái, Hiệp Phước, Cái Mép"`. Đề nghị VINAXO xác nhận lại xem có giữ điều kiện **CFR** và **LCL** theo đúng năng lực thương mại thực tế hay không.
3. **Rà soát ngữ nghĩa bản ngữ (`KO` / `ZH-CN`) & Kiểm thử trình duyệt khác**:
   - Đề nghị nhân sự/đối tác bản ngữ tiếng Hàn (`ko`) và tiếng Trung giản thể (`zh-CN`) rà soát lại văn phong thương mại xuất khẩu.
   - Safari, Firefox và thiết bị di động vật lý được ghi nhận là **NOT RUN** ngoài phạm vi Chromium (Chrome/Edge).
