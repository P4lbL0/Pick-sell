import { HeroSlider } from '@/components/common/HeroSlider'
import { FilteredProducts } from '@/components/common/FilteredProducts'
import { ContentSection } from '@/components/common/ContentSection'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { TrackPageView } from '@/components/common/TrackPageView'
import { ServiceLink } from '@/components/common/ServiceLink'
import { supabase } from '@/lib/supabase'

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
    <main className="min-h-screen bg-white">
      <TrackPageView universe="informatique" />

      {/* ── Hero Slider ou Hero Fallback ── */}
      {heroSlides.length > 0 ? (
        <section className="mb-12 md:mb-16">
          <HeroSlider slides={heroSlides} autoplay={true} />
        </section>
      ) : (
        <section className="relative py-32 md:py-44 overflow-hidden">

          {/* Fond */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #010810 0%, #031020 40%, #050d28 70%, #020a18 100%)' }} />

          {/* Grille tech */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(96,165,250,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.8) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Diagonales */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(96,165,250,0.5) 0, rgba(96,165,250,0.5) 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />

          {/* Orbes */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full -translate-y-1/2 blur-[100px] pointer-events-none anim-float" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full translate-y-1/2 blur-[80px] pointer-events-none anim-float" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-48 bg-gradient-to-b from-transparent via-blue-500/25 to-transparent" />

          {/* Déco circuit — desktop */}
          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4">
            <div className="w-px h-32 bg-gradient-to-b from-transparent to-blue-500/20" />
            <div className="w-16 h-16 rounded-full border border-blue-500/15 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-blue-500/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500/30" />
              </div>
            </div>
            <div className="w-px h-32 bg-gradient-to-t from-transparent to-blue-500/20" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center md:text-right">

            <div className="anim-fade-in inline-flex items-center gap-2 px-4 py-1.5 border border-blue-500/20 bg-blue-500/5 rounded-full text-blue-400/70 text-xs font-semibold uppercase tracking-[0.2em] mb-8" style={{ animationDelay: '0.1s' }}>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Informatique reconditionnée
            </div>

            <h1 className="anim-fade-up font-black text-white leading-[0.9] tracking-tight mb-6" style={{ fontSize: 'clamp(56px, 10vw, 108px)', animationDelay: '0.2s' }}>
              Performance<br />
              <span style={{
                background: 'linear-gradient(90deg, #60a5fa 0%, #a5f3fc 35%, #60a5fa 55%, #3b82f6 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Durable</span>
            </h1>

            <div className="anim-fade-in w-20 h-px bg-gradient-to-l from-blue-500/60 to-transparent mb-8 ml-auto md:ml-auto md:mr-0 mx-auto" style={{ animationDelay: '0.35s' }} />

            <p className="anim-fade-up text-blue-100/30 text-lg md:text-xl max-w-xl mb-12 mx-auto md:ml-auto md:mr-0 leading-relaxed" style={{ animationDelay: '0.4s' }}>
              Ordinateurs et accessoires testés, garantis. Une alternative écologique et économique sans compromis sur la performance.
            </p>

            <div className="anim-fade-up flex flex-col sm:flex-row gap-3 justify-center md:justify-end" style={{ animationDelay: '0.55s' }}>
              <ServiceLink href="/informatique/services/repair" universe="informatique" serviceType="repair" className="inline-block">
                <button className="px-7 py-3.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-all duration-300 shadow-lg shadow-blue-900/40 hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2 justify-center text-base">
                  🔧 Réparer mon PC
                </button>
              </ServiceLink>
              <ServiceLink href="/informatique/services/buyback" universe="informatique" serviceType="buyback" className="inline-block">
                <button className="px-7 py-3.5 bg-white/5 border border-blue-500/20 text-blue-100/60 font-bold rounded-xl hover:bg-white/8 hover:border-blue-400/40 hover:text-blue-100 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 justify-center text-base">
                  ♻️ Faire reprendre mon PC
                </button>
              </ServiceLink>
            </div>

          </div>
        </section>
      )}

      {/* ── Concept block ── */}
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

      {/* ── Produits ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="mb-10">
            <p className="text-blue-600 text-xs font-semibold uppercase tracking-[0.2em] mb-2">Boutique</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Nos Produits</h2>
            <p className="text-gray-500 mt-2 max-w-lg text-sm">
              Filtrez par collection ou recherchez directement ce que vous cherchez
            </p>
          </ScrollReveal>

          {products.length === 0 ? (
            <ScrollReveal>
              <div className="py-20 text-center rounded-2xl border border-blue-200 bg-blue-50">
                <div className="text-5xl mb-4 opacity-40">💻</div>
                <p className="text-gray-600 text-lg">Aucun produit disponible pour l&apos;instant</p>
                <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
              </div>
            </ScrollReveal>
          ) : (
            <FilteredProducts products={products} universe="informatique" />
          )}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #030712 0%, #0a0f1f 50%, #030712 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <p className="text-blue-500/60 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Expertise</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Services Informatique</h2>
            <p className="text-blue-100/30 text-lg max-w-xl mx-auto">Réparation, dépannage, mise à niveau et reprise</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ScrollReveal delay={100} direction="left">
              <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 group hover:-translate-y-1 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #020b1a 0%, #041428 100%)' }}>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-500/15 group-hover:ring-blue-400/30 transition-all duration-500" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/15 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-6 ring-1 ring-blue-400/15">🖥️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Réparation Informatique</h3>
                  <p className="text-blue-100/35 mb-6 leading-relaxed text-sm">
                    Diagnostic complet, remplacement écran/clavier/batterie, nettoyage thermique, installation OS, suppression virus, récupération de données.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-8">
                    {['Diagnostic', 'Écran', 'Batterie', 'OS', 'Virus', 'Données'].map(t => (
                      <span key={t} className="px-2.5 py-1 bg-blue-500/8 text-blue-300/50 text-xs rounded-full border border-blue-500/10">{t}</span>
                    ))}
                  </div>
                  <ServiceLink href="/informatique/services/repair" universe="informatique" serviceType="repair" className="inline-block">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-400 transition-all duration-300 text-sm shadow-lg shadow-blue-900/30">
                      Demander un devis →
                    </button>
                  </ServiceLink>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="right">
              <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 group hover:-translate-y-1 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #020b1a 0%, #041428 100%)' }}>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-500/15 group-hover:ring-blue-400/30 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/6 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-cyan-600/12 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-6 ring-1 ring-blue-400/15">♻️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Reprise d&apos;Ordinateur</h3>
                  <p className="text-blue-100/35 mb-6 leading-relaxed text-sm">
                    Nous rachetons vos anciens ordinateurs, PC portables, composants et périphériques. Évaluation gratuite, processus simple et transparent.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-8">
                    {['PC Portable', 'Tour', 'GPU', 'RAM', 'Périphériques'].map(t => (
                      <span key={t} className="px-2.5 py-1 bg-blue-500/8 text-blue-300/50 text-xs rounded-full border border-blue-500/10">{t}</span>
                    ))}
                  </div>
                  <ServiceLink href="/informatique/services/buyback" universe="informatique" serviceType="buyback" className="inline-block">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-400 transition-all duration-300 text-sm shadow-lg shadow-blue-900/30">
                      Demander une estimation →
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
