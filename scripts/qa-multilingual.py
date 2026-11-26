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
from selenium.webdriver.support.ui import WebDriverWait

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\multilingual"

LANGUAGES = [
    {"code": "vi", "short": "VI", "htmlLang": "vi", "ogLocale": "vi_VN", "legal": "CÔNG TY TNHH VINAXO"},
    {"code": "en", "short": "EN", "htmlLang": "en", "ogLocale": "en_US", "legal": "VINAXO COMPANY LIMITED"},
    {"code": "ko", "short": "KO", "htmlLang": "ko", "ogLocale": "ko_KR", "legal": "VINAXO COMPANY LIMITED"},
    {"code": "zh-CN", "short": "ZH", "htmlLang": "zh-CN", "ogLocale": "zh_CN", "legal": "VINAXO COMPANY LIMITED"},
]

PUBLIC_ROUTES = [
    "/",
    "/about",
    "/products",
    "/quality",
    "/markets",
    "/news",
    "/brochure",
    "/contact",
    "/tin-tuc/press-nld-mango-sourcing",
]

RESPONSIVE_VIEWPORTS = [
    (320, 568),
    (360, 800),
    (390, 844),
    (430, 932),
    (768, 1024),
    (1024, 768),
    (1280, 720),
    (1366, 768),
    (1440, 900),
    (1920, 1080),
]

BANNED_DUPLICATES = [
    "Vinaxo Co., Ltd.",
    "VINAXO COMPANY LIMITED (Vinaxo Co., Ltd.)",
]

LEAKED_KEY_PREFIXES = ("nav.", "home.", "footer.", "products.", "brochure.", "contactPage.")


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


def snapshot_page(driver):
    return driver.execute_script("""
        const canons = Array.from(document.querySelectorAll('link[rel="canonical"]')).map(el => el.getAttribute('href'));
        const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const ogLocale = document.querySelector('meta[property="og:locale"]')?.getAttribute('content') || '';
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const h1 = document.querySelector('h1')?.textContent?.trim() || '';
        const footerText = document.querySelector('footer')?.innerText || '';
        const bodyText = document.body?.innerText || '';
        const headHtml = document.head?.innerHTML || '';
        const imgs = Array.from(document.querySelectorAll('img'));
        const brokenImgs = imgs
            .filter(img => {
                const s = window.getComputedStyle(img);
                if (s.display === 'none' || s.visibility === 'hidden') return false;
                return img.complete && img.naturalWidth === 0;
            })
            .map(img => img.getAttribute('src') || 'unknown');
        return {
            pathname: window.location.pathname,
            htmlLang: document.documentElement.lang,
            title: document.title,
            desc,
            ogLocale,
            ogTitle,
            canonicalCount: canons.length,
            canonical: canons[0] || null,
            h1,
            footerText,
            bodyText,
            headHtml,
            brokenImgs,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            lsLang: localStorage.getItem('vinaxo_lang'),
            spaMarker: window.__qaSpaMarker || null
        };
    """)


def save_shot(driver, lang_code: str, filename: str):
    out_dir = os.path.join(SCREENSHOT_ROOT, lang_code)
    os.makedirs(out_dir, exist_ok=True)
    driver.save_screenshot(os.path.join(out_dir, filename))


def run_browser_qa(browser_name: str, base_url: str, save_screenshots: bool):
    driver = create_driver(browser_name)
    failures = []
    checks = []

    def check(cid: str, ok: bool, detail: str):
        checks.append({"id": cid, "status": "PASS" if ok else "FAIL", "detail": detail})
        if not ok:
            failures.append(f"[{browser_name}] {cid}: {detail}")

    try:
        driver.set_window_size(1440, 900)
        driver.get(base_url + "/")
        wait_for_h1(driver)

        # Clear saved language so baseline starts cleanly on VI
        driver.execute_script("localStorage.removeItem('vinaxo_lang'); window.__qaSpaMarker = 'alive';")
        driver.get(base_url + "/")
        wait_for_h1(driver)
        driver.execute_script("window.__qaSpaMarker = 'alive';")

        # 1. Live SPA language switcher across all 4 languages without full reload
        seen_titles = {}
        seen_descs = {}
        for lang in LANGUAGES:
            switch_language(driver, lang["short"])
            snap = snapshot_page(driver)
            seen_titles[lang["code"]] = snap["title"]
            seen_descs[lang["code"]] = snap["desc"]
            check(
                f"SWITCH-{lang['code']}-SPA",
                snap["spaMarker"] == "alive"
                and snap["htmlLang"] == lang["htmlLang"]
                and snap["lsLang"] == lang["code"]
                and snap["ogLocale"] == lang["ogLocale"],
                f"marker={snap['spaMarker']}, htmlLang={snap['htmlLang']}, ls={snap['lsLang']}, ogLocale={snap['ogLocale']}",
            )
            check(
                f"FOOTER-LEGAL-{lang['code']}",
                lang["legal"] in snap["footerText"]
                and not any(b in snap["bodyText"] or b in snap["headHtml"] for b in BANNED_DUPLICATES),
                f"expected={lang['legal']}",
            )

        check(
            "UNIQUE-META-TITLES-HOME",
            len(set(seen_titles.values())) == 4 and len(set(seen_descs.values())) == 4,
            f"titles={len(set(seen_titles.values()))}/4, descs={len(set(seen_descs.values()))}/4",
        )

        # Reload persistence test in zh-CN
        driver.refresh()
        wait_for_h1(driver)
        snap_reload = snapshot_page(driver)
        check(
            "RELOAD-PERSIST-ZH",
            snap_reload["htmlLang"] == "zh-CN" and snap_reload["lsLang"] == "zh-CN",
            f"after reload htmlLang={snap_reload['htmlLang']}, ls={snap_reload['lsLang']}",
        )

        # 2. All public routes x 4 languages audit
        for lang in LANGUAGES:
            driver.get(base_url + "/")
            wait_for_h1(driver)
            switch_language(driver, lang["short"])

            for route in PUBLIC_ROUTES:
                driver.get(base_url + route)
                wait_for_h1(driver)
                snap = snapshot_page(driver)

                expected_canon = f"https://www.vinaxo.net{route}" if route != "/" else "https://www.vinaxo.net/"
                dup_found = [b for b in BANNED_DUPLICATES if b in snap["bodyText"] or b in snap["headHtml"]]
                key_leaks = [p for p in LEAKED_KEY_PREFIXES if f" {p}" in snap["bodyText"]]

                check(
                    f"ROUTE-{lang['code']}-{route}",
                    snap["htmlLang"] == lang["htmlLang"]
                    and snap["canonicalCount"] == 1
                    and snap["canonical"] == expected_canon
                    and len(snap["h1"]) > 0
                    and len(dup_found) == 0
                    and len(key_leaks) == 0
                    and len(snap["brokenImgs"]) == 0,
                    f"lang={snap['htmlLang']}, canon={snap['canonical']}, dup={dup_found}, leaks={key_leaks}, brokenImgs={snap['brokenImgs']}",
                )

                if route == "/brochure":
                    has_pdf = "/brochures/vinaxo-company-brochure-2026.pdf" in driver.page_source
                    if lang["code"] in ("vi", "ko", "zh-CN"):
                        note_text = driver.execute_script(
                            "return document.querySelector('[role=\"note\"]')?.innerText?.trim() || '';"
                        )
                        notice_ok = bool(note_text) and ("2026" in note_text)
                    else:
                        notice_ok = True
                    check(
                        f"BROCHURE-{lang['code']}",
                        has_pdf and notice_ok,
                        f"has_pdf={has_pdf}, notice_ok={notice_ok}",
                    )

                if route == "/contact":
                    check(
                        f"CONTACT-LEGAL-{lang['code']}",
                        lang["legal"] in snap["bodyText"] and len(dup_found) == 0,
                        f"legal_present={lang['legal'] in snap['bodyText']}, dup={dup_found}",
                    )

                if save_screenshots and browser_name == "chrome" and route in ("/", "/products", "/brochure", "/contact"):
                    shot_slug = "home" if route == "/" else route.strip("/")
                    driver.set_window_size(1440, 900)
                    time.sleep(0.2)
                    save_shot(driver, lang["code"], f"desktop-{shot_slug}.png")
                    driver.set_window_size(390, 844)
                    time.sleep(0.25)
                    save_shot(driver, lang["code"], f"mobile-{shot_slug}.png")
                    driver.set_window_size(1440, 900)

            # Product modal interaction in each language
            driver.get(base_url + "/products")
            wait_for_h1(driver)
            modal_opened = driver.execute_script("""
                const btns = Array.from(document.querySelectorAll('button'));
                const detailBtn = btns.find(b => b.textContent && (
                    b.textContent.includes('Xem thông số') ||
                    b.textContent.includes('View Specifications') ||
                    b.textContent.includes('제품 규격') ||
                    b.textContent.includes('查看技术规格')
                ));
                if (!detailBtn) return false;
                detailBtn.click();
                return true;
            """)
            time.sleep(0.35)
            modal_h2 = driver.execute_script("return document.querySelector('[role=\"dialog\"] h2')?.textContent?.trim() || '';")
            check(f"PRODUCT-MODAL-{lang['code']}", bool(modal_opened and len(modal_h2) > 0), f"opened={modal_opened}, h2={modal_h2}")

        # 3. Responsive viewport matrix across all 4 languages on /, /products, /contact
        key_routes_for_viewports = ["/", "/products", "/contact"]
        for lang in LANGUAGES:
            driver.set_window_size(1440, 900)
            driver.get(base_url + "/")
            wait_for_h1(driver)
            switch_language(driver, lang["short"])
            for route in key_routes_for_viewports:
                driver.get(base_url + route)
                wait_for_h1(driver)
                for w, h in RESPONSIVE_VIEWPORTS:
                    driver.set_window_size(w, h)
                    time.sleep(0.12)
                    dims = driver.execute_script("return {sw: document.documentElement.scrollWidth, iw: window.innerWidth};")
                    ok = dims["sw"] <= dims["iw"] + 1
                    if not ok:
                        check(f"OVERFLOW-{lang['code']}-{route}-{w}x{h}", False, f"scrollWidth={dims['sw']} > innerWidth={dims['iw']}")
            check(f"OVERFLOW-MATRIX-{lang['code']}", not any(f"[{browser_name}] OVERFLOW-{lang['code']}" in f for f in failures), "all 10 viewports x 3 key routes <= innerWidth+1")

        # 4. Browser console severe errors check
        logs = driver.get_log("browser")
        severe = [l["message"] for l in logs if l.get("level") == "SEVERE"]
        check("CONSOLE-NO-SEVERE", len(severe) == 0, f"severe_count={len(severe)}: {severe[:3]}")

    finally:
        driver.quit()

    return {"browser": browser_name, "passed": len([c for c in checks if c["status"] == "PASS"]), "total": len(checks), "failures": failures, "checks": checks}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4173")
    parser.add_argument("--browsers", default="chrome,edge")
    parser.add_argument("--save-screenshots", action="store_true")
    parser.add_argument("--report-json", default="")
    args = parser.parse_args()

    browsers = [b.strip().lower() for b in args.browsers.split(",") if b.strip()]
    results = []
    all_failures = []
    for browser in browsers:
        res = run_browser_qa(browser, args.base_url.rstrip("/"), args.save_screenshots)
        results.append(res)
        all_failures.extend(res["failures"])
        print(f"[{browser.upper()}] {res['passed']}/{res['total']} checks passed.", flush=True)

    summary = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "baseUrl": args.base_url,
        "results": results,
    }
    if args.report_json:
        os.makedirs(os.path.dirname(args.report_json), exist_ok=True)
        with open(args.report_json, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)

    if all_failures:
        print("\nFAILURES:")
        for fail in all_failures:
            print(" -", fail)
        sys.exit(1)
    print("\nALL MULTILINGUAL BROWSER QA CHECKS PASSED.")


if __name__ == "__main__":
    main()
