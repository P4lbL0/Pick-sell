'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HorlogerieCustomPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    baseModel: '',
    modifications: [] as string[],
    dialColor: '',
    handsStyle: '',
    bezelType: '',
    strapType: '',
    budget: '',
    additionalNotes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      modifications: checked
        ? [...prev.modifications, value]
        : prev.modifications.filter(m => m !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  const modOptions = [
    { value: 'dial', label: 'Cadran personnalisé' },
    { value: 'hands', label: 'Aiguilles' },
    { value: 'bezel', label: 'Lunette / Bezel insert' },
    { value: 'crystal', label: 'Verre saphir' },
    { value: 'crown', label: 'Couronne' },
    { value: 'caseback', label: 'Fond de boîtier' },
    { value: 'strap', label: 'Bracelet / Strap' },
    { value: 'chapter-ring', label: 'Chapter ring' },
  ]

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/horlogerie/services" className="text-amber-300 hover:text-amber-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎨 Montre Personnalisée
          </h1>
          <p className="text-xl text-amber-100">
            Créez la montre de vos rêves avec notre service de personnalisation sur mesure.
          </p>
        </div>
      </section>

      {/* Exemples de personnalisation */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">🔧 Seiko Mod</h3>
              <p className="text-gray-600 text-sm mb-3">
                Nous sommes spécialisés dans le modding Seiko. Transformez votre SKX, Turtle ou
                autre base Seiko en une pièce unique.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Cadrans custom</li>
                <li>• Aiguilles premium</li>
                <li>• Lunettes céramique</li>
                <li>• Verres saphir</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">✨ Build complet</h3>
              <p className="text-gray-600 text-sm mb-3">
                Partez de zéro et concevez votre montre idéale. Choisissez chaque composant
                pour un résultat 100% personnel.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Choix du boîtier</li>
                <li>• Mouvement NH35/NH36</li>
                <li>• Assemblage professionnel</li>
                <li>• Test d'étanchéité</li>
              </ul>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Demander un devis personnalisation
            </h2>
            <p className="text-gray-600 mb-8">
              Décrivez votre projet et nous vous enverrons un devis détaillé sous 48h.
            </p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-800 font-bold text-xl mb-2">✓ Projet reçu!</p>
                <p className="text-green-700">Nous étudions votre projet et vous contacterons sous 48h.</p>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Modèle de base *</label>
                  <input type="text" name="baseModel" value={formData.baseModel} onChange={handleChange} required
                    placeholder="Ex: Seiko SKX007, NH35 build, Vostok Amphibia..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Modifications souhaitées *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {modOptions.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-amber-400 cursor-pointer transition">
                        <input type="checkbox" value={opt.value} checked={formData.modifications.includes(opt.value)}
                          onChange={handleCheckbox} className="rounded text-amber-600 focus:ring-amber-500" />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Couleur du cadran souhaitée</label>
                    <input type="text" name="dialColor" value={formData.dialColor} onChange={handleChange}
                      placeholder="Ex: Bleu soleillé, Noir mat, Vert..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Style d&apos;aiguilles</label>
                    <input type="text" name="handsStyle" value={formData.handsStyle} onChange={handleChange}
                      placeholder="Ex: Mercedes, Dauphine, Sword..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Budget estimé</label>
                  <select name="budget" value={formData.budget} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="">-- Sélectionnez --</option>
                    <option value="100-200">100€ - 200€</option>
                    <option value="200-400">200€ - 400€</option>
                    <option value="400-600">400€ - 600€</option>
                    <option value="600+">600€ et plus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Notes supplémentaires</label>
                  <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={5}
                    placeholder="Partagez vos inspirations, liens vers des images, préférences... Toute info est utile!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white font-bold py-4 rounded-lg transition disabled:opacity-50">
                  {loading ? 'Envoi en cours...' : 'Envoyer mon projet de personnalisation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
