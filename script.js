/* =============================================
   RECREA – script.js
   Interactividad, animaciones y filtros
   ============================================= */

/* ---- 1. PARTÍCULAS HERO ---- */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 100; // 🔥 más partículas

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    p.style.left = Math.random() * 100 + '%';
    p.style.top  = Math.random() * 100 + '%';

    // 🔥 velocidad más rápida y variada
    p.style.setProperty('--dur', (1.5 + Math.random() * 3) + 's');

    // 🔥 delay corto para que aparezcan más dinámicas
    p.style.setProperty('--delay', (Math.random() * 2) + 's');

    // 🔥 tamaños más visibles
    const size = 6 + Math.random() * 12;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';

    container.appendChild(p);
  }
})();

/* ---- 2. NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

/* ---- 3. HAMBURGER MENÚ ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- 4. ACTIVE NAV LINK POR SECCIÓN ---- */
const sections = document.querySelectorAll('section[id], div[id="hero-banner"]');
const navItems = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observerNav.observe(s));

/* ---- 5. SCROLL REVEAL (Intersection Observer) ---- */
const revealEls = document.querySelectorAll(
  '.about-card, .market-card, .pillar, .value-item, .biz-card, ' +
  '.team-card, .tutorial-card, .scale-item, .conv-card, ' +
  '.justif-type, .team-focus, .scale-block'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // delay escalonado para grupos de tarjetas
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('reveal'))
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = idx >= 0 ? idx * 80 : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- 6. FILTRO DE TUTORIALES ---- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const tutorialCards = document.querySelectorAll('.tutorial-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // actualizar botón activo
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    tutorialCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;

      if (show) {
        card.classList.remove('hidden');
        // pequeña animación de reentrada
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeCardIn 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inyectar keyframe dinámico para tarjetas filtradas
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeCardIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .nav-links a.active-link {
    color: #a8e063 !important;
    background: rgba(168,224,99,0.12) !important;
  }
`;
document.head.appendChild(styleSheet);

/* ---- 7. BOTÓN "VER MÁS" EN TUTORIALES ---- */
document.querySelectorAll('.btn-ver-mas').forEach(btn => {
  btn.addEventListener('click', () => {
    const card  = btn.closest('.tutorial-card');
    const extra = card.querySelector('.tc-extra');

    const isOpen = extra.style.display === 'block';

    // toggle contenido
    extra.style.display = isOpen ? 'none' : 'block';
    btn.classList.toggle('open', !isOpen);
    btn.innerHTML = isOpen
      ? 'Ver más <i class="fas fa-chevron-down"></i>'
      : 'Ver menos <i class="fas fa-chevron-down"></i>';
  });
});

/* ---- 8. SMOOTH SCROLL PARA TODOS LOS ENLACES # ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- 9. CONTADOR ANIMADO (impacto visual) ---- */
function animateCounters() {
  const counters = [
    { id: null, value: null } // placeholder — puedes agregar elementos con data-count
  ];
}

/* ---- 10. DESTACAR SECCIÓN ACTIVA CON INDICADOR ---- */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // El IntersectionObserver ya maneja esto, pero añadimos clase al body
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty('--scroll-pct', scrollPct);
      ticking = false;
    });
    ticking = true;
  }
});

/* ---- 11. PARALLAX SUAVE EN HERO ---- */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero-banner');
  if (!hero) return;
  const offset = window.scrollY;
  if (offset < window.innerHeight) {
    hero.style.backgroundPositionY = (offset * 0.35) + 'px';
    const content = hero.querySelector('.banner-content');
    if (content) content.style.transform = `translateY(${offset * 0.2}px)`;
  }
});

/* ---- 12. TOOLTIP SIMPLE EN TARJETAS DE MERCADO ---- */
// (Opcional: ya están los textos descriptivos en las cards)

/* ---- INIT ---- */
console.log('%cReCrea 🌱 Plataforma cargada', 'color:#2d7a4f;font-family:serif;font-size:1.1rem;font-weight:bold');
