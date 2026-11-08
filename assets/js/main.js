/* REMDOM25 — вариант 2: интерактив макета */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var head = $('.head');
  window.addEventListener('scroll', function () {
    if (head) head.classList.toggle('is-stuck', window.scrollY > 6);
  }, { passive: true });

  /* меню */
  var burger = $('[data-menu-open]');
  var menu = $('[data-menu]');
  var close = $('[data-menu-close]');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) burger.addEventListener('click', function () { setMenu(true); });
  if (close) close.addEventListener('click', function () { setMenu(false); });
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* видео */
  var modal = $('[data-modal]');
  var box = modal ? $('.modal__box', modal) : null;
  $$('[data-video]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (!modal || !box) return;
      box.innerHTML = '<iframe src="https://rutube.ru/play/embed/' + el.getAttribute('data-video') +
        '/?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Видео Remdom25"></iframe>';
      modal.classList.add('is-open');
      document.documentElement.style.overflow = 'hidden';
    });
  });
  function closeVideo() {
    if (!modal) return;
    modal.classList.remove('is-open');
    if (box) box.innerHTML = '';
    document.documentElement.style.overflow = '';
  }
  if (modal) {
    $$('[data-modal-close]', modal).forEach(function (b) { b.addEventListener('click', closeVideo); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });
  }

  /* фильтры */
  var bar = $('[data-filters]');
  if (bar) {
    var cards = $$('[data-project]');
    var count = $('[data-filter-count]');
    var apply = function (key) {
      var shown = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        var ok = key === 'all' || tags.indexOf(key) !== -1;
        card.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (count) count.textContent = shown + ' из ' + cards.length;
      $$('.chip', bar).forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-filter') === key ? 'true' : 'false');
      });
    };
    $$('.chip', bar).forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); }); });
    apply('all');
  }

  /* галерея */
  var gal = $('[data-gallery]');
  if (gal) {
    var main = $('.gal__main', gal);
    var img = main ? $('img', main) : null;
    var badge = $('[data-gallery-badge]', gal);
    $$('[data-gallery-thumb]').forEach(function (th) {
      th.addEventListener('click', function () {
        var kind = th.getAttribute('data-kind') || 'photo';
        if (img) {
          img.src = th.getAttribute('data-src');
          img.alt = th.getAttribute('data-alt') || img.alt;
        }
        if (main) main.classList.toggle('gal__main--plan', kind === 'plan');
        if (badge) badge.textContent = kind === 'plan' ? 'Планировка' : 'Фото проекта';
        $$('[data-gallery-thumb]').forEach(function (t) { t.setAttribute('aria-current', 'false'); });
        th.setAttribute('aria-current', 'true');
      });
    });
  }

  /* формы */
  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var tel = $('input[type="tel"]', form);
      if (tel && tel.value.replace(/\D/g, '').length < 10) { tel.focus(); return; }
      form.classList.add('is-sent');
    });
  });

  /* появление */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
