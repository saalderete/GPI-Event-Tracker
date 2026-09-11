import type { ReactNode } from "react";
import { fmtDate } from "@/lib/format";
import { memberById } from "@/lib/team";
import type { PortalDocument } from "@/lib/registry";
import type { Sprint } from "@/lib/sprints";
import type { TocEntry } from "@/lib/toc";
import { Toc } from "./Toc";
import { PdfMenu } from "./PdfMenu";
import { StatusBadge } from "./StatusBadge";
import { withBase } from "@/lib/base";

interface Props {
  sprint: Sprint;
  doc: PortalDocument;
  toc: TocEntry[];
  /** Full-width body with no table of contents (the evidence grid). */
  wide?: boolean;
  children: ReactNode;
}

// One shape for every document: eyebrow, title, the record line (version,
// status, revision date, owner), the PDF, then the reading column with its
// table of contents, then the revision history. Sprint 2's change log will
// hang off that history.
export function DocLayout({ sprint, doc, toc, wide = false, children }: Props) {
  const owner = memberById(doc.owner);
  return (
    <article>
      <header className="mb-10 border-b border-border pb-8" data-reveal>
        <p className="eyebrow mb-3">
          Sprint {sprint.number} · {doc.kind === "appendix" ? "Appendix" : "Document"}
        </p>
        <h1 className="display text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem]">{doc.title}</h1>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">{doc.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <StatusBadge status={doc.status} />
          <dl className="meta flex flex-wrap gap-x-5 gap-y-1">
            <div className="flex gap-1.5">
              <dt>Version</dt>
              <dd className="text-ink">{doc.version}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Revised</dt>
              <dd className="text-ink">{fmtDate(doc.revised)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Owner</dt>
              <dd className="text-ink">{owner ? owner.name : "To be assigned"}</dd>
            </div>
          </dl>
          <div className="sm:ml-auto">
            <PdfMenu pdf={doc.pdf} printHref={withBase(`/print/${sprint.slug}/${doc.slug}/`)} title={doc.title} />
          </div>
        </div>
      </header>

      {wide ? (
        <div className="min-w-0">{children}</div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
          <div className="min-w-0">{children}</div>
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <Toc entries={toc} />
            </div>
          </aside>
        </div>
      )}

      <section className="mt-16 border-t border-border pt-8" aria-labelledby="revisions" data-reveal>
        <h2 id="revisions" className="display mb-4 text-[1.4rem]">
          Revision history
        </h2>
        <table className="w-full text-[0.9rem]">
          <thead>
            <tr className="border-b border-ink text-left">
              <th className="label pb-2 pr-6 font-medium">Version</th>
              <th className="label pb-2 pr-6 font-medium">Date</th>
              <th className="label pb-2 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {[...doc.revisions].reverse().map((r) => (
              <tr key={r.version} className="border-t border-border align-top">
                <td className="py-2.5 pr-6 font-mono text-[12.5px]">{r.version}</td>
                <td className="py-2.5 pr-6 font-mono text-[12.5px] text-muted">{fmtDate(r.date)}</td>
                <td className="py-2.5 text-ink-soft">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="meta mt-4">
          From Sprint 2 on, every revision to a published document is also recorded in that sprint&apos;s change log: what changed, why, and what it affected downstream.
        </p>
      </section>
    </article>
  );
}
