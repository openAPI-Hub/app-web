interface SearchBarProps {
  value: string
  onChange(value: string): void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        aria-label="Rechercher une API"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher une API (weather, finance, pokemon, ai)"
        className="w-full rounded-[2rem] border-2 border-slate-200 bg-white px-12 py-4 text-lg text-slate-900 shadow-lg shadow-slate-200/40 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-surface-dark-alt dark:text-white dark:shadow-none"
      />
      {value ? (
        <button
          type="button"
          aria-label="Effacer la recherche"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
