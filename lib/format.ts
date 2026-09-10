import { site } from "./site";

const TZ = site.timezone;

/** "Sep 21, 2026" */
export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: TZ }).format(
    new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  );

/** "Sep 21" */
export const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: TZ }).format(
    new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  );

/** "Mon, Sep 21, 2026, 11:59 PM MDT" */
export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
    timeZoneName: "short"
  }).format(new Date(iso));

/** "Sep 10, 2026, 9:58 PM MDT" */
export const fmtStamp = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
    timeZoneName: "short"
  }).format(new Date(iso));
