'use client'

import React, { useState } from 'react'
import { ServiceQuote } from '@/lib/types'

interface QuoteTableProps {
  quotes: ServiceQuote[]
  onEdit: (quote: ServiceQuote) => void
  onDelete: (id: string) => void
}

const serviceTypeLabel: Record<string, string> = {
  repair: '🔧 Réparation',
  custom: '✨ Personnalisation',
  buyback: '🔄 Reprise',
}

export default function QuoteTable({ quotes, onEdit, onDelete }: QuoteTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (quotes.length === 0) {
    return <div className="empty-state">Aucun devis trouvé</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Univers</th>
            <th>Type</th>
            <th>Prestations</th>
            <th>Détail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <React.Fragment key={quote.id}>
              <tr>
                <td><strong>{quote.title}</strong></td>
                <td>
                  <span className={`badge badge-${quote.universe}`}>
                    {quote.universe === 'horlogerie' ? '⌚' : '💻'} {quote.universe}
                  </span>
                </td>
                <td>{serviceTypeLabel[quote.service_type] || quote.service_type}</td>
                <td>
                  <span className="badge badge-global">{quote.items?.length || 0} ligne{(quote.items?.length || 0) > 1 ? 's' : ''}</span>
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => setExpanded(expanded === quote.id ? null : quote.id)}
                    title="Voir les prestations"
                  >
                    {expanded === quote.id ? '🔼' : '🔽'}
                  </button>
                </td>
                <td className="actions">
                  <button className="btn-icon edit" onClick={() => onEdit(quote)} title="Éditer">✏️</button>
                  <button className="btn-icon delete" onClick={() => onDelete(quote.id)} title="Supprimer">🗑️</button>
                </td>
              </tr>
              {expanded === quote.id && (
                <tr className="quote-detail-row">
                  <td colSpan={6}>
                    <div className="quote-detail-panel">
                      {quote.items?.map((item, i) => (
                        <div key={i} className="quote-detail-item">
                          <span className="quote-item-label">{item.label}</span>
                          <span className="quote-item-price">
                            {item.price_min === item.price_max
                              ? `${item.price_min}€`
                              : `${item.price_min}€ – ${item.price_max}€`}
                          </span>
                          {item.description && (
                            <span className="quote-item-desc">{item.description}</span>
                          )}
                        </div>
                      ))}
                      {quote.note && (
                        <p className="quote-note">📌 {quote.note}</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
