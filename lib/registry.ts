// Every public document on the portal, in one place. The pages, the rail,
// the PDF generator and the validator all read this list, which is how a
// document can't exist on the web without its PDF, or the other way round.
export type DocStatus = "draft" | "review" | "final";

export interface Revision {
  version: string;
  date: string;
  note: string;
}

export interface PortalDocument {
  /** URL segment under the sprint, e.g. market-research */
  slug: string;
  sprint: number;
  title: string;
  kind: "document" | "appendix";
  /** One line for cards and the manifest. */
  summary: string;
  version: string;
  status: DocStatus;
  /** Team member id, or null until assigned. */
  owner: string | null;
  reviewers: string[];
  revised: string;
  revisions: Revision[];
  /** File name under /pdf, without extension. */
  pdf: string;
}

export const documents: PortalDocument[] = [
  {
    slug: "market-research",
    sprint: 1,
    title: "Market Research",
    kind: "document",
    summary:
      "Five candidate problems, 51 customer interviews in two phases, and how the team narrowed to one.",
    version: "1.2",
    status: "final",
    owner: null,
    reviewers: [],
    revised: "2026-09-22",
    revisions: [
      { version: "1.0", date: "2026-09-10", note: "First synthesis of both interview phases, for team review." },
      { version: "1.1", date: "2026-09-15", note: "Phase 1 interviewers for Candidates 3, 4 and 5 added from the team's record; the grid sheets did not carry them." },
      { version: "1.2", date: "2026-09-22", note: "Reviewed and approved by the team as written; the review notes come off the page." }
    ],
    pdf: "sprint-1-market-research"
  },
  {
    slug: "business-strategy",
    sprint: 1,
    title: "Business Strategy",
    kind: "document",
    summary: "The strategy-to-project chain: why this project earns the right to exist and what objective it serves.",
    version: "0.1",
    status: "draft",
    owner: null,
    reviewers: [],
    revised: "2026-09-10",
    revisions: [{ version: "0.1", date: "2026-09-10", note: "Structure and research-backed sections drafted; business objective pending team input." }],
    pdf: "sprint-1-business-strategy"
  },
  {
    slug: "project-charter",
    sprint: 1,
    title: "Project Charter",
    kind: "document",
    summary: "Scope boundary, assumptions, constraints, milestones and the stakeholder register.",
    version: "0.1",
    status: "draft",
    owner: null,
    reviewers: [],
    revised: "2026-09-10",
    revisions: [{ version: "0.1", date: "2026-09-10", note: "Structure drafted with the facts on record; sections needing team decisions are marked." }],
    pdf: "sprint-1-project-charter"
  },
  {
    slug: "evidence",
    sprint: 1,
    title: "Interview Evidence",
    kind: "appendix",
    summary: "All 51 interview sheets from both phases, as structured records: role, date, takeaway and quotes.",
    version: "1.2",
    status: "final",
    owner: null,
    reviewers: [],
    revised: "2026-09-22",
    revisions: [
      { version: "1.0", date: "2026-09-10", note: "Transcribed from the Phase 1 and Phase 2 interview sheets. Referral names removed." },
      { version: "1.1", date: "2026-09-15", note: "Interviewer attributed on the sixteen Phase 1 grid sheets (Candidates 3, 4 and 5) from the team's record." },
      { version: "1.2", date: "2026-09-22", note: "Reviewed and approved by the team as written." }
    ],
    pdf: "sprint-1-interview-evidence"
  }
];

export const documentsForSprint = (n: number) => documents.filter((d) => d.sprint === n);
export const findDocument = (sprint: number, slug: string) =>
  documents.find((d) => d.sprint === sprint && d.slug === slug);

export const statusLabel: Record<DocStatus, string> = {
  draft: "Draft for team review",
  review: "In review",
  final: "Final"
};
