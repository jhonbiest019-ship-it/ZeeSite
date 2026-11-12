/**
 * B&M Stores - Real-Time Sync & Theme Engine
 * (Basket feature completely removed)
 */
(function() {
  'use strict';

  // Clear any previously saved basket data
  try {
    localStorage.removeItem("bm_cart");
  } catch (e) {}

  // 1. THEME STATE
  const THEMES = [
    { id: "original", name: "Original B&M (100% Match)" },
    { id: "royal-navy", name: "Royal Navy & Champagne Gold" },
    { id: "forest-green", name: "Forest Green & Cream" },
    { id: "charcoal-electric", name: "Charcoal & Electric Blue" }
  ];

  let currentTheme = "original";
  try {
    const saved = localStorage.getItem("bm_sync_theme");
    if (saved && THEMES.some(t => t.id === saved)) {
      currentTheme = saved;
    }
  } catch (e) {}

  function applyTheme(themeId, notify = false) {
    currentTheme = themeId;
    if (themeId === "original") {
      document.documentElement.removeAttribute("data-theme");
      if (document.body) document.body.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
      if (document.body) document.body.setAttribute("data-theme", themeId);
    }
    try { localStorage.setItem("bm_sync_theme", themeId); } catch (e) {}

    const select = document.getElementById("bm-theme-picker");
    if (select && select.value !== themeId) select.value = themeId;

    if (notify) {
      const match = THEMES.find(t => t.id === themeId);
      showToast(`Theme switched to: <strong>${match ? match.name : themeId}</strong>`);
    }
  }

  function showToast(msg) {
    let container = document.getElementById("bm-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "bm-toast-container";
      container.className = "bm-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "bm-toast";
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#4ade80;font-size:1.2rem;"></i><div>${msg}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // 2. CLEANUP BASKET ELEMENTS (ensure none appear)
  function removeBasketElements() {
    const elementsToRemove = [
      "#bm-basket-drawer",
      "#bm-basket-overlay",
      "#bm-cart-btn",
      ".bm-card-action-bar",
      "#bm-detail-add-btn"
    ];
    elementsToRemove.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el && el.parentNode) {
          // If wrapped in header container div
          if (selector === "#bm-cart-btn" && el.closest(".order-md-last")) {
            el.closest(".order-md-last").remove();
          } else {
            el.remove();
          }
        }
      });
    });
    document.body.style.overflow = "";
  }

  // 3. INITIALIZE IN PAGE
  function init() {
    applyTheme(currentTheme, false);
    removeBasketElements();

    // Floating Live Sync & Theme Bar
    if (!document.getElementById("bm-sync-bar")) {
      const syncBar = document.createElement("div");
      syncBar.id = "bm-sync-bar";
      syncBar.className = "bm-sync-bar";
      syncBar.innerHTML = `
        <div class="bm-sync-badge">
          <span class="bm-sync-pulse"></span>
          <span>Live Synced</span>
        </div>
        <span style="opacity:0.4;">|</span>
        <label for="bm-theme-picker" style="margin:0;font-size:0.75rem;">Theme:</label>
        <select class="bm-theme-select" id="bm-theme-picker">
          ${THEMES.map(t => `<option value="${t.id}" ${t.id === currentTheme ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      `;
      document.body.appendChild(syncBar);

      document.getElementById("bm-theme-picker").onchange = (e) => {
        applyTheme(e.target.value, true);
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
