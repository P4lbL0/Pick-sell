import Link from 'next/link'

export const metadata = {
  title: 'Pick Sell — Montres & Informatique',
  description: 'Deux univers, une passion. Montres Seiko MOD exclusives, pièces vintage et ordinateurs reconditionnés. Devis réparation et sur-mesure en ligne.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-black text-white tracking-tight">
            <span className="text-amber-400">Pick</span> Sell
          </span>
          <div className="flex items-center gap-1 md:gap-2 text-sm">
            <Link href="/horlogerie" className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition hidden sm:inline-block">
              ⌚ Horlogerie
            </Link>
            <Link href="/informatique" className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition hidden sm:inline-block">
              💻 Informatique
            </Link>
            <Link href="/contact" className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 overflow-hidden">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255) 1.5px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        {/* glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-slate-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-gray-300 text-sm mb-8 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Montres &amp; Informatique reconditionnés
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Pick</span>
            <span className="text-white"> Sell</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Deux univers, une passion. Des montres Seiko MOD uniques et des ordinateurs reconditionnés de qualité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/horlogerie">
              <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg shadow-amber-900/30 text-lg">
                ⌚ Univers Montres
                <span className="ml-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 inline-block transition-all">→</span>
              </button>
            </Link>
            <Link href="/informatique">
              <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white font-bold rounded-xl hover:from-slate-600 hover:to-slate-500 transition-all shadow-lg shadow-slate-900/30 text-lg">
                💻 Univers Informatique
                <span className="ml-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 inline-block transition-all">→</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-sm animate-bounce">
          <span>Découvrir</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── FEATURES STRIP ─── */}
      <section className="bg-gray-900 py-10 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '⌚', label: 'Seiko MOD & Vintage', sub: 'Montres uniques' },
              { icon: '💻', label: 'PCs Reconditionnés', sub: 'Testés & garantis' },
              { icon: '🔧', label: 'Réparation & Révision', sub: 'Expertise technique' },
              { icon: '📋', label: 'Devis en 24h', sub: 'Réponse rapide' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{f.icon}</span>
                <p className="text-white font-semibold text-sm">{f.label}</p>
                <p className="text-gray-400 text-xs">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UNIVERSE CARDS ─── */}
      <section className="py-20 md:py-32 bg-gray-950 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nos Univers</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Chaque univers a son identité, ses produits, ses services. Explorez celui qui vous correspond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Horlogerie */}
            <Link href="/horlogerie">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 to-amber-800 p-10 min-h-[340px] flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-900/40 transition-all duration-300 cursor-pointer border border-amber-800/50">
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl mb-6">⌚</div>
                  <h3 className="text-3xl font-black text-white mb-3">Ssæa Montres</h3>
                  <p className="text-amber-200/80 text-base leading-relaxed mb-5">
                    Montres Seiko MOD exclusives, pièces vintage restaurées, accessoires horlogers. Réparations &amp; créations sur-mesure.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['Seiko MOD', 'Vintage', 'Sur-mesure', 'Réparation'].map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-amber-700/40 text-amber-200 text-xs rounded-full border border-amber-600/30">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 mt-8">
                  <span className="inline-flex items-center gap-2 bg-white text-amber-900 px-6 py-3 rounded-lg font-bold group-hover:bg-amber-50 transition">
                    Découvrir →
                  </span>
                </div>
              </div>
            </Link>

            {/* Informatique */}
            <Link href="/informatique">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-10 min-h-[340px] flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-800/40 transition-all duration-300 cursor-pointer border border-slate-700/50">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl mb-6">💻</div>
                  <h3 className="text-3xl font-black text-white mb-3">Informatique</h3>
                  <p className="text-slate-300/80 text-base leading-relaxed mb-5">
                    Ordinateurs et accessoires reconditionnés testés et garantis. Réparations, upgrades et reprises de matériel.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['PC Portable', 'Accessoires', 'Réparation', 'Reprise'].map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-600/40 text-slate-300 text-xs rounded-full border border-slate-500/30">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 mt-8">
                  <span className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-bold group-hover:bg-slate-50 transition">
                    Découvrir →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Nos Services</h2>
            <p className="text-gray-400 text-lg">Au-delà des produits, nous offrons notre expertise</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🔩', title: 'Réparation Montre', sub: 'Révision complète, remplacement de pièces, restauration cosmétique', href: '/horlogerie/services/repair', border: 'border-amber-700/40 hover:border-amber-500' },
              { icon: '🎨', title: 'Montre Sur-mesure', sub: 'Créez votre Seiko MOD : cadran, aiguilles, lunette, crystal saphir...', href: '/horlogerie/services/custom', border: 'border-amber-700/40 hover:border-amber-500' },
              { icon: '🖥️', title: 'Réparation PC', sub: 'Diagnostic, remplacement écran/clavier/batterie, nettoyage, OS...', href: '/informatique/services/repair', border: 'border-blue-700/40 hover:border-blue-500' },
              { icon: '♻️', title: 'Reprise Ordinateur', sub: 'Évaluation gratuite de votre matériel et rachat rapide', href: '/informatique/services/buyback', border: 'border-blue-700/40 hover:border-blue-500' },
            ].map((s) => (
              <Link key={s.href} href={s.href}>
                <div className={`bg-gray-800/50 border ${s.border} rounded-xl p-6 h-full flex flex-col gap-3 transition-all cursor-pointer hover:bg-gray-800`}>
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="text-white font-bold">{s.title}</h3>
                  <p className="text-gray-400 text-sm flex-1 leading-relaxed">{s.sub}</p>
                  <span className="text-gray-500 text-sm mt-auto">Demander un devis →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOTRE APPROCHE ─── */}
      <section className="py-20 md:py-28 bg-gray-950 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Notre Approche</h2>
            <p className="text-gray-400 text-lg">Ce qui nous distingue</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏆', title: 'Qualité', text: 'Chaque produit est sélectionné et testé avec rigueur. Nous ne vendons que ce que nous accepterions pour nous-mêmes.' },
              { icon: '🔍', title: 'Transparence', text: 'Descriptions honnêtes, prix justes, service attentionné. Vous savez exactement ce que vous achetez avant de payer.' },
              { icon: '🌱', title: 'Durabilité', text: "Réparer plutôt que jeter. Reconditionner plutôt qu'acheter neuf. Une démarche responsable, sans compromis sur la performance." },
            ].map((v) => (
              <div key={v.title} className="text-center px-4 group">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">{v.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA CONTACT ─── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-slate-800" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Une question ? On est là.</h2>
          <p className="text-gray-200 mb-8 text-lg leading-relaxed">
            Devis, renseignement sur un produit, collaboration... Écrivez-nous et nous vous répondons sous 24h.
          </p>
          <Link href="/contact">
            <button className="px-10 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 transition-all">
              Nous contacter
            </button>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-950 text-gray-400 py-14 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="text-white font-black text-xl mb-3">
                <span className="text-amber-400">Pick</span> Sell
              </p>
              <p className="text-sm leading-relaxed">Hub de shopping alternatif. Horlogerie et informatique reconditionnés, avec expertise et passion.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-4">Navigation</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/horlogerie" className="hover:text-white transition">⌚ Horlogerie (Ssæa Montres)</Link></li>
                <li><Link href="/informatique" className="hover:text-white transition">💻 Informatique</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact &amp; À Propos</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-4">Services</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/horlogerie/services/repair" className="hover:text-white transition">Réparation montre</Link></li>
                <li><Link href="/horlogerie/services/custom" className="hover:text-white transition">Montre sur-mesure</Link></li>
                <li><Link href="/informatique/services/repair" className="hover:text-white transition">Réparation PC</Link></li>
                <li><Link href="/informatique/services/buyback" className="hover:text-white transition">Reprise ordinateur</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2024-2026 Pick Sell. Tous droits réservés.</p>
            <Link href="/contact" className="hover:text-white transition">Contact &amp; À Propos</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
