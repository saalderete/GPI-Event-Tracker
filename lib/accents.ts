import spec from "@/content/accents.json";

// One palette, in one theme: the whole page's colours, not only the accent.
export interface Palette {
  paper: string;
  surface: string;
  surfaceSubtle: string;
  surfaceMuted: string;
  ink: string;
  inkSoft: string;
  labelInk: string;
  muted: string;
  border: string;
  hoverBorder: string;
  railBg: string;
  railText: string;
  accent: string;
  hover: string;
  soft: string;
  accentInk: string;
  on: string;
}

export interface AccentPreset {
  id: string;
  label: string;
  hint: string;
  light: Palette;
  dark: Palette;
}

export const accents = spec.accents as AccentPreset[];
export const defaultAccent = spec.default as string;

/** A two-tone chip for the picker: the palette's paper and its accent. */
export const chip = (p: Palette) =>
  `linear-gradient(135deg, ${p.paper} 0 calc(50% - 0.5px), ${p.accent} calc(50% + 0.5px) 100%)`;
