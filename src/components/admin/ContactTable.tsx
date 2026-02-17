'use client'

import React from 'react'
import { Contact } from '@/lib/types'

interface ContactTableProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

export default function ContactTable({ contacts, onEdit, onDelete }: ContactTableProps) {
  const platformNames: Record<string, string> = {
    email: '📧 Email',
    whatsapp: '💬 WhatsApp',
    instagram: '📱 Instagram',
    tiktok: '🎵 TikTok',
    vinted: '💎 Vinted',
  }

  if (contacts.length === 0) {
    return <div className="empty-state">Aucun contact trouvé</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Plateforme</th>
            <th>Lien</th>
            <th>Icône</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{platformNames[contact.platform] || contact.platform}</td>
              <td className="url">
                <a href={contact.url} target="_blank" rel="noopener noreferrer">
                  {contact.url.substring(0, 40)}...
                </a>
              </td>
              <td className="icon">{contact.icon}</td>
              <td className="actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(contact)}
                  title="Éditer"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(contact.id)}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
