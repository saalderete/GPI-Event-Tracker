// Checks every palette in content/accents.json, in both themes, so a pretty
// scheme cannot ship as unreadable text. The build refuses a failing one.
//
// Rules, WCAG AA for text (4.5:1) unless noted:
//   ink, ink-soft, label, muted  on paper    -> body, secondary and small text
//   ink                          on surface  -> text on cards and sheets
//   accent, hover                on paper    -> links and accent text
//   accent-ink                   on paper    -> the marker headings on the board
//   on                           on accent   -> the label inside a filled button
//   accent-ink                   on soft     -> text inside a tinted note or badge
//   rail-text                    on rail-bg  -> the rail's labels
//   border                       on paper    -> hairlines, 1.15:1 so they exist at all

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(readFileSync(join(root, "content/accents.json"), "utf8"));

const hex = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const lin = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => {
  const [l1, l2] = [lum(hex(a)), lum(hex(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

let failures = 0;
const rows = [];
for (const acc of spec.accents) {
  for (const mode of ["light", "dark"]) {
    const t = acc[mode];
    const checks = [
      ["ink/paper", ratio(t.ink, t.paper), 4.5],
      ["ink-soft/paper", ratio(t.inkSoft, t.paper), 4.5],
      ["label/paper", ratio(t.labelInk, t.paper), 4.5],
      ["muted/paper", ratio(t.muted, t.paper), 4.5],
      ["ink/surface", ratio(t.ink, t.surface), 4.5],
      ["accent/paper", ratio(t.accent, t.paper), 4.5],
      ["hover/paper", ratio(t.hover, t.paper), 4.5],
      ["accent-ink/paper", ratio(t.accentInk, t.paper), 4.5],
      ["on/accent", ratio(t.on, t.accent), 4.5],
      ["accent-ink/soft", ratio(t.accentInk, t.soft), 4.5],
      ["rail-text/rail", ratio(t.railText, t.railBg), 4.5],
      ["border/paper", ratio(t.border, t.paper), 1.15]
    ];
    for (const [name, r, min] of checks) {
      const ok = r >= min;
      if (!ok) failures++;
      if (!ok || process.argv.includes("--all")) rows.push(`${ok ? "ok  " : "FAIL"} ${acc.id.padEnd(11)} ${mode.padEnd(5)} ${name.padEnd(17)} ${r.toFixed(2)}:1`);
    }
  }
}
if (rows.length) console.log(rows.join("\n"));
if (failures) {
  console.error(`\n${failures} contrast check(s) under threshold.`);
  process.exit(1);
}
console.log(`All ${spec.accents.length} palettes pass ${12} checks in both themes.`);
