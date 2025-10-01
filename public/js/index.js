(async function () {
  const GRID = document.getElementById("grid");
  const SEARCH = document.getElementById("search");

  let items = [];
  try {
    const res = await fetch("/api/items"); // Fetch from Express API instead of local
    const json = await res.json();
    items = json || [];
    render(items);
  } catch (err) {
    GRID.innerHTML = `<article><h3>Failed to load data.</h3><p>${String(
      err
    )}</p></article>`;
    return;
  }

  SEARCH.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) return render(items);
    const filtered = items.filter((it) => {
      const hay =
        `${it.title || ""} ${it.subtitle || ""} ${it.blurb || ""} ${(it.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
    render(filtered);
  });

  function render(list) {
    if (!list.length) {
      GRID.innerHTML = `<div class="empty">No results. Try another search!</div>`;
      return;
    }
    GRID.innerHTML = list.map((it) => cardHTML(it)).join("");
  }

  function escapeHTML(s = "") {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cardHTML(it) {
    const href = `items/${encodeURIComponent(it.id)}`;
    const tags =
      (it.tags || [])
        .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
        .join("") || "";
    return `
      <a class="card-link" href="${href}" aria-label="View ${escapeHTML(it.title)} details">
        <article>
          ${
            it.image
              ? `<img class="card-image" src="${escapeHTML(it.image)}" alt="${escapeHTML(
                  it.title
                )}" />`
              : ""
          }
          <h3 style="margin-bottom: 0.25rem">${escapeHTML(it.title || "")}</h3>
          ${
            it.subtitle
              ? `<p style="margin-top:0;color:var(--muted-color)">${escapeHTML(
                  it.subtitle
                )}</p>`
              : ""
          }
          ${it.blurb ? `<p>${escapeHTML(it.blurb)}</p>` : ""}
          <div class="card-meta">${tags}</div>
        </article>
      </a>
    `;
  }
})();