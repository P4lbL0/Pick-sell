'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ServiceQuote, QuoteRequest, QuoteFormConfig } from '@/lib/types'
import QuoteForm from '@/components/admin/QuoteForm'
import QuoteTable from '@/components/admin/QuoteTable'
import QuoteRequestTable from '@/components/admin/QuoteRequestTable'
import QuoteFormConfigEditor from '@/components/admin/QuoteFormConfigEditor'

type Tab = 'requests' | 'pricing' | 'config'

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('requests')

  // ── Tab: Demandes reçues ──────────────────────────────────────────────────
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [reqLoading, setReqLoading] = useState(true)
  const [filterReqUniverse, setFilterReqUniverse] = useState<'all' | 'horlogerie' | 'informatique'>('all')
  const [filterReqType, setFilterReqType] = useState<'all' | 'repair' | 'custom' | 'buyback'>('all')
  const [filterReqStatus, setFilterReqStatus] = useState<'all' | QuoteRequest['status']>('all')

  const fetchRequests = async () => {
    setReqLoading(true)
    try {
      let query = supabase.from('quote_requests').select('*')
      if (filterReqUniverse !== 'all') query = query.eq('universe', filterReqUniverse)
      if (filterReqType !== 'all') query = query.eq('service_type', filterReqType)
      if (filterReqStatus !== 'all') query = query.eq('status', filterReqStatus)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setRequests((data as unknown as QuoteRequest[]) || [])
    } catch (err) {
      console.error('Erreur chargement demandes:', err)
    } finally {
      setReqLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'requests') fetchRequests()
  }, [activeTab, filterReqUniverse, filterReqType, filterReqStatus])

  const handleStatusChange = async (id: string, status: QuoteRequest['status']) => {
    await supabase.from('quote_requests').update({ status }).eq('id', id)
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const handleNotesChange = async (id: string, notes: string) => {
    await supabase.from('quote_requests').update({ notes }).eq('id', id)
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, notes } : r)))
  }

  // ── Tab: Grilles tarifaires ──────────────────────────────────────────────
  const [quotes, setQuotes] = useState<ServiceQuote[]>([])
  const [pricingLoading, setPricingLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingQuote, setEditingQuote] = useState<ServiceQuote | null>(null)
  const [filterUniverse, setFilterUniverse] = useState<'all' | 'horlogerie' | 'informatique'>('all')
  const [filterType, setFilterType] = useState<'all' | 'repair' | 'custom' | 'buyback'>('all')

  const fetchQuotes = async () => {
    setPricingLoading(true)
    try {
      let query = supabase.from('service_quotes').select('*')
      if (filterUniverse !== 'all') query = query.eq('universe', filterUniverse)
      if (filterType !== 'all') query = query.eq('service_type', filterType)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setQuotes(data || [])
    } catch (err) {
      console.error('Erreur chargement grilles:', err)
    } finally {
      setPricingLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'pricing') fetchQuotes()
  }, [activeTab, filterUniverse, filterType])

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return
    await supabase.from('service_quotes').delete().eq('id', id)
    setQuotes(quotes.filter((q) => q.id !== id))
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingQuote(null)
    fetchQuotes()
  }

  // ── Tab: Configuration formulaires ──────────────────────────────────────
  const [configs, setConfigs] = useState<QuoteFormConfig[]>([])
  const [configLoading, setConfigLoading] = useState(false)

  const fetchConfigs = async () => {
    setConfigLoading(true)
    try {
      const { data, error } = await supabase.from('quote_form_configs').select('*')
      if (error) throw error
      setConfigs((data as unknown as QuoteFormConfig[]) || [])
    } catch (err) {
      console.error('Erreur chargement configs:', err)
    } finally {
      setConfigLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'config') fetchConfigs()
  }, [activeTab])

  // ────────────────────────────────────────────────────────────────────────
  const tabStyle = (tab: Tab) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid var(--primary-color, #6366f1)' : '3px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontWeight: activeTab === tab ? 700 : 400,
    fontSize: '0.95rem',
    color: activeTab === tab ? 'var(--primary-color, #6366f1)' : '#555',
    transition: 'all 0.15s',
  })

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>💰 Devis</h1>
          <p>Gérez les demandes clients, les grilles tarifaires et la configuration des formulaires</p>
        </div>
        {activeTab === 'pricing' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Fermer' : '+ Nouvelle grille'}
          </button>
        )}
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, gap: 4 }}>
        <button style={tabStyle('requests')} onClick={() => setActiveTab('requests')}>
          📨 Demandes reçues
          {requests.length > 0 && activeTab !== 'requests' && (
            <span
              style={{
                marginLeft: 6,
                background: '#ef4444',
                color: '#fff',
                borderRadius: 10,
                padding: '1px 7px',
                fontSize: '0.75rem',
              }}
            >
              {requests.filter((r) => r.status === 'new').length || ''}
            </span>
          )}
        </button>
        <button style={tabStyle('pricing')} onClick={() => setActiveTab('pricing')}>
          💰 Grilles tarifaires
        </button>
        <button style={tabStyle('config')} onClick={() => setActiveTab('config')}>
          ⚙️ Formulaires
        </button>
      </div>

      {/* ── Demandes reçues ── */}
      {activeTab === 'requests' && (
        <>
          <div className="filters">
            <select
              value={filterReqUniverse}
              onChange={(e) => setFilterReqUniverse(e.target.value as typeof filterReqUniverse)}
              className="filter-select"
            >
              <option value="all">Tous les univers</option>
              <option value="horlogerie">⌚ Horlogerie</option>
              <option value="informatique">💻 Informatique</option>
            </select>
            <select
              value={filterReqType}
              onChange={(e) => setFilterReqType(e.target.value as typeof filterReqType)}
              className="filter-select"
            >
              <option value="all">Tous les types</option>
              <option value="repair">🔧 Réparation</option>
              <option value="custom">✨ Personnalisation</option>
              <option value="buyback">🔄 Reprise</option>
            </select>
            <select
              value={filterReqStatus}
              onChange={(e) => setFilterReqStatus(e.target.value as typeof filterReqStatus)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="new">🔵 Nouveau</option>
              <option value="read">👁️ Lu</option>
              <option value="in_progress">🔄 En cours</option>
              <option value="done">✅ Traité</option>
              <option value="rejected">❌ Refusé</option>
            </select>
          </div>
          {reqLoading ? (
            <div className="loading">Chargement des demandes...</div>
          ) : (
            <QuoteRequestTable
              requests={requests}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
            />
          )}
        </>
      )}

      {/* ── Grilles tarifaires ── */}
      {activeTab === 'pricing' && (
        <>
          <div className="filters">
            <select
              value={filterUniverse}
              onChange={(e) => setFilterUniverse(e.target.value as typeof filterUniverse)}
              className="filter-select"
            >
              <option value="all">Tous les univers</option>
              <option value="horlogerie">⌚ Horlogerie</option>
              <option value="informatique">💻 Informatique</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="filter-select"
            >
              <option value="all">Tous les types</option>
              <option value="repair">🔧 Réparation</option>
              <option value="custom">✨ Personnalisation</option>
              <option value="buyback">🔄 Reprise</option>
            </select>
          </div>
          {showForm && <QuoteForm quote={editingQuote} onClose={handleFormClose} />}
          {pricingLoading ? (
            <div className="loading">Chargement des grilles...</div>
          ) : (
            <QuoteTable
              quotes={quotes}
              onEdit={(q) => { setEditingQuote(q); setShowForm(true) }}
              onDelete={handleDeleteQuote}
            />
          )}
        </>
      )}

      {/* ── Configuration formulaires ── */}
      {activeTab === 'config' && (
        <>
          {configLoading ? (
            <div className="loading">Chargement des configurations...</div>
          ) : (
            <QuoteFormConfigEditor configs={configs} onSaved={fetchConfigs} />
          )}
        </>
      )}
    </div>
  )
}
