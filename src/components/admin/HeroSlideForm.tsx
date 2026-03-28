'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { HeroSlide } from '@/lib/types'
import { revalidateHeroSlides } from '@/app/admin/actions'

interface HeroSlideFormProps {
  slide?: HeroSlide | null
  onClose: () => void
  defaultUniverse?: 'horlogerie' | 'informatique' | 'global'
}

export default function HeroSlideForm({ slide, onClose, defaultUniverse = 'horlogerie' }: HeroSlideFormProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image_url: slide?.image_url || '',
    video_url: slide?.video_url || '',
    universe_type: slide?.universe_type || defaultUniverse,
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

      await revalidateHeroSlides(formData.universe_type)

      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const universeColors: Record<string, string> = {
    horlogerie: '#92400e',
    informatique: '#1e3a5f',
    global: '#374151',
  }
  const universeBg: Record<string, string> = {
    horlogerie: '#fef3c7',
    informatique: '#dbeafe',
    global: '#f3f4f6',
  }
  const universeLabel: Record<string, string> = {
    horlogerie: 'Horlogerie uniquement',
    informatique: 'Informatique uniquement',
    global: 'Les deux thèmes (global)',
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{slide ? 'Éditer la bannière' : 'Ajouter une bannière'}</h2>

        {error && <div className="error-message">{error}</div>}

        {/* Choix du thème EN PREMIER — c'est le plus important */}
        <div className="form-group">
          <label htmlFor="universe_type" style={{ fontWeight: 700, fontSize: '1rem' }}>
            Thème d'affichage *
          </label>
          <div style={{
            background: universeBg[formData.universe_type],
            border: `2px solid ${universeColors[formData.universe_type]}`,
            borderRadius: 10,
            padding: '0.75rem 1rem',
            marginBottom: '0.25rem',
          }}>
            <select
              id="universe_type"
              name="universe_type"
              value={formData.universe_type}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                fontWeight: 700,
                fontSize: '1rem',
                color: universeColors[formData.universe_type],
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="horlogerie">Horlogerie uniquement</option>
              <option value="informatique">Informatique uniquement</option>
              <option value="global">Les deux thèmes (global)</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: universeColors[formData.universe_type], margin: '4px 0 0', opacity: 0.8 }}>
              {formData.universe_type === 'global'
                ? 'Attention : cette bannière s\'affichera sur les deux pages (horlogerie ET informatique).'
                : `Cette bannière s'affichera uniquement sur la page ${universeLabel[formData.universe_type].split(' ')[0]}.`}
            </p>
          </div>
        </div>

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
          <label>Image de fond de la bannière</label>
          <div style={{ background: '#f0f4ff', border: '2px dashed #667eea', borderRadius: 10, padding: '1rem', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.75rem', fontWeight: 600 }}>
              Cette image s'affiche en grand fond sur la bannière principale du site.
            </p>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: uploading ? '#a0aec0' : 'linear-gradient(135deg,#667eea,#764ba2)',
              color: 'white', borderRadius: 8, padding: '14px 20px',
              fontWeight: 700, fontSize: '1rem', cursor: uploading ? 'not-allowed' : 'pointer',
              minHeight: 52, width: '100%', boxSizing: 'border-box' as const,
            }}>
              {uploading ? 'Upload en cours...' : 'Choisir une image'}
              <input type="file" id="image_file" accept="image/*"
                onChange={handleImageUpload} disabled={uploading}
                style={{ display: 'none' }} />
            </label>
            {preview && (
              <div style={{ marginTop: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700, marginBottom: 6 }}>Image chargée — aperçu :</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Aperçu"
                  style={{ width: '100%', maxHeight: 140, borderRadius: 8, objectFit: 'cover', border: '2px solid #667eea' }} />
                <button type="button" onClick={() => { setPreview(''); setFormData(p => ({ ...p, image_url: '' })) }}
                  style={{ fontSize: '0.75rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 6 }}>
                  Supprimer l'image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="video_url">Vidéo de fond (optionnel)</label>
          <div style={{ background: '#fff7ed', border: '2px dashed #f59e0b', borderRadius: 10, padding: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: '0.75rem', fontWeight: 600 }}>
              La vidéo remplace l'image en fond de la bannière. Colle un lien direct vers un fichier .mp4.
            </p>
            <input type="url" id="video_url" name="video_url"
              value={formData.video_url} onChange={handleChange}
              placeholder="https://exemple.com/video.mp4"
              style={{ width: '100%', boxSizing: 'border-box' as const }} />
          </div>
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
