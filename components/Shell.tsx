import type { ReactNode } from "react";
import { Rail } from "./Rail";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";

// Rail on the left, the page on the right, the phone bar underneath. A
// `hero` renders full-bleed above the padded column (the scroll hero).
export function Shell({ children, hero }: { children: ReactNode; hero?: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Rail />
      <div className="min-w-0 flex-1">
        {hero}
        <main className={`mx-auto w-full max-w-[1180px] px-5 pb-8 sm:px-8 md:px-10 ${hero ? "pt-12 md:pt-16" : "pt-8 md:pt-10"}`}>
          {children}
          <Footer />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
