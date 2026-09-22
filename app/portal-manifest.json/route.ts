import { documents } from "@/lib/registry";
import { sprints } from "@/lib/sprints";
import { team } from "@/lib/team";
import { site } from "@/lib/site";
import { build } from "@/lib/base";

export const dynamic = "force-static";

// Emitted at build for the scripts (PDF generation, validation, the AI
// corpus) so they read the same registry the pages do.
export function GET() {
  const slugOf = (n: number) => sprints.find((s) => s.number === n)?.slug ?? `sprint-${n}`;
  const body = {
    site: { name: site.name, short: site.short, repo: site.repo, timezone: site.timezone },
    build: { at: build.at, commit: build.commit },
    sprints: sprints.map((s) => ({ number: s.number, slug: s.slug, status: s.status, due: s.due })),
    documents: documents.map((d) => ({
      sprint: d.sprint,
      sprintSlug: slugOf(d.sprint),
      slug: d.slug,
      title: d.title,
      kind: d.kind,
      version: d.version,
      status: d.status,
      revised: d.revised,
      pdf: d.pdf,
      source: d.source ?? "site",
      file: d.file ?? null,
      delivered: (d.delivered ?? []).map((f) => f.file),
      page: `/${slugOf(d.sprint)}/${d.slug}/`,
      print: `/print/${slugOf(d.sprint)}/${d.slug}/`
    })),
    team: team.map((m) => ({ id: m.id, name: m.name }))
  };
  return Response.json(body);
}
