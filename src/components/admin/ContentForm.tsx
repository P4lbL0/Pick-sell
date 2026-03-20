'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ContentBlock } from '@/lib/types'

interface ContentFormProps {
  content?: ContentBlock | null
  onClose: () => void
}

export default function ContentForm({ content, onClose }: ContentFormProps) {
  const [formData, setFormData] = useState({
    key: content?.key || '',
    title: content?.title || '',
    content: content?.content || '',
    universe: content?.universe || 'global',
    bg_image_url: content?.bg_image_url || '',
    bg_video_url: content?.bg_video_url || '',
    bg_overlay_opacity: content?.bg_overlay_opacity ?? 0.55,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadBg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFormData(prev => ({ ...prev, bg_image_url: data.url }))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur upload')
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
        key: formData.key,
        title: formData.title,
        content: formData.content,
        universe: formData.universe,
        bg_image_url: formData.bg_image_url || null,
        bg_video_url: formData.bg_video_url || null,
        bg_overlay_opacity: Number(formData.bg_overlay_opacity),
        updated_at: new Date().toISOString(),
      }

      if (content?.id) {
        const { error: updateError } = await supabase
          .from('content_blocks').update(payload).eq('id', content.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('content_blocks').insert([{ ...payload, created_at: new Date().toISOString() }])
        if (insertError) throw insertError
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{content ? 'Éditer le contenu' : 'Ajouter un contenu'}</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="key">Clé unique *</label>
          <input type="text" id="key" name="key" value={formData.key} onChange={handleChange}
            required placeholder="Ex: concept-horlogerie" disabled={!!content} />
          <small style={{ color: '#888' }}>La clé est utilisée pour identifier le bloc dans les pages</small>
        </div>

        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input type="text" id="title" name="title" value={formData.title}
            onChange={handleChange} placeholder="Titre affiché (optionnel)" />
        </div>

        <div className="form-group">
          <label htmlFor="universe">Univers</label>
          <select id="universe" name="universe" value={formData.universe} onChange={handleChange}>
            <option value="global">Global</option>
            <option value="horlogerie">Horlogerie</option>
            <option value="informatique">Informatique</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenu * (HTML accepté)</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange}
            required rows={8} placeholder="<p>Votre texte ici...</p>" />
        </div>

        {/* ── FOND PERSONNALISÉ ── */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>
            🖼️ Image / Vidéo de fond
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
            Optionnel — si défini, le fond du bloc sera l'image ou la vidéo choisie avec un overlay sombre.
          </p>

          <div className="form-group">
            <label>Image de fond</label>
            {formData.bg_image_url && (
              <div style={{ marginBottom: '0.5rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.bg_image_url} alt="bg preview"
                  style={{ height: 80, borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
              </div>
            )}
            <input type="text" name="bg_image_url" value={formData.bg_image_url}
              onChange={handleChange} placeholder="URL de l'image de fond" />
            <div style={{ marginTop: '0.5rem' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                {uploading ? 'Upload...' : '📤 Uploader une image'}
                <input type="file" accept="image/*" onChange={handleUploadBg}
                  style={{ display: 'none' }} disabled={uploading} />
              </label>
              {formData.bg_image_url && (
                <button type="button" className="btn btn-secondary"
                  style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}
                  onClick={() => setFormData(p => ({ ...p, bg_image_url: '' }))}>
                  ✕ Supprimer
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bg_video_url">Vidéo de fond (URL directe .mp4)</label>
            <input type="text" id="bg_video_url" name="bg_video_url"
              value={formData.bg_video_url} onChange={handleChange}
              placeholder="https://... (remplace l'image si les deux sont définis)" />
          </div>

          <div className="form-group">
            <label htmlFor="bg_overlay_opacity">
              Opacité de l'overlay sombre : {Math.round(Number(formData.bg_overlay_opacity) * 100)}%
            </label>
            <input type="range" id="bg_overlay_opacity" name="bg_overlay_opacity"
              min="0" max="0.9" step="0.05"
              value={formData.bg_overlay_opacity} onChange={handleChange}
              style={{ width: '100%' }} />
            <small style={{ color: '#888' }}>0% = pas d'overlay, 90% = très sombre</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
