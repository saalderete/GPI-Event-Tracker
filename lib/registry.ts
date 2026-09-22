// Every public document on the portal, in one place. The pages, the rail,
// the PDF generator and the validator all read this list, which is how a
// document can't exist on the web without its PDF, or the other way round.
export type DocStatus = "draft" | "review" | "final";
/** Where a document lives. "site": written here as MDX and printed to its
 *  PDF by the ship step. "upload": delivered by its owner as a PDF in
 *  public/docs/; its MDX is a cover, and the ship step copies the file into
 *  place instead of printing. */
export type DocSource = "site" | "upload";

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
  /** Defaults to "site". */
  source?: DocSource;
  /** For a delivered document: the file name under public/docs/. */
  file?: string;
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
    owner: "jazmin",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "1.0", date: "2026-09-10", note: "First synthesis of both interview phases, for team review." },
      { version: "1.1", date: "2026-09-15", note: "Phase 1 interviewers for Candidates 3, 4 and 5 added from the team's record; the grid sheets did not carry them." },
      { version: "1.2", date: "2026-09-21", note: "Reviewed and approved by the team as written; the review notes come off the page." }
    ],
    pdf: "sprint-1-market-research"
  },
  {
    slug: "business-strategy",
    sprint: 1,
    title: "Business Strategy",
    kind: "document",
    summary: "The strategy-to-project chain: why this project earns the right to exist and what objective it serves.",
    version: "1.0",
    status: "final",
    owner: null,
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "0.1", date: "2026-09-10", note: "Structure and research-backed sections drafted; business objective pending team input." },
      { version: "1.0", date: "2026-09-21", note: "Reviewed and approved by the team. The review notes come off the page, the candidate objective stands as the objective, and the measures' targets are set in the Sprint 2 business case." }
    ],
    pdf: "sprint-1-business-strategy"
  },
  {
    slug: "project-charter",
    sprint: 1,
    title: "Project Charter",
    kind: "document",
    summary: "Business objectives, scope boundary, constraints, assumptions, stakeholder register and success criteria, as set by the project manager.",
    version: "1.1",
    status: "final",
    owner: "emmanuel",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "0.1", date: "2026-09-10", note: "Structure drafted with the facts on record; sections needing team decisions are marked." },
      { version: "1.0", date: "2026-09-21", note: "The team's own charter, written by the project manager and dated 10 September 2026, replaces the drafted structure. Published as delivered, as a PDF." },
      { version: "1.1", date: "2026-09-21", note: "The full text moves onto the page and the PDF is printed from it, as the guidelines require. A stakeholder register is added, drafted from the groups the charter already names, for the project manager to confirm. Wording corrected. The charter as delivered stays linked as version 1.0." }
    ],
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
    owner: "christian",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "1.0", date: "2026-09-10", note: "Transcribed from the Phase 1 and Phase 2 interview sheets. Referral names removed." },
      { version: "1.1", date: "2026-09-15", note: "Interviewer attributed on the sixteen Phase 1 grid sheets (Candidates 3, 4 and 5) from the team's record." },
      { version: "1.2", date: "2026-09-21", note: "Reviewed and approved by the team as written." }
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
