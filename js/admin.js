// Admin CRUD for products stored in localStorage under 'admin_products'
(function () {
  const form = document.getElementById("product-form");
  const idField = document.getElementById("product-id");
  const nameField = document.getElementById("name");
  const categoryField = document.getElementById("category");
  const priceField = document.getElementById("price");
  const descField = document.getElementById("description");
  const sizesField = document.getElementById("sizes");
  const colorsField = document.getElementById("colors");
  const imageInput = document.getElementById("image");
  const imageUrlField = document.getElementById("image-url");
  const productsList = document.getElementById("products-list");
  const resetBtn = document.getElementById("reset-btn");

  function readStorage() {
    try {
      return JSON.parse(localStorage.getItem("admin_products") || "[]");
    } catch (e) {
      console.warn("admin_products parse failed", e);
      return [];
    }
  }

  function writeStorage(arr) {
    const payload = JSON.stringify(arr);
    localStorage.setItem("admin_products", payload);
    // dispatch a StorageEvent so other listeners (including same-window) can react with a proper key
    try {
      const se = new StorageEvent("storage", {
        key: "admin_products",
        newValue: payload,
      });
      window.dispatchEvent(se);
      console.debug("admin_products saved and storage event dispatched", {
        count: JSON.parse(payload).length,
      });
    } catch (e) {
      // fallback: dispatch a generic storage event
      window.dispatchEvent(new Event("storage"));
      console.debug("admin_products saved (fallback dispatch)", {
        count: JSON.parse(payload).length,
      });
    }
  }

  function resetForm() {
    idField.value = "";
    form.reset();
  }

  function renderList() {
    const items = readStorage();
    if (items.length === 0) {
      productsList.innerHTML =
        '<div class="text-gray-500">No products yet</div>';
      return;
    }
    productsList.innerHTML = items
      .map((p, idx) => {
        const img = p.image || "";
        return `
        <div class="flex items-center justify-between border p-3 rounded">
          <div class="flex items-center gap-4">
            <img src="${img}" class="thumb" onerror="this.style.display='none'" />
            <div class="text-left">
              <div class="font-medium">${escapeHtml(p.name || "")}</div>
              <div class="text-xs text-gray-500">${escapeHtml(p.category || "")} — $${p.price || 0}</div>
              <div class="text-xs text-gray-400">Sizes: ${escapeHtml((p.sizes || []).join(","))}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button data-idx="${idx}" class="edit px-3 py-1 border">Edit</button>
            <button data-idx="${idx}" class="del px-3 py-1 border text-red-600">Delete</button>
          </div>
        </div>
      `;
      })
      .join("");

    // attach handlers
    Array.from(productsList.querySelectorAll(".edit")).forEach((btn) =>
      btn.addEventListener("click", onEdit),
    );
    Array.from(productsList.querySelectorAll(".del")).forEach((btn) =>
      btn.addEventListener("click", onDelete),
    );
  }

  function onEdit(e) {
    const i = Number(e.currentTarget.dataset.idx);
    const items = readStorage();
    const p = items[i];
    if (!p) return;
    idField.value = i;
    nameField.value = p.name || "";
    categoryField.value = p.category || "";
    priceField.value = p.price || "";
    descField.value = p.description || "";
    sizesField.value = (p.sizes || []).join(",");
    colorsField.value = (p.colors || []).join(",");
    imageUrlField.value =
      p.image && typeof p.image === "string" && p.image.startsWith("http")
        ? p.image
        : "";
  }

  function onDelete(e) {
    if (!confirm("Delete this product?")) return;
    const i = Number(e.currentTarget.dataset.idx);
    const items = readStorage();
    items.splice(i, 1);
    writeStorage(items);
    renderList();
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const idxStr = idField.value;
    const name = nameField.value.trim();
    const category = categoryField.value.trim() || "uncategorized";
    const price = Number(priceField.value) || 0;
    const description = descField.value.trim();
    const sizes = sizesField.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = colorsField.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let image = "";
    if (imageInput.files && imageInput.files[0]) {
      try {
        image = await fileToDataUrl(imageInput.files[0]);
      } catch (e) {
        console.warn("image read failed", e);
      }
    } else if (imageUrlField.value.trim()) {
      image = imageUrlField.value.trim();
    }

    const items = readStorage();
    const payload = {
      name,
      category,
      price,
      description,
      sizes,
      colors,
      image,
    };

    if (idxStr) {
      const idx = Number(idxStr);
      items[idx] = Object.assign(items[idx] || {}, payload);
    } else {
      items.push(payload);
    }

    writeStorage(items);
    renderList();
    resetForm();
  });

  resetBtn.addEventListener("click", resetForm);

  // Sync when other windows change storage
  window.addEventListener("storage", function (e) {
    // only care about admin_products key or generic storage event
    renderList();
  });

  // initial render
  renderList();
})();
