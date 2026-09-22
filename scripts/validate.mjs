// The build's compliance checks, in the spirit of the course checklist.
// Fails the build (and the deploy) if:
//   1. a document in the registry has no rendered page or no PDF, or a PDF
//      exists for nothing in the registry (web/PDF parity, guidelines §5);
//   2. the output contains the private-content sentinel (retrospectives and
//      peer evaluations never publish, §4);
//   3. the output or the evidence data contains a referral name from the
//      original interview sheets (privacy);
//   4. visible copy in the source documents contains an em dash (house rule).
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const out = join(root, "out");
const problems = [];

async function walk(dir, list = []) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, list);
    else list.push(p);
  }
  return list;
}

// 1. Parity.
const manifest = JSON.parse(await readFile(join(out, "portal-manifest.json"), "utf8"));
const pdfs = new Set((await readdir(join(out, "pdf")).catch(() => [])).filter((f) => f.endsWith(".pdf")));
for (const d of manifest.documents) {
  const page = join(out, d.page, "index.html");
  if (!(await stat(page).catch(() => null))) problems.push(`parity: ${d.title} has no rendered page at ${d.page}`);
  if (!pdfs.has(`${d.pdf}.pdf`)) problems.push(`parity: ${d.title} has no PDF at /pdf/${d.pdf}.pdf`);
  pdfs.delete(`${d.pdf}.pdf`);
}
for (const stray of pdfs) problems.push(`parity: /pdf/${stray} is not in the registry`);
// A delivered document's file must be in the output where its cover points.
for (const d of manifest.documents) {
  if (d.source !== "upload") continue;
  if (!d.file || !(await stat(join(out, "docs", d.file)).catch(() => null))) problems.push(`parity: ${d.title} is delivered as a PDF but /docs/${d.file} is not in the output`);
}

// 2 and 3. Sentinel and referral names, across every text file in the output.
const SENTINEL = "PRIVATE-DO-NOT-PUBLISH";
const REFERRALS = ["Steven Lewis", "Kassandra", "Carlos"];
const files = (await walk(out)).filter((f) => /\.(html|json|txt|js)$/.test(f));
for (const f of files) {
  const s = await readFile(f, "utf8");
  if (s.includes(SENTINEL)) problems.push(`private: ${relative(root, f)} contains the private-content sentinel`);
  for (const name of REFERRALS) {
    if (new RegExp(`\\b${name}\\b`).test(s)) problems.push(`privacy: ${relative(root, f)} mentions "${name}"`);
  }
}

// 4. Em dashes in source copy.
const copyFiles = [
  ...(await walk(join(root, "content"))).filter((f) => f.endsWith(".mdx") || f.endsWith(".ts")),
  ...(await walk(join(root, "lib"))).filter((f) => f.endsWith(".ts")),
  ...(await walk(join(root, "app"))).filter((f) => f.endsWith(".tsx")),
  ...(await walk(join(root, "components"))).filter((f) => f.endsWith(".tsx"))
];
for (const f of copyFiles) {
  const s = await readFile(f, "utf8");
  const line = s.split("\n").findIndex((l) => l.includes("—"));
  if (line >= 0) problems.push(`copy: ${relative(root, f)}:${line + 1} contains an em dash`);
}

if (problems.length) {
  console.error("Validation failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`Validated: ${manifest.documents.length} documents with pages and PDFs, ${files.length} output files clean, ${copyFiles.length} source files without em dashes.`);
