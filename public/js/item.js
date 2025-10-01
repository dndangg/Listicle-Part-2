(async function () {
  function escapeHTML(s = "") {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getIdFromPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }

  const id = getIdFromPath();
  if (!id) {
    document.getElementById("item-title").textContent = "Item not found";
    return;
  }

  try {
    const res = await fetch(`/api/items/${encodeURIComponent(id)}`);
    if (!res.ok) {
      document.getElementById("item-title").textContent = "Item not found";
      return;
    }
    const it = await res.json();

    const img = document.getElementById("item-image");
    if (it.image) {
      img.src = it.image;
      img.alt = escapeHTML(it.title || "");
      img.style.display = "";
    }

    document.getElementById("item-title").textContent = it.title || "";
    document.getElementById("item-subtitle").textContent = it.subtitle || "";
    document.getElementById("item-blurb").textContent = it.blurb || "";

    const tagsHtml = (it.tags || [])
      .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
      .join(" ");
    document.getElementById("item-tags").innerHTML = tagsHtml;

    const linksUl = document.getElementById("item-links");
    linksUl.innerHTML = "";
    const links = Array.isArray(it.links) ? it.links : [];
    links.forEach((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = l.label || l.url || "Link";
      li.appendChild(a);
      linksUl.appendChild(li);
    });
  } catch (err) {
    document.getElementById("item-title").textContent = "Failed to load item";
    console.error(err);
  }
})();