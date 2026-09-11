import Link from "next/link";
import type { CSSProperties } from "react";
import { Spine } from "./Spine";
import { StatusBadge } from "./StatusBadge";
import { IconDownload } from "./Icons";
import { site } from "@/lib/site";
import { documents, type PortalDocument } from "@/lib/registry";
import type { Sprint } from "@/lib/sprints";
import { interviews, candidates } from "@/lib/evidence";
import { fmtDate } from "@/lib/format";
import { withBase } from "@/lib/base";

// Home written on the whiteboard the clip holds on: headings in marker, the
// problem on a printed sheet under a magnet, the semester as a line, one
// sticky note per document, and every PDF along the bottom.
const tilts = ["-1.3deg", "0.9deg", "-0.6deg", "1.1deg"];

export function BoardHome({ latest, docs }: { latest: Sprint; docs: PortalDocument[] }) {
  return (
    <>
      <section className="board-row" aria-labelledby="problem">
        <h2 id="problem" className="marker" data-reveal>
          The business problem
        </h2>
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-start">
          <div className="pinned" data-reveal>
            <span className="magnet" aria-hidden />
            <p className="max-w-[58ch] font-serif text-[1.2rem] leading-[1.5] sm:text-[1.35rem]">{site.problem}</p>
            <p className="meta mt-5">
              Tested in Sprint 1 with {interviews.length} customer interviews across {candidates.length} candidate problems.{" "}
              <Link href={`/${latest.slug}/market-research/`} className="underline hover:text-ink">
                Read the research
              </Link>
              .
            </p>
          </div>
          <p className="marker-note max-w-[26ch] lg:pt-3" data-reveal>
            {site.nameNote}
          </p>
        </div>
      </section>

      <section className="board-row" aria-labelledby="semester">
        <h2 id="semester" className="marker" data-reveal>
          Six sprints. One record.
        </h2>
        <p className="board-lede mt-3 mb-9" data-reveal>
          Each sprint adds a page and its documents. Earlier pages stay live; nothing is replaced, only added to.
        </p>
        <Spine />
      </section>

      <section className="board-row" aria-labelledby="live-now">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2" data-reveal>
          <h2 id="live-now" className="marker">
            <Link href={`/${latest.slug}/`}>
              Sprint {latest.number}: {latest.title}
            </Link>
          </h2>
          <span className="badge badge-live">Live</span>
        </div>
        <ul className="notes mt-6">
          {docs.map((d, i) => (
            <li key={d.slug} className="note" style={{ "--tilt": tilts[i % tilts.length] } as CSSProperties} data-reveal>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="note-title">
                  <Link href={`/${latest.slug}/${d.slug}/`}>{d.title}</Link>
                </h3>
                <StatusBadge status={d.status} />
              </div>
              <p>{d.summary}</p>
              <p className="meta">
                {d.kind === "appendix" ? "Appendix" : "Document"}, version {d.version}, revised {fmtDate(d.revised)}
              </p>
              <div className="note-links">
                <Link href={`/${latest.slug}/${d.slug}/`}>Read</Link>
                <a href={withBase(`/pdf/${d.pdf}.pdf`)} download title={`Download ${d.title} as PDF`}>
                  PDF
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="board-row" aria-labelledby="pdfs">
        <h2 id="pdfs" className="marker" data-reveal>
          Every document, as a PDF
        </h2>
        <p className="board-lede mt-3" data-reveal>
          Each public document exists twice: as the page you read here and as a PDF generated from the same source at build time.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" data-reveal>
          {documents.map((d) => (
            <li key={d.pdf}>
              <a className="btn btn-ghost" href={withBase(`/pdf/${d.pdf}.pdf`)} download>
                <IconDownload /> {d.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
