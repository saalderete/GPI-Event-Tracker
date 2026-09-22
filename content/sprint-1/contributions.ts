// Sprint 1 contribution statement (guidelines §9) and AI use disclosure
// (§10). Owned/reviewed entries are placeholders until each member fills
// theirs in; interview counts are from the sheets.
export interface Contribution {
  member: string;
  owned: string | null;
  reviewed: string | null;
}

export const contributions: Contribution[] = [
  { member: "samuel", owned: null, reviewed: null },
  { member: "jazmin", owned: null, reviewed: null },
  { member: "christian", owned: null, reviewed: null },
  { member: "emmanuel", owned: null, reviewed: null },
  { member: "oscar", owned: null, reviewed: null }
];

export const aiDisclosure = {
  tool: "Claude (Anthropic), through Claude Code",
  stages: [
    {
      stage: "Website construction (guidelines §5)",
      use: "Designed and built this portal: layout, styling, page generation, the PDF pipeline and the build checks."
    },
    {
      stage: "Initial drafts of PM artifacts for team review (§10, permitted)",
      use: "Drafted the Market Research synthesis from the team's own interview sheets, and the structure of the Business Strategy and Project Charter with the facts already on record. Sections that need team decisions are marked on the page."
    },
    {
      stage: "Summarizing or restructuring content the team produced (§10, permitted)",
      use: "Transcribed the 51 interview sheets into the structured evidence appendix, removing referral names. No interview content was generated or altered."
    }
  ],
  notUsedFor: [
    "Conducting or writing up interviews; every response is the participant's, recorded by a team member.",
    "The individual reflections, the individual estimation memo, or any go/no-go reasoning (not permitted under §10)."
  ],
  changedOrRejected:
    "The team reviewed the Market Research synthesis and the interview evidence appendix and approved both as written on 2026-09-22. The Business Strategy and Project Charter drafts are still under team review." as string | null
};
