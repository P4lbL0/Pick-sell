import type { Metadata } from 'next'
import { Header } from '@/components/common/Header'
import { Navigation } from '@/components/common/Navigation'
import { Footer } from '@/components/common/Footer'

export const metadata: Metadata = {
  title: 'Contact & À Propos - Pick Sell',
  description: 'Contactez-nous et en savoir plus sur Pick Sell.',
}

const contactNavigation = [
  { label: '⌚ Horlogerie', href: '/horlogerie' },
  { label: '💻 Informatique', href: '/informatique' },
]

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header universe="horlogerie">
        <Navigation links={contactNavigation} universe="horlogerie" />
      </Header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
