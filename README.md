# formex-presskit

Site officiel et press kit de **FORMEX**, DJ Hardcore basé à Lille.

En ligne sur **https://formexhardcore.com**

> ⚠️ **Ce dépôt est public.** Aucun identifiant, mot de passe, clé d'API ou fichier de configuration contenant un secret ne doit y être commité, jamais. La documentation d'infrastructure complète, DNS, comptes, mail et accès, est volontairement gardée **hors du dépôt**, dans le dossier de travail local.

---

## Stack

Aucun framework, aucun build, aucun gestionnaire de paquets. Le site se déploie en copiant des fichiers.

| | |
|---|---|
| Hébergement | **Cloudflare Pages**, projet `formex-presskit`, output directory `/` |
| DNS et proxy | **Cloudflare** |
| Domaine | acheté chez OVH, DNS délégué à Cloudflare |
| Polices | **Anton**, **Archivo** et **Pirata One**, via Google Fonts |
| Lecteurs audio | SoundCloud, iframe injectée au clic uniquement |

Refonte complète en août 2026. Le site était auparavant une page unique avec son CSS et son JS en ligne, en Oswald et Inter.

---

## Déploiement

Un `push` sur `main` déclenche le déploiement automatique via Cloudflare Pages, en une trentaine de secondes.

```bash
git add -A && git commit -m "message" && git push
```

Penser à **Ctrl+F5** pour contourner le cache du navigateur au moment de vérifier.

---

## Structure

```
├── index.html          accueil
├── presskit.html       press kit, en noindex, envoyé par lien
├── 404.html            vraie page 404
├── assets/
│   ├── css/style.css   feuille unique, partagée par les trois pages
│   ├── js/main.js      script unique, partagé par les trois pages
│   ├── img/            images du site, WebP avec repli JPEG
│   └── video/          boucles du hero, une version mobile et une desktop
├── _headers            en-têtes de sécurité, lu par Cloudflare Pages
├── og.jpg              aperçu social de l'accueil, 1200x630
├── og-presskit.jpg     aperçu social du press kit
├── favicon.ico / .png, apple-touch-icon.png
├── FORMEX_Presskit_2026.pdf
├── FORMEX_Technical_Rider.pdf
└── landing-simple.html ancienne landing d'avant juin 2026, conservée
```

**Sections de l'accueil** : hero, 01 agenda, 02 sons, 03 bio, 04 live, 05 réseaux, pied de page.

**Sections du press kit** : hero, 01 textes, 02 visuels, 03 écoute, 04 technique, 05 contact et 06 téléchargements.

Le site est **bilingue français et anglais** sur les trois pages. Détection sur la langue du navigateur au premier passage, choix mémorisé ensuite. Le français reste la version canonique.

---

## Quelques règles à ne pas casser

- Le **bandeau défilant** doit rester le dernier élément du flux de chaque page. C'est ce qui permet à son `position: sticky; bottom: 0` de tenir. La racine porte `overflow-x: clip` et surtout pas `hidden`.
- Les **images sont plafonnées à 1600 px** sur le grand côté. Les versions haute définition vivent sur le Drive, pas ici.
- Les vignettes n'ont **aucun `href` vers un fichier image**, la lightbox lit un `data-src`. C'est volontaire.
- Le **HTML ne porte pas de commentaires**, ils seraient lisibles en inspectant la page. Les décisions sont documentées hors dépôt.
- La **vidéo du hero** ne se charge qu'en un seul fichier, mobile ou desktop selon la largeur, jamais les deux, et pas du tout si l'économiseur de données ou `prefers-reduced-motion` est actif.

---

## Sous-domaines

| URL | Comportement |
|---|---|
| https://presskit.formexhardcore.com | redirection 301 vers le PDF du press kit |
| https://rider.formexhardcore.com | redirection 301 vers le PDF du rider |

Mécanisme, un CNAME **proxifié** (nuage orange obligatoire) plus une Redirect Rule Cloudflare. Ces liens circulent dans les mails de booking, **ne pas les casser**.

---

## Contact

Booking, presse et partenariats : **booking@formexhardcore.com**
