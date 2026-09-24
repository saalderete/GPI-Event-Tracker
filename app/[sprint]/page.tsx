import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SprintSubnav } from "@/components/SprintSubnav";
import { SprintOneOverview } from "@/components/SprintOneOverview";
import { DocumentList } from "@/components/DocumentList";
import { AiDisclosure } from "@/components/AiDisclosure";
import { aiDisclosure as sprintTwoDisclosure } from "@/content/sprint-2/contributions";
import { IconArrow } from "@/components/Icons";
import { sprints, sprintBySlug, isPublished, statusWord } from "@/lib/sprints";
import { documentsForSprint } from "@/lib/registry";
import { fmtDate, fmtDateTime } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return sprints.map((s) => ({ sprint: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sprint: string }> }): Promise<Metadata> {
  const { sprint } = await params;
  const s = sprintBySlug(sprint);
  return { title: s ? `Sprint ${s.number}` : "Sprint" };
}

export default async function SprintPage({ params }: { params: Promise<{ sprint: string }> }) {
  const { sprint } = await params;
  const s = sprintBySlug(sprint);
  if (!s) notFound();
  const docs = documentsForSprint(s.number);
  const published = isPublished(s);
  const previous = sprints.find((x) => x.number === s.number - 1);
  const next = sprints.find((x) => x.number === s.number + 1);

  return (
    <Shell>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: `Sprint ${s.number}` }]} />
      {published && docs.length ? <SprintSubnav sprint={s} docs={docs} /> : null}

      <header className="mb-12" data-reveal>
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">Sprint {s.number}</p>
          <span className={`badge ${s.status === "live" ? "badge-live" : s.status === "delivered" ? "badge-accent" : "badge-outline"}`}>{statusWord[s.status]}</span>
        </div>
        <h1 className="display mt-3 text-[2.15rem] sm:text-[3rem] lg:text-[3.4rem]">{s.title}</h1>
        <dl className="meta mt-5 flex flex-wrap gap-x-6 gap-y-1">
          <div className="flex gap-1.5">
            <dt>Block</dt>
            <dd className="text-ink">
              {fmtDate(s.start)} to {fmtDate(s.due)}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Due</dt>
            <dd className="text-ink">{fmtDateTime(s.due)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>{s.demoLabel}</dt>
            <dd className="text-ink">{fmtDate(s.demo)}</dd>
          </div>
        </dl>
      </header>

      {published && s.number === 1 ? (
        <SprintOneOverview sprint={s} docs={docs} />
      ) : (
        <section className="max-w-[64ch]">
          {published && docs.length ? <DocumentList sprint={s} docs={docs} /> : null}
          <div className="prose-doc">
            <p>
              {s.status === "live"
                ? "This sprint is in progress. Its documents are published here as the sprint concludes, and everything published before it stays exactly where it is."
                : "This sprint has not started. Its page goes live when the sprint concludes, and everything published before it stays exactly where it is."}
            </p>
            {s.planned.length ? (
              <>
                <h2 className="!mt-8 !border-0 !pt-0">Planned contents</h2>
                <ul>
                  {s.planned.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {s.plannedNote ? <p className="meta">{s.plannedNote}</p> : null}
            {s.number >= 2 ? (
              <p>
                From this sprint on, the page also carries a change log: what was revised from the prior sprint&apos;s documents, why,
                and what it affected downstream.
              </p>
            ) : null}
          </div>
        </section>
      )}
      {published && s.number === 2 ? <AiDisclosure disclosure={sprintTwoDisclosure} /> : null}

      <nav className="mt-16 flex flex-wrap justify-between gap-3 border-t border-border pt-6 no-print" aria-label="Sprint navigation" data-reveal>
        {previous ? (
          <Link href={`/${previous.slug}/`} className="btn btn-ghost">
            <IconArrow className="rotate-180" /> Sprint {previous.number}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/${next.slug}/`} className="btn btn-ghost">
            Sprint {next.number} <IconArrow />
          </Link>
        ) : null}
      </nav>
    </Shell>
  );
}
