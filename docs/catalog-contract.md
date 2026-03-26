# Contrat du catalogue

Le catalogue normalise utilise cette structure JSON :

```json
{
  "metadata": {
    "total": 12,
    "last_synced": "2026-03-26T10:00:00Z",
    "sources": ["public-apis/public-apis", "apis.guru"]
  },
  "apis": [
    {
      "id": "pa-001",
      "name": "OpenWeatherMap",
      "description": "Description courte",
      "category": "Weather",
      "url": "https://example.com/docs",
      "auth_type": "apiKey",
      "https": true,
      "cors": true,
      "source_ref": "https://github.com/public-apis/public-apis",
      "last_verified_at": "2026-03-26T08:00:00Z",
      "status": "online",
      "fail_count": 0
    }
  ]
}
```

## Champs

- `metadata.total` : nombre total d'APIs publiees.
- `metadata.last_synced` : date ISO UTC de la derniere synchro ou health check.
- `metadata.sources` : liste des repertoires sources utilises.
- `apis[].id` : identifiant stable derive du nom et de la source.
- `apis[].auth_type` : `none`, `apiKey`, `OAuth` ou `unknown`.
- `apis[].status` : `online`, `offline` ou `unknown`.
- `apis[].fail_count` : nombre d'echecs consecutifs du health check.

## Regles

- Le front considere `data/catalog/apis.json` comme contrat de reference via `CatalogRepository`.
- `public/data/apis.json` doit rester une copie publiee du catalogue canonique.
- Une API passe `offline` quand `fail_count >= 3`.
