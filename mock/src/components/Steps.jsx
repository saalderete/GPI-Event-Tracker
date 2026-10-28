import { useEffect, useRef, useState } from "react";
import { useMotionOff } from "./motion.jsx";

// How a listing stays current, as pinned steps the scroll walks through
// (4D Resin's stage-captioned film, without the film). Four states of one
// listing: posted, confirmed, listed, changed.
const STEPS = [
  { t: "The organizer posts it.", d: "Name, date, place, who it is for, what it costs, and the organizer's own page. Nothing goes up without all six." },
  { t: "GPI confirms it.", d: "Someone checks the organizer's page and marks the listing confirmed, with the date they did." },
  { t: "It is listed by date.", d: "Tonight, tomorrow, this weekend. Nothing is buried under a newer post, and Free is a filter, not a surprise." },
  { t: "When it changes, the listing says so.", d: "A new place or a cancellation shows as a dated line on the event, and the people who saved it see it first." }
];

export function Steps() {
  const off = useMotionOff();
  const ref = useRef(null);
  const [on, setOn] = useState(0);
  useEffect(() => {
    const section = ref.current;
    if (!section || off) return;
    let raf = 0, last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      const i = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      if (i !== last) { last = i; setOn(i); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [off]);
  return (
    <section ref={ref} id="current" data-rail="Stays current" className={`steps${off ? " steps--still" : ""}`} aria-labelledby="current-title">
      <div className="steps__stage wrap measure">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 id="current-title" className="h-head">How a listing <em>stays</em> current.</h2>
            <p className="lede mt-5">The field week found the failure is not hearing too late. It is a listing that says too little, or stays wrong after a change.</p>
          </div>
          <ol className="steps__list">
            {STEPS.map((s, i) => (
              <li key={s.t} className="step" data-on={off ? "true" : String(i <= on)}>
                <span className="step__num">{i + 1}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
