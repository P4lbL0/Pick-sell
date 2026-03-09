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
    { name: 'phone', label: 'Téléphone', type: 'tel', required: false, placeholder: '06 XX XX XX XX', row: 2 },
    {
      name: 'deviceType', label: "Type d'appareil", type: 'select', required: true,
      placeholder: '-- Sélectionnez --', row: 3,
      options: [
        { value: 'laptop', label: 'PC Portable' },
        { value: 'desktop', label: 'PC Bureau / Tour' },
        { value: 'all-in-one', label: 'PC All-in-One' },
        { value: 'gpu', label: 'Carte graphique' },
        { value: 'cpu', label: 'Processeur' },
        { value: 'ram', label: 'RAM' },
        { value: 'other-component', label: 'Autre composant' },
        { value: 'peripheral', label: 'Périphérique' },
      ],
    },
    { name: 'brand', label: 'Marque', type: 'text', required: true, placeholder: 'Ex: Asus, Dell, HP, MSI...', row: 3 },
    { name: 'model', label: 'Modèle', type: 'text', required: true, placeholder: 'Ex: ROG Strix G15, RTX 4070...', row: 3 },
    {
      name: 'condition', label: 'État général', type: 'select', required: true,
      placeholder: '-- Sélectionnez --', row: 4,
      options: [
        { value: 'like-new', label: 'Comme neuf (quasi pas utilisé)' },
        { value: 'excellent', label: "Excellent (très bon état, traces minimes)" },
        { value: 'good', label: "Bon état (quelques traces d'usure normales)" },
        { value: 'fair', label: 'État correct (usure visible, tout fonctionne)' },
        { value: 'poor', label: 'État moyen (défauts cosmétiques, fonctionne)' },
        { value: 'broken', label: "En panne / ne s'allume plus" },
      ],
    },
    { name: 'processor', label: 'Processeur', type: 'text', required: false, placeholder: 'Ex: Intel i7-12700H, Ryzen 5 5600X...', row: 5 },
    { name: 'ram', label: 'RAM', type: 'text', required: false, placeholder: 'Ex: 16 Go DDR4, 32 Go DDR5...', row: 5 },
    { name: 'storage', label: 'Stockage', type: 'text', required: false, placeholder: 'Ex: 512 Go SSD NVMe, 1 To HDD...', row: 6 },
    { name: 'gpu', label: 'Carte graphique', type: 'text', required: false, placeholder: 'Ex: RTX 4060, RX 7600...', row: 6 },
    { name: 'additionalInfo', label: 'Informations complémentaires', type: 'textarea', required: false, placeholder: "Accessoires inclus, défauts éventuels, facture d'achat, date d'achat...", row: 7 },
  ],
}

export default function InformatiqueBuybackPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/informatique/services" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">💰 Reprise de Matériel</h1>
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
              <div className="text-3xl mb-3">📋</div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demander une estimation</h2>
            <p className="text-gray-600 mb-8">
              Donnez-nous les détails de votre matériel pour recevoir une offre de reprise.
            </p>
            <QuoteRequestForm
              universe="informatique"
              serviceType="buyback"
              accentColor="blue"
              defaultConfig={DEFAULT_CONFIG}
              successTitle="✓ Demande envoyée!"
              successMessage="Nous étudions votre matériel et vous enverrons une offre sous 48h."
              submitLabel="Demander mon estimation de reprise"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
