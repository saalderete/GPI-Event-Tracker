import Link from "next/link";
import { sprints } from "@/lib/sprints";
import { fmtDay } from "@/lib/format";

// The semester as a line across Home. Same vocabulary as the rail's
// circles, at the scale of a hero.
export function Spine() {
  const liveCount = sprints.filter((s) => s.status === "live").length;
  const n = sprints.length;
  // The accent line reaches the last live node.
  const progress = n > 1 ? (Math.max(liveCount - 1, 0) / (n - 1)) * 100 : 0;
  return (
    <div className="spine" data-reveal>
      <div className="spine-track" aria-hidden />
      <div className="spine-progress" style={{ width: `${progress}%` }} aria-hidden />
      <ol className="relative grid grid-cols-6 gap-2">
        {sprints.map((s, i) => (
          <li key={s.slug} className="min-w-0">
            <Link
              href={`/${s.slug}/`}
              className={`spine-node ${s.status === "live" ? "is-live" : ""}`}
              style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              aria-label={`Sprint ${s.number}, ${s.status === "live" ? "live" : `due ${fmtDay(s.due)}`}`}
            >
              <span className="node" aria-hidden>
                {s.number}
              </span>
              <span className="min-w-0">
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-label sm:block">Sprint {s.number}</span>
                <span className="block whitespace-nowrap font-mono text-[10px] text-muted sm:text-[11px]">
                  {s.status === "live" ? (
                    <span className="text-accent">Live</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Due </span>
                      {fmtDay(s.due)}
                    </>
                  )}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
