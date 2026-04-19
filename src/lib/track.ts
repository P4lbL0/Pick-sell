'use client'

export type TrackEvent =
  | 'view_page'
  | 'view_product'
  | 'click_vinted'
  | 'click_service'
  | 'click_cta'

interface TrackPayload {
  event_type: TrackEvent
  product_id?: string | null
  universe?: 'horlogerie' | 'informatique' | 'global'
  path?: string
  metadata?: Record<string, unknown>
}

const SESSION_KEY = 'ps_session_id'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36))
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export function track(payload: TrackPayload): void {
  if (typeof window === 'undefined') return
  const body = JSON.stringify({
    ...payload,
    path: payload.path ?? window.location.pathname,
    session_id: getSessionId(),
  })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/track', blob)
      return
    }
  } catch { /* fallback */ }

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => { /* silent */ })
}
