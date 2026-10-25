const MAX_OFFSET = 96;
const SATURATION = 400;
const OMEGA = 28;
const ZETA = 0.9;
const WHEEL_IDLE_MS = 40;
const TRACK_MAX_MS = 200;
const GESTURE_GAP_MS = 160;

type Phase = "idle" | "tracking" | "returning";

function offsetFromPull(pull: number): number {
  return Math.sign(pull) * MAX_OFFSET * (1 - 1 / (Math.abs(pull) / SATURATION + 1));
}

function pullFromOffset(offset: number): number {
  const magnitude = Math.min(Math.abs(offset), MAX_OFFSET - 0.01);
  return Math.sign(offset) * SATURATION * (MAX_OFFSET / (MAX_OFFSET - magnitude) - 1);
}

function springStep(position: number, velocity: number, delta: number): [number, number] {
  const decay = ZETA * OMEGA;
  const frequency = OMEGA * Math.sqrt(1 - ZETA * ZETA);
  const envelope = Math.exp(-decay * delta);
  const sine = Math.sin(frequency * delta);
  const cosine = Math.cos(frequency * delta);
  return [
    envelope * (position * cosine + ((velocity + decay * position) / frequency) * sine),
    envelope * (velocity * cosine - ((decay * velocity + OMEGA * OMEGA * position) / frequency) * sine),
  ];
}

function nestedScrolls(target: EventTarget | null, delta: number): boolean {
  let element = target instanceof Element ? target : null;
  while (element) {
    const max = element.scrollHeight - element.clientHeight;
    if (max > 1 && /^(auto|scroll)$/.test(getComputedStyle(element).overflowY)) {
      if ((delta < 0 && element.scrollTop > 0.5) || (delta > 0 && element.scrollTop < max - 0.5)) return true;
    }
    element = element.parentElement;
  }
  return false;
}

function setupElasticScroll(): void {
  const scroll = document.querySelector<HTMLElement>("[data-elastic-scroll]");
  const content = document.querySelector<HTMLElement>("[data-elastic-content]");
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  if (!scroll || !content) return;

  let phase: Phase = "idle";
  let pull = 0;
  let offset = 0;
  let velocity = 0;
  let lastFrame = 0;
  let frame = 0;
  let idleTimer = 0;
  let lastWheelAt = 0;
  let overscrollStartAt = 0;
  let capped = false;
  let touchY: number | null = null;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const revealHash = () => {
    if (!location.hash) return;
    let id = location.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {}
    document.getElementById(id)?.scrollIntoView();
  };

  requestAnimationFrame(revealHash);

  const syncHeader = () => header?.classList.toggle("is-scrolled", scroll.scrollTop > 4);
  syncHeader();

  const paint = () => {
    content.style.transform = offset === 0 ? "" : `translateY(${offset}px)`;
  };

  const rest = () => {
    window.clearTimeout(idleTimer);
    phase = "idle";
    pull = 0;
    offset = 0;
    velocity = 0;
  };

  const animate = (now: number) => {
    frame = 0;
    if (phase === "returning") {
      [offset, velocity] = springStep(offset, velocity, Math.max(0, now - lastFrame) / 1000);
      lastFrame = now;
      if (Math.abs(offset) < 0.3 && Math.abs(velocity) < 5) rest();
    }
    paint();
    if (phase === "returning") frame = requestAnimationFrame(animate);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(animate);
  };

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    rest();
    paint();
  };

  const returnToRest = () => {
    if (phase !== "tracking") return;
    window.clearTimeout(idleTimer);
    phase = "returning";
    velocity = 0;
    lastFrame = performance.now();
    schedule();
  };

  const consume = (delta: number, event: Event, wheel: boolean) => {
    if (!delta || !event.cancelable || event.defaultPrevented || reducedMotion.matches) return;
    if (nestedScrolls(event.target, delta)) return;
    const max = scroll.scrollHeight - scroll.clientHeight;
    const atTop = scroll.scrollTop <= 0.5;
    const atBottom = scroll.scrollTop >= max - 0.5;
    const outward = max <= 1 || (delta < 0 && atTop) || (delta > 0 && atBottom);
    if (phase === "idle" && !outward) return;
    if (!outward) {
      returnToRest();
      return;
    }
    if (wheel) {
      const now = performance.now();
      if (now - lastWheelAt > GESTURE_GAP_MS) {
        capped = false;
        overscrollStartAt = 0;
      }
      lastWheelAt = now;
      if (!overscrollStartAt) overscrollStartAt = now;
      if (!capped && now - overscrollStartAt > TRACK_MAX_MS) {
        capped = true;
        returnToRest();
        return;
      }
      if (capped) return;
    }
    if (phase === "returning") pull = pullFromOffset(offset);
    const nextPull = pull - delta;
    event.preventDefault();
    window.clearTimeout(idleTimer);
    if (max > 1 && pull && Math.sign(nextPull) !== Math.sign(pull)) {
      rest();
      scroll.scrollTo({ top: scroll.scrollTop + delta - pull, behavior: "instant" });
    } else if (Math.abs(nextPull) < 0.1) {
      rest();
    } else {
      pull = nextPull;
      offset = offsetFromPull(pull);
      velocity = 0;
      phase = "tracking";
      if (wheel) idleTimer = window.setTimeout(returnToRest, WHEEL_IDLE_MS);
    }
    schedule();
  };

  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? window.innerHeight
      : event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;
    consume(event.deltaY * unit, event, true);
  };

  const onTouchStart = (event: TouchEvent) => {
    touchY = event.touches.length === 1 ? event.touches.item(0)!.clientY : null;
    if (touchY !== null && phase === "returning") {
      pull = pullFromOffset(offset);
      phase = "tracking";
      velocity = 0;
    }
    window.clearTimeout(idleTimer);
  };

  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches.length === 1 ? event.touches.item(0) : null;
    if (!touch || touchY === null) return;
    const delta = touchY - touch.clientY;
    touchY = touch.clientY;
    consume(delta, event, false);
  };

  const onTouchEnd = () => {
    touchY = null;
    returnToRest();
  };

  const onPreferenceChange = () => reset();

  scroll.addEventListener("wheel", onWheel, { passive: false });
  scroll.addEventListener("scroll", syncHeader, { passive: true });
  scroll.addEventListener("touchstart", onTouchStart, { passive: true });
  scroll.addEventListener("touchmove", onTouchMove, { passive: false });
  scroll.addEventListener("touchend", onTouchEnd);
  scroll.addEventListener("touchcancel", onTouchEnd);
  window.addEventListener("pagehide", reset);
  reducedMotion.addEventListener("change", onPreferenceChange);
  window.addEventListener("hashchange", revealHash);
}

setupElasticScroll();

export {};
