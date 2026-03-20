'use client'

import Link from 'next/link'
import Image from 'next/image'
import { UNIVERSES } from '@/utils/constants'
import type { ReactNode } from 'react'

interface HeaderProps {
  universe: 'horlogerie' | 'informatique'
  children?: ReactNode
}

export function Header({ universe, children }: HeaderProps) {
  const universeInfo = UNIVERSES[universe]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Home Logo */}
        <Link
          href={`/${universe}`}
          className="flex items-center space-x-2 hover:opacity-70 transition"
        >
          <Image
            src="/logo.jpg"
            alt="Pick Sell"
            width={36}
            height={36}
            className="rounded-lg object-cover"
          />
          <span className="font-semibold text-gray-900 hidden sm:inline">
            {universeInfo.label}
          </span>
        </Link>

        {/* Navigation will be injected here by child components */}
        {children}

        {/* Back to global home */}
        <Link
          href="/"
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition"
        >
          Pick Sell
        </Link>
      </div>
    </header>
  )
}
