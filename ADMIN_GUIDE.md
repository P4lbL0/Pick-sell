# Guide d'Administration - Pick Sell

## 📱 Accès à l'interface d'administration

L'interface d'administration est accessible à l'URL :
```
http://localhost:3000/admin
```

Cette page est **externe au site principal** et permet de gérer complètement le contenu du site via Supabase.

## 🎯 Fonctionnalités disponibles

### 1. **Tableau de bord** (`/admin`)
- Vue d'ensemble des statistiques
- Nombre de produits, services, contenus et bannières
- État du système et connexion à Supabase
- Actions rapides

### 2. **Gestion des produits** (`/admin/products`)
- **Ajouter** un nouveau produit
- **Éditer** les produits existants
- **Supprimer** des produits
- **Filtrer** par univers (Horlogerie/Informatique)

**Champs disponibles :**
- Titre *
- Prix (EUR) *
- Stock *
- Catégorie (Seiko MOD, Diverses, Accessoires, etc.) *
- Univers (Horlogerie/Informatique) *
- Description courte *
- Description détaillée *
- URLs des images
- URLs des vidéos
- Lien Vinted

### 3. **Gestion des services** (`/admin/services`)
- **Ajouter** un nouveau service
- **Éditer** les services existants
- **Supprimer** des services
- **Types de services :** Réparation, Sur-mesure, Reprise

**Champs disponibles :**
- Titre *
- Slug (identification URL) *
- Univers (Horlogerie/Informatique) *
- Type (Repair/Custom/Buyback) *
- Description *
- URLs des images
- URL de contact

### 4. **Gestion des contenus texte** (`/admin/content`)
- **Ajouter** des blocs de contenu
- **Éditer** le contenu existant
- **Supprimer** des blocs
- Support multi-univers (Global/Horlogerie/Informatique)

**Champs disponibles :**
- Clé unique (identifiant interne) *
- Titre (optionnel)
- Univers
- Contenu *

### 5. **Gestion des bannières d'accueil** (`/admin/hero-slides`)
- **Ajouter** des bannières
- **Éditer** les bannières existantes
- **Supprimer** des bannières
- **Ordre d'affichage** configurable

**Champs disponibles :**
- Titre *
- Sous-titre
- URL de l'image *
- URL de la vidéo
- Univers (Global/Horlogerie/Informatique) *
- Ordre d'affichage *
- Call-to-action (CTA) avec texte et lien

### 6. **Gestion des contacts** (`/admin/contacts`)
- **Ajouter** des canaux de contact
- **Éditer** les contacts existants
- **Supprimer** des contacts

**Plateformes supportées :**
- Email 📧
- WhatsApp 💬
- Instagram 📱
- TikTok 🎵
- Vinted 💎

## 🔧 Configuration requise

### Variables d'environnement

Assurez-vous que les variables suivantes sont configurées dans votre fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Tables Supabase requises

Les tables suivantes doivent exister dans Supabase :

#### 1. `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  universe TEXT NOT NULL,
  description TEXT,
  shortDescription TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  vintedLink TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `services`
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  universe TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  contactUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `content_blocks`
```sql
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT NOT NULL,
  universe TEXT DEFAULT 'global',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. `hero_slides`
```sql
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  imageUrl TEXT NOT NULL,
  videoUrl TEXT,
  universeType TEXT NOT NULL,
  cta JSONB,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. `contacts`
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Design & Interface

L'interface utilise :
- **Gradient moderne** : Violet/Indigo pour le design principal
- **Sidebar navigation** : Navigation latérale intuitive
- **Responsive design** : Fonctionne sur tous les appareils
- **Animations fluides** : Transitions douces et agréables
- **Mode sombre compatible** : Design clair par défaut

## 🔐 Sécurité

### Points importants :
1. Cette page doit être accessibles uniquement à l'administrateur
2. Les clés Supabase doivent être sécurisées
3. Considérez l'ajout d'une authentification via Supabase Auth
4. Les opérations sont validées côté client

### À faire (recommandé)
- [ ] Ajouter une authentification Supabase
- [ ] Implémenter des middleware de permission
- [ ] Valider les données côté serveur
- [ ] Logger les modifications
- [ ] Ajouter un système de sauvegarde

## 📊 Workflow typique

### Ajouter un produit :
1. Aller à `/admin/products`
2. Cliquer sur "+ Nouveau produit"
3. Remplir le formulaire
4. Cliquer sur "Enregistrer"

### Modifier un produit :
1. Aller à `/admin/products`
2. Cliquer sur l'icône ✏️ du produit
3. Modifier les informations
4. Cliquer sur "Enregistrer"

### Supprimer un produit :
1. Aller à `/admin/products`
2. Cliquer sur l'icône 🗑️ du produit
3. Confirmer la suppression

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Accéder à l'admin
# Ouvrir http://localhost:3000/admin
```

## 📝 Notes

- Les champs marqués avec `*` sont obligatoires
- Les images et vidéos doivent être des URLs valides
- Les URLs d'images apparaîtront dans les tableaux de bord
- Les modifications sont sauvegardées en temps réel dans Supabase
- Vous pouvez filtrer les produits et services par univers

## 💡 Conseils d'utilisation

1. **Avant de supprimer** : Assurez-vous que c'est vraiment nécessaire
2. **Ordre des bannières** : Gérez l'ordre d'affichage avec le champ "Ordre"
3. **Descriptions** : Utilisez du texte clair et attractif
4. **Catégories** : Restez cohérent avec les catégories existantes
5. **Images** : Utilisez des URLs HTTPS valides

## 🆘 Dépannage

**Problème** : Impossible de se connecter à Supabase
- Vérifiez les variables d'environnement
- Confirmez que la base de données est accessible
- Vérifiez les logs du navigateur (F12)

**Problème** : Les données ne s'enregistrent pas
- Vérifiez la connexion internet
- Assurez-vous que Supabase est en ligne
- Vérifiez que les tables existent

**Problème** : Les images ne s'affichent pas
- Vérifiez que les URLs sont valides
- Assurez-vous que les images sont publiques
- Testez les URLs directement dans le navigateur

## 📞 Support

Pour toute question ou problème, consultez la documentation Supabase :
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
