import { HeroSlider } from '@/components/common/HeroSlider'
import { FilteredProducts } from '@/components/common/FilteredProducts'
import { ContentSection } from '@/components/common/ContentSection'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 60

async function getInformatiqueProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('universe', 'informatique')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch { return [] }
}

async function getHeroSlides() {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .in('universe_type', ['informatique', 'global'])
      .order('order_index', { ascending: true })
    if (error) throw error
    return data || []
  } catch { return [] }
}

async function getConceptBlock() {
  try {
    const { data } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('key', 'concept-informatique')
      .single()
    return data || null
  } catch { return null }
}

export default async function InformatiqueHome() {
  const [products, heroSlides, conceptBlock] = await Promise.all([
    getInformatiqueProducts(),
    getHeroSlides(),
    getConceptBlock(),
  ])


  return (
    <main className="min-h-screen">

      {/* Hero Slider — pleine largeur */}
      {heroSlides.length > 0 ? (
        <section className="mb-12 md:mb-16">
          <HeroSlider slides={heroSlides} autoplay={true} />
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-28 md:py-40 mb-12 md:mb-16 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Informatique reconditionnée</p>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Performance<br />Durable
            </h1>
            <p className="text-slate-300/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Ordinateurs et accessoires testés, garantis. Une alternative écologique et économique sans compromis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/informatique/services/repair">
                <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition shadow-lg">
                  🔧 Réparer mon PC
                </button>
              </Link>
              <Link href="/informatique/services/buyback">
                <button className="px-8 py-3 bg-slate-600/50 text-white font-bold rounded-xl hover:bg-slate-600/70 transition border border-slate-500/50">
                  ♻️ Faire reprendre mon PC
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Concept block */}
      <ContentSection
        title={conceptBlock?.title || "L'Informatique Durable"}
        subtitle="Ordinateurs et accessoires reconditionnés de qualité"
        content={conceptBlock?.content || "<p>Nous sélectionnons des ordinateurs et accessoires informatiques de haute qualité, reconditionnés et testés. Une alternative écologique et économique sans compromis sur la performance.</p>"}
        backgroundColor="bg-slate-50"
        textAlign="center"
        maxWidth="xl"
        bgImageUrl={conceptBlock?.bg_image_url}
        bgVideoUrl={conceptBlock?.bg_video_url}
        bgOverlayOpacity={conceptBlock?.bg_overlay_opacity ?? 0.55}
      />

      {/* Produits — avec recherche et filtre par collection */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Boutique</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Nos Produits</h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Filtrez par collection ou recherchez directement ce que vous cherchez
            </p>
          </div>
          {products.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-5xl mb-4">💻</div>
              <p className="text-gray-500 text-lg">Aucun produit disponible pour l'instant</p>
              <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
            </div>
          ) : (
            <FilteredProducts products={products} universe="informatique" />
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Notre expertise</p>
            <h2 className="text-4xl font-black text-white mb-3">Services Informatique</h2>
            <p className="text-slate-300/70 text-lg max-w-xl mx-auto">Réparation, dépannage, mise à niveau et reprise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition">
              <div className="text-4xl mb-5">🖥️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Réparation Informatique</h3>
              <p className="text-slate-300/80 mb-6 leading-relaxed">
                Diagnostic complet, remplacement écran/clavier/batterie, nettoyage thermique, installation OS, suppression virus, récupération de données.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Diagnostic', 'Écran', 'Batterie', 'OS', 'Virus', 'Données'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-600/40 text-slate-300 text-xs rounded-full border border-slate-500/30">{t}</span>
                ))}
              </div>
              <Link href="/informatique/services/repair">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition w-full md:w-auto">
                  Demander un devis →
                </button>
              </Link>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition">
              <div className="text-4xl mb-5">♻️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Reprise d'Ordinateur</h3>
              <p className="text-slate-300/80 mb-6 leading-relaxed">
                Nous rachetons vos anciens ordinateurs, PC portables, composants et périphériques. Évaluation gratuite, processus simple et transparent.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['PC Portable', 'Tour', 'GPU', 'RAM', 'Périphériques'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-slate-600/40 text-slate-300 text-xs rounded-full border border-slate-500/30">{t}</span>
                ))}
              </div>
              <Link href="/informatique/services/buyback">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition w-full md:w-auto">
                  Demander une estimation →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
