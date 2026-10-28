import { Link } from "react-router-dom";
import { Check } from "@phosphor-icons/react";
import { Rise, Stagger, item, motion } from "../components/motion.jsx";
import { CATEGORIES } from "../data/events.js";

const BASE = import.meta.env.BASE_URL;

export function Interests({ interests, toggleInterest, subs, toggleSub }) {
  const picked = CATEGORIES.filter((c) => interests.includes(c.id));
  return (
    <div className="wrap measure pb-24 pt-10">
      <Rise><h1 className="h-head">What are you <em>into</em>?</h1></Rise>
      <Rise delay={0.06}><p className="lede mt-5">Pick what you care about and the calendar leads with it, day by day. Subscribe to a category and it is sent to you weekly, with every change to what you saved.</p></Rise>
      <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((c) => {
          const on = interests.includes(c.id);
          return (
            <motion.button key={c.id} variants={item} type="button" aria-pressed={on} onClick={() => toggleInterest(c.id)} className="flyer flyer--photo text-left" style={{ "--hue": c.hue, aspectRatio: "4 / 3", boxShadow: on ? "inset 0 0 0 3px var(--accent)" : undefined }}>
              <img className="flyer__img" src={`${BASE}interests/${c.id}.webp`} srcSet={`${BASE}interests/${c.id}-s.webp 384w, ${BASE}interests/${c.id}.webp 768w`} sizes="(min-width: 640px) 24vw, 46vw" width="768" height="576" alt="" loading="lazy" decoding="async" />
              <span className="flyer__tint" aria-hidden="true" />
              <span className="flyer__in">
                <span className="flyer__top"><span className="flyer__cat">{on ? "Picked" : "Pick"}</span>{on ? <span className="flyer__free" aria-hidden="true"><Check size={12} weight="bold" /></span> : null}</span>
                <span className="flyer__title" style={{ fontSize: "clamp(1.3rem, 9cqi, 2.2rem)" }}>{c.name}</span>
              </span>
            </motion.button>
          );
        })}
      </Stagger>
      <section className="mt-14" aria-labelledby="subs">
        <Rise><h2 id="subs" className="display text-2xl">{picked.length ? `Your calendar now leads with ${picked.map((c) => c.name.toLowerCase()).join(", ")}.` : "Nothing picked yet, so the calendar runs by time."}</h2></Rise>
        {picked.length ? (
          <div className="mt-6 grid gap-3">
            {picked.map((c) => (
              <label key={c.id} className="toggle">
                <input type="checkbox" checked={subs.includes(c.id)} onChange={() => toggleSub(c.id)} />
                <span className="track" />Send me {c.name.toLowerCase()} weekly
              </label>
            ))}
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/events/" className="btn">Open the calendar</Link></div>
        <p className="sample-note mt-6">Subscriptions are a mock: nothing is sent. Your picks stay in this browser.</p>
      </section>
    </div>
  );
}
