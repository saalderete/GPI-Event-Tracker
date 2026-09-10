import type { MDXComponents } from "mdx/types";
import { Callout, Draft, Figure } from "@/components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Callout, Draft, Figure, ...components };
}
