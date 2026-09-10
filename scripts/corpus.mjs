// Emits out/corpus.json: every public document as plain text with its URL,
// for the "ask the portal" assistant planned as a separate service. The
// assistant answers only from this file and cites the page it drew from.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const out = join(root, "out");
const manifest = JSON.parse(await readFile(join(out, "portal-manifest.json"), "utf8"));

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|h[1-6]|li|tr|section|article|div|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();

const docs = [];
for (const d of manifest.documents) {
  const html = await readFile(join(out, d.print, "index.html"), "utf8");
  docs.push({ sprint: d.sprint, slug: d.slug, title: d.title, version: d.version, status: d.status, page: d.page, text: text(html) });
}
for (const extra of ["/", "/about/"]) {
  const html = await readFile(join(out, extra, "index.html"), "utf8");
  docs.push({ sprint: 0, slug: extra === "/" ? "home" : "about", title: extra === "/" ? "Home" : "About us", version: "", status: "final", page: extra, text: text(html) });
}
await writeFile(join(out, "corpus.json"), JSON.stringify({ site: manifest.site, build: manifest.build, documents: docs }, null, 2));
console.log(`corpus.json written with ${docs.length} entries (${docs.reduce((n, d) => n + d.text.length, 0).toLocaleString()} characters).`);
