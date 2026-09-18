import React from 'react'

const PATHS = {
  watch: 'M12 8v4l2 2M9 3h6l1 4H8zM9 21h6l1-4H8zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  wrench: 'M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5L14.7 6.3zM3 21l6-6',
  palette: 'M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.8.7-1.4 1.5-1.4H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8zM7.5 11.5h.01M10.5 7.5h.01M15.5 7.5h.01',
  laptop: 'M4 5h16v11H4zM2 19h20',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  recycle: 'M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L5 13M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7L19 13M14 16l-3 3 3 3M8.3 13.5 5 13l-.9 3.2M9.6 6.3l1.8-3.1a1.8 1.8 0 0 1 3.1 0L18.7 10M15.7 10.3 18.7 10l.6-3.3',
} as const

export type IconName = keyof typeof PATHS

/** Icônes du site public (trait, couleur héritée du texte). */
export function Icon({ name, className = 'w-5 h-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
