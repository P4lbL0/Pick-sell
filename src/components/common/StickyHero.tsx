'use client'

import Image from 'next/image'

interface StickyHeroProps {
  backgroundImage: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export function StickyHero({
  backgroundImage,
  title,
  subtitle,
  align = 'center',
}: StickyHeroProps) {
  const alignClass = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  }

  return (
    <div className="relative w-full h-96 md:h-screen overflow-hidden">
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div
        className={`absolute inset-0 flex flex-col ${alignClass[align]} justify-center px-4 md:px-8 text-white`}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
