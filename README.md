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


MIT - © 2024-2026 Pick Sell
