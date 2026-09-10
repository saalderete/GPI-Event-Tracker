// Prints every document in the registry to out/pdf/<name>.pdf from its
// /print route, so the PDF is a render of the same source as the page. Runs
// after `next build`; the deploy workflow runs it before publishing.
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { startServer } from "./serve.mjs";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const out = join(root, "out");
const manifest = JSON.parse(await readFile(join(out, "portal-manifest.json"), "utf8"));
const { server, origin } = await startServer();

await mkdir(join(out, "pdf"), { recursive: true });
// PW_EXECUTABLE points Playwright at an already-installed Chromium (this
// sandbox ships one); CI installs the matching browser and leaves it unset.
const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});
const page = await browser.newPage({ colorScheme: "light", viewport: { width: 1100, height: 1400 } });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const style = `font-family: 'IBM Plex Mono', Menlo, monospace; font-size: 7.5pt; color: #666; width: 100%; padding: 0 0.75in;`;

let n = 0;
for (const d of manifest.documents) {
  const url = `${origin}${d.print}`;
  const resp = await page.goto(url, { waitUntil: "networkidle" });
  if (!resp || !resp.ok()) throw new Error(`${url} returned ${resp?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  const file = join(out, "pdf", `${d.pdf}.pdf`);
  await page.pdf({
    path: file,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="${style} display:flex; justify-content:space-between;"><span>${esc(manifest.site.name)}, Sprint ${d.sprint}: ${esc(d.title)}, v${esc(d.version)}</span><span>Revised ${esc(d.revised)}</span></div>`,
    footerTemplate: `<div style="${style} display:flex; justify-content:space-between;"><span>Built ${esc(manifest.build.at.slice(0, 10))}${manifest.build.commit ? ", commit " + esc(manifest.build.commit.slice(0, 7)) : ""}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
    margin: { top: "0.8in", bottom: "0.85in", left: "0.75in", right: "0.75in" }
  });
  n++;
  console.log(`pdf  ${d.pdf}.pdf  <- ${d.print}`);
}

await browser.close();
server.close();
console.log(`${n} PDF(s) written to out/pdf/.`);
