(function () {
  'use strict';

  var html = document.documentElement;
  var KEY = 'zlromi-ui-theme';

  var SWATCHES = [
    ['Primary', '--zui-primary'],
    ['On Primary', '--zui-on-primary'],
    ['Primary Container', '--zui-primary-container'],
    ['On Primary Container', '--zui-on-primary-container'],
    ['Secondary', '--zui-secondary'],
    ['Secondary Container', '--zui-secondary-container'],
    ['Tertiary', '--zui-tertiary'],
    ['Tertiary Container', '--zui-tertiary-container'],
    ['Error', '--zui-error'],
    ['Error Container', '--zui-error-container'],
    ['Background', '--zui-background'],
    ['Surface 1', '--zui-surface-1'],
    ['Surface 2', '--zui-surface-2'],
    ['Surface 3', '--zui-surface-3'],
    ['Outline', '--zui-outline'],
    ['Outline Variant', '--zui-outline-variant']
  ];

  function safeGet(k) {
    try {
      return window.localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function safeSet(k, v) {
    try {
      window.localStorage.setItem(k, v);
    } catch (e) {
      /* ignore */
    }
  }

  function preferred() {
    var saved = safeGet(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    safeSet(KEY, theme);
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () {
      el.classList.remove('show');
    }, 1600);
  }

  function tokenValue(name) {
    return getComputedStyle(html).getPropertyValue(name).trim();
  }

  function rgbToHex(rgb) {
    var m = rgb.match(/(\d+)\s+(\d+)\s+(\d+)/) || rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return rgb;
    var hex = function (n) {
      return Number(n).toString(16).padStart(2, '0');
    };
    return ('#' + hex(m[1]) + hex(m[2]) + hex(m[3])).toUpperCase();
  }

  function renderSwatches() {
    var wrap = document.getElementById('swatches');
    if (!wrap) return;
    wrap.innerHTML = '';
    SWATCHES.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'zui-swatch';
      var chip = document.createElement('div');
      chip.className = 'zui-swatch-chip';
      chip.style.background = 'var(' + item[1] + ')';
      var meta = document.createElement('div');
      meta.className = 'zui-swatch-meta';
      var name = document.createElement('span');
      name.className = 'zui-swatch-name';
      name.textContent = item[0];
      var value = document.createElement('span');
      value.className = 'zui-swatch-value';
      value.textContent = rgbToHex(tokenValue(item[1])) + ' · ' + item[1];
      meta.appendChild(name);
      meta.appendChild(value);
      card.appendChild(chip);
      card.appendChild(meta);
      card.addEventListener('click', function () {
        var hex = rgbToHex(tokenValue(item[1]));
        copyText(hex);
      });
      wrap.appendChild(card);
    });
  }

  function copyText(text) {
    var done = function () {
      toast('已复制 ' + text);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text);
        done();
      });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      /* ignore */
    }
    document.body.removeChild(ta);
  }

  function initReveal() {
    var els = document.querySelectorAll('.zui-reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initScrollSpy() {
    var links = document.querySelectorAll('.zui-nav-link');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id.charAt(0) === '#') map[id.slice(1)] = link;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (link && entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove('is-active');
            });
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  var themeToggle = document.getElementById('themeToggle');
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.querySelector('.zui-nav');

  apply(preferred());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition) {
        document.startViewTransition(function () {
          apply(next);
          renderSwatches();
        });
      } else {
        apply(next);
        renderSwatches();
      }
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav) nav.classList.remove('open');
  });

  if (window.matchMedia) {
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (event) {
      if (!safeGet(KEY)) {
        apply(event.matches ? 'dark' : 'light');
        renderSwatches();
      }
    };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  renderSwatches();
  initReveal();
  initScrollSpy();

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
    });
  });
})();
