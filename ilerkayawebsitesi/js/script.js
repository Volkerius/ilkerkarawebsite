(function () {
  const navbar = document.querySelector('[data-navbar]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const showAnimationTargets = () => {
    document.querySelectorAll('[data-reveal], [data-stagger-item], [data-hero="eyebrow"], [data-hero="title"], [data-hero="subtitle"], [data-hero="cta"], [data-hero="visual"], [data-hero="scroll"]').forEach((el) => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
  };

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('hidden');
    });
  }

  const smoothLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  smoothLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap) {
    showAnimationTargets();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .fromTo('[data-hero="eyebrow"]', { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 })
    .fromTo('[data-hero="title"]', { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72 }, '-=0.28')
    .fromTo('[data-hero="subtitle"]', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.34')
    .fromTo('[data-hero="cta"]', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52 }, '-=0.28')
    .fromTo('[data-hero="visual"]', { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.86 }, '-=0.5')
    .fromTo('[data-hero="scroll"]', { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 }, '-=0.24');

  gsap.to('.scroll-dot', {
    y: 16,
    duration: 1.1,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });

  gsap.to('.hero-float', {
    y: -16,
    duration: 4.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  const revealItems = gsap.utils.toArray('[data-reveal]');
  revealItems.forEach((item) => {
    if (item.hasAttribute('data-stagger-item')) return;

    const type = item.dataset.reveal;
    const fromVars = { autoAlpha: 0 };
    if (type === 'left') fromVars.x = -58;
    if (type === 'right') fromVars.x = 58;
    if (type === 'up') fromVars.y = 48;
    if (type === 'scale') fromVars.scale = 0.95;

    gsap.fromTo(
      item,
      fromVars,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.88,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 86%',
          once: true,
        },
      }
    );
  });

  gsap.utils.toArray('[data-stagger-group]').forEach((group) => {
    const children = group.querySelectorAll('[data-stagger-item]');
    if (!children.length) return;

    gsap.fromTo(
      children,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.58,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 84%',
          once: true,
        },
      }
    );
  });

  const interactiveTargets = document.querySelectorAll('.btn-premium, .card-premium, .social-icon');
  interactiveTargets.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, { scale: 1.015, duration: 0.24, ease: 'power2.out' });
    });
    element.addEventListener('mouseleave', () => {
      gsap.to(element, { scale: 1, duration: 0.26, ease: 'power2.out' });
    });
  });

  const modal = document.querySelector('[data-book-modal]');
  if (modal) {
    const modalTitle = modal.querySelector('[data-modal-title]');
    const modalText = modal.querySelector('[data-modal-text]');
    const modalClose = modal.querySelector('[data-modal-close]');

    document.querySelectorAll('[data-book-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-book-title') || 'Eser';
        const desc = btn.getAttribute('data-book-description') || '';
        if (modalTitle) modalTitle.textContent = title;
        if (modalText) modalText.textContent = desc;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        gsap.fromTo('.modal-panel', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
      });
    });

    const closeModal = () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  const contactForm = document.querySelector('form');
  if (contactForm && contactForm.querySelector('#message')) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.textContent = 'Mesajınız Alındı';
        submitButton.disabled = true;
      }
      contactForm.reset();

      window.setTimeout(() => {
        if (!submitButton) return;
        submitButton.textContent = originalText || 'Mesajı Gönder';
        submitButton.disabled = false;
      }, 2000);
    });
  }
})();
