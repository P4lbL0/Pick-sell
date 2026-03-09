'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { QuoteFormConfig, QuoteFormField } from '@/lib/types'

interface QuoteRequestFormProps {
  universe: 'horlogerie' | 'informatique'
  serviceType: 'repair' | 'custom' | 'buyback'
  accentColor?: 'amber' | 'blue'
  defaultConfig: QuoteFormConfig
  successTitle?: string
  successMessage?: string
  submitLabel?: string
}

function groupByRow(fields: QuoteFormField[]): QuoteFormField[][] {
  const rowMap: Record<number, QuoteFormField[]> = {}
  let autoRow = 0
  fields.forEach((field) => {
    const r = field.row ?? ++autoRow
    if (!rowMap[r]) rowMap[r] = []
    rowMap[r].push(field)
  })
  return Object.keys(rowMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => rowMap[Number(k)])
}

function gridClass(count: number) {
  if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
  if (count >= 3) return 'grid grid-cols-1 md:grid-cols-3 gap-6'
  return ''
}

export default function QuoteRequestForm({
  universe,
  serviceType,
  accentColor = 'amber',
  defaultConfig,
  successTitle = '✓ Demande envoyée!',
  successMessage = 'Nous vous contacterons sous 24-48h avec votre devis.',
  submitLabel = 'Envoyer la demande de devis',
}: QuoteRequestFormProps) {
  const [config, setConfig] = useState<QuoteFormConfig>(defaultConfig)
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialise les valeurs du formulaire à chaque changement de config
  useEffect(() => {
    const initial: Record<string, string | string[]> = {}
    config.fields.forEach((field) => {
      initial[field.name] = field.type === 'checkbox-group' ? [] : ''
    })
    setFormValues(initial)
  }, [config])

  // Charge la config depuis Supabase (écrase la config par défaut si trouvée)
  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase
        .from('quote_form_configs')
        .select('*')
        .eq('universe', universe)
        .eq('service_type', serviceType)
        .single()
      if (data?.fields) {
        setConfig({ ...data, fields: data.fields as QuoteFormField[] })
      }
    }
    fetchConfig()
  }, [universe, serviceType])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (name: string, value: string, checked: boolean) => {
    setFormValues((prev) => {
      const current = (prev[name] as string[]) || []
      return {
        ...prev,
        [name]: checked ? [...current, value] : current.filter((v) => v !== value),
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { name, email, phone, ...rest } = formValues
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universe,
          service_type: serviceType,
          name,
          email,
          phone: phone || null,
          ...rest,
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de l'envoi")
      }
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const ring = accentColor === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-blue-500'
  const btn =
    accentColor === 'amber'
      ? 'bg-amber-900 hover:bg-amber-800'
      : 'bg-blue-700 hover:bg-blue-600'
  const checkHover =
    accentColor === 'amber' ? 'hover:border-amber-400' : 'hover:border-blue-400'
  const baseInput = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${ring} focus:border-transparent`

  const renderField = (field: QuoteFormField) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            name={field.name}
            value={(formValues[field.name] as string) || ''}
            onChange={handleChange}
            required={field.required}
            className={baseInput}
          >
            <option value="">{field.placeholder || '-- Sélectionnez --'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={(formValues[field.name] as string) || ''}
            onChange={handleChange}
            required={field.required}
            rows={5}
            placeholder={field.placeholder}
            className={baseInput}
          />
        )
      case 'checkbox-group':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 ${checkHover} cursor-pointer transition`}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={((formValues[field.name] as string[]) || []).includes(opt.value)}
                  onChange={(e) => handleCheckbox(field.name, opt.value, e.target.checked)}
                  className="rounded"
                />
                {opt.label}
              </label>
            ))}
          </div>
        )
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={(formValues[field.name] as string) || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className={baseInput}
          />
        )
    }
  }

  if (submitted) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
        <p className="text-green-800 font-bold text-xl mb-2">{successTitle}</p>
        <p className="text-green-700">{successMessage}</p>
      </div>
    )
  }

  const rows = groupByRow(config.fields)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {rows.map((rowFields, rowIdx) => (
        <div key={rowIdx} className={gridClass(rowFields.length)}>
          {rowFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${btn} text-white font-bold py-4 rounded-lg transition disabled:opacity-50`}
      >
        {loading ? 'Envoi en cours...' : submitLabel}
      </button>
    </form>
  )
}
