import { Link, useParams } from "react-router-dom";
import { Heart, ShareNetwork, CalendarPlus, MapPin, ArrowRight } from "@phosphor-icons/react";
import { Flyer } from "../components/Flyer.jsx";
import { StatusLine } from "../components/StatusLine.jsx";
import { Rise, Open } from "../components/motion.jsx";
import { Toast, useToast } from "../components/Toast.jsx";
import { findEvent, priceLabel } from "../data/events.js";
import { longDay, timeRange, shortDay, addDays } from "../lib/dates.js";
import { downloadIcs, eventText, share } from "../lib/share.js";
import { NotFound } from "./NotFound.jsx";

export function Event({ events, today, saved, toggleSaved }) {
  const { slug } = useParams();
  const e = findEvent(events, slug);
  const [toast, show] = useToast();
  if (!e) return <NotFound />;
  const isSaved = saved.includes(e.slug);
  const canceled = e.status === "canceled";
  const similar = events.filter((x) => x.slug !== e.slug && x.status !== "canceled" && x.date >= today && x.date <= addDays(today, 7) && (x.category === e.category || x.area === e.area)).slice(0, 3);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.venue}, ${e.address}, El Paso`)}`;

  const onShare = async () => {
    const r = await share(e.title, eventText(e), location.href);
    show(r === "copied" ? "Copied for the group chat" : r === "shared" ? "Sent" : r === "dismissed" ? "" : "Could not share from here");
  };

  return (
    <article className="wrap measure pb-24 pt-10">
      <p className="text-sm"><Link to="/events/" className="text-muted hover:text-ink">Calendar</Link> <span className="text-muted">/</span> {e.cat.name}</p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div>
          <div className="grid gap-8 sm:grid-cols-[16rem_1fr] sm:items-end">
            <Open><Flyer event={e} link={false} today={today} /></Open>
            <div>
              <Rise><h1 className="h-head">{e.title}</h1></Rise>
              <Rise delay={0.06}><p className="lede mt-4">{e.blurb}</p></Rise>
              <Rise delay={0.1}><p className="mt-4 text-sm text-muted">{e.cat.name} · {e.area}</p></Rise>
            </div>
          </div>

          {e.change ? (
            <Rise>
              <aside className="mt-10 border-l-2 border-accent pl-5" aria-label="What changed">
                <p className="font-semibold text-accent-ink dark:text-accent">{canceled ? "Canceled" : "Changed"} {shortDay(e.changedOn)}</p>
                <p className="mt-1">{e.change.text}</p>
              </aside>
            </Rise>
          ) : null}

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <Rise><section><h2 className="display text-2xl">Who it is for</h2><p className="mt-3 text-ink-soft">{e.whoFor}</p></section></Rise>
            <Rise delay={0.05}><section><h2 className="display text-2xl">What it costs</h2><p className="mt-3 text-ink-soft">{priceLabel(e)}{e.price !== 0 && !e.priceNote ? " per person" : ""}</p></section></Rise>
            <Rise delay={0.1}>
              <section>
                <h2 className="display text-2xl">Know before you go</h2>
                <ul className="mt-3 grid gap-2 text-ink-soft">{e.know.map((k) => <li key={k} className="flex gap-2"><ArrowRight size={16} className="mt-1 flex-none text-accent" />{k}</li>)}</ul>
              </section>
            </Rise>
            <Rise delay={0.15}>
              <section>
                <h2 className="display text-2xl">Where</h2>
                <p className="mt-3">{e.venue}</p>
                <p className="text-ink-soft">{e.address}, {e.area}</p>
                <a className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4" href={maps} target="_blank" rel="noreferrer"><MapPin size={16} />Open in Maps</a>
              </section>
            </Rise>
          </div>

          <Rise>
            <section className="mt-12 border-t border-line pt-8">
              <h2 className="display text-2xl">The organizer</h2>
              <p className="mt-3">{e.organizer.name} <span className="text-muted">@{e.organizer.handle}</span></p>
              <p className="mt-1 text-sm text-ink-soft">Confirmed with the organizer on {longDay(e.confirmedOn)}. The listing links their page; GPI is the index, they are the source.</p>
              <p className="sample-note mt-2">Sample data: the organizer is fictional, so the page is shown by name only.</p>
            </section>
          </Rise>

          {similar.length ? (
            <section className="mt-16" aria-labelledby="similar">
              <Rise><h2 id="similar" className="display text-2xl">Similar this week</h2></Rise>
              <div className="focus-grid mt-6">
                {similar.map((s) => (
                  <figure key={s.slug} className="piece">
                    <Flyer event={s} today={today} />
                    <figcaption><span>{s.title}</span><small>{longDay(s.date)}</small></figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="pin self-start" aria-label="When, and what to do">
          <Rise>
            <div className="border border-line bg-surface p-6" style={{ borderRadius: "var(--radius)" }}>
              <StatusLine event={e} long />
              <p className="display mt-4 text-3xl">{longDay(e.date)}</p>
              <p className="mt-1 text-ink-soft">{timeRange(e.start, e.end)}</p>
              <p className="mt-3 text-sm">{e.venue}</p>
              <p className="display mt-4 text-2xl">{priceLabel(e)}</p>
              <div className="mt-6 grid gap-2">
                <button type="button" className={`btn ${isSaved ? "btn-ink" : ""}`} onClick={() => toggleSaved(e.slug)} disabled={canceled} aria-pressed={isSaved}>
                  <Heart size={18} weight={isSaved ? "fill" : "regular"} />{isSaved ? "Saved" : "Save"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onShare}><ShareNetwork size={18} />Send to the group chat</button>
                <button type="button" className="btn btn-ghost" onClick={() => downloadIcs(e)} disabled={canceled}><CalendarPlus size={18} />Add to calendar</button>
              </div>
              {canceled ? <p className="mt-4 text-sm text-muted">Canceled, so there is nothing to save or add. The listing stays so nobody turns up.</p> : null}
            </div>
          </Rise>
        </aside>
      </div>
      <Toast text={toast} />
    </article>
  );
}
