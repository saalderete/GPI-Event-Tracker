import { candidates, interviews, outcomeLabel } from "@/lib/evidence";

// The five candidates, with counts, so the cards below have context.
export function CandidateLegend() {
  return (
    <section aria-labelledby="legend">
      <h2 id="legend" className="display mb-5 text-[1.6rem] sm:text-[1.8rem]" data-reveal>
        The five candidates
      </h2>
      <ol className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-5">
        {candidates.map((c) => {
          const n1 = interviews.filter((i) => i.candidate === c.number && i.phase === 1).length;
          const n2 = interviews.filter((i) => i.candidate === c.number && i.phase === 2).length;
          const selected = c.outcome === "selected";
          return (
            <li key={c.number} className={`border-t-2 pt-3 ${selected ? "border-accent" : "border-border"}`} data-reveal>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[12px] text-muted">C{c.number}</span>
                <span className={`badge ${selected ? "badge-live" : "badge-muted"}`}>{outcomeLabel[c.outcome]}</span>
              </div>
              <p className="mt-2 font-serif text-[1rem] font-semibold leading-snug">{c.name}</p>
              <p className="meta mt-1">
                {c.area}. Phase 1: {n1}
                {n2 ? `, Phase 2: ${n2}` : ""}
              </p>
              <p className="mt-2 text-[0.85rem] leading-snug text-ink-soft">{c.outcomeNote}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
