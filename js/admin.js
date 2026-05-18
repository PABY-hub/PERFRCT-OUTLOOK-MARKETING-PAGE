// Admin Authentication
(function () {
  const ADMIN_PASSWORD = "yhaoskylynx@0536"; // Change this to your desired password
  const loginModal = document.getElementById("login-modal");
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password-input");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");
  const adminContent = document.getElementById("admin-content");

  // Check if already logged in (from sessionStorage)
  function isLoggedIn() {
    return sessionStorage.getItem("admin_authenticated") === "true";
  }

  // Show admin content if logged in
  if (isLoggedIn()) {
    loginModal.style.display = "none";
    adminContent.classList.remove("hidden");
  } else {
    loginModal.style.display = "flex";
    adminContent.classList.add("hidden");
  }

  // Handle login form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = passwordInput.value;

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      loginModal.style.display = "none";
      adminContent.classList.remove("hidden");
      loginError.classList.add("hidden");
      passwordInput.value = "";
    } else {
      loginError.textContent = "Incorrect password. Please try again.";
      loginError.classList.remove("hidden");
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  // Handle logout
  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("admin_authenticated");
    loginModal.style.display = "flex";
    adminContent.classList.add("hidden");
    passwordInput.value = "";
    passwordInput.focus();
    loginError.classList.add("hidden");
  });
})();

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
  const colorSwatchesContainer = document.getElementById("color-swatches");

  // Preset color palette (30 colors)
  const PRESET_COLORS = [
    "#000000",
    "#ffffff",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#e0f7fa",
    "#fce4ec",
    "#f3e5f5",
    "#ede7f6",
    "#e8eaf6",
    "#e3f2fd",
    "#e1f5fe",
    "#f9fbe7",
    "#fff3e0",
  ];

  // Render swatches
  function renderColorSwatches() {
    if (!colorSwatchesContainer) return;
    colorSwatchesContainer.innerHTML = PRESET_COLORS.map(
      (hex) => `
        <button type="button" data-hex="${hex}" title="${hex}" class="w-8 h-8 rounded-sm border" style="background:${hex};"></button>
      `,
    ).join("");

    // attach handlers
    Array.from(colorSwatchesContainer.querySelectorAll("button")).forEach(
      (btn) => {
        btn.addEventListener("click", () => {
          btn.classList.toggle("ring-2");
          btn.classList.toggle("ring-offset-2");
          btn.classList.toggle("ring-black");
          syncColorsFromSwatches();
        });
      },
    );
  }

  // Sync selected swatches into colorsField (comma-separated)
  function syncColorsFromSwatches() {
    if (!colorSwatchesContainer) return;
    const selected = Array.from(
      colorSwatchesContainer.querySelectorAll("button.ring-2"),
    )
      .map((b) => b.dataset.hex)
      .filter(Boolean);
    colorsField.value = selected.join(",");
  }

  // Mark swatches from colorsField value
  function markSwatchesFromInput() {
    if (!colorSwatchesContainer) return;
    const vals = (colorsField.value || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    Array.from(colorSwatchesContainer.querySelectorAll("button")).forEach(
      (b) => {
        const hex = (b.dataset.hex || "").toLowerCase();
        if (vals.includes(hex)) {
          b.classList.add("ring-2", "ring-offset-2", "ring-black");
        } else {
          b.classList.remove("ring-2", "ring-offset-2", "ring-black");
        }
      },
    );
  }

  // Wire input change -> update swatches
  if (colorsField) {
    colorsField.addEventListener("input", () => markSwatchesFromInput());
  }

  // initialize
  renderColorSwatches();
  markSwatchesFromInput();

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

  if (form) {
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
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }

  // Sync when other windows change storage
  window.addEventListener("storage", function (e) {
    // only care about admin_products key or generic storage event
    renderList();
  });

  // initial render
  renderList();
})();

// ============================================
// Pinterest Pinned Items Management
// ============================================
(function () {
  const form = document.getElementById("pinned-form");
  const idField = document.getElementById("pinned-id");
  const nameField = document.getElementById("pinned-name");
  const urlField = document.getElementById("pinned-url");
  const priceField = document.getElementById("pinned-price");
  const imageInput = document.getElementById("pinned-image");
  const imageUrlField = document.getElementById("pinned-image-url");
  const pinnedList = document.getElementById("pinned-list");
  const resetBtn = document.getElementById("reset-pinned-btn");

  function readPinnedStorage() {
    try {
      return JSON.parse(localStorage.getItem("admin_pinned") || "[]");
    } catch (e) {
      console.warn("admin_pinned parse failed", e);
      return [];
    }
  }

  function writePinnedStorage(arr) {
    const payload = JSON.stringify(arr);
    localStorage.setItem("admin_pinned", payload);
    try {
      const se = new StorageEvent("storage", {
        key: "admin_pinned",
        newValue: payload,
      });
      window.dispatchEvent(se);
      console.debug("admin_pinned saved and storage event dispatched", {
        count: JSON.parse(payload).length,
      });
    } catch (e) {
      window.dispatchEvent(new Event("storage"));
      console.debug("admin_pinned saved (fallback dispatch)");
    }
  }

  function resetForm() {
    idField.value = "";
    form.reset();
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

  function renderPinnedList() {
    const items = readPinnedStorage();
    if (items.length === 0) {
      pinnedList.innerHTML =
        '<div class="text-gray-500">No pinned items yet</div>';
      return;
    }
    pinnedList.innerHTML = items
      .map((p, idx) => {
        const img = p.image || "";
        return `
        <div class="flex items-center justify-between border p-3 rounded bg-blue-50">
          <div class="flex items-center gap-4">
            <img src="${img}" class="thumb" onerror="this.style.display='none'" />
            <div class="text-left">
              <div class="font-medium">${escapeHtml(p.name || "")}</div>
              <div class="text-xs text-gray-500"><a href="${escapeHtml(p.url || "#")}" target="_blank" class="text-blue-600 underline">View Pin</a></div>
              <div class="text-xs text-gray-400">Price: ₵${p.price || 0}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button data-idx="${idx}" class="edit-pinned px-3 py-1 border">Edit</button>
            <button data-idx="${idx}" class="del-pinned px-3 py-1 border text-red-600">Delete</button>
          </div>
        </div>
      `;
      })
      .join("");

    Array.from(pinnedList.querySelectorAll(".edit-pinned")).forEach((btn) =>
      btn.addEventListener("click", onEditPinned),
    );
    Array.from(pinnedList.querySelectorAll(".del-pinned")).forEach((btn) =>
      btn.addEventListener("click", onDeletePinned),
    );
  }

  function onEditPinned(e) {
    const i = Number(e.currentTarget.dataset.idx);
    const items = readPinnedStorage();
    const p = items[i];
    if (!p) return;
    idField.value = i;
    nameField.value = p.name || "";
    urlField.value = p.url || "";
    priceField.value = p.price || "";
    imageUrlField.value =
      p.image && typeof p.image === "string" && p.image.startsWith("http")
        ? p.image
        : "";
  }

  function onDeletePinned(e) {
    if (!confirm("Delete this pinned item?")) return;
    const i = Number(e.currentTarget.dataset.idx);
    const items = readPinnedStorage();
    items.splice(i, 1);
    writePinnedStorage(items);
    renderPinnedList();
  }

  function fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const idxStr = idField.value;
      const name = nameField.value.trim();
      const url = urlField.value.trim();
      const price = Number(priceField.value) || 0;

      if (!url) {
        alert("Please enter a Pinterest URL");
        return;
      }

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

      const items = readPinnedStorage();
      const payload = { name, url, price, image };

      if (idxStr) {
        const idx = Number(idxStr);
        items[idx] = Object.assign(items[idx] || {}, payload);
      } else {
        items.push(payload);
      }

      writePinnedStorage(items);
      renderPinnedList();
      resetForm();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }

  window.addEventListener("storage", function (e) {
    renderPinnedList();
  });

  // initial render
  renderPinnedList();
})();

// ============================================
// Lookbook Image Management
// ============================================
(function () {
  const form = document.getElementById("lookbook-form");
  const idField = document.getElementById("lookbook-id");
  const captionField = document.getElementById("lookbook-caption");
  const imageInput = document.getElementById("lookbook-image");
  const lookbookList = document.getElementById("lookbook-list");
  const resetBtn = document.getElementById("lookbook-reset-btn");

  function readLookbookStorage() {
    try {
      return JSON.parse(localStorage.getItem("admin_lookbook") || "[]");
    } catch (e) {
      console.warn("admin_lookbook parse failed", e);
      return [];
    }
  }

  function writeLookbookStorage(arr) {
    const payload = JSON.stringify(arr);
    localStorage.setItem("admin_lookbook", payload);
    try {
      const se = new StorageEvent("storage", {
        key: "admin_lookbook",
        newValue: payload,
      });
      window.dispatchEvent(se);
    } catch (e) {
      window.dispatchEvent(new Event("storage"));
    }
  }

  function resetForm() {
    idField.value = "";
    form.reset();
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>\"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function renderLookbookList() {
    const items = readLookbookStorage();
    if (items.length === 0) {
      lookbookList.innerHTML =
        '<div class="text-gray-500">No lookbook images yet</div>';
      return;
    }

    lookbookList.innerHTML = items
      .map((p, idx) => {
        const img = p.src || p.image || p.url || "";
        return `
        <div class="flex items-center justify-between border p-3 rounded">
          <div class="flex items-center gap-4">
            <img src="${img}" class="thumb" onerror="this.style.display='none'" />
            <div class="text-left">
              <div class="font-medium">${escapeHtml(
                p.caption || "Lookbook Image",
              )}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button data-idx="${idx}" class="edit-lookbook px-3 py-1 border">
              Edit
            </button>
            <button data-idx="${idx}" class="del-lookbook px-3 py-1 border text-red-600">
              Delete
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    Array.from(lookbookList.querySelectorAll(".edit-lookbook")).forEach((btn) =>
      btn.addEventListener("click", onEditLookbook),
    );
    Array.from(lookbookList.querySelectorAll(".del-lookbook")).forEach((btn) =>
      btn.addEventListener("click", onDeleteLookbook),
    );
  }

  function onEditLookbook(e) {
    const i = Number(e.currentTarget.dataset.idx);
    const items = readLookbookStorage();
    const p = items[i];
    if (!p) return;
    idField.value = i;
    captionField.value = p.caption || "";
  }

  function onDeleteLookbook(e) {
    if (!confirm("Delete this lookbook image?")) return;
    const i = Number(e.currentTarget.dataset.idx);
    const items = readLookbookStorage();
    items.splice(i, 1);
    writeLookbookStorage(items);
    renderLookbookList();
  }

  function fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const idxStr = idField.value;
      const caption = captionField.value.trim();

      let src = "";
      if (imageInput.files && imageInput.files[0]) {
        try {
          src = await fileToDataUrl(imageInput.files[0]);
        } catch (err) {
          console.warn("Failed to read lookbook image", err);
        }
      }

      if (!src) {
        alert("Please upload an image for the lookbook.");
        return;
      }

      const items = readLookbookStorage();
      const payload = { src, caption };

      if (idxStr) {
        const idx = Number(idxStr);
        items[idx] = Object.assign(items[idx] || {}, payload);
      } else {
        items.push(payload);
      }

      writeLookbookStorage(items);
      renderLookbookList();
      resetForm();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }

  window.addEventListener("storage", function (e) {
    renderLookbookList();
  });

  if (form) {
    renderLookbookList();
  }
})();
