export const sections = [
  {
    id: "weekly",
    label: "Weekly",
    name: "Weekly notes",
    description: "Reading, experiments, and ideas collected week by week.",
  },
  {
    id: "work",
    label: "Work",
    name: "Selected work",
    description: "Projects shaped through design and development.",
  },
  {
    id: "elsewhere",
    label: "Elsewhere",
    name: "Elsewhere",
    description: "Observations, references, and ideas found along the way.",
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
  resume: "/resume/zephyr-resume.pdf",
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
  contact: "Work with me",
  opensNewTab: "opens in a new tab",
  home: {
    heroLead: "Notes, ideas,",
    heroTail: "and projects.",
    readLatest: "Read the latest",
    recentNotes: "Recent notes",
    browseWeekly: "Browse Weekly",
    selectedWork: "Selected work",
    allWork: "All work",
    independentWork: "Independent work",
  },
  notes: "Notes",
  notFound: {
    title: "Page not found",
    heading: "Page not found.",
    backHome: "Back home",
  },
} as const;
