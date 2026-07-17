import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("keeps core mobile responsive safeguards", () => {
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
  assert.match(css, /\.sidebar\s*\{[\s\S]*?width:\s*min\(var\(--sidebar-width\),\s*calc\(100vw - 40px\)\)/);
  assert.match(css, /\.menu-button,\s*\n\s*\.search-trigger\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(css, /\.table-wrap\s*\{[\s\S]*?overflow-x:\s*auto/);
  assert.match(css, /\.search-dialog\s*\{[\s\S]*?max-height:\s*calc\(100dvh - 24px\)/);
  assert.match(css, /\.collection-note-meta\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
});
