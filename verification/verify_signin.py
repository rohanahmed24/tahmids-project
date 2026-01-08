from playwright.sync_api import sync_playwright

def verify_signin_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Assuming the app is running on localhost:3000
            page.goto("http://localhost:3000/signin")

            # Wait for the page to load
            page.wait_for_selector("form")

            # Take a screenshot of the initial state
            page.screenshot(path="verification/signin_page_initial.png")

            # Fill in credentials
            page.fill('input[type="email"]', "test@example.com")
            page.fill('input[type="password"]', "password")

            # Click sign in
            page.click('button[type="submit"]')

            # Wait a bit for loading state
            page.wait_for_timeout(500)

            # Take screenshot of loading state or error (since backend might not be fully reachable)
            page.screenshot(path="verification/signin_page_submitted.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_signin_page()
