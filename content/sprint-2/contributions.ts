// Sprint 2 AI use disclosure (guidelines §10). Sprint 2's individual
// requirement is the estimation memo, submitted separately and never on the
// portal, so this file carries the disclosure only.
export const aiDisclosure = {
  tool: "Claude (Anthropic), through Claude Code",
  stages: [
    {
      stage: "Summarizing or restructuring content the team produced (§10, permitted)",
      use: "The team's completed estimation worksheet (Part 1) carried onto the Estimation Appendix page as written. Two columns were tightened at the portal lead's request: the evidence column cites the interview records in the Sprint 1 appendix that each capability rests on, and each date in the comparators is matched to the listed source that states it, with the gaps marked. No figure or wording from the worksheet was changed."
    },
    {
      stage: "Grammar and clarity checks; restructuring content the team produced (§10, permitted)",
      use: "The team's completed Part 2 activity, 'Estimate One Slice of Your Project', edited at the portal lead's request following the team's own alignment review of 29 September 2026: boundaries stated for the source of events and for personalization, the analogous method's sensitivity corrected and shown, two claims the Part 1 source checks mark unsupported reworded, one check-row answer corrected, the PERT display rounded, the open event-supply decision recorded with what it changes, and the drafted story points noted. The revised activity was carried onto the page and published as the Team's PDF: Part 2. No count, weight, rate, fraction, uplift, velocity or range was changed."
    },
    {
      stage: "Restructuring content the team produced; arithmetic re-run from the team's inputs (§10, permitted)",
      use: "Items 1 to 4 of the team's final revision handoff of 29 September 2026, at the portal lead's direction: the outside-source import taken out of the slice so both methods estimate the same functions, the calendar counted as the same lookup as events by date under the handoff's rule, and Steps 3A, 5 and 6 re-run from the team's unchanged counts, weights, rates, fraction, uplift and its documented procedure for M (71 function points, 426 to 852 hours, a range of 394 to 852 hours, 603.67 expected). The alternative-count sentence made conditional with its arithmetic corrected, the story points labelled unconfirmed, the wage listing labelled by its actual category. No new estimate was produced; the slice boundary and the calendar classification are the team's to confirm or revise, the team validates the point values, and a team member dates the wage figure."
    },
    {
      stage: "Restructuring content the team produced (§10, permitted)",
      use: "The team's verification of 29 September 2026 (the seven story point values confirmed, the base wage and its job category verified) entered in the activity and on the page in the wording the team supplied, and the story-point cross-check sentence corrected against the formal range. No calculation changed."
    },
    {
      stage: "Restructuring content the team produced (§10, permitted)",
      use: "The team's submitted version of the activity (30 September 2026) carried onto the page and published as the Team's PDF: Part 2 in place of version 9. The page text follows the team's final edits; no figure changed."
    },
    {
      stage: "Restructuring content the team produced (§10, permitted)",
      use: "The team's completed Session 11 activity, 'Building the Budget' (4 October 2026), carried onto the Project Budget page as written and its file published as the Team's PDF. The nine charts were redrawn from the team's figures in the portal's palette. Not carried: one line left over from an earlier draft in the first table, which the rest of the document supersedes, and two spacing slips, both noted in the page's revision history. No figure changed."
    },
    {
      stage: "Restructuring content the team produced (§10, permitted)",
      use: "The team's final budget file carried in place of the first, and the team's one-page budget summary (6 October 2026) carried onto the Project Budget page as its opening section and published as a second Team's PDF, its effort-range chart redrawn in the portal's palette. No figure changed."
    }
  ],
  notUsedFor: [
    "The individual estimation memos, submitted separately (not permitted under §10).",
    "The estimates themselves, the ranges, the budget's assumptions, rates, reserves and figures, and any go/no-go reasoning, which are the team's (not permitted under §10)."
  ],
  changedOrRejected: null as string | null
};
