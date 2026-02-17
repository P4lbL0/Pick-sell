# Configuration d'environnement - Panneau Admin

## 📋 Variables requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anonkey-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===== ADMIN AUTH (Optional) =====
NEXT_PUBLIC_ADMIN_ENABLED=true
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# ===== APPLICATION =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🔐 Comment obtenir vos clés Supabase

### 1. Accéder à Supabase
- Allez sur [supabase.com](https://supabase.com)
- Connectez-vous à votre compte
- Sélectionnez votre projet

### 2. Récupérer les clés
- Allez dans **Settings** > **API**
- Copiez :
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Sécuriser les clés
⚠️ **Important** :
- Ne jamais pusher `.env.local` sur Git
- Garder le **Service Role Key** secret
- Utiliser des variables d'environnement en production

## 🗄️ Initialisation de la base de données

Exécutez les SQL suivants dans Supabase Studio (SQL Editor) :

### Table Produits
```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR NOT NULL,
  universe VARCHAR NOT NULL,
  description TEXT,
  shortDescription TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  vintedLink TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_universe ON products(universe);
CREATE INDEX idx_products_category ON products(category);
```

### Table Services
```sql
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  universe VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  contactUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_universe ON services(universe);
CREATE INDEX idx_services_type ON services(type);
```

### Table Contenus
```sql
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR NOT NULL UNIQUE,
  title VARCHAR,
  content TEXT NOT NULL,
  universe VARCHAR DEFAULT 'global',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_blocks_key ON content_blocks(key);
CREATE INDEX idx_content_blocks_universe ON content_blocks(universe);
```

### Table Bannières
```sql
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  imageUrl TEXT NOT NULL,
  videoUrl TEXT,
  universeType VARCHAR NOT NULL,
  cta JSONB,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hero_slides_universe ON hero_slides(universeType);
CREATE INDEX idx_hero_slides_order ON hero_slides("order");
```

### Table Contacts
```sql
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon VARCHAR,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_platform ON contacts(platform);
```

## 🔎 Vérification des données de test

Après la création des tables, vous pouvez ajouter des données de test :

```sql
-- Ajouter un produit de test
INSERT INTO products (title, price, stock, category, universe, description, shortDescription)
VALUES (
  'Seiko SKX007 MOD',
  299.99,
  5,
  'seiko-mod',
  'horlogerie',
  'Montre Seiko SKX007 customisée avec cadran noir mat',
  'Seiko SKX007 MOD - Cadran noir mat'
);

-- Ajouter un service de test
INSERT INTO services (title, slug, universe, type, description)
VALUES (
  'Réparation et Révision',
  'repair-revision',
  'horlogerie',
  'repair',
  'Service complet de réparation et révision de montres'
);

-- Ajouter un contenu de test
INSERT INTO content_blocks (key, title, content, universe)
VALUES (
  'about-horlogerie',
  'À propos',
  'Bienvenue dans notre univers de l''horlogerie',
  'horlogerie'
);

-- Ajouter une bannière de test
INSERT INTO hero_slides (title, imageUrl, universeType, "order")
VALUES (
  'Bienvenue',
  'https://example.com/hero.jpg',
  'global',
  0
);

-- Ajouter un contact de test
INSERT INTO contacts (platform, url, icon)
VALUES (
  'email',
  'mailto:contact@example.com',
  '📧'
);
```

## 🚀 Démarrage du projet

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# L'admin est accessible à :
# http://localhost:3000/admin
```

## ✅ Checklist de configuration

- [ ] Créer un compte Supabase
- [ ] Créer un projet Supabase
- [ ] Copier les identifiants Supabase
- [ ] Créer le fichier `.env.local`
- [ ] Exécuter les scripts SQL de création de tables
- [ ] Ajouter des données de test (optionnel)
- [ ] Démarrer le serveur de dev
- [ ] Accéder à l'admin sur `http://localhost:3000/admin`

## 🐛 Troubleshooting

### Erreur: "Cannot read property 'from' of undefined"
→ Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctement définis

### Erreur: "401 Unauthorized"
→ Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correct

### Tables non trouvées
→ Assurez-vous d'avoir exécuté les scripts SQL

### Données non affichées
→ Vérifiez l'onglet Network dans DevTools → F12
→ Vérifiez que les données existent dans Supabase Studio

## 📚 Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Next.js Documentation](https://nextjs.org/docs)
- [Guide Admin Local](./ADMIN_GUIDE.md)

## 💡 Conseils

1. **Sauvegarder les identifiants** : Gardez une copie sécurisée de vos clés
2. **Tester d'abord** : Testez en développement avant de passer en prod
3. **Vérifier les permissions** : Assurez-vous que les autorisations Supabase sont correctes
4. **Monitorer l'usage** : Vérifiez votre utilisation Supabase pour éviter les dépassements
5. **Backups réguliers** : Sauvegardez vos données Supabase régulièrement

## 🔄 Mise en production

Avant de déployer en production :

1. Créer une nouvelle base Supabase pour la production
2. Exécuter les scripts SQL sur la base de prod
3. Ajouter les variables d'environnement sur la plateforme d'hébergement
4. Activer Row Level Security (RLS) pour la sécurité
5. Configurer les CORS si nécessaire
6. Tester la connexion complètement

## 📞 Support

Pour toute question :
- Consultez la [documentation Supabase](https://supabase.com/docs)
- Vérifiez les [logs du projet](https://app.supabase.com)
- Testez avec Supabase Studio directement
