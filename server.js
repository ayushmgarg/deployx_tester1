// DeployX Tester — Express server (static site + API)
//
// DeployX contract: read PORT, answer GET /health with 200, stop on SIGTERM.
// Documents uploaded in DeployX are served by the DeployX proxy at /files/*
// (not by this app); the page only links to and checks them.

const express = require("express");
const os = require("node:os");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const VERSION = process.env.APP_VERSION || "1.0.0";
const STARTED_AT = new Date();

// Sample documents (in sample-docs/) to upload on the project's Documents tab
const SAMPLE_DOCUMENTS = [
  { path: "sample.txt", description: "Plain text" },
  { path: "sample.pdf", description: "PDF" },
  { path: "guides/readme.md", description: "Nested path" },
];

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.get("/api/status", (_req, res) => {
  res.json({
    version: VERSION,
    container: os.hostname(),
    started_at: STARTED_AT.toISOString(),
    uptime_seconds: Math.round(process.uptime()),
    memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    node: process.version,
  });
});

app.get("/api/documents", (_req, res) => {
  res.json({ prefix: "/files/", documents: SAMPLE_DOCUMENTS });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`DeployX Tester v${VERSION} listening on :${PORT}`);
  });
  // Blue-green / rolling deploys stop the old container with SIGTERM
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
}

module.exports = { app, SAMPLE_DOCUMENTS };
