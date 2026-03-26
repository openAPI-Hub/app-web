import { useEffect, useEffectEvent, useState } from 'react'

import type { ApiEntry } from '../types'
import { useNow } from '../../../shared/hooks/useNow'
import { formatDetailedRelativeTime } from '../../../shared/lib/time'

interface ApiModalProps {
  api: ApiEntry
  onClose(): void
}

const AUTH_INFO = {
  none: {
    label: 'Aucune authentification',
    description: 'Acces libre, aucune cle requise.',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  apiKey: {
    label: 'Cle API requise',
    description: "Une inscription peut etre necessaire pour obtenir l'acces.",
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  OAuth: {
    label: 'OAuth 2.0',
    description: 'Authentification delegatee via un fournisseur externe.',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  unknown: {
    label: 'Authentification inconnue',
    description: "Le fournisseur ne precise pas clairement la methode d'acces.",
    className:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  },
} as const

export function ApiModal({ api, onClose }: ApiModalProps) {
  const [copied, setCopied] = useState(false)
  const now = useNow()
  const handleClose = useEffectEvent(onClose)
  const authInfo = AUTH_INFO[api.auth_type] ?? AUTH_INFO.unknown

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])

  async function copyUrl() {
    await navigator.clipboard.writeText(api.url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="animate-modal relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-surface-dark-alt"
      >
        <button
          type="button"
          aria-label="Fermer la fiche API"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="border-b border-slate-100 p-6 pr-16 dark:border-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                {api.category}
              </span>
              <h2 id="api-modal-title" className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {api.name}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {api.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                api.status === 'online' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${api.status === 'online' ? 'bg-accent' : 'bg-danger'}`} />
              {api.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className={`rounded-3xl border p-4 ${authInfo.className}`}>
            <div className="text-sm font-semibold">{authInfo.label}</div>
            <p className="mt-1 text-sm opacity-90">{authInfo.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Protocole
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {api.https ? 'HTTPS' : 'HTTP'}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                CORS
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {api.cors ? 'Disponible' : 'Indisponible'}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Derniere verification
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {formatDetailedRelativeTime(api.last_verified_at, now, 'Jamais')}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Source
            </div>
            <a
              href={api.source_ref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate text-sm font-medium text-primary hover:underline"
            >
              {api.source_ref}
            </a>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Voir la documentation
            </a>
            <button
              type="button"
              aria-label="Copier l'URL"
              onClick={() => {
                void copyUrl()
              }}
              className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 px-5 py-3 font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
            >
              {copied ? 'Lien copie' : 'Copier l URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
