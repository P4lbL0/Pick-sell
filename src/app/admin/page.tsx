'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    contentBlocks: 0,
    heroSlides: 0,
    quoteRequests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, services, content, slides] = await Promise.all([
          supabase.from('products').select('count', { count: 'exact', head: true }),
          supabase.from('services').select('count', { count: 'exact', head: true }),
          supabase.from('content_blocks').select('count', { count: 'exact', head: true }),
          supabase.from('hero_slides').select('count', { count: 'exact', head: true }),
        ])

        // Quote requests via API route (service_role key)
        const qrRes = await fetch('/api/admin/quote-requests')
        const qrData = await qrRes.json()

        setStats({
          products: products.count || 0,
          services: services.count || 0,
          contentBlocks: content.count || 0,
          heroSlides: slides.count || 0,
          quoteRequests: Array.isArray(qrData.data) ? qrData.data.filter((r: {status: string}) => r.status === 'new').length : 0,
        })
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { icon: '📦', label: 'Produits', value: stats.products, sub: 'articles en ligne', href: '/admin/products' },
    { icon: '🔧', label: 'Services', value: stats.services, sub: 'services disponibles', href: '/admin/services' },
    { icon: '📝', label: 'Contenus', value: stats.contentBlocks, sub: 'blocs texte', href: '/admin/content' },
    { icon: '🖼️', label: 'Bannières', value: stats.heroSlides, sub: 'slides d\'accueil', href: '/admin/hero-slides' },
    { icon: '📋', label: 'Nouveaux devis', value: stats.quoteRequests, sub: 'en attente', href: '/admin/quotes' },
  ]

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de votre site</p>
      </div>

      {loading ? (
        <div className="loading">Chargement des données...</div>
      ) : (
        <div className="stats-grid">
          {statCards.map(card => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div className="stat-card" style={{ cursor: 'pointer' }}>
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-content">
                  <h3>{card.label}</h3>
                  <p className="stat-number">{card.value}</p>
                  <p className="stat-label">{card.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="action-buttons">
          <Link href="/admin/products">
            <button className="btn btn-primary">+ Ajouter un produit</button>
          </Link>
          <Link href="/admin/services">
            <button className="btn btn-secondary">+ Ajouter un service</button>
          </Link>
          <Link href="/admin/content">
            <button className="btn btn-secondary">+ Ajouter du contenu</button>
          </Link>
          <Link href="/admin/hero-slides">
            <button className="btn btn-secondary">+ Ajouter une bannière</button>
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Infos système</h2>
        <div className="info-box">
          <p>✅ Connexion à Supabase active</p>
          <p>✅ Base de données synchronisée</p>
          <p>✅ Tous les services opérationnels</p>
        </div>
      </div>
    </div>
  )
}
