import { useSyncExternalStore } from 'react'

const ONE_MINUTE = 60_000

let nowSnapshot = Date.now()
let timerId: number | null = null
const listeners = new Set<() => void>()

function refreshNow() {
  nowSnapshot = Date.now()

  listeners.forEach((listener) => {
    listener()
  })
}

function startTimer() {
  if (typeof window === 'undefined' || timerId !== null) {
    return
  }

  timerId = window.setInterval(refreshNow, ONE_MINUTE)
}

function stopTimer() {
  if (timerId === null) {
    return
  }

  window.clearInterval(timerId)
  timerId = null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  refreshNow()
  startTimer()

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0) {
      stopTimer()
    }
  }
}

function getSnapshot() {
  return nowSnapshot
}

export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
