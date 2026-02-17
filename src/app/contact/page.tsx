'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nous Contacter
            </h1>
            <p className="text-xl text-gray-600">
              Une question? Un problème? Nous sommes là pour vous aider!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Email */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-700">
                <a href="mailto:contact@picksell.fr" className="text-blue-600 hover:underline font-semibold">
                  contact@picksell.fr
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-2">Réponse sous 24h</p>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg border border-green-200">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-700">
                <a href="tel:+33123456789" className="text-green-600 hover:underline font-semibold">
                  +33 1 23 45 67 89
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-2">Lun-Ven 9h-18h</p>
            </div>

            {/* Whatsapp */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-lg border border-amber-200">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-700">
                <a href="https://wa.me/33123456789" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">
                  Nous écrire
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-2">Réponse rapide</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Envoyez-nous un message
            </h2>

            {submitted && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold">
                  ✓ Merci! Votre message a été envoyé avec succès.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Sélectionnez un sujet --</option>
                  <option value="general">Question générale</option>
                  <option value="product">Question sur un produit</option>
                  <option value="repair">Service de réparation</option>
                  <option value="custom">Montre sur mesure / Personnalisée</option>
                  <option value="buyback">Reprise d'ordinateur</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Vos questions ou commentaires..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            À Propos de Pick Sell
          </h2>

          <div className="space-y-8 text-lg text-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Notre Mission</h3>
              <p>
                Pick Sell est une plateforme unique qui réunit deux passions distinctes: 
                l'horlogerie haut de gamme (Ssæa Montres) et l'informatique reconditionnée. 
                Notre objectif est de vous proposer des produits de qualité, soigneusement 
                sélectionnés et expertement traités.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">⌚ L'Univers Horlogerie</h3>
              <p>
                Chez Ssæa Montres, nous nous dédions à l'art de l'horlogerie. Nous proposons 
                des montres Seiko modifiées exclusives, des pièces vintage restaurées avec soin, 
                et une gamme complète d'accessoires horlogers. Chaque montre est sélectionnée 
                avec rigueur et traitée avec expertise.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💻 L'Univers Informatique</h3>
              <p>
                Notre collection informatique propose des ordinateurs et accessoires reconditionnés 
                de haute qualité. Nous croyons en l'informatique durable et écologique, sans compromis 
                sur la performance. Tous nos produits sont testés et garantis.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Nos Services</h3>
              <p>
                Au-delà des produits, nous offrons une gamme complète de services:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li><strong>Réparation & Révision:</strong> Expertise horlogère et informatique</li>
                <li><strong>Personnalisation:</strong> Montres sur mesure selon vos spécifications</li>
                <li><strong>Reprise:</strong> Nous rachetons vos anciens produits</li>
                <li><strong>Conseil:</strong> Guidance experte pour vos achats</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Nos Valeurs</h3>
              <p>
                <strong>Qualité:</strong> Chaque produit est minutieusement sélectionné et testé.
              </p>
              <p className="mt-2">
                <strong>Transparence:</strong> Prix justes, descriptions honnêtes, service attentionné.
              </p>
              <p className="mt-2">
                <strong>Durabilité:</strong> Nous croyons en la réparation, la restauration et le reconditionnement responsable.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-12 border-t border-gray-300 text-center">
            <p className="text-gray-700 mb-6">
              Prêt à explorer nos deux univers?
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/horlogerie">
                <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition">
                  ⌚ Découvrir l'Horlogerie
                </button>
              </Link>
              <Link href="/informatique">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                  💻 Découvrir l'Informatique
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
