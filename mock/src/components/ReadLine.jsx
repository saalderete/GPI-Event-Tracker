import { useEffect, useRef } from "react";

// The reading line along the top, on every page: it fills as you scroll.
// Pure CSS where the browser can tie an animation to the scroll; elsewhere
// one frame loop draws it with a transform.
export function ReadLine() {
  const ref = useRef(null);
  useEffect(() => {
    const line = ref.current;
    if (!line || CSS.supports("animation-timeline: scroll()")) return;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const max = document.documentElement.scrollHeight - innerHeight;
      line.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)).toFixed(4) : 0})`;
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} className="read-line" aria-hidden="true" />;
}
