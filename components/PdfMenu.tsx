"use client";

import { useState } from "react";
import { ActionMenu } from "./ActionMenu";
import { IconCheck, IconDownload, IconLink, IconPrint } from "./Icons";
import { withBase } from "@/lib/base";

// Download is the primary action; the menu holds the rest. The PDF is
// generated from the same source as this page, so the two cannot differ.
export function PdfMenu({ pdf, printHref, title }: { pdf: string; printHref: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div className="flex items-center gap-2 no-print">
      <a className="btn btn-primary" href={withBase(`/pdf/${pdf}.pdf`)} download={`${pdf}.pdf`} title={`Download ${title} as PDF`}>
        <IconDownload />
        Download PDF
      </a>
      <ActionMenu
        label="More"
        align="right"
        items={[
          { label: "Open print view", icon: <IconPrint />, href: printHref, external: true },
          { label: copied ? "Link copied" : "Copy link to this page", icon: copied ? <IconCheck /> : <IconLink />, onSelect: copy }
        ]}
      />
    </div>
  );
}
