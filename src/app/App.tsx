import type { CatalogRepository } from '../features/apis/types'
import { ApiCatalogPage } from '../features/apis/components/ApiCatalogPage'
import { staticCatalogRepository } from '../features/apis/api/catalogRepository'
import { Header } from '../shared/components/Header'
import { useTheme } from '../shared/hooks/useTheme'

interface AppProps {
  catalogRepository?: CatalogRepository
}

function App({ catalogRepository = staticCatalogRepository }: AppProps) {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-surface-light text-slate-900 transition-colors duration-300 dark:bg-surface-dark dark:text-slate-50">
      <Header dark={dark} toggleTheme={toggle} />

      <ApiCatalogPage repository={catalogRepository} />

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>
          OpenAPI Hub — Donnees agregees depuis{' '}
          <a
            href="https://github.com/public-apis/public-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            public-apis
          </a>{' '}
          et{' '}
          <a
            href="https://apis.guru"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            APIs.guru
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
