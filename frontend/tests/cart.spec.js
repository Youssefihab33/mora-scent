import { test, expect } from '@playwright/test';

test.describe('Cart and Product Verification', () => {
  test('should display products and allow adding to cart', async ({ page }) => {
    // Enable console log capture
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    await page.goto('http://localhost:3002/');

    // Wait for the loading spinner to disappear
    await page.waitForSelector('.MuiCircularProgress-root', { state: 'detached' });

    // Switch to English to make it easier to find text
    await page.click('button:has-text("English")');

    // Wait for product to be visible
    const productCard = page.locator('.MuiCard-root', { hasText: 'Test Scent' }).first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    // Hover over the card to reveal the "Add to Cart" button
    await productCard.hover();

    // Click the Add to Cart button
    const addToCartBtn = productCard.getByRole('button', { name: /add to cart/i });
    await addToCartBtn.click();

    // Verify cart drawer is open and item is present
    await expect(page.getByText('Shopping Cart')).toBeVisible();
    const cartPaper = page.locator('.MuiDrawer-paper');
    await expect(cartPaper.getByText('Test Scent').first()).toBeVisible();

    // Increment quantity
    const addButton = cartPaper.locator('button').filter({ has: page.locator('svg[data-testid="AddIcon"]') });
    await addButton.click();

    // Verify quantity is 2
    // Debug: print the content of the drawer
    const drawerContent = await cartPaper.innerText();
    console.log('Drawer text content:', drawerContent);

    const quantityElement = cartPaper.locator('[data-testid="item-quantity"]');
    await expect(quantityElement).toHaveText('2', { timeout: 10000 });

    // Remove from cart - use DeleteIcon
    const deleteButton = cartPaper.locator('button').filter({ has: page.locator('svg[data-testid="DeleteIcon"]') });
    await deleteButton.click();
    await expect(cartPaper.getByText('Test Scent')).not.toBeVisible();
  });

  test('login drawer accessibility', async ({ page }) => {
    await page.goto('http://localhost:3002/');
    // Switch to English first
    await page.click('button:has-text("English")');

    await page.click('button:has-text("Login")');
    await expect(page.locator('.MuiTypography-root:has-text("Login")').first()).toBeVisible();
    await expect(page.locator('input[placeholder="Email or Username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
