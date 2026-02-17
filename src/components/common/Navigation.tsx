'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavLink {
  label: string
  href: string
  submenu?: NavLink[]
}

interface NavigationProps {
  links: NavLink[]
  universe: 'horlogerie' | 'informatique'
}

export function Navigation({ links, universe }: NavigationProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {links.map((link) => (
        <div
          key={link.href}
          className="relative group"
          onMouseEnter={() => link.submenu && setOpenSubmenu(link.href)}
          onMouseLeave={() => setOpenSubmenu(null)}
        >
          <Link
            href={link.href}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
          >
            {link.label}
            {link.submenu && <span className="ml-1">▼</span>}
          </Link>

          {/* Submenu */}
          {link.submenu && openSubmenu === link.href && (
            <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
              {link.submenu.map((sublink) => (
                <Link
                  key={sublink.href}
                  href={sublink.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  {sublink.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
