import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon, Monitor, Pause, Play } from "@phosphor-icons/react";
import { MotionCtx } from "./motion.jsx";
import { PaletteSwitch } from "./PaletteSwitch.jsx";

export function TopBar({ savedCount, mode, setMode, palette, setPalette }) {
  const { paused, toggle } = useContext(MotionCtx);
  const next = { system: "light", light: "dark", dark: "system" }[mode] || "system";
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  return (
    <header className="bar">
      <a className="skip" href="#main">Skip to the page</a>
      <div className="bar__in wrap measure">
        <Link to="/" className="wordmark"><span className="full">Gracias Por Invitar</span><small>G.P.I</small></Link>
        <nav className="bar__nav" aria-label="Pages">
          <NavLink to="/events/" end>Calendar</NavLink>
          <NavLink to="/events/weekend/"><span className="full">This weekend</span><span className="short">Weekend</span></NavLink>
          <NavLink to="/organizers/" className="hide-sm">For organizers</NavLink>
          <NavLink to="/saved/">Saved{savedCount ? <> <span className="badge" aria-label={`${savedCount} saved`}>{savedCount}</span></> : null}</NavLink>
          <NavLink to="/interests/" className="hide-sm">Interests</NavLink>
        </nav>
        <div className="bar__tools">
          <button type="button" className="icon-btn hide-sm" onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play motion" : "Pause motion"} title={paused ? "Play motion" : "Pause motion"}>
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <PaletteSwitch palette={palette} setPalette={setPalette} />
          <button type="button" className="icon-btn" onClick={() => setMode(next)} aria-label={`Theme: ${mode}. Switch to ${next}`} title={`Theme: ${mode}`}>
            <Icon size={18} />
          </button>
          <Link to="/post/" className="btn btn-sm"><span className="full">Post an event</span><span className="short">Post</span></Link>
        </div>
      </div>
    </header>
  );
}
