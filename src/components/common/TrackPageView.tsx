'use client'

import { useEffect } from 'react'
import { track } from '@/lib/track'

interface Props {
  universe?: 'horlogerie' | 'informatique' | 'global'
  productId?: string
  event?: 'view_page' | 'view_product'
}

export function TrackPageView({ universe = 'global', productId, event }: Props) {
  useEffect(() => {
    const evt = event ?? (productId ? 'view_product' : 'view_page')
    track({
      event_type: evt,
      universe,
      product_id: productId,
    })
  }, [universe, productId, event])

  return null
}
