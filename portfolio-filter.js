document.addEventListener('DOMContentLoaded', function () {
  const controls = Array.from(document.querySelectorAll('[data-filter]'));
  const webCards = Array.from(document.querySelectorAll('#portfolioGrid .work-card'));
  const grid = document.getElementById('portfolioGrid');
  const app = document.querySelector('.featured-app[data-cat="aplikacije"]');
  const counter = document.getElementById('projectsCount');
  function show(category) {
    controls.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.filter === category)));
    const showWeb = category !== 'aplikacije';
    webCards.forEach(card => { card.hidden = !showWeb; });
    if (grid) grid.hidden = !showWeb;
    if (app) app.hidden = category === 'web';
    const total = (showWeb ? webCards.length : 0) + ((category !== 'web' && app) ? 1 : 0);
    if (counter) counter.textContent = 'Prikazano ' + total + (total === 1 ? ' projekt' : (total>=2 && total<=4 ? ' projekta' : ' projekata'));
  }
  controls.forEach(btn => btn.addEventListener('click', () => show(btn.dataset.filter)));
  show('sve');
});
