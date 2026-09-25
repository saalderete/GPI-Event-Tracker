import type { GameContext, GameDef, GameHandle } from "./types";

// Flappy Bird: the bird is the accent, the pipes are ink. Tap, click or
// press space to flap; the first flap starts the run.
export const flappy: GameDef = {
  id: "flappy",
  name: "Flappy Bird",
  blurb: "One button. Through the gaps. Do not touch anything.",
  keys: "Space, the up arrow or a click flaps. P pauses. R restarts.",
  preview: false,
  wide: false,
  pad: [{ label: "Flap", action: "flap" }],
  size: (small) => (small ? { w: 280, h: 400 } : { w: 320, h: 460 }),
  create(ctx: GameContext): GameHandle {
    const { w, h } = ctx;
    const GROUND = 36;
    const BIRD = Math.round(w / 20);
    const PIPE_W = Math.round(w / 7);
    const GAP = Math.round(h * 0.27);
    const SPACING = Math.round(w * 0.62);
    const BX = w * 0.28;
    let by = h / 2;
    let vy = 0;
    let pipes: { x: number; gapY: number; passed: boolean }[] = [];
    let score = 0;
    let over = false;
    let paused = false;
    let ready = true;
    let t = 0;
    let raf = 0;
    let last = 0;

    const report = () => ctx.report({ score, over });
    const speed = () => w * 0.47 + Math.min(score, 30) * (w * 0.006);
    const addPipe = (x: number) => {
      const min = GAP / 2 + 30;
      const max = h - GROUND - GAP / 2 - 30;
      pipes.push({ x, gapY: min + Math.random() * (max - min), passed: false });
    };

    const flap = () => {
      if (over || paused) return;
      if (ready) {
        ready = false;
        pipes = [];
        addPipe(w + 40);
      }
      vy = -h * 0.92;
    };

    const update = (dt: number) => {
      if (over || paused) return;
      t += dt;
      if (ready) {
        by = h / 2 + Math.sin(t * 4) * 6;
        return;
      }
      vy += h * 3.2 * dt;
      by += vy * dt;
      const v = speed();
      for (const p of pipes) p.x -= v * dt;
      if (pipes.length && pipes[pipes.length - 1].x < w - SPACING) addPipe(pipes[pipes.length - 1].x + SPACING);
      pipes = pipes.filter((p) => p.x + PIPE_W > -10);
      for (const p of pipes) {
        if (!p.passed && p.x + PIPE_W < BX - BIRD / 2) {
          p.passed = true;
          score += 1;
          report();
        }
        const inX = BX + BIRD / 2 > p.x && BX - BIRD / 2 < p.x + PIPE_W;
        const inGap = by - BIRD / 2 > p.gapY - GAP / 2 && by + BIRD / 2 < p.gapY + GAP / 2;
        if (inX && !inGap) over = true;
      }
      if (by + BIRD / 2 >= h - GROUND || by - BIRD / 2 <= 0) over = true;
      if (over) report();
    };

    const draw = () => {
      const g = ctx.canvas.getContext("2d");
      if (!g) return;
      const col = ctx.colors();
      g.fillStyle = col.paper;
      g.fillRect(0, 0, w, h);
      g.fillStyle = col.ink;
      for (const p of pipes) {
        g.fillRect(p.x, 0, PIPE_W, p.gapY - GAP / 2);
        g.fillRect(p.x, p.gapY + GAP / 2, PIPE_W, h - GROUND - (p.gapY + GAP / 2));
        g.fillRect(p.x - 3, p.gapY - GAP / 2 - 10, PIPE_W + 6, 10);
        g.fillRect(p.x - 3, p.gapY + GAP / 2, PIPE_W + 6, 10);
      }
      g.fillStyle = col.grid;
      g.fillRect(0, h - GROUND, w, GROUND);
      g.fillStyle = col.ink;
      g.fillRect(0, h - GROUND, w, 2);
      const tilt = Math.max(-0.5, Math.min(0.9, vy / (h * 1.2)));
      g.save();
      g.translate(BX, by);
      g.rotate(ready ? 0 : tilt);
      g.fillStyle = col.accent;
      g.beginPath();
      g.roundRect(-BIRD / 2, -BIRD / 2, BIRD, BIRD, BIRD / 3);
      g.fill();
      g.fillStyle = col.paper;
      g.beginPath();
      g.arc(BIRD / 5, -BIRD / 6, BIRD / 8, 0, Math.PI * 2);
      g.fill();
      g.restore();
      g.fillStyle = col.muted;
      g.font = `700 ${Math.round(h / 12)}px "IBM Plex Mono", ui-monospace, monospace`;
      g.textAlign = "center";
      g.textBaseline = "top";
      g.globalAlpha = 0.55;
      g.fillText(String(score), w / 2, 14);
      g.globalAlpha = 1;
      if (ready) {
        g.fillStyle = col.muted;
        g.font = `500 12px "IBM Plex Mono", ui-monospace, monospace`;
        g.fillText("flap to start", w / 2, h / 2 + 40);
      }
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };

    return {
      start() {
        by = h / 2;
        vy = 0;
        pipes = [];
        score = 0;
        over = false;
        paused = false;
        ready = true;
        t = 0;
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
        if (k === " " || k === "ArrowUp" || k === "w" || k === "W") {
          flap();
          return true;
        }
        return false;
      },
      press(action, down) {
        if (down && action === "flap") flap();
      },
      pointer(p) {
        if (p.type === "down") flap();
      }
    };
  }
};
