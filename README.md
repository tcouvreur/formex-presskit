# formex-presskit

Site officiel et press kit de **FORMEX**, DJ Hardcore basé à Lille.

Live sur **https://formexhardcore.com**

> ⚠️ **Ce dépôt est public.** Aucun identifiant, mot de passe, clé d'API ou fichier de configuration contenant un secret ne doit y être commité, jamais. La documentation d'infrastructure complète (DNS, comptes, mail, accès) est volontairement gardée **hors du dépôt**, dans `DOCS/INFRA_FORMEX.md` du dossier de travail local.

---

## Stack

Aucun framework, aucun build, aucune dépendance. Un seul fichier HTML avec son CSS et son JS en ligne.

| | |
|---|---|
| Hébergement | **Cloudflare Pages**, projet `formex-presskit`, output directory `/` |
| DNS et proxy | **Cloudflare** |
| Domaine | acheté chez OVH, DNS délégué à Cloudflare |
| Polices | Oswald et Inter, via Google Fonts |
| Lecteurs audio | embeds SoundCloud |

Le site a été hébergé sur Netlify jusqu'au 25/06/2026. Il ne l'est plus. Le fichier `netlify.toml` encore présent est **obsolète**.

---

## Déploiement

Un `push` sur `main` déclenche le déploiement automatique via Cloudflare Pages, en une trentaine de secondes.

```bash
git add -A && git commit -m "message" && git push
```

Penser à **Ctrl+F5** pour contourner le cache navigateur au moment de vérifier.

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | tout le site, page unique, CSS et JS inclus |
| `_headers` | en-têtes de sécurité, **lu par Cloudflare Pages** (même syntaxe que Netlify) |
| `netlify.toml` | ⚠️ obsolète, ignoré, à supprimer |
| `landing-simple.html` | ancienne landing d'avant juin 2026, conservée pour archive |
| `hero.jpg` | visuel du hero, 1440x2160, format portrait |
| `photo1.jpg`, `cover.jpg` | visuels de la bio et de la cover |
| `live1.jpg` à `live4.jpg` | bande photo de la section Médias, en lightbox |
| `og.jpg` | vignette de partage social, 1200x630 |
| `favicon.png` | favicon |
| `FORMEX_Presskit_2026.pdf` | press kit téléchargeable |
| `FORMEX_Technical_Rider.pdf` | fiche technique téléchargeable |

---

## Structure de la page

```
hero #home  ->  #ecouter  ->  #bio  ->  #medias  ->  #rider  ->  #contact
```

L'écoute passe volontairement **avant** la bio, pour que quelqu'un qui arrive depuis un post tombe directement sur les sets.

Éléments transverses, nav fixe, menu burger mobile, **bascule FR / EN globale**, lightbox avec navigation au clic et au clavier, année automatique en pied de page.

Une section Vidéos existait, elle a été retirée parce que les embeds Instagram et YouTube ne se lisaient pas. Le CSS a été conservé pour pouvoir la réactiver.

---

## Sous-domaines

| URL | Comportement |
|---|---|
| https://presskit.formexhardcore.com | redirection 301 vers le PDF du press kit |
| https://rider.formexhardcore.com | redirection 301 vers le PDF du rider |

Mécanisme, un CNAME **proxifié** (nuage orange obligatoire) plus une Redirect Rule Cloudflare. Ces liens sont utilisés dans les mails de booking, donc ne pas les casser.

---

## Pièges connus

**Le hero.** `hero.jpg` est en portrait 2:3. En `cover` sur mobile, l'image remplit déjà toute la hauteur, donc changer la position verticale en pourcentage **ne fait rien** tant qu'on n'a pas zoomé pour créer de la marge. Desktop et mobile ont des réglages distincts, ne pas toucher l'un en croyant régler l'autre.

**Le contenu est dupliqué.** Les bios et le rider sont recopiés en dur dans `index.html`, alors que la référence reste les PDF. Toute modification de contenu doit être faite **des deux côtés**.

**L'aperçu social est mis en cache.** Après un changement de `og.jpg` ou des balises Open Graph, repasser par le débogueur Facebook et cliquer sur Re-collecter.

**Les photos du bandeau sont volontairement en basse définition.** `live1.jpg` à `live4.jpg` sont plafonnées à **1600 px sur le grand côté, qualité 78**, soit environ 90 Ko chacune. Ne **jamais** y remettre les versions HD, elles pesaient 4 à 5 Mo pièce et plombaient le chargement mobile. Les originaux haute définition sont sur le **Google Drive**, et c'est là que les gens doivent aller les chercher. Sauvegarde locale des anciennes versions dans `PICTURES/_HD_site_backup/`, hors dépôt.

**Le téléchargement direct des photos est bridé.** Pas de `href` vers le fichier (la lightbox lit un `data-src`), `draggable="false"`, clic droit neutralisé sur le bandeau et la lightbox, appui long iOS désactivé via `-webkit-touch-callout`. Ce n'est pas inviolable, rien ne l'est sur le web, mais le chemin courant est fermé et le fichier servi est de toute façon en basse définition.

---

## À faire

- [x] ~~Compresser `live2.jpg` et `live3.jpg`~~, fait le 26/08/2026, 9,7 Mo ramenés à 428 Ko
- [ ] Supprimer `netlify.toml`, obsolète et servi publiquement
- [ ] Ajouter un `404.html`, aujourd'hui toute URL inconnue renvoie 200 avec la page d'accueil
- [ ] Ajouter une section **Dates**, alimentée par le futur back-office
