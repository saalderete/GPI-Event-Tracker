// After `vite build`: copy index.html into every route folder, so a deep link
// (/mock/events/<slug>/) is a real file on any static host, no rewrites needed.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { EVENTS } from "../src/data/events.js";

const out = new URL("../../public/mock/", import.meta.url);
const html = await readFile(new URL("index.html", out), "utf8");
const routes = ["events", "saved", "interests", "post", ...EVENTS.map((e) => `events/${e.slug}`)];
for (const r of routes) {
  await mkdir(new URL(`${r}/`, out), { recursive: true });
  await writeFile(new URL(`${r}/index.html`, out), html);
}
console.log(`routes: ${routes.length} folders written under public/mock/`);
