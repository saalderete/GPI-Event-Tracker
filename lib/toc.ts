import { readFileSync } from "node:fs";
import { join } from "node:path";
import GithubSlugger from "github-slugger";

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

// Reads the document source at build time and lists its h2/h3 headings with
// the same ids rehype-slug gives them, so the "On this page" rail matches.
export function tocFor(sprintSlug: string, docSlug: string): TocEntry[] {
  const file = join(process.cwd(), "content", sprintSlug, `${docSlug}.mdx`);
  const src = readFileSync(file, "utf8");
  const slugger = new GithubSlugger();
  const out: TocEntry[] = [];
  let inFence = false;
  for (const raw of src.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    out.push({ id: slugger.slug(text), text, depth: m[1].length === 2 ? 2 : 3 });
  }
  return out;
}
