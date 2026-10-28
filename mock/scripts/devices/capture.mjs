// Captures the pages that go on the device screens, each at its screen's own
// shape so nothing is stretched when it is warped on. Run `python3 build.py
// quads` first (it writes quads.json with each screen's aspect), and the mock's
// dev server: `npm run dev` in mock/, then
//   node scripts/devices/capture.mjs [http://localhost:5173]
// Needs Playwright (npm i -D playwright, or a global install).
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

// require, so a global Playwright on NODE_PATH works as well as a local one
const { chromium } = createRequire(import.meta.url)("playwright");

const here = new URL(".", import.meta.url);
const origin = process.argv[2] || "http://localhost:5173";
const cfg = JSON.parse(await readFile(new URL("devices.json", here), "utf8"));
const quads = JSON.parse(await readFile(new URL("quads.json", here), "utf8"));

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
for (const [name, p] of Object.entries(cfg.photos)) {
  const height = Math.round(p.width / quads[name].aspect);
  const ctx = await browser.newContext({ viewport: { width: p.width, height }, deviceScaleFactor: 3, colorScheme: "dark", reducedMotion: "reduce" });
  // Dark theme, motion off (no opening screen, no reveals), the same five saved events on every screen.
  await ctx.addInitScript((saved) => {
    try {
      localStorage.setItem("gpi-theme", '"dark"');
      localStorage.setItem("gpi-motion", '"off"');
      localStorage.setItem("gpi-saved", JSON.stringify(saved));
      localStorage.setItem("gpi-rail", "0");
    } catch { /* private mode: the defaults are close enough */ }
  }, cfg.saved);
  const page = await ctx.newPage();
  await page.goto(origin + p.page, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: new URL(`captures/${name}.png`, here).pathname });
  console.log(`${name}: ${p.page} at ${p.width}x${height}`);
  await ctx.close();
}
await browser.close();
