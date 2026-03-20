import { HeroSlider } from '@/components/common/HeroSlider'
import { ProductGrid } from '@/components/common/ProductGrid'
import { ContentSection } from '@/components/common/ContentSection'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 60

async function getHorlogerieProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('universe', 'horlogerie')
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
      .eq('universe_type', 'horlogerie')
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
      .eq('key', 'concept-horlogerie')
      .single()
    return data || null
  } catch { return null }
}

export default async function HorlogerieHome() {
  const [products, heroSlides, conceptBlock] = await Promise.all([
    getHorlogerieProducts(),
    getHeroSlides(),
    getConceptBlock(),
  ])

  const seikoProducts = products.filter(p => p.category === 'seiko-mod')
  const diverseProducts = products.filter(p => p.category === 'diverse')
  const accessoriesProducts = products.filter(p => p.category === 'accessories')

  return (
    <main className="min-h-screen">

      {/* Hero Slider — pleine largeur */}
      {heroSlides.length > 0 ? (
        <section className="mb-12 md:mb-16">
          <HeroSlider slides={heroSlides} autoplay={true} />
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 py-28 md:py-40 mb-12 md:mb-16 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest mb-4">Ssæa Montres</p>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              L'Art de<br />l'Horlogerie
            </h1>
            <p className="text-amber-100/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Montres Seiko MOD exclusives, pièces vintage restaurées, réparations et créations sur-mesure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/horlogerie/services/repair">
                <button className="px-8 py-3 bg-white text-amber-900 font-bold rounded-xl hover:bg-amber-50 transition shadow-lg">
                  🔧 Réparer ma montre
                </button>
              </Link>
              <Link href="/horlogerie/services/custom">
                <button className="px-8 py-3 bg-amber-700/50 text-white font-bold rounded-xl hover:bg-amber-700/70 transition border border-amber-600/50">
                  🎨 Créer sur-mesure
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Concept block (éditable depuis l'admin) */}
      <ContentSection
        title={conceptBlock?.title || 'Notre Concept'}
        subtitle="L'excellence horlogère accessible"
        content={conceptBlock?.content || "<p>Chez Ssæa Montres, nous nous dédions à l'art de l'horlogerie. Notre passion est de proposer des montres de qualité, qu'elles soient des modifications exclusives de modèles Seiko ou des pièces reconditionnées avec soin.</p><p>Chaque montre est sélectionnée avec rigueur et traitée avec expertise pour vous offrir un produit qui correspond à vos attentes.</p>"}
        backgroundColor="bg-amber-50"
        textAlign="center"
        maxWidth="xl"
        bgImageUrl={conceptBlock?.bg_image_url}
        bgVideoUrl={conceptBlock?.bg_video_url}
        bgOverlayOpacity={conceptBlock?.bg_overlay_opacity ?? 0.55}
      />

      {/* Collection Seiko MOD */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-1">Collection phare</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Seiko MOD</h2>
              <p className="text-gray-500 mt-2 max-w-lg">Des modifications uniques et soignées de montres Seiko, chaque pièce est unique</p>
            </div>
          </div>
          {seikoProducts.length === 0 ? (
            <div className="py-20 text-center bg-amber-50 rounded-2xl border border-amber-100">
              <div className="text-5xl mb-4">⌚</div>
              <p className="text-gray-500 text-lg">Aucune montre Seiko MOD disponible pour l'instant</p>
              <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
            </div>
          ) : (
            <ProductGrid products={seikoProducts} universe="horlogerie" />
          )}
        </div>
      </section>

      {/* Collection Diverse */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-1">Collection</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Montres Diverses</h2>
              <p className="text-gray-500 mt-2 max-w-lg">Montres révisées et reconditionnées avec expertise</p>
            </div>
          </div>
          {diverseProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">🕰️</div>
              <p className="text-gray-500 text-lg">Aucune montre diverse disponible pour l'instant</p>
            </div>
          ) : (
            <ProductGrid products={diverseProducts} universe="horlogerie" />
          )}
        </div>
      </section>

      {/* Accessoires */}
      {accessoriesProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-1">Accessoires</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Accessoires Horlogers</h2>
            </div>
            <ProductGrid products={accessoriesProducts} universe="horlogerie" />
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-16 md:py-24 bg-amber-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Notre expertise</p>
            <h2 className="text-4xl font-black text-white mb-3">Services Horlogerie</h2>
            <p className="text-amber-200/70 text-lg max-w-xl mx-auto">Confiez-nous votre montre ou créez la vôtre</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-900/50 border border-amber-700/50 rounded-2xl p-8 hover:bg-amber-900/70 transition group">
              <div className="text-4xl mb-5">🔧</div>
              <h3 className="text-2xl font-bold text-white mb-3">Réparation, Restauration &amp; Révision</h3>
              <p className="text-amber-200/80 mb-6 leading-relaxed">
                Nettoyage, lubrification, remplacement de pièces, polissage du boîtier, restauration complète. Nous prenons soin de votre montre.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Révision', 'Remplacement pièces', 'Restauration', 'Changement pile'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-amber-700/40 text-amber-200 text-xs rounded-full border border-amber-600/30">{t}</span>
                ))}
              </div>
              <Link href="/horlogerie/services/repair">
                <button className="bg-white text-amber-900 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition w-full md:w-auto">
                  Demander un devis →
                </button>
              </Link>
            </div>

            <div className="bg-amber-900/50 border border-amber-700/50 rounded-2xl p-8 hover:bg-amber-900/70 transition group">
              <div className="text-4xl mb-5">🎨</div>
              <h3 className="text-2xl font-bold text-white mb-3">Montre Personnalisée / Sur-mesure</h3>
              <p className="text-amber-200/80 mb-6 leading-relaxed">
                Choisissez chaque détail : cadran, aiguilles, lunette, crystal saphir, bracelet... Une pièce unique à votre image.
              </p>
              <div className="flex gap-2 flex-wrap mb-6">
                {['Cadran custom', 'Aiguilles', 'Bezel', 'Crystal saphir'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-amber-700/40 text-amber-200 text-xs rounded-full border border-amber-600/30">{t}</span>
                ))}
              </div>
              <Link href="/horlogerie/services/custom">
                <button className="bg-white text-amber-900 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition w-full md:w-auto">
                  Commander →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
