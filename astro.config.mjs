import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.SITE_URL ? "/zephyr/" : "/",
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: "github-light" } },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
