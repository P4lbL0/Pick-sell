/**
 * Shared utility functions
 */

export const UNIVERSES = {
  horlogerie: {
    name: 'Horlogerie',
    label: 'Ssæa Montres',
    slug: 'horlogerie',
    color: 'from-amber-900 to-amber-700',
  },
  informatique: {
    name: 'Informatique',
    label: 'Ordinateurs',
    slug: 'informatique',
    color: 'from-slate-900 to-slate-700',
  },
}

export const CATEGORIES = {
  horlogerie: [
    { id: 'seiko-mod', label: 'Seiko Mod', slug: 'seiko-mod' },
    { id: 'diverse', label: 'Montres Diverses', slug: 'diverse' },
    { id: 'accessories', label: 'Accessoires', slug: 'accessories' },
  ],
  informatique: [
    { id: 'computer', label: 'Ordinateurs', slug: 'computer' },
    { id: 'accessories', label: 'Accessoires', slug: 'accessories' },
  ],
}

export const SERVICES = {
  horlogerie: {
    repair: 'Réparation, Restauration & Révision',
    custom: 'Montre Personnalisée / Sur-mesure',
  },
  informatique: {
    repair: 'Réparation',
    buyback: 'Reprise d\'ordinateur',
  },
}

export const EXTERNAL_LINKS = {
  vinted: process.env.NEXT_PUBLIC_VINTED_PROFILE || '#',
  whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')}?text=Bonjour,%20je%20suis%20intéressé`,
  email: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
}

/**
 * Format currency to EUR
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

/**
 * Format date to French locale
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
