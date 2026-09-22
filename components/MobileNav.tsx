"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconFile, IconGrid, IconHome, IconUsers } from "./Icons";
import { sprints, isPublished, currentSprint } from "@/lib/sprints";
import { documents } from "@/lib/registry";

// The phone bar: a fixed strip of the four places a visitor goes most.
export function MobileNav() {
  const pathname = usePathname() || "/";
  // The sprint in progress, and the latest sprint with an evidence appendix.
  const current = currentSprint();
  const latest = [...sprints].reverse().find((s) => isPublished(s) && documents.some((d) => d.sprint === s.number && d.slug === "evidence"));
  const items = [
    { href: "/", label: "Home", icon: <IconHome /> },
    { href: "/about/", label: "About", icon: <IconUsers /> },
    { href: `/${current.slug}/`, label: `Sprint ${current.number}`, icon: <IconFile /> },
    ...(latest ? [{ href: `/${latest.slug}/evidence/`, label: "Evidence", icon: <IconGrid /> }] : [])
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href.endsWith("/evidence/") ? pathname.startsWith(href) : pathname.startsWith(href) && !pathname.includes("/evidence/");
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={isActive(it.href) ? "active" : ""} aria-current={isActive(it.href) ? "page" : undefined}>
          {it.icon}
          <span>{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
