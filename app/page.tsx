import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Spine } from "@/components/Spine";
import { DocumentList } from "@/components/DocumentList";
import { IconArrow, IconDownload } from "@/components/Icons";
import { site } from "@/lib/site";
import { sprints } from "@/lib/sprints";
import { documents } from "@/lib/registry";
import { interviews, candidates } from "@/lib/evidence";
import { withBase } from "@/lib/base";

export default function Home() {
  const live = sprints.filter((s) => s.status === "live");
  const latest = live.at(-1) ?? sprints[0];
  const docs = documents.filter((d) => d.sprint === latest.number);

  return (
    <Shell>
      {/* Hero: the name, set like the title of a poster. */}
      <section className="pt-2 md:pt-8">
        <p className="eyebrow">{site.courseLine}</p>
        <h1 className="display display-wide mt-5 max-w-[10ch] text-[clamp(3rem,9.4vw,7rem)]">{site.name}</h1>
        <p className="mt-7 max-w-[30ch] font-serif text-[1.3rem] leading-[1.4] text-ink sm:text-[1.45rem]">{site.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${latest.slug}/`} className="btn btn-primary">
            Open Sprint {latest.number} <IconArrow />
          </Link>
          <Link href="/about/" className="btn btn-ghost">
            About the team
          </Link>
        </div>
        {site.heroImage ? (
          // Optional: drop a real photo at public/images/hero.jpg and set
          // site.heroImage. Nothing renders until then; no placeholder art.
          <img src={withBase(site.heroImage.src)} alt={site.heroImage.alt} className="mt-12 w-full rounded-[var(--radius-lg)]" />
        ) : null}
      </section>

      {/* The business problem, the one sentence the guidelines ask for on Home. */}
      <section className="mt-16 card p-6 sm:p-8" aria-labelledby="problem">
        <h2 id="problem" className="display text-[1.15rem] text-muted">
          The business problem
        </h2>
        <p className="mt-3 max-w-[58ch] font-serif text-[1.25rem] leading-[1.5] sm:text-[1.4rem]">{site.problem}</p>
        <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-soft">{site.nameNote}</p>
        <p className="meta mt-5">
          Tested in Sprint 1 with {interviews.length} customer interviews across {candidates.length} candidate problems.{" "}
          <Link href={`/${latest.slug}/market-research/`} className="underline hover:text-ink">
            Read the research
          </Link>
          .
        </p>
      </section>

      {/* The semester. */}
      <section className="mt-20" aria-labelledby="semester">
        <h2 id="semester" className="display text-[1.9rem] sm:text-[2.2rem]">
          Six sprints. One record.
        </h2>
        <p className="mt-2 mb-9 max-w-[60ch] text-[1rem] text-ink-soft">
          Each sprint adds a page and its documents. Earlier pages stay live; nothing is replaced, only added to.
        </p>
        <Spine />
      </section>

      {/* What is live now. */}
      <section className="mt-20" aria-labelledby="live-now">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h2 id="live-now" className="display text-[1.9rem] sm:text-[2.2rem]">
            <Link href={`/${latest.slug}/`} className="hover:text-accent">
              Sprint {latest.number}: {latest.title}
            </Link>
          </h2>
          <span className="badge badge-live">Live</span>
        </div>
        <DocumentList sprint={latest} docs={docs} />
      </section>

      {/* Every PDF, in one place, for the record. */}
      <section className="mt-20" aria-labelledby="pdfs">
        <h2 id="pdfs" className="display text-[1.9rem] sm:text-[2.2rem]">
          Every document, as a PDF
        </h2>
        <p className="mt-2 max-w-[60ch] text-[1rem] text-ink-soft">
          Each public document exists twice: as the page you read here and as a PDF generated from the same source at build time.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {documents.map((d) => (
            <li key={d.pdf}>
              <a className="btn btn-ghost" href={withBase(`/pdf/${d.pdf}.pdf`)} download>
                <IconDownload /> {d.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
