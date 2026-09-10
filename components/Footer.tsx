import { site } from "@/lib/site";
import { build } from "@/lib/base";
import { fmtStamp } from "@/lib/format";
import { ThemeControls } from "./ThemeControls";
import { IconExternal, IconLock } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border pt-8 pb-28 md:pb-10 no-print">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div className="space-y-3">
          <p className="meta">
            Built {fmtStamp(build.at)}
            {build.commit ? (
              <>
                {" "}from commit{" "}
                <a className="underline hover:text-ink" href={`${site.repo}/commit/${build.commit}`} target="_blank" rel="noopener">
                  {build.short}
                </a>
              </>
            ) : null}
            . The course checks deployment time; this is when the site was built.
          </p>
          <p className="meta flex items-start gap-2">
            <IconLock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Sprint retrospectives and peer evaluations are submitted privately through Blackboard and are never published here.</span>
          </p>
          <p className="meta">
            {site.name}. {site.courseLine}.{" "}
            <a className="inline-flex items-center gap-1 underline hover:text-ink" href={site.repo} target="_blank" rel="noopener">
              Source on GitHub <IconExternal className="h-3 w-3" />
            </a>
          </p>
        </div>
        <div className="md:hidden">
          <ThemeControls variant="inline" />
        </div>
      </div>
    </footer>
  );
}
