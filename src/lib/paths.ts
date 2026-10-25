/** Resolves a root-relative path against Astro's configured base. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\/+/, "");
  return trimmed ? `${base}${trimmed}` : base;
}

/** Removes the configured base so the pathname matches navigation hrefs. */
export function toSitePath(pathname: string): string {
  const base = import.meta.env.BASE_URL;
  if (base === "/") return pathname;
  return pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
}
