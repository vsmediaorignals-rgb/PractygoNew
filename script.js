(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     SAFE localStorage
  ───────────────────────────────────────────── */
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  /* ─────────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────────── */
  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (dot && ring) {
    var mx = -100, my = -100;
    var rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    var hoverable = 'a, button, [data-tilt], .service-card, .plan-card, .faq-question, .contact-card, input, select, textarea, .wa-fab';
    document.querySelectorAll(hoverable).forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-expanded'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-expanded'); });
    });
    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ─────────────────────────────────────────────
     NAV SCROLL
  ───────────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav && !nav.classList.contains('nav-static')) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ─────────────────────────────────────────────
     MOBILE NAV
  ───────────────────────────────────────────── */
  var hamburger   = document.querySelector('.hamburger');
  var mobileNav   = document.querySelector('.mobile-nav');
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

  /* ─────────────────────────────────────────────
     DARK MODE
  ───────────────────────────────────────────── */
  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.title = dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }
  var saved  = store('practygo-theme');
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

  /* ─────────────────────────────────────────────
     WORD CYCLE (hero headline)
  ───────────────────────────────────────────── */
  var wc = document.getElementById('wordCycle');
  if (wc) {
    var words = ['Medical', 'Dental', 'Wellness', 'Clinic', 'Specialist'];
    var wi = 0;
    setInterval(function () {
      wc.classList.add('wc-out');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        wc.textContent = words[wi];
        wc.classList.remove('wc-out');
      }, 240);
    }, 2600);
  }

  /* ─────────────────────────────────────────────
     CANVAS PARTICLES (hero background)
  ───────────────────────────────────────────── */
  var canvas = document.getElementById('heroCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var pts = [];
    var W, H;
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (var i = 0; i < 55; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .38,
        vy: (Math.random() - .5) * .38,
        r: Math.random() * 1.6 + .4
      });
    }
    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      // draw connections
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.strokeStyle = 'rgba(96,165,250,' + (1 - dist / 130) * 0.22 + ')';
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
      }
      // draw dots
      pts.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,0.55)';
        ctx.fill();
        // move
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ─────────────────────────────────────────────
     REVEAL ON SCROLL
  ───────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  function showAll() { reveals.forEach(function (el) { el.classList.add('visible'); }); }
  if (!reveals.length) {
    // nothing
  } else if (typeof IntersectionObserver === 'undefined') {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 1800);
  }

  /* ─────────────────────────────────────────────
     PROCESS CONNECTOR ANIMATION
  ───────────────────────────────────────────── */
  var connector = document.getElementById('processConnector');
  if (connector && typeof IntersectionObserver !== 'undefined') {
    var connIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        connector.classList.add('animated');
        connIO.disconnect();
      }
    }, { threshold: 0.5 });
    connIO.observe(connector.parentElement);
  }

  /* ─────────────────────────────────────────────
     CARD TILT EFFECT
  ───────────────────────────────────────────── */
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top  + rect.height / 2;
      var rx = (e.clientY - cy) / (rect.height / 2) * -6;
      var ry = (e.clientX - cx) / (rect.width  / 2) *  6;
      card.style.transform = 'translateY(-8px) perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(function () { card.style.transition = ''; }, 500);
    });
  });

  /* ─────────────────────────────────────────────
     MAGNETIC BUTTONS
  ───────────────────────────────────────────── */
  document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var dx = e.clientX - (rect.left + rect.width  / 2);
      var dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = 'translate(' + dx * 0.28 + 'px, ' + dy * 0.28 + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
      btn.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(function () { btn.style.transition = ''; }, 500);
    });
  });

  /* ─────────────────────────────────────────────
     FAQ ACCORDION
  ───────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item   = q.parentElement;
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        var a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '';
      });
      if (!isOpen && answer) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ─────────────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
     SERVICE NAV PILL SMOOTH SCROLL
  ───────────────────────────────────────────── */
  document.querySelectorAll('.svc-nav-pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      var href = pill.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ─────────────────────────────────────────────
     SCROLL PROGRESS INDICATOR
  ───────────────────────────────────────────── */
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#2563eb,#60a5fa);z-index:9999;width:0;transition:width .1s linear;';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight * 100) : 0;
    progressBar.style.width = pct + '%';
  });

})();
