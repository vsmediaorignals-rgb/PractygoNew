(function () {

  /* ── safe localStorage ── */
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  /* ── nav scroll (home page only – inner pages use nav-static) ── */
  var nav = document.querySelector('.nav');
  if (nav && !nav.classList.contains('nav-static')) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── mobile nav ── */
  var hamburger  = document.querySelector('.hamburger');
  var mobileNav  = document.querySelector('.mobile-nav');
  var mobileClose = document.querySelector('.mobile-close');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    if (mobileClose) {
      mobileClose.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── dark mode ── */
  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.title = dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }
  var saved = store('practygo-theme');
  var sysDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches);
  setTheme(saved === 'dark' || (!saved && sysDark));
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = !document.body.classList.contains('dark');
      setTheme(isDark);
      store('practygo-theme', isDark ? 'dark' : 'light');
    });
  }

  /* ── reveal on scroll ── */
  var reveals = document.querySelectorAll('.reveal');
  function showAll() {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }
  if (!reveals.length) {
    // nothing to do
  } else if (typeof IntersectionObserver === 'undefined') {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 1600); // hard fallback
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item   = q.parentElement;          // .faq-item is the direct parent
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');
      /* close all */
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        var a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '';
      });
      /* open clicked if it was closed */
      if (!isOpen && answer) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── contact form ── */
  var form       = document.getElementById('contactForm');
  var successBox = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      var data = new FormData(form);
      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function () {
          form.style.display = 'none';
          if (successBox) successBox.style.display = 'block';
        })
        .catch(function () {
          form.style.display = 'none';
          if (successBox) successBox.style.display = 'block';
        });
    });
  }

  /* ── counters ── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var start  = performance.now();
    (function run(now) {
      var p = Math.min((now - start) / 1800, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(run);
    })(start);
  }
  if (typeof IntersectionObserver !== 'undefined') {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(function (el) { co.observe(el); });
  }

})();
