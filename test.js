// Contract tests: what DeployX needs from the app. Run with `npm test`.
const assert = require("node:assert");
const { app } = require("./server");

const tests = [
  ["GET /health returns 200 healthy", async (base) => {
    const res = await fetch(`${base}/health`);
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(await res.json(), { status: "healthy" });
  }],
  ["GET / serves the HTML page", async (base) => {
    const res = await fetch(`${base}/`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    assert.match(await res.text(), /DeployX Tester/);
  }],
  ["static assets are served", async (base) => {
    assert.strictEqual((await fetch(`${base}/style.css`)).status, 200);
    assert.strictEqual((await fetch(`${base}/app.js`)).status, 200);
  }],
  ["GET /api/status reports version and container", async (base) => {
    const body = await (await fetch(`${base}/api/status`)).json();
    assert.ok(body.version);
    assert.ok(body.container);
    assert.ok(Number.isInteger(body.uptime_seconds));
  }],
  ["GET /api/documents lists the sample documents", async (base) => {
    const body = await (await fetch(`${base}/api/documents`)).json();
    assert.strictEqual(body.prefix, "/files/");
    assert.ok(body.documents.some((d) => d.path === "sample.pdf"));
  }],
  ["unknown paths return 404", async (base) => {
    assert.strictEqual((await fetch(`${base}/does-not-exist`)).status, 404);
  }],
];

const server = app.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      await fn(base);
      console.log(`  ✓ ${name}`);
    } catch (err) {
      failed++;
      console.log(`  ✗ ${name}\n    ${err.message}`);
    }
  }
  console.log(`\n${tests.length - failed}/${tests.length} passed`);
  server.close();
  process.exitCode = failed ? 1 : 0;
});
