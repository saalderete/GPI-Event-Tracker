import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SprintSubnav } from "@/components/SprintSubnav";
import { DocLayout } from "@/components/DocLayout";
import { EvidenceExplorer } from "@/components/EvidenceExplorer";
import { CandidateLegend } from "@/components/CandidateLegend";
import { OriginalSheets } from "@/components/OriginalSheets";
import { sprints, sprintBySlug } from "@/lib/sprints";
import { documents, documentsForSprint, findDocument } from "@/lib/registry";
import { docModules } from "@/lib/docs";
import { tocFor } from "@/lib/toc";
import { interviews } from "@/lib/evidence";

export const dynamicParams = false;

export function generateStaticParams() {
  return documents.map((d) => ({ sprint: sprints.find((s) => s.number === d.sprint)!.slug, doc: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sprint: string; doc: string }> }): Promise<Metadata> {
  const { sprint, doc } = await params;
  const s = sprintBySlug(sprint);
  const d = s ? findDocument(s.number, doc) : undefined;
  return { title: d ? `${d.title} · Sprint ${s!.number}` : "Document", description: d?.summary };
}

export default async function DocumentPage({ params }: { params: Promise<{ sprint: string; doc: string }> }) {
  const { sprint, doc } = await params;
  const s = sprintBySlug(sprint);
  const d = s ? findDocument(s.number, doc) : undefined;
  if (!s || !d) notFound();
  const docs = documentsForSprint(s.number);
  const crumbs = [{ href: "/", label: "Home" }, { href: `/${s.slug}/`, label: `Sprint ${s.number}` }, { label: d.title }];

  if (d.slug === "evidence") {
    return (
      <Shell>
        <Breadcrumbs items={crumbs} />
        <SprintSubnav sprint={s} docs={docs} />
        <DocLayout sprint={s} doc={d} toc={[]} wide>
          <CandidateLegend />
          <div className="mt-6">
            <OriginalSheets />
          </div>
          <div className="mt-10">
            <EvidenceExplorer data={interviews} />
          </div>
        </DocLayout>
      </Shell>
    );
  }

  const key = `${s.slug}/${d.slug}`;
  const load = docModules[key];
  if (!load) notFound();
  const { default: Content } = await load();
  const toc = tocFor(s.slug, d.slug);

  return (
    <Shell>
      <Breadcrumbs items={crumbs} />
      <SprintSubnav sprint={s} docs={docs} />
      <DocLayout sprint={s} doc={d} toc={toc}>
        <div className="prose-doc">
          <Content />
        </div>
      </DocLayout>
    </Shell>
  );
}
