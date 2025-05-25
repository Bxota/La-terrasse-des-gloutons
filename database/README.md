# Backend - La Terrasse des Gloutons

Ce projet est le backend de l'application La Terrasse des Gloutons, développé avec Express.js et SQLite.

## Technologies utilisées

- Node.js
- Express.js
- TypeScript
- SQLite3
- Prisma (ORM)

## Structure du projet

```
database/
├── src/           # Code source TypeScript
├── config/        # Fichiers de configuration
├── types/         # Types TypeScript
├── public/        # Fichiers statiques
└── database/      # Schéma et migrations de la base de données
```

## Installation

```bash
npm install
```

## Configuration de la base de données

1. Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="file:./data.db"
```

2. Initialisez la base de données :

```bash
npm run db:init
```

## Développement

```bash
npm run dev
```

L'API sera accessible à l'adresse : http://localhost:3001

## Build pour la production

```bash
npm run build
```

## API Endpoints

### Menus

- GET /api/menus - Liste tous les menus
- GET /api/menus/:id - Récupère un menu spécifique
- POST /api/menus - Crée un nouveau menu
- PUT /api/menus/:id - Met à jour un menu
- DELETE /api/menus/:id - Supprime un menu

### Commandes

- GET /api/commandes - Liste toutes les commandes
- GET /api/commandes/:id - Récupère une commande spécifique
- POST /api/commandes - Crée une nouvelle commande
- PUT /api/commandes/:id - Met à jour une commande
- DELETE /api/commandes/:id - Supprime une commande

## Tests

```bash
npm run test
```

## Déploiement

L'API peut être déployée sur n'importe quel service supportant Node.js, comme :

- Heroku
- AWS
- DigitalOcean
- Railway

# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
