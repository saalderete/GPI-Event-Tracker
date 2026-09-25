import type { ReactNode } from "react";
import { Rail } from "./Rail";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { ReadingProgress } from "./ReadingProgress";
import { Arcade } from "./Arcade";

// Rail on the left, the page on the right, the phone bar underneath, the
// reading line along the top, and a hidden arcade (five quick clicks on
// nothing). A
// `hero` renders full-bleed above the padded column; with `board` the column
// is written straight onto the whiteboard the Home clip holds on, above the
// fixed layer that carries it.
export function Shell({ children, hero, board = false }: { children: ReactNode; hero?: ReactNode; board?: boolean }) {
  const body = (
    <>
      {children}
      <Footer />
    </>
  );
  return (
    <div className="reveal-scope flex min-h-dvh">
      <ReadingProgress />
      <Reveal />
      <Rail />
      <div className="min-w-0 flex-1">
        {hero}
        {board ? (
          <main className="relative z-[1] mx-auto w-full max-w-[1180px] px-5 sm:px-8 md:px-10">
            <div className="board">{body}</div>
          </main>
        ) : (
          <main className={`mx-auto w-full max-w-[1180px] px-5 pb-8 sm:px-8 md:px-10 ${hero ? "pt-12 md:pt-16" : "pt-8 md:pt-10"}`}>{body}</main>
        )}
      </div>
      <MobileNav />
      <Arcade />
    </div>
  );
}
