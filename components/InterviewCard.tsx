import type { Interview } from "@/lib/evidence";
import { memberById } from "@/lib/team";
import { fmtDate } from "@/lib/format";

export function InterviewCard({ i, compact = false }: { i: Interview; compact?: boolean }) {
  const who = memberById(i.interviewer);
  return (
    <article className="card flex flex-col gap-3 p-5" id={i.id} aria-labelledby={`${i.id}-role`} data-reveal>
      <div className="meta flex items-center justify-between gap-3">
        <span className="text-ink">{i.id}</span>
        <span>{i.date ? fmtDate(i.date) : "Date not recorded"}</span>
      </div>
      <h3 id={`${i.id}-role`} className="font-serif text-[1.08rem] font-semibold leading-snug">
        {i.role}
      </h3>
      <p className="meta -mt-1">
        {[i.location ?? "Location not recorded", who ? who.name : "Interviewer not recorded"].join(", ")}
      </p>
      {i.experience ? <p className="text-[0.9rem] text-ink-soft">{i.experience}</p> : null}
      <div className="border-t border-border pt-3">
        {i.takeaway ? (
          <p className="text-[0.95rem] leading-relaxed">{i.takeaway}</p>
        ) : (
          <p className="meta italic">No per-interview takeaway on this sheet; answers were captured in a grid.</p>
        )}
      </div>
      {i.quotes.length ? (
        <ul className="space-y-2">
          {i.quotes.slice(0, compact ? 2 : undefined).map((q, k) => (
            <li key={k} className="border-l-2 border-accent pl-3 font-serif text-[0.93rem] italic leading-relaxed text-ink-soft">
              {q}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
