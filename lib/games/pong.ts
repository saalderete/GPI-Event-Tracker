import type { GameContext, GameDef, GameHandle } from "./types";

// Pong against the machine, first to seven. Your paddle is the accent, the
// machine's is ink. Keys, the pad, or a finger on the table all move you.
const TO_WIN = 7;

export const pong: GameDef = {
  id: "pong",
  name: "Pong",
  blurb: "First to seven against the machine. It gets faster.",
  keys: "Up and down arrows, or W and S, move you. Or drag on the table. P pauses. R restarts.",
  preview: false,
  wide: true,
  pad: [
    { label: "Up", action: "up", hold: true },
    { label: "Down", action: "down", hold: true }
  ],
  size: (small) => (small ? { w: 320, h: 200 } : { w: 480, h: 300 }),
  create(ctx: GameContext): GameHandle {
    const { w, h } = ctx;
    const PAD_H = h * 0.2;
    const PAD_W = Math.max(6, Math.round(w / 60));
    const R = Math.max(4, Math.round(w / 96));
    let py = h / 2;
    let cy = h / 2;
    let bx = w / 2;
    let by = h / 2;
    let vx = 0;
    let vy = 0;
    let speed = 0;
    let me = 0;
    let cpu = 0;
    let over = false;
    let paused = false;
    let dir = 0;
    let target = h / 2;
    let serveTimer = 0;
    let raf = 0;
    let last = 0;

    const report = () => ctx.report({ score: me, over, title: over ? (me > cpu ? "You win" : "The machine wins") : undefined, extra: [["You", me], ["Machine", cpu]] });

    const serve = (toRight: boolean) => {
      bx = w / 2;
      by = h / 2;
      speed = w * 0.55;
      const a = (Math.random() * 0.6 - 0.3) * Math.PI;
      vx = Math.cos(a) * speed * (toRight ? 1 : -1);
      vy = Math.sin(a) * speed;
      target = h / 2 + (Math.random() - 0.5) * PAD_H;
      serveTimer = 0.7;
    };

    const update = (dt: number) => {
      if (over || paused) return;
      py = Math.max(PAD_H / 2, Math.min(h - PAD_H / 2, py + dir * h * 1.15 * dt));
      if (serveTimer > 0) {
        serveTimer -= dt;
        return;
      }
      bx += vx * dt;
      by += vy * dt;
      if (by < R) {
        by = R;
        vy = Math.abs(vy);
      } else if (by > h - R) {
        by = h - R;
        vy = -Math.abs(vy);
      }
      // The machine tracks the ball only while it comes its way, with a cap.
      if (vx > 0) {
        const want = by + (target - h / 2) * 0.35;
        const step = Math.min(Math.abs(want - cy), h * 0.85 * dt);
        cy += Math.sign(want - cy) * step;
      } else {
        cy += (h / 2 - cy) * Math.min(1, dt * 1.2);
      }
      cy = Math.max(PAD_H / 2, Math.min(h - PAD_H / 2, cy));
      const px = 12;
      const cx = w - 12 - PAD_W;
      if (vx < 0 && bx - R <= px + PAD_W && bx - R >= px - 6 && Math.abs(by - py) <= PAD_H / 2 + R) {
        bx = px + PAD_W + R;
        const rel = (by - py) / (PAD_H / 2);
        speed = Math.min(speed * 1.06, w * 1.6);
        const a = rel * 0.75;
        vx = Math.cos(a) * speed;
        vy = Math.sin(a) * speed;
        target = h / 2 + (Math.random() - 0.5) * PAD_H * 1.4;
      } else if (vx > 0 && bx + R >= cx && bx + R <= cx + PAD_W + 6 && Math.abs(by - cy) <= PAD_H / 2 + R) {
        bx = cx - R;
        const rel = (by - cy) / (PAD_H / 2);
        speed = Math.min(speed * 1.06, w * 1.6);
        const a = rel * 0.75;
        vx = -Math.cos(a) * speed;
        vy = Math.sin(a) * speed;
      }
      if (bx < -R * 2) {
        cpu += 1;
        report();
        if (cpu >= TO_WIN) over = true;
        else serve(false);
        report();
      } else if (bx > w + R * 2) {
        me += 1;
        report();
        if (me >= TO_WIN) over = true;
        else serve(true);
        report();
      }
    };

    const draw = () => {
      const g = ctx.canvas.getContext("2d");
      if (!g) return;
      const col = ctx.colors();
      g.fillStyle = col.paper;
      g.fillRect(0, 0, w, h);
      g.strokeStyle = col.grid;
      g.lineWidth = 2;
      g.setLineDash([6, 8]);
      g.beginPath();
      g.moveTo(w / 2, 0);
      g.lineTo(w / 2, h);
      g.stroke();
      g.setLineDash([]);
      g.fillStyle = col.muted;
      g.font = `700 ${Math.round(h / 6)}px "IBM Plex Mono", ui-monospace, monospace`;
      g.textAlign = "center";
      g.textBaseline = "top";
      g.globalAlpha = 0.5;
      g.fillText(String(me), w / 2 - w / 8, 10);
      g.fillText(String(cpu), w / 2 + w / 8, 10);
      g.globalAlpha = 1;
      g.fillStyle = col.accent;
      g.fillRect(12, py - PAD_H / 2, PAD_W, PAD_H);
      g.fillStyle = col.ink;
      g.fillRect(w - 12 - PAD_W, cy - PAD_H / 2, PAD_W, PAD_H);
      if (!over) {
        g.fillStyle = col.accent;
        g.beginPath();
        g.arc(bx, by, R, 0, Math.PI * 2);
        g.fill();
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
        py = h / 2;
        cy = h / 2;
        me = 0;
        cpu = 0;
        over = false;
        paused = false;
        dir = 0;
        last = 0;
        serve(Math.random() < 0.5);
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
        if (k === "ArrowUp" || k === "w" || k === "W") {
          dir = down ? -1 : dir === -1 ? 0 : dir;
          return true;
        }
        if (k === "ArrowDown" || k === "s" || k === "S") {
          dir = down ? 1 : dir === 1 ? 0 : dir;
          return true;
        }
        return false;
      },
      press(action, down) {
        if (action === "up") dir = down ? -1 : dir === -1 ? 0 : dir;
        if (action === "down") dir = down ? 1 : dir === 1 ? 0 : dir;
      },
      pointer(p) {
        if (p.type === "up") return;
        py = Math.max(PAD_H / 2, Math.min(h - PAD_H / 2, p.y));
      }
    };
  }
};
