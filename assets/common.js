(function () {
'use strict';
    /* ---------- Footer year ---------- */
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

    /* ---------- Header border on scroll ---------- */
    const header = document.querySelector('[data-header]');
    const onScroll = () => header.classList.toggle('border-line', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('mobile-menu');
    const setMenu = (open) => {
      menu.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.querySelector('[data-icon-open]').classList.toggle('hidden', open);
      toggle.querySelector('[data-icon-close]').classList.toggle('hidden', !open);
    };
    toggle.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
    menu.querySelectorAll('[data-menu-link]').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 768px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
})();
