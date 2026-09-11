"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Reveal on scroll. Anything with data-reveal, and every direct child of a
// reading column, starts a step down and transparent and rises into place
// the first time it enters the viewport; elements that arrive together are
// staggered. The hidden start is applied by CSS only under html[data-js]
// (set before first paint by the theme script) and inside .reveal-scope,
// so the page reads in full without scripts, in the print views, and for
// reduced-motion visitors. Content that appears later (the evidence filter
// swaps cards in and out) is picked up by a mutation observer.
const SELECTOR = "[data-reveal], .prose-doc > *";
const STEP = 70; // ms between elements revealed in one batch
const MAX = 420; // cap on the stagger
const SETTLE = 800; // transition length plus a margin, then the delay is cleared

export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scope = document.querySelector<HTMLElement>(".reveal-scope");
    if (!scope) return;

    const io = new IntersectionObserver(
      (entries) => {
        const arrived = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        arrived.forEach((e, i) => {
          const el = e.target as HTMLElement;
          const delay = Math.min(i * STEP, MAX);
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
          // The inline delay must not linger: hover transitions share it.
          window.setTimeout(() => {
            el.style.transitionDelay = "";
          }, delay + SETTLE);
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 }
    );

    const watched = new WeakSet<Element>();
    const scan = () => {
      scope.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (watched.has(el) || el.classList.contains("is-in")) return;
        watched.add(el);
        io.observe(el);
      });
    };
    scan();

    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mo.observe(scope, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      if (queued) cancelAnimationFrame(queued);
    };
  }, [pathname]);
  return null;
}
