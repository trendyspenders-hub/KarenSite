/* ==========================================================================
   Alcantara Safety Solutions — main.js
   1. Mobile menu toggle      4. FAQ accordion        7. Active nav highlight
   2. Sticky header shadow    5. Form validation      8. Scroll fade-in
   3. Smooth anchor scroll    6. Back-to-top button   9. Cookie consent banner
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. Mobile menu toggle (hamburger transforms to X) ---------- */
  var hamburger = document.getElementById('hamburger');
  var mainNav = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Escape closes the mobile menu and any open dropdowns
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (mainNav && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      hamburger.focus();
    }
    document.querySelectorAll('.nav-item-dropdown.open').forEach(function (item) {
      item.classList.remove('open');
      var t = item.querySelector('.dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* Dropdown toggles (click on mobile / keyboard everywhere) */
  document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      // On desktop the CSS :hover handles it; only intercept below 1024px
      // or when the mobile panel is open.
      if (window.innerWidth >= 1024 && !mainNav.classList.contains('open')) {
        return;
      }
      e.preventDefault();
      var item = toggle.closest('.nav-item-dropdown');
      var isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- 2. Sticky header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  /* ---------- 3. Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ---------- 4. FAQ accordion (expand one, collapse others) ---------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      // Collapse all items in the same accordion group
      var group = item.closest('.faq-list') || document;
      group.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Expand clicked item if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 5. Form validation (required fields + email format) ---------- */
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    var group = field.closest('.form-group');
    if (!group) return true;
    var errorEl = group.querySelector('.field-error');
    var value = field.value.trim();
    var valid = true;
    var message = '';

    if (field.hasAttribute('required') && value === '') {
      valid = false;
      message = 'This field is required.';
    } else if (field.type === 'email' && value !== '' && !emailPattern.test(value)) {
      valid = false;
      message = 'Please enter a valid email address.';
    }

    group.classList.toggle('has-error', !valid);
    field.classList.toggle('input-error', !valid);
    field.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (errorEl && message) errorEl.textContent = message;
    return valid;
  }

  document.querySelectorAll('form.validate').forEach(function (form) {
    // Download forms: capture email, save locally, and send to team inbox
    if (form.getAttribute('data-download') === 'true') {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var allValid = true;
        var firstInvalid = null;
        var fields = form.querySelectorAll('input[required], select[required], textarea[required], input[type="email"]');
        fields.forEach(function (field) {
          if (!validateField(field)) {
            allValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        });
        if (!allValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        var name = (form.querySelector('[name="name"]') || {}).value || '';
        var email = (form.querySelector('[name="email"]') || {}).value || '';
        var now = new Date().toISOString();
        var page = window.location.href;

        // Save to browser localStorage (retrievable via console or export tool)
        try {
          var leads = JSON.parse(localStorage.getItem('asafety_leads') || '[]');
          leads.push({ name: name, email: email, date: now, page: page, source: 'free-download' });
          localStorage.setItem('asafety_leads', JSON.stringify(leads));
        } catch (err) {}

        // Send to team inbox so every signup is retrievable by email
        var to = 'karen@asafetysolutions.com';
        var subject = encodeURIComponent('[Download Signup] ' + name);
        var body = encodeURIComponent(
          'New free-download signup from asafetysolutions.com\n\n' +
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Date: ' + now + '\n' +
          'Page: ' + page + '\n\n' +
          'Reply directly to this email to follow up with the lead.'
        );
        window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

        // Show success + reveal download
        var success = form.querySelector('.form-success');
        if (success) success.classList.add('show');
        var delivery = document.getElementById('download-delivery');
        if (delivery) delivery.style.display = 'block';
        form.reset();
        if (delivery) delivery.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    // Mailto forms: build email from fields and open client
    if (form.getAttribute('data-mailto') === 'true') {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var allValid = true;
        var firstInvalid = null;
        var fields = form.querySelectorAll('input[required], select[required], textarea[required], input[type="email"]');
        fields.forEach(function (field) {
          if (!validateField(field)) {
            allValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        });
        if (!allValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        var to = form.getAttribute('data-mailto-address') || 'karen@asafetysolutions.com';
        var subject = encodeURIComponent(form.querySelector('[name="subject"]').value || 'Safety Plan Inquiry');
        var bodyParts = [];
        form.querySelectorAll('[name]').forEach(function (f) {
          if (f.name === 'subject') return;
          if (!f.value.trim()) return;
          var label = f.closest('.form-group') ? form.querySelector('label[for="' + f.id + '"]') : null;
          var labelText = label ? label.textContent.replace('*','').trim() : f.name;
          bodyParts.push(labelText + ': ' + f.value.trim());
        });
        var body = encodeURIComponent(bodyParts.join('\n'));
        window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      });
      return;
    }

    var fields = form.querySelectorAll('input[required], select[required], textarea[required], input[type="email"]');

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('input-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      var allValid = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!allValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Local (non-Formspree) forms: show inline success instead of navigating
      if (form.getAttribute('data-local') === 'true') {
        e.preventDefault();
        var success = form.querySelector('.form-success');
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
      }
    });
  });

  /* ---------- 6. Back-to-top button (appears after 500px) ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 7. Active nav highlighting ---------- */
  var path = window.location.pathname;
  var currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var linkPage = href.substring(href.lastIndexOf('/') + 1);
    if (linkPage === currentPage && linkPage !== '') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      var parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown) {
        parentDropdown.querySelector('.dropdown-toggle').classList.add('active');
      }
    }
  });
  // Hub pages highlight their top-level dropdown
  if (path.indexOf('/services/') !== -1 || currentPage === 'services.html') {
    document.querySelectorAll('.dropdown-toggle').forEach(function (t) {
      if (t.textContent.trim().indexOf('Services') === 0) t.classList.add('active');
    });
  }
  if (path.indexOf('/industries/') !== -1 || currentPage === 'industries.html') {
    document.querySelectorAll('.dropdown-toggle').forEach(function (t) {
      if (t.textContent.trim().indexOf('Industries') === 0) t.classList.add('active');
    });
  }

  /* ---------- 8. Fade-in animation on scroll (IntersectionObserver) ---------- */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 9. Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var runCounter = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var start = null, duration = 1600;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cObserver.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 10. Cookie / analytics consent banner ---------- */
  (function () {
    var KEY = 'asconsent';
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { return; }
    if (stored) return; // choice already made

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use optional analytics cookies to understand how visitors use this site. ' +
      'No advertising, no data sales. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn cookie-decline" id="cookie-decline">Decline</button>' +
      '<button type="button" class="cookie-btn cookie-accept" id="cookie-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    // Fix policy link for pages in subdirectories
    var depth = window.location.pathname.split('/').filter(Boolean).length - 1;
    if (depth > 0) {
      var link = banner.querySelector('a');
      link.setAttribute('href', Array(depth + 1).join('../') + 'privacy-policy.html');
    }

    requestAnimationFrame(function () {
      setTimeout(function () { banner.classList.add('show'); }, 1200);
    });

    function choose(value) {
      try { localStorage.setItem(KEY, value); } catch (e) {}
      banner.classList.remove('show');
      setTimeout(function () { banner.remove(); }, 600);
      if (value === 'accepted' && typeof window.initAnalytics === 'function') {
        window.initAnalytics(); // hook: define initAnalytics() to load your analytics after consent
      }
    }
    banner.querySelector('#cookie-accept').addEventListener('click', function () { choose('accepted'); });
    banner.querySelector('#cookie-decline').addEventListener('click', function () { choose('declined'); });
  })();


  /* ---------- 10. "Not sure what you need?" chooser (fully client-side) ---------- */
  var guideBox = document.getElementById('guide-box');
  if (guideBox) {
    var steps = guideBox.querySelectorAll('.guide-step');
    var results = guideBox.querySelectorAll('.guide-result');
    var resultFor = { '4': 'plan', '5': 'urgent', '7': 'ongoing', '8': 'assessment', '9': 'urgent', '10': 'review' };

    function guideShowStep(n) {
      steps.forEach(function (st) { st.hidden = st.getAttribute('data-step') !== String(n); });
      results.forEach(function (r) { r.style.display = 'none'; });
    }
    function guideShowResult(key) {
      steps.forEach(function (st) { st.hidden = true; });
      results.forEach(function (r) {
        r.style.display = r.getAttribute('data-result') === key ? 'block' : 'none';
      });
    }
    guideBox.addEventListener('click', function (e) {
      var btn = e.target.closest('.guide-opt');
      if (!btn) return;
      var go = btn.getAttribute('data-go');
      if (resultFor[go]) { guideShowResult(resultFor[go]); }
      else { guideShowStep(go); }
    });
    // add a restart link to each result
    results.forEach(function (r) {
      var rb = document.createElement('button');
      rb.type = 'button';
      rb.className = 'guide-restart';
      rb.textContent = 'Start over';
      rb.addEventListener('click', function () { guideShowStep(0); });
      r.appendChild(rb);
    });
  }

})();
