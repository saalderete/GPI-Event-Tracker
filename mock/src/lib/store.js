import { useCallback, useEffect, useState } from "react";

// Small persisted state: saved events, interests, theme and the motion
// switch live in localStorage, nowhere else. Reads and writes are guarded so
// a private window or blocked storage still renders the page.
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function useStored(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  useEffect(() => {
    const onStorage = (e) => { if (e.key === key) setValue(read(key, fallback)); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return [value, setValue];
}

export function useSaved() {
  const [saved, setSaved] = useStored("gpi-saved", []);
  const toggle = useCallback((slug) => setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug])), [setSaved]);
  return { saved, toggle, has: (slug) => saved.includes(slug), clear: () => setSaved([]) };
}

export function useInterests() {
  const [interests, setInterests] = useStored("gpi-interests", []);
  const [subs, setSubs] = useStored("gpi-subs", []);
  const toggleInterest = (id) => setInterests((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleSub = (id) => setSubs((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return { interests, subs, toggleInterest, toggleSub };
}

/** "system" | "light" | "dark". The landing opens at night when the mode is system. */
export function useThemeMode() {
  return useStored("gpi-theme", "system");
}

/** "on" | "paused": the Pause motion switch, like 4D Resin's. */
export function useMotionPref() {
  const [pref, setPref] = useStored("gpi-motion", "on");
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { paused: pref === "paused" || reduced, toggle: () => setPref((p) => (p === "paused" ? "on" : "paused")), pref };
}

/** The palette, one of the portal's seven; the landing and every page wear it in both themes. */
export function usePalette() {
  // The default is the one the opening script put on <html>, so it lives in one place (index.html).
  return useStored("gpi-palette", document.documentElement.dataset.palette || "bugambilia");
}
