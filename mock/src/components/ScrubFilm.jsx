import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMotionOff } from "./motion.jsx";

const BASE = import.meta.env.BASE_URL;

// The hero: El Paso from the Franklins at dusk, played by the scroll until
// the city lights come up. The house engine: one rAF loop, eased seeks, a
// dense-keyframe encode, no scroll listener and no React state per frame.
export function ScrubFilm({ tonight }) {
  const off = useMotionOff();
  const ref = useRef(null);
  const vid = useRef(null);
  const [tall] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-aspect-ratio: 3/4)").matches);
  const src = tall ? `${BASE}film/elpaso-dusk-tall-640.mp4` : `${BASE}film/elpaso-dusk-1280.mp4`;
  const poster = tall ? `${BASE}film/elpaso-dusk-poster-tall.webp` : `${BASE}film/elpaso-dusk-poster.webp`;

  useEffect(() => {
    const section = ref.current, v = vid.current;
    if (!section || !v || off) return;
    let raf = 0, current = 0, ready = false, primed = false;
    const onReady = () => { ready = true; };
    if (v.readyState >= 1) onReady(); else v.addEventListener("loadedmetadata", onReady, { once: true });
    // Safari loads nothing until the film has been asked to play once.
    const prime = () => { if (primed) return; primed = true; v.play().then(() => v.pause()).catch(() => {}); };
    window.addEventListener("pointerdown", prime, { once: true, passive: true });
    window.addEventListener("touchstart", prime, { once: true, passive: true });
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      section.style.setProperty("--p", p.toFixed(4));
      if (!ready || !v.duration || v.seeking) return;
      const target = p * Math.max(0, v.duration - 0.05);
      current += (target - current) * 0.14;
      if (Math.abs(current - v.currentTime) > 1 / 48) v.currentTime = current;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointerdown", prime); window.removeEventListener("touchstart", prime); };
  }, [off]);

  return (
    <section ref={ref} className={`film${off ? " film--still" : ""}`} aria-label="El Paso at dusk" style={{ "--p": 0 }}>
      <div className="film__stage">
        {off ? (
          <img className="film__media" src={poster} alt="El Paso from the Franklin Mountains at dusk, the city lights coming on." />
        ) : (
          <video ref={vid} className="film__media" src={src} poster={poster} muted playsInline preload="auto" aria-hidden="true" />
        )}
        <div className="film__wash" />
        <div className="film__copy wrap measure" style={{ opacity: "clamp(0, calc((0.5 - var(--p)) * 5), 1)" }}>
          <span className="film__name">Gracias Por Invitar · El Paso and Juárez</span>
          <h1 className="h-hero film__title">Everything happening, <em>before</em> it happens.</h1>
          <p className="film__lede">One calendar for the city, by date, every listing confirmed with the organizer.</p>
          <div>
            <Link to="/events/" className="btn btn-film">Open the calendar</Link>
          </div>
        </div>
        <aside className="film__hud" style={{ opacity: "clamp(0, calc((var(--p) - 0.55) * 6), 1)" }} aria-hidden="true">
          <span><span className="dot" />Tonight</span>
          <b>{tonight ? tonight.title : "Sunset strings at San Jacinto Plaza"}</b>
          <span>{tonight ? `${tonight.venue} · Confirmed with the organizer` : "Confirmed with the organizer"}</span>
        </aside>
        <span className="film__caption">El Paso from the Franklins. Footage by Nerrix Digital.</span>
      </div>
    </section>
  );
}
