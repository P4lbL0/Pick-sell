// Petits schémas des variantes (trait, couleur héritée du texte) : on reconnaît une lunette,
// un bracelet ou des aiguilles sans devoir lire le nom.

import type { ReactNode } from 'react'

const TRAIT = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Cadre({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 shrink-0" aria-hidden="true">
      {children}
    </svg>
  )
}

function rangs(colonnes: { x: number; l: number }[], decale: (i: number) => number, arrondi: number) {
  return colonnes.flatMap((c, i) =>
    [0, 1, 2, 3].map((k) => (
      <rect key={`${i}-${k}`} x={c.x} y={4 + k * 8.5 + decale(i)} width={c.l} height={7} rx={arrondi} {...TRAIT} />
    )),
  )
}

const PICTOS: Record<string, () => ReactNode> = {
  'lunette:cannelee': () => (
    <>
      <circle cx="20" cy="20" r="16" {...TRAIT} />
      <circle cx="20" cy="20" r="11" {...TRAIT} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        return <line key={i} x1={20 + 11.5 * Math.cos(a)} y1={20 + 11.5 * Math.sin(a)} x2={20 + 15.5 * Math.cos(a)} y2={20 + 15.5 * Math.sin(a)} {...TRAIT} strokeWidth={1} />
      })}
    </>
  ),
  'lunette:lisse': () => (
    <>
      <circle cx="20" cy="20" r="16" {...TRAIT} />
      <circle cx="20" cy="20" r="11" {...TRAIT} />
      <path d="M8.5 13a13 13 0 0 1 8-6" {...TRAIT} strokeWidth={1} />
    </>
  ),
  'bracelet:president': () => <>{rangs([{ x: 6, l: 8 }, { x: 16, l: 8 }, { x: 26, l: 8 }], (i) => (i === 1 ? -4 : 0), 3.5)}</>,
  'bracelet:oyster': () => <>{rangs([{ x: 5, l: 10 }, { x: 16.5, l: 7 }, { x: 25, l: 10 }], () => 0, 1)}</>,
  'bracelet:jubile': () => (
    <>{rangs([{ x: 4, l: 8 }, { x: 13.5, l: 3.5 }, { x: 18.3, l: 3.5 }, { x: 23, l: 3.5 }, { x: 28, l: 8 }], (i) => (i === 2 ? -4 : 0), 1.5)}</>
  ),
  'aiguilles:baton': () => (
    <>
      <path d="M20 20 11 13M20 20 30 9" {...TRAIT} strokeWidth={2.4} />
      <circle cx="20" cy="20" r="1.8" fill="currentColor" />
    </>
  ),
  'aiguilles:mercedes': () => (
    <>
      <path d="M20 20 14.5 15.5M11 12.5 8.5 10.5M20 20 31 8" {...TRAIT} strokeWidth={2} />
      <circle cx="12.7" cy="14" r="2.6" {...TRAIT} />
      <path d="M12.7 14v-2.6M12.7 14l2.2 1.4M12.7 14l-2.2 1.4" {...TRAIT} strokeWidth={1} />
      <circle cx="20" cy="20" r="1.8" fill="currentColor" />
    </>
  ),
  'aiguilles:glaive': () => (
    <>
      <path d="M20 20l-4-2.6 1-1.6-6-6.3 7.7 4.6 1.3-1.3z" {...TRAIT} strokeWidth={1.3} />
      <path d="M20 20l3.4-3.6-.9-1.3 8.6-7.4-6 9.1 1.6 1z" {...TRAIT} strokeWidth={1.3} />
      <circle cx="20" cy="20" r="1.8" fill="currentColor" />
    </>
  ),
  'chiffres:arabes': () => <text x="20" y="27" textAnchor="middle" fontSize="20" fill="currentColor" fontWeight="700">٣</text>,
  'chiffres:index': () => (
    <>
      <rect x="17.5" y="7" width="5" height="14" rx="1" {...TRAIT} />
      <line x1="20" y1="10" x2="20" y2="18" {...TRAIT} strokeWidth={1} />
    </>
  ),
  'chiffres:romains': () => <text x="20" y="26" textAnchor="middle" fontSize="15" fill="currentColor" fontFamily="Georgia, serif" fontWeight="700">III</text>,
  'date:aucune': () => <circle cx="20" cy="20" r="15" {...TRAIT} />,
  'date:guichet': () => (
    <>
      <circle cx="20" cy="20" r="15" {...TRAIT} />
      <rect x="25" y="17" width="6.5" height="6" rx="0.8" {...TRAIT} />
    </>
  ),
  'date:loupe': () => (
    <>
      <circle cx="20" cy="20" r="15" {...TRAIT} />
      <rect x="25" y="17" width="6.5" height="6" rx="0.8" {...TRAIT} />
      <rect x="23" y="15" width="10.5" height="10" rx="2.5" {...TRAIT} strokeWidth={1} />
    </>
  ),
  'fond:transparent': () => (
    <>
      <circle cx="20" cy="20" r="16" {...TRAIT} />
      <path d="M8.5 22a11.7 11.7 0 0 0 23 0z" {...TRAIT} />
      <circle cx="20" cy="20" r="2.4" {...TRAIT} />
      <circle cx="14" cy="13" r="1" fill="currentColor" />
      <circle cx="26" cy="12" r="1" fill="currentColor" />
    </>
  ),
  'fond:plein': () => (
    <>
      <circle cx="20" cy="20" r="16" {...TRAIT} />
      <circle cx="20" cy="20" r="11" {...TRAIT} />
      <circle cx="20" cy="20" r="6" {...TRAIT} strokeWidth={1} />
    </>
  ),
}

export function Picto({ reglage, option }: { reglage: string; option: string }) {
  const dessin = PICTOS[`${reglage}:${option}`]
  if (!dessin) return null
  return <Cadre>{dessin()}</Cadre>
}
