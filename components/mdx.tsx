import type { ReactNode } from "react";

// Components a document can use inside its MDX.
export function Callout({ title, children, kind = "note" }: { title?: string; children: ReactNode; kind?: "note" | "draft" }) {
  return (
    <aside className={`callout ${kind === "draft" ? "callout-draft" : ""}`}>
      {title ? <span className="callout-title">{title}</span> : null}
      {children}
    </aside>
  );
}

// Marks a passage the team still has to write or confirm. Loud on purpose:
// nothing marked this way should survive to a final version.
export function Draft({ children, title = "Team input needed" }: { children: ReactNode; title?: string }) {
  return (
    <Callout kind="draft" title={title}>
      {children}
    </Callout>
  );
}

// A number worth pausing on, set large in the display face.
export function Figure({ n, label }: { n: string; label: string }) {
  return (
    <span className="my-2 mr-6 inline-flex flex-col">
      <span className="display text-[2.2rem] leading-none text-ink">{n}</span>
      <span className="meta mt-1">{label}</span>
    </span>
  );
}
