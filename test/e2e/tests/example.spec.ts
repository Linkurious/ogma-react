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
  await new Promise(r => setTimeout(r, 5000));
  await expect(page).toHaveScreenshot('initial-state.png');
  
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });
  await page.mouse.move(pos.x, pos.y);
  await new Promise(r => setTimeout(r, 1500));
  await expect(page).toHaveScreenshot('node-hovered.png');
  // screenshot for popup?

  await page.getByTitle("Show controls").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('node-added.png');

  await page.getByTitle("Show controls").click();
  await page.getByText("Use class").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('node-added-with-class.png');
});