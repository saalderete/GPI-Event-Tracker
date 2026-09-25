import type { GameContext, GameDef, GameHandle } from "./types";

// Tetris, monochrome the way the Game Boy's was: what has landed in ink,
// what is falling in the accent, a ghost of where it lands.
const COLS = 10;
const ROWS = 20;
const PIECES: number[][][] = [
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
];
const LINE_SCORE = [0, 100, 300, 500, 800];

type Piece = { m: number[][]; r: number; c: number };

const rotateCW = (m: number[][]) => m[0].map((_, i) => m.map((row) => row[i]).reverse());
const rotateCCW = (m: number[][]) => rotateCW(rotateCW(rotateCW(m)));
const emptyBoard = () => Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
const interval = (level: number) => Math.max(90, 800 - (level - 1) * 75);
const cellFor = (small: boolean) => (small ? 18 : 24);

function collides(board: number[][], p: Piece) {
  for (let r = 0; r < p.m.length; r++) {
    for (let c = 0; c < p.m[r].length; c++) {
      if (!p.m[r][c]) continue;
      const br = p.r + r;
      const bc = p.c + c;
      if (bc < 0 || bc >= COLS || br >= ROWS) return true;
      if (br >= 0 && board[br][bc]) return true;
    }
  }
  return false;
}

export const tetris: GameDef = {
  id: "tetris",
  name: "Tetris",
  blurb: "Ten wide, twenty tall. Clear lines, and it speeds up.",
  keys: "Arrows move and turn. Space drops. Z turns the other way. P pauses. R restarts.",
  preview: true,
  wide: false,
  pad: [
    { label: "Left", action: "left" },
    { label: "Turn", action: "turn" },
    { label: "Right", action: "right" },
    { label: "Down", action: "down" },
    { label: "Drop", action: "drop" }
  ],
  size: (small) => ({ w: COLS * cellFor(small), h: ROWS * cellFor(small) }),
  create(ctx: GameContext): GameHandle {
    const cell = ctx.w / COLS;
    let board = emptyBoard();
    let bag: number[] = [];
    let cur: Piece;
    let next: number[][];
    let score = 0;
    let lines = 0;
    let level = 1;
    let over = false;
    let paused = false;
    let acc = 0;
    let raf = 0;
    let last = 0;

    const take = () => {
      if (!bag.length) {
        bag = [0, 1, 2, 3, 4, 5, 6];
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
      }
      return PIECES[bag.pop()!].map((row) => [...row]);
    };
    const spawn = (m: number[][]): Piece => ({ m, r: 0, c: Math.floor((COLS - m[0].length) / 2) });
    const report = () => ctx.report({ score, over, extra: [["Lines", lines], ["Level", level]] });

    const lock = () => {
      const { m, r, c } = cur;
      for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j] && r + i >= 0) board[r + i][c + j] = 1;
      const kept = board.filter((row) => row.some((v) => !v));
      const cleared = ROWS - kept.length;
      while (kept.length < ROWS) kept.unshift(Array<number>(COLS).fill(0));
      board = kept;
      if (cleared) {
        lines += cleared;
        score += LINE_SCORE[cleared] * level;
        level = 1 + Math.floor(lines / 10);
      }
      cur = spawn(next);
      next = take();
      if (collides(board, cur)) over = true;
      report();
    };
    const stepDown = () => {
      const moved = { ...cur, r: cur.r + 1 };
      if (collides(board, moved)) lock();
      else cur = moved;
    };
    const ghostRow = () => {
      let r = cur.r;
      while (!collides(board, { ...cur, r: r + 1 })) r++;
      return r;
    };
    const turn = (ccw: boolean) => {
      const m = ccw ? rotateCCW(cur.m) : rotateCW(cur.m);
      for (const kick of [0, -1, 1, -2, 2]) {
        const p = { m, r: cur.r, c: cur.c + kick };
        if (!collides(board, p)) {
          cur = p;
          return;
        }
      }
    };

    const draw = () => {
      const g = ctx.canvas.getContext("2d");
      if (!g) return;
      const col = ctx.colors();
      g.fillStyle = col.paper;
      g.fillRect(0, 0, ctx.w, ctx.h);
      g.strokeStyle = col.grid;
      g.lineWidth = 1;
      g.globalAlpha = 0.6;
      for (let c = 1; c < COLS; c++) {
        g.beginPath();
        g.moveTo(c * cell + 0.5, 0);
        g.lineTo(c * cell + 0.5, ctx.h);
        g.stroke();
      }
      for (let r = 1; r < ROWS; r++) {
        g.beginPath();
        g.moveTo(0, r * cell + 0.5);
        g.lineTo(ctx.w, r * cell + 0.5);
        g.stroke();
      }
      g.globalAlpha = 1;
      g.fillStyle = col.ink;
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c]) g.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
      if (!over) {
        const gr = ghostRow();
        const { m, r, c } = cur;
        g.strokeStyle = col.accent;
        g.lineWidth = 1.5;
        for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j] && gr + i >= 0) g.strokeRect((c + j) * cell + 2.5, (gr + i) * cell + 2.5, cell - 5, cell - 5);
        g.fillStyle = col.accent;
        for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j] && r + i >= 0) g.fillRect((c + j) * cell + 1, (r + i) * cell + 1, cell - 2, cell - 2);
      }
      const pv = ctx.preview;
      const pg = pv?.getContext("2d");
      if (pv && pg) {
        const pc = Number(pv.dataset.cell) || 14;
        pg.clearRect(0, 0, 4 * pc, 4 * pc);
        pg.fillStyle = col.ink;
        const m = next;
        const ox = Math.floor((4 - m[0].length) / 2);
        const oy = Math.floor((4 - m.length) / 2);
        for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j]) pg.fillRect((ox + j) * pc + 1, (oy + i) * pc + 1, pc - 2, pc - 2);
      }
    };

    const loop = (now: number) => {
      const dt = last ? now - last : 0;
      last = now;
      if (!over && !paused) {
        acc += dt;
        const ms = interval(level);
        while (acc >= ms && !over) {
          acc -= ms;
          stepDown();
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    const act = (what: string) => {
      if (over || paused) return;
      if (what === "left" || what === "right") {
        const p = { ...cur, c: cur.c + (what === "left" ? -1 : 1) };
        if (!collides(board, p)) cur = p;
      } else if (what === "down") {
        const p = { ...cur, r: cur.r + 1 };
        if (!collides(board, p)) {
          cur = p;
          score += 1;
          report();
        } else lock();
        acc = 0;
      } else if (what === "turn") turn(false);
      else if (what === "turnccw") turn(true);
      else if (what === "drop") {
        const gr = ghostRow();
        score += 2 * (gr - cur.r);
        cur = { ...cur, r: gr };
        lock();
        acc = 0;
      }
    };

    return {
      start() {
        board = emptyBoard();
        bag = [];
        cur = spawn(take());
        next = take();
        score = 0;
        lines = 0;
        level = 1;
        over = false;
        paused = false;
        acc = 0;
        last = 0;
        report();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      },
      stop() {
        cancelAnimationFrame(raf);
      },
      pause(on) {
        paused = on;
        last = 0;
      },
      key(k, down) {
        if (!down) return false;
        const map: Record<string, string> = { ArrowLeft: "left", ArrowRight: "right", ArrowDown: "down", ArrowUp: "turn", x: "turn", X: "turn", z: "turnccw", Z: "turnccw", " ": "drop" };
        const a = map[k];
        if (!a) return false;
        act(a);
        return true;
      },
      press(action, down) {
        if (down) act(action);
      }
    };
  }
};
