import { HeroSlider } from '@/components/common/HeroSlider'
import { ProductGrid } from '@/components/common/ProductGrid'
import { ContentSection } from '@/components/common/ContentSection'
import { Product } from '@/lib/types'
import { supabase } from '@/lib/supabase'

async function getInformatiqueProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('universe', 'informatique')
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
      .eq('universe_type', 'informatique')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return slides || []
  } catch (error) {
    console.error('Erreur lors du chargement des slides:', error)
    return []
  }
}

export default async function InformatiqueHome() {
  const [products, heroSlides] = await Promise.all([
    getInformatiqueProducts(),
    getHeroSlides()
  ])

  const computerProducts = products.filter(p => p.category === 'computer')
  const accessoriesProducts = products.filter(p => p.category === 'computer-accessories')

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="mb-12 md:mb-20">
        <div className="max-w-7xl mx-auto px-4">
          <HeroSlider slides={heroSlides} autoplay={true} />
        </div>
      </section>

      {/* Intro Section */}
      <ContentSection
        title="L'Informatique Durable"
        subtitle="Ordinateurs et accessoires reconditionnés de qualité"
        content="<p>Nous sélectionnons des ordinateurs et accessoires informatiques de haute qualité, reconditionnés et testés. Une alternative écologique et économique sans compromis sur la performance.</p>"
        backgroundColor="bg-gray-50"
        textAlign="center"
        maxWidth="xl"
      />

      {/* Computers Collection */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ordinateurs en Stock
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Une sélection variée de portables et accessoires, tous testés et garantis
          </p>
          <ProductGrid products={computerProducts} universe="informatique" />
        </div>
      </section>

      {/* Accessories Collection */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Accessoires
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Claviers, souris, câbles et plus - tout ce dont vous avez besoin
          </p>
          <ProductGrid products={accessoriesProducts} universe="informatique" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Repair */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Réparation Informatique
              </h3>
              <p className="text-blue-800 mb-6">
                Diagnostic, réparation et dépannage d'ordinateurs. Remplacement de pièces, nettoyage, mise à niveau.
              </p>
              <a href="/informatique/services/repair" className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition">
                En savoir plus
              </a>
            </div>

            {/* Buyback */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                Reprise d'Ordinateur
              </h3>
              <p className="text-green-800 mb-6">
                Nous rachetons vos anciens ordinateurs. Évaluation gratuite, processus simple et transparent.
              </p>
              <a href="/informatique/services/buyback" className="inline-block bg-green-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition">
                Demander une estimation
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
