import raw from "@/content/evidence/interviews.json";

export interface Interview {
  /** P1-C3-04: phase, candidate, sheet number */
  id: string;
  phase: 1 | 2;
  candidate: 1 | 2 | 3 | 4 | 5;
  n: number;
  /** Team member id, or null where the sheet did not record one. */
  interviewer: string | null;
  date: string | null;
  location: string | null;
  role: string;
  experience: string | null;
  takeaway: string | null;
  quotes: string[];
}

export type Outcome = "dropped-after-phase-1" | "dropped-after-phase-2" | "selected";

export interface Candidate {
  number: 1 | 2 | 3 | 4 | 5;
  name: string;
  area: string;
  problem: string;
  outcome: Outcome;
  outcomeNote: string;
}

export const candidates: Candidate[] = [
  {
    number: 1,
    name: "Money already spoken for",
    area: "Finance",
    problem:
      "People don't know how much of their income is already committed to recurring charges and debt payments, so they overspend on what's left and stay in debt longer.",
    outcome: "dropped-after-phase-1",
    outcomeNote: "Manual logging fatigue showed up, the stated problem did not."
  },
  {
    number: 2,
    name: "Eating toward a body goal",
    area: "Nutrition",
    problem:
      "People trying to bulk, cut, or maintain can't tell in advance whether the day's meals will hit their macro targets, so they log after the fact, fall short, and stop tracking.",
    outcome: "dropped-after-phase-2",
    outcomeNote: "Ranked first after Phase 1; the specific problem did not recur in a broader Phase 2 sample."
  },
  {
    number: 3,
    name: "Entertainment and events tracker",
    area: "Entertainment",
    problem:
      "People find it hard to find events/places to go to in El Paso/Juarez, often finding out after the events have already happened.",
    outcome: "selected",
    outcomeNote: "Phase 2 sharpened the signal and converged on one ask: a single place to see what is coming."
  },
  {
    number: 4,
    name: "Market Master",
    area: "Finance",
    problem:
      "Nearly half of Americans do not hold any investment assets, and the primary reasons for not investing highlight a major educational gap.",
    outcome: "dropped-after-phase-1",
    outcomeNote: "Questions asked for opinions and produced hypotheticals, not past behavior."
  },
  {
    number: 5,
    name: "Searching across streaming services",
    area: "Entertainment",
    problem:
      "People who pay for three or more streaming services have no single place to search across them, so finding one title means checking each service in turn, and they often give up or pay to rent something a service they already subscribe to carries.",
    outcome: "dropped-after-phase-1",
    outcomeNote: "Strong evidence, but availability data is not obtainable and free incumbents already do this."
  }
];

export const interviews = raw as Interview[];

export const candidateByNumber = (n: number) => candidates.find((c) => c.number === n)!;

export const outcomeLabel: Record<Outcome, string> = {
  "dropped-after-phase-1": "Dropped after Phase 1",
  "dropped-after-phase-2": "Dropped after Phase 2",
  selected: "Selected"
};

export function countBy<T extends string | number>(items: Interview[], key: (i: Interview) => T) {
  const m = new Map<T, number>();
  for (const i of items) m.set(key(i), (m.get(key(i)) ?? 0) + 1);
  return m;
}
