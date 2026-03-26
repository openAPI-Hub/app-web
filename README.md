# OpenAPI Hub

OpenAPI Hub est un catalogue web d'APIs publiques construit avec React, Vite et Tailwind CSS. Le projet est organise pour separer clairement l'application web, le domaine catalogue, le pipeline data Python et l'automatisation GitHub Actions.

## Demarrage

```bash
npm install
npm run dev
```

Commandes utiles :

```bash
npm run lint
npm run typecheck
npm run test
npm run test:python
npm run build
npm run data:sync
npm run data:health
npm run data:publish
```

## Structure

- `src/app` : bootstrap de l'application et styles globaux.
- `src/features/apis` : domaine catalogue, repository, hooks, composants et modeles.
- `src/shared` : composants et utilitaires reutilisables.
- `scripts/` : pipeline Python pour sync, publication et health checks.
- `data/catalog/apis.json` : source canonique du catalogue normalise.
- `public/data/apis.json` : copie publiee pour le front statique.
- `tests_python/` : tests unitaires du pipeline data.

## Documentation

- [Architecture](./docs/architecture.md)
- [Contrat du catalogue](./docs/catalog-contract.md)

## Workflows

- `ci.yml` execute lint, typecheck, tests web, tests Python et build.
- `sync.yml` agrege les sources et republie le catalogue.
- `healthcheck.yml` verifie les liens et applique la regle offline apres 3 echecs.
- `deploy.yml` publie le build Vite sur GitHub Pages.
