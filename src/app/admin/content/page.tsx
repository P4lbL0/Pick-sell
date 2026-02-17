'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ContentBlock } from '@/lib/types'
import ContentForm from '@/components/admin/ContentForm'
import ContentTable from '@/components/admin/ContentTable'

export default function ContentPage() {
  const [contents, setContents] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContents(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des contenus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bloc de contenu ?')) return

    try {
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id)
      if (error) throw error
      setContents(contents.filter(c => c.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleEdit = (content: ContentBlock) => {
    setEditingContent(content)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingContent(null)
    fetchContents()
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des contenus</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Fermer' : '+ Nouveau contenu'}
        </button>
      </div>

      {showForm && (
        <ContentForm 
          content={editingContent}
          onClose={handleFormClose}
        />
      )}

      {loading ? (
        <div className="loading">Chargement des contenus...</div>
      ) : (
        <ContentTable 
          contents={contents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
