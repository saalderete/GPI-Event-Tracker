// The visitor's palette: one of the design library's, or the portal's own
// (the default, which lives in the stylesheet). A chosen palette is applied
// as inline custom properties on <html> for the current theme and kept in the
// browser with its tokens, so the opening script can put it on before paint.
export const DEFAULT_PALETTE = "bugambilia";
export const TOKENS = ["paper", "surface", "surface-2", "ink", "ink-soft", "muted", "line", "line-strong", "accent", "accent-hover", "accent-soft", "accent-ink", "on-accent"];

let all = null;
/** The list, loaded once, only when a palette other than the default is in play or the picker opens. */
export async function loadPalettes() {
  if (!all) all = (await import("../data/palettes.json")).default;
  return all;
}

export function applyPalette(entry, dark) {
  const root = document.documentElement;
  if (!entry || entry.id === DEFAULT_PALETTE) {
    for (const k of TOKENS) root.style.removeProperty(`--${k}`);
    try { localStorage.removeItem("gpi-palette-tokens"); } catch {}
  } else {
    const t = entry[dark ? "dark" : "light"];
    for (const k of TOKENS) root.style.setProperty(`--${k}`, t[k]);
    try { localStorage.setItem("gpi-palette-tokens", JSON.stringify({ id: entry.id, light: entry.light, dark: entry.dark })); } catch {}
  }
  const paper = getComputedStyle(root).getPropertyValue("--paper").trim();
  if (paper) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", paper);
}
