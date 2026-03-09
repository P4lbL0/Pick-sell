'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductColor, Product } from '@/lib/types'

interface ColorFormProps {
  color?: ProductColor | null
  onClose: () => void
}

export default function ColorForm({ color, onClose }: ColorFormProps) {
  const [formData, setFormData] = useState({
    product_id: color?.product_id || '',
    name: color?.name || '',
    hex_color: color?.hex_color || '#000000',
    image_url: color?.image_url || '',
    stock: color?.stock || 0,
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(color?.image_url || '')

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, title, universe')
        .order('title')
      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? (value === '' ? 0 : parseInt(value) || 0) : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur upload')
      setFormData(prev => ({ ...prev, image_url: data.url }))
      setPreview(data.url)
    } catch (err: any) {
      setError(`Erreur upload: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_id) {
      setError('Veuillez sélectionner un produit.')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (color?.id) {
        const { error: updateError } = await supabase
          .from('product_colors')
          .update(formData)
          .eq('id', color.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('product_colors')
          .insert([{ ...formData, created_at: new Date().toISOString() }])
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
        <h2>{color ? 'Éditer le coloris' : 'Ajouter un coloris'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="product_id">Produit associé *</label>
          <select
            id="product_id"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
          >
            <option value="">— Sélectionner un produit —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.universe === 'horlogerie' ? '⌚' : '💻'}] {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nom du coloris *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Noir mat, Bleu nuit..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="hex_color">Couleur *</label>
            <div className="color-input-row">
              <input
                type="color"
                id="hex_color"
                name="hex_color"
                value={formData.hex_color}
                onChange={handleChange}
                className="color-picker"
              />
              <input
                type="text"
                name="hex_color"
                value={formData.hex_color}
                onChange={handleChange}
                placeholder="#000000"
                className="color-text"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="color_stock">Stock pour ce coloris *</label>
          <input
            type="number"
            id="color_stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="color_image">Image spécifique (optionnel)</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="color_image"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p>Upload en cours...</p>}
            {preview && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Aperçu:</p>
                <img
                  src={preview}
                  alt="Aperçu"
                  style={{ maxWidth: '120px', maxHeight: '120px', borderRadius: '0.5rem', objectFit: 'cover' }}
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
