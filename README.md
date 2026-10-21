# deployx_tester1

Minimal app for testing [DeployX](https://github.com/epshukla/DevOps-Deployment-Tool) deployments. It has a web page, `GET /health`, and links to documents served at `/files/`.

## Test steps

1. In DeployX, create a **new project** with this repo's URL (branch `main`, Dockerfile `./Dockerfile`).
2. Go to **Pipelines → New pipeline** and paste [`deployx.yaml`](deployx.yaml).
3. Start a runner with Docker running (`pnpm runner start`), then click **Trigger Pipeline**.
4. Open the deployment's **public URL** (`https://….trycloudflare.com`). The page should show *Health: ok*.
5. In the **Documents** tab, upload the files from [`sample-docs/`](sample-docs) as **public**:
   - `sample.txt` with path `sample.txt`
   - `sample.pdf` with path `sample.pdf`
   - `guides/readme.md` with path `guides/readme.md`

   Within about a minute the links on the page turn **✓ served**, at `<public URL>/files/<path>`.

## More checks (optional)

- Make a document **private**: `/files/` returns 404 for it, but it still downloads from the dashboard.
- Upload a new version of a file, then restore the old one from version history.
- Change `APP_VERSION` in the pipeline and re-run: the version and container name on the page change (blue-green).
- Send more than 30 quick requests: you get `429` responses (rate limit).

## Run locally

```bash
node test.js
```

```bash
node server.js
```

Then open http://localhost:3000.
