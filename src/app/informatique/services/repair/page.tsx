'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function InformatiqueRepairPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    brand: '',
    model: '',
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
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/informatique/services" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔧 Réparation Informatique
          </h1>
          <p className="text-xl text-blue-100">
            Diagnostic et réparation de tous types de matériel informatique.
          </p>
        </div>
      </section>

      {/* Services détails */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-bold text-gray-900 mb-2">PC Portable</h3>
              <p className="text-gray-600 text-sm">Écran, clavier, batterie, charnières, carte mère</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">🖥️</div>
              <h3 className="font-bold text-gray-900 mb-2">PC Bureau / Tour</h3>
              <p className="text-gray-600 text-sm">Diagnostic, upgrade, nettoyage, remplacement composants</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">Software</h3>
              <p className="text-gray-600 text-sm">Installation OS, suppression virus, récupération données</p>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Demander un devis réparation
            </h2>
            <p className="text-gray-600 mb-8">
              Décrivez votre problème et nous vous enverrons un diagnostic + devis sous 24h.
            </p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-bold text-xl mb-2">✓ Demande envoyée!</p>
                <p className="text-green-700">Nous vous contacterons sous 24h avec un diagnostic et devis.</p>
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
                      <option value="component">Composant seul</option>
                      <option value="peripheral">Périphérique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Marque *</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} required
                      placeholder="Ex: Asus, Dell, HP..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Modèle</label>
                    <input type="text" name="model" value={formData.model} onChange={handleChange}
                      placeholder="Ex: ROG Strix G15..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Type de service *</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">-- Sélectionnez --</option>
                    <option value="screen">Remplacement écran</option>
                    <option value="keyboard">Remplacement clavier</option>
                    <option value="battery">Remplacement batterie</option>
                    <option value="motherboard">Réparation carte mère</option>
                    <option value="thermal">Nettoyage + pâte thermique</option>
                    <option value="upgrade">Upgrade (RAM, SSD, etc.)</option>
                    <option value="os">Installation / réinstallation OS</option>
                    <option value="virus">Suppression virus / malware</option>
                    <option value="data">Récupération de données</option>
                    <option value="diagnostic">Diagnostic complet</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description du problème *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={5}
                    placeholder="Décrivez le problème rencontré : quand est-ce arrivé, symptômes, messages d'erreur..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition disabled:opacity-50">
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
