/* Medium29 — scroll-linked letter clarity. No animation library needed. */
(function () {
  'use strict';

  if (!window.requestAnimationFrame ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Restrict to editorial headings: the hero, cards, prices and form fields stay calm.
  const headings = Array.from(document.querySelectorAll(
    '.section-title, .service-block h2, .big-quote blockquote'
  ));
  if (!headings.length) return;

  const splitGraphemes = text => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(document.documentElement.lang || 'hr', {
        granularity: 'grapheme'
      }).segment(text), segment => segment.segment);
    }
    return Array.from(text);
  };

  const entries = [];
  for (const heading of headings) {
    // Text stays in the original HTML for indexing and no-JavaScript visitors.
    const originalText = heading.innerText.replace(/\s+/g, ' ').trim();
    if (!originalText) continue;

    const textNodes = [];
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const letters = [];
    for (const textNode of textNodes) {
      const source = textNode.nodeValue;
      if (!source || !source.trim()) continue;
      const fragment = document.createDocumentFragment();
      for (const part of source.match(/\s+|[^\s]+/gu) || []) {
        if (/^\s+$/u.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          continue;
        }
        const word = document.createElement('span');
        word.className = 'scroll-blur-word';
        word.setAttribute('aria-hidden', 'true');
        for (const grapheme of splitGraphemes(part)) {
          const letter = document.createElement('span');
          letter.className = 'scroll-blur-letter';
          letter.textContent = grapheme;
          word.appendChild(letter);
          letters.push(letter);
        }
        fragment.appendChild(word);
      }
      textNode.replaceWith(fragment);
    }

    if (!letters.length) continue;
    heading.setAttribute('aria-label', originalText);
    // Suppress old full-heading fades; this effect replaces them on these titles.
    heading.classList.remove('reveal', 'motion-item');
    heading.classList.add('scroll-blur-text');
    entries.push({ heading, letters, previous: -1, done: false });
  }

  if (!entries.length) return;
  let pending = false;
  const clamp = value => Math.max(0, Math.min(1, value));

  function update() {
    pending = false;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (!viewportHeight) return;
    // Blur-to-clear is scrubbed between 94% and 48% of the screen height.
    const startY = viewportHeight * .94;
    const endY = viewportHeight * .48;

    for (const entry of entries) {
      if (entry.done) continue;
      const top = entry.heading.getBoundingClientRect().top;
      if (top > startY) continue;
      const progress = clamp((startY - top) / (startY - endY));
      if (Math.abs(progress - entry.previous) < .008 && progress < 1) continue;
      entry.previous = progress;

      if (progress >= 1) {
        entry.heading.classList.add('scroll-blur-clear');
        entry.done = true; // Once read, text stays sharp even when scrolling back.
        continue;
      }

      const last = Math.max(1, entry.letters.length - 1);
      entry.letters.forEach((letter, index) => {
        const start = (index / last) * .57;
        const t = clamp((progress - start) / .43);
        const eased = t * t * (3 - 2 * t);
        letter.style.opacity = (0.16 + .84 * eased).toFixed(3);
        letter.style.filter = `blur(${(6.5 * (1 - eased)).toFixed(2)}px)`;
        letter.style.transform = `translate3d(0, ${(5 * (1 - eased)).toFixed(2)}px, 0)`;
      });
    }

    // Retire work once every heading has finished revealing.
    if (entries.every(entry => entry.done)) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
  document.fonts?.ready.then(schedule).catch(() => {});
})();
