'use client'

import React from 'react'
import { Service } from '@/lib/types'

interface ServiceTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export default function ServiceTable({ services, onEdit, onDelete }: ServiceTableProps) {
  if (services.length === 0) {
    return <div className="empty-state">Aucun service trouvé</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Univers</th>
            <th>Type</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="service-title">{service.title}</td>
              <td>
                <span className={`badge badge-${service.universe}`}>
                  {service.universe === 'horlogerie' ? '⌚' : '💻'} {service.universe}
                </span>
              </td>
              <td>{service.type}</td>
              <td className="slug">{service.slug}</td>
              <td className="actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(service)}
                  title="Éditer"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(service.id)}
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
