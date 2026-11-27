import argparse
import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\products-prehandover"

LANGUAGES = [
    {
        "code": "vi",
        "short": "VI",
        "requiredPhrases": ["trái cây sấy dẻo", "trái cây sấy giòn", "hạt dinh dưỡng", "thập cẩm"],
        "forbiddenBannerPhrases": ["sấy dẻo nhiệt thấp", "không thêm đường"],
        "dragonfruitSlug": "soft-dried-red-dragonfruit",
        "dragonfruitName": "Thanh long ruột đỏ sấy dẻo",
        "dragonfruitCategory": "Trái cây sấy dẻo",
        "bananaName": "Chuối sấy giòn",
        "cashewName": "Hạt điều",
    },
    {
        "code": "en",
        "short": "EN",
        "requiredPhrases": ["soft-dried fruits", "crispy dried fruits", "nuts", "mixed products"],
        "forbiddenBannerPhrases": ["zero added sugar", "gently low-temperature dehydrated"],
        "dragonfruitSlug": "soft-dried-red-dragonfruit",
        "dragonfruitName": "Soft Dried Red Dragonfruit",
        "dragonfruitCategory": "Soft-Dried Fruits",
        "bananaName": "Banana Chips",
        "cashewName": "Cashew",
    },
    {
        "code": "ko",
        "short": "KO",
        "requiredPhrases": ["소프트 건조 과일", "과일 칩", "견과류"],
        "forbiddenBannerPhrases": ["설탕·방부제 첨가 없이"],
        "dragonfruitSlug": "soft-dried-red-dragonfruit",
        "dragonfruitName": "소프트 건적색 용과",
        "dragonfruitCategory": "소프트 건조 과일",
        "bananaName": "바나나 칩",
        "cashewName": "캐슈넛",
    },
    {
        "code": "zh-CN",
        "short": "ZH",
        "requiredPhrases": ["软烘干果", "香脆果干片", "坚果"],
        "forbiddenBannerPhrases": ["零额外蔗糖与防腐剂"],
        "dragonfruitSlug": "soft-dried-red-dragonfruit",
        "dragonfruitName": "软烘红心火龙果干",
        "dragonfruitCategory": "软烘干果",
        "bananaName": "香脆香蕉片",
        "cashewName": "腰果",
    },
]

CATEGORY_EXPECTATIONS = [
    ("all", 12),
    ("soft-dried", 4),
    ("chips", 3),
    ("nuts-seeds", 4),
    ("mixed", 1),
]

VIEWPORTS = [
    (320, 568),
    (360, 800),
    (390, 844),
    (430, 932),
    (768, 1024),
    (1366, 768),
    (1920, 1080),
    (2560, 1440),
]

FORBIDDEN_CERT_CELL_STRINGS = [
    "clean label",
    "đạt chuẩn xuất khẩu",
    "tiêu chuẩn xuất khẩu",
    "export standard",
    "export quality",
    "đặc sản đồng tháp",
    "premium grade",
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


def wait_for_h1(driver, timeout=15):
    WebDriverWait(driver, timeout).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "h1")) > 0)
    time.sleep(0.35)


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


def open_quote_from_card(driver, slug: str):
    btn = WebDriverWait(driver, 10).until(
        lambda d: d.find_element(By.CSS_SELECTOR, f"button[data-quote-product-slug='{slug}']")
    )
    driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", btn)
    WebDriverWait(driver, 10).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#quoteProduct")) > 0)
    time.sleep(0.25)


def close_modal(driver):
    btn = driver.find_element(By.CSS_SELECTOR, ".modal-backdrop button[aria-label]")
    driver.execute_script("arguments[0].click();", btn)
    WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".modal-backdrop")) == 0)
    time.sleep(0.2)


def run_browser_qa(browser_name: str, base_url: str, save_screenshots: bool):
    driver = create_driver(browser_name)
    checks = []
    failures = []

    def check(cid: str, ok: bool, detail: str):
        checks.append({"id": cid, "status": "PASS" if ok else "FAIL", "detail": detail})
        if not ok:
            failures.append(f"[{browser_name}] {cid}: {detail}")

    try:
        driver.get(f"{base_url}/products")
        wait_for_h1(driver)

        # 1. Verify 4 languages banner accuracy (P1-01) & localized card content
        for lang in LANGUAGES:
            switch_language(driver, lang["short"])
            banner_desc = driver.find_element(By.CSS_SELECTOR, ".page-banner-desc").text.lower()
            has_req = all(p.lower() in banner_desc for p in lang["requiredPhrases"])
            no_forbidden = not any(fp.lower() in banner_desc for fp in lang["forbiddenBannerPhrases"])
            check(
                f"P1-BANNER-{lang['code']}",
                has_req and no_forbidden,
                f"banner_desc={banner_desc[:120]!r}",
            )
            if save_screenshots and browser_name == "chrome" and lang["code"] == "vi":
                os.makedirs(SCREENSHOT_ROOT, exist_ok=True)
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-hero-vi.png"))
            elif save_screenshots and browser_name == "chrome" and lang["code"] == "ko":
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-ko.png"))
            elif save_screenshots and browser_name == "chrome" and lang["code"] == "zh-CN":
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-zh-cn.png"))

        # Switch back to VI for full suite checks
        switch_language(driver, "VI")

        # 2. Check all 12 products' Detail Modals for zero duplicate text, zero undefined, Brix gating
        all_detail_btns = driver.find_elements(By.CSS_SELECTOR, "button[data-detail-product-slug]")
        slugs_found = [b.get_attribute("data-detail-product-slug") for b in all_detail_btns]
        modal_issues = []
        for idx, slug in enumerate(slugs_found):
            btn = driver.find_element(By.CSS_SELECTOR, f"button[data-detail-product-slug='{slug}']")
            driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", btn)
            WebDriverWait(driver, 10).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#product-modal-title")) > 0)
            time.sleep(0.25)

            modal_el = driver.find_element(By.CSS_SELECTOR, ".product-detail-modal")
            modal_text = modal_el.text
            if "undefined" in modal_text.lower():
                modal_issues.append(f"{slug}: contains undefined")

            # Check overview vs highlight not identical
            narr_els = modal_el.find_elements(By.CSS_SELECTOR, "[data-testid='modal-overview-narrative']")
            hl_els = modal_el.find_elements(By.CSS_SELECTOR, "[data-testid='modal-overview-highlight']")
            if narr_els and hl_els:
                if narr_els[0].text.strip().lower() == hl_els[0].text.strip().lower():
                    modal_issues.append(f"{slug}: overview & highlight duplicate")

            # Check non-soft-dried has NO Brix card
            cat_badge = driver.find_element(By.CSS_SELECTOR, f".product-card[data-product-slug='{slug}']").get_attribute("data-product-category")
            brix_cards = modal_el.find_elements(By.CSS_SELECTOR, "[data-testid='modal-brix-card']")
            if cat_badge != "soft-dried" and len(brix_cards) > 0:
                modal_issues.append(f"{slug}: non-soft-dried has Brix card")

            # Ensure 7 section elements visible/structured cleanly + Features separated from Certs
            if len(modal_el.find_elements(By.CSS_SELECTOR, "[data-testid='modal-certifications']")) == 0:
                modal_issues.append(f"{slug}: missing certifications/dossiers section")

            if save_screenshots and browser_name == "chrome" and slug == "soft-dried-red-dragonfruit":
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-dragonfruit-modal-vi.png"))

            close_modal(driver)

        check(
            "MODALS-12-PRODUCTS-AUDIT",
            len(slugs_found) == 12 and len(modal_issues) == 0,
            f"tested={len(slugs_found)}, issues={modal_issues}",
        )

        # 3. Category filter sync with Specs Table & Cert/Feature Separation (P2-03 & P2-04)
        filter_issues = []
        cert_cell_leaks = []
        for cat_key, expected_count in CATEGORY_EXPECTATIONS:
            tab = driver.find_element(By.CSS_SELECTOR, f"button[data-category-key='{cat_key}']")
            driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", tab)
            time.sleep(0.35)
            cards = driver.find_elements(By.CSS_SELECTOR, "[data-testid='products-grid'] .product-card")
            rows = driver.find_elements(By.CSS_SELECTOR, "[data-testid='specs-table'] tbody tr")
            heading_text = driver.find_element(By.CSS_SELECTOR, "[data-testid='specs-table-heading']").text
            if len(cards) != expected_count or len(rows) != expected_count:
                filter_issues.append(f"{cat_key}: grid={len(cards)}, table={len(rows)}, expected={expected_count}")
            if f"({expected_count})" not in heading_text:
                filter_issues.append(f"{cat_key}: heading missing count ({expected_count}): {heading_text}")
            if cat_key == "nuts-seeds":
                for row in rows:
                    rslug = row.get_attribute("data-spec-row-slug")
                    cert_cell = row.find_element(By.CSS_SELECTOR, f"[data-testid='spec-cert-cell-{rslug}']").text.lower()
                    for bad in FORBIDDEN_CERT_CELL_STRINGS:
                        if bad in cert_cell:
                            cert_cell_leaks.append(f"{rslug}: {cert_cell}")
                if save_screenshots and browser_name == "chrome":
                    tbl = driver.find_element(By.CSS_SELECTOR, "#technical-specifications")
                    driver.execute_script("arguments[0].scrollIntoView({block:'start'});", tbl)
                    time.sleep(0.3)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-filter-nuts-table-vi.png"))

        # Reset back to 'all'
        driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, "button[data-category-key='all']"))
        time.sleep(0.3)
        check(
            "FILTER-SYNC-AND-CERT-SEPARATION",
            len(filter_issues) == 0 and len(cert_cell_leaks) == 0,
            f"filter_issues={filter_issues}, cert_cell_leaks={cert_cell_leaks}",
        )

        # 4. Exact Product Quotation flow & stale-state reset test (Phase D 7.4)
        quote_issues = []

        # Open Dragonfruit -> check exact product & category -> close
        open_quote_from_card(driver, "soft-dried-red-dragonfruit")
        sel_val = Select(driver.find_element(By.CSS_SELECTOR, "#quoteProduct")).first_selected_option.get_attribute("value")
        prev_name = driver.find_element(By.CSS_SELECTOR, "[data-testid='selected-product-name']").text
        prev_cat = driver.find_element(By.CSS_SELECTOR, "[data-testid='selected-product-category']").text
        if sel_val != "soft-dried-red-dragonfruit" or "Thanh long" not in prev_name or "Trái cây sấy dẻo" not in prev_cat:
            quote_issues.append(f"Dragonfruit mismatch: val={sel_val}, name={prev_name}, cat={prev_cat}")
        if save_screenshots and browser_name == "chrome":
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-quote-dragonfruit-vi.png"))
        close_modal(driver)

        # Open Banana Chips -> verify no stale Dragonfruit data -> close
        open_quote_from_card(driver, "banana-chips")
        sel_val2 = Select(driver.find_element(By.CSS_SELECTOR, "#quoteProduct")).first_selected_option.get_attribute("value")
        prev_name2 = driver.find_element(By.CSS_SELECTOR, "[data-testid='selected-product-name']").text
        if sel_val2 != "banana-chips" or "Chuối" not in prev_name2 or "Thanh long" in prev_name2:
            quote_issues.append(f"Banana stale/mismatch: val={sel_val2}, name={prev_name2}")
        close_modal(driver)

        # Filter to nuts-seeds -> Open Cashew quote -> check packaging field present -> switch language to EN
        driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, "button[data-category-key='nuts-seeds']"))
        time.sleep(0.25)
        open_quote_from_card(driver, "cashew")
        sel_val3 = Select(driver.find_element(By.CSS_SELECTOR, "#quoteProduct")).first_selected_option.get_attribute("value")
        pkg_inputs = driver.find_elements(By.CSS_SELECTOR, "#quotePackaging")
        if sel_val3 != "cashew" or len(pkg_inputs) == 0:
            quote_issues.append(f"Cashew / packaging issue: val={sel_val3}, pkg={len(pkg_inputs)}")
        close_modal(driver)

        # Open Detail Modal -> Request Quote button from modal
        driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, "button[data-table-detail-slug='cashew']"))
        WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='modal-request-quote-btn']")) > 0)
        driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, "[data-testid='modal-request-quote-btn']"))
        WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#quoteProduct")) > 0)
        sel_val4 = Select(driver.find_element(By.CSS_SELECTOR, "#quoteProduct")).first_selected_option.get_attribute("value")
        if sel_val4 != "cashew":
            quote_issues.append(f"Modal-to-Quote mismatch: {sel_val4}")
        close_modal(driver)

        check("EXACT-PRODUCT-QUOTATION-FLOW", len(quote_issues) == 0, f"issues={quote_issues}")

        # 5. Responsive Viewports + Scaling check (320px .. 2560px)
        driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, "button[data-category-key='all']"))
        time.sleep(0.25)
        overflow_ports = []
        for w, h in VIEWPORTS:
            driver.set_window_size(w, h)
            time.sleep(0.25)
            sw, cw = driver.execute_script("return [document.documentElement.scrollWidth, document.documentElement.clientWidth];")
            if sw > cw + 2:
                overflow_ports.append(f"{w}x{h} (scroll={sw}>client={cw})")
            if w == 390:
                mobile_cards = driver.find_elements(By.CSS_SELECTOR, "[data-testid='specs-mobile-cards'] > div")
                if len(mobile_cards) != 12:
                    overflow_ports.append(f"390x844 mobile spec cards={len(mobile_cards)}!=12")
                if save_screenshots and browser_name == "chrome":
                    driver.execute_script("arguments[0].scrollIntoView({block:'start'});", driver.find_element(By.CSS_SELECTOR, "#technical-specifications"))
                    time.sleep(0.25)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-products-mobile-390-specs.png"))
        driver.set_window_size(1440, 900)
        check("RESPONSIVE-VIEWPORTS", len(overflow_ports) == 0, f"overflow={overflow_ports}")

        # 6. Console errors check
        logs = driver.get_log("browser")
        severe = [l["message"] for l in logs if l.get("level") == "SEVERE"]
        check("CONSOLE-CLEAN", len(severe) == 0, f"severe={severe}")

    finally:
        driver.quit()

    return checks, failures


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4173")
    parser.add_argument("--browsers", default="chrome,edge")
    parser.add_argument("--save-screenshots", action="store_true")
    args = parser.parse_args()

    browsers = [b.strip().lower() for b in args.browsers.split(",") if b.strip()]
    all_failures = []
    for b in browsers:
        checks, failures = run_browser_qa(b, args.base_url.rstrip("/"), args.save_screenshots)
        passed = sum(1 for c in checks if c["status"] == "PASS")
        print(f"=== {b.upper()} ({args.base_url}): {passed}/{len(checks)} PASS ===")
        for c in checks:
            print(f"  [{c['status']}] {c['id']}: {c['detail']}")
        all_failures.extend(failures)

    if all_failures:
        print("\nFAILURES:", "\n".join(all_failures))
        sys.exit(1)
    print("\nALL PRODUCT PAGE PRE-HANDOVER QA CHECKS PASSED.")


if __name__ == "__main__":
    main()
