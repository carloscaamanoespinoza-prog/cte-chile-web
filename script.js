/* ============================================================
   CTE Chile — Propuesta Alternativa · script.js
   ============================================================ */

/* ── Navbar: scroll shadow + mobile toggle ── */
(function () {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!navbar) return;

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }
})();

/* ── Counter animation (stats band) ── */
(function () {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const prefixes = { 3000: '+', 60: '', 5: '', 15: '' };

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value    = Math.floor(ease * target);
      const prefix   = target >= 3000 ? '+' : '';
      el.textContent = prefix + value.toLocaleString('es-CL');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('es-CL');
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { observer.observe(el); });
})();

/* ── Scroll-reveal animations ── */
(function () {
  const els = document.querySelectorAll(
    '.program-card, .team-card, .value-item, .timeline-item, .prog-detail, .contact-info-item'
  );
  if (!els.length) return;

  els.forEach(function (el, i) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease ' + (i % 4 * 0.08) + 's, transform .5s ease ' + (i % 4 * 0.08) + 's';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { observer.observe(el); });
})();

/* ── Contact form validation ── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const msgBox = document.getElementById('formMsg');

  function showMsg(text, type) {
    msgBox.textContent = text;
    msgBox.style.display = 'block';
    if (type === 'error') {
      msgBox.style.background = '#fef2f2';
      msgBox.style.color      = '#dc2626';
      msgBox.style.border     = '1px solid #fecaca';
    } else {
      msgBox.style.background = '#f0fdf4';
      msgBox.style.color      = '#16a34a';
      msgBox.style.border     = '1px solid #bbf7d0';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msgBox.style.display = 'none';

    // Honeypot check
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) return;

    const nombre  = form.querySelector('#nombre').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const mensaje = form.querySelector('#mensaje').value.trim();

    if (!nombre) { showMsg('Por favor ingresa tu nombre.', 'error'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Por favor ingresa un correo electrónico válido.', 'error'); return;
    }
    if (mensaje.length < 10) {
      showMsg('Por favor escribe un mensaje más detallado.', 'error'); return;
    }

    // Simulate send (replace with real fetch to contacto.php)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    setTimeout(function () {
      showMsg('¡Mensaje enviado! Te responderemos en las próximas 24–48 horas hábiles.', 'success');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
    }, 1200);
  });
})();

/* ── Active nav link by current page ── */
(function () {
  const page  = location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === page) a.classList.add('active');
    else if (href !== '#') a.classList.remove('active');
  });
})();
