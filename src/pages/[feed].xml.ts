import type { APIRoute } from "astro";
import { url } from "@/lib/paths";
import { sections, site as siteConfig } from "@/config/site";
import { getPublishedEntries, getEntryPath } from "@/lib/content";

export function getStaticPaths() {
  return process.env.SITE_URL ? ["rss", "sitemap"].map((feed) => ({ params: { feed } })) : [];
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
}

export const GET: APIRoute = async ({ params, site }) => {
  if (!site) return new Response(null, { status: 404 });
  const entries = await getPublishedEntries();
  const absolute = (path: string) => escapeXml(new URL(url(path), site).href);

  const content = params.feed === "sitemap"
    ? [
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...[`/`, ...sections.map((section) => `/${section.id}/`)].map((path) => `<url><loc>${absolute(path)}</loc></url>`),
      ...entries.map((entry) => `<url><loc>${absolute(getEntryPath(entry))}</loc><lastmod>${entry.data.updatedAt || entry.data.publishedAt}</lastmod></url>`),
      `</urlset>`,
    ].join("")
    : [
      `<rss version="2.0"><channel>`,
      `<title>${escapeXml(siteConfig.name)}</title>`,
      `<link>${absolute("/")}</link>`,
      `<description>${escapeXml(siteConfig.description)}</description>`,
      `<language>${siteConfig.language}</language>`,
      ...entries.map((entry) => [
        `<item>`,
        `<title>${escapeXml(entry.data.title)}</title>`,
        `<link>${absolute(getEntryPath(entry))}</link>`,
        `<guid>${absolute(getEntryPath(entry))}</guid>`,
        `<description>${escapeXml(entry.data.description)}</description>`,
        `<pubDate>${new Date(`${entry.data.publishedAt}T00:00:00+08:00`).toUTCString()}</pubDate>`,
        `</item>`,
      ].join("")),
      `</channel></rss>`,
    ].join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>${content}`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
