import time
import subprocess
import sys
import os
import urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

ARTIFACTS_DIR = r"C:\Users\lapth\.gemini\antigravity\brain\748a868d-9054-4bce-b4f2-d938019ff772"
PORT = 4173
BASE_URL = f"http://localhost:{PORT}"

def wait_for_server(url, timeout=15):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as response:
                if response.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def main():
    print(f"Starting Vite preview server on port {PORT}...")
    server_process = subprocess.Popen(
        ["npm.cmd", "run", "preview", "--", "--port", str(PORT)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=os.getcwd()
    )

    try:
        if not wait_for_server(BASE_URL):
            print("ERROR: Server failed to start within timeout.")
            sys.exit(1)
        print("Preview server is live!")

        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1440,900")
        chrome_options.add_argument("--no-sandbox")

        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(10)

        print("\n=== TEST 1: Protected route /admin/dashboard redirects to /admin/login ===")
        driver.get(f"{BASE_URL}/admin/dashboard")
        time.sleep(1.5)
        current_url = driver.current_url
        print(f"Current URL after navigating to /admin/dashboard: {current_url}")
        assert "/admin/login" in current_url, f"Expected redirect to /admin/login, got {current_url}"
        print("PASS: Protected route redirected unauthenticated visitor to /admin/login.")

        print("\n=== TEST 2: Admin Login page elements ===")
        h1 = driver.find_element(By.TAG_NAME, "h1")
        print(f"H1 Title: {h1.text}")
        assert "QUẢN TRỊ NỘI DUNG VINAXO" in h1.text, "H1 title did not match"

        # Check input fields
        username_input = driver.find_element(By.CSS_SELECTOR, "input[type='text']")
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        back_link = driver.find_element(By.LINK_TEXT, "Quay về Website chính VINAXO")
        
        print("PASS: Username, Password, Submit button and Back link are present.")

        # Test show/hide password toggle
        toggle_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Hiện mật khẩu']")
        toggle_btn.click()
        time.sleep(0.3)
        assert password_input.get_attribute("type") == "text", "Password input type should become 'text' after toggle"
        print("PASS: Password toggle switches input type to 'text'.")

        toggle_btn.click()
        time.sleep(0.3)
        assert password_input.get_attribute("type") == "password", "Password input type should return to 'password'"
        print("PASS: Password toggle switches back to 'password'.")

        # Desktop screenshot
        desktop_shot = os.path.join(ARTIFACTS_DIR, "custom_admin_login_desktop.png")
        driver.save_screenshot(desktop_shot)
        print(f"Saved screenshot: {desktop_shot}")

        # Mobile viewport 390x844
        print("\n=== TEST 3: Mobile responsiveness for /admin/login ===")
        driver.set_window_size(390, 844)
        time.sleep(1)
        mobile_shot = os.path.join(ARTIFACTS_DIR, "custom_admin_login_mobile.png")
        driver.save_screenshot(mobile_shot)
        print(f"Saved screenshot: {mobile_shot}")

        # Public news page verification
        print("\n=== TEST 4: Public news & articles verification ===")
        driver.set_window_size(1440, 900)
        driver.get(f"{BASE_URL}/news")
        time.sleep(2)
        news_cards = driver.find_elements(By.CSS_SELECTOR, "article, a[href*='/tin-tuc/'], a[href*='/news/']")
        print(f"Found {len(news_cards)} news card elements on /news.")
        assert len(news_cards) > 0, "News cards should render on /news"
        news_shot = os.path.join(ARTIFACTS_DIR, "custom_admin_public_news.png")
        driver.save_screenshot(news_shot)
        print(f"Saved screenshot: {news_shot}")

        print("\nALL BROWSER AUTOMATION TESTS COMPLETED SUCCESSFULLY!")
        driver.quit()

    finally:
        print("Stopping preview server...")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    main()
