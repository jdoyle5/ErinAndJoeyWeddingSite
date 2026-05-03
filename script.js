/**
 * Site password gate (client-side only — not secret from someone inspecting the page).
 * Persistence: after a correct password, access is stored in localStorage and the page reloads
 * so the hero video and fade-ins run from the start; later visits skip the gate without reload.
 * Change the password below before publishing.
 */
const SITE_ACCESS_STORAGE_KEY = 'erinjoey_wedding_site_access_v1';
const SITE_ACCESS_PASSWORD = 'E&JAllTheWay';

(function initSiteGate() {
  const gate = document.getElementById('site-gate');
  const form = document.getElementById('site-gate-form');
  const input = document.getElementById('site-gate-password');
  const errEl = document.getElementById('site-gate-error');
  const body = document.body;

  function grantAccess() {
    try {
      localStorage.setItem(SITE_ACCESS_STORAGE_KEY, '1');
    } catch (e) {
      /* private mode / blocked storage — session still works until tab close */
    }
    document.documentElement.classList.add('site-access-granted');
    body.classList.remove('is-site-gated');
    gate?.classList.add('site-gate--dismissed');
    gate?.setAttribute('aria-hidden', 'true');
  }

  function deny(message) {
    if (errEl) {
      errEl.textContent = message;
      errEl.hidden = false;
    }
    input?.select();
  }

  let alreadyUnlocked = false;
  try {
    alreadyUnlocked = localStorage.getItem(SITE_ACCESS_STORAGE_KEY) === '1';
  } catch (e) {
    /* ignore */
  }
  if (alreadyUnlocked) {
    grantAccess();
    return;
  }

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value === SITE_ACCESS_PASSWORD) {
      try {
        localStorage.setItem(SITE_ACCESS_STORAGE_KEY, '1');
      } catch (err) {
        /* if storage fails, still reload; gate may reappear */
      }
      window.location.reload();
      return;
    } else {
      deny('That password doesn’t match. Please try again.');
    }
  });

  input.focus();
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

// Our Story + Book Your Stay: each block reveals left → right when scrolled into view
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches) {
  const storySection = document.getElementById('story');
  const staySection = document.getElementById('stay');

  const scrollRevealTargets = [
    ...(storySection
      ? [
          storySection.querySelector('.section-title'),
          ...storySection.querySelectorAll('.story-body p'),
        ]
      : []),
    ...(staySection
      ? [
          staySection.querySelector('.section-title'),
          staySection.querySelector('.stay-intro'),
          staySection.querySelector('.stay-cta-wrap'),
        ]
      : []),
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
