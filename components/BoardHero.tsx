"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { withBase } from "@/lib/base";

// Home as one continuous shot. A fixed layer behind the page carries the
// clip: the empty desk, printed sheets settling into a stack, then the camera
// tilting up to a whiteboard until the board fills the frame. The scroll
// position through the runway (the cover plus two empty screens) is the
// playhead; past the runway the clip holds on the board and the rest of the
// page is written on it. Same engine as ScrollHero: rAF, eased seeks, a
// dense-keyframe encode, no scroll listener and no React state on the hot
// path. Phones and reduced-motion visitors get stills: the stack on the
// cover, the board behind everything else.
const RUNWAY_VH = 300;
const EASE = 0.16;
const MIN_STEP = 1 / 48;
// Where the tilt begins, as a fraction of the clip: the desk take is 8 of 13 s.
const BOARD_AT = 8 / 13;
// How much of a screen the content is already showing when the clip ends.
const LEAD = 0.12;

export function BoardHero({ children }: { children: ReactNode }) {
  const layer = useRef<HTMLDivElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"pending" | "video" | "still">("pending");
  const [ext, setExt] = useState<"mp4" | "webm">("mp4");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    if (new URLSearchParams(window.location.search).get("vext") === "webm") setExt("webm");
    setMode(reduce || small ? "still" : "video");
  }, []);

  useEffect(() => {
    if (mode !== "video") return;
    const v = video.current;
    const r = runway.current;
    const bg = layer.current;
    if (!v || !r || !bg) return;

    let raf = 0;
    let running = false;
    let held = false;
    let current = 0;
    let lastSeek = -1;
    let ready = false;

    // The last frame, a hair before the end so the element never reports "ended".
    const end = () => Math.max(0, v.duration - 0.04);
    const hold = () => {
      current = lastSeek = end();
      v.currentTime = current;
    };
    const onReady = () => {
      ready = true;
      if (held) hold();
      else if (v.currentTime === 0) v.currentTime = 0.001;
    };
    v.addEventListener("loadeddata", onReady);
    if (v.readyState >= 2) onReady();

    // The clip reaches the board a little before the runway ends, so the
    // first line of writing is already rising into view as the board settles.
    const progress = () => {
      const rect = r.getBoundingClientRect();
      const travel = rect.height - window.innerHeight * (1 - LEAD);
      if (travel <= 0) return 1;
      return Math.min(1, Math.max(0, -rect.top / travel));
    };
    // The paper wash over the board comes up during the tilt.
    const wash = (p: number) => Math.min(1, Math.max(0, (p - BOARD_AT) / (1 - BOARD_AT)));

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const p = progress();
      bg.style.setProperty("--wash", wash(p).toFixed(3));
      if (!ready || !v.duration || v.seeking) return;
      const target = p * end();
      current += (target - current) * EASE;
      if (Math.abs(current - lastSeek) >= MIN_STEP) {
        lastSeek = current;
        v.currentTime = current;
      }
    };

    // Past the runway the clip holds on the board: seek to the end once and
    // stop the loop. It resumes when the runway scrolls back into view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          held = false;
          if (!running) {
            running = true;
            raf = requestAnimationFrame(tick);
          }
        } else {
          held = true;
          running = false;
          cancelAnimationFrame(raf);
          bg.style.setProperty("--wash", "1");
          if (ready && v.duration) hold();
        }
      },
      { threshold: 0 }
    );
    io.observe(r);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      v.removeEventListener("loadeddata", onReady);
    };
  }, [mode]);

  return (
    <>
      <div ref={layer} className="board-bg" data-mode={mode} aria-hidden={mode === "video" ? undefined : true}>
        {mode === "video" ? (
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            poster={withBase("/media/hero-poster.jpg")}
            aria-label="Printed sheets settle into a stack on a desk, then the camera tilts up to a blank whiteboard; the scroll position moves through the clip"
          >
            {(ext === "webm" ? ["webm", "mp4"] : ["mp4", "webm"]).map((e) => (
              <source key={e} src={withBase(`/media/hero-scrub.${e}`)} type={e === "webm" ? "video/webm" : "video/mp4"} />
            ))}
          </video>
        ) : (
          <img className="still" src={withBase(mode === "pending" ? "/media/hero-poster.jpg" : "/media/board-still.jpg")} alt="" width={1920} height={1080} fetchPriority="high" />
        )}
        <div className="scrim" />
        <div className="wash" />
      </div>
      <div ref={runway} className="board-runway" style={{ height: mode === "video" ? `${RUNWAY_VH}vh` : "100dvh" }}>
        <section className="desk-cover" aria-label="Introduction">
          {mode === "still" ? <img className="cover-still" src={withBase("/media/hero-still.jpg")} alt="" width={1920} height={1080} /> : null}
          <div className="panel">
            <div className="panel-card">{children}</div>
          </div>
        </section>
      </div>
    </>
  );
}
