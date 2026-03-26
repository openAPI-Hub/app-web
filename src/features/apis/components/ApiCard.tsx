import type { ApiEntry } from '../types'
import { formatCompactRelativeTime } from '../../../shared/lib/time'
import { useNow } from '../../../shared/hooks/useNow'

interface ApiCardProps {
  api: ApiEntry
  isReported: boolean
  onOpen(): void
  onReportDeadLink(): Promise<void>
}

const AUTH_LABELS = {
  none: { label: 'Libre', className: 'bg-accent/10 text-accent' },
  apiKey: { label: 'API key', className: 'bg-warning/10 text-warning' },
  OAuth: { label: 'OAuth', className: 'bg-primary/10 text-primary' },
  unknown: {
    label: 'Auth inconnue',
    className: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
} as const

export function ApiCard({ api, isReported, onOpen, onReportDeadLink }: ApiCardProps) {
  const now = useNow()
  const auth = AUTH_LABELS[api.auth_type] ?? AUTH_LABELS.unknown
  const isOnline = api.status === 'online'

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:border-slate-800 dark:bg-surface-dark-alt/90">
      <button
        type="button"
        aria-label={`Ouvrir les details de ${api.name}`}
        onClick={onOpen}
        className="flex flex-1 flex-col text-left"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {api.category}
          </span>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              isOnline ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-accent' : 'bg-danger'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 transition-colors hover:text-primary dark:text-white">
          {api.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {api.description}
        </p>
      </button>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${auth.className}`}>
          {auth.label}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {api.https ? 'HTTPS' : 'HTTP'}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {api.cors ? 'CORS' : 'Sans CORS'}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Verifie {formatCompactRelativeTime(api.last_verified_at, now)}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={api.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Docs
          </a>
          <button
            type="button"
            onClick={() => {
              void onReportDeadLink()
            }}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              isReported
                ? 'bg-accent/10 text-accent'
                : 'border border-slate-200 text-slate-500 hover:border-danger hover:text-danger dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {isReported ? 'Signale' : 'Signaler'}
          </button>
        </div>
      </div>
    </article>
  )
}
