"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { IconChevron } from "./Icons";

export interface MenuItemSpec {
  label: string;
  icon?: ReactNode;
  swatch?: string;
  hint?: string;
  href?: string;
  external?: boolean;
  checked?: boolean;
  onSelect?: () => void;
  separatorAbove?: boolean;
}

interface Props {
  items: MenuItemSpec[];
  label?: string;
  icon?: ReactNode;
  align?: "left" | "right";
  up?: boolean;
  /** Custom trigger; receives the open state and the props to spread on the button. */
  trigger?: (open: boolean, props: Record<string, unknown>) => ReactNode;
  className?: string;
  role?: "menu" | "listbox";
  /** Keep the list open after a choice (multi-select filters). */
  closeOnSelect?: boolean;
}

// KasaPro's action menu: a toggle, a staggered list, closes on outside click
// and Escape. Items can be links, buttons, or checkable choices (the accent
// picker uses those).
export function ActionMenu({ items, label, icon, align = "left", up = false, trigger, className = "", role = "menu", closeOnSelect = true }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleProps = {
    type: "button" as const,
    "aria-haspopup": (role === "menu" ? "menu" : "listbox") as "menu" | "listbox",
    "aria-expanded": open,
    "aria-controls": id,
    onClick: () => setOpen((v) => !v)
  };

  return (
    <div ref={root} className={`action-menu ${open ? "open" : ""} ${className}`}>
      {trigger ? (
        trigger(open, toggleProps)
      ) : (
        <button className="menu-toggle" {...toggleProps}>
          {icon}
          {label}
          <span className="action-chevron">
            <IconChevron />
          </span>
        </button>
      )}
      <div id={id} role={role} className={`menu-list align-${align} ${up ? "align-up" : ""}`}>
        {items.map((it, i) => {
          const inner = (
            <>
              {it.swatch ? <span className="swatch" style={{ background: it.swatch }} aria-hidden /> : it.icon}
              <span>{it.label}</span>
              {it.hint ? <span className="hint">{it.hint}</span> : null}
            </>
          );
          const common = {
            className: "menu-item",
            role: role === "menu" ? "menuitem" : "option",
            "aria-checked": it.checked,
            onClick: () => {
              it.onSelect?.();
              if (closeOnSelect) setOpen(false);
            }
          } as const;
          return (
            <div key={it.label + i}>
              {it.separatorAbove ? <div className="menu-sep" /> : null}
              {it.href ? (
                <a href={it.href} target={it.external ? "_blank" : undefined} rel={it.external ? "noopener" : undefined} {...common}>
                  {inner}
                </a>
              ) : (
                <button type="button" {...common}>
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
