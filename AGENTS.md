<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gracias Por Invitar: portal working notes

This repo is the Living Project Portal for CS 4390/5388 at UTEP: a static
Next.js site that records how the project is managed, sprint by sprint.
README.md explains how it is put together; these are the rules that keep it
honest.

- One source, two renders. Every public document is an MDX file under
  `content/<sprint>/` and is registered in `lib/registry.ts` and
  `lib/docs.tsx`. The page renders it; `scripts/pdf.mjs` prints the
  `/print/...` route of the same file to `out/pdf/`. Never hand-maintain a
  PDF, and never add a document without registering it. The one exception
  is a document the team delivers as a PDF: register it with
  `source: "upload"` and its file name, put the file in `public/docs/`, and
  keep its MDX to a cover (the sheet, the document's own words, what it
  contains, the open button). The ship step copies the file into place
  instead of printing. A file the team delivered
  alongside a document (a signed copy, the owner's own PDF, the interview
  sheets) also goes in `public/docs/` and is listed in the document's
  `delivered` entries; the page offers it as a Team's PDF button that opens
  the viewer, and the validator checks the file exists. Never restate a delivered document's content on its
  cover; the PDF is the document.
- `npm run ship` is what CI runs: build, PDFs, corpus, validate. The
  validator (`scripts/validate.mjs`) fails on a document without page or
  PDF, on the private-content sentinel, on a referral name from the
  interview sheets, or on an em dash in visible copy. Do not weaken it.
- No em dashes anywhere in visible copy. Use commas, colons, periods.
- Sprint retrospectives and peer evaluations are private (Blackboard only).
  They never go in this repo outside the gitignored `content/private/`.
- Interview evidence lives in `content/evidence/interviews.json`. Quotes are
  verbatim from the team's sheets; never invent, edit or embellish a
  response, and never add participant or referral names.
- AI use on PM content must be recorded in `AI-LOG.md` and disclosed on the
  sprint page (`content/sprint-N/contributions.ts`). AI is not used for the
  individual reflections, the individual estimation memo, or go/no-go
  reasoning.
- Every colour comes from a visitor-chosen palette in `content/accents.json`
  (paper, surfaces, ink, borders, rail and accent, light and dark each);
  `scripts/contrast.mjs` must pass for every palette in both themes. One
  palette at a time, Jura for display, the name and
  the writing on the Home board, Source Serif 4 for reading, IBM Plex Mono for metadata, Phosphor icons only.
- Reveal on scroll: put `data-reveal` on a block to have it rise into view;
  the direct children of a `.prose-doc` column do it on their own. Never put
  it on an ancestor of something fixed or sticky, and never in the print
  views, which have no reveal scope by design.
- Adding a sprint: MDX under `content/sprint-N/`, register the documents,
  set the sprint to `live` in `lib/sprints.ts` when its block starts and to
  `delivered` once its deadline has passed with its documents on the page, write the change log, run
  `npm run ship`, push to `main`.
