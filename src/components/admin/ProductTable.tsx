'use client'

import React from 'react'
import { Product } from '@/lib/types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return <div className="empty-state">Aucun produit trouvé</div>
  }

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Univers</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Vinted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="product-title">{product.title}</td>
              <td>
                <span className={`badge badge-${product.universe}`}>
                  {product.universe === 'horlogerie' ? '⌚' : '💻'} {product.universe}
                </span>
              </td>
              <td>{product.category}</td>
              <td className="price">{product.price.toFixed(2)}€</td>
              <td className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock}
              </td>
              <td>
                {product.vinted_url ? (
                  <a href={product.vinted_url} target="_blank" rel="noopener noreferrer" className="vinted-link">
                    🛍️ Voir
                  </a>
                ) : (
                  <span className="no-link">—</span>
                )}
              </td>
              <td className="actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(product)}
                  title="Éditer"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => onDelete(product.id)}
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
