# CONTEXTE PROJET — Pick Sell
> Fichier mis à jour à chaque modification. Dernière MAJ : 2026-09-19

---

## 🔍 AUDIT DU 2026-09-18 (code + base Supabase + prod testés)

> Cette section remplace les listes de bugs plus bas quand elles se contredisent.

### ✅ Corrigé le 2026-09-18 (chantier sécurité)
- Sécurité points 1 à 7 ci-dessous : **tous corrigés** (connexion admin, RLS refermée, storage fermé, Next 16.3.5, images limitées à Supabase).
- Admin cassé : **tout corrigé** (bannières, blocs de contenu, services — y compris le lien de contact qui ne s'enregistrait jamais —, coloris, grilles tarifaires). Testé de bout en bout.
- Restent ouverts : sections « Données » et « Qualité / SEO / légal ».
- Front responsive (même jour) : menu mobile ajouté sur les univers (il n'y avait aucune navigation sous 768 px), débordement horizontal de 12 px corrigé, pied de page branché sur la table `contacts` (liens email/WhatsApp/Instagram/TikTok étaient cassés), page Contact nettoyée (@pseudo, icônes SVG, section vide masquée), bannières sans image ni vidéo ignorées (repli sur le hero du thème), `lang="fr"`, animations désactivées si l'utilisateur réduit les animations. Vérifié sans débordement à 320 / 375 / 768 / 1280 px sur 15 pages. Captures : `docs/screens/`.
- Données corrigées : lien WhatsApp au format international (`wa.me/33…`, l'ancien `wa.me/06…` ne fonctionnait pas), URL Instagram sans espace, plateforme en minuscules. L'admin convertit maintenant un numéro saisi en 06… automatiquement.

## ⌚ Configurateur 3D (démo, depuis le 2026-09-19)

- **Page cachée** `/horlogerie/configurateur` : reliée nulle part, `noindex`. Démo à faire valider par la boutique ; elle **remplacera la page Sur-mesure** (`/horlogerie/services/custom`) une fois validée — ne pas toucher à Sur-mesure d'ici là.
- L'acheteur tourne la montre en 3D, l'écarte avec le curseur « Vue éclatée », touche une pièce pour ouvrir ses choix, voit le prix bouger, puis envoie une **demande de devis** (table `quote_requests`, `service_type = 'custom'`, `data.source = 'configurateur'`).
- **Catalogue** : `src/lib/configurateur/catalogue.ts` = **exemples** (`CATALOGUE_DEMO = true`, bandeau « Démo » sur la page, mention « prix d'exemple » jusque dans l'admin). À remplacer par la liste de la boutique (questionnaire envoyé). Prix de base 140 € : la configuration de départ (montre phare, produit n° 51) retombe sur son prix réel de 160 €.
- **Règles** (incompatibilités, prix, code de lien) : `src/lib/configurateur/regles.ts`, partagé page / serveur. La route `/api/quote-requests` **recalcule** prix et récapitulatif à partir du code : on ne fait pas confiance à la page.
- **Lien partageable** : `?c=cadran.lunette.bracelet.aiguilles.chiffres.couleurChiffres.date.fond` (ex. `?c=noir.cannelee.president.baton.arabes.noir.aucune.transparent`). L'admin Devis affiche la montre composée et un bouton « Voir la montre en 3D ».
- **3D** : three.js (`src/components/configurateur/Visionneuse.tsx`), rendu à la demande (rien ne tourne quand l'image est fixe). Modèle `public/configurateur/montre.glb` (0,9 Mo, compressé Draco, décodeur dans `public/draco/`), toutes les variantes dedans. Il est **généré** par `render/montre/configurateur.py` (dossier `Desktop/Projet/render`, Blender) : ne jamais l'éditer à la main, ré-exporter puis recopier. Noms des nœuds `piece__variante` = identifiants du catalogue.
- **Crédit obligatoire** (licence CC BY 4.0 du modèle d'origine de Yevhen Artamonov) : ligne en bas du panneau, à garder.
- Captures : `docs/screens/configurateur-desktop.jpeg`, `configurateur-eclatee.jpeg`, `configurateur-mobile.jpeg`.

## 🔐 Connexion admin & écritures (depuis le 2026-09-18)

- `/admin` et `/api/admin/*`, `/api/upload` sont protégés par `src/proxy.ts` (redirection vers `/admin/login`) **et** par `requireAdmin()` dans chaque route (`src/lib/supabase-auth.ts`).
- Est admin un compte Supabase Auth dont `app_metadata.role = 'admin'` (modifiable seulement avec la clé service). Une inscription publique ne donne donc aucun accès.
- **Créer / promouvoir un admin** : `node scripts/create-admin.mjs email@exemple.com "MotDePasse"` (depuis `pick-sell/`, 10 caractères min.). Relancer la commande change le mot de passe.
- **Toutes les écritures passent par le serveur** : pages admin → `adminApi()` (`src/lib/admin-api.ts`) → routes `/api/admin/*` bâties sur `createAdminCrud()` (`src/lib/admin-crud.ts`, liste blanche de colonnes + vidage du cache ISR). Le navigateur ne doit **jamais** écrire directement dans Supabase avec la clé publique.
- RLS : le public (clé anon) peut seulement **lire** products, product_colors, services, hero_slides, content_blocks, contacts, quote_form_configs, reviews. Aucun accès public à product_events, service_quotes, contact_messages, quote_requests. Storage : aucune policy (bucket public en lecture par URL), 5 Mo max, images uniquement.
- **Migrations** : dossier `supabase/migrations/`, appliquées avec `supabase db query --linked -f <fichier>` (projet lié via `supabase link`). Les anciens `SUPABASE_MIGRATION*.sql` sont historiques.

### 🔴 Sécurité — critique
1. **Clé publique (anon) = droits d'écriture sur `products`** : n'importe quel visiteur peut créer / modifier / supprimer des produits directement via Supabase (testé). Cause : l'admin écrit en direct depuis le navigateur avec la clé anon, donc la RLS a été ouverte.
2. **Storage `products` : upload ET suppression publics** (testé, y compris fichiers non-image). Toutes les photos peuvent être effacées par un inconnu.
3. **XSS stockée possible** : `long_description` est rendue en HTML brut (`dangerouslySetInnerHTML`) et modifiable par n'importe qui (point 1).
4. **API `/api/admin/*` sans aucune authentification** (vérifié en prod) : lecture des demandes de devis (nom, email, téléphone — problème RGPD), des stats et du CA ; écriture/suppression sur produits, services, contacts, bannières.
5. **`/admin` ouvert** (pas de login ni de middleware).
6. `hero_slides` : insertion publique autorisée.
7. **Next.js 16.1.6 : failles critiques connues** (npm audit : 1 critique, 4 hautes) → monter en 16.3.x. `next.config.ts` autorise n'importe quel domaine http/https pour `next/image` (proxy d'images ouvert).

### 🟠 Admin cassé (testé en base)
- **Modifier une bannière ne fait rien** : la RLS bloque l'UPDATE anon sans renvoyer d'erreur → « enregistré » mais rien ne change. + la seule bannière en base (horlogerie) a une image vide → bandeau gris à la place du hero. C'est le « bannière qui bug » de la todo.
- **Modifier un bloc de contenu** : échoue (colonne `updated_at` inexistante), et la RLS bloquerait de toute façon.
- **Créer / modifier un service** : échoue (colonnes `images` et `updated_at` inexistantes). **Supprimer un service** : ne fait rien en silence (RLS).
- **Ajouter un coloris** / **une grille tarifaire** : refusé par la RLS.
- `PUT /api/admin/products` et `/api/admin/services` envoient `updated_at` → échouent (colonne absente). Non utilisés par les formulaires actuels, mais piège pour la suite.
- Messages du formulaire contact (`contact_messages`) : aucune page admin pour les lire.

### 🟡 Données
- 2 blocs de contenu en double (`concept_horlogerie` / `concept-horlogerie`, idem informatique) — seuls ceux avec tiret sont utilisés.
- `products` a 2 colonnes lien Vinted : `vinted_link` (vide partout, inutile) et `vinted_url`.
- Services : lien WhatsApp factice `wa.me/33123456789` sur les 3 services.
- Contacts : URL Instagram avec espace au début ; icônes en emoji ; plateforme `Instagram` avec majuscule → pas reconnue par la page contact.
- 4 produits sans image, 4 sans lien Vinted, 1 titre en double. 11 produits à stock 0 toujours affichés au catalogue.
- Storage : 70 fichiers / 108 Mo (≈1,5 Mo par photo, non compressées), 20 fichiers orphelins.
- Stats : 42 des 287 événements viennent de robots et sont comptés comme des visites. `limit(5000)` sera plafonné à 1000 lignes par Supabase.
- Types de dates mélangés (`timestamp` sans fuseau / `timestamptz`).
- Fréquentation : 124 événements en mai, 3 en août, **aucun depuis le 1er août** (le tracking fonctionne, testé).
- Pas de dossier de migrations : fichiers SQL V1/V2/V3 exécutés à la main, `supabase_schema.sql` est un dump non exécutable.

### 🟢 Qualité / SEO / légal
- Build OK, typecheck OK, lint : 58 erreurs (surtout `any` et apostrophes).
- `<html lang="en">` sur un site français. Pas de metadata sur les fiches produit, pas de sitemap ni de robots.txt (404 en prod).
- Pas de mentions légales, CGV, politique de confidentialité (obligatoire : on collecte nom/email/téléphone).
- 230 emojis dans l'UI (33 fichiers) à remplacer par des SVG.
- Fiches produit horlogerie / informatique dupliquées (2 × 151 lignes) ; `html-react-parser` installé mais inutilisé ; `lib/api/client.ts` quasi inutilisé.
- CA affiché en flottant brut (`869.1800000000001`) côté API.

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
| `product_events` | Tracking clics & visites (V3) | ✅ Insertion publique, lecture admin — alimente `/admin/stats` |
| `products.sold_*` | Colonnes `sold_at`, `sold_price`, `sold_channel` | ✅ Marquage vente manuelle depuis admin |

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
| 2026-04-09 | **Nettoyage code mort** : suppression `useSupabase.ts`, `StickyHero.tsx`, `hooks/index.ts` (hooks Strapi obsolètes, jamais utilisés) | `src/hooks/`, `src/components/common/StickyHero.tsx` |
| 2026-04-09 | **Fix sécurité** : `api/admin/quote-requests/route.ts` — message d'erreur interne ne s'expose plus au client | `src/app/api/admin/quote-requests/route.ts` |
| 2026-04-09 | **Fix critique** : `getProductColors` ne fait plus de HTTP fetch (échoue en prod), requête directe Supabase à la place | `src/lib/product-helpers.ts` |
| 2026-04-09 | **Fix cosmétique** : tooltip couleur affichait `##ff0000` (double #) → corrigé | `src/components/common/ProductColors.tsx` |
| 2026-04-09 | **Nettoyage MD** : suppression de 15 fichiers d'audit redondants générés par Copilot (AUDIT_COMPLET, BUGS_PAR_FICHIER, PROBLEMES_CRITIQUES_TROUVES, RESUME_EXECUTIVE, RAPPORT_FINAL, CHANGEMENTS_IMPLEMENTES, CODEBASE_ANALYSIS, INDEX, COMMANDS, FIXES_RAPIDES, ENV_SETUP, SETUP_SUMMARY, SUPABASE_QUICKSTART, ADMIN_GUIDE, ARCHITECTURE) | racine du projet |
| 2026-04-19 | **Fond unifié** horlogerie/informatique → `bg-white` (main + section produits), textes adaptés (gray-900/gray-500) — sections hero/services gardent leur fond sombre (self-contained) | `src/app/horlogerie/page.tsx`, `src/app/informatique/page.tsx` |
| 2026-04-19 | **Fix SQL V3** : FK `product_events.product_id` → `BIGINT` (table `products.id` est `bigint`, pas `uuid`) | `SUPABASE_MIGRATION_V3.sql` |
| 2026-04-19 | **Stats : vente historique** : bouton "+ Ajouter une vente" (modal avec sélecteur produit, date custom, prix, canal) — API sell accepte désormais `sold_at` | `src/app/admin/stats/page.tsx`, `src/app/api/admin/products/sell/route.ts` |
| 2026-04-19 | **Stats : responsive mobile** : range-picker pill group, sections collapse, timeline scroll, modal fullscreen sur petit écran | `src/styles/admin.css`, `src/app/admin/stats/page.tsx` |
| 2026-04-19 | **Système de tracking clics/visites** : table `product_events` + API POST `/api/track` + helper `lib/track.ts` (sendBeacon/fetch) + composants `TrackPageView`, `VintedButton`, `ServiceLink` | `SUPABASE_MIGRATION_V3.sql`, `src/app/api/track/route.ts`, `src/lib/track.ts`, `src/components/common/TrackPageView.tsx`, `VintedButton.tsx`, `ServiceLink.tsx` |
| 2026-04-19 | **Tracking branché** sur landing, horlogerie, informatique, fiches produit (view_product + click_vinted + click_service), cartes produits | `src/app/page.tsx`, `horlogerie/page.tsx`, `informatique/page.tsx`, `*/products/[id]/page.tsx`, `components/common/ProductCard.tsx` |
| 2026-04-19 | **Dashboard stats admin** `/admin/stats` : overview, timeline 7/30/90/365 j, top produits, ventes, répartition par univers, events récents | `src/app/admin/stats/page.tsx`, `src/app/api/admin/stats/route.ts` |
| 2026-04-19 | **Marquage vente** : API `/api/admin/products/sell` + modal dans `ProductTable` (prix + canal vinted/direct/autre), stock auto → 0, annulation possible | `src/app/api/admin/products/sell/route.ts`, `src/components/admin/ProductTable.tsx`, `src/lib/types/index.ts` |
| 2026-04-19 | **Sidebar admin** : ajout lien "Statistiques & ventes" | `src/app/admin/layout.tsx` |
| 2026-09-18 | **Audit complet** code + base + prod (sécurité, admin, données, SEO) — voir section « AUDIT DU 2026-09-18 ». Aucun code modifié. | `CONTEXTE_PROJET.md` |
| 2026-09-18 | **Chantier sécurité** : connexion admin (Supabase Auth, rôle `admin`), proxy + `requireAdmin` sur toutes les routes admin/upload, écritures admin 100 % serveur (`admin-crud`, `admin-api`), nouvelles routes `content-blocks` et `service-quotes`, migration RLS (lecture seule publique, storage fermé), Next 16.3.5, images limitées à Supabase, correctifs admin (bannières, contenus, services, coloris, grilles), emojis admin → SVG / retirés, `html-react-parser` retiré | `src/proxy.ts`, `src/lib/*`, `src/app/api/**`, `src/app/admin/**`, `src/components/admin/*`, `supabase/migrations/20260918120000_securite_rls.sql`, `scripts/create-admin.mjs` |
| 2026-09-18 | **Front responsive** : menu mobile (`Navigation`), rognage horizontal, pied de page sur la table `contacts` (`Footer` serveur), icônes partagées `Icon` / `PlatformIcon`, page Contact revue, bannières vides ignorées, `lang="fr"`, reduced-motion, onglets bannières admin qui passent à la ligne, emojis → SVG sur les pages touchées | `src/components/common/*`, `src/app/contact/*`, `src/app/horlogerie/*`, `src/app/informatique/*`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/admin/hero-slides/page.tsx`, `src/components/admin/ContactForm.tsx` |
| 2026-09-19 | **Configurateur 3D (démo cachée)** : page `/horlogerie/configurateur` (three.js, vue éclatée au curseur, 7 pièces, nuancier, prix en direct, incompatibilités, lien partageable), catalogue d'exemple, envoi en devis avec prix recalculé côté serveur, bloc « Montre composée » + « Voir la montre en 3D » dans l'admin Devis, emojis du tableau des demandes → SVG | `src/app/horlogerie/configurateur/page.tsx`, `src/components/configurateur/*`, `src/lib/configurateur/*`, `src/app/api/quote-requests/route.ts`, `src/components/admin/QuoteRequestTable.tsx`, `src/components/admin/AdminIcon.tsx`, `public/configurateur/montre.glb`, `public/draco/*` |

---

## ⚠️ ACTION REQUISE — À FAIRE MANUELLEMENT

**Exécuter `SUPABASE_MIGRATION_V2.sql` dans Supabase > SQL Editor**
- Ajoute les colonnes `bg_image_url`, `bg_video_url`, `bg_overlay_opacity` à `content_blocks`
- Crée la table `contact_messages`
- Seed les blocs de contenu par défaut

**Exécuter `SUPABASE_MIGRATION_V3.sql` dans Supabase > SQL Editor** (tracking & ventes)
- Crée la table `product_events` + index + policies RLS (insert public, select admin)
- Ajoute `sold_at`, `sold_price`, `sold_channel` à `products`
- Sans cette migration, `/admin/stats` et le bouton "Marquer comme vendu" échoueront silencieusement

---

## 🚀 PROCHAINES ACTIONS RECOMMANDÉES (par ordre de priorité)

1. **[ ]** ⚠️ Exécuter `SUPABASE_MIGRATION_V2.sql` dans Supabase
2. **[ ]** Protéger `/admin` avec authentification (Supabase Auth + middleware)
3. **[ ]** Ajouter metadata SEO sur les pages principales (horlogerie, informatique, produits)
4. **[ ]** Afficher les coloris sur les fiches produit
5. **[ ]** Ajouter page admin pour voir les messages de contact
6. **[ ]** Créer pages Mentions légales + CGV
7. **[ ]** Ajouter sitemap.xml + robots.txt
