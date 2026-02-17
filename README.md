# Pick Sell - Hub de Shopping Alternatif

## 🎯 Projet

**Pick Sell** est un site web vitrine et catalogue divisé en **deux univers distincts** :

- **🕐 Horlogerie (Ssæa Montres)** - Montres Seiko Mod, montres diverses reconditionnées, accessoires, et services de réparation/personnalisation
- **💻 Informatique** - Ordinateurs reconditionnés, accessoires, services de réparation et reprise

Le site **ne dispose pas de panier/paiement en ligne**. Les utilisateurs sont redirigés vers des plateformes externes (Vinted, WhatsApp, Email) pour finaliser l'achat ou prendre contact.

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 15+ avec TypeScript
- **Styling** : Tailwind CSS
- **Router** : App Router (Next.js 13+)
- **Structure** : Modulaire avec séparation par univers

### Backend & CMS
- **CMS** : Strapi (Headless CMS)
- **API** : REST API (Strapi)

---

## 🚀 Installation & configuration

### 1. Installation Frontend

```bash
# Les dépendances sont déjà installées
# Créer le fichier .env.local
cp .env.example .env.local
```

Éditer `.env.local` avec vos variables :
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token
NEXT_PUBLIC_VINTED_PROFILE=https://www.vinted.fr/...
NEXT_PUBLIC_WHATSAPP_NUMBER=+33XXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=contact@picksel.com
```

### 2. Installation Strapi (Backend)

```bash
# Créer Strapi dans le répertoire parent
cd ..
npx create-strapi-app@latest strapi --template cms
cd strapi
npm run develop
```

**Documentation complète** : Voir [STRAPI_SETUP.md](STRAPI_SETUP.md)

### 3. Démarrage en développement

```bash
# Terminal 1 : Frontend
cd pick-sell
npm run dev
# http://localhost:3000

# Terminal 2 : Backend (dans un autre terminal)
cd strapi
npm run develop
# http://localhost:1337/admin
```

---

## 📁 Structure du Projet

```
pick-sell/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   ├── components/       # Composants réutilisables
│   ├── lib/
│   │   ├── api/         # Client Strapi
│   │   └── types/       # Types TypeScript
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilitaires
│   └── styles/          # Styles globaux
├── public/              # Assets statiques
├── ARCHITECTURE.md      # Doc technique détaillée
├── STRAPI_SETUP.md      # Guide setup Strapi
└── .env.example         # Variables d'environnement
```

**Documentation complète** : Voir [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🎨 Pages Disponibles

### Landing Page (Accueil Global)
- `http://localhost:3000/` - Split screen des deux univers

### Univers Horlogerie
- `/horlogerie` - Accueil
- `/horlogerie/seiko-mod` - Collection Seiko MOD
- `/horlogerie/diverses` - Montres diverses
- `/horlogerie/accessories` - Accessoires
- `/horlogerie/services/repair` - Réparation & Révision
- `/horlogerie/services/custom` - Montre sur-mesure
- `/horlogerie/faq` - FAQ
- `/horlogerie/contact` - Contact

### Univers Informatique
- `/informatique` - Accueil
- `/informatique/computers` - Ordinateurs
- `/informatique/accessories` - Accessoires
- `/informatique/services/repair` - Réparation
- `/informatique/services/buyback` - Reprise
- `/informatique/contact` - Contact

---

## 🔧 Développement

### Ajouter une nouvelle page

1. Créer `src/app/[univers]/[page]/page.tsx`
2. Utiliser composants existants
3. Récupérer data depuis Strapi si besoin

### Ajouter un composant

1. Créer dans `src/components/`
2. Exporter depuis fichier index si réutilisable
3. Importer dans pages

### Modifier le style

Tailwind CSS est pré-configuré. Éditer :
- `tailwind.config.ts` - Theme
- Utiliser class Tailwind inline dans les composants

---

## 📚 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture détaillée, data flow, types
- [STRAPI_SETUP.md](STRAPI_SETUP.md) - Guide complet setup Strapi et collections
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Strapi Docs](https://docs.strapi.io)

---

## 🚀 Déploiement

### Frontend (Vercel - Recommandé)
```bash
vercel deploy
```

### Backend (Railway/Render)
Voir [STRAPI_SETUP.md](STRAPI_SETUP.md) - section "Deployment Strapi"

---

## 📝 Prochaines étapes

- [ ] Intégrer API Strapi
- [ ] Implémenter pages produits détaillées
- [ ] Ajouter système de filtrage
- [ ] Créer admin panel Strapi
- [ ] Configurer SEO/Metadata dynamiques
- [ ] Tests (Jest, Playwright)

---

## 📄 License

MIT - © 2024-2026 Pick Sell
