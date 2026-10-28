import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Flyer } from "./Flyer.jsx";
import { useMotionOff } from "./motion.jsx";

// KAGE's focused rail (nerrix-digital components/kage/focused-rail), in React:
// one card spotlit, the rest small in a filmstrip, the scroll slides the next
// into the light. Same maths, direct style writes, one rAF while on screen.
export function FocusedRail({ events, today, line = ["this ", "weekend"], label }) {
  const off = useMotionOff();
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || off) return;
    const cards = [...section.querySelectorAll(".frail-card")];
    const type = section.querySelector(".frail-type");
    const lab = section.querySelector(".frail-label");
    const pill = section.querySelector(".frail-pill");
    const N = cards.length;
    const intro = 0.2;
    let raf = 0, last = 0, blur = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      const r = section.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      if (r.bottom < -600 || r.top > vh + 600) return;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      if (type) {
        type.style.transform = `translate3d(${vw * 0.6 - (p / intro) * vw * 2.2}px,-50%,0)`;
        const v = Math.abs(p - last) * 60;
        blur += (Math.min(10, v * 140) - blur) * 0.18;
        type.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      }
      if (lab) lab.style.opacity = String(Math.min(1, Math.max(0, (p - intro + 0.05) / 0.06)));
      last = p;
      const idx = Math.min(1, Math.max(0, (p - intro) / (0.95 - intro))) * (N - 1);
      const featH = Math.min(vh * 0.64, vw * 1.1);
      const smallH = vh * 0.26;
      const featW = featH * 0.75, smallW = smallH * 0.75;
      const gap = Math.max(20, vw * 0.02);
      const minS = smallH / featH;
      cards.forEach((el, i) => {
        const d = i - idx;
        const ad = Math.min(1, Math.abs(d));
        const w = 0.5 + 0.5 * Math.cos(ad * Math.PI);
        const s = minS + (1 - minS) * w;
        const x = d * (smallW + gap) + Math.sign(d) * ((featW - smallW) / 2) * ad;
        el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), -50%) scale(${s.toFixed(4)})`;
        el.style.filter = `brightness(${(0.55 + 0.45 * w).toFixed(3)})`;
        el.style.zIndex = String(30 - Math.round(Math.abs(d) * 6));
        el.style.setProperty("--feat", w.toFixed(3));
      });
      if (pill) pill.style.opacity = idx > N - 1.6 ? "0" : "1";
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [off, events.length]);

  return (
    <section ref={ref} className={`frail${off ? " frail--still" : ""}`} style={{ "--frail-cards": events.length }} aria-label="This weekend">
      <div className="frail-stage">
        <div className="frail-type" aria-hidden="true">{line[0]}<em>{line[1]}</em></div>
        <div className="frail-label">
          <small>{label.small}</small>
          <p>{label.big}</p>
        </div>
        {events.map((e) => (
          <div key={e.slug} className="frail-card">
            <Flyer event={e} today={today} />
          </div>
        ))}
        <div className="frail-pill" aria-hidden="true">Keep scrolling</div>
      </div>
    </section>
  );
}
