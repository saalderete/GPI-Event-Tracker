"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { withBase } from "@/lib/base";
import { IconArrow } from "./Icons";

// The clip as the whole first screen, scrubbed by scroll. A tall runway holds
// a sticky stage; the scroll position through the runway maps to a time in
// the clip, and a requestAnimationFrame loop eases the video toward it. No
// scroll listener and no React state on the hot path: the loop reads the
// runway's position each frame and only seeks when the target moved.
// Phones and reduced-motion visitors get the finished stack as a still.
//
// Both encodes are offered; MP4 first because H.264 seeks are
// hardware-decoded everywhere, Safari included. ?vext=webm puts the WebM
// first for testing (and for a Chromium build without H.264).
const RUNWAY_VH = 240;
const EASE = 0.16;
const MIN_STEP = 1 / 48;

export function ScrollHero({ children }: { children: ReactNode }) {
  const runway = useRef<HTMLElement>(null);
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
    if (!v || !r) return;

    let raf = 0;
    let running = false;
    let current = 0;
    let lastSeek = -1;
    let ready = false;

    const onReady = () => {
      ready = true;
      // Paint the first frame; some browsers stay black until a seek.
      if (v.currentTime === 0) v.currentTime = 0.001;
    };
    v.addEventListener("loadeddata", onReady);
    if (v.readyState >= 2) onReady();

    const progress = () => {
      const rect = r.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / travel));
    };

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (!ready || !v.duration || v.seeking) return;
      const target = progress() * v.duration;
      current += (target - current) * EASE;
      if (Math.abs(current - lastSeek) >= MIN_STEP) {
        lastSeek = current;
        v.currentTime = current;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
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

  const still = withBase("/media/hero-still.jpg");

  return (
    <section ref={runway} className="scroll-hero" style={{ height: mode === "video" ? `${RUNWAY_VH}vh` : "100dvh" }} aria-label="Introduction">
      <div className="stage">
        {mode === "video" ? (
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            poster={withBase("/media/hero-poster.jpg")}
            aria-label="Printed sheets of paper settling into a stack on a desk, seen from above; the scroll position moves through the clip"
          >
            {(ext === "webm" ? ["webm", "mp4"] : ["mp4", "webm"]).map((e) => (
              <source key={e} src={withBase(`/media/hero-scrub.${e}`)} type={e === "webm" ? "video/webm" : "video/mp4"} />
            ))}
          </video>
        ) : (
          <img className="still" src={mode === "pending" ? withBase("/media/hero-poster.jpg") : still} alt="Printed sheets of paper settled into a stack on a desk, seen from above" width={1280} height={720} fetchPriority="high" />
        )}
        <div className="scrim" aria-hidden />
        <div className="panel">
          <div className="panel-card">{children}</div>
        </div>
      </div>
    </section>
  );
}

// The words that sit on the stage. Kept separate so Home can pass the same
// content to either hero layout.
export function HeroWords({ eyebrow, name, mark, tagline, primaryHref, primaryLabel }: { eyebrow: string; name: string; mark?: string; tagline: string; primaryHref: string; primaryLabel: string }) {
  return (
    <>
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h1 className="display display-wide mt-4 max-w-[15ch] text-[clamp(2.6rem,6vw,5rem)]" data-reveal>
        {name}
        {mark ? <span className="mark"> ({mark})</span> : null}
      </h1>
      <p className="mt-5 max-w-[34ch] font-serif text-[1.15rem] leading-[1.45] text-ink sm:text-[1.3rem]" data-reveal>
        {tagline}
      </p>
      <div className="mt-6 flex flex-wrap gap-3" data-reveal>
        <Link href={primaryHref} className="btn btn-primary">
          {primaryLabel} <IconArrow />
        </Link>
        <Link href="/about/" className="btn btn-ghost">
          About the team
        </Link>
      </div>
    </>
  );
}
