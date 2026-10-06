"use client";

import { useEffect, useState } from "react";
import { fmtDateTime, fmtDay } from "@/lib/format";

// Under the hero on Home: how long the sprint in progress has left, ticking
// in the visitor's browser from the schedule, in the site's timezone. The
// next change is the live sprint's deadline; after the last deadline of the
// semester the clock stops. Numbers appear only after mount, so the server
// render and the first client render agree.
export interface ScheduleEntry {
  number: number;
  title: string;
  /** First day of the block, YYYY-MM-DD in the site's timezone. */
  start: string;
  /** Deadline, ISO with offset. */
  due: string;
}

/** Minutes to add to the instant to read it as local time in `tz`. */
function tzOffsetMinutes(at: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - at.getTime()) / 60000);
}

/** The instant of midnight on `day` (YYYY-MM-DD) in `tz`, across the time change. */
function zonedMidnight(day: string, tz: string) {
  const guess = Date.parse(`${day}T00:00:00Z`);
  const first = guess - tzOffsetMinutes(new Date(guess), tz) * 60000;
  const second = guess - tzOffsetMinutes(new Date(first), tz) * 60000;
  return second;
}

const pad = (n: number) => String(n).padStart(2, "0");

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(total / 86400), h: Math.floor((total % 86400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

export function Countdown({ schedule, timezone }: { schedule: ScheduleEntry[]; timezone: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Before mount: the frame without numbers.
  if (now === null) {
    return (
      <div className="countdown no-print" data-reveal>
        <p className="eyebrow">Next sprint change</p>
        <p className="digits" aria-hidden="true">
          <span className="unit" />
        </p>
      </div>
    );
  }

  const live = schedule.find((s) => zonedMidnight(s.start, timezone) <= now && now < Date.parse(s.due));
  const next = live ? schedule.find((s) => s.number === live.number + 1) : schedule.find((s) => zonedMidnight(s.start, timezone) > now);

  let label: string;
  let target: number | null = null;
  let note: string;
  if (live) {
    label = `Sprint ${live.number} closes in`;
    target = Date.parse(live.due);
    note = `Due ${fmtDateTime(live.due)}` + (next ? `. Sprint ${next.number} begins ${fmtDay(next.start)}.` : ". The last sprint of the semester.");
  } else if (next) {
    label = `Sprint ${next.number} begins in`;
    target = zonedMidnight(next.start, timezone);
    note = `Its block starts ${fmtDay(next.start)}.`;
  } else {
    label = "The semester";
    note = "All six sprints are delivered.";
  }

  const t = target === null ? null : split(target - now);
  return (
    <div className="countdown no-print" data-reveal>
      <p className="eyebrow">{label}</p>
      {t ? (
        <p className="digits" aria-live="off">
          {t.d > 0 ? (
            <>
              {t.d}
              <span className="unit">d</span>
            </>
          ) : null}
          {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
        </p>
      ) : null}
      <p className="meta">{note}</p>
    </div>
  );
}
