import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Callout, Draft, Figure, OpenDocument, Sheet } from "@/components/mdx";
import { Chart } from "@/components/BudgetChart";

// Tables get a wrapper that scrolls sideways on narrow screens, so a wide
// table never squeezes its columns or widens the page.
function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Callout, Chart, Draft, Figure, OpenDocument, Sheet, table: Table, ...components };
}
