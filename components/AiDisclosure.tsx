// The AI use disclosure a sprint page carries (guidelines §10): the tool,
// the stages it was used at, what it was not used for, and what the team
// changed or rejected. Sprint 1 renders its own inside its overview.
export interface Disclosure {
  tool: string;
  stages: { stage: string; use: string }[];
  notUsedFor: string[];
  changedOrRejected: string | null;
}

export function AiDisclosure({ disclosure }: { disclosure: Disclosure }) {
  return (
    <section className="mt-16" aria-labelledby="ai" data-reveal>
      <h2 id="ai" className="display text-[1.6rem] sm:text-[1.9rem]">
        AI use disclosure
      </h2>
      <p className="mt-2 mb-5 max-w-[64ch] text-[0.98rem] text-ink-soft">
        Which tool was used, at which stage, and what the team changed or rejected from its output, as the course requires.
      </p>
      <dl className="max-w-[72ch] space-y-5 border-t border-border pt-5 text-[0.95rem]">
        <div>
          <dt className="label">Tool</dt>
          <dd className="mt-1">{disclosure.tool}</dd>
        </div>
        <div>
          <dt className="label">Stages</dt>
          <dd className="mt-1">
            <ul className="space-y-3">
              {disclosure.stages.map((s) => (
                <li key={s.stage}>
                  <span className="font-semibold">{s.stage}.</span> {s.use}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="label">Not used for</dt>
          <dd className="mt-1">
            <ul className="list-disc space-y-1 pl-5">
              {disclosure.notUsedFor.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="label">What the team changed or rejected</dt>
          <dd className={`mt-1 ${disclosure.changedOrRejected ? "" : "italic text-muted"}`}>
            {disclosure.changedOrRejected ?? "To be completed after the team reviews the drafts."}
          </dd>
        </div>
      </dl>
    </section>
  );
}
