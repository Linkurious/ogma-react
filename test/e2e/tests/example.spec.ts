import Ogma from "@linkurious/ogma";
import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    ogma: Ogma; // Replace 'any' with the actual type if available
  }
}

const DEFAULT_SCREENSHOT_OPTIONS = {
  maxDiffPixels: 50
};

test.beforeEach(async ({ page }) => {
  // Navigate to the page before each test
  await page.goto("localhost:5173/ogma-react/");

  // Wait for the Ogma instance to be initialized
  // then wait for the layout to finish
  await page.locator(".App");
  await page.evaluate(() => {
    const ogma = window.ogma;
    return new Promise((resolve) => {
      ogma.events.once("layoutEnd", resolve);
    });
  });

  await expect(page).toHaveScreenshot(
    "initial-state.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );
});

test("mouse hover", async ({ page }) => {
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });
  // Hover over the first node
  await page.mouse.move(pos.x, pos.y);
  await expect(page).toHaveScreenshot("node-hovered.png", {
    maxDiffPixels: 60,
    timeout: 5000
  });

  // Reset hover state by moving the mouse away
  await page.mouse.move(0, 0, { steps: 10 });
  await expect(page).toHaveScreenshot("initial-state.png", {
    // Only the position is different compared to the initial screenshot
    maxDiffPixels: 45,
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
  await expect(page).toHaveScreenshot(
    "tooltip-opened.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );

  // Click outside to close the tooltip
  await page.mouse.click(0, 0);
  await expect(page).toHaveScreenshot("initial-state.png", {
    // Only the position is different compared to the initial screenshot
    maxDiffPixels: 45,
    timeout: 5000
  });
});

test("add node", async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot(
    "node-added.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );
});

test("add node with class", async ({ page }) => {
  await page.getByTitle("Show controls").click();
  await page.getByText("Use class").click();

  // The class is only applied every 2 added nodes
  await page.getByText("Add node").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot(
    "node-added-with-class.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );
});

test("node grouping", async ({ page }) => {
  // Enable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot(
    "node-grouping-disabled.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );

  // Disable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot(
    "node-grouping-reenabled.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );
});

test("geo mode", async ({ page }) => {
  // Enable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot(
    "geo-mode-enabled.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );

  // Disable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);
  await expect(page).toHaveScreenshot(
    "geo-mode-disabled.png",
    DEFAULT_SCREENSHOT_OPTIONS
  );
});
