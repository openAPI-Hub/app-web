interface ThemeToggleProps {
  dark: boolean
  toggle(): void
}

export function ThemeToggle({ dark, toggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="inline-flex h-11 w-[4.5rem] items-center rounded-full border border-slate-200 bg-slate-100 p-1 transition-colors dark:border-slate-700 dark:bg-slate-800"
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform dark:bg-slate-950 dark:text-slate-100 ${
          dark ? 'translate-x-[2.1rem]' : 'translate-x-0'
        }`}
      >
        {dark ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 3v2.25M12 18.75V21M5.64 5.64l1.59 1.59M16.77 16.77l1.59 1.59M3 12h2.25M18.75 12H21M5.64 18.36l1.59-1.59M16.77 7.23l1.59-1.59M12 16.25A4.25 4.25 0 1112 7.75a4.25 4.25 0 010 8.5z"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
