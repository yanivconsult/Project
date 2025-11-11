// Utilities
const qs = (sel, ctx=document) => ctx.querySelector(sel);
const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Sticky header shadow + year
const header = qs('[data-header]');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const onScroll = () => {
  if (!header) return;
  if (window.scrollY > 4) {
    header.style.boxShadow = '0 10px 30px rgba(0,0,0,.25)';
  } else {
    header.style.boxShadow = 'none';
  }
  highlightActiveLink();
};
window.addEventListener('scroll', onScroll);

// Mobile nav toggle
const navToggle = qs('[data-nav-toggle]');
const nav = qs('[data-nav]');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    document.body.classList.toggle('nav-open');
  });
  // Close menu on link click (mobile)
  qsa('.menu a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Dropdown (hover + keyboard + click)
qsa('[data-dropdown]').forEach(item => {
  const btn = item.querySelector('button');
  const menu = item.querySelector('.dropdown');
  if (!btn || !menu) return;

  const open = () => { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const close = () => { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    qsa('.has-dropdown.open').forEach(i => i !== item && i.classList.remove('open'));
    isOpen ? close() : open();
  });

  item.addEventListener('mouseenter', open);
  item.addEventListener('mouseleave', close);

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') { e.preventDefault(); menu.querySelector('a')?.focus(); }
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', (e) => {
    if (!item.contains(e.target)) close();
  });
});

// Active section highlighting
const sections = qsa('main section[id]');
const menuLinks = qsa('.menu a[href^="#"]');
function highlightActiveLink(){
  let current = sections[0]?.id;
  const scrollPos = window.scrollY + 120; // header offset
  sections.forEach(sec => {
    const top = sec.offsetTop;
    if (scrollPos >= top) current = sec.id;
  });
  menuLinks.forEach(link => {
    const href = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', href === current);
  });
}

// Contact form validation (client-side demo)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const setError = (el, msg) => { const s = el.parentElement.querySelector('.error'); if (s) s.textContent = msg || ''; };
    const name = form.name;
    const email = form.email;
    const message = form.message;

    if (!name.value.trim() || name.value.trim().length < 2) { setError(name, 'Please enter your name'); valid = false; } else setError(name, '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email, 'Enter a valid email'); valid = false; } else setError(email, '');
    if (!message.value.trim()) { setError(message, 'Please enter a message'); valid = false; } else setError(message, '');

    if (valid) {
      // Simulate success (replace with real submission endpoint)
      qs('.form-success')?.removeAttribute('hidden');
      form.reset();
    }
  });
}
