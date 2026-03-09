'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { QuoteFormConfig, QuoteFormField, QuoteFormFieldOption } from '@/lib/types'

interface Props {
  configs: QuoteFormConfig[]
  onSaved: () => void
}

const UNIVERSE_OPTIONS = [
  { value: 'horlogerie', label: '⌚ Horlogerie' },
  { value: 'informatique', label: '💻 Informatique' },
] as const

const TYPE_OPTIONS = [
  { value: 'repair', label: '🔧 Réparation' },
  { value: 'custom', label: '✨ Personnalisation' },
  { value: 'buyback', label: '🔄 Reprise' },
] as const

export default function QuoteFormConfigEditor({ configs, onSaved }: Props) {
  const [selectedUniverse, setSelectedUniverse] = useState<'horlogerie' | 'informatique'>('horlogerie')
  const [selectedType, setSelectedType] = useState<'repair' | 'custom' | 'buyback'>('repair')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const current = configs.find(
    (c) => c.universe === selectedUniverse && c.service_type === selectedType
  )

  const [fields, setFields] = useState<QuoteFormField[]>(current?.fields ?? [])

  // Sync fields when selector changes
  const handleSelectChange = (universe: typeof selectedUniverse, type: typeof selectedType) => {
    const found = configs.find((c) => c.universe === universe && c.service_type === type)
    setFields(found?.fields ?? [])
    setSaveMsg('')
  }

  const updateField = (idx: number, key: keyof QuoteFormField, value: unknown) => {
    setFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
    )
  }

  const updateOption = (fieldIdx: number, optIdx: number, key: keyof QuoteFormFieldOption, value: string) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f
        const newOpts = (f.options ?? []).map((o, j) =>
          j === optIdx ? { ...o, [key]: value } : o
        )
        return { ...f, options: newOpts }
      })
    )
  }

  const addOption = (fieldIdx: number) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f
        return { ...f, options: [...(f.options ?? []), { value: '', label: '' }] }
      })
    )
  }

  const removeOption = (fieldIdx: number, optIdx: number) => {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== fieldIdx) return f
        return { ...f, options: (f.options ?? []).filter((_, j) => j !== optIdx) }
      })
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const { error } = await supabase.from('quote_form_configs').upsert(
        [
          {
            universe: selectedUniverse,
            service_type: selectedType,
            fields,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'universe,service_type' }
      )
      if (error) throw error
      setSaveMsg('✅ Configuration sauvegardée !')
      onSaved()
    } catch (err: unknown) {
      setSaveMsg('❌ ' + (err instanceof Error ? err.message : 'Erreur'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-container">
      <h2>⚙️ Configuration des formulaires de devis</h2>
      <p style={{ color: '#666', marginBottom: 16, fontSize: '0.9rem' }}>
        Modifiez les labels, placeholders, statut requis et les options des champs.
        Les changements sont appliqués immédiatement sur le site public.
      </p>

      <div className="form-row" style={{ marginBottom: 24 }}>
        <div className="form-group">
          <label>Univers</label>
          <select
            value={selectedUniverse}
            onChange={(e) => {
              const u = e.target.value as typeof selectedUniverse
              setSelectedUniverse(u)
              handleSelectChange(u, selectedType)
            }}
            className="filter-select"
          >
            {UNIVERSE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Type de service</label>
          <select
            value={selectedType}
            onChange={(e) => {
              const t = e.target.value as typeof selectedType
              setSelectedType(t)
              handleSelectChange(selectedUniverse, t)
            }}
            className="filter-select"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="empty-state">
          Aucune configuration trouvée. Exécutez la migration SQL pour initialiser les configs par défaut.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map((field, idx) => (
            <div
              key={field.name}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 16,
                background: '#fafafa',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    background: '#e5e7eb',
                    borderRadius: 4,
                    padding: '2px 8px',
                    color: '#374151',
                  }}
                >
                  {field.name}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    background: '#dbeafe',
                    borderRadius: 4,
                    padding: '2px 8px',
                    color: '#1d4ed8',
                  }}
                >
                  {field.type}
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(idx, 'required', e.target.checked)}
                  />
                  Requis
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem' }}>Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(idx, 'label', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                {field.type !== 'checkbox-group' && (
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Placeholder</label>
                    <input
                      type="text"
                      value={field.placeholder ?? ''}
                      onChange={(e) => updateField(idx, 'placeholder', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>

              {(field.type === 'select' || field.type === 'checkbox-group') && (
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <strong style={{ fontSize: '0.85rem' }}>Options</strong>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                      onClick={() => addOption(idx)}
                    >
                      + Ajouter
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {field.options?.map((opt, optIdx) => (
                      <div key={optIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) => updateOption(idx, optIdx, 'value', e.target.value)}
                          placeholder="Valeur (ex: revision)"
                          style={{ flex: 1, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => updateOption(idx, optIdx, 'label', e.target.value)}
                          placeholder="Libellé (ex: Révision complète)"
                          style={{ flex: 2, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.85rem' }}
                        />
                        <button
                          type="button"
                          className="btn-icon delete"
                          onClick={() => removeOption(idx, optIdx)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : '💾 Sauvegarder la configuration'}
          </button>
          {saveMsg && <span style={{ fontSize: '0.9rem' }}>{saveMsg}</span>}
        </div>
      )}
    </div>
  )
}
