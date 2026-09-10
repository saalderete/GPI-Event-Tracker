import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Print views: the same documents on white, no chrome. scripts/pdf.mjs
// prints these; a visitor can also open one from a document's menu.
export default function PrintLayout({ children }: { children: ReactNode }) {
  return <div className="print-root min-h-dvh">{children}</div>;
}
