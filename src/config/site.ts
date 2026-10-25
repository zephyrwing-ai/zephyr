export const sections = [
  { id: "weekly", label: "Weekly", name: "Weekly notes", description: "Reading, experiments, and ideas collected week by week." },
  { id: "life", label: "Life", name: "Life & observations", description: "Architecture, design, and things noticed along the way." },
  { id: "project", label: "Project", name: "Selected projects", description: "Ideas taking shape through design and development." },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const site = {
  name: "Zephyr",
  title: "Zephyr — Notes, ideas, and projects",
  description: "Notes, observations, and projects by Zephyr.",
  github: "https://github.com/zephyrwing-ai",
  x: "https://x.com/zhngzhmng28226",
  email: "zephyr200412@gmail.com",
  language: "en",
};

export function getSection(id: string) {
  return sections.find((section) => section.id === id);
}
