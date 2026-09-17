"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// The loading screen: the mark on paper from the first paint of a full load,
// lifted once the page has loaded and at least MIN milliseconds have passed
// since navigation began, and never later than MAX. The theme script sets
// html[data-loading] before first paint, and not on print routes or for
// reduced motion, so the screen is only ever seen where it belongs. The
// reveal system waits for the gpi:loaded event dispatched here, so the first
// screen rises into view as the screen lifts. Client-side navigations keep
// this mounted and never show it again.
const MIN = 1400;
const MAX = 2600;
const OUT = 650;

export function Loader() {
  const [state, setState] = useState<"on" | "done" | "gone">("on");

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.loading !== "true") {
      setState("gone");
      return;
    }
    const at = (ms: number) => new Promise<void>((r) => window.setTimeout(r, Math.max(0, ms - performance.now())));
    const loaded = new Promise<void>((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", () => r(), { once: true });
    });
    const fonts = "fonts" in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();
    let out = 0;
    let cancelled = false;
    Promise.all([at(MIN), Promise.race([Promise.all([loaded, fonts]), at(MAX)])]).then(() => {
      if (cancelled) return;
      delete html.dataset.loading;
      setState("done");
      window.dispatchEvent(new Event("gpi:loaded"));
      out = window.setTimeout(() => setState("gone"), OUT);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(out);
    };
  }, []);

  if (state === "gone") return null;
  return (
    <div className="loader" data-state={state} role="status" aria-label="Loading">
      <div className="loader-inner">
        <div className="loader-mark" aria-hidden="true">
          {site.short}
        </div>
        <div className="loader-line" aria-hidden="true">
          <span />
        </div>
        <div className="loader-label" aria-hidden="true">
          {site.portalTitle}
        </div>
      </div>
    </div>
  );
}
