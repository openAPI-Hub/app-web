import type { ApiEntry } from '../types'
import { ApiCard } from './ApiCard'

interface ApiGridProps {
  apis: ApiEntry[]
  loading: boolean
  reportedIds: string[]
  onOpenApi(api: ApiEntry): void
  onReportDeadLink(apiId: string): Promise<void>
}

function LoadingCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-surface-dark-alt">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-slate-700 dark:bg-surface-dark-alt/70">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
        Aucune API ne correspond a votre recherche
      </h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Essayez une autre recherche ou ouvrez le filtre des APIs offline.
      </p>
    </div>
  )
}

export function ApiGrid({
  apis,
  loading,
  reportedIds,
  onOpenApi,
  onReportDeadLink,
}: ApiGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    )
  }

  if (apis.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {apis.map((api) => (
        <ApiCard
          key={api.id}
          api={api}
          isReported={reportedIds.includes(api.id)}
          onOpen={() => onOpenApi(api)}
          onReportDeadLink={() => onReportDeadLink(api.id)}
        />
      ))}
    </div>
  )
}
