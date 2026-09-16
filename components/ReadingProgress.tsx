"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// The reading line: a hairline along the top of the page, in the accent,
// that fills as the visitor scrolls. Home included, where it also tells the
// visitor how much of the desk-to-board scroll is left. It is drawn with a
// transform on scroll frames only, so scrolling stays cheap, and it is
// invisible on a page that does not scroll. Decorative: hidden from
// assistive technology and absent from the print views.
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const queue = () => {
      if (!raf) raf = window.requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    // The page grows and shrinks under the visitor (the evidence filter,
    // fonts arriving), and the line must follow.
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      ro.disconnect();
    };
  }, [pathname]);

  return <div ref={ref} className="read-line" aria-hidden="true" />;
}
