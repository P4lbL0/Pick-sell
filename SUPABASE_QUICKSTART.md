# 🚀 Supabase Setup Guide - Pick Sell

## Étape 1: Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub, Google ou email
4. Créez une **nouvelle organisation** (ex: "pick-sell")
5. Sélectionnez :
   - **Database**: PostgreSQL
   - **Region**: Europe (ou votre région préférée)
   - **Pricing**: Free Tier (gratuit)

6. Attendez que le projet se crée (~30 secondes)

---

## Étape 2: Récupérer les clés API

1. Dans le dashboard Supabase, allez à **Project Settings** (⚙️)
2. Allez à l'onglet **API**
3. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Étape 3: Ajouter les clés à .env.local

Éditez `pick-sell/.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Étape 4: Créer les tables

### Option A : Automatique (Recommandé)

1. Allez dans Supabase → **SQL Editor**
2. Cliquez sur **+ New Query**
3. Collez le contenu complet de [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. Cliquez **Run** ▶️

✅ Toutes les 6 tables seront créées en 10 secondes

### Option B : Manuel

Dans **SQL Editor**, exécutez ces 6 requêtes une par une :

#### 1. Products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  universe VARCHAR(50) NOT NULL,
  stock INT DEFAULT 0,
  short_description TEXT,
  long_description TEXT,
  vinted_link VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Services
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  type VARCHAR(50),
  universe VARCHAR(50) NOT NULL,
  contact_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Content Blocks
```sql
CREATE TABLE content_blocks (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255),
  content TEXT,
  universe VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Hero Slides
```sql
CREATE TABLE hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(500),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  universe_type VARCHAR(50),
  cta_text VARCHAR(100),
  cta_link VARCHAR(500),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Reviews
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  author VARCHAR(255),
  source VARCHAR(50),
  image_url VARCHAR(500),
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Contacts
```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) UNIQUE NOT NULL,
  url VARCHAR(500),
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Étape 5: Activer Row Level Security (RLS)

1. Pour chaque table dans Supabase, allez à **Authentication → Policies**
2. Cliquez sur la table
3. Cliquez **Enable RLS**
4. Cliquez **+ Create policy**
5. Nommez-la **"Enable read access"**
6. Sélectionnez **Query type: SELECT**
7. Laissez le filtre vide (pour permettre la lecture publique)
8. Répétez pour les 6 tables

**Ou via SQL** :
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access" ON services FOR SELECT USING (true);
CREATE POLICY "Enable read access" ON content_blocks FOR SELECT USING (true);
CREATE POLICY "Enable read access" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Enable read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Enable read access" ON contacts FOR SELECT USING (true);
```

---

## Étape 6: Ajouter des données test (Optionnel)

Dans Supabase Dashboard → **Table Editor** :

### Ajouter 1 produit Horlogerie
```
title: Seiko 5 Custom Mod
price: 250
category: Modifications
universe: horlogerie
stock: 1
short_description: Modification cadran personnalisé
vinted_link: https://www.vinted.fr/items/...
```

### Ajouter 1 produit Informatique
```
title: ThinkPad X220 - Core i5
price: 180
category: Laptops
universe: informatique
stock: 1
short_description: Ordinateur portable reconditionné
```

### Ajouter 1 service
```
title: Réparation montres
type: repair
universe: horlogerie
description: Réparation complète avec garantie
```

---

## Étape 7: Démarrer le site

```bash
cd pick-sell
npm run dev
```

Ouvrez http://localhost:3000 🎉

---

## Problèmes courants ?

### API returns 404
- ✅ Vérifiez que les tables existent dans Supabase
- ✅ Vérifiez que RLS est activé mais avec les bonnes policies
- ✅ Vérifiez que `.env.local` a les bonnes clés

### "Connection refused"
- ✅ Attendez 30 secondes après créer le projet
- ✅ Vérifiez l'URL Supabase (pas de typo)
- ✅ Redémarrez le serveur `npm run dev`

### Pas de données affichées
- ✅ Allez dans **Table Editor**, vérifiez qu'il y a des données
- ✅ Ouvrez DevTools (F12), allez à **Network**, vérifiez les requêtes Supabase
- ✅ Vérifiez que RLS policies sont activées

---

## 🎯 Prochaines étapes

- ✅ Pages produit détaillées
- ✅ Panneau admin pour gérer les données
- ✅ Authentification utilisateur
- ✅ Panier e-commerce
- ✅ Déployer en production (Vercel)

---

**Besoin d'aide ?**
- Docs Supabase : https://supabase.com/docs
- GitHub Copilot dans VS Code : demandez !
