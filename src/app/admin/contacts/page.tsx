'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact } from '@/lib/types'
import ContactForm from '@/components/admin/ContactForm'
import ContactTable from '@/components/admin/ContactTable'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('platform', { ascending: true })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir suppirmer ce contact ?')) return

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
      if (error) throw error
      setContacts(contacts.filter(c => c.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingContact(null)
    fetchContacts()
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des contacts</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Fermer' : '+ Nouveau contact'}
        </button>
      </div>

      {showForm && (
        <ContactForm 
          contact={editingContact}
          onClose={handleFormClose}
        />
      )}

      {loading ? (
        <div className="loading">Chargement des contacts...</div>
      ) : (
        <ContactTable 
          contacts={contacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
