import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [layout, css] = await Promise.all([
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("self-hosts JetBrains Mono and applies it globally", () => {
  assert.match(layout, /@fontsource\/jetbrains-mono\/400\.css/);
  assert.match(layout, /@fontsource\/jetbrains-mono\/500\.css/);
  assert.match(layout, /@fontsource\/jetbrains-mono\/600\.css/);
  assert.match(layout, /@fontsource\/jetbrains-mono\/700\.css/);
  assert.match(layout, /@fontsource\/jetbrains-mono\/800\.css/);
  assert.match(css, /--font-mono:\s*"JetBrains Mono"[\s\S]*?ui-monospace[\s\S]*?monospace/);
  assert.match(css, /body\s*\{[\s\S]*?font-family:\s*var\(--font-mono\)/);
  assert.doesNotMatch(css, /font-weight:\s*670/);
});
