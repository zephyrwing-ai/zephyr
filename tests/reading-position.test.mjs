import assert from "node:assert/strict";
import test from "node:test";
import { getActiveHeadingIndex } from "../src/lib/reading-position.ts";

test("empty and fully visible articles keep a stable selection", () => {
  assert.equal(getActiveHeadingIndex([], 0, 0, 96), -1);
  assert.equal(getActiveHeadingIndex([160, 300, 440], 0, 0, 96), 0);
  assert.equal(getActiveHeadingIndex([160], 100, 0, 96), 0);
  assert.equal(getActiveHeadingIndex([20, 40, 60], 0, 0, 96), 0);
});

test("long articles follow the normal header reading line", () => {
  const tops = [120, 400, 850];
  assert.equal(getActiveHeadingIndex(tops, 0, 1200, 96), 0);
  assert.equal(getActiveHeadingIndex(tops, 300, 1200, 96), 0);
  assert.equal(getActiveHeadingIndex(tops, 304, 1200, 96), 1);
  assert.equal(getActiveHeadingIndex(tops, 754, 1200, 96), 2);
});

test("short scroll ranges pass through every heading in order", () => {
  const visited = [];
  for (let top = 0; top <= 120; top += 0.25) {
    const index = getActiveHeadingIndex([180, 400, 650, 900], top, 120, 96);
    if (index !== visited.at(-1)) visited.push(index);
  }
  assert.deepEqual(visited, [0, 1, 2, 3]);
});

test("approaching the bottom changes continuously instead of forcing the last item", () => {
  const tops = [180, 400, 650, 900];
  assert.equal(getActiveHeadingIndex(tops, 60, 120, 96), 1);
  assert.equal(getActiveHeadingIndex(tops, 90, 120, 96), 2);
  assert.equal(getActiveHeadingIndex(tops, 115, 120, 96), 2);
  assert.equal(getActiveHeadingIndex(tops, 120, 120, 96), 3);
});

test("elastic overshoot is clamped to the physical reading range", () => {
  const tops = [180, 400, 650, 900];
  assert.equal(getActiveHeadingIndex(tops, -48, 120, 96), 0);
  assert.equal(getActiveHeadingIndex(tops, 168, 120, 96), 3);
});

test("uneven section lengths retain chronological heading order", () => {
  const tops = [128, 152, 1100, 1148, 1600];
  const visited = [];
  for (let top = 0; top <= 300; top += 0.1) {
    const index = getActiveHeadingIndex(tops, top, 300, 96);
    if (index !== visited.at(-1)) visited.push(index);
  }
  assert.deepEqual(visited, [0, 1, 2, 3, 4]);
});
