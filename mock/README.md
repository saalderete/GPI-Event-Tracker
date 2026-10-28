# The GPI mock website

The product as the team imagines it, built as a working mock: a calendar of
everything happening in El Paso and Juárez, by date, every listing confirmed
with the organizer. It lives inside the portal at `/mock/` and ships with it.

Design direction and sources: the Nerrix design library and components
(MIRADA's rail, reading line, focus cards and entrances; KAGE's focused rail),
4D Resin's catalogue index, and the Sprint 3 field study, which decided the
features: a date strip first, who it is for and what it costs on every event,
Free as a filter, a dated change line, the organizer's page as the source, and
"Send to the group chat" beside Save.

## Stack

Vite, React 19, Tailwind v4 (`@tailwindcss/vite`), Motion (`motion/react`),
React Router, Phosphor icons. Jura (the portal's face) for the name, headlines,
dates and figures; Inter for everything read at small sizes; both OFL, from
Fontsource. The colours are one of the portal's seven palettes, day and night
(see Palettes below).

## Pages

| Route | What it is |
|---|---|
| `/mock/` | The landing: the dusk film played by the scroll, this week in figures, the calendar's categories on LOW SUN's conveyor (by way of Inside Benji's), the next eight as a list, three doors, the footer |
| `/mock/events/` | The calendar: search, a day strip, Free, list or grid, "For you first" once interests are picked |
| `/mock/events/tonight/`, `/tomorrow/`, `/weekend/`, `/week/` | One page per date, as Fever has them. Tonight, Tomorrow and a picked day open with DAYLIGHT's day scene: the time-lapse scrubbed to the minute as you move along the hours, the day's events on the track. The weekend page opens with KAGE's focused rail |
| `/mock/events/music/` and the other seven categories | One page per category; the date chips narrow it |
| `/mock/organizers/` | For organizers: the pitch, the six fields, what a listing looks like on the team's device photos (see The device photos below), the door to the form |
| `/mock/events/<slug>/` | One event: who it is for, what it costs, know before you go, where, the organizer, the change line, Save, Send to the group chat, Add to calendar (.ics) |
| `/mock/saved/` | The plan: saved events by day, one share for the whole list |
| `/mock/interests/` | Pick categories; the calendar leads with them; weekly subscriptions (a mock) |
| `/mock/post/` | The organizer form: the six required fields, a live flyer, a review step |

Saved events, interests, the theme, the palette and the Pause motion switch
live in the visitor's browser only.

## Palettes

Visitors choose the site's colours from the nine palettes of dopely.colors'
[Beauty Brand Color Palettes](https://www.instagram.com/p/DexF1vwDfLH/) post
(October 21, 2026), one per slide: Serum Blush, Pure Cream, Lab Rose, Spa
Mist, Fragrance Night, Wine Tint, Pearl White, Bronze Base and Clinic White.
The palette icon in the top bar opens the picker; the page changes as a row
is picked, by day and by night, and the choice stays in the browser. Lab
Rose is the default.

`palettes/library.json` is the post as the Nerrix design library recorded it
(`nerrix-digital/design-library/palettes/palettes.json`, pulled 2026-10-26):
hex values as printed on the slides, or sampled from the swatch where the
label was unreadable. `palettes/roles.json` says which of each slide's colours
plays the dark anchor (night paper, day ink), the day accent, the night
accent, the soft tint and the day paper, and names the default.
`scripts/palettes.mjs` derives the mock's thirteen tokens for the day and
the night in OKLab, pushes every pairing until it meets its contrast (ink on
paper 7, muted and accent-ink on paper 4.5, accent on paper 3, the label on a
button 4.5), and writes `src/data/palettes.json` (the picker's list, loaded
only when it opens or a palette other than the default is in play),
`src/styles/default-palette.css` (the default's tokens, the stylesheet's
base) and the default's id into `index.html`. A chosen palette is applied as
inline custom properties on `<html>` (`src/lib/palette.js`), kept in the
browser with its tokens, and put back on by the opening script before paint.
`?palette=<id>` in the address picks one for a link. To change the default,
set `default` in `palettes/roles.json` and build. The script runs before
`dev` and `build`; its outputs are committed too.

## The device photos

"What a listing looks like" on the organizers page is the team's four
KasaPro device photos (two tablets held from the side, one in two hands, the
iPhone duo on a fingertip), re-dressed for GPI: the orange backdrop keyed to
transparency (orange hue at very high saturation; the skin under that light
is orange too but far less saturated), the printed labels and the Nerrix mark
dropped (the mark on the forearm painted out), and the screens replaced by
captures of the mock's own pages in the dark Lab Rose theme, warped to each
screen's four corners with fingers and bezels kept in front, after the Nerrix
kit's `place.py`. One tablet is mirrored so every device sits at the right.
The files are `public/devices/*.webp` (1080x1350 with alpha); the scripts
that made them are one-off, outside the repo.

`Showcase` lays the photos over the palette's accent with the wordmark and
corner labels as live type, so the section follows the palette picker. The
slides fade one into the next every 6.5 seconds; the chips pick one and say
what its screen shows; the show stands still under the Pause switch or
reduced motion. The screens are captures, so their dates are the day they
were taken.

## Build

```bash
cd mock
npm install
npm run dev        # http://localhost:5173/mock/
npm run build      # into ../public/mock/, then scripts/routes.mjs copies
                   # index.html into every route folder for deep links
```

The portal's `npm run build` runs the mock's build first (see the root
`package.json`), so `out/mock/` is part of every deploy. `public/mock/` is
gitignored: only the source is committed.

## Film

`public/film/`: the El Paso time-lapse from Nerrix Digital's booking calendar
(DAYLIGHT), sunrise to night, re-encoded with a keyframe every four frames so
it can be scrubbed (25 s, 12 fps, H.264, 8.8 MB). The hero plays its dusk
segment under the scroll; the day scene scrubs the whole day to the minute. Six
stills open the day scene on the right frame, one poster opens the hero, and
two night stills close the footer. A VP9 proxy (`*.webm`, gitignored) stands
in for browsers and test runs without H.264: add `?vext=webm` to the address.

## Chrome

The opening screen (after Benji's) shows on arrival from outside and on reload,
never on back and forward and never with reduced motion; it counts the fonts,
the eager pictures and the hero film, holds at least 1.1 s and lifts. The
reading line along the top fills as you scroll, on every page. The chapter
rail is the landing's.

## House rules

No em dashes in visible copy. One accent (the palette's), used for actions
and status only. 2 px corners on pictures and fields, pills for buttons
and chips. Everything that moves honours reduced motion and the Pause switch.
No invented reviews, counts or facts: every figure on the landing is counted
from the sample data.
