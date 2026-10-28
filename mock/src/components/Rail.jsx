import { useEffect, useState } from "react";

// The reading line along the top and the chapter rail down the left gutter,
// after Mirada and 4D Resin. The rail folds open on arrival and then stays
// however the visitor left it; the chapter on screen is marked as you scroll.
const TILE = 38, STEP = 46;

export function Rail({ chapters }) {
  const [open, setOpen] = useState(() => { try { return localStorage.getItem("gpi-rail") !== "0"; } catch { return true; } });
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: "-40% 0px -59% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  const set = (v) => { setOpen(v); try { localStorage.setItem("gpi-rail", v ? "1" : "0"); } catch {} };
  const stackH = TILE + chapters.length * STEP;
  return (
    <>
      <aside className="rail" data-expanded={open}>
        <nav className="rail__stack" aria-label="Chapters" style={{ "--stack-h": `${stackH}px` }}>
          <button type="button" className="rail__item rail__toggle" aria-expanded={open} aria-label={open ? "Close the chapters" : "Open the chapters"} onClick={() => set(!open)}>
            <span className="rail__glyph">G</span>
            <span className="rail__label" aria-hidden="true">{open ? "Close" : "Chapters"}</span>
          </button>
          {chapters.map((c, i) => (
            <a key={c.id} href={`#${c.id}`} className="rail__item rail__link" style={{ "--i": i + 1, "--y": `${(i + 1) * STEP}px` }} aria-label={c.label} aria-current={current === c.id ? "location" : undefined}>
              <span className="rail__num" aria-hidden="true">{i + 1}</span>
              <span className="rail__label" aria-hidden="true">{c.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
