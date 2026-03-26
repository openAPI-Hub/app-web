import type { ApiFilters } from '../types'

interface FilterBarProps {
  categories: string[]
  filters: ApiFilters
  onCategoryChange(category: string): void
  onAuthChange(auth: ApiFilters['auth']): void
  onCorsChange(cors: ApiFilters['cors']): void
  onToggleOffline(): void
}

export function FilterBar({
  categories,
  filters,
  onCategoryChange,
  onAuthChange,
  onCorsChange,
  onToggleOffline,
}: FilterBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-surface-dark-alt/80">
      <div
        role="group"
        aria-label="Filtres de categories"
        className="flex flex-wrap justify-center gap-2"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
              filters.category === category
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {category === 'all' ? 'Toutes' : category}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          <span>Authentification</span>
          <select
            aria-label="Filtre authentification"
            value={filters.auth}
            onChange={(event) => onAuthChange(event.target.value as ApiFilters['auth'])}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Toutes</option>
            <option value="none">Sans authentification</option>
            <option value="required">Auth requise</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          <span>CORS</span>
          <select
            aria-label="Filtre CORS"
            value={filters.cors}
            onChange={(event) => onCorsChange(event.target.value as ApiFilters['cors'])}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Tous</option>
            <option value="yes">Actif</option>
            <option value="no">Inactif</option>
          </select>
        </label>

        <label className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <input
            type="checkbox"
            checked={filters.showOffline}
            onChange={onToggleOffline}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
          />
          Afficher les APIs offline
        </label>
      </div>
    </div>
  )
}
