'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { HeroSlide } from '@/lib/types'
import { revalidateHeroSlides } from '@/app/admin/actions'
import HeroSlideForm from '@/components/admin/HeroSlideForm'
import HeroSlideTable from '@/components/admin/HeroSlideTable'

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des bannières d'accueil</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Fermer' : '+ Nouvelle bannière'}
        </button>
      </div>

      {deleteError && (
        <div className="error-message" style={{ marginBottom: 16 }}>
          {deleteError}
          <button onClick={() => setDeleteError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Confirmation suppression inline (pas de window.confirm) */}
      {confirmDeleteId && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#856404' }}>⚠️ Supprimer cette bannière ? Cette action est irréversible.</span>
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
          onClose={handleFormClose}
        />
      )}

      {loading ? (
        <div className="loading">Chargement des bannières...</div>
      ) : (
        <HeroSlideTable
          slides={slides}
          onEdit={handleEdit}
          onDelete={(id) => setConfirmDeleteId(id)}
        />
      )}
    </div>
  )
}
