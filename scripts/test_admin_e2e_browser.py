import glob
import json
import os
import subprocess
import sys
import time
import urllib.request
import zlib
import struct
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

PORT = 4174
BASE_URL = f"http://127.0.0.1:{PORT}"
TEST_PASS = "VinaxoE2ETest_2026!"
ARTIFACTS_DIR = r"C:\Users\lapth\.gemini\antigravity\brain\748a868d-9054-4bce-b4f2-d938019ff772"

def create_valid_png(path):
    # Generate a valid 32x32 orange RGB PNG file for Canvas->WebP upload test
    w, h = 32, 32
    raw_data = b"".join(b"\x00" + (b"\xf4\xa8\x3a" * w) for _ in range(h))
    def chunk(tag, data):
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    ihdr = chunk(b"IHDR", struct.pack("!IIBBBBB", w, h, 8, 2, 0, 0, 0))
    idat = chunk(b"IDAT", zlib.compress(raw_data))
    iend = chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + ihdr + idat + iend)

def wait_for_server(url, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as r:
                if r.status == 200:
                    return True
        except Exception:
            time.sleep(0.4)
    return False

def main():
    temp_img = os.path.abspath("scripts/_temp_e2e_test.png")
    create_valid_png(temp_img)

    env = os.environ.copy()
    env["E2E_PORT"] = str(PORT)
    env["E2E_ADMIN_PASS"] = TEST_PASS

    cached_tsx = glob.glob(os.path.join(os.environ.get("LOCALAPPDATA", ""), "npm-cache", "_npx", "*", "node_modules", ".bin", "tsx.cmd"))
    tsx_cmd = [cached_tsx[0], "scripts/test-e2e-server.mjs"] if cached_tsx else ["npx.cmd", "--yes", "tsx", "scripts/test-e2e-server.mjs"]
    print("Starting E2E integration server using:", tsx_cmd[0])
    server_proc = subprocess.Popen(
        tsx_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        cwd=os.getcwd()
    )

    try:
        if not wait_for_server(BASE_URL, timeout=45):
            if os.name == "nt":
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            out, err = server_proc.communicate(timeout=3)
            print("Server failed to boot:", out.decode(errors="ignore"), err.decode(errors="ignore"))
            sys.exit(1)
        print("E2E server live at", BASE_URL)

        chrome_opts = Options()
        chrome_opts.add_argument("--headless=new")
        chrome_opts.add_argument("--disable-gpu")
        chrome_opts.add_argument("--window-size=1440,900")
        chrome_opts.add_argument("--no-sandbox")
        driver = webdriver.Chrome(options=chrome_opts)
        driver.implicitly_wait(8)

        # 1. Draft isolation verification (public pages MUST NEVER expose draft!)
        print("\n=== TEST 1: Public Draft Isolation (/news, /, /tin-tuc/<draft>) ===")
        driver.get(f"{BASE_URL}/news")
        time.sleep(1.5)
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert "E2E Secret Draft" not in body_text, "CRITICAL: Draft article appeared on public /news!"
        print("PASS: /news excludes draft articles.")

        driver.get(f"{BASE_URL}/")
        time.sleep(1.2)
        home_text = driver.find_element(By.TAG_NAME, "body").text
        assert "E2E Secret Draft" not in home_text, "CRITICAL: Draft article appeared on Home page!"
        print("PASS: Home page excludes draft articles.")

        driver.get(f"{BASE_URL}/tin-tuc/e2e-secret-draft-verify")
        time.sleep(1.0)
        detail_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Không tìm thấy bài viết" in detail_text or "Article Not Found" in detail_text, "CRITICAL: Direct draft URL was accessible publicly!"
        print("PASS: Direct URL /tin-tuc/<draft-slug> returns Not Found cleanly.")

        # 2. Protected route redirect + Wrong password rejection
        print("\n=== TEST 2: Admin Protected Route & Wrong Password Rejection ===")
        driver.get(f"{BASE_URL}/admin/dashboard")
        time.sleep(1.2)
        assert "/admin/login" in driver.current_url, f"Expected redirect to /admin/login, got {driver.current_url}"
        driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("WrongPassword123")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1.0)
        assert "/admin/login" in driver.current_url
        assert "không chính xác" in driver.find_element(By.TAG_NAME, "body").text
        print("PASS: Invalid credentials rejected cleanly.")

        # 3. Valid Login -> Dashboard
        print("\n=== TEST 3: Valid Login & Dashboard Rendering ===")
        pw_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        pw_input.clear()
        pw_input.send_keys(TEST_PASS)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1.5)
        assert "/admin/dashboard" in driver.current_url, f"Expected redirect to /admin/dashboard, got {driver.current_url}"
        dash_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Tổng quan Quản trị VINAXO" in dash_text
        assert "VINAOX (feature/vinaxo-custom-admin)" in dash_text, "Repo & branch indicator missing on Dashboard"
        driver.save_screenshot(os.path.join(ARTIFACTS_DIR, "e2e_admin_dashboard_desktop.png"))
        print("PASS: Authenticated Dashboard renders with live Git repo & branch indicator.")

        # 4. News list shows Draft badge
        print("\n=== TEST 4: Admin News List & Draft Status Badge ===")
        driver.get(f"{BASE_URL}/admin/news")
        WebDriverWait(driver, 10).until(
            lambda d: "E2E Secret Draft" in d.find_element(By.TAG_NAME, "body").text
        )
        list_text = driver.find_element(By.TAG_NAME, "body").text
        assert "E2E Secret Draft" in list_text, "Admin must see drafts in CMS News List"
        assert "Bản nháp (Ẩn công khai)" in list_text, "Draft badge missing in Admin News List"
        print("PASS: Admin News List displays draft article with 'Bản nháp (Ẩn công khai)' badge.")

        # 5. Create New Article -> Live GitHub Mock Commit
        print("\n=== TEST 5: Create New Article & Verify Git Commit ===")
        driver.get(f"{BASE_URL}/admin/news/new")
        WebDriverWait(driver, 10).until(
            lambda d: len(d.find_elements(By.CSS_SELECTOR, "input[placeholder*='tiêu đề bài viết']")) > 0
        )
        title_inp = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='tiêu đề bài viết']")
        title_inp.send_keys("Vinaxo E2E Browser Publish Test 2026")
        time.sleep(0.5)
        slug_val = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='vi-du-xoai']").get_attribute("value")
        assert slug_val == "vinaxo-e2e-browser-publish-test-2026", f"Slug mismatch: {slug_val}"
        driver.find_element(By.XPATH, "//button[contains(., 'Xuất bản bài viết')]").click()
        WebDriverWait(driver, 15).until(lambda d: d.current_url.rstrip("/").endswith("/admin/news"))
        WebDriverWait(driver, 20).until(
            lambda d: "Vinaxo E2E Browser Publish Test 2026" in d.find_element(By.TAG_NAME, "body").text
        )
        print("PASS: Created article via Editor, committed to Git, and immediately synced in News List.")

        # 6. Upload Image in AdminMedia (Canvas -> WebP -> Git Commit)
        print("\n=== TEST 6: Upload Image via Media Library ===")
        driver.get(f"{BASE_URL}/admin/media")
        WebDriverWait(driver, 10).until(
            lambda d: len(d.find_elements(By.CSS_SELECTOR, "input[type='file']")) > 0
        )
        file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
        file_input.send_keys(temp_img)
        WebDriverWait(driver, 10).until(
            lambda d: "Upload ảnh thành công" in d.find_element(By.TAG_NAME, "body").text
        )
        media_text = driver.find_element(By.TAG_NAME, "body").text
        assert ".webp" in media_text, "Expected client canvas WebP conversion"
        driver.save_screenshot(os.path.join(ARTIFACTS_DIR, "e2e_admin_media_uploaded.png"))
        print("PASS: PNG image scaled/compressed to WebP and committed via API.")

        # 7. Products & Brochure tab routes
        print("\n=== TEST 7: Admin Products ('chips' filter) & Brochure Tab ===")
        driver.get(f"{BASE_URL}/admin/products")
        WebDriverWait(driver, 10).until(
            lambda d: len(d.find_elements(By.XPATH, "//button[contains(., 'Sấy giòn')]")) > 0
        )
        driver.find_element(By.XPATH, "//button[contains(., 'Sấy giòn')]").click()
        time.sleep(0.5)
        prod_text = driver.find_element(By.TAG_NAME, "body").text
        assert "banana-chips" in prod_text, "Chips filter should display banana-chips"

        driver.get(f"{BASE_URL}/admin/brochure")
        WebDriverWait(driver, 10).until(
            lambda d: "Cấu hình Hồ sơ năng lực (Brochure)" in d.find_element(By.TAG_NAME, "body").text
        )
        print("PASS: Products 'chips' filter and /admin/brochure tab work properly.")

        # 8. Mobile Responsive Drawer & Logout
        print("\n=== TEST 8: Mobile Admin Drawer & Secure Logout ===")
        driver.set_window_size(390, 844)
        driver.get(f"{BASE_URL}/admin/dashboard")
        WebDriverWait(driver, 10).until(
            lambda d: len([b for b in d.find_elements(By.CSS_SELECTOR, "button[aria-label='Mở menu quản trị']") if b.is_displayed()]) > 0
        )
        menu_btn = [b for b in driver.find_elements(By.CSS_SELECTOR, "button[aria-label='Mở menu quản trị']") if b.is_displayed()][0]
        menu_btn.click()
        time.sleep(0.5)
        driver.save_screenshot(os.path.join(ARTIFACTS_DIR, "e2e_admin_mobile_drawer.png"))
        logout_btns = [b for b in driver.find_elements(By.XPATH, "//button[@title='Đăng xuất']") if b.is_displayed()]
        assert len(logout_btns) > 0, "Visible logout button must exist in mobile drawer"
        logout_btns[0].click()
        WebDriverWait(driver, 10).until(lambda d: "/admin/login" in d.current_url)

        # Confirm session invalidated
        driver.get(f"{BASE_URL}/admin/dashboard")
        time.sleep(1.0)
        assert "/admin/login" in driver.current_url, "Session must stay invalidated after logout"
        print("PASS: Mobile drawer renders and Logout invalidates session cleanly.")

        # Verify GitHub Audit Log recorded actual PUT commits on feature/vinaxo-custom-admin
        with urllib.request.urlopen(f"{BASE_URL}/__e2e__/git-audit") as r:
            audit = json.loads(r.read().decode("utf-8"))
        print("\n=== Recorded GitHub Mock Commits ===")
        for c in audit["commits"]:
            print(f" - {c['method']} {c['path']} -> branch={c['branch']} | msg={c['message']}")
        assert any("vinaxo-e2e-browser-publish-test-2026.json" in c["path"] for c in audit["commits"])
        assert any("public/uploads/news/" in c["path"] for c in audit["commits"])

        print("\nALL E2E BROWSER & API INTEGRATION TESTS PASSED (100%)!")

    except Exception as e:
        try:
            err_shot = os.path.join(ARTIFACTS_DIR, "e2e_failure_debug.png")
            driver.save_screenshot(err_shot)
            print("Saved failure screenshot:", err_shot)
            print("Failure URL:", driver.current_url)
            print("Body snippet:", driver.find_element(By.TAG_NAME, "body").text[:600])
        except Exception:
            pass
        raise
    finally:
        try:
            driver.quit()
        except Exception:
            pass
        if os.name == "nt":
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            server_proc.terminate()
        try:
            server_proc.wait(timeout=5)
        except Exception:
            server_proc.kill()
        if os.path.exists(temp_img):
            os.remove(temp_img)

if __name__ == "__main__":
    main()
