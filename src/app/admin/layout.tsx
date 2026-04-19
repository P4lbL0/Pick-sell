'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../../styles/admin.css'

const navItems = [
  {
    section: 'Gestion',
    links: [
      { href: '/admin', label: 'Tableau de bord', icon: '📊' },
      { href: '/admin/stats', label: 'Statistiques & ventes', icon: '📈' },
      { href: '/admin/products', label: 'Produits', icon: '📦' },
      { href: '/admin/colors', label: 'Coloris', icon: '🎨' },
      { href: '/admin/services', label: 'Services', icon: '🔧' },
      { href: '/admin/quotes', label: 'Devis', icon: '💰' },
    ],
  },
  {
    section: 'Contenu',
    links: [
      { href: '/admin/content', label: 'Blocs de contenu', icon: '📝' },
      { href: '/admin/hero-slides', label: 'Bannières accueil', icon: '🖼️' },
      { href: '/admin/contacts', label: 'Contacts', icon: '📞' },
    ],
  },
  {
    section: 'Utilitaires',
    links: [
      { href: '/', label: 'Voir le site', icon: '👁️', external: true },
    ],
  },
]

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <div className="admin-logo">
        <h1>PICK SELL</h1>
        <p className="admin-subtitle">Administration</p>
      </div>

      <nav className="admin-nav">
        {navItems.map((section) => (
          <div key={section.section} className="nav-section">
            <h3>{section.section}</h3>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={'external' in link && link.external ? '_blank' : undefined}
                    className={`nav-link${pathname === link.href ? ' nav-link-active' : ''}`}
                    onClick={onClose}
                  >
                    {link.icon} {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="admin-footer">
        <p>v1.1.0</p>
      </div>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="admin-container">
      {/* Sidebar desktop */}
      <aside className="admin-sidebar">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Overlay mobile */}
      {menuOpen && (
        <div className="admin-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Drawer mobile */}
      <aside className={`admin-drawer${menuOpen ? ' admin-drawer-open' : ''}`}>
        <button className="drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        <SidebarContent pathname={pathname} onClose={() => setMenuOpen(false)} />
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <span /><span /><span />
            </button>
            <h2>Pick Sell Admin</h2>
          </div>
          <div className="header-actions">
            <span className="user-badge">Admin</span>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
