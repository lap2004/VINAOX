import os
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

ARTIFACTS_DIR = r"C:\Users\lapth\.gemini\antigravity\brain\748a868d-9054-4bce-b4f2-d938019ff772"

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--window-size=1440,900")
chrome_options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

driver = webdriver.Chrome(options=chrome_options)
try:
    print("Navigating to https://vinaxo.net...")
    driver.get("https://vinaxo.net")
    time.sleep(3)

    print("Title:", driver.title)
    
    root_el = driver.find_element("id", "root")
    root_html = root_el.get_attribute("innerHTML")
    print(f"Root innerHTML length: {len(root_html)}")
    print(f"Root innerHTML preview: {root_html[:300]}")

    screenshot_path = os.path.join(ARTIFACTS_DIR, "live_prod_diagnostic.png")
    driver.save_screenshot(screenshot_path)
    print(f"Saved screenshot to {screenshot_path}")

    logs = driver.get_log("browser")
    print("\n=== BROWSER CONSOLE LOGS ===")
    if not logs:
        print("No console logs captured.")
    for entry in logs:
        print(f"[{entry.get('level')}] {entry.get('message')}")
    print("============================\n")

    # Also check /tin-tuc/press-nld-mango-sourcing
    print("Navigating to https://vinaxo.net/tin-tuc/press-nld-mango-sourcing...")
    driver.get("https://vinaxo.net/tin-tuc/press-nld-mango-sourcing")
    time.sleep(3)
    article_logs = driver.get_log("browser")
    print("\n=== ARTICLE PAGE CONSOLE LOGS ===")
    for entry in article_logs:
        print(f"[{entry.get('level')}] {entry.get('message')}")
    print("=================================\n")

finally:
    driver.quit()
