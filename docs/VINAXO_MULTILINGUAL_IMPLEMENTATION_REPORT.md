# BÁO CÁO TRIỂN KHAI HỆ THỐNG ĐA NGÔN NGỮ (VI / EN / KO / ZH-CN) & CHUẨN HÓA TÊN DOANH NGHIỆP — VINAXO

- **Website Production**: `https://www.vinaxo.net` (commit gộp lên `main`: `e5bc74b`)
- **Phạm vi ngôn ngữ**: Tiếng Việt (`vi`), English (`en`), 한국어 (`ko`), 简体中文 (`zh-CN`)
- **Tài liệu từ điển thuật ngữ đi kèm**: `docs/VINAXO_TRANSLATION_GLOSSARY.md`

---

## 1. Xử lý P2-01 — Chuẩn hóa Tên Doanh nghiệp Toàn Website & CMS

- **Lỗi trước khi sửa**: Footer tiếng Anh và một số vị trí cấu hình/metadata hiển thị ghép lặp tên công ty dạng `"Vinaxo Co., Ltd. (VINAXO COMPANY LIMITED (Vinaxo Co., Ltd.))"`.
- **Tên pháp lý chuẩn hóa tập trung (`content/settings/company.json`, `src/data/company.ts`)**:
  - Tiếng Việt (`vi`): **`CÔNG TY TNHH VINAXO`**
  - Quốc tế (`en`, `ko`, `zh-CN`): **`VINAXO COMPANY LIMITED`** *(giữ nguyên tên pháp lý quốc tế theo hồ sơ doanh nghiệp, không tự ý dịch tên pháp nhân sang tiếng Hàn/Trung và không nối nhiều biến thể gây lặp)*
- **Bảo vệ ở tầng Validation Schema (`src/shared/schemas/settingsSchema.ts`)**:
  - Hàm `sanitizeEnglishCompanyName` tự động phát hiện và chuẩn hóa về `VINAXO COMPANY LIMITED` nếu dữ liệu đầu vào lặp `"VINAXO COMPANY LIMITED (...Vinaxo...)"`.
  - Đồng bộ mã số thuế mặc định `1201611681`, hotline `(+84) 984 815 016` và địa chỉ đa ngôn ngữ (`address_vi`, `address_en`, `address_ko`, `address_zh`) cùng đoạn giới thiệu doanh nghiệp (`intro_vi`, `intro_en`, `intro_ko`, `intro_zh`).
- **Phạm vi áp dụng đồng bộ**: `Header.tsx`, `Footer.tsx`, `MainLayout.tsx`, `Home.tsx`, `Contact.tsx`, `routeMetadata.ts`, `AdminSettings.tsx`, `company.json`, và JSON-LD structured data.

---

## 2. Xử lý P2-02 — Kiến trúc & Dữ liệu 4 Ngôn ngữ (`vi`, `en`, `ko`, `zh-CN`)

### 2.1. Lõi i18n & Kiểm tra Đầy đủ Khóa Dịch
- **`src/i18n/localize.ts`**: Định nghĩa kiểu `Language = 'vi' | 'en' | 'ko' | 'zh-CN'`, `SUPPORTED_LANGUAGES`, `normalizeLanguage()`, và `pickLocale()` với thứ tự fallback an toàn (`ko -> ko -> en -> vi`; `zh-CN -> zh-CN/zh -> en -> vi`).
- **Bộ từ điển chuẩn hóa**: `src/i18n/vi.ts`, `src/i18n/en.ts`, `src/i18n/ko.ts`, `src/i18n/zhCN.ts`.
- **`src/i18n/LanguageContext.tsx`**: Cung cấp `{ language, setLanguage, t, tRaw, pick, content }`, lưu trạng thái vào `localStorage('vinaxo_lang')`, hỗ trợ query `?lang=`, cập nhật `document.documentElement.lang`, và nạp động font chữ CJK (`Noto Sans KR`, `Noto Sans SC`) từ Google Fonts khi chuyển sang `ko` / `zh-CN` kết hợp fallback system CJK font stack trong `src/styles/variables.css`.
- **`scripts/check-i18n-completeness.mjs`** *(tích hợp vào đầu `npm run build`)*: Xác nhận **607/607 khóa** đầy đủ và không rỗng cho cả 4 ngôn ngữ (`vi`, `en`, `ko`, `zh-CN`).

### 2.2. Dữ liệu CMS & JSON Content (Giữ nguyên 100% dữ liệu VI/EN & ảnh hiện có)
- **12 Sản phẩm (`content/products/*.json` & `src/data/products.ts`)**:
  - Bổ sung đầy đủ `name_ko`, `name_zh`, `description_ko`, `description_zh`, `origin_ko`, `origin_zh`, thông số kỹ thuật (`PRODUCT_SPECS_I18N`), nhãn danh mục (`CATEGORY_LABELS`) và hàm `getProductLocalized()` / `getProductSpecsLocalized()`.
  - Bảo toàn nguyên vẹn thông số kỹ thuật xuất khẩu (`< 16%`, `50° - 55° Brix`, `25,000 m²`, `300 t/month`, `200 kg`, `12 Months`).
- **9 Bài viết Báo chí & Tin tức (`content/news/*.json`, `src/types/content.ts`, `src/data/news.ts`, `src/services/contentService.ts`)**:
  - Bổ sung `title_ko/zh`, `excerpt_ko/zh`, `body_ko/zh`, `cover_image_alt_ko/zh`, `badgeTextKo/Zh`, `dateKo/Zh`, `seo_title_ko/zh`, `seo_description_ko/zh`, `personQuoted.titleKo/Zh`, và chuẩn hóa `personQuoted.titleEn` sử dụng `VINAXO COMPANY LIMITED`.
  - `contentService.ts` bổ sung `formatNewsDate()`, `getNewsLocalized()`, `getArticleLocalized()`, `getPersonQuotedTitle()`.
- **Chứng nhận & Brochure (`content/settings/certificates.json`, `content/settings/brochure.json`, `src/data/brochureData.ts`)**:
  - Bổ sung `nameKo/Zh`, `kindKo/Zh`, `scopeKo/Zh` cho cả 6 hạng mục chứng nhận/đăng ký/kiểm toán (giữ nguyên phân loại `Registration` cho US FDA và `Audit` cho Sedex SMETA, không gộp sai thành `Certification`).
  - Hàm `resolveBrochureDocumentForLang(lang)` và trang `src/pages/Brochure.tsx` hiển thị thông báo rõ ràng bằng ngôn ngữ đang chọn khi dùng bản PDF chính thức `/brochures/vinaxo-company-brochure-2026.pdf` (tiếng Anh 2026), không tự bịa PDF giả cho `vi`/`ko`/`zh-CN`.

### 2.3. Toàn bộ Giao diện Public, Form B2B & Admin CMS
- **Giao diện Public**: Nâng cấp toàn bộ pages (`Home`, `About`, `Products`, `Quality`, `GlobalMarket`, `PressMedia`, `ArticleDetail`, `Brochure`, `Contact`, `NotFound`) và components (`Header`, `Footer`, `MainLayout`, `ProductCard`, `ProductDetailModal`, `ProductFilter`, `NewsCard`, `NewsFilter`, `ContactForm`, `QuoteModal`, `CertificatePreviewModal`, `WorldMapSvg`) sang 4 ngôn ngữ. Language switcher trên Header (`VI`, `EN`, `KO`, `ZH`) chuyển ngôn ngữ tức thì trong SPA không tải lại trang.
- **Form & API B2B (`src/services/inquiryService.ts`, `server/inquiry.ts` -> `api/inquiry.mjs`)**: Hỗ trợ `language: 'vi' | 'en' | 'ko' | 'zh-CN'` với thông báo validation đa ngôn ngữ ở cả client và server.
- **Admin CMS (giữ giao diện quản trị tiếng Việt, mở rộng chỉnh sửa & bảo toàn 4 ngôn ngữ)**:
  - `src/admin/pages/AdminNewsEditor.tsx`: Bổ sung tab soạn thảo `🇰🇷 한국어` và `🇨🇳 简体中文` kèm chấm trạng thái hoàn thiện, alt ảnh và trường SEO KO/ZH-CN.
  - `src/admin/pages/AdminProducts.tsx` & `server/admin/products.ts`: Bổ sung trường nhập & chuẩn hóa `name_ko`, `name_zh`, `description_ko`, `description_zh`, `origin_ko`, `origin_zh`.
  - `src/admin/pages/AdminCertificates.tsx` & `server/admin/certificates.ts`: Bổ sung `nameKo`, `nameZh`, `scopeKo`, `scopeZh` và tự đồng bộ `kindKo`/`kindZh`.
  - `src/admin/pages/AdminSettings.tsx`: Bỏ hậu tố lặp `(Vinaxo Co., Ltd.)`, thêm trường địa chỉ và tiêu đề Brochure cho `ko` / `zh-CN`.
  - `newsSchema.ts` (`mergeNewsArticle`) và `productSchema.ts` (`mergeProduct`): Bảo toàn nguyên vẹn dữ liệu `ko`/`zh` khi quản trị viên chỉ sửa từng phần nội dung `vi` hoặc `en`.

---

## 3. Lưu ý Vận hành & Rà soát Nhân sự Bản ngữ
- **Trạng thái rà soát ngôn ngữ KO & ZH-CN**: Toàn bộ thuật ngữ kỹ thuật, tên sản phẩm, tên chứng nhận và tên pháp lý đã được đối chiếu nhất quán theo `docs/VINAXO_TRANSLATION_GLOSSARY.md` và vượt qua các kiểm tra kỹ thuật tự động. Tuy nhiên, phần văn phong bản địa hóa tiếng Hàn (`ko`) và tiếng Trung giản thể (`zh-CN`) **đang chờ nhân sự bản ngữ chuyên ngành thực phẩm/xuất khẩu rà soát và ký duyệt lần cuối** trước chiến dịch quảng bá tại thị trường Hàn Quốc / Trung Quốc.
