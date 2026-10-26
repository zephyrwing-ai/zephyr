import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = process.env.SITE_URL;
const base = siteUrl ? `${new URL(siteUrl).pathname.replace(/\/+$/, "")}/` : "/";

/**
 * Markdown authors write root-relative paths such as `/images/a.svg`.
 * GitHub project pages serve the site from a base path, so prefix them once here
 * instead of asking every article to know the deployment URL.
 */
function prefixBaseUrls(prefix) {
  return () => (tree) => {
    const walk = (node) => {
      if (node.type === "element") {
        const key = node.tagName === "img" ? "src" : node.tagName === "a" ? "href" : null;
        const value = key ? node.properties?.[key] : null;
        if (key && typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith(prefix)) {
          node.properties[key] = `${prefix}${value.slice(1)}`;
        }
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: siteUrl || undefined,
  base,
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { theme: "github-light" },
    processor: unified({
      rehypePlugins: base === "/" ? [] : [prefixBaseUrls(base)],
    }),
  },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
