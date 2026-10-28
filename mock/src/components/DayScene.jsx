import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMotionOff } from "./motion.jsx";
import { clipProgress, skyAt } from "../lib/sky.js";
import { filmSrc } from "../lib/film.js";
import { fmtTime, dayLabel, longDay, TZ } from "../lib/dates.js";

const BASE = import.meta.env.BASE_URL;
const START = 6 * 60, END = 26 * 60; // the day's track, 6 AM to 2 AM

// DAYLIGHT's day as the interface (nerrixdigital.com/book): move across the
// timeline and El Paso moves with it, the time-lapse scrubbed to the minute,
// the clock following. Here the day's events sit on the track at their
// hours; point at one and the city shows that hour. The clip opens on a
// still of the same frame, the drawn sky stands in if the footage fails.
const toMinutes = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
const nowMinute = () => { const p = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date()); const h = +p.find((x) => x.type === "hour").value, m = +p.find((x) => x.type === "minute").value; return h * 60 + m < START ? h * 60 + m + 1440 : h * 60 + m; };
const label = (m) => fmtTime(`${String(Math.floor((m % 1440) / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);

export function DayScene({ events, day, today }) {
  const off = useMotionOff();
  const navigate = useNavigate();
  const stage = useRef(null), vid = useRef(null), sky = useRef(null), clock = useRef(null), line = useRef(null);
  const [shown, setShown] = useState(false);
  const [broken, setBroken] = useState(false);
  const marks = useMemo(() => events.map((e) => ({ ...e, minute: toMinutes(e.start) < START ? toMinutes(e.start) + 1440 : toMinutes(e.start) })).filter((e) => e.minute >= START && e.minute <= END), [events]);
  const home = useMemo(() => (day === today ? Math.min(END, nowMinute()) : marks[0]?.minute ?? 18 * 60), [day, today, marks]);
  const target = useRef(home), current = useRef(home), hover = useRef(null);
  const still = `${BASE}film/elpaso-day-still-${Math.round(clipProgress(home) * 5)}.webp`;

  const paint = (m) => {
    if (clock.current) clock.current.textContent = label(Math.round(m));
    if (line.current) line.current.style.left = `${((m - START) / (END - START)) * 100}%`;
    const s = skyAt(m);
    if (sky.current) sky.current.style.background = `linear-gradient(180deg, ${s.top} 0%, ${s.mid} 55%, ${s.horizon} 100%)`;
    const v = vid.current;
    if (v && !off && Number.isFinite(v.duration) && v.duration) {
      const t = Math.min(v.duration - 0.15, clipProgress(m) * v.duration);
      if (!v.seeking && Math.abs(v.currentTime - t) > 1 / 24) v.currentTime = t;
    }
  };

  useEffect(() => {
    target.current = home; current.current = home; paint(home);
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = target.current - current.current;
      if (Math.abs(d) < 0.5) return;
      current.current += d * 0.12;
      paint(current.current);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [home]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = vid.current;
    if (!v || off) return;
    const onSeeked = () => setShown(true);
    const onReady = () => paint(current.current);
    const onError = () => setBroken(true);
    v.addEventListener("seeked", onSeeked); v.addEventListener("loadedmetadata", onReady); v.addEventListener("error", onError);
    return () => { v.removeEventListener("seeked", onSeeked); v.removeEventListener("loadedmetadata", onReady); v.removeEventListener("error", onError); };
  }, [off]); // eslint-disable-line react-hooks/exhaustive-deps

  const minuteAt = (ev) => {
    const r = stage.current.getBoundingClientRect();
    return START + Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)) * (END - START);
  };
  const onMove = (ev) => { hover.current = minuteAt(ev); target.current = hover.current; };
  const onLeave = () => { hover.current = null; target.current = home; };
  const hours = Array.from({ length: (END - START) / 60 + 1 }, (_, i) => START + i * 60);

  return (
    <section className="scene" aria-label={`${longDay(day)}, the day on the timeline`}>
      <div ref={sky} className="scene__sky" aria-hidden="true" />
      {!broken ? <img className="scene__still" src={still} alt="" aria-hidden="true" decoding="async" /> : null}
      {!off && !broken ? <video ref={vid} className={`scene__film${shown ? " is-on" : ""}`} src={filmSrc(BASE, "elpaso-day-1280")} muted playsInline preload="auto" aria-hidden="true" /> : null}
      <div className="scene__wash" aria-hidden="true" />
      <div className="scene__in wrap measure">
        <p className="scene__day">{dayLabel(day, today)} <span>{longDay(day)}, as the day goes. Move along the hours.</span></p>
        <p ref={clock} className="scene__clock" aria-live="off">{label(home)}</p>
        <div ref={stage} className="scene__track" onPointerMove={onMove} onPointerLeave={onLeave} onPointerCancel={onLeave}>
          <div ref={line} className="scene__line" aria-hidden="true" />
          <div className="scene__hours" aria-hidden="true">
            {hours.map((m) => <span key={m} style={{ left: `${((m - START) / (END - START)) * 100}%` }}>{m % 180 === 0 ? label(m) : ""}</span>)}
          </div>
          <ul className="scene__marks" aria-label="The day's events, by hour">
            {marks.map((e, i) => (
              <li key={e.slug} style={{ left: `${((e.minute - START) / (END - START)) * 100}%`, "--hue": e.cat.hue, "--row": i % 3 }}>
                <button type="button" onPointerEnter={() => { target.current = e.minute; }} onFocus={() => { target.current = e.minute; paint(e.minute); }} onBlur={onLeave} onClick={() => navigate(`/events/${e.slug}/`)} aria-label={`${e.title}, ${fmtTime(e.start)}`}>
                  <i aria-hidden="true" /><span>{e.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <span className="scene__credit">El Paso from the Franklins, sunrise to night. Footage by Nerrix Digital.</span>
    </section>
  );
}
