import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Flyer } from "./Flyer.jsx";
import { useMotionOff } from "./motion.jsx";

// LOW SUN's lookbook conveyor (nerrixdigital.com/lab/low-sun), by way of
// Inside Benji's: the section holds while the scroll carries one frame per
// step sideways. Each frame is a picture, its number on a rule, and a panel of
// facts counted from the site's own lists, with a link to its page. On phones
// and with reduced motion the frames are a row you swipe, a card at a time.
export function Conveyor({ title, frames, today }) {
  const off = useMotionOff();
  const ref = useRef(null);
  const [stack, setStack] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches);
  const [label, setLabel] = useState(frames[0]?.label || "");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const on = () => setStack(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const section = ref.current;
    if (!section || off || stack) return;
    const track = section.querySelector(".look__track");
    const slides = [...section.querySelectorAll(".look__slide")];
    let raf = 0, step = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const run = section.offsetHeight - vh;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      const shift = (slides.length - 1) * (slides[0]?.offsetWidth || 0);
      track.style.transform = `translate3d(${(-p * shift).toFixed(1)}px,0,0)`;
      section.style.setProperty("--look", (0.2 + p * 0.8).toFixed(4));
      const k = Math.min(slides.length - 1, Math.round(p * (slides.length - 1)));
      if (k !== step) { step = k; setLabel(frames[k].label); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [off, stack, frames]);

  return (
    <section ref={ref} id="inside" data-rail="Inside" className={`look${off || stack ? " look--stack" : ""}`} style={{ "--n": frames.length }} aria-labelledby="look-h">
      <div className="look__stage">
        <div className="look__ui">
          <h2 id="look-h" className="look__h">{title}</h2>
          <span className="look__label" aria-hidden="true">{label}</span>
        </div>
        <div className="look__track">
          {frames.map((f, i) => (
            <article key={f.key} className="look__slide" data-label={f.label}>
              <Link className="look__pic" to={f.href} tabIndex={-1} aria-hidden="true">
                {f.event ? <Flyer event={f.event} link={false} today={today} /> : null}
              </Link>
              <div className="look__index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
              <div className="look__panel">
                <div className="look__head"><h3 className="look__t">{f.title}</h3><span className="look__meta">{f.meta}</span></div>
                <p className="look__cap">{f.caption}</p>
                <dl className="look__spec">
                  {f.spec.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}
                </dl>
                {f.detail ? <div className="look__detail"><Flyer event={f.detail} link={false} today={today} /></div> : null}
                <Link className="look__go" to={f.href}>{f.cta} <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="look__meter" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
