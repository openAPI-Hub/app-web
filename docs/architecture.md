# Architecture

## Vue d'ensemble

OpenAPI Hub est decoupe en trois couches principales :

- `src/app` initialise l'application React et les styles globaux.
- `src/features/apis` porte le domaine catalogue : types, repository, hook de page, filtres, composants et regles de presentation.
- `src/shared` contient le theming, les composants transverses et les utilitaires purs.

## Flux de donnees

1. Le repository `CatalogRepository` charge `public/data/apis.json`.
2. `useApiCatalog` centralise le chargement, l'etat de filtres, la selection de modal et le signalement de lien mort.
3. Les composants de `features/apis/components` affichent uniquement les donnees deja preparees.

## Pipeline data

1. `python -m scripts.fetch_sources` recupere les sources distantes.
2. Les snapshots bruts sont ecrits dans `data/raw/`.
3. Les donnees sont normalisees et fusionnees dans `data/catalog/apis.json`.
4. `python -m scripts.publish_catalog` republie le catalogue vers `public/data/apis.json`.
5. `python -m scripts.health_check` met a jour les statuts et republie le front.

## Automatisation

- `ci.yml` verifie le web et le pipeline Python sur push et pull request.
- `sync.yml` gere la synchronisation hebdomadaire.
- `healthcheck.yml` gere la verification quotidienne.
- `deploy.yml` publie le build Vite sur GitHub Pages.
