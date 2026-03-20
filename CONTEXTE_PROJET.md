# CONTEXTE PROJET — Pick Sell
> Fichier mis à jour à chaque modification. Dernière MAJ : 2026-03-20

---

## 🗂️ Stack technique
- **Framework** : Next.js 16.1.6 (App Router, Server Components, ISR)
- **UI** : React 19 + Tailwind CSS v4
- **BDD / Backend** : Supabase (PostgreSQL + Storage)
- **Langage** : TypeScript strict
- **Hébergement cible** : Vercel

---

## 📁 Structure du projet
```
pick-sell/
├── src/app/
│   ├── page.tsx                  → Landing page (choix univers)
│   ├── contact/page.tsx          → Page contact + À propos
│   ├── horlogerie/               → Univers montres
│   │   ├── page.tsx              → Catalogue Seiko MOD + Divers + Services
│   │   ├── products/[id]/        → Fiche produit montre
│   │   └── services/
│   │       ├── repair/           → Formulaire devis réparation
│   │       └── custom/           → Formulaire devis sur-mesure
│   ├── informatique/             → Univers ordi
│   │   ├── page.tsx              → Catalogue PC + Accessoires + Services
│   │   ├── products/[id]/        → Fiche produit PC
│   │   └── services/
│   │       ├── repair/           → Formulaire devis réparation PC
│   │       └── buyback/          → Formulaire devis reprise
│   ├── admin/                    → Panel d'administration
│   │   ├── products/             → CRUD produits
│   │   ├── colors/               → Coloris produits
│   │   ├── services/             → CRUD services
│   │   ├── quotes/               → Config formulaires devis
│   │   ├── content/              → Blocs de contenu éditables
│   │   ├── hero-slides/          → Bannières slider
│   │   └── contacts/             → Infos de contact
│   └── api/
│       ├── upload/               → Upload images → Supabase Storage
│       ├── quote-requests/       → Soumission formulaires devis
│       └── admin/                → API admin (products, services, configs)
```

---

## 🗄️ Tables Supabase

| Table | Description | Status |
|-------|-------------|--------|
| `products` | Produits (montres & PC) | ✅ Utilisée |
| `product_colors` | Variantes couleur | ✅ Table OK, admin OK, mais pas affiché sur fiche produit |
| `services` | Descriptions services | ✅ Utilisée en admin |
| `hero_slides` | Bannières slider | ✅ Utilisée |
| `content_blocks` | Blocs texte éditables | ✅ Utilisée en admin |
| `quote_requests` | Demandes de devis clients | ✅ Insertion OK, lecture admin ⚠️ (voir bug RLS) |
| `quote_form_configs` | Config champs formulaires | ✅ Utilisée (dynamique) |
| `service_quotes` | Grilles tarifaires | ⚠️ Table créée, admin présent mais non reliée au front |
| `reviews` | Avis clients | ❌ Table créée, JAMAIS utilisée |
| `contacts` | Infos contact (email/WA/etc.) | ⚠️ Admin OK mais page contact ne l'utilise pas |

### Storage Supabase
- **Bucket** : `products`
- **Usage** : Upload photos produits → `/products/{timestamp}-{filename}`
- **Accès** : URL publique auto-générée
- **Limite** : 5MB par image, images uniquement

---

## ✅ CE QUI FONCTIONNE

1. **Catalogue produits** — Affichage dynamique depuis Supabase (ISR 60s), filtrage par univers et catégorie
2. **Fiche produit** — Page détail avec image, prix, stock, description, bouton Vinted
3. **Hero Slider** — Auto-rotation configurable par univers
4. **Formulaires de devis** — Envoi réel vers Supabase (`quote_requests`), champs dynamiques depuis la BDD, validation serveur
5. **Upload images** — Fonctionne via `/api/upload` → Supabase Storage bucket `products`
6. **Panel admin** — CRUD complet : produits, services, coloris, bannières, contenu, contacts, configs devis
7. **Admin mobile** — Sidebar avec drawer responsive
8. **Revalidation ISR** — Les actions admin invalident le cache Next.js immédiatement
9. **Les deux univers** — Horlogerie et Informatique bien séparés avec thèmes distincts

---

## ❌ CE QUI NE FONCTIONNE PAS (bugs confirmés)

### 🔴 CRITIQUE

1. ~~**Formulaire Contact — simulation uniquement**~~ ✅ **CORRIGÉ** — sauvegarde dans `contact_messages`
   - `contact/page.tsx` ligne 29 : `setTimeout(() => {...}, 1000)` — fake submit
   - **Aucun email n'est envoyé, rien n'est sauvegardé en BDD**
   - Fix : brancher sur une vraie API (Resend, Nodemailer, ou table Supabase)

2. **Admin sans protection**
   - `/admin` est accessible par n'importe qui sans login
   - **N'importe qui peut modifier/supprimer tous les produits**
   - Fix : ajouter Supabase Auth ou middleware Next.js

3. **placeholder.jpg manquant**
   - Le code utilise `/placeholder.jpg` mais ce fichier n'existe pas dans `/public/`
   - Toutes les images manquantes → erreur 404 + image cassée
   - Fix : ajouter un vrai fichier `/public/placeholder.jpg`

### 🟠 IMPORTANT

4. **Page Contact — données codées en dur**
   - Email, téléphone, WhatsApp sont des faux hardcodés (`+33 1 23 45 67 89`, `contact@picksell.fr`)
   - La table `contacts` Supabase n'est pas lue par la page contact
   - Fix : fetch les contacts depuis Supabase au chargement

5. **RLS Supabase — lecture devis en admin**
   - La table `quote_requests` exige `authenticated` ou `service_role` pour SELECT
   - L'admin utilise le client anon (`lib/supabase.ts`) → les devis ne peuvent pas être lus
   - Fix : utiliser `SUPABASE_SERVICE_ROLE_KEY` dans les API routes admin (déjà fait dans `/api/quote-requests` mais pas dans `/api/admin/quote-requests`)

6. ~~**Boutons "Actions rapides" du dashboard**~~ ✅ **CORRIGÉ** — boutons deviennent des `<Link>` vers les pages admin

### 🟡 MINEUR

7. **`product_colors` non affichés**
   - Les coloris sont gérables en admin mais la fiche produit ne les affiche pas du tout

8. **Description longue rendue en texte brut**
   - `horlogerie/products/[id]/page.tsx` ligne 130 : `{product.long_description}` sans `dangerouslySetInnerHTML`
   - Le HTML n'est pas interprété

9. **Catégories en anglais sur les fiches**
   - `seiko-mod`, `diverse`, `computer` affiché tel quel au lieu de labels français

---

## 🔧 CE QUI PEUT ÊTRE AMÉLIORÉ / OPTIMISÉ

1. **SEO** — Pas de `<head>` metadata sur les pages horlogerie/informatique ni les fiches produit, pas de sitemap.xml, pas d'OG tags pour partage réseaux sociaux
2. **Pagination produits** — Aucune pagination, si beaucoup de produits → page lente
3. **Filtres et recherche** — Pas de filtrage par prix, catégorie, stock sur le catalogue
4. **Footer** — Hardcodé, pas connecté à la table `contacts`
5. **Table `reviews`** — Existe en BDD, pas utilisée du tout. Pourrait afficher les avis Vinted/interne sur les fiches produit
6. **Table `service_quotes`** — Grilles tarifaires non affichées au public
7. **`StickyHero` composant** — Importé dans les types mais jamais utilisé dans une page
8. **`strapi-schema.ts`** — Vestige inutile d'une ancienne architecture Strapi, peut être supprimé
9. **`useSupabase.ts` hook** — Probablement inutilisé, à vérifier

---

## 💡 CHOSES À AJOUTER (non pensées)

| Feature | Priorité | Raison |
|---------|----------|--------|
| **Authentification admin** | 🔴 Critique | Sécurité site en prod |
| **Envoi email** (Resend/Sendgrid) | 🔴 Critique | Confirmations devis + contact |
| **Mentions légales + CGV** | 🔴 Obligatoire | Loi française pour site commercial |
| **Politique RGPD + Cookie banner** | 🔴 Obligatoire | Loi française |
| **Avis clients** (table `reviews`) | 🟠 Important | Social proof = conversions |
| **Galerie photos produit** | 🟠 Important | Plusieurs photos par produit |
| **Filtres catalogue** (prix, stock) | 🟠 Important | UX catalogue |
| **Notifications nouvelles demandes** | 🟠 Important | Ne pas rater les leads |
| **Sitemap.xml + robots.txt** | 🟡 SEO | Référencement Google |
| **OG image** pour partage social | 🟡 Marketing | WhatsApp/Instagram preview |
| **Breadcrumb** sur les fiches | 🟡 UX | Navigation |
| **Page "Nos Réalisations"** | 🟡 Portfolio | Montrer le travail |
| **Lien Vinted visible** dans header/nav | 🟡 UX | Canal de vente principal |
| **Favoris** (localStorage) | 🟢 Nice | Engagement clients |

---

## 🔑 Variables d'environnement (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://vgumzdhhzuxkelemdkze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SITE_NAME=Pick Sell
NEXT_PUBLIC_VINTED_PROFILE=https://www.vinted.fr/member/your_id   ← À mettre à jour
NEXT_PUBLIC_WHATSAPP_NUMBER=+33XXXXXXXXX                           ← À mettre à jour
NEXT_PUBLIC_CONTACT_EMAIL=contact@picksel.com                      ← À mettre à jour
```

---

## 📋 HISTORIQUE DES MODIFICATIONS

| Date | Modification | Fichier(s) |
|------|-------------|------------|
| 2026-03-20 | Création du fichier contexte + audit initial | `CONTEXTE_PROJET.md` |
| 2026-03-20 | **Refonte UI complète** : homepage redesign, pages horlogerie/informatique, fiches produit | `src/app/page.tsx`, `horlogerie/page.tsx`, `informatique/page.tsx`, `products/[id]/page.tsx` |
| 2026-03-20 | **ContentSection** : support image/vidéo de fond avec overlay | `ContentSection.tsx` |
| 2026-03-20 | **ContentForm admin** : champs bg_image_url, bg_video_url, bg_overlay_opacity + upload | `ContentForm.tsx` |
| 2026-03-20 | **Formulaire contact** : sauvegarde Supabase (table `contact_messages`) + lecture contacts DB | `contact/page.tsx`, `api/contact/route.ts`, `api/contacts/route.ts` |
| 2026-03-20 | **Admin dashboard** : fix boutons quick actions (+ compteur devis nouveaux) | `admin/page.tsx` |
| 2026-03-20 | **Fiches produit** : HTML rendering, labels catégories FR, visuel amélioré | `products/[id]/page.tsx` x2 |
| 2026-03-20 | **placeholder.svg** créé + next.config.ts mis à jour (SVG support) | `public/placeholder.svg`, `next.config.ts` |
| 2026-03-20 | **SQL migration V2** créée (bg columns + contact_messages) | `SUPABASE_MIGRATION_V2.sql` |
| 2026-03-20 | **Types** : ContentBlock mis à jour avec bg fields | `lib/types/index.ts` |
| 2026-03-20 | **Favicon** : IMG_4018.jpeg copié en `src/app/icon.jpeg` (favicon onglet navigateur) | `src/app/icon.jpeg` |
| 2026-03-20 | **Fix SQL** : guillemets doubles → simples dans SUPABASE_MIGRATION_V2.sql | `SUPABASE_MIGRATION_V2.sql` |

---

## ⚠️ ACTION REQUISE — À FAIRE MANUELLEMENT

**Exécuter `SUPABASE_MIGRATION_V2.sql` dans Supabase > SQL Editor**
- Ajoute les colonnes `bg_image_url`, `bg_video_url`, `bg_overlay_opacity` à `content_blocks`
- Crée la table `contact_messages`
- Seed les blocs de contenu par défaut

---

## 🚀 PROCHAINES ACTIONS RECOMMANDÉES (par ordre de priorité)

1. **[ ]** ⚠️ Exécuter `SUPABASE_MIGRATION_V2.sql` dans Supabase
2. **[ ]** Protéger `/admin` avec authentification (Supabase Auth + middleware)
3. **[ ]** Ajouter metadata SEO sur les pages principales (horlogerie, informatique, produits)
4. **[ ]** Afficher les coloris sur les fiches produit
5. **[ ]** Ajouter page admin pour voir les messages de contact
6. **[ ]** Créer pages Mentions légales + CGV
7. **[ ]** Ajouter sitemap.xml + robots.txt
