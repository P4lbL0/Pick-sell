'use client'

import React from 'react'
import { Contact } from '@/lib/types'

interface ContactTableProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

const PLATFORM_ICONS: Record<string, string> = {
  email: '📧', whatsapp: '💬', instagram: '📷', tiktok: '🎵', vinted: '🛍️',
}

const UNIVERSE_LABELS: Record<string, { label: string; style: React.CSSProperties }> = {
  global:       { label: '🌐 Les deux',    style: { background: '#ede9fe', color: '#5b21b6' } },
  horlogerie:   { label: '⌚ Horlogerie',  style: { background: '#fef3c7', color: '#92400e' } },
  informatique: { label: '💻 Informatique', style: { background: '#dbeafe', color: '#1e40af' } },
}

function displayUrl(platform: string, url: string): string {
  if (platform === 'email') return url.replace('mailto:', '')
  if (platform === 'whatsapp') return url.replace('https://wa.me/', '+')
  return url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 35) + (url.length > 40 ? '…' : '')
}

export default function ContactTable({ contacts, onEdit, onDelete }: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun contact configuré</p>
        <p style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>Clique sur &quot;+ Nouveau contact&quot; pour en ajouter un.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {contacts.map(contact => {
        const uni = UNIVERSE_LABELS[contact.universe] || UNIVERSE_LABELS.global
        return (
          <div key={contact.id} style={{
            background: 'white', borderRadius: 12, padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex',
            alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 28 }}>{PLATFORM_ICONS[contact.platform] || '🔗'}</span>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: 2 }}>
                {contact.platform.charAt(0).toUpperCase() + contact.platform.slice(1)}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', wordBreak: 'break-all' }}>
                {displayUrl(contact.platform, contact.url)}
              </div>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', ...uni.style,
            }}>
              {uni.label}
            </span>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}
                onClick={() => onEdit(contact)}>✏️ Modifier</button>
              <button className="btn" style={{ padding: '8px 14px', fontSize: 13, background: '#fee2e2', color: '#dc2626', border: 'none' }}
                onClick={() => onDelete(contact.id)}>🗑️</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
