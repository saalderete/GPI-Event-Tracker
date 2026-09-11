import Link from "next/link";
import { Shell } from "@/components/Shell";
import { IconArrow } from "@/components/Icons";

export default function NotFound() {
  return (
    <Shell>
      <div className="py-16 sm:py-24" data-reveal>
        <p className="eyebrow">404</p>
        <h1 className="display display-wide mt-3 text-[2.6rem] sm:text-[3.6rem]">Not on the record.</h1>
        <p className="mt-4 max-w-[48ch] font-serif text-[1.1rem] text-ink-soft">
          That page does not exist yet, or moved. Sprint pages appear as each sprint concludes; everything published so far is reachable from Home.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to Home <IconArrow />
        </Link>
      </div>
    </Shell>
  );
}
