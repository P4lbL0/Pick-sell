'use client'

import React, { useState } from 'react'
import { adminApi } from '@/lib/admin-api'
import { Service } from '@/lib/types'

interface ServiceFormProps {
  service?: Service | null
  onClose: () => void
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    slug: service?.slug || '',
    universe: service?.universe || 'horlogerie',
    type: service?.type || 'repair',
    description: service?.description || '',
    contact_url: service?.contact_url || '',
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
      if (service?.id) {
        await adminApi('services', { method: 'PUT', body: { id: service.id, ...formData } })
      } else {
        await adminApi('services', { method: 'POST', body: formData })
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
        <h2>{service ? 'Éditer le service' : 'Ajouter un service'}</h2>

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
            placeholder="Ex: Réparation & Révision"
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug *</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="Ex: repair-revision"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="universe">Univers *</label>
            <select
              id="universe"
              name="universe"
              value={formData.universe}
              onChange={handleChange}
              required
            >
              <option value="horlogerie">Horlogerie</option>
              <option value="informatique">Informatique</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="repair">Réparation</option>
              <option value="custom">Sur-mesure</option>
              <option value="buyback">Reprise</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Description du service"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact_url">URL de contact</label>
          <input
            type="url"
            id="contact_url"
            name="contact_url"
            value={formData.contact_url}
            onChange={handleChange}
            placeholder="https://..."
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
