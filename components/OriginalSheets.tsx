import { withBase } from "@/lib/base";

// The team's filled-in interview sheets, published as delivered except for
// the referral names, which are redacted: those pages are images with the
// names blacked out. Participants appear by role only, as the sheets require.
const sheets = [
  { phase: 1, pages: 32, file: "sprint-1-phase-1-interviews.pdf" },
  { phase: 2, pages: 54, file: "sprint-1-phase-2-interviews.pdf" }
];

export function OriginalSheets({ print = false }: { print?: boolean }) {
  return (
    <p className={print ? "text-[10pt]" : "meta max-w-[70ch]"}>
      The team's original interview sheets, as filled in:{" "}
      {sheets.map((s, i) => (
        <span key={s.phase}>
          <a className="underline hover:text-ink" href={withBase(`/docs/${s.file}`)} target="_blank" rel="noopener">
            Phase {s.phase}, {s.pages} pages (PDF)
          </a>
          {i < sheets.length - 1 ? " and " : ""}
        </span>
      ))}
      . Participants appear by role only, as the sheets require, and referral names are redacted.
    </p>
  );
}
