// Sprint 2 AI use disclosure (guidelines §10). Sprint 2's individual
// requirement is the estimation memo, submitted separately and never on the
// portal, so this file carries the disclosure only.
export const aiDisclosure = {
  tool: "Claude (Anthropic), through Claude Code",
  stages: [
    {
      stage: "Summarizing or restructuring content the team produced (§10, permitted)",
      use: "The team's completed estimation worksheet (Part 1) carried onto the Estimation Appendix page as written. Two columns were tightened at the portal lead's request: the evidence column cites the interview records in the Sprint 1 appendix that each capability rests on, and each date in the comparators is matched to the listed source that states it, with the gaps marked. No figure or wording from the worksheet was changed."
    }
  ],
  notUsedFor: [
    "The individual estimation memos, submitted separately (not permitted under §10).",
    "The estimates themselves, the ranges, and any go/no-go reasoning, which are the team's (not permitted under §10)."
  ],
  changedOrRejected: null as string | null
};
