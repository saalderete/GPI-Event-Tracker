import { useEffect, useRef, useState } from "react";
import { Rise } from "./motion.jsx";
import { useMotionOff } from "./motion.jsx";

const BASE = import.meta.env.BASE_URL;

// What a listing looks like: the team's device photos, re-dressed for GPI
// (the backdrop and the screens are ours; the hands and devices are the
// photos'), one at a time over the palette's accent, each fading into the
// next. The chips pick a slide and say what its screen shows; the show also
// moves on its own unless motion is paused or reduced.
const SLIDES = [
  { id: "tonight", chip: "Tonight", caption: "Everything on tonight, by time, in your hand.", src: "duo", pos: "right" },
  { id: "saved", chip: "Saved", caption: "Your plan, by day, one share for the group chat.", src: "tablet-left", pos: "right" },
  { id: "event", chip: "An event", caption: "Who it is for, what it costs, and whether it is still on.", src: "tablet-right", pos: "right" },
  { id: "week", chip: "The week", caption: "The whole week in one calendar, every listing with its picture and its date.", src: "tablet-two", pos: "right" }
];
const EVERY = 6500;

export function Showcase() {
  const [i, setI] = useState(0);
  const still = useMotionOff();
  const timer = useRef(0);
  const arm = () => { window.clearInterval(timer.current); if (!still) timer.current = window.setInterval(() => setI((n) => (n + 1) % SLIDES.length), EVERY); };
  useEffect(() => { arm(); return () => window.clearInterval(timer.current); }, [still]); // eslint-disable-line react-hooks/exhaustive-deps
  const pick = (n) => { setI(n); arm(); };
  return (
    <section id="app" className={`show${still ? " is-still" : ""}`} aria-labelledby="app-title">
      <div className="show__mark" aria-hidden="true"><span>Gracias</span><span>Por Invitar</span></div>
      <div className="show__corner show__corner--l" aria-hidden="true">Event calendar</div>
      <div className="show__corner show__corner--r" aria-hidden="true">Web app</div>
      <div className="show__slides">
        {SLIDES.map((s, n) => (
          <img key={s.id} className={`show__slide${n === i ? " is-on" : ""}`} data-pos={s.pos} src={`${BASE}devices/${s.src}.webp`} width="1080" height="1350" alt="" decoding="async" />
        ))}
      </div>
      <div className="show__copy wrap">
        <Rise><h2 id="app-title" className="h-head">What a listing <em>looks like</em>.</h2></Rise>
        <Rise delay={0.08}><p className="lede mt-4" aria-live="polite">{SLIDES[i].caption}</p></Rise>
        <Rise delay={0.14}>
          <div className="chips mt-7" role="group" aria-label="Show the app with">
            {SLIDES.map((s, n) => (
              <button key={s.id} type="button" className="chip" aria-pressed={n === i} onClick={() => pick(n)}>{s.chip}</button>
            ))}
          </div>
        </Rise>
      </div>
    </section>
  );
}
