import Link from "next/link";
import { DocumentList } from "./DocumentList";
import { Callout } from "./mdx";
import { IconLock } from "./Icons";
import { contributions, aiDisclosure } from "@/content/sprint-1/contributions";
import { memberById } from "@/lib/team";
import { fmtDate } from "@/lib/format";
import { interviews, candidates } from "@/lib/evidence";
import type { PortalDocument } from "@/lib/registry";
import type { Sprint } from "@/lib/sprints";

// What Sprint 1 was, in the order it happened.
const timeline = [
  { date: "2026-08-25", what: "Course begins. The team forms and names five candidate problems, each with a one-sentence problem statement." },
  { date: "2026-09-03", what: "Phase 1 interviews begin: 26 conversations spread across all five candidates, following Mom Test rules (past behavior, no pitching)." },
  { date: "2026-09-08", what: "Scoping checkpoint. Three candidates dropped; two survive into Phase 2." },
  { date: "2026-09-09", what: "Phase 2: 25 interviews on the two survivors in a single day, with rewritten question sets." },
  { date: "2026-09-10", what: "Candidate 3 selected. Portal published with the three Sprint 1 documents in draft for team review." },
  { date: "2026-09-21", what: "Sprint 1 due, 11:59 PM. Portal, Blackboard PDFs and repository link submitted." },
  { date: "2026-09-22", what: "Portal Debut Day: gallery walk and peer feedback in class." }
];

const h2 = "display text-[1.6rem] sm:text-[1.8rem]";
const th = "label pb-2 pr-6 text-left font-medium";

export function SprintOneOverview({ sprint, docs }: { sprint: Sprint; docs: PortalDocument[] }) {
  const p1 = interviews.filter((i) => i.phase === 1).length;
  const p2 = interviews.filter((i) => i.phase === 2).length;
  return (
    <>
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" aria-labelledby="what">
        <div>
          <h2 id="what" className={`${h2} mb-4`} data-reveal>
            What this sprint was
          </h2>
          <div className="prose-doc">
            <p>
              Sprint 1 was customer discovery. The team started with five candidate problems and talked to {interviews.length} people about
              them in two phases: {p1} interviews across all five, a scoping checkpoint that cut the field to two, then {p2} more on the
              survivors. The candidate that came out of it, an events hub for El Paso, is the project this portal now records.
            </p>
            <p>
              Three documents came out of the sprint. The <Link href={`/${sprint.slug}/market-research/`}>Market Research</Link> is the
              synthesis of everything the team heard, including what it walked away from. The{" "}
              <Link href={`/${sprint.slug}/business-strategy/`}>Business Strategy</Link> is the chain from that evidence to a business
              objective. The <Link href={`/${sprint.slug}/project-charter/`}>Project Charter</Link> is the anchor document for every sprint
              after this one: scope, assumptions, stakeholders. The <Link href={`/${sprint.slug}/evidence/`}>interview evidence</Link> sits
              behind all three.
            </p>
          </div>
        </div>
        <div>
          <h2 className={`${h2} mb-4`} data-reveal>
            Timeline
          </h2>
          <ol className="relative border-l border-border">
            {timeline.map((t) => (
              <li key={t.date + t.what} className="relative pb-5 pl-6 last:pb-0" data-reveal>
                <span className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-accent" aria-hidden />
                <p className="meta">{fmtDate(t.date)}</p>
                <p className="mt-0.5 text-[0.95rem] leading-relaxed text-ink-soft">{t.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="documents">
        <h2 id="documents" className={`${h2} mb-5`} data-reveal>
          Documents
        </h2>
        <DocumentList sprint={sprint} docs={docs} />
      </section>

      <section className="mt-16" aria-labelledby="candidates" data-reveal>
        <h2 id="candidates" className={`${h2} mb-5`}>
          The five candidates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[0.93rem]">
            <thead>
              <tr className="border-b border-ink">
                <th className={th}>#</th>
                <th className={th}>Candidate</th>
                <th className={th}>Area</th>
                <th className={`${th} text-right`}>Phase 1</th>
                <th className={`${th} text-right`}>Phase 2</th>
                <th className={th}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => {
                const n1 = interviews.filter((i) => i.candidate === c.number && i.phase === 1).length;
                const n2 = interviews.filter((i) => i.candidate === c.number && i.phase === 2).length;
                return (
                  <tr key={c.number} className="border-b border-border align-top">
                    <td className="py-3 pr-6 font-mono text-[12.5px] text-muted">C{c.number}</td>
                    <td className="py-3 pr-6 font-semibold">{c.name}</td>
                    <td className="py-3 pr-6 text-ink-soft">{c.area}</td>
                    <td className="py-3 pr-6 text-right font-mono text-[12.5px]">{n1}</td>
                    <td className="py-3 pr-6 text-right font-mono text-[12.5px]">{n2 || "none"}</td>
                    <td className="py-3">
                      <span className={`badge ${c.outcome === "selected" ? "badge-live" : "badge-muted"}`}>
                        {c.outcome === "selected" ? "Selected" : c.outcome === "dropped-after-phase-2" ? "Dropped after P2" : "Dropped after P1"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="contributions" data-reveal>
        <h2 id="contributions" className={h2}>
          Contribution statement
        </h2>
        <p className="mt-2 mb-5 max-w-[64ch] text-[0.98rem] text-ink-soft">
          Each member states what they owned and what they reviewed this sprint. Interview counts are from the sheets on record.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[0.93rem]">
            <thead>
              <tr className="border-b border-ink">
                <th className={th}>Member</th>
                <th className={th}>Owned</th>
                <th className={th}>Reviewed</th>
                <th className={`${th} text-right`}>Interviews</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => {
                const m = memberById(c.member)!;
                return (
                  <tr key={c.member} className="border-b border-border align-top">
                    <td className="py-3 pr-6 font-semibold">{m.name}</td>
                    <td className={`py-3 pr-6 ${c.owned ? "" : "italic text-muted"}`}>{c.owned ?? "To be added"}</td>
                    <td className={`py-3 pr-6 ${c.reviewed ? "" : "italic text-muted"}`}>{c.reviewed ?? "To be added"}</td>
                    <td className="py-3 text-right font-mono text-[12.5px]">{m.interviews.phase1 + m.interviews.phase2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="ai" data-reveal>
        <h2 id="ai" className={h2}>
          AI use disclosure
        </h2>
        <p className="mt-2 mb-5 max-w-[64ch] text-[0.98rem] text-ink-soft">
          Which tool was used, at which stage, and what the team changed or rejected from its output, as the course requires.
        </p>
        <dl className="max-w-[72ch] space-y-5 border-t border-border pt-5 text-[0.95rem]">
          <div>
            <dt className="label">Tool</dt>
            <dd className="mt-1">{aiDisclosure.tool}</dd>
          </div>
          <div>
            <dt className="label">Where it was used</dt>
            <dd className="mt-2">
              <ul className="space-y-3">
                {aiDisclosure.stages.map((s) => (
                  <li key={s.stage} className="border-l-2 border-accent pl-3">
                    <p className="font-semibold">{s.stage}</p>
                    <p className="text-ink-soft">{s.use}</p>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="label">Not used for</dt>
            <dd className="mt-2">
              <ul className="list-disc space-y-1 pl-5 text-ink-soft">
                {aiDisclosure.notUsedFor.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="label">What the team changed or rejected</dt>
            <dd className={`mt-1 ${aiDisclosure.changedOrRejected ? "" : "italic text-muted"}`}>
              {aiDisclosure.changedOrRejected ?? "To be completed after the team reviews the drafts."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12 max-w-[72ch]" data-reveal>
        <Callout title="Private, by design">
          <p className="flex items-start gap-2">
            <IconLock className="mt-1 h-4 w-4 shrink-0" />
            <span>
              The Sprint 1 retrospective (team half and project half) and the peer evaluations were submitted through Blackboard. They are
              not published here and never will be; the build refuses output that contains them.
            </span>
          </p>
        </Callout>
      </section>
    </>
  );
}
