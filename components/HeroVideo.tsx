"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/base";

// The hero's one moving image: sheets of paper settling into a stack, the
// record accreting. It plays once and rests on the finished stack. Phones
// and reduced-motion visitors get the finished stack as a still, so nobody
// downloads two megabytes of video for a page they can't or don't want to
// watch move.
export function HeroVideo({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"pending" | "video" | "still">("pending");
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    setMode(reduce || small ? "still" : "video");
  }, []);

  useEffect(() => {
    if (mode !== "video" || !ref.current) return;
    // Autoplay can be refused; the poster is the first frame, so a refusal
    // leaves a sensible still rather than a black box.
    ref.current.play().catch(() => {});
  }, [mode]);

  const still = withBase("/media/hero-still.jpg");
  const poster = withBase("/media/hero-poster.jpg");

  if (mode !== "video") {
    return (
      <img
        src={mode === "pending" ? poster : still}
        alt="Printed sheets of paper settled into a stack on a desk, seen from above"
        className={className}
        width={1280}
        height={720}
        decoding="async"
        fetchPriority="high"
      />
    );
  }
  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      playsInline
      preload="auto"
      width={1280}
      height={720}
      aria-label="Printed sheets of paper drifting down and settling into a stack on a desk, seen from above"
    >
      <source src={withBase("/media/hero.webm")} type="video/webm" />
      <source src={withBase("/media/hero.mp4")} type="video/mp4" />
    </video>
  );
}
