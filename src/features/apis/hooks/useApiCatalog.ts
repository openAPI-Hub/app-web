import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'

import type { ApiCatalog, ApiEntry, ApiFilters, CatalogRepository } from '../types'
import { filterApis, getCatalogStats, getCategories, getDefaultApiFilters } from '../model/catalogModel'

const EMPTY_APIS: ApiEntry[] = []

export function useApiCatalog(repository: CatalogRepository) {
  const [catalog, setCatalog] = useState<ApiCatalog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ApiFilters>(getDefaultApiFilters)
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null)
  const [reportedIds, setReportedIds] = useState<string[]>([])

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      setLoading(true)

      try {
        const nextCatalog = await repository.loadCatalog()

        if (!active) {
          return
        }

        setCatalog(nextCatalog)
        setError(null)
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load the API catalog')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      active = false
    }
  }, [repository])

  const deferredSearch = useDeferredValue(filters.search)
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [deferredSearch, filters],
  )

  const apis = catalog?.apis ?? EMPTY_APIS
  const filteredApis = useMemo(() => filterApis(apis, effectiveFilters), [apis, effectiveFilters])
  const categories = useMemo(() => getCategories(apis), [apis])
  const stats = useMemo(() => getCatalogStats(catalog), [catalog])
  const selectedApi = useMemo(
    () => apis.find((api) => api.id === selectedApiId) ?? null,
    [apis, selectedApiId],
  )

  function updateFilters(nextFilters: Partial<ApiFilters>) {
    startTransition(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        ...nextFilters,
      }))
    })
  }

  async function reportDeadLink(apiId: string) {
    await repository.reportDeadLink(apiId)

    setReportedIds((currentIds) => (
      currentIds.includes(apiId) ? currentIds : [...currentIds, apiId]
    ))
  }

  function selectApi(api: ApiEntry) {
    setSelectedApiId(api.id)
  }

  function clearSelectedApi() {
    setSelectedApiId(null)
  }

  return {
    apis: filteredApis,
    loading,
    error,
    filters,
    stats,
    categories,
    selectedApi,
    reportedIds,
    setSearch: (search: string) => updateFilters({ search }),
    setCategory: (category: string) => updateFilters({ category }),
    setAuthFilter: (auth: ApiFilters['auth']) => updateFilters({ auth }),
    setCorsFilter: (cors: ApiFilters['cors']) => updateFilters({ cors }),
    toggleShowOffline: () => updateFilters({ showOffline: !filters.showOffline }),
    selectApi,
    clearSelectedApi,
    reportDeadLink,
  }
}
