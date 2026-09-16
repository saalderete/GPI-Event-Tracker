"use client";

import { useEffect, useState } from "react";
import { ActionMenu } from "./ActionMenu";
import { IconMoon, IconPalette, IconSun } from "./Icons";
import { accents, chip, defaultAccent } from "@/lib/accents";

const THEME_KEY = "gpi-theme";
const ACCENT_KEY = "gpi-accent";

function readTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
function readAccent(): string {
  return document.documentElement.getAttribute("data-accent") || defaultAccent;
}

// Dark mode and the palette picker. Both write to <html> and localStorage;
// app/layout.tsx restores them before first paint. The palettes live in
// content/accents.json and are contrast-checked by scripts/contrast.mjs.
// A chip shows each palette's paper and accent together, since a palette
// changes the whole page and not only the links.
export function ThemeControls({ variant }: { variant: "rail" | "inline" }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [accent, setAccent] = useState(defaultAccent);

  useEffect(() => {
    setTheme(readTheme());
    setAccent(readAccent());
  }, []);

  const applyTheme = (next: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };
  const applyAccent = (id: string) => {
    document.documentElement.setAttribute("data-accent", id);
    try {
      localStorage.setItem(ACCENT_KEY, id);
    } catch {}
    setAccent(id);
  };

  const items = accents.map((a) => ({
    label: a.label,
    swatch: chip(theme === "dark" ? a.dark : a.light),
    checked: a.id === accent,
    hint: a.id === accent ? "current" : undefined,
    onSelect: () => applyAccent(a.id)
  }));

  if (variant === "rail") {
    return (
      <>
        <button
          type="button"
          className="rail-item rail-static"
          onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={theme === "dark"}
        >
          <span className="rail-glow" aria-hidden />
          <span className="rail-fill" aria-hidden />
          <span className="rail-icon">{theme === "dark" ? <IconSun /> : <IconMoon />}</span>
          <span className="rail-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
        <ActionMenu
          role="listbox"
          up
          align="left"
          items={items}
          trigger={(open, props) => (
            <button {...props} className="rail-item rail-static" aria-label="Choose the site palette">
              <span className="rail-glow" aria-hidden />
              <span className="rail-fill" aria-hidden />
              <span className="rail-icon">
                <IconPalette />
              </span>
              <span className="rail-label">Palette</span>
            </button>
          )}
        />
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="label">Theme</span>
        <button
          type="button"
          className="btn btn-ghost !py-1.5 !px-3"
          onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
          aria-pressed={theme === "dark"}
        >
          {theme === "dark" ? <IconSun /> : <IconMoon />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="label">Palette</span>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Site palette">
          {accents.map((a) => {
            const p = theme === "dark" ? a.dark : a.light;
            const color = p.accent;
            const on = a.id === accent;
            return (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={a.label}
                title={`${a.label}: ${a.hint}`}
                onClick={() => applyAccent(a.id)}
                className="h-5 w-5 rounded-full transition-transform hover:scale-110"
                style={{
                  background: chip(p),
                  boxShadow: on ? `0 0 0 2px var(--paper), 0 0 0 4px ${color}` : "inset 0 0 0 1px rgba(0,0,0,0.18)"
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
