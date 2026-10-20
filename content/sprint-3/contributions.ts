// Sprint 3 AI use disclosure (guidelines §10). Sprint 3's individual
// requirements, each member's field notes and contradiction memo, are
// submitted separately and never on the portal, so this file carries the
// disclosure only.
export const aiDisclosure = {
  tool: "Claude (Anthropic), through Claude Code",
  stages: [
    {
      stage: "Restructuring content the team produced (§10, permitted)",
      use: "The team's Competitor Field Study file pre-filled at the portal lead's direction from the members' own interview records: each interview's row in the evidence log, the competitor map, the comparison table and the switching-trigger rows carried from the field notes and transcripts in the members' words, with an evidence ID on every claim. No interview response was written, changed or added."
    },
    {
      stage: "Restructuring content the team produced (§10, permitted)",
      use: "The submitted file finished on 19 October 2026: the requirements checklist marked against the evidence log, the three teardowns and two public pages cited in the comparison table in the words the team logged, the fifteen switching triggers ranked by a rule stated in the file (heard as behavior in the most interviews, or with a real cost; the opinion row last), and the status table brought up to date. The change note's rationale, the risk entries and the interview content are the team's."
    },
    {
      stage: "Website construction (§5); summarizing content the team produced (§10, permitted)",
      use: "This document's cover page, the Sprint 3 change log drafted from the repository's commit record and the document itself, the sprint page's contents, and this disclosure."
    }
  ],
  notUsedFor: [
    "Conducting or writing interview responses, the field notes or the contradiction memos, which each member wrote from their own interviews (not permitted under the session's rules and §10).",
    "The change note's rationale, the risk entries' triggers, owners and mitigations, and any go/no-go reasoning, which are the team's (not permitted)."
  ],
  changedOrRejected: null as string | null
};
