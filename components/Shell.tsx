import type { ReactNode } from "react";
import { Rail } from "./Rail";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";

// Rail on the left, the page on the right, the phone bar underneath. A
// `hero` renders full-bleed above the padded column; with `sheet` the column
// becomes one paper sheet riding over a fixed background (the desk page).
export function Shell({ children, hero, sheet = false }: { children: ReactNode; hero?: ReactNode; sheet?: boolean }) {
  const body = (
    <>
      {children}
      <Footer />
    </>
  );
  return (
    <div className="flex min-h-dvh">
      <Rail />
      <div className="min-w-0 flex-1">
        {hero}
        {sheet ? (
          <main className="relative z-[1] mx-auto w-full max-w-[1180px] px-3 sm:px-6 md:px-8">
            <div className="sheet">{body}</div>
          </main>
        ) : (
          <main className={`mx-auto w-full max-w-[1180px] px-5 pb-8 sm:px-8 md:px-10 ${hero ? "pt-12 md:pt-16" : "pt-8 md:pt-10"}`}>{body}</main>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
