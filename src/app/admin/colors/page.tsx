'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductColor, Product } from '@/lib/types'
import ColorForm from '@/components/admin/ColorForm'
import ColorTable from '@/components/admin/ColorTable'

export default function ColorsPage() {
  const [colors, setColors] = useState<(ProductColor & { product?: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingColor, setEditingColor] = useState<ProductColor | null>(null)
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchColors()
  }, [filterProduct])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('id, title, universe').order('title')
    setProducts((data as unknown as Product[]) || [])
  }

  const fetchColors = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('product_colors')
        .select('*, product:products(id, title, universe)')

      if (filterProduct !== 'all') {
        query = query.eq('product_id', filterProduct)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setColors(data || [])
    } catch (error) {
      console.error('Erreur chargement coloris:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce coloris ?')) return
    try {
      const { error } = await supabase.from('product_colors').delete().eq('id', id)
      if (error) throw error
      setColors(colors.filter(c => c.id !== id))
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const handleEdit = (color: ProductColor) => {
    setEditingColor(color)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingColor(null)
    fetchColors()
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🎨 Coloris</h1>
          <p>Gérez les variantes de couleur de vos produits</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Nouveau coloris'}
        </button>
      </div>

      <div className="filters">
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tous les produits</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.universe === 'horlogerie' ? '⌚' : '💻'} {p.title}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <ColorForm color={editingColor} onClose={handleFormClose} />
      )}

      {loading ? (
        <div className="loading">Chargement des coloris...</div>
      ) : (
        <ColorTable colors={colors} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  )
}
