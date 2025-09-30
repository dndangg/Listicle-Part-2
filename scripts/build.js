// Node.js script to generate /items/<slug>/index.html pages
// Usage: node scripts/build.js

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "items.json");
const OUT_DIR = path.join(ROOT, "items");
const PICO_CSS =
  "https://cdn.jsdelivr.net/npm/@picocss/pico@latest/css/pico.min.css";

function escapeHTML(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function linkList(links = []) {
  if (!links.length) return "";
  return `
    <h3>Links</h3>
    <ul>
      ${links
        .map(
          (l) =>
            `<li><a href="${escapeHTML(l.url)}" target="_blank" rel="noreferrer">${escapeHTML(
              l.label || l.url
            )}</a></li>`
        )
        .join("")}
    </ul>
  `;
}

function tagsChips(tags = []) {
  if (!tags.length) return "";
  return `<p>${tags
    .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
    .join(" ")}</p>`;
}

function detailTemplate(item) {
  const title = escapeHTML(item.title);
  const subtitle = item.subtitle ? escapeHTML(item.subtitle) : "";
  const desc = item.description ? escapeHTML(item.description) : "";
  const img = escapeHTML(item.image);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} — Listicle</title>
    <link rel="stylesheet" href="${PICO_CSS}" />
    <link rel="stylesheet" href="../../public/css/styles.css" />
  </head>
  <body>
    <main class="container">
      <nav style="margin-top:1rem">
        <a href="../../index.html" role="button" class="secondary">← Back to list</a>
      </nav>

      <article>
        <img class="card-image" src="${img}" alt="${title}" />
        <h1 style="margin-bottom:0.25rem">${title}</h1>
        ${subtitle ? `<p style="margin-top:0;color:var(--muted-color)">${subtitle}</p>` : ""}
        ${tagsChips(item.tags)}
        <p>${desc}</p>
        ${linkList(item.links)}
      </article>
    </main>
  </body>
</html>`;
}

function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  const items = data.items || [];

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let count = 0;
  for (const item of items) {
    if (!item.id) {
      console.warn("Skipping item with no id:", item);
      continue;
    }
    const dir = path.join(OUT_DIR, item.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), detailTemplate(item), "utf8");
    count++;
  }

  console.log(`✅ Generated ${count} detail page(s) in /items`);
}

main();