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

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\market-terminology"

LANGUAGES = [
    {
        "code": "vi",
        "short": "VI",
        "labelPhrase": "mẫu thiết kế nhãn mác",
        "ctaPhrase": "FOB/CIF",
    },
    {
        "code": "en",
        "short": "EN",
        "labelPhrase": "label design mockup",
        "ctaPhrase": "FOB/CIF",
    },
    {
        "code": "ko",
        "short": "KO",
        "labelPhrase": "라벨 디자인 시안",
        "ctaPhrase": "FOB/CIF",
    },
    {
        "code": "zh-CN",
        "short": "ZH",
        "labelPhrase": "标签设计样稿",
        "ctaPhrase": "FOB / CIF",
    },
]

VIEWPORTS = [
    (320, 568),
    (360, 800),
    (390, 844),
    (430, 932),
    (768, 1024),
    (1024, 768),
    (1366, 768),
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


def run_browser_qa(browser_name: str, base_url: str, save_screenshots: bool):
    driver = create_driver(browser_name)
    checks = []
    failures = []

    def check(cid: str, ok: bool, detail: str):
        checks.append({"id": cid, "status": "PASS" if ok else "FAIL", "detail": detail})
        if not ok:
            failures.append(f"[{browser_name}] {cid}: {detail}")

    try:
        driver.set_window_size(1440, 900)
        driver.get(base_url + "/markets")
        wait_for_h1(driver)

        # 1. Verify all 4 locales on /markets
        for lang in LANGUAGES:
            switch_language(driver, lang["short"])
            text = driver.execute_script("return document.body.innerText;")
            has_fcl_cif = "FCL/CIF" in text or "FCL / CIF" in text or "CIF/FCL" in text
            has_market_typos = "market nhãn mác" in text.lower() or "maket nhãn mác" in text.lower()
            has_label = lang["labelPhrase"] in text
            has_cta = lang["ctaPhrase"] in text
            has_separated = "FOB" in text and "CIF" in text and "FCL" in text and "LCL" in text

            check(
                f"MARKET-TERMS-{lang['code']}",
                not has_fcl_cif and not has_market_typos and has_label and has_cta and has_separated,
                f"fcl_cif={has_fcl_cif}, typo={has_market_typos}, label={has_label}, cta={has_cta}, sep={has_separated}",
            )

            if save_screenshots and browser_name == "chrome":
                os.makedirs(SCREENSHOT_ROOT, exist_ok=True)
                if lang["code"] == "vi":
                    driver.execute_script("const el = Array.from(document.querySelectorAll('p')).find(p => p.innerText.includes('mẫu thiết kế nhãn mác')); if (el) el.scrollIntoView({block:'center'});")
                    time.sleep(0.3)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-markets-step2-vi.png"))
                    driver.execute_script("const el = document.querySelector('.subpage-cta-section'); if (el) el.scrollIntoView({block:'center'});")
                    time.sleep(0.3)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-markets-cta-vi.png"))
                    driver.execute_script("const el = document.querySelector('.logistics-bar'); if (el) el.scrollIntoView({block:'start'});")
                    time.sleep(0.3)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-markets-logistics-vi.png"))
                elif lang["code"] in ("ko", "zh-CN"):
                    driver.execute_script("const el = document.querySelector('.logistics-bar'); if (el) el.scrollIntoView({block:'start'});")
                    time.sleep(0.3)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, f"after-markets-{lang['code'].lower()}.png"))

        # 2. Verify /contact Trade Term & Shipping Mode strict separation & optionality
        switch_language(driver, "VI")
        driver.get(base_url + "/contact")
        wait_for_h1(driver)
        contact_audit = driver.execute_script("""
            const tt = document.getElementById('contactTradeTerm');
            const sm = document.getElementById('contactShippingMode');
            const ttOpts = tt ? Array.from(tt.options).map(o => o.value) : [];
            const smOpts = sm ? Array.from(sm.options).map(o => o.value) : [];
            const txt = document.body.innerText;
            return {
                ttExists: Boolean(tt),
                smExists: Boolean(sm),
                ttReq: tt?.hasAttribute('required') ?? true,
                smReq: sm?.hasAttribute('required') ?? true,
                ttOpts,
                smOpts,
                hasBadPair: txt.includes('FCL/CIF') || txt.includes('market nhãn mác')
            };
        """)
        check(
            "MARKET-CONTACT-DROPDOWNS",
            contact_audit["ttExists"]
            and contact_audit["smExists"]
            and not contact_audit["ttReq"]
            and not contact_audit["smReq"]
            and set(["FOB", "CIF", "CONSULT"]).issubset(set(contact_audit["ttOpts"]))
            and "FCL" not in contact_audit["ttOpts"]
            and "LCL" not in contact_audit["ttOpts"]
            and set(["FCL", "LCL", "CONSULT"]).issubset(set(contact_audit["smOpts"]))
            and "FOB" not in contact_audit["smOpts"]
            and "CIF" not in contact_audit["smOpts"]
            and not contact_audit["hasBadPair"],
            str(contact_audit),
        )
        if save_screenshots and browser_name == "chrome":
            driver.execute_script("document.getElementById('contactTradeTerm')?.scrollIntoView({block:'center'});")
            time.sleep(0.25)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-contact-trade-shipping-vi.png"))

        # 3. Responsive check across all viewports on /markets (KO & VI)
        overflows = []
        driver.get(base_url + "/markets")
        wait_for_h1(driver)
        for lang_short in ("VI", "KO", "ZH"):
            switch_language(driver, lang_short)
            for w, h in VIEWPORTS:
                driver.set_window_size(w, h)
                time.sleep(0.1)
                dims = driver.execute_script("return {sw: document.documentElement.scrollWidth, iw: window.innerWidth};")
                if dims["sw"] > dims["iw"] + 1:
                    overflows.append(f"{lang_short}-{w}x{h}:{dims['sw']}>{dims['iw']}")
            driver.set_window_size(1440, 900)
        check("MARKET-RESPONSIVE-VIEWPORTS", len(overflows) == 0, f"overflows={overflows}")

        # 4. Console severe error check
        severe = [l["message"] for l in driver.get_log("browser") if l.get("level") == "SEVERE"]
        check("MARKET-CONSOLE-CLEAN", len(severe) == 0, f"severe={len(severe)}")

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
        print(f"[{browser.upper()}] {res['passed']}/{res['total']} market terminology QA checks passed.", flush=True)

    summary = {"timestamp": datetime.now(timezone.utc).isoformat(), "baseUrl": args.base_url, "results": results}
    if args.report_json:
        os.makedirs(os.path.dirname(args.report_json), exist_ok=True)
        with open(args.report_json, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)

    if all_failures:
        print("\nFAILURES:")
        for fail in all_failures:
            print(" -", fail)
        sys.exit(1)
    print("\nALL MARKET LOGISTICS & TERMINOLOGY QA CHECKS PASSED.")


if __name__ == "__main__":
    main()
