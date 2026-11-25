/* Nextab, Inc. — disease brief shared script
   · access gate (same key and SHA-256 check as the platform page)
   · EN | KO switching via [data-ko] (English lives in the markup)
   · reveal and chart animation
*/
(function () {
  'use strict';

  var LANG_KEY = 'nextab.th1.lang';
  var GATE_KEY = 'nextab_th1_unlocked_v1';
  var GATE_HASH = '0e0c8d9c5fa46e66bd8293289e410bbc9e35da10a211a4d5c3e0b64a373db54f';
  var html = document.documentElement;
  var MSG = {
    en: { gateWrong: 'That code is not correct. Please check it and try again.', gateEmpty: 'Please enter your access code.' },
    ko: { gateWrong: '접속 코드가 맞지 않습니다. 다시 확인해 주세요.', gateEmpty: '접속 코드를 입력해 주세요.' }
  };
  var lang = 'en';

  function readLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'ko' || q === 'en') return q;
    try { var s = localStorage.getItem(LANG_KEY); if (s === 'ko' || s === 'en') return s; } catch (e) {}
    return 'en';
  }

  function applyLang(next, sync) {
    lang = (next === 'ko') ? 'ko' : 'en';
    html.lang = lang;
    var t = html.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var d = html.getAttribute('data-desc-' + lang);
    var md = document.querySelector('meta[name="description"]');
    if (d && md) md.setAttribute('content', d);
    var ogt = document.querySelector('meta[property="og:title"]');
    if (t && ogt) ogt.setAttribute('content', t);
    var ogd = document.querySelector('meta[property="og:description"]');
    if (d && ogd) ogd.setAttribute('content', d);
    document.body.classList.toggle('lang-ko', lang === 'ko');
    document.querySelectorAll('[data-ko]').forEach(function (el) {
      if (!el.hasAttribute('data-en-html')) el.setAttribute('data-en-html', el.innerHTML);
      el.innerHTML = (lang === 'ko') ? el.getAttribute('data-ko') : el.getAttribute('data-en-html');
    });
    document.querySelectorAll('[data-ko-aria-label]').forEach(function (el) {
      if (!el.hasAttribute('data-en-aria-label')) el.setAttribute('data-en-aria-label', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', (lang === 'ko') ? el.getAttribute('data-ko-aria-label') : el.getAttribute('data-en-aria-label'));
    });
    document.querySelectorAll('[data-ko-alt]').forEach(function (el) {
      if (!el.hasAttribute('data-en-alt')) el.setAttribute('data-en-alt', el.getAttribute('alt') || '');
      el.setAttribute('alt', (lang === 'ko') ? el.getAttribute('data-ko-alt') : el.getAttribute('data-en-alt'));
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang));
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    if (sync !== false) {
      try {
        var u = new URL(location.href);
        if (u.searchParams.get('lang') !== lang) { u.searchParams.set('lang', lang); history.replaceState(null, '', u.toString()); }
      } catch (e) {}
    }
  }

  document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.langBtn, true); });
  });

  /* current disease in the switcher */
  var here = (location.pathname.split('/').pop() || '').toLowerCase();
  document.querySelectorAll('.dbar a').forEach(function (a) {
    if ((a.getAttribute('href') || '').toLowerCase() === here) a.setAttribute('aria-current', 'page');
  });

  applyLang(readLang(), false);

  /* ---------- animation ---------- */
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function runBars(scope) {
    scope.querySelectorAll('.fill[data-w]').forEach(function (f, i) {
      var v = Math.max(0, Math.min(100, parseFloat(f.dataset.w)));
      f.style.setProperty('--w0', v + '%');
      if (reduce) { f.style.width = v + '%'; return; }
      setTimeout(function () { f.style.width = v + '%'; }, i * 85);
    });
    scope.querySelectorAll('.vfill[data-h]').forEach(function (f, i) {
      var v = Math.max(0, Math.min(100, parseFloat(f.dataset.h)));
      if (reduce) { f.style.height = v + '%'; return; }
      setTimeout(function () { f.style.height = v + '%'; }, i * 85);
    });
    scope.querySelectorAll('.trend .series').forEach(function (p) {
      try { p.style.setProperty('--len', p.getTotalLength()); } catch (e) {}
    });
    scope.classList.add('chart-in');
  }

  function runCounts(scope) {
    scope.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.dec || '0', 10);
      if (reduce || isNaN(end)) return;
      var dur = 1100, t0 = performance.now(), prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
      function tick(now) {
        var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + (end * e).toFixed(dec) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + end.toFixed(dec) + suffix;
      }
      el.textContent = prefix + (0).toFixed(dec) + suffix;
      requestAnimationFrame(tick);
    });
  }

  function initMotion() {
    var reveals = document.querySelectorAll('.reveal');
    /* every chart scope: explicit [data-chart] blocks, plus bar / column groups and
       single bars that sit outside them, and trend SVGs */
    var set = new Set(document.querySelectorAll('[data-chart]'));
    document.querySelectorAll('.bars,.vbars,.trend').forEach(function (e) {
      if (!e.closest('[data-chart]')) set.add(e);
    });
    document.querySelectorAll('.bar:not(.bars .bar)').forEach(function (e) { set.add(e); });
    var charts = Array.from(set);
    function isChart(el) { return el.hasAttribute('data-chart') || el.matches('.bars,.vbars,.bar,.trend'); }
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (x) { x.classList.add('in'); });
      charts.forEach(function (c) { if (isChart(c)) runBars(c); runCounts(c); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (isChart(e.target)) { runBars(e.target); runCounts(e.target); }
        io.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (x) { io.observe(x); });
    charts.forEach(function (c) { io.observe(c); });
  }

  /* ---------- SHA-256 (crypto.subtle with a pure-JS fallback) ---------- */
  function sha256Fallback(str) {
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
    var bytes = [], i, c, cp;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) bytes.push(c);
      else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c >= 0xd800 && c < 0xdc00 && i + 1 < str.length) {
        cp = 0x10000 + ((c - 0xd800) << 10) + (str.charCodeAt(++i) - 0xdc00);
        bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      } else bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    bytes.push(0, 0, 0, 0, (bitLen >>> 24) & 255, (bitLen >>> 16) & 255, (bitLen >>> 8) & 255, bitLen & 255);
    for (var off = 0; off < bytes.length; off += 64) {
      var w = new Array(64);
      for (i = 0; i < 16; i++) w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3];
      for (i = 16; i < 64; i++) {
        var s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c2 = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25), ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22), mj = (a & b) ^ (a & c2) ^ (b & c2);
        var t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c2; c2 = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c2) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = '';
    for (i = 0; i < 8; i++) out += ('00000000' + (H[i] >>> 0).toString(16)).slice(-8);
    return out;
  }

  function digest(str) {
    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest && window.TextEncoder) {
      try {
        var buf = new TextEncoder().encode(str);
        return window.crypto.subtle.digest('SHA-256', buf).then(function (res) {
          var b = new Uint8Array(res), hex = '';
          for (var i = 0; i < b.length; i++) hex += ('0' + b[i].toString(16)).slice(-2);
          return hex;
        }).catch(function () { return sha256Fallback(str); });
      } catch (e) {}
    }
    return Promise.resolve(sha256Fallback(str));
  }

  var gateEl = document.querySelector('#access-gate'),
      gateForm = document.querySelector('#gate-form'),
      gateInput = document.querySelector('#gate-code'),
      gateError = document.querySelector('#gate-error');

  function gateSay(m) { if (!gateError) return; gateError.textContent = m; gateError.classList.add('show'); if (gateForm) gateForm.classList.add('error'); }
  function gateClear() { if (!gateError) return; gateError.classList.remove('show'); if (gateForm) gateForm.classList.remove('error'); }

  function openSite() {
    try { sessionStorage.setItem(GATE_KEY, '1'); } catch (e) {}
    if (gateEl) {
      gateEl.style.display = 'flex';
      gateEl.style.pointerEvents = 'none';
      gateEl.setAttribute('aria-hidden', 'true');
      window.requestAnimationFrame(function () { gateEl.classList.add('gate-leaving'); });
    }
    html.classList.remove('gate-locked');
    if (gateEl) window.setTimeout(function () { gateEl.style.display = 'none'; }, 820);
    initMotion();
  }

  if (gateEl && html.classList.contains('gate-locked')) {
    if (gateInput) { try { gateInput.focus({ preventScroll: true }); } catch (e) { try { gateInput.focus(); } catch (e2) {} } }
    if (gateInput) gateInput.addEventListener('input', gateClear);
    if (gateForm) {
      gateForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var code = gateInput ? gateInput.value.trim() : '';
        if (!code) { gateSay(MSG[lang].gateEmpty); return; }
        digest(code).then(function (hex) {
          if (hex === GATE_HASH) { gateClear(); openSite(); }
          else {
            gateSay(MSG[lang].gateWrong);
            if (gateInput) { gateInput.value = ''; try { gateInput.focus(); } catch (e) {} }
          }
        });
      });
    }
  } else {
    if (gateEl) { gateEl.style.display = 'none'; gateEl.setAttribute('aria-hidden', 'true'); }
    initMotion();
  }
})();
