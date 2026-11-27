import argparse
import json
import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\homepage-prehandover"

LANGUAGES = [
    {
        "code": "vi",
        "short": "VI",
        "chipsTitle": "Trái cây sấy giòn",
        "forbiddenChipsTitle": "Trái cây sấy tự nhiên",
        "granolaSelectedText": "Granola",
    },
    {
        "code": "en",
        "short": "EN",
        "chipsTitle": "Crispy Dried Fruits",
        "forbiddenChipsTitle": "Natural Dried Fruit",
        "granolaSelectedText": "Granola",
    },
    {
        "code": "ko",
        "short": "KO",
        "chipsTitle": "크리스피 과일 칩",
        "forbiddenChipsTitle": "천연 건조",
        "granolaSelectedText": "그래놀라",
    },
    {
        "code": "zh-CN",
        "short": "ZH",
        "chipsTitle": "香脆果干片",
        "forbiddenChipsTitle": "天然水果干",
        "granolaSelectedText": "格兰诺拉",
    },
]

VIEWPORTS = [
    (320, 568),
    (375, 812),
    (768, 1024),
    (1024, 768),
    (1366, 768),
    (1440, 900),
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


def wait_for_home(driver, timeout=15):
    WebDriverWait(driver, timeout).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-home-section='hero']")) > 0
    )
    time.sleep(0.4)


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


def close_modal(driver):
    btn = driver.find_element(By.CSS_SELECTOR, ".modal-backdrop button[aria-label]")
    driver.execute_script("arguments[0].click();", btn)
    WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".modal-backdrop")) == 0)
    time.sleep(0.2)


def run_browser_qa(browser_name: str, base_url: str, save_screenshots: bool):
    driver = create_driver(browser_name)
    checks = []
    failures = []
    metrics = {}

    def check(cid: str, ok: bool, detail: str):
        status = "PASS" if ok else "FAIL"
        checks.append({"id": cid, "status": status, "detail": detail})
        if not ok:
            failures.append(f"[{browser_name.upper()}] {cid}: {detail}")

    if save_screenshots:
        os.makedirs(SCREENSHOT_ROOT, exist_ok=True)

    try:
        driver.get(f"{base_url}/")
        wait_for_home(driver)

        # Wait until all visible images finish decoding/loading
        driver.execute_script("""
            document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
        """)
        time.sleep(0.8)

        # 1. Baseline & Performance Metrics on /
        metrics = driver.execute_script("""
            const nav = performance.getEntriesByType('navigation')[0];
            const sections = document.querySelectorAll('[data-home-section]');
            const catCards = document.querySelectorAll('[data-category-card]');
            const oemCards = document.querySelectorAll('[data-oem-line-card]');
            const featuredCards = document.querySelectorAll('[data-testid="home-featured-products-grid"] .product-card');
            const imgs = Array.from(document.querySelectorAll('img'));
            const brokenImgs = imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src'));
            return {
                scrollHeight: document.documentElement.scrollHeight,
                sectionCount: sections.length,
                officialCategoryCount: catCards.length,
                oemLineCount: oemCards.length,
                featuredCount: featuredCards.length,
                totalImages: imgs.length,
                brokenImages: brokenImgs,
                domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
                loadEventEndMs: nav ? Math.round(nav.loadEventEnd) : null,
                bodyTextLen: (document.body.innerText || '').trim().length,
            };
        """)

        check(
            "STREAMLINED-STRUCTURE",
            metrics["sectionCount"] == 9
            and metrics["officialCategoryCount"] == 4
            and metrics["oemLineCount"] == 4
            and metrics["featuredCount"] == 4
            and metrics["scrollHeight"] < 7800,
            f"sections={metrics['sectionCount']}, cats={metrics['officialCategoryCount']}, oem={metrics['oemLineCount']}, featured={metrics['featuredCount']}, scrollHeight={metrics['scrollHeight']}",
        )

        check(
            "IMAGES-ZERO-BROKEN",
            len(metrics["brokenImages"]) == 0,
            f"totalImages={metrics['totalImages']}, broken={metrics['brokenImages']}",
        )

        if save_screenshots and browser_name == "chrome":
            driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-home-hero-vi.png"))

            cat_sec = driver.find_element(By.CSS_SELECTOR, "[data-home-section='categories']")
            driver.execute_script("arguments[0].scrollIntoView({block:'start'});", cat_sec)
            time.sleep(0.35)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-home-categories-oem-vi.png"))

            feat_sec = driver.find_element(By.CSS_SELECTOR, "[data-home-section='featuredProducts']")
            driver.execute_script("arguments[0].scrollIntoView({block:'start'});", feat_sec)
            time.sleep(0.35)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-home-featured-4-vi.png"))

        # 2. P1-01: Granola & Fruit & Nut Balls must NOT link to nuts-seeds; CTA opens QuoteModal with exact ID
        oem_section = driver.find_element(By.CSS_SELECTOR, "[data-testid='home-oem-inquiry-lines']")
        nuts_links_in_oem = oem_section.find_elements(By.CSS_SELECTOR, "a[href*='nuts-seeds']")
        granola_btn = oem_section.find_element(By.CSS_SELECTOR, "button[data-oem-inquiry-btn='granola']")
        balls_btn = oem_section.find_element(By.CSS_SELECTOR, "button[data-oem-inquiry-btn='fruit-and-nut-balls']")

        driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", granola_btn)
        WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#quoteProduct")) > 0)
        granola_val = Select(driver.find_element(By.CSS_SELECTOR, "#quoteProduct")).first_selected_option.get_attribute("value")
        if save_screenshots and browser_name == "chrome":
            time.sleep(0.25)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-home-granola-modal-vi.png"))
        close_modal(driver)

        driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", balls_btn)
        WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#quoteProduct")) > 0)
        balls_val = Select(driver.find_element(By.CSS_SELECTOR, "#quoteProduct")).first_selected_option.get_attribute("value")
        close_modal(driver)

        check(
            "P1-01-GRANOLA-BALLS-NO-NUTS-REDIRECT",
            len(nuts_links_in_oem) == 0 and granola_val == "granola" and balls_val == "fruit-and-nut-balls",
            f"nutsLinks={len(nuts_links_in_oem)}, granolaVal={granola_val}, ballsVal={balls_val}",
        )

        # 3. P1-02 & 4-Language Consistency: Check official chips label across VI / EN / KO / ZH-CN
        lang_issues = []
        for lang in LANGUAGES:
            switch_language(driver, lang["short"])
            chips_card = driver.find_element(By.CSS_SELECTOR, "[data-category-card='chips']")
            chips_text = chips_card.text
            if lang["chipsTitle"].lower() not in chips_text.lower():
                lang_issues.append(f"{lang['code']}: missing '{lang['chipsTitle']}' in '{chips_text}'")
            if lang["forbiddenChipsTitle"].lower() in chips_text.lower():
                lang_issues.append(f"{lang['code']}: forbidden '{lang['forbiddenChipsTitle']}' found")
            if save_screenshots and browser_name == "chrome" and lang["code"] == "en":
                driver.execute_script("window.scrollTo({ top: 0, behavior: 'instant' });")
                time.sleep(0.35)
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-home-en.png"))
        switch_language(driver, "VI")

        check("P1-02-CHIPS-NAMING-AND-I18N", len(lang_issues) == 0, f"issues={lang_issues}")

        # 4. Official category navigation & invalid ?category=granola fallback check
        chips_link = driver.find_element(By.CSS_SELECTOR, "[data-category-card='chips']")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", chips_link)
        WebDriverWait(driver, 8).until(lambda d: "category=chips" in d.current_url and len(d.find_elements(By.CSS_SELECTOR, ".product-card")) > 0)
        time.sleep(0.35)
        chip_cards = driver.find_elements(By.CSS_SELECTOR, ".product-card")
        chip_count = len(chip_cards)
        if save_screenshots and browser_name == "chrome":
            driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-chips-vi.png"))

        driver.get(f"{base_url}/products?category=granola")
        WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='invalid-category-notice']")) > 0)
        notice_visible = len(driver.find_elements(By.CSS_SELECTOR, "[data-testid='invalid-category-notice']")) > 0
        all_cards_on_invalid = len(driver.find_elements(By.CSS_SELECTOR, ".product-card"))
        nuts_active_on_invalid = driver.find_element(By.CSS_SELECTOR, "button[data-category-key='nuts-seeds']").get_attribute("aria-selected")

        check(
            "PRODUCTS-CATEGORY-SYNC-AND-INVALID-GUARD",
            chip_count == 3 and notice_visible and all_cards_on_invalid == 12 and nuts_active_on_invalid != "true",
            f"chipCards={chip_count}, invalidNotice={notice_visible}, fallbackCards={all_cards_on_invalid}, nutsSelected={nuts_active_on_invalid}",
        )

        # 5. Responsive Viewport Sweep on / (320x568 .. 2560x1440)
        driver.get(f"{base_url}/")
        wait_for_home(driver)
        overflow_ports = []
        for w, h in VIEWPORTS:
            driver.set_window_size(w, h)
            time.sleep(0.25)
            sw, cw = driver.execute_script("return [document.documentElement.scrollWidth, document.documentElement.clientWidth];")
            if sw > cw + 2:
                overflow_ports.append(f"{w}x{h} ({sw}>{cw})")
            if w == 375 and save_screenshots and browser_name == "chrome":
                driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(0.25)
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-home-mobile-375.png"))
        driver.set_window_size(1440, 900)
        check("RESPONSIVE-VIEWPORTS", len(overflow_ports) == 0, f"overflow={overflow_ports}")

        # 6. Console errors check
        logs = driver.get_log("browser")
        severe = [l["message"] for l in logs if l.get("level") == "SEVERE"]
        check("CONSOLE-CLEAN", len(severe) == 0, f"severe={severe}")

    finally:
        driver.quit()

    return checks, failures, metrics


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4174")
    parser.add_argument("--browsers", default="chrome,edge")
    parser.add_argument("--save-screenshots", action="store_true")
    args = parser.parse_args()

    browsers = [b.strip().lower() for b in args.browsers.split(",") if b.strip()]
    all_failures = []
    for b in browsers:
        checks, failures, metrics = run_browser_qa(b, args.base_url.rstrip("/"), args.save_screenshots)
        passed = sum(1 for c in checks if c["status"] == "PASS")
        print(f"=== {b.upper()} ({args.base_url}): {passed}/{len(checks)} PASS ===")
        for c in checks:
            print(f"  [{c['status']}] {c['id']}: {c['detail']}")
        print(f"  METRICS ({b}): {json.dumps(metrics, ensure_ascii=False)}")
        all_failures.extend(failures)

    if all_failures:
        print("\nFAILURES:", "\n".join(all_failures))
        sys.exit(1)
    print("\nALL HOMEPAGE PRE-HANDOVER QA CHECKS PASSED.")


if __name__ == "__main__":
    main()
