import Link from 'next/link'

export default function HorlogerieServicesPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Services Horlogerie
          </h1>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl">
            Nous proposons une gamme complète de services pour vos montres : réparation, révision et personnalisation sur mesure.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Réparation */}
            <Link href="/horlogerie/services/repair">
              <div className="group bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-10 border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer">
                <div className="text-5xl mb-6">🔧</div>
                <h2 className="text-3xl font-bold text-amber-900 mb-4 group-hover:text-amber-700 transition-colors">
                  Réparation, Restauration & Révision
                </h2>
                <p className="text-amber-800 text-lg mb-8">
                  Nos experts restaurent et réparent vos montres avec soin. Révision complète, remplacement de pièces, restauration cosmétique.
                </p>
                <div className="inline-block bg-amber-900 text-white px-8 py-3 rounded-lg font-bold group-hover:bg-amber-800 transition">
                  Demander un devis →
                </div>
              </div>
            </Link>

            {/* Personnalisation */}
            <Link href="/horlogerie/services/custom">
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 border-2 border-slate-200 hover:border-slate-400 hover:shadow-xl transition-all cursor-pointer">
                <div className="text-5xl mb-6">✨</div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                  Montre Personnalisée / Sur-mesure
                </h2>
                <p className="text-slate-800 text-lg mb-8">
                  Créez votre propre montre. Choisissez les éléments, les finitions et les spécifications. Une pièce unique à votre image.
                </p>
                <div className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-bold group-hover:bg-slate-800 transition">
                  Demander un devis →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
