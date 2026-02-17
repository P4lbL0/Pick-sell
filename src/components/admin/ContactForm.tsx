'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact } from '@/lib/types'

interface ContactFormProps {
  contact?: Contact | null
  onClose: () => void
}

export default function ContactForm({ contact, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    platform: (contact?.platform as 'email' | 'whatsapp' | 'tiktok' | 'instagram' | 'vinted') || 'email',
    url: contact?.url || '',
    icon: contact?.icon || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        platform: formData.platform,
        url: formData.url,
        icon: formData.icon,
      }

      if (contact?.id) {
        const { error: updateError } = await supabase
          .from('contacts')
          .update(payload)
          .eq('id', contact.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('contacts')
          .insert([payload])
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
        <h2>{contact ? 'Éditer le contact' : 'Ajouter un contact'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="platform">Plateforme *</label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="vinted">Vinted</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="url">URL / Lien *</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="icon">Emoji/Icône</label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="📧, 💬, 📱, etc."
            maxLength={2}
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
