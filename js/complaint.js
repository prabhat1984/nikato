// ── Complaint form: client-side validation + mailto compose ─────────────
// No backend mail endpoint in the static site — a validated form opens the
// visitor's mail client pre-filled. Swap sendComplaint() for a fetch() to
// your API when a complaints endpoint exists.

function showComplaintError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const feedback = field?.closest('.mb-3')?.querySelector('.invalid-feedback');
  if (field) field.classList.add('is-invalid');
  if (feedback) feedback.textContent = message;
}

function clearComplaintErrors(form) {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
}

function sendComplaint({ name, phone, orderId, category, date, message }) {
  const { email: to } = NIKATO_CONFIG.CONTACT;
  const subject = `[Complaint] ${category}${orderId ? ` — Order #${orderId}` : ''}`;
  const lines = [
    'Hi Nikato team,',
    '',
    'I would like to register a complaint.',
    '',
    `Category: ${category}`,
    orderId ? `Order ID: #${orderId}` : null,
    date ? `Date of issue: ${date}` : null,
    '',
    message,
    '',
    `— ${name}`,
    `Registered mobile: ${phone}`,
  ].filter(Boolean);
  const body = lines.map(encodeURIComponent).join('%0D%0A');
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('complaint-form');
  if (!form) return;

  // Cannot complain about the future.
  const dateField = document.getElementById('complaint-date');
  if (dateField) dateField.max = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearComplaintErrors(form);

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const orderId = form.orderId.value.trim();
    const category = form.category.value;
    const date = form.date.value;
    const message = form.message.value.trim();
    let valid = true;

    if (name.length < 2) { showComplaintError('complaint-name', 'Please enter your name.'); valid = false; }
    if (!/^[6-9]\d{9}$/.test(phone)) { showComplaintError('complaint-phone', 'Enter a valid 10-digit Indian mobile number (starts with 6–9).'); valid = false; }
    if (orderId && !/^\d+$/.test(orderId)) { showComplaintError('complaint-order-id', 'Order ID should be a number (see your order SMS).'); valid = false; }
    if (date && date > dateField.max) { showComplaintError('complaint-date', 'Date cannot be in the future.'); valid = false; }
    if (!category) { showComplaintError('complaint-category', 'Please choose a category.'); valid = false; }
    if (message.length < 15) { showComplaintError('complaint-message', 'Please describe the issue in at least 15 characters.'); valid = false; }
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting…';

    // Simulated send — replace with fetch() to your complaints endpoint.
    setTimeout(() => {
      sendComplaint({ name, phone, orderId, category, date, message });
      btn.disabled = false;
      btn.innerHTML = original;
      form.reset();
      const done = document.getElementById('complaint-success');
      if (done) {
        done.classList.remove('d-none');
        setTimeout(() => done.classList.add('d-none'), 6000);
      }
    }, 600);
  });
});
