// Sprint 1 contribution statement (guidelines §9) and AI use disclosure
// (§10). Owned/reviewed entries are placeholders until each member fills
// theirs in; interview counts are from the sheets.
export interface Contribution {
  member: string;
  owned: string | null;
  reviewed: string | null;
}

export const contributions: Contribution[] = [
  { member: "samuel", owned: "Built and maintained the Living Project Portal, including site structure, visual design, document integration, PDF generation, and Render deployment.", reviewed: null },
  { member: "jazmin", owned: "The Market Research. Phase 1 Candidate 3 interviews and Phase 2 Candidate 2 and Candidate 3 interviews.", reviewed: null },
  {
  member: "christian",
  owned: "Interview Evidence appendix and validation of supporting project data.",
  reviewed: "Market Research and Business Strategy for consistency with the interview evidence."
  },
  { member: "emmanuel", owned: "The Project Charter. Phase 1 Candidate 1 interviews and Phase 2 Candidate 3 interviews.", reviewed: null },
  { member: "oscar", owned: "The Business Strategy. Phase 1 Candidate 4 interviews and Phase 2 Candidate 2 interviews.", reviewed: null }
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
      use: "Transcribed the 51 interview sheets into the structured evidence appendix, removing referral names. No interview content was generated or altered. The original sheets are linked from the appendix, with the referral names redacted."
    },
    {
      stage: "Suggesting stakeholder types the team then evaluates, and grammar and clarity checks (§10, permitted)",
      use: "On the project manager's charter: drafted a stakeholder register from the groups the charter and the research already name, for the project manager to confirm, and corrected wording. The project manager replaced the draft with his own stakeholder table in the signed charter of 21 September (version 1.2); the wording corrections stand. Both delivered files are kept."
    }
  ],
  notUsedFor: [
    "Conducting or writing up interviews; every response is the participant's, recorded by a team member.",
    "The individual reflections, the individual estimation memo, or any go/no-go reasoning (not permitted under §10)."
  ],
  changedOrRejected:
    "On 2026-09-21 the team reviewed and approved the Market Research synthesis and the interview evidence appendix as written, and the Business Strategy with its review notes removed, the candidate objective adopted as the objective, and the measures' targets deferred to the Sprint 2 business case. The drafted Project Charter was replaced by the team's own charter, written by the project manager and published as delivered. Later the same evening the Business Strategy was revised to version 1.1 to follow the scope the Project Charter sets: El Paso and Juárez, a feed personalized by interests, and paid featured listings as the monetization hypothesis, with the charter's success criteria carried over as the first targets. In the Market Research (version 1.3) the sentence attributing the choice of Candidate 3 to the team's interest was removed, and the Juárez finding now separates what the interviews showed from what the charter later decided." as string | null
};
