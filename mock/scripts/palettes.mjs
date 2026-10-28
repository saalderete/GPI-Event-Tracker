// The palettes the mock can wear, from mock/palettes.json (the Nerrix design
// library's hexes in five roles), written as CSS: one block per palette for
// the day, one for the night, in the mock's token names. The remaining tones
// are derived here in OKLab and every pairing is pushed until it meets the
// contrast it needs. Runs before dev and build; the outputs are committed too,
// and the same CSS is inlined into index.html so the opening screen already
// wears the chosen palette.
import { readFile, writeFile } from "node:fs/promises";

const here = new URL(".", import.meta.url);
const spec = JSON.parse(await readFile(new URL("../palettes.json", here), "utf8"));

// ---- colour maths: sRGB <-> OKLab, WCAG contrast
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const rgbToHex = (rgb) => "#" + rgb.map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, "0")).join("");
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function toLab(hex) {
  const [r, g, b] = hexToRgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromLab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return rgbToHex(rgb.map((c) => gam(clamp01(c))));
}
const lum = (hex) => { const [r, g, b] = hexToRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
/** a toward b by t, in OKLab */
const mix = (a, b, t) => { const A = toLab(a), B = toLab(b); return fromLab(A.map((v, i) => v + (B[i] - v) * t)); };
const lighter = (hex, dL) => { const [L, a, b] = toLab(hex); return fromLab([clamp01(L + dL), a, b]); };
/** move fg away from bg in lightness until the contrast holds (dir +1 lighter, -1 darker) */
function ensure(fg, bg, target, dir) {
  let c = fg, n = 0;
  while (contrast(c, bg) < target && n++ < 80) c = lighter(c, 0.008 * dir);
  return c;
}
const isLight = (hex) => lum(hex) > 0.4;

// ---- the derivation, from the five roles
function derive(c) {
  const dark = c.dark, inkDay = c.ink || c.dark, brand = c.brand, tint = c.tint || mix(brand, c.light || "#ffffff", 0.78);
  const light = c.light || mix(tint, "#ffffff", 0.66);
  // day
  const dPaper = light;
  const dSurface = lum(light) > 0.93 ? "#ffffff" : mix(light, "#ffffff", 0.55);
  const dSurface2 = mix(dPaper, tint, 0.42);
  const dInk = ensure(inkDay, dPaper, 10, -1);
  const dInkSoft = ensure(mix(dInk, dPaper, 0.3), dPaper, 7, -1);
  const dMuted = ensure(mix(dInk, dPaper, 0.46), dPaper, 4.6, -1);
  const dLine = mix(dPaper, dInk, 0.1), dLineStrong = mix(dPaper, dInk, 0.2);
  let dAccent = ensure(brand, dPaper, 3.05, -1);
  // the label on a button has to read too: darken the accent a touch until white or the ink does
  for (let n = 0; n < 40 && contrast("#ffffff", dAccent) < 4.5 && contrast(dInk, dAccent) < 4.5; n++) dAccent = lighter(dAccent, -0.006);
  const dAccentHover = lighter(dAccent, -0.07);
  const dAccentSoft = mix(dPaper, dAccent, 0.14);
  const dAccentInk = ensure(dAccent, dPaper, 4.6, -1);
  const dOn = contrast("#ffffff", dAccent) >= 4.5 ? "#ffffff" : contrast(dInk, dAccent) >= contrast("#ffffff", dAccent) ? dInk : "#ffffff";
  // night
  let nPaper = dark;
  while (contrast(light, nPaper) < 11) nPaper = lighter(nPaper, -0.01);
  const nSurface = lighter(nPaper, 0.035), nSurface2 = lighter(nPaper, 0.07);
  const nInk = ensure(mix(light, "#ffffff", 0.2), nPaper, 11, 1);
  const nInkSoft = ensure(mix(nInk, nPaper, 0.26), nPaper, 7, 1);
  const nMuted = ensure(mix(nInk, nPaper, 0.42), nPaper, 4.6, 1);
  const nLine = mix(nPaper, nInk, 0.1), nLineStrong = mix(nPaper, nInk, 0.18);
  const nAccent = ensure(c.bright || brand, nPaper, 4.6, 1);
  const nAccentHover = lighter(nAccent, 0.06);
  const nAccentSoft = mix(nPaper, nAccent, 0.2);
  const nAccentInk = ensure(nAccent, nPaper, 4.6, 1);
  const nOn = contrast(nPaper, nAccent) >= 4.5 ? nPaper : contrast("#000000", nAccent) >= 4.5 ? "#000000" : "#ffffff";
  return {
    light: { paper: dPaper, surface: dSurface, "surface-2": dSurface2, ink: dInk, "ink-soft": dInkSoft, muted: dMuted, line: dLine, "line-strong": dLineStrong, accent: dAccent, "accent-hover": dAccentHover, "accent-soft": dAccentSoft, "accent-ink": dAccentInk, "on-accent": dOn },
    dark: { paper: nPaper, surface: nSurface, "surface-2": nSurface2, ink: nInk, "ink-soft": nInkSoft, muted: nMuted, line: nLine, "line-strong": nLineStrong, accent: nAccent, "accent-hover": nAccentHover, "accent-soft": nAccentSoft, "accent-ink": nAccentInk, "on-accent": nOn },
  };
}

// ---- write everything
const order = ["paper", "surface", "surface-2", "ink", "ink-soft", "muted", "line", "line-strong", "accent", "accent-hover", "accent-soft", "accent-ink", "on-accent"];
const block = (t) => order.map((k) => `--${k}: ${t[k]};`).join(" ");
let css = `/* Generated by scripts/palettes.mjs from palettes.json. Do not edit. */\n`;
const list = [];
const report = [];
for (const p of spec.palettes) {
  const t = p.tokens || derive(p.colors);
  // :root[...] outranks the base tokens whatever the order of the sheets.
  css += `:root[data-palette="${p.id}"] { ${block(t.light)} }\n`;
  css += `:root[data-palette="${p.id}"][data-theme="dark"] { ${block(t.dark)} }\n`;
  list.push({ id: p.id, label: p.label, hint: p.hint, source: p.source, light: { paper: t.light.paper, accent: t.light.accent, ink: t.light.ink }, dark: { paper: t.dark.paper, accent: t.dark.accent, ink: t.dark.ink } });
  for (const [theme, tk] of Object.entries(t)) {
    const checks = [["ink/paper", contrast(tk.ink, tk.paper), 7], ["muted/paper", contrast(tk.muted, tk.paper), 4.5], ["accent/paper", contrast(tk.accent, tk.paper), 3], ["accent-ink/paper", contrast(tk["accent-ink"], tk.paper), 4.5], ["on-accent/accent", contrast(tk["on-accent"], tk.accent), 4.5], ["ink/surface-2", contrast(tk.ink, tk["surface-2"]), 7]];
    for (const [name, v, min] of checks) if (v < min) report.push(`${p.id} ${theme} ${name} ${v.toFixed(2)} < ${min}`);
  }
}
await writeFile(new URL("../src/styles/palettes.css", here), css);
await writeFile(new URL("../src/data/palettes.json", here), JSON.stringify(list, null, 2) + "\n");
const htmlPath = new URL("../index.html", here);
let html = await readFile(htmlPath, "utf8");
html = html.replace(/(<style id="palettes">)[\s\S]*?(<\/style>)/, `$1\n${css.replace(/^\/\*.*\*\/\n/, "")}$2`);
await writeFile(htmlPath, html);
console.log(`palettes: ${spec.palettes.length} written${report.length ? "\ncontrast short:\n  " + report.join("\n  ") : ", every pairing meets its contrast"}`);
