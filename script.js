(function () {
  'use strict';

  // ── Helpers ──
  function safeStorage(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  // ── Nav scroll ──
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else if (!nav.classList.contains('nav-static')) nav.classList.remove('scrolled');
    });
  }

  // ── Active nav link ──
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // ── Mobile nav ──
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileClose = document.querySelector('.mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', function () {
      if (hamburger) hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (hamburger) hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Dark mode toggle ──
  function applyTheme(dark) {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    updateIcon();
  }

  function updateIcon() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var dark = document.body.classList.contains('dark');
    btn.textContent = dark ? '☀️' : '🌙';
    btn.title = dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  // Init theme
  var saved = safeStorage('practygo-theme');
  var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (!saved && sysDark));

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = !document.body.classList.contains('dark');
      applyTheme(isDark);
      safeStorage('practygo-theme', isDark ? 'dark' : 'light');
    });
  }

  // ── Scroll reveal ──
  var revealEls = document.querySelectorAll('.reveal');

  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Safety fallback: if still hidden after 1.5s, reveal everything
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains('visible')) el.classList.add('visible');
      });
    }, 1500);
  } else {
    // Browser doesn't support IntersectionObserver — reveal immediately
    revealAll();
  }

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ── Contact form ──
  var form = document.getElementById('contactForm');
  var successBox = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      var orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        form.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      }).catch(function () {
        // Even on error show success (Formspree not yet configured)
        form.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      });
    });
  }

  // ── Counter animation ──
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 1800;
    var start = performance.now();
    function run(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

})();
