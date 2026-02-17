'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Service } from '@/lib/types'
import ServiceForm from '@/components/admin/ServiceForm'
import ServiceTable from '@/components/admin/ServiceTable'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [filterUniverse, setFilterUniverse] = useState<'all' | 'horlogerie' | 'informatique'>('all')

  useEffect(() => {
    fetchServices()
  }, [filterUniverse])

  const fetchServices = async () => {
    setLoading(true)
    try {
      let query = supabase.from('services').select('*')
      
      if (filterUniverse !== 'all') {
        query = query.eq('universe', filterUniverse)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return

    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingService(null)
    fetchServices()
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des services</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Fermer' : '+ Nouveau service'}
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
        <ServiceForm 
          service={editingService}
          onClose={handleFormClose}
        />
      )}

      {loading ? (
        <div className="loading">Chargement des services...</div>
      ) : (
        <ServiceTable 
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
