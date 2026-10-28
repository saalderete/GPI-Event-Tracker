// The palettes a visitor can pick: every palette in the Nerrix design library
// (palettes/library.json, public dopely.colors and dyslove.design posts) plus
// the portal's own. Each library palette gives three to five colours; this
// script casts them into roles (the dark anchor, the day accent, the night
// accent, the soft tint, the day paper), derives the mock's thirteen tokens
// for the day and the night in OKLab, pushes every pairing until it meets its
// contrast, and writes src/data/palettes.json for the picker. The chosen
// palette is applied as inline custom properties on <html>, so no CSS is
// generated. Runs before dev and build; the output is committed too.
import { readFile, writeFile } from "node:fs/promises";

const here = new URL(".", import.meta.url);
const lib = JSON.parse(await readFile(new URL("../palettes/library.json", here), "utf8"));
const roles = JSON.parse(await readFile(new URL("../palettes/roles.json", here), "utf8"));

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
const mix = (a, b, t) => { const A = toLab(a), B = toLab(b); return fromLab(A.map((v, i) => v + (B[i] - v) * t)); };
const lighter = (hex, dL) => { const [L, a, b] = toLab(hex); return fromLab([clamp01(L + dL), a, b]); };
function ensure(fg, bg, target, dir) { let c = fg, n = 0; while (contrast(c, bg) < target && n++ < 90) c = lighter(c, 0.008 * dir); return c; }

// ---- roles from a library palette's own colours
function autoRoles(colors) {
  const cs = colors.map((c) => { const lab = toLab(c.hex); return { hex: c.hex, L: lab[0], C: Math.hypot(lab[1], lab[2]) }; });
  const byL = [...cs].sort((a, b) => a.L - b.L);
  const dark = byL[0];
  let rest = cs.filter((c) => c !== dark);
  const lightest = byL[byL.length - 1];
  let light = null;
  if (lightest !== dark && lightest.L > 0.92 && lightest.C < 0.07) { light = lightest; rest = rest.filter((c) => c !== light); }
  const score = (c) => c.C * (c.L > 0.3 && c.L < 0.86 ? 1 : 0.5);
  const brand = rest.length ? [...rest].sort((a, b) => score(b) - score(a))[0] : dark;
  rest = rest.filter((c) => c !== brand);
  const bright = rest.filter((c) => c.L > brand.L && c.C > 0.05).sort((a, b) => b.C - a.C)[0] || null;
  if (bright) rest = rest.filter((c) => c !== bright);
  const tint = rest.filter((c) => c.L > 0.75).sort((a, b) => b.L - a.L)[0] || null;
  return { dark: dark.hex, brand: brand.hex, bright: bright?.hex, tint: tint?.hex, light: light?.hex };
}

// ---- the thirteen tokens, day and night, from the roles
function derive(c) {
  const dark = c.dark, inkDay = c.ink || c.dark, brand = c.brand;
  const tint = c.tint || mix(brand, c.light || "#ffffff", 0.78);
  const light = c.light || mix(tint, "#ffffff", 0.66);
  const dPaper = light;
  const dSurface = lum(light) > 0.93 ? "#ffffff" : mix(light, "#ffffff", 0.55);
  const dSurface2 = mix(dPaper, tint, 0.42);
  const dInk = ensure(inkDay, dPaper, 10, -1);
  const dInkSoft = ensure(mix(dInk, dPaper, 0.3), dPaper, 7, -1);
  const dMuted = ensure(mix(dInk, dPaper, 0.46), dPaper, 4.6, -1);
  const dLine = mix(dPaper, dInk, 0.1), dLineStrong = mix(dPaper, dInk, 0.2);
  let dAccent = ensure(brand, dPaper, 3.05, -1);
  for (let n = 0; n < 40 && contrast("#ffffff", dAccent) < 4.5 && contrast(dInk, dAccent) < 4.5; n++) dAccent = lighter(dAccent, -0.006);
  const dAccentHover = lighter(dAccent, -0.07);
  const dAccentSoft = mix(dPaper, dAccent, 0.14);
  const dAccentInk = ensure(dAccent, dPaper, 4.6, -1);
  const dOn = contrast("#ffffff", dAccent) >= 4.5 ? "#ffffff" : contrast(dInk, dAccent) >= contrast("#ffffff", dAccent) ? dInk : "#ffffff";
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

// ---- the list, in the order the picker shows it
const SERIES = [
  ["dyslove.design", "New Color Combos", "Dark and bright pairs"],
  ["dyslove.design", "Summer Color Combos", "Summer pairs"],
  ["dopely.colors", "Autumn Color Palettes", "Autumn"],
  ["dopely.colors", "Beauty Brand Color Palettes", "Beauty brands"],
  ["dopely.colors", "Color Combos (one color per slide)", "Colour combos"],
  ["dopely.colors", "Fashion Brand Color Palettes", "Fashion brands"],
  ["dopely.colors", "Food Brand Color Palettes", "Food brands"],
  ["dopely.colors", "Gradient Color Palettes", "Gradients"],
  ["dopely.colors", "Monochrome Color Palettes", "Monochrome"],
  ["dopely.colors", "Neon Color Palettes", "Neon"],
  ["dopely.colors", "Retro Color Palettes", "Retro"],
  ["dopely.colors", "SaaS Landing Page Color Palettes", "Landing pages"],
  ["dopely.colors", "Spring Color Palettes", "Spring"],
  ["dopely.colors", "Winter Color Palettes", "Winter"],
];
const seriesIndex = (p) => SERIES.findIndex(([acc, s]) => acc === p.source && s === p.series);
const list = roles.own.map((o) => ({ id: o.id, label: o.label, hint: o.hint, series: o.series, account: o.account, post: o.post, swatch: o.swatch, names: o.names, light: o.tokens.light, dark: o.tokens.dark }));
const sorted = [...lib.palettes].sort((a, b) => seriesIndex(a) - seriesIndex(b) || a.name.localeCompare(b.name, undefined, { numeric: true }));
const report = [];
for (const p of sorted) {
  const si = seriesIndex(p);
  if (si < 0) { report.push(`unplaced series: ${p.source} ${p.series}`); continue; }
  const cur = roles.curated[p.id];
  const names = p.colors.map((c) => c.name);
  const t = derive(cur ? cur.colors : autoRoles(p.colors));
  list.push({ id: cur ? cur.id : p.id, label: cur ? cur.label : p.name, hint: cur ? cur.hint : names.join(", "), series: SERIES[si][2], account: p.source, post: p.post, swatch: p.colors.map((c) => c.hex), names, light: t.light, dark: t.dark });
}
for (const e of list) for (const [theme, tk] of Object.entries({ light: e.light, dark: e.dark })) {
  const checks = [["ink/paper", contrast(tk.ink, tk.paper), 7], ["muted/paper", contrast(tk.muted, tk.paper), 4.5], ["accent/paper", contrast(tk.accent, tk.paper), 3], ["accent-ink/paper", contrast(tk["accent-ink"], tk.paper), 4.5], ["on-accent/accent", contrast(tk["on-accent"], tk.accent), 4.5], ["ink/surface-2", contrast(tk.ink, tk["surface-2"]), 7]];
  for (const [name, v, min] of checks) if (v < min - 0.01) report.push(`${e.id} ${theme} ${name} ${v.toFixed(2)} < ${min}`);
}
await writeFile(new URL("../src/data/palettes.json", here), JSON.stringify(list) + "\n");
console.log(`palettes: ${list.length} written${report.length ? "\n  " + report.join("\n  ") : ", every pairing meets its contrast"}`);
