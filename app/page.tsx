import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Spine } from "@/components/Spine";
import { DocumentList } from "@/components/DocumentList";
import { HeroVideo } from "@/components/HeroVideo";
import { ScrollHero, HeroWords } from "@/components/ScrollHero";
import { BoardHero } from "@/components/BoardHero";
import { BoardHome } from "@/components/BoardHome";
import { PdfButtons } from "@/components/PdfButtons";
import { site } from "@/lib/site";
import { sprints, currentSprint, isPublished, statusWord } from "@/lib/sprints";
import { documents } from "@/lib/registry";
import { interviews, candidates } from "@/lib/evidence";

export default function Home() {
  // The sprint in progress, and the latest sprint with documents on its page.
  const current = currentSprint();
  const latest = [...sprints].reverse().find((s) => isPublished(s) && documents.some((d) => d.sprint === s.number)) ?? current;
  const docs = documents.filter((d) => d.sprint === latest.number);

  const words = (
    <HeroWords eyebrow={site.courseLine} name={site.portalTitle} mark={site.short} tagline={site.portalTagline} primaryHref={`/${current.slug}/`} primaryLabel={`Open Sprint ${current.number}`} />
  );

  // One shot: the desk, then the whiteboard the rest of Home is written on.
  if (site.heroMode === "board") {
    return (
      <Shell hero={<BoardHero>{words}</BoardHero>} board>
        <BoardHome current={current} latest={latest} docs={docs} />
      </Shell>
    );
  }

  return (
    <Shell hero={site.heroMode === "scroll" ? <ScrollHero>{words}</ScrollHero> : undefined}>
      {site.heroMode === "card" ? (
        /* The clip plays once in a frame beside the name. */
        <section className="grid gap-10 pt-2 md:pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14">
          <div>{words}</div>
          <div className="card overflow-hidden p-0">
            <HeroVideo className="block aspect-video h-auto w-full object-cover" />
          </div>
        </section>
      ) : null}

      {/* The business problem, the one sentence the guidelines ask for on Home. */}
      <section className={`card p-6 sm:p-8 ${site.heroMode === "card" ? "mt-16" : ""}`} aria-labelledby="problem">
        <h2 id="problem" className="display text-[1.15rem] text-muted">
          The business problem
        </h2>
        <p className="mt-3 max-w-[58ch] font-serif text-[1.25rem] leading-[1.5] sm:text-[1.4rem]">{site.problem}</p>
        <p className="mt-4 max-w-[36ch] font-serif italic text-ink-soft">{site.nameNote}</p>
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
          <span className={`badge ${latest.status === "live" ? "badge-live" : "badge-accent"}`}>{statusWord[latest.status]}</span>
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
        <PdfButtons />
      </section>
    </Shell>
  );
}
