import { IconDownload, IconPrint } from "./Icons";
import { documents } from "@/lib/registry";
import { sprints } from "@/lib/sprints";
import { pdfLink, pdfTitle } from "@/lib/pdf";
import { withBase } from "@/lib/base";

// Every public document as a PDF, one button each. Home shows this row.
export function PdfButtons() {
  return (
    <ul className="mt-5 flex flex-wrap gap-2" data-reveal>
      {documents.map((d) => {
        const slug = sprints.find((s) => s.number === d.sprint)?.slug ?? `sprint-${d.sprint}`;
        const link = pdfLink(d.pdf, withBase(`/print/${slug}/${d.slug}/`));
        return (
          <li key={d.pdf}>
            <a className="btn btn-ghost" href={link.href} download={link.file ? `${d.pdf}.pdf` : undefined} target={link.file ? undefined : "_blank"} title={pdfTitle(link, d.title)}>
              {link.file ? <IconDownload /> : <IconPrint />} {d.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
