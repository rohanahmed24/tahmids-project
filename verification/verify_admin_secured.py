from playwright.sync_api import sync_playwright, expect
import time

def verify_admin_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Login
        print("Navigating to login...")
        page.goto("http://localhost:3000/admin")

        # Check if already logged in or needs login
        if page.url == "http://localhost:3000/admin":
            print("Logging in...")
            # The page only has a password field
            page.fill("input[type='password']", "wisdomia2024")
            page.click("button[type='submit']")
            page.wait_for_url("http://localhost:3000/admin/dashboard", timeout=10000)

        print("Logged in successfully.")

        # 2. Verify Dashboard
        print("Verifying dashboard...")
        # Wait for the dashboard to load content
        page.wait_for_selector("text=Dashboard Overview")
        expect(page.get_by_text("Dashboard Overview")).to_be_visible()

        # 3. Navigate to Articles Tab
        print("Navigating to Articles tab...")
        page.click("text=Articles")

        # Wait for articles to load
        page.wait_for_selector("text=Content Management")
        expect(page.get_by_text("Content Management")).to_be_visible()

        # Take screenshot of Dashboard with Articles
        page.screenshot(path="verification/dashboard_articles_secured.png")
        print("Screenshot saved: verification/dashboard_articles_secured.png")

        # 4. Click Edit on the first article
        print("Clicking edit on first article...")
        # Assuming the first article has an edit button.
        # The edit button is an anchor with an Edit icon, inside a div with links.
        # We can try to find the first link containing "/admin/edit/"

        edit_buttons = page.locator("a[href^='/admin/edit/']")
        count = edit_buttons.count()
        print(f"Found {count} edit buttons.")

        if count > 0:
            edit_buttons.first.click()
            page.wait_for_load_state("networkidle")

            # 5. Verify Edit Page
            print("Verifying edit page...")
            page.wait_for_selector("text=Edit Article")
            expect(page.get_by_text("Edit Article")).to_be_visible()

            # Take screenshot of Edit Page
            page.screenshot(path="verification/edit_page_secured.png")
            print("Screenshot saved: verification/edit_page_secured.png")

            # 6. Verify form fields are populated (check value of Title input)
            title_input = page.locator("input[name='title']")
            title_value = title_input.input_value()
            print(f"Article Title: {title_value}")

            if not title_value:
                print("Error: Title is empty!")
            else:
                print("Title populated successfully.")

        else:
            print("No articles found to edit.")

        browser.close()

if __name__ == "__main__":
    try:
        verify_admin_dashboard()
    except Exception as e:
        print(f"Verification failed: {e}")
        exit(1)
