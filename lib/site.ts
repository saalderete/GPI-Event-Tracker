export const site = {
  name: "Gracias Por Invitar",
  short: "G.P.I",
  // "Thanks for the invite": what you say, dryly, when the photos show up
  // and nobody told you. The name is the problem.
  nameNote:
    "“Thanks for the invite” is what you say when the photos show up and nobody told you. The name is the problem.",
  // What the app is, in one line: the page description and the board use it.
  tagline: "One hub for everything happening in El Paso, from arena concerts to farmers markets and car meets.",
  // What this site is, in one line: the cover uses it.
  portalTagline: "The living record of how the team is managing Gracias Por Invitar, one sprint at a time.",
  // The cover title: the team's portal, with the short name beside it. The
  // full name stays in the browser title, the footer and the board.
  portalTitle: "Team 9 Project Portal",
  courseLine: "CS 4390/5388 Software Project Management, UTEP, Fall 2026",
  // "board": Home is one shot, the desk then the whiteboard, scrubbed by the
  // scroll and holding on the board the page is written on. "scroll": the
  // clip fills the first screen only. "card": it plays once beside the name.
  heroMode: "board" as "board" | "scroll" | "card",
  // The one-sentence business problem the guidelines ask for on Home.
  problem:
    "People in El Paso find out about events after they have already happened, because announcements are scattered across dozens of social accounts and only reach the people already following the right ones.",
  // The problem statement exactly as the team tested it in Sprint 1.
  problemAsTested:
    "People find it hard to find events/places to go to in El Paso/Juarez, often finding out after the events have already happened.",
  course: "CS 4390/5388",
  courseName: "Software Project Management",
  university: "The University of Texas at El Paso",
  term: "Fall 2026",
  timezone: "America/Denver",
  repo: "https://github.com/saalderete/GPI-Event-Tracker",
  hosting: "Render"
} as const;
