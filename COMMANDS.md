# ⚙️ COMMANDS DE MISE EN PLACE

Guide pratique des commandes à exécuter pour implémenter les fixes (3-4 jours).

---

## 📋 PREREQUISITES

Assurer que vous avez:
```bash
# Node.js 18+ et npm
node --version  # v18+
npm --version   # 9+

# Next.js déjà installé (vérifier package.json)
npm list next
```

---

## 🚀 PHASE 0: BLOCKERS (Day 1-2)

### Step 0.1: Créer `.env.local`

```bash
# Dans le dossier root du projet (./pick-sell/)
cat > .env.local << 'EOF'
# ===== SUPABASE (REQUIS - Obtenir de supabase.com dashboard) =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxyyyzzz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== CONTACTS & EXTERNAL LINKS =====
NEXT_PUBLIC_WHATSAPP_NUMBER=+33612345678
NEXT_PUBLIC_CONTACT_EMAIL=contact@picksell.fr
NEXT_PUBLIC_VINTED_PROFILE=https://vinted.fr/member/YOUR_ID

# ===== APP CONFIG =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

# Vérifier que .env.local est dans .gitignore
grep '.env.local' .gitignore
```

### Step 0.2: Vérifier `.gitignore`

```bash
# S'assurer que ces fichiers sont ignorés
cat .gitignore | grep -E '\.env|node_modules|.next'
```

**S'il manquent** :
```bash
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo ".next" >> .gitignore
```

### Step 0.3: Tester démarrage avec les env vars

```bash
# Clean rebuild
rm -rf .next node_modules

# Reinstall dependencies
npm install

# Test start du dev server
npm run dev

# Should start WITHOUT crashing on env vars missing
# Visitez http://localhost:3000
```

**Expected**: Page charge, pas d'erreur env vars.  
**If errors**: Recheck `.env.local` values contre Supabase dashboard.

### Step 0.4: Créer `.env.local.example`

```bash
# Copier pou documentation
cp .env.local .env.local.example

# Edit pour enlever valeurs sensibles
cat > .env.local.example << 'EOF'
# ===== SUPABASE (Obtenir de supabase.com dashboard) =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anonkey-xxxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-xxxxx

# ===== CONTACTS =====
NEXT_PUBLIC_WHATSAPP_NUMBER=+33612345678
NEXT_PUBLIC_CONTACT_EMAIL=contact@picksell.fr
NEXT_PUBLIC_VINTED_PROFILE=https://vinted.fr/member/xxxxx

# ===== APP CONFIG =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

# Commit example (pas les vrais secrets!)
git add .env.local.example
git commit -m "docs: add env.local example for setup"
```

### Step 0.5: Créer `public/images/placeholder.jpg`

```bash
# Assure dossier existe
mkdir -p public/images

# Download generic placeholder image (400x400px)
# Ou créer une simple avec ImageMagick si vous l'avez
# Option 1 : Télécharger une image via curl
curl -o public/images/placeholder.jpg \
  https://via.placeholder.com/400?text=Product+Image

# Ou creer une locale (si you have imagemagick)
convert -size 400x400 xc:lightgray -pointsize 20 \
  -gravity center -annotate +0+0 "Product Image" \
  public/images/placeholder.jpg

# Vérifier fichier existe
ls -lh public/images/placeholder.jpg
```

### Step 0.6: Fix non-null asserts en API

**Créer fonction helper** :

```bash
# Créer fichier de helper
cat > src/lib/supabase-admin.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase admin credentials. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }

  return createClient(url, key)
}
EOF
```

**Ensuite remplacer dans ces fichiers** (utiliser FIXES_RAPIDES.md Fix 1.3) :
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/contacts/route.ts`
- `src/app/api/admin/services/route.ts`
- `src/app/api/admin/quote-form-configs/route.ts`
- `src/app/api/admin/hero-slides/route.ts`
- `src/app/api/contacts/route.ts`

### Step 0.7: Créer `/api/admin/colors` endpoint

```bash
# Copier template depuis FIXES_RAPIDES.md Fix 2.2
cat > src/app/api/admin/colors/route.ts << 'EOF'
[See FIXES_RAPIDES.md - Fix 2.2 for full code]
EOF
```

### Step 0.8: Setup Middleware d'auth

```bash
# Créer middleware (voir FIXES_RAPIDES.md Fix 4.2)
cat > src/middleware.ts << 'EOF'
[See FIXES_RAPIDES.md - Fix 4.2 for full code]
EOF
```

### Step 0.9: Commit PHASE 0

```bash
git add -A
git commit -m "fix: PHASE 0 - blockers

- Add .env.local setup
- Add placeholder image
- Fix Supabase admin credentials
- Add /api/admin/colors endpoint
- Add middleware auth"

git push
```

---

## 🔨 PHASE 1: CORE FEATURES (Day 3-5)

### Step 1.1: Fix types en `src/lib/types/index.ts`

```bash
# Backup l'original
cp src/lib/types/index.ts src/lib/types/index.ts.backup

# Utiliser VS Code ou vim pour éditer (voir FIXES_RAPIDES.md Fix 3.1-3.3)
# CHANGES:
# - Fix ContentBlock interface (supprimer camelCase duplicates)
# - Fix Service interface (utiliser snake_case)
# - Supprimer ProductDetail interface
```

### Step 1.2: Ajouter product_colors display

```bash
# Mettre à jour les fichiers de fiche produit
# (voir FIXES_RAPIDES.md Fix 5.1)

# Tester:
npm run dev
# Visiter http://localhost:3000/horlogerie/products/[id]
```

### Step 1.3: Installer parser HTML

```bash
npm install html-react-parser
npm install --save-dev @types/html-react-parser
```

### Step 1.4: Intégrer Resend pour emails

```bash
npm install resend
```

Setup .env:
```bash
echo "RESEND_API_KEY=re_xxxxxxxxxxxxx" >> .env.local
```

Obtenir key: https://resend.com/api-keys

### Step 1.5: Commit PHASE 1

```bash
git add -A
git commit -m "feat: PHASE 1 - core features

- Fix type inconsistencies (snake_case standardization)
- Display product_colors on detail pages
- Add HTML parsing for long_description
- Integrate Resend for email sending
- Add error boundaries to admin"

git push
```

---

## 📊 PHASE 2-3: Data & Performance (Day 6-10)

### Step 2.1: Add TypeScript strict mode

```bash
# Éditer tsconfig.json
# Changer "strict": false → "strict": true

# Run type check
npm run type-check  # Or run tsc
```

### Step 2.2: Add input validation (zod)

```bash
npm install zod
npm install -D @hookform/resolvers

# Créer schema validation files
mkdir -p src/lib/validation
```

### Step 2.3: Optimize images

```bash
# next/image déjà available dans Next.js
# Juste remplacer <img> par <Image> (voir FIXES_RAPIDES.md)
```

### Step 2.4: Add search/filter

```bash
# Créer component FilteredProducts (voir FIXES_RAPIDES.md Fix 6.3)
cat > src/components/common/FilteredProducts.tsx << 'EOF'
[See FIXES_RAPIDES.md - Fix 6.3 for full code]
EOF
```

### Step 2.5: Commit PHASE 2-3

```bash
git add -A
git commit -m "perf: PHASE 2-3 - optimization

- Add TypeScript strict mode
- Add input validation schemas (zod)
- Optimize images with next/image
- Add search and filter UI
- Add SEO metadata
- Generate sitemap"

git push
```

---

## 🧹 PHASE 4: CLEANUP (Day 10-11)

### Step 4.1: Remove dead code

```bash
# Supprimer fichiers inutiles
rm src/lib/api/strapi-schema.ts

# Verify imports
grep -r "strapi-schema" src/
# Should return nothing

# Si useSupabase inutilisé
grep -r "useSupabase" src/
# Si rien, supprimer:
rm src/hooks/useSupabase.ts
```

### Step 4.2: Add tests

```bash
npm install --save-dev vitest @testing-library/react

# Créer test files minimaux pour critical features
mkdir -p src/__tests__
```

### Step 4.3: Final cleanup commit

```bash
git add -A
git commit -m "refactor: PHASE 4 - cleanup

- Remove dead code (strapi-schema.ts, unused hooks)
- Enable TypeScript strict mode
- Add basic test coverage
- Code quality improvements"

git push
```

---

## 🚦 TESTING BEFORE DEPLOY

### Full test suite

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build

# Start prod server and manual test
npm run start
```

### Manual testing checklist

```bash
# 1. Admin panel accessible
curl -H "x-admin-password: yourpass" http://localhost:3000/admin
# Should NOT redirect

# 2. Products visible
curl http://localhost:3000/api/admin/products
# Should return JSON array

# 3. Colors visible on product detail
# Visit http://localhost:3000/horlogerie/products/[some-id]
# Should show colors section

# 4. Images not 404
# F12 > Console > no 404 errors for /placeholder.jpg
```

---

## 🚀 DEPLOYMENT

### Before pushing to production

```bash
# Créer .env.production avec valeurs correctes
cat > .env.production << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anonkey-xxxxx
SUPABASE_SERVICE_ROLE_KEY=prod-service-role-xxxxx
NEXT_PUBLIC_WHATSAPP_NUMBER=+33612345678
NEXT_PUBLIC_CONTACT_EMAIL=contact@picksell.fr
NEXT_PUBLIC_VINTED_PROFILE=https://vinted.fr/member/xxxxx
NEXT_PUBLIC_APP_URL=https://picksell.fr
NODE_ENV=production
RESEND_API_KEY=re_prod_xxxxx
EOF

# Build final
npm run build

# Test build locally
npm run start

# If all OK, deploy to Vercel (or your host)
vercel deploy --prod
```

### Post-deployment smoke tests

```bash
# Test production site
curl https://picksell.fr/api/admin/products
# Should work

# Check admin accessible
curl -H "x-admin-password: xxx" https://picksell.fr/admin
# Should NOT redirect

# Monitor errors in Sentry/LogRocket for first hour
```

---

## 💾 GIT WORKFLOW RECOMMENDED

```bash
# Use branches for each phase
git checkout -b fix/phase-0-blockers
  # ... commit fixes
git push -u origin fix/phase-0-blockers
# PR → Merge → Deploy to staging

git checkout -b feat/phase-1-core
  # ... commit features
git push -u origin feat/phase-1-core
# PR → Merge → Deploy to staging

git checkout -b perf/phase-2-3-optimization
  # ...
git checkout -b refactor/phase-4-cleanup
  # ...
```

---

## ⚠️ IF SOMETHING BREAKS

```bash
# Quickly rollback last deploy
git revert HEAD
git push

# Check logs
npm run dev
# F12 > Console tab for errors

# Restore from backup types
cp src/lib/types/index.ts.backup src/lib/types/index.ts
```

---

## 📞 TROUBLESHOOTING

### Error: "Cannot find module '@supabase/supabase-js'"

```bash
npm install
```

### Error: "SUPABASE_SERVICE_ROLE_KEY not configured"

```bash
# Check .env.local has value
cat .env.local | grep SUPABASE_SERVICE_ROLE_KEY

# Restart dev server
npm run dev  # (kill previous with Ctrl+C)
```

### Error: "Next.js dev server won't start"

```bash
# Clean cache
rm -rf .next node_modules
npm install
npm run dev
```

### Images still showing 404

```bash
# Verify placeholder exists
ls -la public/images/placeholder.jpg

# Hard refresh browser
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## ✅ SUCCESS INDICATORS

- ✅ `npm run dev` starts without env var errors
- ✅ `npm run build` completes successfully
- ✅ Admin panel requires password/auth
- ✅ All product images display (no 404s)
- ✅ Product colors visible on detail page
- ✅ Email sending works (test with Resend logs)
- ✅ Types compile without errors

---

**Total time: 3-4 days with 2-3 developers**

Next: Follow this sequence PHASE 0 → PHASE 1 → PHASE 2-3 → PHASE 4 → DEPLOY

