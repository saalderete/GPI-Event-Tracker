"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconFile, IconGrid, IconHome, IconUsers } from "./Icons";
import { liveSprints } from "@/lib/sprints";

// The phone bar: a fixed strip of the four places a visitor goes most.
export function MobileNav() {
  const pathname = usePathname() || "/";
  const latest = liveSprints().at(-1);
  const items = [
    { href: "/", label: "Home", icon: <IconHome /> },
    { href: "/about/", label: "About", icon: <IconUsers /> },
    ...(latest
      ? [
          { href: `/${latest.slug}/`, label: `Sprint ${latest.number}`, icon: <IconFile /> },
          { href: `/${latest.slug}/evidence/`, label: "Evidence", icon: <IconGrid /> }
        ]
      : [])
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
