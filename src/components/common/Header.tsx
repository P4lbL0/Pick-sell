'use client'

import Link from 'next/link'
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
          <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PS</span>
          </div>
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
