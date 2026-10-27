import assert from "node:assert/strict";
import test from "node:test";
import { localizePath } from "../src/lib/paths.ts";

test("English routes retain the root namespace", () => {
  assert.equal(localizePath("/", "en"), "/");
  assert.equal(localizePath("/weekly/", "en"), "/weekly/");
  assert.equal(localizePath("weekly/2026-w43/", "en"), "/weekly/2026-w43/");
});

test("Chinese routes use the shared zh prefix", () => {
  assert.equal(localizePath("/", "zh"), "/zh/");
  assert.equal(localizePath("/weekly/", "zh"), "/zh/weekly/");
  assert.equal(localizePath("/weekly/2026-w43/", "zh"), "/zh/weekly/2026-w43/");
});
