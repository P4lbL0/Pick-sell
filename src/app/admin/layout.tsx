import React from 'react'
import Link from 'next/link'
import '../../styles/admin.css'

export const metadata = {
  title: 'Pick Sell - Administration',
  description: 'Interface de gestion du site Pick Sell',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>PICK SELL</h1>
          <p className="admin-subtitle">Administration</p>
        </div>

        <nav className="admin-nav">
          <div className="nav-section">
            <h3>Gestion</h3>
            <ul>
              <li>
                <Link href="/admin" className="nav-link">
                  📊 Tableau de bord
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="nav-link">
                  📦 Produits
                </Link>
              </li>
              <li>
                <Link href="/admin/services" className="nav-link">
                  🔧 Services
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3>Contenu</h3>
            <ul>
              <li>
                <Link href="/admin/content" className="nav-link">
                  📝 Blocs de contenu
                </Link>
              </li>
              <li>
                <Link href="/admin/hero-slides" className="nav-link">
                  🖼️ Bannières accueil
                </Link>
              </li>
              <li>
                <Link href="/admin/contacts" className="nav-link">
                  📞 Contacts
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3>Utilitaires</h3>
            <ul>
              <li>
                <Link href="/" target="_blank" className="nav-link">
                  👁️ Voir le site
                </Link>
              </li>
              <li>
                <a href="/admin/settings" className="nav-link">
                  ⚙️ Paramètres
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="admin-footer">
          <p>v1.0.0</p>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>Pick Sell Administration</h2>
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
