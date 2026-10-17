/* Portfolio d'Imhotep Kakpo : interactions.
   Tout reste lisible et utilisable sans JavaScript ; ce fichier ne fait qu'enrichir. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- message éphémère ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('p');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  /* ---------- thème clair / sombre ---------- */
  var themeBtn = $('[data-theme-toggle]');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function theme() { return root.dataset.theme || (darkQuery.matches ? 'dark' : 'light'); }
  function syncTheme() {
    if (!themeBtn) return;
    var dark = theme() === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Passer en thème clair' : 'Passer en thème sombre');
    themeBtn.setAttribute('aria-pressed', String(dark));
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = theme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme();
    });
    darkQuery.addEventListener('change', syncTheme);
    syncTheme();
  }

  /* ---------- en-tête : menu mobile, ombre, barre de progression ---------- */
  var head = $('.site-head');
  var menuBtn = $('.menu-toggle');
  function closeMenu() {
    if (!head.classList.contains('open')) return;
    head.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
  }
  if (head && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = !head.classList.contains('open');
      head.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && head.classList.contains('open')) { closeMenu(); menuBtn.focus(); }
    });
    document.addEventListener('click', function (e) { if (!head.contains(e.target)) closeMenu(); });
    window.matchMedia('(min-width: 821px)').addEventListener('change', closeMenu);
  }

  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Revenir en haut de la page');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var brand = $('.brand'); if (brand) brand.focus({ preventScroll: true });
  });
  document.body.appendChild(toTop);

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (head) {
      head.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
      head.classList.toggle('scrolled', y > 8);
    }
    toTop.classList.toggle('show', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- section active dans le menu ---------- */
  var links = $$('.menu a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = byId[en.target.id];
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    var hero = document.getElementById('top'); // en haut de page, aucune section n'est active
    if (hero) spy.observe(hero);
  }

  /* ---------- apparition au défilement ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        revealIO.unobserve(el);
        // Une fois apparu, on rend la main aux effets de survol.
        setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.section-head, .featured, .project, .about > *, .skills > div, .timeline li, .block, .channels li, .stats li').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) return; // déjà visible au chargement
      var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.transitionDelay = (sibs % 3) * 70 + 'ms';
      el.classList.add('reveal');
      revealIO.observe(el);
    });
  }

  /* ---------- compteurs ---------- */
  var counters = $$('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = +el.dataset.count, t0 = null;
        countIO.unobserve(el);
        function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 1100);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        }
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countIO.observe(c); });
  }

  /* ---------- halo qui suit le pointeur ---------- */
  if (canHover && !reduce) {
    $$('.project, .featured, .hero').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- projets : filtres, recherche, technologies ---------- */
  var items = $$('.project-item');
  var search = $('#proj-search');
  if (items.length && search) {
    var buttons = $$('.filters button');
    var count = $('#proj-count');
    var empty = $('#proj-empty');
    var state = { type: 'tous', q: '' };
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); };
    items.forEach(function (it, i) {
      it._text = norm(it.textContent);
      it.style.viewTransitionName = 'projet-' + i;
    });
    buttons.forEach(function (b) {
      var f = b.dataset.filter;
      var n = f === 'tous' ? items.length : items.filter(function (i) { return i.dataset.type === f; }).length;
      var badge = document.createElement('span');
      badge.className = 'n';
      badge.textContent = n;
      badge.setAttribute('aria-hidden', 'true');
      b.appendChild(badge);
      b.setAttribute('aria-label', b.textContent.replace(/\d+$/, '').trim() + ' (' + n + ')');
    });

    var render = function () {
      var shown = 0;
      items.forEach(function (it) {
        var ok = (state.type === 'tous' || it.dataset.type === state.type) &&
                 (!state.q || it._text.indexOf(state.q) !== -1);
        it.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
      count.textContent = shown + ' projet' + (shown > 1 ? 's' : '') + ' sur ' + items.length +
        (state.q ? ' pour « ' + search.value.trim() + ' »' : '');
    };
    var apply = function (animate) {
      if (animate && document.startViewTransition && !reduce) {
        // Des clics rapides annulent la transition précédente : ce n'est pas une erreur.
        var vt = document.startViewTransition(render);
        vt.ready.catch(function () {});
        vt.finished.catch(function () {});
      } else render();
    };
    var setType = function (f) {
      state.type = f;
      buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.filter === f)); });
    };

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setType(b.dataset.filter); apply(true); });
    });
    search.addEventListener('input', function () { state.q = norm(search.value); apply(false); });

    // Un clic sur une technologie filtre les projets qui l'utilisent.
    $$('.project-item .tags li').forEach(function (li) {
      li.title = 'Voir les projets en ' + li.textContent;
      li.addEventListener('click', function () {
        search.value = li.textContent;
        state.q = norm(li.textContent);
        setType('tous');
        apply(true);
        var head = $('#projets .toolbar');
        if (head && head.getBoundingClientRect().top < 0) head.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      });
    });

    var reset = $('#proj-reset');
    if (reset) reset.addEventListener('click', function () {
      search.value = ''; state.q = ''; setType('tous'); apply(true); search.focus();
    });
    render();
  }

  /* ---------- compétences : renvoi vers les projets qui les utilisent ---------- */
  if (items.length && search) {
    var n2 = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); };
    $$('.chips li').forEach(function (chip) {
      if (chip.hasAttribute('data-nolink')) return;
      var tech = chip.dataset.tech || chip.textContent;
      var used = items.filter(function (it) { return it._text.indexOf(n2(tech)) !== -1; }).length;
      if (!used) return;
      chip.classList.add('linked');
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('aria-label', chip.textContent + ' : voir ' + used + ' projet' + (used > 1 ? 's' : ''));
      chip.insertAdjacentHTML('beforeend', '<span class="used" aria-hidden="true">' + used + '</span>');
      var go = function () {
        var all = $('.filters [data-filter="tous"]');
        if (all && all.getAttribute('aria-pressed') !== 'true') all.click();
        search.value = tech;
        search.dispatchEvent(new Event('input'));
        $('#projets').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      };
      chip.addEventListener('click', go);
      chip.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  /* ---------- diagrammes d'architecture interactifs ---------- */
  $$('[data-diagram]').forEach(function (fig) {
    var cap = $('[data-diagram-info]', fig);
    var def = cap ? cap.innerHTML : '';
    var current = null;
    function show(n) {
      current = n;
      fig.classList.add('focus');
      $$('.node', fig).forEach(function (x) { x.classList.toggle('on', x === n || (n && x.dataset.node === n.dataset.node)); });
      if (cap) cap.innerHTML = '<strong>' + n.dataset.title + '.</strong> ' + n.dataset.info;
    }
    function hide() {
      current = null;
      fig.classList.remove('focus');
      $$('.node', fig).forEach(function (x) { x.classList.remove('on'); });
      if (cap) cap.innerHTML = def;
    }
    $$('.node', fig).forEach(function (n) {
      n.addEventListener('mouseenter', function () { show(n); });
      n.addEventListener('mouseleave', hide);
      n.addEventListener('focus', function () { show(n); });
      n.addEventListener('blur', hide);
      n.addEventListener('click', function () { if (current === n) hide(); else show(n); });
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (current === n) hide(); else show(n); }
      });
    });
    if (reduce) $$('svg', fig).forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
  });

  /* ---------- copier l'adresse e-mail ---------- */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.copy;
      var done = function () {
        toast('Adresse copiée : ' + text);
        var label = $('.copy-label', b);
        if (label) { label.textContent = 'Copiée'; setTimeout(function () { label.textContent = 'Copier'; }, 2000); }
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { toast('Copie impossible, sélectionnez l’adresse.'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Copie impossible, sélectionnez l’adresse.'); }
        document.body.removeChild(ta);
      }
    });
  });
})();
