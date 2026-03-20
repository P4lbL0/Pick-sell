'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface ContactInfo {
  platform: string
  url: string
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/contacts')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.contacts) setContacts(data.contacts) })
      .catch(() => {})
  }, [])

  const PLATFORM_INFO: Record<string, { label: string; icon: string; color: string }> = {
    email:     { label: 'Email',     icon: '📧', color: 'from-blue-50 to-blue-100 border-blue-200' },
    whatsapp:  { label: 'WhatsApp',  icon: '💬', color: 'from-green-50 to-green-100 border-green-200' },
    instagram: { label: 'Instagram', icon: '📷', color: 'from-pink-50 to-pink-100 border-pink-200' },
    tiktok:    { label: 'TikTok',    icon: '🎵', color: 'from-gray-50 to-gray-100 border-gray-200' },
    vinted:    { label: 'Vinted',    icon: '🛍️', color: 'from-teal-50 to-teal-100 border-teal-200' },
  }

  const getContactDisplay = (platform: string) =>
    PLATFORM_INFO[platform] || { label: platform, icon: '🔗', color: 'from-gray-50 to-gray-100 border-gray-200' }

  function displayLabel(platform: string, url: string) {
    if (platform === 'email') return url.replace('mailto:', '')
    if (platform === 'whatsapp') return url.replace('https://wa.me/', '+')
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  }

  const horlogerieContacts = contacts.filter(c => c.universe === 'horlogerie' || c.universe === 'global')
  const informatiqueContacts = contacts.filter(c => c.universe === 'informatique' || c.universe === 'global')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Erreur lors de l\'envoi')
      }
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  function ContactCards({ list }: { list: typeof contacts }) {
    if (list.length === 0) return (
      <p className="text-gray-400 text-sm py-4">Aucun contact configuré pour le moment.</p>
    )
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {list.map(c => {
          const info = getContactDisplay(c.platform)
          return (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
              className={`bg-gradient-to-br ${info.color} p-6 rounded-xl border hover:shadow-md transition group`}>
              <div className="text-3xl mb-3">{info.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{info.label}</h3>
              <p className="text-gray-600 text-sm truncate">{displayLabel(c.platform, c.url)}</p>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 mt-2 inline-block transition">
                Nous contacter →
              </span>
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Nous Contacter</h1>
          <p className="text-gray-300 text-xl">Une question, un projet ? On vous répond sous 24h.</p>
        </div>
      </section>

      {/* Contact cards par univers */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">

          {/* Horlogerie */}
          <div className="mb-10">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⌚</span> Contact Horlogerie
            </h2>
            <ContactCards list={horlogerieContacts} />
          </div>

          {/* Informatique */}
          <div className="mb-12">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💻</span> Contact Informatique
            </h2>
            <ContactCards list={informatiqueContacts} />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
            <p className="text-gray-500 mb-8">Votre message sera transmis et nous vous répondrons rapidement.</p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-800 font-bold text-xl mb-2">Message envoyé !</p>
                <p className="text-green-700">Nous vous répondrons dans les 24h.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Nom *</label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange} required
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange} required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">Sujet *</label>
                  <select
                    id="subject" name="subject"
                    value={formData.subject} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                  >
                    <option value="">-- Sélectionnez un sujet --</option>
                    <option value="general">Question générale</option>
                    <option value="product">Question sur un produit</option>
                    <option value="repair">Service de réparation</option>
                    <option value="custom">Montre sur mesure</option>
                    <option value="buyback">Reprise d'ordinateur</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange} required
                    placeholder="Vos questions ou commentaires..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10">À Propos de Pick Sell</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">⌚ L'Univers Horlogerie</h3>
                <p className="leading-relaxed text-gray-600">Chez Ssæa Montres, nous proposons des montres Seiko modifiées exclusives, des pièces vintage restaurées et une gamme complète d'accessoires horlogers.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">💻 L'Univers Informatique</h3>
                <p className="leading-relaxed text-gray-600">Notre collection informatique propose des ordinateurs et accessoires reconditionnés de haute qualité, testés et garantis.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">🛠️ Nos Services</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>→ Réparation &amp; Révision de montres</li>
                  <li>→ Montres personnalisées sur-mesure</li>
                  <li>→ Réparation informatique</li>
                  <li>→ Reprise d'ordinateurs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Nos Valeurs</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Qualité, Transparence, Durabilité. Chaque produit est testé, chaque description est honnête.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <Link href="/horlogerie">
              <button className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl transition">⌚ Découvrir l'Horlogerie</button>
            </Link>
            <Link href="/informatique">
              <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition">💻 Découvrir l'Informatique</button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
