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
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e5e7eb' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#374151', fontSize: '1.1rem' }}>
            🖼️ Image / Vidéo de fond (optionnel)
          </h3>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#166534', margin: 0, fontWeight: 600 }}>
              📍 Ce fond s'affiche derrière le texte de ce bloc sur la page du site (ex : section "Notre Concept" en Horlogerie).
            </p>
          </div>

          <div className="form-group">
            <label>Image de fond</label>
            <div style={{ background: '#f0f4ff', border: '2px dashed #667eea', borderRadius: 10, padding: '1rem' }}>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: uploading ? '#a0aec0' : 'linear-gradient(135deg,#667eea,#764ba2)',
                color: 'white', borderRadius: 8, padding: '14px 20px',
                fontWeight: 700, fontSize: '0.95rem', cursor: uploading ? 'not-allowed' : 'pointer',
                minHeight: 52, width: '100%', boxSizing: 'border-box' as const,
              }}>
                {uploading ? '⏳ Upload en cours...' : '📤 Choisir une image de fond'}
                <input type="file" accept="image/*" onChange={handleUploadBg}
                  style={{ display: 'none' }} disabled={uploading} />
              </label>
              {formData.bg_image_url && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.bg_image_url} alt="bg preview"
                    style={{ width: 80, height: 60, borderRadius: 6, objectFit: 'cover', border: '2px solid #667eea' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>✅ Image chargée</p>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, bg_image_url: '' }))}
                      style={{ fontSize: '0.75rem', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
              )}
              {!formData.bg_image_url && (
                <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem', textAlign: 'center' }}>
                  ou colle une URL directement :
                </p>
              )}
              <input type="text" name="bg_image_url" value={formData.bg_image_url}
                onChange={handleChange} placeholder="https://... (URL d'image)"
                style={{ marginTop: '0.5rem', width: '100%', boxSizing: 'border-box' as const, fontSize: '0.85rem' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Vidéo de fond</label>
            <div style={{ background: '#fff7ed', border: '2px dashed #f59e0b', borderRadius: 10, padding: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: '0.75rem', fontWeight: 600 }}>
                🎥 Si une vidéo ET une image sont définies, la vidéo est prioritaire. Lien direct .mp4 uniquement.
              </p>
              <input type="text" id="bg_video_url" name="bg_video_url"
                value={formData.bg_video_url} onChange={handleChange}
                placeholder="https://exemple.com/fond.mp4"
                style={{ width: '100%', boxSizing: 'border-box' as const }} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bg_overlay_opacity">
              Assombrissement du fond : <strong>{Math.round(Number(formData.bg_overlay_opacity) * 100)}%</strong>
            </label>
            <input type="range" id="bg_overlay_opacity" name="bg_overlay_opacity"
              min="0" max="0.9" step="0.05"
              value={formData.bg_overlay_opacity} onChange={handleChange}
              style={{ width: '100%', height: 32, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
              <span>0% — fond visible</span>
              <span>90% — très sombre</span>
            </div>
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
