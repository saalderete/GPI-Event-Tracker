import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Flyer } from "./Flyer.jsx";
import { StatusLine } from "./StatusLine.jsx";
import { dayLabel, longDay, fmtTime, weekday } from "../lib/dates.js";
import { groupByDay, shortPrice } from "../data/events.js";

// The calendar as an index: numbered lines by day, the flyer following the
// pointer on a desk (4D Resin's index page, which is a calendar list already).
export function Index({ events, today, numbered = true, compact = false }) {
  const [peek, setPeek] = useState(null);
  const peekRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = peekRef.current;
    if (!el) return;
    let raf = 0;
    const move = (ev) => {
      pos.current = { x: ev.clientX + 120, y: ev.clientY };
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.left = `${pos.current.x}px`; el.style.top = `${pos.current.y}px`; });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  let n = 0;
  const groups = groupByDay(events);
  return (
    <div className="index" onPointerLeave={() => setPeek(null)}>
      {groups.map(([day, list]) => (
        <section key={day} aria-labelledby={`day-${day}`}>
          {!compact ? (
            <div className="index__day">
              <h2 id={`day-${day}`}>{dayLabel(day, today) === "Today" || dayLabel(day, today) === "Tomorrow" ? dayLabel(day, today) : weekday(day)}</h2>
              <span>{longDay(day)}</span>
            </div>
          ) : null}
          {list.map((e) => {
            n += 1;
            return (
              <Link key={e.slug} to={`/events/${e.slug}/`} className={`row${e.status === "canceled" ? " row--canceled" : ""}`} onPointerEnter={() => setPeek(e)} onFocus={() => setPeek(e)}>
                {numbered ? <span className="display text-muted text-sm">{String(n).padStart(2, "0")}</span> : <Flyer event={e} link={false} className="row__thumb" today={today} />}
                <span>
                  <span className="row__name">{e.title}</span>
                  <span className="row__meta">
                    <span>{e.venue}, {e.area}</span>
                    <span>{e.cat.name}</span>
                    <StatusLine event={e} />
                  </span>
                </span>
                <span className="row__side">
                  <span className="row__time">{fmtTime(e.start)}</span>
                  <span className="row__price">{shortPrice(e)}</span>
                </span>
              </Link>
            );
          })}
        </section>
      ))}
      <div ref={peekRef} className={`peek${peek ? " is-on" : ""}`} aria-hidden="true">
        {peek ? <Flyer event={peek} link={false} today={today} /> : null}
      </div>
    </div>
  );
}
