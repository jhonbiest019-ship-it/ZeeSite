/**
 * B&M Stores / H-US Mart - Real-Time Sync & Theme Engine
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
  window.bmAddToCart = addToCart;

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

  // 3. REAL-TIME CATALOG SYNC & FILTER ENGINE
  let catalogProducts = [];

  function loadCatalog() {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        catalogProducts = data || [];
        window.bmCatalogProducts = catalogProducts;
        console.log('[BM Sync Engine] Loaded', catalogProducts.length, 'catalog products');
      })
      .catch(err => {
        console.warn('[BM Sync Engine] Could not load products.json directly, fallback to embedded catalog', err);
      });
  }

  function renderFilteredProducts(products, title, badgeText = 'Category') {
    const container = document.getElementById('bm-live-catalog-sync');
    const grid = document.getElementById('bm-sync-product-grid');
    const titleEl = document.getElementById('bm-sync-category-title');
    const badgeEl = document.getElementById('bm-sync-category-badge');
    const countEl = document.getElementById('bm-sync-category-count');

    if (!container || !grid) return;

    if (titleEl) titleEl.textContent = title;
    if (badgeEl) badgeEl.textContent = badgeText;
    if (countEl) countEl.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5>No products currently listed under "${title}"</h5>
          <p class="text-muted small">Check back soon or explore our New Arrivals!</p>
        </div>
      `;
    } else {
      grid.innerHTML = products.map(p => {
        const rawPrice = typeof p.price === 'number' ? p.price : (parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0);
        return `
          <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100 border shadow-sm bm-sync-card text-center position-relative">
              ${p.badge ? `<span class="badge badge-danger position-absolute" style="top:10px;left:10px;z-index:2;font-size:0.75rem;">${p.badge}</span>` : ''}
              <div class="p-3 d-flex align-items-center justify-content-center" style="height: 180px; background: #fff;">
                <img src="${p.img}" alt="${p.title}" class="img-fluid" style="max-height: 160px; object-fit: contain;">
              </div>
              <div class="card-body d-flex flex-column p-3">
                <span class="text-muted small mb-1 text-uppercase font-weight-bold" style="font-size:0.7rem;">${p.department || 'Discount Mart'}</span>
                <h6 class="card-title font-weight-bold mb-2 flex-grow-1" style="font-size: 0.95rem; line-height: 1.3;">${p.title}</h6>
                <div class="my-2">
                  <span class="h5 font-weight-bold text-danger mb-0">${p.price || ('$' + rawPrice.toFixed(2))}</span>
                  ${p.rrp ? `<span class="small text-muted ml-1" style="text-decoration: line-through;">${p.rrp}</span>` : ''}
                </div>
                <button type="button" class="btn btn-primary btn-block btn-sm mt-auto font-weight-bold bm-sync-add-btn"
                  onclick="window.bmAddToCart({ title: '${p.title.replace(/'/g, "\\'")}', price: ${rawPrice}, img: '${p.img}', id: '${p.id || p.title.replace(/\\W+/g, '-').toLowerCase()}' })">
                  <i class="fas fa-shopping-basket mr-1"></i> Add to Basket
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    container.style.display = 'block';

    // Smooth scroll to container with highlight
    setTimeout(() => {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      container.classList.add('bm-highlight-pulse');
      setTimeout(() => container.classList.remove('bm-highlight-pulse'), 1500);
    }, 150);
  }

  function clearCatalogFilter() {
    const container = document.getElementById('bm-live-catalog-sync');
    if (container) {
      container.style.display = 'none';
    }
  }

  function closeNavbarDrawer() {
    if (window.jQuery && window.jQuery('#bm-navbar-modal').length) {
      window.jQuery('#bm-navbar-modal').modal('hide');
    } else {
      const modal = document.getElementById('bm-navbar-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());
      }
    }
  }

  function setupMenuSyncInterceptors() {
    // 1. Department Links
    document.querySelectorAll('.bm-dept-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const dept = this.getAttribute('data-dept');
        closeNavbarDrawer();

        if (!catalogProducts || catalogProducts.length === 0) {
          fetch('/products.json').then(r => r.json()).then(data => {
            catalogProducts = data || [];
            filterAndShow(dept);
          });
        } else {
          filterAndShow(dept);
        }

        function filterAndShow(departmentName) {
          const filtered = catalogProducts.filter(p => {
            if (p.department && p.department.toLowerCase() === departmentName.toLowerCase()) return true;
            if (p.tags && p.tags.some(t => t.toLowerCase() === departmentName.toLowerCase())) return true;
            return false;
          });
          renderFilteredProducts(filtered, departmentName, 'Department');
        }
      });
    });

    // 2. Promotional & Section Menu Links
    document.querySelectorAll('.bm-menu-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const promo = this.getAttribute('data-promo');
        const targetSelector = this.getAttribute('data-target');

        closeNavbarDrawer();

        if (promo) {
          // Promo filter
          if (!catalogProducts || catalogProducts.length === 0) {
            fetch('/products.json').then(r => r.json()).then(data => {
              catalogProducts = data || [];
              filterPromo(promo);
            });
          } else {
            filterPromo(promo);
          }

          function filterPromo(promoName) {
            const promoLower = promoName.toLowerCase();
            const filtered = catalogProducts.filter(p => {
              if (p.tags && p.tags.some(t => t.toLowerCase().includes(promoLower))) return true;
              if (p.badge && p.badge.toLowerCase().includes(promoLower)) return true;
              if (p.title && p.title.toLowerCase().includes(promoLower)) return true;
              if (p.department && p.department.toLowerCase().includes(promoLower)) return true;
              return false;
            });
            renderFilteredProducts(filtered.length ? filtered : catalogProducts.slice(0, 8), promoName, 'Featured Deal');
          }
        } else if (targetSelector) {
          // Direct Section Scroll
          const targetEl = document.querySelector(targetSelector);
          if (targetEl) {
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              targetEl.classList.add('bm-highlight-pulse');
              setTimeout(() => targetEl.classList.remove('bm-highlight-pulse'), 1500);
            }, 200);
          }
        }
      });
    });

    // 3. Clear filter button
    const clearBtn = document.getElementById('bm-sync-clear-filter');
    if (clearBtn) {
      clearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearCatalogFilter();
        const newArr = document.getElementById('new-arrivals');
        if (newArr) newArr.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // 4. INITIALIZE IN PAGE
  function init() {
    applyTheme(currentTheme, false);
    loadCatalog();

    // A. Bind Basket Button in Header
    const cartBtn = document.getElementById('bm-cart-btn');
    if (cartBtn) {
      cartBtn.onclick = (e) => {
        e.preventDefault();
        openBasketDrawer();
      };
    }

    // B. Build Basket Drawer if missing
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
        alert("🎉 Thank you for testing H-US Mart Checkout!");
      };
    }

    // C. Enhance Product Cards on Current Page (New Arrivals & Top Trending)
    document.querySelectorAll(".bm-product-card, article.product, .product-card").forEach(card => {
      if (card.querySelector(".bm-card-action-bar")) return;

      const titleLink = card.querySelector(".bm-product-stretch-link, h2 a, h3 a, .product-title a");
      const title = titleLink ? titleLink.textContent.trim() : "H-US Mart Product";

      let price = 0;
      const priceEl = card.querySelector(".bm-product-price-container, .price, .product-price, .h5");
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

    // D. Setup Real-time Menu Interceptors
    setupMenuSyncInterceptors();

    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

// Auto-remove Cookie Consent Banners
function removeAllCookieBanners() {
  const ids = ['onetrust-consent-sdk', 'onetrust-banner-sdk', 'onetrust-pc-sdk', 'ot-sdk-btn-floating'];
  ids.forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  const filters = document.querySelectorAll('.onetrust-pc-dark-filter, .ot-fade-in');
  filters.forEach(function(el) { el.remove(); });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeAllCookieBanners);
} else {
  removeAllCookieBanners();
}
window.addEventListener('load', removeAllCookieBanners);
setInterval(removeAllCookieBanners, 300);
