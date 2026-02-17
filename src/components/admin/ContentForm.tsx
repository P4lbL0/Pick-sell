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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        updated_at: new Date().toISOString(),
      }

      if (content?.id) {
        const { error: updateError } = await supabase
          .from('content_blocks')
          .update(payload)
          .eq('id', content.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('content_blocks')
          .insert([{
            ...payload,
            created_at: new Date().toISOString(),
          }])
        if (insertError) throw insertError
      }

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
        <h2>{content ? 'Éditer le contenu' : 'Ajouter un contenu'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="key">Clé unique *</label>
          <input
            type="text"
            id="key"
            name="key"
            value={formData.key}
            onChange={handleChange}
            required
            placeholder="Ex: about-us-horlogerie"
            disabled={!!content}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Optionnel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="universe">Univers</label>
          <select
            id="universe"
            name="universe"
            value={formData.universe}
            onChange={handleChange}
          >
            <option value="global">Global</option>
            <option value="horlogerie">Horlogerie</option>
            <option value="informatique">Informatique</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenu *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            placeholder="Le contenu du bloc"
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
