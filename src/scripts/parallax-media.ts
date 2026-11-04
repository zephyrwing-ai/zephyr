const bands = [...document.querySelectorAll<HTMLElement>("[data-parallax-band]")];

if (bands.length > 0) {
  const scroll = document.querySelector<HTMLElement>("[data-elastic-scroll]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const activeBands = new Set<HTMLElement>();
  let frame = 0;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const clearShift = (band: HTMLElement) => {
    band.querySelector<HTMLElement>("[data-parallax-media]")?.style.removeProperty("--parallax-shift");
  };

  const paintBand = (band: HTMLElement, viewportHeight: number, maxShift: number) => {
    const media = band.querySelector<HTMLElement>("[data-parallax-media]");
    if (!media) return;

    const rect = band.getBoundingClientRect();
    const travel = rect.height + viewportHeight;
    const progress = clamp((viewportHeight - rect.top) / travel, 0, 1);
    const shift = (progress - 0.5) * 2 * maxShift;
    media.style.setProperty("--parallax-shift", `${shift.toFixed(2)}px`);
  };

  const paint = () => {
    const viewportHeight = scroll?.clientHeight ?? window.innerHeight;
    const maxShift = window.innerWidth <= 599 ? 16 : 36;
    for (const band of activeBands) paintBand(band, viewportHeight, maxShift);
  };

  const update = () => {
    frame = 0;
    if (!reducedMotion.matches) paint();
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeBands.add(entry.target as HTMLElement);
        else activeBands.delete(entry.target as HTMLElement);
      }
      schedule();
    },
    { root: scroll ?? null, rootMargin: "20% 0px" },
  );

  for (const band of bands) {
    activeBands.add(band);
    observer.observe(band);
  }
  if (!reducedMotion.matches) paint();
  (scroll ?? window).addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) bands.forEach(clearShift);
    schedule();
  });

  schedule();

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    observer.disconnect();
    window.cancelAnimationFrame(frame);
    (scroll ?? window).removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  });
}

export {};
