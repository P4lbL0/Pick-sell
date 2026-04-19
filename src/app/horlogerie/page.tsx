import { HeroSlider } from '@/components/common/HeroSlider'
import { FilteredProducts } from '@/components/common/FilteredProducts'
import { ContentSection } from '@/components/common/ContentSection'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { TrackPageView } from '@/components/common/TrackPageView'
import { ServiceLink } from '@/components/common/ServiceLink'
import { supabase } from '@/lib/supabase'

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
      .in('universe_type', ['horlogerie', 'global'])
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

  return (
    <main className="min-h-screen bg-white">
      <TrackPageView universe="horlogerie" />

      {/* ── Hero Slider ou Hero Fallback ── */}
      {heroSlides.length > 0 ? (
        <section className="mb-12 md:mb-16">
          <HeroSlider slides={heroSlides} autoplay={true} />
        </section>
      ) : (
        <section className="relative py-32 md:py-44 overflow-hidden">

          {/* Layers de fond */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f0500 0%, #1e0900 40%, #2d1200 70%, #1a0800 100%)' }} />

          {/* Grille dorée subtile */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(rgba(251,191,36,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.8) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          {/* Orbes de lumière */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/12 rounded-full -translate-y-1/2 blur-[100px] pointer-events-none anim-float" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-400/8 rounded-full translate-y-1/2 blur-[80px] pointer-events-none anim-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

          {/* Cercle décoratif — cadran de montre stylisé */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full border border-amber-500/10 hidden md:flex items-center justify-center">
            <div className="w-52 h-52 md:w-64 md:h-64 rounded-full border border-amber-500/8 flex items-center justify-center">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-amber-500/6 flex items-center justify-center">
                <span className="text-6xl md:text-7xl opacity-10 anim-float">⌚</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center md:text-left">

            <div className="anim-fade-in inline-flex items-center gap-2 px-4 py-1.5 border border-amber-500/20 bg-amber-500/5 rounded-full text-amber-400/70 text-xs font-semibold uppercase tracking-[0.2em] mb-8" style={{ animationDelay: '0.1s' }}>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Ssæa Montres
            </div>

            <h1 className="anim-fade-up font-black text-white leading-[0.9] tracking-tight mb-6" style={{ fontSize: 'clamp(56px, 10vw, 108px)', animationDelay: '0.2s' }}>
              L&apos;Art de<br />
              <span className="anim-shimmer-text">l&apos;Horlogerie</span>
            </h1>

            <div className="anim-fade-in w-20 h-px bg-gradient-to-r from-amber-500/60 to-transparent mb-8 mx-auto md:mx-0" style={{ animationDelay: '0.35s' }} />

            <p className="anim-fade-up text-amber-100/40 text-lg md:text-xl max-w-xl mb-12 mx-auto md:mx-0 leading-relaxed" style={{ animationDelay: '0.4s' }}>
              Montres Seiko MOD exclusives, pièces vintage restaurées, réparations et créations sur-mesure.
            </p>

            <div className="anim-fade-up flex flex-col sm:flex-row gap-3 justify-center md:justify-start" style={{ animationDelay: '0.55s' }}>
              <ServiceLink href="/horlogerie/services/repair" universe="horlogerie" serviceType="repair" className="inline-block">
                <button className="px-7 py-3.5 bg-amber-500 text-amber-950 font-bold rounded-xl hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-900/40 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2 justify-center text-base">
                  🔧 Réparer ma montre
                </button>
              </ServiceLink>
              <ServiceLink href="/horlogerie/services/custom" universe="horlogerie" serviceType="custom" className="inline-block">
                <button className="px-7 py-3.5 bg-white/5 border border-amber-500/20 text-amber-100/70 font-bold rounded-xl hover:bg-white/8 hover:border-amber-400/40 hover:text-amber-100 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 justify-center text-base">
                  🎨 Créer sur-mesure
                </button>
              </ServiceLink>
            </div>

          </div>
        </section>
      )}

      {/* ── Concept block ── */}
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

      {/* ── Produits ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-10">
            <p className="text-amber-600 text-xs font-semibold uppercase tracking-[0.2em] mb-2">Boutique</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Nos Montres & Accessoires</h2>
            <p className="text-gray-500 mt-2 max-w-lg text-sm">
              Filtrez par collection ou recherchez directement ce que vous cherchez
            </p>
          </ScrollReveal>

          {products.length === 0 ? (
            <ScrollReveal>
              <div className="py-20 text-center rounded-2xl border border-amber-200 bg-amber-50">
                <div className="text-5xl mb-4 opacity-40">⌚</div>
                <p className="text-gray-600 text-lg">Aucun produit disponible pour l&apos;instant</p>
                <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
              </div>
            </ScrollReveal>
          ) : (
            <FilteredProducts products={products} universe="horlogerie" />
          )}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #030712 0%, #0a0f1f 50%, #030712 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <p className="text-amber-500/60 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Expertise</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Services Horlogerie</h2>
            <p className="text-amber-100/30 text-lg max-w-xl mx-auto">Confiez-nous votre montre ou créez la vôtre</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ScrollReveal delay={100} direction="left">
              <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 group hover:-translate-y-1 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #1a0900 0%, #2d1200 100%)' }}>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-500/15 group-hover:ring-amber-400/30 transition-all duration-500" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-amber-500/15 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl mb-6 ring-1 ring-amber-400/15">🔧</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Réparation, Restauration & Révision</h3>
                  <p className="text-amber-100/40 mb-6 leading-relaxed text-sm">
                    Nettoyage, lubrification, remplacement de pièces, polissage du boîtier, restauration complète.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-8">
                    {['Révision', 'Remplacement pièces', 'Restauration', 'Changement pile'].map(t => (
                      <span key={t} className="px-2.5 py-1 bg-amber-500/8 text-amber-300/50 text-xs rounded-full border border-amber-500/10">{t}</span>
                    ))}
                  </div>
                  <ServiceLink href="/horlogerie/services/repair" universe="horlogerie" serviceType="repair" className="inline-block">
                    <button className="bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all duration-300 text-sm shadow-lg shadow-amber-900/30">
                      Demander un devis →
                    </button>
                  </ServiceLink>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="right">
              <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 group hover:-translate-y-1 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #1a0900 0%, #2d1200 100%)' }}>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-500/15 group-hover:ring-amber-400/30 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/8 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-amber-600/15 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl mb-6 ring-1 ring-amber-400/15">🎨</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Montre Personnalisée / Sur-mesure</h3>
                  <p className="text-amber-100/40 mb-6 leading-relaxed text-sm">
                    Choisissez chaque détail : cadran, aiguilles, lunette, crystal saphir, bracelet... Une pièce unique.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-8">
                    {['Cadran custom', 'Aiguilles', 'Bezel', 'Crystal saphir'].map(t => (
                      <span key={t} className="px-2.5 py-1 bg-amber-500/8 text-amber-300/50 text-xs rounded-full border border-amber-500/10">{t}</span>
                    ))}
                  </div>
                  <ServiceLink href="/horlogerie/services/custom" universe="horlogerie" serviceType="custom" className="inline-block">
                    <button className="bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all duration-300 text-sm shadow-lg shadow-amber-900/30">
                      Commander →
                    </button>
                  </ServiceLink>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

    </main>
  )
}
