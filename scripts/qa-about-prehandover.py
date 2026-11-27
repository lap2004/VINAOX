import argparse
import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

SCREENSHOT_ROOT = r"E:\SONAI\VINAXO\docs\screenshots\about-prehandover"

LANGUAGES = [
    {
        "code": "vi",
        "short": "VI",
        "expectedTag": "NHÀ MÁY VINAXO",
        "forbiddenPhrases": ["sấy vô trùng", "đóng gói vô trùng"],
        "card2Id": "tray-racking-line",
        "card2Label": "chuẩn bị nguyên liệu",
        "card2Title": "xếp lát trái cây lên khay chuẩn bị sấy",
        "card2Forbidden": ["dò kim loại", "sấy vô trùng"],
        "card3Id": "drying-tray-racks",
        "card3Forbidden": ["thu mua bao tiêu xoài"],
    },
    {
        "code": "en",
        "short": "EN",
        "expectedTag": "VINAXO FACILITY",
        "forbiddenPhrases": ["sterile cleanroom packaging"],
        "card2Id": "tray-racking-line",
        "card2Label": "material preparation",
        "card2Title": "arranging sliced fruit onto drying trays",
        "card2Forbidden": ["metal detection"],
        "card3Id": "drying-tray-racks",
        "card3Forbidden": ["mango & tropical fruit procurement"],
    },
    {
        "code": "ko",
        "short": "KO",
        "expectedTag": "VINAXO 동탑",
        "forbiddenPhrases": ["무균 포장"],
        "card2Id": "tray-racking-line",
        "card2Label": "건조 전 원료 준비",
        "card2Title": "건조 트레이 과일 슬라이스 배열 작업",
        "card2Forbidden": ["금속 검출"],
        "card3Id": "drying-tray-racks",
        "card3Forbidden": ["직수매"],
    },
    {
        "code": "zh-CN",
        "short": "ZH",
        "expectedTag": "VINAXO 同塔",
        "forbiddenPhrases": [],
        "card2Id": "tray-racking-line",
        "card2Label": "烘干前原料准备",
        "card2Title": "鲜果切片平铺上盘准备烘干",
        "card2Forbidden": ["金属探测"],
        "card3Id": "drying-tray-racks",
        "card3Forbidden": ["芒果与热带水果规模化收储"],
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


def wait_for_about_ready(driver, timeout=15):
    WebDriverWait(driver, timeout).until(
        lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='about-gallery-grid'] .about-gallery-card")) > 0
    )
    time.sleep(0.45)


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
        driver.get(f"{base_url}/about")
        wait_for_about_ready(driver)

        # 1. Highlight visual replaces about_vietnam & zero forbidden terminology across 4 languages
        for lang in LANGUAGES:
            switch_language(driver, lang["short"])
            hv_el = driver.find_element(By.CSS_SELECTOR, "[data-testid='about-highlight-visual']")
            hv_img = hv_el.find_element(By.CSS_SELECTOR, "img")
            hv_tag = hv_el.find_element(By.CSS_SELECTOR, ".overlay-tag").text
            hv_src = (hv_img.get_attribute("currentSrc") or hv_img.get_attribute("src") or "").lower()
            page_text = driver.find_element(By.CSS_SELECTOR, ".about-page").text.lower()

            bad_srcs = driver.execute_script(
                "return Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src || '').filter(s => s.includes('about_vietnam'));"
            )
            forbidden_hits = [p for p in lang["forbiddenPhrases"] if p.lower() in page_text]

            card2 = driver.find_element(By.CSS_SELECTOR, f"[data-gallery-card-id='{lang['card2Id']}']")
            c2_label = card2.find_element(By.CSS_SELECTOR, "[data-testid='gallery-card-label']").text.lower()
            c2_title = card2.find_element(By.CSS_SELECTOR, "[data-testid='gallery-card-title']").text.lower()
            c2_leaks = [p for p in lang["card2Forbidden"] if p.lower() in c2_label or p.lower() in c2_title]

            card3 = driver.find_element(By.CSS_SELECTOR, f"[data-gallery-card-id='{lang['card3Id']}']")
            c3_title = card3.find_element(By.CSS_SELECTOR, "[data-testid='gallery-card-title']").text.lower()
            c3_leaks = [p for p in lang["card3Forbidden"] if p.lower() in c3_title]

            ok = (
                len(bad_srcs) == 0
                and "factory-quality-sorting" in hv_src
                and lang["expectedTag"].lower() in hv_tag.lower()
                and len(forbidden_hits) == 0
                and lang["card2Label"].lower() in c2_label
                and lang["card2Title"].lower() in c2_title
                and len(c2_leaks) == 0
                and len(c3_leaks) == 0
            )
            check(
                f"MULTILANG-CONTENT-{lang['code']}",
                ok,
                f"hv_src={hv_src}, bad_srcs={bad_srcs}, forbidden={forbidden_hits}, c2_leaks={c2_leaks}, c3_leaks={c3_leaks}",
            )

            if save_screenshots and browser_name == "chrome":
                os.makedirs(SCREENSHOT_ROOT, exist_ok=True)
                if lang["code"] == "vi":
                    driver.execute_script('arguments[0].scrollIntoView({block:"center"});', hv_el)
                    time.sleep(0.5)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-visual-vi.png"))
                    gal_el = driver.find_element(By.CSS_SELECTOR, "[data-testid='about-gallery-grid']")
                    driver.execute_script('arguments[0].scrollIntoView({block:"start"});', gal_el)
                    time.sleep(0.6)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-gallery-vi.png"))
                elif lang["code"] == "ko":
                    driver.execute_script('arguments[0].scrollIntoView({block:"center"});', card2)
                    time.sleep(0.5)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-ko.png"))
                elif lang["code"] == "zh-CN":
                    driver.execute_script('arguments[0].scrollIntoView({block:"center"});', card2)
                    time.sleep(0.5)
                    driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-zh-cn.png"))

        # Switch back to VI for remaining interactive checks
        switch_language(driver, "VI")

        # 2. Verify all visible images on /about load cleanly (naturalWidth > 0) after scrolling
        driver.execute_script("""
            for (const img of document.querySelectorAll('.about-page img')) {
                img.loading = 'eager';
                img.scrollIntoView();
            }
            window.scrollTo(0, 0);
        """)
        time.sleep(1.0)
        broken_imgs = driver.execute_script("""
            return Array.from(document.querySelectorAll('.about-page img'))
                .filter(img => !img.complete || img.naturalWidth === 0)
                .map(img => img.currentSrc || img.src || img.alt);
        """)
        check("IMAGES-NO-404", len(broken_imgs) == 0, f"broken={broken_imgs}")

        # 3. Verify all 6 gallery cards + category filter sync
        all_cards = driver.find_elements(By.CSS_SELECTOR, "[data-testid='about-gallery-grid'] .about-gallery-card")
        prep_btn = driver.find_element(By.CSS_SELECTOR, "button[data-gallery-filter='preparation']")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", prep_btn)
        time.sleep(0.3)
        prep_cards = driver.find_elements(By.CSS_SELECTOR, "[data-testid='about-gallery-grid'] .about-gallery-card")
        all_btn = driver.find_element(By.CSS_SELECTOR, "button[data-gallery-filter='all']")
        driver.execute_script("arguments[0].click();", all_btn)
        time.sleep(0.3)
        reset_cards = driver.find_elements(By.CSS_SELECTOR, "[data-testid='about-gallery-grid'] .about-gallery-card")
        check(
            "GALLERY-CARDS-AND-FILTER",
            len(all_cards) == 6 and len(prep_cards) == 2 and len(reset_cards) == 6,
            f"all={len(all_cards)}, preparation={len(prep_cards)}, reset={len(reset_cards)}",
        )

        # 4. Lightbox open exact item, navigate next/prev & keyboard arrows/Escape
        open_btn2 = driver.find_element(By.CSS_SELECTOR, "button[data-gallery-open-id='tray-racking-line']")
        driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", open_btn2)
        WebDriverWait(driver, 8).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='about-lightbox']")) > 0)
        time.sleep(0.4)

        lb = driver.find_element(By.CSS_SELECTOR, "[data-testid='about-lightbox']")
        lb_id = lb.get_attribute("data-active-gallery-id")
        lb_img_src = lb.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-image']").get_attribute("src") or ""
        lb_label = lb.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-label']").text
        lb_title = lb.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-title']").text
        lb_counter = lb.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-counter']").text

        if save_screenshots and browser_name == "chrome":
            driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-lightbox-vi.png"))

        # Navigate Next with button
        next_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-next']")
        driver.execute_script("arguments[0].click();", next_btn)
        time.sleep(0.35)
        lb2 = driver.find_element(By.CSS_SELECTOR, "[data-testid='about-lightbox']")
        lb2_id = lb2.get_attribute("data-active-gallery-id")
        lb2_img_src = lb2.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-image']").get_attribute("currentSrc") or lb2.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-image']").get_attribute("src") or ""
        lb2_title = lb2.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-title']").text
        lb2_label = lb2.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-label']").text
        lb2_counter = lb2.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-counter']").text

        # Navigate Prev with keyboard ArrowLeft, then close with Escape
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ARROW_LEFT)
        time.sleep(0.3)
        lb3_id = driver.find_element(By.CSS_SELECTOR, "[data-testid='about-lightbox']").get_attribute("data-active-gallery-id")
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        WebDriverWait(driver, 6).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='about-lightbox']")) == 0)

        lb_ok = (
            lb_id == "tray-racking-line"
            and "factory-featured-drying" in lb_img_src
            and "chuẩn bị nguyên liệu" in lb_label.lower()
            and "xếp lát trái cây lên khay chuẩn bị sấy" in lb_title.lower()
            and lb_counter.strip() == "2 / 6"
            and lb2_id == "drying-tray-racks"
            and "factory-sub-2" in lb2_img_src
            and "hạ tầng khay sấy" in lb2_label.lower()
            and "xe đẩy khay sấy" in lb2_title.lower()
            and lb2_counter.strip() == "3 / 6"
            and lb3_id == "tray-racking-line"
        )
        check(
            "LIGHTBOX-SYNC-AND-NAVIGATION",
            lb_ok,
            f"id1={lb_id}, label1={lb_label}, src1={lb_img_src}, id2={lb2_id}, src2={lb2_img_src}, id3={lb3_id}",
        )

        # 5. Responsive layout across 10 viewports + mobile lightbox bounds
        overflow_ports = []
        for w, h in VIEWPORTS:
            driver.set_window_size(w, h)
            time.sleep(0.25)
            sw, cw = driver.execute_script("return [document.documentElement.scrollWidth, document.documentElement.clientWidth];")
            if sw > cw + 2:
                overflow_ports.append(f"{w}x{h} (scroll={sw}>client={cw})")
            if w == 390 and save_screenshots and browser_name == "chrome":
                gal_el = driver.find_element(By.CSS_SELECTOR, "[data-testid='about-gallery-grid']")
                driver.execute_script("arguments[0].scrollIntoView({block:'start'});", gal_el)
                time.sleep(0.4)
                driver.save_screenshot(os.path.join(SCREENSHOT_ROOT, "after-about-mobile-390.png"))

        # Check Lightbox fits mobile 390x844
        driver.set_window_size(390, 844)
        time.sleep(0.25)
        open_btn1 = driver.find_element(By.CSS_SELECTOR, "button[data-gallery-open-id='factory-sorting-hall']")
        driver.execute_script("arguments[0].click();", open_btn1)
        WebDriverWait(driver, 6).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "[data-testid='about-lightbox']")) > 0)
        dlg_rect = driver.execute_script(
            "const r = document.querySelector('.about-lightbox-dialog').getBoundingClientRect(); return {w: r.width, h: r.height, vw: window.innerWidth, vh: window.innerHeight};"
        )
        driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, "[data-testid='lightbox-close']"))
        driver.set_window_size(1440, 900)
        check(
            "RESPONSIVE-10-VIEWPORTS",
            len(overflow_ports) == 0 and dlg_rect["w"] <= dlg_rect["vw"] + 1 and dlg_rect["h"] <= dlg_rect["vh"] + 1,
            f"overflow={overflow_ports}, mobile_lightbox={dlg_rect}",
        )

        # 6. Admin /admin/about route protection & 0 SEVERE console logs
        driver.get(f"{base_url}/admin/about")
        WebDriverWait(driver, 10).until(lambda d: "/admin/login" in d.current_url or len(d.find_elements(By.CSS_SELECTOR, "input[type='password']")) > 0)
        admin_url = driver.current_url

        logs = driver.get_log("browser")
        severe = [l["message"] for l in logs if l.get("level") == "SEVERE"]
        check(
            "ADMIN-ROUTE-AND-CONSOLE-CLEAN",
            "/admin/login" in admin_url and len(severe) == 0,
            f"admin_url={admin_url}, severe={severe}",
        )

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
    print("\nALL ABOUT PAGE PRE-HANDOVER QA CHECKS PASSED.")


if __name__ == "__main__":
    main()
