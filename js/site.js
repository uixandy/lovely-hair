(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const frame = document.getElementById('heroFrame');
  const prevBtn = document.querySelector('.hero-nav-prev');
  const nextBtn = document.querySelector('.hero-nav-next');

  if (slides.length) {
    let cur = 0;
    let heroInt = null;

    function go(i) {
      slides[cur].classList.remove('is-active');
      if (dots[cur]) dots[cur].classList.remove('is-active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('is-active');
      if (dots[cur]) dots[cur].classList.add('is-active');
    }

    function restart() {
      clearInterval(heroInt);
      heroInt = setInterval(() => go(cur + 1), 5000);
    }

    heroInt = setInterval(() => go(cur + 1), 5000);

    dots.forEach((d) => d.addEventListener('click', () => {
      go(parseInt(d.dataset.i, 10));
      restart();
    }));

    if (prevBtn) prevBtn.addEventListener('click', () => { go(cur - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { go(cur + 1); restart(); });

    if (frame) {
      let startX = 0;
      let tracking = false;

      const pointerStart = (x) => { tracking = true; startX = x; };
      const pointerEnd = (x) => {
        if (!tracking) return;
        tracking = false;
        const dx = x - startX;
        if (Math.abs(dx) > 40) {
          go(dx < 0 ? cur + 1 : cur - 1);
          restart();
        }
      };

      frame.addEventListener('touchstart', (e) => pointerStart(e.changedTouches[0].clientX), { passive: true });
      frame.addEventListener('touchend', (e) => pointerEnd(e.changedTouches[0].clientX));
      frame.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;
        pointerStart(e.clientX);
      });
      window.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') return;
        pointerEnd(e.clientX);
      });
    }
  }

  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      const href = a.getAttribute('href') || '';
      if (href && !href.startsWith('#')) return;
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  const bf = document.getElementById('bookFloat');
  if (bf) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) bf.classList.add('visible');
      else bf.classList.remove('visible');
    });
  }

  const TYPE_CONFIG = {
    'cormorant-inter': {
      gfont: 'Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600',
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    'playfair-nunito': {
      gfont: 'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito+Sans:wght@300;400;500;600',
      display: "'Playfair Display', Georgia, serif",
      body: "'Nunito Sans', sans-serif"
    },
    'dmserif-dmsans': {
      gfont: 'DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600',
      display: "'DM Serif Display', Georgia, serif",
      body: "'DM Sans', sans-serif"
    },
    'caslon-manrope': {
      gfont: 'Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600',
      display: "'Libre Caslon Text', Georgia, serif",
      body: "'Manrope', sans-serif"
    }
  };

  function applyTypePairing(key) {
    const c = TYPE_CONFIG[key]; if (!c) return;
    const link = document.getElementById('gfont-link');
    if (link) link.href = 'https://fonts.googleapis.com/css2?family=' + c.gfont + '&display=swap';
    document.documentElement.style.setProperty('--font-display', c.display);
    document.documentElement.style.setProperty('--font-body', c.body);
    document.querySelectorAll('#typeOpts .tweak-opt').forEach((b) =>
      b.classList.toggle('active', b.dataset.key === key));
  }

  if (window.__TWEAKS) applyTypePairing(window.__TWEAKS.typePairing || 'cormorant-inter');

  document.querySelectorAll('#typeOpts .tweak-opt').forEach((b) => {
    b.addEventListener('click', () => {
      const key = b.dataset.key;
      applyTypePairing(key);
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { typePairing: key } }, '*');
    });
  });

  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    const panel = document.getElementById('tweaksPanel');
    if (!panel) return;
    if (e.data.type === '__activate_edit_mode') panel.classList.add('active');
    else if (e.data.type === '__deactivate_edit_mode') panel.classList.remove('active');
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
})();
