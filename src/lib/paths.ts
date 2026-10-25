/** Resolves a root-relative path against Astro's configured base. */
export function url(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
