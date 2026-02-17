import React from 'react'
import Link from 'next/link'

export default function InformatiqueServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/informatique" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← Retour à Informatique
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos Services Informatique
          </h1>
          <p className="text-xl text-blue-100">
            Réparation, maintenance et reprise de matériel informatique.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Réparation */}
          <Link href="/informatique/services/repair"
            className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition">
              Réparation
            </h2>
            <p className="text-gray-600 mb-4">
              Diagnostic et réparation de PC portables, ordinateurs de bureau, composants et périphériques.
            </p>
            <ul className="text-gray-500 text-sm space-y-1 mb-6">
              <li>• Remplacement d&apos;écran, clavier, batterie</li>
              <li>• Réparation carte mère</li>
              <li>• Nettoyage et changement de pâte thermique</li>
              <li>• Installation / réinstallation OS</li>
              <li>• Upgrade RAM, SSD, composants</li>
            </ul>
            <span className="text-blue-600 font-semibold group-hover:underline">
              Demander un devis →
            </span>
          </Link>

          {/* Reprise */}
          <Link href="/informatique/services/buyback"
            className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition">
              Reprise
            </h2>
            <p className="text-gray-600 mb-4">
              Faites estimer votre ancien matériel informatique et obtenez une offre de reprise.
            </p>
            <ul className="text-gray-500 text-sm space-y-1 mb-6">
              <li>• PC portables</li>
              <li>• Ordinateurs de bureau</li>
              <li>• Composants (GPU, CPU, RAM...)</li>
              <li>• Périphériques</li>
              <li>• Estimation gratuite et rapide</li>
            </ul>
            <span className="text-blue-600 font-semibold group-hover:underline">
              Demander une estimation →
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
