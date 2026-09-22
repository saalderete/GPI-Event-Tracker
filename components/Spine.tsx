import Link from "next/link";
import { sprints, isPublished, statusWord } from "@/lib/sprints";
import { fmtDay } from "@/lib/format";

// The semester as a line across Home. Same vocabulary as the rail's
// circles, at the scale of a hero.
export function Spine() {
  const publishedCount = sprints.filter(isPublished).length;
  const n = sprints.length;
  // The accent line reaches the last published node.
  const progress = n > 1 ? (Math.max(publishedCount - 1, 0) / (n - 1)) * 100 : 0;
  return (
    <div className="spine" data-reveal>
      <div className="spine-track" aria-hidden />
      <div className="spine-progress" style={{ width: `${progress}%` }} aria-hidden />
      <ol className="relative grid grid-cols-6 gap-2">
        {sprints.map((s, i) => (
          <li key={s.slug} className="min-w-0">
            <Link
              href={`/${s.slug}/`}
              className={`spine-node is-${s.status}`}
              style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              aria-label={`Sprint ${s.number}, ${s.status === "upcoming" ? `due ${fmtDay(s.due)}` : statusWord[s.status].toLowerCase()}`}
            >
              <span className="node" aria-hidden>
                {s.number}
              </span>
              <span className="min-w-0">
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-label sm:block">Sprint {s.number}</span>
                <span className="block whitespace-nowrap font-mono text-[10px] text-muted sm:text-[11px]">
                  {s.status === "upcoming" ? (
                    <>
                      <span className="hidden sm:inline">Due </span>
                      {fmtDay(s.due)}
                    </>
                  ) : (
                    <span className="text-accent">{statusWord[s.status]}</span>
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
