'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'

type Direction = 'up' | 'left' | 'right'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  style?: CSSProperties
  as?: keyof JSX.IntrinsicElements
}

const directionClass: Record<Direction, string> = {
  up: 'scroll-reveal',
  left: 'scroll-reveal-left',
  right: 'scroll-reveal-right',
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => el.classList.add('revealed'), delay)
          observer.unobserve(el)
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`${directionClass[direction]} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
