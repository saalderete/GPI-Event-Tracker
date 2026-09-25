// The hidden arcade's contract. Each game draws on the canvas the host gives
// it, in the palette colours the host reads for it, and reports its numbers
// back; the host owns the dialog, the menu, the keys and the pad.
export interface GameColors {
  paper: string;
  grid: string;
  ink: string;
  accent: string;
  muted: string;
}

export interface GameStats {
  score: number;
  over: boolean;
  /** What the overlay says when the game is over; "Game over" if absent. */
  title?: string;
  /** Extra numbers for the side panel, label and value. */
  extra?: [string, string | number][];
}

export interface PointerAction {
  type: "down" | "move" | "up";
  x: number;
  y: number;
}

export interface GameHandle {
  start(): void;
  stop(): void;
  pause(on: boolean): void;
  /** A key, down or up. Returns true when the game used it. */
  key(k: string, down: boolean): boolean;
  /** A pad button, down or up. */
  press(action: string, down: boolean): void;
  /** The pointer on the canvas, in canvas pixels. */
  pointer?(p: PointerAction): void;
}

export interface GameContext {
  canvas: HTMLCanvasElement;
  /** A second, small canvas for a preview, when the game asks for one. */
  preview: HTMLCanvasElement | null;
  w: number;
  h: number;
  colors: () => GameColors;
  report: (s: GameStats) => void;
}

export interface GameDef {
  id: string;
  name: string;
  blurb: string;
  keys: string;
  preview: boolean;
  /** Landscape games widen the dialog. */
  wide: boolean;
  pad: { label: string; action: string; hold?: boolean }[];
  size: (small: boolean) => { w: number; h: number };
  create: (ctx: GameContext) => GameHandle;
}

export const readBest = (id: string) => {
  try {
    return Number(localStorage.getItem(`gpi-arcade-${id}-best`)) || 0;
  } catch {
    return 0;
  }
};
export const writeBest = (id: string, n: number) => {
  try {
    localStorage.setItem(`gpi-arcade-${id}-best`, String(n));
  } catch {}
};
