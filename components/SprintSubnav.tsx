"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Sprint } from "@/lib/sprints";
import type { PortalDocument } from "@/lib/registry";

// Under a sprint's breadcrumb: every page of that sprint, so the record
// stays visible without opening the rail.
export function SprintSubnav({ sprint, docs }: { sprint: Sprint; docs: PortalDocument[] }) {
  const pathname = usePathname() || "/";
  const tabs = [
    { href: `/${sprint.slug}/`, label: "Overview" },
    ...docs.map((d) => ({ href: `/${sprint.slug}/${d.slug}/`, label: d.title }))
  ];
  return (
    <nav aria-label={`Sprint ${sprint.number} pages`} className="mb-8 -mx-1 flex gap-1 overflow-x-auto no-print">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[12px] tracking-wide transition-colors ${
              active ? "bg-ink text-paper" : "text-muted hover:bg-surface-muted hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
