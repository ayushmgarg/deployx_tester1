// Run by the pipeline's test task: node test.js
const assert = require("node:assert");
const { server } = require("./server");

server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  try {
    const health = await fetch(`${base}/health`);
    assert.strictEqual(health.status, 200);
    assert.strictEqual((await health.json()).status, "ok");

    const page = await fetch(`${base}/`);
    assert.strictEqual(page.status, 200);
    assert.match(await page.text(), /DeployX Tester/);

    assert.strictEqual((await fetch(`${base}/nope`)).status, 404);
    console.log("all tests passed");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
