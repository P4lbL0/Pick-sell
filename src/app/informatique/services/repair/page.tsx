'use client'

import React from 'react'
import Link from 'next/link'
import QuoteRequestForm from '@/components/common/QuoteRequestForm'
import type { QuoteFormConfig } from '@/lib/types'

const DEFAULT_CONFIG: QuoteFormConfig = {
  universe: 'informatique',
  service_type: 'repair',
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
        { value: 'component', label: 'Composant seul' },
        { value: 'peripheral', label: 'Périphérique' },
        { value: 'other', label: 'Autre' },
      ],
    },
    { name: 'brand', label: 'Marque', type: 'text', required: true, placeholder: 'Ex: Asus, Dell, HP...', row: 3 },
    { name: 'model', label: 'Modèle', type: 'text', required: false, placeholder: 'Ex: ROG Strix G15...', row: 3 },
    {
      name: 'serviceType', label: 'Type de service', type: 'select', required: true,
      placeholder: '-- Sélectionnez --', row: 4,
      options: [
        { value: 'screen', label: 'Remplacement écran' },
        { value: 'keyboard', label: 'Remplacement clavier' },
        { value: 'battery', label: 'Remplacement batterie' },
        { value: 'motherboard', label: 'Réparation carte mère' },
        { value: 'thermal', label: 'Nettoyage + pâte thermique' },
        { value: 'upgrade', label: 'Upgrade (RAM, SSD, etc.)' },
        { value: 'os', label: 'Installation / réinstallation OS' },
        { value: 'virus', label: 'Suppression virus / malware' },
        { value: 'data', label: 'Récupération de données' },
        { value: 'diagnostic', label: 'Diagnostic complet' },
        { value: 'other', label: 'Autre' },
      ],
    },
    { name: 'description', label: 'Description du problème', type: 'textarea', required: true, placeholder: "Décrivez le problème rencontré : quand est-ce arrivé, symptômes, messages d'erreur...", row: 5 },
  ],
}

export default function InformatiqueRepairPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/informatique/services" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔧 Réparation Informatique</h1>
          <p className="text-xl text-blue-100">
            Diagnostic et réparation de tous types de matériel informatique.
          </p>
        </div>
      </section>

      {/* Services */}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demander un devis réparation</h2>
            <p className="text-gray-600 mb-8">
              Décrivez votre problème et nous vous enverrons un diagnostic + devis sous 24h.
            </p>
            <QuoteRequestForm
              universe="informatique"
              serviceType="repair"
              accentColor="blue"
              defaultConfig={DEFAULT_CONFIG}
              successMessage="Nous vous contacterons sous 24h avec un diagnostic et devis."
            />
          </div>
        </div>
      </section>
    </main>
  )
}
