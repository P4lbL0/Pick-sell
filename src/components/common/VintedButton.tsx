'use client'

import { track } from '@/lib/track'

interface Props {
  href: string
  productId: string
  universe: 'horlogerie' | 'informatique'
  title: string
}

export function VintedButton({ href, productId, universe, title }: Props) {
  const handleClick = () => {
    track({
      event_type: 'click_vinted',
      product_id: productId,
      universe,
      metadata: { title, href },
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="w-full py-4 px-6 rounded-xl font-bold text-lg transition bg-teal-600 text-white hover:bg-teal-500 text-center flex items-center justify-center gap-3 shadow-lg shadow-teal-900/20"
    >
      <span>Acheter</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}
