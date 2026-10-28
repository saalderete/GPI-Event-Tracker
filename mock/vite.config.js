import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The mock lives inside the portal at /mock/: Vite builds straight into the
// portal's public/ folder (gitignored there), and `next build` ships it with
// the rest of the site. scripts/routes.mjs then copies index.html into each
// route folder so deep links work as plain files.
export default defineConfig({
  base: "/mock/",
  plugins: [react(), tailwindcss()],
  build: { outDir: "../public/mock", emptyOutDir: true }
});
