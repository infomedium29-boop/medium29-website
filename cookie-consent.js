(function () {
  var STORAGE_KEY = 'medium29_cookie_consent_v1';
  var DEFAULT_CONSENT = { necessary: true, analytics: false, marketing: false, preferences: false };
  var CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

  function getConsent() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      var parsed = JSON.parse(saved);
      var savedAt = parsed.date ? new Date(parsed.date).getTime() : 0;
      if (!savedAt || Date.now() - savedAt > CONSENT_MAX_AGE_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return Object.assign({}, DEFAULT_CONSENT, parsed);
    } catch (e) { return null; }
  }

  function saveConsent(consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, DEFAULT_CONSENT, consent, { date: new Date().toISOString() })));
    applyConsent(consent);
    hideBanner();
    closePreferences();
  }

  function applyConsent(consent) {
    window.Medium29CookieConsent = Object.assign({}, DEFAULT_CONSENT, consent);
    document.querySelectorAll('script[type="text/plain"][data-cookiecategory]').forEach(function (script) {
      var category = script.getAttribute('data-cookiecategory');
      if (!window.Medium29CookieConsent[category] || script.getAttribute('data-cookie-loaded') === 'true') return;
      var activeScript = document.createElement('script');
      Array.from(script.attributes).forEach(function (attr) {
        if (attr.name !== 'type' && attr.name !== 'data-cookiecategory' && attr.name !== 'data-cookie-loaded') activeScript.setAttribute(attr.name, attr.value);
      });
      activeScript.text = script.text || script.textContent || script.innerHTML;
      script.setAttribute('data-cookie-loaded', 'true');
      script.parentNode.insertBefore(activeScript, script.nextSibling);
    });
    window.dispatchEvent(new CustomEvent('medium29CookieConsentUpdated', { detail: window.Medium29CookieConsent }));
  }

  function hideBanner() {
    var banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
  }

  function showBanner() {
    var banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.add('show');
  }

  function openPreferences() {
    var modal = document.getElementById('cookiePreferences');
    var saved = getConsent() || DEFAULT_CONSENT;
    ['analytics', 'marketing', 'preferences'].forEach(function (key) {
      var input = document.getElementById('cookie-' + key);
      if (input) input.checked = !!saved[key];
    });
    if (modal) modal.classList.add('show');
  }

  function closePreferences() {
    var modal = document.getElementById('cookiePreferences');
    if (modal) modal.classList.remove('show');
  }


  // Cookie UI translations, keeping the existing consent storage and categories unchanged.
  function translateCookieContent(wrapper) {
    var lang = document.documentElement.lang || 'hr';
    if (lang === 'hr') return;
    var dictionary = {
      en: {
        'Koristimo kolačiće':'We use cookies',
        'Koristimo nužne kolačiće za rad stranice, a analitičke i marketinške samo uz Vašu privolu. Postavke možete promijeniti u bilo kojem trenutku.':'We use essential cookies for website operation and optional analytics and marketing cookies only with your consent. You can change your settings at any time. ',
        'Saznajte više':'Learn more',
        'Postavke':'Settings', 'Odbij':'Reject', 'Prihvati sve':'Accept all',
        'Postavke privatnosti':'Privacy settings',
        'Odaberite koje kategorije kolačića dopuštate. Nužni kolačići uvijek su aktivni jer omogućuju osnovni rad web stranice.':'Choose which cookie categories to allow. Essential cookies are always active because they enable the website to function.',
        'Nužni kolačići':'Essential cookies',
        'Potrebni su za sigurnost, prikaz stranice i spremanje Vaših postavki privole.':'Required for security, website display and remembering your consent preferences.',
        'Analitički kolačići':'Analytics cookies',
        'Pomažu razumjeti kako se stranica koristi, npr. Google Analytics, ako ga dodate.':'Help us understand website usage, such as through Google Analytics if added in the future.',
        'Marketinški kolačići':'Marketing cookies',
        'Koriste se za oglase i remarketing, npr. Meta Pixel, ako ga dodate.':'Used for advertising and remarketing, such as Meta Pixel if added in the future.',
        'Preferencije':'Preferences',
        'Pamte dodatne postavke korisnika ako ih stranica kasnije bude koristila.':'Remember additional settings if the website uses them in the future.',
        'Zatvori':'Close','Spremi odabir':'Save selection'
      },
      de: {
        'Koristimo kolačiće':'Wir verwenden Cookies',
        'Koristimo nužne kolačiće za rad stranice, a analitičke i marketinške samo uz Vašu privolu. Postavke možete promijeniti u bilo kojem trenutku.':'Wir verwenden notwendige Cookies für den Betrieb sowie optionale Analyse- und Marketing-Cookies nur mit Ihrer Einwilligung. Sie können Ihre Einstellungen jederzeit ändern. ',
        'Saznajte više':'Mehr erfahren',
        'Postavke':'Einstellungen','Odbij':'Ablehnen','Prihvati sve':'Alle akzeptieren',
        'Postavke privatnosti':'Datenschutzeinstellungen',
        'Odaberite koje kategorije kolačića dopuštate. Nužni kolačići uvijek su aktivni jer omogućuju osnovni rad web stranice.':'Wählen Sie aus, welche Cookie-Kategorien Sie erlauben. Notwendige Cookies sind immer aktiv, da sie grundlegende Website-Funktionen ermöglichen.',
        'Nužni kolačići':'Notwendige Cookies',
        'Potrebni su za sigurnost, prikaz stranice i spremanje Vaših postavki privole.':'Erforderlich für Sicherheit, Darstellung und Speicherung Ihrer Einwilligung.',
        'Analitički kolačići':'Analyse-Cookies',
        'Pomažu razumjeti kako se stranica koristi, npr. Google Analytics, ako ga dodate.':'Helfen uns zu verstehen, wie die Website genutzt wird, etwa durch Google Analytics, falls später aktiviert.',
        'Marketinški kolačići':'Marketing-Cookies',
        'Koriste se za oglase i remarketing, npr. Meta Pixel, ako ga dodate.':'Werden für Werbung und Remarketing eingesetzt, etwa durch Meta Pixel, falls später aktiviert.',
        'Preferencije':'Präferenzen',
        'Pamte dodatne postavke korisnika ako ih stranica kasnije bude koristila.':'Merken zusätzliche Einstellungen, falls die Website sie künftig verwendet.',
        'Zatvori':'Schließen','Spremi odabir':'Auswahl speichern'
      }
    }[lang];
    if (!dictionary) return;
    var walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
    var current;
    while ((current = walker.nextNode())) {
      var key = current.nodeValue.trim();
      if (dictionary[key]) current.nodeValue = current.nodeValue.replace(key,dictionary[key]);
    }
    wrapper.querySelectorAll('a[href="/politika-kolacica"]').forEach(function(a){ a.href = '/'+lang+'/politika-kolacica'; });
    var labels = {
      en:['Cookie notice','Close notice and continue with essential cookies only','Cookie settings'],
      de:['Cookie-Hinweis','Hinweis schließen und nur notwendige Cookies verwenden','Cookie-Einstellungen']
    }[lang];
    wrapper.querySelector('#cookieBanner')?.setAttribute('aria-label',labels[0]);
    wrapper.querySelector('.cookie-banner-close')?.setAttribute('aria-label',labels[1]);
    wrapper.querySelector('#cookiePreferences')?.setAttribute('aria-label',labels[2]);
  }

  function injectMarkup() {
    if (document.getElementById('cookieBanner')) return;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="cookie-banner" id="cookieBanner" role="dialog" aria-live="polite" aria-label="Obavijest o kolačićima">
        <button class="cookie-banner-close" type="button" data-cookie-close-banner aria-label="Zatvori obavijest i nastavi samo s nužnim tehnologijama">×</button>
        <div class="cookie-banner-content">
          <h3>Koristimo kolačiće</h3>
          <p>Koristimo nužne kolačiće za rad stranice, a analitičke i marketinške samo uz Vašu privolu. Postavke možete promijeniti u bilo kojem trenutku. <a href="/politika-kolacica">Saznajte više</a>.</p>
        </div>
        <div class="cookie-banner-actions">
          <button class="cookie-btn ghost" type="button" data-cookie-settings>Postavke</button>
          <button class="cookie-btn" type="button" data-cookie-reject>Odbij</button>
          <button class="cookie-btn primary" type="button" data-cookie-accept>Prihvati sve</button>
        </div>
      </div>
      <div class="cookie-preferences" id="cookiePreferences" role="dialog" aria-modal="true" aria-label="Postavke kolačića">
        <div class="cookie-modal">
          <h3>Postavke privatnosti</h3>
          <p>Odaberite koje kategorije kolačića dopuštate. Nužni kolačići uvijek su aktivni jer omogućuju osnovni rad web stranice.</p>
          <div class="cookie-option">
            <div><strong>Nužni kolačići</strong><small>Potrebni su za sigurnost, prikaz stranice i spremanje Vaših postavki privole.</small></div>
            <label class="cookie-switch"><input type="checkbox" checked disabled></label>
          </div>
          <div class="cookie-option">
            <div><strong>Analitički kolačići</strong><small>Pomažu razumjeti kako se stranica koristi, npr. Google Analytics, ako ga dodate.</small></div>
            <label class="cookie-switch"><input id="cookie-analytics" type="checkbox"></label>
          </div>
          <div class="cookie-option">
            <div><strong>Marketinški kolačići</strong><small>Koriste se za oglase i remarketing, npr. Meta Pixel, ako ga dodate.</small></div>
            <label class="cookie-switch"><input id="cookie-marketing" type="checkbox"></label>
          </div>
          <div class="cookie-option">
            <div><strong>Preferencije</strong><small>Pamte dodatne postavke korisnika ako ih stranica kasnije bude koristila.</small></div>
            <label class="cookie-switch"><input id="cookie-preferences-input" type="checkbox"></label>
          </div>
          <div class="cookie-modal-actions">
            <button class="cookie-btn" type="button" data-cookie-close>Zatvori</button>
            <button class="cookie-btn ghost" type="button" data-cookie-save-selected>Spremi odabir</button>
            <button class="cookie-btn primary" type="button" data-cookie-accept>Prihvati sve</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrapper);
    translateCookieContent(wrapper);
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      if (event.target.matches('[data-cookie-accept]')) {
        saveConsent({ necessary: true, analytics: true, marketing: true, preferences: true });
      }
      if (event.target.matches('[data-cookie-reject], [data-cookie-close-banner]')) {
        saveConsent({ necessary: true, analytics: false, marketing: false, preferences: false });
      }
      if (event.target.matches('[data-cookie-settings], .cookie-settings-link')) {
        event.preventDefault();
        openPreferences();
      }
      if (event.target.matches('[data-cookie-close]') || event.target.id === 'cookiePreferences') {
        closePreferences();
      }
      if (event.target.matches('[data-cookie-save-selected]')) {
        saveConsent({
          necessary: true,
          analytics: !!document.getElementById('cookie-analytics')?.checked,
          marketing: !!document.getElementById('cookie-marketing')?.checked,
          preferences: !!document.getElementById('cookie-preferences-input')?.checked
        });
      }
    });
  }

  window.openCookiePreferences = openPreferences;

  document.addEventListener('DOMContentLoaded', function () {
    injectMarkup();
    bindEvents();
    var saved = getConsent();
    if (saved) applyConsent(saved); else showBanner();
  });
})();
