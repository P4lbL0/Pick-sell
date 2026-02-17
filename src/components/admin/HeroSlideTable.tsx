'use client'

import React from 'react'
import { HeroSlide } from '@/lib/types'

interface HeroSlideTableProps {
  slides: HeroSlide[]
  onEdit: (slide: HeroSlide) => void
  onDelete: (id: string) => void
}

export default function HeroSlideTable({ slides, onEdit, onDelete }: HeroSlideTableProps) {
  if (slides.length === 0) {
    return <div className="empty-state">Aucune bannière trouvée</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Univers</th>
            <th>Ordre</th>
            <th>CTA</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slides.map((slide) => (
            <tr key={slide.id}>
              <td className="slide-title">{slide.title}</td>
              <td>
                <span className={`badge badge-${slide.universe_type}`}>
                  {slide.universe_type}
                </span>
              </td>
              <td className="order">{slide.order_index}</td>
              <td>{slide.cta_text || '-'}</td>
              <td className="image-thumb">
                {slide.image_url && (
                  <img src={slide.image_url} alt={slide.title} />
                )}
              </td>
              <td className="actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(slide)}
                  title="Éditer"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(slide.id)}
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
