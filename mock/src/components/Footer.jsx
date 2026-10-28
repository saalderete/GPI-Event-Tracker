import { Link } from "react-router-dom";
import { Open, Rise } from "./motion.jsx";

const BASE = import.meta.env.BASE_URL;

// The close: the city at night, the ask, then the colophon on frosted paper
// over the foot of the scene (Mirada's footer, in the portal's palette).
export function Footer() {
  return (
    <footer aria-labelledby="foot-title">
      <div className="foot__scene">
        <img className="foot__photo" src={`${BASE}film/elpaso-night-2048.webp`} srcSet={`${BASE}film/elpaso-night-1024.webp 1024w, ${BASE}film/elpaso-night-2048.webp 2048w`} sizes="100vw" width="2048" height="1152" loading="lazy" decoding="async" alt="El Paso at night from the Franklin Mountains, the freeway lit in a long line." />
        <div className="foot__wash" />
        <div className="foot__copy wrap measure">
          <Rise><h2 id="foot-title" className="h-head" style={{ color: "var(--film-ink)" }}>Nobody told you? <em>Now they did.</em></h2></Rise>
          <Rise delay={0.08}><p className="lede" style={{ color: "rgba(246,239,232,0.82)" }}>Everything happening in El Paso and Juárez, by date, confirmed with the organizer, and free to read.</p></Rise>
          <Rise delay={0.14}><div className="flex flex-wrap gap-3"><Link to="/events/" className="btn btn-film">Open the calendar</Link><Link to="/post/" className="btn btn-ghost" style={{ color: "var(--film-ink)", borderColor: "rgba(246,239,232,0.4)" }}>Post an event</Link></div></Rise>
        </div>
      </div>
      <div className="wrap measure">
        <Open className="foot__panel">
          <div className="foot__grid">
            <div>
              <Link to="/" className="wordmark">Gracias Por Invitar</Link>
              <p className="mt-3 text-sm text-ink-soft">"Thanks for the invite" is what you say when the photos show up and nobody told you. The name is the problem; the calendar is the answer.</p>
            </div>
            <nav aria-label="The calendar">
              <h3 className="foot__head">The calendar</h3>
              <Link className="foot__link" to="/events/?when=tonight">Tonight</Link>
              <Link className="foot__link" to="/events/?when=weekend">This weekend</Link>
              <Link className="foot__link" to="/events/?free=1">Free</Link>
              <Link className="foot__link" to="/interests/">Your interests</Link>
            </nav>
            <nav aria-label="For organizers">
              <h3 className="foot__head">For organizers</h3>
              <Link className="foot__link" to="/post/">Post an event</Link>
              <a className="foot__link" href="/mock/#current">How it stays current</a>
            </nav>
            <nav aria-label="About">
              <h3 className="foot__head">About</h3>
              <a className="foot__link" href="https://gpi-portal.onrender.com/">The project portal</a>
              <a className="foot__link" href="https://gpi-portal.onrender.com/sprint-3/competitor-field-study/">The field study</a>
            </nav>
          </div>
          <div className="foot__legal">
            <span>© 2026 Team 9, Gracias Por Invitar. A mock for CS 4390/5388 at UTEP. Every event here is sample data.</span>
            <span>Footage: Nerrix Digital, El Paso time-lapse.</span>
          </div>
        </Open>
      </div>
    </footer>
  );
}
