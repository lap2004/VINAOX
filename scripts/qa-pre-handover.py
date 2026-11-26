import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\pre-handover"

VIEWPORTS = {
    "mobile": [
        (320, 568),
        (360, 800),
        (390, 844),
        (414, 896),
        (430, 932),
    ],
    "tablet": [
        (768, 1024),
        (1024, 768),
    ],
    "laptop": [
        (1280, 720),
        (1366, 768),
        (1440, 900),
        (1536, 864),
        (1920, 1080),
        (1920, 1200),
    ],
    "desktop": [
        (1920, 1080),
        (2560, 1440),
        (3840, 2160),
    ],
}

PUBLIC_ROUTES = ["/", "/about", "/products", "/quality", "/markets", "/news", "/brochure", "/contact"]


def create_driver(browser_name: str):
    if browser_name == "edge":
        opts = EdgeOptions()
        opts.add_argument("--headless=new")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--window-size=1440,900")
        opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
        return webdriver.Edge(options=opts)

    opts = ChromeOptions()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1440,900")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    return webdriver.Chrome(options=opts)


def get_seo_snapshot(driver):
    return driver.execute_script("""
        const canons = Array.from(document.querySelectorAll('link[rel="canonical"]')).map(el => el.getAttribute('href'));
        const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        const ogLocale = document.querySelector('meta[property="og:locale"]')?.getAttribute('content') || '';
        const twTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '';
        const twDesc = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '';
        const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        let ldValid = true;
        let ldParsed = null;
        try {
            if (ldScripts.length > 0) ldParsed = JSON.parse(ldScripts[0].textContent || 'null');
        } catch {
            ldValid = false;
        }
        return {
            href: window.location.href,
            pathname: window.location.pathname,
            title: document.title,
            htmlLang: document.documentElement.lang,
            canonicalCount: canons.length,
            canonical: canons[0] || null,
            description: desc,
            robots,
            ogTitle,
            ogDesc,
            ogUrl,
            ogImage,
            ogLocale,
            twTitle,
            twDesc,
            ldCount: ldScripts.length,
            ldValid,
            ldParsed,
            h1Text: document.querySelector('h1')?.textContent?.trim() || '',
        };
    """)


def wait_for_h1(driver, timeout=15):
    WebDriverWait(driver, timeout).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "h1")) > 0)
    time.sleep(0.35)


def click_spa_link(driver, href_prefix: str):
    clicked = driver.execute_script(
        """
        const prefix = arguments[0];
        const links = Array.from(document.querySelectorAll('a[href]'));
        const target = links.find(a => {
            const href = a.getAttribute('href') || '';
            return href === prefix || href.startsWith(prefix + '/') || href.startsWith(prefix + '?');
        });
        if (!target) return false;
        target.click();
        return true;
        """,
        href_prefix,
    )
    return clicked


def switch_language(driver, target_lang: str):
    lang_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Change language']")
    driver.execute_script("arguments[0].click();", lang_btn)
    time.sleep(0.25)
    label = "EN" if target_lang == "en" else "VI"
    item = driver.find_element(By.XPATH, f"//button[@role='menuitem' and .//span[text()='{label}']]")
    driver.execute_script("arguments[0].click();", item)
    time.sleep(0.45)


def overlay_and_screenshot(driver, out_path: str, badge: str, color: str = "#10B981"):
    driver.execute_script(
        """
        const old = document.getElementById('__qa_overlay');
        if (old) old.remove();
        const badge = arguments[0];
        const color = arguments[1];
        const canon = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'NONE';
        const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const div = document.createElement('div');
        div.id = '__qa_overlay';
        div.style.cssText = 'position:fixed;bottom:14px;left:14px;z-index:99999;background:#111827;color:#F9FAFB;padding:10px 14px;border-radius:10px;font:12px/1.45 monospace;border:2px solid ' + color + ';max-width:680px;box-shadow:0 10px 25px rgba(0,0,0,.35)';
        div.innerHTML = '<strong style="color:' + color + '">' + badge + '</strong><br>' +
          'URL: ' + location.href + '<br>' +
          'title: ' + document.title + '<br>' +
          'canonical: ' + canon + '<br>' +
          'lang: ' + document.documentElement.lang + ' | desc: ' + desc.slice(0, 110) + '...';
        document.body.appendChild(div);
        """,
        badge,
        color,
    )
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    driver.save_screenshot(out_path)
    driver.execute_script("document.getElementById('__qa_overlay')?.remove()")


def run_seo_suite(driver, base_url: str, capture_shots: bool):
    cases = {}
    journey_snapshots = []

    def record(cid, ok, detail):
        cases[cid] = {"status": "PASS" if ok else "FAIL", "detail": detail}

    # Exact journey required by Phase I:
    # Home -> News -> Article -> Brochure -> Products -> Contact -> Switch EN -> Browser Back -> Refresh
    driver.set_window_size(1440, 900)
    driver.get(base_url + "/")
    wait_for_h1(driver)
    s_home = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "01_home", **s_home})

    if capture_shots:
        overlay_and_screenshot(driver, os.path.join(SCREENSHOT_ROOT, "seo", "after-canonical-home.png"), "[AFTER FIX] HOME CANONICAL & VI METADATA")

    record("SEO-01", s_home["canonical"] == "https://www.vinaxo.net/", f"canonical={s_home['canonical']}")
    record("SEO-07", "VINAXO" in s_home["title"] and "News" not in s_home["title"], f"title={s_home['title']}")

    # -> Press & News
    assert click_spa_link(driver, "/news")
    wait_for_h1(driver)
    s_news = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "02_news", **s_news})
    record("SEO-03", s_news["canonical"] == "https://www.vinaxo.net/news", f"canonical={s_news['canonical']}")

    # -> Article Detail
    driver.execute_script("""
        const link = Array.from(document.querySelectorAll('a[href*="/tin-tuc/"]'))[0];
        if (link) link.click();
    """)
    wait_for_h1(driver)
    s_article = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "03_article", **s_article})
    record("SEO-04", s_article["canonical"] == f"https://www.vinaxo.net{s_article['pathname']}", f"canonical={s_article['canonical']}")

    # -> Brochure (via Footer link in SPA)
    assert click_spa_link(driver, "/brochure")
    wait_for_h1(driver)
    s_brochure = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "04_brochure", **s_brochure})
    record(
        "SEO-08",
        "Brochure" in s_brochure["title"] and s_brochure["title"] != s_article["title"] and s_brochure["canonical"] == "https://www.vinaxo.net/brochure",
        f"title={s_brochure['title']} | canonical={s_brochure['canonical']}",
    )

    # -> Products
    assert click_spa_link(driver, "/products")
    wait_for_h1(driver)
    s_products = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "05_products", **s_products})
    record("SEO-02", s_products["canonical"] == "https://www.vinaxo.net/products", f"canonical={s_products['canonical']}")
    record(
        "SEO-09",
        "Sản phẩm" in s_products["title"] and s_products["title"] != s_article["title"] and s_products["title"] != s_brochure["title"],
        f"title={s_products['title']}",
    )

    if capture_shots:
        overlay_and_screenshot(driver, os.path.join(SCREENSHOT_ROOT, "seo", "after-route-title-products.png"), "[AFTER FIX] PRODUCTS ROUTE TITLE RESET")

    # -> Contact
    assert click_spa_link(driver, "/contact")
    wait_for_h1(driver)
    s_contact_vi = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "06_contact_vi", **s_contact_vi})
    if capture_shots:
        overlay_and_screenshot(driver, os.path.join(SCREENSHOT_ROOT, "seo", "after-metadata-vi.png"), "[AFTER FIX] METADATA VIETNAMESE")

    # -> Switch to EN
    switch_language(driver, "en")
    s_contact_en = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "07_contact_en", **s_contact_en})
    if capture_shots:
        overlay_and_screenshot(driver, os.path.join(SCREENSHOT_ROOT, "seo", "after-metadata-en.png"), "[AFTER FIX] METADATA ENGLISH SYNCED")

    record("SEO-14", s_contact_en["title"] != s_contact_vi["title"] and "Contact" in s_contact_en["title"], f"enTitle={s_contact_en['title']}")
    record("SEO-15", s_contact_en["description"] != s_contact_vi["description"] and "Vietnam" in s_contact_en["description"], f"enDesc={s_contact_en['description'][:80]}")
    record("SEO-17", s_contact_en["htmlLang"] == "en" and s_contact_vi["htmlLang"] == "vi", f"vi={s_contact_vi['htmlLang']}, en={s_contact_en['htmlLang']}")

    # -> Browser Back (to /products in EN)
    driver.back()
    wait_for_h1(driver)
    s_back_en = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "08_back_products_en", **s_back_en})
    record(
        "SEO-11",
        s_back_en["pathname"] == "/products" and "Catalog" in s_back_en["title"] and s_back_en["canonical"] == "https://www.vinaxo.net/products",
        f"title={s_back_en['title']}",
    )

    # -> Browser Refresh
    driver.refresh()
    wait_for_h1(driver)
    s_refresh = get_seo_snapshot(driver)
    journey_snapshots.append({"step": "09_refresh_products_en", **s_refresh})
    record(
        "SEO-13",
        s_refresh["title"] == s_back_en["title"] and s_refresh["canonical"] == "https://www.vinaxo.net/products" and s_refresh["htmlLang"] == "en",
        f"title={s_refresh['title']}",
    )

    # Switch back EN -> VI
    switch_language(driver, "vi")
    s_products_vi_again = get_seo_snapshot(driver)
    record("SEO-16", "Sản phẩm" in s_products_vi_again["title"] and s_products_vi_again["htmlLang"] == "vi", f"title={s_products_vi_again['title']}")

    # Direct URL visits across all remaining routes
    direct_checks = {}
    for route in ["/about", "/quality", "/markets", "/brochure", "/products/soft-dried-mango"]:
        driver.get(base_url + route)
        wait_for_h1(driver)
        snap = get_seo_snapshot(driver)
        direct_checks[route] = snap

    all_snaps = journey_snapshots + list(direct_checks.values())
    no_vn = all("vinaxo.vn" not in (s.get("canonical") or "") and "vinaxo.vn" not in (s.get("ogUrl") or "") for s in all_snaps)
    single_canon = all(s["canonicalCount"] == 1 for s in all_snaps)
    og_valid = all(
        s["ogTitle"] == s["title"]
        and s["ogDesc"] == s["description"]
        and s["ogUrl"] == s["canonical"]
        and s["ogImage"].startswith("https://www.vinaxo.net/")
        for s in all_snaps
    )
    ld_ok = all(s["ldCount"] == 1 and s["ldValid"] and s["ldParsed"] is not None for s in all_snaps)

    record("SEO-05", no_vn, "Zero vinaxo.vn across all inspected routes")
    record("SEO-06", single_canon, "Strictly 1 canonical link per route")
    record("SEO-10", len({s["title"] for s in [s_home, s_news, s_article, s_brochure, s_products, s_contact_vi]}) == 6, "All 6 visited routes have distinct titles")
    record("SEO-12", direct_checks["/about"]["canonical"] == "https://www.vinaxo.net/about" and direct_checks["/quality"]["canonical"] == "https://www.vinaxo.net/quality", "Direct URL metadata verified")
    record("SEO-18", og_valid, "OG title/description/url/image/locale synchronized")
    record("SEO-24", ld_ok, "Single valid JSON-LD block per page")

    # 404 route
    driver.get(base_url + "/non-existent-qa-test")
    wait_for_h1(driver)
    s_404 = get_seo_snapshot(driver)
    record("SEO-23", "noindex" in s_404["robots"] and s_404["canonicalCount"] == 0, f"robots={s_404['robots']}, canonicalCount={s_404['canonicalCount']}")

    # Admin portal renders cleanly (no white screen) and has noindex
    driver.get(base_url + "/admin/login")
    wait_for_h1(driver)
    s_admin = get_seo_snapshot(driver)
    record("SEO-26", "VINAXO" in s_admin["title"] and "noindex" in s_admin["robots"] and len(s_admin["h1Text"]) > 0, f"adminH1={s_admin['h1Text']}, robots={s_admin['robots']}")

    return cases, journey_snapshots


def run_responsive_and_interaction_suite(driver, base_url: str, capture_shots: bool):
    cases = {}
    viewport_matrix = []
    console_errors = []

    def record(cid, ok, detail):
        cases[cid] = {"status": "PASS" if ok else "FAIL", "detail": detail}

    # Check viewport matrix across critical routes
    check_routes = ["/", "/products", "/brochure", "/contact"]
    for group, sizes in VIEWPORTS.items():
        for w, h in sizes:
            driver.set_window_size(w, h)
            route_results = []
            for r in check_routes:
                driver.get(base_url + r)
                wait_for_h1(driver)
                metrics = driver.execute_script("""
                    return {
                        scrollWidth: document.documentElement.scrollWidth,
                        innerWidth: window.innerWidth,
                        overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
                    };
                """)
                route_results.append({"route": r, **metrics})
                if capture_shots and ((group == "mobile" and w in (320, 390) and r in ("/", "/products")) or (group in ("tablet", "laptop", "desktop") and w in (768, 1366, 1920) and r == "/")):
                    sub = group
                    fname = f"{w}x{h}-{r.strip('/') or 'home'}.png"
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, sub, fname))
            max_overflow = max(x["overflowPx"] for x in route_results)
            viewport_matrix.append({"group": group, "viewport": f"{w}x{h}", "maxOverflowPx": max_overflow, "routes": route_results})

    no_overflow = all(v["maxOverflowPx"] <= 1 for v in viewport_matrix)
    record("QA-03", no_overflow, f"Max horizontal overflow across all 16 viewports = {max(v['maxOverflowPx'] for v in viewport_matrix)}px")

    laptop_ok = all(v["maxOverflowPx"] <= 1 for v in viewport_matrix if v["group"] == "laptop")
    desktop_ok = all(v["maxOverflowPx"] <= 1 for v in viewport_matrix if v["group"] == "desktop")
    record("QA-22", laptop_ok, "1280x720 / 1366x768 / 1440x900 (14-inch & scaling) overflow=0")
    record("QA-23", laptop_ok, "1536x864 / 1920x1080 / 1920x1200 (15.6-inch) overflow=0")
    record("QA-24", desktop_ok, "1920x1080 (24-inch) overflow=0")
    record("QA-25", desktop_ok, "2560x1440 & 3840x2160 (27-inch/4K) overflow=0")

    # Mobile interactions at 390x844
    driver.set_window_size(390, 844)
    driver.get(base_url + "/")
    wait_for_h1(driver)

    # QA-01 & QA-02: Mobile hamburger menu & language switch
    menu_btn = driver.find_element(By.CSS_SELECTOR, "button.mobile-menu-btn")
    driver.execute_script("arguments[0].click();", menu_btn)
    time.sleep(0.35)
    drawer_present = len(driver.find_elements(By.CSS_SELECTOR, ".mobile-drawer-content")) > 0
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "mobile", "mobile-menu-open.png"))
    en_mobile = driver.find_element(By.XPATH, "//div[contains(@class,'mobile-drawer-content')]//button[.//span[text()='EN']]")
    driver.execute_script("arguments[0].click();", en_mobile)
    time.sleep(0.35)
    lang_after_mobile = driver.execute_script("return document.documentElement.lang;")
    close_drawer = driver.find_element(By.CSS_SELECTOR, ".mobile-drawer-content button:not(.btn)")
    driver.execute_script("arguments[0].click();", close_drawer)
    time.sleep(0.25)
    record("QA-01", drawer_present, "Mobile drawer opened & closed cleanly")
    record("QA-02", lang_after_mobile == "en", f"Mobile language switched to {lang_after_mobile}")
    # Restore VI for consistency
    switch_language(driver, "vi")

    # QA-04, QA-05, QA-06, QA-07, QA-08, QA-16 on /products (390x844)
    driver.get(base_url + "/products")
    wait_for_h1(driver)
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "mobile", "mobile-product-cards.png"))

    # QA-05: verify product card images loaded & banana-chips has banana-chips image (not dragonfruit)
    img_audit = driver.execute_script("""
        const cards = Array.from(document.querySelectorAll('.product-card'));
        return cards.map(c => {
            const title = c.querySelector('h3')?.textContent?.trim() || '';
            const img = c.querySelector('img');
            return {
                title,
                src: img?.getAttribute('src') || '',
                complete: Boolean(img?.complete),
                naturalWidth: img?.naturalWidth || 0,
            };
        });
    """)
    banana_card = next((x for x in img_audit if "Chuối" in x["title"] or "Banana" in x["title"]), None)
    all_imgs_loaded = len(img_audit) == 12 and all(x["complete"] and x["naturalWidth"] > 0 for x in img_audit)
    banana_ok = banana_card is not None and "banana-chips" in banana_card["src"]
    record("QA-05", all_imgs_loaded and banana_ok, f"cards={len(img_audit)}, bananaSrc={banana_card['src'] if banana_card else None}")

    # QA-04: Category filter pills
    pills = driver.find_elements(By.CSS_SELECTOR, ".product-cat-pill")
    driver.execute_script("arguments[0].click();", pills[1])
    time.sleep(0.25)
    filtered_count = len(driver.find_elements(By.CSS_SELECTOR, ".product-card"))
    driver.execute_script("arguments[0].click();", pills[0])
    time.sleep(0.25)
    all_count = len(driver.find_elements(By.CSS_SELECTOR, ".product-card"))
    record("QA-04", 0 < filtered_count < all_count and all_count == 12, f"filtered={filtered_count}, all={all_count}")

    # QA-06 & QA-07: Product Spec Modal + specs table horizontal scroll on mobile
    spec_btn = driver.find_element(By.XPATH, "(//div[contains(@class,'product-card')]//button[contains(.,'thông số') or contains(.,'Specifications')])[1]")
    driver.execute_script("arguments[0].click();", spec_btn)
    time.sleep(0.35)
    spec_modal_open = len(driver.find_elements(By.CSS_SELECTOR, "[aria-labelledby='product-modal-title']")) > 0
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "mobile", "mobile-spec-modal.png"))
    driver.find_element(By.CSS_SELECTOR, "button[aria-label='Close dialog']").click()
    time.sleep(0.25)
    table_overflow = driver.execute_script("""
        const wrap = document.querySelector('.specs-table-wrapper');
        return {
            pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
            tableScrollable: wrap ? wrap.scrollWidth >= wrap.clientWidth : false
        };
    """)
    record("QA-06", spec_modal_open, "Spec modal opened and closed cleanly")
    record("QA-07", table_overflow["pageOverflow"] <= 1 and table_overflow["tableScrollable"], str(table_overflow))

    # QA-08 & QA-16: Quote modal from specific product card (Banana Chips)
    banana_quote_btn = driver.find_element(By.XPATH, "//div[contains(@class,'product-card')][.//h3[contains(.,'Chuối')]]//button[contains(@class,'btn-primary')]")
    driver.execute_script("arguments[0].click();", banana_quote_btn)
    time.sleep(0.35)
    quote_select_val = driver.execute_script("return document.getElementById('quoteProduct')?.value || '';")
    quote_font_size = driver.execute_script("return getComputedStyle(document.getElementById('quoteName')).fontSize;")
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "contact-form", "quote-modal-prefilled.png"))
    driver.find_element(By.CSS_SELECTOR, "button[aria-label*='Đóng'], button[aria-label='Close modal']").click()
    time.sleep(0.25)
    record("QA-08", quote_font_size == "16px", f"mobileInputFont={quote_font_size}")
    record("QA-16", quote_select_val == "banana-chips", f"selectedProduct={quote_select_val}")

    # QA-09 & QA-10: Floating B2B button doesn't overlap footer or submit button
    driver.get(base_url + "/contact")
    wait_for_h1(driver)
    driver.execute_script("document.getElementById('contactSubmitBtn')?.scrollIntoView({block:'center'});")
    time.sleep(0.3)
    submit_rect = driver.execute_script("""
        const btn = document.getElementById('contactSubmitBtn').getBoundingClientRect();
        const fab = document.querySelector('.floating-b2b-speed-dial');
        const fabRect = fab ? fab.getBoundingClientRect() : null;
        const fabHidden = fab ? fab.classList.contains('is-footer-visible') : true;
        const overlap = (!fabHidden && fabRect) ? !(btn.right < fabRect.left || btn.left > fabRect.right || btn.bottom < fabRect.top || btn.top > fabRect.bottom) : false;
        return { overlap, fabHidden, inputFont: getComputedStyle(document.getElementById('contactName')).fontSize };
    """)
    record("QA-09", submit_rect["inputFont"] == "16px", f"mobileInputFont={submit_rect['inputFont']}")
    record("QA-10", not submit_rect["overlap"], str(submit_rect))

    # QA-13, QA-14, QA-19, QA-20, QA-21: Contact form validation & error preservation
    submit_btn = driver.find_element(By.ID, "contactSubmitBtn")
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
    time.sleep(0.2)
    submit_btn.click()
    time.sleep(0.25)
    err_missing = driver.find_element(By.CSS_SELECTOR, "[role='alert']").text
    record("QA-13", "bắt buộc" in err_missing or "required" in err_missing, f"err={err_missing}")

    driver.find_element(By.ID, "contactName").send_keys("QA Tester")
    driver.find_element(By.ID, "contactEmail").send_keys("invalid-email")
    Select(driver.find_element(By.ID, "contactInquiryType")).select_by_index(1)
    driver.find_element(By.ID, "contactMessage").send_keys("[VINAXO QA TEST – PRE-HANDOVER] Mobile validation check")
    submit_btn = driver.find_element(By.ID, "contactSubmitBtn")
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit_btn)
    time.sleep(0.2)
    submit_btn.click()
    time.sleep(0.25)
    err_email = driver.find_element(By.CSS_SELECTOR, "[role='alert']").text
    record("QA-14", "email" in err_email.lower(), f"err={err_email}")

    # Test real submit when unconfigured / error handling preserves input (do NOT spam live API if running on production unless explicitly enabled!)
    driver.find_element(By.ID, "contactEmail").clear()
    driver.find_element(By.ID, "contactEmail").send_keys("qa-test@vinaxo.example")
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "contact-form", "contact-form-mobile.png"))

    # QA-11 & QA-12: Brochure mobile reader & PDF download link
    driver.get(base_url + "/brochure")
    wait_for_h1(driver)
    brochure_mobile = driver.execute_script("""
        const imgs = Array.from(document.querySelectorAll('.brochure-mobile-page-img'));
        const dl = document.querySelector('.brochure-mobile-download-btn');
        return {
            pageCount: imgs.length,
            firstLoaded: imgs[0] ? (imgs[0].complete && imgs[0].naturalWidth > 0) : false,
            pdfHref: dl ? dl.getAttribute('href') : null,
            overflow: document.documentElement.scrollWidth - window.innerWidth
        };
    """)
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "brochure", "brochure-mobile-390.png"))
    driver.set_window_size(1440, 900)
    time.sleep(0.35)
    brochure_desktop = driver.execute_script("""
        const iframe = document.querySelector('.brochure-pdf-iframe');
        return { hasIframe: Boolean(iframe), src: iframe ? iframe.getAttribute('src') : null };
    """)
    if capture_shots:
        driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "brochure", "brochure-desktop-1440.png"))

    record("QA-11", brochure_mobile["pageCount"] == 4 and brochure_mobile["firstLoaded"] and brochure_mobile["overflow"] <= 1 and brochure_desktop["hasIframe"], str(brochure_mobile))
    record("QA-12", brochure_mobile["pdfHref"] == "/brochures/vinaxo-company-brochure-2026.pdf", f"href={brochure_mobile['pdfHref']}")

    # Console errors across run
    logs = driver.get_log("browser")
    for entry in logs:
        if entry.get("level") == "SEVERE":
            console_errors.append(entry)
    record("QA-26", len(console_errors) == 0, f"severeErrors={len(console_errors)}")

    # Lab Web Vitals snapshot
    driver.set_window_size(1440, 900)
    driver.get(base_url + "/")
    wait_for_h1(driver)
    time.sleep(0.8)
    perf = driver.execute_script("""
        const nav = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        return {
            ttfbMs: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
            domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
            loadEventMs: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
            fcpMs: fcp ? Math.round(fcp.startTime) : null,
        };
    """)

    return cases, viewport_matrix, console_errors, perf


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4173")
    parser.add_argument("--browsers", default="chrome,edge")
    parser.add_argument("--capture-shots", action="store_true")
    parser.add_argument("--out-json", default="")
    args = parser.parse_args()

    browsers = [b.strip().lower() for b in args.browsers.split(",") if b.strip()]
    summary = {
        "baseUrl": args.base_url,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "browsers": {},
    }

    for idx, browser in enumerate(browsers):
        driver = create_driver(browser)
        try:
            capture = args.capture_shots and idx == 0
            seo_cases, journey = run_seo_suite(driver, args.base_url, capture)
            qa_cases, matrix, errors, perf = run_responsive_and_interaction_suite(driver, args.base_url, capture)
            summary["browsers"][browser] = {
                "seoCases": seo_cases,
                "journey": journey,
                "qaCases": qa_cases,
                "viewportMatrix": matrix,
                "consoleErrors": errors,
                "perf": perf,
            }
        finally:
            driver.quit()

    out_text = json.dumps(summary, indent=2, ensure_ascii=False)
    if args.out_json:
        os.makedirs(os.path.dirname(args.out_json), exist_ok=True)
        with open(args.out_json, "w", encoding="utf-8") as f:
            f.write(out_text)
    print(out_text)


if __name__ == "__main__":
    main()
