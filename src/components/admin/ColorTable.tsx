'use client'

import React from 'react'
import { ProductColor, Product } from '@/lib/types'

interface ColorTableProps {
  colors: (ProductColor & { product?: Product })[]
  onEdit: (color: ProductColor) => void
  onDelete: (id: string) => void
}

export default function ColorTable({ colors, onEdit, onDelete }: ColorTableProps) {
  if (colors.length === 0) {
    return <div className="empty-state">Aucun coloris trouvé</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Couleur</th>
            <th>Nom</th>
            <th>Produit</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color.id}>
              <td>
                <div className="color-swatch-cell">
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: color.hex_color }}
                    title={color.hex_color}
                  />
                  <span className="color-hex">{color.hex_color}</span>
                </div>
              </td>
              <td>{color.name}</td>
              <td>{color.product?.title || <span className="muted">{color.product_id}</span>}</td>
              <td className={color.stock > 0 ? 'in-stock' : 'out-of-stock'}>{color.stock}</td>
              <td>
                {color.image_url ? (
                  <img
                    src={color.image_url}
                    alt={color.name}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <span className="muted">—</span>
                )}
              </td>
              <td className="actions">
                <button className="btn-icon edit" onClick={() => onEdit(color)} title="Éditer">✏️</button>
                <button className="btn-icon delete" onClick={() => onDelete(color.id)} title="Supprimer">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
