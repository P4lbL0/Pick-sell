'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavLink {
  label: string
  href: string
  submenu?: NavLink[]
}

interface NavigationProps {
  links: NavLink[]
  universe: 'horlogerie' | 'informatique'
}

const accent = {
  horlogerie: 'text-amber-700 bg-amber-50',
  informatique: 'text-blue-700 bg-blue-50',
}

export function Navigation({ links, universe }: NavigationProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      {/* Desktop */}
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
              {link.submenu && <span className="ml-1">▾</span>}
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

      {/* Mobile : bouton */}
      <button
        type="button"
        onClick={() => setMobileOpen(o => !o)}
        className="md:hidden order-last ml-2 -mr-2 w-11 h-11 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition"
        aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={mobileOpen}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Mobile : panneau sous le header */}
      {mobileOpen && (
        <nav className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg">
          <ul className="max-w-7xl mx-auto px-4 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-3 rounded-lg font-medium transition ${pathname === link.href ? accent[universe] : 'text-gray-800 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <ul className="ml-3 border-l border-gray-100 pl-2 mb-1">
                    {link.submenu.map((sublink) => (
                      <li key={sublink.href}>
                        <Link
                          href={sublink.href}
                          className={`block px-3 py-2.5 rounded-lg text-sm transition ${pathname === sublink.href ? accent[universe] : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {sublink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
