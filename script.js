/* ═══════════════════════════════════════════════════════════
   CANTINHO ENCANTADO — JavaScript
═══════════════════════════════════════════════════════════ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (cur > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = cur;
});

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const h   = section.offsetHeight;
    const id  = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + h) {
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ── MENU TABS ── */
const tabBtns    = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const el = document.getElementById(`tab-${target}`);
    if (el) el.classList.add('active');

    // Scroll tabs into view on mobile
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(
  '.menu-item, .exp-card, .contato-card, .badge-item, .enc-card, .sobre-text, .info-ticket, .ambiente-carousel'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

/* ── MARQUEE LIGHTS RANDOM DELAY ── */
document.querySelectorAll('.marquee-lights span').forEach((span, i) => {
  span.style.animationDelay = `${(i % 3) * 0.4}s`;
});

/* ── STAR PARALLAX ── */
const stars = document.querySelectorAll('.star');
window.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  stars.forEach((star, i) => {
    const depth = (i + 1) * 6;
    star.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
}, { passive: true });

/* ── AMBIENTE CAROUSEL ── */
(function () {
  const track    = document.getElementById('ambienteTrack');
  const prevBtn  = document.getElementById('ambientePrev');
  const nextBtn  = document.getElementById('ambienteNext');
  const dotsWrap = document.getElementById('ambienteDots');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // Gera os dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Suporte a swipe mobile
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  });
})();

/* ── INIT ── */
updateActiveNav();
