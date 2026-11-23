/* Medium29 | Scroll-led focus reveal across page content.
   Progressive enhancement: preserves static text when JS is disabled and supports reduced motion. */
(function () {
  'use strict';

  if (!('requestAnimationFrame' in window) ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Site chrome, forms and cookie preferences are usable immediately, without motion.
  const skip = '#navbar, #mobileMenu, #site-intro, .logo, .cookie-banner, .cookie-modal, ' +
    '.cookie-overlay, [class*="cookie-consent"], .h-captcha, .captcha-wrap, ' +
    '.form-status, #submitBtn, .hero h1, .hero-scroll, .marquee-track, ' +
    '.service-icon, .value-icon, .team-avatar, .contact-method-icon, .home-app-mark, .work-arrow, ' +
    '[aria-live], [aria-hidden="true"], [contenteditable], script, style, svg, noscript, input, select, option, textarea';
  const zones = 'section, .page-hero, .cta-band, main.legal-page, .legal-footer, footer';
  const grouping = 'h1, h2, h3, h4, h5, h6, p, blockquote, li, label, figcaption, ' +
    'th, td, dt, dd, .process-mini-text, .faq-answer-inner';
  const locales = document.documentElement.lang || 'hr';
  const graphemes = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? new Intl.Segmenter(locales, {granularity: 'grapheme'}) : null;
  const chars = s => graphemes ? Array.from(graphemes.segment(s), x => x.segment) : Array.from(s);
  const clamp = n => Math.max(0, Math.min(1, n));

  // Group text nodes by their visual blocks so one paragraph reveals as one piece.
  const textMap = new Map();
  const tree = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = tree.nextNode())) {
    if (!node.nodeValue || !node.nodeValue.trim()) continue;
    const parent = node.parentElement;
    if (!parent || !parent.closest(zones) || parent.closest(skip)) continue;
    if (parent.closest('.contact-form') && !parent.closest('.contact-form-wrap > h3, .contact-form-wrap > p')) continue;
    // Avoid manipulating display strings that are changed dynamically by site scripts.
    if (parent.closest('[id="portfolioCount"], .portfolio-count, #formStatus')) continue;
    const block = parent.closest(grouping) || parent;
    if (!textMap.has(block)) textMap.set(block, []);
    textMap.get(block).push(node);
  }

  const entries = [];
  for (const [block, nodes] of textMap) {
    const len = nodes.reduce((n, t) => n + t.nodeValue.length, 0);
    // Long legal paragraphs reveal by words to keep DOM/paint cost reasonable.
    const byWord = len > 155;
    let index = 0;
    const pieces = [];
    for (const t of nodes) {
      const original = t.nodeValue;
      const out = document.createDocumentFragment();
      // Keep original content readable to assistive technologies and find-in-page.
      const run = document.createElement('span');
      run.className = 'scroll-blur-run';
      const accessible = document.createElement('span');
      accessible.className = 'scroll-blur-sr';
      accessible.textContent = original;
      run.appendChild(accessible);
      const visual = document.createElement('span');
      visual.className = 'scroll-blur-visual';
      visual.setAttribute('aria-hidden', 'true');
      // Keep whitespace as text nodes; group normal words to prevent bad line breaks.
      for (const token of original.match(/\s+|[^\s]+/gu) || []) {
        if (/^\s+$/u.test(token)) {
          visual.appendChild(document.createTextNode(token));
          continue;
        }
        const word = document.createElement('span');
        word.className = 'scroll-blur-word';
        if (token.length > 23) word.classList.add('scroll-blur-breakable');
        const units = byWord ? [token] : chars(token);
        for (const unit of units) {
          const span = document.createElement('span');
          span.className = 'scroll-blur-letter';
          span.textContent = unit;
          pieces.push(span);
          word.appendChild(span);
        }
        visual.appendChild(word);
      }
      run.appendChild(visual);
      out.appendChild(run);
      t.replaceWith(out);
    }
    if (!pieces.length) continue;
    const last = Math.max(1, pieces.length - 1);
    pieces.forEach((piece, i) => {
      piece.style.setProperty('--sb-start', ((i / last) * .55).toFixed(4));
    });
    block.classList.add('scroll-blur-text');
    // Old heading/motion fades would compete with the letter-level animation.
    if (block.matches('.reveal')) {
      block.classList.remove('reveal');
      block.classList.add('revealed');
    }
    if (block.matches('.motion-item')) {
      block.classList.remove('motion-item');
      block.classList.add('motion-visible');
    }
    entries.push({element: block, previous: -1, done: false});
  }

  // The same treatment for photography and non-textual elements, but gentler.
  // Keep interactive cards, buttons and form controls free of whole-element blur.
  const media = document.querySelectorAll(
    'section img, .works-section img, .service-icon, .value-icon, .team-avatar, ' +
    '.contact-method-icon, .home-app-mark, .phone, .app-preview img'
  );
  for (const el of media) {
    if (el.closest('#site-intro, #navbar, .mobile-menu') || el.classList.contains('scroll-blur-media')) continue;
    el.classList.add('scroll-blur-media');
    entries.push({element: el, previous: -1, done: false, media: true});
  }
  if (!entries.length) return;

  let pending = false;
  const viewport = () => window.innerHeight || document.documentElement.clientHeight || 800;
  function finish(e) {
    e.done = true;
    e.element.classList.add('scroll-blur-clear');
    e.element.style.removeProperty('--sb-progress');
  }
  function update() {
    pending = false;
    const h = viewport();
    const enter = h * .94;
    const full = h * .46;
    for (const e of entries) {
      if (e.done) continue;
      const rect = e.element.getBoundingClientRect();
      if (rect.top > enter) continue;
      // Hidden FAQ answers should animate when opened, not while collapsed.
      if (e.element.closest('.faq-answer:not(.open)') &&
          !e.element.closest('.faq-item.open')) continue;
      // On first visit/read, elements already high on the screen stay legible.
      const progress = clamp((enter - rect.top) / (enter - full));
      if (progress >= .999) { finish(e); continue; }
      if (Math.abs(progress - e.previous) < .005) continue;
      e.previous = progress;
      e.element.style.setProperty('--sb-progress', progress.toFixed(3));
    }
    if (entries.every(e => e.done)) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  // FAQ buttons expand hidden answers; recalculate when the answer opens.
  document.querySelectorAll('.faq-question').forEach(button => button.addEventListener('click', () => {
    requestAnimationFrame(schedule);
  }));
  schedule();
  document.fonts?.ready.then(schedule).catch(() => {});
  // Non-visual marker for verifying the enhancement without changing layout.
  document.documentElement.dataset.scrollBlur = 'enabled';
})();
