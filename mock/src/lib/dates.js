// Dates for the mock. The sample events are placed by day offset from today,
// so "Tonight" and "This weekend" always have something on, whatever day the
// site is opened. Today is today in El Paso.
export const TZ = "America/Denver";

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

/** Today's date key, YYYY-MM-DD, in El Paso. */
export function todayKey(now = new Date()) {
  return dayFmt.format(now);
}

/** A local date (noon, to dodge DST edges) from a key. */
export function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

export function toKey(date) {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** Fri, Sat and Sun of the coming weekend (today included if it is one of them). */
export function weekendKeys(today = todayKey()) {
  const dow = fromKey(today).getDay(); // 0 Sun .. 6 Sat
  const toFri = dow === 0 ? -2 : dow === 6 ? -1 : 5 - dow;
  const fri = addDays(today, toFri);
  return [fri, addDays(fri, 1), addDays(fri, 2)].filter((k) => k >= today);
}

export function dayLabel(key, today = todayKey()) {
  if (key === today) return "Today";
  if (key === addDays(today, 1)) return "Tomorrow";
  return fromKey(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function longDay(key) {
  return fromKey(key).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function shortDay(key) {
  return fromKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function weekday(key) {
  return fromKey(key).toLocaleDateString("en-US", { weekday: "short" });
}

export function dayNumber(key) {
  return fromKey(key).getDate();
}

/** "19:30" to "7:30 PM". */
export function fmtTime(hm) {
  if (!hm) return "";
  const [h, m] = hm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, "0")} ${ampm}` : `${hh} ${ampm}`;
}

export function timeRange(start, end) {
  return end ? `${fmtTime(start)} to ${fmtTime(end)}` : fmtTime(start);
}

/** For the .ics file: local wall time written as a floating time. */
export function icsStamp(key, hm) {
  const [h, m] = (hm || "00:00").split(":");
  return `${key.replace(/-/g, "")}T${h}${m}00`;
}
