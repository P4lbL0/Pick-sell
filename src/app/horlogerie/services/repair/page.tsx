'use client'

import React from 'react'
import Link from 'next/link'
import QuoteRequestForm from '@/components/common/QuoteRequestForm'
import type { QuoteFormConfig } from '@/lib/types'

const DEFAULT_CONFIG: QuoteFormConfig = {
  universe: 'horlogerie',
  service_type: 'repair',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, placeholder: 'Votre nom', row: 1 },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'votre@email.com', row: 1 },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: false, placeholder: '06 XX XX XX XX', row: 2 },
    { name: 'watchBrand', label: 'Marque de la montre', type: 'text', required: true, placeholder: 'Ex: Seiko, Casio, Omega...', row: 3 },
    { name: 'watchModel', label: 'Modèle', type: 'text', required: false, placeholder: 'Ex: SKX007, Submariner...', row: 3 },
    {
      name: 'serviceType', label: 'Type de service', type: 'select', required: true,
      placeholder: '-- Sélectionnez --', row: 4,
      options: [
        { value: 'revision', label: 'Révision complète' },
        { value: 'repair', label: 'Réparation' },
        { value: 'restoration', label: 'Restauration cosmétique' },
        { value: 'battery', label: 'Changement de pile' },
        { value: 'glass', label: 'Remplacement verre' },
        { value: 'bracelet', label: 'Remplacement bracelet' },
        { value: 'other', label: 'Autre' },
      ],
    },
    { name: 'description', label: 'Description du problème', type: 'textarea', required: true, placeholder: 'Décrivez le problème ou le service souhaité en détail...', row: 5 },
  ],
}

export default function HorlogerieRepairPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/horlogerie/services" className="text-amber-300 hover:text-amber-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔧 Réparation, Restauration &amp; Révision
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demander un devis</h2>
            <p className="text-gray-600 mb-8">
              Remplissez le formulaire ci-dessous et nous vous répondrons sous 24h avec un devis personnalisé.
            </p>
            <QuoteRequestForm
              universe="horlogerie"
              serviceType="repair"
              accentColor="amber"
              defaultConfig={DEFAULT_CONFIG}
              successMessage="Nous vous contacterons sous 24h avec votre devis."
            />
          </div>
        </div>
      </section>
    </main>
  )
}
