const outline = document.querySelector<HTMLElement>(".page-outline");
const rail = outline?.querySelector<HTMLElement>(".outline-rail") ?? null;
const links = rail ? [...rail.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")] : [];
const desktopPointer = window.matchMedia("(hover: hover) and (min-width: 1280px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (outline && rail && links.length > 0) {
  const outlineStyles = getComputedStyle(outline);
  const readPixels = (property: string, fallback: number) =>
    Number.parseFloat(outlineStyles.getPropertyValue(property)) || fallback;
  const dockRange = readPixels("--outline-dock-range", 78);
  const baseWidth = readPixels("--outline-mark-width", 10);
  const nearGrowth = readPixels("--outline-mark-near-growth", 6);
  let centers: number[] = [];
  let pointerY: number | null = null;
  let frame = 0;

  const decodeHash = (hash: string) => {
    try {
      return decodeURIComponent(hash.slice(1));
    } catch {
      return hash.slice(1);
    }
  };

  const getPreview = (id: string) => {
    let sibling = document.getElementById(id)?.nextElementSibling ?? null;
    while (sibling) {
      if (sibling instanceof HTMLHeadingElement && sibling.tagName === "H2") break;
      if (sibling instanceof HTMLParagraphElement) {
        const text = sibling.textContent?.replace(/\s+/g, " ").trim();
        if (text) return text;
      }
      sibling = sibling.nextElementSibling;
    }
    return "";
  };

  for (const link of links) {
    const preview = link.querySelector<HTMLElement>("[data-outline-preview]");
    if (preview) preview.textContent = getPreview(decodeHash(link.hash));
  }

  const measure = () => {
    centers = links.map((link) => {
      const rect = link.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
  };

  const reset = () => {
    pointerY = null;
    cancelAnimationFrame(frame);
    frame = 0;
    for (const link of links) {
      link.style.removeProperty("--outline-rendered-width");
    }
  };

  const render = () => {
    frame = 0;
    if (pointerY === null) return;
    links.forEach((link, index) => {
      const distance = Math.abs(pointerY! - centers[index]!);
      const influence = Math.max(0, 1 - distance / dockRange);
      const eased = influence * influence * (3 - 2 * influence);
      link.style.setProperty("--outline-rendered-width", `${(baseWidth + eased * nearGrowth).toFixed(2)}px`);
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!desktopPointer.matches || reducedMotion.matches || event.pointerType === "touch") {
      reset();
      return;
    }
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(render);
  };

  rail.addEventListener("pointermove", onPointerMove, { passive: true });
  rail.addEventListener("pointerenter", measure);
  rail.addEventListener("pointerleave", reset);
  window.addEventListener("resize", measure, { passive: true });
  desktopPointer.addEventListener("change", reset);
  reducedMotion.addEventListener("change", reset);
  const layoutObserver = new ResizeObserver(measure);
  layoutObserver.observe(rail);
  document.fonts.ready.then(measure);
  measure();
}

export {};
