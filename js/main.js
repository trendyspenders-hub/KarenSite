/* ==========================================================================
   Alcantara Safety Solutions — main.js
   1. Mobile menu toggle      4. FAQ accordion        7. Back-to-top button
   2. Sticky header shadow    5. Quote calculator     8. Active nav highlight
   3. Smooth anchor scroll    6. Form validation      9. Scroll fade-in
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

  /* ---------- 5. Quote calculator (get-quote.html) ---------- */
  var estimateValue = document.getElementById('estimate-value');
  if (estimateValue) {
    var employeeBase = {
      '1-10': 1500,
      '11-50': 2800,
      '51-200': 4500,
      '201-500': 7000,
      '500+': 9500
    };
    var serviceMultiplier = {
      'safety-plan': 1.0,
      'compliance-review': 0.75,
      'risk-assessment': 0.6,
      'training': 0.5,
      'not-sure': 0.85
    };
    var urgencyMultiplier = {
      'asap': 1.2,
      '1-3-months': 1.0,
      '3-6-months': 0.95,
      'flexible': 0.9
    };

    function updateEstimate() {
      var employeesEl = document.getElementById('quote-employees');
      var serviceEl = document.getElementById('quote-service');
      var timelineEl = document.getElementById('quote-timeline');
      if (!employeesEl || !serviceEl) return;

      var base = employeeBase[employeesEl.value];
      var mult = serviceMultiplier[serviceEl.value];
      var urgency = urgencyMultiplier[timelineEl ? timelineEl.value : 'flexible'] || 1;

      if (!base || !mult) {
        estimateValue.textContent = 'Select options above';
        return;
      }
      var mid = base * mult * urgency;
      var low = Math.round((mid * 0.75) / 100) * 100;
      var high = Math.round((mid * 1.35) / 100) * 100;
      estimateValue.textContent =
        low.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) +
        ' – ' +
        high.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    }

    ['quote-employees', 'quote-service', 'quote-timeline'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', updateEstimate);
    });
    document.querySelectorAll('input[name="compliance-status"]').forEach(function (radio) {
      radio.addEventListener('change', updateEstimate);
    });
    updateEstimate();
  }

  /* ---------- 6. Form validation (required fields + email format) ---------- */
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

  /* ---------- 7. Back-to-top button (appears after 500px) ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 8. Active nav highlighting ---------- */
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

  /* ---------- 9. Fade-in animation on scroll (IntersectionObserver) ---------- */
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

  /* ---------- 10. Animated stat counters ---------- */
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
})();
