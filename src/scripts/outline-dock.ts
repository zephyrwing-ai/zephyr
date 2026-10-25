const outline = document.querySelector<HTMLElement>(".page-outline");
const links = outline ? [...outline.querySelectorAll<HTMLElement>("[data-toc-link]")] : [];
const desktopPointer = window.matchMedia("(hover: hover) and (min-width: 1280px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (outline && links.length > 0) {
  let centers: { x: number; y: number }[] = [];
  let pointerX: number | null = null;
  let pointerY: number | null = null;
  let frame = 0;

  const measure = () => {
    centers = links.map((link) => {
      const origin = (link.offsetParent ?? outline).getBoundingClientRect();
      // Layout coordinates stay stable while the link is magnified.
      return { x: origin.left + link.offsetLeft + link.offsetWidth / 2, y: origin.top + link.offsetTop + link.offsetHeight / 2 };
    });
  };

  const reset = () => {
    pointerX = null;
    pointerY = null;
    cancelAnimationFrame(frame);
    frame = 0;
    for (const link of links) {
      link.style.removeProperty("--outline-dock-scale");
      link.style.removeProperty("--outline-dock-lift");
    }
  };

  const render = () => {
    frame = 0;
    if (pointerX === null || pointerY === null) return;
    links.forEach((link, index) => {
      const center = centers[index]!;
      const distance = Math.hypot(pointerX! - center.x, pointerY! - center.y);
      const influence = Math.max(0, 1 - distance / 78);
      const eased = influence * influence * (3 - 2 * influence);
      link.style.setProperty("--outline-dock-scale", (1 + eased * 0.12).toFixed(3));
      link.style.setProperty("--outline-dock-lift", `${(-eased * 3).toFixed(2)}px`);
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!desktopPointer.matches || reducedMotion.matches || event.pointerType === "touch") {
      reset();
      return;
    }
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(render);
  };

  outline.addEventListener("pointermove", onPointerMove, { passive: true });
  outline.addEventListener("pointerenter", measure);
  outline.addEventListener("pointerleave", reset);
  window.addEventListener("resize", measure, { passive: true });
  desktopPointer.addEventListener("change", reset);
  reducedMotion.addEventListener("change", reset);
  const layoutObserver = new ResizeObserver(measure);
  layoutObserver.observe(outline);
  document.fonts.ready.then(measure);
  measure();
}

export {};
