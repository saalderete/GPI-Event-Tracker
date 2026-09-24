import type { ComponentType } from "react";

// The MDX behind each document page. Keys are "<sprint>/<doc>". The evidence
// appendix renders from data rather than MDX, so it is not listed here.
export const docModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  "sprint-1/market-research": () => import("@/content/sprint-1/market-research.mdx"),
  "sprint-1/business-strategy": () => import("@/content/sprint-1/business-strategy.mdx"),
  "sprint-1/project-charter": () => import("@/content/sprint-1/project-charter.mdx"),
  "sprint-2/estimation-appendix": () => import("@/content/sprint-2/estimation-appendix.mdx")
};
