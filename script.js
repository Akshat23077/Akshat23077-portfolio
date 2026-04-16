/* ==============================================
   AKSHAT TIWARI — PORTFOLIO JAVASCRIPT
   Features:
   - Smooth scroll navigation
   - Active nav link on scroll
   - Navbar scroll effect
   - Hamburger menu toggle
   - Typing animation (hero)
   - Scroll-based fade-in animations
   - Skill bar animation trigger
   - Contact form validation
   - Footer year
   ============================================== */

// ─── 1. DOM READY ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTyping();
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
  setFooterYear();
});


// ─── 2. NAVBAR: scroll effect + active link ──────
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    // Solid background after scrolling
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on current section
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}


// ─── 3. HAMBURGER MENU ───────────────────────────
function initHamburger() {
  const btn      = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}


// ─── 4. SMOOTH SCROLL ────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')
          .trim(),
        10
      ) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ─── 5. TYPING ANIMATION (Hero) ──────────────────
function initTyping() {
  const el      = document.getElementById('typed-text');
  if (!el) return;

  const strings = [
    'Cybersecurity Enthusiast',
    'Frontend Developer',
    'Ethical Hacker',
    'CTF Player',
    'Open Source Contributor',
  ];

  let strIdx  = 0;
  let charIdx = 0;
  let deleting = false;
  let pause    = false;

  function tick() {
    const current = strings[strIdx];

    if (!deleting) {
      // Typing
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        // Pause before deleting
        pause = true;
        setTimeout(() => { pause = false; deleting = true; loop(); }, 1800);
        return;
      }
    } else {
      // Deleting
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        strIdx   = (strIdx + 1) % strings.length;
        setTimeout(loop, 400);
        return;
      }
    }

    loop();
  }

  function loop() {
    if (pause) return;
    const speed = deleting ? 45 : 85;
    setTimeout(tick, speed);
  }

  loop();
}


// ─── 6. SCROLL-BASED FADE-IN ANIMATIONS ──────────
function initScrollAnimations() {
  const fadeEls       = document.querySelectorAll('.fade-in-section');
  const skillsSection = document.querySelector('.skills-section');

  // IntersectionObserver for fade-in
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // Separate observer for skill bars (add .animated to trigger CSS animation)
  if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillsSection.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillObserver.observe(skillsSection);
  }
}


// ─── 7. CONTACT FORM VALIDATION ──────────────────
function initContactForm() {
  const form    = document.getElementById('contact-form');
  if (!form) return;

  const nameIn  = document.getElementById('name');
  const emailIn = document.getElementById('email');
  const msgIn   = document.getElementById('message');
  const formMsg = document.getElementById('form-msg');

  // Clear error on input
  [nameIn, emailIn, msgIn].forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Validate name
    if (!nameIn.value.trim()) {
      showError(nameIn, 'name-error', 'Name is required.');
      valid = false;
    }

    // Validate email
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailIn.value.trim()) {
      showError(emailIn, 'email-error', 'Email is required.');
      valid = false;
    } else if (!emailRx.test(emailIn.value.trim())) {
      showError(emailIn, 'email-error', 'Please enter a valid email address.');
      valid = false;
    }

    // Validate message
    if (!msgIn.value.trim()) {
      showError(msgIn, 'message-error', 'Message cannot be empty.');
      valid = false;
    } else if (msgIn.value.trim().length < 10) {
      showError(msgIn, 'message-error', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    // Simulate successful submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      formMsg.textContent = '✅ Message sent! I\'ll get back to you soon.';
      formMsg.className   = 'form-msg success';
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled    = false;

      // Auto-clear success message after 5s
      setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-msg'; }, 5000);
    }, 1200);
  });

  function showError(input, errorId, msg) {
    input.classList.add('error');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.textContent = '';
  }
}


// ─── 8. FOOTER YEAR ──────────────────────────────
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
