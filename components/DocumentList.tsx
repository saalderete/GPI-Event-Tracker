import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { IconDownload, IconPrint } from "./Icons";
import { fmtDate } from "@/lib/format";
import { withBase } from "@/lib/base";
import { pdfLink, pdfTitle } from "@/lib/pdf";
import type { PortalDocument } from "@/lib/registry";
import type { Sprint } from "@/lib/sprints";

// A sprint's documents as rows of a register: title, summary, status,
// version, and the PDF. Used on Home and on the sprint page.
export function DocumentList({ sprint, docs }: { sprint: Sprint; docs: PortalDocument[] }) {
  return (
    <ul>
      {docs.map((d) => {
        const link = pdfLink(d, withBase(`/print/${sprint.slug}/${d.slug}/`));
        return (
        <li key={d.slug} className="doc-row" data-reveal>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="display doc-title text-[1.35rem]">
                <Link href={`/${sprint.slug}/${d.slug}/`}>{d.title}</Link>
              </h3>
              <StatusBadge status={d.status} />
            </div>
            <p className="mt-1.5 max-w-[62ch] text-[0.98rem] leading-relaxed text-ink-soft">{d.summary}</p>
            <p className="meta mt-2">
              {d.kind === "appendix" ? "Appendix" : "Document"}, version {d.version}, revised {fmtDate(d.revised)}
            </p>
          </div>
          <div className="flex items-start gap-2 sm:justify-end">
            <Link href={`/${sprint.slug}/${d.slug}/`} className="btn btn-ghost">
              Read
            </Link>
            <a className="btn btn-ghost" href={link.href} download={link.file ? `${d.pdf}.pdf` : undefined} target={link.file ? undefined : "_blank"} title={pdfTitle(link, d.title)}>
              {link.file ? <IconDownload /> : <IconPrint />} {link.file ? "PDF" : "Print"}
            </a>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
