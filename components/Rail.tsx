"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sprints, statusWord, type SprintStatus } from "@/lib/sprints";
import { site } from "@/lib/site";
import { fmtDay } from "@/lib/format";
import { ThemeControls } from "./ThemeControls";
import { IconHome, IconUsers } from "./Icons";

const RAIL_KEY = "gpi-rail";
const CIRCLE = 52;
const STEP = 44;
const GAP = 30;

// The rail: the site's map and the semester's progress in one column. Home
// and About, then a circle per sprint. Unfolds from the mark on first load
// (the one page-load moment on the site), then stays however the visitor
// left it. Ported from KasaPro's fluid rail; one accent instead of a
// gradient per section, and sprint circles instead of icons.
export function Rail() {
  const pathname = usePathname() || "/";
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let open = true;
    try {
      open = localStorage.getItem(RAIL_KEY) !== "0";
    } catch {}
    // One frame later so the unfold transition has a closed state to leave.
    const raf = requestAnimationFrame(() => setExpanded(open));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    try {
      localStorage.setItem(RAIL_KEY, next ? "1" : "0");
    } catch {}
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  type Item = {
    key: string;
    href: string;
    label: string;
    sub?: string;
    icon?: React.ReactNode;
    num?: number;
    state?: SprintStatus;
    gapBefore?: boolean;
  };
  const items: Item[] = [
    { key: "home", href: "/", label: "Home", icon: <IconHome /> },
    { key: "about", href: "/about/", label: "About us", icon: <IconUsers /> },
    ...sprints.map((s, i) => ({
      key: s.slug,
      href: `/${s.slug}/`,
      label: `Sprint ${s.number}`,
      sub: s.status === "upcoming" ? `Due ${fmtDay(s.due)}` : statusWord[s.status],
      num: s.number,
      state: s.status,
      gapBefore: i === 0
    }))
  ];

  let y = 0;
  const placed = items.map((it, i) => {
    y += STEP + (it.gapBefore ? GAP : 0);
    return { ...it, y, i: i + 1 };
  });
  const stackH = CIRCLE + y;

  return (
    <aside className="rail" data-expanded={expanded ? "true" : "false"}>
      <noscript>
        <style>{`.rail .rail-stack{height:${stackH}px}.rail .rail-link{opacity:1;visibility:visible;transform:translateY(var(--y))}`}</style>
      </noscript>
      <nav className="rail-stack" style={{ "--stack-h": `${stackH}px` } as React.CSSProperties} aria-label="Main navigation">
        <button
          type="button"
          className="rail-item rail-static rail-toggle"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
        >
          <span className="rail-glow" aria-hidden />
          <span className="rail-fill" aria-hidden />
          <span className="rail-face rail-face-mark" aria-hidden>
            {site.short}
          </span>
          <span className="rail-label" aria-hidden>
            {expanded ? "Collapse" : "Expand"}
          </span>
        </button>

        {placed.map((it) => {
          const active = isActive(it.href);
          const cls = ["rail-item", "rail-link", active ? "active" : "", it.num && it.state ? `is-${it.state}` : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <Link
              key={it.key}
              href={it.href}
              className={cls}
              style={{ "--i": it.i, "--y": `${it.y}px` } as React.CSSProperties}
              aria-current={active ? "page" : undefined}
              aria-label={it.sub ? `${it.label}, ${it.sub}` : it.label}
            >
              <span className="rail-glow" aria-hidden />
              <span className="rail-fill" aria-hidden />
              {it.num ? <span className="rail-num" aria-hidden>{it.num}</span> : <span className="rail-icon">{it.icon}</span>}
              <span className="rail-label" aria-hidden>
                {it.label}
                {it.sub ? <small>{it.sub}</small> : null}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="rail-foot">
        <ThemeControls variant="rail" />
      </div>
    </aside>
  );
}
