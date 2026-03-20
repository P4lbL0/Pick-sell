'use client'

import React, { useState } from 'react'
import { Contact } from '@/lib/types'

interface ContactFormProps {
  contact?: Contact | null
  onClose: () => void
}

const PLATFORM_CONFIG: Record<string, { label: string; icon: string; inputType: 'email' | 'text' | 'tel'; placeholder: string; hint: string }> = {
  email:     { label: 'Email',     icon: '📧', inputType: 'email', placeholder: 'contact@monsite.fr',           hint: 'Adresse email — sera transformée en lien mailto automatiquement' },
  whatsapp:  { label: 'WhatsApp',  icon: '💬', inputType: 'tel',   placeholder: '+33612345678',                  hint: 'Numéro avec indicatif international (ex: +33612345678)' },
  instagram: { label: 'Instagram', icon: '📷', inputType: 'text',  placeholder: 'https://instagram.com/moncompte', hint: 'Lien complet vers ton profil Instagram' },
  tiktok:    { label: 'TikTok',    icon: '🎵', inputType: 'text',  placeholder: 'https://tiktok.com/@moncompte',  hint: 'Lien complet vers ton profil TikTok' },
  vinted:    { label: 'Vinted',    icon: '🛍️', inputType: 'text',  placeholder: 'https://vinted.fr/member/xxx',   hint: 'Lien complet vers ton profil Vinted' },
}

function buildUrl(platform: string, raw: string): string {
  if (!raw.trim()) return ''
  if (platform === 'email') {
    return raw.startsWith('mailto:') ? raw : `mailto:${raw.trim()}`
  }
  if (platform === 'whatsapp') {
    const digits = raw.replace(/\s+/g, '').replace(/^\+/, '')
    return `https://wa.me/${digits}`
  }
  return raw.trim()
}

function extractRaw(platform: string, url: string): string {
  if (!url) return ''
  if (platform === 'email') return url.replace(/^mailto:/, '')
  if (platform === 'whatsapp') return url.replace(/^https:\/\/wa\.me\//, '+').replace(/^https:\/\/api\.whatsapp\.com\/send\?phone=/, '+')
  return url
}

export default function ContactForm({ contact, onClose }: ContactFormProps) {
  const [platform, setPlatform] = useState<string>(contact?.platform || 'email')
  const [rawValue, setRawValue] = useState<string>(extractRaw(contact?.platform || 'email', contact?.url || ''))
  const [universe, setUniverse] = useState<string>(contact?.universe || 'global')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cfg = PLATFORM_CONFIG[platform]

  const handlePlatformChange = (p: string) => {
    setPlatform(p)
    setRawValue('') // reset quand on change de plateforme
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = buildUrl(platform, rawValue)
    if (!url) { setError('Veuillez renseigner une valeur.'); setLoading(false); return }

    const payload = { platform, url, universe, icon: cfg.icon }

    try {
      if (contact?.id) {
        const res = await fetch(`/api/admin/contacts?id=${contact.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur mise à jour')
      } else {
        const res = await fetch('/api/admin/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur création')
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{contact ? 'Modifier le contact' : 'Ajouter un contact'}</h2>
        {error && <div className="error-message">{error}</div>}

        {/* Plateforme */}
        <div className="form-group">
          <label>Plateforme *</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(PLATFORM_CONFIG).map(([key, c]) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePlatformChange(key)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: platform === key ? '2px solid #667eea' : '2px solid #e0e6ed',
                  background: platform === key ? '#f0f4ff' : 'white',
                  fontWeight: platform === key ? 700 : 400,
                  color: platform === key ? '#4c1d95' : '#4a5568',
                  cursor: 'pointer',
                  fontSize: 14,
                  minWidth: 90,
                }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Valeur (email / numéro / URL) */}
        <div className="form-group">
          <label>{cfg.label} *</label>
          <input
            type={cfg.inputType}
            value={rawValue}
            onChange={e => setRawValue(e.target.value)}
            placeholder={cfg.placeholder}
            required
            autoComplete="off"
          />
          <small style={{ color: '#6b7280', marginTop: 4, display: 'block' }}>
            💡 {cfg.hint}
          </small>
          {rawValue && (
            <small style={{ color: '#22c55e', marginTop: 2, display: 'block' }}>
              Lien généré : <strong>{buildUrl(platform, rawValue)}</strong>
            </small>
          )}
        </div>

        {/* Univers */}
        <div className="form-group">
          <label>Univers *</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { val: 'global',       label: '🌐 Les deux univers' },
              { val: 'horlogerie',   label: '⌚ Horlogerie seulement' },
              { val: 'informatique', label: '💻 Informatique seulement' },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setUniverse(opt.val)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: universe === opt.val ? '2px solid #667eea' : '2px solid #e0e6ed',
                  background: universe === opt.val ? '#f0f4ff' : 'white',
                  fontWeight: universe === opt.val ? 700 : 400,
                  color: universe === opt.val ? '#4c1d95' : '#4a5568',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
