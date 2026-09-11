export const site = {
  name: "Gracias Por Invitar",
  short: "GPI",
  // "Thanks for the invite": what you say, dryly, when the photos show up
  // and nobody told you. The name is the problem.
  nameNote:
    "“Thanks for the invite” is what you say when the photos show up and nobody told you. The name is the problem.",
  tagline: "One hub for everything happening in El Paso, from arena concerts to farmers markets and car meets.",
  courseLine: "CS 4390/5388 Software Project Management, UTEP, Fall 2026",
  // "scroll": the clip fills the first screen and the scroll position scrubs
  // it. "card": the clip plays once in a frame beside the name.
  heroMode: "scroll" as "scroll" | "card",
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
  repo: "https://github.com/saalderete/GPI-Event-Tracker-",
  hosting: "GitHub Pages"
} as const;
