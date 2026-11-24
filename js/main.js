// Shared layout (navbar + footer), injected so every page stays in sync.

const NAV_LINKS = [
  { href: 'index.html',      label: 'Home' },
  { href: 'about.html',      label: 'About Us' },
  { href: 'services.html',   label: 'Services' },
  { href: 'training.html',   label: 'Training Video' },
  { href: 'contact.html',    label: 'Contact Us' },
  { href: 'complaint.html',  label: 'Complaint' },
];

function currentPage() {
  const file = location.pathname.split('/').pop();
  return file === '' ? 'index.html' : file;
}

function renderLayout() {
  const page = currentPage();

  const navItems = NAV_LINKS.map((l) => `
    <li class="nav-item">
      <a class="nav-link ${l.href === page ? 'active' : ''}" href="${l.href}">${l.label}</a>
    </li>`).join('');

  document.getElementById('site-nav').innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
      <div class="container">
        <a class="navbar-brand" href="index.html">
          <img src="assets/logo.png" alt="Nikato" height="44">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            ${navItems}
            <li class="nav-item ms-lg-3 mt-2 mt-lg-0">
              <a class="btn btn-brand btn-sm px-3" href="download.html">
                <i class="bi bi-phone me-1"></i> Download App
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;

  const year = new Date().getFullYear();
  document.getElementById('site-footer').innerHTML = `
    <footer class="text-white">
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-lg-4">
            <img src="assets/logo.png" alt="Nikato" height="52" class="mb-3">
            <p class="small text-white-50">Nearby. Delivered. Your neighbourhood stores,
            now on your phone — groceries, essentials and more, delivered in minutes.</p>
          </div>
          <div class="col-6 col-lg-2">
            <h6 class="fw-bold mb-3">Explore</h6>
            <ul class="list-unstyled small footer-links">
              ${NAV_LINKS.map((l) => `<li class="mb-2"><a href="${l.href}" class="text-white-50 text-decoration-none">${l.label}</a></li>`).join('')}
            </ul>
          </div>
          <div class="col-6 col-lg-3">
            <h6 class="fw-bold mb-3">Download</h6>
            <ul class="list-unstyled small footer-links">
              <li class="mb-2"><a href="download.html" class="text-white-50 text-decoration-none">Android App (APK)</a></li>
              <li class="mb-2"><a href="download.html" class="text-white-50 text-decoration-none">Scan QR Code</a></li>
              <li class="mb-2"><a href="training.html" class="text-white-50 text-decoration-none">How to use the app</a></li>
            </ul>
          </div>
          <div class="col-lg-3">
            <h6 class="fw-bold mb-3">Contact</h6>
            <ul class="list-unstyled small text-white-50">
              <li class="mb-2"><i class="bi bi-envelope me-2"></i>${NIKATO_CONFIG.CONTACT.email}</li>
              <li class="mb-2"><i class="bi bi-telephone me-2"></i>${NIKATO_CONFIG.CONTACT.phone}</li>
              <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>${NIKATO_CONFIG.CONTACT.address}</li>
            </ul>
          </div>
        </div>
        <hr class="border-secondary my-4">
        <div class="d-flex flex-column flex-md-row justify-content-between small text-white-50">
          <span>© ${year} Nikato. All rights reserved.</span>
          <a href="terms.html" class="text-white-50 text-decoration-none mt-2 mt-md-0">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>`;
}

document.addEventListener('DOMContentLoaded', renderLayout);
