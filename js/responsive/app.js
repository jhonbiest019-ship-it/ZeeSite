/**
 * B&M Stores - Interactive Features & State Engine
 */

(function () {
  'use strict';

  // 0. THEME MANAGEMENT SYSTEM
  const THEMES = [
    { id: "royal-navy", name: "Royal Navy & Gold", dotClass: "bm-dot-navy", desc: "Most Recommended" },
    { id: "forest-green", name: "Forest Green & Cream", dotClass: "bm-dot-forest", desc: "Warm & Natural" },
    { id: "charcoal-electric", name: "Charcoal & Electric Blue", dotClass: "bm-dot-charcoal", desc: "Modern & Sleek" }
  ];

  let currentTheme = "royal-navy";
  try {
    const savedTheme = localStorage.getItem("bm_theme");
    if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
      currentTheme = savedTheme;
    }
  } catch (e) {
    currentTheme = "royal-navy";
  }

  function applyTheme(themeId, showNotification = false) {
    currentTheme = themeId;
    document.documentElement.setAttribute("data-theme", themeId);
    if (document.body) document.body.setAttribute("data-theme", themeId);
    try {
      localStorage.setItem("bm_theme", themeId);
    } catch (e) {}

    // Update active state in switcher buttons
    document.querySelectorAll(".bm-theme-btn").forEach(btn => {
      if (btn.dataset.theme === themeId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (showNotification) {
      const themeObj = THEMES.find(t => t.id === themeId);
      showToast(`✨ Active Theme: <strong>${themeObj ? themeObj.name : themeId}</strong>`);
    }
  }

  // Apply theme immediately before render
  applyTheme(currentTheme, false);

  // 1. PRODUCT CATALOG DATA (Captured live from bmstores.co.uk)
  const CATALOG = [
    {
      id: "427886",
      title: "Clinique Happy for Men EDT 50ml",
      price: 15.99,
      rrp: 50.00,
      unit: "£319.80/litre",
      badge: "New",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/427886-clinique-happy-men-50ml-3.jpg",
      category: "Health & Beauty",
      desc: "Crisp, citrusy and vibrant. Clinique Happy for Men EDT is a cool, clean scent with a hint of citrus. Ultra-fresh and modern, wear it and be happy!"
    },
    {
      id: "437206",
      title: "Light Up Stacked Gift Boxes Decoration",
      price: 20.00,
      rrp: 35.00,
      unit: "",
      badge: "New",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/437206-70-warm-white-led-light-up-stacked-gift-boxes.jpg",
      category: "Christmas & Seasonal",
      desc: "Bring festive elegance into your home or porch with these 70 warm white LED light-up stacked gift boxes. Battery operated with timer function."
    },
    {
      id: "439722",
      title: "Ninja Foodi 8-in-1 PossibleCooker",
      price: 89.00,
      rrp: 129.00,
      unit: "",
      badge: "Big Savings",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/439722-ninja-foodi-8in1-possible-cooker-4.jpg",
      category: "Electricals & Appliances",
      desc: "Replaces 8 cooking appliances! Slow cook, sear/sauté, steam, braise, bake, roast, simmer, and keep warm. 8L capacity feeds up to 8 people."
    },
    {
      id: "437455",
      title: "Coloured Christmas House Platter",
      price: 6.00,
      rrp: 10.00,
      unit: "",
      badge: "Christmas Deal",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/437455-coloured-house-platter.jpg",
      category: "Christmas & Seasonal",
      desc: "Charming ceramic Christmas platter shaped as an enchanting festive village house. Ideal for serving mince pies, cheese, and holiday treats."
    },
    {
      id: "438710",
      title: "KPop Demon Hunters Kids Wireless headphones",
      price: 15.00,
      rrp: 25.00,
      unit: "",
      badge: "Special Buy",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/438710-kpop-wireless-headphones.jpg",
      category: "Toys & Games",
      desc: "Fun, vibrant Bluetooth wireless headphones for kids. Safe volume limiter (85dB), soft ear cushions, foldable design, and built-in mic."
    },
    {
      id: "441424",
      title: "Barefoot Zinfandel Red Wine 75cl",
      price: 5.49,
      rrp: 8.50,
      unit: "£7.32/litre",
      badge: "Great Price",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/441424-barefoot-zinfandel-red-wine-75cl.jpg",
      category: "Food & Drink",
      desc: "Bursting with big fruit flavours of boysenberry and dark cherries with a hint of warm vanilla. Perfect with pizza, pasta, or grilled meats."
    },
    {
      id: "443834",
      title: "Pedigree Ranchos Superfoods Dog Treats 70g - Beef",
      price: 1.49,
      rrp: 2.25,
      unit: "£21.29/kg",
      badge: "Pet Deal",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/443834-pedigree-ranchos-superfoods-dog-treats-70g-beef.jpg",
      category: "Pets",
      desc: "Delicious chewy dog treats crafted with 95% meat and animal derivatives, enriched with superfood berries and minerals for healthy dogs."
    },
    {
      id: "437874",
      title: "Race Across the World Board Game",
      price: 19.99,
      rrp: 29.99,
      unit: "",
      badge: "New",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/437874-race-across-the-world-board-game.jpg",
      category: "Toys & Games",
      desc: "The hit BBC TV show is now an official board game! Travel across checkpoints on a limited budget, make strategic decisions, and race to win."
    },
    {
      id: "436197",
      title: "Laundry & Co Oval Boucle Laundry Hamper Lid",
      price: 18.00,
      rrp: 28.00,
      unit: "",
      badge: "Trending",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/436197-laundry-and-co-oval-boucle-hamper.jpg",
      category: "Home & Furniture",
      desc: "Luxurious textured boucle laundry hamper with fitted lid. Elegant neutral cream tones that elevate bedroom and bathroom aesthetics."
    },
    {
      id: "438215",
      title: "RAC Ready to Use Winter Screenwash 5L",
      price: 6.00,
      rrp: 9.00,
      unit: "£1.20/litre",
      badge: "Winter Essential",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/438215-rac-ready-to-use-winter-screenwash-5l.jpg",
      category: "DIY & Motoring",
      desc: "High performance winter formulation protects down to -10°C. Cuts through road grime, salt, and frost for clear winter visibility."
    },
    {
      id: "437733",
      title: "VTech Big Business Baby Desk Playset",
      price: 24.99,
      rrp: 39.99,
      unit: "",
      badge: "Big Savings",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/437733-vtech-baby-desk-playset.jpg",
      category: "Toys & Games",
      desc: "Work from home just like mom and dad! Interactive play desk with laptop screen, toy phone, calendar, clock, light-up buttons, and music."
    },
    {
      id: "438051",
      title: "Rio Wooden Multi-Aperture Photo Frame",
      price: 8.00,
      rrp: 14.00,
      unit: "",
      badge: "New",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/438051-rio-wooden-multi-aperture-photo-frame.jpg",
      category: "Home & Furniture",
      desc: "Showcase treasured memories with this modern light oak-effect multi photo frame. Holds 8 photos in portrait and landscape orientations."
    },
    {
      id: "437211",
      title: "Restore Bow LED Vanity Mirror",
      price: 12.00,
      rrp: 22.00,
      unit: "",
      badge: "Top Trending",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/437211-restore-bow-mirror.jpg",
      category: "Health & Beauty",
      desc: "Chic bow-shaped vanity mirror with warm LED surround glow. Touch sensor brightness control, USB rechargeable, and tilt adjustable."
    },
    {
      id: "440062",
      title: "Ninja CRISPi 4-in-1 Portable Air Fryer",
      price: 149.00,
      rrp: 199.99,
      unit: "",
      badge: "Special Buy",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/440062-ninja-crispi-air-fryer.jpg",
      category: "Electricals & Appliances",
      desc: "Compact powerhouse air fryer that cooks, crisps, bakes, and roasts with up to 75% less fat than traditional frying methods."
    },
    {
      id: "425303",
      title: "Bubble Faux Fur Cushion - Cream",
      price: 9.00,
      rrp: 16.00,
      unit: "",
      badge: "Cosy Home",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/425303-bubble-faux-fur-cushion-cream.jpg",
      category: "Home & Furniture",
      desc: "Ultra-plush, ribbed bubble texture faux fur cushion. Extra-soft filling provides luxurious comfort for sofas, armchairs, or beds."
    },
    {
      id: "435601",
      title: "Harvest Leaf Brushed Cotton Duvet Set - Double",
      price: 14.00,
      rrp: 26.00,
      unit: "",
      badge: "Top Trending",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/435601-435602-harvest-leaf-brushed-cotton-duvet-set-double-king.jpg",
      category: "Home & Furniture",
      desc: "100% brushed cotton flannelette for warm, cosy winter nights. Features a modern botanical leaf pattern with reversible design."
    },
    {
      id: "436243",
      title: "Garment Rail with 2 Shelves - Beige",
      price: 22.00,
      rrp: 35.00,
      unit: "",
      badge: "Storage Deal",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/436243-garment-rail-with-2-shelves-beige.jpg",
      category: "Home & Furniture",
      desc: "Freestanding steel clothing rail with two slatted lower shelves for shoes, bags, and storage baskets. Quick assembly, modern finish."
    },
    {
      id: "405644",
      title: "Fridge Storage Container With Clip Lock Lid - Small",
      price: 2.50,
      rrp: 4.50,
      unit: "",
      badge: "Organise",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/405644-fridge-container.jpg",
      category: "Home & Furniture",
      desc: "Clear BPA-free food container with 4-way airtight clip lock lid. Keeps vegetables, fruits, and leftovers fresh and organised."
    },
    {
      id: "436194",
      title: "4 Cube Shelving Unit - Black & Gold",
      price: 28.00,
      rrp: 45.00,
      unit: "",
      badge: "Trending",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/436194-black-4-cube-with-gold-feet.jpg",
      category: "Home & Furniture",
      desc: "Glamorous contemporary storage unit featuring matte black wood finish with chic brushed gold metal feet. Fits standard cube fabric boxes."
    },
    {
      id: "406910",
      title: "Home Essentials Multi Purpose 12 Compartment Storage Box",
      price: 4.00,
      rrp: 7.00,
      unit: "",
      badge: "Organise",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/406910-multi-purpose-12-compartment-box-clear-2.jpg",
      category: "Home & Furniture",
      desc: "12-compartment clear organiser with secure snap clasps. Perfect for sewing accessories, craft supplies, screws, nails, or jewelry."
    },
    {
      id: "430248",
      title: "Ania Glass Ball Lamp",
      price: 16.00,
      rrp: 30.00,
      unit: "",
      badge: "Lighting",
      img: "https://cdn.bmstores.co.uk/images/hpcProductImage/imgThumbResponsive/430248-ania-glass-ball-lamp.jpg",
      category: "Home & Furniture",
      desc: "Stunning ribbed smoked glass globe table lamp on a brushed brass pedestal base. Delivers warm ambient lighting to any living room or bedroom."
    }
  ];

  // 2. STORE LOCATOR DATA
  const STORES = [
    { city: "Liverpool", name: "B&M Liverpool - Clayton Square", address: "Clayton Square Shopping Centre, Great Charlotte St, L1 1QR", hours: "Mon-Sat: 8am - 8pm, Sun: 11am - 5pm", phone: "0151 709 8812", features: ["Click + Collect", "City Centre", "Disabled Access"] },
    { city: "Manchester", name: "B&M Manchester - Arndale Centre", address: "Upper Mall, Arndale Centre, Market Street, M4 3AQ", hours: "Mon-Sat: 8am - 8pm, Sun: 11:30am - 5:30pm", phone: "0161 832 9941", features: ["Click + Collect", "Lift Access", "Card Only Tills"] },
    { city: "Birmingham", name: "B&M Birmingham - High Street", address: "34-36 High Street, Birmingham, B4 7SL", hours: "Mon-Sat: 8am - 7pm, Sun: 10:30am - 4:30pm", phone: "0121 643 5521", features: ["Click + Collect", "Near New St Station"] },
    { city: "London", name: "B&M London - Beckton", address: "Gallions Reach Shopping Park, 3 Armada Way, E6 7ER", hours: "Mon-Sat: 8am - 9pm, Sun: 11am - 5pm", phone: "020 7474 1290", features: ["Garden Centre", "Free Parking", "Click + Collect"] },
    { city: "Leeds", name: "B&M Leeds - City Centre", address: "Merrion Centre, 44 Merrion Way, Leeds, LS2 8NG", hours: "Mon-Sat: 8am - 7pm, Sun: 10:30am - 4:30pm", phone: "0113 243 0088", features: ["Click + Collect", "Disabled Access"] },
    { city: "Glasgow", name: "B&M Glasgow - Forge Retail Park", address: "Forge Retail Park, Biggar Street, G31 4BH", hours: "Mon-Sat: 8am - 9pm, Sun: 9am - 6pm", phone: "0141 556 7122", features: ["Garden Centre", "Free Customer Parking"] },
    { city: "Bristol", name: "B&M Bristol - Imperial Retail Park", address: "Imperial Park, Wills Way, Hartcliffe, BS13 7TJ", hours: "Mon-Sat: 8am - 8pm, Sun: 10am - 4pm", phone: "0117 964 4331", features: ["Garden Centre", "Free Parking"] },
    { city: "Sheffield", name: "B&M Sheffield - Meadowhall Retail Park", address: "Attercliffe Common, Sheffield, S9 2YZ", hours: "Mon-Sat: 8am - 9pm, Sun: 10:30am - 4:30pm", phone: "0114 243 7811", features: ["Garden Centre", "Free Parking"] }
  ];

  // 3. CART STATE
  let cart = [];
  try {
    const saved = localStorage.getItem('bm_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem('bm_cart', JSON.stringify(cart));
    } catch (e) {}
    renderCart();
  }

  function getProductById(id) {
    return CATALOG.find(p => p.id === String(id));
  }

  function getProductByTitle(title) {
    if (!title) return null;
    return CATALOG.find(p => p.title.toLowerCase().trim() === title.toLowerCase().trim());
  }

  function addToCart(productId, qty = 1) {
    const prod = getProductById(productId);
    if (!prod) return;

    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: prod.id,
        title: prod.title,
        price: prod.price,
        img: prod.img,
        qty: qty
      });
    }

    saveCart();
    showToast(`✓ Added <strong>${prod.title}</strong> to basket!`);
  }

  function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    showToast("Item removed from basket");
  }

  // 4. TOAST NOTIFICATION
  function showToast(msg) {
    let container = document.getElementById('bm-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bm-toast-container';
      container.className = 'bm-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bm-toast';
    toast.innerHTML = `
      <i class="fas fa-check-circle bm-toast-icon"></i>
      <div class="bm-toast-msg">${msg}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // 5. RENDER CART DRAWER & BADGE
  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Header Badges
    const badge = document.getElementById('bm-cart-count');
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }

    // Update Drawer Elements
    const itemsContainer = document.getElementById('bm-basket-items');
    const subtotalEl = document.getElementById('bm-basket-subtotal');
    const freeDeliveryText = document.getElementById('bm-free-delivery-text');
    const freeDeliveryProgress = document.getElementById('bm-free-delivery-progress');

    if (itemsContainer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = `
          <div class="text-center py-5 text-muted">
            <i class="fas fa-shopping-basket fa-3x mb-3 text-secondary" style="opacity: 0.35;"></i>
            <h6 class="font-weight-bold">Your basket is currently empty</h6>
            <p class="small">Explore our big brands and big savings to add items to your basket!</p>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = cart.map(item => `
          <div class="bm-basket-item" data-id="${item.id}">
            <img class="bm-basket-item-img" src="${item.img}" alt="${item.title}">
            <div class="bm-basket-item-info">
              <div class="bm-basket-item-title" title="${item.title}">${item.title}</div>
              <div class="bm-basket-item-price">£${(item.price * item.qty).toFixed(2)}</div>
              <div class="bm-qty-control">
                <button type="button" class="bm-qty-btn bm-btn-minus" data-id="${item.id}">-</button>
                <span class="bm-qty-val">${item.qty}</span>
                <button type="button" class="bm-qty-btn bm-btn-plus" data-id="${item.id}">+</button>
              </div>
            </div>
            <button type="button" class="bm-basket-item-remove" data-id="${item.id}" title="Remove item">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `).join('');
      }
    }

    if (subtotalEl) {
      subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
    }

    // Free shipping threshold £50
    if (freeDeliveryText && freeDeliveryProgress) {
      if (subtotal >= 50) {
        freeDeliveryText.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for FREE UK Standard Delivery!`;
        freeDeliveryProgress.style.width = '100%';
      } else {
        const remaining = (50 - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / 50) * 100));
        freeDeliveryText.innerHTML = `Add <strong>£${remaining}</strong> more to your order for <strong>FREE UK Delivery</strong>!`;
        freeDeliveryProgress.style.width = `${percent}%`;
      }
    }
  }

  // 6. QUICK VIEW MODAL
  function openQuickView(prod) {
    if (!prod) return;
    let modal = document.getElementById('bm-quickview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bm-quickview-modal';
      modal.className = 'bm-quickview-backdrop';
      document.body.appendChild(modal);
    }

    const savings = prod.rrp > prod.price ? (prod.rrp - prod.price).toFixed(2) : null;
    const savingsPct = prod.rrp > prod.price ? Math.round(((prod.rrp - prod.price) / prod.rrp) * 100) : null;

    modal.innerHTML = `
      <div class="bm-quickview-dialog">
        <button type="button" class="bm-quickview-close" id="bm-quickview-close-btn">&times;</button>
        <div class="p-4 p-md-5">
          <div class="row align-items-center">
            <div class="col-md-5 text-center mb-4 mb-md-0">
              <div class="p-3 bg-light rounded border">
                <img src="${prod.img}" alt="${prod.title}" class="img-fluid" style="max-height: 260px; object-fit: contain;">
              </div>
              ${prod.badge ? `<span class="badge badge-warning mt-2 px-3 py-1 font-weight-bold">${prod.badge}</span>` : ''}
            </div>
            <div class="col-md-7">
              <span class="text-muted small text-uppercase font-weight-bold">${prod.category}</span>
              <h4 class="font-weight-bold text-dark mt-1 mb-2">${prod.title}</h4>
              
              <div class="my-3">
                <span class="h3 font-weight-bold text-danger">£${prod.price.toFixed(2)}</span>
                ${prod.rrp ? `<span class="text-muted ml-2 font-weight-normal"><del>RRP £${prod.rrp.toFixed(2)}</del></span>` : ''}
                ${savings ? `<span class="badge badge-success ml-2 font-weight-bold">SAVE ${savingsPct}% (£${savings})</span>` : ''}
              </div>

              <p class="text-secondary small line-height-lg">${prod.desc}</p>

              <div class="p-2 mb-3 bg-light rounded border small">
                <div class="text-success font-weight-bold mb-1"><i class="fas fa-check-circle mr-1"></i> In Stock for Home Delivery</div>
                <div class="text-muted"><i class="fas fa-store mr-1"></i> Available in 700+ B&M stores nationwide</div>
              </div>

              <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center mr-3 border rounded overflow-hidden">
                  <button type="button" class="btn btn-light btn-sm px-3" id="bm-qv-minus">-</button>
                  <span class="px-3 font-weight-bold" id="bm-qv-qty">1</span>
                  <button type="button" class="btn btn-light btn-sm px-3" id="bm-qv-plus">+</button>
                </div>
                <button type="button" class="btn btn-primary btn-lg flex-grow-1 font-weight-bold" id="bm-qv-add-btn" style="background-color: var(--bm-orange); border-color: var(--bm-orange);">
                  <i class="fas fa-shopping-basket mr-2"></i> Add to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    let currentQty = 1;
    const qtyEl = document.getElementById('bm-qv-qty');
    document.getElementById('bm-qv-minus').onclick = () => {
      if (currentQty > 1) {
        currentQty--;
        qtyEl.textContent = currentQty;
      }
    };
    document.getElementById('bm-qv-plus').onclick = () => {
      currentQty++;
      qtyEl.textContent = currentQty;
    };
    document.getElementById('bm-qv-add-btn').onclick = () => {
      addToCart(prod.id, currentQty);
      modal.classList.remove('active');
    };
    document.getElementById('bm-quickview-close-btn').onclick = () => {
      modal.classList.remove('active');
    };
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  // 7. STORE FINDER MODAL
  function openStoreFinder(searchQuery = "") {
    let modal = document.getElementById('bm-storefinder-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bm-storefinder-modal';
      modal.className = 'bm-quickview-backdrop';
      document.body.appendChild(modal);
    }

    const filterStores = (q) => {
      if (!q) return STORES;
      const lower = q.toLowerCase();
      return STORES.filter(s => s.city.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower) || s.address.toLowerCase().includes(lower));
    };

    const renderList = (results) => {
      if (results.length === 0) {
        return `<div class="p-4 text-center text-muted">No B&M stores found for that search. Try "Manchester", "London", or "Liverpool".</div>`;
      }
      return results.map(s => `
        <div class="p-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
          <div>
            <h6 class="font-weight-bold text-dark mb-1"><i class="fas fa-map-marker-alt text-danger mr-2"></i>${s.name}</h6>
            <div class="small text-secondary mb-1">${s.address}</div>
            <div class="small text-muted"><i class="far fa-clock mr-1"></i>${s.hours}</div>
            <div class="mt-2">
              ${s.features.map(f => `<span class="badge badge-light border mr-1 small">${f}</span>`).join('')}
            </div>
          </div>
          <div class="mt-3 mt-sm-0 text-sm-right">
            <a href="tel:${s.phone.replace(/\s+/g, '')}" class="btn btn-outline-secondary btn-sm mb-1 d-block"><i class="fas fa-phone mr-1"></i>${s.phone}</a>
            <button type="button" class="btn btn-primary btn-sm d-block font-weight-bold" style="background-color: var(--bm-orange); border: none;" onclick="alert('Store selected as your favourite pickup store!')">Select Store</button>
          </div>
        </div>
      `).join('');
    };

    modal.innerHTML = `
      <div class="bm-quickview-dialog" style="max-width: 680px;">
        <button type="button" class="bm-quickview-close" id="bm-storefinder-close-btn">&times;</button>
        <div class="p-4 bg-primary text-white" style="background-color: var(--bm-blue) !important;">
          <h5 class="m-0 font-weight-bold"><i class="fas fa-map-marker-alt mr-2 text-warning"></i> Find Your Nearest B&M Store</h5>
          <p class="small mb-0 mt-1 opacity-75">Over 700 stores across the UK with huge savings every day</p>
        </div>
        <div class="p-3 bg-light border-bottom">
          <div class="input-group">
            <input type="text" class="form-control" id="bm-sf-input" placeholder="Enter city, town, or postcode (e.g. Manchester, Liverpool, E6)..." value="${searchQuery}">
            <div class="input-group-append">
              <button class="btn btn-primary" id="bm-sf-btn" type="button" style="background-color: var(--bm-orange); border: none;">Search</button>
            </div>
          </div>
        </div>
        <div id="bm-sf-results" style="max-height: 380px; overflow-y: auto;">
          ${renderList(filterStores(searchQuery))}
        </div>
      </div>
    `;

    modal.classList.add('active');

    const input = document.getElementById('bm-sf-input');
    const resultsContainer = document.getElementById('bm-sf-results');

    const doSearch = () => {
      const q = input.value.trim();
      resultsContainer.innerHTML = renderList(filterStores(q));
    };

    document.getElementById('bm-sf-btn').onclick = doSearch;
    input.onkeyup = (e) => {
      if (e.key === 'Enter') doSearch();
      else if (input.value.length >= 2 || input.value.length === 0) doSearch();
    };

    document.getElementById('bm-storefinder-close-btn').onclick = () => {
      modal.classList.remove('active');
    };
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  // 8. INITIALIZE UI WIDGETS
  function initDOM() {
    // A. Add Basket Button in Navbar
    const storesDropdown = document.querySelector('.bm-navbar-dropdown');
    if (storesDropdown && !document.getElementById('bm-cart-btn')) {
      const cartBtn = document.createElement('div');
      cartBtn.className = 'ml-2 ml-lg-3 order-md-last';
      cartBtn.innerHTML = `
        <button class="navbar-toggler align-items-center border-0 d-flex flex-column justify-content-center p-0 position-relative text-secondary bm-navbar-btn" id="bm-cart-btn" type="button" title="View Shopping Basket">
          <div class="position-relative">
            <i aria-hidden="true" class="fas fa-fw fa-shopping-basket my-1 bm-navbar-btn-icon"></i>
            <span class="badge badge-pill badge-primary position-absolute bm-cart-badge" id="bm-cart-count" style="top: -4px; right: -8px; font-size: 0.72rem; display: none;">0</span>
          </div>
          <span class="font-weight-bold bm-navbar-btn-text">Basket</span>
        </button>
      `;
      storesDropdown.parentNode.insertBefore(cartBtn, storesDropdown.nextSibling);

      cartBtn.querySelector('#bm-cart-btn').onclick = (e) => {
        e.preventDefault();
        openBasketDrawer();
      };
    }

    // B. Build Basket Drawer HTML
    if (!document.getElementById('bm-basket-drawer')) {
      const drawerWrap = document.createElement('div');
      drawerWrap.innerHTML = `
        <div class="bm-basket-overlay" id="bm-basket-overlay"></div>
        <div class="bm-basket-drawer" id="bm-basket-drawer">
          <div class="bm-basket-header">
            <h5><i class="fas fa-shopping-basket text-warning"></i> Your Basket</h5>
            <button type="button" class="bm-basket-close" id="bm-basket-close">&times;</button>
          </div>
          <div class="bm-delivery-bar">
            <div id="bm-free-delivery-text">Add £50.00 for FREE UK Delivery</div>
            <div class="bm-delivery-progress">
              <div class="bm-delivery-progress-fill" id="bm-free-delivery-progress"></div>
            </div>
          </div>
          <div class="bm-basket-items" id="bm-basket-items"></div>
          <div class="bm-basket-footer">
            <div class="bm-basket-subtotal-row">
              <span>Subtotal:</span>
              <span id="bm-basket-subtotal">£0.00</span>
            </div>
            <button type="button" class="bm-basket-checkout-btn" id="bm-checkout-btn">
              <i class="fas fa-lock mr-2"></i> Proceed to Secure Checkout
            </button>
            <div class="text-center mt-2 small text-muted">
              <i class="fas fa-shield-alt text-success mr-1"></i> 256-Bit SSL Encrypted Checkout
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawerWrap);

      document.getElementById('bm-basket-close').onclick = closeBasketDrawer;
      document.getElementById('bm-basket-overlay').onclick = closeBasketDrawer;

      // Event delegation for items in basket
      document.getElementById('bm-basket-items').addEventListener('click', (e) => {
        const plus = e.target.closest('.bm-btn-plus');
        const minus = e.target.closest('.bm-btn-minus');
        const remove = e.target.closest('.bm-basket-item-remove');

        if (plus) {
          updateQty(plus.dataset.id, 1);
        } else if (minus) {
          updateQty(minus.dataset.id, -1);
        } else if (remove) {
          removeFromCart(remove.dataset.id);
        }
      });

      document.getElementById('bm-checkout-btn').onclick = () => {
        if (cart.length === 0) {
          alert("Your basket is empty! Please add items before checking out.");
          return;
        }
        alert("🎉 Thank you for testing the B&M Clone Checkout! In a production site, this connects to the payment gateway.");
      };
    }

    // C. Enhance Product Cards on Page
    document.querySelectorAll('.bm-product-card').forEach((card) => {
      // Find product title
      const titleLink = card.querySelector('.bm-product-stretch-link');
      if (!titleLink) return;

      const title = titleLink.textContent.trim();
      const prod = getProductByTitle(title) || CATALOG[0];

      // Avoid duplicate action bars
      if (card.querySelector('.bm-card-action-bar')) return;

      const bar = document.createElement('div');
      bar.className = 'bm-card-action-bar';
      bar.innerHTML = `
        <button type="button" class="bm-btn-add-cart" data-id="${prod.id}" title="Add to basket">
          <i class="fas fa-shopping-basket"></i> Add
        </button>
        <button type="button" class="bm-btn-quick-view" data-id="${prod.id}" title="Quick view details">
          <i class="fas fa-eye"></i>
        </button>
      `;

      card.appendChild(bar);

      bar.querySelector('.bm-btn-add-cart').onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(prod.id, 1);
      };

      bar.querySelector('.bm-btn-quick-view').onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(prod);
      };

      // Also open quickview on card click if not clicking links
      titleLink.onclick = (e) => {
        e.preventDefault();
        openQuickView(prod);
      };
    });

    // D. Setup Live Autocomplete Search Bar
    const searchForm = document.querySelector('form[action="/search"]');
    const searchInput = searchForm ? searchForm.querySelector('input[type="search"]') : null;

    if (searchForm && searchInput) {
      searchForm.style.position = 'relative';

      let dropdown = document.getElementById('bm-search-results-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'bm-search-results-dropdown';
        dropdown.className = 'bm-search-results-dropdown';
        searchForm.appendChild(dropdown);
      }

      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
          dropdown.classList.remove('active');
          return;
        }

        const matches = CATALOG.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query)
        ).slice(0, 6);

        if (matches.length === 0) {
          dropdown.innerHTML = `
            <div class="p-3 text-center text-muted small">
              No direct matches for "<strong>${query}</strong>". Press Enter to browse departments.
            </div>
          `;
        } else {
          dropdown.innerHTML = `
            <div class="bm-search-header-cat">Products & Savings (${matches.length})</div>
            ${matches.map(m => `
              <div class="bm-search-res-item" data-id="${m.id}">
                <img class="bm-search-res-thumb" src="${m.img}" alt="${m.title}">
                <div class="bm-search-res-info">
                  <div class="bm-search-res-title">${m.title}</div>
                  <div class="bm-search-res-price">£${m.price.toFixed(2)} ${m.rrp ? `<span class="text-muted small font-weight-normal ml-1"><del>RRP £${m.rrp.toFixed(2)}</del></span>` : ''}</div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger font-weight-bold bm-search-quick-add" data-id="${m.id}">+ Add</button>
              </div>
            `).join('')}
          `;
        }

        dropdown.classList.add('active');
      });

      dropdown.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.bm-search-quick-add');
        const item = e.target.closest('.bm-search-res-item');
        if (addBtn) {
          e.stopPropagation();
          addToCart(addBtn.dataset.id, 1);
        } else if (item) {
          const prod = getProductById(item.dataset.id);
          dropdown.classList.remove('active');
          openQuickView(prod);
        }
      });

      document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });

      searchForm.onsubmit = (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          const matches = CATALOG.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
          if (matches.length > 0) {
            openQuickView(matches[0]);
          } else {
            alert(`Searching for: "${query}". Try searching for "air fryer", "clinique", or "christmas"!`);
          }
        }
      };
    }

    // E. Hook Up Stores Dropdown & Store Search Form
    const storeSearchForm = document.querySelector('form[data-algolia="headerFormStores"]');
    if (storeSearchForm) {
      storeSearchForm.onsubmit = (e) => {
        e.preventDefault();
        const input = storeSearchForm.querySelector('input[name="location"]');
        const loc = input ? input.value.trim() : "";
        openStoreFinder(loc);
      };
    }

    document.querySelectorAll('a[href="/stores"], a[data-toggle="geolocation"]').forEach(a => {
      a.onclick = (e) => {
        e.preventDefault();
        openStoreFinder();
      };
    });

    // F. Newsletter Signup Form
    const newsletterForm = document.querySelector('form[action*="newsletter"], .bm-footer form, section form');
    if (newsletterForm) {
      newsletterForm.onsubmit = (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]');
        const val = email ? email.value : "";
        alert(`✓ Thank you! ${val || 'Your email'} has been registered for B&M latest VIP deals and competitions.`);
        if (email) email.value = "";
      };
    }

    // G. Live Theme Switcher Floating Bar
    if (!document.getElementById("bm-theme-switch-pill")) {
      const switcher = document.createElement("div");
      switcher.id = "bm-theme-switch-pill";
      switcher.className = "bm-theme-switch-pill";
      switcher.innerHTML = `
        <span class="bm-theme-switch-label"><i class="fas fa-palette"></i> Theme:</span>
        ${THEMES.map(t => `
          <button type="button" class="bm-theme-btn ${t.id === currentTheme ? 'active' : ''}" data-theme="${t.id}" title="${t.name} (${t.desc})">
            <span class="bm-theme-dot ${t.dotClass}"></span>
            <span>${t.name}</span>
          </button>
        `).join('')}
      `;
      document.body.appendChild(switcher);

      switcher.addEventListener("click", (e) => {
        const btn = e.target.closest(".bm-theme-btn");
        if (btn && btn.dataset.theme) {
          applyTheme(btn.dataset.theme, true);
        }
      });
    }

    // Apply theme on body once ready
    applyTheme(currentTheme, false);

    // Render initial cart
    renderCart();
  }

  function openBasketDrawer() {
    renderCart();
    const drawer = document.getElementById('bm-basket-drawer');
    const overlay = document.getElementById('bm-basket-overlay');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBasketDrawer() {
    const drawer = document.getElementById('bm-basket-drawer');
    const overlay = document.getElementById('bm-basket-overlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }

})();
