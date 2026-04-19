'use client'

import Link from 'next/link'
import { track } from '@/lib/track'
import type { ReactNode } from 'react'

interface Props {
  href: string
  universe: 'horlogerie' | 'informatique'
  serviceType: 'repair' | 'custom' | 'buyback'
  className?: string
  productId?: string
  children: ReactNode
}

export function ServiceLink({ href, universe, serviceType, className, productId, children }: Props) {
  const handleClick = () => {
    track({
      event_type: 'click_service',
      universe,
      product_id: productId,
      metadata: { service_type: serviceType, href },
    })
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
