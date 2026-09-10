// Checks every accent preset against the paper it will sit on, in both
// themes. Run before adding or tuning an accent; the build refuses a preset
// that fails, so a pretty colour can't ship as an unreadable link.
//
// Rules, all WCAG AA (4.5:1) unless noted:
//   accent  on paper   -> links and accent text on the page
//   hover   on paper   -> the hover state of the same
//   on      on accent  -> the label inside a filled pill or button
//   ink     on soft    -> text inside a tinted callout or badge
//
// The paper is the accent-tinted paper the site actually renders
// (color-mix in srgb at content/accents.json "tint" percent), not the
// untinted base, so the check matches what a visitor sees.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(readFileSync(join(root, "content/accents.json"), "utf8"));

const hex = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const lin = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => {
  const [l1, l2] = [lum(hex(a)), lum(hex(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
// color-mix(in srgb, accent P%, base) as the browser computes it.
const mix = (accent, base, pct) => {
  const a = hex(accent), b = hex(base), p = pct / 100;
  return toHex(a.map((v, i) => v * p + b[i] * (1 - p)));
};

let failures = 0;
const rows = [];
for (const acc of spec.accents) {
  for (const mode of ["light", "dark"]) {
    const t = acc[mode];
    const paper = mix(t.accent, spec.paper[mode], spec.tint);
    const checks = [
      ["accent/paper", ratio(t.accent, paper), 4.5],
      ["hover/paper", ratio(t.hover, paper), 4.5],
      ["on/accent", ratio(t.on, t.accent), 4.5],
      ["ink/soft", ratio(t.ink, t.soft), 4.5]
    ];
    for (const [name, r, min] of checks) {
      const ok = r >= min;
      if (!ok) failures++;
      rows.push(`${ok ? "ok  " : "FAIL"} ${acc.id.padEnd(11)} ${mode.padEnd(5)} ${name.padEnd(13)} ${r.toFixed(2)}:1  (paper ${paper})`);
    }
  }
}
console.log(rows.join("\n"));
if (failures) {
  console.error(`\n${failures} contrast check(s) under threshold.`);
  process.exit(1);
}
console.log("\nAll accent presets pass.");
