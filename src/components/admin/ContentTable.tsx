'use client'

import React from 'react'
import { ContentBlock } from '@/lib/types'

interface ContentTableProps {
  contents: ContentBlock[]
  onEdit: (content: ContentBlock) => void
  onDelete: (id: string) => void
}

export default function ContentTable({ contents, onEdit, onDelete }: ContentTableProps) {
  if (contents.length === 0) {
    return <div className="empty-state">Aucun contenu trouvé</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Clé</th>
            <th>Titre</th>
            <th>Univers</th>
            <th>Aperçu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content.id}>
              <td className="key">{content.key}</td>
              <td>{content.title}</td>
              <td>
                <span className={`badge badge-${content.universe}`}>
                  {content.universe}
                </span>
              </td>
              <td className="preview">
                {content.content.substring(0, 50)}...
              </td>
              <td className="actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(content)}
                  title="Éditer"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(content.id)}
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
