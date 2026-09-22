import { interviews } from "./evidence";

// Roles, ownership and bios are placeholders until the team fills them in.
// Interview counts are not stored here: they are counted from the sheets in
// content/evidence/interviews.json, so the About page and the contribution
// statement can never disagree with the evidence.
export interface Member {
  id: string;
  name: string;
  role: string | null;
  owns: string | null;
  bio: string | null;
  /** Path under /public once a real photo exists, e.g. "/images/team/samuel.jpg";
   *  a square crop works best. Until then the About page shows initials. */
  photo: string | null;
}

export const team: Member[] = [
  {
    id: "samuel",
    name: "Samuel Alderete",
    role: "Portal lead",
    owns: "The portal itself: the site and its design, the Home board, the palettes, the PDF pipeline and the deployment to Render.",
    bio: "Samuel, 25, is a computer science student at UTEP, graduating in December 2026.",
    photo: "/images/team/samuel.jpg"
  },
  {
    id: "jazmin",
    name: "Jazmin Huerta",
    role: null,
    owns: null,
    bio: null,
    photo: null
  },
  {
    id: "christian",
    name: "Christian Lopez-Matulessy",
    role: null,
    owns: null,
    bio: null,
    photo: null
  },
  {
    id: "emmanuel",
    name: "Emmanuel Saenz",
    role: "Project Manager",
    owns: "The Project Charter.",
    bio: null,
    photo: null
  },
  {
    id: "oscar",
    name: "Oscar Vargas",
    role: null,
    owns: null,
    bio: null,
    photo: null
  }
];

/** Two letters for the portrait placeholder: first name and last name. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join("");

export const memberById = (id: string | null) => (id ? team.find((m) => m.id === id) ?? null : null);

/** Sheets on record for a member, by phase, counted from the evidence. */
export function interviewCounts(memberId: string) {
  const mine = interviews.filter((i) => i.interviewer === memberId);
  const phase1 = mine.filter((i) => i.phase === 1).length;
  const phase2 = mine.filter((i) => i.phase === 2).length;
  return { phase1, phase2, total: phase1 + phase2 };
}

/** Sheets that carry no interviewer, by phase. Zero once every sheet is attributed. */
export const unattributed = {
  phase1: interviews.filter((i) => i.phase === 1 && !i.interviewer).length,
  phase2: interviews.filter((i) => i.phase === 2 && !i.interviewer).length
};
