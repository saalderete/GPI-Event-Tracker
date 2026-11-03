// Sprint 4 AI use disclosure (guidelines §10). The sprint's documents are
// the team's own files, delivered as PDFs; the retrospective and the peer
// evaluation are submitted through Blackboard and never on the portal, so
// this file carries the disclosure only.
export const aiDisclosure = {
  tool: "Claude (Anthropic), through Claude Code",
  stages: [
    {
      stage: "Website construction (§5); summarizing content the team produced (§10, permitted)",
      use: "The cover pages of the Service Level Indicators, the Error Budget and Policy and the Sketches, written from the delivered files and quoting them rather than restating them; the Sprint 4 change log drafted from the repository's commit record and the documents; the registry entries and the sprint page; and this disclosure."
    },
    {
      stage: "Website construction (§5)",
      use: "The Gracias Por Invitar event site, built at the portal lead's direction from the team's design direction, with sample data and generated pictures labeled as such, and moved to its own repository on 2 November 2026. Recorded in the AI log."
    }
  ],
  notUsedFor: [
    "The Service Level Indicators and the Error Budget and Policy themselves: the definitions, tools, schedules, owners, targets, budgets, policies, escalation times, incident roles and the incident review are the team's, as delivered.",
    "The sketches, which the team drew by hand.",
    "The sprint retrospective and the peer evaluation, which are private and not permitted."
  ],
  changedOrRejected: null as string | null
};
