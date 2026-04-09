# 🔧 CORRECTIFS RAPIDES - Pick Sell

Guide d'implémentation des fixes les plus critiques. Temps total estimé : **3-4 jours**.

---

## 🔴 BLOC 1 : SÉCURITÉ & ENVIRONNEMENT (2 heures)

### Fix 1.1 : Créer `.env.local` complet

**Fichier** : `.env.local`

```env
# ===== SUPABASE (REQUIS) =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxyyyzzz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== CONTACTS & EXTERNAL LINKS =====
NEXT_PUBLIC_WHATSAPP_NUMBER=+33612345678
NEXT_PUBLIC_CONTACT_EMAIL=contact@picksell.fr
NEXT_PUBLIC_VINTED_PROFILE=https://vinted.fr/member/YOUR_ID

# ===== APP CONFIG =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Checker que `.env.local` est dans `.gitignore`  
✅ Créer `.env.local.example` pour la doc

---

### Fix 1.2 : Vérifier env vars au démarrage

**Fichier** : `src/app/layout.tsx` (ou nouveau `middleware.ts`)

```typescript
// Ajouter au top de next.config.ts ou middleware.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(
    `❌ Missing required environment variables:\n${missingEnvVars.join(', ')}\n` +
    `See .env.local.example for required setup.`
  )
}
```

---

### Fix 1.3 : Fixer non-null asserts dans routes API

**Fichiers affectés** :
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/contacts/route.ts`
- `src/app/api/admin/services/route.ts`
- `src/app/api/admin/quote-form-configs/route.ts`
- `src/app/api/admin/hero-slides/route.ts`
- `src/app/api/contacts/route.ts`

**AVANT** :
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

**APRÈS** :
```typescript
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Admin Supabase credentials not configured')
  }
  
  return createClient(url, key)
}

// Usage:
const supabase = getSupabaseAdmin()
```

---

## 🔴 BLOC 2 : FICHIERS MANQUANTS (1 heure)

### Fix 2.1 : Créer `/public/images/placeholder.jpg`

**Télécharger** une image de placeholder générique et la sauvegarder à :  
`/pick-sell/public/images/placeholder.jpg`

Dimensions recommandées : 400x400px (carré)

**Utiliser dans composants** :
```typescript
const imageUrl = product.image_url || '/images/placeholder.jpg'
```

---

### Fix 2.2 : Créer `/api/admin/colors` route manquante

**Fichier** : `src/app/api/admin/colors/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Admin credentials not configured')
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')

    let query = getSupabaseAdmin().from('product_colors').select('*')
    if (productId) query = query.eq('product_id', productId)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[colors] GET error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await getSupabaseAdmin()
      .from('product_colors')
      .insert([body])
      .select()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('[colors] POST error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

    const { error } = await getSupabaseAdmin()
      .from('product_colors')
      .delete()
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[colors] DELETE error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
```

---

## 🟠 BLOC 3 : TYPES & INCOHÉRENCES (3 heures)

### Fix 3.1 : Standardiser ContentBlock types

**Fichier** : `src/lib/types/index.ts`

**AVANT** :
```typescript
export interface ContentBlock {
  id: string
  // ...
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
}
```

**APRÈS** :
```typescript
export interface ContentBlock {
  id: string
  key: string
  title?: string
  content: string
  universe?: 'horlogerie' | 'informatique' | 'global'
  bg_image_url?: string
  bg_video_url?: string
  bg_overlay_opacity?: number
  created_at: string
  updated_at?: string
}
```

### Fix 3.2 : Standardiser Service types

**Fichier** : `src/lib/types/index.ts`

```typescript
export interface Service {
  id: string
  title: string
  slug: string
  description: string
  type: 'repair' | 'custom' | 'buyback'
  universe: 'horlogerie' | 'informatique'
  contact_url?: string
  images?: string[]
  created_at: string
  // REMOVE: createdAt, updatedAt - use snake_case for DB match
}
```

### Fix 3.3 : Supprimer ProductDetail inutilisé

**Fichier** : `src/lib/types/index.ts`

Supprimer ces lignes :
```typescript
export interface ProductDetail extends Product {
  detailedDescription: string
}
```

Utiliser `Product` partout à la place.

---

## 🟠 BLOC 4 : SÉCURITÉ API (2 heures)

### Fix 4.1 : Cacher errors au client

**Pattern** : Toutes les routes API admin

**AVANT** :
```typescript
} catch (error: any) {
  return NextResponse.json(
    { error: error.message },  // ❌ Expose stack trace!
    { status: 500 }
  )
}
```

**APRÈS** :
```typescript
} catch (error: any) {
  const message = error instanceof Error ? error.message : 'Erreur inconnue'
  console.error('[endpoint-name] error:', message)
  return NextResponse.json(
    { error: 'Erreur serveur' },  // ✅ Generic message
    { status: 500 }
  )
}
```

### Fix 4.2 : Protéger admin avec middleware

**Fichier** : `src/middleware.ts` (créer)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protéger /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminPassword = request.headers.get('x-admin-password')
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    
    if (!correctPassword || adminPassword !== correctPassword) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

**Ou utiliser Supabase Auth** (plus robuste) - voir documentation Supabase.

---

## 🟠 BLOC 5 : FEATURES MANQUANTES (4-5 heures)

### Fix 5.1 : Afficher product_colors

**Fichier** : `src/app/horlogerie/products/[id]/page.tsx`

Ajouter sous la section prix :
```typescript
export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)
  const colors = await getProductColors(product.id) // À créer dans API

  return (
    <main>
      {/* ... existing content ... */}
      
      {colors && colors.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Coloris disponibles</h3>
          <div className="grid grid-cols-3 gap-4">
            {colors.map(color => (
              <div key={color.id} className="text-center">
                <div
                  className="w-full h-24 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: color.hex_color }}
                />
                <p className="mt-2 font-medium">{color.name}</p>
                <p className="text-sm text-gray-600">Stock: {color.stock}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

async function getProductColors(productId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/${productId}/colors`,
    { next: { revalidate: 60 } }
  )
  return res.ok ? res.json() : []
}
```

### Fix 5.2 : Parser HTML long_description

**Fichier** : `package.json`

Ajouter dépendance :
```json
{
  "dependencies": {
    "html-react-parser": "^5.0.0"
  }
}
```

**Usage** : `src/app/horlogerie/products/[id]/page.tsx`

```typescript
import parse from 'html-react-parser'

export default function ProductDetail() {
  return (
    <div className="prose prose-sm max-w-none">
      {parse(product.long_description || '')}
    </div>
  )
}
```

### Fix 5.3 : Ajouter Error Boundaries

**Fichier** : `src/app/admin/error.tsx` (créer)

```typescript
'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Erreur</h2>
        <p className="text-gray-700 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
```

### Fix 5.4 : Implémenter envoi d'emails

**Option 1 : Resend (recommandé)**

```bash
npm install resend
```

**Fichier** : `src/app/api/quote-requests/route.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Save quote to DB first...
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([quoteData])
      .select()

    // Send email to admin
    await resend.emails.send({
      from: 'noreply@picksell.fr',
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      subject: `Nouvelle demande de devis: ${quoteData.service_type}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom:</strong> ${quoteData.name}</p>
        <p><strong>Email:</strong> ${quoteData.email}</p>
        <p><strong>Type:</strong> ${quoteData.service_type}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes">Voir en admin</a>
      `,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
```

---

## 🟡 BLOC 6 : AMÉLIORATIONS (2-3 jours)

### Fix 6.1 : Ajouter SEO metadata

**Fichier** : `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Pick Sell - Horlogerie et Informatique',
  description: 'Montres Seiko MOD, ordinateurs et accessoires',
  openGraph: {
    title: 'Pick Sell',
    description: 'Shopping alternatif',
    url: process.env.NEXT_PUBLIC_APP_URL,
    type: 'website',
  },
}
```

### Fix 6.2 : Image size categories

**Utiliser `next/image`** au lieu de `<img>` :

```typescript
import Image from 'next/image'

<Image
  src={product.image_url}
  alt={product.title}
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false}
/>
```

### Fix 6.3 : Search + Filter sur catalogue

Créer `src/components/common/FilteredProducts.tsx` :

```typescript
'use client'

import { useState, useMemo } from 'react'

export function FilteredProducts({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState('')

  const filtered = useMemo(() => {
    return products.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1] &&
      (!selectedCategory || p.category === selectedCategory)
    )
  }, [products, search, priceRange, selectedCategory])

  return (
    <>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      {/* Price slider, category filter... */}
      <ProductGrid products={filtered} />
    </>
  )
}
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

- [ ] `.env.local` créé avec toutes les variables
- [ ] Placeholder image présent
- [ ] `/api/admin/colors` créée
- [ ] Non-null asserts fixés
- [ ] Error boundaries ajoutées
- [ ] Types standardisés (snake_case)
- [ ] Errors cachées au client
- [ ] Product colors affichées
- [ ] Emails sending implémenté
- [ ] Admin protégé par auth
- [ ] Tests en production (netlify/vercel)

---

## 📊 GAIN PAR CORRECTIF

| Fix | Temps | Impact |
|-----|-------|--------|
| Bloc 1 | 2h | 🔴 CRITIQUE |
| Bloc 2 | 1h | 🔴 CRITIQUE |
| Bloc 3 | 3h | 🟠 HAUTE |
| Bloc 4 | 2h | 🟠 HAUTE |
| Bloc 5 | 5h | 🟠 HAUTE |
| Bloc 6 | 2-3h | 🟡 MOYEN |
| **TOTAL** | **15-16h** | **Production Ready** |

