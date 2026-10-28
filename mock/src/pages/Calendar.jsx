import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MagnifyingGlass, ListBullets, SquaresFour } from "@phosphor-icons/react";
import { Index } from "../components/Index.jsx";
import { Flyer } from "../components/Flyer.jsx";
import { FocusedRail } from "../components/FocusedRail.jsx";
import { Rise } from "../components/motion.jsx";
import { CATEGORIES, categoryById, filterEvents, forYou } from "../data/events.js";
import { addDays, weekendKeys, weekday, dayNumber, dayLabel, longDay } from "../lib/dates.js";

// The list pages, as Fever has them: one page per date ("/events/weekend/")
// and one per category ("/events/music/"), each with a title and a URL of its
// own, sharing one layout. A category is the page; the date narrows it.
export const WHEN = [["all", "Everything"], ["tonight", "Tonight"], ["tomorrow", "Tomorrow"], ["weekend", "This weekend"], ["week", "Next 7 days"]];
export const WHEN_IDS = WHEN.map(([id]) => id).filter((id) => id !== "all");
const WHEN_TITLE = { tonight: "Tonight", tomorrow: "Tomorrow", weekend: "This weekend", week: "The next seven days" };

export function Calendar({ events, today, interests, preset = {} }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const cat = preset.cat ? categoryById(preset.cat) : null;
  const when = preset.when || params.get("when") || "all";
  const free = params.get("free") === "1";
  const q = params.get("q") || "";
  const view = params.get("view") || "list";
  const foryou = params.get("sort") !== "time" && interests.length > 0;

  const keep = () => { const p = new URLSearchParams(); for (const k of ["free", "q", "view", "sort"]) if (params.get(k)) p.set(k, params.get(k)); return p; };
  const set = (k, v) => { const p = new URLSearchParams(params); if (v === null || v === "" || v === false) p.delete(k); else p.set(k, String(v)); setParams(p, { replace: true }); };
  const goWhen = (id) => {
    const p = keep();
    if (cat) { if (id !== "all") p.set("when", id); navigate(`/events/${cat.id}/${p.toString() ? `?${p}` : ""}`); return; }
    navigate(`/events/${id === "all" ? "" : `${id}/`}${p.toString() ? `?${p}` : ""}`);
  };
  const goCat = (id) => {
    const p = keep();
    if (when !== "all" && !when.startsWith("day:")) p.set("when", when);
    navigate(id ? `/events/${id}/${p.toString() ? `?${p}` : ""}` : `/events/${p.toString() ? `?${p}` : ""}`);
  };
  const pickDay = (d) => { if (cat) set("when", when === `day:${d}` ? null : `day:${d}`); else navigate(when === `day:${d}` ? "/events/" : `/events/?when=day:${d}`); };

  const days = useMemo(() => {
    if (when === "tonight") return [today];
    if (when === "tomorrow") return [addDays(today, 1)];
    if (when === "weekend") return weekendKeys(today);
    if (when === "week") return Array.from({ length: 7 }, (_, i) => addDays(today, i));
    if (when.startsWith("day:")) return [when.slice(4)];
    return null;
  }, [when, today]);

  let results = filterEvents(events.filter((e) => e.date >= today), { days, categories: cat ? [cat.id] : [], free, query: q });
  if (when === "tonight") results = results.filter((e) => e.start >= "16:00");
  if (foryou && !cat) results = forYou(results, interests);
  const strip = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const hasOn = (d) => events.some((e) => e.date === d && (!cat || e.category === cat.id));
  const whenLabel = when.startsWith("day:") ? longDay(when.slice(4)) : WHEN_TITLE[when];
  const title = cat ? cat.name : whenLabel || "Everything happening";
  const sub = cat && whenLabel ? whenLabel : null;
  const weekendEvents = when === "weekend" && !cat ? [...results.filter((e) => e.status !== "canceled")].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 7) : [];
  const anyFilter = cat || free || q || when !== "all";

  return (
    <div className="pb-24">
      {weekendEvents.length > 1 ? (
        <FocusedRail events={weekendEvents} today={today} label={{ small: `${weekendEvents.length} on this weekend`, big: "Friday to Sunday, in one row." }} />
      ) : null}
      <div className="wrap measure pt-10">
        <Rise><h1 className="h-head">{title} in <em>El Paso</em>.</h1>{sub ? <p className="lede mt-3">{sub}.</p> : null}</Rise>
        <Rise delay={0.06}>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="search block">
              <span className="sr-only">Search the calendar</span>
              <MagnifyingGlass size={18} />
              <input className="field" type="search" placeholder="What do you want to do?" value={q} onChange={(e) => set("q", e.target.value)} />
            </label>
            <div className="flex items-center gap-2">
              {interests.length && !cat ? (
                <label className="toggle mr-2">
                  <input type="checkbox" checked={foryou} onChange={(e) => set("sort", e.target.checked ? null : "time")} />
                  <span className="track" />For you first
                </label>
              ) : null}
              <button type="button" className="icon-btn" aria-pressed={view === "list"} aria-label="List" onClick={() => set("view", null)}><ListBullets size={18} /></button>
              <button type="button" className="icon-btn" aria-pressed={view === "grid"} aria-label="Grid" onClick={() => set("view", "grid")}><SquaresFour size={18} /></button>
            </div>
          </div>
        </Rise>

        <Rise delay={0.1}>
          <div className="chips mt-6" role="group" aria-label="When">
            {WHEN.map(([id, name]) => (
              <button key={id} type="button" className="chip" aria-pressed={when === id} onClick={() => goWhen(id)}>{name}</button>
            ))}
          </div>
          <div className="days mt-3" role="group" aria-label="Pick a day">
            {strip.map((d) => (
              <button key={d} type="button" className="day" aria-pressed={when === `day:${d}`} aria-label={dayLabel(d, today)} onClick={() => pickDay(d)}>
                <small>{weekday(d)}</small><b>{dayNumber(d)}</b><i aria-hidden="true" style={hasOn(d) ? undefined : { background: "transparent" }} />
              </button>
            ))}
          </div>
          <div className="chips mt-3" role="group" aria-label="What">
            <button type="button" className="chip" aria-pressed={free} onClick={() => set("free", free ? null : "1")}>Free</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed={cat?.id === c.id} onClick={() => goCat(cat?.id === c.id ? null : c.id)}>{c.name}</button>
            ))}
            {anyFilter ? <button type="button" className="chip" onClick={() => navigate("/events/")}>Clear</button> : null}
          </div>
        </Rise>

        <p className="mt-8 text-sm text-muted" aria-live="polite">{results.length} {results.length === 1 ? "event" : "events"}{foryou && !cat ? ", your interests first" : ""}.</p>

        {results.length === 0 ? (
          <div className="empty">
            <h2 className="display text-2xl">Nothing on with those filters.</h2>
            <p className="text-ink-soft">Try another day, or clear the filters. If you run an event that should be here, post it.</p>
            <div className="flex gap-3"><button type="button" className="btn btn-ghost" onClick={() => navigate("/events/")}>Clear the filters</button></div>
          </div>
        ) : view === "grid" ? (
          <div className="focus-grid mt-6">
            {results.map((e) => (
              <figure key={e.slug} className="piece">
                <Flyer event={e} today={today} />
                <figcaption><span>{e.title}</span><small>{e.venue}, {e.area}</small></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <Index events={results} today={today} />
        )}
        <p className="sample-note mt-12">Sample data for the Team 9 mock. Organizer pages are shown by name only.</p>
      </div>
    </div>
  );
}
