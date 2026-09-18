'use client'

import React, { useState, useEffect } from 'react'
import { adminApi } from '@/lib/admin-api'
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
      const data = await adminApi<ContentBlock[]>('content-blocks')
      setContents(data.map(c => ({ ...c, id: String(c.id) })))
    } catch (error) {
      console.error('Erreur lors du chargement des contenus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bloc de contenu ?')) return

    try {
      await adminApi(`content-blocks?id=${id}`, { method: 'DELETE' })
      setContents(contents.filter(c => c.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression')
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
