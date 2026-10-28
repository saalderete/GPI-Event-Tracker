import { icsStamp, longDay, timeRange } from "./dates.js";

/** An .ics file for one event, downloaded on the spot. */
export function downloadIcs(e) {
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gracias Por Invitar//Mock//EN", "BEGIN:VEVENT",
    `UID:${e.slug}@gpi-mock`, `DTSTART:${icsStamp(e.date, e.start)}`, `DTEND:${icsStamp(e.date, e.end || e.start)}`,
    `SUMMARY:${e.title}`, `LOCATION:${e.venue}, ${e.address}`, `DESCRIPTION:${e.blurb} Who it is for: ${e.whoFor}`,
    `URL:${location.origin}/mock/events/${e.slug}/`, "END:VEVENT", "END:VCALENDAR"
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${e.slug}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** The line a friend reads in the group chat. */
export function eventText(e) {
  return `${e.title}, ${longDay(e.date)}, ${timeRange(e.start, e.end)} at ${e.venue}. ${e.price === 0 ? "Free." : ""}`.trim();
}

/** Web Share where it exists, the clipboard everywhere else. Returns what happened. */
export async function share(title, text, url) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return "shared"; } catch { return "dismissed"; }
  }
  try { await navigator.clipboard.writeText(`${text}\n${url}`); return "copied"; } catch { return "failed"; }
}
