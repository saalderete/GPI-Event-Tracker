// Roles, ownership and bios are placeholders until the team fills them in.
// Interview counts are real, taken from the Sprint 1 interview sheets.
export interface Member {
  id: string;
  name: string;
  role: string | null;
  owns: string | null;
  bio: string | null;
  /** Path under /public once a real photo exists, e.g. "/images/team/samuel.jpg". */
  photo: string | null;
  interviews: { phase1: number; phase2: number };
}

export const team: Member[] = [
  {
    id: "samuel",
    name: "Samuel Alderete",
    role: null,
    owns: null,
    bio: null,
    photo: null,
    interviews: { phase1: 5, phase2: 5 }
  },
  {
    id: "jazmin",
    name: "Jazmin Huerta",
    role: null,
    owns: null,
    bio: null,
    photo: null,
    interviews: { phase1: 0, phase2: 4 }
  },
  {
    id: "christian",
    name: "Christian Lopez-Matulessy",
    role: null,
    owns: null,
    bio: null,
    photo: null,
    interviews: { phase1: 0, phase2: 5 }
  },
  {
    id: "emmanuel",
    name: "Emmanuel Saenz",
    role: null,
    owns: null,
    bio: null,
    photo: null,
    interviews: { phase1: 5, phase2: 6 }
  },
  {
    id: "oscar",
    name: "Oscar Vargas",
    role: null,
    owns: null,
    bio: null,
    photo: null,
    interviews: { phase1: 0, phase2: 5 }
  }
];

// Sixteen Phase 1 sheets (candidates 3, 4 and 5) were recorded in a grid
// without an interviewer name, so per-person Phase 1 counts above only cover
// the sheets that carry one. The team can attribute the rest here.
export const unattributedPhase1 = 16;

export const memberById = (id: string | null) => (id ? team.find((m) => m.id === id) ?? null : null);
