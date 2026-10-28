import { useEffect } from "react";

// The opening screen, after Benji's: it counts the fonts, the eager pictures
// and the hero film, fills its bar as they arrive, holds at least 1.1 s so it
// reads as the way in, and lifts. The markup is in index.html, so it paints
// before the bundle; this only drives it. It never shows on back and forward,
// nor for a visitor who asked for less motion (decided in index.html).
export function useLoader() {
  useEffect(() => {
    const root = document.documentElement;
    const loader = document.querySelector(".loader");
    if (!loader || !root.hasAttribute("data-loading")) return;
    const bar = loader.querySelector(".loader__bar span"), num = loader.querySelector(".loader__n");
    const started = performance.now();
    let finished = false, done = 0;
    const list = [...document.querySelectorAll("img:not([loading=lazy])")].filter((im) => !loader.contains(im));
    const film = document.querySelector("[data-hero-film]");
    const total = list.length + 1 + (film ? 1 : 0);
    const show = (p) => { bar.style.setProperty("--p", p); num.textContent = `${Math.round(p * 100)}%`; };
    const finish = () => {
      if (finished) return;
      finished = true; show(1);
      setTimeout(() => {
        loader.classList.add("is-out");
        setTimeout(() => { root.removeAttribute("data-loading"); document.dispatchEvent(new Event("gpi:loaded")); }, 650);
      }, Math.max(0, 1100 - (performance.now() - started)));
    };
    const step = () => { show(Math.min(1, done / total)); if (done >= total) finish(); };
    list.forEach((im) => {
      if (im.complete) { done++; return; }
      im.addEventListener("load", () => { done++; step(); }, { once: true });
      im.addEventListener("error", () => { done++; step(); }, { once: true });
    });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { done++; step(); });
    if (film) {
      if (film.readyState >= 2) { done++; } else {
        film.addEventListener("loadeddata", () => { done++; step(); }, { once: true });
        film.addEventListener("error", () => { done++; step(); }, { once: true });
      }
    }
    step();
    const cap = setTimeout(finish, 3000); // never longer than the page needs plus the hold
    return () => clearTimeout(cap);
  }, []);
}
