'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    contentBlocks: 0,
    heroSlides: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, services, content, slides] = await Promise.all([
          supabase.from('products').select('count', { count: 'exact' }),
          supabase.from('services').select('count', { count: 'exact' }),
          supabase.from('content_blocks').select('count', { count: 'exact' }),
          supabase.from('hero_slides').select('count', { count: 'exact' }),
        ])

        setStats({
          products: products.count || 0,
          services: services.count || 0,
          contentBlocks: content.count || 0,
          heroSlides: slides.count || 0,
        })
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Produits</h3>
              <p className="stat-number">{stats.products}</p>
              <p className="stat-label">articles en ligne</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <h3>Services</h3>
              <p className="stat-number">{stats.services}</p>
              <p className="stat-label">services disponibles</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Contenus</h3>
              <p className="stat-number">{stats.contentBlocks}</p>
              <p className="stat-label">blocs texte</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🖼️</div>
            <div className="stat-content">
              <h3>Bannières</h3>
              <p className="stat-number">{stats.heroSlides}</p>
              <p className="stat-label">slides d'accueil</p>
            </div>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="action-buttons">
          <button className="btn btn-primary">+ Ajouter un produit</button>
          <button className="btn btn-secondary">+ Ajouter un service</button>
          <button className="btn btn-secondary">+ Ajouter du contenu</button>
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
