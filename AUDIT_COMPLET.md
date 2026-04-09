# 🔍 AUDIT COMPLET - Pick Sell

**Date** : 9 avril 2026  
**Statut** : 45 problèmes identifiés  
**Priorité** : 🔴 8 critiques, 🟠 15 hautes, 🟡 22 moyennes

---

## 📊 RÉSUMÉ EXÉCUTIF

| Catégorie | Nombre | Sévérité |
|-----------|--------|----------|
| **Critiques** | 8 | 🔴 Bloquant production |
| **Hautes** | 15 | 🟠 Correction urgente |
| **Moyennes** | 22 | 🟡 À corriger prochainement |
| **TOTAL** | **45** | - |

---

## 🔴 PROBLÈMES CRITIQUES

### 1. **ADMIN SANS AUTHENTIFICATION**
**Fichier** : `/src/app/admin/layout.tsx` et routes compilées  
**Problème** : N'importe qui peut accéder à `http://localhost:3000/admin` et modifier/supprimer tous les produits, services, couleurs, etc.  
**Impact** : Données complètement compromises  
**Correctif** :
- Implémenter Supabase Auth (login) OU
- Ajouter middleware Next.js pour protéger `/admin/*`
- Ou utiliser `NEXT_PUBLIC_ADMIN_PASSWORD` avec auth basique

### 2. **MISSING ENV VARIABLES - CRASH EN PRODUCTION**
**Fichiers** : 
- `src/app/api/admin/products/route.ts:6` → `SUPABASE_SERVICE_ROLE_KEY!`
- `src/app/api/admin/contacts/route.ts:7` → `SUPABASE_SERVICE_ROLE_KEY!`
- `src/app/api/admin/services/route.ts:6` → `SUPABASE_SERVICE_ROLE_KEY!`
- `src/app/api/admin/quote-form-configs/route.ts:6` → `SUPABASE_SERVICE_ROLE_KEY!`
- `src/app/api/admin/hero-slides/route.ts:6` → `SUPABASE_SERVICE_ROLE_KEY!`

**Problème** : Non-null assert `!` = crash JavaScript si ENV var manquante  
**Impact** : Application ne démarre pas en production  
**Correctif** : Ajouter vérification + message d'erreur clair

```typescript
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured')
}
```

### 3. **PLACEHOLDER.JPG N'EXISTE PAS**
**Fichiers** : 
- `src/components/common/ProductCard.tsx` → utilise `/placeholder.jpg`
- `src/components/admin/ProductForm.tsx` → utilise `/placeholder.jpg`
- Autres composants utilisent des URL fallback cassées

**Problème** : Fichier n'existe pas dans `/public/`  
**Impact** : Images manquantes = 404 partout  
**Correctif** : Créer `/public/images/placeholder.jpg` (image de remplacement)

### 4. **MISSING API ROUTE - COLORS ADMIN**
**Fichier** : `src/app/admin/colors/page.tsx`  
**Problème** : Page admin existe mais **aucune route `/api/admin/colors`** n'existe  
**Impact** : Les boutons delete/edit sur les couleurs font des appels à une route qui n'existe pas → 404  
**Correctif** : Créer `/src/app/api/admin/colors/route.ts`

### 5. **RLS SUPABASE INCOHÉRENT - LECTURE ADMIN IMPOSSIBLE**
**Tableau** : `quote_requests`  
**Problème** : 
- Table a RLS qui exige `authenticated` ou `service_role`
- Admin panel utilise le client anon (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) → impossible de lire
- Les formulaires d'admin affichent une liste vide

**Impact** : Impossible de consulter les devis des clients en admin  
**Correctif** : 
- Créer route API `/api/admin/quote-requests` qui utilise `SUPABASE_SERVICE_ROLE_KEY`
- OU ouvrir les RLS en lecture pour utilisateurs anon
- Actuellement fait pour `/api/quote-requests` (lecture) mais pas implémenté en mirroir côté admin

### 6. **TYPE MISMATCH - ContentBlock DOUBLE FIELDS**
**Fichier** : `src/lib/types/index.ts:63-92`  
**Problème** : 
```typescript
export interface ContentBlock {
  // ...
  created_at?: string      // ← snake_case
  updated_at?: string      // ← snake_case
  createdAt?: string       // ← camelCase
  updatedAt?: string       // ← camelCase
}
```

À la fois snake_case ET camelCase = type confusion  
**Impact** : Code qui utilise `content.createdAt` vs `content.created_at` incohérent  
**Correctif** : Standardiser à `snake_case` partout (match Supabase schema)

### 7. **SERVICE TYPE MISMATCH - SNAKE_CASE VS CAMELCASE**
**Fichier** : `src/lib/types/index.ts:64-73`  
**Problème** :
```typescript
export interface Service {
  // Supabase renvoie : created_at, slug, description
  // Type déclare : createdAt, contactUrl, (type existe en DB comme type)
  createdAt: string   // ❌ DB = created_at
  updatedAt: string   // ❌ DB n'a pas d'updated_at (?)
}
```

**Impact** : `service.created_at` undefined → affichage vide  
**Correctif** : Aligner avec le schema Supabase exact

### 8. **SECURITY - ERRORS EXPOSÉES AU CLIENT**
**Fichiers** : 
- `src/app/api/admin/products/route.ts` — catch bloc retourne error brut
- `src/app/api/admin/services/route.ts` — idem
- Autres routes API

**Problème** : Stack trace / détails BD exposés en JSON au client  
```json
{ "error": "duplicate key value violates unique constraint..." }
```

**Impact** : Info sensible divulguée  
**Correctif** : Logger erreur complète côté serveur, retourner message générique au client

---

## 🟠 PROBLÈMES HAUTS

### 9. **PAGE CONTACT - DONNÉES HARDCODÉES**
**Fichier** : `src/app/contact/page.tsx`  
**Problème** : Email/téléphone/WhatsApp sont des fausses valeurs hardcodées  
**Data réelle** : Table `contacts` Supabase existe et est gérable en admin  
**Correctif** : Remplacer valores hardcodées par fetch depuis `contacts` table

### 10. **FOOTER - DONNÉES HARDCODÉES**
**Fichier** : `src/components/common/Footer.tsx`  
**Problème** : Links footer sont en dur, utilisent `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` etc.  
**Impact** : Les ENV vars ne sont pas définies → liens cassés  
**Correctif** : 
- Définir toutes les ENV vars manquantes dans `.env.local`
- OU fetch depuis table `contacts`

### 11. **MISSING ENV VARIABLES - CONFIGURATION INCOMPLÈTE**
**Utilisées dans le code** :
- ✅ `NEXT_PUBLIC_SUPABASE_URL` — requis ✓
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` — requis ✓
- ✅ `SUPABASE_SERVICE_ROLE_KEY` — requis ✓
- ❌ `NEXT_PUBLIC_WHATSAPP_NUMBER` — utilisée dans `constants.ts:40` → Footer/Contact
- ❌ `NEXT_PUBLIC_CONTACT_EMAIL` — utilisée dans `constants.ts:41` → Footer/Contact
- ❌ `NEXT_PUBLIC_VINTED_PROFILE` — utilisée dans `constants.ts:39` → Footer

**Où c'est utilisé** :
- `src/utils/constants.ts:39-41` → EXTERNAL_LINKS
- `src/components/common/Footer.tsx` → liens footer
- `src/app/contact/page.tsx` → fallback si pas de DB

**Impact** : URLs deviennent `undefined` ou `#` → liens cassés  
**Correctif** : 
1. Créer `.env.local.example` avec toutes les variables
2. Ajouter vérification au démarrage (startsWith)
3. Ou stocker ces infos dans table `contacts` et fetch dynamiquement

### 12. **PRODUCT_COLORS NON AFFICHÉS**
**Fichier** : `src/app/horlogerie/products/[id]/page.tsx` et `informatique`  
**Problème** : Table `product_colors` est gérée en admin mais **jamais affichée** sur la fiche produit  
**Impact** : Clients ne voient pas les variantes couleur disponibles  
**Correctif** : Ajouter sélecteur couleur sur fiche produit + afficher stock par couleur

### 13. **LONG_DESCRIPTION RENDU EN TEXTE BRUT**
**Fichiers** : 
- `src/app/horlogerie/products/[id]/page.tsx`
- `src/app/informatique/products/[id]/page.tsx`

**Code** : `{product.long_description}` sans `dangerouslySetInnerHTML`  
**Problème** : Si contient du HTML/Markdown, s'affiche brut (tags visibles)  
**Correctif** : 
- Parser le HTML (utiliser `react-html-parser` ou `sanitize-html`)
- OU stocker en Markdown et utiliser `remark`

### 14. **CATÉGORIES EN ANGLAIS NON TRADUITES**
**Fichiers** : Fiches produit et grille  
**Affichage CLIENT** : `seiko-mod`, `diverse`, `computer`, `accessories` tel quel  
**Devrait être** : Seiko MOD, Diverses, Ordinateurs, Accessoires  
**Correctif** : Ajouter map de traduction + utiliser dans les composants

### 15. **PRODUCTDETAIL INTERFACE INUTILISÉE**
**Fichier** : `src/lib/types/index.ts:48-49`  
```typescript
export interface ProductDetail extends Product {
  detailedDescription: string  // ← jamais utilisée
}
```
**Problème** : Interface inutilisée + `detailedDescription` vs `long_description`  
**Correctif** : Supprimer ou unifier

### 16. **STRAPI-SCHEMA.TS VESTIGE**
**Fichier** : `src/lib/api/strapi-schema.ts`  
**Problème** : Fichier vestige d'une ancienne architecture Strapi (pas utilisé)  
**Correctif** : Supprimer

### 17. **USESUPÁBASE HOOK - PROBABLEMENT INUTILISÉ**
**Fichier** : `src/hooks/useSupabase.ts`  
**Problème** : Hook créé mais jamais importé/utilisé nulle part  
**Correctif** : Vérifier utilisation réelle OU supprimer

### 18. **REVIEWS TABLE CRÉÉE MAIS JAMAIS UTILISÉE**
**Table** : `reviews`  
**Problème** : Existe en schema Supabase, CRUD en admin absent, jamais affiché  
**Impact** : Avis clients ne peuvent pas être gérés/affichés  
**Correctif** : 
- OU intégrer (CRUD admin + affichage fiche produit)
- OU supprimer de la DB si pas voulu

### 19. **SERVICE-QUOTES TABLE INCOHÉRENTE**
**Table** : `service_quotes`  
**Problème** : Existe, admin présent, mais **jamais connectée au frontend**  
**Impact** : Grilles tarifaires services ne s'affichent pas  
**Correctif** : Afficher sur pages services OU supprimer

### 20. **STICKY-HERO COMPOSANT IMPORTÉ JAMAIS UTILISÉ**
**Fichier** : `src/lib/types/index.ts` et `src/components/common/`  
**Problème** : Composant `StickyHero` jamais importer dans pages  
**Correctif** : Supprimer ou intégrer

### 21. **MISSING ERROR BOUNDARIES**
**Issue** : Admin layout et pages n'ont pas de React error boundaries  
**Impact** : Erreur JS = page complètement blanche au lieu d'afficher UI  
**Correctif** : Ajouter error.tsx pour `/app/admin` et `/app/admin/*`

### 22. **INCONSISTENT API SECURITY PATTERN**
**Problème** :
- `ColorForm.tsx` utilise client Supabase directement
- `QuoteRequestForm.tsx` utilise API route (`/api/quote-requests`)
- Aucune pattern cohérente

**Impact** : Sécurité imprévisible  
**Correctif** : Standardiser sur API routes pour tous les appels sensibles

### 23. **SILENT ERRORS IN PROMISE.ALL**
**Fichiers** : Composants qui font plusieurs fetches parallèles  
**Problème** : Erreurs swallowées, page affiche vide sans message  
**Correctif** : Ajouter `.catch()` avec logging + UI feedback

---

## 🟡 PROBLÈMES MOYENS (Optimisation & Complétude)

### 24. **NO SEO METADATA**
**Manque** : 
- Pas de `<title>` différent / `<meta>` personnalisée par page
- Pas de Open Graph tags (partage réseaux sociaux)
- Pas de sitemap.xml / robots.txt
- Pas de canonical tags

**Correctif** : Ajouter metadata dynamique dans layout Next.js + générer sitemap

### 25. **NO PAGINATION - PRODUCTS**
**Problème** : Si 500+ produits chargés, page très lente  
**Correctif** : Implémenter pagination ou infinite scroll

### 26. **NO SEARCH/FILTER**
**Manque** : 
- Pas de recherche par titre
- Pas de filtrage par prix, catégorie, stock
- Pas de tri (prix, date, popularité)

**Correctif** : Ajouter composant SearchFilter avec query params

### 27. **NO PRODUCT VARIANTS DISPLAY**
**Issue** : Voir #12 (product_colors non affichés)  
**Correctif** : Ajouter UI pour sélectionner couleur + voir stock

### 28. **NO IMAGE OPTIMIZATION**
**Composants** : Utilisent `<img>` brut sans `next/image`  
**Impact** : Images pas compressées = page lente  
**Correctif** : Utiliser `<Image>` de Next.js avec optimization

### 29. **NO LOADING STATES**  
**Problème** : Formulaires/pages ne montraient pas spinner pendant requête  
**Impact** : UX confus, utilisateur clique multiple fois  
**Correctif** : Ajouter states `loading` + disabled buttons

### 30. **CONTACT FORM - DOUBLE VALIDATION CÔTÉ CLIENT/SERVEUR**
**Fichier** : `src/app/contact/page.tsx`  
**Problème** : Validation HTML5 + validations dupiquées pas nécessaire  
**Correctif** : Utiliser validation côté serveur uniquement (plus secure)

### 31. **HARDCODED STRINGS IN COMPONENTS**
**Exemples** : 
- "Seiko MOD", "Diverse", "Computer" en dur
- "horlogerie", "informatique" en dur
- Messages d'erreur français non extraits

**Correctif** : Créer `constants.ts` centralisé ou i18n

### 32. **NO UPLOAD ERROR HANDLING**
**Fichier** : `src/app/api/upload/route.ts`  
**Problème** : Si upload échoue, utilisateur ne sait pas pourquoi  
**Correctif** : Ajouter messages d'erreur clairs + validations taille

### 33. **PRODUCT IMAGE_URL SINGULAR**
**DB Schema** : `image_url` (singular)  
**Component code** : Parfois attend `images` (array)  
**Type** : `image_url: string`  
**Correctif** : Standardiser - soit single soit array, cohéremment

### 34. **QUOTE-REQUEST FORM CONFIG ÉDITION DIFFICILE**
**Fichier** : `src/components/admin/QuoteFormConfigEditor.tsx`  
**Problème** : UI complexe pour éditer JSON fields  
**Correctif** : Ajouter UI builder form visuel (type Formik + drag-drop ou autre)

### 35. **NO REAL EMAIL SENDING**
**Fichier** : `src/app/api/quote-requests/route.ts`  
**Problème** : Devis sauvegardés en DB mais **aucun email n'est envoyé** au client ou admin  
**Impact** : Admin ne reçoit pas notification de devis → oublie de répondre  
**Correctif** : Intégrer Resend / SendGrid / Nodemailer pour emails

### 36. **VINTED LINK NOT STANDARDIZED**
**DB fields** : `vinted_link` ET `vinted_url` (2 colonnes pour la même chose!)  
**Impact** : Confusion dans le code  
**Correctif** : Unifier en une seule colonne `vinted_link`

### 37. **UNIVERSE TYPE INCONSISTENT**
**Schema** : 
- `universe` vs `universe_type` (utilisé dans hero_slides)
- Tous les deux valident ['horlogerie', 'informatique']

**Correctif** : Standardiser à `universe` partout

### 38. **NO BACK BUTTON / NAVIGATION BREADCRUMBS**
**Issue** : Fiche produit n'a pas de bouton retour  
**UX** : Utilisateur doit cliquer back navigateur  
**Correctif** : Ajouter breadcrumbs ou bouton retour

### 39. **NO MOBILE RESPONSIVE IMAGES**
**Problème** : Images produits pas optimisées pour mobile  
**Correctif** : Utiliser `next/image` avec responsive `sizes` prop

### 40. **QUOTE FORM VALIDATION WEAK**
**Problème** : Emails/téléphone pas validés côté serveur  
**Impact** : Données pourries en DB  
**Correctif** : Ajouter `zod` ou `yup` pour validation schema

### 41. **NO QUOTE REQUEST STATUS WORKFLOW**
**Statuts** : `new`, `read`, `in_progress`, `done`, `rejected`  
**Problème** : Impossible de changer le status depuis l'interface admin  
**Correctif** : Ajouter boutons pour changer statut + ajouter notes privées

### 42. **HERO SLIDER INTERVAL HARDCODED**
**Fichier** : `src/components/common/HeroSlider.tsx`  
**Problème** : Intervalle de rotation en dur (3000ms) pas configurable  
**Correctif** : Laisser configurable via ENV ou data du slide

### 43. **NO 404 CUSTOM PAGE**
**Problem** : Route produit `/horlogerie/products/[id]` n'existe pas = page blanche  
**Correctif** : Créer `not-found.tsx` ou logique de fallback

### 44. **NO MIDDLEWARE FOR REDIRECTS**
**Issue** : `/informatique-products/` vs `/informatique/products/` - pas de redirect standardisée  
**Correctif** : Ajouter middleware pour normaliser URLs

### 45. **BUILD TYPE CHECKING NOT STRICT**
**Fichier** : `tsconfig.json`  
**Problème** : Probablement `strict: false` qui permet bugs  
**Correctif** : Activer `strict: true` et fix les erreurs TS

---

## 📋 FEUILLE D'ACTIONS PRIORISÉE

### 🚨 À FAIRE IMMÉDIATEMENT (avant production)

- [ ] **[1]** Ajouter authentification admin OU middleware de protection
- [ ] **[2]** Créer `.env.local` avec toutes les ENV vars manquantes
- [ ] **[3]** Fixer non-null asserts `!` dans routes API
- [ ] **[4]** Créer `/public/images/placeholder.jpg`
- [ ] **[5]** Créer `/api/admin/colors` route manquante
- [ ] **[6]** Fixer RLS Supabase pour `quote_requests` lecture admin
- [ ] **[7]** Standardiser types (snake_case vs camelCase)
- [ ] **[8]** Logging errors + messages génériques à client
- [ ] **[9]** Metter EN prod -> tests réels

### ⚡ HAUTE PRIORITÉ (semaine 1)

- [ ] **[9]** Fetch contacts depuis DB au lieu de hardcoded
- [ ] **[10]** Afficher product_colors sur fiche produit
- [ ] **[11]** Parser HTML/Markdown pour long_description
- [ ] **[12]** Ajouter traduit catégories
- [ ] **[13]** Ajouter error boundaries admin
- [ ] **[14]** Error handling upload files
- [ ] **[15]** Envoi emails devis + contact

### 📌 MOYEN TERME (semaine 2-3)

- [ ] **[16]** Search/Filter sur catalogue
- [ ] **[17]** SEO metadata + sitemap
- [ ] **[18]** Image optimization (next/image)
- [ ] **[19]** Pagination produits
- [ ] **[20]** Quote request status workflow complet
- [ ] **[21]** Reviews CRUD + affichage
- [ ] **[22]** Service quotes affichage frontend

### 🧹 NETTOYAGE (basse priorité)

- [ ] **[23]** Supprimer strapi-schema.ts
- [ ] **[24]** Vérifier useSupabase hook
- [ ] **[25]** Supprimer StickyHero si inutilisé
- [ ] **[26]** Unifier vinted_link/vinted_url
- [ ] **[27]** Standardiser universe vs universe_type
- [ ] **[28]** TypeScript strict mode

---

## 🔗 RELATION ENTRE PROBLÈMES

```
[ADMIN SANS AUTH] (1)
    ├─→ peut accéder à [COLORS ROUTE MISSING] (4)
    ├─→ crée [ERRORS EXPOSÉS] (8)
    └─→ modifie données non validées

[ENV VARS MANQUANTES] (11)
    ├─→ cause [CRASH PRODUCTION] (2)
    └─→ affiche [FOOTER LIENS CASSÉS] (10)

[TYPE MISMATCH CONTENTBLOCK] (6)
    └─→ cause data incohérente partout

[PRODUCT_COLORS NON AFFICHÉS] (12)
    ├─→ dépend de [TYPE MISMATCH] (7)
    └─→ UI incomplète
```

---

## ✅ CE QUI FONCTIONNE BIEN

1. ✓ Architecture globale Next.js + Supabase solide
2. ✓ Two-universe separation (horlogerie vs informatique) bien pensée
3. ✓ Admin CRUD complet pour la plupart des tables
4. ✓ Formulaires devis dynamiques et configurables
5. ✓ Upload images vers Storage fonctionne
6. ✓ ISR revalidation après actions admin
7. ✓ Responsive design global acceptable
8. ✓ Hero slider automatique

---

## 🎯 RÉSUMÉ

Votre projet a de **bonnes fondations** mais souffre de :
1. **Problèmes de sécurité critiques** (admin public + errors exposés)
2. **Incohérences de types** (snake_case vs camelCase, double fields)
3. **Features moitié implémentées** (colors, reviews, service_quotes, email sending)
4. **Manque de validation & error handling** robuste
5. **Optimisations manquantes** (SEO, images, pagination, search)

**Temps estimé de correction** :
- Critiques : 2-3 jours
- Hautes : 5-6 jours 
- Moyennes : 7-10 jours
- **TOTAL** : ~2-3 semaines pour 100% bon

