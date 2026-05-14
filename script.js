/**
 * Site password gate (client-side only — not secret from someone inspecting the page).
 * After the correct wedding date, access is stored in localStorage and a cookie so return
 * visits skip the gate; the page reloads on first unlock so the hero runs from the start.
 */
const SITE_ACCESS_STORAGE_KEY = 'erinjoey_wedding_site_access_v1';
const SITE_ACCESS_COOKIE = `${SITE_ACCESS_STORAGE_KEY}=1`;
const SITE_ACCESS_PASSWORD = '01/09/2027';

function siteGateHasCookieAccess() {
  return document.cookie.split(';').some((c) => c.trim() === SITE_ACCESS_COOKIE);
}

function siteGateSetAccessCookie() {
  const maxAge = 60 * 60 * 24 * 400; /* ~13 months */
  document.cookie = `${SITE_ACCESS_COOKIE}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function siteGateDigitsToDateString(digitInputs) {
  const d = digitInputs.map((el) => el.value.replace(/\D/g, '')).join('');
  if (d.length !== 8) return '';
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

(function initSiteGate() {
  const gate = document.getElementById('site-gate');
  const form = document.getElementById('site-gate-form');
  const digitInputs = form ? Array.from(form.querySelectorAll('.site-gate-digit')) : [];
  const errEl = document.getElementById('site-gate-error');
  const body = document.body;

  function grantAccess() {
    try {
      localStorage.setItem(SITE_ACCESS_STORAGE_KEY, '1');
    } catch (e) {
      /* private mode / blocked storage — cookie may still work */
    }
    siteGateSetAccessCookie();
    document.documentElement.classList.add('site-access-granted');
    body.classList.remove('is-site-gated');
    gate?.classList.add('site-gate--dismissed');
    gate?.setAttribute('aria-hidden', 'true');
  }

  function clearDigits() {
    digitInputs.forEach((el) => {
      el.value = '';
    });
  }

  function deny(message) {
    if (errEl) {
      errEl.textContent = message;
      errEl.hidden = false;
    }
    clearDigits();
    digitInputs[0]?.focus();
  }

  let alreadyUnlocked = false;
  try {
    alreadyUnlocked = localStorage.getItem(SITE_ACCESS_STORAGE_KEY) === '1';
  } catch (e) {
    /* ignore */
  }
  if (!alreadyUnlocked && siteGateHasCookieAccess()) {
    alreadyUnlocked = true;
  }
  if (alreadyUnlocked) {
    grantAccess();
    return;
  }

  if (!form || digitInputs.length !== 8) return;

  digitInputs.forEach((inp, i) => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value) {
        e.preventDefault();
        if (i > 0) {
          digitInputs[i - 1].focus();
          digitInputs[i - 1].value = '';
        }
      }
      if (e.key === 'ArrowLeft' && i > 0) {
        e.preventDefault();
        digitInputs[i - 1].focus();
      }
      if (e.key === 'ArrowRight' && i < 7) {
        e.preventDefault();
        digitInputs[i + 1].focus();
      }
    });

    inp.addEventListener('input', () => {
      const digit = inp.value.replace(/\D/g, '').slice(-1);
      inp.value = digit;
      if (digit && i < 7) digitInputs[i + 1].focus();
    });

    inp.addEventListener('paste', (e) => {
      e.preventDefault();
      const raw = (e.clipboardData && e.clipboardData.getData('text')) || '';
      const paste = raw.replace(/\D/g, '').slice(0, 8);
      if (!paste) return;
      for (let j = 0; j < paste.length && i + j < 8; j += 1) {
        digitInputs[i + j].value = paste[j];
      }
      const next = Math.min(7, i + paste.length);
      digitInputs[next].focus();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = siteGateDigitsToDateString(digitInputs);
    if (value === SITE_ACCESS_PASSWORD) {
      try {
        localStorage.setItem(SITE_ACCESS_STORAGE_KEY, '1');
      } catch (err) {
        /* if storage fails, cookie still set below after reload path — actually we reload */
      }
      siteGateSetAccessCookie();
      window.location.reload();
      return;
    }
    deny('That date doesn’t match. Please use month, day, and year (eight digits).');
  });

  digitInputs[0]?.focus();
})();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// RSVP envelope (toggle open / close)
const envelope = document.getElementById('envelope');
const rsvpForm = document.getElementById('rsvp-form');

if (envelope) {
  envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
    const open = envelope.classList.contains('open');
    envelope.setAttribute('aria-expanded', open);
  });

  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      envelope.click();
    }
  });
}

if (envelope && rsvpForm) {
  rsvpForm.addEventListener('click', (e) => e.stopPropagation());
  document.getElementById('rsvpCard')?.addEventListener('click', (e) => e.stopPropagation());
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(
      'RSVP submitted (placeholder). Hook this up to Google Forms, your wedding platform, or a backend. See HOSTING.md for ideas.'
    );
  });
}

// Countdown to wedding day
(function initWeddingCountdown() {
  const countdownEl = document.getElementById('wedding-countdown');
  if (!countdownEl) return;

  const dayEl = countdownEl.querySelector('[data-countdown-days]');
  const hourEl = countdownEl.querySelector('[data-countdown-hours]');
  const minuteEl = countdownEl.querySelector('[data-countdown-minutes]');
  const secondEl = countdownEl.querySelector('[data-countdown-seconds]');
  if (!dayEl || !hourEl || !minuteEl || !secondEl) return;

  const weddingDate = new Date('2027-01-09T16:30:00-07:00');
  const secondMs = 1000;
  const minuteMs = 60 * secondMs;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function render() {
    const diffMs = weddingDate.getTime() - Date.now();
    const clampedMs = Math.max(diffMs, 0);

    const days = Math.floor(clampedMs / dayMs);
    const hours = Math.floor((clampedMs % dayMs) / hourMs);
    const minutes = Math.floor((clampedMs % hourMs) / minuteMs);
    const seconds = Math.floor((clampedMs % minuteMs) / secondMs);

    dayEl.textContent = String(days);
    hourEl.textContent = pad(hours);
    minuteEl.textContent = pad(minutes);
    secondEl.textContent = pad(seconds);

    if (diffMs <= 0) {
      countdownEl.setAttribute('aria-label', 'It is wedding day.');
    }
  }

  render();
  window.setInterval(render, secondMs);
})();

// Section blocks reveal left → right when scrolled into view
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches) {
  const welcomeSection = document.getElementById('welcome');
  const storySection = document.getElementById('story');
  const travelSection = document.getElementById('travel');
  const dressSection = document.getElementById('dress-code');
  const faqSection = document.getElementById('faq');

  const scrollRevealTargets = [
    ...(welcomeSection
      ? [
          welcomeSection.querySelector('.intro-heading'),
          welcomeSection.querySelector('.intro-body'),
          welcomeSection.querySelector('.intro-signoff'),
        ]
      : []),
    ...(storySection
      ? [
          storySection.querySelector('.story-section-title'),
          ...storySection.querySelectorAll('.story-body p'),
        ]
      : []),
    ...(travelSection ? [...travelSection.querySelectorAll('.travel-reveal')] : []),
    ...(dressSection ? [...dressSection.querySelectorAll('.dress-reveal')] : []),
    ...(faqSection ? [...faqSection.querySelectorAll('.faq-reveal')] : []),
  ].filter(Boolean);

  if (scrollRevealTargets.length > 0) {
    const scrollRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('story-in-view');
            scrollRevealObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );

    scrollRevealTargets.forEach((el) => {
      el.classList.add('story-anim-ready');
      scrollRevealObserver.observe(el);
    });
  }
}

// Hero: start title/logo fades only after background video has a frame (avoids text before video)
(function initHeroAwaitVideo() {
  const hero = document.querySelector('.hero');
  const video = document.querySelector('.hero-bg-media');
  if (!hero) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.classList.add('hero--media-ready');
    return;
  }

  if (!(video instanceof HTMLVideoElement)) {
    hero.classList.add('hero--media-ready');
    return;
  }

  const reveal = () => hero.classList.add('hero--media-ready');
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    reveal();
    return;
  }

  const fallbackMs = 4500;
  const timer = window.setTimeout(reveal, fallbackMs);
  let settled = false;

  function settle() {
    if (settled) return;
    settled = true;
    window.clearTimeout(timer);
    video.removeEventListener('loadeddata', settle);
    video.removeEventListener('canplay', settle);
    video.removeEventListener('error', onVideoError);
    reveal();
  }

  function onVideoError() {
    settle();
  }

  video.addEventListener('loadeddata', settle);
  video.addEventListener('canplay', settle);
  video.addEventListener('error', onVideoError, { once: true });
})();

(function initStoryPhotoSlideshow() {
  const root = document.querySelector('.story-slideshow');
  if (!root) return;
  const slides = [...root.querySelectorAll('.story-photo-slide')];
  if (slides.length < 2) return;

  function setActive(index) {
    slides.forEach((el, i) => {
      const on = i === index;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setActive(0);
    return;
  }

  let index = 0;
  const intervalMs = 7000;
  let timerId = 0;

  function tick() {
    index = (index + 1) % slides.length;
    setActive(index);
  }

  function start() {
    if (timerId) return;
    timerId = window.setInterval(tick, intervalMs);
  }

  function stop() {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = 0;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stop();
    else start();
  });

  start();
})();

(function initStoryScrollAffordance() {
  const scrollEl = document.querySelector('.section-story .story-text-scroll');
  const affordance = document.querySelector('.story-scroll-affordance');
  if (!scrollEl || !affordance) return;

  const endSlackPx = 12;

  function updateStoryScrollUI() {
    const sh = scrollEl.scrollHeight;
    const ch = scrollEl.clientHeight;
    const canScroll = sh > ch + 2;
    const atEnd = !canScroll || scrollEl.scrollTop + ch >= sh - endSlackPx;

    affordance.classList.toggle('story-scroll-affordance--no-overflow', !canScroll);
    affordance.classList.toggle('story-scroll-affordance--at-end', canScroll && atEnd);
    scrollEl.classList.toggle('story-text-scroll--at-end', atEnd);
  }

  scrollEl.addEventListener('scroll', updateStoryScrollUI, { passive: true });
  window.addEventListener('resize', updateStoryScrollUI);
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(updateStoryScrollUI);
    ro.observe(scrollEl);
  }
  updateStoryScrollUI();
})();
