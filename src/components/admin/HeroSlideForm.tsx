'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { HeroSlide } from '@/lib/types'
import { revalidateHeroSlides } from '@/app/admin/actions'

interface HeroSlideFormProps {
  slide?: HeroSlide | null
  onClose: () => void
}

export default function HeroSlideForm({ slide, onClose }: HeroSlideFormProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image_url: slide?.image_url || '',
    video_url: slide?.video_url || '',
    universe_type: slide?.universe_type || 'global',
    cta_text: slide?.cta_text || '',
    cta_link: slide?.cta_link || '',
    order_index: slide?.order_index || 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(slide?.image_url || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order_index' ? parseInt(value) : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      setFormData(prev => ({
        ...prev,
        image_url: data.url,
      }))
      setPreview(data.url)
    } catch (err: any) {
      setError(`Erreur upload: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        image_url: formData.image_url,
        video_url: formData.video_url,
        universe_type: formData.universe_type,
        order_index: formData.order_index,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
      }

      if (slide?.id) {
        const { error: updateError } = await supabase
          .from('hero_slides')
          .update(payload)
          .eq('id', slide.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('hero_slides')
          .insert([payload])
        if (insertError) throw insertError
      }

      // Revalidate the banner pages
      await revalidateHeroSlides(formData.universe_type)

      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{slide ? 'Éditer la bannière' : 'Ajouter une bannière'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Titre de la bannière"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Sous-titre</label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Sous-titre optionnel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_file">Image de la bannière *</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="image_file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ marginBottom: '1rem' }}
            />
            {uploading && <p>Upload en cours...</p>}
            {preview && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Aperçu:</p>
                <img 
                  src={preview} 
                  alt="Aperçu" 
                  style={{ 
                    maxWidth: '300px', 
                    maxHeight: '200px', 
                    borderRadius: '0.5rem',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="video_url">URL de la vidéo</label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=xxxxx"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="universe_type">Univers *</label>
            <select
              id="universe_type"
              name="universe_type"
              value={formData.universe_type}
              onChange={handleChange}
              required
            >
              <option value="global">Global</option>
              <option value="horlogerie">Horlogerie</option>
              <option value="informatique">Informatique</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="order_index">Ordre d'affichage *</label>
            <input
              type="number"
              id="order_index"
              name="order_index"
              value={formData.order_index}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Call-to-action</label>
          <input
            type="text"
            name="cta_text"
            placeholder="Texte du bouton"
            value={formData.cta_text}
            onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Lien du CTA</label>
          <input
            type="url"
            name="cta_link"
            placeholder="https://..."
            value={formData.cta_link}
            onChange={(e) => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
