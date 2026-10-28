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
| `/mock/organizers/` | For organizers: the pitch, the six fields, what a listing looks like on the team's iPhone duo (see The duo below), the door to the form |
| `/mock/events/<slug>/` | One event: who it is for, what it costs, know before you go, where, the organizer, the change line, Save, Send to the group chat, Add to calendar (.ics) |
| `/mock/saved/` | The plan: saved events by day, one share for the whole list |
| `/mock/interests/` | Pick categories; the calendar leads with them; weekly subscriptions (a mock) |
| `/mock/post/` | The organizer form: the six required fields, a live flyer, a review step |

Saved events, interests, the theme, the palette and the Pause motion switch
live in the visitor's browser only.

## Palettes

While the team chooses, the mock can wear any of the portal's seven palettes.
`scripts/palettes.mjs` reads `content/accents.json` and writes
`src/styles/palettes.css` (one block per palette, day and night, in the
mock's token names), `src/data/palettes.js` (the list for the switch) and the
same CSS inline into `index.html` between the `<style id="palettes">` tags, so
the opening screen already wears the chosen palette. It runs before `dev` and
`build`; the outputs are committed too. The palette switch in the top bar
(the palette icon) keeps the choice in the browser, and `?palette=<id>` in
the address picks one for a link. The default is the one line in
`index.html` that reads `pal || "bugambilia"`. When the team settles on one,
set that line and the switch can go.

## The duo

`public/duo.webp` is the team's iPhone duo photo, cut from its orange backdrop
(the backdrop keyed on hue and saturation, the hand below the phones dropped,
the orange spill on the metal neutralized, the edge feathered; a one-off
script, not in the repo). The screen is not a picture: `Duo` in
`src/components/Phone.jsx` lays the real components out flat, 220 to 300 px
wide by how large the photo renders, and one CSS `matrix3d` (a homography from
the flat rectangle to the four screen corners in `src/data/duo.js`) puts them
onto the front phone. The chips swap the view, the dates stay live, and the
fit is recomputed on resize only.

## Data

`src/data/events.js`: 26 sample events placed by day offset from today, so
the calendar always has something on tonight and this weekend. Organizers are
fictional; venues are real kinds of places. Every page says it is sample data.

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
