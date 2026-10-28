import { Link } from "react-router-dom";
import { ScrubFilm } from "../components/ScrubFilm.jsx";
import { FocusedRail } from "../components/FocusedRail.jsx";
import { Index } from "../components/Index.jsx";
import { Steps } from "../components/Steps.jsx";
import { SeenInApp } from "../components/Phone.jsx";
import { Rail } from "../components/Rail.jsx";
import { Rise, Stagger, item, motion } from "../components/motion.jsx";
import { addDays, weekendKeys, longDay } from "../lib/dates.js";

const CHAPTERS = [
  { id: "week", label: "This week" },
  { id: "weekend", label: "This weekend" },
  { id: "calendar", label: "The calendar" },
  { id: "current", label: "Stays current" },
  { id: "app", label: "In the app" },
  { id: "organizers", label: "For organizers" }
];

export function Home({ events, today, saved }) {
  const live = events.filter((e) => e.status !== "canceled");
  const tonight = live.filter((e) => e.date === today && e.start >= "17:00");
  const weekend = weekendKeys(today);
  const weekendEvents = [...live.filter((e) => weekend.includes(e.date))].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 7);
  const week = events.filter((e) => e.date >= today && e.date <= addDays(today, 6));
  const figures = [
    [week.length, "events", `${longDay(today)} to ${longDay(addDays(today, 6))}`],
    [week.filter((e) => e.price === 0).length, "free", "Free to attend, listed as free"],
    [new Set(week.map((e) => e.organizer.name)).size, "organizers", "Each confirmed by name"],
    [week.filter((e) => e.status !== "confirmed").length, "changes", "Moved or called off, and dated"]
  ];
  const next = live.filter((e) => e.date >= today).slice(0, 8);

  return (
    <div className="with-rail">
      <Rail chapters={CHAPTERS} />
      <ScrubFilm tonight={tonight[0]} />

      <section id="week" data-rail="This week" className="section" aria-labelledby="week-title">
        <div className="wrap measure">
          <Rise><h2 id="week-title" className="h-head">This week, <em>counted</em>.</h2></Rise>
          <Stagger className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {figures.map(([n, unit, note]) => (
              <motion.div key={unit} variants={item}>
                <div className="figure">{n}</div>
                <div className="display mt-2 text-xl">{unit}</div>
                <p className="mt-1 text-sm text-muted">{note}</p>
              </motion.div>
            ))}
          </Stagger>
          <Rise delay={0.1}><p className="sample-note mt-10">Counted from the calendar as it stands today. Every event on this mock is sample data.</p></Rise>
        </div>
      </section>

      <div id="weekend" data-rail="This weekend">
        <FocusedRail events={weekendEvents} today={today} label={{ small: `${weekendEvents.length} on this weekend`, big: "Friday to Sunday, in one row." }} />
      </div>

      <section id="calendar" data-rail="The calendar" className="section" aria-labelledby="calendar-title">
        <div className="wrap measure">
          <Rise><h2 id="calendar-title" className="h-head">Every event <em>gets a page</em>.</h2></Rise>
          <Rise delay={0.08}><p className="lede mt-5">By date, with who it is for, what it costs, where to park, and whether it is still on. The next eight:</p></Rise>
          <div className="mt-10">
            <Index events={next} today={today} />
          </div>
          <Rise><div className="mt-10"><Link to="/events/" className="btn">Open the calendar</Link></div></Rise>
        </div>
      </section>

      <Steps />

      <SeenInApp events={events} today={today} saved={saved} />

      <section id="organizers" data-rail="For organizers" className="section" aria-labelledby="org-title" data-theme="light" style={{ background: "var(--paper)", color: "var(--ink)" }}>
        <div className="wrap measure grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Rise><h2 id="org-title" className="h-head">Post it once. <em>It stays yours.</em></h2></Rise>
            <Rise delay={0.08}><p className="lede mt-5">Your page is the source. GPI lists what you post, links back to you, and shows the date it was last confirmed. Change the place or call it off, and the listing says so the same hour.</p></Rise>
            <Rise delay={0.14}><div className="mt-8 flex flex-wrap gap-3"><Link to="/post/" className="btn">Post an event</Link><a href="#current" className="btn btn-ghost">How it stays current</a></div></Rise>
          </div>
          <Rise delay={0.1}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
              {[["Who it is for", "Ages, who should come, who should not"], ["What it costs", "Free is a real answer"], ["Where, exactly", "Address, entrance, parking"], ["Your page", "The link people check anyway"], ["Still on", "Confirmed, changed or canceled, dated"], ["One listing", "Edited by you, not reposted by others"]].map(([t, d]) => (
                <div key={t}><dt className="display text-lg">{t}</dt><dd className="mt-1 text-muted">{d}</dd></div>
              ))}
            </dl>
          </Rise>
        </div>
      </section>
    </div>
  );
}
