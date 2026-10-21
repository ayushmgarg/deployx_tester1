// Minimal app for testing DeployX deployments. No dependencies.
// Contract: listens on PORT, GET /health returns 200.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const VERSION = process.env.APP_VERSION || "1.0.0";
const STARTED = new Date().toISOString();
const INDEX = fs.readFileSync(path.join(__dirname, "public", "index.html"), "utf8");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", version: VERSION, started: STARTED }));
  }
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(
      INDEX.replace(/{{VERSION}}/g, VERSION).replace(/{{HOST}}/g, process.env.HOSTNAME || "unknown"),
    );
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`deployx_tester1 v${VERSION} on :${PORT}`));
  // Blue-green / rolling deploys stop old containers with SIGTERM
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
}

module.exports = { server };
