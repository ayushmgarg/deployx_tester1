# DeployX Tester

A small website for testing a DeployX deployment end to end: blue-green deploys, the public Cloudflare URL, and **document hosting** (files uploaded in DeployX served at `/files/`).

This is a tester for our cloud computing project DeployX: https://github.com/epshukla/devops-deployment-tool 

## Quick Start

```bash
npm install
npm start
# Open http://localhost:3000
```

## Endpoints

| Path | Response |
|------|----------|
| `/` | HTML page: live status + document checks |
| `/health` | `{"status":"healthy"}` — required by DeployX |
| `/api/status` | Version, container name, uptime, memory |
| `/api/documents` | Sample documents the page checks |
| `/files/<path>` | Served by the **DeployX proxy** (not this app) once uploaded |

## Running Tests

```bash
npm test
```

## Docker

```bash
docker build -t deployx-tester .
docker run -p 3000:3000 deployx-tester
```

## DeployX Pipeline

The `deployx.yaml` defines a two-stage pipeline:

1. **test** — Install deps + run contract tests
2. **build** — Build Docker image + deploy with blue-green strategy (public URL, CPU/memory limits, rate limit)

## Testing Document Hosting

1. Create a DeployX project from this repo, paste `deployx.yaml` as a pipeline, and run it.
2. Open the deployment's public URL (`https://….trycloudflare.com`). Health should read **healthy**.
3. On the project's **Documents** tab, upload these files from `sample-docs/` as **public**:

   | File | Path |
   |------|------|
   | `sample-docs/sample.txt` | `sample.txt` |
   | `sample-docs/sample.pdf` | `sample.pdf` |
   | `sample-docs/guides/readme.md` | `guides/readme.md` |

4. Within a minute, click **Re-check** on the page. Each document shows **✓ served**.

More checks:
- **Private:** switch a document to private. `/files/` returns 404 for it, but it still downloads from the dashboard.
- **Versions:** upload a new version, then restore the old one.
- **Blue-green:** change `APP_VERSION` and re-run. The version and container on the page change.
- **Rate limit:** more than 30 rapid requests return `429`.

## Project Structure

```
├── server.js         # Express server (static files + API)
├── public/
│   ├── index.html    # Status + documents page
│   ├── style.css     # Dark theme styles
│   └── app.js        # Client-side status & document checks
├── sample-docs/      # Files to upload on the Documents tab
├── Dockerfile        # Production image
├── deployx.yaml      # Pipeline configuration
└── test.js           # Contract tests
```
