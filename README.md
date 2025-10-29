# Exercice NestJS/TS pour les candidats Crit

Il vous est donné ce projet afin que vous puissiez effectuer l'exercice pour l'entretien de développeur Back TS.

Vous trouverez l'ensemble des tâches qui vous sont demandés à la fin de ce README, il vous est fortement recommandé de lire les quelques explications se trouvant entre ce paragraphe et les différents exercices.


## Project structure

Ce projet est découpé en 2 apps :
- **web** : un module Nest contenant l’API à destination de MyCrit mobile. App embarquée par l’AWS Lambda lorsque déployée, via Fastify, cf. `apps/web/src/web-lambda.ts`.

- **ingest** : un service Nest contenant du code qui pourra être exécuté par une ou plusieurs Lambda, dans le but de récupérer et stocker de la donnée externe, cf. `app/ingest/src/ingest-lambda.ts`

En plus de ces deux apps, il y a d'autres couches qui sont explicités ci-dessous :
```
┌── apps/
│    ├── web
│    │    └── src (endpoints)
│    │    └── main.ts (config locale pour démarrer l'app Nest)
│    │    └── web-lambda.ts (l'handler de la Lambda AWS)
│    │
│    └── ingest
│           └── src (1 service de réception d'events, avec Nest)
│               └── main.ts (config locale pour démarrer le service Nest)
│               └── ingest-lambda.ts (l'handler de la Lambda AWS)
│
├── libs/
│    ├── domain (couche de domaine métier, contenant les structures de données)
│    ├── persistence (couche de persistance)
│    ├── service (couche de service, contenant la logique métier)
│    └── shared-configuration (configuration: bootstrapping, filtres, ...)
│
├── envs/ (fichiers de configuration locale)
├── webpack/ (configuration Webpack)
├── nest-cli.json
├── Prettier, ESLint, tsconfig, Readme, etc ...
└── package.json (dépendances, scripts, metadata)
```

## Installation

```sh
npm install
```

## Compilation et run du projet localement

Avant de lancer le projet, créez un .local.env en vous basant sur le .example.env.

Si vous n'avez pas de préferences de PORT pour run le projet vous pouvez simplement copier le fichier.

```bash
# build
npm run build          # build les 2 apps
npm run build:web      # build l'app web
npm run build:ingest   # build l'app ingest
```

```bash
# développement
npm run start:web:dev        # lancement local de l'app web
npm run start:ingest:dev     # lancement local du service ingest
```

## Tests

```sh
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Swagger

Vous pouvez accéder et utiliser votre document Swagger API via
[localhost:3000/swagger](https://localhost:3000/swagger).


## Exercices

### Contexte

Il vous est fournis dans ce projet une API gérant une entité métier "Chat" :cat:

Actuellement, le projet permet de :
- créer un chat
  - soit **via API** avec un `POST` qui persistera le chat
  - soit **via ingestion** d'un événement de création via `ChatEventType.CREATION`)

- récupérer la liste des chats persistés (par le biais d'une route POST).

### Exercice 1

Votre tâche sera de modifier l'entité "chat".
Le but étant que l'entité Chat contienne un champ "ownerEmail" qui sera nécessaire lors de l'appel à la route POST pour créer un chat, et donc le persister.

Une fois celà fait, l'adresse email étant un champ "risqué", il faudra ajouter un Interceptor (ou équivalent)
permettant de filtrer les réponses API renvoyant des chats afin qu'elles ne contiennent pas ce champ.

### Exercice 2

La route actuelle de récupération des chats n'est pas optimale.

Elle renvoie l'entièreté des chats de la base de données.

Proposez une solution pour respecter les bonnes pratiques usuelles de code et de design pour une route de récupération par lot et/ou par filtres.


### Exercice 3

Actuellement, les "chats" sont uniquement persistés en mémoire dans l'API.

Nous souhaitons conserver ce mode de persistance pour l’environnement de développement local, mais ajouter une seconde couche de persistance (par exemple une base de données ou un stockage disque) qui sera utilisée en environnement de production.

Implémentez cette couche de persistance additionnelle ainsi qu’un mécanisme permettant de choisir dynamiquement la persistance à utiliser en fonction de l’environnement d’exécution.

# exercice-nestjs
