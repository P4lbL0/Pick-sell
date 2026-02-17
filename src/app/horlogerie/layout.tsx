import type { Metadata } from 'next'
import { Header } from '@/components/common/Header'
import { Navigation } from '@/components/common/Navigation'
import { Footer } from '@/components/common/Footer'

interface HorlogerieLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Ssæa Montres - Univers Horlogerie',
  description: 'Découvrez notre collection de montres Seiko Mod, montres reconditionnées et services de réparation sur mesure.',
}

const horlogerieNavigation = [
  { label: 'Accueil', href: '/horlogerie' },
  {
    label: 'Services',
    href: '/horlogerie/services',
    submenu: [
      { label: 'Réparation & Révision', href: '/horlogerie/services/repair' },
      { label: 'Montre Personnalisée', href: '/horlogerie/services/custom' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

export default function HorlogerieLayout({ children }: HorlogerieLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header universe="horlogerie">
        <Navigation links={horlogerieNavigation} universe="horlogerie" />
      </Header>

      <main className="flex-1">{children}</main>

      <Footer universe="horlogerie" />
    </div>
  )
}
