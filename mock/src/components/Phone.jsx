import { useLayoutEffect, useRef, useState } from "react";
import { Index } from "./Index.jsx";
import { Flyer } from "./Flyer.jsx";
import { StatusLine } from "./StatusLine.jsx";
import { Rise } from "./motion.jsx";
import { fmtTime, longDay } from "../lib/dates.js";
import { DUO } from "../data/duo.js";

// The screen's own size in CSS pixels, before the perspective: a 19.5:9
// display, 300 wide on a desk and down to 220 where the photo renders small,
// so the type stays readable. The content is laid out flat at this size, then
// one matrix puts it onto the front phone of the photo, so the dates stay live
// and the chips still swap the view.
const RATIO = 650 / 300;
function flatWidth(quadWidth) { return Math.round(Math.min(300, Math.max(220, quadWidth / 0.8))); }

// The plane-to-plane map from four point pairs (direct linear transform),
// returned as the CSS matrix3d that sends the flat screen onto the photographed one.
function homography(src, dst) {
  const A = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  const h = A.map((row, i) => row[8] / row[i]);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
}

// The team's iPhone duo, cut from its backdrop, with the live screen mapped
// onto the front phone. Refits on resize only; nothing runs per frame.
export function Duo({ children }) {
  const box = useRef(null), screen = useRef(null);
  useLayoutEffect(() => {
    const el = box.current, sc = screen.current;
    if (!el || !sc) return;
    const fit = () => {
      const k = el.clientWidth / DUO.width;
      const q = DUO.screen.map(([x, y]) => [x * k, y * k]);
      const sw = flatWidth(Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1])), sh = Math.round(sw * RATIO);
      sc.style.width = `${sw}px`; sc.style.height = `${sh}px`;
      sc.style.transform = homography([[0, 0], [sw, 0], [sw, sh], [0, sh]], q);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="duo" ref={box} style={{ aspectRatio: `${DUO.width} / ${DUO.height}` }}>
      <img className="duo__img" src={`${import.meta.env.BASE_URL}${DUO.src}`} width={DUO.width} height={DUO.height} alt="" decoding="async" />
      <div className="duo__screen" ref={screen} style={{ width: 300, height: 650 }}>{children}</div>
    </div>
  );
}

// The app seen in the page: the phone shows the real components, swapped by
// chips (Mirada's "Seen through the lens"). No screenshots, the actual UI.
export function SeenInApp({ events, today, saved }) {
  const [view, setView] = useState("tonight");
  const upcoming = events.filter((e) => e.date >= today && e.status !== "canceled");
  const savedList = events.filter((e) => saved.includes(e.slug));
  const changed = events.filter((e) => e.status !== "confirmed");
  const one = events.find((e) => e.status === "changed") || events[0];
  const views = [
    ["tonight", "Tonight", "Everything on tonight, by time, and the days after it."],
    ["saved", "Saved", "Your plan, by day, one share for the group chat."],
    ["event", "An event", "Who it is for, what it costs, and whether it is still on."],
    ["changes", "Changes", "What moved or was called off, dated."]
  ];
  const caption = views.find((v) => v[0] === view)[2];
  return (
    <section id="app" className="section" aria-labelledby="app-title">
      <div className="wrap measure grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center">
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
        <Rise className="order-1 lg:order-2">
          <Duo>
            <div className="phone__screen">
              <div className="phone__bar"><span className="display text-ink" style={{ fontSize: "0.8rem" }}>G.P.I</span><span>{views.find((v) => v[0] === view)[1]}</span></div>
              <div className="phone__body">
                {view === "tonight" ? <Index events={upcoming.slice(0, 7)} today={today} numbered={false} /> : null}
                {view === "saved" ? (savedList.length ? <Index events={savedList.slice(0, 7)} today={today} numbered={false} /> : <p className="text-sm text-muted pt-6">Nothing saved yet. Tap the heart on an event and it lands here.</p>) : null}
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
                {view === "changes" ? <Index events={changed.slice(0, 7)} today={today} numbered={false} /> : null}
              </div>
            </div>
          </Duo>
        </Rise>
      </div>
    </section>
  );
}
