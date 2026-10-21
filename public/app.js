// Client side: live deployment status + document availability checks.

const $ = (id) => document.getElementById(id);

function badge(ok, text) {
  return `<span class="${ok ? "ok" : "bad"}">${text}</span>`;
}

async function loadStatus() {
  try {
    const health = await fetch("/health").then((r) => r.json());
    $("health").innerHTML = badge(health.status === "healthy", health.status);
  } catch {
    $("health").innerHTML = badge(false, "down");
  }

  try {
    const s = await fetch("/api/status").then((r) => r.json());
    $("version").textContent = s.version;
    $("container").textContent = s.container;
    $("uptime").textContent = `${s.uptime_seconds}s`;
  } catch {
    // status is informational only
  }
}

async function checkDocuments() {
  const list = $("documents");
  const { prefix, documents } = await fetch("/api/documents").then((r) => r.json());
  list.innerHTML = "";

  for (const doc of documents) {
    const url = prefix + doc.path;
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank" rel="noopener">${url}</a><span>checking…</span>`;
    list.appendChild(li);

    // HEAD: documents are served by the DeployX proxy, not this app
    fetch(url, { method: "HEAD", cache: "no-store" })
      .then((r) => {
        li.lastChild.outerHTML = r.ok
          ? badge(true, "✓ served")
          : badge(false, `not uploaded yet (${r.status})`);
      })
      .catch(() => {
        li.lastChild.outerHTML = badge(false, "error");
      });
  }
}

$("open-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const p = $("open-path").value.trim().replace(/^\/+/, "");
  if (p) window.open("/files/" + p, "_blank", "noopener");
});

$("recheck").addEventListener("click", checkDocuments);

loadStatus();
checkDocuments();
setInterval(loadStatus, 10_000);
