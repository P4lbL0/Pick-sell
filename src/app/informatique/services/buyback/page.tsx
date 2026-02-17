'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function InformatiqueBuybackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    brand: '',
    model: '',
    condition: '',
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    additionalInfo: '',
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
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/informatique/services" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💰 Reprise de Matériel
          </h1>
          <p className="text-xl text-blue-100">
            Faites estimer votre ancien matériel informatique et obtenez une offre de reprise.
          </p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">📝</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Décrivez votre matériel</h3>
              <p className="text-gray-600 text-sm">Remplissez le formulaire avec les détails de votre appareil</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Estimation gratuite</h3>
              <p className="text-gray-600 text-sm">Nous vous envoyons une offre sous 24 à 48h</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">💶</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Reprise immédiate</h3>
              <p className="text-gray-600 text-sm">Si l&apos;offre vous convient, paiement rapide et simple</p>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Demander une estimation
            </h2>
            <p className="text-gray-600 mb-8">
              Donnez-nous les détails de votre matériel pour recevoir une offre de reprise.
            </p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-bold text-xl mb-2">✓ Demande envoyée!</p>
                <p className="text-green-700">Nous étudions votre matériel et vous enverrons une offre sous 48h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nom *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      placeholder="Votre nom" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="votre@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="06 XX XX XX XX" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Type d&apos;appareil *</label>
                    <select name="deviceType" value={formData.deviceType} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">-- Sélectionnez --</option>
                      <option value="laptop">PC Portable</option>
                      <option value="desktop">PC Bureau / Tour</option>
                      <option value="all-in-one">PC All-in-One</option>
                      <option value="gpu">Carte graphique</option>
                      <option value="cpu">Processeur</option>
                      <option value="ram">RAM</option>
                      <option value="other-component">Autre composant</option>
                      <option value="peripheral">Périphérique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Marque *</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} required
                      placeholder="Ex: Asus, Dell, HP, MSI..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Modèle *</label>
                    <input type="text" name="model" value={formData.model} onChange={handleChange} required
                      placeholder="Ex: ROG Strix G15, RTX 4070..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">État général *</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">-- Sélectionnez --</option>
                    <option value="like-new">Comme neuf (quasi pas utilisé)</option>
                    <option value="excellent">Excellent (très bon état, traces minimes)</option>
                    <option value="good">Bon état (quelques traces d&apos;usure normales)</option>
                    <option value="fair">État correct (usure visible, tout fonctionne)</option>
                    <option value="poor">État moyen (défauts cosmétiques, fonctionne)</option>
                    <option value="broken">En panne / ne s&apos;allume plus</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Processeur</label>
                    <input type="text" name="processor" value={formData.processor} onChange={handleChange}
                      placeholder="Ex: Intel i7-12700H, Ryzen 5 5600X..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">RAM</label>
                    <input type="text" name="ram" value={formData.ram} onChange={handleChange}
                      placeholder="Ex: 16 Go DDR4, 32 Go DDR5..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Stockage</label>
                    <input type="text" name="storage" value={formData.storage} onChange={handleChange}
                      placeholder="Ex: 512 Go SSD NVMe, 1 To HDD..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Carte graphique</label>
                    <input type="text" name="gpu" value={formData.gpu} onChange={handleChange}
                      placeholder="Ex: RTX 4060, RX 7600..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Informations complémentaires</label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4}
                    placeholder="Accessoires inclus, défauts éventuels, facture d'achat, date d'achat..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition disabled:opacity-50">
                  {loading ? 'Envoi en cours...' : 'Demander mon estimation de reprise'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
