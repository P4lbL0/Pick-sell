import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlatformIcon, PLATFORM_LABELS as LABELS, normalizeContact, isPlatform, type Platform } from '@/components/common/PlatformIcon'


interface FooterContact {
  platform: Platform
  url: string
}

interface FooterProps {
  universe?: 'horlogerie' | 'informatique'
}


/** Contacts gérés dans l'admin (table contacts). Ceux de l'univers en priorité, sinon tous. */
async function getFooterContacts(universe?: string): Promise<FooterContact[]> {
  try {
    const { data, error } = await supabase.from('contacts').select('platform, url, universe')
    if (error) throw error
    const all = (data ?? [])
      .map(normalizeContact)
      .filter((c): c is typeof c & { platform: Platform } => !!c.url && isPlatform(c.platform))
    const own = universe ? all.filter(c => c.universe === universe) : []
    const list = own.length > 0 ? own : all
    // Une seule entrée par plateforme
    return [...new Map(list.map(c => [c.platform, { platform: c.platform, url: c.url }])).values()]
  } catch {
    return []
  }
}

export async function Footer({ universe }: FooterProps) {
  const contacts = await getFooterContacts(universe)

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-lg font-bold text-white mb-2">Pick Sell</div>
            {universe === 'horlogerie' && (
              <p className="text-sm">Univers Horlogerie - Ssæa Montres</p>
            )}
            {universe === 'informatique' && (
              <p className="text-sm">Univers Informatique - Ordinateurs</p>
            )}
            {!universe && (
              <p className="text-sm">Hub de shopping alternatif</p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="inline-block py-1 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              {universe && (
                <>
                  <li>
                    <Link href={`/${universe}`} className="inline-block py-1 hover:text-white transition">
                      Boutique
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${universe}/services`} className="inline-block py-1 hover:text-white transition">
                      Services
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/contact" className="inline-block py-1 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          {contacts.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-4">Nous contacter</h3>
              <div className="flex flex-wrap gap-2">
                {contacts.map((contact) => (
                  <a
                    key={contact.platform}
                    href={contact.url}
                    title={LABELS[contact.platform]}
                    aria-label={LABELS[contact.platform]}
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
                    target={contact.platform === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    <PlatformIcon platform={contact.platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2024-2026 Pick Sell. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/contact" className="hover:text-white transition">
                Contact & À Propos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
