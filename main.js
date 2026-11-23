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
  // Minimal Premium intro: approximately 0.8s, once per browser session.
  // The logo is animated by CSS; the overlay alone is timed by this controller.
  const splash = document.getElementById('site-intro');
  if (splash) {
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('medium29_intro_seen') === '1'; } catch (_) {}
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || alreadySeen) {
      splash.remove();
      document.documentElement.classList.add('intro-seen');
    } else {
      let finished = false;
      let backup;
      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(backup);
        splash.remove();
      };
      // Logo sharpens by ~430ms; overlay fades for 320ms, with no empty tail.
      setTimeout(() => {
        splash.classList.add('is-done');
        try { sessionStorage.setItem('medium29_intro_seen', '1'); } catch (_) {}
      }, 440);
      splash.addEventListener('transitionend', event => {
        if (event.target === splash && event.propertyName === 'opacity') finish();
      });
      // Failsafe if transitionend is unavailable (e.g. tab is backgrounded).
      backup = setTimeout(finish, 1100);
    }
  }
})();
