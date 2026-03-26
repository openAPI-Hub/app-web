import type { ApiCatalog, ApiEntry, ApiFilters, CatalogStats } from '../types'

export function getDefaultApiFilters(): ApiFilters {
  return {
    search: '',
    category: 'all',
    auth: 'all',
    cors: 'all',
    showOffline: false,
  }
}

export function getCategories(apis: ApiEntry[]): string[] {
  const categories = new Set<string>()

  apis.forEach((api) => {
    if (api.category) {
      categories.add(api.category)
    }
  })

  return ['all', ...Array.from(categories).sort((left, right) => left.localeCompare(right))]
}

export function filterApis(apis: ApiEntry[], filters: ApiFilters): ApiEntry[] {
  const query = filters.search.trim().toLowerCase()

  return apis.filter((api) => {
    if (!filters.showOffline && api.status === 'offline') {
      return false
    }

    if (query) {
      const searchableText = `${api.name} ${api.description} ${api.category}`.toLowerCase()

      if (!searchableText.includes(query)) {
        return false
      }
    }

    if (filters.category !== 'all' && api.category !== filters.category) {
      return false
    }

    if (filters.auth === 'none' && api.auth_type !== 'none') {
      return false
    }

    if (filters.auth === 'required' && api.auth_type === 'none') {
      return false
    }

    if (filters.cors === 'yes' && !api.cors) {
      return false
    }

    if (filters.cors === 'no' && api.cors) {
      return false
    }

    return true
  })
}

export function getCatalogStats(catalog: ApiCatalog | null): CatalogStats {
  if (!catalog) {
    return {
      total: 0,
      online: 0,
      pct: 0,
      lastSynced: null,
    }
  }

  const total = catalog.apis.length
  const online = catalog.apis.filter((api) => api.status === 'online').length

  return {
    total,
    online,
    pct: total > 0 ? Math.round((online / total) * 100) : 0,
    lastSynced: catalog.metadata.last_synced,
  }
}
