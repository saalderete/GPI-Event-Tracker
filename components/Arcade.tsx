"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { tetris } from "@/lib/games/tetris";
import { pong } from "@/lib/games/pong";
import { flappy } from "@/lib/games/flappy";
import { readBest, writeBest, type GameDef, type GameHandle, type GameStats } from "@/lib/games/types";

// Hidden. Five quick clicks on nothing in particular (not a link, a button
// or a field) open a small arcade: Tetris, Pong and Flappy Bird, each drawn
// in the visitor's own palette, monochrome the way the Game Boy's was. The
// host owns the dialog, the menu, the keys and the pad; each game owns its
// canvas (lib/games). Best scores stay in this browser only.
const GAMES: GameDef[] = [tetris, pong, flappy];
const CLICKS = 5;
const WINDOW_MS = 1600;

export function Arcade() {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const handle = useRef<GameHandle | null>(null);
  const bestRef = useRef<Record<string, number>>({});
  const pausedRef = useRef(false);
  const overRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState<GameDef | null>(null);
  const [stats, setStats] = useState<GameStats>({ score: 0, over: false });
  const [paused, setPaused] = useState(false);
  const [best, setBest] = useState<Record<string, number>>({});

  const setPause = (on: boolean) => {
    pausedRef.current = on;
    setPaused(on);
    handle.current?.pause(on);
  };
  const restart = () => {
    setPause(false);
    overRef.current = false;
    handle.current?.start();
  };

  const show = () => {
    const d = dialog.current;
    if (!d || d.open || typeof d.showModal !== "function") return;
    const b = Object.fromEntries(GAMES.map((g) => [g.id, readBest(g.id)]));
    bestRef.current = b;
    setBest(b);
    setGame(null);
    setOpen(true);
    d.showModal();
    document.documentElement.dataset.viewer = "open";
  };
  const back = () => {
    handle.current?.stop();
    handle.current = null;
    setGame(null);
  };
  const onClose = () => {
    handle.current?.stop();
    handle.current = null;
    delete document.documentElement.dataset.viewer;
    setOpen(false);
    setGame(null);
  };
  const pick = (g: GameDef) => {
    setStats({ score: 0, over: false });
    overRef.current = false;
    setPause(false);
    setGame(g);
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

  // Mount the chosen game on its canvas.
  useEffect(() => {
    const el = canvas.current;
    if (!game || !el) return;
    const small = window.innerWidth < 640 || window.innerHeight < 700;
    const { w, h } = game.size(small);
    const dpr = window.devicePixelRatio || 1;
    el.width = w * dpr;
    el.height = h * dpr;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pv = game.preview ? preview.current : null;
    if (pv) {
      const pc = 14;
      pv.width = 4 * pc * dpr;
      pv.height = 4 * pc * dpr;
      pv.style.width = `${4 * pc}px`;
      pv.style.height = `${4 * pc}px`;
      pv.dataset.cell = String(pc);
      pv.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const colors = () => {
      const cs = getComputedStyle(document.documentElement);
      const v = (n: string) => cs.getPropertyValue(n).trim();
      return { paper: v("--surface-muted"), grid: v("--border"), ink: v("--ink"), accent: v("--accent"), muted: v("--muted") };
    };
    const report = (s: GameStats) => {
      overRef.current = s.over;
      setStats(s);
      if (s.score > (bestRef.current[game.id] ?? 0)) {
        bestRef.current = { ...bestRef.current, [game.id]: s.score };
        writeBest(game.id, s.score);
        setBest(bestRef.current);
      }
    };
    const hnd = game.create({ canvas: el, preview: pv, w, h, colors, report });
    handle.current = hnd;
    hnd.start();
    el.focus();
    return () => {
      hnd.stop();
      if (handle.current === hnd) handle.current = null;
    };
  }, [game]);

  // Keys, while a game is up.
  useEffect(() => {
    if (!open || !game) return;
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const h = handle.current;
      if (!h) return;
      const k = e.key;
      if (down && (k === "p" || k === "P")) {
        if (!overRef.current) setPause(!pausedRef.current);
        e.preventDefault();
        return;
      }
      if (down && (k === "r" || k === "R")) {
        restart();
        e.preventDefault();
        return;
      }
      if (down && overRef.current && (k === " " || k === "Enter")) {
        restart();
        e.preventDefault();
        return;
      }
      if (h.key(k, down)) e.preventDefault();
    };
    const dn = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, [open, game]);

  const pointer = (type: "down" | "move" | "up") => (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const h = handle.current;
    const el = canvas.current;
    if (!h?.pointer || !el || !game) return;
    const r = el.getBoundingClientRect();
    const small = window.innerWidth < 640 || window.innerHeight < 700;
    const { w, h: hh } = game.size(small);
    h.pointer({ type, x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * hh });
    if (type === "down") e.preventDefault();
  };

  const overlayTitle = paused ? "Paused" : stats.title ?? "Game over";

  return (
    <dialog ref={dialog} className="arcade no-print" data-wide={game?.wide ? "true" : "false"} aria-label="Arcade" onClose={onClose}>
      <div className="arcade-inner">
        <div className="arcade-head">
          <div>
            <p className="arcade-title">{game ? game.name : "Arcade"}</p>
            <p className="arcade-sub">Five clicks on nothing. You found it.</p>
          </div>
          <div className="arcade-actions">
            {game ? (
              <button type="button" className="btn btn-ghost" onClick={back}>
                Games
              </button>
            ) : null}
            <button type="button" className="btn btn-ghost" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
        </div>

        {!game ? (
          <div className="arcade-menu">
            {GAMES.map((g) => (
              <button key={g.id} type="button" className="arcade-card" onClick={() => pick(g)}>
                <span className="arcade-card-name">{g.name}</span>
                <span className="arcade-card-blurb">{g.blurb}</span>
                <span className="arcade-card-best">Best {best[g.id] ?? 0}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="arcade-body">
              <div className="arcade-stage">
                <canvas
                  ref={canvas}
                  className="arcade-board"
                  tabIndex={0}
                  aria-label={`${game.name} board`}
                  onPointerDown={pointer("down")}
                  onPointerMove={pointer("move")}
                  onPointerUp={pointer("up")}
                />
                {stats.over || paused ? (
                  <div className="arcade-over" role="status">
                    <p className="arcade-over-title">{overlayTitle}</p>
                    {stats.over ? (
                      <div className="arcade-over-actions">
                        <button type="button" className="btn btn-primary" onClick={restart}>
                          Play again
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={back}>
                          Games
                        </button>
                      </div>
                    ) : (
                      <p className="arcade-keys">P to resume</p>
                    )}
                  </div>
                ) : null}
              </div>
              <dl className="arcade-side">
                <div>
                  <dt>Score</dt>
                  <dd>{stats.score}</dd>
                </div>
                <div>
                  <dt>Best</dt>
                  <dd>{Math.max(best[game.id] ?? 0, stats.score)}</dd>
                </div>
                {(stats.extra ?? []).map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                {game.preview ? (
                  <div>
                    <dt>Next</dt>
                    <dd>
                      <canvas ref={preview} className="arcade-next" aria-hidden="true" />
                    </dd>
                  </div>
                ) : null}
                <p className="arcade-keys">{game.keys} Esc closes.</p>
              </dl>
            </div>
            <div className="arcade-pad" aria-label="Controls" style={{ gridTemplateColumns: `repeat(${game.pad.length}, 1fr)` }}>
              {game.pad.map((b) => (
                <button
                  key={b.action}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (overRef.current) restart();
                    else handle.current?.press(b.action, true);
                  }}
                  onPointerUp={() => handle.current?.press(b.action, false)}
                  onPointerLeave={() => handle.current?.press(b.action, false)}
                  onPointerCancel={() => handle.current?.press(b.action, false)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
