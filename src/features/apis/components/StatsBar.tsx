import type { CatalogStats } from '../types'
import { useNow } from '../../../shared/hooks/useNow'
import { formatDetailedRelativeTime } from '../../../shared/lib/time'

interface StatsBarProps {
  stats: CatalogStats
  resultCount: number
}

export function StatsBar({ stats, resultCount }: StatsBarProps) {
  const now = useNow()

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white/65 px-4 py-3 text-sm text-slate-600 shadow-sm dark:bg-surface-dark-alt/75 dark:text-slate-300">
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <strong className="text-slate-900 dark:text-white">{resultCount}</strong> resultat{resultCount > 1 ? 's' : ''}
      </span>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <span>
        <strong className="text-accent">{stats.online}</strong> online sur {stats.total}
      </span>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <span>
        <strong className="text-primary">{stats.pct}%</strong> de disponibilite
      </span>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <span>Mise a jour {formatDetailedRelativeTime(stats.lastSynced, now)}</span>
    </div>
  )
}
