# La Terrasse des Gloutons

Ce projet est une application web pour gérer un restaurant, développée avec Nuxt.js et une base de données SQLite.

## Structure du projet

Le projet est divisé en deux parties principales :

- [Frontend (Nuxt.js)](project/README.md) : L'interface utilisateur de l'application
- [Backend (Database)](database/README.md) : La base de données et l'API

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- SQLite3

## Installation

1. Clonez le repository :

```bash
git clone [URL_DU_REPO]
cd La-terrasse-des-gloutons
```

2. Installez les dépendances du frontend :

```bash
cd project
npm install
```

3. Installez les dépendances du backend :

```bash
cd ../database
npm install
```

## Lancement

### Frontend

```bash
cd project
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:3000

### Backend

```bash
cd database
npm run dev
```

L'API sera accessible à l'adresse : http://localhost:3001

## Développement

- Le frontend utilise Nuxt.js avec TypeScript et Tailwind CSS
- Le backend utilise Express.js avec TypeScript et SQLite
- Les deux parties sont configurées pour le développement avec hot-reload

## Production

Pour construire l'application pour la production :

```bash
# Frontend
cd project
npm run build

# Backend
cd ../database
npm run build
```

## Contribution

1. Créez une branche pour votre fonctionnalité
2. Committez vos changements
3. Poussez vers la branche
4. Créez une Pull Request
