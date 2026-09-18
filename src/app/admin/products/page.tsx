'use client'

import React, { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'
import { Product } from '@/lib/types'
import ProductForm from '@/components/admin/ProductForm'
import ProductTable from '@/components/admin/ProductTable'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filterUniverse, setFilterUniverse] = useState<'all' | 'horlogerie' | 'informatique'>('all')

  useEffect(() => {
    fetchProducts()
  }, [filterUniverse])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await adminApi<Product[]>(`products?universe=${filterUniverse}`)
      setProducts(data.map(p => ({ ...p, id: String(p.id) })))
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      await adminApi(`products?id=${id}`, { method: 'DELETE' })
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des produits</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Fermer' : '+ Nouveau produit'}
        </button>
      </div>

      <div className="filters">
        <select 
          value={filterUniverse}
          onChange={(e) => setFilterUniverse(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">Tous les univers</option>
          <option value="horlogerie">Horlogerie</option>
          <option value="informatique">Informatique</option>
        </select>
      </div>

      {showForm && (
        <ProductForm 
          product={editingProduct}
          onClose={handleFormClose}
        />
      )}

      {loading ? (
        <div className="loading">Chargement des produits...</div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChanged={fetchProducts}
        />
      )}
    </div>
  )
}
