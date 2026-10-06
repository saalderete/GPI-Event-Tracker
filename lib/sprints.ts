import { documents } from "./registry";
import { site } from "./site";

// The semester, from the Blackboard schedule. A sprint is upcoming until its
// block starts, live while the team works in it (its page carries the plan
// and fills as documents are published), and delivered once its deadline has
// passed with its documents on the page. Earlier pages never close.
//
// The status follows the calendar at build time, in the site's timezone, and
// the deploy workflow rebuilds the site every night, so the flip needs no
// commit. A sprint past its deadline with nothing published stays live, so
// the page never claims a delivery that is not there. Give a seed an explicit
// `status` only to override the calendar.
export type SprintStatus = "delivered" | "live" | "upcoming";

export interface Sprint {
  number: number;
  slug: string;
  title: string;
  status: SprintStatus;
  /** First class session of the sprint block. */
  start: string;
  /** Deliverable deadline, Mountain Time. */
  due: string;
  /** In-class demo or event that follows the deadline. */
  demo: string;
  demoLabel: string;
  /** What the course guidelines say this sprint's page will hold. */
  planned: string[];
  plannedNote?: string;
}

/** A sprint as scheduled; its status is computed unless set here to override the calendar. */
interface SprintSeed extends Omit<Sprint, "status"> {
  status?: SprintStatus;
}

const schedule: SprintSeed[] = [
  {
    number: 1,
    slug: "sprint-1",
    title: "Market research, business strategy, project charter",
    start: "2026-08-25",
    due: "2026-09-21T23:59:00-06:00",
    demo: "2026-09-22",
    demoLabel: "Portal Debut Day",
    planned: ["Market Research", "Business Strategy", "Project Charter", "Interview evidence"]
  },
  {
    number: 2,
    slug: "sprint-2",
    title: "Estimation and budget",
    start: "2026-09-22",
    due: "2026-10-05T23:59:00-06:00",
    demo: "2026-10-06",
    demoLabel: "Sprint demo",
    planned: ["Estimation Appendix, Parts 1 and 2", "Project Budget", "Change Log", "Sprint Retrospective, private, Blackboard only"],
    plannedNote: "Confirmed by the sponsor on 5 October 2026. The guidelines' working draft also listed a Business Case and an ROI Analysis; they are not Sprint 2 deliverables."
  },
  {
    number: 3,
    slug: "sprint-3",
    title: "To be released",
    start: "2026-10-06",
    due: "2026-10-19T23:59:00-06:00",
    demo: "2026-10-20",
    demoLabel: "Sprint demo",
    planned: [],
    plannedNote: "Contents are released as the course block is finalized."
  },
  {
    number: 4,
    slug: "sprint-4",
    title: "To be released",
    start: "2026-10-20",
    due: "2026-11-02T23:59:00-07:00",
    demo: "2026-11-03",
    demoLabel: "Sprint demo",
    planned: [],
    plannedNote: "Contents are released as the course block is finalized."
  },
  {
    number: 5,
    slug: "sprint-5",
    title: "To be released",
    start: "2026-11-03",
    due: "2026-11-16T23:59:00-07:00",
    demo: "2026-11-17",
    demoLabel: "Sprint demo",
    planned: [],
    plannedNote: "Contents are released as the course block is finalized."
  },
  {
    number: 6,
    slug: "sprint-6",
    title: "To be released",
    start: "2026-11-17",
    due: "2026-11-30T23:59:00-07:00",
    demo: "2026-12-01",
    demoLabel: "Final class session",
    planned: [],
    plannedNote: "Contents are released as the course block is finalized."
  }
];

/** The calendar day at `at` in the site's timezone, as YYYY-MM-DD. */
const dayIn = (at: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: site.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);

/** Upcoming until the first day of the block; delivered once the deadline has passed with documents on the page; live in between. */
export function statusOn(seed: SprintSeed, at: Date, hasDocuments: boolean): SprintStatus {
  if (seed.status) return seed.status;
  if (dayIn(at) < seed.start) return "upcoming";
  if (at.getTime() > Date.parse(seed.due) && hasDocuments) return "delivered";
  return "live";
}

const builtAt = new Date();
export const sprints: Sprint[] = schedule.map((seed) => ({
  ...seed,
  status: statusOn(seed, builtAt, documents.some((d) => d.sprint === seed.number))
}));

export const sprintBySlug = (slug: string) => sprints.find((s) => s.slug === slug);
export const sprintByNumber = (n: number) => sprints.find((s) => s.number === n);
/** Delivered or live: the page exists and is linked. */
export const isPublished = (s: Sprint) => s.status !== "upcoming";
export const liveSprints = () => sprints.filter(isPublished);
/** The sprint in progress, or the last delivered one between blocks. */
export const currentSprint = () =>
  sprints.find((s) => s.status === "live") ?? [...sprints].reverse().find((s) => s.status === "delivered") ?? sprints[0];
export const statusWord: Record<SprintStatus, string> = { delivered: "Delivered", live: "Live", upcoming: "Upcoming" };
