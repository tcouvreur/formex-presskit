/* ==========================================================================
   FORMEX — script unique, partagé par index.html et presskit.html
   Refonte 2026. Aucune dépendance, aucun CDN, aucun build.

   Sommaire
     1. Protection des images
     2. Année du pied de page
     3. Menu mobile
     4. Apparitions au scroll
     5. Bilingue
     6. Lightbox
     7. Dates passées
     8. Lecteurs SoundCloud
     9. Presskit, onglets de bio et bouton copier
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

  /* ========================================================================
     5. Bilingue
     Un dictionnaire clé par clé, des attributs data-i18n sur les noeuds de
     texte. La bascule met à jour le texte, l'attribut lang du document et
     mémorise le choix. Détection initiale sur navigator.language, français
     par défaut. Le français reste la version canonique.
     Les textes sont repris tels quels des fichiers de référence.
     ======================================================================== */

  var DICT = {
    fr: {
      /* Accueil */
      nav1: "Dates", nav2: "Écouter", nav3: "Bio", nav4: "Galerie", nav5: "Réseaux",
      mBooking: "Contact booking",
      heroSub: "Retour aux racines. Gabber, Early Hardcore et Millennium, du closing de club aux scènes de festival.",
      cta1: "Prochaines dates", cta2: "Écouter un set", scroll: "Faites défiler",
      lblAgenda: "Agenda", t2: "Prochaines dates",
      bConf: "Confirmé", bTickets: "Billets", bSoon: "Bientôt", bTba: "À confirmer",
      dTechno: "Set techno, ce n’est pas une date Hardcore", dAlias: "Alias XEM", dTba: "Horaire et détails à venir",
      pastLabel: "Voir les dates passées", pastNote: "Sélection 2026", aVinyl: "vinyl set", aEvent: "Voir l'event",
      eTitle: "Aucune date annoncée", eBody: "Rien d'officiel pour le moment. Les prochaines annonces passent d'abord par Instagram.", eCta: "Suivre les annonces",
      lblSound: "Sons", t3: "Écouter",
      lblBio: "Bio", t4: "Le projet",
      bioShort: "Basé à Lille, Formex propose une immersion dans l'univers Hardcore avec une sélection sans concession. Passionné par cette musique, il allie l'héritage du Gabber et de l'Early Hardcore à la puissance des productions modernes. En club comme en festival, l'objectif reste le même : partager l'énergie brute de cette culture.",
      lblGal: "Live", t5: "Galerie", galMore: "Voir le dossier",
      lblNet: "Réseaux", t6: "Me suivre",
      lblBooking: "Booking", footNote: "Pour les dates, les demandes presse et les partenariats. Réponse sous 48 h.",
      footPress: "Presskit", credit: "Photos : Leo Villalba",
      lbPrev: "Préc", lbNext: "Suiv",

      /* Presskit */
      backSite: "Retour au site", kicker: "Press kit · Booking 2026",
      position: "DJ Hardcore basé à Lille. Gabber, Early Hardcore et Millennium, du closing de club aux scènes de festival.",
      lblBios: "Textes", t1: "Les bios", biosNote: "Trois longueurs prêtes à coller dans vos annonces. Un clic sur copier, c'est dans le presse-papier.",
      bioS: "Courte", bioM: "Moyenne", bioL: "Longue",
      lblVisuals: "Visuels", pkT2: "Photos HD",
      phHd: "Photos presse", phHdSub: "HD, libres de droits pour la promo", phVid: "Vidéos", phVidSub: "Sets et sessions",
      lblSets: "Écoute", pkT3: "Sets de référence",
      lblRider: "Technique", pkT4: "Rider",
      riderIntro: "Ce document fait partie intégrante du contrat de booking. Merci de le transmettre au responsable technique ou au régisseur scène de l'événement.",
      rTech: "Fiche technique", rConf: "Configuration DJ",
      rP1: "Lecteurs : 3× Pioneer CDJ-3000 ou CDJ-2000NXS2, reliés en réseau.",
      rP2: "Table de mixage : 1× Pioneer DJM-900NXS2 ou DJM-A9.",
      rBooth: "Retours de cabine",
      rB1: "2× enceintes de retour actives pro, à hauteur d'oreille de chaque côté de la cabine.",
      rB2: "Volume des retours réglable depuis le bouton Booth Monitor de la table.",
      rB3: "Signal de retour propre, sans distorsion ni retard par rapport à la façade.",
      rHosp: "Hospitalité", rDrinks: "Boissons (loge ou cabine)",
      rD1: "2× petites bouteilles d'eau minérale plate.", rD2: "2× canettes de Red Bull.", rD3: "Quelques bières ou tickets boisson pour le bar.",
      rGuest: "Invitations", rG1: "2 ou 3 accès guestlist, entrée et backstage, pour les accompagnateurs, vidéaste ou photographe.",
      riderDl: "Télécharger le rider (PDF)",
      lblContact: "Contact", pkT5: "Booking",
      contactNote: "Pour les dates, les demandes presse et les partenariats. Réponse sous 48 h.",
      lblDl: "Téléchargements", dl1: "Press kit complet", dl2: "Rider technique", dl3: "Dossier complet Drive",
      noindex: "Page privée, non indexée",
      copyIdle: "Copier", copyDone: "Copié ✓", bioMetaFmt: "Bio %s · %n signes"
    },
    en: {
      /* Accueil */
      nav1: "Dates", nav2: "Listen", nav3: "Bio", nav4: "Gallery", nav5: "Socials",
      mBooking: "Booking contact",
      heroSub: "Back to the roots. Gabber, Early Hardcore and Millennium, from club closings to festival stages.",
      cta1: "Upcoming dates", cta2: "Listen to a set", scroll: "Scroll",
      lblAgenda: "Agenda", t2: "Upcoming dates",
      bConf: "Confirmed", bTickets: "Tickets", bSoon: "Soon", bTba: "To be confirmed",
      dTechno: "Techno set", dAlias: "XEM alias", dTba: "Time and details coming soon",
      pastLabel: "See past dates", pastNote: "2026 selection", aVinyl: "vinyl set", aEvent: "See event",
      eTitle: "No dates announced", eBody: "Nothing official right now. New announcements always land on Instagram first.", eCta: "Follow announcements",
      lblSound: "Sounds", t3: "Listen",
      lblBio: "Bio", t4: "The project",
      bioShort: "Based in Lille, Formex offers an uncompromising immersion into the Hardcore universe. Passionate about this music, he blends the heritage of Gabber and Early Hardcore with the power of modern productions. In clubs and at festivals, the goal remains the same: sharing the raw energy of this culture.",
      lblGal: "Live", t5: "Gallery", galMore: "Open the folder",
      lblNet: "Socials", t6: "Follow me",
      lblBooking: "Booking", footNote: "For dates, press requests and partnerships. Reply within 48 hours.",
      footPress: "Press kit", credit: "Photos: Leo Villalba",
      lbPrev: "Prev", lbNext: "Next",

      /* Presskit */
      backSite: "Back to site", kicker: "Press kit · Booking 2026",
      position: "Hardcore DJ based in Lille, France. Gabber, Early Hardcore and Millennium, from club closings to festival stages.",
      lblBios: "Copy", t1: "The bios", biosNote: "Three lengths, ready to paste into your announcements. One click and it is in your clipboard.",
      bioS: "Short", bioM: "Medium", bioL: "Long",
      lblVisuals: "Visuals", pkT2: "HD photos",
      phHd: "Press photos", phHdSub: "HD, cleared for promo use", phVid: "Videos", phVidSub: "Sets and sessions",
      lblSets: "Listen", pkT3: "Reference sets",
      lblRider: "Technical", pkT4: "Rider",
      riderIntro: "This document is an integral part of the booking contract. Please forward it to the technical manager or stage engineer of the event.",
      rTech: "Technical rider", rConf: "DJ configuration",
      rP1: "Players: 3× Pioneer CDJ-3000 or CDJ-2000NXS2, linked.",
      rP2: "Mixer: 1× Pioneer DJM-900NXS2 or DJM-A9.",
      rBooth: "Booth monitor",
      rB1: "2× high quality active monitors, at ear level on both sides of the booth.",
      rB2: "Booth volume controllable from the Booth Monitor knob on the mixer.",
      rB3: "Clean monitor signal, no distortion or latency versus the FOH PA.",
      rHosp: "Hospitality", rDrinks: "Drinks (dressing room or booth)",
      rD1: "2× small bottles of still mineral water.", rD2: "2× cans of Red Bull.", rD3: "A few beers or drink tokens for the bar.",
      rGuest: "Guest list", rG1: "2 or 3 guest passes, entry and backstage, for the artist's guests, videographer or photographer.",
      riderDl: "Download the rider (PDF)",
      lblContact: "Contact", pkT5: "Booking",
      contactNote: "For dates, press requests and partnerships. Reply within 48 hours.",
      lblDl: "Downloads", dl1: "Full press kit", dl2: "Technical rider", dl3: "Full Drive folder",
      noindex: "Private page, not indexed",
      copyIdle: "Copy", copyDone: "Copied ✓", bioMetaFmt: "%s bio · %n characters"
    }
  };

  /* Les trois bios du presskit, validées, reprises telles quelles. */
  var BIOS = {
    fr: [
      "Basé à Lille, Formex propose une immersion dans l'univers Hardcore avec une sélection sans concession. Passionné par cette musique, il allie l'héritage du Gabber et de l'Early Hardcore à la puissance des productions modernes. En club comme en festival, l'objectif reste le même : partager l'énergie brute de cette culture.",
      "Basé à Lille, Formex façonne son univers autour de la culture Hardcore. Son parcours prend un tournant décisif en 2007 à la découverte de l'univers hollandais Thunderdome. Cette culture et ses classiques définissent les fondations de son identité musicale.\n\nAprès avoir développé son style en club et cofondé le projet événementiel Circle avec sa meilleure amie Lisa pour organiser des soirées et promouvoir la scène locale, Formex se recentre sur le projet solo.\n\nS'il partage sa sélection à travers des sessions vinyles oldschool axées sur sa collection personnelle, il propose en club des sets plus dynamiques, mêlant les classiques Gabber et Early Hardcore aux productions les plus récentes et puissantes.",
      "Pour Formex, le déclic se produit en 2007 : la découverte du trailer de Thunderdome et du titre Welcome Down de DJ Mad Dog. Ce mélange d'énergie brute et de kicks puissants devient une révélation qui scelle son attachement au mouvement Hardcore.\n\nDès l'adolescence, il s'empare de FL Studio pour comprendre la synthèse sonore. Après ses débuts près de Reims, Formex s'installe à Lille en 2016. Il y peaufine son style, devenant une figure active de la nuit lilloise, souvent programmé sur les closings hardcore. Quelques années après, il lance Circle avec sa meilleure amie Lisa, un projet événementiel visant à organiser des soirées de tous horizons musicaux pour mettre en avant les artistes locaux.\n\nS'il affectionne particulièrement les classiques Gabber et Early Hardcore qui constituent ses fondations, Formex est avant tout un DJ Hardcore complet, capable de naviguer à travers toutes les époques et toutes les variations du genre. Pour ses vidéos en ligne, il s'exprime sur vinyles issus de sa collection personnelle, une manière de faire vivre l'histoire de cette culture. En club, il déploie un set rapide et intense, connectant les racines du genre aux productions modernes les plus percutantes."
    ],
    en: [
      "Based in Lille, Formex offers an uncompromising immersion into the Hardcore universe. Passionate about this music, he blends the heritage of Gabber and Early Hardcore with the power of modern productions. In clubs and at festivals, the goal remains the same: sharing the raw energy of this culture.",
      "Based in Lille, Formex shapes his universe around Hardcore culture. His journey took a decisive turn in 2007 upon discovering the Dutch Thunderdome universe. This culture and its classics defined the foundations of his musical identity.\n\nAfter developing his style in clubs and co-founding the Circle event project with his best friend Lisa to host events and promote the local scene, Formex is now refocusing on his solo project.\n\nWhile he shares his selection online through oldschool vinyl sessions centered on his personal collection, in clubs he delivers more dynamic sets, blending Gabber and Early Hardcore classics with the most recent and powerful productions.",
      "For Formex, the turning point came in 2007 with the discovery of the Thunderdome trailer and the track Welcome Down by DJ Mad Dog. This combination of raw energy and powerful kicks was a revelation that cemented his dedication to the Hardcore movement.\n\nAs a teenager, he took up FL Studio to understand sound synthesis. After his early days near Reims, Formex moved to Lille in 2016. There he refined his style, becoming an active figure in the Lille nightlife, often booked for hardcore closings. A few years later, he launched Circle with his best friend Lisa, an event project aimed at organizing events of all musical horizons to showcase local talent.\n\nWhile he is particularly fond of the Gabber and Early Hardcore classics that form his foundation, Formex is first and foremost a complete Hardcore DJ, capable of navigating through all eras and variations of the genre. For his online videos, he performs on vinyl from his personal collection, keeping the history of this culture alive. In clubs, he delivers a fast, intense set, connecting the roots of the genre to the most hard-hitting modern productions."
    ]
  };

  var STORE = 'formex-lang';
  var lang = 'fr';

  /* localStorage peut échouer en navigation privée, d'où le try/catch. */
  function readLang() {
    try {
      var v = localStorage.getItem(STORE);
      if (v === 'fr' || v === 'en') { return v; }
    } catch (e) {}
    return (navigator.language || 'fr').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  }

  function saveLang(v) {
    try { localStorage.setItem(STORE, v); } catch (e) {}
  }

  var isPress = document.body.classList.contains('is-press');

  function setLang(v, silent) {
    lang = (v === 'en') ? 'en' : 'fr';
    var d = DICT[lang];

    document.documentElement.setAttribute('lang', lang);

    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var k = el.getAttribute('data-i18n');
      /* Le presskit et l'accueil partagent des clés de titre, les siennes
         sont préfixées pkT pour ne pas se marcher dessus. */
      if (isPress && d[('pkT' + k.slice(1))] !== undefined && /^t[1-6]$/.test(k)) {
        k = 'pkT' + k.slice(1);
      }
      if (d[k] !== undefined) { el.textContent = d[k]; }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    if (typeof renderBio === 'function') { renderBio(silent); }
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-lang');
      saveLang(v);
      setLang(v);
    });
  });


  /* ========================================================================
     6. Lightbox
     Aucun href vers un fichier image, la source est lue dans data-src.
     ======================================================================== */

  var lb = document.getElementById('lightbox');

  if (lb) {
    var lbImg   = lb.querySelector('img');
    var lbCount = document.getElementById('lb-count');
    var items   = document.querySelectorAll('.gal__item[data-src]');
    var idx     = 0;

    function showLb(i, swap) {
      idx = (i + items.length) % items.length;
      var src = items[idx].getAttribute('data-src');
      if (swap) {
        /* Fondu croisé, pas de glissement horizontal. */
        lb.classList.add('is-swap');
        setTimeout(function () {
          lbImg.src = src;
          lb.classList.remove('is-swap');
        }, 180);
      } else {
        lbImg.src = src;
      }
      lbCount.textContent = (idx + 1) + ' / ' + items.length;
    }

    function openLb(i) {
      showLb(i, false);
      lb.hidden = false;
      page.classList.add('is-locked');
      lb.querySelector('.lb__close').focus();
    }

    function closeLb() {
      lb.hidden = true;
      page.classList.remove('is-locked');
      if (items[idx]) { items[idx].focus(); }
    }

    Array.prototype.forEach.call(items, function (el, i) {
      el.addEventListener('click', function () { openLb(i); });
    });

    lb.querySelector('.lb__close').addEventListener('click', closeLb);
    lb.querySelector('[data-lb="prev"]').addEventListener('click', function () { showLb(idx - 1, true); });
    lb.querySelector('[data-lb="next"]').addEventListener('click', function () { showLb(idx + 1, true); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) { return; }
      if (e.key === 'Escape')     { closeLb(); }
      if (e.key === 'ArrowLeft')  { showLb(idx - 1, true); }
      if (e.key === 'ArrowRight') { showLb(idx + 1, true); }
    });
  }


  /* ========================================================================
     7. Dates passées
     ======================================================================== */

  var arch = document.querySelector('.archive__toggle');

  if (arch) {
    arch.addEventListener('click', function () {
      var open = arch.getAttribute('aria-expanded') === 'true';
      arch.setAttribute('aria-expanded', open ? 'false' : 'true');
      arch.querySelector('.archive__sign').textContent = open ? '+' : '−';
    });
  }


  /* ========================================================================
     8. Lecteurs SoundCloud
     L'iframe n'est jamais chargée au chargement de la page. Au clic, la
     carte se transforme en vrai lecteur, injecté à la demande.
     ======================================================================== */

  Array.prototype.forEach.call(document.querySelectorAll('[data-sc]'), function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var url = card.getAttribute('data-sc');
      var box = document.createElement('div');
      box.className = 'set__player';
      var f = document.createElement('iframe');
      f.height = '166';
      f.allow = 'autoplay';
      f.title = card.querySelector('.set__title').textContent;
      f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url)
            + '&color=%23e21c1c&auto_play=true&hide_related=true&show_comments=false'
            + '&show_user=true&show_reposts=false&show_teaser=false';
      box.appendChild(f);
      card.parentNode.replaceChild(box, card);
    });
  });


  /* ========================================================================
     9. Presskit, onglets de bio et bouton copier
     ======================================================================== */

  var bioText = document.getElementById('bio-text');

  if (bioText) {
    var bioMeta = document.getElementById('bio-meta');
    var bioCopy = document.getElementById('bio-copy');
    var tabs    = document.querySelectorAll('.tab');
    var bioIdx  = 0;
    var copyT   = null;

    window.renderBio = function (silent) {
      var d = DICT[lang];
      var txt = BIOS[lang][bioIdx];
      var name = [d.bioS, d.bioM, d.bioL][bioIdx];

      bioMeta.textContent = d.bioMetaFmt
        .replace('%s', name)
        .replace('%n', String(txt.length));

      if (silent) {
        bioText.textContent = txt;
        return;
      }
      /* Le texte se remplace en fondu, la hauteur du cadre suit. */
      bioText.classList.add('is-swap');
      setTimeout(function () {
        bioText.textContent = txt;
        bioText.classList.remove('is-swap');
      }, 350);
    };

    Array.prototype.forEach.call(tabs, function (t) {
      t.addEventListener('click', function () {
        bioIdx = +t.getAttribute('data-bio');
        Array.prototype.forEach.call(tabs, function (o) {
          o.setAttribute('aria-selected', o === t ? 'true' : 'false');
        });
        window.renderBio(false);
      });
    });

    bioCopy.addEventListener('click', function () {
      var txt = BIOS[lang][bioIdx];
      var done = function () {
        clearTimeout(copyT);
        bioCopy.classList.add('is-done');
        bioCopy.textContent = DICT[lang].copyDone;
        copyT = setTimeout(function () {
          bioCopy.classList.remove('is-done');
          bioCopy.textContent = DICT[lang].copyIdle;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () {});
      }
    });
  }

  setLang(readLang(), true);
}());
