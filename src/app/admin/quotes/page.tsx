'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ServiceQuote } from '@/lib/types'
import QuoteForm from '@/components/admin/QuoteForm'
import QuoteTable from '@/components/admin/QuoteTable'

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<ServiceQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingQuote, setEditingQuote] = useState<ServiceQuote | null>(null)
  const [filterUniverse, setFilterUniverse] = useState<'all' | 'horlogerie' | 'informatique'>('all')
  const [filterType, setFilterType] = useState<'all' | 'repair' | 'custom' | 'buyback'>('all')

  useEffect(() => {
    fetchQuotes()
  }, [filterUniverse, filterType])

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      let query = supabase.from('service_quotes').select('*')
      if (filterUniverse !== 'all') query = query.eq('universe', filterUniverse)
      if (filterType !== 'all') query = query.eq('service_type', filterType)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Erreur chargement devis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return
    try {
      const { error } = await supabase.from('service_quotes').delete().eq('id', id)
      if (error) throw error
      setQuotes(quotes.filter(q => q.id !== id))
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const handleEdit = (quote: ServiceQuote) => {
    setEditingQuote(quote)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingQuote(null)
    fetchQuotes()
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>💰 Devis & Tarifs</h1>
          <p>Gérez les grilles tarifaires pour la réparation et la personnalisation</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Nouveau devis'}
        </button>
      </div>

      <div className="filters">
        <select
          value={filterUniverse}
          onChange={(e) => setFilterUniverse(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">Tous les univers</option>
          <option value="horlogerie">⌚ Horlogerie</option>
          <option value="informatique">💻 Informatique</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">Tous les types</option>
          <option value="repair">🔧 Réparation</option>
          <option value="custom">✨ Personnalisation</option>
          <option value="buyback">🔄 Reprise</option>
        </select>
      </div>

      {showForm && (
        <QuoteForm quote={editingQuote} onClose={handleFormClose} />
      )}

      {loading ? (
        <div className="loading">Chargement des devis...</div>
      ) : (
        <QuoteTable quotes={quotes} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  )
}
