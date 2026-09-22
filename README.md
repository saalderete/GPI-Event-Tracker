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
  `out/`, and `.github/workflows/deploy.yml` publishes that folder to the
  `render` branch, which a Render static site serves as it is (see
  `render.yaml`). Render builds nothing; the PDFs need a headless browser,
  and that lives in the workflow.
- **One source, two renders.** Every document is an MDX file under
  `content/`. The web page renders it, and `scripts/pdf.mjs` prints the
  `/print/...` route of the same file to `out/pdf/` at build time. A document the team delivers as a PDF is the exception: registered with `source: "upload"`, its file lives in `public/docs/`, its page is a thin cover with a viewer, and the ship step copies the file into place instead of printing it. A file the team delivered alongside a document (a signed copy, the owner's own PDF, the interview sheets) also lives in `public/docs/` and is listed in the document's `delivered` entries; the page offers it as a Team's PDF button that opens the viewer, and the validator checks that the file exists. The PDF
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
  scroll position through the cover and the empty screens after it scrubs
  it (a cat gets up and walks off the desk, the sheets land, the camera
  tilts up to a whiteboard), and the rest of Home is written on the board
  the clip holds on. While the cover rests at the top a short loop of the
  cat blinking plays over the clip's first frame and dissolves into it on
  the first scroll. `scroll` scrubs the desk clip over the first screen
  only; `card` plays it once in a frame beside the name. Phones and
  reduced-motion visitors get stills. The clips are generated illustrations
  (Seedance 2.0 and 2.5 and Wan 2.7 through Monid; see `AI-LOG.md`): the
  takes the encodes are built from live in `media-src/`, and the command in
  `media-src/README.md` runs `scripts/hero-media.sh` to write everything in
  `public/media/`: the joined scrub encodes (a keyframe every four frames),
  the idle loop, the play-once desk clip, the poster and the stills.
- **Evidence as data.** The 51 interview sheets live in
  `content/evidence/interviews.json` and render as a filterable appendix and
  as a PDF. Referral names were removed.
- **Design.** A visitor-chosen palette (`content/accents.json`, seven of
  them, each a whole scheme in a light and a dark version, contrast-checked
  on twelve pairs by `scripts/contrast.mjs`). The default is the warm paper
  the site started with. Jura for display and the
  name, Source Serif 4 for reading, IBM
  Plex Mono for the record's metadata. The rail navigation is
  KasaPro's fluid rail with the sprints as its circles. Blocks rise into
  place as they scroll into view (`components/Reveal.tsx`) and a hairline
  along the top fills as the page is read
  (`components/ReadingProgress.tsx`). A full load opens on the mark for a
  moment (`components/Loader.tsx`), and the first screen rises in as it
  lifts; in-site navigation never shows it. The print views, no-script
  visitors and reduced motion get every page in full, with no loading
  screen.

## Adding a sprint

1. Add the sprint's documents as MDX under `content/sprint-N/` and register
   them in `lib/registry.ts` and `lib/docs.tsx`.
2. Flip the sprint to `status: "live"` in `lib/sprints.ts`.
3. Write the change log for anything revised from the prior sprint.
4. `npm run ship`, commit, push to `main`. The workflow deploys.

## Deploying

Every push to `main` runs the workflow: build, PDFs, corpus, validate, then
the built `out/` folder is force-pushed to the `render` branch as a single
commit. Render watches that branch and serves it from its CDN, so the
deployment time Render shows is the moment the workflow finished.

One-time setup:

1. Push `main` once so the `render` branch exists.
2. Render dashboard, New, Blueprint, pick this repository. It reads
   `render.yaml` and creates the static site named there.
3. If the site gets a different name or a custom domain, set a `PORTAL_URL`
   repository variable in GitHub (Settings, Secrets and variables, Actions)
   so the footer and the manifest carry the right address.

Nothing in `out/` or on the `render` branch is edited by hand.

## What never goes here

Sprint retrospectives and peer evaluations are private and go to Blackboard
only. `content/private/` is gitignored for local drafts; anything containing
`PRIVATE-DO-NOT-PUBLISH` fails the build if it reaches the output.

## AI use

Recorded in `AI-LOG.md` and disclosed on each sprint page.
