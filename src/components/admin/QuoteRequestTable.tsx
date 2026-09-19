'use client'

import React, { useState } from 'react'
import type { QuoteRequest } from '@/lib/types'
import { AdminIcon } from '@/components/admin/AdminIcon'

interface QuoteRequestTableProps {
  requests: QuoteRequest[]
  onStatusChange: (id: string, status: QuoteRequest['status']) => void
  onNotesChange: (id: string, notes: string) => void
}

const STATUS_LABELS: Record<QuoteRequest['status'], string> = {
  new: 'Nouveau',
  read: 'Lu',
  in_progress: 'En cours',
  done: 'Traité',
  rejected: 'Refusé',
}

const UNIVERSE_LABELS: Record<string, string> = {
  horlogerie: 'Horlogerie',
  informatique: 'Informatique',
}

const TYPE_LABELS: Record<string, string> = {
  repair: 'Réparation',
  custom: 'Personnalisation',
  buyback: 'Reprise',
}

/** Demande envoyée par le configurateur 3D (page /horlogerie/configurateur). */
function estConfigurateur(req: QuoteRequest) {
  return req.data?.source === 'configurateur' && typeof req.data.configuration === 'string'
}

const LIBELLES_CONFIGURATEUR: Record<string, string> = {
  prix_indicatif: 'Prix indicatif',
  tour_de_poignet: 'Tour de poignet',
  message: 'Message',
}

export default function QuoteRequestTable({
  requests,
  onStatusChange,
  onNotesChange,
}: QuoteRequestTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState('')

  if (requests.length === 0) {
    return (
      <div className="empty-state">
        Aucune demande de devis reçue pour le moment.
      </div>
    )
  }

  const startEditNotes = (req: QuoteRequest) => {
    setEditingNotes(req.id)
    setNotesValue(req.notes || '')
  }

  const saveNotes = (id: string) => {
    onNotesChange(id, notesValue)
    setEditingNotes(null)
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Nom / Email</th>
            <th>Univers</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Détail</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <React.Fragment key={req.id}>
              <tr>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  {new Date(req.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  <strong>{req.name}</strong>
                  <br />
                  <a
                    href={`mailto:${req.email}`}
                    className="text-sm"
                    style={{ color: 'var(--primary-color, #6366f1)' }}
                  >
                    {req.email}
                  </a>
                  {req.phone && (
                    <>
                      <br />
                      <span className="text-sm" style={{ color: '#666' }}>{req.phone}</span>
                    </>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${req.universe}`}>
                    {UNIVERSE_LABELS[req.universe] ?? req.universe}
                  </span>
                </td>
                <td>{estConfigurateur(req) ? 'Configurateur 3D' : TYPE_LABELS[req.service_type] ?? req.service_type}</td>
                <td>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      onStatusChange(req.id, e.target.value as QuoteRequest['status'])
                    }
                    className="filter-select"
                    style={{ fontSize: '0.85rem', padding: '4px 8px' }}
                  >
                    {(Object.keys(STATUS_LABELS) as QuoteRequest['status'][]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                    title="Voir le détail"
                    aria-label="Voir le détail"
                  >
                    <AdminIcon name={expanded === req.id ? 'chevronUp' : 'chevronDown'} />
                  </button>
                </td>
              </tr>

              {expanded === req.id && (
                <tr>
                  <td colSpan={6}>
                    <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 12px', fontWeight: 600 }}>Détails de la demande</h4>
                      {estConfigurateur(req) && (
                        <div
                          style={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '12px 14px',
                            marginBottom: '10px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px 24px',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>Montre composée</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                              {String(req.data.recapitulatif ?? '')}
                            </div>
                          </div>
                          <a
                            href={`/horlogerie/configurateur?c=${encodeURIComponent(String(req.data.configuration))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          >
                            <AdminIcon name="cube" className="nav-icon" /> Voir la montre en 3D
                          </a>
                        </div>
                      )}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: '10px',
                          marginBottom: '16px',
                        }}
                      >
                        {Object.entries(req.data)
                          .filter(([key, val]) => !estConfigurateur(req) || (key in LIBELLES_CONFIGURATEUR && val))
                          .map(([key, val]) => {
                          const display = Array.isArray(val)
                            ? (val as string[]).join(', ')
                            : typeof val === 'object' && val !== null
                              ? JSON.stringify(val)
                              : String(val ?? '—')
                          return (
                            <div
                              key={key}
                              style={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                padding: '10px 12px',
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>
                                {estConfigurateur(req) ? LIBELLES_CONFIGURATEUR[key] : key}
                              </div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{display}</div>
                            </div>
                          )
                        })}
                      </div>

                      <div>
                        <strong style={{ fontSize: '0.9rem' }}>Notes admin :</strong>
                        {editingNotes === req.id ? (
                          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <textarea
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              rows={3}
                              style={{
                                flex: 1,
                                border: '1px solid #d1d5db',
                                borderRadius: 6,
                                padding: '8px',
                                fontSize: '0.9rem',
                              }}
                              placeholder="Ajoutez vos notes..."
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <button
                                className="btn btn-primary"
                                onClick={() => saveNotes(req.id)}
                              >
                                Sauver
                              </button>
                              <button
                                className="btn"
                                onClick={() => setEditingNotes(null)}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ marginTop: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span
                              style={{
                                flex: 1,
                                fontSize: '0.9rem',
                                color: req.notes ? '#374151' : '#9ca3af',
                                fontStyle: req.notes ? 'normal' : 'italic',
                              }}
                            >
                              {req.notes || 'Aucune note'}
                            </span>
                            <button
                              className="btn-icon edit"
                              onClick={() => startEditNotes(req)}
                              title="Éditer les notes"
                              aria-label="Éditer les notes"
                            >
                              <AdminIcon name="pencil" />
                            </button>
                          </div>
                        )}
                      </div>
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
