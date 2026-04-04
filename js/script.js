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
    initDynamicNews();
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

  initDynamicNews();

  function initDynamicNews() {
    const publicRoot = document.querySelector('[data-news-public-app]');
    const adminRoot = document.querySelector('[data-admin-app]');
    if (!publicRoot && !adminRoot) return;

    const supabaseClient = createSupabaseClient();
    if (!supabaseClient) {
      if (publicRoot) {
        const loading = publicRoot.querySelector('[data-news-loading]');
        if (loading) loading.textContent = 'Haber sistemi henüz yapılandırılmadı.';
      }
      if (adminRoot) {
        const msg = adminRoot.querySelector('[data-admin-auth-message]');
        if (msg) msg.textContent = 'Admin paneli yapılandırması eksik (supabase-config.js).';
      }
      return;
    }

    if (publicRoot) initPublicNews(publicRoot, supabaseClient);
    if (adminRoot) initAdminPanel(adminRoot, supabaseClient);
  }

  function createSupabaseClient() {
    if (!window.supabase || !window.SUPABASE_CONFIG) return null;
    const { url, anonKey } = window.SUPABASE_CONFIG;
    if (!url || !anonKey || String(url).includes('BURAYA') || String(anonKey).includes('BURAYA')) return null;
    return window.supabase.createClient(url, anonKey);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderNewsCard(item, withDeleteButton) {
    const imageMarkup = item.image_url
      ? `<img class="news-cover" src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" loading="lazy" />`
      : '';

    const deleteMarkup = withDeleteButton
      ? `<button type="button" class="news-delete" data-admin-delete="${item.id}" aria-label="Haberi sil">Sil</button>`
      : '';

    const dateValue = item.published_at || item.created_at;
    const dateText = dateValue ? new Date(dateValue).toLocaleDateString('tr-TR') : '-';

    return `
      <article class="card-premium news-card p-4 md:p-5">
        ${imageMarkup}
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-2xl leading-tight">${escapeHtml(item.title || '')}</h3>
            ${deleteMarkup}
          </div>
          <p class="text-slate-600 whitespace-pre-line">${escapeHtml(item.description || '')}</p>
          <p class="text-xs uppercase tracking-[0.16em] text-slate-400">${dateText}</p>
        </div>
      </article>
    `;
  }

  async function initPublicNews(root, client) {
    const listEl = root.querySelector('[data-news-list]');
    const countEl = root.querySelector('[data-news-count]');
    const emptyEl = root.querySelector('[data-news-empty]');
    const loadingEl = root.querySelector('[data-news-loading]');
    if (!listEl || !countEl || !emptyEl || !loadingEl) return;

    const table = window.SUPABASE_CONFIG.newsTable || 'news_items';

    const { data, error } = await client
      .from(table)
      .select('id,title,description,image_url,published_at,created_at,is_published')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    loadingEl.classList.add('hidden');

    if (error) {
      emptyEl.classList.remove('hidden');
      emptyEl.textContent = 'Haberler yüklenirken bir sorun oluştu.';
      return;
    }

    const items = Array.isArray(data) ? data : [];
    countEl.textContent = String(items.length);

    if (!items.length) {
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = items.map((item) => renderNewsCard(item, false)).join('');
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  async function initAdminPanel(root, client) {
    const table = window.SUPABASE_CONFIG.newsTable || 'news_items';
    const bucket = window.SUPABASE_CONFIG.newsBucket || 'news-images';

    const loginWrap = root.querySelector('[data-admin-login-wrap]');
    const loginForm = root.querySelector('[data-admin-login]');
    const authMessage = root.querySelector('[data-admin-auth-message]');
    const editor = root.querySelector('[data-admin-editor]');
    const logoutBtn = root.querySelector('[data-admin-logout]');
    const newsForm = root.querySelector('[data-admin-news-form]');
    const newsMessage = root.querySelector('[data-admin-news-message]');
    const listEl = root.querySelector('[data-admin-list]');
    const emptyEl = root.querySelector('[data-admin-empty]');

    if (!loginWrap || !loginForm || !editor || !newsForm || !listEl || !emptyEl) return;

    const refreshAdminList = async () => {
      const { data, error } = await client
        .from(table)
        .select('id,title,description,image_url,published_at,created_at,is_published')
        .order('created_at', { ascending: false });

      if (error) {
        setText(newsMessage, 'Haber listesi alınamadı.');
        return;
      }

      const items = Array.isArray(data) ? data : [];
      if (!items.length) {
        listEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
      }

      emptyEl.classList.add('hidden');
      listEl.innerHTML = items.map((item) => renderNewsCard(item, true)).join('');
    };

    const applySessionUI = async () => {
      const { data } = await client.auth.getSession();
      const hasSession = Boolean(data && data.session);

      if (hasSession) {
        loginWrap.classList.add('hidden');
        editor.classList.remove('hidden');
        setText(authMessage, '');
        await refreshAdminList();
      } else {
        loginWrap.classList.remove('hidden');
        editor.classList.add('hidden');
      }
    };

    await applySessionUI();

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      if (!email || !password) return;

      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        setText(authMessage, 'Giriş başarısız. E-posta/şifreyi kontrol edin.');
        return;
      }

      setText(authMessage, 'Giriş başarılı.');
      loginForm.reset();
      await applySessionUI();
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await client.auth.signOut();
        await applySessionUI();
      });
    }

    newsForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setText(newsMessage, 'Kaydediliyor...');

      const title = newsForm.title.value.trim();
      const description = newsForm.description.value.trim();
      const imageFile = newsForm.image.files && newsForm.image.files[0] ? newsForm.image.files[0] : null;

      if (!title || !description) {
        setText(newsMessage, 'Başlık ve açıklama zorunlu.');
        return;
      }

      let imageUrl = '';
      if (imageFile) {
        if (imageFile.size > 3 * 1024 * 1024) {
          setText(newsMessage, 'Görsel en fazla 3MB olabilir.');
          return;
        }

        const safeName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const { error: uploadError } = await client.storage.from(bucket).upload(safeName, imageFile, { upsert: false });

        if (uploadError) {
          setText(newsMessage, 'Görsel yüklenemedi. Bucket izinlerini kontrol et.');
          return;
        }

        const { data: publicData } = client.storage.from(bucket).getPublicUrl(safeName);
        imageUrl = publicData && publicData.publicUrl ? publicData.publicUrl : '';
      }

      const { error } = await client.from(table).insert({
        title,
        description,
        image_url: imageUrl,
        is_published: true,
        published_at: new Date().toISOString(),
      });

      if (error) {
        setText(newsMessage, 'Haber kaydedilemedi. Tablo izinlerini kontrol et.');
        return;
      }

      newsForm.reset();
      setText(newsMessage, 'Haber yayınlandı.');
      await refreshAdminList();
    });

    listEl.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-admin-delete]');
      if (!button) return;
      const id = button.getAttribute('data-admin-delete');
      if (!id) return;

      const confirmDelete = window.confirm('Bu haberi silmek istediğine emin misin?');
      if (!confirmDelete) return;

      const { error } = await client.from(table).delete().eq('id', id);
      if (error) {
        setText(newsMessage, 'Silme işlemi başarısız oldu.');
        return;
      }

      setText(newsMessage, 'Haber silindi.');
      await refreshAdminList();
    });
  }
})();
