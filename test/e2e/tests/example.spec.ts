import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigate to the page before each test
  await page.goto('localhost:5173/ogma-react/');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/React Ogma component/);
});

test('waits for the graph to load', async ({ page }) => {
  // Wait for the graph to load
  await new Promise(r => setTimeout(r, 2000));
  await expect(page).toHaveScreenshot();
  
});