# Directives du projet OpenAPI Hub

## Vision

OpenAPI Hub ne maintient pas une base d'APIs a la main. Le projet agrege des sources ouvertes, normalise les donnees et expose un catalogue web fiable.

## Regles de structure

- Le front ne lit jamais directement un JSON sans passer par `CatalogRepository`.
- La source canonique du catalogue est `data/catalog/apis.json`.
- Le front statique consomme uniquement `public/data/apis.json`.
- Les scripts Python reutilisent les helpers partages dans `scripts/catalog/`.
- `dist/` reste un artefact de build, jamais une source projet.

## Regles data

- Les snapshots bruts sont stockes dans `data/raw/`.
- Le catalogue normalise respecte le contrat documente dans `docs/catalog-contract.md`.
- Une API passe `offline` apres 3 echecs de health check consecutifs.

## Qualite

- Toute evolution doit garder `lint`, `typecheck`, `test`, `test:python` et `build` au vert.
- Les textes exposes dans l'application et les metadonnees HTML doivent rester propres en UTF-8.
