import { useState } from "react";
import { Link } from "react-router-dom";
import { Flyer } from "../components/Flyer.jsx";
import { Rise } from "../components/motion.jsx";
import { CATEGORIES, categoryById } from "../data/events.js";
import { todayKey, addDays } from "../lib/dates.js";

const EMPTY = { title: "", category: "music", date: "", start: "19:00", end: "", venue: "", address: "", whoFor: "", free: true, price: "", know: "", organizer: "", handle: "", status: "confirmed" };

// The organizer form: the six fields the field week showed are missing from
// the competitors' listings are required here, and the flyer builds itself as
// you type. Submitting goes to a review step, as the charter's story 8 asks.
export function Post() {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const today = todayKey();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const preview = {
    slug: "preview", title: f.title || "Your event's name", category: f.category, cat: categoryById(f.category), date: f.date || addDays(today, 3), start: f.start || "19:00",
    venue: f.venue || "The venue", price: f.free ? 0 : Number(f.price) || 0, status: f.status === "canceled" ? "canceled" : "confirmed"
  };
  const submit = (ev) => {
    ev.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = "Give the event its name.";
    if (!f.date) er.date = "Pick the date.";
    if (!f.venue.trim()) er.venue = "Say where it is.";
    if (!f.address.trim()) er.address = "An address, so people can find the door.";
    if (!f.whoFor.trim()) er.whoFor = "Say who it is for. Ages, who should come.";
    if (!f.free && !(Number(f.price) > 0)) er.price = "A price, or mark it free.";
    if (!f.organizer.trim()) er.organizer = "Your name or your group's.";
    if (!f.handle.trim()) er.handle = "The page people already check: an Instagram handle or a site.";
    setErrors(er);
    if (!Object.keys(er).length) { setSent(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  if (sent) {
    return (
      <div className="wrap measure pb-24 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div>
            <Rise><h1 className="h-head">Sent <em>for review</em>.</h1></Rise>
            <Rise delay={0.06}><p className="lede mt-5">GPI checks {f.handle.startsWith("@") ? f.handle : `@${f.handle}`} against what you posted and lists {f.title} within a day, marked confirmed with the date. If anything changes, edit it here and the listing says so the same hour.</p></Rise>
            <Rise delay={0.1}><div className="mt-8 flex flex-wrap gap-3"><Link to="/events/" className="btn">Back to the calendar</Link><button type="button" className="btn btn-ghost" onClick={() => { setF(EMPTY); setSent(false); }}>Post another</button></div></Rise>
            <p className="sample-note mt-6">A mock: nothing was sent anywhere.</p>
          </div>
          <Rise delay={0.08}><Flyer event={preview} link={false} today={today} /></Rise>
        </div>
      </div>
    );
  }

  const Field = ({ id, label, help, children }) => (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {errors[id] ? <p className="field-error" role="alert">{errors[id]}</p> : help ? <p className="field-help">{help}</p> : null}
    </div>
  );

  return (
    <div className="wrap measure pb-24 pt-10">
      <Rise><h1 className="h-head">Post an <em>event</em>.</h1></Rise>
      <Rise delay={0.06}><p className="lede mt-5">Six things every listing needs, because they are the six things people leave a listing to find. Your page stays the source.</p></Rise>
      <form className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-start" onSubmit={submit} noValidate>
        <div className="grid gap-6">
          <Field id="title" label="Event name"><input id="title" className="field" value={f.title} onChange={set("title")} autoComplete="off" /></Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="category" label="Category">
              <select id="category" className="field" value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </Field>
            <Field id="date" label="Date"><input id="date" className="field" type="date" value={f.date} min={today} onChange={set("date")} /></Field>
            <Field id="start" label="Starts"><input id="start" className="field" type="time" value={f.start} onChange={set("start")} /></Field>
            <Field id="end" label="Ends" help="Optional."><input id="end" className="field" type="time" value={f.end} onChange={set("end")} /></Field>
          </div>
          <Field id="venue" label="Venue"><input id="venue" className="field" value={f.venue} onChange={set("venue")} /></Field>
          <Field id="address" label="Address, and the entrance" help="Where to park goes in Know before you go."><input id="address" className="field" value={f.address} onChange={set("address")} /></Field>
          <Field id="whoFor" label="Who it is for" help="Ages, who should come, who should not. The thing people leave a listing to find out."><input id="whoFor" className="field" value={f.whoFor} onChange={set("whoFor")} /></Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <span className="field-label">What it costs</span>
              <label className="toggle mt-2"><input type="checkbox" checked={f.free} onChange={set("free")} /><span className="track" />Free</label>
            </div>
            {!f.free ? <Field id="price" label="Price in dollars"><input id="price" className="field" type="number" min="1" inputMode="numeric" value={f.price} onChange={set("price")} /></Field> : null}
          </div>
          <Field id="know" label="Know before you go" help="Parking, what to bring, rain plan. One per line."><textarea id="know" className="field" value={f.know} onChange={set("know")} /></Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="organizer" label="Organizer"><input id="organizer" className="field" value={f.organizer} onChange={set("organizer")} /></Field>
            <Field id="handle" label="Your page" help="Instagram handle or a site. The listing links it."><input id="handle" className="field" value={f.handle} onChange={set("handle")} placeholder="@yourpage" /></Field>
          </div>
          <Field id="status" label="Status">
            <select id="status" className="field" value={f.status} onChange={set("status")}><option value="confirmed">On</option><option value="canceled">Canceled</option></select>
          </Field>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" className="btn">Send for review</button>
            <span className="text-sm text-muted">Listed within a day, confirmed against your page.</span>
          </div>
        </div>
        <aside className="pin" aria-label="Preview">
          <p className="field-label">The flyer, as people will see it</p>
          <Flyer event={preview} link={false} today={today} />
        </aside>
      </form>
    </div>
  );
}
