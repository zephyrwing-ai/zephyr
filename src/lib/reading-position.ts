export function getActiveHeadingIndex(
  headingTops: readonly number[],
  scrollTop: number,
  maxScroll: number,
  headerOffset: number,
): number {
  if (headingTops.length === 0) return -1;

  const range = Math.max(0, maxScroll);
  if (range === 0) return 0;
  const position = Math.max(0, Math.min(scrollTop, range));
  const unreachable = Math.max(0, headingTops[headingTops.length - 1] - headerOffset - range);
  // Spread otherwise unreachable headings across a short document's scroll range.
  const readingLine = position + headerOffset + position / range * unreachable;

  let start = 0;
  let end = headingTops.length;
  while (start < end) {
    const middle = Math.floor((start + end) / 2);
    if (headingTops[middle] <= readingLine + 0.5) start = middle + 1;
    else end = middle;
  }
  return Math.max(0, start - 1);
}
