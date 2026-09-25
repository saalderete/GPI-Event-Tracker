"use client";

import { useEffect, useRef, useState } from "react";

// Hidden. Five quick clicks on nothing in particular (not a link, a button
// or a field) open a game of Tetris drawn in the visitor's own palette,
// monochrome the way the Game Boy's was: locked blocks in ink, the falling
// piece in the accent. Arrows move and rotate, space drops, P pauses, Esc
// closes. Phones get a pad. The best score stays in this browser only.
const COLS = 10;
const ROWS = 20;
const CLICKS = 5;
const WINDOW_MS = 1600;
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
const BEST_KEY = "gpi-tetris-best";

type Piece = { m: number[][]; r: number; c: number };
interface Game {
  board: number[][];
  cur: Piece;
  next: number[][];
  bag: number[];
  score: number;
  lines: number;
  level: number;
  over: boolean;
  paused: boolean;
  acc: number;
}
interface Stats {
  score: number;
  lines: number;
  level: number;
  best: number;
  over: boolean;
  paused: boolean;
}

const rotateCW = (m: number[][]) => m[0].map((_, i) => m.map((row) => row[i]).reverse());
const rotateCCW = (m: number[][]) => rotateCW(rotateCW(rotateCW(m)));
const emptyBoard = () => Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
const interval = (level: number) => Math.max(90, 800 - (level - 1) * 75);

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

function takeFromBag(g: Pick<Game, "bag">) {
  if (!g.bag.length) {
    g.bag = [0, 1, 2, 3, 4, 5, 6];
    for (let i = g.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [g.bag[i], g.bag[j]] = [g.bag[j], g.bag[i]];
    }
  }
  return PIECES[g.bag.pop()!].map((row) => [...row]);
}

const spawn = (m: number[][]): Piece => ({ m, r: 0, c: Math.floor((COLS - m[0].length) / 2) });

function newGame(): Game {
  const g = { bag: [] as number[] };
  const first = takeFromBag(g);
  const next = takeFromBag(g);
  return { board: emptyBoard(), cur: spawn(first), next, bag: g.bag, score: 0, lines: 0, level: 1, over: false, paused: false, acc: 0 };
}

function lock(g: Game) {
  const { m, r, c } = g.cur;
  for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j] && r + i >= 0) g.board[r + i][c + j] = 1;
  const kept = g.board.filter((row) => row.some((v) => !v));
  const cleared = ROWS - kept.length;
  while (kept.length < ROWS) kept.unshift(Array<number>(COLS).fill(0));
  g.board = kept;
  if (cleared) {
    g.lines += cleared;
    g.score += LINE_SCORE[cleared] * g.level;
    g.level = 1 + Math.floor(g.lines / 10);
  }
  g.cur = spawn(g.next);
  g.next = takeFromBag(g);
  if (collides(g.board, g.cur)) g.over = true;
}

function step(g: Game) {
  const moved = { ...g.cur, r: g.cur.r + 1 };
  if (collides(g.board, moved)) lock(g);
  else g.cur = moved;
}

function ghostRow(g: Game) {
  let r = g.cur.r;
  while (!collides(g.board, { ...g.cur, r: r + 1 })) r++;
  return r;
}

function turn(g: Game, ccw = false) {
  const m = ccw ? rotateCCW(g.cur.m) : rotateCW(g.cur.m);
  for (const kick of [0, -1, 1, -2, 2]) {
    const p = { m, r: g.cur.r, c: g.cur.c + kick };
    if (!collides(g.board, p)) {
      g.cur = p;
      return;
    }
  }
}

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function writeBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {}
}

export function Tetris() {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const raf = useRef(0);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({ score: 0, lines: 0, level: 1, best: 0, over: false, paused: false });
  const statsRef = useRef(stats);

  const publish = () => {
    const g = game.current;
    if (!g) return;
    const s = statsRef.current;
    if (s.score !== g.score || s.lines !== g.lines || s.level !== g.level || s.over !== g.over || s.paused !== g.paused) {
      const best = g.over && g.score > s.best ? g.score : s.best;
      if (best !== s.best) writeBest(best);
      const n = { score: g.score, lines: g.lines, level: g.level, best, over: g.over, paused: g.paused };
      statsRef.current = n;
      setStats(n);
    }
  };

  const colors = () => {
    const cs = getComputedStyle(document.documentElement);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    return { paper: v("--surface-muted"), grid: v("--border"), ink: v("--ink"), accent: v("--accent") };
  };

  const draw = () => {
    const g = game.current;
    const el = canvas.current;
    if (!g || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const cell = Number(el.dataset.cell);
    const col = colors();
    ctx.fillStyle = col.paper;
    ctx.fillRect(0, 0, COLS * cell, ROWS * cell);
    ctx.strokeStyle = col.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    for (let c = 1; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cell + 0.5, 0);
      ctx.lineTo(c * cell + 0.5, ROWS * cell);
      ctx.stroke();
    }
    for (let r = 1; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cell + 0.5);
      ctx.lineTo(COLS * cell, r * cell + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = col.ink;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (g.board[r][c]) ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
    if (!g.over) {
      const gr = ghostRow(g);
      ctx.strokeStyle = col.accent;
      ctx.lineWidth = 1.5;
      const { m, r, c } = g.cur;
      for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j] && gr + i >= 0) ctx.strokeRect((c + j) * cell + 2.5, (gr + i) * cell + 2.5, cell - 5, cell - 5);
      ctx.fillStyle = col.accent;
      for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j] && r + i >= 0) ctx.fillRect((c + j) * cell + 1, (r + i) * cell + 1, cell - 2, cell - 2);
    }
    const pv = preview.current;
    const pctx = pv?.getContext("2d");
    if (pv && pctx) {
      const pc = Number(pv.dataset.cell);
      pctx.clearRect(0, 0, 4 * pc, 4 * pc);
      pctx.fillStyle = col.ink;
      const m = g.next;
      const ox = Math.floor((4 - m[0].length) / 2);
      const oy = Math.floor((4 - m.length) / 2);
      for (let i = 0; i < m.length; i++) for (let j = 0; j < m[i].length; j++) if (m[i][j]) pctx.fillRect((ox + j) * pc + 1, (oy + i) * pc + 1, pc - 2, pc - 2);
    }
  };

  const loop = (now: number, last: number) => {
    const g = game.current;
    if (!g) return;
    if (!g.over && !g.paused) {
      g.acc += now - last;
      const step_ms = interval(g.level);
      while (g.acc >= step_ms && !g.over) {
        g.acc -= step_ms;
        step(g);
      }
    }
    draw();
    publish();
    raf.current = requestAnimationFrame((t) => loop(t, now));
  };

  const size = () => {
    const el = canvas.current;
    const pv = preview.current;
    if (!el || !pv) return;
    const cell = window.innerWidth < 640 || window.innerHeight < 700 ? 18 : 24;
    const dpr = window.devicePixelRatio || 1;
    el.width = COLS * cell * dpr;
    el.height = ROWS * cell * dpr;
    el.style.width = `${COLS * cell}px`;
    el.style.height = `${ROWS * cell}px`;
    el.dataset.cell = String(cell);
    el.getContext("2d")?.scale(dpr, dpr);
    const pc = 14;
    pv.width = 4 * pc * dpr;
    pv.height = 4 * pc * dpr;
    pv.style.width = `${4 * pc}px`;
    pv.style.height = `${4 * pc}px`;
    pv.dataset.cell = String(pc);
    pv.getContext("2d")?.scale(dpr, dpr);
  };

  const start = () => {
    game.current = newGame();
    statsRef.current = { ...statsRef.current, score: 0, lines: 0, level: 1, over: false, paused: false, best: readBest() };
    setStats(statsRef.current);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame((t) => loop(t, t));
  };

  const show = () => {
    const d = dialog.current;
    if (!d || d.open || typeof d.showModal !== "function") return;
    setOpen(true);
    d.showModal();
    document.documentElement.dataset.viewer = "open";
    size();
    start();
    canvas.current?.focus();
  };

  const onClose = () => {
    cancelAnimationFrame(raf.current);
    game.current = null;
    delete document.documentElement.dataset.viewer;
    setOpen(false);
  };

  const act = (what: "left" | "right" | "down" | "turn" | "turnccw" | "drop" | "pause") => {
    const g = game.current;
    if (!g || g.over) return;
    if (what === "pause") {
      g.paused = !g.paused;
      return;
    }
    if (g.paused) return;
    if (what === "left" || what === "right") {
      const p = { ...g.cur, c: g.cur.c + (what === "left" ? -1 : 1) };
      if (!collides(g.board, p)) g.cur = p;
    } else if (what === "down") {
      const p = { ...g.cur, r: g.cur.r + 1 };
      if (!collides(g.board, p)) {
        g.cur = p;
        g.score += 1;
      } else lock(g);
      g.acc = 0;
    } else if (what === "turn") turn(g);
    else if (what === "turnccw") turn(g, true);
    else if (what === "drop") {
      const gr = ghostRow(g);
      g.score += 2 * (gr - g.cur.r);
      g.cur = { ...g.cur, r: gr };
      lock(g);
      g.acc = 0;
    }
  };

  // The trigger: five quick clicks on nothing in particular.
  useEffect(() => {
    let n = 0;
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || dialog.current?.open) return;
      if (t.closest("a, button, input, textarea, select, label, summary, dialog, video, [role='button'], [contenteditable]")) {
        n = 0;
        return;
      }
      n += 1;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        n = 0;
      }, WINDOW_MS);
      if (n >= CLICKS) {
        n = 0;
        show();
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    };
  });

  // Keys, while the game is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const g = game.current;
      if (!g) return;
      const k = e.key;
      const handled = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "x", "X", "z", "Z", "p", "P", "r", "R"];
      if (!handled.includes(k)) return;
      e.preventDefault();
      if (g.over) {
        if (k === "r" || k === "R" || k === " ") start();
        return;
      }
      if (k === "ArrowLeft") act("left");
      else if (k === "ArrowRight") act("right");
      else if (k === "ArrowDown") act("down");
      else if (k === "ArrowUp" || k === "x" || k === "X") act("turn");
      else if (k === "z" || k === "Z") act("turnccw");
      else if (k === " ") act("drop");
      else if (k === "p" || k === "P") act("pause");
      else if (k === "r" || k === "R") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <dialog ref={dialog} className="tetris no-print" aria-label="Tetris" onClose={onClose}>
      <div className="tetris-inner">
        <div className="tetris-head">
          <div>
            <p className="tetris-title">Tetris</p>
            <p className="tetris-sub">Five clicks on nothing. You found it.</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <div className="tetris-body">
          <div className="tetris-stage">
            <canvas ref={canvas} className="tetris-board" tabIndex={0} aria-label="Game board" />
            {stats.over || stats.paused ? (
              <div className="tetris-over" role="status">
                <p className="tetris-over-title">{stats.over ? "Game over" : "Paused"}</p>
                {stats.over ? (
                  <button type="button" className="btn btn-primary" onClick={start}>
                    Play again
                  </button>
                ) : (
                  <p className="tetris-keys">P to resume</p>
                )}
              </div>
            ) : null}
          </div>
          <dl className="tetris-side">
            <div>
              <dt>Score</dt>
              <dd>{stats.score}</dd>
            </div>
            <div>
              <dt>Lines</dt>
              <dd>{stats.lines}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{stats.level}</dd>
            </div>
            <div>
              <dt>Best</dt>
              <dd>{Math.max(stats.best, stats.score)}</dd>
            </div>
            <div>
              <dt>Next</dt>
              <dd>
                <canvas ref={preview} className="tetris-next" aria-hidden="true" />
              </dd>
            </div>
            <p className="tetris-keys">
              Arrows move and turn. Space drops. Z turns the other way. P pauses. R restarts. Esc closes.
            </p>
          </dl>
        </div>
        <div className="tetris-pad" aria-label="Controls">
          <button type="button" onPointerDown={() => act("left")}>
            Left
          </button>
          <button type="button" onPointerDown={() => act("turn")}>
            Turn
          </button>
          <button type="button" onPointerDown={() => act("right")}>
            Right
          </button>
          <button type="button" onPointerDown={() => act("down")}>
            Down
          </button>
          <button type="button" onPointerDown={() => (stats.over ? start() : act("drop"))}>
            {stats.over ? "Again" : "Drop"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
