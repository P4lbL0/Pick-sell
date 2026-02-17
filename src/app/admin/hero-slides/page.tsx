'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { HeroSlide } from '@/lib/types'
import HeroSlideForm from '@/components/admin/HeroSlideForm'
import HeroSlideTable from '@/components/admin/HeroSlideTable'

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)

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
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id)
      if (error) throw error
      setSlides(slides.filter(s => s.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
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
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
