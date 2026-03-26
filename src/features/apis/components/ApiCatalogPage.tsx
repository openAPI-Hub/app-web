import type { CatalogRepository } from '../types'
import { ApiGrid } from './ApiGrid'
import { ApiModal } from './ApiModal'
import { FilterBar } from './FilterBar'
import { SearchBar } from './SearchBar'
import { StatsBar } from './StatsBar'
import { useApiCatalog } from '../hooks/useApiCatalog'

interface ApiCatalogPageProps {
  repository: CatalogRepository
}

export function ApiCatalogPage({ repository }: ApiCatalogPageProps) {
  const {
    apis,
    loading,
    error,
    filters,
    stats,
    categories,
    selectedApi,
    reportedIds,
    setSearch,
    setCategory,
    setAuthFilter,
    setCorsFilter,
    toggleShowOffline,
    selectApi,
    clearSelectedApi,
    reportDeadLink,
  } = useApiCatalog(repository)

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="pb-10 pt-12 text-center sm:pt-16">
          <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Catalogue d'APIs publiques
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Trouvez votre prochaine API en quelques secondes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Un catalogue structure, filtre et pret a evoluer vers un backend sans refaire le front.
          </p>

          <div className="mt-8">
            <SearchBar value={filters.search} onChange={setSearch} />
          </div>
        </section>

        <section className="pb-6">
          <FilterBar
            categories={categories}
            filters={filters}
            onCategoryChange={setCategory}
            onAuthChange={setAuthFilter}
            onCorsChange={setCorsFilter}
            onToggleOffline={toggleShowOffline}
          />
        </section>

        <section className="pb-6">
          <StatsBar stats={stats} resultCount={apis.length} />
        </section>

        {error ? (
          <section className="pb-6">
            <div
              role="alert"
              className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              Impossible de charger le catalogue : {error}
            </div>
          </section>
        ) : null}

        <section className="pb-16">
          <ApiGrid
            apis={apis}
            loading={loading}
            reportedIds={reportedIds}
            onOpenApi={selectApi}
            onReportDeadLink={reportDeadLink}
          />
        </section>
      </main>

      {selectedApi ? (
        <ApiModal api={selectedApi} onClose={clearSelectedApi} />
      ) : null}
    </>
  )
}
