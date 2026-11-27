import argparse
import json
import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\global-ui-refinement"

SUBPAGES = [
    ("/products", "product-category-pills"),
    ("/about", "page-banner-title"),
    ("/quality", "page-banner-title"),
    ("/markets", "page-banner-title"),
    ("/news", "page-banner-title"),
    ("/brochure", "page-banner-title"),
    ("/contact", "page-banner-title"),
]

LANGUAGES = [
    {"code": "vi", "short": "VI", "isCjk": False},
    {"code": "en", "short": "EN", "isCjk": False},
    {"code": "ko", "short": "KO", "isCjk": True},
    {"code": "zh-CN", "short": "ZH", "isCjk": True},
]

RESPONSIVE_VIEWPORTS = [
    (320, 568),
    (375, 812),
    (390, 844),
    (768, 1024),
    (960, 540),    # 1920x1080 @ 200% Windows scaling
    (1024, 576),   # 1536x864 @ 150% Windows scaling
    (1024, 768),
    (1280, 720),
    (1366, 768),
    (1440, 900),
    (1536, 864),
    (1920, 1080),
    (2560, 1440),
]


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


def wait_settled(driver, css_selector="header", timeout=15):
    WebDriverWait(driver, timeout).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, css_selector)) > 0
    )
    driver.execute_script("return document.fonts ? document.fonts.ready : Promise.resolve();")
    time.sleep(0.45)


def switch_language(driver, target_short: str):
    lang_btn = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.CSS_SELECTOR, "button[aria-label='Change language']")
    )
    driver.execute_script("arguments[0].click();", lang_btn)
    time.sleep(0.25)
    item = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.XPATH, f"//button[@role='menuitem' and .//strong[text()='{target_short}']]")
    )
    driver.execute_script("arguments[0].click();", item)
    time.sleep(0.45)


def set_viewport(driver, w: int, h: int):
    driver.set_window_size(w, h)
    time.sleep(0.35)


def collect_severe_logs(driver):
    try:
        logs = driver.get_log("browser")
        return [
            e["message"]
            for e in logs
            if e.get("level") == "SEVERE"
            and "favicon" not in e.get("message", "").lower()
            and "maps.googleapis" not in e.get("message", "").lower()
        ]
    except Exception:
        return []


def run_qa(base_url: str, browser_name: str, save_screenshots: bool):
    os.makedirs(SCREENSHOT_ROOT, exist_ok=True)
    driver = create_driver(browser_name)
    failures = []
    metrics = {"browser": browser_name, "url": base_url, "subpages": {}}

    try:
        # 1. Home + Header + Footer + Typography Baseline
        set_viewport(driver, 1440, 900)
        driver.get(f"{base_url}/")
        wait_settled(driver, "[data-home-section='hero']")

        home_audit = driver.execute_script("""
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');
            const h1 = document.querySelector('h1');
            const secTitle = document.querySelector('.section-title');
            const brand = document.querySelector('.brand-name');
            const quoteBtn = document.querySelector('.header-quote-btn');
            const navLinks = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
            const wrappedLinks = navLinks.filter(el => el.getBoundingClientRect().height > 44).length;
            const clippedLinks = navLinks.filter(el => el.scrollWidth > el.clientWidth + 1).length;
            const mailtoEls = Array.from(document.querySelectorAll('footer a[href^="mailto:"]'));
            const emails = mailtoEls.map(a => ({
                href: a.getAttribute('href'),
                text: (a.textContent || '').trim()
            }));
            const footerText = footer ? footer.innerText : '';
            const perf = performance.getEntriesByType('navigation')[0];
            return {
                viewportH: window.innerHeight,
                viewportW: window.innerWidth,
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
                footerHeight: footer ? Math.round(footer.getBoundingClientRect().height) : null,
                wrappedLinks,
                clippedLinks,
                quoteRightOk: quoteBtn ? quoteBtn.getBoundingClientRect().right <= window.innerWidth + 1 : false,
                homeH1: h1 ? {
                    font: getComputedStyle(h1).fontFamily,
                    size: getComputedStyle(h1).fontSize,
                    weight: getComputedStyle(h1).fontWeight,
                    transform: getComputedStyle(h1).textTransform
                } : null,
                sectionTitle: secTitle ? {
                    font: getComputedStyle(secTitle).fontFamily,
                    size: getComputedStyle(secTitle).fontSize,
                    weight: getComputedStyle(secTitle).fontWeight,
                    transform: getComputedStyle(secTitle).textTransform
                } : null,
                brandFont: brand ? getComputedStyle(brand).fontFamily : null,
                footerEmails: emails,
                hasDupLegal: footerText.includes('Vinaxo Co., Ltd. (VINAXO'),
                domContentLoadedMs: perf ? Math.round(perf.domContentLoadedEventEnd) : null,
                loadEventEndMs: perf ? Math.round(perf.loadEventEnd) : null
            };
        """)
        metrics["home"] = home_audit

        if home_audit["overflow"]:
            failures.append("Home 1440px has horizontal overflow")
        if not home_audit["headerHeight"] or home_audit["headerHeight"] > 78:
            failures.append(f"Header height too tall on 1440px: {home_audit['headerHeight']}px (expected <= 78px)")
        if home_audit["wrappedLinks"] > 0 or home_audit["clippedLinks"] > 0:
            failures.append(f"Desktop nav link wrapping/clipping detected: {home_audit}")
        if not home_audit["quoteRightOk"]:
            failures.append("Header CTA button overflows right viewport edge")
        if home_audit["homeH1"]:
            if int(float(home_audit["homeH1"]["weight"])) > 700:
                failures.append(f"Home H1 weight too heavy: {home_audit['homeH1']['weight']}")
            if home_audit["homeH1"]["transform"] != "none":
                failures.append(f"Home H1 text-transform should be none, got {home_audit['homeH1']['transform']}")
        if home_audit["sectionTitle"]:
            if "Oswald" in home_audit["sectionTitle"]["font"]:
                failures.append(f"Section title should use clean sans instead of Oswald: {home_audit['sectionTitle']['font']}")
            if home_audit["sectionTitle"]["transform"] != "none":
                failures.append(f"Section title should not force uppercase: {home_audit['sectionTitle']['transform']}")
        if home_audit["hasDupLegal"]:
            failures.append("Duplicate English legal name detected in Footer")
        footer_text_emails = [em for em in home_audit["footerEmails"] if em["text"]]
        if not footer_text_emails:
            failures.append("Footer missing visible textual email link")
        for em in footer_text_emails:
            if em["href"] != f"mailto:{em['text']}":
                failures.append(f"Footer mailto href/text mismatch: {em}")

        if save_screenshots and browser_name == "chrome":
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-header-1440.png"))
            driver.execute_script("document.querySelector('footer')?.scrollIntoView({ behavior: 'instant' });")
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-footer-1440.png"))

        # 2. All 7 Subpages Banner & Typography Audit
        for path, wait_class in SUBPAGES:
            set_viewport(driver, 1440, 900)
            driver.get(f"{base_url}{path}")
            wait_settled(driver, f".{wait_class}")
            sub_res = driver.execute_script("""
                const b = document.querySelector('.page-banner');
                const t = document.querySelector('.page-banner-title');
                const badges = document.querySelectorAll('.page-hero-badge');
                const ts = t ? getComputedStyle(t) : null;
                return {
                    bannerHeight: b ? Math.round(b.getBoundingClientRect().height) : null,
                    titleFont: ts ? ts.fontFamily : null,
                    titleSize: ts ? ts.fontSize : null,
                    titleWeight: ts ? ts.fontWeight : null,
                    titleTransform: ts ? ts.textTransform : null,
                    heroBadgesCount: badges.length,
                    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
                };
            """)
            metrics["subpages"][path] = sub_res
            if sub_res["overflow"]:
                failures.append(f"{path} has horizontal overflow on 1440px")
            if not sub_res["bannerHeight"] or sub_res["bannerHeight"] > 235:
                failures.append(f"{path} .page-banner too tall: {sub_res['bannerHeight']}px (expected <= 235px)")
            if sub_res["titleFont"] and "Oswald" in sub_res["titleFont"]:
                failures.append(f"{path} .page-banner-title still uses Oswald: {sub_res['titleFont']}")
            if sub_res["titleTransform"] != "none":
                failures.append(f"{path} .page-banner-title text-transform={sub_res['titleTransform']}, expected none")
            if sub_res["titleWeight"] and int(float(sub_res["titleWeight"])) > 700:
                failures.append(f"{path} .page-banner-title font-weight={sub_res['titleWeight']}, expected <= 700")
            if save_screenshots and browser_name == "chrome" and path == "/about":
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-banner-1440.png"))

        # 3. /products Above-the-Fold Check on 1440x900 & 1366x768 + 4 Languages
        driver.get(f"{base_url}/products")
        wait_settled(driver, ".product-card")
        set_viewport(driver, 1440, 900)
        prod_1440 = driver.execute_script("""
            const pills = document.querySelector('.product-category-pills');
            const card = document.querySelector('.product-card');
            return {
                viewportH: window.innerHeight,
                pillsTop: pills ? Math.round(pills.getBoundingClientRect().top) : null,
                pillsBottom: pills ? Math.round(pills.getBoundingClientRect().bottom) : null,
                firstCardTop: card ? Math.round(card.getBoundingClientRect().top) : null
            };
        """)
        metrics["products_1440"] = prod_1440
        if not prod_1440["pillsBottom"] or prod_1440["pillsBottom"] > prod_1440["viewportH"]:
            failures.append(f"/products 1440px pills not fully above the fold: {prod_1440}")
        if not prod_1440["firstCardTop"] or prod_1440["firstCardTop"] >= prod_1440["viewportH"] - 40:
            failures.append(f"/products 1440px first product card not visible above the fold: {prod_1440}")
        if save_screenshots and browser_name == "chrome":
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-1440.png"))

        set_viewport(driver, 1366, 768)
        prod_1366 = driver.execute_script("""
            const header = document.querySelector('header');
            const pills = document.querySelector('.product-category-pills');
            const card = document.querySelector('.product-card');
            return {
                viewportH: window.innerHeight,
                headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
                pillsTop: pills ? Math.round(pills.getBoundingClientRect().top) : null,
                pillsBottom: pills ? Math.round(pills.getBoundingClientRect().bottom) : null,
                firstCardTop: card ? Math.round(card.getBoundingClientRect().top) : null,
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
            };
        """)
        metrics["products_1366"] = prod_1366
        if prod_1366["overflow"]:
            failures.append("/products 1366x768 has horizontal overflow")
        if not prod_1366["headerHeight"] or prod_1366["headerHeight"] > 72:
            failures.append(f"Laptop 1366 header height too tall: {prod_1366['headerHeight']}px (expected <= 72px)")
        if not prod_1366["pillsBottom"] or prod_1366["pillsBottom"] > prod_1366["viewportH"]:
            failures.append(f"/products 1366x768 pills not visible above the fold: {prod_1366}")
        if not prod_1366["firstCardTop"] or prod_1366["firstCardTop"] >= prod_1366["viewportH"] - 20:
            failures.append(f"/products 1366x768 first product card not visible above the fold: {prod_1366}")
        if save_screenshots and browser_name == "chrome":
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-laptop-1366.png"))

        # Switch all 4 languages on /products & verify typography + screenshots
        set_viewport(driver, 1440, 900)
        metrics["i18n"] = {}
        for lang in LANGUAGES:
            switch_language(driver, lang["short"])
            res = driver.execute_script("""
                const t = document.querySelector('.page-banner-title');
                const btns = Array.from(document.querySelectorAll('.btn'));
                const btnUpper = btns.some(b => getComputedStyle(b).textTransform === 'uppercase');
                return {
                    titleText: t ? t.textContent.trim() : null,
                    titleTransform: t ? getComputedStyle(t).textTransform : null,
                    btnUpper,
                    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
                };
            """)
            metrics["i18n"][lang["code"]] = res
            if res["overflow"]:
                failures.append(f"/products horizontal overflow in language {lang['code']}")
            if res["titleTransform"] != "none":
                failures.append(f"/products title text-transform={res['titleTransform']} in {lang['code']}")
            if lang["isCjk"] and res["btnUpper"]:
                failures.append(f"CJK buttons still uppercase in {lang['code']}")
            if save_screenshots and browser_name == "chrome" and lang["code"] in ("en", "ko", "zh-CN"):
                fname = {
                    "en": "after-products-en.png",
                    "ko": "after-products-ko.png",
                    "zh-CN": "after-products-zh.png",
                }[lang["code"]]
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, fname))
        switch_language(driver, "VI")

        # 4. /contact Email Sync Verification
        driver.get(f"{base_url}/contact")
        wait_settled(driver, ".contact-direct-list")
        contact_emails = driver.execute_script("""
            return Array.from(document.querySelectorAll('a[href^="mailto:"]')).map(a => ({
                href: a.getAttribute('href'),
                text: (a.textContent || '').trim()
            }));
        """)
        metrics["contactEmails"] = contact_emails
        footer_set = {e["text"] for e in home_audit["footerEmails"] if e["text"]}
        contact_set = {e["text"] for e in contact_emails if e["text"]}
        if not footer_set or not contact_set or not footer_set.intersection(contact_set):
            failures.append(f"Email mismatch between Footer {footer_set} and /contact {contact_set}")
        for em in contact_emails:
            if em["text"] and em["href"] != f"mailto:{em['text']}":
                failures.append(f"/contact mailto href/text mismatch: {em}")

        # 5. Mobile 390x844 Check + Screenshot + Full Responsive Sweep
        set_viewport(driver, 390, 844)
        driver.get(f"{base_url}/products")
        wait_settled(driver, ".product-category-pills")
        mob = driver.execute_script("""
            const h = document.querySelector('header');
            const b = document.querySelector('.page-banner');
            const p = document.querySelector('.product-category-pills');
            return {
                headerHeight: h ? Math.round(h.getBoundingClientRect().height) : null,
                bannerHeight: b ? Math.round(b.getBoundingClientRect().height) : null,
                pillsTop: p ? Math.round(p.getBoundingClientRect().top) : null,
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
            };
        """)
        metrics["mobile_390"] = mob
        if mob["overflow"]:
            failures.append("/products 390x844 mobile has horizontal overflow")
        if not mob["headerHeight"] or mob["headerHeight"] > 64:
            failures.append(f"Mobile header too tall: {mob['headerHeight']}px (expected <= 64px)")
        if not mob["bannerHeight"] or mob["bannerHeight"] > 260:
            failures.append(f"Mobile /products banner too tall: {mob['bannerHeight']}px (expected <= 260px)")
        if not mob["pillsTop"] or mob["pillsTop"] > 380:
            failures.append(f"Mobile /products category pills too low: {mob['pillsTop']}px (expected <= 380px)")
        if save_screenshots and browser_name == "chrome":
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-mobile-390.png"))

        viewport_issues = []
        for vw, vh in RESPONSIVE_VIEWPORTS:
            set_viewport(driver, vw, vh)
            for pg in ("/", "/products", "/contact"):
                driver.get(f"{base_url}{pg}")
                wait_settled(driver, "header")
                has_ov = driver.execute_script(
                    "return document.documentElement.scrollWidth > document.documentElement.clientWidth;"
                )
                if has_ov:
                    viewport_issues.append(f"{pg}@{vw}x{vh}")
        metrics["responsiveSweepCount"] = len(RESPONSIVE_VIEWPORTS) * 3
        if viewport_issues:
            failures.append(f"Horizontal overflow at viewports: {viewport_issues}")

        # 6. Admin Login Smoke Check (ensure Admin styling untouched)
        set_viewport(driver, 1280, 800)
        driver.get(f"{base_url}/admin/login")
        wait_settled(driver, "form button[type='submit']")
        admin_ok = driver.execute_script("""
            const inp = document.querySelector('input[type="password"]');
            const btn = document.querySelector('button[type="submit"]');
            return Boolean(inp && btn && btn.offsetHeight > 28);
        """)
        metrics["adminLoginOk"] = admin_ok
        if not admin_ok:
            failures.append("/admin/login failed smoke render check")

        severe = collect_severe_logs(driver)
        metrics["consoleSevereErrors"] = len(severe)
        if severe:
            failures.append(f"Severe browser console errors ({len(severe)}): {severe[:3]}")

    finally:
        driver.quit()

    print(f"\n=== GLOBAL UI REFINEMENT QA ({browser_name.upper()} @ {base_url}) ===")
    print(json.dumps(metrics, ensure_ascii=False, indent=2))
    if failures:
        print("\nFAILURES:")
        for f in failures:
            print(f"  - {f}")
        return False
    print("\nALL CHECKS PASSED")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:4174")
    parser.add_argument("--browser", choices=["chrome", "edge", "both"], default="both")
    parser.add_argument("--save-screenshots", action="store_true")
    args = parser.parse_args()

    browsers = ["chrome", "edge"] if args.browser == "both" else [args.browser]
    ok = True
    for b in browsers:
        res = run_qa(args.url.rstrip("/"), b, args.save_screenshots)
        if not res:
            ok = False
    sys.exit(0 if ok else 1)
