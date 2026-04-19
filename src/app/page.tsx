import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { TrackPageView } from '@/components/common/TrackPageView'

export const metadata = {
  title: 'Pick Sell — Montres & Informatique',
  description: 'Deux univers, une passion. Montres Seiko MOD exclusives, pièces vintage et ordinateurs reconditionnés. Devis réparation et sur-mesure en ligne.',
}

const MARQUEE_ITEMS = [
  'Seiko MOD', 'Horlogerie', 'Ordinateurs reconditionnés', 'Sur-mesure',
  'Réparation', 'Vintage', 'Devis 24h', 'Qualité', 'Transparence',
  'Seiko MOD', 'Horlogerie', 'Ordinateurs reconditionnés', 'Sur-mesure',
  'Réparation', 'Vintage', 'Devis 24h', 'Qualité', 'Transparence',
]

const STATS = [
  { num: '50+',  label: 'Montres vendues',     sub: 'Seiko MOD & Vintage' },
  { num: '100+', label: 'PCs reconditionnés',  sub: 'Testés & garantis' },
  { num: '24h',  label: 'Délai de réponse',    sub: 'Pour chaque devis' },
  { num: '100%', label: 'Satisfaction client', sub: 'Notre engagement' },
]

const SERVICES = [
  {
    icon: '🔩',
    title: 'Réparation Montre',
    sub: 'Révision complète, remplacement de pièces, restauration cosmétique.',
    href: '/horlogerie/services/repair',
    accent: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    tag: 'Horlogerie',
    tagColor: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: '🎨',
    title: 'Montre Sur-mesure',
    sub: 'Créez votre Seiko MOD : cadran, aiguilles, lunette, crystal saphir.',
    href: '/horlogerie/services/custom',
    accent: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    tag: 'Horlogerie',
    tagColor: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: '🖥️',
    title: 'Réparation PC',
    sub: 'Diagnostic, écran, batterie, OS, virus, récupération de données.',
    href: '/informatique/services/repair',
    accent: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    tag: 'Informatique',
    tagColor: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: '♻️',
    title: 'Reprise Ordinateur',
    sub: 'Évaluation gratuite de votre matériel et rachat rapide.',
    href: '/informatique/services/buyback',
    accent: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    tag: 'Informatique',
    tagColor: 'bg-blue-500/10 text-blue-400',
  },
]

const VALUES = [
  {
    icon: '🏆',
    title: 'Qualité',
    text: 'Chaque produit est sélectionné et testé avec rigueur. Nous ne vendons que ce que nous accepterions pour nous-mêmes.',
  },
  {
    icon: '🔍',
    title: 'Transparence',
    text: 'Descriptions honnêtes, prix justes, service attentionné. Vous savez exactement ce que vous achetez avant de payer.',
  },
  {
    icon: '🌱',
    title: 'Durabilité',
    text: "Réparer plutôt que jeter. Reconditionner plutôt qu'acheter neuf. Une démarche responsable, sans compromis.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] overflow-x-hidden">
      <TrackPageView universe="global" />

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
            <Image src="/logo.jpg" alt="Pick Sell" width={32} height={32} className="rounded-lg object-cover ring-1 ring-white/10" />
            <span className="text-xl font-black text-white tracking-tight hidden sm:inline">
              <span className="text-amber-400">Pick</span> Sell
            </span>
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/horlogerie" className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/8 rounded-lg transition hidden sm:inline-flex items-center gap-1.5">
              <span className="text-amber-400">⌚</span> Horlogerie
            </Link>
            <Link href="/informatique" className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/8 rounded-lg transition hidden sm:inline-flex items-center gap-1.5">
              <span className="text-blue-400">💻</span> Informatique
            </Link>
            <Link href="/contact" className="ml-1 px-4 py-1.5 bg-white/8 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-lg transition text-sm">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-32 w-[700px] h-[700px] bg-amber-500/[0.07] rounded-full blur-[120px] anim-float pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] bg-blue-500/[0.07] rounded-full blur-[120px] anim-float pointer-events-none" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none" />

        {/* Decorative large emoji — desktop only */}
        <div className="absolute right-[8%] top-1/2 -translate-y-[60%] text-[clamp(80px,12vw,160px)] opacity-[0.04] select-none pointer-events-none hidden lg:block anim-float">⌚</div>
        <div className="absolute left-[8%] top-1/2 -translate-y-[40%] text-[clamp(80px,12vw,160px)] opacity-[0.04] select-none pointer-events-none hidden lg:block anim-float" style={{ animationDelay: '2.5s' }}>💻</div>

        <div className="relative z-10 max-w-4xl mx-auto w-full">

          {/* Status badge */}
          <div className="anim-fade-up inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.05] rounded-full text-gray-400 text-xs sm:text-sm mb-8 border border-white/[0.08] backdrop-blur-sm" style={{ animationDelay: '0.1s' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Ouvert · Montres & Informatique reconditionnés
          </div>

          {/* Title */}
          <h1
            className="anim-fade-up font-black text-white leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: 'clamp(72px, 14vw, 148px)', animationDelay: '0.2s' }}
          >
            <span className="anim-shimmer-text">Pick</span>
            <span className="text-white"> Sell</span>
          </h1>

          {/* Divider */}
          <div className="anim-fade-in mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" style={{ animationDelay: '0.35s' }} />

          {/* Tagline */}
          <p className="anim-fade-up text-gray-400 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12" style={{ animationDelay: '0.4s' }}>
            Deux univers, une passion.{' '}
            <span className="text-gray-200">Montres Seiko MOD uniques</span> et{' '}
            <span className="text-gray-200">ordinateurs reconditionnés</span> de qualité.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '0.55s' }}>
            <Link href="/horlogerie" className="group relative overflow-hidden">
              <div className="relative px-7 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-white text-base sm:text-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2.5 justify-center">
                <span>⌚</span>
                Univers Montres
                <span className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sm">→</span>
              </div>
            </Link>
            <Link href="/informatique" className="group">
              <div className="px-7 py-3.5 glass-dark rounded-xl font-bold text-gray-200 text-base sm:text-lg hover:bg-white/[0.07] hover:text-white transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2.5 justify-center">
                <span>💻</span>
                Univers Informatique
                <span className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sm">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs anim-fade-in" style={{ animationDelay: '1.2s' }}>
          <span className="uppercase tracking-widest">Découvrir</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── MARQUEE STRIP ─── */}
      <div className="overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 border-y border-amber-400/20">
        <div className="flex anim-marquee gap-0 select-none">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4 text-amber-950 font-bold text-xs uppercase tracking-[0.15em] whitespace-nowrap">
              {item}
              <span className="text-amber-700/60 text-lg font-thin">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── STATS ─── */}
      <section className="py-20 md:py-28 bg-[#030712]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80}>
                <div className="glass-dark rounded-2xl p-6 text-center group hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                  <p className="text-4xl md:text-5xl font-black text-white mb-1 anim-shimmer-text">{s.num}</p>
                  <p className="text-white font-semibold text-sm mb-1">{s.label}</p>
                  <p className="text-gray-500 text-xs">{s.sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UNIVERSE CARDS ─── */}
      <section className="py-20 md:py-32 px-4 bg-[#030712]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-3">Explorez</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nos Univers</h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              Chaque univers a son identité, ses produits, ses services.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Horlogerie */}
            <ScrollReveal delay={100} direction="left">
              <Link href="/horlogerie" className="block group">
                <div className="relative overflow-hidden rounded-3xl min-h-[420px] flex flex-col justify-between p-10 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/30" style={{ background: 'linear-gradient(135deg, #1c0a00 0%, #3d1a00 50%, #2d1200 100%)' }}>

                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-amber-500/20 group-hover:ring-amber-400/40 transition-all duration-500" />

                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-amber-500/18 group-hover:scale-110 transition-all duration-700 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/8 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

                  {/* Dot grid */}
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(251 191 36) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center text-3xl mb-8 ring-1 ring-amber-400/20 group-hover:bg-amber-500/25 transition-all duration-300">⌚</div>
                    <p className="text-amber-400/70 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Ssæa Montres</p>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">L&apos;Art de<br />l&apos;Horlogerie</h3>
                    <p className="text-amber-100/50 text-sm leading-relaxed mb-6 max-w-xs">
                      Montres Seiko MOD exclusives, pièces vintage restaurées, accessoires horlogers. Réparations & créations sur-mesure.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['Seiko MOD', 'Vintage', 'Sur-mesure', 'Réparation'].map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-amber-500/10 text-amber-300/70 text-xs rounded-full border border-amber-500/15">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-10">
                    <span className="inline-flex items-center gap-2 bg-amber-500 text-amber-950 px-6 py-3 rounded-xl font-bold text-sm group-hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-900/40">
                      Découvrir la boutique
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Informatique */}
            <ScrollReveal delay={200} direction="right">
              <Link href="/informatique" className="block group">
                <div className="relative overflow-hidden rounded-3xl min-h-[420px] flex flex-col justify-between p-10 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20" style={{ background: 'linear-gradient(135deg, #020b18 0%, #071a30 50%, #040e20 100%)' }}>

                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-blue-500/20 group-hover:ring-blue-400/40 transition-all duration-500" />

                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/8 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:bg-blue-500/15 group-hover:scale-110 transition-all duration-700 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/6 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

                  {/* Grid lines */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(96,165,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl mb-8 ring-1 ring-blue-400/20 group-hover:bg-blue-500/20 transition-all duration-300">💻</div>
                    <p className="text-blue-400/70 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Informatique</p>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">Performance<br />Durable</h3>
                    <p className="text-blue-100/40 text-sm leading-relaxed mb-6 max-w-xs">
                      Ordinateurs et accessoires testés, garantis. Une alternative écologique et économique sans compromis.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['PC Portable', 'Accessoires', 'Réparation', 'Reprise'].map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-blue-500/10 text-blue-300/70 text-xs rounded-full border border-blue-500/15">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-10">
                    <span className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm group-hover:bg-blue-400 transition-all duration-300 shadow-lg shadow-blue-900/40">
                      Découvrir la boutique
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-20 md:py-28 px-4" style={{ background: '#050d1a' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-3">Expertise</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nos Services</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Au-delà des produits, nous offrons notre savoir-faire</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={s.href} delay={i * 80}>
                <Link href={s.href} className="block group">
                  <div className={`relative overflow-hidden rounded-2xl p-7 h-full flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${s.accent} border ${s.border} glass-dark`}>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{s.icon}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.tagColor}`}>{s.tag}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{s.sub}</p>
                    </div>
                    <div className="mt-auto pt-2">
                      <span className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors inline-flex items-center gap-1.5">
                        Demander un devis
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOTRE APPROCHE ─── */}
      <section className="py-20 md:py-28 px-4 bg-[#030712]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-3">Valeurs</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Notre Approche</h2>
            <p className="text-gray-500 text-lg">Ce qui nous distingue</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="group text-center px-6 py-8 rounded-2xl glass-dark hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                  <div className="text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">{v.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA CONTACT ─── */}
      <section className="relative py-24 md:py-32 overflow-hidden px-4">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-[#0f0a02] to-slate-900" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

        <ScrollReveal className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-amber-400/60 text-xs uppercase tracking-[0.2em] mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Une question ?<br />
            <span className="text-amber-400">On est là.</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg leading-relaxed max-w-xl mx-auto">
            Devis, renseignement sur un produit, collaboration... Écrivez-nous et nous vous répondons sous 24h.
          </p>
          <Link href="/contact">
            <button className="px-10 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-amber-50 transition-all duration-300 text-lg shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0">
              Nous contacter →
            </button>
          </Link>
        </ScrollReveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#030712] text-gray-500 py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <p className="text-white font-black text-xl mb-3">
                <span className="text-amber-400">Pick</span> Sell
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                Hub de shopping alternatif. Horlogerie et informatique reconditionnés, avec expertise et passion.
              </p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold text-sm mb-4 uppercase tracking-widest">Navigation</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/horlogerie" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-amber-400 text-xs">⌚</span> Horlogerie (Ssæa Montres)</Link></li>
                <li><Link href="/informatique" className="hover:text-white transition-colors flex items-center gap-2"><span className="text-blue-400 text-xs">💻</span> Informatique</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact & À Propos</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-300 font-semibold text-sm mb-4 uppercase tracking-widest">Services</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/horlogerie/services/repair" className="hover:text-white transition-colors">Réparation montre</Link></li>
                <li><Link href="/horlogerie/services/custom" className="hover:text-white transition-colors">Montre sur-mesure</Link></li>
                <li><Link href="/informatique/services/repair" className="hover:text-white transition-colors">Réparation PC</Link></li>
                <li><Link href="/informatique/services/buyback" className="hover:text-white transition-colors">Reprise ordinateur</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <p>© 2024-2026 Pick Sell. Tous droits réservés.</p>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact & À Propos</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
