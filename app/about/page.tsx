import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { team, unattributedPhase1 } from "@/lib/team";
import { site } from "@/lib/site";
import { interviews } from "@/lib/evidence";
import { withBase } from "@/lib/base";

export const metadata: Metadata = { title: "About us" };

export default function About() {
  const phase1 = interviews.filter((i) => i.phase === 1).length;
  return (
    <Shell>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About us" }]} />
      <header className="mb-10" data-reveal>
        <h1 className="display text-[2.4rem] sm:text-[3rem]">The team behind {site.short}</h1>
        <p className="mt-4 max-w-[60ch] font-serif text-[1.1rem] leading-relaxed text-ink-soft">
          Five students in {site.course} at {site.university}, running one project across a semester and keeping this portal as the
          record of how it was managed. Every member owns a piece of the portal and can explain every page of it.
        </p>
      </header>

      <ul className="border-t border-border">
        {team.map((m) => {
          const n = m.interviews.phase1 + m.interviews.phase2;
          return (
            <li key={m.id} className="grid gap-5 border-b border-border py-7 md:grid-cols-[220px_minmax(0,1fr)]" data-reveal>
              <div>
                {m.photo ? (
                  // Portraits go in public/images/team/ and are set in lib/team.ts.
                  <img src={withBase(m.photo)} alt={m.name} className="mb-3 aspect-square w-32 rounded-[var(--radius-md)] object-cover" />
                ) : null}
                <h2 className="display text-[1.45rem]">{m.name}</h2>
                <p className={`mt-1 text-[0.95rem] ${m.role ? "text-ink-soft" : "italic text-muted"}`}>{m.role ?? "Role to be added"}</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-[1fr_1fr] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="sm:col-span-2 md:col-span-1">
                  <dt className="label">Bio</dt>
                  <dd className={`mt-1 max-w-[60ch] leading-relaxed ${m.bio ? "text-ink-soft" : "italic text-muted"}`}>{m.bio ?? "To be added"}</dd>
                </div>
                <div className="space-y-4">
                  <div>
                    <dt className="label">Owns on the portal</dt>
                    <dd className={`mt-1 ${m.owns ? "" : "italic text-muted"}`}>{m.owns ?? "To be added"}</dd>
                  </div>
                  <div>
                    <dt className="label">Sprint 1 interviews</dt>
                    <dd className="mt-1 font-mono text-[12.5px]">
                      {n} recorded{n ? ` (Phase 1: ${m.interviews.phase1}, Phase 2: ${m.interviews.phase2})` : ""}
                    </dd>
                  </div>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
      <p className="meta mt-6 max-w-[70ch]" data-reveal>
        Interview counts come from the sheets on record. {unattributedPhase1} of the {phase1} Phase 1 sheets were captured in a grid without an
        interviewer name and are not attributed to anyone above.
      </p>
    </Shell>
  );
}
