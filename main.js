// Shared site interactions (no third-party animation dependency)
(function () {
  'use strict';
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const docLang = document.documentElement.lang || 'hr';
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  hamburger?.addEventListener('click', () => mobileMenu?.classList.contains('open') ? closeMenu() : openMenu());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  mobileMenu?.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 60), {passive:true});
  nav?.classList.toggle('scrolled', window.scrollY > 60);
  // Highlight current page in both navigation areas (including clean Cloudflare URLs).
  const clean = path => (path.replace(/\.html$/, '').replace(/\/$/,'') || '/');
  document.querySelectorAll('.nav-links a,.mobile-menu-links a').forEach(a => {
    try { if (clean(new URL(a.href).pathname) === clean(location.pathname)) a.classList.add('active'); } catch (_) {}
  });
  // No invisible content when JavaScript is unavailable; observer is a progressive enhancement.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed');revObserver.unobserve(entry.target); }
    }),{threshold:0.08,rootMargin:'0px 0px 35px 0px'});
    document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }
  const motion = document.querySelectorAll('.section-title,.service-block,.pricing-card,.mission-left,.mission-right,.number-item,.value-card,.team-card,.contact-method,.contact-form-wrap,.faq-item');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('motion-visible');observer.unobserve(entry.target);}
    }), {rootMargin:'0px 0px -35px 0px',threshold:0.05});
    motion.forEach(el => { el.classList.add('motion-item'); observer.observe(el); });
    document.body.classList.add('motion-ready');
  }
  // Brand writing animation, once per session; skips reduced-motion preference.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('medium29_intro_seen') === '1'; } catch (_) {}
    const splash=document.getElementById('site-intro');
    if (!alreadySeen && splash) {
      setTimeout(() => { splash.classList.add('is-done'); try {sessionStorage.setItem('medium29_intro_seen','1');} catch (_) {} }, 2050);
      splash.addEventListener('transitionend',()=>splash.remove(),{once:true});
    } else { splash?.remove(); }
  }
})();
