// ── Dynamic product catalog ────────────────────────────────────────────
// • Live data from the Nikato API (demo catalog fallback when offline)
// • Auto-refresh every CATALOG_REFRESH_MS (default 30s), paused when the
//   browser tab is hidden, and re-renders only when the data actually changed
// • Search, sort and category-chip filtering (Services page toolbar)
// • Skeleton loading cards, stock badges, retailer names, "updated X ago"

const DEMO_PRODUCTS = [
  { id: 1, name: 'Farm Fresh Milk',     category: 'Dairy',        price: 2.40,  discounted_price: null,   discount_percent: null, stock: 40, retailer: { id: 1, name: 'Green Basket' } },
  { id: 2, name: 'Bananas',             category: 'Fresh produce', price: 1.80, discounted_price: null,   discount_percent: null, stock: 65, retailer: { id: 1, name: 'Green Basket' } },
  { id: 3, name: 'Whole Wheat Bread',   category: 'Bakery',       price: 2.10,  discounted_price: null,   discount_percent: null, stock: 25, retailer: { id: 2, name: 'Daily Mart' } },
  { id: 4, name: 'Organic Tomatoes 1kg', category: 'Vegetables',  price: 48.00, discounted_price: 36.00,  discount_percent: 25,   stock: 50, retailer: { id: 1, name: 'Green Basket' } },
  { id: 6, name: 'Alphonso Mangoes 1kg', category: 'Fruits',      price: 180.00, discounted_price: 149.00, discount_percent: 17, stock: 30, retailer: { id: 1, name: 'Green Basket' } },
  { id: 8, name: 'Potato Chips - Salted 150g', category: 'Snacks', price: 30.00, discounted_price: null,   discount_percent: null, stock: 80, retailer: { id: 2, name: 'Daily Mart' } },
  { id: 10, name: 'Cold Coffee 200ml',  category: 'Beverages',    price: 60.00, discounted_price: null,   discount_percent: null, stock: 20, retailer: { id: 2, name: 'Daily Mart' } },
  { id: 13, name: 'USB-C Fast Charging Cable', category: 'Electronics', price: 199.00, discounted_price: 149.00, discount_percent: 25, stock: 15, retailer: { id: 3, name: 'Manvi General Store' } },
];

const REFRESH_MS = NIKATO_CONFIG.CATALOG_REFRESH_MS || 30000;

// Shared filter state (single catalog UI at a time per page).
const state = { products: [], offline: false, lastFetched: null, query: '', sort: 'featured', category: 'All' };

// ── Data ────────────────────────────────────────────────────────────────
async function fetchProducts() {
  try {
    const res = await fetch(`${NIKATO_CONFIG.API_BASE}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.offline = false;
    return Array.isArray(data) ? data : [];
  } catch (_) {
    state.offline = true;
    return DEMO_PRODUCTS;
  }
}

// One in-flight request shared by every mount, cached for 5s so the
// home grid and catalog never hit the API twice in a burst.
let inflight = null;
let inflightAt = 0;
function fetchShared() {
  if (!inflight || Date.now() - inflightAt > 5000) {
    inflightAt = Date.now();
    inflight = fetchProducts();
  }
  return inflight;
}

// ── Helpers ─────────────────────────────────────────────────────────────
const effPrice = (p) => (p.discounted_price && p.discounted_price < p.price) ? p.discounted_price : p.price;

const discountOf = (p) => p.discount_percent ??
  (p.discounted_price && p.discounted_price < p.price ? (1 - p.discounted_price / p.price) * 100 : 0);

function timeAgo(date) {
  if (!date) return 'never';
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function applyFilters() {
  let list = [...state.products];
  if (state.category !== 'All') list = list.filter((p) => p.category === state.category);
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter((p) => [p.name, p.category, p.retailer?.name].filter(Boolean).join(' ').toLowerCase().includes(q));
  }
  switch (state.sort) {
    case 'price-asc':  list.sort((a, b) => effPrice(a) - effPrice(b)); break;
    case 'price-desc': list.sort((a, b) => effPrice(b) - effPrice(a)); break;
    case 'discount':   list.sort((a, b) => discountOf(b) - discountOf(a)); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

// ── Templates ───────────────────────────────────────────────────────────
function productCard(p) {
  const hasDiscount = p.discounted_price && p.discounted_price < p.price;
  const price = hasDiscount ? p.discounted_price : p.price;
  const lowStock = typeof p.stock === 'number' && p.stock > 0 && p.stock <= 10;
  return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="product-card">
        <div class="product-img">
          ${p.name[0]}
          ${hasDiscount ? `<span class="product-discount">${Math.round(discountOf(p))}% OFF</span>` : ''}
        </div>
        <div class="product-body">
          <span class="product-cat">${p.category}</span>
          <strong>${p.name}</strong>
          ${p.retailer?.name ? `<span class="product-retailer"><i class="bi bi-shop me-1"></i>${p.retailer.name}</span>` : ''}
          <div class="d-flex align-items-center justify-content-between mt-auto pt-1">
            <div>
              <span class="product-price">₹${Number(price).toFixed(2)}</span>
              ${hasDiscount ? `<span class="product-mrp ms-1">₹${Number(p.price).toFixed(2)}</span>` : ''}
            </div>
            ${lowStock ? `<span class="stock-badge">Only ${p.stock} left</span>` : ''}
          </div>
        </div>
      </div>
    </div>`;
}

function skeletonCard() {
  return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="product-card">
        <div class="skeleton skeleton-img"></div>
        <div class="product-body">
          <div class="skeleton skeleton-line w-50"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line w-75"></div>
        </div>
      </div>
    </div>`;
}

const OFFLINE_NOTE = '<div class="col-12"><p class="small text-muted mb-0"><i class="bi bi-wifi-off me-1"></i>Showing demo catalog — API unreachable.</p></div>';
const EMPTY_NOTE = '<div class="col-12"><p class="text-muted text-center py-4 mb-0">No products match your search.</p></div>';

const TOOLBAR_HTML = `
  <div class="card border-0 shadow-sm mb-4 catalog-toolbar">
    <div class="card-body p-3">
      <div class="row g-2 align-items-center">
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
            <input type="search" class="form-control catalog-search border-start-0" placeholder="Search products or stores…">
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select catalog-sort">
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
        <div class="col-md-4 text-md-end">
          <span class="catalog-meta small text-secondary"></span>
          <button class="btn btn-outline-brand btn-sm catalog-refresh ms-2" title="Refresh now">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
      <div class="catalog-chips d-flex flex-wrap gap-2 mt-3"></div>
    </div>
  </div>`;

// ── Mount ───────────────────────────────────────────────────────────────
function mountCatalog(mount, { limit = 0, controls = false } = {}) {
  const isGrid = mount.hasAttribute('data-products');
  let grid, els = {};

  if (isGrid) {
    grid = mount; // mount itself is the Bootstrap .row
    grid.innerHTML = skeletonCard().repeat(4);
  } else {
    mount.innerHTML = (controls ? TOOLBAR_HTML : '') + '<div class="row g-3 catalog-grid"></div>';
    grid = mount.querySelector('.catalog-grid');
    grid.innerHTML = skeletonCard().repeat(8);
    if (controls) {
      els = {
        search:  mount.querySelector('.catalog-search'),
        sort:    mount.querySelector('.catalog-sort'),
        refresh: mount.querySelector('.catalog-refresh'),
        chips:   mount.querySelector('.catalog-chips'),
        meta:    mount.querySelector('.catalog-meta'),
      };
    }
  }

  function renderChips() {
    if (!els.chips) return;
    const counts = {};
    state.products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const cats = ['All', ...Object.keys(counts)];
    els.chips.innerHTML = cats.map((c) =>
      `<button class="chip ${state.category === c ? 'active' : ''}" data-cat="${c}">
        ${c}${c !== 'All' ? ` <span class="chip-count">${counts[c]}</span>` : ''}
      </button>`).join('');
  }

  let lastCount = 0;

  function updateMeta() {
    if (!els.meta) return;
    const parts = [`Updated ${timeAgo(state.lastFetched)}`];
    if (state.offline) parts.push('demo data');
    els.meta.textContent = `${lastCount} product${lastCount === 1 ? '' : 's'} • ${parts.join(' • ')}`;
  }

  function draw() {
    let list = applyFilters();
    lastCount = list.length;
    if (limit) list = list.slice(0, limit);
    grid.innerHTML = (list.length ? list.map(productCard).join('') : EMPTY_NOTE) + (state.offline ? OFFLINE_NOTE : '');
    renderChips();
    updateMeta();
  }

  async function load({ initial = false } = {}) {
    if (initial) grid.innerHTML = skeletonCard().repeat(limit || 8);
    if (els.refresh) {
      els.refresh.disabled = true;
      els.refresh.querySelector('i').classList.add('spin');
    }
    const fresh = await fetchShared();
    const changed = JSON.stringify(fresh) !== JSON.stringify(state.products);
    state.products = fresh;
    state.lastFetched = new Date();
    if (changed || initial) draw(); else updateMeta();
    if (els.refresh) {
      els.refresh.disabled = false;
      els.refresh.querySelector('i').classList.remove('spin');
    }
  }

  if (els.search) els.search.addEventListener('input', debounce((e) => { state.query = e.target.value.trim(); draw(); }, 150));
  if (els.sort) els.sort.addEventListener('change', (e) => { state.sort = e.target.value; draw(); });
  if (els.refresh) els.refresh.addEventListener('click', () => load());
  if (els.chips) els.chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    state.category = btn.dataset.cat;
    draw();
  });

  load({ initial: true });

  // Auto-refresh: only when the tab is visible; re-render is diff-based
  // so a unchanged catalog never disturbs what the user is doing.
  setInterval(() => { if (!document.hidden) load(); }, REFRESH_MS);
  // Keep the "Updated X ago" label honest.
  if (els.meta) setInterval(updateMeta, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-products]').forEach((el) =>
    mountCatalog(el, { limit: parseInt(el.dataset.limit || '0', 10) }));

  const catalog = document.getElementById('catalog');
  if (catalog) mountCatalog(catalog, { controls: true });

  // Reveal-on-scroll for elements with .reveal
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add('visible')),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
