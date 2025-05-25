# Frontend - La Terrasse des Gloutons

Ce projet est l'interface utilisateur de l'application La Terrasse des Gloutons, développée avec Nuxt.js.

## Technologies utilisées

- Nuxt.js 3
- TypeScript
- Tailwind CSS
- Vue.js 3
- Composition API

## Structure du projet

```
project/
├── components/     # Composants Vue réutilisables
├── composables/    # Composables Vue (hooks)
├── pages/         # Pages de l'application
├── plugins/       # Plugins Nuxt
├── public/        # Fichiers statiques
├── server/        # API routes
└── middleware/    # Middleware Nuxt
```

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:3000

## Build pour la production

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Tests

```bash
npm run test
```

## Configuration

Le fichier `nuxt.config.ts` contient la configuration principale de l'application :

- Configuration de Tailwind CSS
- Configuration des modules Nuxt
- Configuration des variables d'environnement
- Configuration des plugins

## Déploiement

L'application peut être déployée sur n'importe quel service supportant Node.js, comme :

- Vercel
- Netlify
- Heroku
- AWS
