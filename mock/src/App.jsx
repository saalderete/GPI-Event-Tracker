import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { TopBar } from "./components/TopBar.jsx";
import { ReadLine } from "./components/ReadLine.jsx";
import { useLoader } from "./lib/loader.js";
import { Footer } from "./components/Footer.jsx";
import { MotionCtx } from "./components/motion.jsx";
import { Home } from "./pages/Home.jsx";
import { Calendar, WHEN_IDS } from "./pages/Calendar.jsx";
import { Organizers } from "./pages/Organizers.jsx";
import { useParams } from "react-router-dom";
import { Event } from "./pages/Event.jsx";
import { Saved } from "./pages/Saved.jsx";
import { Interests } from "./pages/Interests.jsx";
import { Post } from "./pages/Post.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { eventsFor, categoryById } from "./data/events.js";
import { todayKey } from "./lib/dates.js";
import { useInterests, useMotionPref, usePalette, useSaved, useThemeMode } from "./lib/store.js";

export default function App() {
  const location = useLocation();
  const home = location.pathname === "/" || location.pathname === "";
  const [mode, setMode] = useThemeMode();
  const [palette, setPalette] = usePalette();
  const motionPref = useMotionPref();
  const today = todayKey();
  const events = useMemo(() => eventsFor(today), [today]);
  const { saved, toggle: toggleSaved, clear } = useSaved();
  const { interests, subs, toggleInterest, toggleSub } = useInterests();
  useLoader();

  // The theme: the landing opens at night when the mode is system; every
  // other page follows the system, or the visitor's choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && (home || mq.matches));
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.documentElement.dataset.palette = palette;
      const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
      if (paper) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", paper);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode, home, palette]);

  useEffect(() => {
    if (location.hash) { document.getElementById(location.hash.slice(1))?.scrollIntoView(); return; }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <MotionCtx.Provider value={{ paused: motionPref.paused, toggle: motionPref.toggle }}>
      <ReadLine />
      <TopBar savedCount={saved.length} mode={mode} setMode={setMode} palette={palette} setPalette={setPalette} />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home events={events} today={today} saved={saved} />} />
          <Route path="/events" element={<Calendar events={events} today={today} interests={interests} />} />
          <Route path="/events/:slug" element={<EventsSlug events={events} today={today} saved={saved} toggleSaved={toggleSaved} interests={interests} />} />
          <Route path="/organizers" element={<Organizers events={events} today={today} saved={saved} />} />
          <Route path="/saved" element={<Saved events={events} today={today} saved={saved} clear={clear} />} />
          <Route path="/interests" element={<Interests interests={interests} toggleInterest={toggleInterest} subs={subs} toggleSub={toggleSub} />} />
          <Route path="/post" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </MotionCtx.Provider>
  );
}

// /events/<slug>/ is a date page (tonight, weekend...), a category page
// (music, markets...) or one event, decided by the slug, as Fever's city
// pages do with "/when/this-weekend" and "/music-events".
function EventsSlug({ events, today, saved, toggleSaved, interests }) {
  const { slug } = useParams();
  if (WHEN_IDS.includes(slug)) return <Calendar events={events} today={today} interests={interests} preset={{ when: slug }} />;
  if (categoryById(slug)) return <Calendar events={events} today={today} interests={interests} preset={{ cat: slug }} />;
  return <Event events={events} today={today} saved={saved} toggleSaved={toggleSaved} />;
}
