import type { ReactNode } from "react";
import { withBase } from "@/lib/base";
import { DocViewer } from "./DocViewer";

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

// The sheet at the top of a delivered document's cover: label and value
// rows, as the team's own templates lay them out.
export function Sheet({ rows }: { rows: [string, string][] }) {
  return (
    <table className="sheet">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// The button in the body of a cover that opens the delivered PDF; the same
// viewer as the one in the document header.
export function OpenDocument({ file, title, label }: { file: string; title: string; label: string }) {
  return (
    <div className="doc-open">
      <DocViewer href={withBase(`/docs/${file}`)} title={title} label={label} download={file} />
    </div>
  );
}
