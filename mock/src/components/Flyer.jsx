import { Link } from "react-router-dom";
import { dayLabel, fmtTime } from "../lib/dates.js";

// The event tile: a flyer, because that is what El Paso already reads. The
// category sets the hue, the type does the rest. No photo is pretended.
export function Flyer({ event: e, link = true, className = "", today }) {
  const Tag = link ? Link : "div";
  const props = link ? { to: `/events/${e.slug}/`, "aria-label": `${e.title}, ${dayLabel(e.date, today)} at ${fmtTime(e.start)}` } : {};
  return (
    <div className={`flyer-wrap ${className}`}>
      <Tag className={`flyer${e.status === "canceled" ? " flyer--canceled" : ""}`} style={{ "--hue": e.cat.hue }} {...props}>
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
