import Ogma from "@linkurious/ogma";
import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    ogma: Ogma;
  }
}

// The tolerated difference in pixels for screenshots.
// This is used to account for minor differences
// in rendering across different environments
const TOLERATED_DIFFERENCE = 50;

test.beforeEach(async ({ page }) => {
  // Navigate to the page before each test
  await page.goto("localhost:5173/ogma-react/");

  // Wait for the Ogma instance to be initialized
  // then wait for the layout to finish
  await page.locator(".App");
  // For Firefox, we need to wait a bit longer Ogma to initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.screenshot({ path: "reports/e2e/snapshots/initial-state.png" })
  await expect(page).toHaveScreenshot("initial-state.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  
});

test("mouse hover", async ({ page }) => {
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });
  // Hover over the first node
  await page.mouse.move(pos.x, pos.y);
  await page.screenshot({ path: "reports/e2e/snapshots/node-hovered.png" })
  await expect(page).toHaveScreenshot("node-hovered.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE,
    timeout: 5000
  });
  

  // Reset hover state by moving the mouse away
  await page.mouse.move(0, 0, { steps: 10 });
  await expect(page).toHaveScreenshot("initial-state.png", {
    // Only the position is different compared to the initial screenshot
    maxDiffPixels: 45 + TOLERATED_DIFFERENCE,
    timeout: 5000
  });
});

test("tooltip", async ({ page }) => {
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });

  // Wait for the hover effect to take place and then open the tooltip
  await page.mouse.move(pos.x, pos.y);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.mouse.click(pos.x, pos.y, {
    button: "right"
  });
  await page.screenshot({ path: "reports/e2e/snapshots/tooltip-opened.png" })
  await expect(page).toHaveScreenshot("tooltip-opened.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  

  // Click outside to close the tooltip
  await page.mouse.click(0, 0);
  await expect(page).toHaveScreenshot("initial-state.png", {
    // Only the position is different compared to the initial screenshot
    maxDiffPixels: 45 + TOLERATED_DIFFERENCE,
    timeout: 5000
  });
});

test("add node", async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await page.screenshot({ path: "reports/e2e/snapshots/node-added.png" })
  await expect(page).toHaveScreenshot("node-added.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  
});

test("add node with class", async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Use class").click();

  // The class is only applied every 2 added nodes
  await page.getByText("Add node").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  // Wait for the force layout to finish
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.screenshot({ path: "reports/e2e/snapshots/node-added-with-class.png" })
  await expect(page).toHaveScreenshot("node-added-with-class.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  
});

test("node grouping", async ({ page }) => {
  // Enable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await page.screenshot({ path: "reports/e2e/snapshots/node-grouping-disabled.png" })
  await expect(page).toHaveScreenshot("node-grouping-disabled.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  

  // Disable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await page.screenshot({ path: "reports/e2e/snapshots/node-grouping-reenabled.png" })
  await expect(page).toHaveScreenshot("node-grouping-reenabled.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  
});

test("geo mode", async ({ page }) => {
  // Enable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);
  await page.screenshot({ path: "reports/e2e/snapshots/geo-mode-enabled.png" })
  await expect(page).toHaveScreenshot("geo-mode-enabled.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
  

  // Disable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);
  await page.screenshot({ path: "reports/e2e/snapshots/geo-mode-disabled.png" })
  await expect(page).toHaveScreenshot("geo-mode-disabled.png", {
    maxDiffPixels: TOLERATED_DIFFERENCE
  });
});
