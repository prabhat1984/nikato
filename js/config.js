// ─── Nikato site configuration ─────────────────────────────────────────────
const NIKATO_CONFIG = {
  // Backend API (products, retailers, …). Change to your LAN IP for phones.
  API_BASE: 'http://127.0.0.1:8000/api',

  // Where the mobile app/APK lives. When left as an empty string the QR code
  // on the download page encodes the download page itself.
  APP_DOWNLOAD_URL: '',

  // How often the product catalog refreshes itself (milliseconds).
  CATALOG_REFRESH_MS: 30000,

  CONTACT: {
    email: 'support@nikato.in',
    phone: '+91 99999 99999',
    address: 'Nikato Technologies Pvt. Ltd., India',
  },
};
