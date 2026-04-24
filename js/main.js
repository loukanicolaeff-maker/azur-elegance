/* =============================================================================
   AZUR ÉLÉGANCE — main.js
   Animations, interactions et micro-effets
   ============================================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------------
     1. INTRO REVEAL — voile ivoire au premier chargement (une seule fois par session)
     --------------------------------------------------------------------------- */
  function initIntroReveal() {
    const intro = document.querySelector('.intro-reveal');
    if (!intro) return;

    const seen = sessionStorage.getItem('azur-intro-seen');
    if (seen || prefersReducedMotion) {
      intro.remove();
      return;
    }

    sessionStorage.setItem('azur-intro-seen', '1');
    document.body.classList.add('is-locked');

    // Lance l'animation de retrait
    requestAnimationFrame(() => {
      setTimeout(() => {
        intro.classList.add('is-hidden');
      }, 900);
    });

    // Retire du DOM après la transition
    setTimeout(() => {
      document.body.classList.remove('is-locked');
      intro.remove();
    }, 2400);
  }

  /* ---------------------------------------------------------------------------
     2. HEADER — transparent → opaque au scroll
     --------------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const update = () => {
      if (window.scrollY > 80) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------------------------------------------------------------------------
     3. DROPDOWN NAV (desktop)
     --------------------------------------------------------------------------- */
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.nav-dropdown__trigger');
      if (!trigger) return;

      // Hover
      dropdown.addEventListener('mouseenter', () => dropdown.classList.add('is-open'));
      dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('is-open'));

      // Click (tablettes, navigation clavier)
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', dropdown.classList.contains('is-open'));
      });

      // Ferme quand on clique ailleurs
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------------------------------------------------------------------------
     4. MENU MOBILE
     --------------------------------------------------------------------------- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('is-locked', isOpen);
    });

    // Ferme au clic sur un lien
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      });
    });
  }

  /* ---------------------------------------------------------------------------
     5. REVEAL AU SCROLL (IntersectionObserver)
     --------------------------------------------------------------------------- */
  function initScrollReveals() {
    const elements = document.querySelectorAll('.reveal, .split-text');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------------
     6. SPLIT TEXT — découpe automatiquement les h1, h2 à classe .split-text
     --------------------------------------------------------------------------- */
  function initSplitText() {
    const targets = document.querySelectorAll('.split-text');
    targets.forEach((el) => {
      // Évite un re-split si déjà traité
      if (el.dataset.split === 'done') return;
      const text = el.textContent.trim();
      const words = text.split(/\s+/);
      el.innerHTML = '';
      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'split-text__word';
        const inner = document.createElement('span');
        inner.className = 'split-text__word-inner';
        inner.textContent = word;
        inner.style.transitionDelay = `${i * 0.08}s`;
        wrapper.appendChild(inner);
        el.appendChild(wrapper);
      });
      el.dataset.split = 'done';
    });
  }

  /* ---------------------------------------------------------------------------
     7. PARALLAX — éléments avec [data-parallax]
     --------------------------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;
    const targets = document.querySelectorAll('[data-parallax]');
    if (!targets.length) return;

    // Désactive sur mobile pour la performance
    if (window.innerWidth < 768) return;

    const update = () => {
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Position relative : -1 (sous le fold) à +1 (au-dessus)
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const translate = progress * speed * 60;
        el.style.transform = `translateY(${translate}px)`;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------------
     8. LIGHTBOX — galeries avec navigation clavier
     --------------------------------------------------------------------------- */
  function initLightbox() {
    const galleries = document.querySelectorAll('[data-gallery]');
    const lightbox = document.getElementById('lightbox');
    if (!galleries.length || !lightbox) return;

    const imgEl = lightbox.querySelector('.lightbox__image');
    const counterEl = lightbox.querySelector('.lightbox__counter');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    const backdrop = lightbox.querySelector('.lightbox__backdrop');

    let currentImages = [];
    let currentIndex = 0;

    const update = () => {
      const img = currentImages[currentIndex];
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentImages.length).padStart(2, '0')}`;
    };

    const open = (images, index) => {
      currentImages = images;
      currentIndex = index;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      update();
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    };

    const next = () => {
      currentIndex = (currentIndex + 1) % currentImages.length;
      update();
    };

    const prev = () => {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      update();
    };

    // Branche chaque galerie
    galleries.forEach((gallery) => {
      const items = gallery.querySelectorAll('.gallery__item');
      const images = Array.from(items).map((item) => {
        const img = item.querySelector('img');
        return { src: img.src, alt: img.alt };
      });

      items.forEach((item, i) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          open(images, i);
        });
      });
    });

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);
    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ---------------------------------------------------------------------------
     9. FAQ ACCORDIONS
     --------------------------------------------------------------------------- */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item) => {
      const trigger = item.querySelector('.faq-item__trigger');
      const panel = item.querySelector('.faq-item__panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = '0';
        }
      });
    });
  }

  /* ---------------------------------------------------------------------------
     10. FORMULAIRE DE CONTACT — validation basique + coche animée
     --------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const showError = (field, message) => {
      const errorEl = field.parentElement.querySelector('.field__error');
      if (errorEl) errorEl.textContent = message;
    };

    const clearError = (field) => {
      const errorEl = field.parentElement.querySelector('.field__error');
      if (errorEl) errorEl.textContent = '';
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');

      // Reset erreurs
      [name, email, message].forEach(clearError);

      if (!name.value.trim() || name.value.trim().length < 2) {
        showError(name, 'Merci d\'indiquer votre nom');
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Adresse e-mail invalide');
        valid = false;
      }

      if (message.value.trim().length < 10) {
        showError(message, 'Votre message doit contenir au moins 10 caractères');
        valid = false;
      }

      if (!valid) return;

      // Simulation d'envoi — à remplacer par un appel API réel (Formspree, Netlify, etc.)
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('span').textContent;
      submitBtn.querySelector('span').textContent = 'Envoi en cours…';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Affiche l'écran de succès
        const wrapper = form.closest('.contact-form-wrapper') || form.parentElement;
        form.style.display = 'none';
        const success = document.getElementById('contact-success');
        if (success) {
          success.style.display = 'block';
        }
      }, 1200);
    });

    // Reset sur clic "envoyer un autre message"
    const resetBtn = document.querySelector('[data-reset-form]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const success = document.getElementById('contact-success');
        if (success) success.style.display = 'none';
        form.reset();
        form.style.display = '';
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Envoyer';
        }
      });
    }
  }

  /* ---------------------------------------------------------------------------
     11. SECTION NAV — scroll spy (page Brugaye)
     --------------------------------------------------------------------------- */
  function initSectionNav() {
    const nav = document.querySelector('.section-nav');
    if (!nav) return;

    const links = nav.querySelectorAll('.section-nav__link');
    const sections = Array.from(links)
      .map((link) => {
        const id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              const active = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('is-active', active);
              if (active) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------------------------
     12. INIT
     --------------------------------------------------------------------------- */
  function init() {
    initIntroReveal();
    initHeaderScroll();
    initDropdowns();
    initMobileMenu();
    initSplitText();
    initScrollReveals();
    initParallax();
    initLightbox();
    initFAQ();
    initContactForm();
    initSectionNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
