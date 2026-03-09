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
    { name: 'phone', label: 'TÃ©lÃ©phone', type: 'tel', required: false, placeholder: '06 XX XX XX XX', row: 2 },
    { name: 'baseModel', label: 'ModÃ¨le de base', type: 'text', required: true, placeholder: 'Ex: Seiko SKX007, NH35 build, Vostok Amphibia...', row: 3 },
    {
      name: 'modifications', label: 'Modifications souhaitÃ©es', type: 'checkbox-group', required: false, row: 4,
      options: [
        { value: 'dial', label: 'Cadran personnalisÃ©' },
        { value: 'hands', label: 'Aiguilles' },
        { value: 'bezel', label: 'Lunette / Bezel insert' },
        { value: 'crystal', label: 'Verre saphir' },
        { value: 'crown', label: 'Couronne' },
        { value: 'caseback', label: 'Fond de boÃ®tier' },
        { value: 'strap', label: 'Bracelet / Strap' },
        { value: 'chapter-ring', label: 'Chapter ring' },
      ],
    },
    { name: 'dialColor', label: 'Couleur du cadran souhaitÃ©e', type: 'text', required: false, placeholder: "Ex: Bleu soleillÃ©, Noir mat, Vert...", row: 5 },
    { name: 'handsStyle', label: "Style d'aiguilles", type: 'text', required: false, placeholder: 'Ex: Mercedes, Dauphine, Sword...', row: 5 },
    {
      name: 'budget', label: 'Budget estimÃ©', type: 'select', required: false,
      placeholder: '-- SÃ©lectionnez --', row: 6,
      options: [
        { value: '100-200', label: '100â‚¬ - 200â‚¬' },
        { value: '200-400', label: '200â‚¬ - 400â‚¬' },
        { value: '400-600', label: '400â‚¬ - 600â‚¬' },
        { value: '600+', label: '600â‚¬ et plus' },
      ],
    },
    { name: 'additionalNotes', label: 'Notes supplÃ©mentaires', type: 'textarea', required: false, placeholder: 'Partagez vos inspirations, liens vers des images, prÃ©fÃ©rences...', row: 7 },
  ],
}

export default function HorlogerieCustomPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-900 to-amber-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/horlogerie/services" className="text-amber-300 hover:text-amber-200 mb-4 inline-block">
            â† Retour aux services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ðŸŽ¨ Montre PersonnalisÃ©e</h1>
          <p className="text-xl text-amber-100">
            CrÃ©ez la montre de vos rÃªves avec notre service de personnalisation sur mesure.
          </p>
        </div>
      </section>

      {/* Exemples */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">ðŸ”§ Seiko Mod</h3>
              <p className="text-gray-600 text-sm mb-3">
                Nous sommes spÃ©cialisÃ©s dans le modding Seiko. Transformez votre SKX, Turtle ou autre base Seiko en une piÃ¨ce unique.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>â€¢ Cadrans custom</li>
                <li>â€¢ Aiguilles premium</li>
                <li>â€¢ Lunettes cÃ©ramique</li>
                <li>â€¢ Verres saphir</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">âœ¨ Build complet</h3>
              <p className="text-gray-600 text-sm mb-3">
                Partez de zÃ©ro et concevez votre montre idÃ©ale. Choisissez chaque composant pour un rÃ©sultat 100% personnel.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>â€¢ Choix du boÃ®tier</li>
                <li>â€¢ Mouvement NH35/NH36</li>
                <li>â€¢ Assemblage professionnel</li>
                <li>â€¢ Test d&apos;Ã©tanchÃ©itÃ©</li>
              </ul>
            </div>
          </div>

          {/* Formulaire devis */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Demander un devis personnalisation</h2>
            <p className="text-gray-600 mb-8">
              DÃ©crivez votre projet et nous vous enverrons un devis dÃ©taillÃ© sous 48h.
            </p>
            <QuoteRequestForm
              universe="horlogerie"
              serviceType="custom"
              accentColor="amber"
              defaultConfig={DEFAULT_CONFIG}
              successTitle="âœ“ Projet reÃ§u!"
              successMessage="Nous Ã©tudions votre projet et vous contacterons sous 48h."
              submitLabel="Envoyer mon projet de personnalisation"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
