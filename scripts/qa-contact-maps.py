import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from urllib.parse import quote
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\contact-qa"
EXPECTED_COORDS_RAW = "10.380295,106.516139"
EXPECTED_COORDS_ENC = quote(EXPECTED_COORDS_RAW, safe="")

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
    time.sleep(0.4)


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
        driver.get(base_url + "/")
        wait_for_h1(driver)
        driver.execute_script("localStorage.setItem('vinaxo_lang', 'vi');")
        driver.get(base_url + "/contact")
        wait_for_h1(driver)

        # 1. Website URL audit (Footer & Contact)
        url_audit = driver.execute_script("""
            const badLinks = [];
            const websiteLinks = [];
            for (const a of document.querySelectorAll('a[href]')) {
                const href = a.getAttribute('href') || '';
                const lower = href.toLowerCase();
                if (lower.includes('vinaxo.net')) {
                    const isAbs = lower.startsWith('https://www.vinaxo.net/') || lower === 'https://www.vinaxo.net' || lower.startsWith('https://vinaxo.net/') || lower === 'https://vinaxo.net';
                    let pathHasDomain = false;
                    try {
                        pathHasDomain = new URL(href, window.location.origin).pathname.toLowerCase().includes('vinaxo.net');
                    } catch {
                        pathHasDomain = true;
                    }
                    if (!isAbs || pathHasDomain) {
                        badLinks.push(href);
                    }
                    websiteLinks.push({ href, target: a.getAttribute('target'), rel: a.getAttribute('rel') || '' });
                }
            }
            return { badLinks, websiteLinks };
        """)
        check(
            "CT-23-24-25-WEBSITE-URLS",
            len(url_audit["badLinks"]) == 0
            and len(url_audit["websiteLinks"]) >= 2
            and all(
                l["href"].startswith("https://www.vinaxo.net") and "noopener" in l["rel"]
                for l in url_audit["websiteLinks"]
            ),
            f"bad={url_audit['badLinks']}, websiteLinks={url_audit['websiteLinks']}",
        )

        # 2. Google Maps consistency (iframe + Open Maps + Directions)
        maps_audit = driver.execute_script("""
            const iframe = document.querySelector('iframe.contact-map-frame')?.getAttribute('src') || '';
            const mapLinks = Array.from(document.querySelectorAll('a[href*="google.com/maps"]')).map(a => a.getAttribute('href') || '');
            return { iframe, mapLinks };
        """)
        coords_ok = (
            (EXPECTED_COORDS_RAW in maps_audit["iframe"] or EXPECTED_COORDS_ENC in maps_audit["iframe"])
            and len(maps_audit["mapLinks"]) >= 2
            and all((EXPECTED_COORDS_RAW in u or EXPECTED_COORDS_ENC in u) for u in maps_audit["mapLinks"])
            and any("/maps/search/" in u for u in maps_audit["mapLinks"])
            and any("/maps/dir/" in u for u in maps_audit["mapLinks"])
            and all("V%C4%A9nh+B%C3%ACnh" not in u for u in maps_audit["mapLinks"])
        )
        check("CT-26-27-28-GOOGLE-MAPS", coords_ok, f"iframe={maps_audit['iframe']}, links={maps_audit['mapLinks']}")

        # 3. Unified required fields + floating widget hidden on /contact
        form_audit = driver.execute_script("""
            const nameReq = document.getElementById('contactName')?.hasAttribute('required');
            const emailEl = document.getElementById('contactEmail');
            const msgReq = document.getElementById('contactMessage')?.hasAttribute('required');
            const phoneEl = document.getElementById('contactPhone');
            const compReq = document.getElementById('contactCompany')?.hasAttribute('required');
            const typeReq = document.getElementById('contactInquiryType')?.hasAttribute('required');
            const floatHidden = document.querySelector('.floating-b2b-speed-dial')?.classList.contains('is-footer-visible');
            return {
                nameReq,
                emailReq: emailEl?.hasAttribute('required'),
                emailType: emailEl?.getAttribute('type'),
                emailMode: emailEl?.getAttribute('inputmode'),
                msgReq,
                phoneReq: phoneEl?.hasAttribute('required'),
                phoneType: phoneEl?.getAttribute('type'),
                phoneMode: phoneEl?.getAttribute('inputmode'),
                compReq,
                typeReq,
                floatHidden,
            };
        """)
        check(
            "CT-05-10-32-CONTACT-FIELDS",
            bool(
                form_audit["nameReq"]
                and form_audit["emailReq"]
                and form_audit["msgReq"]
                and not form_audit["phoneReq"]
                and not form_audit["compReq"]
                and not form_audit["typeReq"]
                and form_audit["emailType"] == "email"
                and form_audit["phoneType"] == "tel"
                and form_audit["floatHidden"]
            ),
            str(form_audit),
        )

        # 4. Contact form invalid email rejection & valid submit without phone/company (no mailto navigation)
        driver.find_element(By.ID, "contactName").send_keys("VINAXO QA Contact")
        driver.find_element(By.ID, "contactEmail").send_keys("invalid-email")
        driver.find_element(By.ID, "contactMessage").send_keys("Requesting catalog pricing.")
        driver.execute_script("document.getElementById('contactSubmitBtn').click();")
        time.sleep(0.25)
        invalid_alert = driver.execute_script("return document.querySelector('#quote-form [role=\"alert\"]')?.innerText || '';")
        check("CT-10-EMAIL-REJECT", len(invalid_alert.strip()) > 0, f"alert={invalid_alert.strip()}")

        # Fix email, keep Phone/Company empty, submit -> must hit /api/contact without opening mailto
        email_el = driver.find_element(By.ID, "contactEmail")
        email_el.clear()
        email_el.send_keys("qa-test@vinaxo.test")
        driver.execute_script("""
            window.__apiContactCalls = 0;
            const origFetch = window.fetch;
            window.fetch = function(input, init) {
                if (typeof input === 'string' && input.includes('/api/contact')) {
                    window.__apiContactCalls++;
                }
                return origFetch.apply(this, arguments);
            };
            document.getElementById('contactSubmitBtn').click();
        """)
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script(
                "const s = document.querySelector('#quote-form [role=\"status\"], #quote-form [role=\"alert\"]'); return Boolean(s && s.innerText.trim());"
            )
        )
        post_submit = driver.execute_script("""
            const statusText = document.querySelector('#quote-form [role="status"], #quote-form [role="alert"]')?.innerText || '';
            return {
                href: window.location.pathname,
                apiCalls: window.__apiContactCalls || 0,
                keptName: document.getElementById('contactName')?.value || '',
                keptMsg: document.getElementById('contactMessage')?.value || '',
                statusText
            };
        """)
        check(
            "CT-01-02-08-09-16-DIRECT-DISPATCH",
            post_submit["href"] == "/contact"
            and post_submit["apiCalls"] == 1
            and post_submit["keptName"] == "VINAXO QA Contact"
            and "Requesting catalog pricing." in post_submit["keptMsg"],
            str(post_submit),
        )

        if save_screenshots and browser_name == "chrome":
            os.makedirs(SCREENSHOT_ROOT, exist_ok=True)
            driver.set_window_size(1440, 900)
            time.sleep(0.25)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "contact-desktop-1440.png"))
            driver.execute_script("document.querySelector('.contact-map-section')?.scrollIntoView({block:'center'});")
            time.sleep(0.35)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "maps-desktop-1440.png"))
            driver.set_window_size(390, 844)
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "maps-mobile-390.png"))
            driver.set_window_size(1440, 900)

        # 5. QuoteModal stale-product binding & mid-form language switch test on /products
        driver.get(base_url + "/products")
        wait_for_h1(driver)
        # Click Quote on 1st card
        driver.execute_script("document.querySelectorAll('.product-card button.btn-primary')[0].click();")
        WebDriverWait(driver, 10).until(lambda d: len(d.find_elements(By.ID, "quoteProduct")) > 0)
        first_sel = driver.execute_script("return document.getElementById('quoteProduct')?.value || '';")
        first_preview = driver.execute_script("return document.querySelector('[data-testid=\"selected-product-preview\"]')?.innerText || '';")
        driver.execute_script("document.querySelector('button[aria-label*=\"Close\"], button[aria-label*=\"Đóng\"]')?.click();")
        time.sleep(0.25)

        # Click Quote on 2nd card (Banana Chips)
        driver.execute_script("document.querySelectorAll('.product-card button.btn-primary')[1].click();")
        WebDriverWait(driver, 10).until(lambda d: len(d.find_elements(By.ID, "quoteProduct")) > 0)
        second_sel = driver.execute_script("return document.getElementById('quoteProduct')?.value || '';")

        # Enter text into QuoteModal, then close? No, keep modal? Wait - Header is under modal backdrop! Close or keep?
        # Wait: let's test optional phone inside QuoteModal first, then test language switch preservation on /contact!
        q_phone_req = driver.execute_script("return document.getElementById('quotePhone')?.hasAttribute('required');")
        q_msg_req = driver.execute_script("return document.getElementById('quoteMessage')?.hasAttribute('required');")
        driver.find_element(By.ID, "quoteName").send_keys("Buyer Quote Test")
        driver.find_element(By.ID, "quoteEmail").send_keys("buyer-qa@vinaxo.test")
        # Leave phone blank, omit message -> fails validation
        driver.execute_script("document.querySelector('[role=\"dialog\"] button[type=\"submit\"]').click();")
        time.sleep(0.2)
        q_missing_msg_alert = driver.execute_script("return document.querySelector('[role=\"dialog\"] [role=\"alert\"]')?.innerText || '';")
        if save_screenshots and browser_name == "chrome":
            driver.set_window_size(390, 844)
            time.sleep(0.25)
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "quote-modal-mobile-390.png"))
            driver.set_window_size(1440, 900)
        check(
            "CT-04-08-QUOTEMODAL-BINDING",
            first_sel == "soft-dried-red-dragonfruit"
            and "Thanh long" in first_preview
            and second_sel == "banana-chips"
            and not q_phone_req
            and bool(q_msg_req)
            and len(q_missing_msg_alert.strip()) > 0,
            f"first={first_sel}, second={second_sel}, phoneReq={q_phone_req}, msgReq={q_msg_req}",
        )

        # Mid-form language switch preservation test on /contact
        driver.get(base_url + "/contact?product=soft-dried-red-dragonfruit")
        wait_for_h1(driver)
        driver.find_element(By.ID, "contactName").send_keys("Preserved Buyer")
        driver.find_element(By.ID, "contactEmail").send_keys("preserve@vinaxo.test")
        driver.find_element(By.ID, "contactMessage").send_keys("Need 1x20ft quote.")
        switch_language(driver, "KO")
        preserved = driver.execute_script("""
            return {
                htmlLang: document.documentElement.lang,
                name: document.getElementById('contactName')?.value || '',
                email: document.getElementById('contactEmail')?.value || '',
                msg: document.getElementById('contactMessage')?.value || '',
                prod: document.getElementById('contactProduct')?.value || ''
            };
        """)
        check(
            "CT-34-MIDFORM-LOCALE-PRESERVE",
            preserved["htmlLang"] == "ko"
            and preserved["name"] == "Preserved Buyer"
            and preserved["email"] == "preserve@vinaxo.test"
            and preserved["msg"] == "Need 1x20ft quote."
            and preserved["prod"] == "soft-dried-red-dragonfruit",
            str(preserved),
        )

        # 6. Responsive viewports + 125%/150% DPI scaling checks on /contact
        overflows = []
        for w, h in VIEWPORTS:
            driver.set_window_size(w, h)
            time.sleep(0.15)
            dims = driver.execute_script("return {sw: document.documentElement.scrollWidth, iw: window.innerWidth};")
            if dims["sw"] > dims["iw"] + 1:
                overflows.append(f"{w}x{h}:{dims['sw']}>{dims['iw']}")
        for scale in (1.25, 1.5):
            driver.execute_cdp_cmd(
                "Emulation.setDeviceMetricsOverride",
                {"width": 1440, "height": 900, "deviceScaleFactor": scale, "mobile": False},
            )
            time.sleep(0.15)
            dims = driver.execute_script("return {sw: document.documentElement.scrollWidth, iw: window.innerWidth};")
            if dims["sw"] > dims["iw"] + 1:
                overflows.append(f"scale-{scale}:{dims['sw']}>{dims['iw']}")
        driver.execute_cdp_cmd("Emulation.clearDeviceMetricsOverride", {})
        check("CT-30-33-RESPONSIVE-SCALING", len(overflows) == 0, f"overflows={overflows}")

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
        print(f"[{browser.upper()}] {res['passed']}/{res['total']} contact & maps QA checks passed.", flush=True)

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
    print("\nALL CONTACT, QUOTATION & GOOGLE MAPS BROWSER QA CHECKS PASSED.")


if __name__ == "__main__":
    main()
