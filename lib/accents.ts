import spec from "@/content/accents.json";

export interface AccentPreset {
  id: string;
  label: string;
  hint: string;
  light: { accent: string; hover: string; soft: string; ink: string; on: string };
  dark: { accent: string; hover: string; soft: string; ink: string; on: string };
}

export const accents = spec.accents as AccentPreset[];
export const defaultAccent = spec.default as string;
