// ── Training page: data-driven video cards + modal player ──────────────
// HOW TO ADD VIDEOS: paste your YouTube/Vimeo embed URL into `src` below.
// YouTube format: https://www.youtube.com/embed/VIDEO_ID
// (Use the /embed/ form — plain watch URLs refuse to play in iframes.)

const TRAINING_VIDEOS = [
  {
    id: 'login-otp',
    title: 'Login with OTP',
    duration: '2 min',
    level: 'Beginner',
    description: 'Enter your registered mobile number, verify the OTP you receive and land on Home.',
    src: '', // ← paste your YouTube embed URL here
  },
  {
    id: 'search-select',
    title: 'Search & Select Products',
    duration: '3 min',
    level: 'Beginner',
    description: 'Browse categories, search by name and view product details before adding to cart.',
    src: '',
  },
  {
    id: 'order-pay',
    title: 'Place Order & Pay',
    duration: '3 min',
    level: 'Easy',
    description: 'Confirm your delivery address, then pay online or choose cash on delivery.',
    src: '',
  },
  {
    id: 'track-order',
    title: 'Track Your Order',
    duration: '2 min',
    level: 'Easy',
    description: 'Get your order ID on screen and by SMS on your registered mobile, then follow every status live.',
    src: '',
  },
  {
    id: 'settings',
    title: 'Settings: Language, Location & Logout',
    duration: '4 min',
    level: 'Easy',
    description: 'Choose from 9 languages, save or clear your delivery location, and log out safely.',
    src: '',
  },
  {
    id: 'become-partner',
    title: 'Nikato for Store Partners',
    duration: '6 min',
    level: 'Partner',
    description: 'Own a local store? See how to list your shop and receive orders on Nikato.',
    src: '',
  },
];

const LEVEL_BADGES = {
  Beginner: 'text-bg-success',
  Easy: 'text-bg-info text-dark',
  Partner: 'text-bg-warning text-dark',
};

function trainingCard(video, index) {
  const badge = LEVEL_BADGES[video.level] || 'text-bg-secondary';
  return `
    <div class="col-md-6 col-lg-4 reveal">
      <div class="card training-card border-0 shadow-sm h-100">
        <button class="training-thumb ratio ratio-16x9 border-0 p-0" data-video-index="${index}"
                data-bs-toggle="modal" data-bs-target="#videoModal" aria-label="Play ${video.title}">
          <span class="training-play"><i class="bi bi-play-fill"></i></span>
        </button>
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge ${badge}">${video.level}</span>
            <span class="small text-secondary"><i class="bi bi-clock me-1"></i>${video.duration}</span>
          </div>
          <h3 class="h6 fw-bold mb-1">${video.title}</h3>
          <p class="small text-secondary mb-0">${video.description}</p>
        </div>
      </div>
    </div>`;
}

function renderTraining() {
  const grid = document.getElementById('training-grid');
  if (!grid) return;
  grid.innerHTML = TRAINING_VIDEOS.map(trainingCard).join('');
}

function wireModal() {
  const modal = document.getElementById('videoModal');
  const title = document.getElementById('videoModalLabel');
  const body = document.getElementById('video-modal-body');
  if (!modal || !body) return;

  modal.addEventListener('show.bs.modal', (e) => {
    const btn = e.relatedTarget;
    const video = TRAINING_VIDEOS[Number(btn?.dataset.videoIndex)];
    if (!video) return;
    title.textContent = video.title;
    body.innerHTML = video.src
      ? `<div class="ratio ratio-16x9"><iframe src="${video.src}" title="${video.title}" allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`
      : `<div class="video-placeholder">
           <i class="bi bi-camera-video display-4 brand-text"></i>
           <p class="mt-3 mb-1 fw-semibold">Video coming soon</p>
           <p class="small text-secondary mb-0">Ask your admin to add the embed URL for “${video.title}”
           in <code>js/training.js</code> (field <code>src</code>).</p>
         </div>`;
  });

  // Stop playback when the modal closes.
  modal.addEventListener('hidden.bs.modal', () => { body.innerHTML = ''; });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTraining();
  wireModal();
});
