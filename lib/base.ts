// Links to files in /public (the generated PDFs) need the base path added by
// hand; next/link handles it for routes.
export const base = process.env.NEXT_PUBLIC_PORTAL_BASE ?? "";
export const withBase = (path: string) => `${base}${path}`;

/** Public origin of the deployed site, when the build knows it. */
export const publicUrl = (process.env.NEXT_PUBLIC_PORTAL_URL ?? "").replace(/\/$/, "");

export const build = {
  at: process.env.NEXT_PUBLIC_BUILT_AT ?? new Date(0).toISOString(),
  commit: process.env.NEXT_PUBLIC_COMMIT ?? "",
  get short() {
    return this.commit ? this.commit.slice(0, 7) : "local";
  }
};
