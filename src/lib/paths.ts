/** Resolves a root-relative path against Astro's configured base. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\/+/, "");
  return trimmed ? `${base}${trimmed}` : base;
}
