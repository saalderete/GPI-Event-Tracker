import { CheckCircle, ArrowsClockwise, XCircle } from "@phosphor-icons/react";
import { shortDay } from "../lib/dates.js";

// The one thing the field study asked for on every listing: whether it is
// still on, and when that was last true.
export function StatusLine({ event: e, long = false }) {
  if (e.status === "canceled") {
    return <span className="status status--canceled"><XCircle size={16} weight="regular" />Canceled{long && e.change ? ` on ${shortDay(e.changedOn)}` : ""}</span>;
  }
  if (e.status === "changed") {
    return <span className="status status--changed"><ArrowsClockwise size={16} weight="regular" />Changed {shortDay(e.changedOn)}{long ? ", confirmed with the organizer" : ""}</span>;
  }
  return <span className="status status--confirmed"><CheckCircle size={16} weight="regular" />Confirmed {shortDay(e.confirmedOn)}</span>;
}
