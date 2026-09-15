import { notFound } from "next/navigation";
import { InterviewCard } from "@/components/InterviewCard";
import { sprints, sprintBySlug } from "@/lib/sprints";
import { documents, findDocument, statusLabel } from "@/lib/registry";
import { docModules } from "@/lib/docs";
import { site } from "@/lib/site";
import { team, memberById } from "@/lib/team";
import { fmtDate } from "@/lib/format";
import { publicUrl } from "@/lib/base";
import { candidates, interviews } from "@/lib/evidence";

export const dynamicParams = false;

export function generateStaticParams() {
  return documents.map((d) => ({ sprint: sprints.find((s) => s.number === d.sprint)!.slug, doc: d.slug }));
}

export default async function PrintPage({ params }: { params: Promise<{ sprint: string; doc: string }> }) {
  const { sprint, doc } = await params;
  const s = sprintBySlug(sprint);
  const d = s ? findDocument(s.number, doc) : undefined;
  if (!s || !d) notFound();
  const owner = memberById(d.owner);
  const pagePath = `/${s.slug}/${d.slug}/`;

  let body: React.ReactNode;
  if (d.slug === "evidence") {
    body = (
      <div className="space-y-10">
        <section>
          <h2 className="display text-[16pt]">The five candidates</h2>
          <table className="mt-3 w-full text-[9.5pt]">
            <thead>
              <tr className="text-left">
                <th className="meta py-1 pr-4 font-medium">#</th>
                <th className="meta py-1 pr-4 font-medium">Candidate</th>
                <th className="meta py-1 pr-4 font-medium">Problem statement as tested</th>
                <th className="meta py-1 pr-4 text-right font-medium">P1</th>
                <th className="meta py-1 pr-4 text-right font-medium">P2</th>
                <th className="meta py-1 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.number} className="border-t border-border align-top">
                  <td className="py-1.5 pr-4 font-mono">C{c.number}</td>
                  <td className="py-1.5 pr-4 font-semibold">{c.name}</td>
                  <td className="py-1.5 pr-4">{c.problem}</td>
                  <td className="py-1.5 pr-4 text-right font-mono">{interviews.filter((i) => i.candidate === c.number && i.phase === 1).length}</td>
                  <td className="py-1.5 pr-4 text-right font-mono">{interviews.filter((i) => i.candidate === c.number && i.phase === 2).length || "·"}</td>
                  <td className="py-1.5">{c.outcome === "selected" ? "Selected" : c.outcome === "dropped-after-phase-2" ? "Dropped after Phase 2" : "Dropped after Phase 1"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {[1, 2].map((phase) =>
          candidates
            .filter((c) => interviews.some((i) => i.phase === phase && i.candidate === c.number))
            .map((c) => {
              const rows = interviews.filter((i) => i.phase === phase && i.candidate === c.number);
              return (
                <section key={`${phase}-${c.number}`} style={{ breakBefore: "page" }}>
                  <h2 className="display text-[16pt]">
                    Phase {phase} · Candidate {c.number}: {c.name}
                  </h2>
                  <p className="meta mt-1">
                    {rows.length} interview{rows.length === 1 ? "" : "s"}
                    {phase === 1 && [3, 4, 5].includes(c.number) ? " · captured in a grid sheet; date and role were not recorded per interview" : ""}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {rows.map((i) => (
                      <div key={i.id} style={{ breakInside: "avoid" }}>
                        <InterviewCard i={i} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
        )}
      </div>
    );
  } else {
    const load = docModules[`${s.slug}/${d.slug}`];
    if (!load) notFound();
    const { default: Content } = await load();
    body = (
      <div className="prose-doc">
        <Content />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[7.5in] px-2 py-4">
      <header className="mb-8 border-b-2 border-ink pb-5">
        <p className="eyebrow">
          {site.name}, Living Project Portal, Sprint {s.number}
        </p>
        <h1 className="display mt-2 text-[26pt]">{d.title}</h1>
        <p className="mt-2 text-[10.5pt] text-ink-soft">{d.summary}</p>
        <dl className="meta mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[8.5pt]">
          <dt>Version</dt>
          <dd>
            {d.version}, {statusLabel[d.status]}, revised {fmtDate(d.revised)}
          </dd>
          <dt>Owner</dt>
          <dd>{owner ? owner.name : "To be assigned"}</dd>
          <dt>Team</dt>
          <dd>{team.map((m) => m.name).join(", ")}</dd>
          <dt>Course</dt>
          <dd>
            {site.course} {site.courseName}, {site.university}, {site.term}
          </dd>
          <dt>Web</dt>
          <dd>{publicUrl ? `${publicUrl}${pagePath}` : pagePath}</dd>
        </dl>
      </header>
      {body}
      <footer className="mt-10 border-t border-border pt-3">
        <p className="meta text-[8pt]">
          Generated from the portal source at build time. The web page and this PDF are two renders of the same document.
          {d.revisions.length ? ` Revision history: ${[...d.revisions].map((r) => `v${r.version} (${fmtDate(r.date)}) ${r.note}`).join("; ")}` : ""}
        </p>
      </footer>
    </div>
  );
}
