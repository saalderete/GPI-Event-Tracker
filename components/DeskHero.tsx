"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { withBase } from "@/lib/base";

// The clip as the background of the whole Home page. It sits fixed behind
// everything, and the scroll position through the entire page maps to a
// time in the clip: the stack finishes landing as the footer arrives. The
// first screen carries the name on a frosted panel; the rest of the page
// rides over the desk on one paper sheet (see Shell's `sheet`). Same engine
// as ScrollHero: rAF, eased seeks, dense-keyframe encode, no scroll listener.
// Phones and reduced-motion visitors get the finished stack as a fixed still.
const EASE = 0.16;
const MIN_STEP = 1 / 48;

export function DeskHero({ children }: { children: ReactNode }) {
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
    if (!v) return;
    let raf = 0;
    let current = 0;
    let lastSeek = -1;
    let ready = false;
    const onReady = () => {
      ready = true;
      if (v.currentTime === 0) v.currentTime = 0.001;
    };
    v.addEventListener("loadeddata", onReady);
    if (v.readyState >= 2) onReady();

    const progress = () => {
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      if (travel <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / travel));
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!ready || !v.duration || v.seeking) return;
      const target = progress() * v.duration;
      current += (target - current) * EASE;
      if (Math.abs(current - lastSeek) >= MIN_STEP) {
        lastSeek = current;
        v.currentTime = current;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadeddata", onReady);
    };
  }, [mode]);

  return (
    <>
      <div className="desk-video" aria-hidden={mode === "video" ? undefined : true}>
        {mode === "video" ? (
          <video ref={video} muted playsInline preload="auto" poster={withBase("/media/hero-poster.jpg")} aria-label="Printed sheets of paper settling into a stack on a desk; the scroll position moves through the clip">
            {(ext === "webm" ? ["webm", "mp4"] : ["mp4", "webm"]).map((e) => (
              <source key={e} src={withBase(`/media/hero-scrub.${e}`)} type={e === "webm" ? "video/webm" : "video/mp4"} />
            ))}
          </video>
        ) : (
          <img className="still" src={withBase(mode === "pending" ? "/media/hero-poster.jpg" : "/media/hero-still.jpg")} alt="" width={1280} height={720} fetchPriority="high" />
        )}
        <div className="scrim" />
      </div>
      <section className="desk-cover" aria-label="Introduction">
        <div className="panel">
          <div className="panel-card">{children}</div>
        </div>
      </section>
    </>
  );
}
