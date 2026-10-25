import type { APIRoute } from "astro";
import { url } from "@/lib/paths";

export const GET: APIRoute = ({ site }) => new Response(
  site ? `User-agent: *\nAllow: /\nSitemap: ${new URL(url("/sitemap.xml"), site).href}\n` : "User-agent: *\nDisallow: /\n",
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
