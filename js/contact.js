// ── Contact form: client-side validation + mailto compose ──────────────
// The demo has no backend mail endpoint — a validated form opens the
// visitor's mail client pre-filled. Swap sendMessage() for a fetch() to
// your API when a contact endpoint exists.

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const feedback = field?.closest('.mb-3')?.querySelector('.invalid-feedback');
  if (field) field.classList.add('is-invalid');
  if (feedback) feedback.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
}

function sendMessage({ name, email, subject, message }) {
  const { email: to } = NIKATO_CONFIG.CONTACT;
  const body = `Hi Nikato team,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (name.length < 2) { showError('contact-name', 'Please enter your name.'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { showError('contact-email', 'Please enter a valid email address.'); valid = false; }
    if (subject.length < 3) { showError('contact-subject', 'Please add a short subject.'); valid = false; }
    if (message.length < 10) { showError('contact-message', 'Message should be at least 10 characters.'); valid = false; }
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';

    // Simulated send — replace with fetch() to your contact endpoint.
    setTimeout(() => {
      sendMessage({ name, email, subject, message });
      btn.disabled = false;
      btn.innerHTML = original;
      form.reset();
      const done = document.getElementById('contact-success');
      if (done) {
        done.classList.remove('d-none');
        setTimeout(() => done.classList.add('d-none'), 6000);
      }
    }, 600);
  });
});
