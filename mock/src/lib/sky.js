// The drawn sky from DAYLIGHT (nerrix-digital components/booking-calendar/sky.js):
// a gradient keyed to the time of day, the fallback when the footage is not
// there yet. minute is minutes after midnight. Each stop is
// [minute, top, middle, horizon, sun glow, star opacity].
const STOPS = [
  [0, "#05070d", "#0b1224", "#17203a", "rgba(255,170,90,0)", 1],
  [300, "#070b18", "#141c38", "#2a2c4a", "rgba(255,150,110,0.05)", 0.9],
  [390, "#27335e", "#6b5a86", "#e59a86", "rgba(255,170,120,0.45)", 0.25],
  [480, "#4d79b8", "#8fb3d9", "#f1d3b0", "rgba(255,230,180,0.35)", 0],
  [720, "#3f79c4", "#7fb0e0", "#cfe3f1", "rgba(255,255,230,0.25)", 0],
  [960, "#4a78b3", "#8eaed0", "#f0d6b0", "rgba(255,220,160,0.35)", 0],
  [1110, "#3c4f86", "#c27a6a", "#f8b35e", "rgba(255,160,70,0.7)", 0],
  [1170, "#2b2f5c", "#8a4f6e", "#e2744c", "rgba(255,120,60,0.55)", 0.1],
  [1230, "#141a38", "#33305a", "#6e3f55", "rgba(255,110,70,0.2)", 0.5],
  [1320, "#070b18", "#10172e", "#1d2440", "rgba(255,170,90,0.05)", 0.9],
  [1440, "#05070d", "#0b1224", "#17203a", "rgba(255,170,90,0)", 1]
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (s) => s.match(/[\d.]+/g).map(Number);
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

export function skyAt(minute) {
  const m = ((minute % 1440) + 1440) % 1440;
  let i = STOPS.findIndex((s) => s[0] > m);
  if (i <= 0) i = STOPS.length - 1;
  const a = STOPS[i - 1], b = STOPS[i];
  const t = (m - a[0]) / (b[0] - a[0]);
  const c = (k) => `rgb(${mix(hex(a[k]), hex(b[k]), t).map(Math.round).join(",")})`;
  const g = mix(rgba(a[4]), rgba(b[4]), t);
  return { top: c(1), mid: c(2), horizon: c(3), glow: `rgba(${g.slice(0, 3).map(Math.round).join(",")},${g[3].toFixed(3)})`, stars: a[5] + (b[5] - a[5]) * t, sun: Math.sin(((m - 390) / (1170 - 390)) * Math.PI) };
}

// Where a minute of the day sits in the El Paso time-lapse (25 s, sunrise to
// night), as [minute, share of the clip]. Before sunrise the city is still
// dark, so the small hours hold the end of the clip.
const KEYS = [[420, 0], [720, 0.3], [1020, 0.5], [1110, 0.62], [1170, 0.78], [1260, 0.9], [1440, 1]];
export function clipProgress(minute) {
  const m = minute >= 1440 ? minute - 1440 : minute;
  if (m < 360) return 1;
  if (m <= KEYS[0][0]) return 0;
  if (m >= KEYS[KEYS.length - 1][0]) return 1;
  let i = 0;
  while (m > KEYS[i + 1][0]) i++;
  const [m0, p0] = KEYS[i], [m1, p1] = KEYS[i + 1];
  return p0 + ((m - m0) / (m1 - m0)) * (p1 - p0);
}
