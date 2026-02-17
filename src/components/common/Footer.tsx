'use client'

import Link from 'next/link'
import { EXTERNAL_LINKS } from '@/utils/constants'

interface FooterContact {
  platform: 'email' | 'whatsapp' | 'tiktok' | 'instagram' | 'vinted'
  url: string
  label: string
}

interface FooterProps {
  universe?: 'horlogerie' | 'informatique'
  contacts?: FooterContact[]
}

export function Footer({ universe, contacts = [] }: FooterProps) {
  const defaultContacts: FooterContact[] = [
    { platform: 'email', url: EXTERNAL_LINKS.email, label: 'Email' },
    { platform: 'whatsapp', url: EXTERNAL_LINKS.whatsapp, label: 'WhatsApp' },
    { platform: 'instagram', url: '#', label: 'Instagram' },
    { platform: 'tiktok', url: '#', label: 'TikTok' },
  ]

  const footerContacts = contacts.length > 0 ? contacts : defaultContacts

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
            <h3 className="font-semibold text-white mb-4">Navigation Quick</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Accueil
                </Link>
              </li>
              {universe && (
                <>
                  <li>
                    <Link
                      href={`/${universe}`}
                      className="hover:text-white transition"
                    >
                      Produits
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${universe}/services`}
                      className="hover:text-white transition"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white transition"
                    >
                      Contact
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Nous Contacter</h3>
            <div className="flex space-x-4">
              {footerContacts.map((contact) => (
                <a
                  key={contact.platform}
                  href={contact.url}
                  title={contact.label}
                  className="text-gray-300 hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconForPlatform platform={contact.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2024-2026 Pick Sell. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/contact"
                className="hover:text-white transition"
              >
                Contact & À Propos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function IconForPlatform({
  platform,
}: {
  platform: 'email' | 'whatsapp' | 'tiktok' | 'instagram' | 'vinted'
}) {
  switch (platform) {
    case 'email':
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.393.774-2.591 1.85-3.506 3.203C3.02 9.402 2.5 11.044 2.5 12.734c0 1.555.372 3.078 1.083 4.495.71 1.417 1.712 2.678 2.948 3.636 1.237.958 2.667 1.7 4.172 2.097.88.236 1.784.354 2.69.354 1.962 0 3.872-.471 5.608-1.398l.209-.11 3.736 1.001-.961-3.536.06-.101c.921-1.573 1.426-3.334 1.426-5.15 0-6.635-5.396-12.03-12.03-12.03z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221c.004.12.007.24.007.36 0 3.688-2.808 7.945-7.945 7.945-1.578 0-3.05-.463-4.287-1.262.22.026.44.039.664.039 1.31 0 2.517-.447 3.476-1.199-.122.003-.247.004-.371.004-1.277 0-2.452-.429-3.384-1.15.09.013.18.02.274.02 1.27 0 2.42-.427 3.35-1.143-1.233-.2-2.284-1.31-2.67-3.07.17.037.346.056.526.056 1.2 0 2.297-.322 3.256-.88-1.289-.266-2.386-1.384-2.787-2.685.203.062.41.094.621.094 1.243 0 2.369-.42 3.271-1.121-1.232-.202-2.28-1.312-2.666-3.068.176.037.354.057.533.057 1.264 0 2.409-.425 3.339-1.136z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 5.1-1.75v3.45a6.35 6.35 0 0 1-5.1-2.36A6.3 6.3 0 0 1 12 5.5a6.3 6.3 0 0 0 7.59.69v3.45a4.89 4.89 0 0 0-3-1.25z" />
        </svg>
      )
    case 'vinted':
      return (
        <span className="font-bold text-sm">V</span>
      )
    default:
      return null
  }
}
