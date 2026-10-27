export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const sectionIds = ["weekly", "life", "project"] as const;

export type SectionId = (typeof sectionIds)[number];

interface SectionCopy {
  label: string;
  name: string;
  description: string;
}

const sectionCopy: Record<Locale, Record<SectionId, SectionCopy>> = {
  en: {
    weekly: {
      label: "Weekly",
      name: "Weekly notes",
      description: "Reading, experiments, and ideas collected week by week.",
    },
    life: {
      label: "Life",
      name: "Life & observations",
      description: "Architecture, design, and things noticed along the way.",
    },
    project: {
      label: "Project",
      name: "Selected projects",
      description: "Ideas taking shape through design and development.",
    },
  },
  zh: {
    weekly: {
      label: "周记",
      name: "每周记录",
      description: "按周整理阅读、实验与想法。",
    },
    life: {
      label: "生活",
      name: "生活与观察",
      description: "建筑、设计，以及沿途留意到的事物。",
    },
    project: {
      label: "项目",
      name: "精选项目",
      description: "通过设计与开发逐渐成形的想法。",
    },
  },
};

export function getSections(locale: Locale) {
  return sectionIds.map((id) => ({ id, ...sectionCopy[locale][id] }));
}

export function getSection(id: string, locale: Locale = "en") {
  const sectionId = sectionIds.find((candidate) => candidate === id);
  return sectionId ? { id: sectionId, ...sectionCopy[locale][sectionId] } : undefined;
}

export const site = {
  name: "Zephyr",
  title: {
    en: "Zephyr — Notes, ideas, and projects",
    zh: "Zephyr — 记录、想法与项目",
  },
  description: {
    en: "Notes, observations, and projects by Zephyr.",
    zh: "Zephyr 的记录、观察与项目。",
  },
  github: "https://github.com/zephyrwing-ai",
  x: "https://x.com/zhngzhmng28226",
  email: "zephyr200412@gmail.com",
};

export const localeOptions = {
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    label: "EN",
  },
  zh: {
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    label: "中文",
  },
} as const satisfies Record<Locale, { htmlLang: string; ogLocale: string; label: string }>;

export const ui = {
  en: {
    skipToContent: "Skip to content",
    homeAria: "Zephyr home",
    mainNavigation: "Main navigation",
    contentNavigation: "Content navigation",
    articleNavigation: "Article navigation",
    articleSections: "Article sections",
    language: "Language",
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
  },
  zh: {
    skipToContent: "跳到正文",
    homeAria: "Zephyr 首页",
    mainNavigation: "主导航",
    contentNavigation: "内容导航",
    articleNavigation: "文章导航",
    articleSections: "文章目录",
    language: "语言",
    openArticleNavigation: "打开文章导航",
    articles: "文章",
    chooseArticle: "选择文章",
    contact: "联系",
    opensNewTab: "在新标签页打开",
    home: {
      heroLead: "记录，观察，",
      heroTail: "也创造。",
      readLatest: "阅读最新内容",
      recentNotes: "最近更新",
      browseWeekly: "查看周记",
      selectedProjects: "精选项目",
      allProjects: "全部项目",
      independentProject: "独立项目",
    },
    notes: "随记",
    notFound: {
      title: "页面不存在",
      heading: "页面不存在。",
      backHome: "返回首页",
    },
  },
} as const;
