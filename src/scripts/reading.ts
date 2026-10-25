import { getActiveHeadingIndex } from "@/lib/reading-position";

const article = document.querySelector<HTMLElement>("[data-article-body]");
const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")];

if (article && links.length > 0) {
  const headings = [...article.querySelectorAll<HTMLElement>("h2[id]")];
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const scroll = document.querySelector<HTMLElement>("[data-elastic-scroll]");
  const content = document.querySelector<HTMLElement>("[data-elastic-content]");
  const linksById = new Map<string, HTMLAnchorElement[]>();
  let positions: number[] = [];
  let headerOffset = 96;
  let maxScrollY = 0;
  let activeId = "";
  let frame = 0;
  let pendingAnchor: string | null = null;
  let pinnedAnchor: { id: string; top: number } | null = null;
  let disposed = false;

  function decodeHash(hash: string): string {
    try {
      return decodeURIComponent(hash.slice(1));
    } catch {
      return hash.slice(1);
    }
  }

  const getScrollTop = () => scroll?.scrollTop ?? window.scrollY;

  for (const link of links) {
    link.dataset.active = "false";
    link.removeAttribute("aria-current");
    const id = decodeHash(new URL(link.href, window.location.href).hash);
    linksById.set(id, [...(linksById.get(id) ?? []), link]);
  }

  function activate(id: string) {
    if (!id || activeId === id) return;
    for (const link of linksById.get(activeId) ?? []) {
      link.dataset.active = "false";
      link.removeAttribute("aria-current");
    }
    for (const link of linksById.get(id) ?? []) {
      link.dataset.active = "true";
      link.setAttribute("aria-current", "location");
    }
    activeId = id;
  }

  function updateActive() {
    frame = 0;
    if (positions.length === 0) return;
    const scrollY = getScrollTop();
    if (pendingAnchor) {
      pinnedAnchor = { id: pendingAnchor, top: scrollY };
      pendingAnchor = null;
    }
    if (pinnedAnchor && Math.abs(scrollY - pinnedAnchor.top) <= 0.5) {
      activate(pinnedAnchor.id);
      return;
    }
    pinnedAnchor = null;
    const index = getActiveHeadingIndex(positions, scrollY, maxScrollY, headerOffset);
    if (index >= 0) activate(headings[index].id);
  }

  function scheduleUpdate() {
    if (frame === 0) frame = window.requestAnimationFrame(updateActive);
  }

  function measure() {
    if (disposed) return;
    headerOffset = (header?.getBoundingClientRect().height ?? 64) + 32;
    const origin = content?.getBoundingClientRect().top
      ?? (scroll ? scroll.getBoundingClientRect().top - scroll.scrollTop : -window.scrollY);
    positions = headings.map((heading) => heading.getBoundingClientRect().top - origin);
    maxScrollY = Math.max(0, (scroll?.scrollHeight ?? document.documentElement.scrollHeight) - (scroll?.clientHeight ?? window.innerHeight));
    scheduleUpdate();
  }

  function selectHash() {
    const id = decodeHash(window.location.hash);
    pendingAnchor = linksById.has(id) ? id : null;
    if (!pendingAnchor) pinnedAnchor = null;
    scheduleUpdate();
  }

  function selectLink(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const link = event.currentTarget as HTMLAnchorElement;
    pendingAnchor = decodeHash(link.hash);
    scheduleUpdate();
  }

  const layoutObserver = new ResizeObserver(measure);
  layoutObserver.observe(content ?? article.closest("main") ?? article);
  if (header) layoutObserver.observe(header);
  if (scroll) layoutObserver.observe(scroll);
  (scroll ?? window).addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("hashchange", selectHash);
  window.addEventListener("load", selectHash);
  links.forEach((link) => link.addEventListener("click", selectLink));
  const restoreLayout = (event: PageTransitionEvent) => {
    if (event.persisted) measure();
  };
  window.addEventListener("pageshow", restoreLayout);
  document.fonts.ready.then(() => {
    if (disposed) return;
    measure();
  });
  measure();
  selectHash();

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    disposed = true;
    layoutObserver.disconnect();
    window.cancelAnimationFrame(frame);
    (scroll ?? window).removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", measure);
    window.removeEventListener("hashchange", selectHash);
    window.removeEventListener("load", selectHash);
    window.removeEventListener("pageshow", restoreLayout);
    links.forEach((link) => link.removeEventListener("click", selectLink));
  });
}

export {};
