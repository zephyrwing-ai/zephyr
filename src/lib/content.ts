import { getCollection, type CollectionEntry } from "astro:content";
import type { SectionId } from "../config/site";

export type Entry = CollectionEntry<"entries">;

export type NavGroup = {
  label: string;
  collapsible?: boolean;
  showLabel?: boolean;
  items: { label: string; href: string; description?: string }[];
};

const shanghaiCalendar = new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function todayInShanghai(): string {
  const parts = shanghaiCalendar.formatToParts(new Date());
  const date = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${date.year}-${date.month}-${date.day}`;
}

export function getEntrySlug(entry: Entry): string {
  const slug = entry.id.split("/").at(-1)?.replace(/\.(md|mdx)$/i, "");
  if (!slug) throw new Error(`Entry requires a valid filename slug: ${entry.id}`);
  return slug;
}

export function getEntryHref(entry: Entry): string {
  return `/${entry.data.section}/${getEntrySlug(entry)}/`;
}

export async function getPublishedEntries(): Promise<Entry[]> {
  const entries = await getCollection("entries");
  const routes = new Map<string, string>();

  for (const entry of entries) {
    const href = getEntryHref(entry);
    const previous = routes.get(href);
    if (previous) {
      throw new Error(`Duplicate entry route: ${href}. Use different filenames for ${previous} and ${entry.id}.`);
    }
    routes.set(href, entry.id);
  }

  const today = todayInShanghai();
  return entries
    .filter(({ data }) => !data.draft && data.publishedAt <= today)
    .sort((a, b) => {
      const byDate = b.data.publishedAt.localeCompare(a.data.publishedAt);
      return byDate || a.id.localeCompare(b.id);
    });
}

export function getSectionGroups(section: SectionId, entries: Entry[]): NavGroup[] {
  const groups = new Map<string, Entry[]>();

  for (const entry of entries) {
    if (entry.data.section !== section) continue;
    const label = section === "weekly"
      ? entry.data.publishedAt.slice(0, 4)
      : section === "life"
        ? entry.data.topic ?? "Notes"
        : "";
    const group = groups.get(label) ?? [];
    group.push(entry);
    groups.set(label, group);
  }

  return [...groups].map(([label, items]) => ({
    label,
    collapsible: section === "weekly",
    showLabel: section !== "project",
    items: items.map((entry) => ({
      label: entry.data.title,
      href: getEntryHref(entry),
      description: entry.data.description,
    })),
  }));
}

export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}
