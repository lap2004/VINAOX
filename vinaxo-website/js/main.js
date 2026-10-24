/**
 * VINAXO Premium Corporate Website - Main Application Script
 * Vanilla JavaScript (ES6+), Zero External Libraries
 */

import { siteContent, productsData, newsData } from './content.js';

class VinaxoApp {
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'vi' || urlLang === 'en') {
      this.currentLang = urlLang;
      localStorage.setItem('vinaxo_lang', urlLang);
    } else {
      this.currentLang = localStorage.getItem('vinaxo_lang') || 'vi';
    }
    this.init();
  }

  init() {
    this.activeNewsCategory = 'all';
    this.activeProductCategory = 'all';

    // 1. Language System
    this.setupLanguage();

    // 2. Navigation & Sticky Header (Multi-Page aware)
    this.setupNavigation();

    // 3. Filtering Tabs (News & Products)
    this.setupNewsFilter();
    this.setupProductFilter();

    // 4. Render Dynamic Content
    this.renderProducts();
    this.renderNews();

    // 5. Modal & Interactive Forms
    this.setupModals();
    this.setupPageContactForm();

    // 6. Scroll Animations & Back to Top
    this.setupScrollInteractions();

    console.log(
      '%c VINAXO Corporate Website %c Multi-Page Architecture Active ',
      'background: #174D32; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
      'background: #E8F0E8; color: #174D32; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );
  }

  /* --------------------------------------------------------------------------
     1. LANGUAGE CONTROLLER
     -------------------------------------------------------------------------- */
  setupLanguage() {
    this.langSelector = document.getElementById('langSelector');
    this.langBtn = document.getElementById('langBtn');
    this.langCurrentText = document.getElementById('langCurrentText');
    this.langOptions = document.querySelectorAll('.lang-option');

    // Toggle dropdown (Mobile tap & keyboard accessible)
    if (this.langBtn) {
      this.langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = this.langSelector.classList.toggle('is-open');
        this.langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.langSelector && !this.langSelector.contains(e.target)) {
        this.langSelector.classList.remove('is-open');
        if (this.langBtn) this.langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.langSelector && this.langSelector.classList.contains('is-open')) {
        this.langSelector.classList.remove('is-open');
        if (this.langBtn) {
          this.langBtn.setAttribute('aria-expanded', 'false');
          this.langBtn.focus();
        }
      }
    });

    // Option click
    this.langOptions.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = opt.getAttribute('data-lang');
        this.setLanguage(selectedLang);
        this.langSelector.classList.remove('is-open');
        if (this.langBtn) this.langBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Apply initial language
    this.applyLanguageContent();
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'vi') return;
    this.currentLang = lang;
    localStorage.setItem('vinaxo_lang', lang);
    this.applyLanguageContent();
    this.renderProducts();
    this.renderNews();
    this.updateNewsFilterLabels();
    this.updateProductFilterLabels();
    this.updateContactSelectOptions();
    this.updateMapSvgLabels();
  }

  applyLanguageContent() {
    const data = siteContent[this.currentLang];
    if (!data) return;

    document.documentElement.lang = this.currentLang;

    // Update active state in dropdown
    if (this.langCurrentText) {
      this.langCurrentText.textContent = this.currentLang.toUpperCase();
    }
    this.langOptions.forEach((opt) => {
      if (opt.getAttribute('data-lang') === this.currentLang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // Page metadata
    if (data.meta) {
      const currentPath = window.location.pathname.toLowerCase();
      let pageTitle = data.meta.title;
      let pageDesc = data.meta.description;

      if (currentPath.includes('about.html')) {
        pageTitle = this.currentLang === 'vi' ? 'Về VINAXO | Hồ Sơ Doanh Nghiệp & Lãnh Đạo' : 'About VINAXO | Company Profile & Leadership';
      } else if (currentPath.includes('products.html')) {
        pageTitle = this.currentLang === 'vi' ? 'Sản Phẩm | Trái Cây Sấy Tự Nhiên VINAXO' : 'Products | VINAXO Tropical Dried Fruits';
      } else if (currentPath.includes('quality.html')) {
        pageTitle = this.currentLang === 'vi' ? 'Chất Lượng & Sản Xuất | Tiêu Chuẩn BRCGS & OCOP VINAXO' : 'Quality & Manufacturing | BRCGS & OCOP Standards VINAXO';
      } else if (currentPath.includes('markets.html')) {
        pageTitle = this.currentLang === 'vi' ? 'Thị Trường Toàn Cầu | Xuất Khẩu Mỹ & Châu Âu VINAXO' : 'Global Markets | US & European Export VINAXO';
      } else if (currentPath.includes('news.html')) {
        pageTitle = this.currentLang === 'vi' ? 'Báo Chí & Tin Tức | Hoạt Động Doanh Nghiệp VINAXO' : 'Press & Media | Corporate News VINAXO';
      } else if (currentPath.includes('contact.html')) {
        pageTitle = this.currentLang === 'vi' ? 'Liên Hệ & Báo Giá B2B | Công Ty TNHH VINAXO' : 'Contact Us & B2B Quotes | VINAXO Company Limited';
      }

      document.title = pageTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', pageDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageDesc);
    }

    // Update text nodes with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const keyPath = el.getAttribute('data-i18n');
      const val = this.resolvePath(data, keyPath);
      if (val !== undefined && val !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else if (el.tagName === 'OPTION') {
          el.textContent = val;
        } else {
          el.innerHTML = keyPath === 'footer.rights' ? val.replace('2026', new Date().getFullYear()) : val;
        }
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const val = this.resolvePath(data, el.getAttribute('data-i18n-placeholder'));
      if (val) el.placeholder = val;
    });

    // Update titles and aria-labels
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const val = this.resolvePath(data, el.getAttribute('data-i18n-title'));
      if (val) el.title = val;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const val = this.resolvePath(data, el.getAttribute('data-i18n-aria-label'));
      if (val) el.setAttribute('aria-label', val);
    });

    // Update modal select options
    const productSelect = document.getElementById('modalProductSelect');
    if (productSelect && data.modal && data.modal.productOptions) {
      const selectedIndex = productSelect.selectedIndex >= 0 ? productSelect.selectedIndex : 0;
      productSelect.innerHTML = '';
      data.modal.productOptions.forEach((optText, index) => {
        const option = document.createElement('option');
        option.value = index === 0 ? '' : optText;
        option.textContent = optText;
        if (index === 0) option.disabled = true;
        productSelect.appendChild(option);
      });
      productSelect.selectedIndex = selectedIndex;
    }

    // Update dynamic subpage components
    this.updateProductFilterLabels();
    this.updateContactSelectOptions();
    this.updateMapSvgLabels();
  }

  updateMapSvgLabels() {
    const data = siteContent[this.currentLang];
    if (!data || !data.mapLabels) return;

    const maps = document.querySelectorAll('.world-map-svg');
    maps.forEach((svg) => {
      const usaText = svg.querySelector('.node-us text, .node-usa text');
      const euText = svg.querySelector('.node-eu text');
      const russiaText = svg.querySelector('.node-russia text');
      const koreaText = svg.querySelector('.node-korea text');
      const vnText = svg.querySelector('.node-vietnam text');

      if (usaText && data.mapLabels.usa) usaText.textContent = data.mapLabels.usa;
      if (euText && data.mapLabels.eu) euText.textContent = data.mapLabels.eu;
      if (russiaText && data.mapLabels.russia) russiaText.textContent = data.mapLabels.russia;
      if (koreaText && data.mapLabels.korea) koreaText.textContent = data.mapLabels.korea;
      if (vnText && data.mapLabels.vietnam) vnText.textContent = data.mapLabels.vietnam;
    });
  }

  updateProductFilterLabels() {
    const data = siteContent[this.currentLang];
    if (!data || !data.productFilterTabs) return;

    const filterContainer = document.getElementById('productFilterTabs');
    if (!filterContainer) return;

    const pills = filterContainer.querySelectorAll('.product-cat-pill');
    pills.forEach((pill) => {
      const cat = pill.getAttribute('data-category');
      if (cat && data.productFilterTabs[cat]) {
        pill.textContent = data.productFilterTabs[cat];
      }
    });
  }

  updateContactSelectOptions() {
    const data = siteContent[this.currentLang];
    if (!data || !data.contactPage || !data.contactPage.selectOptions) return;

    const inquirySelect = document.getElementById('contactInquiryType');
    if (inquirySelect && data.contactPage.selectOptions.inquiryTypes) {
      const selectedIndex = inquirySelect.selectedIndex >= 0 ? inquirySelect.selectedIndex : 0;
      inquirySelect.innerHTML = '';
      data.contactPage.selectOptions.inquiryTypes.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.label;
        if (index === 0) {
          option.disabled = true;
          if (selectedIndex === 0) option.selected = true;
        }
        inquirySelect.appendChild(option);
      });
      if (selectedIndex < inquirySelect.options.length) {
        inquirySelect.selectedIndex = selectedIndex;
      }
    }

    const productSelect = document.getElementById('contactProduct');
    if (productSelect && data.contactPage.selectOptions.products) {
      const selectedIndex = productSelect.selectedIndex >= 0 ? productSelect.selectedIndex : 0;
      productSelect.innerHTML = '';
      data.contactPage.selectOptions.products.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.label;
        productSelect.appendChild(option);
      });
      if (selectedIndex < productSelect.options.length) {
        productSelect.selectedIndex = selectedIndex;
      }
    }
  }

  resolvePath(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  /* --------------------------------------------------------------------------
     2. NAVIGATION & STICKY HEADER (MULTI-PAGE SYSTEM)
     -------------------------------------------------------------------------- */
  setupNavigation() {
    const header = document.getElementById('siteHeader');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');

    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });

    // Determine current page from pathname
    const path = window.location.pathname.toLowerCase();
    let currentFile = 'index.html';
    if (path.includes('about.html')) currentFile = 'about.html';
    else if (path.includes('products.html')) currentFile = 'products.html';
    else if (path.includes('quality.html')) currentFile = 'quality.html';
    else if (path.includes('markets.html')) currentFile = 'markets.html';
    else if (path.includes('news.html')) currentFile = 'news.html';
    else if (path.includes('contact.html')) currentFile = 'contact.html';
    else currentFile = 'index.html';

    // Highlight active link across desktop and mobile nav
    navLinks.forEach((link) => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (
        (currentFile === 'index.html' && (href === 'index.html' || href === '/' || href === './' || href === '#home')) ||
        (currentFile !== 'index.html' && href.includes(currentFile))
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile nav toggle
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('is-open');
        header.classList.toggle('drawer-open', isOpen);
        mobileToggle.classList.toggle('is-active', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close mobile nav when clicking a nav link
      mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('is-open');
          header.classList.remove('drawer-open');
          mobileToggle.classList.remove('is-active');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Smooth scroll ONLY for pure anchor links on the current page
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const topPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: topPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. PRODUCT CATEGORY FILTER (FOR PRODUCTS.HTML)
     -------------------------------------------------------------------------- */
  setupProductFilter() {
    const filterContainer = document.getElementById('productFilterTabs');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-cat-pill');
      if (!btn) return;

      const category = btn.getAttribute('data-category') || 'all';
      this.activeProductCategory = category;

      filterContainer.querySelectorAll('.product-cat-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      this.renderProducts();
    });
  }

  /* --------------------------------------------------------------------------
     4. NEWS FILTER SYSTEM
     -------------------------------------------------------------------------- */
  setupNewsFilter() {
    const filterContainer = document.getElementById('newsFilterTabs');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.news-filter-btn');
      if (!btn) return;

      const category = btn.getAttribute('data-category') || 'all';
      this.activeNewsCategory = category;

      filterContainer.querySelectorAll('.news-filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      this.renderNews();
    });

    this.updateNewsFilterLabels();
  }

  updateNewsFilterLabels() {
    const data = siteContent[this.currentLang];
    if (!data || !data.newsSection) return;

    const btnAll = document.querySelector('.news-filter-btn[data-category="all"]');
    const btnPress = document.querySelector('.news-filter-btn[data-category="press"]');
    const btnCompany = document.querySelector('.news-filter-btn[data-category="company"]');

    if (btnAll) btnAll.textContent = data.newsSection.filterAll;
    if (btnPress) btnPress.textContent = data.newsSection.filterPress;
    if (btnCompany) btnCompany.textContent = data.newsSection.filterCompany;
  }

  /* --------------------------------------------------------------------------
     5. DYNAMIC PRODUCT CARDS RENDERING (COMPACT & FULL)
     -------------------------------------------------------------------------- */
  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const path = window.location.pathname.toLowerCase();
    const isProductsPage = path.includes('products.html') || document.body.classList.contains('page-products');

    let filtered = productsData;
    if (isProductsPage && this.activeProductCategory && this.activeProductCategory !== 'all') {
      if (this.activeProductCategory === 'ocop') {
        filtered = productsData.filter((p) => p.ocop && p.ocop.includes('OCOP'));
      } else {
        filtered = productsData.filter((p) => p.category === this.activeProductCategory);
      }
    }

    filtered.forEach((product) => {
      const localized = product[this.currentLang] || product.en;
      const card = document.createElement('div');
      card.className = 'product-card reveal-on-scroll is-revealed';
      card.setAttribute('data-product-id', product.id);

      const ocopText = this.currentLang === 'vi' ? 'OCOP 3 Sao' : '3-Star OCOP';
      const ocopBadge = product.ocop
        ? `<span class="product-ocop-badge"><svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${ocopText}</span>`
        : '';

      let specsHtml = '';
      if (isProductsPage && product.specs) {
        const shelfLife = this.currentLang === 'vi' ? product.specs.shelfLifeVi : product.specs.shelfLifeEn;
        const packaging = this.currentLang === 'vi' ? product.specs.packagingVi : product.specs.packagingEn;
        specsHtml = `
          <div class="product-specs-box" style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #E2E8E4;">
            <div class="product-spec-row">
              <span class="product-spec-label">${this.currentLang === 'vi' ? 'Độ ẩm:' : 'Moisture:'}</span>
              <span class="product-spec-val">${product.specs.moisture}</span>
            </div>
            <div class="product-spec-row">
              <span class="product-spec-label">${this.currentLang === 'vi' ? 'Hạn sử dụng:' : 'Shelf Life:'}</span>
              <span class="product-spec-val">${shelfLife}</span>
            </div>
            <div class="product-spec-row">
              <span class="product-spec-label">${this.currentLang === 'vi' ? 'Quy cách:' : 'Packaging:'}</span>
              <span class="product-spec-val">${packaging}</span>
            </div>
          </div>
        `;
      }

      const viewDetailsText = this.currentLang === 'vi' ? 'Xem thông số B2B' : 'View Specifications';

      card.innerHTML = `
        <div class="product-top">
          <div class="product-image-box">
            <picture>
              <source srcset="${product.imageWebp}" type="image/webp">
              <img src="${product.imageJpg}" alt="${localized.name} - VINAXO Vietnam" loading="lazy">
            </picture>
          </div>
          <div class="product-info">
            ${ocopBadge}
            <h3 class="product-name">${localized.name}</h3>
            <p class="product-desc">${localized.desc}</p>
            ${specsHtml}
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 12px; border-top: 1px solid #EEF2EE;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--forest-green); letter-spacing: 0.04em; text-transform: uppercase;">${viewDetailsText}</span>
          <button class="product-arrow-btn" aria-label="${viewDetailsText} - ${localized.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      `;

      // Open B2B Product Detail Modal on card click
      card.addEventListener('click', () => {
        this.openProductDetail(product.id);
      });

      grid.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     6. DYNAMIC NEWS & PRESS CARDS RENDERING (VERIFIED)
     -------------------------------------------------------------------------- */
  renderNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const path = window.location.pathname.toLowerCase();
    const isNewsPage = path.includes('news.html') || document.body.classList.contains('page-news');

    let filtered = this.activeNewsCategory === 'all'
      ? newsData
      : newsData.filter((item) => item.category === this.activeNewsCategory);

    // If on homepage (compact view), show only top 3 featured news
    if (!isNewsPage) {
      filtered = filtered.slice(0, 3);
    }

    filtered.forEach((article) => {
      const localized = article[this.currentLang] || article.en;
      const dateText = this.currentLang === 'vi' ? article.dateVi : article.dateEn;
      const badgeText = this.currentLang === 'vi' ? (article.badgeTextVi || 'Báo chí') : (article.badgeTextEn || 'Press');
      const badgeTypeClass = article.badgeType ? `badge-${article.badgeType}` : 'badge-quote';

      const card = document.createElement('article');
      card.className = 'news-card reveal-on-scroll is-revealed';

      // Secondary multi-sources if available
      let secondaryLinksHtml = '';
      if (article.secondaryUrls && article.secondaryUrls.length > 0) {
        const linkItems = article.secondaryUrls
          .map((s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`)
          .join(' • ');
        secondaryLinksHtml = `
          <div class="news-multi-sources">
            <span>${this.currentLang === 'vi' ? 'Nguồn khác:' : 'Also on:'}</span>
            ${linkItems}
          </div>
        `;
      }

      // Speaker quote block if quoted
      let speakerHtml = '';
      if (article.personQuoted) {
        const titleQuoted = this.currentLang === 'vi' ? article.personQuoted.titleVi : article.personQuoted.titleEn;
        speakerHtml = `
          <div class="news-speaker">
            <strong>${article.personQuoted.name}</strong> — <span>${titleQuoted}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="news-image-box">
            <picture>
              <source srcset="${article.imageWebp}" type="image/webp">
              <img src="${article.imageJpg}" alt="${localized.title}" loading="lazy">
            </picture>
          </div>
          <div class="news-header-meta" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <span class="news-source-tag">${localized.sourceBadge || article.source}</span>
              <span class="news-type-badge ${badgeTypeClass}">${badgeText}</span>
            </div>
            <span class="news-date">${dateText}</span>
          </div>
          <h3 class="news-title">${localized.title}</h3>
          <p class="news-summary">${localized.summary}</p>
          ${speakerHtml}
          ${secondaryLinksHtml}
        </div>
        <div class="news-footer">
          <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="news-read-btn">
            <span>${localized.readMore}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          <span class="verified-stamp-pill" title="Verified against primary publication record">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            ${this.currentLang === 'vi' ? 'Đã kiểm chứng' : 'Verified'}
          </span>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     7. CONTACT FORM HANDLER (PAGE-SPECIFIC CONTACT.HTML)
     -------------------------------------------------------------------------- */
  setupPageContactForm() {
    const form = document.getElementById('pageContactForm');
    const feedback = document.getElementById('pageFormFeedback');
    if (!form) return;

    // Check URL parameters & hash for pre-selection
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const hash = window.location.hash;

    const inquiryTypeSelect = form.querySelector('[name="inquiryType"]');
    const productSelect = form.querySelector('[name="product"]');

    if (hash === '#quote-form' || productParam) {
      if (inquiryTypeSelect) {
        // Select "Báo giá đơn hàng xuất khẩu container"
        for (let i = 0; i < inquiryTypeSelect.options.length; i++) {
          if (inquiryTypeSelect.options[i].value.includes('Báo giá') || inquiryTypeSelect.options[i].value.includes('Quote')) {
            inquiryTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    if (productParam && productSelect) {
      const paramLower = productParam.toLowerCase();
      for (let i = 0; i < productSelect.options.length; i++) {
        const optVal = productSelect.options[i].value.toLowerCase();
        if (paramLower.includes('mango') && optVal.includes('mango')) {
          productSelect.selectedIndex = i;
          break;
        } else if (paramLower.includes('jackfruit') && optVal.includes('jackfruit')) {
          productSelect.selectedIndex = i;
          break;
        } else if (paramLower.includes('dragon') && optVal.includes('dragon')) {
          productSelect.selectedIndex = i;
          break;
        } else if (paramLower.includes('pineapple') && optVal.includes('pineapple')) {
          productSelect.selectedIndex = i;
          break;
        } else if (paramLower.includes('bar') && optVal.includes('bar')) {
          productSelect.selectedIndex = i;
          break;
        }
      }
    }

    // Smooth scroll to #quote-form if hash present
    if (hash === '#quote-form') {
      setTimeout(() => {
        const quoteSection = document.getElementById('quote-form');
        if (quoteSection) {
          quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const companyInput = form.querySelector('[name="company"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const inquiryTypeInput = form.querySelector('[name="inquiryType"]');
      const productInput = form.querySelector('[name="product"]');
      const msgInput = form.querySelector('[name="message"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const company = companyInput ? companyInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const inquiryType = inquiryTypeInput ? inquiryTypeInput.value.trim() : '';
      const product = productInput ? productInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Reset previous error classes
      [nameInput, emailInput, inquiryTypeInput, msgInput].forEach((el) => {
        if (el) el.classList.remove('has-error');
      });

      // Validation
      if (!name || name.length < 2) {
        if (nameInput) nameInput.classList.add('has-error');
        this.showContactFeedback(feedback, false, 
          this.currentLang === 'vi' ? 'Vui lòng nhập họ và tên của bạn.' : 'Please enter your full name.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!email || !emailRegex.test(email)) {
        if (emailInput) emailInput.classList.add('has-error');
        this.showContactFeedback(feedback, false, 
          this.currentLang === 'vi' ? 'Vui lòng nhập địa chỉ email doanh nghiệp hợp lệ.' : 'Please enter a valid corporate email address.');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!inquiryType) {
        if (inquiryTypeInput) inquiryTypeInput.classList.add('has-error');
        this.showContactFeedback(feedback, false, 
          this.currentLang === 'vi' ? 'Vui lòng chọn loại yêu cầu / mục đích liên hệ.' : 'Please select an inquiry type.');
        if (inquiryTypeInput) inquiryTypeInput.focus();
        return;
      }

      if (!message || message.length < 10) {
        if (msgInput) msgInput.classList.add('has-error');
        this.showContactFeedback(feedback, false, 
          this.currentLang === 'vi' ? 'Nội dung yêu cầu cần tối thiểu 10 ký tự.' : 'Message must contain at least 10 characters.');
        if (msgInput) msgInput.focus();
        return;
      }

      // Transparent direct contact integration (since no backend email server is configured)
      const mailSubject = encodeURIComponent(
        this.currentLang === 'vi'
          ? `[VINAXO B2B] ${inquiryType} - ${company || name}`
          : `[VINAXO B2B Trade] ${inquiryType} - ${company || name}`
      );
      const mailBody = encodeURIComponent(
        this.currentLang === 'vi'
          ? `Kính gửi Bộ phận Kinh doanh & Xuất nhập khẩu VINAXO,\n\nHọ và tên: ${name}\nDoanh nghiệp: ${company || 'Không có'}\nEmail: ${email}\nSố điện thoại: ${phone || 'Không có'}\nLoại yêu cầu: ${inquiryType}\nSản phẩm quan tâm: ${product || 'Tất cả'}\n\nNội dung chi tiết:\n${message}\n\n---\nGửi qua Cổng thông tin doanh nghiệp VINAXO (https://vinaxo.net)`
          : `Dear VINAXO Sales & Export Department,\n\nFull Name: ${name}\nCompany: ${company || 'N/A'}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nInquiry Type: ${inquiryType}\nProduct of Interest: ${product || 'All Products'}\n\nDetailed Requirements:\n${message}\n\n---\nSent via VINAXO Corporate Portal (https://vinaxo.net)`
      );
      const mailtoUrl = `mailto:thaovinaxo@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      // Open user's email client with prefilled content
      window.location.href = mailtoUrl;

      // Clear, transparent feedback status
      this.showContactFeedback(
        feedback, 
        true,
        this.currentLang === 'vi'
          ? `✓ Thông tin hợp lệ! Trình gửi thư của bạn đã được mở để gửi trực tiếp tới <strong>thaovinaxo@gmail.com</strong>. Quý đối tác cũng có thể gọi trực tiếp Hotline B2B: <strong>0907 494 177</strong> để nhận báo giá nhanh nhất.`
          : `✓ Validated! Your email client has been opened to send directly to <strong>thaovinaxo@gmail.com</strong>. You may also contact our trade team directly at <strong>+84 907 494 177</strong>.`
      );
    });
  }

  showContactFeedback(feedbackEl, isSuccess, message) {
    if (!feedbackEl) return;
    feedbackEl.style.display = 'block';
    feedbackEl.style.padding = '14px 18px';
    feedbackEl.style.borderRadius = '8px';
    feedbackEl.style.marginTop = '16px';
    feedbackEl.style.fontSize = '0.875rem';
    feedbackEl.style.lineHeight = '1.6';
    if (isSuccess) {
      feedbackEl.style.backgroundColor = '#ECFDF5';
      feedbackEl.style.border = '1px solid #A7F3D0';
      feedbackEl.style.color = '#065F46';
    } else {
      feedbackEl.style.backgroundColor = '#FEF2F2';
      feedbackEl.style.border = '1px solid #FECACA';
      feedbackEl.style.color = '#991B1B';
    }
    feedbackEl.innerHTML = message;
  }

  /* --------------------------------------------------------------------------
     5. MODAL & INTERACTIVE SPECIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  setupModals() {
    // Initialize Product Detail Modal container
    this.ensureProductDetailModal();

    // Check URL parameters for direct product specification link (e.g., products.html?product=dried-mango)
    const urlParams = new URLSearchParams(window.location.search);
    const directProduct = urlParams.get('product');
    if (directProduct && window.location.pathname.includes('products.html')) {
      const match = productsData.find((p) => p.id === directProduct || p.slug === directProduct);
      if (match) {
        setTimeout(() => this.openProductDetail(match), 300);
      }
    }
  }

  /* --------------------------------------------------------------------------
     B2B PRODUCT SPECIFICATION MODAL HANDLERS
     -------------------------------------------------------------------------- */
  ensureProductDetailModal() {
    if (!document.getElementById('productDetailModal')) {
      const modalEl = document.createElement('div');
      modalEl.className = 'product-detail-modal-overlay';
      modalEl.id = 'productDetailModal';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-labelledby', 'productDetailTitle');
      modalEl.innerHTML = `
        <div class="product-detail-card">
          <button class="product-detail-close-btn" id="productDetailCloseBtn" aria-label="Close product modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div id="productDetailContent"></div>
        </div>
      `;
      document.body.appendChild(modalEl);

      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
          this.closeProductDetail();
        }
      });

      const closeBtn = modalEl.querySelector('#productDetailCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeProductDetail();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalEl.classList.contains('is-active')) {
          this.closeProductDetail();
        }
      });
    }
  }

  openProductDetail(productId) {
    const product = productsData.find((p) => p.id === productId || p.slug === productId);
    if (!product) return;

    this.ensureProductDetailModal();
    const modal = document.getElementById('productDetailModal');
    const content = document.getElementById('productDetailContent');
    if (!modal || !content) return;

    const localized = product[this.currentLang] || product.en;
    const specs = product.specs || {};
    const shelfLife = this.currentLang === 'vi' ? specs.shelfLifeVi : specs.shelfLifeEn;
    const packaging = this.currentLang === 'vi' ? specs.packagingVi : specs.packagingEn;
    const storage = this.currentLang === 'vi' ? specs.storageVi : specs.storageEn;
    const ingredients = this.currentLang === 'vi' ? specs.ingredientsVi : specs.ingredientsEn;
    const process = this.currentLang === 'vi' ? specs.processVi : specs.processEn;
    const certs = this.currentLang === 'vi' ? specs.certificationsVi : specs.certificationsEn;
    const labels = (siteContent[this.currentLang].modal && siteContent[this.currentLang].modal.productDetail) || {};

    const ocopText = this.currentLang === 'vi' ? 'OCOP 3 Sao' : '3-Star OCOP';
    const ocopBadge = product.ocop
      ? `<span class="product-ocop-badge"><svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>${ocopText}</span>`
      : '';

    content.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-detail-media">
          <picture>
            <source srcset="${product.imageWebp}" type="image/webp">
            <img src="${product.imageJpg}" alt="${localized.name} - VINAXO Vietnam" loading="lazy">
          </picture>
          <div class="product-detail-badge-row">
            ${ocopBadge}
            <span class="verified-stamp-pill" style="font-size: 0.6875rem;">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              ${this.currentLang === 'vi' ? 'Chuẩn BRCGS Facility' : 'BRCGS Facility Benchmark'}
            </span>
          </div>
        </div>
        <div class="product-detail-info">
          <span class="product-detail-tag">${labels.specSheetTitle || 'B2B Technical Specifications'}</span>
          <h2 class="product-detail-name" id="productDetailTitle">${localized.name}</h2>
          <p class="product-detail-desc">${localized.desc} ${localized.features}</p>
          
          <table class="product-spec-table">
            <tbody>
              <tr>
                <th>${labels.originLabel || 'Vùng nguyên liệu:'}</th>
                <td>${localized.origin}</td>
              </tr>
              <tr>
                <th>${labels.ingredientsLabel || 'Thành phần:'}</th>
                <td>${ingredients || (this.currentLang === 'vi' ? '100% Trái cây tươi tự nhiên' : '100% Natural Fresh Fruit')}</td>
              </tr>
              <tr>
                <th>${labels.processLabel || 'Phương pháp chế biến:'}</th>
                <td>${process || (this.currentLang === 'vi' ? 'Sấy dẻo nhiệt thấp tuần hoàn' : 'Low-temperature convective dehydration')}</td>
              </tr>
              <tr>
                <th>${labels.moistureLabel || 'Độ ẩm tiêu chuẩn:'}</th>
                <td><strong style="color: var(--forest-green);">${specs.moisture || '< 15%'}</strong> (${this.currentLang === 'vi' ? 'Tỷ lệ sấy thu hồi 10:1' : '10:1 Dehydration Recovery'})</td>
              </tr>
              ${specs.brix ? `<tr><th>${this.currentLang === 'vi' ? 'Độ ngọt tự nhiên:' : 'Natural Brix:'}</th><td>${specs.brix}</td></tr>` : ''}
              <tr>
                <th>${labels.shelfLifeLabel || 'Hạn sử dụng:'}</th>
                <td>${shelfLife || '12 Tháng'}</td>
              </tr>
              <tr>
                <th>${labels.storageLabel || 'Bảo quản:'}</th>
                <td>${storage || (this.currentLang === 'vi' ? 'Nơi khô ráo thoáng mát (20-25°C)' : 'Cool, dry storage')}</td>
              </tr>
              <tr>
                <th>${labels.packagingLabel || 'Quy cách đóng gói:'}</th>
                <td>${packaging || 'Túi zip 100g, 250g, 500g / Thùng master 5kg, 10kg'}</td>
              </tr>
              <tr>
                <th>${labels.certificationsLabel || 'Tiêu chuẩn & Chứng nhận:'}</th>
                <td>${certs || 'BRCGS Food Safety Grade B, OCOP 3 Sao, BSCI, 100% Natural'}</td>
              </tr>
            </tbody>
          </table>

          <div class="product-detail-actions">
            <button class="btn btn-primary" id="productDetailQuoteBtn">
              <span>${labels.requestQuoteBtn || 'Yêu cầu báo giá sản phẩm này'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button class="btn btn-outline" id="productDetailCloseActionBtn">
              <span>${labels.closeBtn || 'Đóng'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Hook quote button inside modal -> Route to single contact quote form
    const quoteBtn = document.getElementById('productDetailQuoteBtn');
    if (quoteBtn) {
      quoteBtn.addEventListener('click', () => {
        this.closeProductDetail();
        window.location.href = `contact.html?product=${product.id}#quote-form`;
      });
    }

    // Hook close action button
    const closeActionBtn = document.getElementById('productDetailCloseActionBtn');
    if (closeActionBtn) {
      closeActionBtn.addEventListener('click', () => {
        this.closeProductDetail();
      });
    }
  }

  closeProductDetail() {
    const modal = document.getElementById('productDetailModal');
    if (modal) {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  /* --------------------------------------------------------------------------
     6. SCROLL ANIMATIONS & BACK TO TOP
     -------------------------------------------------------------------------- */
  setupScrollInteractions() {
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Scroll reveal observer
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      document.body.classList.add('js-animate');
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '150px 0px 150px 0px'
      });

      revealElements.forEach((el) => {
        // Immediately reveal elements that are already within or above the viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('is-revealed');
        } else {
          revealObserver.observe(el);
        }
      });
    } else {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-revealed');
      });
    }
  }
}

// Instantiate on DOMContentLoaded or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VinaxoApp();
  });
} else {
  new VinaxoApp();
}
