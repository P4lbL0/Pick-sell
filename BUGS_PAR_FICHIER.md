# 🗂️ MAPPING BUGS PAR FICHIER

Guide rapide pour naviguer et corriger les bugs spécifiques par fichier.

---

## `src/app/api/` → Routes API

### `admin/products/route.ts`
- **Ligne 6-7** : Non-null asserts `!` → **FIX**: Vérifier env vars (voir FIXES_RAPIDES.md Fix 1.3)
- **Ligne 27** : Retourne error brut au client → **FIX**: Log server, Generic message (Fix 4.1)
- **Ligne 51** : Idem (PUT)
- **Ligne 72** : Idem (DELETE)

### `admin/contacts/route.ts`
- **Ligne 7-8** : Non-null asserts `!` → **FIX**: Fix 1.3
- **Error handling** → **FIX**: Fix 4.1

### `admin/services/route.ts`
- **Ligne 6-7** : Non-null asserts `!` → **FIX**: Fix 1.3

### `admin/quote-form-configs/route.ts`
- **Ligne 6-7** : Non-null asserts `!` → **FIX**: Fix 1.3

### `admin/hero-slides/route.ts`
- **Ligne 6-7** : Non-null asserts `!` → **FIX**: Fix 1.3

### `admin/colors/route.ts` ⚠️ MISSING
- **Entièrement manquant** → **FIX**: Créer (voir FIXES_RAPIDES.md Fix 2.2)

### `contact/route.ts`
- **OK** ✅ — Bonne gestion des env vars (fallback + vérification)
- Suggestion: Ajouter Resend integration pour email sending

### `contacts/route.ts`
- **Ligne 5-8** : Non-null asserts `!` → **FIX**: Fix 1.3
- **Ligne 14** : Silent error catch → BUG: Si contacts table vide, renvoie `[]` au lieu d'erreur (peut être OK ou pas selon spec)

### `quote-requests/route.ts`
- **Statut** : ✅ Fonctionne pour sauvegarde
- **Missing** : Email sending → **FIX**: Fix 5.4

### `upload/route.ts`
- **Status** : À vérifier pour error handling
- **TODO** : Ajouter validation fichier (taille, type)

---

## `src/app/` → Pages & Layouts

### `layout.tsx` (root)
- **Missing** : Vérification env vars au démarrage → **FIX**: Fix 1.2

### `admin/layout.tsx`
- **CRITIQUE** : Aucune authentification → **FIX**: Fix 4.2 (middleware)
- **Missing** : Error boundary → **FIX**: Créer `admin/error.tsx`

### `admin/colors/page.tsx`
- **Status** : ✅ Page admin OK
- **Dépend de** : `/api/admin/colors` (manquante) → **FIX**: Fix 2.2

### `contact/page.tsx`
- **Ligne 20** : Essaie de fetch `/api/contacts` ✅ **Good**
- **Ligne 26-31** : PLATFORM_INFO hardcodé → **FIX**: OK (fallback valide)
- **Ligne 51-62** : HandleSubmit fonctionne ✅

### `horlogerie/products/[id]/page.tsx`
- **Status** : Fiche produit affiche les infos
- **Missing** : Afficher product_colors → **FIX**: Fix 5.1
- **Missing** : Parser HTML de long_description → **FIX**: Fix 5.2
- **Missing** : Afficher catégorie française au lieu de slug → **FIX**: Ajouter map constants.CATEGORIES

### `informatique/products/[id]/page.tsx`
- **Same issues as horlogerie** → **SAME FIXES**

---

## `src/lib/` → Types & Utilities

### `types/index.ts`
- **Ligne 63-92** (ContentBlock) : Double fields (snake_case + camelCase) → **FIX**: Fix 3.1
- **Ligne 64-73** (Service) : camelCase au lieu de snake_case → **FIX**: Fix 3.2
- **Ligne 48-49** (ProductDetail) : Interface inutilisée → **FIX**: Fix 3.3 (supprimer)
- **Ligne 39** (Product.vinted_url) : Duplicate avec vinted_link? → **TODO**: Vérifier schema

### `api/client.ts`
- **Status** : ✅ À vérifier pour type safety

### `api/strapi-schema.ts` ❌ DEAD CODE
- **Entire file** : Vestige Strapi, jamais utilisé → **FIX**: Supprimer

### `supabase.ts`
- **Status** : ✅ OK pour exports

---

## `src/hooks/` → Custom Hooks

### `useSupabase.ts` ⚠️ UNKNOWN
- **Status** : Probablement inutilisé → **AUDIT**: Vérifier références
- **If unused** → Supprimer

### `index.ts`
- **Exports** : À vérifier que tout utilisé

---

## `src/components/` → Composants

### `common/Footer.tsx`
- **Ligne 12-17** : Utilise `EXTERNAL_LINKS` de constants → **Issue**: ENV vars manquantes
- **FIX** : Fix 1.1 (créer `.env.local`)
- **Amélioration** : Fetch `contacts` table au lieu d'env vars → **Future**: Bonus upgrade

### `common/ProductCard.tsx`
- **Missing image** : Utilise fallback `/placeholder.jpg` → **FIX**: Fix 2.1 (créer le fichier)

### `common/HeroSlider.tsx`
- **Line 25** : Interval `3000` hardcodé → **Amélioration**: Rendre configurable

### `admin/ProductForm.tsx`
- **Missing image** : Idem ProductCard → **FIX**: Fix 2.1

### `admin/ColorForm.tsx`
- **Status** : ✅ CRUD OK (probablement)
- **Type** : Utilise client Supabase directement (inconsistent) → **FIX**: Fix 4.2 (standardiser sur API routes)

### `admin/QuoteFormConfigEditor.tsx`
- **Status** : JSON fields edit
- **Amélioration** : UI visual builder would help

---

## `src/utils/` → Utilities

### `constants.ts`
- **Ligne 39-41** : EXTERNAL_LINKS utilisent env vars manquantes
  - `NEXT_PUBLIC_VINTED_PROFILE`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `NEXT_PUBLIC_CONTACT_EMAIL`
  - **FIX**: Fix 1.1 (créer `.env.local`)

- **Ligne 20-26** : CATEGORIES object bien structuré ✅
- **Ligne 28-35** : SERVICES object bien structuré ✅

---

## `public/` → Assets

### `/placeholder.jpg` ❌ MISSING
- **Utilisé dans** : ProductCard, ProductForm, etc.
- **Impact** : Toutes les images manquantes → 404
- **FIX**: Fix 2.1 (télécharger une image)

---

## `root/` → Config Files

### `.env.local` ❌ MISSING
- **Requis** : Toutes les env vars
- **FIX**: Fix 1.1

### `.env.local.example` ❌ MISSING
- **Documentation** : À créer pour onboarding
- **Contenu** : Liste de touts les required + optional

### `next.config.ts`
- **Status** : À vérifier pour image optimization config

### `tsconfig.json`
- **Suggestion** : Mettre `strict: true` pour meilleure type safety (Fix 6 cleanup)

---

## 🎯 NAVIGATION RAPIDE PAR PRIORITÉ

### 🚨 FIX IMMÉDIATEMENT (Jour 1)

1. **Créer `.env.local`** → `src/utils/constants.ts` ligne 39-41 va fonctionner
2. **Créer `./public/images/placeholder.jpg`** → Images vont display
3. **Fixer non-null asserts** dans :
   - `src/app/api/admin/*/route.ts` (Ligne 6-7)
   - `src/app/api/contacts/route.ts` (Ligne 5-8)
4. **Créer `/src/app/api/admin/colors/route.ts`** → Colors admin va fonctionner

### ⚡ FIXES HAUTS (Jour 2-3)

5. **Fix types**:
   - `src/lib/types/index.ts` → ContentBlock + Service (Fix 3.1, 3.2)
   - Supprimer ProductDetail (Fix 3.3)
6. **Error handling**: Toutes les routes API (Fix 4.1)
7. **Middleware auth**: `src/middleware.ts` créer (Fix 4.2)
8. **Error boundaries**: `src/app/admin/error.tsx` créer

### 📌 FEATURES MANQUANTES (Jour 3-5)

9. **Product colors**: `src/app/horlogerie/products/[id]/page.tsx` + informatique
10. **HTML parsing**: Long description
11. **Email sending**: `/api/quote-requests/route.ts` + `/api/contact/route.ts`

---

## 📊 STATISTIQUES PAR FICHIER

| Fichier | Bugs | Sévérité | Temps fix |
|---------|------|----------|-----------|
| `admin/products/route.ts` | 3 | 🟠 | 30min |
| `admin/contacts/route.ts` | 2 | 🟠 | 15min |
| `admin/services/route.ts` | 1 | 🟠 | 10min |
| `admin/quote-form-configs/route.ts` | 1 | 🟠 | 10min |
| `admin/hero-slides/route.ts` | 1 | 🟠 | 10min |
| `admin/colors/route.ts` | ❌ | 🔴 | 45min |
| `admin/layout.tsx` | 2 | 🔴 | 2-3h |
| `contact/page.tsx` | 0 | ✅ | 0 |
| `horlogerie/products/[id]/page.tsx` | 3 | 🟡 | 2h |
| `informatique/products/[id]/page.tsx` | 3 | 🟡 | 2h |
| `lib/types/index.ts` | 3 | 🟠 | 1h |
| `lib/api/strapi-schema.ts` | 1 | 🟡 | 5min |
| `utils/constants.ts` | 1 (env) | 🟠 | 0 (handled by .env) |
| `components/common/Footer.tsx` | 0 | ✅ | 0 |
| `components/common/ProductCard.tsx` | 1 (image) | 🟡 | 1min |
| `middleware.ts` | ❌ | 🔴 | 1h |
| `.env.local` | ❌ | 🔴 | 30min |

**Total**: 30 items → **15-16 heures de travail**

