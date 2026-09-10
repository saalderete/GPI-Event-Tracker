// One icon family for the whole site: Phosphor, regular weight. The names
// below are the site's vocabulary; the mapping to Phosphor glyphs lives here
// so a swap never touches a page.
import type { ComponentProps } from "react";
import {
  ArrowRight,
  ArrowSquareOut,
  CaretDown,
  Check,
  DownloadSimple,
  FileText,
  House,
  Link as LinkGlyph,
  LockSimple,
  MagnifyingGlass,
  Moon,
  Palette,
  Printer,
  Quotes,
  SquaresFour,
  Sun,
  Users,
  X
} from "@phosphor-icons/react/ssr";

type P = ComponentProps<typeof House>;
const base = (p: P): P => ({ weight: "regular", "aria-hidden": true, ...p });

export const IconHome = (p: P) => <House {...base(p)} />;
export const IconUsers = (p: P) => <Users {...base(p)} />;
export const IconFile = (p: P) => <FileText {...base(p)} />;
export const IconGrid = (p: P) => <SquaresFour {...base(p)} />;
export const IconClose = (p: P) => <X {...base(p)} />;
export const IconChevron = (p: P) => <CaretDown {...base(p)} />;
export const IconDownload = (p: P) => <DownloadSimple {...base(p)} />;
export const IconPrint = (p: P) => <Printer {...base(p)} />;
export const IconLink = (p: P) => <LinkGlyph {...base(p)} />;
export const IconExternal = (p: P) => <ArrowSquareOut {...base(p)} />;
export const IconSun = (p: P) => <Sun {...base(p)} />;
export const IconMoon = (p: P) => <Moon {...base(p)} />;
export const IconPalette = (p: P) => <Palette {...base(p)} />;
export const IconSearch = (p: P) => <MagnifyingGlass {...base(p)} />;
export const IconCheck = (p: P) => <Check {...base(p)} />;
export const IconArrow = (p: P) => <ArrowRight {...base(p)} />;
export const IconQuote = (p: P) => <Quotes {...base(p)} />;
export const IconLock = (p: P) => <LockSimple {...base(p)} />;
