# Gracias Por Invitar: Living Project Portal

The public, sprint-by-sprint record of how the Gracias Por Invitar project is
managed. CS 4390/5388 Software Project Management, The University of Texas at
El Paso, Fall 2026.

The project: one place for everything happening in El Paso, from arena
concerts to farmers markets and car meets, so people find out before it
happens instead of after. The name is what you say when the photos show up and
nobody told you.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run ship         # build, print PDFs, emit corpus, validate (what CI does)
npm run serve        # serve the export at http://localhost:4173
npm run shots        # screenshots of the export into shots/
```

PDFs need Chromium for Playwright: `npx playwright install chromium` once.

If `npm run dev` shows an error that no longer matches the files on disk,
delete Next's cache and start again: `rm -rf .next && npm run dev`.

The PDFs are printed from the pages by `npm run ship`, not by the dev
server. Until ship has run once, the PDF buttons in `npm run dev` open the
print view instead; after it, the dev server serves the copies ship leaves
in `public/pdf/` (gitignored, regenerated on every ship).

## How it is put together

- **Next.js, static export, Tailwind 4.** No server. The site builds to
  `out/` and deploys to GitHub Pages from `.github/workflows/deploy.yml`.
  The base path comes from the repository name, so a rename needs no edit.
- **One source, two renders.** Every document is an MDX file under
  `content/`. The web page renders it, and `scripts/pdf.mjs` prints the
  `/print/...` route of the same file to `out/pdf/` at build time. The PDF
  cannot drift from the page because it is the page.
- **The registry is the law.** `lib/registry.ts` lists every public document
  with its version, status, owner and revision history. Pages, the rail, the
  PDF generator and the validator all read it.
- **Validation.** `scripts/validate.mjs` fails the build if a document lacks
  its page or PDF, if the output contains the private-content sentinel, if a
  referral name from the interview sheets appears anywhere, or if visible copy
  contains an em dash.
- **The hero clip.** `lib/site.ts` picks the Home hero. `board` (the
  default) makes Home one shot: the clip sits fixed behind the page, the
  scroll position through the cover and two empty screens scrubs it (the
  sheets land, the camera tilts up to a whiteboard), and the rest of Home is
  written on the board the clip holds on. `scroll` scrubs the desk clip over
  the first screen only; `card` plays it once in a frame beside the name.
  Phones and reduced-motion visitors get stills. The clips are generated
  illustrations (Seedance 2.0 through Monid; see `AI-LOG.md`): the takes the
  encodes are built from live in `media-src/`, and
  `scripts/hero-media.sh media-src/desk-1080p.mp4 media-src/board-1080p.mp4`
  writes everything in `public/media/`: the joined scrub encodes (a keyframe
  every four frames), the play-once desk clip, the poster and the stills.
- **Evidence as data.** The 51 interview sheets live in
  `content/evidence/interviews.json` and render as a filterable appendix and
  as a PDF. Referral names were removed.
- **Design.** KasaPro's warm neutrals with a visitor-chosen accent
  (`content/accents.json`, six presets, each contrast-checked in both themes
  by `scripts/contrast.mjs`). Jura for display and the
  name, Source Serif 4 for reading, IBM
  Plex Mono for the record's metadata. The rail navigation is
  KasaPro's fluid rail with the sprints as its circles. Blocks rise into
  place as they scroll into view (`components/Reveal.tsx`); the print views,
  no-script visitors and reduced motion get every page in full.

## Adding a sprint

1. Add the sprint's documents as MDX under `content/sprint-N/` and register
   them in `lib/registry.ts` and `lib/docs.tsx`.
2. Flip the sprint to `status: "live"` in `lib/sprints.ts`.
3. Write the change log for anything revised from the prior sprint.
4. `npm run ship`, commit, push to `main`. The workflow deploys.

## What never goes here

Sprint retrospectives and peer evaluations are private and go to Blackboard
only. `content/private/` is gitignored for local drafts; anything containing
`PRIVATE-DO-NOT-PUBLISH` fails the build if it reaches the output.

## AI use

Recorded in `AI-LOG.md` and disclosed on each sprint page.
