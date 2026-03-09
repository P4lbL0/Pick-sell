'use client'

import React from 'react'
import Link from 'next/link'
import QuoteRequestForm from '@/components/common/QuoteRequestForm'
import type { QuoteFormConfig } from '@/lib/types'

const DEFAULT_CONFIG: QuoteFormConfig = {
  universe: 'informatique',
  service_type: 'buyback',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, placeholder: 'Votre nom', row: 1 },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'votre@email.com', row: 1 },
    { name: 'phone', label: 'TÃ©lÃ©phone', type: 'tel', required: false, placeholder: '06 XX XX XX XX', row: 2 },
    {
      name: 'deviceType', label: "Type d'appareil", type: 'select', required: true,
      placeholder: '-- SÃ©lectionnez --', row: 3,
      options: [
        { value: 'laptop', label: 'PC Portable' },
        { value: 'desktop', label: 'PC Bureau / Tour' },
        { value: 'all-in-one', label: 'PC All-in-One' },
        { value: 'gpu', label: 'Carte graphique' },
        { value: 'cpu', label: 'Processeur' },
        { value: 'ram', label: 'RAM' },
        { value: 'other-component', label: 'Autre composant' },
        { value: 'peripheral', label: 'PÃ©riphÃ©rique' },
      ],
    },
    { name: 'brand', label: 'Marque', type: 'text', required: true, placeholder: 'Ex: Asus, Dell, HP, MSI...', row: 3 },
    { name: 'model', label: 'ModÃ¨le', type: 'text', required: true, placeholder: 'Ex: ROG Strix G15, RTX 4070...', row: 3 },
    {
      name: 'condition', label: 'Ã‰tat gÃ©nÃ©ral', type: 'select', required: true,
      placeholder: '-- SÃ©lectionnez --', row: 4,
      options: [
        { value: 'like-new', label: 'Comme neuf (quasi pas utilisÃ©)' },
        { value: 'excellent', label: 'Excellent (trÃ¨s bon Ã©tat, traces minimes)' },
        { value: 'good', label: "Bon Ã©tat (quelques traces d'usure normales)" },
        { value: 'fair', label: 'Ã‰tat correct (usure visible, tout fonctionne)' },
        { value: 'poor', label: 'Ã‰tat moyen (dÃ©fauts cosmÃ©tiques, fonctionne)' },
        { value: 'broken', label: "En panne / ne s'allume plus" },
      ],
    },
    { name: 'processor', label: 'Processeur', type: 'text', required: false, placeholder: 'Ex: Intel i7-12700H, Ryzen 5 5600X...', row: 5 },
    { name: 'ram', label: 'RAM', type: 'text', required: false, placeholder: 'Ex: 16 Go DDR4, 32 Go DDR5...', row: 5 },
    { name: 'storage', label: 'Stockage', type: 'text', required: false, placeholder: 'Ex: 512 Go SSD NVMe, 1 To HDD...', row: 6 },
    { name: 'gpu', label: 'Carte graphique', type: 'text', required: false, placeholder: 'Ex: RTX 4060, RX 7600...', row: 6 },
    { name: 'additionalInfo', label: 'Informations complÃ©mentaires', type: 'textarea', required: false, placeholder: "Accessoires inclus, dÃ©fauts Ã©ventuels, facture d'achat, date d'achat...", row: 7 },
  ],
}

export default function InformatiqueBuybackPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/informatique/services" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            â† Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ðŸ’° Reprise de MatÃ©riel</h1>
          <p className="text-xl text-blue-100">
            Faites estimer votre ancien matÃ©riel informatique et obtenez une offre de reprise.
          </p>
        </div>
      </section>

      {/* Comment Ã§a marche */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Comment Ã§a marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">ðŸ“</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
              <h3 className="font-bold text-gray-900 mb-2">DÃ©crivez votre matÃ©riel</h3>
              <p className="text-gray-600 text-sm">Remplissez le formulaire avec les dÃ©tails de votre appareil</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">ðŸ”</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Estimation gratuite</h3>
              <p className="text-gray-600 text-sm">Nous vous envoyons une offre sous 24 Ã  48h</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-3xl mb-3">ðŸ’¶</div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Reprise immÃ©diate</h3>
              <p className="text-gray-600 text-sm">Si l&apos;offre vous convient, paiement rapide et simple</p>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demander une estimation</h2>
            <p className="text-gray-600 mb-8">
              Donnez-nous les dÃ©tails de votre matÃ©riel pour recevoir une offre de reprise.
            </p>
            <QuoteRequestForm
              universe="informatique"
              serviceType="buyback"
              accentColor="blue"
              defaultConfig={DEFAULT_CONFIG}
              successTitle="âœ“ Demande envoyÃ©e!"
              successMessage="Nous Ã©tudions votre matÃ©riel et vous enverrons une offre sous 48h."
              submitLabel="Demander mon estimation de reprise"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
