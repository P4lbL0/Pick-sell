export type Platform = 'email' | 'whatsapp' | 'tiktok' | 'instagram' | 'vinted'

export const PLATFORM_LABELS: Record<Platform, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  vinted: 'Vinted',
}

/** Normalise une ligne de la table contacts (plateforme en minuscules, URL sans espaces). */
export function normalizeContact<T extends { platform: string; url?: string | null }>(c: T) {
  return { ...c, platform: String(c.platform).trim().toLowerCase(), url: String(c.url ?? '').trim() }
}

export function isPlatform(p: string): p is Platform {
  return p in PLATFORM_LABELS
}

/** Libellé lisible : email sans mailto, numéro WhatsApp, @pseudo pour les réseaux. */
export function contactDisplay(platform: string, url: string): string {
  if (platform === 'email') return url.replace(/^mailto:/, '')
  if (platform === 'whatsapp') return url.replace(/^https:\/\/wa\.me\//, '+').replace(/\?.*$/, '')
  const handle = url.match(/(?:instagram\.com|tiktok\.com)\/(@?[\w.]+)/)
  if (handle) return handle[1].startsWith('@') ? handle[1] : '@' + handle[1]
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/[/?].*$/, '')
}

export function PlatformIcon({ platform, className = 'w-5 h-5' }: { platform: Platform; className?: string }) {
  switch (platform) {
    case 'email':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
          <path d="M9 10.5c.5 1.5 2 3 3.5 3.5l1.2-1.2 2 1-.4 1.6c-3.4.2-7-3.4-6.8-6.8l1.6-.4 1 2z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    case 'vinted':
      return <span className="font-bold text-sm">V</span>
  }
}
