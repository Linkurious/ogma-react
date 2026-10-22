import { Ogma } from "@linkurious/ogma";
import { test, expect, Page } from "@playwright/test";

declare global {
  interface Window {
    ogma: Ogma;
  }
}

// The tolerated difference in pixels for screenshots.
// This is used to account for minor differences
// in rendering across different environments
const TOLERATED_DIFFERENCE = 50;
const initialState = "initial-state.png";

const MASK_SELECTOR = ".position-control";

const getScreenshotOptions = (page: Page) => ({
  maxDiffPixels: TOLERATED_DIFFERENCE,
  mask: [page.locator(MASK_SELECTOR)]
});

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.beforeEach(async () => {
  // Navigate to the page before each test
  await page.goto("localhost:5173/ogma-react/");

  // Wait for the Ogma instance to be initialized
  // then wait for the layout to finish
  await page.locator(".App");
  await page.waitForTimeout(1200);

  await expect(page).toHaveScreenshot(initialState, {
    ...getScreenshotOptions(page),
    timeout: 10000
  });
});

test("mouse hover", async () => {
  // Get the position of the first node
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });
  // Hover over it
  await page.mouse.move(pos.x, pos.y);

  await expect(page).toHaveScreenshot("node-hovered.png", {
    ...getScreenshotOptions(page),
    timeout: 5000
  });

  // Reset hover state by moving the mouse away
  await page.mouse.move(0, 0, { steps: 10 });
  await expect(page).toHaveScreenshot(initialState, {
    // Only the position is different compared to the initial screenshot
    maxDiffPixels: 45 + TOLERATED_DIFFERENCE,
    mask: getScreenshotOptions(page).mask,
    timeout: 5000
  });
});

test("tooltip", async () => {
  // Get the position of the first node
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const position = ogma.getNodes().get(0).getPosition();
    return ogma.view.graphToScreenCoordinates(position);
  });

  // Wait for the hover effect to take place and then open the tooltip
  await page.mouse.move(pos.x, pos.y);
  await page.waitForTimeout(1000);
  await page.mouse.click(pos.x, pos.y, {
    button: "right"
  });

  await expect(page).toHaveScreenshot(
    "tooltip-opened.png",
    getScreenshotOptions(page)
  );

  // Click outside to close the tooltip
  await page.mouse.click(0, 0);
  await expect(page).toHaveScreenshot(initialState, {
    // Only the position is different compared to the initial screenshot
    maxDiffPixels: 45 + TOLERATED_DIFFERENCE,
    mask: getScreenshotOptions(page).mask,
    timeout: 5000
  });
});

test("tooltip repositioning", async () => {
  // Get the position of the first node
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const coords = ogma.view.screenToGraphCoordinates({
      x: window.innerWidth - 10,
      y: window.innerHeight / 2
    });
    ogma.getNodes().get(0).setAttributes(coords);
    return { x: window.innerWidth - 10, y: window.innerHeight / 2 };
  });

  // Wait for the hover effect to take place and then open the tooltip
  await page.mouse.move(pos.x, pos.y);
  await page.waitForTimeout(1000);
  await page.mouse.click(pos.x, pos.y, {
    button: "right"
  });

  await expect(page).toHaveScreenshot(
    "tooltip-repositioned.png",
    getScreenshotOptions(page)
  );
});

test("add node", async () => {
  // Open the panel and add a node
  await page.getByTitle("Show controls").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);

  await expect(page).toHaveScreenshot(
    "node-added.png",
    getScreenshotOptions(page)
  );
});

test("add node with class", async () => {
  // Open the panel and toggle the class
  await page.getByTitle("Show controls").click();
  await page.getByText("Use class").click();

  // The class is only applied every 2 added nodes
  await page.getByText("Add node").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);

  // Wait for the force layout to finish
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await expect(page).toHaveScreenshot(
    "node-added-with-class.png",
    getScreenshotOptions(page)
  );
});

test("node grouping", async () => {
  // Enable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await page.waitForTimeout(1000);

  await expect(page).toHaveScreenshot(
    "node-grouping-disabled.png",
    getScreenshotOptions(page)
  );

  // Disable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);
  await page.waitForTimeout(1000);

  await expect(page).toHaveScreenshot(
    "node-grouping-reenabled.png",
    getScreenshotOptions(page)
  );
});

test("geo mode", async () => {
  // Enable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);

  await expect(page).toHaveScreenshot(
    "geo-mode-enabled.png",
    getScreenshotOptions(page)
  );

  // Disable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);

  await expect(page).toHaveScreenshot(
    "geo-mode-disabled.png",
    getScreenshotOptions(page)
  );
});

test.afterAll(async () => {
  await page.close();
});
