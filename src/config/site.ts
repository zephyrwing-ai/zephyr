export const sections = [
  {
    id: "weekly",
    label: "Weekly",
    name: "Weekly notes",
    description: "Reading, experiments, and ideas collected week by week.",
  },
  {
    id: "life",
    label: "Life",
    name: "Life & observations",
    description: "Architecture, design, and things noticed along the way.",
  },
  {
    id: "project",
    label: "Project",
    name: "Selected projects",
    description: "Ideas taking shape through design and development.",
  },
] as const;

export type Section = (typeof sections)[number];
export type SectionId = Section["id"];

export function getSection(id: string) {
  return sections.find((section) => section.id === id);
}

export const site = {
  name: "Zephyr",
  title: "Zephyr — Notes, ideas, and projects",
  description: "Notes, observations, and projects by Zephyr.",
  language: "en",
  ogLocale: "en_US",
  avatar: {
    src: "/images/zephyr-avatar.jpg",
    width: 512,
    height: 512,
  },
  github: "https://github.com/zephyrwing-ai",
  x: "https://x.com/zhngzhmng28226",
  email: "zephyr200412@gmail.com",
} as const;

export const ui = {
  skipToContent: "Skip to content",
  homeAria: "Zephyr home",
  mainNavigation: "Main navigation",
  contentNavigation: "Content navigation",
  articleNavigation: "Article navigation",
  articleSections: "Article sections",
  openArticleNavigation: "Open article navigation",
  articles: "Articles",
  chooseArticle: "Choose an article",
  contact: "Contact",
  opensNewTab: "opens in a new tab",
  home: {
    heroLead: "Notes, ideas,",
    heroTail: "and projects.",
    readLatest: "Read the latest",
    recentNotes: "Recent notes",
    browseWeekly: "Browse Weekly",
    selectedProjects: "Selected projects",
    allProjects: "All projects",
    independentProject: "Independent project",
  },
  notes: "Notes",
  notFound: {
    title: "Page not found",
    heading: "Page not found.",
    backHome: "Back home",
  },
} as const;
