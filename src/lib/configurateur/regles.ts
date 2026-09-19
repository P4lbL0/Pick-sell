// Règles du configurateur : incompatibilités, prix, code de partage, récapitulatif.
// Fichier sans dépendance au navigateur : la route de devis s'en sert aussi pour recalculer
// le prix et le récapitulatif côté serveur (on ne fait pas confiance à ce qu'envoie la page).

import {
  CONFIGURATION_DEPART,
  ORDRE_REGLAGES,
  PRIX_BASE,
  optionsDe,
  libelleReglage,
  teinteCadran,
  type Configuration,
  type Reglage,
} from './catalogue'

/**
 * Pourquoi une option est impossible avec le reste de la configuration (null = possible).
 * Exemples logiques en attendant la liste de la boutique.
 */
export function raisonBlocage(c: Configuration, reglage: Reglage, option: string): string | null {
  if (reglage === 'couleurChiffres') {
    if (c.chiffres === 'index' && option !== 'acier') return 'Les index bâtons sont en acier poli.'
    if (option === 'blanc' && teinteCadran(c.cadran).claire) return 'Illisible sur un cadran clair.'
  }
  return null
}

/** Remarque sans blocage, affichée sous la pièce concernée. */
export function remarque(c: Configuration, reglage: Reglage): string | null {
  if ((reglage === 'date' || reglage === 'chiffres') && c.date !== 'aucune') {
    return 'Le guichet de date prend la place du chiffre de 3 h.'
  }
  return null
}

export interface Ajustement {
  reglage: Reglage
  nouveau: string
  raison: string
}

/** Remplace chaque option devenue impossible par la première option possible. */
function reparer(c: Configuration, sauf?: Reglage): { config: Configuration; ajustements: Ajustement[] } {
  const config = { ...c }
  const ajustements: Ajustement[] = []
  for (const r of ORDRE_REGLAGES) {
    if (r === sauf) continue
    const raison = raisonBlocage(config, r, config[r])
    if (!raison) continue
    const possible = optionsDe(r).find((o) => !raisonBlocage(config, r, o.id))
    if (possible) {
      config[r] = possible.id
      ajustements.push({ reglage: r, nouveau: possible.id, raison })
    }
  }
  return { config, ajustements }
}

/** Applique un choix et corrige ce qu'il rend impossible ailleurs. */
export function choisir(c: Configuration, reglage: Reglage, option: string) {
  if (!optionsDe(reglage).some((o) => o.id === option) || raisonBlocage(c, reglage, option)) {
    return { config: c, ajustements: [] as Ajustement[] }
  }
  return reparer({ ...c, [reglage]: option }, reglage)
}

export function nomOption(reglage: Reglage, option: string): string {
  return optionsDe(reglage).find((o) => o.id === option)?.nom ?? option
}

/** Prix de base + supplément de chaque ligne du récapitulatif (couleur des index non comptée). */
export function prix(c: Configuration): number {
  return recapitulatif(c).reduce((total, l) => total + l.supplement, PRIX_BASE)
}

export function formaterPrix(euros: number): string {
  return `${euros} €`
}

export function formaterSupplement(euros: number): string {
  if (euros === 0) return 'Inclus'
  return `${euros > 0 ? '+' : '−'} ${Math.abs(euros)} €`
}

/** Code court de la configuration, utilisé dans le lien partagé (?c=...). */
export function encoder(c: Configuration): string {
  return ORDRE_REGLAGES.map((r) => c[r]).join('.')
}

/** Lit un code ; toute valeur inconnue reprend la valeur de départ. */
export function decoder(code: string | null | undefined): Configuration {
  const valeurs = (code ?? '').split('.')
  const brut = { ...CONFIGURATION_DEPART }
  ORDRE_REGLAGES.forEach((r, i) => {
    const v = valeurs[i]
    if (v && optionsDe(r).some((o) => o.id === v)) brut[r] = v
  })
  return reparer(brut).config
}

export function codeValide(code: unknown): code is string {
  if (typeof code !== 'string' || code.length > 200) return false
  const valeurs = code.split('.')
  return valeurs.length === ORDRE_REGLAGES.length &&
    ORDRE_REGLAGES.every((r, i) => optionsDe(r).some((o) => o.id === valeurs[i]))
}

/** Une ligne par pièce, pour l'écran de validation et pour l'admin. */
export function recapitulatif(c: Configuration): { libelle: string; valeur: string; supplement: number }[] {
  return ORDRE_REGLAGES.filter((r) => r !== 'couleurChiffres').map((r) => {
    const option = optionsDe(r).find((o) => o.id === c[r])
    let valeur = option?.nom ?? c[r]
    let supplement = option?.supplement ?? 0
    if (r === 'chiffres' && c.chiffres !== 'index') {
      const couleur = optionsDe('couleurChiffres').find((o) => o.id === c.couleurChiffres)
      valeur += `, ${couleur?.nom.toLowerCase() ?? c.couleurChiffres}`
      supplement += couleur?.supplement ?? 0
    }
    return { libelle: libelleReglage(r), valeur, supplement }
  })
}

export function recapitulatifTexte(c: Configuration): string {
  return recapitulatif(c).map((l) => `${l.libelle} : ${l.valeur}`).join('\n')
}
