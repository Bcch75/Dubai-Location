# Dubai Location · Site vitrine

Site de la conciergerie **Dubai Location** (activités, excursions et location de voitures de luxe à Dubaï), construit avec **Astro 5** et **Tailwind CSS 4**.
Le site est 100 % statique : il est rapide, bien référencé et s'héberge gratuitement.

## Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) version 20 ou plus récente.

```bash
npm install      # une seule fois : installe les dépendances
npm run dev      # lance le site sur http://localhost:4321 (se recharge automatiquement)
```

Version de production :

```bash
npm run build    # génère le site final dans le dossier dist/
npm run preview  # affiche ce site final en local
```

## Modifier le contenu

| Quoi | Où |
|---|---|
| Téléphone, WhatsApp, email, horaires, Instagram | `src/data/site.ts` |
| Activités (titres, textes, prix, durées, options, photos) | `src/data/activities.ts` |
| Voitures (modèles, prix/jour, photos, conditions de location) | `src/data/cars.ts` |
| Photos | `src/assets/img/` (remplacer un fichier en gardant le même nom) |
| Page d'accueil (sections, FAQ) | `src/pages/index.astro` |
| Couleurs et polices | `src/styles/global.css` (bloc `@theme`) |
| Conditions et mentions légales | `src/pages/conditions.astro`, `src/pages/mentions-legales.astro` |

Pour ajouter une activité, copiez un bloc dans `src/data/activities.ts`, puis changez le `slug` (l'adresse de la page), les textes et l'image. La page détaillée est créée automatiquement.

## Les réservations

Les formulaires n'ont pas besoin de serveur. Ils ouvrent WhatsApp, avec un message pré-rempli : expérience, formule, date, nombre de personnes et prénom. Une option permet aussi d'envoyer la demande par email.

## Mettre en ligne (gratuit)

- **Netlify** : glissez-déposez le dossier `dist/` sur https://app.netlify.com/drop.
- **Vercel ou Netlify via GitHub** : importez le dépôt. La commande de build est `npm run build`, le dossier de sortie est `dist`.

Pensez à remplacer `site:` dans `astro.config.mjs` par le vrai nom de domaine.

## À compléter

- [ ] Mentions légales : raison sociale et numéro de licence
- [ ] Conditions de réservation : acompte et politique d'annulation réelles
- [ ] Lien Instagram dans `src/data/site.ts`
- [ ] Vrais avis clients (Google ou TripAdvisor), pour ajouter une section témoignages
- [ ] Voitures : remplacer la flotte type par les vrais véhicules et leurs prix par jour (`src/data/cars.ts`, `pricePerDay: null` affiche « Prix sur demande »)
- [ ] Voitures : valider les conditions de location (âge, permis, caution)

Photos : Unsplash (licence Unsplash, usage commercial autorisé).
