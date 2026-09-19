'use client'

// Configurateur de montre sur mesure : la 3D en haut (ou à gauche sur ordinateur), les pièces
// et leurs choix dessous, le prix qui suit chaque choix, puis la demande de devis.

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  CATALOGUE_DEMO,
  PIECES,
  PIECE_COULEUR_CHIFFRES,
  PRIX_BASE,
  libelleReglage,
  type Configuration,
  type PieceId,
  type Reglage,
  type Teinte,
} from '@/lib/configurateur/catalogue'
import {
  choisir,
  encoder,
  formaterPrix,
  formaterSupplement,
  nomOption,
  prix,
  raisonBlocage,
  recapitulatif,
  remarque,
} from '@/lib/configurateur/regles'
import type { EtatChargement } from './Visionneuse'
import { Picto } from './Pictos'

const Visionneuse = dynamic(() => import('./Visionneuse'), { ssr: false })


function eclaircir(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * k))
  return `rgb(${c.join(',')})`
}

/** Pastille de teinte : dégradé conique qui évoque le soleillé. */
function Pastille({ teinte }: { teinte: Teinte }) {
  const clair = eclaircir(teinte.hex, teinte.id === 'noir' ? 0.18 : 0.3)
  const fond = teinte.metal
    ? `conic-gradient(from 20deg, ${teinte.hex}, ${clair}, ${teinte.hex}, ${clair}, ${teinte.hex})`
    : teinte.hex
  return <span className="block w-9 h-9 rounded-full ring-1 ring-black/10 shrink-0" style={{ background: fond }} aria-hidden="true" />
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" aria-hidden="true">
      <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Configurateur({ initiale }: { initiale: Configuration }) {
  const [config, setConfig] = useState(initiale)
  const [piece, setPiece] = useState<PieceId>('cadran')
  const [eclatement, setEclatement] = useState(0)
  const [chargement, setChargement] = useState<EtatChargement>({ etat: 'chargement', progression: 0 })
  const [avis, setAvis] = useState<string | null>(null)
  const [recentrer, setRecentrer] = useState(0)
  const [etape, setEtape] = useState<'choix' | 'envoi' | 'envoye'>('choix')
  const [lienCopie, setLienCopie] = useState(false)
  const [recapAtteint, setRecapAtteint] = useState(false)
  const zoneChoix = useRef<HTMLDivElement>(null)
  const zoneEnvoi = useRef<HTMLDivElement>(null)
  const racine = useRef<HTMLDivElement>(null)

  // La scène 3D colle sous l'en-tête du site, dont la hauteur change selon l'écran
  useEffect(() => {
    const entete = document.querySelector('header')
    if (!entete || !racine.current) return
    const poser = () => racine.current?.style.setProperty('--en-tete', `${entete.getBoundingClientRect().height}px`)
    poser()
    const obs = new ResizeObserver(poser)
    obs.observe(entete)
    return () => obs.disconnect()
  }, [])

  // Barre de prix du téléphone : inutile dès que le récapitulatif (et son bouton) est à l'écran
  // ou déjà passé (elle masquerait alors le pied de page)
  useEffect(() => {
    const zone = zoneEnvoi.current
    if (!zone) return
    const obs = new IntersectionObserver(([e]) => setRecapAtteint(e.isIntersecting || e.boundingClientRect.top < 0))
    obs.observe(zone)
    return () => obs.disconnect()
  }, [])

  // Le lien de la page décrit toujours la montre affichée (à partager ou rouvrir plus tard)
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('c', encoder(config))
    window.history.replaceState(null, '', url)
  }, [config])

  const total = prix(config)
  const pieceCourante = PIECES.find((p) => p.id === piece)!

  function changer(reglage: Reglage, option: string) {
    const { config: suivante, ajustements } = choisir(config, reglage, option)
    setConfig(suivante)
    setAvis(
      ajustements.length
        ? ajustements.map((a) => `${libelleReglage(a.reglage)} : « ${nomOption(a.reglage, a.nouveau)} ». ${a.raison}`).join(' ')
        : null,
    )
  }

  function ouvrirPiece(p: PieceId, defiler: boolean) {
    setPiece(p)
    setAvis(null)
    if (defiler) zoneChoix.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLienCopie(true)
      setTimeout(() => setLienCopie(false), 2000)
    } catch {
      setLienCopie(false)
    }
  }

  function commander() {
    setEtape('envoi')
    requestAnimationFrame(() => zoneEnvoi.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div ref={racine} className="bg-[#120b06] [--en-tete:77px]">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* ── Scène 3D ── */}
        <section
          aria-label="Aperçu 3D de la montre"
          className="sticky top-[var(--en-tete)] z-20 h-[42svh] min-h-[260px] lg:h-[calc(100svh-var(--en-tete))] overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% 42%, #3a2413 0%, #1c1009 45%, #0d0704 100%)' }}
        >
          <Visionneuse
            config={config}
            eclatement={eclatement}
            recentrer={recentrer}
            onEtat={setChargement}
            onToucherPiece={(p) => ouvrirPiece(p, true)}
          />

          {chargement.etat === 'chargement' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <p className="text-amber-100/80 text-sm">Chargement de la montre 3D</p>
              <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400 transition-[width] duration-200" style={{ width: `${Math.round(chargement.progression * 100)}%` }} />
              </div>
            </div>
          )}
          {chargement.etat === 'erreur' && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <p className="text-amber-100/80 text-sm max-w-xs">
                La 3D ne peut pas s&apos;afficher sur cet appareil. Vous pouvez tout de même composer votre montre ci-dessous.
              </p>
            </div>
          )}

          {/* Commandes posées sur la scène */}
          <div className="absolute top-3 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">Atelier sur mesure</p>
            <button
              type="button"
              onClick={() => setRecentrer((n) => n + 1)}
              className="pointer-events-auto text-xs text-amber-100/80 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 py-1 transition"
            >
              Recentrer
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <label htmlFor="eclatement" className="text-xs font-semibold text-amber-100 whitespace-nowrap">
                Vue éclatée
              </label>
              <input
                id="eclatement"
                type="range"
                min={0}
                max={100}
                value={Math.round(eclatement * 100)}
                onChange={(e) => setEclatement(Number(e.target.value) / 100)}
                className="flex-1 accent-amber-400 h-6 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-[11px] text-stone-300/80">
              Glissez pour tourner la montre, touchez une pièce pour la modifier.
            </p>
          </div>
        </section>

        {/* ── Panneau des choix ── */}
        <section className="relative z-10 bg-white text-stone-900 lg:min-h-[calc(100svh-var(--en-tete))] flex flex-col">
          {CATALOGUE_DEMO && (
            <p className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-5 py-2.5">
              <strong className="font-semibold">Démo.</strong> Pièces, teintes et prix d&apos;exemple, en attendant le catalogue de la boutique.
            </p>
          )}

          <div className="px-5 pt-5 pb-4 flex items-end justify-between gap-4 border-b border-stone-100">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Créez votre montre</h1>
              <p className="text-sm text-stone-500 mt-0.5">Seiko mod, montée et réglée à la main</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black tabular-nums" aria-live="polite">{formaterPrix(total)}</p>
              <p className="text-[11px] text-stone-500">{CATALOGUE_DEMO ? "prix d'exemple" : 'prix indicatif'}</p>
            </div>
          </div>

          {/* Onglets des pièces */}
          <nav aria-label="Pièces de la montre" className="border-b border-stone-100">
            <ul className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] lg:flex-wrap">
              {PIECES.map((p) => {
                const actif = p.id === piece
                return (
                  <li key={p.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => ouvrirPiece(p.id, false)}
                      aria-current={actif ? 'true' : undefined}
                      className={`text-left rounded-xl border px-3 py-2 transition ${
                        actif ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="block text-[11px] uppercase tracking-wide text-stone-500">{p.nom}</span>
                      <span className="block text-sm font-semibold whitespace-nowrap">{nomOption(p.id, config[p.id])}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Choix de la pièce ouverte */}
          <div ref={zoneChoix} className="px-5 py-5 scroll-mt-[calc(42svh+var(--en-tete))] lg:scroll-mt-[var(--en-tete)]">
            <h2 className="text-base font-bold mb-3">{pieceCourante.titre}</h2>
            <ListeOptions reglage={piece} config={config} onChoisir={changer} />

            {piece === 'chiffres' && config.chiffres !== 'index' && (
              <div className="mt-5">
                <h3 className="text-sm font-bold mb-2">{PIECE_COULEUR_CHIFFRES.titre}</h3>
                <ListeOptions reglage="couleurChiffres" config={config} onChoisir={changer} compact />
              </div>
            )}

            {remarque(config, piece) && <p className="mt-3 text-xs text-stone-500">{remarque(config, piece)}</p>}
            {avis && (
              <p role="status" className="mt-3 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {avis}
              </p>
            )}

            <div className="mt-5 flex justify-end">
              {PIECES.findIndex((p) => p.id === piece) < PIECES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => ouvrirPiece(PIECES[PIECES.findIndex((p) => p.id === piece) + 1].id, false)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                  Pièce suivante : {PIECES[PIECES.findIndex((p) => p.id === piece) + 1].nom} <Chevron />
                </button>
              ) : (
                <button type="button" onClick={commander} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800">
                  Voir le récapitulatif <Chevron />
                </button>
              )}
            </div>
          </div>

          {/* Récapitulatif et envoi */}
          <div ref={zoneEnvoi} className="mt-auto border-t border-stone-100 px-5 py-5 bg-stone-50 scroll-mt-[calc(42svh+var(--en-tete))] lg:scroll-mt-[var(--en-tete)]">
            {etape === 'envoye' ? (
              <div className="text-center py-6">
                <p className="text-lg font-bold">Configuration envoyée</p>
                <p className="text-sm text-stone-600 mt-1">Nous étudions votre montre et revenons vers vous sous 48 h avec un devis.</p>
                <button
                  type="button"
                  onClick={() => setEtape('choix')}
                  className="mt-4 text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                  Composer une autre montre
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold mb-3">Votre montre</h2>
                <dl className="text-sm divide-y divide-stone-200/70">
                  <div className="flex justify-between gap-4 py-1.5">
                    <dt className="text-stone-500">Montre de base montée</dt>
                    <dd className="tabular-nums">{formaterPrix(PRIX_BASE)}</dd>
                  </div>
                  {recapitulatif(config).map((l) => (
                    <div key={l.libelle} className="flex justify-between gap-4 py-1.5">
                      <dt className="text-stone-500">{l.libelle}</dt>
                      <dd className="text-right">
                        {l.valeur}
                        <span className="block text-[11px] text-stone-500 tabular-nums">{formaterSupplement(l.supplement)}</span>
                      </dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 pt-2.5">
                    <dt className="font-bold">Total</dt>
                    <dd className="font-black tabular-nums">{formaterPrix(total)}</dd>
                  </div>
                </dl>
                <p className="text-[11px] text-stone-500 mt-2">Prix indicatif, confirmé sur le devis. Aucun paiement à cette étape.</p>

                {etape === 'choix' ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={commander}
                      className="w-full px-6 py-3.5 bg-amber-500 text-amber-950 font-bold rounded-xl hover:bg-amber-400 transition"
                    >
                      Demander le devis de cette montre
                    </button>
                    <button type="button" onClick={copierLien} className="text-sm text-stone-600 hover:text-stone-900 py-1">
                      {lienCopie ? 'Lien copié' : 'Copier le lien de cette montre'}
                    </button>
                  </div>
                ) : (
                  <FormulaireDevis config={config} onAnnuler={() => setEtape('choix')} onEnvoye={() => setEtape('envoye')} />
                )}
              </>
            )}
          </div>

          <p className="px-5 py-3 text-[11px] text-stone-500 border-t border-stone-100">
            Modèle 3D modifié d&apos;après un{' '}
            <a className="underline hover:text-stone-700" href="https://sketchfab.com/3d-models/rolex-datejust-9ad3e4c91e91405d9fc526c8ef496d0e" target="_blank" rel="noopener noreferrer">
              modèle
            </a>{' '}
            de{' '}
            <a className="underline hover:text-stone-700" href="https://sketchfab.com/YevhenArtamonov" target="_blank" rel="noopener noreferrer">
              Yevhen Artamonov
            </a>
            , licence{' '}
            <a className="underline hover:text-stone-700" href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
              CC BY 4.0
            </a>
            .
          </p>
        </section>
      </div>

      {/* Téléphone : le prix reste sous les yeux pendant les choix */}
      {etape === 'choix' && !recapAtteint && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-lg font-black tabular-nums leading-tight text-stone-900">{formaterPrix(total)}</p>
            <p className="text-[11px] text-stone-500 leading-tight">{CATALOGUE_DEMO ? "prix d'exemple" : 'prix indicatif'}</p>
          </div>
          <button
            type="button"
            onClick={commander}
            className="ml-auto px-5 py-3 bg-amber-500 text-amber-950 font-bold rounded-xl hover:bg-amber-400 transition text-sm"
          >
            Demander le devis
          </button>
        </div>
      )}
    </div>
  )
}

function ListeOptions({
  reglage,
  config,
  onChoisir,
  compact = false,
}: {
  reglage: Reglage
  config: Configuration
  onChoisir: (r: Reglage, o: string) => void
  compact?: boolean
}) {
  const options = reglage === 'couleurChiffres' ? PIECE_COULEUR_CHIFFRES.options : PIECES.find((p) => p.id === reglage)!.options
  const teintes = reglage === 'cadran' || reglage === 'couleurChiffres'
  return (
    <div role="radiogroup" aria-label={reglage} className={`grid gap-2 ${teintes ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((o) => {
        const actif = config[reglage] === o.id
        const bloque = raisonBlocage(config, reglage, o.id)
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={actif}
            disabled={!!bloque}
            onClick={() => onChoisir(reglage, o.id)}
            className={`flex items-center gap-3 text-left rounded-xl border px-3 transition ${compact ? 'py-2' : 'py-2.5'} ${
              actif
                ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                : bloque
                  ? 'border-stone-100 opacity-50 cursor-not-allowed'
                  : 'border-stone-200 hover:border-stone-400'
            }`}
          >
            {teintes ? (
              <Pastille teinte={o as Teinte} />
            ) : (
              <span className={actif ? 'text-amber-700' : 'text-stone-600'}>
                <Picto reglage={reglage} option={o.id} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-tight">{o.nom}</span>
              {bloque ? (
                <span className="block text-[11px] text-stone-500 leading-snug">{bloque}</span>
              ) : teintes ? (
                <span className="block text-xs text-stone-500 tabular-nums">{formaterSupplement(o.supplement)}</span>
              ) : (
                o.detail && <span className="block text-xs text-stone-500 leading-snug">{o.detail}</span>
              )}
            </span>
            {!teintes && <span className="text-xs text-stone-500 tabular-nums whitespace-nowrap">{formaterSupplement(o.supplement)}</span>}
          </button>
        )
      })}
    </div>
  )
}

function FormulaireDevis({
  config,
  onAnnuler,
  onEnvoye,
}: {
  config: Configuration
  onAnnuler: () => void
  onEnvoye: () => void
}) {
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setEnvoi(true)
    setErreur('')
    try {
      const res = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universe: 'horlogerie',
          service_type: 'custom',
          source: 'configurateur',
          configuration: encoder(config),
          name: f.get('name'),
          email: f.get('email'),
          phone: f.get('phone'),
          tour_de_poignet: f.get('poignet'),
          message: f.get('message'),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "L'envoi a échoué")
      onEnvoye()
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "L'envoi a échoué")
    } finally {
      setEnvoi(false)
    }
  }

  const champ = 'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent'
  return (
    <form onSubmit={envoyer} className="mt-5 grid gap-3">
      <h3 className="text-base font-bold">Vos coordonnées</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="grid gap-1 text-sm">
          <span>Nom <span className="text-amber-700">*</span></span>
          <input name="name" required autoComplete="name" className={champ} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>E-mail <span className="text-amber-700">*</span></span>
          <input name="email" type="email" required autoComplete="email" className={champ} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Téléphone</span>
          <input name="phone" type="tel" autoComplete="tel" className={champ} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Tour de poignet (cm)</span>
          <input name="poignet" inputMode="decimal" placeholder="Ex. 17,5" className={champ} />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        <span>Message</span>
        <textarea name="message" rows={3} placeholder="Une précision, une inspiration..." className={champ} />
      </label>
      <p className="text-[11px] text-stone-500">Vos coordonnées servent uniquement à vous répondre au sujet de ce devis.</p>
      {erreur && <p role="alert" className="text-sm text-red-700">{erreur}</p>}
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={envoi}
          className="w-full px-6 py-3.5 bg-amber-500 text-amber-950 font-bold rounded-xl hover:bg-amber-400 disabled:opacity-60 transition"
        >
          {envoi ? 'Envoi…' : 'Envoyer ma configuration'}
        </button>
        <button type="button" onClick={onAnnuler} className="text-sm text-stone-600 hover:text-stone-900 py-1">
          Revenir aux choix
        </button>
      </div>
    </form>
  )
}

