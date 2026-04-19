'use client'

import React, { useState } from 'react'
import { Product } from '@/lib/types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onChanged?: () => void
}

export default function ProductTable({ products, onEdit, onDelete, onChanged }: ProductTableProps) {
  const [sellingId, setSellingId] = useState<string | null>(null)
  const [sellPrice, setSellPrice] = useState('')
  const [sellChannel, setSellChannel] = useState<'vinted' | 'direct' | 'autre'>('vinted')
  const [busy, setBusy] = useState(false)

  if (products.length === 0) {
    return <div className="empty-state">Aucun produit trouvé</div>
  }

  const openSell = (product: Product) => {
    setSellingId(product.id)
    setSellPrice(String(product.price ?? ''))
    setSellChannel('vinted')
  }

  const confirmSell = async () => {
    if (!sellingId) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/products/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sellingId, sold_price: sellPrice, sold_channel: sellChannel }),
      })
      if (!res.ok) throw new Error('Erreur')
      setSellingId(null)
      onChanged?.()
    } catch (e) {
      alert('Impossible de marquer comme vendu')
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const unsell = async (id: string) => {
    if (!confirm('Annuler le statut "vendu" de ce produit ?')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/products/sell?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur')
      onChanged?.()
    } catch (e) {
      alert('Impossible d\'annuler le statut vendu')
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Univers</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Vinted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isSold = !!product.sold_at
              return (
                <tr key={product.id} style={isSold ? { opacity: 0.7 } : undefined}>
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
                    {isSold ? (
                      <span className="badge" style={{ background: '#dcfce7', color: '#166534' }} title={product.sold_at ?? ''}>
                        ✅ Vendu{product.sold_channel ? ` (${product.sold_channel})` : ''}
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
                        En vente
                      </span>
                    )}
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
                    {isSold ? (
                      <button
                        className="btn-icon"
                        onClick={() => unsell(product.id)}
                        disabled={busy}
                        title="Annuler vente"
                      >
                        ↩️
                      </button>
                    ) : (
                      <button
                        className="btn-icon"
                        onClick={() => openSell(product)}
                        disabled={busy}
                        title="Marquer comme vendu"
                      >
                        💸
                      </button>
                    )}
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
              )
            })}
          </tbody>
        </table>
      </div>

      {sellingId && (
        <div
          onClick={() => !busy && setSellingId(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 12, padding: 24, width: 'min(420px, 90vw)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>💸 Marquer comme vendu</h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
              Le stock passera à 0 et le produit apparaîtra dans les statistiques de vente.
            </p>

            <label style={{ display: 'block', marginTop: 16, fontWeight: 600 }}>
              Prix de vente (€)
              <input
                type="number"
                step="0.01"
                value={sellPrice}
                onChange={e => setSellPrice(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid #d1d5db', borderRadius: 8 }}
                placeholder="Prix vendu"
              />
            </label>

            <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>
              Canal de vente
              <select
                value={sellChannel}
                onChange={e => setSellChannel(e.target.value as 'vinted' | 'direct' | 'autre')}
                style={{ width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid #d1d5db', borderRadius: 8 }}
              >
                <option value="vinted">Vinted</option>
                <option value="direct">Vente directe</option>
                <option value="autre">Autre</option>
              </select>
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSellingId(null)} disabled={busy}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={confirmSell} disabled={busy}>
                {busy ? 'Enregistrement...' : 'Confirmer la vente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
