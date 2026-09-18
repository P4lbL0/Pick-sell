'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { AdminIcon, type AdminIconName } from '@/components/admin/AdminIcon'
import '../../styles/admin.css'

const navItems: { section: string; links: { href: string; label: string; icon: AdminIconName; external?: boolean }[] }[] = [
  {
    section: 'Gestion',
    links: [
      { href: '/admin', label: 'Tableau de bord', icon: 'dashboard' },
      { href: '/admin/stats', label: 'Statistiques & ventes', icon: 'chart' },
      { href: '/admin/products', label: 'Produits', icon: 'box' },
      { href: '/admin/colors', label: 'Coloris', icon: 'palette' },
      { href: '/admin/services', label: 'Services', icon: 'wrench' },
      { href: '/admin/quotes', label: 'Devis', icon: 'receipt' },
    ],
  },
  {
    section: 'Contenu',
    links: [
      { href: '/admin/content', label: 'Blocs de contenu', icon: 'text' },
      { href: '/admin/hero-slides', label: 'Bannières accueil', icon: 'image' },
      { href: '/admin/contacts', label: 'Contacts', icon: 'phone' },
    ],
  },
  {
    section: 'Utilitaires',
    links: [
      { href: '/', label: 'Voir le site', icon: 'eye', external: true },
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
                    target={link.external ? '_blank' : undefined}
                    className={`nav-link${pathname === link.href ? ' nav-link-active' : ''}`}
                    onClick={onClose}
                  >
                    <AdminIcon name={link.icon} />{link.label}
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
  const router = useRouter()

  // La page de connexion s'affiche sans la barre latérale
  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = async () => {
    await getSupabaseBrowser().auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

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
        <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
          <AdminIcon name="close" className="nav-icon" />
        </button>
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
            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
