'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HorlogerieRepairPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    watchBrand: '',
    watchModel: '',
    serviceType: '',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/horlogerie/services" className="text-amber-300 hover:text-amber-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔧 Réparation, Restauration & Révision
          </h1>
          <p className="text-xl text-amber-100">
            Confiez-nous votre montre, nous en prendrons soin avec expertise et passion.
          </p>
        </div>
      </section>

      {/* Services détails */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-bold text-gray-900 mb-2">Révision complète</h3>
              <p className="text-gray-600 text-sm">Nettoyage, lubrification et réglage du mouvement</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center">
              <div className="text-3xl mb-3">🔩</div>
              <h3 className="font-bold text-gray-900 mb-2">Remplacement de pièces</h3>
              <p className="text-gray-600 text-sm">Verre, couronne, joints, bracelet et autres composants</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-bold text-gray-900 mb-2">Restauration cosmétique</h3>
              <p className="text-gray-600 text-sm">Polissage, refinition du boîtier et du bracelet</p>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Demander un devis
            </h2>
            <p className="text-gray-600 mb-8">
              Remplissez le formulaire ci-dessous et nous vous répondrons sous 24h avec un devis personnalisé.
            </p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-bold text-xl mb-2">✓ Demande envoyée!</p>
                <p className="text-green-700">Nous vous contacterons sous 24h avec votre devis.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nom *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      placeholder="Votre nom" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="votre@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="06 XX XX XX XX" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Marque de la montre *</label>
                    <input type="text" name="watchBrand" value={formData.watchBrand} onChange={handleChange} required
                      placeholder="Ex: Seiko, Casio, Omega..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Modèle</label>
                    <input type="text" name="watchModel" value={formData.watchModel} onChange={handleChange}
                      placeholder="Ex: SKX007, Submariner..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Type de service *</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">-- Sélectionnez --</option>
                    <option value="revision">Révision complète</option>
                    <option value="repair">Réparation</option>
                    <option value="restoration">Restauration cosmétique</option>
                    <option value="battery">Changement de pile</option>
                    <option value="glass">Remplacement verre</option>
                    <option value="bracelet">Remplacement bracelet</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description du problème *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={5}
                    placeholder="Décrivez le problème ou le service souhaité en détail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white font-bold py-4 rounded-lg transition disabled:opacity-50">
                  {loading ? 'Envoi en cours...' : 'Envoyer la demande de devis'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
