import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to the frontend
        try:
            await page.goto("http://localhost:3000", timeout=60000)
            print("Page loaded")

            # Wait for products to load
            await page.wait_for_selector("text=Chanel No. 5", timeout=30000)
            print("Products loaded")

            await page.screenshot(path="/home/jules/verification/final_v1.png", full_page=True)
            print("Screenshot saved to /home/jules/verification/final_v1.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="/home/jules/verification/final_error.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
