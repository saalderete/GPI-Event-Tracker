import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./accents.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} · Living Project Portal`,
    template: `%s · ${site.short} Portal`
  },
  description: `${site.tagline} This portal is the sprint-by-sprint record of how the project is being managed for ${site.course} at ${site.university}.`
};

// Restores the visitor's theme and accent before first paint. Kept inline
// and tiny so there is no flash of the wrong theme.
const themeInit = `(function(){try{var d=document.documentElement;d.setAttribute("data-js","");var t=localStorage.getItem("gpi-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-theme",t);var a=localStorage.getItem("gpi-accent");var m={chile:"adobe",sol:"desierto",turquesa:"cielo"};if(a){a=m[a]||a;d.setAttribute("data-accent",a)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
