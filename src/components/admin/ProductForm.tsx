'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || 0,
    short_description: product?.short_description || '',
    long_description: product?.long_description || '',
    stock: product?.stock || 0,
    category: product?.category || 'seiko-mod',
    universe: product?.universe || 'horlogerie',
    image_url: product?.image_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(product?.image_url || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' 
        ? (value === '' ? 0 : parseFloat(value) || 0)
        : value
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
        ...formData,
      }

      if (product?.id) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('products')
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
        <h2>{product ? 'Éditer le produit' : 'Ajouter un produit'}</h2>

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
            placeholder="Ex: Seiko SKX007"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Prix (€) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || 0}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock || 0}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
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
            <label htmlFor="category">Catégorie *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="seiko-mod">Seiko MOD</option>
              <option value="diverse">Montres diverses</option>
              <option value="accessories">Accessoires Horlogerie</option>
              <option value="computer">Ordinateurs</option>
              <option value="computer-accessories">Accessoires Informatique</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="short_description">Description courte *</label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Brève description (visible en listing)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="long_description">Description détaillée *</label>
          <textarea
            id="long_description"
            name="long_description"
            value={formData.long_description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Description complète du produit"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_file">Image du produit *</label>
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
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    borderRadius: '0.5rem',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            )}
          </div>
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
