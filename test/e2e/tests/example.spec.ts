import Ogma from "@linkurious/ogma";
import os from "os";
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

const REPLACE = process.env.CI_COMMIT === 'true';
const folder = './tests/e2e/examples/example.spec.ts-snapshots';
const system = os.platform();

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
  await page.waitForTimeout(1000);

  if (! REPLACE) {
    await expect(page).toHaveScreenshot(initialState, {
      maxDiffPixels: TOLERATED_DIFFERENCE,
      timeout: 10000
    });
  } else {
    await page.waitForTimeout(10000);

    const fileName = `initial-state-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileName}`,
      type: 'png'
    });
  }
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

  const fileName = "node-hovered.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE,
      timeout: 5000
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `node-hovered-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }

  // Reset hover state by moving the mouse away
  await page.mouse.move(0, 0, { steps: 10 });
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(initialState, {
      // Only the position is different compared to the initial screenshot
      maxDiffPixels: 45 + TOLERATED_DIFFERENCE,
      timeout: 5000
    });
  }
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

  const fileName = "tooltip-opened.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `tooltip-opened-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }

  // Click outside to close the tooltip
  await page.mouse.click(0, 0);
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(initialState, {
      // Only the position is different compared to the initial screenshot
      maxDiffPixels: 45 + TOLERATED_DIFFERENCE,
      timeout: 5000
    });
  }
});

test("tooltip repositioning", async () => {
  // Get the position of the first node
  const pos = await page.evaluate(() => {
    const ogma = window.ogma;
    const coords = ogma.view.screenToGraphCoordinates({ x: window.innerWidth - 10, y: window.innerHeight / 2 })
    ogma.getNodes().get(0).setAttributes(coords)
    return { x: window.innerWidth - 10, y: window.innerHeight / 2 };
  });

  // Wait for the hover effect to take place and then open the tooltip
  await page.mouse.move(pos.x, pos.y);
  await page.waitForTimeout(1000);
  await page.mouse.click(pos.x, pos.y, {
    button: "right"
  });

  const fileName = "tooltip-repositioned.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `tooltip-repositioned-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }
});

test("add node", async () => {
  // Open the panel and add a node
  await page.getByTitle("Show controls").click();
  await page.getByText("Add node").click();
  await page.mouse.click(50, 50);

  const fileName = "node-added.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `node-added-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }
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

  const fileName = "node-added-with-class.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `node-added-with-class-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }
});

test("node grouping", async () => {
  // Enable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);

  const fileName = "node-grouping-disabled.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `node-grouping-disabled-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }

  // Disable node grouping
  await page.getByTitle("Show controls").click();
  await page.getByText("Node grouping").click();
  await page.mouse.click(50, 50);

  const fileName2 = "node-grouping-reenabled.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName2, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `node-grouping-reenabled-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }
});

test("geo mode", async () => {
  // Enable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);

  const fileName = "geo-mode-enabled.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `geo-mode-enabled-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }

  // Disable geo mode
  await page.getByTitle("Show controls").click();
  await page.getByText("Geo mode").click();
  await page.mouse.click(50, 50);

  const fileName2 = "geo-mode-disabled.png";
  if (! REPLACE) {
    await expect(page).toHaveScreenshot(fileName2, {
      maxDiffPixels: TOLERATED_DIFFERENCE
    });
  } else {
    await page.waitForTimeout(5000);

    const fileNameSys = `geo-mode-disabled-chromium-${system}.png`;
    await page.screenshot({
      path: `${folder}/${fileNameSys}`,
      type: 'png'
    });
  }
});

test.afterAll(async () => {
  await page.close();
});