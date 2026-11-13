import type { ComponentType } from "react";

// The MDX behind each document page. Keys are "<sprint>/<doc>". The evidence
// appendix renders from data rather than MDX, so it is not listed here.
export const docModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  "sprint-1/market-research": () => import("@/content/sprint-1/market-research.mdx"),
  "sprint-1/business-strategy": () => import("@/content/sprint-1/business-strategy.mdx"),
  "sprint-1/project-charter": () => import("@/content/sprint-1/project-charter.mdx"),
  "sprint-2/estimation-appendix": () => import("@/content/sprint-2/estimation-appendix.mdx"),
  "sprint-2/budget": () => import("@/content/sprint-2/budget.mdx"),
  "sprint-2/change-log": () => import("@/content/sprint-2/change-log.mdx"),
  "sprint-3/competitor-field-study": () => import("@/content/sprint-3/competitor-field-study.mdx"),
  "sprint-3/change-log": () => import("@/content/sprint-3/change-log.mdx"),
  "sprint-4/service-level-indicators": () => import("@/content/sprint-4/service-level-indicators.mdx"),
  "sprint-4/error-budget-policy": () => import("@/content/sprint-4/error-budget-policy.mdx"),
  "sprint-4/sketches": () => import("@/content/sprint-4/sketches.mdx"),
  "sprint-4/change-log": () => import("@/content/sprint-4/change-log.mdx"),
  "sprint-5/crisis-response-memo": () => import("@/content/sprint-5/crisis-response-memo.mdx"),
  "sprint-5/wireframes": () => import("@/content/sprint-5/wireframes.mdx"),
  "sprint-5/mockups": () => import("@/content/sprint-5/mockups.mdx"),
  "sprint-5/change-log": () => import("@/content/sprint-5/change-log.mdx")
};
