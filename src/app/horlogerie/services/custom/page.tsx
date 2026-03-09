'use client'

import React from 'react'
import Link from 'next/link'
import QuoteRequestForm from '@/components/common/QuoteRequestForm'
import type { QuoteFormConfig } from '@/lib/types'

const DEFAULT_CONFIG: QuoteFormConfig = {
  universe: 'horlogerie',
  service_type: 'custom',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, placeholder: 'Votre nom', row: 1 },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'votre@email.com', row: 1 },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: false, placeholder: '06 XX XX XX XX', row: 2 },
    { name: 'baseModel', label: 'Modèle de base', type: 'text', required: true, placeholder: 'Ex: Seiko SKX007, NH35 build, Vostok Amphibia...', row: 3 },
    {
      name: 'modifications', label: 'Modifications souhaitées', type: 'checkbox-group', required: false, row: 4,
      options: [
        { value: 'dial', label: 'Cadran personnalisé' },
        { value: 'hands', label: 'Aiguilles' },
        { value: 'bezel', label: 'Lunette / Bezel insert' },
        { value: 'crystal', label: 'Verre saphir' },
        { value: 'crown', label: 'Couronne' },
        { value: 'caseback', label: 'Fond de boîtier' },
        { value: 'strap', label: 'Bracelet / Strap' },
        { value: 'chapter-ring', label: 'Chapter ring' },
      ],
    },
    { name: 'dialColor', label: 'Couleur du cadran souhaitée', type: 'text', required: false, placeholder: 'Ex: Bleu soleillé, Noir mat, Vert...', row: 5 },
    { name: 'handsStyle', label: "Style d'aiguilles", type: 'text', required: false, placeholder: 'Ex: Mercedes, Dauphine, Sword...', row: 5 },
    {
      name: 'budget', label: 'Budget estimé', type: 'select', required: false,
      placeholder: '-- Sélectionnez --', row: 6,
      options: [
        { value: '100-200', label: '100€ - 200€' },
        { value: '200-400', label: '200€ - 400€' },
        { value: '400-600', label: '400€ - 600€' },
        { value: '600+', label: '600€ et plus' },
      ],
    },
    { name: 'additionalNotes', label: 'Notes supplémentaires', type: 'textarea', required: false, placeholder: 'Partagez vos inspirations, liens vers des images, préférences...', row: 7 },
  ],
}

export default function HorlogerieCustomPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/horlogerie/services" className="text-amber-300 hover:text-amber-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎨 Montre Personnalisée</h1>
          <p className="text-xl text-amber-100">
            Créez la montre de vos rêves avec notre service de personnalisation sur mesure.
          </p>
        </div>
      </section>

      {/* Exemples */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">🔧 Seiko Mod</h3>
              <p className="text-gray-600 text-sm mb-3">
                Nous sommes spécialisés dans le modding Seiko. Transformez votre SKX, Turtle ou autre base Seiko en une pièce unique.
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
                Partez de zéro et concevez votre montre idéale. Choisissez chaque composant pour un résultat 100% personnel.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Choix du boîtier</li>
                <li>• Mouvement NH35/NH36</li>
                <li>• Assemblage professionnel</li>
                <li>• Test d&apos;étanchéité</li>
              </ul>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demander un devis personnalisation</h2>
            <p className="text-gray-600 mb-8">
              Décrivez votre projet et nous vous enverrons un devis détaillé sous 48h.
            </p>
            <QuoteRequestForm
              universe="horlogerie"
              serviceType="custom"
              accentColor="amber"
              defaultConfig={DEFAULT_CONFIG}
              successTitle="✓ Projet reçu!"
              successMessage="Nous étudions votre projet et vous contacterons sous 48h."
              submitLabel="Envoyer mon projet de personnalisation"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
