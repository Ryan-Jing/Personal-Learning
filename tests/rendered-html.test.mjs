import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Commonplace learning dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Commonplace — Personal Learning Library<\/title>/i);
  assert.match(html, /Welcome back, Ryan/);
  assert.match(html, /Technical library/);
  assert.match(html, /Personal library/);
  assert.match(html, /Voltage, current &amp; resistance/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("renders reusable library routes", async () => {
  const [technical, personal] = await Promise.all([
    render("/library/technical"),
    render("/library/personal"),
  ]);
  assert.equal(technical.status, 200);
  assert.equal(personal.status, 200);
  assert.match(await technical.text(), /Embedded &amp; firmware/);
  assert.match(await personal.text(), /Books &amp; reading/);
});

test("renders collection shelf pages with direct note access", async () => {
  const [electrical, pcb, marine] = await Promise.all([
    render("/collections/electrical-fundamentals"),
    render("/collections/pcb-design"),
    render("/collections/marine-electrical-systems"),
  ]);

  assert.equal(electrical.status, 200);
  assert.equal(pcb.status, 200);
  assert.equal(marine.status, 200);

  const electricalHtml = await electrical.text();
  assert.match(electricalHtml, /Electrical fundamentals/);
  assert.match(electricalHtml, /MOSFET fundamentals/);
  assert.match(electricalHtml, /Motor control fundamentals/);

  const pcbHtml = await pcb.text();
  const visiblePcbHtml = pcbHtml.split('<script id="_R_">')[0];
  assert.match(pcbHtml, /PCB design/);
  assert.match(pcbHtml, /High voltage PCB design/);
  assert.match(pcbHtml, /EMI\/EMC PCB design/);
  assert.doesNotMatch(visiblePcbHtml, /Creepage, clearance, insulation coordination/);

  const marineHtml = await marine.text();
  assert.match(marineHtml, /Marine electrical systems/);
  assert.match(marineHtml, /Marine motors, drivers &amp; PWM/);
  assert.match(marineHtml, /Marine electrical safety standards/);
  assert.match(marineHtml, /Waterproofing, corrosion &amp; ignition protection/);
});

test("renders a rich note with learning blocks and sources", async () => {
  const response = await render("/notes/voltage-current-resistance");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Ohm&#x27;s law/);
  assert.match(html, /V = I × R/);
  assert.match(html, /Sources &amp; resources/);
  assert.match(html, /MIT OpenCourseWare/);
  assert.match(html, /Interview prompts/);
});

test("renders marine standards note with primary sources", async () => {
  const response = await render("/notes/marine-electrical-safety-standards");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /ABYC/);
  assert.match(html, /ISO 13297:2020/);
  assert.match(html, /ISO 16315:2026/);
  assert.match(html, /33 CFR Part 183 Subpart I/);
  assert.match(html, /National Marine Electronics Association/);
});
