import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  dark: boolean
  toggleTheme(): void
}

export function Header({ dark, toggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-surface-dark/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-black text-white shadow-lg shadow-primary/20">
            {'{}'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white">OpenAPI Hub</h1>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Catalogue web structure pour APIs publiques
            </p>
          </div>
        </div>

        <ThemeToggle dark={dark} toggle={toggleTheme} />
      </div>
    </header>
  )
}
