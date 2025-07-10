import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigate to the page before each test
  await page.goto('localhost:5173/ogma-react/');
  await page.locator('.App');
  await page.evaluate(() => {
    const ogma = window.ogma;
    return new Promise((resolve) => {
      ogma.events.once('layoutEnd', resolve);
    });
  });

  await expect(page).toHaveScreenshot('initial-state.png', {
    timeout: 5000
  });
});

test('mouse hover', async ({ page }) => {
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });
  await page.mouse.move(pos.x, pos.y);
  await expect(page).toHaveScreenshot('node-hovered.png', {
    timeout: 5000
  });
});

test('add node', async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('node-added.png');
});

test('add node with class', async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Use class").click();
  await page.getByText("Add node").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('node-added-with-class.png');
});

test('node grouping', async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('node-grouping-disabled.png');
  
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('node-grouping-reenabled.png');
});

test('geo mode', async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('geo-mode-enabled.png');

  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot('geo-mode-disabled.png');
});