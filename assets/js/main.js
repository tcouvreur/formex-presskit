/* ==========================================================================
   FORMEX — script unique, partagé par index.html et presskit.html
   Refonte 2026. Aucune dépendance, aucun CDN, aucun build.

   Sommaire
     1. Protection des images
     2. Année du pied de page
     3. Menu mobile
     4. Apparitions au scroll, repli IntersectionObserver
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. Protection des images
     Mise en place le 26/08/2026, reconduite telle quelle dans la refonte.
     L'écouteur est posé sur document et filtre sur la balise, il est donc
     global : toute image ajoutée plus tard est couverte sans intervention.
     Le pendant CSS (user-drag, touch-callout) cible le sélecteur img nu.
     La vraie protection reste ailleurs, le fichier servi est en basse
     définition et les HD vivent sur le Drive.
     ======================================================================== */

  document.addEventListener('contextmenu', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });


  /* ========================================================================
     2. Année du pied de page
     ======================================================================== */

  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = year;
  });


  /* ========================================================================
     3. Menu mobile
     Le panneau est masqué par l'attribut hidden. À l'ouverture on pose
     .is-locked sur la racine, ce qui lui retire toute amplitude de
     défilement : la page derrière ne bouge plus.
     ======================================================================== */

  var page   = document.querySelector('.page');
  var burger = document.querySelector('.burger');
  var menu   = document.getElementById('menu');

  function setMenu(open) {
    if (!burger || !menu || !page) { return; }
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    page.classList.toggle('is-locked', open);
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(menu.hidden);
    });

    /* Tout lien du menu le referme, y compris les ancres internes. */
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setMenu(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        burger.focus();
      }
    });

    /* Repasser en desktop pendant que le menu est ouvert laisserait la page
       bloquée en défilement. */
    var wide = window.matchMedia('(min-width: 900px)');
    wide.addEventListener('change', function (e) {
      if (e.matches) { setMenu(false); }
    });
  }


  /* ========================================================================
     4. Apparitions au scroll
     Deux chemins, jamais les deux à la fois.
     .no-vt est posée dès le <head> quand animation-timeline manque : on
     observe alors les blocs et on pose .is-in une seule fois.
     Sinon le CSS fait tout, mais une view timeline sans amplitude de
     défilement reste inactive et laisserait le contenu invisible. Sur une
     page trop courte, on neutralise donc l'effet.
     ======================================================================== */

  var blocks = document.querySelectorAll('.rv');

  function revealAll() {
    Array.prototype.forEach.call(blocks, function (el) {
      el.classList.add('rv-off');
    });
  }

  if (document.documentElement.classList.contains('no-vt')) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

      Array.prototype.forEach.call(blocks, function (el) { io.observe(el); });
    } else {
      revealAll();
    }
  } else {
    window.addEventListener('load', function () {
      var doc = document.documentElement;
      if (doc.scrollHeight <= doc.clientHeight + 40) { revealAll(); }
    });
  }
}());
