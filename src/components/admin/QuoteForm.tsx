'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ServiceQuote, QuoteItem } from '@/lib/types'

interface QuoteFormProps {
  quote?: ServiceQuote | null
  onClose: () => void
}

const emptyItem = (): QuoteItem => ({
  label: '',
  price_min: 0,
  price_max: 0,
  description: '',
})

export default function QuoteForm({ quote, onClose }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    title: quote?.title || '',
    universe: quote?.universe || 'horlogerie' as 'horlogerie' | 'informatique',
    service_type: quote?.service_type || 'repair' as 'repair' | 'custom' | 'buyback',
    note: quote?.note || '',
  })
  const [items, setItems] = useState<QuoteItem[]>(
    quote?.items?.length ? quote.items : [emptyItem()]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: keyof QuoteItem, value: string) => {
    setItems(prev => prev.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]: field === 'price_min' || field === 'price_max'
              ? (value === '' ? 0 : parseFloat(value) || 0)
              : value,
          }
        : item
    ))
  }

  const addItem = () => setItems(prev => [...prev, emptyItem()])

  const removeItem = (index: number) => {
    if (items.length === 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = items.filter(i => i.label.trim())
    if (validItems.length === 0) {
      setError('Ajoutez au moins une prestation.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...formData,
        items: validItems,
        updated_at: new Date().toISOString(),
      }
      if (quote?.id) {
        const { error: updateError } = await supabase
          .from('service_quotes')
          .update(payload)
          .eq('id', quote.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('service_quotes')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
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
        <h2>{quote ? 'Éditer le devis' : 'Créer un devis'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Titre du devis *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ex: Tarifs révision montre"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="universe">Univers *</label>
            <select id="universe" name="universe" value={formData.universe} onChange={handleChange} required>
              <option value="horlogerie">⌚ Horlogerie</option>
              <option value="informatique">💻 Informatique</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="service_type">Type de service *</label>
            <select id="service_type" name="service_type" value={formData.service_type} onChange={handleChange} required>
              <option value="repair">🔧 Réparation / Révision</option>
              <option value="custom">✨ Personnalisation / Sur-mesure</option>
              <option value="buyback">🔄 Reprise</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="quote-items-section">
          <div className="quote-items-header">
            <h3>Prestations</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              + Ajouter une prestation
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="quote-item-row">
              <div className="quote-item-number">{index + 1}</div>
              <div className="quote-item-fields">
                <div className="form-group">
                  <label>Prestation *</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                    placeholder="Ex: Révision complète, Changement bracelet..."
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prix min (€)</label>
                    <input
                      type="number"
                      value={item.price_min}
                      onChange={(e) => handleItemChange(index, 'price_min', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Prix max (€)</label>
                    <input
                      type="number"
                      value={item.price_max}
                      onChange={(e) => handleItemChange(index, 'price_max', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description (optionnel)</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Précisions sur la prestation..."
                  />
                </div>
              </div>
              <div className="quote-item-actions">
                <button type="button" className="btn-icon" onClick={() => moveItem(index, 'up')} disabled={index === 0} title="Monter">↑</button>
                <button type="button" className="btn-icon" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} title="Descendre">↓</button>
                <button type="button" className="btn-icon delete" onClick={() => removeItem(index)} disabled={items.length === 1} title="Supprimer">🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="note">Note / mention légale (optionnel)</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={2}
            placeholder="Ex: Tarifs indicatifs, devis sur demande..."
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
