import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlass, ListBullets, SquaresFour } from "@phosphor-icons/react";
import { Index } from "../components/Index.jsx";
import { Flyer } from "../components/Flyer.jsx";
import { Rise } from "../components/motion.jsx";
import { CATEGORIES, filterEvents, forYou } from "../data/events.js";
import { addDays, weekendKeys, weekday, dayNumber, dayLabel, longDay } from "../lib/dates.js";

const WHEN = [["all", "Everything"], ["tonight", "Tonight"], ["tomorrow", "Tomorrow"], ["weekend", "This weekend"], ["week", "Next 7 days"]];

export function Calendar({ events, today, interests }) {
  const [params, setParams] = useSearchParams();
  const when = params.get("when") || "all";
  const cats = (params.get("cat") || "").split(",").filter(Boolean);
  const free = params.get("free") === "1";
  const q = params.get("q") || "";
  const view = params.get("view") || "list";
  const foryou = params.get("sort") !== "time" && interests.length > 0;

  const set = (k, v) => {
    const p = new URLSearchParams(params);
    if (v === null || v === "" || v === false) p.delete(k); else p.set(k, String(v));
    setParams(p, { replace: true });
  };
  const toggleCat = (id) => set("cat", (cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id]).join(","));

  const days = useMemo(() => {
    if (when === "tonight") return [today];
    if (when === "tomorrow") return [addDays(today, 1)];
    if (when === "weekend") return weekendKeys(today);
    if (when === "week") return Array.from({ length: 7 }, (_, i) => addDays(today, i));
    if (when.startsWith("day:")) return [when.slice(4)];
    return null;
  }, [when, today]);

  let results = filterEvents(events.filter((e) => e.date >= today), { days, categories: cats, free, query: q });
  if (when === "tonight") results = results.filter((e) => e.start >= "16:00");
  if (foryou) results = forYou(results, interests);
  const strip = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const hasOn = (d) => events.some((e) => e.date === d);
  const title = when === "tonight" ? "Tonight" : when === "tomorrow" ? "Tomorrow" : when === "weekend" ? "This weekend" : when === "week" ? "The next seven days" : when.startsWith("day:") ? longDay(when.slice(4)) : "Everything happening";

  return (
    <div className="wrap measure pb-24 pt-10">
      <Rise><h1 className="h-head">{title} in <em>El Paso</em>.</h1></Rise>
      <Rise delay={0.06}>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="search block">
            <span className="sr-only">Search the calendar</span>
            <MagnifyingGlass size={18} />
            <input className="field" type="search" placeholder="What do you want to do?" value={q} onChange={(e) => set("q", e.target.value)} />
          </label>
          <div className="flex items-center gap-2">
            {interests.length ? (
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
            <button key={id} type="button" className="chip" aria-pressed={when === id} onClick={() => set("when", id === "all" ? null : id)}>{name}</button>
          ))}
        </div>
        <div className="days mt-3" role="group" aria-label="Pick a day">
          {strip.map((d) => (
            <button key={d} type="button" className="day" aria-pressed={when === `day:${d}`} aria-label={dayLabel(d, today)} onClick={() => set("when", when === `day:${d}` ? null : `day:${d}`)}>
              <small>{weekday(d)}</small><b>{dayNumber(d)}</b>{hasOn(d) ? <i aria-hidden="true" /> : <i style={{ background: "transparent" }} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <div className="chips mt-3" role="group" aria-label="What">
          <button type="button" className="chip" aria-pressed={free} onClick={() => set("free", free ? null : "1")}>Free</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={cats.includes(c.id)} onClick={() => toggleCat(c.id)}>{c.name}</button>
          ))}
          {(cats.length || free || q || when !== "all") ? <button type="button" className="chip" onClick={() => setParams({}, { replace: true })}>Clear</button> : null}
        </div>
      </Rise>

      <p className="mt-8 text-sm text-muted" aria-live="polite">{results.length} {results.length === 1 ? "event" : "events"}{foryou ? ", your interests first" : ""}.</p>

      {results.length === 0 ? (
        <div className="empty">
          <h2 className="display text-2xl">Nothing on for that day with those filters.</h2>
          <p className="text-ink-soft">Try another day, or clear the filters. If you run an event that should be here, post it.</p>
          <div className="flex gap-3"><button type="button" className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>Clear the filters</button></div>
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
  );
}
