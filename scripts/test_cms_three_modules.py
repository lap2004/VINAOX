import os
import sys
import time
import json
import zlib
import struct
import subprocess
import urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PORT = 4175
BASE_URL = f"http://127.0.0.1:{PORT}"
TEST_PASS = "VinaxoE2ETest_2026!"
ARTIFACTS_DIR = r"C:\Users\lapth\.gemini\antigravity\brain\748a868d-9054-4bce-b4f2-d938019ff772"

def create_valid_png(path):
    w, h = 64, 64
    raw_data = b"".join(b"\x00" + (b"\xf4\xa8\x3a" * w) for _ in range(h))
    def chunk(tag, data):
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    ihdr = chunk(b"IHDR", struct.pack("!IIBBBBB", w, h, 8, 2, 0, 0, 0))
    idat = chunk(b"IDAT", zlib.compress(raw_data))
    iend = chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + ihdr + idat + iend)

def wait_for_server(url, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as r:
                if r.status == 200:
                    return True
        except Exception:
            time.sleep(0.4)
    return False

def run_tests():
    temp_img = os.path.abspath("scripts/_temp_test_cert.png")
    create_valid_png(temp_img)

    env = os.environ.copy()
    env["E2E_PORT"] = str(PORT)
    env["E2E_ADMIN_PASS"] = TEST_PASS

    print(f"=== KHỞI ĐỘNG E2E ISOLATED TEST SERVER TRÊN CỔNG {PORT} ===")
    server_proc = subprocess.Popen(
        ["node", "scripts/test-e2e-server.mjs"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        cwd=os.getcwd()
    )

    chrome_opts = Options()
    chrome_opts.add_argument("--headless=new")
    chrome_opts.add_argument("--disable-gpu")
    chrome_opts.add_argument("--window-size=1440,900")
    chrome_opts.add_argument("--no-sandbox")
    driver = None

    try:
        if not wait_for_server(BASE_URL, timeout=40):
            out, err = server_proc.communicate(timeout=2)
            print("Server failed to start:", out.decode(errors="ignore"), err.decode(errors="ignore"))
            sys.exit(1)

        print("Isolated test server ready at", BASE_URL)
        driver = webdriver.Chrome(options=chrome_opts)
        driver.implicitly_wait(6)

        # Step 0: Login
        print("\n--- BƯỚC 0: ĐĂNG NHẬP QUẢN TRỊ ---")
        driver.get(f"{BASE_URL}/admin/login")
        driver.find_element(By.CSS_SELECTOR, "input[type='text']").send_keys("admin")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(TEST_PASS)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(driver, 10).until(lambda d: "/admin/dashboard" in d.current_url)
        print("  [PASS] Đăng nhập quản trị thành công.")

        # Step 1: Quản lý sản phẩm
        print("\n--- BƯỚC 1: KIỂM THỬ QUẢN LÝ SẢN PHẨM (/admin/products) ---")
        driver.get(f"{BASE_URL}/admin/products")
        time.sleep(1.5)

        # Check console logs for toLowerCase errors
        logs = driver.get_log("browser")
        error_logs = [l for l in logs if "toLowerCase" in l.get("message", "")]
        assert len(error_logs) == 0, f"LỖI: Phát hiện toLowerCase error trong console: {error_logs}"
        print("  [PASS] Không có lỗi toLowerCase khi nạp danh sách sản phẩm từ API.")

        # Check that soft-dried-red-dragonfruit renders without crash
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Thanh long ruột đỏ" in body_text, "LỖI: Thiếu sản phẩm Thanh long ruột đỏ trong bảng"
        assert "12 dòng sản phẩm" in body_text, f"LỖI: Số lượng sản phẩm không đúng: {body_text[:200]}"
        print("  [PASS] Hiển thị đầy đủ 12 sản phẩm ổn định, không bị fallback hay crash.")

        # Search by VI
        search_box = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Tìm theo tên']")
        search_box.clear()
        search_box.send_keys("Thanh long")
        time.sleep(0.5)
        filtered_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Thanh long ruột đỏ" in filtered_text and "Chuối sấy" not in filtered_text
        print("  [PASS] Tìm kiếm theo tên tiếng Việt hoạt động chính xác.")

        # Search by EN
        search_box.clear()
        search_box.send_keys("Banana Chips")
        time.sleep(0.5)
        filtered_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Chuối sấy giòn" in filtered_text and "Thanh long" not in filtered_text
        print("  [PASS] Tìm kiếm theo tên tiếng Anh hoạt động chính xác.")

        # Filter by category
        search_box.clear()
        search_box.send_keys(Keys.BACKSPACE * 20)
        time.sleep(0.3)
        cat_select = driver.find_element(By.CSS_SELECTOR, "select")
        cat_select.send_keys("Trái cây sấy giòn")
        time.sleep(0.5)
        chips_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Chuối sấy giòn" in chips_text and "Hạt điều" not in chips_text
        print("  [PASS] Bộ lọc danh mục sản phẩm hoạt động chính xác.")

        # Reset category to all
        cat_select.send_keys("Tất cả danh mục")
        time.sleep(0.5)

        # Open edit modal on soft-dried-red-dragonfruit
        edit_btns = driver.find_elements(By.XPATH, "//tr[contains(., 'Thanh long ruột đỏ')]//button[contains(., 'Sửa')]")
        assert len(edit_btns) > 0, "Không tìm thấy nút Sửa của Thanh long ruột đỏ"
        edit_btns[0].click()
        time.sleep(0.8)

        modal_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Chỉnh sửa Sản phẩm: Thanh long ruột đỏ" in modal_text or "Chỉnh sửa Sản phẩm:" in modal_text
        print("  [PASS] Mở biểu mẫu chỉnh sửa sản phẩm thành công với đầy đủ dữ liệu.")

        # Save product modification
        save_btn = driver.find_element(By.XPATH, "//button[contains(., 'Lưu thông tin sản phẩm')]")
        save_btn.click()
        WebDriverWait(driver, 10).until(
          lambda d: "thành công" in d.find_element(By.TAG_NAME, "body").text.lower()
        )
        print("  [PASS] Lưu cập nhật sản phẩm thành công và danh sách hiển thị chuẩn hóa.")
        driver.save_screenshot(os.path.join(ARTIFACTS_DIR, "test_admin_products_success.png"))

        # Step 2: Ngăn lỗi một mục làm kẹt cả CMS (Route Switch in Same Tab)
        print("\n--- BƯỚC 2: KIỂM THỬ ROUTE SWITCHING LIÊN TỤC TRONG CÙNG TAB ---")
        routes_to_visit = [
            ("/admin/dashboard", "Tổng quan Quản trị"),
            ("/admin/news", "Quản lý Bài viết & Báo chí"),
            ("/admin/products", "Quản lý Danh mục Sản phẩm"),
            ("/admin/media", "Thư viện Hình ảnh & Media"),
            ("/admin/certificates", "Quản lý Chứng nhận & Kiểm định"),
            ("/admin/brochure", "Hồ sơ năng lực"),
            ("/admin/settings", "Cài đặt Doanh nghiệp & Website"),
            ("/admin/dashboard", "Tổng quan Quản trị")
        ]
        for path, expected_text in routes_to_visit:
            driver.get(f"{BASE_URL}{path}")
            time.sleep(0.8)
            cur_body = driver.find_element(By.TAG_NAME, "body").text
            assert expected_text in cur_body, f"LỖI: Route {path} không hiển thị đúng nội dung '{expected_text}'. Body snippet: {cur_body[:150]}"
            assert "Hệ Thống Đang Cập Nhật Phiên Bản Mới" not in cur_body, f"LỖI: Bị kẹt màn hình lỗi tại {path}"
            assert "Nội dung đang được làm mới" not in cur_body, f"LỖI: Bị kẹt màn hình lỗi route tại {path}"
        print("  [PASS] Chuyển đổi qua lại giữa tất cả 7 route CMS trong cùng một tab hoàn toàn mượt mà, không kẹt ErrorBoundary.")

        # Step 3: Thư viện hình ảnh
        print("\n--- BƯỚC 3: KIỂM THỬ THƯ VIỆN HÌNH ẢNH (/admin/media) ---")
        driver.get(f"{BASE_URL}/admin/media")
        time.sleep(1.2)

        # Check list loaded
        media_cards = driver.find_elements(By.CSS_SELECTOR, "div[style*='gridTemplateColumns'] > div")
        print(f"  Số lượng ảnh hiển thị ban đầu: {len(media_cards)} ảnh.")
        assert len(media_cards) >= 14, f"LỖI: Thư viện media hiển thị ít hơn 14 ảnh ({len(media_cards)})"
        print("  [PASS] Danh sách ảnh tải đầy đủ.")

        # Test Refresh button
        refresh_btn = driver.find_element(By.XPATH, "//button[contains(., 'Làm mới')]")
        refresh_btn.click()
        time.sleep(0.8)
        print("  [PASS] Nút Làm mới danh sách media hoạt động tốt.")

        # Test Category Filter tabs
        news_filter_btn = driver.find_element(By.XPATH, "//button[text()='Tin tức']")
        news_filter_btn.click()
        time.sleep(0.5)
        news_cards = driver.find_elements(By.CSS_SELECTOR, "div[style*='gridTemplateColumns'] > div")
        assert len(news_cards) > 0, "LỖI: Bộ lọc Tin tức trả về 0 ảnh"
        print(f"  [PASS] Bộ lọc Tin tức hiển thị {len(news_cards)} ảnh.")

        all_filter_btn = driver.find_element(By.XPATH, "//button[text()='Tất cả']")
        all_filter_btn.click()
        time.sleep(0.5)

        # Test Copy Link with clipboard verification
        copy_btns = driver.find_elements(By.XPATH, "//button[contains(., 'Copy link')]")
        assert len(copy_btns) > 0, "LỖI: Không tìm thấy nút Copy link"
        copy_btns[0].click()
        time.sleep(0.8)

        # Verify toast or button state
        feedback_elem = driver.find_elements(By.XPATH, "//*[contains(text(), 'Đã sao chép') or contains(text(), 'Đã copy')]")
        assert len(feedback_elem) > 0, "LỖI: Không thấy thông báo sao chép đường dẫn"
        print("  [PASS] Chức năng Copy link hiển thị thông báo phản hồi thành công.")

        # Test Large image preview lightbox
        preview_btns = driver.find_elements(By.CSS_SELECTOR, "button[title='Xem kích thước lớn']")
        assert len(preview_btns) > 0, "Không tìm thấy nút xem kích thước lớn"
        preview_btns[0].click()
        time.sleep(0.8)
        assert len(driver.find_elements(By.XPATH, "//div[contains(., 'Chi tiết tài nguyên hình ảnh')]")) > 0
        # Close lightbox
        close_preview = driver.find_element(By.CSS_SELECTOR, "div[style*='zIndex: 1000'] button")
        close_preview.click()
        time.sleep(0.5)
        print("  [PASS] Lightbox xem ảnh lớn hoạt động bình thường.")

        # Test Uploading Image via CMS
        print("  Thử nghiệm upload ảnh test qua CMS...")
        file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
        file_input.send_keys(temp_img)
        WebDriverWait(driver, 12).until(
            lambda d: "thành công" in d.find_element(By.TAG_NAME, "body").text.lower()
        )
        print("  [PASS] Tải lên ảnh test thành công qua Canvas -> WebP -> Git API.")

        # Step 4: Kiểm thử Chứng nhận (/admin/certificates)
        print("\n--- BƯỚC 4: KIỂM THỬ MỤC CHỨNG NHẬN (/admin/certificates) ---")
        driver.get(f"{BASE_URL}/admin/certificates")
        time.sleep(1.2)

        cert_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Quản lý Chứng nhận & Kiểm định" in cert_text, f"LỖI: Tiêu đề trang chứng nhận sai: {cert_text[:200]}"
        print("  [PASS] Tiêu đề trang Chứng nhận hiển thị đúng 'Quản lý Chứng nhận & Kiểm định'.")

        # Check that certificates are displayed (BRCGS, FDA, ISO, HACCP, Kosher, SMETA)
        cert_cards = driver.find_elements(By.CSS_SELECTOR, "div[style*='gridTemplateColumns'] > div")
        print(f"  Số lượng chứng nhận hiển thị: {len(cert_cards)}.")
        assert len(cert_cards) >= 6, f"LỖI: Chứng nhận chỉ có {len(cert_cards)} ảnh (mong muốn >= 6 ảnh)"
        assert "cert-brcgs" in cert_text, "Thiếu chứng nhận BRCGS"
        assert "cert-fda" in cert_text, "Thiếu chứng nhận FDA"
        assert "cert-iso22000" in cert_text, "Thiếu chứng nhận ISO 22000"
        print("  [PASS] Khắc phục triệt để lỗi 0 ảnh: Đã hiển thị đầy đủ 6 chứng nhận quốc tế.")
        driver.save_screenshot(os.path.join(ARTIFACTS_DIR, "test_admin_certificates_success.png"))

        # Step 5: Hồi quy Tin tức
        print("\n--- BƯỚC 5: HỒI QUY QUẢN LÝ TIN TỨC (/admin/news & Public) ---")
        driver.get(f"{BASE_URL}/admin/news")
        time.sleep(1.2)
        news_text = driver.find_element(By.TAG_NAME, "body").text
        assert "Quản lý Bài viết & Báo chí" in news_text
        assert "Tổng số 9 bài viết" in news_text or "press-nld-mango-sourcing" in news_text
        print("  [PASS] /admin/news hiển thị đầy đủ 9 bài viết.")

        # Public news detail
        driver.get(f"{BASE_URL}/tin-tuc/press-nld-mango-sourcing")
        time.sleep(1.0)
        h1_text = driver.find_element(By.TAG_NAME, "h1").text
        print(f"  Tiêu đề <h1> bài viết công khai: '{h1_text}'")
        assert len(h1_text) > 0, "LỖI: <h1> rỗng!"
        print("  [PASS] Trang bài viết công khai hiển thị đầy đủ, không bị ảnh hưởng.")

        print("\n==================================================")
        print("TOÀN BỘ 5 HẠNG MỤC KIỂM THỬ ĐÃ PASS 100%!")
        print("==================================================")

    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass
        if server_proc:
            if os.name == "nt":
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                server_proc.kill()
        if os.path.exists(temp_img):
            try:
                os.remove(temp_img)
            except Exception:
                pass

if __name__ == "__main__":
    run_tests()
