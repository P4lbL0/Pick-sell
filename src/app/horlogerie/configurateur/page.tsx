import type { Metadata } from 'next'
import Configurateur from '@/components/configurateur/Configurateur'
import { decoder } from '@/lib/configurateur/regles'

// Démo en attente de validation par la boutique : page accessible par son lien seulement,
// reliée nulle part sur le site et exclue des moteurs de recherche.
export const metadata: Metadata = {
  title: 'Créez votre montre — Ssæa Montres',
  description: 'Composez votre Seiko mod en 3D : cadran, lunette, bracelet, aiguilles, chiffres, date et fond.',
  robots: { index: false, follow: false },
}

export default async function ConfigurateurPage({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>
}) {
  const { c } = await searchParams
  return <Configurateur initiale={decoder(typeof c === 'string' ? c : null)} />
}
