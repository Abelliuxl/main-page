// Raidpapa — bilingual switcher that syncs with main-page's localStorage key.
(function () {
  'use strict';

  var STORAGE_KEY = 'homepage-language';
  var DEFAULT_LANG = 'zh';

  function readLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'zh') return stored;
    } catch (e) { /* localStorage may be blocked */ }
    return DEFAULT_LANG;
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');

    var nodes = document.querySelectorAll('[data-en][data-zh]');
    for (var i = 0; i < nodes.length; i++) {
      var text = lang === 'en' ? nodes[i].getAttribute('data-en') : nodes[i].getAttribute('data-zh');
      // Use textContent for non-form controls to avoid HTML injection.
      nodes[i].textContent = text;
    }
  }

  // initial apply
  applyLang(readLang());

  // listen for changes from main-page or other tabs
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) applyLang(readLang());
  });

  // poll for in-page changes (e.g. user toggles language inside main-page and returns)
  setInterval(function () {
    var current = document.documentElement.getAttribute('data-lang');
    if (current !== readLang()) applyLang(readLang());
  }, 800);
})();
