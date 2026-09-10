import createMDX from "@next/mdx";
import { execSync } from "node:child_process";

// Set PORTAL_BASE (and NEXT_PUBLIC_PORTAL_BASE, same value) to build a copy
// that lives under a subpath. GitHub Pages serves a project site at
// /<repo-name>/, so the deploy workflow derives this from the repo name; a
// rename of the repository changes nothing here.
const base = process.env.PORTAL_BASE ?? "";

// The build stamp. The instructor checks deployment time, so the portal
// wears it: every page footer shows when and from which commit it was built.
const builtAt = new Date().toISOString();
let commit = process.env.GITHUB_SHA ?? "";
if (!commit) {
  try {
    commit = execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    commit = "";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: base,
  // Plain files any host will serve. The course requires free hosting and a
  // public repo; a static export drops onto GitHub Pages with nothing to run.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "mdx"],
  env: {
    NEXT_PUBLIC_PORTAL_BASE: base,
    // Public URL of the deployed site, for the PDF cover. Optional.
    NEXT_PUBLIC_PORTAL_URL: process.env.PORTAL_URL ?? "",
    NEXT_PUBLIC_BUILT_AT: builtAt,
    NEXT_PUBLIC_COMMIT: commit
  }
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Strings, not imports: the Turbopack MDX loader needs serialisable options.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"]
  }
});

export default withMDX(nextConfig);
