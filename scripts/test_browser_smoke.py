import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

ARTIFACTS_DIR = r"C:\Users\lapth\.gemini\antigravity\brain\748a868d-9054-4bce-b4f2-d938019ff772"
BASE_URL = os.environ.get("TARGET_BASE_URL", "https://vinaxo.net")

PAGES_TO_TEST = [
    {"path": "/", "name": "home", "expected_tag": "header"},
    {"path": "/news", "name": "news_list", "expected_tag": "header"},
    {"path": "/tin-tuc/press-nld-mango-sourcing", "name": "article_detail", "expected_tag": "header"},
    {"path": "/products", "name": "products_list", "expected_tag": "header"},
    {"path": "/products/soft-dried-red-dragonfruit", "name": "product_detail", "expected_tag": "header"},
    {"path": "/about", "name": "about", "expected_tag": "header"},
    {"path": "/quality", "name": "quality", "expected_tag": "header"},
    {"path": "/contact", "name": "contact", "expected_tag": "header"},
    {"path": "/brochure", "name": "brochure", "expected_tag": "header"},
    {"path": "/admin/login", "name": "admin_login", "expected_tag": "form"}
]

def run_smoke_tests():
    print(f"=== VINAXO AUTOMATED BROWSER SMOKE TEST SUITE ===")
    print(f"Target URL: {BASE_URL}")
    print(f"Artifacts output: {ARTIFACTS_DIR}\n")

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--window-size=1440,900")
    chrome_options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

    driver = webdriver.Chrome(options=chrome_options)
    passed = 0
    total = len(PAGES_TO_TEST)

    try:
        for page in PAGES_TO_TEST:
            target_url = f"{BASE_URL}{page['path']}"
            print(f"Testing {page['name']} at {target_url} ...")

            driver.get(target_url)
            time.sleep(2.5)

            # 1. Check title
            title = driver.title
            assert title and "VINAXO" in title, f"Title missing 'VINAXO': {title}"

            # 2. Check root element
            root_el = driver.find_element(By.ID, "root")
            root_html = root_el.get_attribute("innerHTML")
            assert root_html and len(root_html) > 500, f"Root innerHTML empty or too small ({len(root_html)} chars)"

            # 3. Check expected structural tag
            driver.find_element(By.TAG_NAME, page["expected_tag"])

            # 4. Check console errors (ignoring benign permissions-policy warnings)
            logs = driver.get_log("browser")
            severe_errors = [
                l for l in logs 
                if l.get("level") == "SEVERE" and "favicon.ico" not in l.get("message", "")
            ]
            if severe_errors:
                print(f"  [WARN] Severe console errors detected on {page['path']}: {severe_errors}")

            # 5. Capture screenshot
            screenshot_file = os.path.join(ARTIFACTS_DIR, f"smoke_{page['name']}.png")
            driver.save_screenshot(screenshot_file)
            print(f"  [PASS] {page['name']} (DOM size: {len(root_html)} chars, screenshot saved)")
            passed += 1

    finally:
        driver.quit()

    print(f"\n========================================")
    print(f"SMOKE TEST RESULTS: {passed}/{total} PASSED")
    print(f"========================================\n")

    if passed != total:
        sys.exit(1)

if __name__ == "__main__":
    run_smoke_tests()
