import Link from "next/link";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="meta mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 no-print">
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden className="text-border">/</span> : null}
          {c.href ? (
            <Link href={c.href} className="hover:text-ink hover:underline">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
