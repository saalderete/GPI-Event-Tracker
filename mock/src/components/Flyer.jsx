import { Link } from "react-router-dom";
import { dayLabel, fmtTime } from "../lib/dates.js";
import FLYERS from "../data/flyers.json";

const BASE = import.meta.env.BASE_URL;

// The event tile: a flyer, because that is what El Paso already reads. The
// category sets the hue, the type does the rest. Sample events carry a
// generated picture (public/flyers, listed in data/flyers.json), tinted
// toward the category; an event without one, like the form's preview, keeps
// the plain flyer.
export function Flyer({ event: e, link = true, className = "", today }) {
  const Tag = link ? Link : "div";
  const props = link ? { to: `/events/${e.slug}/`, "aria-label": `${e.title}, ${dayLabel(e.date, today)} at ${fmtTime(e.start)}` } : {};
  const photo = FLYERS.includes(e.slug);
  return (
    <div className={`flyer-wrap ${className}`}>
      <Tag className={`flyer${photo ? " flyer--photo" : ""}${e.status === "canceled" ? " flyer--canceled" : ""}`} style={{ "--hue": e.cat.hue }} {...props}>
        {photo ? (
          <>
            <img className="flyer__img" src={`${BASE}flyers/${e.slug}.webp`} srcSet={`${BASE}flyers/${e.slug}-s.webp 384w, ${BASE}flyers/${e.slug}.webp 768w`} sizes="(min-width: 1100px) 24vw, 46vw" width="768" height="1024" alt="" loading="lazy" decoding="async" />
            <span className="flyer__tint" aria-hidden="true" />
          </>
        ) : null}
        <div className="flyer__in">
          <div className="flyer__top">
            <span className="flyer__cat">{e.cat.name}</span>
            {e.price === 0 ? <span className="flyer__free">Free</span> : null}
          </div>
          <div>
            <div className="flyer__title">{e.title}</div>
            <div className="flyer__when">
              <b>{dayLabel(e.date, today)} · {fmtTime(e.start)}</b>
              <span>{e.venue}</span>
            </div>
          </div>
        </div>
        {e.status === "canceled" ? <span className="flyer__strike">Canceled</span> : null}
      </Tag>
    </div>
  );
}
