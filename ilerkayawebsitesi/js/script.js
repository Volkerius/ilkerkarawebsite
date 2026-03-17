(function () {
  const navbar = document.querySelector('[data-navbar]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

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

  const socialTextLinks = document.querySelectorAll('.inline-link');
  socialTextLinks.forEach((link) => {
    if (!link.classList.contains('relative')) link.classList.add('relative');
  });

  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap) return;

  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('[data-hero="eyebrow"]', { y: 22, opacity: 0, duration: 0.55 })
    .from('[data-hero="title"]', { y: 38, opacity: 0, duration: 0.72 }, '-=0.28')
    .from('[data-hero="subtitle"]', { y: 24, opacity: 0, duration: 0.6 }, '-=0.34')
    .from('[data-hero="cta"]', { y: 18, opacity: 0, duration: 0.52 }, '-=0.28')
    .from('[data-hero="visual"]', { scale: 0.94, opacity: 0, duration: 0.86 }, '-=0.5')
    .from('[data-hero="scroll"]', { opacity: 0, y: 10, duration: 0.45 }, '-=0.24');

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
    const type = item.dataset.reveal;
    const animation = { opacity: 0, duration: 0.88, ease: 'power3.out' };
    if (type === 'left') animation.x = -58;
    if (type === 'right') animation.x = 58;
    if (type === 'up') animation.y = 48;
    if (type === 'scale') animation.scale = 0.95;

    gsap.from(item, {
      ...animation,
      scrollTrigger: {
        trigger: item,
        start: 'top 86%',
        once: true,
      },
    });
  });

  gsap.utils.toArray('[data-stagger-group]').forEach((group) => {
    const children = group.querySelectorAll('[data-stagger-item]');
    if (!children.length) return;

    gsap.from(children, {
      opacity: 0,
      y: 24,
      stagger: 0.12,
      duration: 0.58,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 84%',
        once: true,
      },
    });
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
