'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { HeroSlide } from '@/lib/types'
import { revalidateHeroSlides } from '@/app/admin/actions'
import HeroSlideForm from '@/components/admin/HeroSlideForm'
import HeroSlideTable from '@/components/admin/HeroSlideTable'

type TabType = 'horlogerie' | 'informatique' | 'global'

const TABS: { key: TabType; label: string; color: string; bg: string }[] = [
  { key: 'horlogerie', label: 'Horlogerie', color: '#92400e', bg: '#fef3c7' },
  { key: 'informatique', label: 'Informatique', color: '#1e3a5f', bg: '#dbeafe' },
  { key: 'global', label: 'Les deux thèmes', color: '#374151', bg: '#f3f4f6' },
]

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('horlogerie')
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setSlides(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des slides:', JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteError('')
    try {
      const slide = slides.find(s => s.id === id)
      const res = await fetch(`/api/admin/hero-slides?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur suppression')
      setSlides(slides.filter(s => s.id !== id))
      if (slide) await revalidateHeroSlides(slide.universe_type)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erreur inconnue'
      setDeleteError(`Erreur : ${msg}`)
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingSlide(null)
    fetchSlides()
  }

  const handleAddNew = () => {
    setEditingSlide(null)
    setShowForm(true)
  }

  const filteredSlides = slides.filter(s => s.universe_type === activeTab)
  const activeTabInfo = TABS.find(t => t.key === activeTab)!

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des bannières d'accueil</h1>
      </div>

      {/* Onglets par thème */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid #e5e7eb', paddingBottom: 0 }}>
        {TABS.map(tab => {
          const count = slides.filter(s => s.universe_type === tab.key).length
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowForm(false); setEditingSlide(null) }}
              style={{
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                background: isActive ? tab.bg : 'transparent',
                color: isActive ? tab.color : '#6b7280',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              <span style={{
                marginLeft: 8,
                background: isActive ? tab.color : '#d1d5db',
                color: 'white',
                borderRadius: 12,
                padding: '1px 8px',
                fontSize: '0.75rem',
              }}>
                {count}
              </span>
            </button>
          )
        })}

        <button
          className="btn btn-primary"
          onClick={handleAddNew}
          style={{ marginLeft: 'auto', alignSelf: 'center', marginBottom: 4 }}
        >
          + Nouvelle bannière
        </button>
      </div>

      {/* Info thème actif */}
      <div style={{
        background: activeTabInfo.bg,
        border: `1px solid ${activeTabInfo.color}30`,
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: '0.85rem',
        color: activeTabInfo.color,
        fontWeight: 600,
      }}>
        {activeTab === 'horlogerie' && 'Ces bannières s\'affichent uniquement sur la page Horlogerie.'}
        {activeTab === 'informatique' && 'Ces bannières s\'affichent uniquement sur la page Informatique.'}
        {activeTab === 'global' && 'Attention : ces bannières s\'affichent sur les deux pages (Horlogerie ET Informatique).'}
      </div>

      {deleteError && (
        <div className="error-message" style={{ marginBottom: 16 }}>
          {deleteError}
          <button onClick={() => setDeleteError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {confirmDeleteId && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#856404' }}>Supprimer cette bannière ? Cette action est irréversible.</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ background: '#dc2626', padding: '8px 16px', fontSize: 13 }}
              onClick={() => { handleDelete(confirmDeleteId); setConfirmDeleteId(null) }}>
              Oui, supprimer
            </button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => setConfirmDeleteId(null)}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <HeroSlideForm
          slide={editingSlide}
          defaultUniverse={activeTab}
          onClose={handleFormClose}
        />
      )}

      {loading ? (
        <div className="loading">Chargement des bannières...</div>
      ) : filteredSlides.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          Aucune bannière pour ce thème.
          <br />
          <button
            className="btn btn-primary"
            onClick={handleAddNew}
            style={{ marginTop: 16 }}
          >
            + Ajouter une bannière {activeTab === 'global' ? 'globale' : `pour ${activeTab}`}
          </button>
        </div>
      ) : (
        <HeroSlideTable
          slides={filteredSlides}
          onEdit={handleEdit}
          onDelete={(id) => setConfirmDeleteId(id)}
        />
      )}
    </div>
  )
}
