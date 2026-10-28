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
Fontsource. The palette is the portal's Bugambilia, day and night.

## Pages

| Route | What it is |
|---|---|
| `/mock/` | The landing: the dusk film played by the scroll, this week in figures, the calendar's categories on LOW SUN's conveyor (by way of Inside Benji's), the next eight as a list, three doors, the footer |
| `/mock/events/` | The calendar: search, a day strip, Free, list or grid, "For you first" once interests are picked |
| `/mock/events/tonight/`, `/tomorrow/`, `/weekend/`, `/week/` | One page per date, as Fever has them; the weekend page opens with KAGE's focused rail |
| `/mock/events/music/` and the other seven categories | One page per category; the date chips narrow it |
| `/mock/organizers/` | For organizers: the pitch, the six fields, what a listing looks like on a phone, the door to the form |
| `/mock/events/<slug>/` | One event: who it is for, what it costs, know before you go, where, the organizer, the change line, Save, Send to the group chat, Add to calendar (.ics) |
| `/mock/saved/` | The plan: saved events by day, one share for the whole list |
| `/mock/interests/` | Pick categories; the calendar leads with them; weekly subscriptions (a mock) |
| `/mock/post/` | The organizer form: the six required fields, a live flyer, a review step |

Saved events, interests, the theme and the Pause motion switch live in the
visitor's browser only.

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

`public/film/`: the El Paso time-lapse from Nerrix Digital's booking calendar,
cut from golden hour to night and re-encoded with a keyframe every four frames
so the scroll can scrub it (12 s, 24 fps, H.264). A tall crop for phones, a
poster for each, and two night stills for the footer.

## House rules

No em dashes in visible copy. One accent (the portal's magenta), used for
actions and status only. 2 px corners on pictures and fields, pills for buttons
and chips. Everything that moves honours reduced motion and the Pause switch.
No invented reviews, counts or facts: every figure on the landing is counted
from the sample data.
