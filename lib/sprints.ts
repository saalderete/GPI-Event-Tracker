// The semester, from the Blackboard schedule. A sprint's page goes live when
// the team publishes it; until then its circle on the rail is hollow.
export type SprintStatus = "live" | "upcoming";

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

export const sprints: Sprint[] = [
  {
    number: 1,
    slug: "sprint-1",
    title: "Market research, business strategy, project charter",
    status: "live",
    start: "2026-08-25",
    due: "2026-09-21T23:59:00-06:00",
    demo: "2026-09-22",
    demoLabel: "Portal Debut Day",
    planned: ["Market Research", "Business Strategy", "Project Charter", "Interview evidence"]
  },
  {
    number: 2,
    slug: "sprint-2",
    title: "Business case, estimation, ROI",
    status: "upcoming",
    start: "2026-09-22",
    due: "2026-10-05T23:59:00-06:00",
    demo: "2026-10-06",
    demoLabel: "Sprint demo",
    planned: ["Business Case with go/no-go recommendation", "Estimation Appendix", "ROI Analysis", "Change Log"],
    plannedNote: "Working draft in the course guidelines, subject to change."
  },
  {
    number: 3,
    slug: "sprint-3",
    title: "To be released",
    status: "upcoming",
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
    status: "upcoming",
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
    status: "upcoming",
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
    status: "upcoming",
    start: "2026-11-17",
    due: "2026-11-30T23:59:00-07:00",
    demo: "2026-12-01",
    demoLabel: "Final class session",
    planned: [],
    plannedNote: "Contents are released as the course block is finalized."
  }
];

export const sprintBySlug = (slug: string) => sprints.find((s) => s.slug === slug);
export const sprintByNumber = (n: number) => sprints.find((s) => s.number === n);
export const liveSprints = () => sprints.filter((s) => s.status === "live");
