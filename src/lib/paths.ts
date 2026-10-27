import type { Locale } from "@/config/site";

/** Resolves a root-relative path against Astro's configured base. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\/+/, "");
  return trimmed ? `${base}${trimmed}` : base;
}

/** Adds the locale prefix used by localized site routes. */
export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return normalized;
  return normalized === "/" ? "/zh/" : `/zh${normalized}`;
}

export function localizeUrl(path: string, locale: Locale): string {
  return url(localizePath(path, locale));
}

/** Removes the configured base so the pathname matches navigation hrefs. */
export function toSitePath(pathname: string): string {
  const base = import.meta.env.BASE_URL;
  if (base === "/") return pathname;
  return pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
}
