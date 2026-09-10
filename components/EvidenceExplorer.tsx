"use client";

import { useMemo, useState } from "react";
import { ActionMenu } from "./ActionMenu";
import { InterviewCard } from "./InterviewCard";
import { IconSearch } from "./Icons";
import { candidates, type Interview } from "@/lib/evidence";
import { team } from "@/lib/team";

// The 51 sheets, filterable. Everything renders on first paint, so the page
// reads as flat text with scripts off; the filters only hide cards.
export function EvidenceExplorer({ data }: { data: Interview[] }) {
  const [cands, setCands] = useState<number[]>([]);
  const [phases, setPhases] = useState<number[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [q, setQ] = useState("");

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.filter((i) => {
      if (cands.length && !cands.includes(i.candidate)) return false;
      if (phases.length && !phases.includes(i.phase)) return false;
      if (people.length && !people.includes(i.interviewer ?? "unrecorded")) return false;
      if (needle) {
        const hay = [i.role, i.experience ?? "", i.takeaway ?? "", i.location ?? "", ...i.quotes].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [data, cands, phases, people, q]);

  const chips = [
    ...cands.map((c) => ({ key: `c${c}`, label: `Candidate ${c}`, clear: () => toggle(cands, c, setCands) })),
    ...phases.map((p) => ({ key: `p${p}`, label: `Phase ${p}`, clear: () => toggle(phases, p, setPhases) })),
    ...people.map((p) => ({
      key: `i${p}`,
      label: p === "unrecorded" ? "Interviewer not recorded" : team.find((m) => m.id === p)?.name ?? p,
      clear: () => toggle(people, p, setPeople)
    }))
  ];
  const clearAll = () => {
    setCands([]);
    setPhases([]);
    setPeople([]);
    setQ("");
  };

  return (
    <div className="no-print-filters">
      <div className="no-print flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Search interviews</span>
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="field !pl-9" placeholder="Search roles, takeaways, quotes" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <ActionMenu
          label={cands.length ? `Candidate (${cands.length})` : "Candidate"}
          role="listbox"
          closeOnSelect={false}
          items={candidates.map((c) => ({
            label: `C${c.number} · ${c.name}`,
            checked: cands.includes(c.number),
            hint: c.outcome === "selected" ? "selected" : undefined,
            onSelect: () => toggle(cands, c.number, setCands)
          }))}
        />
        <ActionMenu
          label={phases.length ? `Phase (${phases.length})` : "Phase"}
          role="listbox"
          closeOnSelect={false}
          items={[1, 2].map((p) => ({ label: `Phase ${p}`, checked: phases.includes(p), onSelect: () => toggle(phases, p, setPhases) }))}
        />
        <ActionMenu
          label={people.length ? `Interviewer (${people.length})` : "Interviewer"}
          role="listbox"
          closeOnSelect={false}
          align="right"
          items={[
            ...team.map((m) => ({ label: m.name, checked: people.includes(m.id), onSelect: () => toggle(people, m.id, setPeople) })),
            { label: "Not recorded", checked: people.includes("unrecorded"), separatorAbove: true, onSelect: () => toggle(people, "unrecorded", setPeople) }
          ]}
        />
      </div>

      <div className="no-print mt-4 flex flex-wrap items-center gap-2">
        <p className="meta mr-2" aria-live="polite">
          Showing {shown.length} of {data.length}
        </p>
        {chips.map((c) => (
          <span key={c.key} className="chip">
            {c.label}
            <button type="button" aria-label={`Remove filter ${c.label}`} onClick={c.clear}>
              ×
            </button>
          </span>
        ))}
        {chips.length || q ? (
          <button type="button" className="meta underline hover:text-ink" onClick={clearAll}>
            Clear all
          </button>
        ) : null}
      </div>

      {shown.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((i) => (
            <InterviewCard key={i.id} i={i} />
          ))}
        </div>
      ) : (
        <div className="card mt-6 p-10 text-center">
          <p className="font-serif text-lg">No interviews match those filters.</p>
          <p className="meta mt-2">Try fewer filters, or a shorter search.</p>
          <button type="button" className="btn btn-ghost mt-5" onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
