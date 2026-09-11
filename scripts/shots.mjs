// Screenshots of the built site for a design review. Writes to shots/.
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { startServer } from "./serve.mjs";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const dir = process.env.SHOTS_DIR ?? join(root, "shots");
await mkdir(dir, { recursive: true });
const { server, origin } = await startServer();
// PW_EXECUTABLE points Playwright at an already-installed Chromium (this
// sandbox ships one); CI installs the matching browser and leaves it unset.
const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});

const targets = (process.env.SHOTS ?? "/,/about/,/sprint-1/,/sprint-1/market-research/,/sprint-1/evidence/,/sprint-2/,/print/sprint-1/market-research/").split(",");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 }
];
for (const vp of viewports) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: theme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const t of targets) {
      if (vp.name === "phone" && t.startsWith("/print")) continue;
      await page.goto(`${origin}${t}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // Full-page captures do not scroll, so reveal everything up front.
      await page.evaluate(() => document.querySelectorAll("[data-reveal], .prose-doc > *").forEach((el) => el.classList.add("is-in")));
      await page.waitForTimeout(900);
      const name = `${vp.name}-${theme}${t.replace(/\//g, "_") || "_home"}.png`;
      await page.screenshot({ path: join(dir, name), fullPage: process.env.FULL !== "0" });
      console.log("shot", name);
    }
    await ctx.close();
  }
}
await browser.close();
server.close();
