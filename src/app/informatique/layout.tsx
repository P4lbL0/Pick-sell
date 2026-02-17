import type { Metadata } from 'next'
import { Header } from '@/components/common/Header'
import { Navigation } from '@/components/common/Navigation'
import { Footer } from '@/components/common/Footer'

interface InformatiqueLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Ordinateurs & Accessoires - Univers Informatique',
  description: 'Parcourez notre sélection d\'ordinateurs reconditionnés et d\'accessoires informatiques. Services de réparation et reprise disponibles.',
}

const informatiqueNavigation = [
  { label: 'Accueil', href: '/informatique' },
  {
    label: 'Services',
    href: '/informatique/services',
    submenu: [
      { label: 'Réparation', href: '/informatique/services/repair' },
      { label: 'Reprise Ordi', href: '/informatique/services/buyback' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

export default function InformatiqueLayout({ children }: InformatiqueLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header universe="informatique">
        <Navigation links={informatiqueNavigation} universe="informatique" />
      </Header>

      <main className="flex-1">{children}</main>

      <Footer universe="informatique" />
    </div>
  )
}
