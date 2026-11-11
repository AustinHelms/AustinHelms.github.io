(function () {
'use strict';
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'info@getchutestack.com';
    /* ---------- Contact form ---------- */
    const form    = document.querySelector('[data-contact-form]');
    const submit  = form.querySelector('[data-submit]');
    const statusP = form.querySelector('[data-form-status]');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function showError(field, show) {
      const input = form.elements[field];
      const msg = form.querySelector(`[data-error-for="${field}"]`);
      msg.classList.toggle('hidden', !show);
      input.classList.toggle('border-[#FF8A8A]', show);
      input.setAttribute('aria-invalid', String(show));
      if (show) input.setAttribute('aria-describedby', msg.id);
      else input.removeAttribute('aria-describedby');
    }
    function validate() {
      const v = Object.fromEntries(new FormData(form));
      const errors = {
        name: !v.name.trim(),
        email: !emailRe.test(v.email.trim()),
        message: !v.message.trim(),
      };
      Object.entries(errors).forEach(([k, bad]) => showError(k, bad));
      const firstBad = Object.keys(errors).find(k => errors[k]);
      if (firstBad) form.elements[firstBad].focus();
      return !firstBad;
    }
    ['name', 'email', 'message'].forEach(f => form.elements[f].addEventListener('input', () => showError(f, false)));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusP.textContent = '';
      if (form.elements.website.value) return;   // honeypot tripped
      if (!validate()) return;

      const data = Object.fromEntries(new FormData(form));
      delete data.website;

      // Fallback: no endpoint configured -> open the visitor's email app
      if (!FORM_ENDPOINT) {
        const body =
          `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '—'}\nPhone: ${data.phone || '—'}\n` +
          `CRM: ${data.crm}\nLeads per month: ${data.volume}\n\n${data.message}`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Fit call request')}&body=${encodeURIComponent(body)}`;
        statusP.className = 'mt-4 text-sm text-mist';
        statusP.textContent = 'Your email app should open with the request filled in. Press send there to finish.';
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Sending request…';
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        statusP.className = 'mt-4 text-sm text-volt';
        statusP.textContent = 'Request received. We\'ll email you within one business day with a link to book.';
      } catch (err) {
        statusP.className = 'mt-4 text-sm text-[#FF8A8A]';
        statusP.textContent = `The request didn't go through. Check your connection and try again, or email ${CONTACT_EMAIL}.`;
      } finally {
        submit.disabled = false;
        submit.textContent = 'Request my fit call';
      }
    });
})();
