import Link from 'next/link'
import { UNIVERSES } from '@/utils/constants'

export const metadata = {
  title: 'Pick Sell - Hub de Shopping Alternatif',
  description: 'Découvrez deux univers distincts : Horlogerie (Ssæa Montres) et Informatique (Ordinateurs)',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          <div className="text-2xl font-bold text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-slate-900">
              Pick Sell
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenue sur Pick Sell
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Un hub unique pour explorer deux univers passionnants :
            <br />
            Découvrez les montres haut de gamme et les ordinateurs reconditionnés
          </p>
        </div>
      </section>

      {/* Two Universes Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Horlogerie Universe */}
            <UniverseCard
              universe="horlogerie"
              title={UNIVERSES.horlogerie.label}
              description="Explorez notre collection de montres Seiko Mod, montres diverses reconditionnées et accessoires. Découvrez des services de réparation et de personnalisation sur mesure."
              cta="Découvrir Ssæa Montres"
              href="/horlogerie"
              gradient={UNIVERSES.horlogerie.color}
            />

            {/* Informatique Universe */}
            <UniverseCard
              universe="informatique"
              title={UNIVERSES.informatique.label}
              description="Parcourez notre sélection d'ordinateurs et d'accessoires informatiques. Profitez de services de réparation et de nos offres de reprise."
              cta="Découvrir la Collection"
              href="/informatique"
              gradient={UNIVERSES.informatique.color}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">
            &copy; 2024-2026 Pick Sell. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/contact" className="hover:text-white transition">
              Contact & À Propos
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

interface UniverseCardProps {
  universe: 'horlogerie' | 'informatique'
  title: string
  description: string
  cta: string
  href: string
  gradient: string
}

function UniverseCard({
  title,
  description,
  cta,
  href,
  gradient,
}: UniverseCardProps) {
  return (
    <Link href={href}>
      <div
        className={`group relative overflow-hidden rounded-lg bg-gradient-to-br ${gradient} p-8 md:p-12 text-white min-h-64 flex flex-col justify-between hover:shadow-2xl transition-shadow cursor-pointer`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-pattern" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-50 line-clamp-3">{description}</p>
        </div>

        {/* CTA */}
        <div className="relative z-10 mt-6">
          <button
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform group-hover:scale-105"
          >
            {cta} →
          </button>
        </div>
      </div>
    </Link>
  )
}
