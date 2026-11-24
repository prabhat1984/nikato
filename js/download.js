// ── Download page: QR code + install steps ─────────────────────────────

function qrTargetUrl() {
  // Priority: explicit config → current page URL (always scannable).
  return NIKATO_CONFIG.APP_DOWNLOAD_URL || window.location.href;
}

function renderQr() {
  const box = document.getElementById('qrcode');
  const label = document.getElementById('qr-url');
  if (!box) return;

  const url = qrTargetUrl();
  if (typeof QRCode === 'undefined') {
    box.innerHTML = '<p class="text-danger small">QR library failed to load. Check your internet connection.</p>';
    return;
  }

  box.innerHTML = '';
  new QRCode(box, {
    text: url,
    width: 220,
    height: 220,
    colorDark: '#1A1A2E',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
  if (label) label.textContent = url;
}

function renderSteps() {
  const list = document.getElementById('install-steps');
  if (!list) return;
  const steps = [
    { icon: 'bi-qr-code-scan', title: 'Scan the QR code', text: 'Point your phone camera at the code above. No app needed to scan — your browser opens the link.' },
    { icon: 'bi-download', title: 'Download the Nikato app', text: 'Tap the download button on the page that opens to get the Nikato APK.' },
    { icon: 'bi-shield-check', title: 'Allow installation', text: 'If prompted, allow "Install from this source" in your phone settings — the app is signed by Nikato.' },
    { icon: 'bi-person-plus', title: 'Sign up & order', text: 'Open Nikato, verify your mobile number with OTP, set your location and start ordering from nearby stores.' },
  ];

  list.innerHTML = steps.map((s, i) => `
    <div class="col-md-6">
      <div class="card card-feature h-100 border-0 shadow-sm">
        <div class="card-body p-4 d-flex gap-3">
          <div class="step-icon">${i + 1}</div>
          <div>
            <h3 class="h6 fw-bold mb-1"><i class="bi ${s.icon} me-1 brand-text"></i>${s.title}</h3>
            <p class="small text-secondary mb-0">${s.text}</p>
          </div>
        </div>
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderQr();
  renderSteps();
});
