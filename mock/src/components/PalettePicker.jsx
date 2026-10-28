import { useEffect, useMemo, useRef, useState } from "react";
import { X, Shuffle, ArrowCounterClockwise } from "@phosphor-icons/react";
import { DEFAULT_PALETTE } from "../lib/palette.js";
import { useMotionOff } from "./motion.jsx";

// The palette picker: every palette in the Nerrix design library and the
// portal's own, in a panel at the side so the page shows the choice as it is
// made. Each row is the palette's own colours, then how it reads by day and
// by night. The choice stays in this browser.
export function PalettePicker({ open, onClose, palettes, palette, setPalette }) {
  const ref = useRef(null);
  const [q, setQ] = useState("");
  const still = useMotionOff();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const groups = useMemo(() => {
    if (!palettes) return [];
    const needle = q.trim().toLowerCase();
    const hit = (p) => !needle || [p.label, p.series, p.hint, ...p.names].join(" ").toLowerCase().includes(needle);
    const out = [];
    for (const p of palettes) {
      if (!hit(p)) continue;
      const last = out[out.length - 1];
      if (last && last[0] === p.series) last[1].push(p); else out.push([p.series, [p], p.account]);
    }
    return out;
  }, [palettes, q]);
  const count = palettes ? palettes.length : 0;
  const shuffle = () => { if (!palettes) return; const others = palettes.filter((p) => p.id !== palette); setPalette(others[Math.floor(Math.random() * others.length)].id); };
  return (
    <dialog ref={ref} className={`picker${still ? " is-still" : ""}`} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} aria-labelledby="picker-title">
      <div className="picker__in">
        <header className="picker__head">
          <div>
            <h2 id="picker-title" className="display">Your colours.</h2>
            <p>One palette for the whole site, by day and by night. {count ? `${count} to choose from, ` : ""}kept in this browser.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <div className="picker__tools">
          <input className="field" type="search" placeholder="Search by name or colour: orange, navy, mint" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the palettes" />
          <button type="button" className="chip" onClick={shuffle} disabled={!palettes}><Shuffle size={14} /> Surprise me</button>
          <button type="button" className="chip" onClick={() => setPalette(DEFAULT_PALETTE)} disabled={palette === DEFAULT_PALETTE}><ArrowCounterClockwise size={14} /> Back to default</button>
        </div>
        <div className="picker__body">
          {!palettes ? <p className="text-muted text-sm">Loading the palettes.</p> : null}
          {palettes && !groups.length ? <p className="text-muted text-sm">Nothing by that name. Try a colour: red, teal, cream.</p> : null}
          {groups.map(([series, list, account]) => (
            <section key={series} aria-label={series}>
              <h3>{series} <span>{account}</span></h3>
              <div className="picker__list">
                {list.map((p) => (
                  <button key={p.id} type="button" className="prow" aria-pressed={p.id === palette} onClick={() => setPalette(p.id)} title={p.hint}>
                    <span className="prow__sw" aria-hidden="true">{p.swatch.map((h, i) => <i key={i} style={{ background: h }} />)}</span>
                    <span className="prow__text"><b>{p.label}</b><small>{p.hint}</small></span>
                    <span className="prow__pv" aria-hidden="true">
                      <i style={{ background: p.light.paper }}><b style={{ background: p.light.accent }} /></i>
                      <i style={{ background: p.dark.paper }}><b style={{ background: p.dark.accent }} /></i>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        <footer className="picker__foot">
          Palettes by <a href="https://www.instagram.com/dopely.colors/" target="_blank" rel="noreferrer">dopely.colors</a> and <a href="https://www.instagram.com/dyslove.design/" target="_blank" rel="noreferrer">dyslove.design</a>, collected in the Nerrix design library. The first is the portal's own.
        </footer>
      </div>
    </dialog>
  );
}
