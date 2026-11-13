// Sprint 5 AI use disclosure (guidelines §10). The memo is the team's file,
// delivered as a PDF; its Appendix B is the team's own note on its AI use,
// and this disclosure with AI-LOG.md is the full record. The wireframes and
// the mockups were made with Claude at the portal lead's direction.
// Retrospectives and peer evaluations go through Blackboard and are never
// on the portal, so this file carries the disclosure only.
export const aiDisclosure = {
  tool: "Claude (Anthropic), through Claude Code",
  stages: [
    {
      stage: "Initial drafts for team review (§10)",
      use: "Crisis Response Memo, Section 4, Delivery and Reliability Impact: drafted in full at Samuel Alderete's request, from the team's Sprint 4 Service Level Indicators and Error Budget and Policy."
    },
    {
      stage: "Grammar and clarity checks; restructuring content the team produced (§10)",
      use: "Crisis Response Memo: a review of the first draft and one of the completed memo, each checking the figures against the portal's documents and listing what disagreed for the team to settle; then, at the portal lead's direction, the six-page version: typos corrected, the layout tightened and passages the memo repeats elsewhere condensed. No figure, decision or recommendation changed."
    },
    {
      stage: "Website construction (§5)",
      use: "The wireframes, drawn in Lucidchart on 3 November 2026 from the screens of the live event site, and the mockups, made on 11 November from stills of the live site, both at the portal lead's direction. The mockups' pictures are the site's generated illustrations."
    },
    {
      stage: "Website construction (§5); summarizing content the team produced (§10)",
      use: "The cover pages of the memo, the wireframes and the mockups, written from the files and describing them rather than restating them; the mockups' photographs saved again at a lower resolution for the web; the Sprint 5 change log, from the repository and the documents; the registry entries, the sprint page and this disclosure."
    }
  ],
  notUsedFor: [
    "The memo's other sections, its decisions, its governance response, its risk entries, its transition plan and its CEO briefing, which are the team's writing as signed.",
    "Go/no-go reasoning: the recommendation in the memo's Part C is the team's, and the reviews did not weigh in on it (not permitted).",
    "Retrospectives and peer evaluations, which are private and not permitted."
  ],
  changedOrRejected: null as string | null
};
