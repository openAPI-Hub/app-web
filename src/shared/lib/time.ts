function parseElapsedMs(dateValue: string | null | undefined, nowMs: number): number | null {
  if (!dateValue) {
    return null
  }

  const timestamp = new Date(dateValue).getTime()

  if (!Number.isFinite(timestamp)) {
    return null
  }

  return Math.max(0, nowMs - timestamp)
}

export function formatCompactRelativeTime(
  dateValue: string | null | undefined,
  nowMs: number,
  emptyLabel = '...',
) {
  const elapsedMs = parseElapsedMs(dateValue, nowMs)

  if (elapsedMs === null) {
    return emptyLabel
  }

  const hours = Math.floor(elapsedMs / 3_600_000)

  if (hours < 1) {
    return '< 1h'
  }

  if (hours < 24) {
    return `${hours}h`
  }

  return `${Math.floor(hours / 24)}j`
}

export function formatDetailedRelativeTime(
  dateValue: string | null | undefined,
  nowMs: number,
  emptyLabel = '...',
) {
  const elapsedMs = parseElapsedMs(dateValue, nowMs)

  if (elapsedMs === null) {
    return emptyLabel
  }

  const minutes = Math.floor(elapsedMs / 60_000)

  if (minutes < 60) {
    return "il y a moins d'1h"
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `il y a ${hours}h`
  }

  return `il y a ${Math.floor(hours / 24)}j`
}
