import { HeroSlider } from '@/components/common/HeroSlider'
import { ProductGrid } from '@/components/common/ProductGrid'
import { ContentSection } from '@/components/common/ContentSection'
import { Product } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export const revalidate = 60 // ISR: revalidate every 60 seconds, admin actions will clear cache immediately

async function getHorlogerieProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('universe', 'horlogerie')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return products || []
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
    return []
  }
}

async function getHeroSlides() {
  try {
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('universe_type', 'horlogerie')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return slides || []
  } catch (error) {
    console.error('Erreur lors du chargement des slides:', error)
    return []
  }
}

export default async function HorlogerieHome() {
  const [products, heroSlides] = await Promise.all([
    getHorlogerieProducts(),
    getHeroSlides()
  ])

  const seikoProducts = products.filter(p => p.category === 'seiko-mod')
  const diverseProducts = products.filter(p => p.category === 'diverse')

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="mb-12 md:mb-20">
        <div className="max-w-7xl mx-auto px-4">
          <HeroSlider slides={heroSlides} autoplay={true} />
        </div>
      </section>

      {/* Concept Section */}
      <ContentSection
        title="Notre Concept"
        subtitle="L'excellence horlogère accessible"
        content="<p>Chez Ssæa Montres, nous nous dédions à l'art de l'horlogerie. Notre passion est de proposer des montres de qualité, qu'elles soient des modifications exclusives de modèles Seiko ou des pièces reconditionnées avec soin.</p><p>Chaque montre est sélectionnée avec rigueur et traitée avec expertise pour vous offrir un produit qui corresponds à vos attentes.</p>"
        backgroundColor="bg-gray-50"
        textAlign="center"
        maxWidth="xl"
      />

      {/* Seiko MOD Collection */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Collection Seiko MOD
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Des modifications uniques et soignées de montres Seiko de haute qualité
          </p>
          <ProductGrid products={seikoProducts} universe="horlogerie" />
        </div>
      </section>

      {/* Diverse Collection */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Collection Diverse
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Montres existantes révisées et reconditionnées avec expertise
          </p>
          <ProductGrid products={diverseProducts} universe="horlogerie" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Repair - Restoration - Revision */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                Réparation, Restauration & Révision
              </h3>
              <p className="text-amber-800 mb-6">
                Nos experts restaurent et réparent vos montres avec soin. Révision complète, remplacement de pièces, restauration cosmétique.
              </p>
              <a href="/horlogerie/services/repair" className="inline-block bg-amber-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-800 transition">
                En savoir plus
              </a>
            </div>

            {/* Custom Watch */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Montre Personnalisée / Sur-mesure
              </h3>
              <p className="text-slate-800 mb-6">
                Créez votre propre montre. Choisissez les éléments, les finitions et les spécifications. Une pièce unique à votre image.
              </p>
              <a href="/horlogerie/services/custom" className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition">
                Commander
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
