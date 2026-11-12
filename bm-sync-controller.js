/**
 * B&M Stores - Real-Time Sync & Theme Engine
 */
(function() {
  'use strict';

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

  // 2. CART STATE
  let cart = [];
  try {
    const savedCart = localStorage.getItem("bm_cart");
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try { localStorage.setItem("bm_cart", JSON.stringify(cart)); } catch (e) {}
    renderCart();
  }

  function addToCart(item, qty = 1) {
    const existing = cart.find(i => i.title.toLowerCase() === item.title.toLowerCase());
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: item.id || Date.now().toString(),
        title: item.title,
        price: parseFloat(item.price) || 0,
        img: item.img || "",
        qty: qty
      });
    }
    saveCart();
    showToast(`✓ Added <strong>${item.title}</strong> to basket!`);
  }

  function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    showToast("Item removed from basket");
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

  function renderCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    const badge = document.getElementById("bm-cart-count");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-block" : "none";
    }

    const itemsEl = document.getElementById("bm-basket-items");
    const subtotalEl = document.getElementById("bm-basket-subtotal");
    const deliveryText = document.getElementById("bm-free-delivery-text");
    const deliveryFill = document.getElementById("bm-free-delivery-progress");

    if (itemsEl) {
      if (cart.length === 0) {
        itemsEl.innerHTML = `
          <div class="text-center py-5 text-muted">
            <i class="fas fa-shopping-basket fa-3x mb-3 text-secondary" style="opacity:0.35;"></i>
            <h6>Your basket is empty</h6>
            <p class="small">Add products from any category or deal to see them here.</p>
          </div>
        `;
      } else {
        itemsEl.innerHTML = cart.map(i => `
          <div class="bm-basket-item">
            <img class="bm-basket-item-img" src="${i.img}" alt="${i.title}">
            <div class="bm-basket-item-info">
              <div class="bm-basket-item-title">${i.title}</div>
              <div class="bm-basket-item-price">$${(i.price * i.qty).toFixed(2)}</div>
              <div class="bm-qty-control">
                <button type="button" class="bm-qty-btn" onclick="window.bmUpdateQty('${i.id}', -1)">-</button>
                <span class="bm-qty-val">${i.qty}</span>
                <button type="button" class="bm-qty-btn" onclick="window.bmUpdateQty('${i.id}', 1)">+</button>
              </div>
            </div>
            <button type="button" class="bm-basket-item-remove" onclick="window.bmRemoveFromCart('${i.id}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `).join("");
      }
    }

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (deliveryText && deliveryFill) {
      if (subtotal >= 50) {
        deliveryText.innerHTML = `🎉 You qualify for <strong>FREE US Delivery</strong>!`;
        deliveryFill.style.width = "100%";
      } else {
        const remaining = (50 - subtotal).toFixed(2);
        const pct = Math.min(100, Math.round((subtotal / 50) * 100));
        deliveryText.innerHTML = `Add <strong>$${remaining}</strong> more for <strong>FREE US Delivery</strong>!`;
        deliveryFill.style.width = `${pct}%`;
      }
    }
  }

  window.bmUpdateQty = updateQty;
  window.bmRemoveFromCart = removeFromCart;

  function openBasketDrawer() {
    renderCart();
    const d = document.getElementById("bm-basket-drawer");
    const o = document.getElementById("bm-basket-overlay");
    if (d) d.classList.add("active");
    if (o) o.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeBasketDrawer() {
    const d = document.getElementById("bm-basket-drawer");
    const o = document.getElementById("bm-basket-overlay");
    if (d) d.classList.remove("active");
    if (o) o.classList.remove("active");
    document.body.style.overflow = "";
  }

  // 3. INITIALIZE IN PAGE
  function init() {
    applyTheme(currentTheme, false);

    // A. Add Basket Button in Header
    const storesDropdown = document.querySelector('.bm-navbar-dropdown');
    if (storesDropdown && !document.getElementById('bm-cart-btn')) {
      const cartWrap = document.createElement('div');
      cartWrap.className = 'ml-2 ml-lg-3 order-md-last';
      cartWrap.innerHTML = `
        <button class="navbar-toggler align-items-center border-0 d-flex flex-column justify-content-center p-0 position-relative text-secondary bm-navbar-btn" id="bm-cart-btn" type="button" title="View Shopping Basket">
          <div class="position-relative">
            <i aria-hidden="true" class="fas fa-fw fa-shopping-basket my-1 bm-navbar-btn-icon"></i>
            <span class="badge badge-pill badge-primary position-absolute bm-cart-badge" id="bm-cart-count" style="top:-4px;right:-8px;font-size:0.72rem;display:none;">0</span>
          </div>
          <span class="font-weight-bold bm-navbar-btn-text">Basket</span>
        </button>
      `;
      storesDropdown.parentNode.insertBefore(cartWrap, storesDropdown.nextSibling);

      cartWrap.querySelector('#bm-cart-btn').onclick = (e) => {
        e.preventDefault();
        openBasketDrawer();
      };
    }

    // B. Build Basket Drawer
    if (!document.getElementById("bm-basket-drawer")) {
      const drawerWrap = document.createElement("div");
      drawerWrap.innerHTML = `
        <div class="bm-basket-overlay" id="bm-basket-overlay"></div>
        <div class="bm-basket-drawer" id="bm-basket-drawer">
          <div class="bm-basket-header">
            <h5><i class="fas fa-shopping-basket text-warning"></i> Your Basket</h5>
            <button type="button" class="bm-basket-close" id="bm-basket-close">&times;</button>
          </div>
          <div class="bm-delivery-bar">
            <div id="bm-free-delivery-text">Add $50.00 for FREE US Delivery</div>
            <div class="bm-delivery-progress">
              <div class="bm-delivery-progress-fill" id="bm-free-delivery-progress"></div>
            </div>
          </div>
          <div class="bm-basket-items" id="bm-basket-items"></div>
          <div class="bm-basket-footer">
            <div class="bm-basket-subtotal-row">
              <span>Subtotal:</span>
              <span id="bm-basket-subtotal">$0.00</span>
            </div>
            <button type="button" class="bm-basket-checkout-btn" id="bm-checkout-btn">
              <i class="fas fa-lock mr-2"></i> Proceed to Checkout
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(drawerWrap);

      document.getElementById("bm-basket-close").onclick = closeBasketDrawer;
      document.getElementById("bm-basket-overlay").onclick = closeBasketDrawer;
      document.getElementById("bm-checkout-btn").onclick = () => {
        alert("🎉 Thank you for testing the B&M Clone Checkout!");
      };
    }

    // Floating Theme bar removed
    const existingPill = document.getElementById('bm-theme-switch-pill');
    if (existingPill) existingPill.remove();
    const existingSyncBar = document.getElementById('bm-sync-bar');
    if (existingSyncBar) existingSyncBar.remove();

    // D. Enhance Product Cards on Current Page
    document.querySelectorAll(".bm-product-card, article.product, .product-card").forEach(card => {
      if (card.querySelector(".bm-card-action-bar")) return;

      const titleLink = card.querySelector(".bm-product-stretch-link, h2 a, h3 a, .product-title a");
      const title = titleLink ? titleLink.textContent.trim() : "B&M Product";

      let price = 0;
      const priceEl = card.querySelector(".bm-product-price-container, .price, .product-price");
      if (priceEl) {
        const m = priceEl.textContent.match(/[\$\u00A3\u20AC]?([0-9]+\.[0-9]{2})/);
        if (m) price = parseFloat(m[1]);
      }

      const imgEl = card.querySelector("img");
      const img = imgEl ? (imgEl.src || imgEl.getAttribute("data-src")) : "";

      const bar = document.createElement("div");
      bar.className = "bm-card-action-bar";
      bar.innerHTML = `
        <button type="button" class="bm-btn-add-cart">
          <i class="fas fa-shopping-basket"></i> Add to Basket
        </button>
      `;
      card.appendChild(bar);

      bar.querySelector(".bm-btn-add-cart").onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ title, price, img, id: title.replace(/\W+/g, '-').toLowerCase() });
      };
    });

    // E. On Single Product Page (if viewing /products/...)
    if (window.location.pathname.startsWith("/products/") && document.querySelector(".product-page, h1")) {
      const h1 = document.querySelector("h1");
      const title = h1 ? h1.textContent.trim() : "";
      const priceEl = document.querySelector(".price, .bm-product-price");
      let price = 0;
      if (priceEl) {
        const m = priceEl.textContent.match(/[\$\u00A3\u20AC]?([0-9]+\.[0-9]{2})/);
        if (m) price = parseFloat(m[1]);
      }
      const imgEl = document.querySelector(".product-gallery img, .carousel-item img, img.img-fluid");
      const img = imgEl ? (imgEl.src || imgEl.getAttribute("data-src")) : "";

      const storeBtn = document.querySelector(".btn-store-finder, .store-finder-btn, a[href*='stores']");
      if (storeBtn && !document.getElementById("bm-detail-add-btn")) {
        const addBtn = document.createElement("button");
        addBtn.id = "bm-detail-add-btn";
        addBtn.type = "button";
        addBtn.className = "btn btn-primary btn-lg btn-block font-weight-bold mt-2";
        addBtn.style.backgroundColor = "#f15a24";
        addBtn.style.borderColor = "#f15a24";
        addBtn.innerHTML = `<i class="fas fa-shopping-basket mr-2"></i> Add to Basket ($${price ? price.toFixed(2) : ''})`;
        storeBtn.parentNode.insertBefore(addBtn, storeBtn);

        addBtn.onclick = () => {
          addToCart({ title, price, img, id: window.location.pathname });
        };
      }
    }

    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
