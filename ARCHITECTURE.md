# Architecture Pick Sell - Documentation Technique

## Vue d'ensemble

Pick Sell est une application Next.js avec Strapi CMS. L'architecture est modulaire et flexible pour supporter deux "univers" distincts avec leurs propres styles, navigations et contenus.

## 1. Frontend Architecture (Next.js)

### App Router Structure

```
/horlogerie        → Section Horlogerie (Ssæa Montres)
/informatique      → Section Informatique
/legal             → Pages légales (Privacy, Terms)
```

### Stratégie de Routing

**Horlogerie** :
```
/horlogerie                 → Accueil
/horlogerie/seiko-mod       → Collection Seiko MOD
/horlogerie/diverses        → Montres diverses
/horlogerie/accessories     → Accessoires
/horlogerie/services/repair → Réparation & Révision
/horlogerie/services/custom → Montre sur-mesure
/horlogerie/faq             → FAQ
/horlogerie/contact         → Contact
/horlogerie/products/[id]   → Détail produit
```

**Informatique** :
```
/informatique               → Accueil
/informatique/computers     → Collection ordinateurs
/informatique/accessories   → Accessoires
/informatique/services/repair → Réparation
/informatique/services/buyback → Reprise
/informatique/contact       → Contact
/informatique/products/[id] → Détail produit
```

### Component Hierarchy

```
<RootLayout>
  ├── <Header>
  │   └── <Navigation>
  ├── <MainContent>
  │   ├── <HeroSlider>
  │   ├── <ProductGrid>
  │   │   └── <ProductCard> (x N)
  │   ├── <ContentSection>
  │   └── <ServiceCard> (x variations)
  └── <Footer>
```

## 2. API & Data Flow

### Strapi API Client

**File** : `src/lib/api/client.ts`

Fonctions principales :
- `getProducts(universe)` - Récupérer tous les produits
- `getProductsByCategory(universe, category)` - Filtrer par catégorie
- `getProductById(id)` - Détail produit
- `getContentBlock(key)` - Contenu administrable
- `getHeroSlides(universe)` - Bannières accueil

### Data Types

**File** : `src/lib/types/index.ts`

```typescript
interface Product {
  id: string
  title: string
  price: number
  stock: number
  category: 'seiko-mod' | 'diverse' | 'computer' | ...
  universe: 'horlogerie' | 'informatique'
  images: string[]
  videos?: string[]
  vintedLink?: string
}

interface Service {
  id: string
  type: 'repair' | 'custom' | 'buyback'
  universe: 'horlogerie' | 'informatique'
  images?: string[]
}
```

### Flow de récupération de données

```
Component (Client/Server)
    ↓
useProducts() [Hook]
    ↓
fetch('/api/products')
    ↓
strapiFetch() [API Client]
    ↓
Strapi Backend (http://localhost:1337)
    ↓
Response (JSON)
    ↓
Display Component
```

## 3. Custom Hooks

**File** : `src/hooks/index.ts`

- `useProducts(universe?)` - Fetch produits avec état de chargement
- `useServices(type?)` - Fetch services
- `useContentBlock(key)` - Fetch contenu texte

Exemple :
```typescript
function MyComponent() {
  const { products, loading, error } = useProducts('horlogerie')
  
  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>
  
  return <ProductGrid products={products} />
}
```

## 4. Styles & Design System

### Tailwind CSS

**Configuration** : `tailwind.config.ts`

#### Theme Colors

**Horlogerie** :
- Gradient : `from-amber-900 to-amber-700`
- Primaire : `amber-900`

**Informatique** :
- Gradient : `from-slate-900 to-slate-700`
- Primaire : `slate-900`

### Component Classes

Réutilisables :
- `.container` - Max-width container 7xl
- `.btn-primary` - Bouton primaire
- `.card` - Carte de contenu
- `.grid` - Grille responsive

## 5. Strapi CMS Schema

### Collections principales

#### Products
```
- title (string, required)
- price (decimal)
- category (enum)
- universe (enum: horlogerie, informatique)
- stock (integer)
- images (media, multiple)
- videos (media, multiple)
- vintedLink (URL)
- shortDescription (text)
- detailedDescription (richtext)
- reviews (relation)
```

#### Services
```
- title (string)
- description (richtext)
- type (enum: repair, custom, buyback)
- universe (enum)
- images (media, multiple)
- contactUrl (URL)
- slug (string, unique)
```

#### ContentBlocks
```
- key (string, unique) - ex: "concept_horlogerie"
- title (string)
- content (richtext)
- universe (enum: horlogerie, informatique, global)
```

#### HeroSlides
```
- title (string)
- subtitle (string)
- image (media)
- video (media)
- universeType (enum)
- ctaText (string)
- ctaLink (URL)
- order (integer)
```

## 6. Environment Variables

```env
# API
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token

# Site
NEXT_PUBLIC_SITE_NAME=Pick Sell
NEXT_PUBLIC_VINTED_PROFILE=https://...
NEXT_PUBLIC_WHATSAPP_NUMBER=+33...
NEXT_PUBLIC_CONTACT_EMAIL=contact@...
```

## 7. State Management

### Approche
- **Client Components** : React hooks (useState, useEffect)
- **Server Components** : Direct fetch de Strapi (par défaut)
- **NO Redux/Context** : Simple pour MVP, peut être ajouté si besoin

### Pattern

```typescript
'use client'

export function ProductList() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])
  
  return <ProductGrid products={products} />
}
```

## 8. Performance Optimization

### Image Optimization
- Next.js `<Image>` component (lazy loading)
- Responsive `sizes` prop
- WebP format support

### Caching
- Server: ISR (revalidate)
- Client: React Query patterns (bonus)

### Code Splitting
- App Router : Code split automatique par route

## 9. SEO & Metadata

**Pattern** :
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
}
```

À implémenter :
- Metadata dynamique pour produits
- Structured data (Schema.org)
- Sitemap + robots.txt

## 10. Extension Future

### Ajouter une nouvelle fonctionnalité

1. **Nouvelle collection Strapi**
   - Créer dans interface Strapi
   - Ajouter type TypeScript
   - Ajouter fonction API

2. **Nouveau composant**
   - Créer en `src/components/`
   - Importer dans page
   - Utiliser hook custom si data needed

3. **Nouvelle page**
   - Créer dossier en `src/app/[univers]/`
   - Ajouter menu navigation
   - Créer layout si page parent

---

**Dernière mise à jour** : 15 Février 2026
