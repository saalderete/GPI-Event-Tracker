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

/** A file the team delivered alongside a document: the owner's own PDF, a
 *  signed copy, the interview sheets. It lives in public/docs/ and the page
 *  offers it as a "Team's PDF" button that opens the viewer. */
export interface DeliveredFile {
  /** Button label on the page. */
  label: string;
  /** File name under public/docs/. */
  file: string;
  /** What the viewer calls it. */
  title: string;
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
  /** Files the team delivered alongside the document, shown as Team's PDF buttons. */
  delivered?: DeliveredFile[];
}

export const documents: PortalDocument[] = [
  {
    slug: "market-research",
    sprint: 1,
    title: "Market Research",
    kind: "document",
    summary:
      "Five candidate problems, 51 customer interviews in two phases, and how the team narrowed to one.",
    version: "1.3",
    status: "final",
    owner: "jazmin",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "1.0", date: "2026-09-10", note: "First synthesis of both interview phases, for team review." },
      { version: "1.1", date: "2026-09-15", note: "Reviewed and redefined some conclusions." },
      { version: "1.2", date: "2026-09-21", note: "Restructured to the three required subsections." },
    ],
    pdf: "sprint1-MARKET-RESEARCH",
    delivered: [{ label: "Team's PDF", file: "sprint1-MARKET-RESEARCH.pdf", title: "Market Research, the owner's copy" }]
  },
  {
    slug: "business-strategy",
    sprint: 1,
    title: "Business Strategy",
    kind: "document",
    summary: "The strategy-to-project chain: why this project earns the right to exist and what objective it serves.",
    version: "1.1",
    status: "final",
    owner: "oscar",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "0.1", date: "2026-09-10", note: "Structure and research-backed sections drafted; business objective pending team input." },
      { version: "1.0", date: "2026-09-21", note: "Reviewed and approved by the team. The review notes come off the page, the candidate objective stands as the objective, and the measures' targets are set in the Sprint 2 business case." },
      { version: "1.1", date: "2026-09-21", note: "Owner assigned. Brought in line with the Project Charter: El Paso and Juárez, a feed personalized by interests, and paid featured listings as the monetization hypothesis. The charter's success criteria carried over as the first targets, with the business-case measures still set in Sprint 2. The scope risk reworded." }
    ],
    pdf: "sprint-1-business-strategy"
  },
  {
    slug: "project-charter",
    sprint: 1,
    title: "Project Charter",
    kind: "document",
    summary: "Business objectives, scope boundary, constraints, assumptions, success criteria and stakeholders, as set and signed by the project manager.",
    version: "1.2",
    status: "final",
    owner: "emmanuel",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "0.1", date: "2026-09-10", note: "Structure drafted with the facts on record; sections needing team decisions are marked." },
      { version: "1.0", date: "2026-09-21", note: "The team's own charter, written by the project manager and dated 10 September 2026, replaces the drafted structure. Published as delivered, as a PDF." },
      { version: "1.1", date: "2026-09-21", note: "The full text moves onto the page and the PDF is printed from it, as the guidelines require. A stakeholder register is added, drafted from the groups the charter already names, for the project manager to confirm. Wording corrected. The charter as delivered stays linked as version 1.0." },
      { version: "1.2", date: "2026-09-21", note: "The project manager's final charter, signed 21 September: his own stakeholder table replaces the drafted register, the sections follow his order, and the signed file is linked alongside version 1.0." }
    ],
    pdf: "sprint-1-project-charter",
    delivered: [{ label: "Team's PDF", file: "sprint-1-project-charter-signed.pdf", title: "Project Charter, signed by the project manager on Sep 21, 2026" }]
  },
  {
    slug: "evidence",
    sprint: 1,
    title: "Interview Evidence",
    kind: "appendix",
    summary: "All 51 interview sheets from both phases, as structured records: role, date, takeaway and quotes.",
    version: "1.3",
    status: "final",
    owner: "christian",
    reviewers: [],
    revised: "2026-09-21",
    revisions: [
      { version: "1.0", date: "2026-09-10", note: "Transcribed from the Phase 1 and Phase 2 interview sheets. Referral names removed." },
      { version: "1.1", date: "2026-09-15", note: "Interviewer attributed on the sixteen Phase 1 grid sheets (Candidates 3, 4 and 5) from the team's record." },
      { version: "1.2", date: "2026-09-21", note: "Reviewed and approved by the team as written." },
      { version: "1.3", date: "2026-09-21", note: "The team's original Phase 1 and Phase 2 interview sheets are linked from the page as PDFs, with the referral names redacted." }
    ],
    pdf: "sprint-1-interview-evidence",
    delivered: [
      { label: "Team's PDF: Phase 1", file: "sprint-1-phase-1-interviews.pdf", title: "Phase 1 interview sheets, referral names redacted" },
      { label: "Team's PDF: Phase 2", file: "sprint-1-phase-2-interviews.pdf", title: "Phase 2 interview sheets, referral names redacted" }
    ]
  },
  {
    slug: "estimation-appendix",
    sprint: 2,
    title: "Estimation Appendix",
    kind: "appendix",
    summary: "How the team is sizing Release 1: the methods, the ranges and the reasoning. Part 1 takes the outside view, from three similar products; Part 2 estimates the event-goer slice two ways and presents a provisional range of 394 to 852 hours.",
    version: "0.5",
    status: "draft",
    owner: null,
    reviewers: [],
    revised: "2026-09-30",
    revisions: [
      { version: "0.1", date: "2026-09-24", note: "Part 1, the team's completed worksheet 'A First Look at Your Project's Size', carried onto the page as written. The evidence column cites the interview records each capability rests on, and each comparator date is matched to the listed source that states it. Part 2, the two estimates, to follow." },
      { version: "0.2", date: "2026-09-29", note: "Part 2, the team's completed activity 'Estimate One Slice of Your Project', carried onto the page: the slice, the two methods, the story-point cross-check, the team-size check, the comparison and the presented range. Edits from the team's alignment review of 29 September: the source-of-events and personalization boundaries stated in Step 1; the sensitivity of the analogous estimate corrected, with the hours per person-month shown as its largest lever; two claims the Part 1 source checks mark unsupported reworded; the comparable's missing import work noted; the larger-teams check answered not applicable; the PERT display rounded to 669.67; the open decision on event supply recorded with what it changes; the story points noted as drafted, not sized by planning poker. No count, weight, rate, fraction, uplift, velocity or range changed." },
      { version: "0.3", date: "2026-09-29", note: "Items 1 to 4 of the team's final revision handoff. The outside-source import leaves the slice so both methods estimate the same functions, as the charter and the Business Strategy have the supply; the calendar counts as the same lookup as events by date, under the handoff's own rule; Steps 3A, 5 and 6 re-run from the team's unchanged counts, weights, rates, fraction, uplift and its documented procedure for M: 71 function points, 426 to 852 hours, a gap of 1.30, a range of 394 to 852 hours and 603.67 expected. The alternative-count sentence is now conditional with its arithmetic corrected, the story points are labelled unconfirmed pending the team's validation, and the wage listing carries its actual category. The slice boundary and the calendar classification are recorded as revisable by the team." },
      { version: "0.4", date: "2026-09-29", note: "The team's verification of 29 September 2026, 3:30 PM, recorded in the team's own wording: the seven story point values reviewed and confirmed (8, 5, 3, 8, 5, 3 and 5, total 37), and the $51.36 base wage and its job category verified on the ZipRecruiter listing. The story-point cross-check is now compared to the formal range correctly (its 925-hour end exceeds the 852-hour upper bound by 73 hours, a sign of upper-end uncertainty, not a change to the range), and the figures stay provisional only on the assumed rates. No calculation changed." },
      { version: "0.5", date: "2026-09-30", note: "The team's submitted version of the activity replaces version 9 as the Team's PDF: Part 2, and the page follows its final edits: the source-of-events note shortened, the Step 4 closing paragraph and the term-length caveat dropped, the rationale for M and the gap paragraph tightened, and the import line under 'What would change this estimate' reduced to one sentence. No figure changed." }
    ],
    pdf: "sprint-2-estimation-appendix",
    delivered: [
      { label: "Team's PDF: Part 1", file: "sprint-2-estimation-starter.pdf", title: "Project Estimation Starter, Part 1: the team's worksheet as completed" },
      { label: "Team's PDF: Part 2", file: "sprint-2-estimation-activity.pdf", title: "Estimate One Slice of Your Project, Part 2: the team's activity as submitted, 30 September 2026" }
    ]
  },
  {
    slug: "budget",
    sprint: 2,
    title: "Project Budget",
    kind: "document",
    summary: "The team's ten-step budget for the event-goer slice, from the Estimation Appendix's planning value of 603.67 hours: five cost-driving assumptions with owners, the work in packages, a staffing plan by role and month, labor priced at loaded cost and productive hours, a base build of $49,622, two reserves traced to named risks and policy, and a total request of $58,868.",
    version: "1.0",
    status: "final",
    owner: null,
    reviewers: [],
    revised: "2026-10-04",
    revisions: [
      { version: "1.0", date: "2026-10-04", note: "The team's completed Session 11 activity, 'Building the Budget', carried onto the page as written, with the delivered file as the Team's PDF. The nine charts are redrawn from the team's figures in the portal's palette. Two things in the delivered file are not carried: a line left over from an earlier draft in the cost-baseline cell of the first table ($42,051, with $37,219 over three months and a $2,103 cushion), which the rest of the document supersedes, and two spacing slips in the figures $49,622 and $21,381. The template's Slice and Status fields, blank in the delivered file, are not shown. No figure changed." }
    ],
    pdf: "sprint-2-budget",
    delivered: [
      { label: "Team's PDF", file: "sprint-2-budget.pdf", title: "Building the Budget: the team's completed Session 11 activity, 4 October 2026" }
    ]
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
