import { useEffect, useRef, useState } from "react";
import { Palette } from "@phosphor-icons/react";
import { PALETTES } from "../data/palettes.js";

// The portal's seven palettes, to try on the mock: a swatch each (paper and
// accent, day and night), the name and its line. The choice is kept in the
// browser, and ?palette=<id> in the address picks one for a link.
export function PaletteSwitch({ palette, setPalette }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const current = PALETTES.find((p) => p.id === palette) || PALETTES[0];
  return (
    <div className="pal" ref={ref}>
      <button type="button" className="icon-btn" aria-expanded={open} aria-haspopup="listbox" aria-label={`Palette: ${current.label}`} title={`Palette: ${current.label}`} onClick={() => setOpen((o) => !o)}>
        <Palette size={18} />
      </button>
      {open ? (
        <ul className="pal__menu" role="listbox" aria-label="Palettes">
          {PALETTES.map((p) => (
            <li key={p.id}>
              <button type="button" role="option" aria-selected={p.id === palette} className="pal__item" onClick={() => { setPalette(p.id); setOpen(false); }}>
                <span className="pal__sw" aria-hidden="true">
                  <i style={{ background: p.light.paper }}><b style={{ background: p.light.accent }} /></i>
                  <i style={{ background: p.dark.paper }}><b style={{ background: p.dark.accent }} /></i>
                </span>
                <span className="pal__text"><b>{p.label}</b><small>{p.hint}</small></span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
