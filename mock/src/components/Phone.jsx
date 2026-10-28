import { useState } from "react";
import { Index } from "./Index.jsx";
import { Flyer } from "./Flyer.jsx";
import { StatusLine } from "./StatusLine.jsx";
import { Rise, Open } from "./motion.jsx";
import { fmtTime, longDay } from "../lib/dates.js";

// The app seen in the page: a phone showing the real components, swapped by
// chips (Mirada's "Seen through the lens"). No screenshots, the actual UI.
export function SeenInApp({ events, today, saved }) {
  const [view, setView] = useState("tonight");
  const tonight = events.filter((e) => e.date === today);
  const savedList = events.filter((e) => saved.includes(e.slug));
  const changed = events.filter((e) => e.status !== "confirmed");
  const one = events.find((e) => e.status === "changed") || events[0];
  const views = [
    ["tonight", "Tonight", "Everything on tonight, by time."],
    ["saved", "Saved", "Your plan, by day, one share for the group chat."],
    ["event", "An event", "Who it is for, what it costs, and whether it is still on."],
    ["changes", "Changes", "What moved or was called off, dated."]
  ];
  const caption = views.find((v) => v[0] === view)[2];
  return (
    <section id="app" className="section" aria-labelledby="app-title">
      <div className="wrap measure grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <Rise><h2 id="app-title" className="h-head">What a listing <em>looks like</em>.</h2></Rise>
          <Rise delay={0.08}><p className="lede mt-5" aria-live="polite">{caption}</p></Rise>
          <Rise delay={0.14}>
            <div className="chips mt-8" role="group" aria-label="Show the app with">
              {views.map(([id, name]) => (
                <button key={id} type="button" className="chip" aria-pressed={view === id} onClick={() => setView(id)}>{name}</button>
              ))}
            </div>
          </Rise>
        </div>
        <Open className="order-1 lg:order-2 justify-self-center">
          <div className="phone">
            <div className="phone__screen">
              <div className="phone__bar"><span className="display text-ink" style={{ fontSize: "0.8rem" }}>G.P.I</span><span>{views.find((v) => v[0] === view)[1]}</span></div>
              <div className="phone__body">
                {view === "tonight" ? <Index events={tonight.slice(0, 4)} today={today} numbered={false} compact /> : null}
                {view === "saved" ? (savedList.length ? <Index events={savedList.slice(0, 4)} today={today} numbered={false} compact /> : <p className="text-sm text-muted pt-6">Nothing saved yet. Tap the heart on an event and it lands here.</p>) : null}
                {view === "event" ? (
                  <div className="grid gap-3 pt-2">
                    <Flyer event={one} link={false} today={today} />
                    <div className="display" style={{ fontSize: "1.1rem", lineHeight: 1.1 }}>{one.title}</div>
                    <div className="text-xs text-muted">{longDay(one.date)} · {fmtTime(one.start)} · {one.venue}</div>
                    <StatusLine event={one} long />
                    {one.change ? <p className="text-xs">{one.change.text}</p> : null}
                    <p className="text-xs"><b>Who it is for.</b> {one.whoFor}</p>
                  </div>
                ) : null}
                {view === "changes" ? <Index events={changed.slice(0, 4)} today={today} numbered={false} compact /> : null}
              </div>
            </div>
          </div>
        </Open>
      </div>
    </section>
  );
}
