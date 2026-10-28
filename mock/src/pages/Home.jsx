import { Link } from "react-router-dom";
import { ScrubFilm } from "../components/ScrubFilm.jsx";
import { Conveyor } from "../components/Conveyor.jsx";
import { Index } from "../components/Index.jsx";
import { Rail } from "../components/Rail.jsx";
import { Rise, Stagger, item, motion } from "../components/motion.jsx";
import { CATEGORIES } from "../data/events.js";
import { addDays, dayLabel, longDay } from "../lib/dates.js";

const CHAPTERS = [
  { id: "week", label: "This week" },
  { id: "inside", label: "Inside the calendar" },
  { id: "calendar", label: "The next eight" },
  { id: "doors", label: "Where next" }
];

// One line per category, describing what the sample calendar holds.
const NOTES = {
  music: "Plaza concerts, a record fair, a porch show and the hangar's late sets.",
  markets: "Night markets in the Union Plaza warehouse and the Saturday mercado in Segundo Barrio.",
  cars: "Cars and coffee on the garage roof, lowriders on the Chamizal lawn, a sunrise cruise over the mountain.",
  food: "Taco nights, food truck round ups, a bakery tour and one long table under the pecans.",
  family: "A film in the park, a kids' hike, a mural day and trunk or treat.",
  sports: "A sunrise run, a night ride, lucha libre and the match on a plaza screen.",
  arts: "Art walks and gallery nights, downtown and in Kern Place.",
  nightlife: "An open mic, a cumbia night and the sonidero until the lights come up."
};

export function Home({ events, today }) {
  const live = events.filter((e) => e.status !== "canceled");
  const tonight = live.filter((e) => e.date === today && e.start >= "17:00");
  const week = events.filter((e) => e.date >= today && e.date <= addDays(today, 6));
  const figures = [
    [week.length, "events", `${longDay(today)} to ${longDay(addDays(today, 6))}`],
    [week.filter((e) => e.price === 0).length, "free", "Free to attend, listed as free"],
    [new Set(week.map((e) => e.organizer.name)).size, "organizers", "Each confirmed by name"],
    [week.filter((e) => e.status !== "confirmed").length, "changes", "Moved or called off, and dated"]
  ];
  const next = live.filter((e) => e.date >= today).slice(0, 8);
  const frames = CATEGORIES.map((c, i) => {
    const list = live.filter((e) => e.category === c.id && e.date >= today);
    const areas = [...new Set(list.map((e) => e.area))].slice(0, 3).join(", ");
    return {
      key: c.id, label: `${String(i + 1).padStart(2, "0")} · ${c.name}`, title: c.name, meta: `${list.length} coming up`, caption: NOTES[c.id],
      spec: [["Next", list[0] ? `${list[0].title}, ${dayLabel(list[0].date, today)}` : "Nothing yet"], ["Free", `${list.filter((e) => e.price === 0).length} of ${list.length}`], ["Where", areas || "El Paso"], ["Organizers", String(new Set(list.map((e) => e.organizer.name)).size)]],
      event: list[0], detail: list[1], href: `/events/${c.id}/`, cta: `See all ${c.name.toLowerCase()}`
    };
  }).filter((f) => f.event);

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

      <Conveyor title="Inside the calendar" frames={frames} today={today} />

      <section id="calendar" data-rail="The next eight" className="section" aria-labelledby="calendar-title">
        <div className="wrap measure">
          <Rise><h2 id="calendar-title" className="h-head">Every event <em>gets a page</em>.</h2></Rise>
          <Rise delay={0.08}><p className="lede mt-5">By date, with who it is for, what it costs, where to park, and whether it is still on. The next eight:</p></Rise>
          <div className="mt-10">
            <Index events={next} today={today} />
          </div>
          <Rise><div className="mt-10"><Link to="/events/" className="btn">Open the calendar</Link></div></Rise>
        </div>
      </section>

      <section id="doors" data-rail="Where next" className="section pt-0" aria-labelledby="doors-title">
        <div className="wrap measure">
          <Rise><h2 id="doors-title" className="h-head">Where <em>next</em>.</h2></Rise>
          <Stagger className="mt-10">
            {[["/events/weekend/", "This weekend", "Friday to Sunday, one card at a time"], ["/events/tonight/", "Tonight", `${tonight.length} on after 5 PM`], ["/organizers/", "For organizers", "Post it once, and it stays yours"]].map(([to, t, d]) => (
              <motion.div key={to} variants={item}>
                <Link to={to} className="door"><b>{t}</b><span>{d} <i aria-hidden="true">→</i></span></Link>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
