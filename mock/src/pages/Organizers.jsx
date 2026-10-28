import { Link } from "react-router-dom";
import { Showcase } from "../components/Showcase.jsx";
import { Rise } from "../components/motion.jsx";

// For organizers: the pitch, the six fields, what the listing looks like, and
// the door to the form. Fever keeps this on a separate business site; GPI
// keeps it one page away, because the organizers are the city's own people.
export function Organizers({ events, today, saved }) {
  return (
    <div className="pb-8 pt-10">
      <div className="wrap measure">
        <Rise><h1 className="h-head">Post it once. <em>It stays yours.</em></h1></Rise>
        <Rise delay={0.06}><p className="lede mt-5">Your page is the source. GPI lists what you post, links back to you, and shows the date it was last confirmed. Change the place or call it off, and the listing says so the same hour.</p></Rise>
        <Rise delay={0.12}><div className="mt-8"><Link to="/post/" className="btn">Post an event</Link></div></Rise>
      </div>
      <div className="wrap measure section">
        <Rise><h2 className="h-head">Six things <em>every listing</em> needs.</h2></Rise>
        <Rise delay={0.06}><p className="lede mt-5">They are the six things people leave a listing to find, which the field week heard four times out of four.</p></Rise>
        <Rise delay={0.1}>
          <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {[["Who it is for", "Ages, who should come, who should not. The workshop that did not say so lost its reader to another page."], ["What it costs", "Free is a real answer, and a filter people use."], ["Where, exactly", "Address, entrance, parking. The twenty minutes people spend checking are the listing's job."], ["Your page", "The link people check anyway. The listing points at it instead of pretending to replace it."], ["Still on", "Confirmed, changed or canceled, dated. The flyer that outlived its correction sent two friends to the wrong lot."], ["One listing", "Edited by you, not reposted by others, so the correction travels with the event."]].map(([t, d]) => (
              <div key={t}><dt className="display text-2xl">{t}</dt><dd className="mt-2 text-ink-soft">{d}</dd></div>
            ))}
          </dl>
        </Rise>
      </div>
      <Showcase />
      <div className="wrap measure pb-16">
        <Rise><div className="flex flex-wrap items-center gap-4"><Link to="/post/" className="btn">Post an event</Link><span className="text-sm text-muted">Listed within a day, confirmed against your page.</span></div></Rise>
      </div>
    </div>
  );
}
