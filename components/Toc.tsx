"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/toc";

// "On this page": the document's headings, with the one in view marked.
export function Toc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    const els = entries.map((e) => document.getElementById(e.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (list) => {
        const visible = list.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: [0, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries]);

  if (!entries.length) return null;
  return (
    <nav aria-label="On this page" className="no-print">
      <p className="label mb-3">On this page</p>
      <ol className="space-y-1.5 border-l border-border">
        {entries.map((e) => (
          <li key={e.id} className={e.depth === 3 ? "pl-3" : ""}>
            <a
              href={`#${e.id}`}
              className={`-ml-px block border-l-2 py-0.5 pl-3 font-mono text-[12px] leading-snug transition-colors ${
                active === e.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
