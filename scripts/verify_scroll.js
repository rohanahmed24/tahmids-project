
const { chromium } = require('playwright');

(async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 }, // Mobile viewport (iPhone 12/13)
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });
    const page = await context.newPage();

    console.log('Navigating to page...');
    await page.goto('https://thewisdomia.com/article/stonehenge');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check computed styles
    const styles = await page.evaluate(() => {
        const html = window.getComputedStyle(document.documentElement);
        const body = window.getComputedStyle(document.body);
        return {
            html: {
                overflow: html.overflow,
                overflowX: html.overflowX,
                overflowY: html.overflowY,
                position: html.position,
                width: html.width
            },
            body: {
                overflow: body.overflow,
                overflowX: body.overflowX,
                overflowY: body.overflowY,
                position: body.position,
                width: body.width
            }
        };
    });
    console.log('Computed Styles:', JSON.stringify(styles, null, 2));

    // Test Scrolling
    console.log('Testing scroll...');
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);
    const finalScrollY = await page.evaluate(() => window.scrollY);

    console.log(`Initial ScrollY: ${initialScrollY}`);
    console.log(`Final ScrollY: ${finalScrollY}`);

    if (finalScrollY > initialScrollY) {
        console.log('SUCCESS: Page scrolled successfully.');
    } else {
        console.log('FAILURE: Page did not scroll.');
    }

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'verification_screenshot.png', fullPage: false });

    await browser.close();
})();
