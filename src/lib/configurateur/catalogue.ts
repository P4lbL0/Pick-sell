// Catalogue du configurateur de montre sur mesure.
//
// DÉMO : pièces, teintes et prix sont des EXEMPLES tant que la boutique n'a pas envoyé sa
// liste (références, prix, stock, incompatibilités). Tout le configurateur lit ce fichier :
// le remplacer suffit à passer aux vraies données.
//
// Les identifiants de variantes correspondent aux nœuds du modèle 3D
// (public/configurateur/montre.glb, nœuds « piece__variante ») : ne pas les renommer sans
// ré-exporter le modèle (render/montre/configurateur.py).

export const CATALOGUE_DEMO = true

/** Prix de la montre de base montée, avant options (exemple). */
export const PRIX_BASE = 140

export type PieceId = 'cadran' | 'lunette' | 'bracelet' | 'aiguilles' | 'chiffres' | 'date' | 'fond'

export interface Option {
  id: string
  nom: string
  detail?: string
  supplement: number
}

export interface Teinte extends Option {
  /** Couleur de base (sRGB). */
  hex: string
  /** Part métallique de la peinture : 0 = laqué, plus haut = soleillé plus vif. */
  metal: number
  /** Teinte claire : les inscriptions passent en foncé. */
  claire?: boolean
}

export interface Piece {
  id: PieceId
  nom: string
  titre: string
  options: Option[]
}

export const TEINTES_CADRAN: Teinte[] = [
  { id: 'noir', nom: 'Noir soleillé', hex: '#0b0b0d', metal: 0, supplement: 0 },
  { id: 'bleu-nuit', nom: 'Bleu nuit soleillé', hex: '#14234a', metal: 0.45, supplement: 0 },
  { id: 'violet', nom: 'Violet soleillé', hex: '#3b1f5c', metal: 0.45, supplement: 0 },
  { id: 'gris', nom: 'Gris soleillé', hex: '#5d6166', metal: 0.5, supplement: 0 },
  { id: 'vert', nom: 'Vert soleillé', hex: '#123b2b', metal: 0.45, supplement: 10 },
  { id: 'argent', nom: 'Argenté', hex: '#c9cbce', metal: 0.55, supplement: 10, claire: true },
  { id: 'champagne', nom: 'Champagne', hex: '#c8ad7f', metal: 0.55, supplement: 15, claire: true },
]

export const TEINTES_CHIFFRES: Teinte[] = [
  { id: 'noir', nom: 'Noir laqué', hex: '#060606', metal: 0, supplement: 0 },
  { id: 'blanc', nom: 'Blanc', hex: '#f1f0ea', metal: 0, supplement: 0 },
  { id: 'acier', nom: 'Acier poli', hex: '#e4e5e8', metal: 1, supplement: 5 },
]

export const PIECES: Piece[] = [
  {
    id: 'cadran',
    nom: 'Cadran',
    titre: 'Couleur du cadran',
    options: TEINTES_CADRAN,
  },
  {
    id: 'lunette',
    nom: 'Lunette',
    titre: 'Type de lunette',
    options: [
      { id: 'cannelee', nom: 'Cannelée', detail: 'Stries polies qui accrochent la lumière', supplement: 10 },
      { id: 'lisse', nom: 'Lisse', detail: 'Bombée et polie, plus sobre', supplement: 0 },
    ],
  },
  {
    id: 'bracelet',
    nom: 'Bracelet',
    titre: 'Type de bracelet',
    options: [
      { id: 'president', nom: 'Président', detail: 'Trois maillons arrondis, centre poli', supplement: 0 },
      { id: 'oyster', nom: 'Oyster', detail: 'Trois maillons plats, le plus sportif', supplement: 0 },
      { id: 'jubile', nom: 'Jubilé', detail: 'Cinq maillons, petits maillons polis au centre', supplement: 10 },
    ],
  },
  {
    id: 'aiguilles',
    nom: 'Aiguilles',
    titre: "Style d'aiguilles",
    options: [
      { id: 'baton', nom: 'Bâton', detail: 'Droites, avec lume', supplement: 0 },
      { id: 'mercedes', nom: 'Mercedes', detail: 'Cercle à trois branches sur les heures', supplement: 5 },
      { id: 'glaive', nom: 'Glaive', detail: 'En forme de lame', supplement: 5 },
    ],
  },
  {
    id: 'chiffres',
    nom: 'Chiffres',
    titre: 'Chiffres ou index',
    options: [
      { id: 'arabes', nom: 'Arabes orientaux', detail: '١٢ ٣ ٦ ٩', supplement: 0 },
      { id: 'index', nom: 'Index bâtons', detail: 'Barrettes en acier avec lume', supplement: 0 },
      { id: 'romains', nom: 'Romains', detail: 'XII III VI IX', supplement: 5 },
    ],
  },
  {
    id: 'date',
    nom: 'Date',
    titre: 'Guichet de date',
    options: [
      { id: 'aucune', nom: 'Sans date', detail: 'Cadran épuré', supplement: 0 },
      { id: 'guichet', nom: 'Date à 3 h', detail: 'Remplace le chiffre de 3 h', supplement: 5 },
      { id: 'loupe', nom: 'Date avec loupe', detail: 'Loupe sur le verre, date agrandie', supplement: 10 },
    ],
  },
  {
    id: 'fond',
    nom: 'Fond',
    titre: 'Fond de boîte',
    options: [
      { id: 'transparent', nom: 'Transparent', detail: 'Mouvement automatique visible', supplement: 10 },
      { id: 'plein', nom: 'Plein', detail: 'Acier vissé', supplement: 0 },
    ],
  },
]

/** Couleur des chiffres : réglage secondaire de la pièce « chiffres ». */
export const PIECE_COULEUR_CHIFFRES = {
  id: 'couleurChiffres' as const,
  titre: 'Couleur des chiffres',
  options: TEINTES_CHIFFRES,
}

export interface Configuration {
  cadran: string
  lunette: string
  bracelet: string
  aiguilles: string
  chiffres: string
  couleurChiffres: string
  date: string
  fond: string
}

export type Reglage = keyof Configuration

/** La montre phare (produit n° 51) : point de départ du configurateur. */
export const CONFIGURATION_DEPART: Configuration = {
  cadran: 'noir',
  lunette: 'cannelee',
  bracelet: 'president',
  aiguilles: 'baton',
  chiffres: 'arabes',
  couleurChiffres: 'noir',
  date: 'aucune',
  fond: 'transparent',
}

/** Ordre des réglages dans le code de configuration partagé par lien. */
export const ORDRE_REGLAGES: Reglage[] = [
  'cadran', 'lunette', 'bracelet', 'aiguilles', 'chiffres', 'couleurChiffres', 'date', 'fond',
]

export function optionsDe(reglage: Reglage): Option[] {
  if (reglage === 'couleurChiffres') return PIECE_COULEUR_CHIFFRES.options
  return PIECES.find((p) => p.id === reglage)?.options ?? []
}

export function libelleReglage(reglage: Reglage): string {
  if (reglage === 'couleurChiffres') return 'Couleur des chiffres'
  return PIECES.find((p) => p.id === reglage)?.nom ?? reglage
}

export function teinteCadran(id: string): Teinte {
  return TEINTES_CADRAN.find((t) => t.id === id) ?? TEINTES_CADRAN[0]
}

export function teinteChiffres(id: string): Teinte {
  return TEINTES_CHIFFRES.find((t) => t.id === id) ?? TEINTES_CHIFFRES[0]
}
